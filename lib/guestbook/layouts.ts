/* Scene sizes in scene units (kept apart from scene.ts so importing them doesn't pull in Matter.js).
   Brick size in scene units never changes; a shorter scene just means a shorter pit.
   maxBricks is the most the pit will try; scene.presettle drops any that would poke out the top. */
export type SceneSize = { w: number; h: number; maxBricks: number };

export const LAYOUTS = {
  wide: { w: 1000, h: 285, maxBricks: 30 }, // ≈350px tall on a desktop-width pit
  medium: { w: 760, h: 330, maxBricks: 24 }, // tablets
  narrow: { w: 520, h: 420, maxBricks: 26 }, // phones
} satisfies Record<string, SceneSize>;

/** Pick the layout for a pit of the given width in CSS pixels. */
export function layoutFor(width: number): SceneSize {
  if (width && width < 600) return LAYOUTS.narrow;
  if (width && width < 940) return LAYOUTS.medium;
  return LAYOUTS.wide;
}

/** Most bricks any layout shows, i.e. how many the page needs to load. */
export const MAX_SHOWN = Math.max(...Object.values(LAYOUTS).map((l) => l.maxBricks));
