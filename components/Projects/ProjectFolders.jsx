"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProjectFolders.module.scss";

const PROJECTS = [
  {
    name: "Portfolio",
    title: "Portfolio Website",
    category: "Web / Design",
    description:
      "A personal portfolio website with a playful neo-brutalist cartoon aesthetic, centered around my custom pixel mascot, Jebby.",
    highlights: ["2D section navigation", "Section-specific mascot animations", "Light / Dark mode", "Interactive transitions", "Responsive design"],
    tech: ["Next.js (App Router)", "SCSS Modules", "Framer Motion"],
  },
  {
    name: "eThrift",
    title: "eThrift Store",
    category: "E-commerce",
    description:
      "A personal thrift e-commerce store where inventory is managed locally while changes are reflected live on the public website.",
    highlights: ["Live inventory sync", "Admin dashboard", "Public storefront", "Product management", "Responsive shopping"],
    tech: ["Next.js", "TypeScript", "Supabase", "ESLint", "PostCSS"],
  },
  {
    name: "AlagApp",
    title: "AlagApp",
    category: "AI / Health",
    description:
      "An AI-powered personal health companion focused on helping users monitor, understand, and improve their wellness.",
    highlights: ["Health dashboard", "AI health summaries", "Medication reminders", "Nutrition tracker", "Mood & energy check-ins", "AI health assistant", "Pattern detection", "Privacy Control Center"],
    tech: ["Next.js", "React", "Tailwind CSS", "Node.js", "NestJS", "OpenRouter API", "Supabase", "Vercel"],
  },
  {
    name: "Savings",
    title: "Savings Tracker",
    category: "Web App",
    description: "A lightweight personal savings tracker that helps visualize progress toward financial goals.",
    highlights: ["Philippine Peso support", "Savings goals", "Pie chart visualization", "Goal completion confetti", "Dark mode"],
    tech: ["React", "Vercel"],
  },
  {
    name: "BI Model",
    title: "BI Predictive Modeling App",
    category: "Machine Learning",
    description:
      "A Business Intelligence project focused on predicting loan approval outcomes using multiple machine learning models.",
    highlights: ["Predictive analytics", "Algorithm comparison (KNN, SVM, ANN)", "~96% ANN accuracy"],
    tech: ["Streamlit", "scikit-learn"],
  },
  {
    name: "UX Capstone",
    title: "HCI / UX Capstone",
    category: "UX Research",
    description:
      "A usability evaluation of a local restaurant website focused on identifying usability issues and improving the overall user experience.",
    highlights: ["Heuristic Evaluation", "System Usability Scale (SUS)", "UX recommendations", "Research methodology", "Usability testing"],
    tech: ["UX Research (non-development)"],
  },
  {
    name: "Weather App",
    title: "Team Weather App",
    category: "Web App",
    description:
      "A collaborative weather application where I handled frontend development and user interface implementation.",
    highlights: ["Reusable component library", "Favorites page", "Pagination", "Journey page", "Animated Globe", "Toast notifications", "Confirmation dialogs"],
    tech: ["Laravel", "React", "Inertia.js", "shadcn/ui"],
  },
];

function PixelFolder() {
  // blocky pixel folder, accent-colored with ink outline
  return (
    <svg viewBox="0 0 60 48" shapeRendering="crispEdges" className={styles.folderSvg} aria-hidden="true">
      <rect x="2" y="6" width="22" height="6" fill="var(--ink)" />
      <rect x="2" y="12" width="56" height="34" fill="var(--ink)" />
      <rect x="5" y="9" width="17" height="6" fill="#ffd21e" />
      <rect x="5" y="15" width="50" height="28" fill="#ffd21e" />
      <rect x="5" y="15" width="50" height="7" fill="#ffbf00" />
      <rect x="47" y="36" width="8" height="7" fill="#ffe873" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 14 14" shapeRendering="crispEdges" className={styles.homeSvg} aria-hidden="true">
      <rect x="6" y="1" width="2" height="2" fill="currentColor" />
      <rect x="4" y="3" width="6" height="2" fill="currentColor" />
      <rect x="2" y="5" width="10" height="2" fill="currentColor" />
      <rect x="3" y="7" width="8" height="6" fill="currentColor" />
      <rect x="6" y="9" width="2" height="4" fill="#00000000" />
    </svg>
  );
}

export default function ProjectFolders() {
  const [openIdx, setOpenIdx] = useState(null); // null = grid
  const open = openIdx !== null ? PROJECTS[openIdx] : null;

  return (
    <div className={styles.window}>
      {/* title bar */}
      <div className={styles.titleBar}>
        <span className={styles.titleText}>jebby.exe — PROJECTS</span>
        <div className={styles.winDots} aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>

      {/* breadcrumb bar */}
      <div className={styles.crumbBar}>
        <button className={styles.crumb} onClick={() => setOpenIdx(null)} aria-label="Home">
          <HomeIcon />
        </button>
        <span className={styles.sep}>›</span>
        <button className={styles.crumb} onClick={() => setOpenIdx(null)}>
          Projects
        </button>
        {open && (
          <>
            <span className={styles.sep}>›</span>
            <span className={`${styles.crumb} ${styles.crumbCurrent}`}>{open.name}</span>
          </>
        )}
      </div>

      {/* body */}
      <div className={styles.body}>
        <AnimatePresence mode="wait" initial={false}>
          {open === null ? (
            <motion.div
              key="grid"
              className={styles.grid}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              {PROJECTS.map((p, i) => (
                <button key={p.name} className={styles.folder} onClick={() => setOpenIdx(i)}>
                  <PixelFolder />
                  <span className={styles.folderName}>{p.name}</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`detail-${openIdx}`}
              className={styles.detail}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
            >
              <button className={styles.backBtn} onClick={() => setOpenIdx(null)}>
                ‹ Back
              </button>

              <div className={styles.detailHead}>
                <span className={styles.category}>{open.category}</span>
                <span className={styles.count}>
                  {String(openIdx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </div>

              <h3 className={styles.detailTitle}>{open.title}</h3>

              <div className={styles.scrollArea}>
                <p className={styles.desc}>{open.description}</p>
                <div className={styles.group}>
                  <span className={styles.label}>Highlights</span>
                  <div className={styles.tags}>
                    {open.highlights.map((h) => <span key={h} className={styles.tag}>{h}</span>)}
                  </div>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>Tech</span>
                  <div className={styles.tags}>
                    {open.tech.map((t) => <span key={t} className={styles.badge}>{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}