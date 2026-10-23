import type { CSSProperties } from "react";

/* Shared decorative pieces: loose 3D bricks, hand-drawn doodles, checkerboard.
   Styles live in styles/decor.css. */

export type BrickColor = "red" | "yellow" | "green" | "blue";

/* A 2x2 Lego brick built from CSS 3D faces */
export function LooseBrick({
  color,
  rx = -28,
  ry = 35,
  rz = 0,
  size = 1.25,
  blur = false,
}: {
  color: BrickColor;
  rx?: number;
  ry?: number;
  rz?: number;
  size?: number;
  blur?: boolean;
}) {
  return (
    <div
      className={`lb lego--${color}${blur ? " lb--blur" : ""}`}
      style={{ "--rx": `${rx}deg`, "--ry": `${ry}deg`, "--rz": `${rz}deg`, fontSize: `${size}em` } as CSSProperties}
    >
      <div className="lb-body">
        <span className="lb-face lb-front" />
        <span className="lb-face lb-back" />
        <span className="lb-face lb-left" />
        <span className="lb-face lb-right" />
        <span className="lb-face lb-top">
          {[0, 1, 2, 3].map((s) => (
            <span className="lb-stud" key={s}>
              <span style={{ "--k": 0 } as CSSProperties} />
              <span style={{ "--k": 1 } as CSSProperties} />
              <span style={{ "--k": 2 } as CSSProperties} />
              <span className="lb-cap" style={{ "--k": 3 } as CSSProperties} />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* Hand-drawn doodles. pathLength=1 lets CSS "draw" each stroke in. */
export const Doodle = {
  CurvedArrow: () => (
    <svg className="doodle" viewBox="0 0 110 100" width="1.15em" height="1.05em">
      <path pathLength={1} d="M8 6 C 4 46, 34 82, 96 80" />
      <path pathLength={1} d="M80 64 L97 80 L79 95" />
    </svg>
  ),
  Crown: () => (
    <svg className="doodle" viewBox="0 0 64 52" width="0.7em" height="0.57em">
      <path pathLength={1} d="M10 44 L5 12 L21 27 L31 5 L41 27 L58 13 L54 44 Z" />
      <path pathLength={1} d="M14 36 L50 36" />
    </svg>
  ),
  Dashes: () => (
    <svg className="doodle" viewBox="0 0 70 70" width="0.7em" height="0.7em">
      <path pathLength={1} d="M30 6 L8 48" />
      <path pathLength={1} d="M26 64 L64 42" />
    </svg>
  ),
  Cursor: () => (
    <svg className="doodle doodle--fill" viewBox="0 0 44 52" width="0.48em" height="0.57em">
      <path pathLength={1} d="M5 4 L6 40 L15 31 L22 47 L30 44 L23 28 L37 27 Z" />
    </svg>
  ),
  Asterisk: () => (
    <svg className="doodle" viewBox="0 0 60 60" width="0.62em" height="0.62em">
      <path pathLength={1} d="M30 4 L30 56" />
      <path pathLength={1} d="M7 18 L53 42" />
      <path pathLength={1} d="M7 42 L53 18" />
    </svg>
  ),
  SmallArrow: () => (
    <svg className="doodle" viewBox="0 0 50 50" width="0.5em" height="0.5em">
      <path pathLength={1} d="M42 4 C 46 24, 34 38, 10 40" />
      <path pathLength={1} d="M20 30 L9 40 L21 48" />
    </svg>
  ),
  ArrowDown: () => (
    <svg className="doodle" viewBox="0 0 40 70" width="0.4em" height="0.7em">
      <path pathLength={1} d="M24 4 C 30 24, 26 44, 14 62" />
      <path pathLength={1} d="M8 48 L13 63 L27 56" />
    </svg>
  ),
  SwoopRight: () => (
    <svg className="doodle" viewBox="0 0 110 50" width="1.1em" height="0.5em">
      <path pathLength={1} d="M4 40 C 34 46, 70 36, 100 10" />
      <path pathLength={1} d="M84 8 L101 9 L98 26" />
    </svg>
  ),
  Squiggle: () => (
    <svg className="doodle" viewBox="0 0 120 20" width="1.2em" height="0.2em">
      <path pathLength={1} d="M4 15 C 30 8, 60 6, 116 4" />
    </svg>
  ),
  Smiley: () => (
    <svg className="doodle doodle--thin" viewBox="0 0 40 40" width="1.3em" height="1.3em">
      <circle pathLength={1} cx="20" cy="20" r="16" />
      <path pathLength={1} d="M12 23 C 15 30, 25 30, 28 23" />
      <path pathLength={1} d="M14.5 15 L14.5 17.5 M25.5 15 L25.5 17.5" />
    </svg>
  ),
};

export function Checker() {
  // 4 x 3 checkerboard, a little wonky
  const cells = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      if ((r + c) % 2 === 0) cells.push(<rect key={`${r}${c}`} x={c * 12} y={r * 12} width="12.5" height="12.5" />);
  return (
    <svg className="checker" viewBox="0 0 48 36" width="0.9em" height="0.68em">
      {cells}
    </svg>
  );
}

