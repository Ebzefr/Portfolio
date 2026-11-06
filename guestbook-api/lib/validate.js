/* Input rules for guestbook bricks. Kept free of Firebase imports so it is easy to test. */

export const COLORS = ["red", "yellow", "blue", "green", "orange", "purple", "cream"];
export const SHAPES = ["square", "rect2x4", "long1x6", "l", "t", "zigzag", "plate"];
export const NAME_MAX = 20;
export const MESSAGE_MAX = 120;
export const MESSAGE_MIN = 2;

// control characters, zero-width and bidi-override characters
const INVISIBLE = /[\u0000-\u001F\u007F-\u009F​-‏‪-‮⁠-⁯﻿]/g;
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|xyz|ru|cn|info|biz|co|dev|app|link|ly|me|top|site|online|shop)\b)/i;
const REPEATED = /(.)\1{9,}/u;
// Small list: anything matching is still saved, but flagged for the moderator.
const FLAG_WORDS = /\b(fuck|shit|bitch|cunt|nigg|fag|retard|porn|casino|crypto|viagra|loan|bitcoin)/i;

export const clean = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE, " ")
    .replace(/\s+/g, " ")
    .trim();

const length = (s) => Array.from(s).length; // count emoji as one character

/**
 * Returns { ok, errors, value, flagged }.
 * `errors` maps a field name to a short message the form can show.
 */
export function validateSubmission(body) {
  const errors = {};
  const name = clean(body?.name);
  const message = clean(body?.message);
  const color = body?.color;
  const shape = body?.shape;

  if (!name) errors.name = "Add your name.";
  else if (length(name) > NAME_MAX) errors.name = `Keep your name under ${NAME_MAX + 1} characters.`;
  else if (LINK.test(name)) errors.name = "Links aren't allowed.";

  if (length(message) < MESSAGE_MIN) errors.message = "Write a short message.";
  else if (length(message) > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX + 1} characters.`;
  else if (LINK.test(message)) errors.message = "Links aren't allowed.";
  else if (REPEATED.test(message)) errors.message = "That looks like spam.";

  if (!COLORS.includes(color)) errors.color = "Pick a colour.";
  if (!SHAPES.includes(shape)) errors.shape = "Pick a shape.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, message, color, shape },
    flagged: FLAG_WORDS.test(`${name} ${message}`),
  };
}

/** Same name + message (ignoring case and spacing) always maps to the same id. */
export function dedupeKey(name, message) {
  return `${name}|${message}`.toLowerCase().replace(/\s+/g, " ").trim();
}
