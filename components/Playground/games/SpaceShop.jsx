"use client";

import { useState } from "react";
import styles from "../Playground.module.scss";
import { loadProfile, saveProfile } from "../arcade";
import { WEAPONS, weaponDmg } from "./SpaceGuardian";

export const ACCESSORIES = {
  holoshield:   { name: "Holo-Shield", desc: "Consumable shield. Blocks one hit each. Lost on death.", cost: 0, upCost: 100, maxLvl: 5, buyFirst: false, consumable: true },
  health:       { name: "Health Bar", desc: "+1 heart per level", cost: 0, upCost: 250, maxLvl: 10, buyFirst: false },
  orb:          { name: "Orb", desc: "Orbiting orb, +1 dmg on touch", cost: 1000, upCost: 500, maxLvl: 5, buyFirst: true },
  twinorb:      { name: "Twin Orbs", desc: "A second orbiting orb", cost: 2000, upCost: 700, maxLvl: 5, buyFirst: true, hidden: true },
  tripleorb:    { name: "Triple Orbs", desc: "A third orbiting orb", cost: 2500, upCost: 0, maxLvl: 0, buyFirst: true, hidden: true },
  gunattach:    { name: "+1 Gun Attachment", desc: "+1 cannon barrel on any gun", cost: 2000, upCost: 2000, maxLvl: 3, buyFirst: true, tierCost: { 3: 3000 } },
  firerate:     { name: "Fire Rate", desc: "+1 fire speed for every gun", cost: 0, upCost: 350, maxLvl: 8, buyFirst: false },
  homing:       { name: "Homing Missile", desc: "Seeks a random enemy, 5 dmg", cost: 1500, upCost: 0, maxLvl: 0, buyFirst: true },
  twinhoming:   { name: "Twin Homing Missiles", desc: "Two seekers, faster each level", cost: 500, upCost: 500, maxLvl: 5, buyFirst: true, hidden: true },
  rapidrockets: { name: "Twin Semi-Rapid Homing Rockets", desc: "Twin straight rockets in bursts, 5 dmg", cost: 3500, upCost: 0, maxLvl: 0, buyFirst: true, hidden: true },
  bea:          { name: "Bea", desc: "An ally on your right. Cannot be destroyed. Give her a gun in Arsenals.", cost: 7777, upCost: 0, maxLvl: 0, buyFirst: true },
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
    if (!cur || cur.lvl >= a.maxLvl) return;
    const price = a.tierCost?.[cur.lvl + 1] ?? a.upCost;   // next level's price
    if (p.points < price) return;
    commit({ ...p, points: p.points - price, acc: { ...(p.acc || {}), [id]: { lvl: cur.lvl + 1 } } });
  };

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
                    {a.maxLvl > 0 && owned ? (a.consumable ? `${lvl}/${a.maxLvl} in stock` : `LV ${lvl}/${a.maxLvl}`) : "\u00A0"}
                  </span>
                  <div className={styles.shopSlot}>
                    {a.buyFirst && !cur ? (
                      <button className={styles.shopBtn} onClick={() => buyAcc(id)} disabled={p.points < a.cost}>Buy {a.cost}</button>
                    ) : atMax ? (
                      <span className={styles.shopMax}>{a.maxLvl > 0 ? (a.consumable ? "FULL" : "MAX") : "Owned"}</span>
                    ) : (
                      (() => {
                        const nextLvl = (cur?.lvl ?? 0) + 1;
                        const price = a.tierCost?.[nextLvl] ?? a.upCost;
                        return (
                          <button className={styles.shopBtn} onClick={() => levelAcc(id)} disabled={p.points < price}>
                            {a.consumable ? `+1 (${price})` : `LV+ (${price})`}
                          </button>
                        );
                      })()
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



export function Arsenals({ onExit }) {
  const [p, setP] = useState(loadProfile);
  const [who, setWho] = useState(null); // null = profile picker, "jebby" | "bea"

  const hasBea = !!p.acc?.bea;
  const owned = Object.entries(WEAPONS).filter(([id]) => p.owned[id]);

  const beaId =
    p.beaWeapon && p.owned[p.beaWeapon] && p.beaWeapon !== p.equipped
      ? p.beaWeapon
      : p.equipped !== "smg"
      ? "smg"
      : owned.find(([id]) => id !== p.equipped)?.[0] || "basic";

  const equipJebby = (id) => {
    if (!p.owned[id]) return;
    const next = { ...p, equipped: id };
    if (next.beaWeapon === id || beaId === id) {
      next.beaWeapon =
        p.owned.smg && id !== "smg" ? "smg" : owned.find(([o]) => o !== id)?.[0] || null;
    }
    saveProfile(next);
    setP(next);
  };

  const equipBea = (id) => {
    if (id === p.equipped) return;                    // never Jebby's gun
    if (!p.owned[id] && id !== "smg") return;         // she may use her default SMG even unowned
    const next = { ...p, beaWeapon: id };
    saveProfile(next);
    setP(next);
  };

  // Bea not owned: single grid, no picker
  if (!hasBea) {
    return (
      <div className={styles.almWrap}>
        <div className={styles.shopPoints}>Jebby: {WEAPONS[p.equipped]?.name}</div>
        <div className={styles.almBody}>
          <div className={styles.shopGrid}>
            {owned.map(([id, w]) => (
              <div key={id} className={styles.shopCard}>
                <span className={styles.shopName}>{w.name}</span>
                <span className={styles.shopLv}>
                  LV {p.owned[id].lvl}/{w.maxLvl} · {weaponDmg(id, p.owned[id].lvl)} dmg
                </span>
                <div className={styles.shopSlot}>
                  <button
                    className={`${styles.shopBtn} ${p.equipped === id ? styles.shopEquipped : ""}`}
                    onClick={() => equipJebby(id)}
                  >
                    {p.equipped === id ? "Equipped" : "Equip"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.almBackBtn} onClick={() => onExit?.()}>← Back to menu</button>
      </div>
    );
  }

  // profile picker
  if (!who) {
    return (
      <div className={styles.almWrap}>
        <div className={styles.almBody}>
          <div className={styles.profileRow}>
            <button className={styles.profileCard} onClick={() => setWho("jebby")}>
              <svg viewBox="0 0 60 40" shapeRendering="crispEdges" className={styles.profileSprite} aria-hidden="true">
                <rect x="15" y="10" width="30" height="20" fill="#3BB8E5" />
                <rect x="9" y="18" width="6" height="10" fill="#3BB8E5" />
                <rect x="45" y="18" width="6" height="10" fill="#3BB8E5" />
                <rect x="26" y="2" width="8" height="8" fill="#3BB8E5" />
                <rect x="21" y="15" width="5" height="5" fill="#111" />
                <rect x="34" y="15" width="5" height="5" fill="#111" />
                <rect x="24" y="30" width="4" height="6" fill="#ff8a3d" />
                <rect x="32" y="30" width="4" height="6" fill="#ff8a3d" />
              </svg>
              <span className={styles.profileName}>Jebby</span>
              <span className={styles.profileGun}>{WEAPONS[p.equipped]?.name}</span>
            </button>

            <button className={styles.profileCard} onClick={() => setWho("bea")}>
              <svg viewBox="0 0 60 40" shapeRendering="crispEdges" className={styles.profileSprite} aria-hidden="true">
                <rect x="19" y="14" width="22" height="14" fill="#ff6bb3" />
                <rect x="14" y="20" width="5" height="7" fill="#ff6bb3" />
                <rect x="41" y="20" width="5" height="7" fill="#ff6bb3" />
                <rect x="24" y="18" width="4" height="4" fill="#111" />
                <rect x="32" y="18" width="4" height="4" fill="#111" />
                <rect x="27" y="28" width="4" height="5" fill="#ff8a3d" />
              </svg>
              <span className={styles.profileName}>Bea</span>
              <span className={styles.profileGun}>{beaId ? WEAPONS[beaId].name : "None available"}</span>
            </button>
          </div>
        </div>
        <button className={styles.almBackBtn} onClick={() => onExit?.()}>← Back to menu</button>
      </div>
    );
  }

  // loadout grid for the selected profile
  const isJebby = who === "jebby";
  return (
    <div className={styles.almWrap}>
      <div className={styles.shopPoints}>
        {isJebby ? `Jebby: ${WEAPONS[p.equipped]?.name}` : `Bea: ${beaId ? WEAPONS[beaId].name : "None available"}`}
      </div>

      <div className={styles.almBody}>
        <div className={styles.shopGrid}>
          {(isJebby ? owned : Object.entries(WEAPONS).filter(([id]) => p.owned[id] || id === "smg")).map(([id, w]) => {
            const lvl = p.owned[id]?.lvl ?? 0;                // unowned (Bea's free SMG) reads as LV 0
            const locked = !isJebby && id === p.equipped;      // Bea can't take Jebby's gun
            const active = isJebby ? p.equipped === id : beaId === id;
            return (
              <div key={id} className={`${styles.shopCard} ${locked ? styles.shopLocked : ""}`}>
                <span className={styles.shopName}>{w.name}</span>
                <span className={styles.shopLv}>
                  LV {lvl}/{w.maxLvl} · {weaponDmg(id, lvl)} dmg
                </span>
                <div className={styles.shopSlot}>
                  {locked ? (
                    <span className={styles.shopTaken}>Jebby&rsquo;s</span>
                  ) : (
                    <button
                      className={`${styles.shopBtn} ${active ? styles.shopEquipped : ""}`}
                      onClick={() => (isJebby ? equipJebby(id) : equipBea(id))}
                    >
                      {active ? "Equipped" : "Equip"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className={styles.almBackBtn} onClick={() => setWho(null)}>‹ Back to profiles</button>
    </div>
  );
}