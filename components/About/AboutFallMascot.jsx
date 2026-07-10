"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import styles from "./AboutFallMascot.module.scss";
import { useNav } from "@/components/SectionNav/SectionNav";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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

function Group8SVG() {
  return (
    <svg className={`${styles.svg} ${styles.standing}`} viewBox="0 0 177 214" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="177" height="113" fill="#6F787B" />
      <rect x="29" y="124" width="120" height="15" fill="#3BB8E5" />
      <rect x="29" y="184" width="120" height="15" fill="#3BB8E5" />
      <rect x="29" y="169" width="120" height="15" fill="#3BB8E5" />
      <rect x="29" y="199" width="15" height="15" fill="#3BB8E5" />
      <rect x="134" y="199" width="15" height="15" fill="#3BB8E5" />
      <rect x="29" y="139" width="120" height="15" fill="#3BB8E5" />
      <rect x="29" y="154" width="120" height="15" fill="#3BB8E5" />
      <rect x="44" y="139" width="15" height="15" fill="black" />
      <rect x="119" y="139" width="15" height="15" fill="black" />
      <rect x="9" y="94" width="15" height="45" fill="#3BB8E5" />
      <rect x="153" y="102" width="15" height="30" fill="#3BB8E5" />
      <rect x="58" y="26.6582" width="9.20792" height="17.2532" fill="black" />
      <rect x="110.792" y="34.9874" width="9.20792" height="17.2532" fill="black" />
      <rect x="92.9901" y="52.2405" width="9.20792" height="17.2532" fill="black" />
      <rect x="75.802" y="61.1645" width="17.1881" height="17.2532" fill="black" />
      <rect x="75.802" y="86.7468" width="17.1881" height="17.2532" fill="black" />
      <rect x="102.198" y="34.9874" width="9.20792" height="34.5063" fill="black" />
      <rect x="66.594" y="18.3292" width="9.20792" height="25.5823" fill="black" />
      <rect x="75.802" y="10" width="9.20792" height="25.5823" fill="black" />
      <rect x="84.396" y="10" width="17.802" height="8.32911" fill="black" />
      <rect x="84.396" y="18.3292" width="26.396" height="8.32911" fill="black" />
      <rect x="92.9901" y="26.6582" width="27.0099" height="8.32911" fill="black" />
    </svg>
  );
}

export default function AboutFallMascot() {
  const nav = useNav();
  const active = nav?.activeId === "about";
  const [phase, setPhase] = useState("hidden");
  const body = useAnimationControls();
  const runIdRef = useRef(0);

  useEffect(() => {
    if (active) {
      nav?.setLocked?.(true);
      const myRun = ++runIdRef.current;
      (async () => {
        const startY = -(window.innerHeight * 0.95);
        setPhase("falling");
        body.set({ x: 0, opacity: 1, y: startY });
        await wait(150);
        if (runIdRef.current !== myRun) return;
        await body.start({ y: 0, transition: { duration: 0.6, ease: "easeIn" } });
        if (runIdRef.current !== myRun) return;
        setPhase("splat");
        await wait(200);
        if (runIdRef.current !== myRun) return;
        setPhase("standing");
        await body.start({ y: [-6, 0], transition: { duration: 0.28, ease: "easeOut" } });
        if (runIdRef.current !== myRun) return;
        await wait(1000);
        if (runIdRef.current !== myRun) return;
        nav?.setLocked?.(false);
      })();
    } else {
      nav?.setLocked?.(false);
      const myRun = ++runIdRef.current;
      (async () => {
        await body.start({ x: -200, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } });
        if (runIdRef.current !== myRun) return;
        setPhase("hidden");
        body.set({ x: 0, opacity: 1, y: -900 });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <motion.div className={styles.faller} animate={body} initial={{ y: -900 }}>
        {phase === "falling" && <FallingSVG />}
        {phase === "splat" && <SplatSVG />}
        {phase === "standing" && <Group8SVG />}
      </motion.div>
    </div>
  );
}