"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import styles from "./Certifications.module.scss";

const CERTS = [
  { id: "rwd", title: "Responsive Web Design", issuer: "freeCodeCamp", date: "Apr 20, 2025", hours: "300 hrs", color: "#4ade80", file: "certification-of-responsive-web-design.pdf" },
  { id: "jsads", title: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp", date: "Apr 19, 2025", hours: null, color: "#4ade80", file: "certification-of-javascript-algorithms-and-data-structures.pdf" },
  { id: "jslegacy", title: "Legacy JS Algorithms & Data Structures", issuer: "freeCodeCamp", date: "Apr 19, 2025", hours: null, color: "#4ade80", file: "certification-of-legacy-javascript-algorithms-and-data-structures.pdf" },
  { id: "dataviz", title: "Data Visualization", issuer: "freeCodeCamp", date: "Apr 20, 2025", hours: "300 hrs", color: "#4ade80", file: "certification-of-data-visualization.pdf" },
  { id: "tesda", title: "Developing Designs for User Interface", issuer: "TESDA", date: "Aug 5, 2025", hours: null, color: "#ffd21e", file: "dev_designs_User_Interface_TESDA.pdf" },
  { id: "slweb", title: "Web Development", issuer: "SoloLearn", date: "Apr 20, 2025", hours: null, color: "#3BB8E5", file: "courseCertificate-webDevelopment.pdf" },
  { id: "slhtml", title: "Introduction to HTML", issuer: "SoloLearn", date: "Sep 14, 2025", hours: null, color: "#3BB8E5", file: "courseCertificate-HTML.pdf" },
  { id: "slcss", title: "Introduction to CSS", issuer: "SoloLearn", date: "Sep 13, 2025", hours: null, color: "#3BB8E5", file: "courseCertificate-CSS.pdf" },
  { id: "sljs", title: "Introduction to JavaScript", issuer: "SoloLearn", date: "Sep 13, 2025", hours: null, color: "#3BB8E5", file: "courseCertificate-javaScript.pdf" },
];

const FILTERS = ["All", "freeCodeCamp", "SoloLearn", "TESDA"];


export default function Certifications() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [filter, setFilter] = useState("All");

  const shown = filter === "All" ? CERTS : CERTS.filter((c) => c.issuer === filter);

  return (
    <section ref={sectionRef} className={styles.certs} id="certs" data-scroll>
      <div className={styles.head}>
        <h2 className={styles.heading}>Certifications</h2>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.chip} ${filter === f ? styles.chipOn : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.grid} key={filter}>
          {shown.map((c, i) => (
            <motion.a
              key={c.id}
              className={styles.card}
              style={{ "--cert": c.color }}
              href={`/certs/${c.file}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.22, delay: inView ? i * 0.04 : 0 }}
              whileHover={{ y: -6 }}
            >
              <span className={styles.accent} />
              <div className={styles.cardHead}>
                <span className={styles.issuer}>{c.issuer}</span>
                {c.hours && <span className={styles.hours}>{c.hours}</span>}
              </div>
              <h3 className={styles.title}>{c.title}</h3>
              <div className={styles.cardFoot}>
                <span className={styles.date}>{c.date}</span>
                <span className={styles.open}>Open ↗</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}