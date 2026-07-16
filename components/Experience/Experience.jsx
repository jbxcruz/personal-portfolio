"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import styles from "./Experience.module.scss";

const LEVELS = [
  {
    id: "writer",
    level: "1-1",
    title: "Freelance Creative Writer",
    org: "Freelancer.com",
    years: "2020–2022",
    color: "#ffd21e",
    x: 12, y: 62,
    desc: "Where the journey starts. Stories, articles, and marketing copy for clients across niches, adapting voice and tone per project and always shipping on deadline.",
  },
  {
    id: "logo",
    level: "1-2",
    title: "Freelance Logo Designer",
    org: "Freelancer.com",
    years: "2021–2022",
    color: "#ff6bb3",
    x: 38, y: 34,
    desc: "Side quest unlocked. Brand logos for small businesses and startups, taking rough ideas to finished marks with revisions until clients loved them.",
  },
  {
    id: "frontend",
    level: "1-3",
    title: "Freelance Front-End Web Developer",
    org: "Freelancer.com",
    years: "2021–2023",
    color: "#3BB8E5",
    x: 63, y: 58,
    desc: "The main storyline. Responsive websites and landing pages built with HTML, CSS, JavaScript, and React, handling briefs, revisions, and client communication end to end.",
  },
  {
    id: "annotator",
    level: "1-4",
    title: "Data Annotator",
    org: "MCRI Global Corporation",
    years: "2023–2024",
    color: "#b46bff",
    x: 88, y: 30,
    desc: "New area discovered. Professional data annotation for AI training pipelines, labeling and quality-checking datasets at production scale. The foundation of my AI training career.",
  },
];

const HOP_MS = 550;

function JebbyMini() {
  return (
    <svg viewBox="0 0 170 90" shapeRendering="crispEdges" className={styles.jebbySvg} aria-hidden="true">
      <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill="#3BB8E5" />
      <rect x="40" y="15" width="15" height="15" fill="black" />
      <rect x="115" y="15" width="15" height="15" fill="black" />
    </svg>
  );
}

export default function Experience() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const jebby = useAnimationControls();
  const activeRef = useRef(0);

  const goTo = async (i) => {
    if (busy || i === activeRef.current) return;
    setBusy(true);
    activeRef.current = i;
    setActive(i);
    const target = LEVELS[i];
    await jebby.start({
      left: `${target.x}%`,
      top: `${target.y}%`,
      transition: { duration: HOP_MS / 1000, ease: "easeInOut" },
    });
    setBusy(false);
  };

  const cur = LEVELS[active];

  return (
    <section className={styles.experience} id="experience" data-scroll>
      <h2 className={styles.heading}>Experience</h2>

      <div className={styles.map}>
        {/* dotted trail through the checkpoints */}
        <svg className={styles.trail} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points={LEVELS.map((l) => `${l.x},${l.y}`).join(" ")}
            className={styles.trailLine}
          />
        </svg>

        {/* level checkpoints */}
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            className={`${styles.checkpoint} ${i === active ? styles.checkpointOn : ""} ${i < active ? styles.checkpointDone : ""}`}
            style={{ left: `${l.x}%`, top: `${l.y}%`, "--lv": l.color }}
            onClick={() => goTo(i)}
            disabled={busy}
            aria-label={`Level ${l.level}: ${l.title}`}
          >
            <span className={styles.lvTag}>{l.level}</span>
            <span className={styles.lvYears}>{l.years}</span>
          </button>
        ))}

        {/* Jebby stands on the active checkpoint */}
        <motion.div
          className={styles.jebby}
          animate={jebby}
          initial={{ left: `${LEVELS[0].x}%`, top: `${LEVELS[0].y}%` }}
        >
          <motion.div
            animate={busy ? { y: [0, -26, 0, -10, 0] } : { y: 0 }}
            transition={{ duration: HOP_MS / 1000, ease: "easeOut", times: [0, 0.35, 0.65, 0.85, 1] }}
          >
            <JebbyMini />
          </motion.div>
        </motion.div>
      </div>

      {/* quest card for the selected level */}
      <div className={styles.questSlot}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={cur.id}
            className={styles.quest}
            style={{ "--lv": cur.color }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.questHead}>
              <span className={styles.questLv}>LV {cur.level}</span>
              <h3 className={styles.questTitle}>{cur.title}</h3>
            </div>
            <span className={styles.questMeta}>{cur.org} · {cur.years}</span>
            <p className={styles.questDesc}>{cur.desc}</p>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}