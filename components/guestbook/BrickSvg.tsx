import { memo } from "react";
import { COLORS, DEPTH, PAD_TOP, STUD_H, STUD_W, geometry, type Pt } from "@/lib/guestbook/shapes";
import { BRICK_COLORS, type BrickColor, type BrickShape } from "@/lib/guestbook/types";

/* A brick drawn as SVG: an extruded side and top for depth, cylindrical studs,
   a glossy front face, and (on wide bricks) the author's name pressed into it.
   Coordinates are scene units; the front face's top-left sits at (0, PAD_TOP). */

const pts = (list: Pt[], dx = 0, dy = 0) => list.map(([x, y]) => `${x + dx},${y + dy}`).join(" ");

export function brickBox(shape: BrickShape) {
  const g = geometry(shape);
  return { width: g.w + DEPTH, height: g.h + PAD_TOP };
}

type Props = { shape: BrickShape; color: BrickColor; name?: string; className?: string; title?: string };

function BrickSvgBase({ shape, color, name, className, title }: Props) {
  const g = geometry(shape);
  const c = COLORS[color];
  const { width, height } = brickBox(shape);
  const face = g.outline.map(([x, y]) => [x, y + PAD_TOP] as Pt);

  // side faces: only edges whose depth is visible (tops and right-hand sides)
  const tops: string[] = [];
  const sides: string[] = [];
  for (let i = 0; i < face.length; i++) {
    const a = face[i];
    const b = face[(i + 1) % face.length];
    const quad = pts([a, b, [b[0] + DEPTH, b[1] - DEPTH], [a[0] + DEPTH, a[1] - DEPTH]]);
    if (b[1] === a[1] && b[0] > a[0]) tops.push(quad);
    else if (b[0] === a[0] && b[1] > a[1]) sides.push(quad);
  }

  const maxChars = g.label ? Math.floor((g.label.w - 12) / 7.2) : 0;
  const label = name && g.label ? (name.length > maxChars ? `${name.slice(0, maxChars - 1)}…` : name) : "";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <g className="gb-hit" stroke={c.edge} strokeWidth={1} strokeLinejoin="round">
        {sides.map((q, i) => (
          <polygon key={`s${i}`} points={q} fill={c.side} />
        ))}
        {tops.map((q, i) => (
          <polygon key={`t${i}`} points={q} fill={c.top} />
        ))}
        {g.studs.map((sx, i) => {
          const cx = sx + DEPTH / 2;
          const base = g.studY[i] + PAD_TOP - DEPTH / 2;
          const top = base - STUD_H;
          const rx = STUD_W / 2;
          const ry = DEPTH / 2.6;
          return (
            <g key={`p${i}`}>
              <path
                d={`M${cx - rx},${top} L${cx - rx},${base} A${rx},${ry} 0 0 0 ${cx + rx},${base} L${cx + rx},${top} Z`}
                fill={`url(#gb-stud-${color})`}
              />
              <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={c.light} />
            </g>
          );
        })}
        <polygon className="gb-face" points={pts(face)} fill={`url(#gb-face-${color})`} />
      </g>

      {/* plastic shine along the top of each row */}
      <g fill="#fff" pointerEvents="none">
        {g.parts.map((p, i) => (
          <rect
            key={i}
            x={p.x + 3}
            y={p.y + PAD_TOP + 2.5}
            width={Math.max(0, p.w - 6)}
            height={Math.max(1.5, p.h * 0.22)}
            rx={Math.min(3, p.h * 0.1)}
            opacity={0.24}
          />
        ))}
      </g>

      {label && g.label && (
        <text
          x={g.label.x + g.label.w / 2}
          y={g.label.y + PAD_TOP + g.label.h * 0.62}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={c.text}
          opacity={0.82}
          pointerEvents="none"
          className="gb-brick-name"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

export const BrickSvg = memo(BrickSvgBase);

/** Shared gradients, rendered once per page. */
export function BrickDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {BRICK_COLORS.map((name) => {
          const c = COLORS[name];
          return (
            <g key={name}>
              <linearGradient id={`gb-face-${name}`} x1="0" y1="0" x2="0.25" y2="1">
                <stop offset="0" stopColor={c.light} />
                <stop offset="0.32" stopColor={c.face} />
                <stop offset="0.86" stopColor={c.face} />
                <stop offset="1" stopColor={c.side} />
              </linearGradient>
              <linearGradient id={`gb-stud-${name}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={c.light} />
                <stop offset="0.45" stopColor={c.face} />
                <stop offset="1" stopColor={c.side} />
              </linearGradient>
            </g>
          );
        })}
      </defs>
    </svg>
  );
}
