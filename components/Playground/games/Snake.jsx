"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../Playground.module.scss";

const GRID = 17;
const SPEEDS = { Easy: 170, Normal: 115, Hard: 75 };

export default function Snake({ difficulty, onGameOver }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");
    const cell = cvs.width / GRID;

    const s = {
      snake: [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 12, y: 8 },
      score: 0,
      dead: false,
      started: false,
    };

    const placeFood = () => {
      do {
        s.food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
      } while (s.snake.some((p) => p.x === s.food.x && p.y === s.food.y));
    };

    const setDir = (x, y) => {
      if (x === -s.dir.x && y === -s.dir.y) return;
      s.nextDir = { x, y };
      if (!s.started) {
        s.started = true;
        setStarted(true);
      }
    };

    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "w" || e.key === "ArrowUp") { e.preventDefault(); setDir(0, -1); }
      else if (k === "s" || e.key === "ArrowDown") { e.preventDefault(); setDir(0, 1); }
      else if (k === "a" || e.key === "ArrowLeft") { e.preventDefault(); setDir(-1, 0); }
      else if (k === "d" || e.key === "ArrowRight") { e.preventDefault(); setDir(1, 0); }
    };
    window.addEventListener("keydown", onKey);
    cvs.dpad = setDir;

    const draw = () => {
      ctx.fillStyle = "#15161c";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "#ffd21e";
      ctx.fillRect(s.food.x * cell + 2, s.food.y * cell + 2, cell - 4, cell - 4);
      s.snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#3BB8E5" : "#2b93bd";
        ctx.fillRect(p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2);
      });
      const h = s.snake[0];
      ctx.fillStyle = "#111";
      ctx.fillRect(h.x * cell + cell * 0.22, h.y * cell + cell * 0.25, cell * 0.16, cell * 0.16);
      ctx.fillRect(h.x * cell + cell * 0.62, h.y * cell + cell * 0.25, cell * 0.16, cell * 0.16);
    };

    const tick = () => {
      if (s.dead || !s.started) return; // waits for the player's first move
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (
        head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
        s.snake.some((p) => p.x === head.x && p.y === head.y)
      ) {
        s.dead = true;
        clearInterval(id);
        onGameOver(s.score);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 1;
        setScore(s.score);
        placeFood();
      } else {
        s.snake.pop();
      }
      draw();
    };

    draw();
    const id = setInterval(tick, SPEEDS[difficulty] || SPEEDS.Normal);
    return () => {
      clearInterval(id);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const dpad = (x, y) => canvasRef.current?.dpad?.(x, y);

  return (
    <div className={styles.gameRow}>
      <div className={styles.sidePanel}>
        <span className={styles.sideLabel}>SCORE</span>
        <span className={styles.sideValue}>{score}</span>
        <span className={styles.sideHint}>{started ? "WASD to steer" : "Press WASD to start"}</span>
      </div>
      <canvas ref={canvasRef} width={320} height={320} className={styles.canvas} />
      <div className={styles.dpad}>
        <button onClick={() => dpad(0, -1)} aria-label="Up">▲</button>
        <div>
          <button onClick={() => dpad(-1, 0)} aria-label="Left">◀</button>
          <button onClick={() => dpad(0, 1)} aria-label="Down">▼</button>
          <button onClick={() => dpad(1, 0)} aria-label="Right">▶</button>
        </div>
      </div>
    </div>
  );
}