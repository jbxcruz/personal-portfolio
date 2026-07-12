export function loadScores(gameId, diff = "default") {
  try {
    return JSON.parse(localStorage.getItem(`jebby-arcade:${gameId}:${diff}`)) || [];
  } catch {
    return [];
  }
}

export function saveScore(gameId, diff, score, lowerIsBetter = false) {
  try {
    const key = `jebby-arcade:${gameId}:${diff}`;
    const list = loadScores(gameId, diff);
    list.push({ score, date: new Date().toLocaleDateString() });
    list.sort((a, b) => (lowerIsBetter ? a.score - b.score : b.score - a.score));
    const top = list.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(top));
    return top;
  } catch {
    return [];
  }
}

const PROFILE_KEY = "jebby-arcade:space:profile";

export function loadProfile() {
  try {
    return (
      JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
        points: 0,
        owned: { basic: { lvl: 0 } },
        equipped: "basic",
        acc: {},
      }
    );
  } catch {
    return { points: 0, owned: { basic: { lvl: 0 } }, equipped: "basic", acc: {} };
  }
}

export function saveProfile(p) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {}
}