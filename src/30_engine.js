/* =================== UTIL =================== */
const $ = (s, r = document) => r.querySelector(s);
const rnd = n => 1 + Math.floor(Math.random() * n);
const mod = s => Math.floor((s - 10) / 2);
const sgn = n => (n >= 0 ? "+" : "") + n;
const sleep = ms => new Promise(r => setTimeout(r, ms * (typeof PREF !== "undefined" && PREF.fast ? .5 : 1)));
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function roll(expr) {
  if (typeof expr === "number") return {total: expr};
  let total = 0;
  String(expr).replace(/\s/g, "").split(/(?=[+-])/).forEach(part => {
    let sign = 1;
    if (part[0] === "-") { sign = -1; part = part.slice(1); } else if (part[0] === "+") part = part.slice(1);
    const m = part.match(/^(\d*)d(\d+)$/);
    if (m) { const n = +(m[1] || 1), f = +m[2]; for (let i = 0; i < n; i++) total += sign * rnd(f); }
    else total += sign * (+part || 0);
  });
  return {total: Math.max(0, total)};
}
const critDice = e => e.replace(/(\d*)d(\d+)/g, (m, a, b) => (2 * (+(a || 1))) + "d" + b);

/* =================== STATE & STORAGE =================== */
const SAVE_KEY = "ddc-save-v1", PREF_KEY = "ddc-prefs-v1";
let S = null, PREF = {lang: 0, diff: 1}, SCREEN = "title", BUSY = false;
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
function load(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function saveGame(silent) { if (!S) return; const ok = store(SAVE_KEY, S); if (!silent) toast(ok ? T_("saved") : T_("noStore")); }

/* =================== CHARACTER RULES =================== */
const CL = c => CLASSES[c.cls];
const prof = c => c.lvl >= 5 ? 3 : 2;
const abEff = (c, k) => { const v = c.ab[k], t = c.trinket && ITEMS[c.trinket]; return t && t.setAb && t.setAb[0] === k ? Math.max(v, t.setAb[1]) : v; };
const abm = (c, k) => mod(abEff(c, k));
const hasFeat = (c, f) => !!(c && c.feats && c.feats.includes(f));
function maxHP(c) { const h = CL(c).hd, con = abm(c, "con"); let hp = h + con + (c.lvl - 1) * (h / 2 + 1 + con); if (c.race === "dwarf") hp += c.lvl; if (hasFeat(c, "tough")) hp += 2 * c.lvl; return Math.max(1, hp); }
function acOf(c) { const dex = abm(c, "dex"); const a = CL(c).armor; let ac = a === "heavy" ? 16 : a === "medium" ? 14 + Math.min(dex, 2) : a === "light" ? 11 + dex : 13 + dex; if (CL(c).shield) ac += 2; return ac + (c.aplus || 0) + (c.trinket === "ring_prot" ? 1 : 0); }
const speedOf = c => RACES[c.race].spd + (c.trinket === "boots_wind" ? 2 : 0) + (hasFeat(c, "mobile") ? 2 : 0);
function slotsMax(c) { const t = CL(c).caster; const tab = t === "full" ? FULL : t === "half" ? HALF : null; const s = tab ? tab[c.lvl].slice() : [0,0,0,0]; if (tab && c.trinket === "pearl_power") s[c.lvl >= 3 ? 1 : 0]++; return s; }
const castMod = c => CL(c).cast ? abm(c, CL(c).cast) : 0;
const spellDC = c => 8 + prof(c) + castMod(c);
const spellAtk = c => prof(c) + castMod(c);
function featsOf(c) { const t = CLASS_FEATS[c.cls] || {}, out = []; for (let l = 1; l <= c.lvl; l++) (t[l] || []).forEach(f => { if (!out.includes(f)) out.push(f); }); return out; }
const hasF = (c, f) => featsOf(c).includes(f);
function spellsOf(c) { const t = CL(c).spells || {}, out = []; Object.keys(t).forEach(l => { if (c.lvl >= +l) out.push(...t[l]); }); return out; }
const weaponsOf = c => c.weapons || CL(c).weapons;
const skillBonus = (c, sk) => abm(c, SKILLS[sk][1]) + (c.skills.includes(sk) ? prof(c) : 0);
function auraBonus() { if (!S) return 0; const p = S.party.find(c => c.cls === "paladin" && c.lvl >= 6 && c.hp > 0); return p ? Math.max(1, abm(p, "cha")) : 0; }
const saveBonus = (c, ab) => abm(c, ab) + (CL(c).saves.includes(ab) ? prof(c) : 0) + auraBonus() + (c.trinket === "ring_prot" ? 1 : 0);
function resetRes(c) { c.res = {sw: 1, as: 1, lay: 5 * c.lvl, ch: 1, arc: 1}; c.hdLeft = c.lvl; }
function recalc(c, full) {
  const m = maxHP(c);
  if (full || c.maxhp == null) c.hp = m; else c.hp = Math.min(m, c.hp + Math.max(0, m - c.maxhp));
  c.maxhp = m;
  if (full) { c.slots = slotsMax(c); resetRes(c); }
}
function asiLevels(c) { const t = CLASS_FEATS[c.cls] || {}; return Object.keys(t).filter(l => t[l].includes("asi")).map(Number); }
function autoASI(c) {
  c.asiDone = c.asiDone || [];
  asiLevels(c).forEach(l => { if (c.lvl >= l && !c.asiDone.includes(l)) { c.feats = c.feats || []; if (l === 4 && COMP_FEAT[c.id] && !c.feats.includes(COMP_FEAT[c.id])) { c.feats.push(COMP_FEAT[c.id]); c.asiDone.push(l); recalc(c); return; } const k = c.ab[CL(c).prim] >= 19 ? "con" : CL(c).prim; c.ab[k] = Math.min(20, c.ab[k] + 2); c.asiDone.push(l); } });
}
function weapProfile(c, wk) {
  const w = WEAP[wk]; const stat = w.st === "fin" ? (abm(c, "str") > abm(c, "dex") ? "str" : "dex") : w.st; const m = abm(c, stat);
  let hit = m + prof(c) + (c.wplus || 0), flat = m + (c.wplus || 0);
  if (w.ranged && hasF(c, "archery")) hit += 2;
  if (w.ranged && c.trinket === "eye_hawk") hit += 2;
  if (!w.ranged && hasF(c, "dueling")) flat += 2;
  return {key: wk, name: tr(w.n), dice: w.d, hit, flat, r: w.r, ranged: !!w.ranged, t: w.t, finesse: w.st === "fin"};
}
function newChar(o) {
  const c = {id: o.id, name: o.name, race: o.race, cls: o.cls, bg: o.bg || null, ab: {...o.ab}, lvl: o.lvl || 1, wplus: 0, aplus: 0, skills: [...new Set(o.skills)], weapons: o.weapons || null, asiDone: [], feats: [], trinket: null};
  if (o.id !== "pc") autoASI(c);
  recalc(c, true); return c;
}
function makeComp(id) { const d = COMPS[id]; return newChar({id, name: d.name, race: d.race, cls: d.cls, ab: d.ab, skills: d.skills, weapons: d.weapons, lvl: S.level}); }
const pc = () => S.party[0];

/* =================== STORY HELPERS =================== */
const has = f => !!(S && S.flags[f]);
const set = (f, v = 1) => { S.flags[f] = v; };
const inP = id => S.party.some(c => c.id === id);
function gold(n) { S.gold += n; toastQ(`+${n} ${T_("gp")}`); }
function item(k, n = 1) { S.inv[k] = (S.inv[k] || 0) + n; toastQ(`${T_("got")}: ${tr(ITEMS[k].n)}${n > 1 ? " ×" + n : ""}`); }
function take(k) { if (S.inv[k]) { S.inv[k]--; if (!S.inv[k]) delete S.inv[k]; } }
function xp(n) { S.xp += n; toastQ(`+${n} ${T_("xp")}`); checkLevel(); }
function join(id) { if (inP(id)) return; const c = makeComp(id); S.party.push(c); toastQ(`${c.name} ${T_("joined")}`); }
function dmgParty(n) { S.party.forEach(c => c.hp = Math.max(1, c.hp - n)); }
function longRest() { S.party.forEach(c => { c.hp = c.maxhp; c.slots = slotsMax(c); resetRes(c); }); S.shortRests = 0; }
function shortRest() {
  if ((S.shortRests || 0) >= 2) return false; S.shortRests = (S.shortRests || 0) + 1;
  S.party.forEach(c => { if (c.hdLeft == null) c.hdLeft = c.lvl; const hd = CL(c).hd;
    while (c.hdLeft > 0 && c.hp < c.maxhp * .85) { c.hdLeft--; c.hp = Math.min(c.maxhp, c.hp + Math.max(1, rnd(hd) + abm(c, "con"))); }
    c.res.sw = 1; c.res.as = 1; c.res.ch = 1;
    if (c.cls === "wizard" && c.res.arc) { c.res.arc = 0; let b = Math.ceil(c.lvl / 2); const mx = slotsMax(c); for (let i = 2; i >= 0; i--) while (b >= i + 1 && c.slots[i] < mx[i]) { c.slots[i]++; b -= i + 1; } } });
  return true;
}
function checkLevel() {
  while (S.level < MAXLV && S.xp >= XPT[S.level + 1]) {
    S.level++; (S.pendingLv = S.pendingLv || []).push(S.level);
    S.party.forEach(c => { c.lvl = S.level; if (c.id !== "pc") autoASI(c); recalc(c); c.slots = slotsMax(c); resetRes(c); });
  }
}

/* =================== TOAST / MODAL =================== */
const TQ = []; let toastOn = false;
function toastQ(m) { TQ.push(Array.isArray(m) ? tr(m) : m); if (!toastOn) nextToast(); }
function toast(m) { toastQ(m); }
function nextToast() {
  const m = TQ.shift(); if (m == null) { toastOn = false; return; }
  toastOn = true; const d = document.createElement("div"); d.className = "toast"; d.setAttribute("role", "status"); d.textContent = m; $("#app").appendChild(d);
  setTimeout(() => { d.remove(); nextToast(); }, 1500);
}
function modal(html, opt = {}) {
  closeModal(); const m = document.createElement("div"); m.className = "modal" + (opt.center ? " center" : "");
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`; $("#app").appendChild(m);
  if (!opt.locked) m.addEventListener("click", e => { if (e.target === m) closeModal(); });
  return m;
}
function closeModal() { document.querySelectorAll(".modal").forEach(m => m.remove()); }
function showScreen(id) { SCREEN = id; $("#app").classList.toggle("incb", id === "combat"); ["title","create","story","combat"].forEach(s => { $("#" + s).hidden = s !== id; }); }

/* =================== SCENE ART (canvas) =================== */
const BG = {
  road:{sky:["#0c0a11","#2b2131"], sun:[.76,.24,.085], L:["hills","road","deadtrees"]},
  village:{sky:["#0d0b12","#2c2230"], sun:[.22,.2,.075], L:["hills","houses","palisade"]},
  graveyard:{sky:["#0a090e","#24202b"], sun:[.7,.22,.09], L:["hills","graves","deadtrees"]},
  forest:{sky:["#09090d","#1c1e22"], sun:[.62,.17,.07], L:["whitetrees","fog","whitetrees"]},
  hut:{sky:["#09090d","#1c1e22"], sun:[.8,.16,.06], L:["whitetrees","hut","fog"]},
  camp:{sky:["#09080c","#1a1820"], sun:[.25,.15,.06], L:["hills","whitetrees","campfire"]},
  cultcamp:{sky:["#0b0810","#291838"], sun:[.5,.14,.08], L:["whitetrees","violetfire","cages"]},
  stones:{sky:["#0b0910","#2a2030"], sun:[.5,.24,.16], L:["hill","stones"]},
  mill:{sky:["#0b0a10","#25202a"], sun:[.2,.2,.07], L:["hills","mill","stream"]},
  bridge:{sky:["#0b0a10","#26212b"], sun:[.8,.2,.08], L:["hills","river","bridge"]},
  city:{sky:["#0c0912","#2b1e38"], sun:[.82,.18,.07], L:["towers","towers2"]},
  tower:{sky:["#0c0912","#341f45"], sun:[.2,.15,.07], L:["towers","bigtower"]},
  bell:{sky:["#0c0912","#2b1e38"], sun:[.75,.2,.08], L:["towers","bell"]},
  mountain:{sky:["#0e0d11","#2e2b31"], sun:[.7,.2,.1], L:["peaks","ash"]},
  fortress:{sky:["#0b0a0e","#2a2227"], sun:[.5,.22,.14], L:["peaks","fort","ash"]},
  throne:{sky:["#050407","#211022"], sun:[.5,.36,.28], L:["ruins","altar"]},
  dawn:{sky:["#1d2c55","#efb06a"], gold:[.5,.62,.16], L:["peaks"]},
  twilight:{sky:["#34304a","#c39a98"], pale:[.5,.5,.12], L:["peaks"]},
  dark:{sky:["#000000","#14081a"], sun:[.5,.4,.36], L:["peaks","throneking"]},
  inn:{wall:"#2b1d15", glow:"#f08a45", gx:.18, L:["beams","hearth","tables"]},
  tavern2:{wall:"#1b1816", glow:"#d06a3a", gx:.7, L:["beams","tables","smoke"]},
  shrine:{wall:"#1e1a24", glow:"#e9c46a", gx:.5, L:["arches","altarIn","candles"]},
  crypt:{wall:"#16151b", glow:"#9fb6e0", gx:.5, L:["arches","sarco","candles"]},
  archive:{wall:"#241a12", glow:"#e9c46a", gx:.5, L:["shelves","candles"]},
  palace:{wall:"#25182c", glow:"#a07ad6", gx:.5, L:["arches","chandelier","dancers"]},
  sewer:{wall:"#111915", glow:"#5f8f6e", gx:.5, L:["tunnel","water"]},
  drowned:{wall:"#0f1a20", glow:"#6fb3a0", gx:.5, L:["shelves","water"]},
  mirror:{wall:"#121018", glow:"#a07ad6", gx:.5, L:["mirrors"]},
  dungeon:{wall:"#17130f", glow:"#e0703f", gx:.5, L:["bars","chains"]},
  title:{sky:["#07060a","#2a2030"], sun:[.62,.3,.16], L:["peaks","whitetrees","fog"]},
};
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 2147483646 + 1; }
function glow(x, cx, cy, r, col, a = .6) { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); x.globalAlpha = a; x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.globalAlpha = 1; }
function ridge(x, W, H, base, amp, col, R, jag) {
  x.fillStyle = col; x.beginPath(); x.moveTo(0, H); const ph = R() * 10;
  for (let i = 0; i <= W + 14; i += jag ? 16 : 6) x.lineTo(i, base + Math.sin(i * .011 + ph) * amp + Math.sin(i * .029 + ph * 2) * amp * .5 + (jag ? (R() - .5) * amp * .9 : 0));
  x.lineTo(W, H); x.closePath(); x.fill();
}
function branch(x, X, Y, len, ang, w, d, R, col) {
  if (d <= 0 || len < 3) return; const X2 = X + Math.cos(ang) * len, Y2 = Y + Math.sin(ang) * len;
  x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(X, Y); x.lineTo(X2, Y2); x.stroke();
  branch(x, X2, Y2, len * (.62 + R() * .15), ang - .35 - R() * .3, w * .65, d - 1, R, col);
  branch(x, X2, Y2, len * (.62 + R() * .15), ang + .35 + R() * .3, w * .65, d - 1, R, col);
}
function blackSun(x, cx, cy, r) {
  glow(x, cx, cy, r * 3, "rgba(236,222,190,.55)", .7);
  x.strokeStyle = "rgba(236,222,190,.22)"; x.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 7; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * 1.2); x.lineTo(cx + Math.cos(a) * r * 2.4, cy + Math.sin(a) * r * 2.4); x.stroke(); }
  x.fillStyle = "#040305"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  x.strokeStyle = "rgba(244,232,200,.95)"; x.lineWidth = 1.6; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
}
const LY = {
  hills(x, W, H, R) { ridge(x, W, H, H * .6, H * .05, "#16131b", R); ridge(x, W, H, H * .74, H * .04, "#0c0a10", R); },
  hill(x, W, H, R) { ridge(x, W, H, H * .72, H * .03, "#0d0b11", R); },
  peaks(x, W, H, R, b) { ridge(x, W, H, H * .42, H * .13, b.gold ? "#2b2a46" : "#1b1720", R, 1); ridge(x, W, H, H * .66, H * .08, b.gold ? "#141329" : "#0d0b11", R, 1); },
  road(x, W, H) { x.fillStyle = "#1c1813"; x.beginPath(); x.moveTo(W * .47, H * .73); x.lineTo(W * .53, H * .73); x.lineTo(W * .86, H); x.lineTo(W * .14, H); x.fill(); },
  deadtrees(x, W, H, R) { for (let i = 0; i < 4; i++) { const X = R() * W, Y = H * (.8 + R() * .15); branch(x, X, Y, H * (.12 + R() * .08), -Math.PI / 2 + (R() - .5) * .3, 4, 5, R, "#050407"); } },
  whitetrees(x, W, H, R) {
    for (let i = 0; i < 5; i++) {
      const X = R() * W, base = H * (.95 + R() * .1), h = H * (.55 + R() * .35), w = 6 + R() * 8;
      x.fillStyle = `rgb(${200 + R() * 25},${195 + R() * 20},${180 + R() * 15})`; x.globalAlpha = .55 + R() * .35;
      x.beginPath(); x.moveTo(X - w, base); x.quadraticCurveTo(X - w * .4, base - h * .5, X - 1, base - h); x.lineTo(X + 1, base - h); x.quadraticCurveTo(X + w * .4, base - h * .5, X + w, base); x.fill();
      x.fillStyle = "#050407"; x.beginPath(); x.ellipse(X, base - h * .35, w * .35, h * .1, 0, 0, 7); x.fill();
      branch(x, X, base - h * .8, h * .18, -Math.PI / 2 - .6, 2.2, 3, R, "rgba(214,206,190,.7)");
      branch(x, X, base - h * .7, h * .16, -Math.PI / 2 + .7, 2, 3, R, "rgba(214,206,190,.6)");
      x.globalAlpha = 1;
    }
  },
  fog(x, W, H) { const g = x.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, "rgba(190,190,210,0)"); g.addColorStop(1, "rgba(190,190,210,.22)"); x.fillStyle = g; x.fillRect(0, H * .55, W, H * .45); },
  houses(x, W, H, R) {
    let cx = -8; const y = H * .82;
    while (cx < W) { const w = 30 + R() * 40, h = 24 + R() * 30; x.fillStyle = "#0b090e"; x.fillRect(cx, y - h, w, H); x.beginPath(); x.moveTo(cx - 4, y - h); x.lineTo(cx + w / 2, y - h - 16 - R() * 14); x.lineTo(cx + w + 4, y - h); x.fill();
      if (R() > .25) { glow(x, cx + w * .3, y - h * .5, 10, "rgba(245,170,80,.9)"); x.fillStyle = "#f2b061"; x.fillRect(cx + w * .3 - 2, y - h * .5 - 3, 5, 6); }
      if (R() > .5) { x.fillStyle = "#f2b061"; x.fillRect(cx + w * .68 - 2, y - h * .55 - 3, 5, 6); }
      cx += w + 4 + R() * 10; }
  },
  palisade(x, W, H, R) { x.fillStyle = "#060508"; for (let i = 0; i < W; i += 9) { const h = H * .13 + R() * 8; x.beginPath(); x.moveTo(i, H); x.lineTo(i, H - h); x.lineTo(i + 4, H - h - 6); x.lineTo(i + 8, H - h); x.lineTo(i + 8, H); x.fill(); } for (let i = 24; i < W; i += 64) { glow(x, i, H * .84, 18, "rgba(246,180,90,.9)"); x.fillStyle = "#ffd28a"; x.fillRect(i - 2, H * .84 - 3, 4, 6); } },
  graves(x, W, H, R) { for (let i = 0; i < 16; i++) { const gx = R() * W, gy = H * (.76 + R() * .22), s = 6 + R() * 11; x.fillStyle = R() > .5 ? "#24212b" : "#15131a"; x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx, gy - s); x.arc(gx + s / 2, gy - s, s / 2, Math.PI, 0); x.lineTo(gx + s, gy); x.fill(); } },
  campfire(x, W, H) { const cx = W / 2, cy = H * .9; glow(x, cx, cy, H * .7, "rgba(240,140,60,.6)", .8); x.fillStyle = "#3a2214"; x.fillRect(cx - 22, cy - 2, 44, 6); x.fillStyle = "#f08a3c"; x.beginPath(); x.moveTo(cx - 14, cy); x.quadraticCurveTo(cx - 6, cy - 30, cx, cy - 44); x.quadraticCurveTo(cx + 8, cy - 28, cx + 14, cy); x.fill(); x.fillStyle = "#ffd38a"; x.beginPath(); x.moveTo(cx - 6, cy); x.quadraticCurveTo(cx, cy - 18, cx + 2, cy - 26); x.quadraticCurveTo(cx + 6, cy - 14, cx + 7, cy); x.fill(); },
  violetfire(x, W, H) { const cx = W * .5, cy = H * .86; glow(x, cx, cy, H * .8, "rgba(160,110,230,.7)", .8); x.fillStyle = "#b48af0"; x.beginPath(); x.moveTo(cx - 16, cy); x.quadraticCurveTo(cx - 6, cy - 34, cx, cy - 52); x.quadraticCurveTo(cx + 9, cy - 32, cx + 16, cy); x.fill(); },
  cages(x, W, H, R) { [.12, .3, .7, .88].forEach(p => { const cx = W * p, by = H * .95, w = 26, h = 34; x.strokeStyle = "#6b5640"; x.lineWidth = 1.5; x.strokeRect(cx - w / 2, by - h, w, h); for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(cx - w / 2 + i * w / 5, by - h); x.lineTo(cx - w / 2 + i * w / 5, by); x.stroke(); } }); },
  stones(x, W, H, R) { for (let i = 0; i < 7; i++) { const a = Math.PI + i * Math.PI / 6, cx = W / 2 + Math.cos(a) * W * .36, cy = H * .8 + Math.sin(a) * H * .06, h = H * (.18 + R() * .1) * (1 - Math.sin(a) * .2), w = 12 + R() * 8; x.fillStyle = "#0e0c12"; x.fillRect(cx - w / 2, cy - h, w, h + 8); x.fillStyle = "rgba(220,210,190,.12)"; x.fillRect(cx - w / 2, cy - h, 2, h); } x.fillStyle = "#130f15"; x.fillRect(W / 2 - 36, H * .82, 72, 12); },
  mill(x, W, H) { const bx = W * .55; x.fillStyle = "#0b090d"; x.fillRect(bx, H * .5, 70, H * .4); x.beginPath(); x.moveTo(bx - 6, H * .5); x.lineTo(bx + 35, H * .36); x.lineTo(bx + 76, H * .5); x.fill(); x.strokeStyle = "#0b090d"; x.lineWidth = 5; x.beginPath(); x.arc(bx - 16, H * .74, 30, 0, 7); x.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; x.beginPath(); x.moveTo(bx - 16, H * .74); x.lineTo(bx - 16 + Math.cos(a) * 30, H * .74 + Math.sin(a) * 30); x.stroke(); } glow(x, bx + 30, H * .66, 30, "rgba(240,140,60,.7)"); },
  stream(x, W, H, R) { x.fillStyle = "#0f1620"; x.fillRect(0, H * .9, W, H * .1); x.strokeStyle = "rgba(200,210,230,.18)"; for (let i = 0; i < 18; i++) { const sx = R() * W, sy = H * (.91 + R() * .08); x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + 10 + R() * 20, sy); x.stroke(); } },
  river(x, W, H, R) { x.fillStyle = "#0d141d"; x.fillRect(0, H * .8, W, H * .2); x.strokeStyle = "rgba(200,210,230,.16)"; for (let i = 0; i < 26; i++) { const sx = R() * W, sy = H * (.82 + R() * .16); x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + 12 + R() * 26, sy); x.stroke(); } },
  bridge(x, W, H) { x.fillStyle = "#08070a"; x.beginPath(); x.moveTo(0, H * .62); x.lineTo(W, H * .62); x.lineTo(W, H * .7); x.quadraticCurveTo(W / 2, H * .66, 0, H * .7); x.fill(); x.beginPath(); x.moveTo(W * .2, H * .7); x.quadraticCurveTo(W / 2, H * .5, W * .8, H * .7); x.lineTo(W * .8, H * .82); x.quadraticCurveTo(W / 2, H * .62, W * .2, H * .82); x.fill(); for (let i = 0; i < 3; i++) { glow(x, W * (.35 + i * .15), H * .6, 14, "rgba(246,170,80,.9)"); } },
  towers(x, W, H, R) { let cx = -10; while (cx < W) { const w = 14 + R() * 26, h = H * (.25 + R() * .4); x.fillStyle = "#0d0a12"; x.fillRect(cx, H - h, w, h); x.beginPath(); x.moveTo(cx - 2, H - h); x.lineTo(cx + w / 2, H - h - 14 - R() * 26); x.lineTo(cx + w + 2, H - h); x.fill(); for (let j = 0; j < 3; j++) if (R() > .45) { x.fillStyle = "#b48af0"; x.fillRect(cx + w * (.25 + R() * .5), H - h * (.2 + R() * .6), 3, 5); glow(x, cx + w / 2, H - h * .5, 14, "rgba(170,120,240,.5)", .5); } cx += w + 2 + R() * 6; } },
  towers2(x, W, H, R) { ridge(x, W, H, H * .92, H * .02, "#060509", R); },
  bigtower(x, W, H) { const cx = W / 2; x.fillStyle = "#08060b"; x.beginPath(); x.moveTo(cx - 26, H); x.lineTo(cx - 14, H * .22); x.lineTo(cx + 14, H * .22); x.lineTo(cx + 26, H); x.fill(); glow(x, cx, H * .17, 60, "rgba(180,130,250,.9)", .9); x.strokeStyle = "#3a2e48"; x.lineWidth = 2; x.strokeRect(cx - 16, H * .08, 32, H * .14); x.fillStyle = "#c9a7ff"; x.beginPath(); x.moveTo(cx - 8, H * .22); x.quadraticCurveTo(cx, H * .06, cx + 8, H * .22); x.fill(); },
  bell(x, W, H) { const cx = W * .5; x.fillStyle = "#08060b"; x.fillRect(cx - 30, H * .3, 60, H * .7); x.beginPath(); x.moveTo(cx - 36, H * .3); x.lineTo(cx, H * .12); x.lineTo(cx + 36, H * .3); x.fill(); x.fillStyle = "#1c1722"; x.fillRect(cx - 18, H * .36, 36, 30); x.fillStyle = "#6b5640"; x.beginPath(); x.moveTo(cx - 10, H * .36 + 26); x.quadraticCurveTo(cx - 9, H * .36 + 6, cx, H * .36 + 6); x.quadraticCurveTo(cx + 9, H * .36 + 6, cx + 10, H * .36 + 26); x.fill(); },
  fort(x, W, H, R) { const by = H * .5; x.fillStyle = "#050406"; x.fillRect(W * .3, by, W * .4, H * .2); [.3, .42, .58, .7].forEach((p, i) => { const tw = 14, th = 30 + R() * 30; x.save(); x.translate(W * p, by); x.rotate((R() - .5) * .25); x.fillRect(-tw / 2, -th, tw, th + 4); x.beginPath(); x.moveTo(-tw / 2 - 2, -th); x.lineTo(0, -th - 16); x.lineTo(tw / 2 + 2, -th); x.fill(); x.restore(); }); for (let i = 0; i < 5; i++) { x.fillStyle = "#b48af0"; x.fillRect(W * (.33 + R() * .34), by + 6 + R() * 20, 3, 4); } },
  ash(x, W, H, R) { for (let i = 0; i < 140; i++) { x.fillStyle = `rgba(200,195,190,${.15 + R() * .4})`; x.fillRect(R() * W, R() * H, 1.5, 1.5); } },
  ruins(x, W, H, R) { [.08, .2, .8, .92].forEach(p => { const h = H * (.3 + R() * .4); x.fillStyle = "#0a080c"; x.fillRect(W * p - 9, H - h, 18, h); x.fillRect(W * p - 12, H - h, 24, 5); }); },
  altar(x, W, H) { x.fillStyle = "#0a080c"; x.fillRect(W / 2 - 50, H * .82, 100, H * .18); x.fillRect(W / 2 - 60, H * .8, 120, 6); glow(x, W / 2, H * .79, 40, "rgba(236,200,120,.6)", .6); },
  throneking(x, W, H) { const cx = W / 2, by = H; x.fillStyle = "#020102"; x.fillRect(cx - 34, by - 90, 68, 90); x.beginPath(); x.moveTo(cx - 34, by - 90); x.lineTo(cx - 24, by - 120); x.lineTo(cx - 10, by - 96); x.lineTo(cx, by - 130); x.lineTo(cx + 10, by - 96); x.lineTo(cx + 24, by - 120); x.lineTo(cx + 34, by - 90); x.fill(); glow(x, cx, by - 70, 12, "rgba(180,130,250,.9)"); },
  /* interiors */
  beams(x, W, H) { x.fillStyle = "#0e0907"; x.fillRect(0, H * .1, W, 10); x.fillRect(0, H * .5, W, 6); for (let i = 0; i < W; i += W / 4) x.fillRect(i, 0, 10, H); },
  hearth(x, W, H) { const cx = W * .18; x.fillStyle = "#0a0706"; x.fillRect(cx - 40, H * .45, 80, H * .55); x.fillStyle = "#1a0f09"; x.fillRect(cx - 26, H * .62, 52, H * .38); glow(x, cx, H * .85, 70, "rgba(245,140,60,.9)"); x.fillStyle = "#f08a3c"; x.beginPath(); x.moveTo(cx - 14, H * .95); x.quadraticCurveTo(cx, H * .7, cx + 14, H * .95); x.fill(); },
  tables(x, W, H, R) { for (let i = 0; i < 5; i++) { const tx = W * (.3 + i * .16), ty = H * (.8 + R() * .08); x.fillStyle = "#0c0806"; x.fillRect(tx - 24, ty, 48, 6); x.fillRect(tx - 20, ty, 4, 24); x.fillRect(tx + 16, ty, 4, 24); x.beginPath(); x.arc(tx - 14, ty - 12, 7, 0, 7); x.arc(tx + 14, ty - 10, 7, 0, 7); x.fill(); x.fillRect(tx - 20, ty - 6, 12, 8); x.fillRect(tx + 8, ty - 4, 12, 8); glow(x, tx, ty - 4, 10, "rgba(250,190,100,.8)"); } },
  smoke(x, W, H) { const g = x.createLinearGradient(0, 0, 0, H * .5); g.addColorStop(0, "rgba(150,140,130,.22)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H * .5); },
  arches(x, W, H) { const n = 5, w = W / n; x.strokeStyle = "rgba(0,0,0,.65)"; x.lineWidth = 10; for (let i = 0; i < n; i++) { const cx = i * w + w / 2; x.beginPath(); x.moveTo(cx - w * .38, H); x.lineTo(cx - w * .38, H * .4); x.quadraticCurveTo(cx - w * .38, H * .12, cx, H * .05); x.quadraticCurveTo(cx + w * .38, H * .12, cx + w * .38, H * .4); x.lineTo(cx + w * .38, H); x.stroke(); } },
  altarIn(x, W, H) { x.fillStyle = "#0b0a0e"; x.fillRect(W / 2 - 46, H * .7, 92, H * .3); x.fillStyle = "#c9a650"; x.beginPath(); x.arc(W / 2, H * .5, 24, 0, 7); x.fill(); x.fillStyle = "#060507"; x.fillRect(W / 2 - 28, H * .5 - 6, 56, 30); },
  candles(x, W, H, R) { for (let i = 0; i < 9; i++) { const cx = W * (.08 + R() * .84), cy = H * (.7 + R() * .22); x.fillStyle = "#d9cdb0"; x.fillRect(cx - 2, cy, 4, 12); glow(x, cx, cy - 3, 16, "rgba(250,200,110,.9)"); x.fillStyle = "#ffd98a"; x.beginPath(); x.ellipse(cx, cy - 3, 2, 4, 0, 0, 7); x.fill(); } },
  sarco(x, W, H) { x.fillStyle = "#0b0a0f"; x.fillRect(W / 2 - 60, H * .74, 120, H * .26); x.fillStyle = "#1d1b24"; x.fillRect(W / 2 - 64, H * .7, 128, 10); },
  shelves(x, W, H, R) { for (let row = 0; row < 6; row++) { const y = H * (.08 + row * .15); x.fillStyle = "#0e0a07"; x.fillRect(0, y + H * .12, W, 4); let cx = 0; while (cx < W) { const bw = 3 + R() * 6, bh = H * (.07 + R() * .045); x.fillStyle = ["#3b2a1c","#2d2230","#22303a","#4a2f20","#2a3324"][Math.floor(R() * 5)]; x.fillRect(cx, y + H * .12 - bh, bw, bh); cx += bw + 1; } } },
  chandelier(x, W, H) { glow(x, W / 2, H * .2, 90, "rgba(180,130,250,.8)", .7); x.strokeStyle = "#3b2e48"; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H * .15); x.stroke(); x.beginPath(); x.ellipse(W / 2, H * .2, 50, 10, 0, 0, 7); x.stroke(); for (let i = 0; i < 7; i++) { x.fillStyle = "#c9a7ff"; x.fillRect(W / 2 - 45 + i * 15, H * .16, 3, 6); } },
  dancers(x, W, H, R) { for (let i = 0; i < 7; i++) { const cx = W * (.1 + i * .135), by = H * (.95 + R() * .05), s = .8 + R() * .3; x.fillStyle = "#060408"; x.beginPath(); x.arc(cx, by - 70 * s, 8 * s, 0, 7); x.fill(); x.beginPath(); x.moveTo(cx - 8 * s, by - 60 * s); x.lineTo(cx + 8 * s, by - 60 * s); x.lineTo(cx + 18 * s, by); x.lineTo(cx - 18 * s, by); x.fill(); x.fillStyle = "#c9a650"; x.fillRect(cx - 6 * s, by - 72 * s, 12 * s, 3 * s); } },
  tunnel(x, W, H) { for (let i = 0; i < 4; i++) { const s = 1 - i * .2; x.strokeStyle = `rgba(0,0,0,${.7 - i * .12})`; x.lineWidth = 16 * s; x.beginPath(); x.arc(W / 2, H * .9, W * .45 * s, Math.PI, 0); x.stroke(); } },
  water(x, W, H, R) { const g = x.createLinearGradient(0, H * .72, 0, H); g.addColorStop(0, "rgba(40,80,90,.5)"); g.addColorStop(1, "rgba(10,20,25,.95)"); x.fillStyle = g; x.fillRect(0, H * .72, W, H * .28); x.strokeStyle = "rgba(160,220,210,.2)"; for (let i = 0; i < 24; i++) { const sx = R() * W, sy = H * (.74 + R() * .24); x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + 10 + R() * 30, sy); x.stroke(); } },
  mirrors(x, W, H, R) { for (let i = 0; i < 4; i++) { const cx = W * (.14 + i * .24); const g = x.createLinearGradient(cx - 26, 0, cx + 26, 0); g.addColorStop(0, "#1a1426"); g.addColorStop(.5, "#3e2f5a"); g.addColorStop(1, "#140f1d"); x.fillStyle = g; x.beginPath(); x.moveTo(cx - 26, H); x.lineTo(cx - 26, H * .25); x.quadraticCurveTo(cx, H * .05, cx + 26, H * .25); x.lineTo(cx + 26, H); x.fill(); x.fillStyle = "#050407"; x.beginPath(); x.arc(cx + (R() - .5) * 8, H * .55, 7, 0, 7); x.fill(); x.fillRect(cx - 8, H * .6, 16, H * .4); } },
  bars(x, W, H) { x.fillStyle = "#050404"; for (let i = 0; i < W; i += 22) x.fillRect(i, 0, 5, H); x.fillRect(0, H * .15, W, 6); x.fillRect(0, H * .85, W, 6); },
  chains(x, W, H) { x.strokeStyle = "#5a4c40"; x.lineWidth = 2; [.25, .5, .75].forEach(p => { for (let y = 0; y < H * .6; y += 9) { x.beginPath(); x.ellipse(W * p, y, 3, 5, 0, 0, 7); x.stroke(); } }); },
};
function paint(cv, key) {
  if (!cv) return; const b = BG[key] || BG.road;
  const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth || 360, H = cv.clientHeight || 200;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  let seed = hashStr(key); const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  if (b.wall) {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#050407"); g.addColorStop(.6, b.wall); g.addColorStop(1, "#060508"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    glow(x, W * b.gx, H * .7, W * .6, b.glow, .35);
  } else {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, b.sky[0]); g.addColorStop(1, b.sky[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (!b.gold) for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(235,225,204,${.1 + R() * .5})`; x.fillRect(R() * W, R() * H * .6, 1, 1); }
    if (b.sun) blackSun(x, W * b.sun[0], H * b.sun[1], Math.min(W, H * 1.6) * b.sun[2]);
    if (b.gold) { const [sx, sy, sr] = b.gold, r = Math.min(W, H * 1.6) * sr; glow(x, W * sx, H * sy, r * 4, "rgba(255,210,130,.9)", .9); x.fillStyle = "#ffe2a0"; x.beginPath(); x.arc(W * sx, H * sy, r, 0, 7); x.fill(); }
    if (b.pale) { const [sx, sy, sr] = b.pale, r = Math.min(W, H * 1.6) * sr; glow(x, W * sx, H * sy, r * 3, "rgba(240,225,215,.6)", .7); x.fillStyle = "#efe4da"; x.beginPath(); x.arc(W * sx, H * sy, r, 0, 7); x.fill(); }
  }
  b.L.forEach(l => LY[l] && LY[l](x, W, H, R, b));
  const v = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.6)"); x.fillStyle = v; x.fillRect(0, 0, W, H);
}

/* =================== TITLE =================== */
function langSeg() { return `<div class="seg" role="group" aria-label="${T_("lang")}">${["Italiano","English","Español"].map((n, i) => `<button data-lang="${i}" aria-pressed="${LG === i}">${n}</button>`).join("")}</div>`; }
function diffSeg(cur) { return `<div class="seg" role="group" aria-label="${T_("diff")}">${[0,1,2].map(i => `<button data-diff="${i}" aria-pressed="${cur === i}">${T_("d" + i)}</button>`).join("")}</div>`; }
function setLang(i) { LG = i; PREF.lang = i; if (S) S.lang = i; store(PREF_KEY, PREF); document.documentElement.lang = LANG_CODES[i]; }
function renderTitle() {
  showScreen("title"); closeModal(); const sv = load(SAVE_KEY);
  $("#title").innerHTML = `<canvas id="tcv" aria-hidden="true"></canvas>
  <div class="title-inner">
    <h1 class="logo">Dark Days<small style="margin:8px 0 0">CHRONICLES</small></h1>
    <p class="tag">${T_("tag")}</p>
    <div><div class="lbl" style="margin-bottom:6px">${T_("lang")}</div>${langSeg()}</div>
    <div><div class="lbl" style="margin-bottom:6px">${T_("diff")}</div>${diffSeg(PREF.diff)}</div>
    ${sv ? `<button class="btn primary" id="tCont">${T_("cont")} · ${esc(sv.party[0].name)}, ${T_("lvl")} ${sv.level}</button>` : ""}
    <button class="btn ${sv ? "" : "primary"}" id="tNew">${T_("newg")}</button>
    <p class="foot">${T_("foot")}</p>
  </div>`;
  paint($("#tcv"), "title");
  $("#title").querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { setLang(+b.dataset.lang); renderTitle(); });
  $("#title").querySelectorAll("[data-diff]").forEach(b => b.onclick = () => { PREF.diff = +b.dataset.diff; store(PREF_KEY, PREF); renderTitle(); });
  $("#tNew").onclick = () => { CR = freshCR(); renderCreate(); };
  if (sv) $("#tCont").onclick = () => { S = sv; if (S.lang != null) setLang(S.lang); goScene(S.scene, true); };
}

/* =================== CHARACTER CREATION =================== */
const PB_COST = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
let CR = null;
function freshCR() { return {step: 0, name: "", race: "human", cls: "fighter", bg: "soldier", base: {...CLASSES.fighter.rec}}; }
const pbLeft = () => 27 - AB.reduce((s, k) => s + PB_COST[CR.base[k]], 0);
const finalAb = () => { const r = RACES[CR.race].bonus, o = {}; AB.forEach(k => o[k] = CR.base[k] + (r[k] || 0)); return o; };
function crChar() { const skills = [...CLASSES[CR.cls].skills, ...BGS[CR.bg].skills]; if (RACES[CR.race].skill) skills.push(RACES[CR.race].skill); return newChar({id: "pc", name: CR.name.trim() || defaultName(), race: CR.race, cls: CR.cls, bg: CR.bg, ab: finalAb(), skills}); }
function defaultName() { return ["Aren","Selva","Tamsin","Corvo","Ysolde","Dario"][hashStr(CR.race + CR.cls) % 6]; }
function optCards(obj, curKey, attr, iconFn) {
  return `<div class="opts">${Object.keys(obj).map(k => `<button class="opt" data-${attr}="${k}" aria-pressed="${curKey === k}"><span class="oi">${icon(iconFn(k))}</span><span style="min-width:0"><b>${tr(obj[k].n)}</b><span>${tr(obj[k].d)}</span></span></button>`).join("")}</div>`;
}
function renderCreate() {
  showScreen("create"); const st = CR.step;
  const titles = [T_("race"), T_("cls"), T_("bgr"), T_("abil"), T_("summary")];
  let body = "";
  if (st === 0) body = `<label class="lbl" for="pcName">${T_("name")}</label><input id="pcName" class="namein" maxlength="20" autocomplete="off" placeholder="${T_("namePh")}" value="${esc(CR.name)}">
    <div class="lbl" style="margin-bottom:8px">${T_("race")}</div>${optCards(RACES, CR.race, "race", () => "hand")}`;
  if (st === 1) body = optCards(CLASSES, CR.cls, "cls", k => CLASSES[k].icon);
  if (st === 2) body = optCards(BGS, CR.bg, "bg", () => "leaf");
  if (st === 3) { const fa = finalAb(), rb = RACES[CR.race].bonus;
    body = `<p style="font-size:15px;color:var(--muted);margin:0 0 10px">${T_("pbHelp")}</p>
    <div class="pts"><span>${T_("pts")}: <strong>${pbLeft()}</strong></span><button class="btn small" id="pbRec" style="width:auto">${T_("rec")}</button></div>
    <div class="pb">${AB.map(k => `<div class="pbrow"><b>${abS(k)}<small>${abL(k)}${rb[k] ? ` · +${rb[k]}` : ""}</small></b><button data-dn="${k}" aria-label="−">−</button><span class="v">${CR.base[k]}</span><button data-up="${k}" aria-label="+">+</button><span class="f">${fa[k]} (${sgn(mod(fa[k]))})</span></div>`).join("")}</div>`; }
  if (st === 4) { const c = crChar(); body = sheetHTML(c, true); }
  $("#create").innerHTML = `<div class="top"><h1>${T_("cc")}</h1><div class="steps">${titles.map((t, i) => `<i class="${i <= st ? "on" : ""}"></i>`).join("")}</div><div class="lbl" style="margin-top:6px">${st + 1}/5 · ${titles[st]}</div></div>
    <div class="scroll" id="crScroll">${body}</div>
    <div class="navbar"><button class="btn small" id="crBack">${T_("back")}</button><button class="btn small primary" id="crNext">${st === 4 ? T_("begin") : T_("next")}</button></div>`;
  const R = $("#create");
  R.querySelectorAll("[data-race]").forEach(b => b.onclick = () => { CR.race = b.dataset.race; renderCreate(); });
  R.querySelectorAll("[data-cls]").forEach(b => b.onclick = () => { CR.cls = b.dataset.cls; CR.base = {...CLASSES[CR.cls].rec}; renderCreate(); });
  R.querySelectorAll("[data-bg]").forEach(b => b.onclick = () => { CR.bg = b.dataset.bg; renderCreate(); });
  R.querySelectorAll("[data-up]").forEach(b => b.onclick = () => { const k = b.dataset.up, v = CR.base[k]; if (v < 15 && PB_COST[v + 1] - PB_COST[v] <= pbLeft()) { CR.base[k]++; renderCreate(); } });
  R.querySelectorAll("[data-dn]").forEach(b => b.onclick = () => { const k = b.dataset.dn; if (CR.base[k] > 8) { CR.base[k]--; renderCreate(); } });
  const rec = $("#pbRec"); if (rec) rec.onclick = () => { CR.base = {...CLASSES[CR.cls].rec}; renderCreate(); };
  const nm = $("#pcName"); if (nm) nm.oninput = () => { CR.name = nm.value; };
  $("#crBack").onclick = () => { if (CR.step === 0) renderTitle(); else { CR.step--; renderCreate(); } };
  $("#crNext").onclick = () => { if (CR.step < 4) { CR.step++; renderCreate(); $("#crScroll").scrollTop = 0; } else startGame(); };
}
function startGame() {
  const c = crChar();
  const ch = CHAPTERS[0];
  S = {v: 2, lang: LG, diff: PREF.diff, chapter: ch.id, scene: ch.start, flags: {}, seen: {}, gold: 10 + BGS[CR.bg].gold, xp: 0, level: 1, inv: {potion: 2}, party: [c], dark: 0};
  goScene(ch.start);
}

/* =================== SHEETS =================== */
function sheetHTML(c, creation) {
  const feats = featsOf(c).filter(f => f !== "asi"), sp = spellsOf(c), sm = slotsMax(c);
  const sk = Object.keys(SKILLS).filter(k => c.skills.includes(k));
  return `<div class="hero">${medHTML(CL(c).icon, "big on")}<div><b>${esc(c.name)}</b><span>${tr(RACES[c.race].n)} · ${tr(CL(c).n)} · ${T_("lvl")} ${c.lvl}${c.bg ? " · " + tr(BGS[c.bg].n) : ""}</span></div></div>
  <div class="sumgrid"><div class="stat"><b>${creation ? c.maxhp : c.hp + "/" + c.maxhp}</b><span>${T_("hp")}</span></div><div class="stat"><b>${acOf(c)}</b><span>${T_("ac")}</span></div><div class="stat"><b>${speedOf(c)}</b><span>${T_("spd")}</span></div></div>
  <div class="abgrid">${AB.map(k => `<div><span>${abS(k)}</span><b${abEff(c, k) !== c.ab[k] ? ' style="color:var(--frost)"' : ""}>${abEff(c, k)}</b><small>${sgn(abm(c, k))}</small></div>`).join("")}</div>
  <h3>${T_("weapons")}</h3><div class="taglist">${weaponsOf(c).map(w => { const p = weapProfile(c, w); return `<span>${p.name} ${sgn(p.hit)} · ${p.dice}${sgn(p.flat)}</span>`; }).join("")}</div>
  <h3>${T_("saves")}</h3><div class="taglist">${AB.map(k => `<span>${abS(k)} ${sgn(saveBonus(c, k))}</span>`).join("")}</div>
  <h3>${T_("skills")} · ${T_("prof")} +${prof(c)}</h3><div class="taglist">${sk.map(k => `<span>${tr(SKILLS[k][0])} ${sgn(skillBonus(c, k))}</span>`).join("")}</div>
  ${feats.length || (c.feats || []).length ? `<h3>${T_("feats")}</h3><div class="taglist">${feats.map(f => `<span>${tr(FEATS[f])}</span>`).join("")}${(c.feats || []).map(f => `<span class="ft">${tr(FEATLIST[f].n)}</span>`).join("")}</div>` : ""}
  ${sp.length ? `<h3>${T_("spells")}${sm.some(Boolean) ? ` · ${T_("slotsL")} ${sm.map((n, i) => n ? `${i + 1}°: ${creation ? n : c.slots[i]}/${n}` : "").filter(Boolean).join(" · ")}` : ""}</h3><div class="taglist">${sp.map(k => `<span>${tr(SPELLS[k].n)}</span>`).join("")}</div>` : ""}
  ${!creation && (c.wplus || c.aplus || c.trinket) ? `<h3>${tr(["Equipaggiamento","Equipment","Equipo"])}</h3><div class="taglist">${c.wplus ? `<span>${T_("bonusW")} +${c.wplus}</span>` : ""}${c.aplus ? `<span>${T_("bonusA")} +${c.aplus}</span>` : ""}${c.trinket ? `<span class="tk">${tr(ITEMS[c.trinket].n)}</span>` : ""}</div>` : ""}
  ${!creation ? `<h3>${tr(["Dadi vita","Hit dice","Dados de golpe"])}</h3><p style="font-size:14px;color:var(--muted);margin:0">${c.hdLeft ?? c.lvl}/${c.lvl} d${CL(c).hd}</p>` : ""}`;
}

/* =================== STORY RUNNER =================== */
function visibleChoices(sc) { return (sc.ch || []).filter(ch => !ch.req || ch.req()); }
function goScene(id, noOnce) {
  if (typeof id === "function") id = id();
  if (!S.chapter) S.chapter = "ch1";
  // a finished chapter waits here; once an update adds the next chapter, continue straight into it
  if (id === "ch_wait") { const nx = nextChapter(S.chapter); if (nx) { S.chapter = nx.id; id = nx.start; } }
  MAXLV = chapterOf(S).maxLevel || MAXLV;
  const sc = SC[id]; if (!sc) { console.error("missing scene", id); return; }
  S.scene = id;
  if (!S.seen[id] && !noOnce) { S.seen[id] = 1; sc.once && sc.once(); }
  S.seen[id] = 1;
  if (!noOnce && sc.enter) sc.enter();
  if (!id.startsWith("end_")) saveGame(true);
  renderStory(); const sc2 = $("#storyScroll"); if (sc2) sc2.scrollTop = 0;
}
function chipsHTML() { return S.party.map(c => { const p = c.hp / c.maxhp; return `<div class="chip"><span class="pt">${icon(CL(c).icon)}</span><span>${esc(c.name.split(" ")[0])}<div class="bar"><i class="${p < .35 ? "lo" : ""}" style="width:${Math.max(0, p * 100)}%"></i></div></span></div>`; }).join(""); }
function isCard(p) { return p.length < 70 && p === p.toUpperCase() && /[A-ZÀ-Ý]/.test(p); }
function choiceTag(ch) {
  if (ch.check) { const c = ch.check; const lab = c.save ? `${tr(["TS","Save","Salv."])} ${abS(c.save)}` : tr(SKILLS[c.sk][0]); return ` <span class="tg">${lab} · ${T_("dc")} ${c.dc}${c.adv && c.adv() ? " · " + T_("adv") : ""}</span>`; }
  if (ch.fight) return ` <span class="tg f">${tr(["Combattimento","Combat","Combate"])}</span>`;
  if (ch.cost) return ` <span class="tg c">${ch.cost} ${T_("gp")}</span>`;
  if (ch.shop) return ` <span class="tg c">${T_("shop")}</span>`;
  return "";
}
function renderStory() {
  showScreen("story"); const sc = SC[S.scene];
  const text = tr(typeof sc.t === "function" ? sc.t() : sc.t).replace(/\{n\}/g, pc().name);
  const paras = text.split("\n\n").map(p => `<p${isCard(p) || /^(ATTO|ACT|ACTO) [IV]+ —/.test(p) ? ' class="act-card"' : ""}>${esc(p)}</p>`).join("");
  const chs = visibleChoices(sc);
  $("#story").innerHTML = `<div class="hud"><div class="chips">${chipsHTML()}</div><span class="gold">${S.gold} ${T_("gp")}</span><button class="iconbtn" id="menuBtn" aria-label="${T_("menu")}">${icon("menu")}</button></div>
    <div class="art"><canvas id="artcv" aria-hidden="true"></canvas><div class="loc">${esc(tr(sc.loc || ""))}</div></div>
    <div class="scroll" id="storyScroll"><div class="prose">${paras}</div><div class="choices">${chs.map((ch, i) => `<button class="choice" data-ch="${i}" ${ch.cost && S.gold < ch.cost ? "disabled" : ""}><span class="n">${i + 1}.</span><span>${esc(tr(ch.t))}${choiceTag(ch)}</span></button>`).join("")}</div></div>`;
  paint($("#artcv"), sc.bg);
  $("#menuBtn").onclick = () => openMenu("party");
  $("#story").querySelectorAll("[data-ch]").forEach(b => b.onclick = () => choose(+b.dataset.ch));
  if (S.pendingLv && S.pendingLv.length) showLevelUp();
}
async function choose(i) {
  if (BUSY) return; const ch = visibleChoices(SC[S.scene])[i]; if (!ch) return;
  if (ch.end) { endGame(); return; }
  if (ch.toTitle) { saveGame(true); renderTitle(); return; }
  if (ch.cost) { if (S.gold < ch.cost) { toast(T_("noGold")); return; } S.gold -= ch.cost; }
  if (ch.fx) ch.fx();
  if (ch.rest) { longRest(); toastQ(UI.rested); }
  if (ch.shop) { renderStory(); openShop(ch.shop); return; }
  if (ch.check) { BUSY = true; const ok = await doCheck(ch.check); BUSY = false; goScene(ok ? ch.check.ok : ch.check.ko); return; }
  if (ch.fight) { const k = typeof ch.fight === "function" ? ch.fight() : ch.fight; startCombat(k, ch.win, !!ch.surprise); return; }
  if (ch.go) goScene(ch.go); else { saveGame(true); renderStory(); }
}
function d20For(c) { let r = rnd(20); if (r === 1 && c.race === "halfling") r = rnd(20); return r; }
function doCheck(spec) {
  return new Promise(res => {
    let who, bonus, label;
    if (spec.save) { who = pc(); bonus = saveBonus(who, spec.save); label = `${abL(spec.save)} (${tr(["tiro salvezza","saving throw","salvación"])})`; }
    else { const sk = spec.sk; if (spec.pc || SOCIAL.includes(sk)) who = pc(); else who = S.party.reduce((a, c) => skillBonus(c, sk) > skillBonus(a, sk) ? c : a, pc()); bonus = skillBonus(who, sk); label = tr(SKILLS[sk][0]); }
    const auto = spec.auto && spec.auto(), adv = spec.adv && spec.adv();
    const a = d20For(who), b = adv ? d20For(who) : null, r = adv ? Math.max(a, b) : a, tot = r + bonus;
    const ok = auto || r === 20 || (r !== 1 && tot >= spec.dc);
    const math = auto ? tr(["Sai già come fare.","You already know how.","Ya sabes cómo hacerlo."]) : `${esc(who.name)} ${T_("rollFor")}: ${adv ? `${a} / ${b} (${T_("adv")}) → ` : ""}${r} ${sgn(bonus)} = <b>${tot}</b> · ${T_("dc")} ${spec.dc}`;
    const m = modal(`<div class="dice"><div class="lbl">${esc(label)}</div><div class="d20 roll" id="d20v">${auto ? "✓" : "?"}</div><div class="math">${math}</div><div class="res ${ok ? "ok" : "ko"}" id="dres" style="visibility:hidden">${ok ? T_("success") : T_("failure")}${!auto && r === 20 ? " · " + tr(["Venti naturale!","Natural 20!","¡Veinte natural!"]) : !auto && r === 1 ? " · " + tr(["Uno naturale","Natural 1","Uno natural"]) : ""}</div><button class="btn primary" id="dgo" style="visibility:hidden">${T_("goOn")}</button></div>`, {center: 1, locked: 1});
    let n = 0; const iv = auto ? null : setInterval(() => { $("#d20v").textContent = rnd(20); if (++n > 9) { clearInterval(iv); $("#d20v").textContent = r; } }, 60);
    setTimeout(() => { if (iv) clearInterval(iv); if (!auto) $("#d20v").textContent = r; $("#dres").style.visibility = "visible"; $("#dgo").style.visibility = "visible"; $("#dgo").focus(); }, auto ? 200 : 720);
    m.querySelector("#dgo").onclick = () => { closeModal(); res(ok); };
  });
}
function endGame() {
  // end of a chapter: remember the ending, carry the party over and offer the next chapter
  const ch = chapterOf(S), ending = S.scene, nx = nextChapter(ch.id);
  S.chaptersDone = S.chaptersDone || {}; S.chaptersDone[ch.id] = ending;
  longRest();
  S.scene = "ch_wait"; if (nx) { S.chapter = nx.id; S.scene = nx.start; }
  S.savedAt = Date.now(); store(SAVE_KEY, S); store("ddc-chapter-" + ch.id, S);
  const endName = ch.endings && ch.endings[ending] ? tr(ch.endings[ending]) : "";
  const m = modal(`<div class="endcard win"><div class="seal">${icon("sun")}</div><p class="lbl">${tr(ch.num)}</p><h2>${tr(["Capitolo completato","Chapter complete","Capítulo completado"])}</h2>
    <p>${esc(tr(ch.title))}${endName ? ` · ${tr(["finale","ending","final"])}: <b>${esc(endName)}</b>` : ""}</p>
    <p style="font-size:14px;color:var(--muted)">${nx ? tr(["Il tuo gruppo, gli oggetti e le tue scelte passano al capitolo successivo.","Your party, items and choices carry over to the next chapter.","Tu grupo, tus objetos y tus decisiones pasan al siguiente capítulo."]) : tr(["La partita è salvata. Quando un aggiornamento porterà il prossimo capitolo, potrai continuarla con gli stessi personaggi da «Continua» o da «Capitoli».","Your game is saved. When an update brings the next chapter, you can continue it with the same characters from “Continue” or “Chapters”.","La partida está guardada. Cuando una actualización traiga el próximo capítulo, podrás continuarla con los mismos personajes desde «Continuar» o «Capítulos»."])}</p>
    <div style="display:grid;gap:8px">${nx ? `<button class="btn primary" id="chNext">${esc(chapterName(nx))}</button>` : ""}<button class="btn ${nx ? "small" : "primary"}" id="chTitle">${T_("toTitle")}</button></div></div>`, {center: 1, locked: 1});
  const n = m.querySelector("#chNext"); if (n) n.onclick = () => { closeModal(); goScene(S.scene); };
  m.querySelector("#chTitle").onclick = () => { closeModal(); toastQ(T_("credits")); renderTitle(); };
}

/* =================== MENU =================== */
let menuMember = 0;
function openMenu(tab) {
  const tabs = [["party", T_("party")], ["inv", T_("inv")], ["journal", T_("journal")], ["opts", T_("settings")]];
  let body = "";
  if (tab === "party") { const c = S.party[Math.min(menuMember, S.party.length - 1)]; body = `<div class="who" style="margin:0 0 10px">${S.party.map((p, i) => `<button data-mm="${i}" aria-pressed="${p === c}" style="${p === c ? "border-color:var(--brass);color:var(--brass)" : ""}">${esc(p.name.split(" ")[0])}</button>`).join("")}</div>${sheetHTML(c)}
    <h3>${T_("xp")}</h3><p style="font-variant-numeric:tabular-nums">${S.xp} ${S.level < MAXLV ? `/ ${XPT[S.level + 1]} · ${T_("nextLv")}` : ""}</p>
    ${SCREEN === "story" ? `<h3>${tr(["Riposo breve","Short rest","Descanso corto"])} · ${2 - (S.shortRests || 0)}/2</h3><p style="font-size:14px;color:var(--muted);margin:0 0 8px">${tr(["Un'ora di sosta: ogni personaggio spende dadi vita per curarsi e recupera Recupero, Impeto d'azione e Incanalare divinità. Il mago recupera alcuni slot. Si ricarica con il riposo lungo.","An hour's rest: each character spends hit dice to heal and regains Second Wind, Action Surge and Channel Divinity. The wizard recovers some slots. Recharges on a long rest.","Una hora de descanso: cada personaje gasta dados de golpe para curarse y recupera Nuevas energías, Oleada de acción y Canalizar divinidad. El mago recupera algunos espacios. Se recarga con un descanso largo."])}</p><button class="btn small" id="shortR" ${(S.shortRests || 0) >= 2 ? "disabled" : ""}>${tr(["Riposa un'ora","Rest for an hour","Descansar una hora"])}</button>` : ""}`; }
  if (tab === "inv") body = invHTML();
  if (tab === "journal") body = journalHTML();
  if (tab === "opts") body = `<h3>${T_("lang")}</h3>${langSeg()}<h3>${T_("diff")}</h3>${diffSeg(S.diff)}<h3>${tr(["Velocità combattimento","Combat speed","Velocidad de combate"])}</h3><div class="seg"><button data-fast="0" aria-pressed="${!PREF.fast}">${tr(["Normale","Normal","Normal"])}</button><button data-fast="1" aria-pressed="${!!PREF.fast}">${tr(["Veloce","Fast","Rápida"])}</button></div>${audioOptsHTML()}<div style="display:grid;gap:8px;margin-top:8px"><button class="btn small" id="oSave">${T_("save")}</button><button class="btn small" id="oTitle">${T_("toTitle")}</button></div><p style="font-size:14px;color:var(--muted);margin-top:14px">${T_("install")}</p>`;
  const m = modal(`<div class="tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" aria-pressed="${k === tab}">${n}</button>`).join("")}</div>${body}<button class="btn small" id="mClose" style="margin-top:14px">${T_("close")}</button>`);
  m.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => openMenu(b.dataset.tab));
  m.querySelectorAll("[data-mm]").forEach(b => b.onclick = () => { menuMember = +b.dataset.mm; openMenu("party"); });
  m.querySelector("#mClose").onclick = () => { closeModal(); if (SCREEN === "story") renderStory(); };
  m.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { setLang(+b.dataset.lang); saveGame(true); if (SCREEN === "story") renderStory(); openMenu("opts"); });
  m.querySelectorAll("[data-diff]").forEach(b => b.onclick = () => { S.diff = +b.dataset.diff; saveGame(true); openMenu("opts"); });
  const os = m.querySelector("#oSave"); if (os) os.onclick = () => saveGame(false);
  const ot = m.querySelector("#oTitle"); if (ot) ot.onclick = () => { saveGame(true); renderTitle(); };
  bindInv(m); bindAudioOpts(m);
  m.querySelectorAll("[data-fast]").forEach(b => b.onclick = () => { PREF.fast = b.dataset.fast === "1"; store(PREF_KEY, PREF); openMenu("opts"); });
  const sr = m.querySelector("#shortR"); if (sr) sr.onclick = () => { if (shortRest()) { toastQ(tr(["Il gruppo riposa un'ora.","The party rests for an hour.","El grupo descansa una hora."])); saveGame(true); } openMenu("party"); };
}
function invHTML() {
  const keys = Object.keys(S.inv).filter(k => S.inv[k] > 0);
  if (!keys.length) return `<p style="color:var(--muted)">${T_("empty")}</p>`;
  return keys.map(k => { const it = ITEMS[k]; const act = it.use === "heal" ? T_("use") : it.use === "equip" ? T_("equip") : "";
    const cur = c => it.use === "heal" ? ` ${c.hp}/${c.maxhp}` : it.slot === "w" ? ` +${c.wplus}` : it.slot === "t" ? (c.trinket ? " ⇄" : "") : ` +${c.aplus}`;
    return `<div class="row"><div class="t"><b>${tr(it.n)}</b>${S.inv[k] > 1 ? ` ×${S.inv[k]}` : ""}<small>${tr(it.d)}</small><div class="who" data-whofor="${k}" hidden>${S.party.map((c, i) => `<button data-use="${k}" data-on="${i}">${esc(c.name.split(" ")[0])}${cur(c)}</button>`).join("")}</div></div>${act ? `<button class="btn small" data-pick="${k}">${act}</button>` : ""}</div>`; }).join("");
}
function bindInv(m) {
  m.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { const w = m.querySelector(`[data-whofor="${b.dataset.pick}"]`); w.hidden = !w.hidden; });
  m.querySelectorAll("[data-use]").forEach(b => b.onclick = () => {
    const k = b.dataset.use, c = S.party[+b.dataset.on], it = ITEMS[k];
    if (it.use === "heal") { if (c.hp >= c.maxhp) return; c.hp = Math.min(c.maxhp, c.hp + roll(it.dice).total); take(k); }
    else if (it.use === "equip") { if (it.slot === "w") { if (c.wplus >= it.v) return; c.wplus = it.v; take(k); } else if (it.slot === "t") { take(k); if (c.trinket) S.inv[c.trinket] = (S.inv[c.trinket] || 0) + 1; c.trinket = k; const hp0 = c.hp; recalc(c); c.slots = c.slots.map((v, i) => Math.min(v + (slotsMax(c)[i] > v ? 0 : 0), slotsMax(c)[i])); c.hp = Math.min(c.maxhp, Math.max(hp0, c.hp)); } else { if (c.aplus >= 2) return; c.aplus += it.v; take(k); } }
    saveGame(true); openMenu("inv");
  });
}
const QUESTS = [
  {s: () => true, d: "game_done", n:["Il Sole Nero","The Black Sun","El Sol Negro"], t: () => !has("act1_done") ? ["Scopri perché porti il Marchio dell'Eclisse. Ad Ashford, Madre Seraphine potrebbe sapere qualcosa.","Find out why you bear the Eclipse Brand. In Ashford, Mother Seraphine may know something.","Descubre por qué llevas la Marca del Eclipse. En Ashford, la Madre Seraphine podría saber algo."] : !has("act2_done") ? ["Raggiungi Vesperia e trova la Chiave dell'Alba nel Grande Archivio.","Reach Vesperia and find the Key of Dawn in the Great Archive.","Llega a Vesperia y encuentra la Llave del Alba en el Gran Archivo."] : ["Sali alla Corona di Cenere, libera i sei marchiati e ferma la Madre della Notte prima dell'Ultimo Buio.","Climb to the Crown of Ash, free the six marked and stop the Mother of Night before the Last Dark.","Sube a la Corona de Ceniza, libera a los seis marcados y detén a la Madre de la Noche antes de la Última Oscuridad."]},
  {s: "q_children", d: "children_saved", n:["I figli di Liesel","Liesel's children","Los hijos de Liesel"], t: ["Tam e Wren sono stati portati nel Bosco Cavo dai «pallidi».","Tam and Wren were taken into the Hollow Woods by the “pale ones”.","Tam y Wren fueron llevados al Bosque Hueco por los «pálidos»."]},
  {s: "q_oil", d: "oil_paid", n:["L'olio di Ashford","Ashford's oil","El aceite de Ashford"], t: () => has("oil_done") ? ["L'olio è recuperato. Riferisci a Odo, alla taverna.","The oil is recovered. Report to Odo at the tavern.","El aceite está recuperado. Informa a Odo en la taberna."] : ["Qualcuno ruba l'olio dal vecchio mulino. Odo paga quaranta monete.","Someone is stealing oil from the old mill. Odo pays forty coins.","Alguien roba el aceite del viejo molino. Odo paga cuarenta monedas."]},
  {s: "q_cem", d: "cem_paid", n:["I morti inquieti","The restless dead","Los muertos inquietos"], t: () => has("cem_done") ? ["Il cimitero è tranquillo. Riferisci a Madre Seraphine.","The cemetery is quiet. Report to Mother Seraphine.","El cementerio está en calma. Informa a la Madre Seraphine."] : ["Le tombe del cimitero si aprono dall'interno. Indaga nella cripta dei Custodi.","The cemetery graves are opening from within. Investigate the Sunwardens' crypt.","Las tumbas del cementerio se abren desde dentro. Investiga la cripta de los Custodios."]},
  {s: "q_doran_hint", d: "doran_done", n:["Il fratello di Kael","Kael's brother","El hermano de Kael"], t: ["Doran Varn, fratello di Kael, serve la Corona Cava. Forse a Vesperia qualcuno sa dove trovarlo.","Doran Varn, Kael's brother, serves the Hollow Crown. Perhaps someone in Vesperia knows where to find him.","Doran Varn, hermano de Kael, sirve a la Corona Hueca. Quizá alguien en Vesperia sepa dónde encontrarlo."]},
  {s: "q_key", d: "has_key", n:["La Chiave dell'Alba","The Key of Dawn","La Llave del Alba"], t: ["Raggiungi l'Archivio Sommerso attraverso le fogne della Città Bassa. Forse Ilyra è ancora viva.","Reach the Drowned Archive through the Lower City sewers. Perhaps Ilyra is still alive.","Llega al Archivo Sumergido por las cloacas de la Ciudad Baja. Quizá Ilyra siga viva."]},
  {s: "q_tower", d: "tower_done", n:["La fiamma madre","The mother flame","La llama madre"], t: ["Spegni la fiamma viola in cima alla Torre della Lanterna per Silk.","Put out the violet flame atop the Lantern Tower for Silk.","Apaga la llama violeta en lo alto de la Torre de la Linterna para Silk."]},
  {s: "vault_known", d: "vault_done", n:["Le Volte di Aurel","The Vaults of Aurel","Las Bóvedas de Aurel"], t: ["Sotto la cappella dell'Archivio di Vesperia riposano le armi dei Custodi del Sole. Il sigillo si è incrinato.","Beneath the Vesperia Archive chapel rest the Sunwardens' weapons. The seal has cracked.","Bajo la capilla del Archivo de Vesperia descansan las armas de los Custodios del Sol. El sello se ha agrietado."]},
  {s: "invite", d: "masq_done", n:["Il ballo in maschera","The masquerade","El baile de máscaras"], t: ["Il Duca Malvern custodisce un registro dei suoi patti con il buio.","Duke Malvern keeps a ledger of his pacts with the dark.","El Duque Malvern guarda un registro de sus pactos con la oscuridad."]},
];
function journalHTML() {
  const qs = QUESTS.filter(q => typeof q.s === "function" ? q.s() : has(q.s));
  if (!qs.length) return `<p>${T_("noQuests")}</p>`;
  qs.sort((a, b) => has(a.d) - has(b.d));
  return qs.map(q => { const done = has(q.d); return `<div class="qst ${done ? "done" : ""}"><b>${tr(q.n)}</b><small>${done ? T_("done") : T_("active")}</small><p>${tr(typeof q.t === "function" ? q.t() : q.t)}</p></div>`; }).join("");
}
function openShop(id) {
  const sh = SHOPS[id], disc = id === "vesperia" && has("pia") ? .8 : 1;
  const m = modal(`<h2>${tr(sh.n)}</h2><p style="color:var(--muted)">${T_("youHave")}: <b style="color:var(--brass)">${S.gold} ${T_("gp")}</b></p>
    ${sh.items.map(k => { const it = ITEMS[k], p = Math.round(it.price * disc); return `<div class="row"><div class="t"><b>${tr(it.n)}</b>${S.inv[k] ? ` <small style="display:inline">(${S.inv[k]})</small>` : ""}<small>${tr(it.d)}</small></div><button class="btn small" data-buy="${k}" data-p="${p}" ${S.gold < p ? "disabled" : ""}>${p} ${T_("gp")}</button></div>`; }).join("")}
    <button class="btn small" id="shClose" style="margin-top:12px">${T_("close")}</button>`);
  m.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => { const p = +b.dataset.p; if (S.gold < p) return; S.gold -= p; S.inv[b.dataset.buy] = (S.inv[b.dataset.buy] || 0) + 1; saveGame(true); openShop(id); });
  m.querySelector("#shClose").onclick = () => { closeModal(); renderStory(); };
}
function showLevelUp() {
  const L = S.pendingLv[0], p = pc();
  const needAsi = asiLevels(p).includes(L) && !(p.asiDone || []).includes(L);
  const lines = S.party.map(c => { const nf = ((CLASS_FEATS[c.cls] || {})[L] || []).filter(f => f !== "asi").map(f => tr(FEATS[f])); const ns = ((CL(c).spells || {})[L] || []).map(k => tr(SPELLS[k].n));
    return `<div class="row"><div class="t"><b>${esc(c.name)}</b> · ${T_("hp")} ${c.maxhp}<small>${[...nf, ...ns].join(", ") || "—"}</small></div></div>`; }).join("");
  const featOpts = Object.keys(FEATLIST).filter(f => !hasFeat(p, f));
  const m = modal(`<h2>${T_("levelUp")} ${T_("lvl")} ${L}</h2>${lines}${needAsi ? `<h3>${T_("asi")}</h3><div class="abgrid">${AB.map(k => `<button data-asi="${k}" style="background:var(--stone);border-radius:6px;padding:6px 2px"><span class="lbl" style="font-size:10px">${abS(k)}</span><b style="display:block;font-family:var(--f-display);font-size:18px">${p.ab[k]}</b></button>`).join("")}</div>
    <h3>${tr(["…oppure scegli un talento","…or choose a feat","…o elige una dote"])}</h3><div class="opts">${featOpts.map(f => `<button class="opt" data-feat="${f}">${medHTML(FEATLIST[f].ic)}<span style="min-width:0"><b>${tr(FEATLIST[f].n)}</b><span>${tr(FEATLIST[f].d)}</span></span></button>`).join("")}</div>` : `<button class="btn primary" id="lvOk" style="margin-top:12px">${T_("goOn")}</button>`}`, {center: 1, locked: 1});
  m.querySelectorAll("[data-feat]").forEach(b => b.onclick = () => { (p.feats = p.feats || []).push(b.dataset.feat); (p.asiDone = p.asiDone || []).push(L); recalc(p); done(); });
  const done = () => { S.pendingLv.shift(); closeModal(); saveGame(true); if (S.pendingLv.length) showLevelUp(); else if (SCREEN === "story") renderStory(); };
  m.querySelectorAll("[data-asi]").forEach(b => b.onclick = () => { const k = b.dataset.asi; p.ab[k] = Math.min(20, p.ab[k] + 2); (p.asiDone = p.asiDone || []).push(L); recalc(p); done(); });
  const ok = m.querySelector("#lvOk"); if (ok) ok.onclick = done;
}
