import type { CSSProperties, ReactNode } from "react";
import { Checker, Doodle, LooseBrick } from "./LegoBits";

/*
 * Playful "bits and bobs" scattered around the hero brick stack.
 * Positions are in em, measured from the centre of the hero, so the whole
 * scene scales with the stack. Purely decorative: hidden from screen readers.
 */

type DecoProps = {
  x: number; // em from centre (negative = left)
  m?: number; // half width in em, used to keep the item on screen
  y: number; // em from centre (negative = up)
  depth?: number; // parallax strength
  delay?: number; // entrance order
  className?: string;
  children: ReactNode;
};

function Deco({ x, y, m, depth = 10, delay = 0, className = "", children }: DecoProps) {
  return (
    <div
      className={`deco ${className}`}
      style={{ "--x": x, "--y": y, "--m": m, "--d": depth, "--delay": delay } as CSSProperties}
    >
      <div className="deco-pop">{children}</div>
    </div>
  );
}

export default function HeroDecor() {
  return (
    <div className="hero-deco" aria-hidden="true">
      {/* ---- left side ---- */}
      <Deco x={-7.6} y={-3.5} depth={26} delay={0} className="deco--brick deco--keep">
        <div className="bob"><LooseBrick color="blue" rx={-32} ry={38} rz={-8} /></div>
      </Deco>

      <Deco x={-4.75} y={-2.8} depth={14} delay={1} className="deco--wide">
        <div className="sticky">
          <span>Ideas</span>
          <span>Design</span>
          <span>Code</span>
          <span>
            Ship <Doodle.Smiley />
          </span>
        </div>
      </Deco>

      <Deco x={-3.55} y={-1.1} depth={8} delay={2} className="deco--wide">
        <Doodle.CurvedArrow />
      </Deco>

      <Deco x={-8.1} y={-0.6} depth={30} delay={1} className="deco--brick deco--keep">
        <div className="bob bob--slow"><LooseBrick color="red" rx={-24} ry={-32} rz={10} /></div>
      </Deco>

      <Deco x={-4.3} y={0.45} depth={10} delay={3} className="deco--wide">
        <Checker />
      </Deco>

      <Deco x={-4.9} y={2.6} m={0.3} depth={40} delay={2} className="deco--brick deco--keep">
        <div className="bob bob--slow"><LooseBrick color="red" rx={-38} ry={20} rz={-14} size={1.35} blur /></div>
      </Deco>

      <Deco x={-8.1} y={3.6} depth={12} delay={4} className="deco--mid">
        <Doodle.Asterisk />
      </Deco>

      {/* ---- right side ---- */}
      <Deco x={3.25} y={-4.05} depth={9} delay={3} className="deco--wide">
        <Doodle.Crown />
      </Deco>

      <Deco x={3.35} y={-2.25} depth={7} delay={4} className="deco--wide">
        <Doodle.Dashes />
      </Deco>

      <Deco x={4.35} y={-0.85} m={1} depth={18} delay={1} className="deco--mid deco--head">
        <div className="bob">
          <img className="lego-head" src="/Assets/ebze-head.png" alt="" draggable={false} />
        </div>
      </Deco>

      <Deco x={5.9} y={-2.05} depth={12} delay={5} className="deco--wide">
        <div className="note note--sm">
          Same
          <br />
          &nbsp;guy
          <br />
          &nbsp;&nbsp;btw.
        </div>
      </Deco>

      <Deco x={5.85} y={-1.25} depth={12} delay={6} className="deco--wide">
        <Doodle.SmallArrow />
      </Deco>

      <Deco x={8.1} y={-2.7} depth={28} delay={0} className="deco--brick deco--keep">
        <div className="bob"><LooseBrick color="yellow" rx={-30} ry={-40} rz={12} /></div>
      </Deco>

      <Deco x={3.75} y={1.5} depth={8} delay={5} className="deco--wide">
        <Doodle.Cursor />
      </Deco>

      <Deco x={8.9} y={1.3} m={0.3} depth={44} delay={2} className="deco--brick deco--keep">
        <div className="bob bob--slow"><LooseBrick color="green" rx={-26} ry={-28} rz={-18} size={1.5} blur /></div>
      </Deco>

      <Deco x={6.7} y={3.05} m={0.75} depth={12} delay={6} className="deco--mid">
        <div className="note">
          Build
          <br />
          Learn
          <br />
          Create
          <br />
          Repeat.
          <Doodle.Squiggle />
        </div>
      </Deco>
    </div>
  );
}
