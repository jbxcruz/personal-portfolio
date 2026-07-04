"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./SectionNav.module.scss";

const NavContext = createContext(null);
export const useNav = () => useContext(NavContext);

// The path the user travels, as grid cells.
// Intro is top-left, About sits directly below it, Projects sits to About's right.
// Add more sections to the right by continuing the row: { id: "contact", col: 2, row: 1 }.
const CELLS = [
  { id: "intro", col: 0, row: 0 },
  { id: "about", col: 0, row: 1 },
  { id: "projects", col: 1, row: 1 },
];

const COOLDOWN = 750; // ms between moves, stops fast wheels/trackpads skipping sections

export default function SectionNav({ chrome, sections }) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [dims, setDims] = useState(() =>
    typeof window !== "undefined"
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 0, h: 0 }
  );
  const cooldownRef = useRef(0);
  const touchRef = useRef(null);

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = useCallback((delta) => {
    const next = Math.max(0, Math.min(CELLS.length - 1, indexRef.current + delta));
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
  }, []);

  const goTo = useCallback((i) => {
    const c = Math.max(0, Math.min(CELLS.length - 1, i));
    indexRef.current = c;
    setIndex(c);
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - cooldownRef.current < COOLDOWN) return;
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 6) return;
      cooldownRef.current = now;
      go(d > 0 ? 1 : -1);
    };
    const onKey = (e) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    const onTouchStart = (e) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e) => {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) > 45) {
        const primary = ay >= ax ? dy : dx;
        go(primary < 0 ? 1 : -1); // swipe up or left goes forward
      }
      touchRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  const cell = CELLS[index];
  const x = -cell.col * dims.w;
  const y = -cell.row * dims.h;

  const value = { index, activeId: cell.id, go, goTo, count: CELLS.length };

  return (
    <NavContext.Provider value={value}>
      {chrome}
      <div className={styles.viewport}>
        <motion.div
          className={styles.world}
          animate={{ x, y }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        >
          {CELLS.map((c, i) => (
            <div
              key={c.id}
              className={styles.cell}
              style={{ left: `${c.col * 100}vw`, top: `${c.row * 100}vh` }}
            >
              {sections[i]}
            </div>
          ))}
        </motion.div>
      </div>
    </NavContext.Provider>
  );
}