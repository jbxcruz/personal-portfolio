"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../Playground.module.scss";
import { loadProfile, saveProfile } from "../arcade";

export const WEAPONS = {
  basic:  { name: "Basic Fire Cannon", cost: 0,    dmg: 1, delay: 320, maxLvl: 10, upCost: 25,  desc: "1 dmg · average fire rate" },
  twin:   { name: "Twin Blasters",     cost: 300,  dmg: 1, delay: 300, maxLvl: 10, upCost: 35,  desc: "1 dmg · average rate · twin barrel", twin: true },
  smc:    { name: "Space Sub-Machine Cannons", cost: 650, dmg: 1, delay: 600, maxLvl: 15, upCost: 70, desc: "1 dmg · 3-round burst", burst: 3, burstGap: 6 },
  blaster:{ name: "Blaster Cannons",   cost: 850,  dmg: 3, delay: 650, maxLvl: 15, upCost: 100, desc: "3 dmg · slow rate · AOE", aoe: 40 },
  smg:    { name: "Space Machine Gun", cost: 1100, dmg: 1, delay: 130, maxLvl: 10, upCost: 180, desc: "1 dmg · fast fire rate" },
  rocket: { name: "Rocket Missile",    cost: 1500, dmg: 5, delay: 1000, maxLvl: 15, upCost: 300, desc: "5 dmg · very slow · AOE · smoke trail", aoe: 55, big: true, trail: true },
  spread: { name: "Spreadshot Blasts", cost: 2300, dmg: 1, delay: 520, maxLvl: 20, upCost: 300, desc: "1 dmg · 4-way fan spread", spread: 4 },
  laser:  { name: "Laser Gun",         cost: 3000, dmg: 4, delay: 340, maxLvl: 10, upCost: 350, desc: "4 dmg · average fire rate", laser: true },
  plasma: { name: "Plasma Laser Beam", cost: 5000, dmg: 3, delay: 0,   maxLvl: 20, upCost: 500, desc: "3 dmg · continuous beam · pulses", beam: true, beamOn: 45, beamOff: 38 },
  hornet: { name: "Space Hornet", cost: 8000, dmg: 1, delay: 160, maxLvl: 10, upCost: 700, desc: "1 dmg · fast rate · mini homing swarm", hornet: true },
};

export const weaponDmg = (id, lvl) => WEAPONS[id].dmg + Math.floor(lvl / 5);

export const ENEMIES = {
  bounty:      { name: "Space Bounty", hp: 20, pts: 50, speed: 0.6, dmg: 2, w: 40, h: 34, color: "#cdd6ea", fireChance: 0, bulletSpeed: 0, parkY: 90, desc: "Never moves once parked, never fires. Pure bounty. May drop Uncommon buffs." },
  fighter:     { name: "Space Fighter", hp: 1,  pts: 1000,  speed: 1.0,  dmg: 1,  w: 26, h: 20, color: "#4ade80", fireChance: 0.003, bulletSpeed: 2.3, desc: "A basic fighter with standard cannons." },
  hummingbird: { name: "Space Hummingbird", hp: 1, pts: 2, speed: 2.1, dmg: 1, w: 22, h: 16, color: "#ffd21e", fireChance: 0.004, bulletSpeed: 2.3, desc: "Fast and weaving. Hard to pin down." },
  gunner:      { name: "Space Gunner", hp: 3,  pts: 5, speed: 0.8,  dmg: 1,  w: 28, h: 22, color: "#ff8a3d", fireChance: 0.02,  bulletSpeed: 3.0, desc: "Machine guns. Fires roughly 5x as often. May drop Uncommon buffs." },
  galaxy:      { name: "Galaxy Fighter", hp: 5, pts: 8, speed: 0.9,  dmg: 5,  w: 30, h: 24, color: "#e14b4a", fireChance: 0.006, bulletSpeed: 3.2, desc: "Plasma cannons. Hits brutally hard." },
  crusader:    { name: "Galaxy Crusader", hp: 8, pts: 10, speed: 0.45, dmg: 3, w: 44, h: 32, color: "#b46bff", fireChance: 0.007, bulletSpeed: 2.2, wings: true, desc: "Broad-winged tank. Splits into 3 Space Fighters. May drop Uncommon buffs." },
  timekeeper:  { name: "Time Keeper", hp: 4, pts: 30, speed: 0.7, dmg: 2, w: 30, h: 26, color: "#3BB8E5", fireChance: 0.014, bulletSpeed: 2.4, emp: true, desc: "EMP blasts. A hit slows your fire rate and bullets for 2s. May drop Rare buffs." },
  hunter:      { name: "Space Hunter", hp: 4, pts: 35, speed: 0.75, dmg: 1, w: 30, h: 24, color: "#00e0c6", fireChance: 0.012, bulletSpeed: 4.2, hunter: true, hoverY: 120, desc: "Stalks your lane from above. Marks you for 2s, fires a Snare, then hunts you while frozen. May drop Rare buffs." },
  galactic:    { name: "Galactic Hunter", hp: 7, pts: 100, speed: 0.9, dmg: 2, w: 34, h: 28, color: "#c452ff", beamColor: "#e0409a", fireChance: 0, bulletSpeed: 0, galactic: true, hoverY: 100, desc: "Charges a light beam at the nearest edge, then sweeps it across the field. Sleeps to regenerate, invulnerable. May drop Rare buffs." },
  darkres:     { name: "Dark Resistance", hp: 15, pts: 35, speed: 0.5, dmg: 1, w: 40, h: 30, color: "#6b6f8a", fireChance: 0.016, bulletSpeed: 3.6, barrels: 3, wings: true, redEyes: true, desc: "Heavy winged hull, 3 sub-machine barrels. May drop Rare buffs." },
  mothership:  { name: "Mothership", hp: 250, pts: 150, speed: 0.35, dmg: 7, w: 56, h: 36, color: "#ff6bb3", fireChance: 0.009, bulletSpeed: 4.5, crown: "#ffd21e", desc: "Crowned laser cruiser. Splits into 2 Dark Resistances. May drop Very Rare buffs." },
  huntress:    { name: "Galactic Huntress", hp: 15, shield: 5, pts: 250, speed: 0.85, dmg: 5, w: 30, h: 26, color: "#3d363b", accentColor: "#c81f3f", huntress: true, hoverY: 110, fireChance: 0, bulletSpeed: 0, chargeFrames: 360, desc: "A galactic assassin. Locks onto you and charges Celestial Strike for 6s, static and vulnerable. Land the kill or take a 15-heart beam, and she will simply do it again." },
  queen:       { name: "Queen's Starship", hp: 1500, pts: 500, speed: 0.25, dmg: 1, w: 84, h: 52, color: "#ff03a2", queen: true, barrels: 3, wings: true, crown: "#ffd21e", tallCrown: true, redEyes: true, hoverY: 100, fireChance: 0.05, bulletSpeed: 4.6, desc: "The King's Queen. Charges Time Reversal for 10s; break her 600-hp shield to stun her, or eat a 6-heart blast that cripples your guns for 15s. Dies into 2 Galactic Hunters, 2 Dark Resistances, and 2 Space Hunters." },
  kingship:    { name: "Kingship", hp: 2500, pts: 1000, speed: 0.22, dmg: 5, w: 92, h: 56, color: "#7a3fb5", fireChance: 0.05, bulletSpeed: 5.2, boss: true, barrels: 4, wings: true, crown: "#e14b4a", redEyes: true, hoverY: 90, desc: "Super-heavy flagship. 4 laser barrels, summons escorts every 20s, dies into 2 Motherships and a Bounty. May drop Very Rare buffs." },
  fleet:       { name: "The Galactic Fleet", hp: 5000, pts: 6666, speed: 0.18, dmg: 4, w: 150, h: 66, color: "#2a2f4a", accentColor: "#00e0c6", fleet: true, barrels: 4, wings: true, crown: "#00e0c6", tallCrown: true, redEyes: true, hoverY: 78, fireChance: 0.05, bulletSpeed: 5.5, desc: "A legendary planet-killer. Cycles Reinforcements, Bombardment, and Prism Blast. Kill it for +5000 lives, and it will drop the King, the Queen, and 3 Galactic Huntresses on you." },
};

export const BUFFS = {
  emp:   { name: "EMP Blast", rarity: "Uncommon", color: "#3BB8E5", desc: "Detonates on pickup. Everything nearby is slowed for 3s." },
  rapid: { name: "Rapid Boost", rarity: "Uncommon", color: "#ff8a3d", desc: "+5 fire rate for 10 seconds." },
  heart: { name: "Heart", rarity: "Rare", color: "#e14b4a", desc: "+1 life, instantly." },
  vault: { name: "Vault", rarity: "Rare", color: "#ffd21e", desc: "+350 points, instantly." },
  nuke:  { name: "Nuclear Wave", rarity: "Very Rare", color: "#a3ff5e", desc: "Appears only late. Wipes every enemy on the field." },
};


// fleet
const FLEET_SCORE_REQ = 5000;      // only once you have earned 5000 points, once per run
const FLEET_COOLDOWN = 20 * 60;    // 20s between abilities
const REINF_DUR = 36 * 60;
const BOMB_DUR = 40 * 60;
const PRISM_DUR = 10 * 60;
const PRISM_HP = 90;
const VULN_DUR = 8 * 60;


//king
const W = 620, H = 440;
const MAX_HEARTS = 20;
const KING_COOLDOWN = 90 * 60;
const KING_EARLIEST = 150 * 60;  // first appearance after 90s
const KING_SUMMON_EVERY = 20 * 60;
const NUKE_EARLIEST = 120 * 60;

//queen
const QUEEN_EARLIEST = 90 * 60;   // first appearance after 100s
const QUEEN_SHIELD = 600;
const SURGE_FRAMES = 600;          // 10s to interrupt her
const STUN_FRAMES = 600;           // 10s stunned if you break it

// huntress
const HUNTRESS_EARLIEST = 45 * 60;   // she only appears after 45s


const UNCOMMON_DROPPERS = ["bounty", "gunner", "crusader"];
const RARE_DROPPERS = ["timekeeper", "galactic", "darkres", "hunter"];
const VERYRARE_DROPPERS = ["mothership", "kingship", "queen"];

export default function SpaceGuardian({ onGameOver }) {
  const canvasRef = useRef(null);
  const savedRef = useRef(false);
  const [hud, setHud] = useState({ score: 0, hearts: MAX_HEARTS, wave: 0, shields: 0, status: null, boss: null, buff: null });

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
    const shieldStock = acc.holoshield?.lvl || 0;   // consumable Holo-Shields
    const maxHearts = MAX_HEARTS + (acc.health?.lvl || 0);
    const fireMult = 1 - 0.08 * (acc.firerate?.lvl || 0);
    const orbLvl = acc.orb ? acc.orb.lvl : -1;
    const twinOrbLvl = acc.twinorb ? acc.twinorb.lvl : -1;
    const tripleOrbs = !!acc.tripleorb;
    const hasHoming = !!acc.homing;
    const twinHomingLvl = acc.twinhoming ? acc.twinhoming.lvl : -1;
    const hasRapidRockets = !!acc.rapidrockets;
    const attach = acc.gunattach?.lvl || 0;

    const hasBea = !!acc.bea;
    // Bea always has the Space Machine Gun as her default (it comes with her),
    // and she never carries the gun Jebby has equipped.
    const beaPick = (() => {
      const chosen = profile.beaWeapon;
      if (chosen && WEAPONS[chosen] && profile.owned[chosen] && chosen !== wId) return chosen;
      if (wId !== "smg") return "smg";                        // her default, owned or not
      return Object.keys(WEAPONS).find((id) => profile.owned[id] && id !== wId) || "basic";
    })();
    const beaW = WEAPONS[beaPick];
    const beaLvl = profile.owned[beaPick]?.lvl || 0;
    const beaDmg = weaponDmg(beaPick, beaLvl);


    const orbCount = tripleOrbs ? 3 : twinOrbLvl >= 0 ? 2 : orbLvl >= 0 ? 1 : 0;
    const orbSpeed = 0.03 + Math.max(0, orbLvl) * 0.012 + Math.max(0, twinOrbLvl) * 0.008;

    const s = {
      x: W / 2, hearts: maxHearts, score: 0,
      shields: shieldStock, hurtUntil: 0, shake: 0,
      bullets: [], ebullets: [], ebeams: [], enemies: [], stars: [], blasts: [], smoke: [], pending: [], rockets: [],
      buffs: [], shockwaves: [], missiles: [],
      prisms: [], bombWarn: null, noFireUntil: 0, fleetSpawned: false,
      lastFire: 0, t: 0, dead: false, spawnEvery: 95,
      orbA: 0, lastMissile: 0, lastRocket: 0, lastBeaFire: 0,
      beamOn: false, beamT: 0,
      beaBeamOn: false, beaBeamT: 0, bea: null,
      empUntil: 0, snaredUntil: 0, snareX: 0, rapidUntil: 0, slowFieldUntil: 0,
      reversedUntil: 0, lastQueen: -QUEEN_EARLIEST,
      lastKing: -KING_COOLDOWN,
      kills: {},
    };
    for (let i = 0; i < 55; i++) s.stars.push({ x: Math.random() * W, y: Math.random() * H, v: 0.4 + Math.random() * 1.2 });

    // every 40s the enemies get stronger, alternating:
    // +1 HP, then +1 fire rate, then +1 HP...
    const TIER = 40 * 60;

    const tierCount = () => Math.floor(s.t / TIER);

    const bonusHp = () => Math.ceil(tierCount() / 2);

    const fireTier = () => Math.floor(tierCount() / 2);

    const fireBoost = () => Math.max(0.35, 1 - fireTier() * 0.1);

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
      const hp = E.hp + (E.boss || E.queen || E.fleet ? 0 : bonusHp());
      s.enemies.push({
        type, x: x ?? 30 + Math.random() * (W - 60), y: y ?? -40,
        hp, maxHp: hp, wob: Math.random() * 6.28,
        markT: E.hunter ? 0 : -1, snareFired: false, lastShot: 0, lastSummon: 0, reload: 0,
        phase: E.galactic ? "enter" : E.queen ? "enter" : null, phaseT: 0, dir: 1,
        shield: E.shield || 0, nextAbility: 300 + Math.floor(Math.random() * 600),
        ability: E.fleet ? "idle" : null, abilT: 0, abilStart: 0, subT: 0, lane: 0, bombing: false, vulnUntil: 0,
      });
    };


  
    const kingAlive = () => s.enemies.some((e) => e.type === "kingship");
    const queenAlive = () => s.enemies.some((e) => e.type === "queen");


    
    const fleetAlive = () => s.enemies.some((e) => e.type === "fleet");

    const pickType = () => {
      // The Galactic Fleet: 5000 points earned, rolling chance, once per run
      if (!s.fleetSpawned && !fleetAlive() && s.score >= FLEET_SCORE_REQ && Math.random() < 0.02) {
        s.fleetSpawned = true;
        return "fleet";
      }
      // bosses roll their own dice, before r exists
      if (s.t > QUEEN_EARLIEST && !queenAlive() && s.t - s.lastQueen > QUEEN_EARLIEST && Math.random() < 0.02) {
        s.lastQueen = s.t;
        return "queen";
      }
      if (s.t > KING_EARLIEST && !kingAlive() && s.t - s.lastKing > KING_COOLDOWN && Math.random() < 0.02) {
        s.lastKing = s.t;
        return "kingship";
      }

      const elapsed = s.t / 60;
      const r = Math.random();
      const rare = Math.min(0.34, 0.05 + elapsed * 0.004);

      if (s.t > HUNTRESS_EARLIEST && r < rare * 0.05) return "huntress";
      if (r < rare * 0.10) return "galactic";
      if (r < rare * 0.18) return "mothership";
      if (r < rare * 0.28) return "bounty";
      if (r < rare * 0.42) return "darkres";
      if (r < rare * 0.56) return "hunter";
      if (r < rare * 0.70) return "crusader";
      if (r < rare * 0.84) return "gunner";
      if (r < rare * 0.92) return "timekeeper";
      if (r < rare) return "galaxy";
      if (r < rare + 0.35) return "hummingbird";
      return "fighter";
    };

    // armor = hologram shield: absorbs damage entirely up to its level
    const hurt = (n) => {
      // Holo-Shield absorbs one hit entirely, then breaks
      if (s.shields > 0) {
        s.shields -= 1;
        s.shockwaves.push({ x: s.x, y: H - 40, r: 26, max: 60, alpha: 0.9, color: "#3BB8E5" });
        return;
      }
      s.hearts -= n;
      s.hurtUntil = s.t + 22;
      s.shake = 7;
      if (s.hearts <= 0) { s.hearts = 0; s.dead = true; }
    };

    const damage = (e, amount) => {
      if (e.hp <= 0) return;
      if (e.phase === "sleep") return;
      if (e.shield > 0 && ENEMIES[e.type].huntress) {
        const spill = amount - e.shield;
        e.shield = Math.max(0, e.shield - amount);
        if (spill > 0) e.hp -= spill;   // overkill carries through to her hull
        return;
      }
      if (ENEMIES[e.type].fleet && e.vulnUntil && s.t < e.vulnUntil) {
        e.hp -= amount * 2;               // core exposed
        return;
      }
      if (e.phase === "surge") {          // Queen: only her shield can be hit
        e.shield -= amount;
        if (e.shield <= 0) {
          e.hp -= 100;                    // shield break punishes her
          e.phase = "stun";
          e.phaseT = 0;
          s.shockwaves.push({ x: e.x, y: e.y, r: 12, max: 200, alpha: 0.9, color: "#ffd21e" });
        }
        return;
      }
      e.hp -= amount;
    };

    // buffs only drop from specific enemies, by rarity tier
    const dropBuff = (type, x, y) => {
      const r = Math.random();
      let pick = null;
      if (VERYRARE_DROPPERS.includes(type)) {
        if (s.t > NUKE_EARLIEST && r < 0.30) pick = "nuke";
        else if (r < 0.55) pick = Math.random() < 0.5 ? "heart" : "vault";
      } else if (RARE_DROPPERS.includes(type)) {
        if (r < 0.22) pick = Math.random() < 0.5 ? "heart" : "vault";
      } else if (UNCOMMON_DROPPERS.includes(type)) {
        if (r < 0.30) pick = Math.random() < 0.5 ? "emp" : "rapid";
      }
      if (pick) s.buffs.push({ type: pick, x, y, born: s.t });
    };

    const kill = (e) => {
      if (e.counted) return;   // one death, one count, whatever path got here
      e.counted = true;

      const E = ENEMIES[e.type];
      s.kills[e.type] = (s.kills[e.type] || 0) + 1;
      s.score += E.pts;
      dropBuff(e.type, e.x, e.y);
      if (e.type === "crusader") for (let i = -1; i <= 1; i++) spawn("fighter", e.x + i * 30, e.y);
      if (e.type === "mothership") for (let i = -1; i <= 1; i += 2) spawn("darkres", e.x + i * 40, e.y);
      if (e.type === "kingship") {
        spawn("mothership", e.x - 70, e.y);
        spawn("mothership", e.x + 70, e.y);
        spawn("bounty", e.x, e.y - 20);
        spawn("huntress", e.x - 100, e.y - 30);
        spawn("huntress", e.x, e.y - 40);
        spawn("huntress", e.x + 100, e.y - 30);
      }
      if (e.type === "fleet") {
        s.hearts += 100;                               // the prize
        spawn("kingship", e.x - 120, e.y);
        spawn("queen", e.x + 120, e.y);
        spawn("huntress", e.x - 60, e.y - 30);
        spawn("huntress", e.x, e.y - 40);
        spawn("huntress", e.x + 60, e.y - 30);
      }
      if (e.type === "queen") {
        spawn("galactic", e.x - 90, e.y);
        spawn("galactic", e.x + 90, e.y);
        spawn("darkres", e.x - 50, e.y + 20);
        spawn("darkres", e.x + 50, e.y + 20);
        spawn("hunter", e.x - 20, e.y - 20);
        spawn("hunter", e.x + 20, e.y - 20);
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

    const collectBuff = (b) => {
      if (b.type === "heart") s.hearts = Math.min(maxHearts + 20, s.hearts + 1);
      else if (b.type === "vault") s.score += 350;
      else if (b.type === "rapid") s.rapidUntil = s.t + 600;
      else if (b.type === "emp") {
        s.slowFieldUntil = s.t + 180;
        s.shockwaves.push({ x: b.x, y: b.y, r: 10, max: 180, alpha: 0.9, color: "#3BB8E5" });
      } else if (b.type === "nuke") {
        s.shockwaves.push({ x: b.x, y: b.y, r: 10, max: 700, alpha: 1, color: "#a3ff5e" });
        s.enemies.forEach((e) => {
          const E = ENEMIES[e.type];
          if (E.boss || E.queen) e.hp -= 400;   // bosses take a beating, not a wipe
          else e.hp = 0;
        });
        s.enemies.filter((e) => e.hp <= 0).forEach(kill);
        s.enemies = s.enemies.filter((e) => e.hp > 0);
        s.ebullets = [];
      }
    };

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      s.t += 1;

      const empActive = s.t < s.empUntil;
      const snared = s.t < s.snaredUntil;
      const rapid = s.t < s.rapidUntil;
      const slowField = s.t < s.slowFieldUntil;
      const reversed = s.t < s.reversedUntil;
      const slowMult = (empActive ? 1.8 : 1) * (reversed ? 2.2 : 1) * (rapid ? 0.5 : 1);
      const bulletSlow = (empActive ? 0.5 : 1) * (reversed ? 0.45 : 1);
      const enemySlow = slowField ? 0.45 : 1;

      s.spawnEvery = Math.max(28, 95 - Math.floor(s.t / 300) * 6);
      if (s.t % s.spawnEvery === 0) spawn(pickType());

      if (!snared) {
        if (keys["a"] || keys["arrowleft"]) s.x -= 4.4;
        if (keys["d"] || keys["arrowright"]) s.x += 4.4;
        s.x = Math.max(18, Math.min(W - 18, s.x));
      } else s.x = s.snareX;

      const px = s.x, py = H - 40;

      // ---- Jebby's firing ----
      if (weapon.beam) {
        s.beamT += 1;
        const onFrames = Math.round(weapon.beamOn);
        const offFrames = Math.round(weapon.beamOff * fireMult * slowMult);
        if (s.beamOn && s.beamT > onFrames) { s.beamOn = false; s.beamT = 0; }
        else if (!s.beamOn && s.beamT > offFrames) { s.beamOn = true; s.beamT = 0; }
        if (snared || s.t < s.noFireUntil) s.beamOn = false;
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
      } else if (!snared && s.t >= s.noFireUntil && s.t - s.lastFire >= (weapon.delay * fireMult * slowMult) / (1000 / 60)) {
        s.lastFire = s.t;
        const bursts = weapon.burst || 1;
        const gap = weapon.burstGap || 0;
        for (let bi = 0; bi < bursts; bi++) s.pending.push({ at: s.t + bi * gap });
      }

      // ---- Bea's firing: any weapon type, her own gun ----
      if (hasBea && beaW && s.t >= s.noFireUntil) {
        const bx = Math.min(W - 24, px + 52), by = py + 4;
        s.bea = { x: bx, y: by };

        if (beaW.beam) {
          s.beaBeamT += 1;
          const on = Math.round(beaW.beamOn * 0.8);
          const off = Math.round(beaW.beamOff * 1.2);
          if (s.beaBeamOn && s.beaBeamT > on) { s.beaBeamOn = false; s.beaBeamT = 0; }
          else if (!s.beaBeamOn && s.beaBeamT > off) { s.beaBeamOn = true; s.beaBeamT = 0; }
          if (s.beaBeamOn) {
            s.enemies.forEach((e) => {
              const E = ENEMIES[e.type];
              if (e.y >= by - 12) return;
              if (Math.abs(e.x - bx) < E.w / 2 + 4) {
                if (!e.beaCd || s.t - e.beaCd > 12) { damage(e, beaDmg); e.beaCd = s.t; }
              }
            });
          }
        } else if (s.t - s.lastBeaFire >= (beaW.delay * 1.15) / (1000 / 60)) {
          s.lastBeaFire = s.t;
          const bursts = beaW.burst || 1;
          for (let i = 0; i < bursts; i++) s.pending.push({ at: s.t + i * (beaW.burstGap || 0), bea: true });
        }
      }

      // release pending shots
      s.pending = s.pending.filter((p) => {
        if (s.t < p.at) return true;

        if (p.queenShot) {
          s.ebullets.push({
            x: p.queenShot.x, y: p.queenShot.y, v: p.queenShot.v, dmg: 1,
            color: "#ff9fdc", kind: "queen", long: 16, born: s.t,
          });
          return false;
        }

        if (p.bea && s.bea) {
          const bx = s.bea.x, by = s.bea.y - 12;
          if (beaW.spread) {
            const n = beaW.spread;
            const arc = 0.42;
            for (let i = 0; i < n; i++) {
              const a = -arc / 2 + (arc * i) / (n - 1);
              s.bullets.push({ x: bx, y: by, vx: Math.sin(a) * 4, vy: -Math.cos(a) * 5, spread: true, bea: true });
            }
          } else if (beaW.twin) {
            s.bullets.push({ x: bx - 6, y: by, bea: true }, { x: bx + 6, y: by, bea: true });
          } else {
            s.bullets.push({ x: bx, y: by, bea: true, trail: beaW.trail });
          }
          return false;
        }

        if (p.rocket) {
          s.rockets.push({ x: s.x - 12, y: H - 52 }, { x: s.x + 12, y: H - 52 });
          return false;
        }

        // hornet swarm
        if (weapon.hornet) {
          barrelOffsets().forEach((off) => {
            const target = s.enemies.length
              ? s.enemies[Math.floor(Math.random() * s.enemies.length)]
              : null;
            s.bullets.push({ x: s.x + off, y: H - 52, hornet: true, target, vx: 0, vy: -6 });
          });
          return false;
        }

        // regular bullets
        if (weapon.spread) {
          const n = weapon.spread + attach;
          const arc = 0.5;
          for (let i = 0; i < n; i++) {
            const a = -arc / 2 + (arc * i) / (n - 1);
            s.bullets.push({ x: s.x, y: H - 52, vx: Math.sin(a) * 5, vy: -Math.cos(a) * 6, spread: true });
          }
        } else {
          barrelOffsets().forEach((off) => s.bullets.push({ x: s.x + off, y: H - 52, trail: weapon.trail }));
        }
        return false;
      });

      // orbs
      if (orbCount > 0) {
        s.orbA += orbSpeed;
        const offs = orbCount === 1 ? [0] : orbCount === 2 ? [0, Math.PI] : [0, 2.094, 4.189];
        offs.forEach((off) => {
          const ox = px + Math.cos(s.orbA + off) * 120;
          const oy = py + Math.sin(s.orbA + off) * 120;
          s.enemies.forEach((e) => {
            const E = ENEMIES[e.type];
            if (Math.abs(ox - e.x) < E.w / 2 + 10 && Math.abs(oy - e.y) < E.h / 2 + 10) {
              if (!e.orbCd || s.t - e.orbCd > 18) { damage(e, 1); e.orbCd = s.t; }
            }
          });
        });
      }

      // homing / rapid rockets
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
              x: s.x + (count === 2 ? (i ? 12 : -12) : 0), y: H - 52,
              target: s.enemies[Math.floor(Math.random() * s.enemies.length)],
            });
          }
        }
      }

      s.rockets.forEach((r) => {
        r.y -= 7;
        if (s.t % 2 === 0) s.smoke.push({ x: r.x + (Math.random() * 3 - 1.5), y: r.y + 8, r: 3, a: 0.5 });
      });
      s.rockets = s.rockets.filter((r) => {
        for (const e of s.enemies) {
          const E = ENEMIES[e.type];
          if (e.hp > 0 && e.phase !== "sleep" && Math.abs(r.x - e.x) < E.w / 2 + 5 && Math.abs(r.y - e.y) < E.h / 2 + 8) {
            damage(e, 5); blast(e.x, e.y, 40); return false;
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
      const beaSpeed = (beaW ? (beaW.laser ? 8 : beaW.big ? 4.5 : 5.5) : 5.5) * bulletSlow;
      s.bullets.forEach((b) => {
        if (b.hornet) {
          if (b.target && s.enemies.includes(b.target) && b.target.hp > 0) {
            const dx = b.target.x - b.x, dy = b.target.y - b.y;
            const d = Math.hypot(dx, dy) || 1;
            b.vx += (dx / d) * 0.55;
            b.vy += (dy / d) * 0.55;
            const sp = Math.hypot(b.vx, b.vy) || 1;
            const max = 7.5;
            b.vx = (b.vx / sp) * max;
            b.vy = (b.vy / sp) * max;
          } else {
            b.target = s.enemies.length ? s.enemies[Math.floor(Math.random() * s.enemies.length)] : null;
          }
          b.x += b.vx * bulletSlow;
          b.y += b.vy * bulletSlow;
          if (s.t % 3 === 0) s.smoke.push({ x: b.x, y: b.y + 4, r: 2, a: 0.35 });
          return;
        }
        if (b.spread) { b.x += b.vx * bulletSlow; b.y += b.vy * bulletSlow; }
        else if (b.bea) {
          b.y -= beaSpeed;
          if (b.trail && s.t % 2 === 0) s.smoke.push({ x: b.x + (Math.random() * 3 - 1.5), y: b.y + 6, r: 2.5, a: 0.45 });
        } else {
          b.y -= bSpeed;
          if (b.trail && s.t % 2 === 0) s.smoke.push({ x: b.x + (Math.random() * 4 - 2), y: b.y + 8, r: 3.5, a: 0.55 });
        }
      });
      s.bullets = s.bullets.filter((b) => b.y > -30 && b.y < H + 30 && b.x > -30 && b.x < W + 30);
      s.ebullets.forEach((b) => { b.y += b.v * enemySlow; });
      s.ebullets = s.ebullets.filter((b) => b.y < H + 30);

      s.smoke.forEach((p) => { p.r += 0.35; p.a -= 0.022; });
      s.smoke = s.smoke.filter((p) => p.a > 0);

      // buffs drift down
      s.buffs.forEach((b) => { b.y += 0.9; });
      s.buffs = s.buffs.filter((b) => {
        if (Math.abs(b.x - px) < 26 && Math.abs(b.y - py) < 24) { collectBuff(b); return false; }
        return b.y < H + 20;
      });

      // ---- enemies ----
      s.enemies.forEach((e) => {
        const E = ENEMIES[e.type];
        const spd = E.speed * enemySlow;

        if (E.huntress) {
          e.phaseT += 1;
          if (!e.phase || e.phase === "enter") {
            if (e.y < E.hoverY) e.y += spd;
            // slide over your column while approaching
            const dx = px - e.x;
            e.x += Math.max(-2.6, Math.min(2.6, dx * 0.06));
            if (e.y >= E.hoverY) { e.phase = "charge"; e.phaseT = 0; e.lockX = px; }
          } else if (e.phase === "charge") {
            // static: she does not move or dodge while charging
            e.lockX = px;                                  // but the lock keeps tracking you
            if (e.phaseT > E.chargeFrames * fireBoost()) {
              // Celestial Strike: a beam fired from her lens, straight down her lock
              s.ebeams.push({
                x: e.x, y: e.y + E.h / 2, tx: e.lockX,
                born: s.t, life: 40, dmg: E.dmg, hit: false,
              });
              s.shockwaves.push({ x: e.x, y: e.y, r: 8, max: 110, alpha: 0.9, color: "#ffd21e" });
              e.phase = "recover";
              e.phaseT = 0;
            }
          } else if (e.phase === "recover") {
            if (e.phaseT > 45) { e.phase = "charge"; e.phaseT = 0; }   // she just does it again
          }
        } else if (E.galactic) {
          e.phaseT += 1;
          if (e.phase === "enter") {
            if (e.y < E.hoverY) e.y += spd;
            else {
              e.dir = e.x < W / 2 ? 1 : -1;
              e.targetX = e.dir === 1 ? 40 : W - 40;
              e.phase = "travel"; e.phaseT = 0;
            }
          } else if (e.phase === "travel") {
            // slide to the nearest edge instead of snapping there
            const dxE = e.targetX - e.x;
            e.x += Math.max(-2.2, Math.min(2.2, dxE * 0.06));
            if (Math.abs(dxE) < 3) { e.x = e.targetX; e.phase = "charge"; e.phaseT = 0; }
          } else if (e.phase === "charge") {
            if (e.phaseT > 120) { e.phase = "sweep"; e.phaseT = 0; }
          } else if (e.phase === "sweep") {
            e.x += e.dir * 1.15;
            if (Math.abs(px - e.x) < 16 && (!e.beamHit || s.t - e.beamHit > 12)) {
              e.beamHit = s.t;
              hurt(E.dmg);
            }
            if ((e.dir === 1 && e.x > W - 40) || (e.dir === -1 && e.x < 40)) { e.phase = "sleep"; e.phaseT = 0; }
          } else if (e.phase === "sleep") {
            if (e.phaseT % 60 === 0 && e.hp < e.maxHp) e.hp = Math.min(e.maxHp, e.hp + 1);
            if (e.phaseT > 480) {
              e.dir = e.x < W / 2 ? 1 : -1;
              e.targetX = e.dir === 1 ? 40 : W - 40;
              e.phase = "travel"; e.phaseT = 0;
            }
          }
        } else if (E.fleet) {
          e.phaseT += 1;
          if (e.y < E.hoverY) e.y += spd;
          else { e.wob += 0.008; e.x += Math.sin(e.wob) * 0.9; }
          e.x = Math.max(85, Math.min(W - 85, e.x));

          if (!e.abilT) e.abilT = s.t + 240;

          if (e.ability === "idle" && s.t > e.abilT) {
            const pool = ["reinf", "bomb", "prism"];
            e.ability = pool[Math.floor(Math.random() * pool.length)];
            e.abilStart = s.t;
            e.lane = Math.floor(Math.random() * 3);
            s.shockwaves.push({ x: e.x, y: e.y, r: 14, max: 420, alpha: 0.9, color: "#00e0c6" });
            if (e.ability === "prism") {
              s.prisms.push({ x: 80 + Math.random() * (W - 160), y: 150 + Math.random() * 110, hp: PRISM_HP, maxHp: PRISM_HP, born: s.t, wob: 0 });
            }
          }

          if (e.ability === "reinf") {
            if (s.t - e.abilStart > REINF_DUR) {
              e.ability = "idle";
              e.abilT = s.t + FLEET_COOLDOWN;
              e.healUntil = 0;
            } else {
              // reinforcements every 3s
              if ((s.t - e.abilStart) % 180 === 0) {
                const pool = ["darkres", "mothership", "huntress"];
                for (let i = 0; i < 6; i++) spawn(pool[Math.floor(Math.random() * pool.length)], 80 + Math.random() * (W - 160), -40);
                s.shockwaves.push({ x: e.x, y: e.y + 20, r: 8, max: 160, alpha: 0.7, color: "#00e0c6" });
              }

              // and it may start channeling a repair: +50 hp/sec for 5s
              if (!e.healUntil && s.t - e.abilStart > 120 && Math.random() < 0.006) {
                e.healUntil = s.t + 300;
                e.healTick = s.t;
                s.shockwaves.push({ x: e.x, y: e.y, r: 10, max: 280, alpha: 0.9, color: "#4ade80" });
              }
              if (e.healUntil && s.t < e.healUntil) {
                if (s.t - e.healTick >= 60) {
                  e.healTick = s.t;
                  e.hp = Math.min(e.maxHp, e.hp + 250);
                  s.shockwaves.push({ x: e.x, y: e.y, r: 6, max: 120, alpha: 0.6, color: "#4ade80" });
                }
              } else if (e.healUntil && s.t >= e.healUntil) {
                e.healUntil = 0;
              }
            }
          } else if (e.ability === "bomb") {
            const CYCLE = 660;             // 3s warn + 8s bombard
            const WARN = 180;              // 3s
            const cyc = (s.t - e.abilStart) % CYCLE;
            e.bombing = cyc >= WARN;

            if (cyc === 0) e.lane = Math.floor(Math.random() * 3);   // fresh lane each wave
            s.bombWarn = e.bombing ? null : { lane: e.lane, p: cyc / WARN };

            if (e.bombing && s.t % 6 === 0) {
              const lx = [W / 6, W / 2, (5 * W) / 6][e.lane];
              [-42, -14, 14, 42].forEach((off) => {
                s.ebullets.push({
                  x: lx + off + (Math.random() * 12 - 6),
                  y: -20 - Math.random() * 30,        // launched from the top of the screen
                  v: 5.4, dmg: 3, color: "#ff8a3d",
                  kind: "bombrocket", long: 22, born: s.t,
                });
              });
            }

            if (s.t - e.abilStart > BOMB_DUR) {
              e.ability = "idle";
              e.abilT = s.t + FLEET_COOLDOWN;
              e.bombing = false;
              s.bombWarn = null;
            }
          } else if (e.ability === "prism") {
            if (s.prisms.length === 0) {                 // you broke it
              e.vulnUntil = s.t + VULN_DUR;
              e.ability = "idle";
              e.abilT = s.t + FLEET_COOLDOWN;
              s.shockwaves.push({ x: e.x, y: e.y, r: 12, max: 400, alpha: 1, color: "#ffd21e" });
            } else if (s.t - e.abilStart > PRISM_DUR) {  // it went off
              s.noFireUntil = s.t + 600;                 // 10s of dead guns
              s.prisms = [];
              s.shockwaves.push(
                { x: px, y: py, r: 10, max: 600, alpha: 1, color: "#b46bff" },
                { x: px, y: py, r: 4, max: 400, alpha: 0.8, color: "#e2beff" }
              );
              s.shake = 16;
              e.ability = "idle";
              e.abilT = s.t + FLEET_COOLDOWN;
            }
          }

          if (s.t - e.lastShot > 34 * fireBoost()) {
            e.lastShot = s.t;
            [-58, -20, 20, 58].forEach((off) => {
              s.ebullets.push({
                x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg,
                color: "#00e0c6", kind: "fleetlaser", long: 40, born: s.t,
              });
            });
          }
        } else if (E.queen) {
          e.phaseT += 1;

          if (e.phase === "enter") {
            if (e.y < E.hoverY) e.y += spd;
            else { e.phase = "roam"; e.phaseT = 0; }
          } else if (e.phase === "roam") {
            e.wob += 0.01;
            e.x += Math.sin(e.wob) * 1.2;
            e.x = Math.max(55, Math.min(W - 55, e.x));

            if (e.phaseT > e.nextAbility) {
              e.phase = "surge";
              e.phaseT = 0;
              e.shield = QUEEN_SHIELD;
              s.shockwaves.push({ x: e.x, y: e.y, r: 8, max: 120, alpha: 0.8, color: "#d94fb0" });
            }
          } else if (e.phase === "surge") {
            if (e.phaseT > SURGE_FRAMES) {
              s.shockwaves.push(
                { x: e.x, y: e.y, r: 20, max: 900, alpha: 1, color: "#d94fb0" },
                { x: e.x, y: e.y, r: 10, max: 700, alpha: 0.9, color: "#ff9fdc" },
                { x: e.x, y: e.y, r: 4, max: 500, alpha: 0.8, color: "#ffd21e" }
              );
              s.hearts -= 6;
              s.hurtUntil = s.t + 50;
              s.shake = 20;
              s.reversedUntil = s.t + 900;
              if (s.hearts <= 0) { s.hearts = 0; s.dead = true; }
              e.phase = "cooldown";
              e.phaseT = 0;
              e.nextAbility = 1800 + Math.floor(Math.random() * 1800);
            }
          } else if (e.phase === "stun") {
            if (e.phaseT > STUN_FRAMES) {
              e.phase = "cooldown";
              e.phaseT = 0;
              e.nextAbility = 1800 + Math.floor(Math.random() * 1800);
            }
          } else if (e.phase === "cooldown") {
            e.wob += 0.01;
            e.x += Math.sin(e.wob) * 1.2;
            e.x = Math.max(55, Math.min(W - 55, e.x));
            if (e.phaseT > e.nextAbility) { e.phase = "roam"; e.phaseT = 0; e.nextAbility = 300; }
          }

          // she cannot shoot while charging Time Reversal
          if (e.phase !== "stun" && e.phase !== "surge" && s.t - e.lastShot > 78 * fireBoost()) {
            e.lastShot = s.t;
            [0, 7, 14].forEach((d) => {
              [-26, 0, 26].forEach((off) => {
                s.pending.push({ at: s.t + d, queenShot: { x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed } });
              });
            });
          }
        } else if (E.boss) {
          if (e.y < E.hoverY) e.y += spd;
          else { e.wob += 0.012; e.x += Math.sin(e.wob) * 1.1; }
          e.x = Math.max(50, Math.min(W - 50, e.x));

          // Call to Arms: 7 enemies in a line across the top, every 20s
          if (!e.callT) e.callT = s.t + 600;
          if (e.calling) {
            e.callPhase += 1;
            if (e.callPhase > 60) {
              const pool = ["darkres", "hunter", "galaxy", "huntress"];
              for (let i = 0; i < 7; i++) {
                const t = pool[Math.floor(Math.random() * pool.length)];
                spawn(t, 50 + i * ((W - 100) / 6), -40 - Math.random() * 20);
              }
              s.shockwaves.push(
                { x: e.x, y: e.y, r: 12, max: 500, alpha: 0.9, color: "#e14b4a" },
                { x: e.x, y: e.y, r: 6, max: 340, alpha: 0.8, color: "#ffd21e" }
              );
              s.shake = 12;
              e.calling = false;
              e.callT = s.t + 1200;   // 20s cooldown
            }
          } else if (s.t > e.callT) {
            e.calling = true;
            e.callPhase = 0;
          }

          if (s.t - e.lastSummon > KING_SUMMON_EVERY) {
            e.lastSummon = s.t;
            const pool = ["crusader", "timekeeper", "darkres"];
            const n = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < n; i++) spawn(pool[Math.floor(Math.random() * pool.length)], e.x + (i - 1) * 55, e.y + 30);
          }

          if (!e.calling && s.t - e.lastShot > 20 * fireBoost()) {
            e.lastShot = s.t;
            [-33, -11, 11, 33].forEach((off) =>
              s.ebullets.push({ x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: "#ff6bb3", kind: "laser", long: 34, born: s.t })
            );
          }
        } else if (e.type === "bounty") {
          if (e.y < E.parkY) e.y += spd;
        } else if (E.hunter) {
          if (e.y < E.hoverY) e.y += spd;
          const playerSnared = s.t < s.snaredUntil;
          const dx = px - e.x;
          const track = playerSnared ? 3.0 : 2.2;
          e.x += Math.max(-track, Math.min(track, dx * 0.07));
          e.x = Math.max(20, Math.min(W - 20, e.x));

          if (!e.snareFired) {
            e.markT += 1;
            if (e.markT > 120) {
              s.ebullets.push({ x: e.x, y: e.y + E.h / 2, v: 4.6, dmg: 0, color: "#00e0c6", kind: "snare", long: 30, born: s.t });
              e.snareFired = true;
              e.reload = s.t;
            }
          } else if (playerSnared) {
            if (s.t - e.lastShot > 24 * fireBoost()) {
              e.lastShot = s.t;
              [-8, 8].forEach((o) => s.ebullets.push({ x: e.x + o, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", kind: "hunter", long: 26, born: s.t }));
            }
          } else {
            if (s.t - e.reload > 300) { e.snareFired = false; e.markT = 0; }
            if (s.t - (e.lastShot || 0) > 42 * fireBoost()) {
              e.lastShot = s.t;
              [-8, 8].forEach((o) => s.ebullets.push({ x: e.x + o, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: 1, color: "#00e0c6", kind: "hunter", long: 26, born: s.t }));
            }
          }
        } else {
          e.y += spd;
          e.wob += 0.05;
          if (e.type === "hummingbird") e.x += Math.sin(e.wob) * 2.2;
          const interval = Math.round(1 / (E.fireChance || 0.004)) * 0.6 * (slowField ? 2.2 : 1) * fireBoost();
          if (E.fireChance > 0 && s.t - (e.lastShot || 0) > interval) {
            e.lastShot = s.t;
            if (E.barrels) {
              [-12, 0, 12].forEach((off) =>
                s.ebullets.push({ x: e.x + off, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: "#c9cde6", kind: "slug", long: 24, born: s.t })
              );
            } else if (E.emp) {
              s.ebullets.push({ x: e.x, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: E.color, kind: "emp", born: s.t });
            } else {
              s.ebullets.push({
                x: e.x, y: e.y + E.h / 2, v: E.bulletSpeed, dmg: E.dmg, color: E.color, born: s.t,
                kind: e.type === "mothership" ? "beamshot" : e.type === "galaxy" ? "plasma" : e.type === "gunner" ? "rapid" : "basic",
                long: e.type === "mothership" ? 42 : 26,
              });
            }
          }
        }
      });

      // player & Bea bullets vs enemies
      for (const b of s.bullets) {
        for (const e of s.enemies) {
          const E = ENEMIES[e.type];
          if (e.hp > 0 && e.phase !== "sleep" && Math.abs(b.x - e.x) < E.w / 2 + 4 && Math.abs(b.y - e.y) < E.h / 2 + 6) {
            const w = b.bea ? beaW : weapon;
            const d = b.bea ? beaDmg : dmg;
            damage(e, d);
            b.hit = true;
            if (w.aoe) {
              blast(e.x, e.y, w.aoe);
              s.enemies.forEach((o) => {
                if (o !== e && o.hp > 0 && Math.hypot(o.x - e.x, o.y - e.y) < w.aoe) damage(o, d);
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
      s.shockwaves.forEach((w) => { w.r += 9; w.alpha -= 0.02; });
      s.shockwaves = s.shockwaves.filter((w) => w.alpha > 0 && w.r < w.max);


      // Huntress celestial beams: a live hazard for their whole burn
      s.ebeams.forEach((bm) => {
        const bage = s.t - bm.born;
        if (bm.hit || bage > 24) return;          // burns hot for ~0.4s, then it's spent

        // the beam segment, matching exactly what gets drawn
        const ex = bm.tx + (bm.tx - bm.x) * 0.25; // extends past the bottom
        const ey = H + 40;
        const vx = ex - bm.x, vy = ey - bm.y;
        const len2 = vx * vx + vy * vy || 1;

        // closest point on the beam to Jebby
        const t = Math.max(0, Math.min(1, ((px - bm.x) * vx + (py - bm.y) * vy) / len2));
        const cx = bm.x + vx * t, cy = bm.y + vy * t;
        const dist = Math.hypot(px - cx, py - cy);

        if (dist < 22) {
          hurt(bm.dmg);
          bm.hit = true;
          s.shockwaves.push({ x: px, y: py, r: 10, max: 120, alpha: 0.9, color: "#ffd21e" });
          s.shake = 14;
        }
      });
      s.ebeams = s.ebeams.filter((bm) => s.t - bm.born < bm.life);

      // prism bombs: shoot them down
      s.prisms.forEach((pr) => { pr.wob = (pr.wob || 0) + 0.05; });
      for (const b of s.bullets) {
        if (b.hit) continue;
        for (const pr of s.prisms) {
          if (pr.hp > 0 && Math.abs(b.x - pr.x) < 22 && Math.abs(b.y - pr.y) < 22) {
            pr.hp -= b.bea ? beaDmg : dmg;
            b.hit = true;
            break;
          }
        }
      }
      s.bullets = s.bullets.filter((b) => !b.hit);
      s.prisms = s.prisms.filter((pr) => {
        if (pr.hp <= 0) {
          s.shockwaves.push({ x: pr.x, y: pr.y, r: 8, max: 240, alpha: 0.9, color: "#b46bff" });
          return false;
        }
        return true;
      });

      // enemy bullets vs player
      s.ebullets = s.ebullets.filter((b) => {
        if (Math.abs(b.x - px) < 18 && Math.abs(b.y - py) < 16) {
          if (b.kind === "snare") {
            if (s.shields > 0) {
              s.shields -= 1;
              s.shockwaves.push({ x: px, y: py, r: 26, max: 60, alpha: 0.9, color: "#3BB8E5" });
            } else {
              s.snaredUntil = s.t + 120;
              s.snareX = s.x;
              s.hurtUntil = s.t + 22;
              s.shake = 5;
            }
          } else if (b.kind === "emp") {
            if (s.shields > 0) {
              s.shields -= 1;
              s.shockwaves.push({ x: px, y: py, r: 26, max: 60, alpha: 0.9, color: "#3BB8E5" });
            } else {
              s.empUntil = s.t + 120;
              hurt(b.dmg);
            }
          } else hurt(b.dmg);
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

      // ================= DRAW =================
      ctx.save();
      if (s.shake > 0) {
        s.shake *= 0.82;
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      }
      ctx.fillStyle = "#0c0d16";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(243,243,238,0.5)";
      s.stars.forEach((st) => { st.y = (st.y + st.v) % H; ctx.fillRect(st.x, st.y, 2, 2); });

      s.smoke.forEach((p) => {
        ctx.fillStyle = `rgba(200, 200, 205, ${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      s.shockwaves.forEach((w) => {
        ctx.strokeStyle = `${w.color}${Math.round(w.alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
      });

      s.blasts.forEach((bl) => {
        ctx.strokeStyle = `rgba(255, 138, 61, ${bl.alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.r, 0, Math.PI * 2); ctx.stroke();
      });

      // Galactic Hunter's red-purple light beam
      s.enemies.forEach((e) => {
        const E = ENEMIES[e.type];
        if (!E.galactic) return;
        if (e.phase === "charge") {
          const p = e.phaseT / 120;
          ctx.fillStyle = `rgba(224, 64, 154, ${0.15 + p * 0.3})`;
          ctx.fillRect(e.x - 3 - p * 10, e.y, 6 + p * 20, H);
          ctx.strokeStyle = `rgba(196,82,255,${0.4 + Math.sin(s.t * 0.5) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(e.x, e.y, 20 - p * 12, 0, Math.PI * 2); ctx.stroke();
        } else if (e.phase === "sweep") {
          const fl = 0.75 + Math.sin(s.t * 0.7) * 0.25;
          ctx.fillStyle = `rgba(196, 82, 255, ${0.3 * fl})`;
          ctx.fillRect(e.x - 22, e.y, 44, H);
          ctx.fillStyle = `rgba(224, 64, 154, ${fl})`;
          ctx.fillRect(e.x - 11, e.y, 22, H);
          ctx.fillStyle = `rgba(255, 210, 235, ${fl})`;
          ctx.fillRect(e.x - 4, e.y, 8, H);
        }
      });

      // player & Bea bullets
      s.bullets.forEach((b) => {
        if (b.bea) {
          // Bea's rounds: full damage, smaller sprite, pink palette
          if (beaW.laser) {
            ctx.fillStyle = "#ff6bb3"; ctx.fillRect(b.x - 2, b.y - 11, 4, 14);
            ctx.fillStyle = "#ffd6ea"; ctx.fillRect(b.x - 0.5, b.y - 11, 1, 14);
          } else if (beaW.aoe && !beaW.big) {
            ctx.fillStyle = "#b4407e"; ctx.fillRect(b.x - 4, b.y - 5, 8, 9);
            ctx.fillStyle = "#ff6bb3"; ctx.fillRect(b.x - 3, b.y - 4, 6, 7);
            ctx.fillStyle = "#ffd6ea"; ctx.fillRect(b.x - 1, b.y - 2, 2, 2);
          } else if (beaW.big) {
            ctx.fillStyle = "#e5bfd4"; ctx.fillRect(b.x - 2.5, b.y - 7, 5, 8);
            ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 2.5, b.y - 9, 5, 2);
          } else if (b.spread) {
            ctx.fillStyle = "#ff6bb3"; ctx.fillRect(b.x - 2, b.y - 4, 4, 6);
          } else {
            ctx.fillStyle = "#ff6bb3"; ctx.fillRect(b.x - 1.5, b.y - 5, 3, 7);
            ctx.fillStyle = "#ffd6ea"; ctx.fillRect(b.x - 0.5, b.y - 5, 1, 7);
          }
          return;
        }
        if (b.hornet) {
          if (maxed) {
            ctx.fillStyle = "rgba(255,210,30,0.35)";
            ctx.fillRect(b.x - 5, b.y - 4, 10, 12);
            ctx.fillStyle = "#ffd21e";
            ctx.fillRect(b.x - 2.5, b.y - 6, 5, 11);
            ctx.fillStyle = "#111";
            ctx.fillRect(b.x - 2.5, b.y - 2, 5, 2);
            ctx.fillRect(b.x - 2.5, b.y + 2, 5, 2);
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.fillRect(b.x - 6, b.y - 3, 3, 4);
            ctx.fillRect(b.x + 3, b.y - 3, 3, 4);
            ctx.fillStyle = "#e14b4a";
            ctx.fillRect(b.x - 1, b.y - 9, 2, 3);
          } else {
            ctx.fillStyle = "rgba(255,138,61,0.3)";
            ctx.fillRect(b.x - 3, b.y - 3, 6, 10);
            ctx.fillStyle = "#ff8a3d";
            ctx.fillRect(b.x - 1.5, b.y - 5, 3, 9);
            ctx.fillStyle = "#ffd21e";
            ctx.fillRect(b.x - 1, b.y - 6, 2, 3);
          }
          return;
        }
        if (b.spread) {
          ctx.fillStyle = "#ffd21e"; ctx.fillRect(b.x - 3, b.y - 6, 6, 9);
          ctx.fillStyle = "#fff6cc"; ctx.fillRect(b.x - 1, b.y - 6, 2, 9);
          return;
        }
        if (weapon.laser) {
          ctx.fillStyle = maxed ? "#b46bff" : "#ff6bb3"; ctx.fillRect(b.x - 3, b.y - 18, 6, 22);
          ctx.fillStyle = maxed ? "#e2beff" : "#ffc2de"; ctx.fillRect(b.x - 1, b.y - 18, 2, 22);
        } else if (weapon.aoe && !weapon.big) {
          ctx.fillStyle = "#2b7d5e"; ctx.fillRect(b.x - 7, b.y - 9, 14, 14);
          ctx.fillStyle = "#4ade80"; ctx.fillRect(b.x - 5, b.y - 7, 10, 10);
          ctx.fillStyle = "#d9ffe9"; ctx.fillRect(b.x - 2, b.y - 4, 4, 4);
        } else if (weapon.big) {
          ctx.fillStyle = "#cdd6ea"; ctx.fillRect(b.x - 4, b.y - 12, 8, 12);
          ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 4, b.y - 14, 8, 3);
          ctx.fillStyle = "#ff8a3d"; ctx.fillRect(b.x - 2, b.y, 4, 4);
        } else if (wId === "smg") {
          ctx.fillStyle = maxed ? "#ff2d55" : "#ffd21e"; ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
        } else if (maxed) {
          ctx.fillStyle = "#ffd21e"; ctx.fillRect(b.x - 3, b.y - 10, 6, 12);
          ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 2, b.y - 8, 4, 8);
        } else {
          ctx.fillStyle = "#ffd21e"; ctx.fillRect(b.x - 2, b.y - 8, 4, 10);
        }
      });

      // Jebby's plasma beam
      if (weapon.beam && s.beamOn) {
        const half = 7;
        const flick = 0.75 + Math.sin(s.t * 0.6) * 0.2;
        const angles = attach === 0 ? [0] : attach === 1 ? [-0.22, 0.22] : [-0.3, 0, 0.3];
        angles.forEach((ang) => {
          ctx.save(); ctx.translate(px, py - 16); ctx.rotate(ang);
          ctx.fillStyle = maxed ? `rgba(225,75,74,${0.35 * flick})` : `rgba(180,107,255,${0.35 * flick})`;
          ctx.fillRect(-half - 5, -H, (half + 5) * 2, H);
          ctx.fillStyle = maxed ? `rgba(255,150,145,${flick})` : `rgba(226,190,255,${flick})`;
          ctx.fillRect(-half, -H, half * 2, H);
          ctx.fillStyle = `rgba(255,255,255,${flick})`;
          ctx.fillRect(-half * 0.35, -H, half * 0.7, H);
          ctx.restore();
        });
      }

      s.rockets.forEach((r) => {
        ctx.fillStyle = "#cdd6ea"; ctx.fillRect(r.x - 3, r.y - 10, 6, 11);
        ctx.fillStyle = "#e14b4a"; ctx.fillRect(r.x - 3, r.y - 13, 6, 3);
      });

      if (orbCount > 0) {
        const offs = orbCount === 1 ? [0] : orbCount === 2 ? [0, Math.PI] : [0, 2.094, 4.189];
        offs.forEach((off) => {
          const ox = px + Math.cos(s.orbA + off) * 120;
          const oy = py + Math.sin(s.orbA + off) * 120;
          ctx.fillStyle = "#2993c5"; ctx.fillRect(ox - 8, oy - 8, 16, 16);
          ctx.fillStyle = "#9ecdde"; ctx.fillRect(ox - 6, oy - 6, 12, 12);
          ctx.fillStyle = "#fcfcfc"; ctx.fillRect(ox - 3, oy - 3, 6, 6);
        });
      }

      ctx.fillStyle = "#ff8a3d";
      s.missiles.forEach((m) => ctx.fillRect(m.x - 3, m.y - 6, 6, 12));

      // Huntress celestial beams
      s.ebeams.forEach((bm) => {
        const bage = s.t - bm.born;
        const ba = Math.max(0, 1 - bage / bm.life);
        const bw2 = 14 * ba + 2;
        ctx.save();
        ctx.translate(bm.x, bm.y);
        const ex = bm.tx + (bm.tx - bm.x) * 0.25;
        const ey = H + 40;
        ctx.rotate(Math.atan2(ey - bm.y, ex - bm.x) - Math.PI / 2);
        const blen = Math.hypot(ex - bm.x, ey - bm.y);
        ctx.fillStyle = `rgba(200,31,63,${0.4 * ba})`;
        ctx.fillRect(-bw2 - 6, 0, (bw2 + 6) * 2, blen);
        ctx.fillStyle = `rgba(255,210,30,${ba})`;
        ctx.fillRect(-bw2, 0, bw2 * 2, blen);
        ctx.fillStyle = `rgba(255,255,255,${ba})`;
        ctx.fillRect(-bw2 * 0.3, 0, bw2 * 0.6, blen);
        ctx.restore();
        ctx.fillStyle = `rgba(255,255,255,${ba})`;
        ctx.beginPath(); ctx.arc(bm.x, bm.y, 10 * ba, 0, Math.PI * 2); ctx.fill();
      });

      // bombardment lane warning
      if (s.bombWarn) {
        const lx = [W / 6, W / 2, (5 * W) / 6][s.bombWarn.lane];
        const wp = s.bombWarn.p;
        const wfl = 0.4 + Math.sin(s.t * 0.5) * 0.4;
        ctx.fillStyle = `rgba(255,138,61,${0.08 + wp * 0.14})`;
        ctx.fillRect(lx - W / 6, 0, W / 3, H);
        ctx.strokeStyle = `rgba(255,138,61,${wfl})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 10]);
        ctx.strokeRect(lx - W / 6 + 4, 4, W / 3 - 8, H - 8);
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(255,138,61,${wfl})`;
        ctx.font = "700 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`BOMBARDMENT  ${Math.ceil((1 - wp) * 3)}s`, lx, H / 2);
      }

      // prism bombs
      s.prisms.forEach((pr) => {
        const pAge = s.t - pr.born;
        const left = Math.ceil((PRISM_DUR - pAge) / 60);
        const pfl = 0.5 + Math.sin(pAge * 0.2) * 0.5;
        ctx.save();
        ctx.translate(pr.x, pr.y);
        ctx.rotate(pr.wob || 0);
        ctx.fillStyle = `rgba(180,107,255,${0.25 + pfl * 0.3})`;
        ctx.fillRect(-20, -20, 40, 40);
        ctx.fillStyle = "#b46bff";
        ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(16, 12); ctx.lineTo(-16, 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${pfl})`;
        ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(8, 7); ctx.lineTo(-8, 7); ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(pr.x, pr.y, 27, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "#b46bff";
        ctx.beginPath(); ctx.arc(pr.x, pr.y, 27, -Math.PI / 2, -Math.PI / 2 + (pr.hp / pr.maxHp) * Math.PI * 2); ctx.stroke();
        ctx.fillStyle = left <= 3 ? "#e14b4a" : "#e2beff";
        ctx.font = "700 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${left}s`, pr.x, pr.y - 34);
      });

      // enemy bullets
      s.ebullets.forEach((b) => {
        const len = b.long || 26;
        const age = s.t - (b.born || 0);
        const fl = 0.7 + Math.sin(age * 0.45) * 0.3;
        const wob = Math.sin(age * 0.4) * 1.5;
        const halo = (wide, col) => { ctx.fillStyle = col; ctx.fillRect(b.x - wide, b.y - 3, wide * 2, len + 6); };
        const ring = (rad, col) => {
          ctx.strokeStyle = col; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(b.x, b.y + len / 2, rad, 0, Math.PI * 2); ctx.stroke();
        };

        if (b.kind === "snare") {
          // ion energy blast: a crackling orb, not a dart
          const ip = 7 + Math.sin(age * 0.4) * 3;
          ctx.fillStyle = `rgba(0,224,198,${0.18 * fl})`;
          ctx.beginPath(); ctx.arc(b.x, b.y + 8, ip + 9, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = `rgba(0,224,198,${fl})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(b.x, b.y + 8, ip + 5, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(b.x, b.y + 8, ip, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(120,255,240,${0.6 + fl * 0.4})`;
          ctx.beginPath(); ctx.arc(b.x, b.y + 8, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath(); ctx.arc(b.x, b.y + 8, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = `rgba(200,255,250,${fl})`;
          ctx.lineWidth = 1.5;
          for (let k = 0; k < 4; k++) {
            const a2 = (k / 4) * Math.PI * 2 + age * 0.12;
            ctx.beginPath();
            ctx.moveTo(b.x + Math.cos(a2) * 5, b.y + 8 + Math.sin(a2) * 5);
            ctx.lineTo(b.x + Math.cos(a2) * (ip + 7), b.y + 8 + Math.sin(a2) * (ip + 7));
            ctx.stroke();
          }
        } else if (b.kind === "emp") {
          const pulse = 4 + Math.sin(age * 0.35) * 2;
          ctx.strokeStyle = `rgba(59,184,229,${0.3 + fl * 0.3})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 11 + pulse, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 6 + pulse * 0.4, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = "rgba(59,184,229,0.45)";
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#bde9fb";
          ctx.beginPath(); ctx.arc(b.x, b.y + 6, 3.5, 0, Math.PI * 2); ctx.fill();
        } else if (b.kind === "hunter") {
          halo(6, "rgba(0,224,198,0.25)");
          ctx.fillStyle = "#00e0c6"; ctx.fillRect(b.x - 2.5 + wob * 0.4, b.y, 5, len);
          ctx.fillStyle = "#eafffb"; ctx.fillRect(b.x - 1, b.y, 2, len * 0.5);
          ctx.fillStyle = `rgba(0,224,198,${fl})`;
          ctx.fillRect(b.x - 6, b.y + len - 8, 3, 8); ctx.fillRect(b.x + 3, b.y + len - 8, 3, 8);
          ring(6, `rgba(0,224,198,${fl * 0.6})`);
        } else if (b.kind === "laser") {
          halo(7, `rgba(255,107,179,${0.28 * fl})`);
          ctx.fillStyle = b.color; ctx.fillRect(b.x - 3, b.y, 6, len);
          ctx.fillStyle = "#fff"; ctx.fillRect(b.x - 1.5, b.y, 3, len);
          ring(7, `rgba(255,107,179,${fl})`);
        } else if (b.kind === "plasma") {
          halo(7, `rgba(225,75,74,${0.26 * fl})`);
          ctx.fillStyle = "#e14b4a"; ctx.fillRect(b.x - 3.5 + wob * 0.5, b.y, 7, len);
          ctx.fillStyle = "#ffd0c2"; ctx.fillRect(b.x - 1.5, b.y, 3, len * 0.55);
          ring(8 + Math.sin(age * 0.3) * 1.5, `rgba(225,75,74,${fl * 0.8})`);
        } else if (b.kind === "beamshot") {
          halo(7, "rgba(255,107,179,0.28)");
          ctx.fillStyle = "#ff6bb3"; ctx.fillRect(b.x - 3, b.y, 6, len);
          ctx.fillStyle = "#fff"; ctx.fillRect(b.x - 1, b.y, 2, len);
          ring(7, `rgba(255,107,179,${fl * 0.7})`);
        } else if (b.kind === "slug") {
          halo(5, "rgba(201,205,230,0.25)");
          ctx.fillStyle = "#c9cde6"; ctx.fillRect(b.x - 2.5, b.y, 5, len);
          ctx.fillStyle = "#ff8a3d"; ctx.fillRect(b.x - 1.5, b.y + len - 6, 3, 6);
        } else if (b.kind === "fleetlaser") {
          ctx.fillStyle = `rgba(0,224,198,${0.3 * fl})`;
          ctx.fillRect(b.x - 7, b.y, 14, len);
          ctx.fillStyle = "#00e0c6";
          ctx.fillRect(b.x - 3, b.y, 6, len);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(b.x - 1, b.y, 2, len);
          ctx.fillStyle = `rgba(255,255,255,${fl})`;
          ctx.fillRect(b.x - 5, b.y + len - 5, 10, 5);
        } else if (b.kind === "bombrocket") {
          ctx.fillStyle = "#cdd6ea";
          ctx.fillRect(b.x - 3, b.y, 6, len - 6);
          ctx.fillStyle = "#e14b4a";
          ctx.fillRect(b.x - 3, b.y + len - 6, 6, 6);
          ctx.fillStyle = `rgba(255,138,61,${fl})`;
          ctx.fillRect(b.x - 2, b.y - 6, 4, 6);
        } else if (b.kind === "queen") {
          ctx.fillStyle = `rgba(217,79,176,${0.3 * fl})`;
          ctx.fillRect(b.x - 3, b.y - 2, 6, len + 4);
          ctx.fillStyle = "#ff9fdc";
          ctx.fillRect(b.x - 1.5, b.y, 3, len);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(b.x - 0.5, b.y, 1, len * 0.5);
        } else if (b.kind === "rapid") {
          halo(5, "rgba(255,138,61,0.3)");
          ctx.fillStyle = "#ff8a3d"; ctx.fillRect(b.x - 2.5, b.y, 5, len);
          ctx.fillStyle = "#ffe0c2"; ctx.fillRect(b.x - 1, b.y, 2, 6);
        } else {
          halo(5, `${b.color}44`);
          ctx.fillStyle = b.color; ctx.fillRect(b.x - 2.5 + wob * 0.3, b.y, 5, len);
          ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fillRect(b.x - 1, b.y, 2, len * 0.35);
          ring(6, `rgba(255,255,255,${fl * 0.35})`);
        }
      });

      // buffs
      s.buffs.forEach((b) => {
        const B = BUFFS[b.type];
        const bob = Math.sin((s.t - b.born) * 0.1) * 3;
        ctx.strokeStyle = B.color; ctx.lineWidth = 2;
        ctx.strokeRect(b.x - 11, b.y - 11 + bob, 22, 22);
        ctx.fillStyle = `${B.color}33`;
        ctx.fillRect(b.x - 9, b.y - 9 + bob, 18, 18);
        ctx.fillStyle = B.color;
        if (b.type === "heart") {
          ctx.fillRect(b.x - 6, b.y - 5 + bob, 4, 4); ctx.fillRect(b.x + 2, b.y - 5 + bob, 4, 4);
          ctx.fillRect(b.x - 6, b.y - 1 + bob, 12, 4); ctx.fillRect(b.x - 3, b.y + 3 + bob, 6, 3);
        } else if (b.type === "vault") {
          ctx.fillRect(b.x - 6, b.y - 6 + bob, 12, 12);
          ctx.fillStyle = "#111"; ctx.fillRect(b.x - 2, b.y - 2 + bob, 4, 4);
        } else if (b.type === "rapid") {
          ctx.fillRect(b.x - 1, b.y - 7 + bob, 3, 5);
          ctx.fillRect(b.x - 1, b.y - 1 + bob, 3, 5);
          ctx.fillRect(b.x - 1, b.y + 5 + bob, 3, 3);
        } else if (b.type === "emp") {
          ctx.beginPath(); ctx.arc(b.x, b.y + bob, 6, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(b.x, b.y + bob, 3, 0, Math.PI * 2); ctx.fill();
        } else if (b.type === "nuke") {
          ctx.beginPath(); ctx.arc(b.x, b.y + bob, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#111";
          [0, 2.09, 4.19].forEach((a) => {
            ctx.beginPath(); ctx.moveTo(b.x, b.y + bob); ctx.arc(b.x, b.y + bob, 7, a, a + 0.7); ctx.fill();
          });
        }
      });


      // enemies
      s.enemies.forEach((e) => {
        const E = ENEMIES[e.type];
        const asleep = e.phase === "sleep";
        ctx.globalAlpha = asleep ? 0.55 : 1;

        if (E.wings) {
          ctx.fillStyle = E.color;
          const ww = E.w * 0.28, wh = E.h * 0.32;
          ctx.fillRect(e.x - E.w / 2 - ww, e.y - wh / 2, ww, wh);
          ctx.fillRect(e.x + E.w / 2, e.y - wh / 2, ww, wh);
        }
        ctx.fillStyle = E.color;
        ctx.fillRect(e.x - E.w / 2, e.y - E.h / 2, E.w, E.h);
        if (!E.wings) {
          ctx.fillRect(e.x - E.w / 2 - 5, e.y - 3, 5, 8);
          ctx.fillRect(e.x + E.w / 2, e.y - 3, 5, 8);
        }
        if (E.crown) {
          ctx.fillStyle = E.crown;
          const cw = E.w * 0.5;
          const th = E.tallCrown ? 26 : 14;
          ctx.fillRect(e.x - cw / 2, e.y - E.h / 2 - 8, cw, 5);
          if (E.tallCrown) {
            [-cw / 2, -4, cw / 2 - 8].forEach((off, i) =>
              ctx.fillRect(e.x + off, e.y - E.h / 2 - th, 8, th - 8)
            );
            ctx.fillStyle = "#e14b4a";
            [-cw / 2 + 1, -3, cw / 2 - 7].forEach((off) =>
              ctx.fillRect(e.x + off, e.y - E.h / 2 - th - 5, 6, 6)
            );
          } else {
            [-cw / 2, -3, cw / 2 - 6].forEach((off) => ctx.fillRect(e.x + off, e.y - E.h / 2 - 14, 6, 7));
          }
        }
        if (E.barrels) {
          ctx.fillStyle = "#3a3d52";
          (E.barrels === 4 ? [-33, -11, 11, 33] : [-12, 0, 12]).forEach((off) =>
            ctx.fillRect(e.x + off - 2, e.y + E.h / 2, 4, 7)
          );
        }
        ctx.fillStyle = E.redEyes ? "#e14b4a" : "#111";
        const eye = E.boss ? 8 : 5;
        ctx.fillRect(e.x - E.w * 0.22, e.y - E.h * 0.18, eye, eye);
        ctx.fillRect(e.x + E.w * 0.22 - eye, e.y - E.h * 0.18, eye, eye);

        if (E.fleet && e.vulnUntil && s.t < e.vulnUntil) {
          const vfl = 0.5 + Math.sin(s.t * 0.4) * 0.5;
          ctx.strokeStyle = `rgba(255,210,30,${vfl})`;
          ctx.lineWidth = 4;
          ctx.strokeRect(e.x - E.w / 2 - 8, e.y - E.h / 2 - 8, E.w + 16, E.h + 16);
          ctx.fillStyle = "#ffd21e";
          ctx.font = "700 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`CORE EXPOSED  ${Math.ceil((e.vulnUntil - s.t) / 60)}s`, e.x, e.y - E.h / 2 - 26);
        }
        if (E.fleet) {
          // hull detailing: engine banks, hangar bays, running lights
          const glow = 0.5 + Math.sin(s.t * 0.06) * 0.3;
          ctx.fillStyle = "#1a1e33";
          ctx.fillRect(e.x - E.w / 2 + 8, e.y - 6, E.w - 16, 14);
          ctx.fillStyle = "#00e0c6";
          for (let i = 0; i < 5; i++) {
            const hx = e.x - E.w / 2 + 22 + i * ((E.w - 44) / 4);
            ctx.fillStyle = `rgba(0,224,198,${0.35 + glow * 0.5})`;
            ctx.fillRect(hx - 5, e.y - 3, 10, 8);
          }
          // engine flare
          ctx.fillStyle = `rgba(0,224,198,${glow})`;
          [-52, -18, 18, 52].forEach((off) => ctx.fillRect(e.x + off - 5, e.y + E.h / 2 - 2, 10, 8 + (s.t % 8 < 4 ? 4 : 0)));
          // spine lights
          ctx.fillStyle = `rgba(255,255,255,${glow})`;
          for (let i = 0; i < 9; i++) ctx.fillRect(e.x - E.w / 2 + 12 + i * 16, e.y - E.h / 2 + 4, 3, 3);

          if (e.healUntil && s.t < e.healUntil) {
            const hfl = 0.5 + Math.sin(s.t * 0.5) * 0.5;
            // repair field
            ctx.strokeStyle = `rgba(74,222,128,${hfl})`;
            ctx.lineWidth = 3;
            for (let r = 0; r < 3; r++) {
              const rad = 40 + ((s.t * 2 + r * 30) % 90);
              ctx.beginPath(); ctx.arc(e.x, e.y, rad, 0, Math.PI * 2); ctx.stroke();
            }
            // rising motes
            ctx.fillStyle = `rgba(74,222,128,${hfl})`;
            for (let k = 0; k < 8; k++) {
              const mx = e.x - E.w / 2 + ((s.t * 1.5 + k * 37) % E.w);
              const my = e.y + E.h / 2 - ((s.t * 2 + k * 23) % (E.h + 30));
              ctx.fillRect(mx, my, 3, 3);
            }
            ctx.fillStyle = "#4ade80";
            ctx.font = "700 12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`REPAIRING  +50/s`, e.x, e.y - E.h / 2 - 42);
          }

          if (e.vulnUntil && s.t < e.vulnUntil) {
            const vfl = 0.5 + Math.sin(s.t * 0.4) * 0.5;
            ctx.strokeStyle = `rgba(255,210,30,${vfl})`;
            ctx.lineWidth = 4;
            ctx.strokeRect(e.x - E.w / 2 - 8, e.y - E.h / 2 - 8, E.w + 16, E.h + 16);
            // cracked core
            ctx.strokeStyle = `rgba(255,255,255,${vfl})`;
            ctx.lineWidth = 2;
            for (let k = 0; k < 4; k++) {
              const a = (k / 4) * Math.PI * 2 + s.t * 0.02;
              ctx.beginPath();
              ctx.moveTo(e.x, e.y);
              ctx.lineTo(e.x + Math.cos(a) * 34, e.y + Math.sin(a) * 20);
              ctx.stroke();
            }
            ctx.fillStyle = "#ffd21e";
            ctx.font = "700 12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`CORE EXPOSED  ${Math.ceil((e.vulnUntil - s.t) / 60)}s`, e.x, e.y - E.h / 2 - 26);
          }

          if (e.ability === "reinf") {
            const rfl = 0.5 + Math.sin(s.t * 0.3) * 0.4;
            // hangar bays flare open
            ctx.fillStyle = `rgba(0,224,198,${rfl})`;
            [-40, 0, 40].forEach((off) => ctx.fillRect(e.x + off - 8, e.y + E.h / 2 - 4, 16, 6));
            ctx.fillStyle = `rgba(0,224,198,${rfl})`;
            ctx.font = "700 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("REINFORCEMENTS", e.x, e.y - E.h / 2 - 26);
          }

          if (e.ability === "bomb") {
            ctx.fillStyle = `rgba(255,138,61,${0.5 + Math.sin(s.t * 0.4) * 0.4})`;
            ctx.font = "700 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(e.bombing ? "BOMBARDING" : "TARGETING", e.x, e.y - E.h / 2 - 26);
          }
        }
        if (E.boss && e.calling) {
          const cp = e.callPhase / 60;
          const cfl = 0.5 + Math.sin(s.t * 0.6) * 0.5;
          ctx.fillStyle = `rgba(255,210,30,${cfl})`;
          ctx.fillRect(e.x - 26, e.y - E.h / 2 - 22, 52, 4);
          ctx.strokeStyle = `rgba(225,75,74,${cfl})`;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(e.x, e.y, 30 + cp * 60, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = `rgba(225,75,74,${0.25 + cp * 0.5})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.beginPath(); ctx.moveTo(30, 24); ctx.lineTo(W - 30, 24); ctx.stroke();
          ctx.setLineDash([]);
          for (let i = 0; i < 7; i++) {
            const sx2 = 50 + i * ((W - 100) / 6);
            ctx.fillStyle = `rgba(225,75,74,${cp * cfl})`;
            ctx.fillRect(sx2 - 8, 16, 16, 16);
          }
          ctx.fillStyle = "#e14b4a";
          ctx.font = "700 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("CALL TO ARMS", e.x, e.y - E.h / 2 - 28);
        }

        if (E.queen && e.phase === "surge") {
          const p2 = e.phaseT / SURGE_FRAMES;
          const fl = 0.6 + Math.sin(s.t * 0.5) * 0.4;

          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.strokeStyle = `rgba(255,159,220,${0.25 + p2 * 0.4})`;
          ctx.lineWidth = 2;
          for (let k = 0; k < 12; k++) {
            const ang = (k / 12) * Math.PI * 2 - s.t * 0.03;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * 44, Math.sin(ang) * 44);
            ctx.lineTo(Math.cos(ang) * (52 + p2 * 14), Math.sin(ang) * (52 + p2 * 14));
            ctx.stroke();
          }
          ctx.rotate(-s.t * 0.06);
          ctx.strokeStyle = `rgba(255,210,30,${fl})`;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -38); ctx.stroke();
          ctx.restore();

          ctx.strokeStyle = `rgba(217,79,176,${fl})`;
          ctx.lineWidth = 3;
          for (let r = 1; r <= 3; r++) {
            const rad = 90 - ((s.t * 1.6 + r * 30) % 90) * (0.5 + p2 * 0.5);
            ctx.beginPath(); ctx.arc(e.x, e.y, Math.max(10, rad), 0, Math.PI * 2); ctx.stroke();
          }

          ctx.strokeStyle = `rgba(59,184,229,${0.5 + fl * 0.4})`;
          ctx.lineWidth = 2;
          for (let a = 0; a < 8; a++) {
            const ang = (a / 8) * Math.PI * 2 + s.t * 0.02;
            ctx.beginPath();
            ctx.arc(e.x, e.y, E.w * 0.72, ang, ang + 0.35);
            ctx.stroke();
          }

          const bw = E.w + 34;
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillRect(e.x - bw / 2, e.y - E.h / 2 - 46, bw, 8);
          ctx.fillStyle = "#3BB8E5";
          ctx.fillRect(e.x - bw / 2, e.y - E.h / 2 - 46, bw * Math.max(0, e.shield / QUEEN_SHIELD), 8);
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillRect(e.x - bw / 2, e.y - E.h / 2 - 56, bw, 5);
          ctx.fillStyle = p2 > 0.7 ? "#e14b4a" : "#ffd21e";
          ctx.fillRect(e.x - bw / 2, e.y - E.h / 2 - 56, bw * p2, 5);
          ctx.fillStyle = p2 > 0.7 ? "#e14b4a" : "#ffd21e";
          ctx.font = "700 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`TIME REVERSAL  ${Math.ceil((SURGE_FRAMES - e.phaseT) / 60)}s`, e.x, e.y - E.h / 2 - 62);
        }

        if (E.queen && e.phase === "stun") {
          const fl = 0.5 + Math.sin(s.t * 0.3) * 0.4;
          ctx.strokeStyle = `rgba(255,210,30,${fl})`;
          ctx.lineWidth = 3;
          ctx.strokeRect(e.x - E.w / 2 - 8, e.y - E.h / 2 - 8, E.w + 16, E.h + 16);
          for (let k = 0; k < 5; k++) {
            const a = (s.t * 0.2 + k * 1.3) % (Math.PI * 2);
            ctx.fillStyle = `rgba(255,210,30,${fl})`;
            ctx.fillRect(e.x + Math.cos(a) * (E.w * 0.6), e.y + Math.sin(a) * (E.h * 0.7), 3, 3);
          }
          ctx.fillStyle = "#ffd21e";
          ctx.font = "700 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`STUNNED  ${Math.ceil((STUN_FRAMES - e.phaseT) / 60)}s`, e.x, e.y - E.h / 2 - 22);
        }

        if (asleep) {
          ctx.strokeStyle = `rgba(196,82,255,${0.4 + Math.sin(s.t * 0.15) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - E.w / 2 - 6, e.y - E.h / 2 - 6, E.w + 12, E.h + 12);
          ctx.fillStyle = "#c452ff";
          ctx.font = "700 10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("REGEN", e.x, e.y - E.h / 2 - 12);
        }

        if (e.maxHp > 1) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(e.x - E.w / 2, e.y - E.h / 2 - (E.crown ? 20 : 7), E.w, E.boss ? 6 : 4);
          ctx.fillStyle = E.boss ? "#e14b4a" : "#4ade80";
          ctx.fillRect(e.x - E.w / 2, e.y - E.h / 2 - (E.crown ? 20 : 7), E.w * Math.max(0, e.hp / e.maxHp), E.boss ? 6 : 4);
        }

        if (E.huntress) {
          // hyper-camera head: crimson lens, green right eye
          ctx.fillStyle = "#c81f3f";
          ctx.fillRect(e.x - E.w / 2 + 3, e.y - E.h / 2 + 3, E.w - 6, 7);
          ctx.fillStyle = "#2a1f24";
          ctx.fillRect(e.x - 9, e.y - 4, 18, 10);
          // lens barrel
          ctx.fillStyle = "#c81f3f";
          ctx.fillRect(e.x - 6, e.y - 2, 12, 6);
          ctx.fillStyle = "#ff5c7a";
          ctx.fillRect(e.x - 3, e.y - 1, 6, 4);
          // green right eye
          const blink = 0.5 + Math.sin(s.t * 0.3) * 0.5;
          ctx.fillStyle = `rgba(74,222,128,${0.4 + blink * 0.6})`;
          ctx.fillRect(e.x + 8, e.y - 6, 5, 5);
          ctx.fillStyle = "#0d1a12";
          ctx.fillRect(e.x + 9, e.y - 5, 3, 3);

          if (e.phase === "charge") {
            const p2 = e.phaseT / E.chargeFrames;
            const fl = 0.5 + Math.sin(s.t * 0.8) * 0.5;
            const lx = e.lockX;

            // sight line from her lens to you, thickening as she charges
            ctx.strokeStyle = `rgba(200,31,63,${0.2 + p2 * 0.5})`;
            ctx.lineWidth = 1 + p2 * 2.5;
            ctx.setLineDash([3, 7]);
            ctx.lineDashOffset = -s.t * 0.8;
            ctx.beginPath();
            ctx.moveTo(e.x, e.y + 3);
            ctx.lineTo(lx, py);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;

            // scope: rotating crosshair ring on the player
            ctx.save();
            ctx.translate(lx, py);
            const rr = 36 - p2 * 16;
            ctx.rotate(s.t * 0.03);
            ctx.strokeStyle = `rgba(200,31,63,${0.5 + p2 * 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, rr * 0.55, 0, Math.PI * 2); ctx.stroke();
            // tick marks
            for (let k = 0; k < 8; k++) {
              const a = (k / 8) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
              ctx.lineTo(Math.cos(a) * (rr + 6), Math.sin(a) * (rr + 6));
              ctx.stroke();
            }
            ctx.restore();

            // converging corner brackets: the "lock" tell
            const gap = 26 - p2 * 14;
            ctx.strokeStyle = `rgba(255,60,90,${0.6 + fl * 0.4})`;
            ctx.lineWidth = 3;
            [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
              ctx.beginPath();
              ctx.moveTo(lx + sx * gap, py + sy * gap - sy * 10);
              ctx.lineTo(lx + sx * gap, py + sy * gap);
              ctx.lineTo(lx + sx * gap - sx * 10, py + sy * gap);
              ctx.stroke();
            });

            // static crosshair through the player
            ctx.strokeStyle = `rgba(255,60,90,${0.35 + p2 * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lx - 46, py); ctx.lineTo(lx + 46, py);
            ctx.moveTo(lx, py - 46); ctx.lineTo(lx, py + 46);
            ctx.stroke();

            // her lens charging white-hot
            ctx.fillStyle = `rgba(255,60,90,${fl})`;
            ctx.fillRect(e.x - 3 - p2 * 3, e.y - 1 - p2 * 2, 6 + p2 * 6, 4 + p2 * 4);
            if (p2 > 0.75) {
              ctx.fillStyle = `rgba(255,255,255,${fl})`;
              ctx.fillRect(e.x - 2, e.y - 1, 4, 3);
            }

            // countdown
            ctx.fillStyle = p2 > 0.75 ? "#ff3c5a" : "#c81f3f";
            ctx.font = "700 10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`LOCKED ${Math.ceil((E.chargeFrames - e.phaseT) / 60)}s`, e.x, e.y - E.h / 2 - 20);

            // final-second warning flash on the player
            if (p2 > 0.9 && Math.floor(s.t / 4) % 2 === 0) {
              ctx.fillStyle = "rgba(255,60,90,0.18)";
              ctx.fillRect(lx - 30, 0, 60, H);
            }
          }

          // holo-shield bubble, one ring segment per remaining charge
          if (e.shield > 0) {
            const fl = 0.4 + Math.sin(s.t * 0.09) * 0.15;
            const rad = 26 + e.shield * 1.6;
            ctx.strokeStyle = `rgba(59,184,229,${fl + 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(e.x, e.y, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = `rgba(59,184,229,${fl * 0.2})`;
            ctx.beginPath(); ctx.arc(e.x, e.y, rad, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = `rgba(180,230,255,${fl})`;
            ctx.lineWidth = 3;
            for (let i = 0; i < e.shield; i++) {
              const ang = (i / (ENEMIES[e.type].shield || 5)) * Math.PI * 2 + s.t * 0.02;
              ctx.beginPath();
              ctx.arc(e.x, e.y, rad, ang, ang + 0.55);
              ctx.stroke();
            }
          }
        }

        ctx.globalAlpha = 1;
      });

      // hunter reticle
      const marking = s.enemies.find((e) => ENEMIES[e.type].hunter && !e.snareFired && e.markT > 15);
      if (marking) {
        const prog = Math.min(1, marking.markT / 120);
        ctx.strokeStyle = `rgba(0,224,198,${0.5 + prog * 0.5})`;
        ctx.lineWidth = 2;
        const r = 34 - prog * 16;
        ctx.save(); ctx.translate(px, py); ctx.rotate(s.t * 0.05);
        ctx.strokeRect(-r, -r, r * 2, r * 2);
        ctx.restore();
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(marking.x, marking.y); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Bea (beam first, then her sprite)
      if (hasBea && beaW && s.bea) {
        const bx = s.bea.x, by = s.bea.y;
        if (beaW.beam && s.beaBeamOn) {
          const fl = 0.7 + Math.sin(s.t * 0.6) * 0.2;
          ctx.fillStyle = `rgba(180,107,255,${0.3 * fl})`;
          ctx.fillRect(bx - 6, 0, 12, by - 12);
          ctx.fillStyle = `rgba(214,182,255,${fl})`;
          ctx.fillRect(bx - 3, 0, 6, by - 12);
          ctx.fillStyle = `rgba(255,255,255,${fl})`;
          ctx.fillRect(bx - 1, 0, 2, by - 12);
        }
        ctx.fillStyle = "#b46bff";
        ctx.fillRect(bx - 9, by - 6, 18, 12);
        ctx.fillRect(bx - 13, by - 1, 4, 6);
        ctx.fillRect(bx + 9, by - 1, 4, 6);
        ctx.fillStyle = "#111";
        ctx.fillRect(bx - 5, by - 3, 3, 3);
        ctx.fillRect(bx + 2, by - 3, 3, 3);
        ctx.fillStyle = "#ff8a3d";
        ctx.fillRect(bx - 3, by + 6, 3, 4);
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


      // Holo-Shield bubble: only while shields remain
      if (s.shields > 0) {
        const fl = 0.35 + Math.sin(s.t * 0.08) * 0.12;
        const rad = 30 + s.shields * 2;
        ctx.strokeStyle = `rgba(59,184,229,${fl + 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(59,184,229,${fl * 0.22})`;
        ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(180,230,255,${fl})`;
        ctx.lineWidth = 1;
        for (let a = 0; a < 6; a++) {
          const ang = (a / 6) * Math.PI * 2 + s.t * 0.012;
          ctx.beginPath(); ctx.arc(px, py, rad, ang, ang + 0.28); ctx.stroke();
        }
      }

      if (s.t % 10 === 0) {
        const king = s.enemies.find((e) => e.type === "kingship");
        const queen = s.enemies.find((e) => e.type === "queen");
          setHud({
          score: s.score,
          hearts: s.hearts,
          wave: bonusHp(),
          fireTier: fireTier(),
          shields: s.shields,
          status: snared ? "SNARED" : reversed ? "REVERSED" : empActive ? "EMP" : null,
          boss: king ? Math.max(0, Math.round((king.hp / king.maxHp) * 100)) : null,
          queen: queen ? Math.max(0, Math.round((queen.hp / queen.maxHp) * 100)) : null,
          fleet: (() => { const f = s.enemies.find((e) => e.type === "fleet"); return f ? Math.max(0, Math.round((f.hp / f.maxHp) * 100)) : null; })(),
          silenced: s.t < s.noFireUntil,
          buff: rapid ? "RAPID" : slowField ? "EMP FIELD" : null,
        });
      }

      if (s.dead) {
  cancelAnimationFrame(raf);

  if (!savedRef.current) {
    savedRef.current = true;

    const p = loadProfile();
    p.points += s.score;
    p.kills = p.kills || {};
    Object.entries(s.kills).forEach(([k, n]) => {
      p.kills[k] = (p.kills[k] || 0) + n;
    });

    p.acc = {
      ...(p.acc || {}),
      holoshield: { lvl: 0 },
    };
    saveProfile(p);
  }

  setTimeout(() => onGameOver(s.score), 300);
}

      ctx.restore();

      if (s.dead) {
        cancelAnimationFrame(raf);
        const p = loadProfile();
        p.points += s.score;
        p.kills = p.kills || {};
        Object.entries(s.kills).forEach(([k, n]) => { p.kills[k] = (p.kills[k] || 0) + n; });
        saveProfile(p);
        setTimeout(() => onGameOver(s.score), 300);
      }
    };
    loop();

    return () => {
      if (!s.dead) {
        // quitting mid-run: keep unused shields, but the run's kills do NOT count
        const p = loadProfile();
        p.acc = { ...(p.acc || {}), holoshield: { lvl: s.shields } }; // unused shields are kept
        saveProfile(p);
      }
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
        {hud.shields > 0 && (
          <span className={styles.shieldRow}>
            {Array.from({ length: hud.shields }).map((_, i) => (
              <span key={i} className={styles.shieldIcon} />
            ))}
          </span>
        )}
        {hud.wave > 0 && <span className={styles.sideHint}>Enemy HP +{hud.wave}</span>}
        {hud.fireTier > 0 && <span className={styles.sideHint}>Enemy Fire {hud.fireTier}</span>}
        {hud.boss != null && <span className={styles.bossTag}>KINGSHIP {hud.boss}%</span>}
        {hud.queen != null && <span className={styles.queenTag}>QUEEN {hud.queen}%</span>}
        {hud.fleet != null && <span className={styles.fleetTag}>FLEET {hud.fleet}%</span>}
        {hud.silenced && <span className={styles.silenceTag}>GUNS OFFLINE</span>}
        {hud.buff && <span className={styles.buffTag}>{hud.buff}</span>}
        {hud.status && <span className={styles.statusTag}>{hud.status}</span>}
        <span className={styles.sideHint}>Move: mouse / A D</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className={styles.spaceCanvas} />
    </div>
  );
}