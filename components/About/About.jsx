"use client";

import { motion } from "framer-motion";
import styles from "./About.module.scss";
import AboutFallMascot from "./AboutFallMascot";
import { useNav } from "@/components/SectionNav/SectionNav";

const block = {
  hidden: { opacity: 0, x: -90, transition: { duration: 0.25, ease: "easeIn" } },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

export default function About() {
  const nav = useNav();
  const active = nav?.activeId === "about";

  return (
    <section className={styles.about} id="about">
      <AboutFallMascot />

      <motion.div
        className={styles.inner}
        variants={block}
        initial="hidden"
        animate={active ? "show" : "hidden"}
      >
        <h2 className={styles.heading}>ABOUT ME</h2>
        <p className={styles.lead}>
          I&apos;m John Bert Cruz, a front-end developer, AI trainer, and writer
          based in Butuan City, Philippines.
        </p>
        <p className={styles.body}>
          I build clean, playful interfaces with React and Next.js, and I care
          about the small details that make a site feel alive. Alongside
          development, I work as an AI training and evaluation contractor,
          creating and reviewing tasks that help improve AI models, and I write
          on the side.
        </p>
        <div className={styles.tags}>
          <span>React</span>
          <span>Next.js</span>
          <span>JavaScript</span>
          <span>SCSS</span>
          <span>Framer Motion</span>
          <span>AI Training</span>
          <span>Writing</span>
        </div>
      </motion.div>

      <motion.button
        className={styles.nextCue}
        onClick={() => nav && nav.go(1)}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: active ? 0.6 : 0, duration: 0.5 }}
        aria-label="Go to Projects"
      >
        <span>Swipe right for more</span>
        <motion.span
          className={styles.cueArrow}
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          aria-hidden="true"
        >
          →
        </motion.span>
      </motion.button>
    </section>
  );
}