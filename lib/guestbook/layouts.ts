/* Scene sizes in scene units (kept apart from scene.ts so importing them doesn't pull in Matter.js). */
export type SceneSize = { w: number; h: number; maxBricks: number };

export const LAYOUTS = {
  wide: { w: 1000, h: 430, maxBricks: 36 },
  narrow: { w: 520, h: 520, maxBricks: 22 },
} satisfies Record<string, SceneSize>;
