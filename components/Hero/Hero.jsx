"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Hero.module.scss";
import Mascot from "@/components/Mascot/Mascot";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useNav } from "@/components/SectionNav/SectionNav";

export default function Hero() {
  const nav = useNav();
  const [trigger, setTrigger] = useState(0);
  const [fallSignal, setFallSignal] = useState(0);
  const titleControls = useAnimationControls();
  const subheadControls = useAnimationControls();

  // Every time Intro becomes active: drop the mascot again and replay the text entrance.
  useEffect(() => {
      if (nav?.activeId === "intro") {
        nav?.setLocked?.(true);
        setFallSignal((s) => s + 1);
      titleControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
      });
      subheadControls.set({ opacity: 0, y: 12 });
      subheadControls.start({
        opacity: 0.75,
        y: 0,
        transition: { delay: 0.5, duration: 0.5 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav?.activeId]);

  return (
    <section className={styles.hero} onClick={() => setTrigger((t) => t + 1)}>
      <ThemeToggle />

      <div className={styles.scrollWrap}>
        <div className={styles.nameWrap}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={titleControls}
          >
            JEB
            <span className={styles.perch}>
              B
              <span className={styles.mascotSlot}>
                <Mascot trigger={trigger} fallSignal={fallSignal} onReady={() => nav?.setLocked?.(false)} />
              </span>
            </span>
            Y
          </motion.h1>
        </div>

        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 12 }}
          animate={subheadControls}
        >
          My personal portfolio
        </motion.p>
      </div>

      <motion.button
        className={styles.scrollCue}
        onClick={(e) => {
          e.stopPropagation();
          nav && nav.go(1);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        aria-label="Go to next section"
      >
        <span>Scroll down for more</span>
        <motion.span
          className={styles.cueArrow}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </motion.button>
    </section>
  );
}