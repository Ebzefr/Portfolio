"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "profile", title: "Home", desc: "Back to homepage" },
  { id: "project", title: "Projects", desc: "Things I've built" },
  { id: "about", title: "About", desc: "Learn about me" },
  { id: "skills", title: "Skills", desc: "My tools & strengths" },
  { id: "contact", title: "Contact", desc: "Let's work" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("profile");

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // Highlight the section currently in view.
  useEffect(() => {
    const onScroll = () => {
      let current = "";
      document.querySelectorAll<HTMLElement>("section[id]").forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" aria-label="Home">
          <div className="logo">
            <img src="/Assets/ebze-head.png" alt="Ebenezer Obi logo" className="logo-img" />
          </div>
        </a>

        <ul className="nav-menu">
          {links.map((l) => (
            <li className="nav-item" key={l.id}>
              <a href={`#${l.id}`} className={`nav-link${active === l.id ? " active" : ""}`}>
                {l.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-buttons">
          <a href="#contact" className="lego-btn lego-btn--sm lego--red">
            Let&apos;s talk <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>

        <button
          className={`hamburger${open ? " is-active" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <div className={`mobile-menu${open ? " active" : ""}`} id="mobileMenu">
        <div className="mobile-menu-content">
          <div className="mobile-nav-items">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`mobile-nav-item${active === l.id ? " active" : ""}`}
                onClick={close}
              >
                <span className="mobile-nav-title">{l.title}</span>
                <span className="mobile-nav-desc">{l.desc}</span>
              </a>
            ))}
          </div>

          <div className="mobile-menu-buttons">
            <a href="#contact" className="lego-btn lego-btn--block lego--red" onClick={close}>
              Let&apos;s talk <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
