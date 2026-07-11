"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Playground.module.scss";

const PAIRS = { Easy: 6, Normal: 8, Hard: 10 };
const FACES = [
  { sym: "★", color: "#ffd21e" },
  { sym: "♥", color: "#ff6bb3" },
  { sym: "◆", color: "#3BB8E5" },
  { sym: "●", color: "#4ade80" },
  { sym: "▲", color: "#ff8a3d" },
  { sym: "♣", color: "#b46bff" },
  { sym: "✚", color: "#e14b4a" },
  { sym: "☾", color: "#cdd6ea" },
  { sym: "♦", color: "#f7f2e9" },
  { sym: "✦", color: "#2b93bd" },
];

export default function Memory({ difficulty, onGameOver }) {
  const nPairs = PAIRS[difficulty] || PAIRS.Normal;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices currently face-up (unmatched)
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const busyRef = useRef(false);

  useEffect(() => {
    const faces = FACES.slice(0, nPairs);
    const deck = [...faces, ...faces]
      .map((f, i) => ({ ...f, key: i }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }, [nPairs]);

  const flip = (i) => {
    if (busyRef.current || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      busyRef.current = true;
      const m = moves + 1;
      setMoves(m);
      const [a, b] = next;
      if (cards[a].sym === cards[b].sym) {
        const nm = [...matched, a, b];
        setTimeout(() => {
          setMatched(nm);
          setFlipped([]);
          busyRef.current = false;
          if (nm.length === cards.length) onGameOver(m);
        }, 350);
      } else {
        setTimeout(() => {
          setFlipped([]);
          busyRef.current = false;
        }, 700);
      }
    }
  };

  return (
    <div className={styles.gameArea}>
      <div className={styles.hud}>MOVES {moves} · PAIRS {matched.length / 2} / {nPairs}</div>
      <div className={styles.memGrid} data-cols={nPairs === 10 ? 5 : 4}>
        {cards.map((c, i) => {
          const up = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={c.key}
              className={`${styles.memCard} ${up ? styles.memUp : ""} ${matched.includes(i) ? styles.memDone : ""}`}
              onClick={() => flip(i)}
              aria-label={up ? c.sym : "Hidden card"}
            >
              {up ? <span style={{ color: c.color }}>{c.sym}</span> : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}