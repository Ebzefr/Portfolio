/* Projects shown in the "Some things I've built" carousel.
   Images live in public/Assets/cards (compressed copies of the -display / -logo files). */

export type TagColor = "dark" | "blue" | "navy" | "lilac" | "green" | "red" | "yellow";

export type Project = {
  id: string;
  name: string;
  type: string; // small label at the top of the card
  icon: string; // Font Awesome class for that label
  blurb: string; // one or two short sentences
  tags: [label: string, color: TagColor][];
  logo: string;
  wideLogo?: boolean; // wordmark rather than a square icon
  display?: string; // wide screenshot for the card
  phoneScreen?: string; // or a single app screen shown inside a phone frame
  live?: string;
  github?: string;
  dark?: boolean; // dark card for dark screenshots
};

const img = (file: string) => `/Assets/cards/${file}`;

export const projects: Project[] = [
  {
    id: "websecura",
    name: "WebSecura",
    type: "Web Security",
    icon: "fas fa-shield-halved",
    blurb: "Scans any public website with 15+ checks, from OWASP Top 10 to SSL and headers, and explains how to fix each issue.",
    tags: [["React", "blue"], ["Flask", "dark"], ["Python", "navy"], ["SQLite", "green"]],
    logo: img("websecura-logo.webp"),
    wideLogo: true,
    display: img("websecura-display.webp"),
    live: "https://web-secura.vercel.app/",
    github: "https://github.com/Ebzefr/WebSecura",
    dark: true,
  },
  {
    id: "clouddey",
    name: "Clouddey",
    type: "Web App",
    icon: "fas fa-globe",
    blurb: "Temporary file sharing with passwords, expiry times and email links. Files delete themselves when time's up.",
    tags: [["React", "blue"], ["Node.js", "green"], ["Tailwind", "lilac"], ["Vercel", "dark"]],
    logo: img("clouddey-logo.webp"),
    display: img("clouddey-display.webp"),
    live: "https://clouddey.vercel.app/",
    github: "https://github.com/Ebzefr/Clouddey",
  },
  {
    id: "lofis-app",
    name: "Lofis App",
    type: "Mobile App",
    icon: "fas fa-mobile-screen",
    blurb: "A working restaurant app built from my UX research: dietary filters, order customising, checkout, live delivery tracking and table booking.",
    tags: [["React Native", "blue"], ["Expo", "dark"], ["TypeScript", "navy"], ["UI/UX", "lilac"]],
    logo: img("lofis-app-logo.webp"),
    display: img("lofis-app-display.webp"),
    live: "https://ebzefr.github.io/lofis-app/",
    github: "https://github.com/Ebzefr/lofis-app",
  },
  {
    id: "lofis-web",
    name: "Lofis Restaurant",
    type: "Full-Stack",
    icon: "fas fa-layer-group",
    blurb: "Customer ordering site and admin dashboard with menu management, role-based login and live sales analytics.",
    tags: [["ASP.NET", "navy"], ["C#", "lilac"], ["MS SQL", "red"], ["Tailwind", "blue"]],
    logo: img("lofis-logo.webp"),
    display: img("lofis-display.webp"),
    live: "https://2223073.win.studentwebserver.co.uk/Lofis",
    github: "https://github.com/Ebzefr/Lofis-J100152",
  },
  {
    id: "student-predictor",
    name: "Grade Predictor",
    type: "Machine Learning",
    icon: "fas fa-brain",
    blurb: "Predicts student performance with a Naive Bayes model built from scratch, with confidence scores and live charts.",
    tags: [["Python", "navy"], ["Streamlit", "red"], ["NumPy", "blue"], ["Plotly", "lilac"]],
    logo: img("naives-bayes-logo.webp"),
    display: img("naives-bayes-display.webp"),
    live: "https://naive-bayes-predictor.streamlit.app/",
    github: "https://github.com/Ebzefr/Naive-Bayes-Predictor",
    dark: true,
  },
  {
    id: "spotify",
    name: "Spotify Prediction",
    type: "Data + Web",
    icon: "fas fa-chart-line",
    blurb: "Forecasts your next Spotify Wrapped (top artists, songs and minutes) from your listening history.",
    tags: [["Python", "navy"], ["Jupyter", "yellow"], ["React", "blue"], ["Vercel", "dark"]],
    logo: img("spotify-prediction-logo.webp"),
    wideLogo: true,
    display: img("spotify-prediction-display.webp"),
    live: "https://spotify-prediction-rosy.vercel.app/",
    github: "https://github.com/Ebzefr/Spotify-Prediction",
  },
  {
    id: "uk-tech-jobs",
    name: "UK Tech Jobs",
    type: "Data Dashboard",
    icon: "fas fa-chart-column",
    blurb: "Interactive dashboard of UK tech jobs from 2019 to 2023: roles, skills, salaries and where companies hire.",
    tags: [["R", "blue"], ["Shiny", "navy"], ["Excel", "green"]],
    logo: img("uk-tech-logo.webp"),
    display: img("uk-tech-display.webp"),
    live: "https://ebzefr.shinyapps.io/Job-Analysis/",
    github: "https://github.com/Ebzefr/Job-Analysis",
  },
  {
    id: "e-commerce",
    name: "E-Commerce Insights",
    type: "Data Dashboard",
    icon: "fas fa-chart-column",
    blurb: "Raw sales data cleaned in Python and turned into a Looker Studio dashboard of revenue, customers and products.",
    tags: [["Python", "navy"], ["Pandas", "dark"], ["Looker Studio", "blue"]],
    logo: img("e-commerce-logo.webp"),
    wideLogo: true,
    display: img("e-commerce-display.webp"),
    live: "https://lookerstudio.google.com/reporting/c8c6d4c2-0522-4052-ad9c-b164149b2aef",
    github: "https://github.com/Ebzefr/Ecomm-Analysis",
  },
  {
    id: "care-workforce",
    name: "Care Workforce",
    type: "Data Dashboard",
    icon: "fas fa-chart-column",
    blurb: "Power BI dashboard linking UK care staffing, vacancies and turnover to CQC quality ratings by region.",
    tags: [["Power BI", "yellow"], ["DAX", "dark"], ["Power Query", "green"]],
    logo: img("care-workforce-logo.webp"),
    wideLogo: true,
    display: img("care-workforce-display.webp"),
  },
];
