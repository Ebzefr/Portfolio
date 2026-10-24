import { Doodle, LooseBrick } from "./LegoBits";
import RoleRotator from "./RoleRotator";

const CV = "/Assets/Ebenezer_Obi_CV.pdf";

const pillars = [
  { label: ["Build", "Products"], icon: "fas fa-laptop-code", tone: "red" },
  { label: ["Design", "Experiences"], icon: "fas fa-palette", tone: "yellow" },
  { label: ["Solve", "Problems"], icon: "far fa-lightbulb", tone: "green" },
  { label: ["Explore", "New Ideas"], icon: "fas fa-user-group", tone: "blue" },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-deco" aria-hidden="true">
        <LooseBrick color="red" rx={-30} ry={-26} rz={10} size={1.6} blur />
      </div>

      <div className="about-inner">
        {/* ---- photo card ---- */}
        <div className="about-photo" aria-hidden="true">
          <div className="about-paper" />
          <img className="about-figure" src="/Assets/cards/about-figure.webp" alt="" loading="lazy" />

          <span className="about-dashes">
            <Doodle.Dashes />
          </span>

          <div className="about-brick bob">
            <LooseBrick color="blue" rx={-30} ry={34} rz={-8} />
          </div>

          <div className="about-sticky">
            <span>Build</span>
            <span>Learn</span>
            <span>Create</span>
            <span>
              Repeat. <Doodle.Smiley />
            </span>
          </div>
        </div>

        {/* ---- text ---- */}
        <div className="about-content">
          <span className="work-eyebrow">
            <span className="eyebrow-bricks" aria-hidden="true">
              <LooseBrick color="yellow" rx={-30} ry={34} size={0.55} />
            </span>
            About me
          </span>

          <h2 className="about-heading">
            I&rsquo;m Ebzé,
            <RoleRotator />
          </h2>

          <p className="about-statement">
            I turn ideas into real products, combining software engineering, artificial
            intelligence and data to build things that matter. As a First Class Computer Science
            graduate, I take work from first sketch to shipped, and I sweat the details that make
            software reliable, useful and a joy to use.
          </p>

          <ul className="about-pillars">
            {pillars.map((p) => (
              <li key={p.label[0]} className={`pillar pillar--${p.tone}`}>
                <i className={p.icon} aria-hidden="true"></i>
                <span>
                  {p.label[0]}
                  <br />
                  {p.label[1]}
                </span>
              </li>
            ))}
          </ul>

          <div className="about-actions">
            <a href={CV} className="lego-btn lego--black" download="Ebenezer_Obi_CV.pdf">
              <i className="far fa-file-lines" aria-hidden="true"></i>
              Download CV
              <i className="fas fa-arrow-down lego-btn-arrow" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
