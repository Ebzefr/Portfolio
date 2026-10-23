"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import HeroDecor from "./HeroDecor";

type Brick = {
  text: string;
  color: "red" | "yellow" | "green" | "blue";
  studs: number;
  shift: string; // resting offset so the stack looks hand-built, not perfect
  rot: string;
  spin: string; // rotation while falling
  minW?: string;
};

// Top to bottom. The bottom brick lands first.
const bricks: Brick[] = [
  { text: "I imagine", color: "red", studs: 5, shift: "0.18em", rot: "-0.6deg", spin: "-7deg" },
  { text: "I design", color: "yellow", studs: 4, shift: "-0.22em", rot: "0.5deg", spin: "6deg" },
  { text: "And", color: "green", studs: 4, shift: "-0.1em", rot: "-0.3deg", spin: "-5deg", minW: "4.4em" },
  { text: "I build.", color: "blue", studs: 4, shift: "0.2em", rot: "0deg", spin: "4deg", minW: "4.9em" },
];

const MAX_TILT = 6; // degrees

function useTilt() {
  // Set on the whole section: the stack tilts and the decorations drift (parallax).
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--tilt-x", `${(x * MAX_TILT * 2).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(-y * MAX_TILT).toFixed(2)}deg`);
        el.style.setProperty("--px", (x * 2).toFixed(3));
        el.style.setProperty("--py", (y * 2).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return ref;
}

export default function Hero() {
  const heroRef = useTilt();

  return (
    <section id="profile" className="hero" ref={heroRef}>
      <HeroDecor />

      <div className="hero-stage" role="img" aria-label="I imagine, I design and I build.">
        <div className="hero-stack">
          {bricks.map((b, i) => (
            <div
              key={b.text}
              className="brick-drop"
              style={{ "--order": bricks.length - 1 - i, "--spin": b.spin } as CSSProperties}
            >
              <div
                className={`brick lego--${b.color}`}
                style={{ "--shift": b.shift, "--rot": b.rot, "--min-w": b.minW } as CSSProperties}
                aria-hidden="true"
              >
                <span className="brick-top" />
                <span className="brick-left" />
                <span className="brick-right" />
                <span className="brick-studs">
                  {Array.from({ length: b.studs }, (_, s) => (
                    <span className="stud" key={s} />
                  ))}
                </span>
                <span className="brick-front">{b.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="hero-title">
        hey, I&rsquo;m Ebzé,
        <span>
          a software engineer<span className="hero-dot">.</span>
        </span>
      </h1>

      <div className="hero-actions">
        <a href="#project" className="lego-btn lego--black">
          <i className="fas fa-briefcase" aria-hidden="true"></i>
          View my work
          <i className="fas fa-arrow-right lego-btn-arrow" aria-hidden="true"></i>
        </a>
        <a href="#about" className="lego-btn lego--white">
          <i className="far fa-user" aria-hidden="true"></i>
          About me
        </a>
      </div>
    </section>
  );
}
