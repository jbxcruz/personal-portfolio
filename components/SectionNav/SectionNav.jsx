"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./SectionNav.module.scss";

const NavContext = createContext(null);
export const useNav = () => useContext(NavContext);

const CELLS = [
  { id: "intro",      col:  0, row: 0 },  // start
  { id: "about",      col:  0, row: 1 },  // down
  { id: "projects",   col:  1, row: 1 },  // right
  { id: "skills",     col:  1, row: 2 },  // down
  { id: "experience", col:  0, row: 2 },  // left
  { id: "education",  col: -1, row: 2 },  // left
  { id: "certs",      col: -1, row: 3 },  // down
  { id: "playground", col:  0, row: 3 },  // right
  { id: "contact",    col:  0, row: 4 },  // down
];

const COOLDOWN = 1000;

export default function SectionNav({ chrome, sections }) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [dims, setDims] = useState({ w: 0, h: 0 }); // same on server & client: no hydration mismatch
  const cooldownRef = useRef(0);
  const touchRef = useRef(null);
  const lockedRef = useRef(false);

  const setLocked = useCallback((v) => { lockedRef.current = !!v; }, []);

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
    const scrollableFrom = (target) => {
      const el = target?.closest?.("[data-scroll]");
      return el && el.scrollHeight > el.clientHeight + 1 ? el : null;
    };

    const onWheel = (e) => {
      const sc = scrollableFrom(e.target);
      if (sc) {
        const atTop = sc.scrollTop <= 0 && e.deltaY < 0;
        const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1 && e.deltaY > 0;
        if (!atTop && !atBottom) return; // let the inner area scroll natively
      }
      e.preventDefault();
      if (lockedRef.current) return;
      const now = Date.now();
      if (now - cooldownRef.current < COOLDOWN) return;
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 6) return;
      cooldownRef.current = now;
      go(d > 0 ? 1 : -1);
    };
const onKey = (e) => {
      if (lockedRef.current) return;
      const now = Date.now();
      if (now - cooldownRef.current < COOLDOWN) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        cooldownRef.current = now;
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        cooldownRef.current = now;
        go(-1);
      }
    };
    const onTouchStart = (e) => {
      touchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        inScroll: !!scrollableFrom(e.target),
      };
    };
    const onTouchEnd = (e) => {
      if (lockedRef.current) return;
      if (!touchRef.current) return;
      const { x, y, inScroll } = touchRef.current;
      touchRef.current = null;
      if (inScroll) return; // finger was scrolling content, not navigating
      const dx = e.changedTouches[0].clientX - x;
      const dy = e.changedTouches[0].clientY - y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) > 45) {
        const now = Date.now();
        if (now - cooldownRef.current < COOLDOWN) return;
        cooldownRef.current = now;
        const primary = ay >= ax ? dy : dx;
        go(primary < 0 ? 1 : -1);
      }
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
  const measured = dims.w > 0;
  const x = measured ? -cell.col * dims.w : 0;
  const y = measured ? -cell.row * dims.h : 0;

  const value = { index, activeId: cell.id, go, goTo, count: CELLS.length, setLocked, cells: CELLS };

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
              style={{
                left: measured ? c.col * dims.w : `${c.col * 100}vw`,
                top: measured ? c.row * dims.h : `${c.row * 100}vh`,
                width: measured ? dims.w : "100vw",
                height: measured ? dims.h : "100vh",
              }}
            >
              {sections[i]}
            </div>
          ))}
        </motion.div>
      </div>
    </NavContext.Provider>
  );
}