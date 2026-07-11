"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Skills.module.scss";

const CHARACTERS = [
  {
    id: "webdev", label: "Web Development", color: "#3BB8E5", stars: 4,
    lines: ["I love to design UI/UX", "Frontend? or Backend?", "One day, I'll build my own app.", "My dream is to be a software engineer"],
    groups: [
      { name: "Frontend", skills: [
        { name: "React", pct: 65 }, { name: "Next.js", pct: 70 }, { name: "TypeScript", pct: 55 },
        { name: "HTML / CSS", pct: 80 }, { name: "SCSS", pct: 70 }, { name: "Framer Motion", pct: 65 },
      ]},
      { name: "Backend", skills: [
        { name: "Node.js", pct: 60 }, { name: "PHP", pct: 60 },
        { name: "Supabase", pct: 70 }, { name: "SQL / PostgreSQL", pct: 70 },
      ]},
    ],
  },
  {
    id: "writing", label: "Creativity", color: "#ffd21e", stars: 5,
    lines: ["I love to write", "I just love to make stories", "Everbody's good at something", "What's your story?"],
    groups: [
      { name: "Writing", skills: [
        { name: "Copywriting", pct: 65 }, { name: "Creative Writing", pct: 85 },
      ]},
      { name: "Core Skills", skills: [
        { name: "Critical Thinking", pct: 65 }, { name: "Problem Solving", pct: 60 },
        { name: "Adaptability", pct: 70 }, { name: "Research", pct: 80 },
        { name: "Time Management", pct: 75 },
      ]},
    ],
  },
  {
    id: "aidata", label: "AI & Data", color: "#b46bff", stars: 4,
    lines: ["I want a Robot", "Don't be afraid to use AI", "AI is the future", "A Robot dog, or a Robot cat?"],
    groups: [
      { name: "AI Training", skills: [
        { name: "LLM Evaluation", pct: 70 }, { name: "Data Annotation", pct: 75 },
        { name: "Benchmark Design", pct: 60 }, { name: "Linguistic AI Auditing", pct: 60 },
        { name: "Prompt Engineering", pct: 70 }, { name: "AI-assisted Development", pct: 80 },
      ]},
      { name: "Machine Learning", skills: [
        { name: "PyTorch", pct: 55 }, { name: "NumPy  ", pct: 70 }, 
        { name: "Data Visualization", pct: 80 }, { name: "Pandas", pct: 75 },
        { name: "CNNs (Computer Vision)", pct: 60 }, { name: "Scikit-learn", pct: 55 }, { name: "Streamlit", pct: 65 },

      ]},
    ],
  },
  {
    id: "prog", label: "Programming", color: "#ff8a3d", stars: 3,
    lines: ["I'm trying!", "It's never too late to study", "I'm doing my best."],
    groups: [
      { name: "Languages", skills: [
        { name: "JavaScript", pct: 70 }, { name: "TypeScript", pct: 60 }, { name: "Python", pct: 70 },
        { name: "Java", pct: 50 }, { name: "C", pct: 45 }, { name: "SQL", pct: 70 }, { name: "PHP", pct: 60 },
      ]},
    ],
  },
  {
    id: "design", label: "Design", color: "#ff6bb3", stars: 4,
    lines: ["I love editing", "I love research", "I'm an amateur to this"],
    groups: [
      { name: "Tools & Craft", skills: [
        { name: "Figma", pct: 60 }, { name: "Canva", pct: 80 },
        { name: "Pixel Art", pct: 70 }, { name: "UI/UX Research", pct: 80 },
        { name: "Capcut", pct: 65 },
      ]},
    ],
  },
  {
    id: "systools", label: "Systems & Tools", color: "#4ade80", stars: 3,
    lines: ["Not bad.", "Keep studying", "Trial and errors", "I love to learn new things"],
    groups: [
      { name: "Environment", skills: [
        { name: "Ubuntu / Linux", pct: 45 }, { name: "PowerShell", pct: 50 },
        { name: "XAMPP", pct: 50 }, { name: "Vercel", pct: 80 },
      ]},
    ],
  },
];



const N = CHARACTERS.length;
const mod = (i) => ((i % N) + N) % N;
const COOLDOWN_MS = 1000;

function JebbyVariant({ color }) {
  return (
    <svg viewBox="0 0 170 90" shapeRendering="crispEdges" className={styles.jebbySvg} aria-hidden="true">
      <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill={color} />
      <rect x="40" y="15" width="15" height="15" fill="black" />
      <rect x="115" y="15" width="15" height="15" fill="black" />
    </svg>
  );
}

function PixelStar({ on, color }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={styles.star} aria-hidden="true">
      <g fill={on ? color : "none"} stroke="var(--ink)" strokeWidth="1.5">
        <path d="M8 1 L10 6 L15 6 L11 9 L13 14 L8 11 L3 14 L5 9 L1 6 L6 6 Z" />
      </g>
    </svg>
  );
}

function Bar({ name, pct, color, delay }) {
  return (
    <div className={styles.barRow}>
      <span className={styles.barName}>{name}</span>
      <div className={styles.barTrack}>
        <motion.div
          className={styles.barFill}
          style={{ background: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <motion.span
        className={styles.barPct}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.55, duration: 0.3 }}
      >
        {pct}%
      </motion.span>
    </div>
  );
}

const stageVariants = {
  enter: (dir) => ({ x: dir > 0 ? 260 : -260, opacity: 0, scale: 0.8 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -260 : 260, opacity: 0, scale: 0.8 }),
};

export default function Skills() {
  const [[index, direction], setState] = useState([0, 0]);
  const [busy, setBusy] = useState(false);
  const [bubble, setBubble] = useState(null); // { id, text }
  const indexRef = useRef(0);
  const lastLineRef = useRef({}); // per-character last line index

  const paginate = (dir) => {
    if (busy) return;
    setBusy(true);
    setBubble(null); // the speaker is leaving, so the bubble goes too
    const next = mod(indexRef.current + dir);
    indexRef.current = next;
    setState([next, dir]);
    setTimeout(() => setBusy(false), COOLDOWN_MS);
  };

  const c = CHARACTERS[index];

  const talk = () => {
    if (busy) return; // mid-swap, ignore
    let i;
    do {
      i = Math.floor(Math.random() * c.lines.length);
    } while (i === lastLineRef.current[c.id] && c.lines.length > 1);
    lastLineRef.current[c.id] = i;
    setBubble({ id: Date.now(), text: c.lines[i] });
  };

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 2600);
    return () => clearTimeout(t);
  }, [bubble]);

  let barDelay = 0.25;

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.layout}>
        {/* character stage */}
        <div className={styles.stageCol}>
          <div className={styles.stageWrap}>
            <button
              className={styles.arrow}
              onClick={() => paginate(-1)}
              disabled={busy}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className={styles.stage}>
              <AnimatePresence>
                {bubble && (
                  <motion.div
                    key={bubble.id}
                    className={styles.bubble}
                    initial={{ opacity: 0, y: 8, scale: 0.8, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: 8, scale: 0.8, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    {bubble.text}
                  </motion.div>
                )}
              </AnimatePresence>

            <div className={styles.stageClip}>
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={c.id}
                    className={styles.stageChar}
                    custom={direction}
                    variants={stageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <button className={styles.charBtn} onClick={talk} aria-label={`Talk to ${c.label} Jebby`}>
                      <JebbyVariant color={c.color} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <button
              className={styles.arrow}
              onClick={() => paginate(1)}
              disabled={busy}
              aria-label="Next"
            >
              ›
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={c.id}
              className={styles.nameplate}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className={styles.charName}>{c.label}</h3>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PixelStar key={i} on={i < c.stars} color={c.color} />
                ))}
              </div>
              <div className={styles.dots}>
                {CHARACTERS.map((ch, i) => (
                  <span
                    key={ch.id}
                    className={`${styles.dot} ${i === index ? styles.dotOn : ""}`}
                    style={i === index ? { background: c.color } : undefined}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* skill bars */}
        <div className={styles.statsCol}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {c.groups.map((g) => (
                <div key={g.name} className={styles.group}>
                  <div className={styles.groupHead}>
                    <span className={styles.groupDot} style={{ background: c.color }} />
                    <span className={styles.groupName}>{g.name}</span>
                  </div>
                  {g.skills.map((s) => {
                    const d = barDelay;
                    barDelay += 0.08;
                    return <Bar key={s.name} name={s.name} pct={s.pct} color={c.color} delay={d} />;
                  })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <h2 className={styles.heading}>Skills</h2>
    </section>
  );
}