"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../Playground.module.scss";
import { loadProfile, saveProfile } from "../arcade";

export const WEAPONS = {
  basic:  { name: "Basic Fire Cannon", cost: 0,    dmg: 1, delay: 320, maxLvl: 25, upCost: 10,  desc: "1 dmg · average fire rate" },
  twin:   { name: "Twin Blasters",     cost: 100,  dmg: 1, delay: 320, maxLvl: 25, upCost: 20,  desc: "1 dmg · average rate · twin barrel", twin: true },
  smc:    { name: "Space Sub-Machine Cannons", cost: 400, dmg: 1, delay: 720, maxLvl: 30, upCost: 65, desc: "1 dmg · 3-round burst", burst: 3, burstGap: 5 },
  blaster:{ name: "Blaster Cannons",   cost: 450,  dmg: 3, delay: 600, maxLvl: 20, upCost: 30,  desc: "3 dmg · slow rate · AOE", aoe: 46 },
  smg:    { name: "Space Machine Gun", cost: 750,  dmg: 1, delay: 130, maxLvl: 20, upCost: 50,  desc: "1 dmg · fast fire rate" },
  rocket: { name: "Rocket Missile",    cost: 850,  dmg: 8, delay: 900, maxLvl: 20, upCost: 70,  desc: "8 dmg · very slow · AOE · smoke trail", aoe: 60, big: true, trail: true },
  laser:  { name: "Laser Gun",         cost: 1000, dmg: 5, delay: 340, maxLvl: 15, upCost: 80,  desc: "5 dmg · average fire rate", laser: true },
  plasma: { name: "Plasma Laser Beam", cost: 2500, dmg: 5, delay: 0,   maxLvl: 25, upCost: 100, desc: "5 dmg · continuous beam · pulses", beam: true, beamOn: 48, beamOff: 34 },
};

export const weaponDmg = (id, lvl) => WEAPONS[id].dmg + Math.floor(lvl / 5);

export const ENEMIES = {
  fighter:     { name: "Space Fighter", hp: 1,  pts: 1,  speed: 1.0,  dmg: 1,  w: 26, h: 20, color: "#4ade80", fireChance: 0.004, bulletSpeed: 2.6, desc: "A basic fighter with standard cannons." },
  hummingbird: { name: "Space Hummingbird", hp: 1, pts: 2, speed: 2.1, dmg: 1, w: 22, h: 16, color: "#ffd21e", fireChance: 0.004, bulletSpeed: 2.6, desc: "Fast and weaving. Hard to pin down." },
  gunner:      { name: "Space Gunner", hp: 4,  pts: 10, speed: 0.8,  dmg: 1,  w: 28, h: 22, color: "#ff8a3d", fireChance: 0.02,  bulletSpeed: 3.0, desc: "Machine guns. Fires roughly 5x as often." },
  galaxy:      { name: "Galaxy Fighter", hp: 3, pts: 3, speed: 0.9,  dmg: 5,  w: 30, h: 24, color: "#e14b4a", fireChance: 0.006, bulletSpeed: 3.2, desc: "Plasma cannons. Hits brutally hard." },
  crusader:    { name: "Galaxy Crusader", hp: 5, pts: 5, speed: 0.45, dmg: 3, w: 44, h: 32, color: "#b46bff", fireChance: 0.007, bulletSpeed: 2.2, wings: true, desc: "Broad-winged tank. Splits into 3 Space Fighters when destroyed." },
  timekeeper:  { name: "Time Keeper", hp: 4, pts: 30, speed: 0.7, dmg: 2, w: 30, h: 26, color: "#3BB8E5", fireChance: 0.014, bulletSpeed: 2.4, emp: true, desc: "EMP blasts, fired often. A hit slows your fire rate and bullets for 2s." },
  hunter:      { name: "Space Hunter", hp: 4, pts: 35, speed: 0.75, dmg: 1, w: 30, h: 24, color: "#00e0c6", fireChance: 0.012, bulletSpeed: 3.4, hunter: true, hoverY: 120, desc: "Stalks your lane from above. Marks you for 3s, fires a Snare, then hunts you while you're frozen." },
  darkres:     { name: "Dark Resistance", hp: 8, pts: 35, speed: 0.5, dmg: 1, w: 40, h: 30, color: "#6b6f8a", fireChance: 0.016, bulletSpeed: 3.2, barrels: 3, wings: true, redEyes: true, desc: "Heavy winged hull, 3 sub-machine barrels firing in bursts." },
  bounty:      { name: "Space Bounty", hp: 15, pts: 50, speed: 0.6, dmg: 2, w: 40, h: 34, color: "#cdd6ea", fireChance: 0, bulletSpeed: 0, parkY: 90, desc: "Never moves once parked, never fires. Pure bounty." },
  mothership:  { name: "Mothership", hp: 10, pts: 35, speed: 0.35, dmg: 10, w: 56, h: 36, color: "#ff6bb3", fireChance: 0.009, bulletSpeed: 4.5, crown: "#ffd21e", desc: "Crowned laser cruiser. Splits into 2 Galaxy Crusaders when destroyed." },
  kingship:    { name: "Kingship", hp: 50, pts: 350, speed: 0.22, dmg: 5, w: 92, h: 56, color: "#7a3fb5", fireChance: 0.05, bulletSpeed: 5.2, boss: true, barrels: 4, wings: true, crown: "#e14b4a", redEyes: true, hoverY: 90, desc: "Super-heavy flagship. 4 laser barrels, summons escorts every 25s, and dies into 2 Motherships and a Bounty." },
};

const W = 620, H = 440;
const MAX_HEARTS = 20;
const KING_COOLDOWN = 90 * 60;   // 90s between Kingship appearances
const KING_EARLIEST = 90 * 60;   // never before 90s in
const KING_SUMMON_EVERY = 25 * 60;

export default function SpaceGuardian({ onGameOver }) {
  const canvasRef = useRef(null);
  const [hud, setHud] = useState({ score: 0, hearts: MAX_HEARTS, wave: 0, status: null, boss: null });

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");

    const profile = loadProfile();
    const wId = profile.equipped in WEAPONS && profile.owned[profile.equipped] ? profile.equipped : "basic";
    const wLvl = profile.owned[wId]?.lvl || 0;
    const weapon = WEAPONS[wId];
    const dmg = weaponDmg(wId, wLvl);
    const maxed = wLvl >= weapon.maxLvl;
    const acc = profile.acc || {};
    const armor = acc.armor?.lvl || 0;
    const maxHearts = MAX_HEARTS + (acc.health?.lvl || 0);
    const fireMult = 1 - 0.08 * (acc.firerate?.lvl || 0);
    const orbLvl = acc.orb ? acc.orb.lvl : -1;
    const twinOrbLvl = acc.twinorb ? acc.twinorb.lvl : -1;
    const tripleOrbs = !!acc.tripleorb;
    const hasHoming = !!acc.homing;
    const twinHomingLvl = acc.twinhoming ? acc.twinhoming.lvl : -1;
    const hasRapidRockets = !!acc.rapidrockets;
    const attach = acc.gunattach?.lvl || 0;

    const orbCount = tripleOrbs ? 3 : twinOrbLvl >= 0 ? 2 : orbLvl >= 0 ? 1 : 0;
    const orbSpeed = 0.03 + Math.max(0, orbLvl) * 0.012 + Math.max(0, twinOrbLvl) * 0.008;

    const s = {
      x: W / 2, hearts: maxHearts, score: 0,
      bullets: [], ebullets: [], enemies: [], stars: [], blasts: [], smoke: [], pending: [], rockets: [],
      lastFire: 0, t: 0, dead: false, spawnEvery: 95,
      orbA: 0, lastMissile: 0, missiles: [], lastRocket: 0,
      beamOn: false, beamT: 0,
      empUntil: 0, snaredUntil: 0, snareX: 0,
      lastKing: -KING_COOLDOWN,
    };
    for (let i = 0; i < 55; i++) s.stars.push({ x: Math.random() * W, y: Math.random() * H, v: 0.4 + Math.random() * 1.2 });

    const bonusHp = () => Math.floor(s.t / 3600);

    const keys = {};
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (["a", "d", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
      keys[k] = e.type === "keydown";
    };
    const onMove = (e) => {
      if (s.t < s.snaredUntil) return;
      const r = cvs.getBoundingClientRect();
      s.x = ((e.clientX - r.left) / r.width) * W;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerdown", onMove);

    const spawn = (type, x, y) => {
      const E = ENEMIES[type];
      const hp = E.hp + (E.boss ? 0 : bonusHp());
      s.enemies.push({
        type, x: x ?? 30 + Math.random() * (W - 60), y: y ?? -40,
        hp, maxHp: hp, wob: Math.random() * 6.28,
        markT: E.hunter ? 0 : -1, snareFired: false, lastShot: 0, lastSummon: 0,
      });
    };

    const kingAlive = () => s.enemies.some((e) => e.type === "kingship");

    const pickType = () => {
      // Kingship: gated, rare, one at a time
      if (
        s.t > KING_EARLIEST &&
        !kingAlive() &&
        s.t - s.lastKing > KING_COOLDOWN &&
        Math.random() < 0.02
      ) {
        s.lastKing = s.t;
        return "kingship";
      }
      const elapsed = s.t / 60;
      const r = Math.random();
      const rare = Math.min(0.34, 0.05 + elapsed * 0.004);
      if (r < rare * 0.10) return "mothership";
      if (r < rare * 0.24) return "bounty";
      if (r < rare * 0.38) return "darkres";
      if (r < rare * 0.52) return "hunter";
      if (r < rare * 0.66) return "crusader";
      if (r < rare * 0.80) return "gunner";
      if (r < rare * 0.90) return "timekeeper";
      if (r < rare) return "galaxy";
      if (r < rare + 0.35) return "hummingbird";
      return "fighter";
    };

    const hurt = (n) => {
      s.hearts -= Math.max(1, n - armor);
      if (s.hearts <= 0) { s.hearts = 0; s.dead = true; }
    };

    const damage = (e, amount) => { if (e.hp > 0) e.hp -= amount; };

    const kill = (e) => {
      const E = ENEMIES[e.type];
      s.score += E.pts;
      if (e.type === "crusader") for (let i = -1; i <= 1; i++) spawn("fighter", e.x + i * 30, e.y);
      if (e.type === "mothership") for (let i = -1; i <= 1; i += 2) spawn("crusader", e.x + i * 40, e.y);
      if (e.type === "kingship") {
        spawn("mothership", e.x - 70, e.y);
        spawn("mothership", e.x + 70, e.y);
        spawn("bounty", e.x, e.y - 20);
      }
    };

    const blast = (x, y, radius) => s.blasts.push({ x, y, r: 6, max: radius, alpha: 0.8 });

    const barrelOffsets = () => {
      const base = weapon.twin ? 2 : 1;
      const total = base + attach;
      const spacing = 11;
      const span = (total - 1) * spacing;
      return Array.from({ length: total }, (_, i) => -span / 2 + i * spacing);
    };

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      s.t += 1;

      const empActive = s.t < s.empUntil;
      const snared = s.t < s.snaredUntil;
      const slowMult = empActive ? 1.8 : 1;
      const bulletSlow = empActive ? 0.5 : 1;

      s.spawnEvery = Math.max(28, 95 - Math.floor(s.t / 300) * 6);
      if (s.t % s.spawnEvery === 0) spawn(pickType());

      if (!snared) {
        if (keys["a"] || keys["arrowleft"]) s.x -= 4.4;
        if (keys["d"] || keys["arrowright"]) s.x += 4.4;
        s.x = Math.max(18, Math.min(W - 18, s.x));
      } else {
        s.x = s.snareX;
      }

      const px = s.x, py = H - 40;

      // ---- player firing ----
      if (weapon.beam) {
        s.beamT += 1;
        const onFrames = Math.round(weapon.beamOn);
        const offFrames = Math.round(weapon.beamOff * fireMult * slowMult);
        if (s.beamOn && s.beamT > onFrames) { s.beamOn = false; s.beamT = 0; }
        else if (!s.beamOn && s.beamT > offFrames) { s.beamOn = true; s.beamT = 0; }
        if (snared) s.beamOn = false;

        if (s.beamOn) {
          const half = 7;
          const angles = attach === 0 ? [0] : attach === 1 ? [-0.22, 0.22] : [-0.3, 0, 0.3];
          s.enemies.forEach((e) => {
            const E = ENEMIES[e.type];
            if (e.y >= py - 18) return;
            const hit = angles.some((ang) => {
              const beamX = px + (py - 18 - e.y) * Math.tan(ang);
              return Math.abs(e.x - beamX) < E.w / 2 + half;
            });
            if (hit && (!e.beamCd || s.t - e.beamCd > 10)) { damage(e, dmg); e.beamCd = s.t; }
          });
        }
      } else if (!snared && s.t - s.lastFire >= (weapon.delay * fireMult * slowMult) / (1000 / 60)) {
        s.lastFire = s.t;
        const bursts = weapon.burst || 1;
        const gap = weapon.burstGap || 0;
        for (let bi = 0; bi < bursts; bi++) s.pending.push({ at: s.t + bi * gap });
      }

      s.pending = s.pending.filter((p) => {
        if (s.t < p.at) return true;
        barrelOffsets().forEach((off) => s.bullets.push({ x: s.x + off, y: H - 52, trail: weapon.trail }));
        return false;
      });

      // orbs
      if (orbCount > 0) {
        s.orbA += orbSpeed;
        const offs = orbCount === 1 ? [0] : orbCount === 2 ? [0, Math.PI] : [0, 2.094, 4.189];
        offs.forEach((off) => {
          const ox = px + Math.cos(s.orbA + off) * 62;
          const oy = py + Math.sin(s.orbA + off) * 62;
          s.enemies.forEach((e) => {
            const E = ENEMIES[e.type];
            if (Math.abs(ox - e.x) < E.w / 2 + 10 && Math.abs(oy - e.y) < E.h / 2 + 10) {
              if (!e.orbCd || s.t - e.orbCd > 18) { damage(e, 1); e.orbCd = s.t; }
            }
          });
        });
      }

      // homing missiles (or the rapid rocket upgrade)
      if (hasRapidRockets) {
        if (!snared && s.t - s.lastRocket > 70) {
          s.lastRocket = s.t;
          [0, 8, 16].forEach((d) => s.pending.push({ at: s.t + d, rocket: true }));
        }
      } else if ((hasHoming || twinHomingLvl >= 0) && !snared && s.enemies.length > 0) {
        const interval = twinHomingLvl >= 0 ? 80 - twinHomingLvl * 6 : 100;
        if (s.t - s.lastMissile > interval) {
          s.lastMissile = s.t;
          const count = twinHomingLvl >= 0 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            s.missiles.push({
              x: s.x + (count === 2 ? (i ? 12 : -12) : 0),
              y: H - 52,
              target: s.enemies[Math.floor(Math.random() * s.enemies.length)],
            });
          }
        }
      }

      // rapid rockets release (straight up, twin, burst rhythm)
      s.pending = s.pending.filter((p) => {
        if (s.t < p.at) return true;
        if (p.rocket) {
          s.rockets.push({ x: s.x - 12, y: H - 52 }, { x: s.x + 12, y: H - 52 });
          return false;
        }
        return true;
      }).concat(s.pending.filter((p) => s.t < p.at && false)); // keep list clean

      s.rockets.forEach((r) => {
        r.y -= 7;
        if (s.t % 2 === 0) s.smoke.push({ x: r.x + (Math.random() * 3 - 1.5), y: r.y + 8, r: 3, a: 0.5 });
      });
      s.rockets = s.rockets.filter((r) => {
        for (const e of s.enemies) {
          const E = ENEMIES[e.type];
          if (e.hp > 0 && Math.abs(r.x - e.x) < E.w / 2 + 5 && Math.abs(r.y - e.y) < E.h / 2 + 8) {
            damage(e, 5);
            blast(e.x, e.y, 40);
            return false;
          }
        }
        return r.y > -20;
      });

      s.missiles.forEach((m) => {
        if (!s.enemies.includes(m.target)) { m.dead = true; return; }
        const dx = m.target.x - m.x, dy = m.target.y - m.y;
        const d = Math.hypot(dx, dy) || 1;
        m.x += (dx / d) * 4.2 * bulletSlow;
        m.y += (dy / d) * 4.2 * bulletSlow;
        s.smoke.push({ x: m.x, y: m.y, r: 3, a: 0.5 });
        if (d < 14) { damage(m.target, 5); m.dead = true; }
      });
      s.missiles = s.missiles.filter((m) => !m.dead);

      // bullets
      const bSpeed = (weapon.laser ? 9 : weapon.big ? 5 : 6) * bulletSlow;
      s.bullets.forEach((b) => {
        b.y -= bSpeed;
        if (b.trail && s.t % 2 === 0) s.smoke.push({ x: b.x + (Math.random() * 4 - 2), y: b.y + 8, r: 3.5, a: 0.55 });
      });
      s.bullets = s.bullets.filter((b) => b.y > -20);
      s.ebullets.forEach((b) => { b.y += b.v; });
      s.ebullets = s.ebullets.filter((b) => b.y < H + 20);

      s.smoke.forEach((p) => { p.r += 0.35; p.a -= 0.022; });
      s.smoke = s.smoke.filter((p) => p.a > 0);

      // ---- enemy behavior ----
      s.enemies.forEach((e) => {
        const E = ENEMIES[e.type];

        if (E.boss) {
          if (e.y < E.hoverY) e.y += E.speed;
          else { e.wob += 0.012; e.x += Math.sin(e.wob) * 1.1; }
          e.x = Math.max(50, Math.min(W - 50, e.x));

          // summons every 25s: up to 3 random escorts
          if (s.t - e.lastSummon > KING_SUMMON_EVERY) {
            e.lastSummon = s.t;
            const pool = ["crusader", "timekeeper", "darkres"];
            const n = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < n; i++) {
              spawn(pool[Math.floor(Math.random() * pool.length)], e.x + (i - 1) * 55, e.y + 30);
            }
          }

          // 4 laser barrels, fast rate
          if (s.t - e.lastShot > 20) {
            e.lastShot = s.t;
            [-33, -11, 11, 33].forEach((off) => {
              s.ebullets.push({ x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: "#ff6bb3", laser: true, long: 34 });
            });
          }
        } else if (e.type === "bounty") {
          if (e.y < E.parkY) e.y += E.speed;
        } else if (E.hunter) {
          if (e.y < E.hoverY) e.y += E.speed;
          const playerSnared = s.t < s.snaredUntil;
          const dx = px - e.x;
          const trackSpeed = playerSnared ? 3.0 : e.snareFired ? 1.6 : 2.2;
          e.x += Math.max(-trackSpeed, Math.min(trackSpeed, dx * 0.07));
          e.x = Math.max(20, Math.min(W - 20, e.x));

          if (!e.snareFired) {
            e.markT += 1;
            if (e.markT > 180) {
              s.ebullets.push({ x: e.x, y: e.y + E.h / 2, v: 4.2, dmg: 0, color: "#00e0c6", snare: true, long: 30 });
              e.snareFired = true;
            }
          } else if (playerSnared) {
            if (s.t - e.lastShot > 24) {
              e.lastShot = s.t;
              s.ebullets.push({ x: e.x - 8, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", hunter: true, long: 26 });
              s.ebullets.push({ x: e.x + 8, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", hunter: true, long: 26 });
            }
          } else if (s.t - (e.lastShot || 0) > 42) {
            e.lastShot = s.t;
            s.ebullets.push({ x: e.x - 8, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", hunter: true, long: 26 });
            s.ebullets.push({ x: e.x + 8, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", hunter: true, long: 26 });
          }
        } else {
          e.y += E.speed;
          e.wob += 0.05;
          if (e.type === "hummingbird") e.x += Math.sin(e.wob) * 2.2;

          const interval = Math.round(1 / (E.fireChance || 0.004)) * 0.6;
          if (E.fireChance > 0 && s.t - (e.lastShot || 0) > interval) {
            e.lastShot = s.t;
            if (E.barrels) {
              [-12, 0, 12].forEach((off) => {
                s.ebullets.push({ x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: "#c9cde6", long: 24 });
              });
            } else if (E.emp) {
              s.ebullets.push({ x: e.x, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: E.color, emp: true, born: s.t });
            } else {
              s.ebullets.push({
                x: e.x, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: E.color,
                long: e.type === "mothership" ? 42 : 24,
              });
            }
          }
        }
      });

      // player bullets vs enemies
      for (const b of s.bullets) {
        for (const e of s.enemies) {
          const E = ENEMIES[e.type];
          if (e.hp > 0 && Math.abs(b.x - e.x) < E.w / 2 + 4 && Math.abs(b.y - e.y) < E.h / 2 + 6) {
            damage(e, dmg);
            b.hit = true;
            if (weapon.aoe) {
              blast(e.x, e.y, weapon.aoe);
              s.enemies.forEach((o) => {
                if (o !== e && o.hp > 0 && Math.hypot(o.x - e.x, o.y - e.y) < weapon.aoe) damage(o, dmg);
              });
            }
            break;
          }
        }
      }
      s.bullets = s.bullets.filter((b) => !b.hit);

      s.enemies.filter((e) => e.hp <= 0).forEach(kill);
      s.enemies = s.enemies.filter((e) => e.hp > 0);

      s.blasts.forEach((bl) => { bl.r += 3.4; bl.alpha -= 0.06; });
      s.blasts = s.blasts.filter((bl) => bl.alpha > 0 && bl.r < bl.max + 20);

      // enemy bullets vs player
      s.ebullets = s.ebullets.filter((b) => {
        if (Math.abs(b.x - px) < 18 && Math.abs(b.y - py) < 14) {
          if (b.snare) { s.snaredUntil = s.t + 120; s.snareX = s.x; }
          else if (b.emp) { s.empUntil = s.t + 120; hurt(b.dmg); }
          else hurt(b.dmg);
          return false;
        }
        return true;
      });

      s.enemies = s.enemies.filter((e) => {
        const E = ENEMIES[e.type];
        if (Math.abs(e.x - px) < (E.w + 30) / 2 && Math.abs(e.y - py) < (E.h + 24) / 2) { hurt(E.dmg); return false; }
        if (e.y > H + 40) return false;
        return true;
      });

      // ---- draw ----
      ctx.fillStyle = "#0c0d16";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(243,243,238,0.5)";
      s.stars.forEach((st) => { st.y = (st.y + st.v) % H; ctx.fillRect(st.x, st.y, 2, 2); });

      s.smoke.forEach((p) => {
        ctx.fillStyle = `rgba(200, 200, 205, ${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      s.blasts.forEach((bl) => {
        ctx.strokeStyle = `rgba(255, 138, 61, ${bl.alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = `rgba(255, 210, 30, ${bl.alpha * 0.6})`;
        ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.r * 0.6, 0, Math.PI * 2); ctx.stroke();
      });

      if (weapon.beam && s.beamOn) {
        const half = 7;
        const flick = 0.75 + Math.sin(s.t * 0.6) * 0.2;
        const angles = attach === 0 ? [0] : attach === 1 ? [-0.22, 0.22] : [-0.3, 0, 0.3];
        angles.forEach((ang) => {
          ctx.save();
          ctx.translate(px, py - 16);
          ctx.rotate(ang);
          ctx.fillStyle = maxed ? `rgba(225, 75, 74, ${0.35 * flick})` : `rgba(180, 107, 255, ${0.35 * flick})`;
          ctx.fillRect(-half - 5, -H, (half + 5) * 2, H);
          ctx.fillStyle = maxed ? `rgba(255, 150, 145, ${flick})` : `rgba(226, 190, 255, ${flick})`;
          ctx.fillRect(-half, -H, half * 2, H);
          ctx.fillStyle = `rgba(255, 255, 255, ${flick})`;
          ctx.fillRect(-half * 0.35, -H, half * 0.7, H);
          ctx.restore();
        });
      }

      // player bullets
      s.bullets.forEach((b) => {
        if (weapon.laser) {
          ctx.fillStyle = maxed ? "#b46bff" : "#ff6bb3";
          ctx.fillRect(b.x - 3, b.y - 18, 6, 22);
          ctx.fillStyle = maxed ? "#e2beff" : "#ffc2de";
          ctx.fillRect(b.x - 1, b.y - 18, 2, 22);
        } else if (weapon.aoe && !weapon.big) {
          ctx.fillStyle = "#2b7d5e"; ctx.fillRect(b.x - 7, b.y - 9, 14, 14);
          ctx.fillStyle = "#4ade80"; ctx.fillRect(b.x - 5, b.y - 7, 10, 10);
          ctx.fillStyle = "#d9ffe9"; ctx.fillRect(b.x - 2, b.y - 4, 4, 4);
          ctx.fillStyle = "rgba(74, 222, 128, 0.5)"; ctx.fillRect(b.x - 3, b.y + 5, 6, 5);
        } else if (weapon.big) {
          ctx.fillStyle = "#cdd6ea"; ctx.fillRect(b.x - 4, b.y - 12, 8, 12);
          ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 4, b.y - 14, 8, 3);
          ctx.fillStyle = "#ff8a3d"; ctx.fillRect(b.x - 2, b.y, 4, 4);
        } else if (wId === "smg") {
          ctx.fillStyle = maxed ? "#ff2d55" : "#ffd21e";
          ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
          if (maxed) { ctx.fillStyle = "#ff9fb4"; ctx.fillRect(b.x - 1, b.y - 8, 2, 10); }
        } else if (maxed) {
          ctx.fillStyle = "#ffd21e"; ctx.fillRect(b.x - 3, b.y - 10, 6, 12);
          ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 2, b.y - 8, 4, 8);
        } else {
          ctx.fillStyle = "#ffd21e"; ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
        }
      });

      // rapid rockets
      s.rockets.forEach((r) => {
        ctx.fillStyle = "#cdd6ea"; ctx.fillRect(r.x - 3, r.y - 10, 6, 11);
        ctx.fillStyle = "#e14b4a"; ctx.fillRect(r.x - 3, r.y - 13, 6, 3);
        ctx.fillStyle = "#ff8a3d"; ctx.fillRect(r.x - 2, r.y + 1, 4, 4);
      });

      // orbs
      if (orbCount > 0) {
        const offs = orbCount === 1 ? [0] : orbCount === 2 ? [0, Math.PI] : [0, 2.094, 4.189];
        offs.forEach((off) => {
          const ox = px + Math.cos(s.orbA + off) * 62;
          const oy = py + Math.sin(s.orbA + off) * 62;
          ctx.fillStyle = "#1c6f95"; ctx.fillRect(ox - 8, oy - 8, 16, 16);
          ctx.fillStyle = "#3BB8E5"; ctx.fillRect(ox - 6, oy - 6, 12, 12);
          ctx.fillStyle = "#8fd8f2"; ctx.fillRect(ox - 3, oy - 3, 6, 6);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(ox - 1, oy - 1, 3, 3);
        });
      }

      ctx.fillStyle = "#ff8a3d";
      s.missiles.forEach((m) => ctx.fillRect(m.x - 3, m.y - 6, 6, 12));

      // enemy bullets
      s.ebullets.forEach((b) => {
        const len = b.long || 24;
        if (b.snare) {
          const wob = Math.sin(s.t * 0.5) * 2;
          ctx.fillStyle = "rgba(0, 224, 198, 0.25)";
          ctx.fillRect(b.x - 8, b.y, 16, len);
          ctx.fillStyle = "#00e0c6";
          ctx.fillRect(b.x - 4 + wob, b.y, 8, len);
          ctx.fillStyle = "#eafffb";
          ctx.fillRect(b.x - 1, b.y + 2, 2, len - 4);
          ctx.strokeStyle = "rgba(0,224,198,0.7)";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(b.x, b.y + len / 2, 9 + Math.sin(s.t * 0.4) * 2, 0, Math.PI * 2); ctx.stroke();
        } else if (b.hunter) {
          ctx.fillStyle = "rgba(0, 224, 198, 0.35)";
          ctx.fillRect(b.x - 4, b.y, 8, len);
          ctx.fillStyle = "#00e0c6";
          ctx.fillRect(b.x - 2, b.y, 4, len);
          ctx.fillStyle = "#eafffb";
          ctx.fillRect(b.x - 1, b.y, 2, len * 0.4);
        } else if (b.emp) {
          const age = s.t - (b.born || 0);
          const pulse = 4 + Math.sin(age * 0.35) * 2;
          ctx.strokeStyle = `rgba(59, 184, 229, ${0.35 + Math.sin(age * 0.35) * 0.2})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 9 + pulse, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = "rgba(59, 184, 229, 0.4)";
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#bde9fb";
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 3.5, 0, Math.PI * 2); ctx.fill();
        } else if (b.laser) {
          ctx.fillStyle = "rgba(255,107,179,0.4)";
          ctx.fillRect(b.x - 4, b.y, 8, len);
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 2, b.y, 4, len);
          ctx.fillStyle = "#fff";
          ctx.fillRect(b.x - 1, b.y, 2, len);
        } else {
          ctx.fillStyle = `${b.color}55`;
          ctx.fillRect(b.x - 4, b.y, 8, len);
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 2, b.y, 4, len);
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillRect(b.x - 1, b.y, 2, Math.max(4, len * 0.35));
        }
      });

      // enemies
      s.enemies.forEach((e) => {
        const E = ENEMIES[e.type];

        // large wings
        if (E.wings) {
          ctx.fillStyle = E.color;
          const wingW = E.w * 0.55, wingH = E.h * 0.4;
          ctx.fillRect(e.x - E.w / 2 - wingW, e.y - wingH / 2, wingW, wingH);
          ctx.fillRect(e.x + E.w / 2, e.y - wingH / 2, wingW, wingH);
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.fillRect(e.x - E.w / 2 - wingW, e.y + wingH / 2 - 4, wingW, 4);
          ctx.fillRect(e.x + E.w / 2, e.y + wingH / 2 - 4, wingW, 4);
        }

        ctx.fillStyle = E.color;
        ctx.fillRect(e.x - E.w / 2, e.y - E.h / 2, E.w, E.h);
        if (!E.wings) {
          ctx.fillRect(e.x - E.w / 2 - 5, e.y - 3, 5, 8);
          ctx.fillRect(e.x + E.w / 2, e.y - 3, 5, 8);
        }

        // crown
        if (E.crown) {
          ctx.fillStyle = E.crown;
          const cw = E.w * 0.5;
          ctx.fillRect(e.x - cw / 2, e.y - E.h / 2 - 8, cw, 5);
          [-cw / 2, -3, cw / 2 - 6].forEach((off) => ctx.fillRect(e.x + off, e.y - E.h / 2 - 14, 6, 7));
        }

        // barrels
        if (E.barrels) {
          ctx.fillStyle = "#3a3d52";
          const offs = E.barrels === 4 ? [-33, -11, 11, 33] : [-12, 0, 12];
          offs.forEach((off) => ctx.fillRect(e.x + off - 2, e.y + E.h / 2, 4, 7));
        }

        // eyes
        ctx.fillStyle = E.redEyes ? "#e14b4a" : "#111";
        const eyeW = E.boss ? 8 : 5;
        ctx.fillRect(e.x - E.w * 0.22, e.y - E.h * 0.18, eyeW, eyeW);
        ctx.fillRect(e.x + E.w * 0.22 - eyeW, e.y - E.h * 0.18, eyeW, eyeW);
        if (E.redEyes) {
          ctx.fillStyle = "rgba(225,75,74,0.35)";
          ctx.fillRect(e.x - E.w * 0.22 - 2, e.y - E.h * 0.18 - 2, eyeW + 4, eyeW + 4);
          ctx.fillRect(e.x + E.w * 0.22 - eyeW - 2, e.y - E.h * 0.18 - 2, eyeW + 4, eyeW + 4);
        }

        if (e.maxHp > 1) {
          const barW = E.boss ? E.w : E.w;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(e.x - barW / 2, e.y - E.h / 2 - (E.crown ? 20 : 7), barW, E.boss ? 6 : 4);
          ctx.fillStyle = E.boss ? "#e14b4a" : "#4ade80";
          ctx.fillRect(e.x - barW / 2, e.y - E.h / 2 - (E.crown ? 20 : 7), barW * Math.max(0, e.hp / e.maxHp), E.boss ? 6 : 4);
        }
      });

      // hunter reticle
      const marking = s.enemies.find((e) => ENEMIES[e.type].hunter && !e.snareFired && e.markT > 20);
      if (marking) {
        const prog = Math.min(1, marking.markT / 180);
        ctx.strokeStyle = `rgba(0, 224, 198, ${0.5 + prog * 0.5})`;
        ctx.lineWidth = 2;
        const r = 34 - prog * 16;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(s.t * 0.04);
        ctx.strokeRect(-r, -r, r * 2, r * 2);
        ctx.restore();
        ctx.beginPath(); ctx.arc(px, py, r * 0.7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px - r - 8, py); ctx.lineTo(px - r + 2, py);
        ctx.moveTo(px + r - 2, py); ctx.lineTo(px + r + 8, py);
        ctx.moveTo(px, py - r - 8); ctx.lineTo(px, py - r + 2);
        ctx.moveTo(px, py + r - 2); ctx.lineTo(px, py + r + 8);
        ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(marking.x, marking.y); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Jebby's ship
      ctx.fillStyle = snared ? "#7fdcef" : "#3BB8E5";
      ctx.fillRect(px - 15, py - 10, 30, 20);
      ctx.fillRect(px - 21, py - 2, 6, 10);
      ctx.fillRect(px + 15, py - 2, 6, 10);
      ctx.fillRect(px - 4, py - 18, 8, 8);
      ctx.fillStyle = "#111";
      ctx.fillRect(px - 9, py - 5, 5, 5);
      ctx.fillRect(px + 4, py - 5, 5, 5);
      ctx.fillStyle = "#ff8a3d";
      ctx.fillRect(px - 6, py + 10, 4, 5 + (s.t % 6 < 3 ? 3 : 0));
      ctx.fillRect(px + 2, py + 10, 4, 5 + (s.t % 6 >= 3 ? 3 : 0));

      if (snared) {
        ctx.strokeStyle = `rgba(0, 224, 198, ${0.5 + Math.sin(s.t * 0.4) * 0.3})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(px - 24, py - 22, 48, 44);
      }
      if (empActive) {
        ctx.strokeStyle = `rgba(59, 184, 229, ${0.4 + Math.sin(s.t * 0.5) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, 30, 0, Math.PI * 2); ctx.stroke();
      }

      if (s.t % 10 === 0) {
        const king = s.enemies.find((e) => e.type === "kingship");
        setHud({
          score: s.score,
          hearts: s.hearts,
          wave: bonusHp(),
          status: snared ? "SNARED" : empActive ? "EMP" : null,
          boss: king ? Math.max(0, Math.round((king.hp / king.maxHp) * 100)) : null,
        });
      }

      if (s.dead) {
        cancelAnimationFrame(raf);
        const p = loadProfile();
        p.points += s.score;
        saveProfile(p);
        setTimeout(() => onGameOver(s.score), 300);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerdown", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.spaceStage}>
      <div className={styles.spaceHud}>
        <span className={styles.sideLabel}>SCORE</span>
        <span className={styles.sideValue}>{hud.score}</span>
        <span className={styles.sideLabel}>HEARTS</span>
        <span className={styles.sideValue} style={{ color: hud.hearts <= 5 ? "#e14b4a" : undefined }}>♥ {hud.hearts}</span>
        {hud.wave > 0 && <span className={styles.sideHint}>Enemy HP +{hud.wave}</span>}
        {hud.boss != null && <span className={styles.bossTag}>KINGSHIP {hud.boss}%</span>}
        {hud.status && <span className={styles.statusTag}>{hud.status}</span>}
        <span className={styles.sideHint}>Move: mouse / A D</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className={styles.spaceCanvas} />
    </div>
  );
}