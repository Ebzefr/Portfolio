import type { CSSProperties } from "react";
import { Doodle, LooseBrick } from "./LegoBits";

type Link = {
  label: string;
  href: string;
  icon: string;
  color: "red" | "yellow" | "blue" | "green";
  external?: boolean;
  download?: string;
};

const links: Link[] = [
  { label: "GitHub", href: "https://github.com/Ebzefr", icon: "fab fa-github", color: "red", external: true },
  { label: "Email", href: "mailto:ebenezer.a.obi@gmail.com", icon: "fas fa-envelope", color: "yellow" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ebenezer-obi-23858324b",
    icon: "fab fa-linkedin",
    color: "blue",
    external: true,
  },
  {
    label: "Resume",
    href: "/Assets/Ebenezer_Obi_CV.pdf",
    icon: "fas fa-file-lines",
    color: "green",
    download: "Ebenezer_Obi_CV.pdf",
  },
];

/* A chunky 3D Lego brick that works as a link */
function BrickLink({ link, index }: { link: Link; index: number }) {
  return (
    <a
      className={`brick contact-brick lego--${link.color}`}
      href={link.href}
      style={{ "--i": index } as CSSProperties}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(link.download ? { download: link.download } : {})}
    >
      <span className="brick-top" aria-hidden="true" />
      <span className="brick-left" aria-hidden="true" />
      <span className="brick-studs" aria-hidden="true">
        {[0, 1, 2, 3].map((s) => (
          <span className="stud" key={s} />
        ))}
      </span>
      <span className="brick-front">
        <i className={`contact-brick-icon ${link.icon}`} aria-hidden="true"></i>
        <span className="contact-brick-label">{link.label}</span>
        <i className="fas fa-arrow-right contact-brick-arrow" aria-hidden="true"></i>
      </span>
    </a>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-deco" aria-hidden="true">
        <div className="contact-deco-yellow bob"><LooseBrick color="yellow" rx={-30} ry={-36} rz={14} /></div>
        <div className="contact-deco-blue bob bob--slow"><LooseBrick color="blue" rx={-32} ry={34} rz={-12} /></div>
        <div className="contact-deco-red bob"><LooseBrick color="red" rx={-28} ry={-30} rz={10} /></div>
        <div className="contact-deco-green"><LooseBrick color="green" rx={-30} ry={30} rz={-8} size={1.3} /></div>
        <span className="contact-dash contact-dash--1"><Doodle.Dashes /></span>
        <span className="contact-dash contact-dash--2"><Doodle.Dashes /></span>
        <span className="contact-dash contact-dash--3"><Doodle.Dashes /></span>
        <span className="contact-dash contact-dash--4"><Doodle.Dashes /></span>
      </div>

      <div className="contact-inner">
        <span className="work-eyebrow">
          <span className="eyebrow-bricks" aria-hidden="true">
            <LooseBrick color="blue" rx={-30} ry={34} size={0.55} />
          </span>
          Contact
        </span>

        <h2 className="contact-heading">
          Let&rsquo;s build
          <br />
          something
          <br />
          great together<span className="hero-dot">.</span>
        </h2>

        <p className="contact-intro">
          Got a role, a project or an idea you want to bring to life? I&apos;d love to hear about
          it. Whether it&apos;s tech, products or a collaboration, pick a brick below and let&apos;s
          start building.
        </p>

        <div className="contact-bricks">
          {links.map((l, i) => (
            <BrickLink key={l.label} link={l} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
