/* Adds the 10 starter bricks. Safe to run any number of times:
   each seed has a fixed id and existing documents are left alone. */
import { readFileSync } from "node:fs";
import { Timestamp } from "firebase-admin/firestore";
import { notes } from "./admin.mjs";

const seeds = JSON.parse(readFileSync(new URL("../data/brick-seeds.json", import.meta.url)));
let added = 0;

for (const s of seeds) {
  try {
    await notes.doc(s.id).create({
      id: s.id,
      name: s.name,
      message: s.message,
      color: s.color,
      shape: s.shape,
      createdAt: Timestamp.fromDate(new Date(s.createdAt)),
      isSeed: true,
      status: "approved",
    });
    added++;
  } catch (err) {
    if (err.code !== 6) throw err; // 6 = ALREADY_EXISTS
  }
}
console.log(`Seeded ${added} new starter bricks (${seeds.length - added} already there).`);
