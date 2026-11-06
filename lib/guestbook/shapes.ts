/* Brick shapes and colours.
   Shapes are drawn on a grid of square cells (like falling-block game pieces).
   Everything else is derived from the cell list: the outline, the studs on top,
   and the rectangles used for collision in Matter.js. */

import type { BrickColor, BrickShape } from "./types";

/** Size of one grid cell in scene units (the scene is scaled to fit the screen). */
export const CELL = 34;
/** How far the fake 3D "depth" pushes up and right. */
export const DEPTH = 8;
export const STUD_W = 17;
export const STUD_H = 6;
/** Room above the front face for the depth and the studs. */
export const PAD_TOP = DEPTH + STUD_H;

type Cell = [col: number, row: number];

type ShapeDef = {
  label: string;
  cells: Cell[];
  /** Row height in cells (plates are thinner than bricks). */
  rowH?: number;
};

export const SHAPES: Record<BrickShape, ShapeDef> = {
  square: { label: "2×2 square", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  rect2x4: { label: "2×4 brick", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]] },
  long1x6: { label: "1×6 long", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]] },
  l: { label: "L-shape", cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  t: { label: "T-shape", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  zigzag: { label: "Zigzag", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  plate: { label: "Flat plate", cells: [[0, 0], [1, 0], [2, 0], [3, 0]], rowH: 0.4 },
};

export const COLORS: Record<BrickColor, { label: string; face: string; light: string; side: string; top: string; edge: string; text: string }> = {
  red:    { label: "Red",    face: "#e3000b", light: "#ff4a50", side: "#a10008", top: "#ff2a31", edge: "#6b0005", text: "#ffffff" },
  yellow: { label: "Yellow", face: "#ffc20e", light: "#ffe066", side: "#c79000", top: "#ffd23f", edge: "#8a6400", text: "#3a2a00" },
  blue:   { label: "Blue",   face: "#1e5fd8", light: "#5b90f0", side: "#13429c", top: "#3b78e6", edge: "#0b2c6b", text: "#ffffff" },
  green:  { label: "Green",  face: "#1f9d3d", light: "#4cc46a", side: "#13702a", top: "#33b553", edge: "#0b4a1b", text: "#ffffff" },
  orange: { label: "Orange", face: "#ff7a00", light: "#ffa24d", side: "#c25a00", top: "#ff8f24", edge: "#7a3800", text: "#ffffff" },
  purple: { label: "Purple", face: "#7b3fc4", light: "#a273e0", side: "#56288f", top: "#8d55d4", edge: "#351656", text: "#ffffff" },
  cream:  { label: "Cream",  face: "#f3e6c4", light: "#fffaeb", side: "#cdbd93", top: "#fbf1d6", edge: "#8a7a52", text: "#4a3d1f" },
};

export type Pt = [number, number];
export type Rect = { x: number; y: number; w: number; h: number };

export type ShapeGeometry = {
  w: number; // front face width
  h: number; // front face height
  outline: Pt[]; // front face polygon, clockwise
  parts: Rect[]; // collision rectangles
  studs: number[]; // x centre of each stud, all sit on a top edge at the y given by studY
  studY: number[];
  label: Rect | null; // widest full-height row, where the name is printed
};

const cache = new Map<BrickShape, ShapeGeometry>();

/** Geometry for a shape in scene units, with the front face's top-left at (0, 0). */
export function geometry(shape: BrickShape): ShapeGeometry {
  const hit = cache.get(shape);
  if (hit) return hit;

  const def = SHAPES[shape];
  const rh = (def.rowH ?? 1) * CELL;
  const has = (c: number, r: number) => def.cells.some(([cc, rr]) => cc === c && rr === r);
  const cols = Math.max(...def.cells.map(([c]) => c)) + 1;
  const rows = Math.max(...def.cells.map(([, r]) => r)) + 1;

  // collision: one rectangle per horizontal run of cells
  const parts: Rect[] = [];
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (!has(c, r)) { c++; continue; }
      const start = c;
      while (c < cols && has(c, r)) c++;
      parts.push({ x: start * CELL, y: r * rh, w: (c - start) * CELL, h: rh });
    }
  }

  // studs on every cell with nothing above it
  const studs: number[] = [];
  const studY: number[] = [];
  for (const [c, r] of def.cells) {
    if (!has(c, r - 1)) {
      studs.push(c * CELL + CELL / 2);
      studY.push(r * rh);
    }
  }

  const outline = traceOutline(def.cells, CELL, rh);
  const widest = [...parts].sort((a, b) => b.w - a.w || a.y - b.y)[0];
  const label = widest && widest.w >= CELL * 2 && rh >= CELL ? widest : null;

  const g: ShapeGeometry = { w: cols * CELL, h: rows * rh, outline, parts, studs, studY, label };
  cache.set(shape, g);
  return g;
}

/** Walk the boundary of a set of grid cells and return its corner points (clockwise). */
function traceOutline(cells: Cell[], cw: number, ch: number): Pt[] {
  // collect boundary edges, each directed so the shape is on its right
  const key = (x: number, y: number) => `${x},${y}`;
  const has = new Set(cells.map(([c, r]) => key(c, r)));
  const next = new Map<string, [number, number]>();
  for (const [c, r] of cells) {
    if (!has.has(key(c, r - 1))) next.set(key(c, r), [c + 1, r]); // top edge →
    if (!has.has(key(c + 1, r))) next.set(key(c + 1, r), [c + 1, r + 1]); // right edge ↓
    if (!has.has(key(c, r + 1))) next.set(key(c + 1, r + 1), [c, r + 1]); // bottom edge ←
    if (!has.has(key(c - 1, r))) next.set(key(c, r + 1), [c, r]); // left edge ↑
  }
  const [startC, startR] = cells.reduce((a, b) => (b[1] < a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a));
  const pts: Pt[] = [];
  let cur: [number, number] = [startC, startR];
  for (let guard = 0; guard < 200; guard++) {
    pts.push(cur);
    const n = next.get(key(cur[0], cur[1]));
    if (!n || (n[0] === startC && n[1] === startR)) break;
    cur = n;
  }
  // drop points in the middle of straight lines, then scale to scene units
  const corners = pts.filter((p, i) => {
    const a = pts[(i - 1 + pts.length) % pts.length];
    const b = pts[(i + 1) % pts.length];
    return (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]) !== 0;
  });
  return corners.map(([x, y]) => [x * cw, y * ch]);
}

/* ---------- deterministic randomness (same brick id → same placement every load) ---------- */

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: tiny seeded random generator returning numbers in [0, 1). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
