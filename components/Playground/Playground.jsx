"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Playground.module.scss";
import { useNav } from "@/components/SectionNav/SectionNav";
import { loadScores, saveScore } from "./arcade";
import Snake from "./games/Snake";
import Memory from "./games/Memory";
import TapTap from "./games/TapTap";
import Mines from "./games/Mines";
import PixelArt from "./games/PixelArt";
import SpaceGuardian from "./games/SpaceGuardian";
import { Shop, Arsenals } from "./games/SpaceShop";
import SpaceAlmanac from "./games/SpaceAlmanac";

const QUOTES = [
  "Ship it, then fix it.",
  "A bug is just a feature you haven't met.",
  "Pixels are forever.",
  "Rest is part of the grind.",
  "Ctrl+Z is proof of second chances.",
  "The best portfolio is a finished one.",
  "Coffee first, semicolons later.",
  "You miss 100% of the merges you don't commit.",
];

function ReactionGame({ onGameOver }) {
  const [phase, setPhase] = useState("wait");
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState([]);
  const startRef = useRef(0);
  const timerRef = useRef(null);
  const ROUNDS = 5;

  useEffect(() => {
    if (phase !== "wait") return;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, 900 + Math.random() * 2400);
    return () => clearTimeout(timerRef.current);
  }, [phase, round]);

  const click = () => {
    if (phase === "wait") {
      clearTimeout(timerRef.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "tooSoon") {
      setPhase("wait");
      return;
    }
    if (phase === "ready") {
      const ms = Math.round(performance.now() - startRef.current);
      const next = [...times, ms];
      setTimes(next);
      if (next.length >= ROUNDS) {
        onGameOver(Math.round(next.reduce((a, b) => a + b, 0) / next.length));
      } else {
        setRound((r) => r + 1);
        setPhase("wait");
      }
    }
  };

  const fill = phase === "ready" ? "#4ade80" : phase === "tooSoon" ? "#ffd21e" : "#e14b4a";
  const label = phase === "ready" ? "CLICK!" : phase === "tooSoon" ? "Too soon! Tap to retry" : "Wait for green...";

  return (
    <div className={styles.gameArea}>
      <div className={styles.hud}>ROUND {round} / {ROUNDS}{times.length > 0 && ` · LAST ${times[times.length - 1]}ms`}</div>
      <button className={styles.reactJebby} onClick={click} aria-label={label}>
        <svg viewBox="0 0 170 90" shapeRendering="crispEdges" width="200">
          <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill={fill} style={{ transition: "fill 0.08s" }} />
          <rect x="40" y="15" width="15" height="15" fill="black" />
          <rect x="115" y="15" width="15" height="15" fill="black" />
        </svg>
        <span className={styles.reactLabel}>{label}</span>
      </button>
    </div>
  );
}

function WiseGame() {
  const [quote, setQuote] = useState("Tap Jebby for wisdom.");
  const lastRef = useRef(-1);
  const speak = () => {
    let i;
    do { i = Math.floor(Math.random() * QUOTES.length); } while (i === lastRef.current);
    lastRef.current = i;
    setQuote(QUOTES[i]);
  };
  return (
    <div className={styles.gameArea}>
      <div className={styles.wiseQuote}>&ldquo;{quote}&rdquo;</div>
      <button className={styles.wiseJebby} onClick={speak} aria-label="Ask Jebby">
        <svg viewBox="0 0 170 90" shapeRendering="crispEdges" width="120">
          <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill="#3BB8E5" />
          <rect x="40" y="15" width="15" height="15" fill="black" />
          <rect x="115" y="15" width="15" height="15" fill="black" />
        </svg>
      </button>
    </div>
  );
}

function BeaGame({ onGameOver }) {
  const [clicks, setClicks] = useState(0);
  const limitRef = useRef(30 + Math.floor(Math.random() * 51)); // snaps at 30-80
  const anger = Math.min(1, clicks / limitRef.current);
  const r = Math.round(180 + (225 - 180) * anger);
  const g = Math.round(107 + (75 - 107) * anger);
  const b = Math.round(255 + (74 - 255) * anger);
  const color = `rgb(${r}, ${g}, ${b})`;

  const poke = () => {
    const n = clicks + 1;
    if (n >= limitRef.current) onGameOver(n);
    else setClicks(n);
  };

  return (
    <div className={styles.gameArea}>
      <div className={styles.hud}>POKES {clicks}</div>
      <button className={styles.beaBtn} onClick={poke} aria-label="Poke Bea">
        <svg viewBox="0 0 170 90" shapeRendering="crispEdges" width="150">
          <path d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z" fill={color} />
          <rect x="40" y="15" width="15" height="15" fill="black" />
          <rect x="115" y="15" width="15" height="15" fill="black" />
          {anger > 0.5 && <rect x="35" y="10" width="25" height="6" fill="black" transform={`rotate(${18 * anger} 47 13)`} />}
          {anger > 0.5 && <rect x="110" y="10" width="25" height="6" fill="black" transform={`rotate(${-18 * anger} 122 13)`} />}
        </svg>
        <span className={styles.beaHint}>{anger < 0.4 ? "Bea seems calm..." : anger < 0.75 ? "Bea is getting annoyed." : "Careful. Very careful."}</span>
      </button>
    </div>
  );
}

function PixelFolder({ dim }) {
  return (
    <svg viewBox="0 0 60 48" shapeRendering="crispEdges" className={styles.folderSvg} aria-hidden="true" style={dim ? { opacity: 0.45 } : undefined}>
      <rect x="2" y="6" width="22" height="6" fill="#111" />
      <rect x="2" y="12" width="56" height="34" fill="#111" />
      <rect x="5" y="9" width="17" height="6" fill="#ffd21e" />
      <rect x="5" y="15" width="50" height="28" fill="#ffd21e" />
      <rect x="5" y="15" width="50" height="7" fill="#ffbf00" />
      <rect x="47" y="36" width="8" height="7" fill="#ffe873" />
    </svg>
  );
}

const GAMES = [
  { id: "snake", name: "Snake Jebby", cat: "Jebby's Fun Games", desc: "Grow your snake, avoid collisions, and beat your high score.", diffs: ["Easy", "Normal", "Hard"], unit: "pts", lowerBetter: false, ready: true },
  { id: "reaction", name: "Jebby's Reaction Test", cat: "Jebby's Fun Games", desc: "Click as soon as Jebby changes color.", diffs: null, unit: "ms avg", lowerBetter: true, ready: true },
  { id: "taptap", name: "Tap Tap Jebby", cat: "Jebby's Fun Games", desc: "Tap to fly, dodge obstacles, and see how far you can go.", diffs: ["Easy", "Normal", "Hard"], unit: "pts", lowerBetter: false, ready: true },
  { id: "mines", name: "Minesweeper Jebby", cat: "Jebby's Fun Games", desc: "Clear every tile without triggering hidden mines.", diffs: ["Easy", "Normal", "Hard"], unit: "s", lowerBetter: true, ready: true },
  { id: "space", name: "Jebby the Space Guardian", cat: "Jebby's Fun Games", desc: "Shoot down space enemies, earn points, upgrade your guns.", diffs: null, unit: "pts", lowerBetter: false, ready: true },
  { id: "memory", name: "How Good is Jebby's Memory", cat: "Jebby's Fun Games", desc: "Flip matching pairs.", diffs: ["Easy", "Normal", "Hard"], unit: "moves", lowerBetter: true, ready: true },
  { id: "wise", name: "Jebby the Wise", cat: "Other Fun Games", desc: "Tap for a random quote, wise words, or a bit of nonsense.", diffs: null, unit: null, lowerBetter: false, ready: true },
  { id: "pixel", name: "Pixel Art", cat: "Other Fun Games", desc: "Create colorful pixel masterpieces, one block at a time.", diffs: null, unit: null, lowerBetter: false, ready: true },
  { id: "bea", name: "Don't Make Bea Angry", cat: "Other Fun Games", desc: "How many clicks until Bea snaps?", diffs: null, unit: "pokes", lowerBetter: false, ready: true },
];

export default function Playground() {
  const nav = useNav();
  const [gameId, setGameId] = useState(null);
  const [screen, setScreen] = useState("menu");
  const [diff, setDiff] = useState("Normal");
  const [lastScore, setLastScore] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const game = GAMES.find((g) => g.id === gameId);

  useEffect(() => {
    nav?.setLocked?.(screen === "playing");
    return () => nav?.setLocked?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const gameOver = (score) => {
    setLastScore(score);
    if (score != null && game?.unit) saveScore(game.id, game.diffs ? diff : "default", score, game.lowerBetter);
    setScreen("gameover");
  };

  const scores = game ? loadScores(game.id, game.diffs ? diff : "default") : [];
  const cats = [...new Set(GAMES.map((g) => g.cat))];

  return (
    <section className={styles.playground} id="playground">
      <div className={styles.cabinet}>
        <div className={styles.marquee}>JEBBY&rsquo;S PLAYGROUND</div>

        <div className={styles.screen}>
          <AnimatePresence mode="wait" initial={false}>
            {screen === "menu" && (
              <motion.div key="menu" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {cats.map((cat) => (
                  <div key={cat} className={styles.catBlock}>
                    <span className={styles.catName}>{cat}</span>
                    <div className={styles.folderGrid}>
                      {GAMES.filter((g) => g.cat === cat).map((g) => (
                        <button
                          key={g.id}
                          className={`${styles.folderBtn} ${!g.ready ? styles.folderSoon : ""}`}
                          onClick={() => {
                            if (!g.ready) return;
                            setGameId(g.id);
                            setDiff("Normal");
                            setScreen("gamemenu");
                          }}
                        >
                          <PixelFolder dim={!g.ready} />
                          <span className={styles.folderName}>{g.name}</span>
                          {!g.ready && <span className={styles.soon}>SOON</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {screen === "gamemenu" && game && (
              <motion.div key="gm" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <h3 className={styles.gameTitle}>{game.name}</h3>
                <p className={styles.gameDesc}>{game.desc}</p>
                {game.diffs && (
                  <div className={styles.diffRow}>
                    {game.diffs.map((d) => (
                      <button key={d} className={`${styles.diffBtn} ${diff === d ? styles.diffOn : ""}`} onClick={() => setDiff(d)}>{d}</button>
                    ))}
                  </div>
                )}
                <div className={styles.menuBtns}>
                  <button className={styles.menuBtn} onClick={() => setScreen("playing")}>▶ New Game</button>
                  {game.id === "space" && (
                    <>
                      <button className={styles.menuBtn} onClick={() => setScreen("shop")}>◆ Shop</button>
                      <button className={styles.menuBtn} onClick={() => setScreen("arsenals")}>⚙ Arsenals</button>
                      <button className={styles.menuBtn} onClick={() => setScreen("almanac")}>📖 Almanac</button>
                    </>
                  )}
                  {game.unit && <button className={styles.menuBtn} onClick={() => setScreen("scores")}>★ Scoreboard</button>}
                  <button className={styles.menuBtn} onClick={() => { setGameId(null); setScreen("menu"); }}>✕ Exit</button>
                </div>

                {game.id === "space" && (
                  <div className={styles.resetCorner}>
                    {!confirmReset ? (
                      <button className={styles.resetBtn} onClick={() => setConfirmReset(true)}>⟲ Reset Progress</button>
                    ) : (
                      <div className={styles.resetConfirm}>
                        <span>Erase all points, guns, and scores?</span>
                        <div className={styles.resetRow}>
                          <button
                            className={styles.resetYes}
                            onClick={() => {
                              try {
                                localStorage.removeItem("jebby-arcade:space:profile");
                                Object.keys(localStorage)
                                  .filter((k) => k.startsWith("jebby-arcade:space:"))
                                  .forEach((k) => localStorage.removeItem(k));
                              } catch {}
                              setConfirmReset(false);
                              setGameId(null);
                              setScreen("menu");
                            }}
                          >
                            Yes, reset
                          </button>
                          <button className={styles.resetNo} onClick={() => setConfirmReset(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {screen === "playing" && game && (
              <motion.div key="play" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {game.id === "snake" && <Snake difficulty={diff} onGameOver={gameOver} />}
                {game.id === "reaction" && <ReactionGame onGameOver={gameOver} />}
                {game.id === "taptap" && <TapTap difficulty={diff} onGameOver={gameOver} />}
                {game.id === "mines" && <Mines difficulty={diff} onGameOver={gameOver} />}
                {game.id === "space" && <SpaceGuardian onGameOver={gameOver} />}
                {game.id === "memory" && <Memory difficulty={diff} onGameOver={gameOver} />}
                {game.id === "wise" && <WiseGame />}
                {game.id === "pixel" && <PixelArt />}
                {game.id === "bea" && <BeaGame onGameOver={gameOver} />}
                <button className={styles.quitBtn} onClick={() => setScreen("gamemenu")}>← Back to menu</button>
              </motion.div>
            )}

            {screen === "shop" && game && (
              <motion.div key="shop" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <h3 className={styles.gameTitle}>Shop</h3>
                <Shop />
                <button className={styles.menuBtn} onClick={() => setScreen("gamemenu")}>← Back</button>
              </motion.div>
            )}

            {screen === "arsenals" && game && (
              <motion.div key="arsenals" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <h3 className={styles.gameTitle}>Arsenals</h3>
                <Arsenals />
                <button className={styles.menuBtn} onClick={() => setScreen("gamemenu")}>← Back</button>
              </motion.div>
            )}

            {screen === "almanac" && game && (
              <motion.div key="almanac" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <h3 className={styles.gameTitle}>Almanac</h3>
                <SpaceAlmanac />
                <button className={styles.menuBtn} onClick={() => setScreen("gamemenu")}>← Back</button>
              </motion.div>
            )}

            {screen === "scores" && game && (
              <motion.div key="scores" className={styles.inner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <h3 className={styles.gameTitle}>Scoreboard</h3>
                <span className={styles.scoreSub}>{game.name}{game.diffs ? ` · ${diff}` : ""}</span>
                {scores.length === 0 ? (
                  <p className={styles.gameDesc}>No scores yet. Be the first!</p>
                ) : (
                  <ol className={styles.scoreList}>
                    {scores.map((s, i) => (
                      <li key={i}><span>{s.score} {game.unit}</span><span className={styles.scoreDate}>{s.date}</span></li>
                    ))}
                  </ol>
                )}
                <button className={styles.menuBtn} onClick={() => setScreen("gamemenu")}>← Back</button>
              </motion.div>
            )}

            {screen === "gameover" && game && (
              <motion.div key="over" className={styles.inner} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <h3 className={styles.gameTitle}>Game Over</h3>
                <span className={styles.finalScore}>{lastScore == null ? "BOOM!" : `${lastScore} ${game.unit}`}</span>
                <div className={styles.menuBtns}>
                  <button className={styles.menuBtn} onClick={() => setScreen("playing")}>↻ Play Again</button>
                  {game.unit && <button className={styles.menuBtn} onClick={() => setScreen("scores")}>★ Scoreboard</button>}
                  <button className={styles.menuBtn} onClick={() => setScreen("gamemenu")}>← Menu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={styles.scanlines} aria-hidden="true" />
        </div>

        <div className={styles.deck}>
          <span className={styles.joy} />
          <div className={styles.btnRow}>
            <span className={styles.abtn} style={{ background: "#e14b4a" }} />
            <span className={styles.abtn} style={{ background: "#ffd21e" }} />
            <span className={styles.abtn} style={{ background: "#4ade80" }} />
          </div>
        </div>
      </div>
    </section>
  );
}