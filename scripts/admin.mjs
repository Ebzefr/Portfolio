/* Shared Admin SDK setup for the guestbook scripts.
   Real project: sign in once with `gcloud auth application-default login`
   (or set GOOGLE_APPLICATION_CREDENTIALS to a service-account key kept OUT of the repo).
   Emulator: set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080. */
import { readFileSync } from "node:fs";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function projectId() {
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  try {
    return JSON.parse(readFileSync(new URL("../.firebaserc", import.meta.url))).projects.default;
  } catch {
    throw new Error("Set GCLOUD_PROJECT or create .firebaserc (firebase use --add).");
  }
}

const emulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
initializeApp(emulator ? { projectId: projectId() } : { projectId: projectId(), credential: applicationDefault() });

export const db = getFirestore();
export const notes = db.collection("brickNotes");
console.log(`→ ${emulator ? "emulator" : "LIVE"} project ${projectId()}`);
