"use client";

import Matter from "matter-js";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { BrickScene, LAYOUTS, type SceneSize } from "@/lib/guestbook/scene";
import { PAD_TOP, geometry } from "@/lib/guestbook/shapes";
import type { BrickNote } from "@/lib/guestbook/types";
import { BrickSvg } from "./BrickSvg";

/* The construction pit: lays out saved bricks instantly, drops new ones with physics,
   and shows who left each brick on hover, tap or keyboard focus. */

type Props = {
  notes: BrickNote[]; // newest first
  pendingIds: Set<string>; // the visitor's own bricks that are waiting for approval
  reducedMotion: boolean;
  onLand?: (speed: number) => void;
  onLayout?: (max: number) => void;
};

const MAX_RUN_MS = 9000;
const STEP_MS = 1000 / 60;

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function BrickPit({ notes, pendingIds, reducedMotion, onLand, onLayout }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLButtonElement>());
  const sceneRef = useRef<BrickScene | null>(null);
  const visible = useRef(false);
  const running = useRef(false);
  const deadline = useRef(0);
  const dropping = useRef(new Set<string>());
  const onLandRef = useRef(onLand);
  onLandRef.current = onLand;

  const [width, setWidth] = useState(0);
  const [placed, setPlaced] = useState<BrickNote[]>([]);
  const [active, setActive] = useState<{ id: string; pinned: boolean } | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const size: SceneSize = width && width < 640 ? LAYOUTS.narrow : LAYOUTS.wide;
  const scale = width ? width / size.w : 0;

  useEffect(() => onLayout?.(size.maxBricks), [size.maxBricks, onLayout]);

  // the bricks that fit in the pit: the newest ones
  const shown = useMemo(() => notes.slice(0, size.maxBricks), [notes, size.maxBricks]);

  /* ---------- size + visibility ---------- */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  /* ---------- drawing ---------- */
  const paint = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (const [id, b] of scene.bricks) {
      const el = els.current.get(id);
      if (!el) continue;
      const { x, y } = b.body.position;
      el.style.transform = `translate3d(${x - b.cx}px, ${y - b.cy - PAD_TOP}px, 0) rotate(${b.body.angle}rad)`;
    }
  }, []);

  const loop = useCallback(() => {
    let last = performance.now();
    let acc = 0;
    const frame = (now: number) => {
      const scene = sceneRef.current;
      if (!scene || !visible.current) {
        running.current = false;
        return;
      }
      acc = Math.min(acc + (now - last), STEP_MS * 4);
      last = now;
      while (acc >= STEP_MS) {
        scene.step();
        acc -= STEP_MS;
      }
      paint();
      if (scene.isResting() || now > deadline.current) {
        for (const b of scene.bricks.values()) Matter.Sleeping.set(b.body, true);
        dropping.current.clear();
        running.current = false;
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [paint]);

  const start = useCallback(() => {
    deadline.current = performance.now() + MAX_RUN_MS;
    if (running.current || !visible.current) return;
    running.current = true;
    loop();
  }, [loop]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      // resume a drop that was paused while the pit was off screen
      if (e.isIntersecting && sceneRef.current && !sceneRef.current.isResting()) start();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [start]);

  /* ---------- build the pile, then drop anything new ---------- */
  useEffect(() => {
    if (!width) return;
    let scene = sceneRef.current;

    // first load or the layout changed: settle everything instantly, no falling
    if (!scene || scene.size !== size) {
      scene?.destroy();
      scene = new BrickScene(size);
      scene.onLand = (id, speed) => {
        if (!dropping.current.has(id)) return;
        dropping.current.delete(id);
        const el = els.current.get(id);
        const inner = el?.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.classList.remove("is-landing");
          void inner.offsetWidth; // restart the animation
          inner.classList.add("is-landing");
        }
        onLandRef.current?.(speed);
      };
      scene.presettle(shown);
      sceneRef.current = scene;
      setPlaced([...shown].reverse()); // oldest first, matching keyboard order
      return;
    }

    const fresh = shown.filter((n) => !scene!.bricks.has(n.id)).reverse(); // oldest first
    if (!fresh.length) return;
    const timers = fresh.map((note, i) =>
      window.setTimeout(() => {
        const s = sceneRef.current;
        if (!s || s.bricks.has(note.id)) return;
        const g = geometry(note.shape);
        if (reducedMotion) {
          // no fall: place it on the pile straight away
          s.add(note, Math.min(-g.h - PAD_TOP, s.pileTop() - g.h - 20));
          s.settle(600);
        } else {
          s.add(note, -g.h - PAD_TOP - 40, { spin: true });
          dropping.current.add(note.id);
        }
        setPlaced((p) => [...p, note]);
        start();
      }, i * 450),
    );
    return () => timers.forEach(clearTimeout);
  }, [shown, size, width, reducedMotion, start]);

  useEffect(() => () => sceneRef.current?.destroy(), []);

  // position new elements as soon as React has created them
  useLayoutEffect(paint, [placed, scale, paint]);

  /* ---------- popover ---------- */
  useEffect(() => {
    if (!active?.pinned) return;
    const close = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [active?.pinned]);

  const activeNote = active ? placed.find((n) => n.id === active.id) : undefined;
  const popover = useMemo(() => {
    const b = activeNote && sceneRef.current?.bricks.get(activeNote.id);
    if (!b || !scale) return null;
    const { min, max } = b.body.bounds;
    const x = ((min.x + max.x) / 2) * scale;
    const top = Math.max(min.y, 0) * scale;
    const above = top > 120;
    return { x, y: above ? top - 12 : Math.min(max.y, size.h) * scale + 10, above };
    // re-measure when the brick moves into place
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNote, scale, size.h, placed]);

  /* ---------- keyboard: one tab stop, arrows move between bricks ---------- */
  const ordered = placed; // oldest first, same order as they were placed
  const tabId = focusId && ordered.some((n) => n.id === focusId) ? focusId : ordered[ordered.length - 1]?.id;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(index + 1, ordered.length - 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(index - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ordered.length - 1;
    else if (e.key === "Escape") {
      setActive(null);
      return;
    }
    if (next < 0) return;
    e.preventDefault();
    const id = ordered[next].id;
    setFocusId(id);
    els.current.get(id)?.focus();
  };

  return (
    <div className="gb-pit" ref={wrapRef} style={scale ? { height: size.h * scale, aspectRatio: "auto" } : undefined}>
      <div
        className="gb-stage"
        role="group"
        aria-label="Bricks left by visitors. Use the arrow keys to move between them."
        style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}
      >
        {placed.map((note, i) => {
          const g = geometry(note.shape);
          const b = sceneRef.current?.bricks.get(note.id);
          return (
            <button
              key={note.id}
              type="button"
              className={`gb-brick${active?.id === note.id ? " is-active" : ""}`}
              ref={(el) => {
                if (el) els.current.set(note.id, el);
                else els.current.delete(note.id);
              }}
              tabIndex={note.id === tabId ? 0 : -1}
              aria-label={`Brick from ${note.name}: ${note.message}${pendingIds.has(note.id) ? " (waiting for approval)" : ""}`}
              style={{ transformOrigin: b ? `${b.cx}px ${b.cy + PAD_TOP}px` : undefined } as CSSProperties}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse" && !active?.pinned) setActive({ id: note.id, pinned: false });
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setActive((a) => (a?.id === note.id && !a.pinned ? null : a));
              }}
              onClick={() =>
                setActive((a) => (a?.id === note.id && a.pinned ? null : { id: note.id, pinned: true }))
              }
              onFocus={() => {
                setFocusId(note.id);
                setActive((a) => (a?.id === note.id ? a : { id: note.id, pinned: false }));
              }}
              onBlur={() => setActive((a) => (a?.id === note.id && !a.pinned ? null : a))}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="gb-brick-inner" style={{ transformOrigin: `50% ${g.h + PAD_TOP}px` }}>
                <BrickSvg shape={note.shape} color={note.color} name={note.name} />
              </span>
            </button>
          );
        })}
      </div>

      {activeNote && popover && (
        <div
          className={`gb-pop${popover.above ? " gb-pop--above" : ""}`}
          style={{ "--x": `${popover.x}px`, "--y": `${popover.y}px`, "--pit-w": `${width}px` } as CSSProperties}
          aria-hidden="true"
        >
          <span className={`gb-pop-dot gb-dot--${activeNote.color}`} aria-hidden="true" />
          <strong className="gb-pop-name">{activeNote.name}</strong>
          <p className="gb-pop-msg">{activeNote.message}</p>
          {pendingIds.has(activeNote.id) ? (
            <span className="gb-pop-meta">Waiting for approval. Only you can see it for now.</span>
          ) : (
            !activeNote.isSeed && activeNote.createdAt > 0 && (
              <span className="gb-pop-meta">{formatDate(activeNote.createdAt)}</span>
            )
          )}
        </div>
      )}
    </div>
  );
}
