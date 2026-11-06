import assert from "node:assert/strict";
import { test } from "node:test";
import { dedupeKey, validateSubmission } from "./validate.js";

const good = { name: "Amina", message: "Love it!", color: "red", shape: "t" };

test("accepts a normal brick", () => {
  const r = validateSubmission(good);
  assert.equal(r.ok, true);
  assert.equal(r.flagged, false);
});

test("trims and collapses whitespace, strips zero-width characters", () => {
  const r = validateSubmission({ ...good, name: "  Ami​na  ", message: "hi   there\n\nfriend" });
  assert.equal(r.value.name, "Ami na");
  assert.equal(r.value.message, "hi there friend");
});

test("enforces lengths, counting emoji as one character", () => {
  assert.equal(validateSubmission({ ...good, name: "x".repeat(21) }).errors.name !== undefined, true);
  assert.equal(validateSubmission({ ...good, message: "😭🧱".repeat(60) }).ok, true);
  assert.equal(validateSubmission({ ...good, message: "a".repeat(121) }).ok, false);
  assert.equal(validateSubmission({ ...good, message: "a" }).ok, false);
});

test("rejects links, spam and unknown colours/shapes", () => {
  assert.equal(validateSubmission({ ...good, message: "visit www.spam.com" }).ok, false);
  assert.equal(validateSubmission({ ...good, message: "cheap stuff at spam.xyz" }).ok, false);
  assert.equal(validateSubmission({ ...good, message: "aaaaaaaaaaaaaaa" }).ok, false);
  assert.equal(validateSubmission({ ...good, color: "pink" }).ok, false);
  assert.equal(validateSubmission({ ...good, shape: "circle" }).ok, false);
});

test("flags rude words but still accepts them for moderation", () => {
  const r = validateSubmission({ ...good, message: "buy bitcoin now" });
  assert.equal(r.ok, true);
  assert.equal(r.flagged, true);
});

test("dedupe ignores case and spacing", () => {
  assert.equal(dedupeKey("Amina", "Love  it"), dedupeKey("amina", "love it"));
});
