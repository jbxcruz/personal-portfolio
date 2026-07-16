"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Education.module.scss";

const SCHOOLS = [
  {
    id: "shs",
    degree: "Senior High School Diploma",
    honor: "With Honors",
    school: "Agusan National High School – Senior High School",
    years: "2019 – 2021",
    color: "#CD7F32",
    status: "graduated",
    lines: ["I did it, with honors!", "Throw the cap!", "This was quarantine, but I still made it!", "Senior high school complete!"],
  },
  {
    id: "bsit",
    degree: "BS in Information Technology",
    honor: null,
    school: "Caraga State University – College of Computer and Information Sciences",
    years: "2021 – Present",
    color: "#3BB8E5",
    status: "ongoing",
    lines: ["Still studying!", "Thesis mode: ON", "Almost there...", "4th year grind!", "Learning and growing every day!"],
  },
];

function GradJebby({ color }) {
  return (
    <svg viewBox="0 0 170 130" shapeRendering="crispEdges" className={styles.jebbySvg} aria-hidden="true">
      {/* graduation cap */}
      <rect x="55" y="18" width="60" height="12" fill="#111" />
      <rect x="35" y="30" width="100" height="10" fill="#111" />
      <rect x="82" y="10" width="8" height="8" fill="#111" />
      {/* tassel */}
      <motion.g
        animate={{ x: [0, 4, 0, -3, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="126" y="30" width="6" height="22" fill="#ffd21e" />
        <rect x="124" y="52" width="10" height="8" fill="#ffbf00" />
      </motion.g>
      {/* body */}
      <g transform="translate(0,40)">
        <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill={color} />
        <rect x="40" y="15" width="15" height="15" fill="black" />
        <rect x="115" y="15" width="15" height="15" fill="black" />
      </g>
    </svg>
  );
}

function StudyJebby({ color }) {
  return (
    <svg viewBox="0 0 170 130" shapeRendering="crispEdges" className={styles.jebbySvg} aria-hidden="true">
      <g transform="translate(0,20)">
        <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill={color} />
        <rect x="40" y="15" width="15" height="15" fill="black" />
        <rect x="115" y="15" width="15" height="15" fill="black" />
      </g>
      {/* open book in front */}
      <g transform="translate(45,96)">
        <rect x="0" y="4" width="38" height="26" fill="#e14b4a" />
        <rect x="42" y="4" width="38" height="26" fill="#e14b4a" />
        <rect x="3" y="0" width="35" height="26" fill="#f7f2e9" />
        <rect x="42" y="0" width="35" height="26" fill="#f7f2e9" />
        <rect x="38" y="0" width="4" height="30" fill="#111" />
        <rect x="8" y="6" width="24" height="3" fill="#b4b2a9" />
        <rect x="8" y="12" width="24" height="3" fill="#b4b2a9" />
        <rect x="48" y="6" width="24" height="3" fill="#b4b2a9" />
        <rect x="48" y="12" width="24" height="3" fill="#b4b2a9" />
      </g>
      {/* pencil */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="140" y="78" width="8" height="30" fill="#ffd21e" />
        <rect x="140" y="70" width="8" height="8" fill="#ff6bb3" />
        <rect x="141" y="108" width="6" height="8" fill="#111" />
      </motion.g>
    </svg>
  );
}

function Medal() {
  return (
    <svg viewBox="0 0 24 32" shapeRendering="crispEdges" className={styles.medalSvg} aria-hidden="true">
      <rect x="8" y="0" width="8" height="10" fill="#e14b4a" />
      <rect x="6" y="10" width="12" height="12" fill="#ffd21e" />
      <rect x="9" y="13" width="6" height="6" fill="#ffbf00" />
    </svg>
  );
}

function Card({ s }) {
  const [bubble, setBubble] = useState(null);
  const lastRef = useRef(-1);

  const talk = () => {
    let i;
    do {
      i = Math.floor(Math.random() * s.lines.length);
    } while (i === lastRef.current && s.lines.length > 1);
    lastRef.current = i;
    setBubble({ id: Date.now(), text: s.lines[i] });
  };

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 2500);
    return () => clearTimeout(t);
  }, [bubble]);

  return (
    <div className={styles.card} style={{ "--edu": s.color }}>
      {s.honor && (
        <div className={styles.honor}>
          <Medal />
          <span>{s.honor}</span>
        </div>
      )}

      <div className={styles.charZone}>
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

        <button className={styles.charBtn} onClick={talk} aria-label={`Talk to ${s.degree} Jebby`}>
          {s.status === "graduated" ? <GradJebby color={s.color} /> : <StudyJebby color={s.color} />}
        </button>
      </div>

      <h3 className={styles.degree}>{s.degree}</h3>
      <p className={styles.school}>{s.school}</p>

      {s.status === "graduated" ? (
        <span className={styles.years}>{s.years}</span>
      ) : (
        <div className={styles.progressWrap}>
          <span className={styles.years}>{s.years}</span>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: "0%" }}
              whileInView={{ width: "82%" }}
              viewport={{ once: false }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className={styles.loading}>
            Loading degree
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              _
            </motion.span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function Education() {
  return (
    <section className={styles.education} id="education" data-scroll>
      <h2 className={styles.heading}>Education</h2>
      <div className={styles.cards}>
        {SCHOOLS.map((s) => (
          <Card key={s.id} s={s} />
        ))}
      </div>
    </section>
  );
}