"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import styles from "./ProjectsMascot.module.scss";
import { useNav } from "@/components/SectionNav/SectionNav";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const FRAME_MS = 90;          // portal frame duration
const INTRO_SPEED_VH = 0.95 / 0.6; // intro fall: 0.95 viewport heights per 0.6s

const VB = "31 112 248 129"; // shared crop for every portal frame

function Portal1() {
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="139" y="146" width="30" height="15" fill="black" />
    </svg>
  );
}
function Portal2() {
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="124" y="146" width="60" height="15" fill="black" />
      <rect x="139" y="131" width="30" height="15" fill="black" />
      <rect x="139" y="161" width="30" height="15" fill="black" />
      <rect x="154" y="146" width="15" height="15" fill="#530891" />
    </svg>
  );
}
function Portal3() {
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="94" y="146" width="120" height="15" fill="black" />
      <rect x="114" y="161" width="80" height="15" fill="black" />
      <rect x="114" y="131" width="80" height="15" fill="black" />
      <rect x="204" y="116" width="15" height="15" fill="#530891" />
      <rect x="114" y="131" width="30" height="15" fill="#530891" />
      <rect x="164" y="161" width="30" height="15" fill="#530891" />
    </svg>
  );
}
function PortalFull() {
  // Identical portal art shared by opening-4, opening-5 (portal part), and closing-1
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="35" y="146" width="240" height="15" fill="black" />
      <rect x="75" y="131" width="160" height="15" fill="black" />
      <rect x="75" y="161" width="160" height="15" fill="black" />
      <rect x="42" y="176" width="15" height="15" fill="#530891" />
      <rect x="187" y="131" width="15" height="15" fill="#530891" />
      <rect x="250" y="124" width="15" height="15" fill="black" />
      <rect x="75" y="131" width="30" height="15" fill="#530891" />
      <rect x="75" y="161" width="30" height="15" fill="#530891" />
      <rect x="155" y="161" width="80" height="15" fill="#530891" />
    </svg>
  );
}
function Portal5() {
  // opening-5 as authored: portal + mascot peeking through
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="35" y="146" width="240" height="15" fill="black" />
      <rect x="75" y="131" width="160" height="15" fill="black" />
      <rect x="75" y="161" width="160" height="15" fill="black" />
      <rect x="42" y="176" width="15" height="15" fill="#530891" />
      <rect x="187" y="131" width="15" height="15" fill="#530891" />
      <rect x="250" y="124" width="15" height="15" fill="black" />
      <rect x="75" y="131" width="30" height="15" fill="#530891" />
      <rect x="75" y="161" width="30" height="15" fill="#530891" />
      <rect x="155" y="161" width="80" height="15" fill="#530891" />
      <rect x="207" y="161" width="15" height="15" fill="#3BB8E5" />
      <rect x="87" y="176" width="15" height="15" fill="#3BB8E5" />
      <rect x="87" y="146" width="120" height="15" fill="#3BB8E5" />
      <rect x="87" y="161" width="120" height="15" fill="#3BB8E5" />
    </svg>
  );
}
function Portal6() {
  // opening-6 as authored: full portal + mascot bursting out
  return (
    <svg className={styles.portalSvg} viewBox={VB} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="35" y="146" width="240" height="15" fill="black" />
      <rect x="75" y="131" width="160" height="15" fill="black" />
      <rect x="75" y="161" width="160" height="15" fill="black" />
      <rect x="42" y="176" width="15" height="15" fill="#530891" />
      <rect x="187" y="131" width="15" height="15" fill="#530891" />
      <rect x="250" y="124" width="15" height="15" fill="black" />
      <rect x="75" y="131" width="30" height="15" fill="#530891" />
      <rect x="75" y="161" width="30" height="15" fill="#530891" />
      <rect x="155" y="161" width="80" height="15" fill="#530891" />
      <rect x="215" y="207" width="15" height="15" fill="#3BB8E5" />
      <rect x="95" y="222" width="15" height="15" fill="#3BB8E5" />
      <rect x="80" y="177" width="15" height="15" fill="#3BB8E5" />
      <rect x="65" y="162" width="15" height="15" fill="#3BB8E5" />
      <rect x="65" y="147" width="15" height="15" fill="#3BB8E5" />
      <rect x="215" y="162" width="15" height="15" fill="#3BB8E5" />
      <rect x="230" y="147" width="15" height="15" fill="#3BB8E5" />
      <rect x="230" y="132" width="15" height="15" fill="#3BB8E5" />
      <rect x="95" y="147" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="162" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="177" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="192" width="120" height="15" fill="#3BB8E5" />
      <rect x="95" y="207" width="120" height="15" fill="#3BB8E5" />
      <rect x="110" y="162" width="15" height="15" fill="black" />
      <rect x="185" y="162" width="15" height="15" fill="black" />
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

function IdleSVG() {
  return (
    <svg className={`${styles.svg} ${styles.idle}`} viewBox="0 0 170 90" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill="#3BB8E5" />
      <rect x="40" y="15" width="15" height="15" fill="black" />
      <rect x="115" y="15" width="15" height="15" fill="black" />
    </svg>
  );
}

const OPENING = [Portal1, Portal2, Portal3, PortalFull, Portal5, Portal6];
const CLOSING = [PortalFull, PortalFull, PortalFull, Portal3, Portal2, Portal1]; // closing-1, 5 (mascot stripped), 4, 3, 2, 1

export default function ProjectsMascot() {
  const nav = useNav();
  const active = nav?.activeId === "projects";
  const [portalFrame, setPortalFrame] = useState(-1); // -1 hidden; 0..5 opening; 10..15 closing
  const [phase, setPhase] = useState("hidden");       // hidden | falling | splat | idle
  const pos = useAnimationControls();
  const runIdRef = useRef(0);
  const shownRef = useRef(false);
  const portalRef = useRef(null);
  const colRef = useRef(null);

  useEffect(() => {
    if (active) {
      shownRef.current = true;
      const myRun = ++runIdRef.current;
      nav?.setLocked?.(true);
      (async () => {
        setPhase("hidden");
        // Opening frames 1..6
        for (let i = 0; i < OPENING.length; i++) {
          if (runIdRef.current !== myRun) return;
          setPortalFrame(i);
          await wait(FRAME_MS);
        }
        if (runIdRef.current !== myRun) return;

        // Frame 6 done: spawn the falling mascot from the portal and start closing simultaneously.
        const pRect = portalRef.current?.getBoundingClientRect();
        const cRect = colRef.current?.getBoundingClientRect();
        const startY = pRect && cRect ? pRect.bottom - cRect.bottom : -window.innerHeight * 0.5;
        // Same speed as the intro: 0.95vh per 0.6s, duration scaled to this fall's distance.
        const fallDuration = Math.abs(startY) / (INTRO_SPEED_VH * window.innerHeight);

        setPhase("falling");
        pos.set({ x: 0, y: startY });

        const closing = (async () => {
          for (let i = 0; i < CLOSING.length; i++) {
            if (runIdRef.current !== myRun) return;
            setPortalFrame(10 + i);
            await wait(FRAME_MS);
          }
          if (runIdRef.current !== myRun) return;
          setPortalFrame(-1);
        })();

        await pos.start({ y: 0, transition: { duration: fallDuration, ease: "easeIn" } });
        if (runIdRef.current !== myRun) return;
        setPhase("splat");
        await wait(200);
        if (runIdRef.current !== myRun) return;
        setPhase("idle"); // plain standing, no bob, matching the intro
        await closing;
        if (runIdRef.current !== myRun) return;
        nav?.setLocked?.(false);
      })();
    } else {
      const myRun = ++runIdRef.current;
      nav?.setLocked?.(false);
      setPortalFrame(-1);
      if (!shownRef.current) {
        setPhase("hidden");
        return;
      }
      (async () => {
        pos.stop();
        await pos.start({ y: window.innerHeight * 0.55, transition: { duration: 0.5, ease: "easeIn" } });
        if (runIdRef.current !== myRun) return;
        shownRef.current = false;
        setPhase("hidden");
        pos.set({ x: 0, y: 0 });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const PortalNow =
    portalFrame >= 10 ? CLOSING[portalFrame - 10] : portalFrame >= 0 ? OPENING[portalFrame] : null;

  return (
    <div className={styles.stage} aria-hidden="true">
      <div ref={portalRef} className={styles.portalPos}>
        {PortalNow && <PortalNow />}
      </div>

      <div ref={colRef} className={styles.mascotCol}>
        <motion.div className={styles.faller} animate={pos} initial={{ x: 0, y: 0 }}>
          {phase === "falling" && <FallingSVG />}
          {phase === "splat" && <SplatSVG />}
          {phase === "idle" && <IdleSVG />}
        </motion.div>
      </div>
    </div>
  );
}