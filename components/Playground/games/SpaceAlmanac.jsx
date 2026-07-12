"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Playground.module.scss";
import { WEAPONS, ENEMIES, weaponDmg } from "./SpaceGuardian";
import { ACCESSORIES } from "./SpaceShop";

const LORE = {
  fighter: "The rank and file of the void. Cheap, plentiful, and always first through the door.",
  hummingbird: "Built for speed, not survival. It weaves so hard that half your shots hit empty space.",
  gunner: "A walking turret with wings. It won't outrun you, but it will out-shoot you.",
  galaxy: "Elite plasma escort. Whatever it hits, it hits once, and once is usually enough.",
  crusader: "A slab of armor with wings bolted on. Kill it and it simply becomes three problems.",
  timekeeper: "It doesn't want to kill you. It wants to slow you down until something else does.",
  hunter: "Patient, cold, methodical. It stalks your lane from above and never once looks away.",
  darkres: "Salvaged hull, stolen barrels, red eyes in the dark. Cheap engineering, expensive to fight.",
  bounty: "It drifts in, cuts its engines, and dares you to spend the ammo. Worth every round.",
  mothership: "A crowned cruiser, and rarely alone for long. Killing it is an achievement. Surviving what it drops is another.",
  kingship: "The crown itself. It does not chase you, it does not hurry, and it does not come alone. When it finally breaks, the wreck is still trying to kill you.",
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

const ACC_LORE = {
  armor: "Plating bolted over the hull. Every hit lands softer, but nothing lands for free.",
  health: "More heart, literally. Each level is one more mistake you get to survive.",
  orb: "A shard of something old, circling Jebby. It doesn't ask permission before it bites.",
  twinorb: "Two shards now, opposite each other. The ring around your ship becomes a threat.",
  tripleorb: "Three shards, evenly spaced. Nothing gets close without paying a toll.",
  gunattach: "A crude bracket, an extra barrel, and a great deal more noise.",
  firerate: "Tuned coils and cooler barrels. Everything you own fires faster.",
  homing: "Fire and forget. It picks a target, and it does not lose interest.",
  twinhoming: "Two seekers instead of one, launched faster with every tuning.",
  rapidrockets: "The seekers are gone. What's left is twin rockets, fired straight and fired often.",
};

function Sprite({ id, kind, size = 44 }) {
  const ref = useRef(null);

  useEffect(() => {
    const cvs = ref.current;
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    const cx = cvs.width / 2, cy = cvs.height / 2;

    if (kind === "enemy") {
      const E = ENEMIES[id];
      const scale = Math.min(1, (cvs.width - 16) / (E.w + (E.wings ? E.w * 1.1 : 12)));
      const w = E.w * scale, h = E.h * scale;

      if (E.wings) {
        const ww = w * 0.55, wh = h * 0.4;
        ctx.fillStyle = E.color;
        ctx.fillRect(cx - w / 2 - ww, cy - wh / 2, ww, wh);
        ctx.fillRect(cx + w / 2, cy - wh / 2, ww, wh);
      }
      ctx.fillStyle = E.color;
      ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
      if (!E.wings) {
        ctx.fillRect(cx - w / 2 - 4 * scale, cy - 3 * scale, 4 * scale, 8 * scale);
        ctx.fillRect(cx + w / 2, cy - 3 * scale, 4 * scale, 8 * scale);
      }
      if (E.crown) {
        ctx.fillStyle = E.crown;
        const cw = w * 0.5;
        ctx.fillRect(cx - cw / 2, cy - h / 2 - 5 * scale, cw, 3 * scale);
        [-cw / 2, -1.5 * scale, cw / 2 - 4 * scale].forEach((off) =>
          ctx.fillRect(cx + off, cy - h / 2 - 9 * scale, 4 * scale, 4 * scale)
        );
      }
      if (E.barrels) {
        ctx.fillStyle = "#3a3d52";
        const offs = E.barrels === 4 ? [-0.36, -0.12, 0.12, 0.36] : [-0.3, 0, 0.3];
        offs.forEach((f) => ctx.fillRect(cx + f * w - 1.5, cy + h / 2, 3, 4 * scale));
      }
      ctx.fillStyle = E.redEyes ? "#e14b4a" : "#111";
      const eye = Math.max(3, 4 * scale);
      ctx.fillRect(cx - w * 0.22, cy - h * 0.18, eye, eye);
      ctx.fillRect(cx + w * 0.22 - eye, cy - h * 0.18, eye, eye);
    } else if (kind === "gun") {
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
    } else {
      const orb = (ox, oy = cy) => {
        ctx.fillStyle = "#1c6f95"; ctx.fillRect(ox - 7, oy - 7, 14, 14);
        ctx.fillStyle = "#3BB8E5"; ctx.fillRect(ox - 5, oy - 5, 10, 10);
        ctx.fillStyle = "#8fd8f2"; ctx.fillRect(ox - 2, oy - 2, 4, 4);
      };
      const rocket = (ox) => {
        ctx.fillStyle = "#cdd6ea"; ctx.fillRect(ox - 4, cy - 9, 8, 13);
        ctx.fillStyle = "#e14b4a"; ctx.fillRect(ox - 4, cy - 12, 8, 3);
        ctx.fillStyle = "#ff8a3d"; ctx.fillRect(ox - 2, cy + 4, 4, 5);
      };

      if (id === "orb") orb(cx);
      else if (id === "twinorb") { orb(cx - 11); orb(cx + 11); }
      else if (id === "tripleorb") { orb(cx, cy - 10); orb(cx - 11, cy + 7); orb(cx + 11, cy + 7); }
      else if (id === "homing") rocket(cx);
      else if (id === "twinhoming") { rocket(cx - 10); rocket(cx + 10); }
      else if (id === "rapidrockets") {
        rocket(cx - 11); rocket(cx + 11);
        ctx.fillStyle = "#ffd21e";
        ctx.fillRect(cx - 1.5, cy - 14, 3, 5);
        ctx.fillRect(cx - 1.5, cy - 5, 3, 5);
      }
      else if (id === "armor") {
        ctx.fillStyle = "#6b6f8a"; ctx.fillRect(cx - 10, cy - 12, 20, 16);
        ctx.fillStyle = "#9aa0bf"; ctx.fillRect(cx - 7, cy - 9, 14, 10);
        ctx.fillStyle = "#6b6f8a"; ctx.fillRect(cx - 8, cy + 4, 16, 8);
      }
      else if (id === "health") {
        ctx.fillStyle = "#e14b4a";
        ctx.fillRect(cx - 10, cy - 8, 6, 6); ctx.fillRect(cx + 4, cy - 8, 6, 6);
        ctx.fillRect(cx - 10, cy - 2, 20, 6); ctx.fillRect(cx - 6, cy + 4, 12, 5);
        ctx.fillRect(cx - 2, cy + 9, 4, 4);
      }
      else if (id === "gunattach") {
        ctx.fillStyle = "#ffd21e";
        ctx.fillRect(cx - 12, cy - 10, 5, 18);
        ctx.fillRect(cx + 7, cy - 10, 5, 18);
        ctx.fillStyle = "#6b6f8a"; ctx.fillRect(cx - 12, cy + 8, 24, 4);
      }
      else if (id === "firerate") {
        ctx.fillStyle = "#ff8a3d";
        ctx.fillRect(cx - 3, cy - 14, 5, 8);
        ctx.fillRect(cx - 3, cy - 3, 5, 8);
        ctx.fillRect(cx - 3, cy + 8, 5, 6);
        ctx.fillStyle = "#ffd21e"; ctx.fillRect(cx + 6, cy - 10, 3, 20);
      }
    }
  }, [id, kind]);

  return <canvas ref={ref} width={size} height={size} className={styles.almSprite} />;
}

export default function SpaceAlmanac({ onExit }) {
  const [tab, setTab] = useState("enemies");
  const [openId, setOpenId] = useState(null);

  const kind = tab === "enemies" ? "enemy" : tab === "guns" ? "gun" : "acc";
  const source = tab === "enemies" ? ENEMIES : tab === "guns" ? WEAPONS : ACCESSORIES;
  const entries = Object.entries(source);

  const switchTab = (t) => { setTab(t); setOpenId(null); };
  const item = openId ? source[openId] : null;

  return (
    <div className={styles.almWrap}>
      <div className={styles.shopTabs}>
        <button className={`${styles.shopTab} ${tab === "enemies" ? styles.shopTabOn : ""}`} onClick={() => switchTab("enemies")}>Enemies</button>
        <button className={`${styles.shopTab} ${tab === "guns" ? styles.shopTabOn : ""}`} onClick={() => switchTab("guns")}>Guns</button>
        <button className={`${styles.shopTab} ${tab === "acc" ? styles.shopTabOn : ""}`} onClick={() => switchTab("acc")}>Accessories</button>
      </div>

      <div className={styles.almBody}>
        {!openId ? (
          <div className={styles.almGrid}>
            {entries.map(([id, entry]) => (
              <button
                key={id}
                className={`${styles.almTile} ${ENEMIES[id]?.boss ? styles.almBoss : ""}`}
                onClick={() => setOpenId(id)}
              >
                <Sprite id={id} kind={kind} size={44} />
                <span className={styles.almName}>{entry.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.almDetail}>
            <Sprite id={openId} kind={kind} size={72} />
            <h4 className={styles.almTitle}>{item.name}</h4>
            <p className={styles.almLore}>
              {tab === "enemies" ? LORE[openId] : tab === "guns" ? GUN_LORE[openId] : ACC_LORE[openId]}
            </p>
            <div className={styles.almStatRow}>
              {tab === "enemies" && (
                <>
                  <span><b>Lives</b> {item.hp}</span>
                  <span><b>Points</b> {item.pts}</span>
                  <span><b>Damage</b> {item.dmg}</span>
                </>
              )}
              {tab === "guns" && (
                <>
                  <span><b>Damage</b> {item.dmg}</span>
                  <span><b>Max LV</b> {item.maxLvl}</span>
                  <span><b>At max</b> {weaponDmg(openId, item.maxLvl)} dmg</span>
                </>
              )}
              {tab === "acc" && (
                <>
                  <span><b>Cost</b> {item.cost || item.upCost}</span>
                  {item.maxLvl > 0 && <span><b>Max LV</b> {item.maxLvl}</span>}
                </>
              )}
            </div>
            <p className={styles.almSpecial}>{item.desc}</p>
          </div>
        )}
      </div>

      <button className={styles.almBackBtn} onClick={() => (openId ? setOpenId(null) : onExit?.())}>
        {openId ? "‹ Back to Almanac" : "← Back to menu"}
      </button>
    </div>
  );
}