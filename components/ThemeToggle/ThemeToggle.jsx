"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ThemeToggle.module.scss";

function Sun({ awake }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      className={styles.icon}
      animate={
        awake
          ? { scale: 1, opacity: 1, rotate: [0, -12, 0] }
          : { scale: 0.82, opacity: 0.45, rotate: 0 }
      }
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 18 },
        opacity: { duration: 0.3 },
        rotate: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      <g fill="#ffcf24">
        <rect x="22" y="1" width="4" height="7" rx="1.5" />
        <rect x="22" y="40" width="4" height="7" rx="1.5" />
        <rect x="1" y="22" width="7" height="4" rx="1.5" />
        <rect x="40" y="22" width="7" height="4" rx="1.5" />
        <rect x="8" y="8" width="5" height="5" rx="1.5" />
        <rect x="35" y="8" width="5" height="5" rx="1.5" />
        <rect x="8" y="35" width="5" height="5" rx="1.5" />
        <rect x="35" y="35" width="5" height="5" rx="1.5" />
      </g>
      <rect x="13" y="13" width="22" height="22" rx="6" fill="#ffd21e" stroke="#1b1b1b" strokeWidth="2" />
      {awake ? (
        <g fill="#1b1b1b">
          <rect x="19" y="20" width="4" height="5" rx="1" />
          <rect x="25" y="20" width="4" height="5" rx="1" />
        </g>
      ) : (
        <g fill="#1b1b1b">
          <rect x="19" y="24" width="4" height="2" rx="1" />
          <rect x="25" y="24" width="4" height="2" rx="1" />
        </g>
      )}
    </motion.svg>
  );
}

function Moon({ awake }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      className={styles.icon}
      animate={
        awake
          ? { scale: 1, opacity: 1, rotate: [0, 12, 0] }
          : { scale: 0.82, opacity: 0.45, rotate: 0 }
      }
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 18 },
        opacity: { duration: 0.3 },
        rotate: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      <rect x="12" y="12" width="24" height="24" rx="9" fill="#cdd6ea" stroke="#2a2f45" strokeWidth="2" />
      <g fill="#a9b4d2">
        <circle cx="18" cy="30" r="2.2" />
        <circle cx="30" cy="31" r="1.6" />
        <circle cx="31" cy="19" r="1.8" />
      </g>
      {awake ? (
        <g fill="#2a2f45">
          <rect x="18" y="20" width="4" height="5" rx="1" />
          <rect x="26" y="20" width="4" height="5" rx="1" />
        </g>
      ) : (
        <g fill="#2a2f45">
          <rect x="18" y="24" width="4" height="2" rx="1" />
          <rect x="26" y="24" width="4" height="2" rx="1" />
        </g>
      )}
    </motion.svg>
  );
}

const toggleVariants = {
  hidden: { y: -140, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 26 } },
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [shown, setShown] = useState(true);

  // On first mount, adopt whatever the pre-paint script already set (from localStorage).
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  // Whenever theme changes, apply it and remember it.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      // Shown only while near the top (the intro). Leaves and returns immediately.
      setShown(window.scrollY < window.innerHeight * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = theme === "light";

  return (
    <>
      <motion.button
        className={`${styles.corner} ${styles.left} ${isLight ? styles.glowBlue : ""}`}
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark mode"
        variants={toggleVariants}
        initial="hidden"
        animate={shown ? "show" : "hidden"}
      >
        <Moon awake={!isLight} />
      </motion.button>

      <motion.button
        className={`${styles.corner} ${styles.right} ${isLight ? "" : styles.glowWarm}`}
        onClick={() => setTheme("light")}
        aria-label="Switch to light mode"
        variants={toggleVariants}
        initial="hidden"
        animate={shown ? "show" : "hidden"}
      >
        <Sun awake={isLight} />
      </motion.button>
    </>
  );
}