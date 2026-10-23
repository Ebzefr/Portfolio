"use client";

import { useEffect, useState } from "react";

// Each role keeps its own article so the grammar stays right ("an AI engineer").
const roles = ["a software engineer", "a full stack developer", "an AI engineer", "a data analyst"];

const HOLD = 2600; // ms each role stays on screen
const OUT = 380; // ms for the old role to lift away

/* Cycles through the roles: the old one lifts off, the new one snaps down like a brick. */
export default function RoleRotator() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setLeaving(true);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setLeaving(false);
      }, OUT);
    }, HOLD);
    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, []);

  return (
    <span className="role">
      {/* screen readers get the full list once instead of a changing word */}
      <span className="sr-only">a software engineer, full stack developer, AI engineer and data analyst.</span>
      <span className="role-track" aria-hidden="true">
        <span key={index} className={`role-word${leaving ? " is-leaving" : ""}`}>
          {roles[index]}
          <span className="hero-dot">.</span>
        </span>
      </span>
    </span>
  );
}
