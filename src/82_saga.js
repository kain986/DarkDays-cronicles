/* =================== SAGA: LATE HOOKS (maps, looks, barks, high-tier spells, recipes) =================== */
Object.assign(LEADS, SAGA_LEADS);
Object.assign(TACB, SAGA_TACB);

/* ---------- new battle maps ---------- */
Object.assign(MSTYLE, {
  ship:      {g: "wood", base: "#3a2a1c", ob: "barrel", light: "rgba(150,200,230,.14)", amb: "drips"},
  desert:    {g: "dirt", base: "#5a4430", ob: "rock", light: "rgba(255,200,120,.18)", amb: "ash"},
  city:      {g: "tiles", base: "#3a2c30", ob: "pillar", light: "rgba(210,170,255,.16)", amb: "motes"},
  cathedral: {g: "marble", base: "#241a2c", ob: "pillar", light: "rgba(190,140,255,.22)", amb: "motes"},
  maw:       {g: "obsidian", base: "#2a0a10", ob: "mirror", light: "rgba(255,80,90,.2)", amb: "embers"},
  ruins:     {g: "stone", base: "#2f2724", ob: "rock", light: "rgba(255,130,80,.16)", amb: "embers"},
});
Object.assign(TCFG, {
  ship:      {tall: "cratestack", low: "barrel", nt: 2, hill: 1, rough: "rubble", nr: 2},
  desert:    {tall: "menhir", low: "rock", nt: 2, hill: 2, rough: "rubble", nr: 4},
  city:      {tall: "pillar", low: "crate", nt: 2, hill: 1, rough: "rubble", nr: 3},
  cathedral: {tall: "pillar", low: "rock", nt: 3, hill: 1, rough: "rubble", nr: 2, holy: 1},
  maw:       {tall: "mirror", low: "rock", nt: 2, hill: 1, rough: "rubble", nr: 4},
  ruins:     {tall: "pillar", low: "rock", nt: 3, hill: 1, rough: "brush", nr: 5},
});

/* ---------- looks of the new creatures ---------- */
Object.assign(FOE_LOOK, {
  spento: {skin: "#b8b4a8", armor: "#4a4640", rag: 1, hunch: 1, weapon: "claws", eyes: "#ffffff", noshadow: 1},
  shepherd: {robe: "#cfc8b8", armor: "#cfc8b8", hood: "#b8b0a0", mask: "#ffffff", weapon: "staff", orb: "#ffffff", S: 1.1, noshadow: 1},
  faceless: {robe: "#1a1620", armor: "#1a1620", hood: "#121018", mask: "#e8e2d4", weapon: "dagger", skin: "#d8c8b0"},
  maskguard: {armor: "#4a3a5a", metal: 1, tabard: "#2a1a3a", hat: "helm", mask: "#e8e2d4", weapon: "halberd", pants: "#2a2430"},
  chorister: {robe: "#2a1a3a", armor: "#2a1a3a", hood: "#1a1028", mask: "#e8e2d4", weapon: "censer", glow: "#c08cff", skin: "#d8c8b0"},
  chimera: {quad: 1, fur: "#1a1024", eyes: "#ff8aff", Q: 1.35},
  caspian: {armor: "#c8c0d8", metal: 1, cloak: "#4a2a6a", mask: "#ffffff", hair: "#d8d0c0", weapon: "rapier", skin: "#e0b48e", S: 1.05},
  lia: {robe: "#f2ede0", armor: "#f2ede0", skin: "#e8dcd0", hair: "#e8e0d0", mask: "#ffffff", weapon: "staff", orb: "#c08cff", S: .7},
  pirate: {armor: "#5a3a2a", hood: "#3a2a20", pants: "#2a2420", weapon: "scimitar", skin: "#c49a7a"},
  gunner: {armor: "#4a3a2a", hood: "#2a2a2a", pants: "#2a2420", weapon: "xbow", skin: "#c49a7a"},
  drownpriest: {skin: "#7aa0a0", robe: "#1a3a3a", armor: "#1a3a3a", hood: "#123030", weapon: "censer", glow: "#9ff0e0"},
  eel: {quad: 1, fur: "#1a3a4a", eyes: "#9ff0e0", Q: 1.25},
  admiral: {ghost: 1, robe: "#1a2a3a", eyes: "#9ff0e0", crown: "#3a5a6a", weapon: "sword", S: 1.15},
  vashka: {maw: 1},
  iskra: {armor: "#6a3a2a", cloak: "#2a4a6a", hair: "#c8562a", weapon: "sword", skin: "#e0b48e", pants: "#3a2a20"},
  spawn: {skin: "#5a2a3a", armor: "#3a1a24", hunch: 1, weapon: "claws", eyes: "#ff3a4a", W: 1.2},
  hollowangel: {ghost: 1, robe: "#d8d0b0", eyes: "#ffe08a", glow: "#ffd38a", weapon: "spear", S: 1.2},
  maw_beast: {quad: 1, fur: "#3a0a14", eyes: "#ff3a4a", Q: 1.4},
  general: {armor: "#2a1018", metal: 1, hat: "helm", weapon: "greatsword", eyes: "#ff3a4a", S: 1.25, W: 1.3, cloak: "#5a0a14", pants: "#1a0a0e"},
  tooth: {armor: "#d8d0c0", metal: 1, weapon: "spear", eyes: "#ff3a4a", empty: 1, S: 1.05},
  eaten: {ghost: 1, robe: "#3a0a14", eyes: "#ffffff"},
  echo: {ghost: 1, robe: "#4a4a5a", eyes: "#ffd38a", weapon: "hammer"},
  morrhan: {maw: 1}, morrhan2: {maw: 1, chains: 1},
  eaten_choir: {robe: "#3a0a14", armor: "#3a0a14", hood: "#2a0610", mask: "#d8c8b0", weapon: "censer", glow: "#ff3a4a", skin: "#c8a090"},
  choirmother: {robe: "#5a0a1a", armor: "#5a0a1a", hood: "#3a0610", mask: "#f2ede0", weapon: "staff", orb: "#ff3a4a", S: 1.15},
  tooth5: {armor: "#e8e0d0", metal: 1, weapon: "spear", eyes: "#ff3a4a", empty: 1, S: 1.1},
  gatekeeper: {skin: "#8a2a34", armor: "#5a1a24", hunch: 1, weapon: "claws", eyes: "#ffffff", S: 1.35, W: 1.4},
  echo_lead: {ghost: 1, robe: "#5a5a6a", eyes: "#ffd38a", weapon: "hammer", S: 1.15},
  lia_ash: {robe: "#2a1a14", armor: "#2a1a14", skin: "#3a2a24", hair: "#1a1410", mask: "#3a2a24", weapon: "staff", orb: "#ff7a30", S: .7, glow: "#ff7a30"},
  tongue: {quad: 1, fur: "#7a1a2a", eyes: "#ff8a9a", Q: 1.2},
  hand: {maw: 1},
});

/* ---------- high-tier spells ---------- */
Object.assign(SPELL_IC, {coneofcold: "burst", chainlightning: "bolt", meteor: "flame", flamestrike: "flame", heal: "heart", massheal: "heart", volley: "target", wave: "burst"});
const NEW_SPELLS = new Set(["coneofcold", "chainlightning", "meteor", "flamestrike", "heal", "massheal", "volley", "wave"]);
const _castSpellSaga = castSpell;
castSpell = async function (u, key, target) {
  if (!NEW_SPELLS.has(key)) return _castSpellSaga(u, key, target);
  const sp = SPELLS[key], c = u.ref, dc = spellDC(c);
  if (sp.bonus) u.bon--; else u.act--;
  const i = slotFor(c, sp.lv); if (i >= 0) c.slots[i]--;
  logL(`${u.name}: ${tr(sp.n)}`); u.casting = 1; if (CB) CB.healCtx = {u, lv: sp.lv};
  const areaHit = async (center, rad, dice, type, save, extra) => {
    const dmg = roll(dice).total, dmg2 = extra ? roll(extra.dice).total : 0;
    for (const t of inArea(center, rad).filter(t => t !== u && alive(t))) {
      const ok = saveRoll(t, save, dc, save === "dex" ? coverOf(center, t) : 0);
      await applyDmg(t, ok ? Math.floor(dmg / 2) : dmg, type, u);
      if (extra && alive(t)) await applyDmg(t, ok ? Math.floor(dmg2 / 2) : dmg2, extra.type, u);
      if (!ok && extra && extra.prone && alive(t) && !t.boss) t.cond.prone = 1;
    }
  };
  try {
    switch (key) {
      case "coneofcold": await fxArea(target, 2, "cold"); await areaHit(target, 2, "8d8", "cold", "con"); break;
      case "flamestrike": await fxColumn(target, "radiant"); await fxArea(target, 1, "fire"); await areaHit(target, 1, "4d6", "fire", "dex", {dice: "4d6", type: "radiant"}); igniteArea(target, 1); break;
      case "meteor": await fxProjectile(u, target, "fire"); await fxArea(target, 3, "fire"); await areaHit(target, 3, "20d6", "fire", "dex", {dice: "20d6", type: "blunt"}); igniteArea(target, 2); break;
      case "volley": await fxArea(target, 2, "pierce"); await areaHit(target, 2, "8d8", "pierce", "dex"); break;
      case "chainlightning": { const hit = [target];
        foes().filter(f => f !== target && dist(f, target) <= 4).sort((a, b) => dist(a, target) - dist(b, target)).slice(0, 3).forEach(f => hit.push(f));
        let prev = u; for (const t of hit) { await fxProjectile(prev, t, "force"); prev = t; const d = roll("10d8").total, ok = saveRoll(t, "dex", dc); await applyDmg(t, ok ? Math.floor(d / 2) : d, "force", u); } break; }
      case "heal": heal(target, 70); break;
      case "massheal": allies().forEach(a => heal(a, 60)); break;
      case "wave": await fxArea(u, 2, "radiant"); for (const t of foes().filter(f => dist(f, u) <= 2)) { const ok = saveRoll(t, "con", dc);
        await applyDmg(t, (ok ? .5 : 1) * roll("5d6").total, "thunder", u); if (alive(t)) await applyDmg(t, (ok ? .5 : 1) * roll("5d6").total, "radiant", u); if (!ok && alive(t) && !t.boss && !t.obj) t.cond.prone = 1; } placeTokens(); break;
    }
  } finally { u.casting = 0; if (CB) CB.healCtx = null; }
};

/* ---------- forge: higher-tier upgrades ---------- */
RECIPES.push(
  {id: "w3", out: "w3", kind: "forge", need: {w2: 1, iron: 4, essence: 3}, gold: 600, forge: 3},
  {id: "w4", out: "w4", kind: "forge", need: {w3: 1, heartglass: 2, sunshard: 3}, gold: 1400, forge: 3},
  {id: "w5", out: "w5", kind: "forge", need: {w4: 1, heartglass: 4, sunshard: 4}, gold: 3000, forge: 3},
  {id: "supreme", out: "supreme", kind: "alc", need: {herb: 3, essence: 1, sunshard: 1}},
);

/* ---------- materials from the stronger enemies ---------- */
const _dropsOfSaga = dropsOf;
dropsOf = function (f) {
  const d = f.def; if (!d.lv) return _dropsOfSaga(f);
  const L = [["iron", .4], ["essence", .45], ["herb", .3]];
  if (d.lv >= 14) L.push(["heartglass", d.boss ? 1 : .12]);
  if (d.boss) L.push(["sunshard", 1], ["essence", 1]);
  if (d.undead) L.push(["bone", .5]);
  return L;
};
