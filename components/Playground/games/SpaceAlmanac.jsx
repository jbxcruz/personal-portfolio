"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Playground.module.scss";
import { WEAPONS, ENEMIES, weaponDmg } from "./SpaceGuardian";

const LORE = {
  fighter: "The rank and file of the void. Cheap, plentiful, and always first through the door.",
  hummingbird: "Built for speed, not survival. It weaves so hard that half your shots hit empty space.",
  gunner: "A walking turret with wings. It won't outrun you, but it will out-shoot you.",
  galaxy: "Elite plasma escort. Whatever it hits, it hits once, and once is usually enough.",
  crusader: "A slab of armor with engines bolted on. Kill it and it simply becomes three problems.",
  timekeeper: "It doesn't want to kill you. It wants to slow you down until something else does.",
  hunter: "Patient, cold, methodical. It marks you, snares you, then parks in your lane and waits.",
  darkres: "Salvaged hull, three stolen sub-machine barrels. Cheap engineering, expensive to fight.",
  bounty: "It drifts in, shuts off its engines, and dares you to spend the ammo. Worth every round.",
  mothership: "The rarest silhouette on the field. Killing it is an achievement. Surviving what it drops is another.",
};

const GUN_LORE = {
  basic: "The gun Jebby launched with. Humble, reliable, and never quite enough.",
  twin: "Two barrels, twice the noise, same modest punch. A crowd-clearer.",
  smc: "Three-round bursts with a breath between them. Rhythm beats raw speed.",
  blaster: "Slow, fat energy slugs that detonate on contact and splash everything nearby.",
  smg: "Hold the trigger and let the barrel glow. Accuracy is a suggestion.",
  rocket: "One warhead, one long pause, one very large hole. Mind the smoke.",
  laser: "Focused light, punched straight through hull plating.",
  plasma: "Not a bullet. A standing column of plasma that eats anything it touches.",
};

function Sprite({ id, kind, size = 40 }) {
  const ref = useRef(null);

  useEffect(() => {
    const cvs = ref.current;
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    const cx = cvs.width / 2, cy = cvs.height / 2;

    if (kind === "enemy") {
      const E = ENEMIES[id];
      const scale = Math.min(1, (cvs.width - 14) / (E.w + 12));
      const w = E.w * scale, h = E.h * scale;
      ctx.fillStyle = E.color;
      ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
      ctx.fillRect(cx - w / 2 - 4 * scale, cy - 3 * scale, 4 * scale, 8 * scale);
      ctx.fillRect(cx + w / 2, cy - 3 * scale, 4 * scale, 8 * scale);
      if (E.barrels) {
        ctx.fillStyle = "#3a3d52";
        [-10, 0, 10].forEach((off) => ctx.fillRect(cx + off * scale - 1.5, cy + h / 2, 3, 5 * scale));
      }
      ctx.fillStyle = "#111";
      ctx.fillRect(cx - w * 0.22, cy - h * 0.18, 4 * scale, 4 * scale);
      ctx.fillRect(cx + w * 0.22 - 4 * scale, cy - h * 0.18, 4 * scale, 4 * scale);
    } else {
      // gun: draw its signature projectile
      const w = WEAPONS[id];
      if (w.beam) {
        ctx.fillStyle = "rgba(180,107,255,0.35)"; ctx.fillRect(cx - 8, 4, 16, cvs.height - 8);
        ctx.fillStyle = "#e2beff"; ctx.fillRect(cx - 4, 4, 8, cvs.height - 8);
        ctx.fillStyle = "#fff"; ctx.fillRect(cx - 1.5, 4, 3, cvs.height - 8);
      } else if (w.laser) {
        ctx.fillStyle = "#ff6bb3"; ctx.fillRect(cx - 3, cy - 12, 6, 24);
        ctx.fillStyle = "#ffc2de"; ctx.fillRect(cx - 1, cy - 12, 2, 24);
      } else if (w.aoe && !w.big) {
        ctx.fillStyle = "#2b7d5e"; ctx.fillRect(cx - 8, cy - 8, 16, 16);
        ctx.fillStyle = "#4ade80"; ctx.fillRect(cx - 6, cy - 6, 12, 12);
        ctx.fillStyle = "#d9ffe9"; ctx.fillRect(cx - 2, cy - 2, 4, 4);
      } else if (w.big) {
        ctx.fillStyle = "#cdd6ea"; ctx.fillRect(cx - 5, cy - 10, 10, 15);
        ctx.fillStyle = "#e14b4a"; ctx.fillRect(cx - 5, cy - 13, 10, 3);
        ctx.fillStyle = "#ff8a3d"; ctx.fillRect(cx - 3, cy + 5, 6, 6);
      } else if (w.twin) {
        ctx.fillStyle = "#ffd21e";
        ctx.fillRect(cx - 9, cy - 8, 5, 14);
        ctx.fillRect(cx + 4, cy - 8, 5, 14);
      } else if (w.burst) {
        ctx.fillStyle = "#ffd21e";
        ctx.fillRect(cx - 2, cy - 14, 4, 8);
        ctx.fillRect(cx - 2, cy - 3, 4, 8);
        ctx.fillRect(cx - 2, cy + 8, 4, 8);
      } else {
        ctx.fillStyle = "#ffd21e";
        ctx.fillRect(cx - 3, cy - 10, 6, 20);
      }
    }
  }, [id, kind]);

  return <canvas ref={ref} width={size} height={size} className={styles.almSprite} />;
}

export default function SpaceAlmanac() {
  const [tab, setTab] = useState("enemies");
  const [openId, setOpenId] = useState(null);

  const isEnemy = tab === "enemies";
  const entries = isEnemy ? Object.entries(ENEMIES) : Object.entries(WEAPONS);

  if (openId) {
    if (isEnemy) {
      const e = ENEMIES[openId];
      return (
        <div className={styles.almDetail}>
          <button className={styles.almBack} onClick={() => setOpenId(null)}>‹ Back</button>
          <Sprite id={openId} kind="enemy" size={72} />
          <h4 className={styles.almTitle}>{e.name}</h4>
          <p className={styles.almLore}>{LORE[openId]}</p>
          <div className={styles.almStatRow}>
            <span><b>Lives</b> {e.hp}</span>
            <span><b>Points</b> {e.pts}</span>
            <span><b>Damage</b> {e.dmg}</span>
          </div>
          <p className={styles.almSpecial}>{e.desc}</p>
        </div>
      );
    }
    const w = WEAPONS[openId];
    return (
      <div className={styles.almDetail}>
        <button className={styles.almBack} onClick={() => setOpenId(null)}>‹ Back</button>
        <Sprite id={openId} kind="gun" size={72} />
        <h4 className={styles.almTitle}>{w.name}</h4>
        <p className={styles.almLore}>{GUN_LORE[openId]}</p>
        <div className={styles.almStatRow}>
          <span><b>Damage</b> {w.dmg}</span>
          <span><b>Max LV</b> {w.maxLvl}</span>
          <span><b>At max</b> {weaponDmg(openId, w.maxLvl)} dmg</span>
        </div>
        <p className={styles.almSpecial}>{w.desc}</p>
      </div>
    );
  }

  return (
    <div className={styles.shopWrap}>
      <div className={styles.shopTabs}>
        <button className={`${styles.shopTab} ${isEnemy ? styles.shopTabOn : ""}`} onClick={() => { setTab("enemies"); setOpenId(null); }}>Enemies</button>
        <button className={`${styles.shopTab} ${!isEnemy ? styles.shopTabOn : ""}`} onClick={() => { setTab("guns"); setOpenId(null); }}>Guns</button>
      </div>

      <div className={styles.almGrid}>
        {entries.map(([id, item]) => (
          <button key={id} className={styles.almTile} onClick={() => setOpenId(id)}>
            <Sprite id={id} kind={isEnemy ? "enemy" : "gun"} size={44} />
            <span className={styles.almName}>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}