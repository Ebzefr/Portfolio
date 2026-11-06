/* Admin access to Firestore for the submit endpoint.
   Production: FIREBASE_SERVICE_ACCOUNT holds the key of a service account that can only
   use Firestore (base64 of the JSON key, set in Vercel's environment variables).
   Local: FIRESTORE_EMULATOR_HOST points at the emulator and no key is needed. */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function init() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID || "ebze-guestbook";
  if (process.env.FIRESTORE_EMULATOR_HOST) return initializeApp({ projectId });
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
  const key = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
  return initializeApp({ credential: cert(key), projectId: key.project_id });
}

let db;
/** Connect on first use, so a missing key gives a clean error instead of a crash at startup. */
export function getDb() {
  db ??= getFirestore(init());
  return db;
}
