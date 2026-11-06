/* Shared types for the "Leave your brick" guestbook. */

export const BRICK_COLORS = ["red", "yellow", "blue", "green", "orange", "purple", "cream"] as const;
export const BRICK_SHAPES = ["square", "rect2x4", "long1x6", "l", "t", "zigzag", "plate"] as const;

export type BrickColor = (typeof BRICK_COLORS)[number];
export type BrickShape = (typeof BRICK_SHAPES)[number];
export type BrickStatus = "pending" | "approved" | "rejected";

/** A brick as the browser uses it (createdAt as epoch ms). */
export type BrickNote = {
  id: string;
  name: string;
  message: string;
  color: BrickColor;
  shape: BrickShape;
  createdAt: number;
  isSeed: boolean;
  status: BrickStatus;
};

/* Same limits as functions/validate.js; the server is the source of truth. */
export const NAME_MAX = 20;
export const MESSAGE_MAX = 120;

export const isColor = (v: unknown): v is BrickColor => BRICK_COLORS.includes(v as BrickColor);
export const isShape = (v: unknown): v is BrickShape => BRICK_SHAPES.includes(v as BrickShape);
