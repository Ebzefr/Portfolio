/* The physics side of the brick pit (Matter.js).
   The world has a fixed size in scene units and is scaled to fit the screen, so the
   same list of bricks always settles into the same arrangement, whatever the
   window width. Rendering happens elsewhere (BrickPit reads body positions). */

import Matter from "matter-js";
import { CELL, DEPTH, PAD_TOP, geometry, hashString, seeded } from "./shapes";
import type { BrickNote } from "./types";

const { Bodies, Body, Composite, Engine, Events, Sleeping } = Matter;

export { LAYOUTS, type SceneSize } from "./layouts";
import type { SceneSize } from "./layouts";

const STEP_MS = 1000 / 60;
const WALL = 200;

export type PlacedBrick = {
  note: BrickNote;
  body: Matter.Body;
  /** centre of mass measured from the front face's top-left corner */
  cx: number;
  cy: number;
};

export class BrickScene {
  readonly engine: Matter.Engine;
  readonly bricks = new Map<string, PlacedBrick>();
  private byBody = new Map<number, string>();
  onLand?: (id: string, speed: number) => void;

  constructor(readonly size: SceneSize) {
    this.engine = Engine.create({ enableSleeping: true, positionIterations: 8, velocityIterations: 6 });
    this.engine.gravity.y = 1;

    const { w, h } = size;
    const wallOpts = { isStatic: true, friction: 0.9, label: "wall" };
    Composite.add(this.engine.world, [
      Bodies.rectangle(w / 2, h + WALL / 2, w + WALL * 2, WALL, wallOpts), // floor
      Bodies.rectangle(-WALL / 2, h / 2 - h, WALL, h * 4, wallOpts), // left
      Bodies.rectangle(w - DEPTH + WALL / 2, h / 2 - h, WALL, h * 4, wallOpts), // right (leave room for the 3D side)
    ]);

    Events.on(this.engine, "collisionStart", (e) => {
      if (!this.onLand) return;
      for (const pair of e.pairs) {
        for (const part of [pair.bodyA, pair.bodyB]) {
          const id = this.byBody.get(part.parent.id);
          if (!id) continue;
          const speed = part.parent.speed;
          if (speed > 2.2) this.onLand(id, speed);
        }
      }
    });
  }

  /** Where a brick starts: x and tilt come from its id, so they never change between loads. */
  private spawnPose(note: BrickNote) {
    const g = geometry(note.shape);
    const rand = seeded(hashString(note.id));
    const margin = 6;
    const span = Math.max(0, this.size.w - DEPTH - g.w - margin * 2);
    return {
      x: margin + rand() * span, // left edge of the front face
      angle: (rand() - 0.5) * 0.7, // about ±20°
      spin: (rand() - 0.5) * 0.06,
    };
  }

  add(note: BrickNote, y: number, opts: { spin?: boolean } = {}): PlacedBrick {
    const g = geometry(note.shape);
    const pose = this.spawnPose(note);
    const ox = pose.x;
    const oy = y;
    const parts = g.parts.map((p) =>
      Bodies.rectangle(ox + p.x + p.w / 2, oy + p.y + p.h / 2, p.w, p.h, { chamfer: { radius: 1.5 } }),
    );
    const body = Body.create({
      parts,
      friction: 0.85,
      frictionStatic: 1.1,
      frictionAir: 0.012,
      restitution: 0.14,
      density: 0.0022,
      slop: 0.03,
      label: note.id,
    });
    const placed: PlacedBrick = { note, body, cx: body.position.x - ox, cy: body.position.y - oy };
    Body.setAngle(body, pose.angle);
    if (opts.spin) Body.setAngularVelocity(body, pose.spin);
    Composite.add(this.engine.world, body);
    this.bricks.set(note.id, placed);
    this.byBody.set(body.id, note.id);
    return placed;
  }

  remove(id: string) {
    const b = this.bricks.get(id);
    if (!b) return;
    Composite.remove(this.engine.world, b.body);
    this.bricks.delete(id);
    this.byBody.delete(b.body.id);
    for (const other of this.bricks.values()) Sleeping.set(other.body, false);
  }

  /** A brick body higher than this would have its studs cut off by the top of the pit. */
  readonly ceiling = PAD_TOP + 4;

  /**
   * Build the pile for bricks that were already saved, without showing the fall.
   * Newest bricks drop first, so when the pit can't hold them all it's the oldest that
   * miss out (they're still in the "all messages" list). Anything left poking above the
   * top after settling is removed; those bricks sit on top, so nothing else moves.
   * Returns the ids that made it into the pit.
   */
  presettle(notes: BrickNote[]): string[] {
    const ordered = [...notes].sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
    const spawnY = -CELL * 4;
    for (const note of ordered) {
      if (this.pileTop() < this.ceiling - CELL * 2) break; // clearly full
      const placed = this.add(note, spawnY);
      // wait until it has dropped clear of the spawn point before the next one appears
      for (let i = 0; i < 60 && placed.body.bounds.min.y < spawnY + CELL * 4.5; i++) {
        this.step();
        if (placed.body.isSleeping) break;
      }
    }
    this.settle(900);
    for (let pass = 0; pass < 3; pass++) {
      const over = [...this.bricks.values()].filter((b) => b.body.bounds.min.y < this.ceiling);
      if (!over.length) break;
      for (const b of over) this.remove(b.note.id);
      this.settle(400);
    }
    return [...this.bricks.keys()];
  }

  /**
   * Before a live drop into a full pit: lift off the highest bricks (oldest first when tied)
   * until there's enough headroom. Returns the ids removed.
   */
  makeRoom(headroom: number, keep: Set<string>): string[] {
    const removed: string[] = [];
    while (this.pileTop() < this.ceiling + headroom) {
      const top = [...this.bricks.values()]
        .filter((b) => !keep.has(b.note.id))
        .sort((a, b) => a.body.bounds.min.y - b.body.bounds.min.y || a.note.createdAt - b.note.createdAt)[0];
      if (!top) break;
      this.remove(top.note.id);
      removed.push(top.note.id);
    }
    return removed;
  }

  /** Step until everything is asleep (or a step limit is hit), then put it all to sleep. */
  settle(maxSteps: number) {
    for (let i = 0; i < maxSteps && !this.isResting(); i++) this.step();
    for (const b of this.bricks.values()) Sleeping.set(b.body, true);
  }

  run(steps: number) {
    for (let i = 0; i < steps; i++) this.step();
  }

  step() {
    Engine.update(this.engine, STEP_MS);
  }

  isResting() {
    for (const b of this.bricks.values()) if (!b.body.isSleeping) return false;
    return true;
  }

  /** Highest point of the pile (smallest y), used to pick a drop height. */
  pileTop() {
    let top = this.size.h;
    for (const b of this.bricks.values()) top = Math.min(top, b.body.bounds.min.y);
    return top;
  }

  destroy() {
    Events.off(this.engine, "collisionStart", undefined as never);
    Composite.clear(this.engine.world, false);
    Engine.clear(this.engine);
    this.bricks.clear();
    this.byBody.clear();
  }
}
