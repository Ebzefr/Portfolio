import {
  siAdobeillustrator,
  siBootstrap,
  siClaude,
  siCloudflare,
  siCss3,
  siDjango,
  siDotnet,
  siFigma,
  siFirebase,
  siFlask,
  siGit,
  siGithub,
  siGitlab,
  siGnubash,
  siHtml5,
  siJavascript,
  siJupyter,
  siKaggle,
  siLooker,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPandas,
  siPlotly,
  siPosit,
  siPostgresql,
  siPython,
  siR,
  siReact,
  siRstudioide,
  siScikitlearn,
  siSqlite,
  siStreamlit,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

/* Skills shown as Lego bricks. Each group is one brick colour.
   `svg` is a brand logo path (simple-icons); `fa` is a Font Awesome fallback
   for brands simple-icons doesn't include. */

export type Skill = { name: string; svg?: string; fa?: string };
export type SkillGroup = {
  id: string;
  label: string;
  color: "red" | "yellow" | "blue" | "green";
  rows: Skill[][]; // top row first; rows get longer towards the bottom so the pile reads as a pyramid
};

const s = (name: string, icon: { path: string }): Skill => ({ name, svg: icon.path });
const f = (name: string, fa: string): Skill => ({ name, fa });

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    color: "red",
    rows: [
      [s("Python", siPython), s("JavaScript", siJavascript), s("TypeScript", siTypescript), s("R", siR)],
      [f("C#", "fas fa-hashtag"), f("SQL", "fas fa-database"), s("Bash", siGnubash), s("HTML", siHtml5), s("CSS", siCss3)],
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    color: "yellow",
    rows: [
      [s("React", siReact), s("Next.js", siNextdotjs), s("Node.js", siNodedotjs), s("Flask", siFlask), s("Django", siDjango)],
      [s("ASP.NET", siDotnet), s("Tailwind", siTailwindcss), s("Bootstrap", siBootstrap), s("Shiny", siPosit), s("Streamlit", siStreamlit)],
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: "blue",
    rows: [
      [
        s("Git", siGit),
        s("GitHub", siGithub),
        s("GitLab", siGitlab),
        s("Firebase", siFirebase),
        s("Supabase", siSupabase),
        s("Vercel", siVercel),
        s("Jupyter", siJupyter),
      ],
      [
        s("Cloudflare R2", siCloudflare),
        s("Figma", siFigma),
        s("Illustrator", siAdobeillustrator),
        s("Claude Code", siClaude),
        f("Cursor", "fas fa-i-cursor"),
        s("RStudio", siRstudioide),
      ],
    ],
  },
  {
    id: "data",
    label: "Data & AI",
    color: "green",
    rows: [
      [
        s("Pandas", siPandas),
        s("NumPy", siNumpy),
        s("scikit-learn", siScikitlearn),
        f("Prophet", "fas fa-chart-line"),
        s("Plotly", siPlotly),
        f("Power BI", "fas fa-chart-simple"),
        f("DAX", "fas fa-square-root-variable"),
      ],
      [
        f("Power Query", "fas fa-filter"),
        f("Excel", "fas fa-table-cells"),
        s("Looker Studio", siLooker),
        s("PostgreSQL", siPostgresql),
        s("SQLite", siSqlite),
        f("MS SQL", "fas fa-server"),
        s("Kaggle", siKaggle),
      ],
    ],
  },
];
