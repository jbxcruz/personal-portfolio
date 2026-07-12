"use client";

import { useState } from "react";
import styles from "../Playground.module.scss";
import { loadProfile, saveProfile } from "../arcade";
import { WEAPONS, weaponDmg } from "./SpaceGuardian";

export const ACCESSORIES = {
  armor:        { name: "Armor", desc: "+1 armor per level", cost: 0, upCost: 250, maxLvl: 3, buyFirst: false },
  health:       { name: "Health Bar", desc: "+1 heart per level", cost: 0, upCost: 250, maxLvl: 10, buyFirst: false },
  orb:          { name: "Orb", desc: "Orbiting orb, +1 dmg on touch", cost: 1000, upCost: 500, maxLvl: 5, buyFirst: true },
  twinorb:      { name: "Twin Orbs", desc: "A second orbiting orb", cost: 2000, upCost: 700, maxLvl: 5, buyFirst: true, hidden: true },
  tripleorb:    { name: "Triple Orbs", desc: "A third orbiting orb", cost: 2500, upCost: 0, maxLvl: 0, buyFirst: true, hidden: true },
  gunattach:    { name: "+1 Gun Attachment", desc: "+1 cannon barrel on any gun", cost: 2000, upCost: 2000, maxLvl: 2, buyFirst: true },
  firerate:     { name: "Fire Rate", desc: "+1 fire speed for every gun", cost: 0, upCost: 350, maxLvl: 5, buyFirst: false },
  homing:       { name: "Homing Missile", desc: "Seeks a random enemy, 5 dmg", cost: 1500, upCost: 0, maxLvl: 0, buyFirst: true },
  twinhoming:   { name: "Twin Homing Missiles", desc: "Two seekers, faster each level", cost: 500, upCost: 500, maxLvl: 5, buyFirst: true, hidden: true },
  rapidrockets: { name: "Twin Semi-Rapid Homing Rockets", desc: "Twin straight rockets in bursts, 5 dmg", cost: 3500, upCost: 0, maxLvl: 0, buyFirst: true, hidden: true },
};

export function Shop() {
  const [p, setP] = useState(loadProfile);
  const [tab, setTab] = useState("weapons");

  const commit = (next) => { saveProfile(next); setP(next); };
  const accState = (id) => p.acc?.[id] || null;

  const buyWeapon = (id) => {
    if (p.owned[id] || p.points < WEAPONS[id].cost) return;
    commit({ ...p, points: p.points - WEAPONS[id].cost, owned: { ...p.owned, [id]: { lvl: 0 } } });
  };

  const levelWeapon = (id) => {
    const w = WEAPONS[id], cur = p.owned[id];
    if (!cur || cur.lvl >= w.maxLvl || p.points < w.upCost) return;
    commit({ ...p, points: p.points - w.upCost, owned: { ...p.owned, [id]: { lvl: cur.lvl + 1 } } });
  };

  const buyAcc = (id) => {
    const a = ACCESSORIES[id];
    if (accState(id) || p.points < a.cost) return;
    commit({ ...p, points: p.points - a.cost, acc: { ...(p.acc || {}), [id]: { lvl: a.buyFirst ? 1 : 0 } } });
  };

  const levelAcc = (id) => {
    const a = ACCESSORIES[id];
    const cur = accState(id) || (!a.buyFirst ? { lvl: 0 } : null);
    if (!cur || cur.lvl >= a.maxLvl || p.points < a.upCost) return;
    commit({ ...p, points: p.points - a.upCost, acc: { ...(p.acc || {}), [id]: { lvl: cur.lvl + 1 } } });
  };

  // a chain card shows whichever tier the player has reached
  const resolveChain = (id) => {
    if (id === "orb") {
      const orb = accState("orb"), twin = accState("twinorb"), trip = accState("tripleorb");
      if (trip) return "tripleorb";
      if (twin && twin.lvl >= ACCESSORIES.twinorb.maxLvl) return "tripleorb";
      if (twin) return "twinorb";
      if (orb && orb.lvl >= ACCESSORIES.orb.maxLvl) return "twinorb";
      return "orb";
    }
    if (id === "homing") {
      const h = accState("homing"), th = accState("twinhoming"), rr = accState("rapidrockets");
      if (rr) return "rapidrockets";
      if (th && th.lvl >= ACCESSORIES.twinhoming.maxLvl) return "rapidrockets";
      if (th) return "twinhoming";
      if (h) return "twinhoming";
      return "homing";
    }
    return id;
  };

  return (
    <div className={styles.shopWrap}>
      <div className={styles.shopPoints}>◆ {p.points} pts</div>

      <div className={styles.shopTabs}>
        <button className={`${styles.shopTab} ${tab === "weapons" ? styles.shopTabOn : ""}`} onClick={() => setTab("weapons")}>Weaponries</button>
        <button className={`${styles.shopTab} ${tab === "acc" ? styles.shopTabOn : ""}`} onClick={() => setTab("acc")}>Accessories</button>
      </div>

      {tab === "weapons" ? (
        <div className={styles.shopGrid}>
          {Object.entries(WEAPONS).map(([id, w]) => {
            const owned = p.owned[id];
            return (
              <div key={id} className={styles.shopCard}>
                <span className={styles.shopName}>{w.name}</span>
                <span className={styles.shopDesc}>{w.desc}</span>
                <span className={styles.shopLv}>
                  {owned ? `LV ${owned.lvl}/${w.maxLvl} · ${weaponDmg(id, owned.lvl)} dmg` : "\u00A0"}
                </span>
                <div className={styles.shopSlot}>
                  {!owned ? (
                    <button className={styles.shopBtn} onClick={() => buyWeapon(id)} disabled={p.points < w.cost}>
                      {w.cost === 0 ? "Owned" : `Buy ${w.cost}`}
                    </button>
                  ) : owned.lvl >= w.maxLvl ? (
                    <span className={styles.shopMax}>MAX</span>
                  ) : (
                    <button className={styles.shopBtn} onClick={() => levelWeapon(id)} disabled={p.points < w.upCost}>
                      LV+ ({w.upCost})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.shopGrid}>
          {Object.entries(ACCESSORIES)
            .filter(([, a]) => !a.hidden)
            .map(([baseId]) => {
              const id = resolveChain(baseId);
              const a = ACCESSORIES[id];
              const cur = accState(id);
              const lvl = cur?.lvl ?? 0;
              const owned = a.buyFirst ? !!cur : true;
              const atMax = a.maxLvl > 0 ? lvl >= a.maxLvl : !!cur;

              return (
                <div key={baseId} className={styles.shopCard}>
                  <span className={styles.shopName}>{a.name}</span>
                  <span className={styles.shopDesc}>{a.desc}</span>
                  <span className={styles.shopLv}>
                    {a.maxLvl > 0 && owned ? `LV ${lvl}/${a.maxLvl}` : "\u00A0"}
                  </span>
                  <div className={styles.shopSlot}>
                    {a.buyFirst && !cur ? (
                      <button className={styles.shopBtn} onClick={() => buyAcc(id)} disabled={p.points < a.cost}>
                        Buy {a.cost}
                      </button>
                    ) : atMax ? (
                      <span className={styles.shopMax}>{a.maxLvl > 0 ? "MAX" : "Owned"}</span>
                    ) : (
                      <button className={styles.shopBtn} onClick={() => levelAcc(id)} disabled={p.points < a.upCost}>
                        LV+ ({a.upCost})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export function Arsenals() {
  const [p, setP] = useState(loadProfile);

  const equip = (id) => {
    if (!p.owned[id]) return;
    const next = { ...p, equipped: id };
    saveProfile(next);
    setP(next);
  };

  return (
    <div className={styles.shopWrap}>
      <div className={styles.shopPoints}>Equipped: {WEAPONS[p.equipped]?.name}</div>
      <div className={styles.shopGrid}>
        {Object.entries(WEAPONS)
          .filter(([id]) => p.owned[id])
          .map(([id, w]) => (
            <div key={id} className={styles.shopCard}>
              <span className={styles.shopName}>{w.name}</span>
              <span className={styles.shopDesc}>{w.desc}</span>
              <span className={styles.shopLv}>LV {p.owned[id].lvl}/{w.maxLvl} · {weaponDmg(id, p.owned[id].lvl)} dmg</span>
              <div className={styles.shopSlot}>
                <button
                  className={`${styles.shopBtn} ${p.equipped === id ? styles.shopEquipped : ""}`}
                  onClick={() => equip(id)}
                >
                  {p.equipped === id ? "Equipped" : "Equip"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}