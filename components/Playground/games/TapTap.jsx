"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../Playground.module.scss";

const DIFFS = { Easy: { gap: 150, speed: 2.1 }, Normal: { gap: 125, speed: 2.6 }, Hard: { gap: 102, speed: 3.2 } };

export default function TapTap({ difficulty, onGameOver }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");
    const W = cvs.width, H = cvs.height;
    const cfg = DIFFS[difficulty] || DIFFS.Normal;

    const s = { y: H / 2, vy: 0, pipes: [], t: 0, score: 0, dead: false, started: false };
    const JX = 90, JW = 34, JH = 22;

    const flap = () => {
      if (s.dead) return;
      if (!s.started) { s.started = true; setStarted(true); }
      s.vy = -5.4;
    };
    const onKey = (e) => { if (e.key === " ") { e.preventDefault(); flap(); } };
    cvs.addEventListener("pointerdown", flap);
    window.addEventListener("keydown", onKey);

    const drawJebby = (y) => {
      ctx.fillStyle = "#3BB8E5";
      ctx.fillRect(JX, y, JW, JH);
      ctx.fillRect(JX - 6, y + 5, 6, 8);
      ctx.fillRect(JX + JW, y + 5, 6, 8);
      ctx.fillStyle = "#111";
      ctx.fillRect(JX + 7, y + 5, 5, 5);
      ctx.fillRect(JX + 22, y + 5, 5, 5);
    };

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.fillStyle = "#15161c";
      ctx.fillRect(0, 0, W, H);

      if (s.started && !s.dead) {
        s.vy += 0.28;
        s.y += s.vy;
        s.t += 1;
        if (s.t % Math.round(105 / cfg.speed) === 0) {
          const top = 40 + Math.random() * (H - cfg.gap - 80);
          s.pipes.push({ x: W, top, passed: false });
        }
        s.pipes.forEach((p) => { p.x -= cfg.speed; });
        s.pipes = s.pipes.filter((p) => p.x > -50);
      }

      ctx.fillStyle = "#ffd21e";
      s.pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, 42, p.top);
        ctx.fillRect(p.x, p.top + cfg.gap, 42, H);
      });
      drawJebby(s.y);

      if (s.started && !s.dead) {
        for (const p of s.pipes) {
          if (!p.passed && p.x + 42 < JX) { p.passed = true; s.score += 1; setScore(s.score); }
          const hitX = JX + JW > p.x && JX < p.x + 42;
          if (hitX && (s.y < p.top || s.y + JH > p.top + cfg.gap)) s.dead = true;
        }
        if (s.y < 0 || s.y + JH > H) s.dead = true;
        if (s.dead) {
          cancelAnimationFrame(raf);
          setTimeout(() => onGameOver(s.score), 250);
        }
      }

      if (!s.started) {
        ctx.fillStyle = "rgba(243,243,238,0.75)";
        ctx.font = "700 15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap or press Space to fly", W / 2, H / 2 - 60);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      cvs.removeEventListener("pointerdown", flap);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  return (
    <div className={styles.gameRow}>
      <div className={styles.sidePanel}>
        <span className={styles.sideLabel}>SCORE</span>
        <span className={styles.sideValue}>{score}</span>
        <span className={styles.sideHint}>{started ? "Keep tapping!" : "Tap / Space to start"}</span>
      </div>
      <canvas ref={canvasRef} width={430} height={330} className={styles.tapCanvas} />
    </div>
  );
}