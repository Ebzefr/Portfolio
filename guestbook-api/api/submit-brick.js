/*
 * POST /api/submit-brick: the only way to add a brick to the guestbook.
 * Browsers can't write to Firestore directly (see firestore.rules); they POST here instead.
 * Every brick is saved as "pending" and appears on the site once it's approved
 * with scripts/moderate.mjs.
 */
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "../lib/db.js";
import { dedupeKey, validateSubmission } from "../lib/validate.js";

const ALLOWED_ORIGINS = new Set([
  "https://ebze.dev",
  "https://www.ebze.dev",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const MIN_FILL_MS = 2500; // humans take longer than this to fill the form
const LIMITS = [
  { windowMs: 10 * 60 * 1000, max: 3 }, // 3 bricks per 10 minutes
  { windowMs: 24 * 60 * 60 * 1000, max: 10 }, // 10 bricks per day
];

const sha = (s) => createHash("sha256").update(s).digest("hex");

class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function clientIp(req) {
  const real = String(req.headers["x-real-ip"] || "").trim();
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return real || forwarded || req.socket?.remoteAddress || "unknown";
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 4096) throw new HttpError(413, "Too much data.");
  }
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  const send = (status, data) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(data));
  };

  if (req.method === "OPTIONS") {
    res.statusCode = origin && ALLOWED_ORIGINS.has(origin) ? 204 : 403;
    res.end();
    return;
  }

  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST.");
    if (origin && !ALLOWED_ORIGINS.has(origin)) throw new HttpError(403, "Not allowed.");

    let body;
    try {
      body = await readBody(req);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(400, "Invalid request.");
    }

    // Spam traps: a hidden field bots fill in, and a minimum time on the form.
    // Bots get a fake success so they don't learn what tripped them.
    if (body.website || Number(body.elapsedMs) < MIN_FILL_MS) {
      send(201, { id: "ok", status: "pending" });
      return;
    }

    const check = validateSubmission(body);
    if (!check.ok) throw new HttpError(400, "Please check the form.", check.errors);
    const { name, message, color, shape } = check.value;

    const db = getDb();
    const id = `v-${sha(dedupeKey(name, message)).slice(0, 24)}`;
    const noteRef = db.collection("brickNotes").doc(id);
    const salt = process.env.RATE_SALT || "ebze-guestbook";
    const limitRef = db.collection("brickRateLimits").doc(sha(`${salt}:${clientIp(req)}`));

    await db.runTransaction(async (tx) => {
      const [limitSnap, noteSnap] = await Promise.all([tx.get(limitRef), tx.get(noteRef)]);
      const now = Date.now();
      const longest = Math.max(...LIMITS.map((l) => l.windowMs));
      const hits = (limitSnap.get("hits") || []).filter((t) => now - t < longest);

      for (const { windowMs, max } of LIMITS) {
        if (hits.filter((t) => now - t < windowMs).length >= max) {
          throw new HttpError(429, "You've left a few bricks already. Try again later.");
        }
      }
      if (noteSnap.exists) throw new HttpError(409, "This brick is already in the build.");

      tx.set(limitRef, { hits: [...hits, now], updatedAt: FieldValue.serverTimestamp() });
      tx.create(noteRef, {
        id,
        name,
        message,
        color,
        shape,
        createdAt: FieldValue.serverTimestamp(),
        isSeed: false,
        status: "pending",
        flagged: check.flagged,
      });
    });

    send(201, { id, status: "pending" });
  } catch (err) {
    if (err instanceof HttpError) send(err.status, { error: err.message, errors: err.errors });
    else {
      console.error("submit-brick failed", err);
      send(500, { error: "Something went wrong. Please try again." });
    }
  }
}
