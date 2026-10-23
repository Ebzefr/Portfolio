"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { skillGroups, type Skill } from "@/data/skills";
import { Doodle, LooseBrick } from "./LegoBits";

// Small deterministic "randomness" so the pile looks hand-built but renders the same every time.
const wobble = (i: number, scale: number) => (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * scale;

function SkillBrick({ skill, color, index }: { skill: Skill; color: string; index: number }) {
  const studs = Math.min(4, Math.max(2, Math.round(skill.name.length / 3.5)));
  return (
    <li
      className="skill-drop"
      style={{ "--spin": `${wobble(index + 3, 16).toFixed(1)}deg` } as CSSProperties}
    >
      <div
        className={`brick skill-brick lego--${color}`}
        style={
          {
            "--shift": `${wobble(index, 0.12).toFixed(3)}em`,
            "--rot": `${wobble(index + 7, 1.4).toFixed(2)}deg`,
          } as CSSProperties
        }
      >
        <span className="brick-top" aria-hidden="true" />
        <span className="brick-left" aria-hidden="true" />
        <span className="brick-studs" aria-hidden="true">
          {Array.from({ length: studs }, (_, s) => (
            <span className="stud" key={s} />
          ))}
        </span>
        <span className="brick-front">
          {skill.svg ? (
            <svg className="skill-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d={skill.svg} />
            </svg>
          ) : (
            <i className={`skill-icon ${skill.fa}`} aria-hidden="true"></i>
          )}
          <span className="skill-name">{skill.name}</span>
        </span>
      </div>
    </li>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const pileRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Bricks drop bottom row first, left to right, like building the pile from the ground up.
  useLayoutEffect(() => {
    const pile = pileRef.current;
    if (!pile) return;
    const order = () => {
      const items = [...pile.querySelectorAll<HTMLElement>(".skill-drop")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, row: Math.round(r.top / 12), left: r.left };
      });
      const sorted = items.sort((a, b) => b.row - a.row || a.left - b.left).map((x) => x.el);
      sorted.forEach((el, i) => el.style.setProperty("--order", String(i)));
    };
    order();
    window.addEventListener("resize", order);
    return () => window.removeEventListener("resize", order);
  }, []);

  // Start building once the pile scrolls into view.
  useEffect(() => {
    const el = pileRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let n = 0;

  return (
    <section id="skills" ref={sectionRef} className={`skills${visible ? " is-visible" : ""}`}>
      <div className="skills-deco" aria-hidden="true">
        <div className="skills-deco-blue bob"><LooseBrick color="blue" rx={-30} ry={36} rz={-14} /></div>
        <div className="skills-deco-yellow bob bob--slow"><LooseBrick color="yellow" rx={-28} ry={-34} rz={12} /></div>
        <div className="skills-deco-green"><LooseBrick color="green" rx={-32} ry={30} rz={-10} size={1.4} blur /></div>
        <div className="skills-deco-red"><LooseBrick color="red" rx={-30} ry={-30} rz={8} size={1.2} /></div>
        <div className="skills-deco-red2"><LooseBrick color="red" rx={-26} ry={24} rz={-6} size={1.8} blur /></div>
      </div>

      <div className="skills-inner">
        <header className="skills-header">
          <div>
            <span className="work-eyebrow">
              <span className="eyebrow-bricks" aria-hidden="true">
                <LooseBrick color="blue" rx={-30} ry={34} size={0.55} />
              </span>
              Skills
            </span>
            <h2 className="work-title">
              My toolkit
              <br />
              for building<span className="hero-dot">.</span>
            </h2>
          </div>
          <p className="skills-intro">
            The languages, frameworks, tools and data skills I use to design, build and ship
            products, from the first prototype to production.
          </p>
        </header>

        <div className="skills-body">
          <div className="skill-pile" ref={pileRef}>
            <div className="skill-stack">
              {skillGroups.map((group) => (
                <div key={group.id} className={`skill-group skill-group--${group.id}`}>
                  <p className={`skill-label skill-label--${group.color} note`} aria-hidden="true">
                    {group.label}
                    <Doodle.SwoopRight />
                  </p>
                  <h3 className="sr-only">{group.label}</h3>
                  <ul className="skill-rows" aria-label={group.label}>
                    {group.rows.map((row, r) => (
                      <li key={r} className="skill-row">
                        <ul>
                          {row.map((skill) => (
                            <SkillBrick key={skill.name} skill={skill} color={group.color} index={n++} />
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <span className="skill-dashes" aria-hidden="true">
              <Doodle.Dashes />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
