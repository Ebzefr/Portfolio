/* Browser-side guestbook data. Firebase is loaded on demand (only when the
   guestbook scrolls near the screen) so it never slows down the rest of the site.
   The web config below is public by design; Firestore rules decide what it can do. */

import type { Firestore, QueryDocumentSnapshot } from "firebase/firestore";
import { isColor, isShape, type BrickNote } from "./types";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const EMULATOR = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR; // "127.0.0.1:8080" in development
const SUBMIT_URL = process.env.NEXT_PUBLIC_BRICK_SUBMIT_URL;

export const guestbookConfigured = Boolean(config.projectId && SUBMIT_URL && (config.apiKey || EMULATOR));

let dbPromise: Promise<{ db: Firestore; fs: typeof import("firebase/firestore") }> | null = null;

function load() {
  dbPromise ??= (async () => {
    const [{ initializeApp, getApps }, fs] = await Promise.all([import("firebase/app"), import("firebase/firestore")]);
    const app = getApps()[0] ?? initializeApp({ ...config, apiKey: config.apiKey || "emulator" });
    const db = fs.getFirestore(app);
    if (EMULATOR) {
      const [host, port] = EMULATOR.split(":");
      try {
        fs.connectFirestoreEmulator(db, host, Number(port));
      } catch {
        /* already connected (hot reload) */
      }
    }
    return { db, fs };
  })();
  return dbPromise;
}

function toNote(d: QueryDocumentSnapshot): BrickNote | null {
  const v = d.data();
  if (!isColor(v.color) || !isShape(v.shape) || typeof v.name !== "string" || typeof v.message !== "string") return null;
  return {
    id: d.id,
    name: v.name,
    message: v.message,
    color: v.color,
    shape: v.shape,
    createdAt: v.createdAt?.toMillis?.() ?? 0,
    isSeed: Boolean(v.isSeed),
    status: "approved",
  };
}

/** Live list of the most recent approved bricks. Returns an unsubscribe function. */
export function watchBricks(
  max: number,
  onData: (notes: BrickNote[]) => void,
  onError: (err: Error) => void,
): () => void {
  let stop = () => {};
  let cancelled = false;
  load()
    .then(({ db, fs }) => {
      if (cancelled) return;
      const q = fs.query(
        fs.collection(db, "brickNotes"),
        fs.where("status", "==", "approved"),
        fs.orderBy("createdAt", "desc"),
        fs.limit(max),
      );
      stop = fs.onSnapshot(
        q,
        (snap) => onData(snap.docs.map(toNote).filter((n): n is BrickNote => n !== null)),
        onError,
      );
    })
    .catch(onError);
  return () => {
    cancelled = true;
    stop();
  };
}

/** Number of approved bricks, counted by Firestore (not by downloading them). */
export async function countBricks(): Promise<number> {
  const { db, fs } = await load();
  const snap = await fs.getCountFromServer(
    fs.query(fs.collection(db, "brickNotes"), fs.where("status", "==", "approved")),
  );
  return snap.data().count;
}

/** One page of approved bricks, newest first, for the "all messages" list. */
export async function fetchBrickPage(pageSize: number, after?: BrickNote) {
  const { db, fs } = await load();
  const parts = [fs.where("status", "==", "approved"), fs.orderBy("createdAt", "desc")] as const;
  const q = after
    ? fs.query(fs.collection(db, "brickNotes"), ...parts, fs.startAfter(fs.Timestamp.fromMillis(after.createdAt)), fs.limit(pageSize))
    : fs.query(fs.collection(db, "brickNotes"), ...parts, fs.limit(pageSize));
  const snap = await fs.getDocs(q);
  const notes = snap.docs.map(toNote).filter((n): n is BrickNote => n !== null);
  return { notes, done: notes.length < pageSize };
}

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; message: string; errors?: Partial<Record<"name" | "message" | "color" | "shape", string>> };

export async function submitBrick(payload: {
  name: string;
  message: string;
  color: string;
  shape: string;
  website: string;
  elapsedMs: number;
}): Promise<SubmitResult> {
  if (!SUBMIT_URL) return { ok: false, message: "The guestbook isn't connected yet." };
  try {
    const res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, id: String(data.id) };
    return { ok: false, message: data.error || "Something went wrong. Please try again.", errors: data.errors };
  } catch {
    return { ok: false, message: "Couldn't reach the guestbook. Check your connection and try again." };
  }
}
