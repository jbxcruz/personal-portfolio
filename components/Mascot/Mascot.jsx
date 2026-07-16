"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import styles from "./Mascot.module.scss";

const MESSAGES = [
  "Hello, I'm Jebby!",
  "Welcome to my portfolio.",
  "Scroll down to see my work.",
  "Thanks for stopping by!",
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function StandingSVG() {
  return (
    <svg className={`${styles.svg} ${styles.standing}`} viewBox="0 0 170 90" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill="#3BB8E5" />
      <rect x="40" y="15" width="15" height="15" fill="black" />
      <rect x="115" y="15" width="15" height="15" fill="black" />
    </svg>
  );
}

function FallingSVG() {
  return (
    <svg className={`${styles.svg} ${styles.falling}`} viewBox="65 74 180 160" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="215" y="204" width="15" height="15" fill="#3BB8E5" />
      <rect x="95" y="219" width="15" height="15" fill="#3BB8E5" />
      <rect x="80" y="174" width="15" height="15" fill="#3BB8E5" />
      <rect x="65" y="159" width="15" height="15" fill="#3BB8E5" />
      <rect x="65" y="144" width="15" height="15" fill="#3BB8E5" />
      <rect x="215" y="159" width="15" height="15" fill="#3BB8E5" />
      <rect x="230" y="144" width="15" height="15" fill="#3BB8E5" />
      <rect x="230" y="129" width="15" height="15" fill="#3BB8E5" />
      <rect x="95" y="144" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="159" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="174" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="189" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="204" width="120" height="15" fill="#3BB8E5" />
      <rect x="110" y="159" width="15" height="15" fill="black" />
      <rect x="185" y="159" width="15" height="15" fill="black" />
    </svg>
  );
}

function SplatSVG() {
  return (
    <svg className={`${styles.svg} ${styles.splat}`} viewBox="60 117 190 75" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="95" y="117" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="132" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="147" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="162" width="120" height="15" fill="#3BB8E5" />
      <rect x="60" y="177" width="190" height="15" fill="#3BB8E5" />
      <rect x="110" y="132" width="30" height="10" fill="black" />
      <rect x="170" y="132" width="30" height="10" fill="black" />
    </svg>
  );
}

export default function Mascot({ trigger = 0, fallSignal = 0, onReady }) {
  const [phase, setPhase] = useState("falling"); // falling | splat | standing | ready
  const [bubble, setBubble] = useState(null);
  const body = useAnimationControls();
  const wrapRef = useRef(null);
  const runIdRef = useRef(0);
  const readyRef = useRef(false);

  // Fall + splat + stand, on first load and on every scroll-return.
  useEffect(() => {
    if (!fallSignal) return;
    const myRun = ++runIdRef.current;
    readyRef.current = false;
    setBubble(null);

    async function sequence() {
      // Start a fixed height above the resting spot (about one screen up),
      // based on the viewport so it is identical on first load and on return.
      const startY = -(window.innerHeight * 0.95);

      setPhase("falling");
      body.set({ y: startY });
      await wait(150); // beat so the name settles / the scroll snap finishes
      if (runIdRef.current !== myRun) return;

      await body.start({ y: 0, transition: { duration: 1, ease: "easeIn" } });
      if (runIdRef.current !== myRun) return;

      setPhase("splat");
      await wait(400);
      if (runIdRef.current !== myRun) return;

      setPhase("standing");
      await body.start({ y: [-6, 0], transition: { duration: 0.28, ease: "easeOut" } });
      if (runIdRef.current !== myRun) return;

      // navigation unlocks as soon as Jebby lands; swipes shouldn't feel dead
      onReady?.();

      await wait(1000); // hold before clicks are allowed
      if (runIdRef.current !== myRun) return;

      readyRef.current = true;
      setPhase("ready");
    }

    sequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallSignal]);

  // Click anywhere on the intro, only once standing and past the 1s hold.
  useEffect(() => {
    if (!trigger || !readyRef.current) return;
    body.start({
      y: [0, -22, 0, -7, 0],
      transition: { duration: 0.7, ease: "easeOut", times: [0, 0.28, 0.5, 0.72, 1] },
    });
    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble({ id: Date.now(), text });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 2500);
    return () => clearTimeout(t);
  }, [bubble]);

  const showStanding = phase === "standing" || phase === "ready";

  return (
    <div className={styles.wrap} ref={wrapRef}>
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

      <motion.div className={styles.faller} animate={body} initial={{ y: -900 }}>
        {phase === "falling" && <FallingSVG />}
        {phase === "splat" && <SplatSVG />}
        {showStanding && <StandingSVG />}
      </motion.div>
    </div>
  );
}