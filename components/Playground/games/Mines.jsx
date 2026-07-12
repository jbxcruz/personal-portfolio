"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../Playground.module.scss";

const DIFFS = { Easy: { n: 8, mines: 9 }, Normal: { n: 10, mines: 16 }, Hard: { n: 12, mines: 26 } };
const NUM_COLORS = ["", "#3BB8E5", "#4ade80", "#ff8a3d", "#ff6bb3", "#e14b4a", "#b46bff", "#ffd21e", "#f3f3ee"];

export default function Mines({ difficulty, onGameOver }) {
  const { n, mines } = DIFFS[difficulty] || DIFFS.Normal;
  const [board, setBoard] = useState([]);
  const [flagMode, setFlagMode] = useState(false);
  const [time, setTime] = useState(0);
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setBoard(Array.from({ length: n * n }, () => ({ mine: false, open: false, flag: false, adj: 0 })));
    startedRef.current = false;
    doneRef.current = false;
    setTime(0);
    return () => clearInterval(timerRef.current);
  }, [n, mines]);

  const idx = (r, c) => r * n + c;
  const neighbors = (i) => {
    const r = Math.floor(i / n), c = i % n, out = [];
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n) out.push(idx(nr, nc));
      }
    return out;
  };

  const plant = (b, safe) => {
    const banned = new Set([safe, ...neighbors(safe)]);
    let placed = 0;
    while (placed < mines) {
      const i = Math.floor(Math.random() * n * n);
      if (b[i].mine || banned.has(i)) continue;
      b[i].mine = true;
      placed++;
    }
    b.forEach((cell, i) => { cell.adj = neighbors(i).filter((j) => b[j].mine).length; });
  };

  const finish = (won, b) => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(timerRef.current);
    if (won) onGameOver(time);
    else {
      b.forEach((c) => { if (c.mine) c.open = true; });
      setBoard([...b]);
      setTimeout(() => onGameOver(null), 900); // loss: no score saved
    }
  };

  const click = (i) => {
    if (doneRef.current) return;
    const b = board.map((c) => ({ ...c }));
    const cell = b[i];
    if (cell.open) return;

    if (flagMode) {
      cell.flag = !cell.flag;
      setBoard(b);
      return;
    }
    if (cell.flag) return;

    if (!startedRef.current) {
      startedRef.current = true;
      plant(b, i);
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }

    if (cell.mine) {
      cell.open = true;
      finish(false, b);
      return;
    }

    const stack = [i];
    while (stack.length) {
      const j = stack.pop();
      if (b[j].open || b[j].flag) continue;
      b[j].open = true;
      if (b[j].adj === 0 && !b[j].mine) neighbors(j).forEach((k) => { if (!b[k].open) stack.push(k); });
    }
    setBoard(b);
    if (b.every((c) => c.open || c.mine)) finish(true, b);
  };

  const cellPx = n <= 8 ? 36 : n <= 10 ? 30 : 26;

  return (
    <div className={styles.gameRow}>
      <div className={styles.sidePanel}>
        <span className={styles.sideLabel}>TIME</span>
        <span className={styles.sideValue}>{time}s</span>
        <div className={styles.mineTools}>
          <button
            className={`${styles.paTool} ${flagMode ? styles.paToolOn : ""}`}
            onClick={() => setFlagMode((f) => !f)}
            aria-label="Toggle flag mode"
            title="Flag mode"
          >
            ⚑
          </button>
        </div>
        <span className={styles.sideHint}>{flagMode ? "Tap to flag" : "Tap to reveal"}</span>
      </div>
      <div className={styles.mineGrid} style={{ gridTemplateColumns: `repeat(${n}, ${cellPx}px)` }}>
        {board.map((c, i) => (
          <button
            key={i}
            className={`${styles.mineCell} ${c.open ? (c.mine ? styles.mineBoom : styles.mineOpen) : c.flag ? styles.mineFlag : ""}`}
            onClick={() => click(i)}
            onContextMenu={(e) => { e.preventDefault(); if (!c.open && !doneRef.current) { const b = board.map((x) => ({ ...x })); b[i].flag = !b[i].flag; setBoard(b); } }}
            style={c.open && c.adj > 0 && !c.mine ? { color: NUM_COLORS[c.adj] } : undefined}
          >
            {c.open ? (c.mine ? "✸" : c.adj > 0 ? c.adj : "") : c.flag ? "⚑" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}