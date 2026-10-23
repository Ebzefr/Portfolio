"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, type Project } from "@/data/projects";
import { Doodle, LooseBrick } from "./LegoBits";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const link = project.live ?? project.github;

  return (
    <article
      className={`work-card${project.dark ? " work-card--dark" : ""}`}
      style={{ "--i": index } as CSSProperties}
    >
      <div className="work-media">
        {project.display && (
          <img src={project.display} alt={`${project.name} screenshot`} loading="lazy" draggable={false} />
        )}
        {project.phoneScreen && (
          <div className="phone">
            <img src={project.phoneScreen} alt={`${project.name} app screen`} loading="lazy" draggable={false} />
          </div>
        )}

        <div className="work-meta">
          <span className="work-type">
            <i className={project.icon} aria-hidden="true"></i>
            {project.type}
          </span>
          <span className="work-num">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="work-body">
        <div className="work-head">
          <img
            className={`work-logo${project.wideLogo ? " work-logo--wide" : ""}`}
            src={project.logo}
            alt=""
            loading="lazy"
          />
          <h3 className="work-name">{project.name}</h3>
          <div className="work-links">
            {project.github && project.live && (
              <a
                className="work-link work-link--ghost"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} code on GitHub`}
              >
                <i className="fab fa-github" aria-hidden="true"></i>
              </a>
            )}
            {link && (
              <a
                className="work-link"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={project.live ? `Visit ${project.name}` : `${project.name} on GitHub`}
              >
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </a>
            )}
          </div>
        </div>

        <p className="work-blurb">{project.blurb}</p>

        <ul className="work-tags" aria-label="Built with">
          {project.tags.map(([label, color]) => (
            <li key={label} className={`tag tag--${color}`}>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [visible, setVisible] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Enable/disable the arrows depending on scroll position.
  const updateEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({
      start: t.scrollLeft <= 4,
      end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    updateEdges();
    t.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      t.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, showAll]);

  // Play the entrance (cards rise in, doodles draw) once the section scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step exactly one card, snapping to the nearest card even if a scroll is still running.
  const scrollByCard = (dir: 1 | -1) => {
    const t = trackRef.current;
    const card = t?.querySelector<HTMLElement>(".work-card");
    if (!t || !card) return;
    const step = card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0);
    const target = (Math.round(t.scrollLeft / step) + dir) * step;
    t.scrollTo({ left: Math.max(0, Math.min(target, t.scrollWidth - t.clientWidth)), behavior: "smooth" });
  };

  const toggleAll = () => {
    if (showAll) sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowAll(!showAll);
  };

  return (
    <section id="project" ref={sectionRef} className={`work${showAll ? " work--all" : ""}${visible ? " is-visible" : ""}`}>
      {/* decorative bricks */}
      <div className="work-deco" aria-hidden="true">
        <div className="work-deco-yellow bob">
          <LooseBrick color="yellow" rx={-30} ry={-38} rz={14} />
        </div>
        <div className="work-deco-blue bob bob--slow">
          <LooseBrick color="blue" rx={-34} ry={30} rz={-10} />
        </div>
        <div className="work-deco-red">
          <LooseBrick color="red" rx={-28} ry={-24} rz={8} size={1.5} blur />
        </div>
      </div>

      <div className="work-inner">
        <header className="work-header">
          <div className="work-heading">
            <span className="work-eyebrow">
              <span className="eyebrow-bricks" aria-hidden="true">
                <LooseBrick color="blue" rx={-30} ry={34} size={0.55} />
                <LooseBrick color="red" rx={-30} ry={34} size={0.55} />
              </span>
              Selected work
            </span>
            <h2 className="work-title">
              Some things
              <br />
              I&rsquo;ve built<span className="hero-dot">.</span>
            </h2>
          </div>

          <div className="work-note note" aria-hidden="true">
            Real projects.
            <br />
            Real problems.
            <br />
            Real solutions.
            <Doodle.ArrowDown />
          </div>

          <div className="work-intro">
            <p>
              A mix of full-stack apps, data dashboards, machine learning and UX design. I design,
              build and ship things people actually use.
            </p>
            {!showAll && (
              <div className="work-arrows">
                <button
                  type="button"
                  className="lego-btn lego-btn--icon lego--white"
                  onClick={() => scrollByCard(-1)}
                  disabled={edges.start}
                  aria-label="Previous projects"
                >
                  <i className="fas fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  className="lego-btn lego-btn--icon lego--white"
                  onClick={() => scrollByCard(1)}
                  disabled={edges.end}
                  aria-label="Next projects"
                >
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </button>
              </div>
            )}
          </div>
        </header>

        <div
          className="work-track"
          ref={trackRef}
          role="region"
          aria-label="Projects"
          tabIndex={0}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <footer className="work-footer">
          <div className="work-note work-note--footer note" aria-hidden="true">
            Different problems.
            <br />
            &nbsp;Same curiosity
            <Doodle.SwoopRight />
          </div>

          <button type="button" className="lego-btn lego--white" onClick={toggleAll} aria-expanded={showAll}>
            {showAll ? "Show fewer" : "View all projects"}
            <i className={`fas ${showAll ? "fa-arrow-up" : "fa-arrow-right"} lego-btn-arrow`} aria-hidden="true"></i>
          </button>

          <span className="work-footer-dashes" aria-hidden="true">
            <Doodle.Dashes />
          </span>
        </footer>
      </div>
    </section>
  );
}
