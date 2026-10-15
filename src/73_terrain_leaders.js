/* =================== TERRAIN, LINE OF SIGHT, FIRE, LEADERS, ACTION ZONES =================== */
// Terrain types, per map:
//   high   altura: ranged attacks from it get +2 to hit and +2 range against lower targets; climbing costs +1 movement
//   brush  sterpaglia/paglia: difficult terrain, half cover against ranged attacks, burns
//   rubble / drift   macerie / neve alta: difficult terrain only
//   holy   cerchio sacro: heals the living at the start of their turn, burns the undead
//   ash    burnt brush: normal ground
// Tall obstacles (CB.tall) block line of sight; the others only give cover.
Object.assign(ICONS, {
  hill: '<path d="M2 20 9 8l4 6 3-4 6 10z"/><path d="M8.5 13.5l1.5 1.5M13 17l1.5-1.5"/>',
  brush: '<path d="M5 21c0-6 1-10 4-13M9 21c0-5 2-9 6-11M14 21c0-4 1-7 5-9M3 21h18"/>',
});
const TCFG = {
  road:    {tall: "boulder", nt: 2, hill: 2, rough: "brush", nr: 5},
  forest:  {tall: "deadtree", low: "stump", nt: 3, hill: 1, rough: "brush", nr: 7},
  mill:    {tall: "cratestack", nt: 2, hill: 1, rough: "brush", hay: 1, nr: 4},
  grave:   {tall: "pillar", nt: 2, hill: 1, rough: "brush", nr: 4, holy: 1},
  stones:  {tall: "menhir", low: "rock", nt: 3, hill: 1, rough: "brush", nr: 4, holy: 1},
  bridge:  {tall: "cratestack", nt: 2, hill: 1, rough: "rubble", nr: 3},
  tower:   {tall: "pillar", low: "crate", nt: 2, hill: 1, rough: "rubble", nr: 3},
  roof:    {tall: "chimney", low: "crate", nt: 2, hill: 1, rough: "rubble", nr: 3},
  palace:  {tall: "pillar", low: "crate", nt: 2, hill: 1, rough: "rubble", nr: 2},
  sewer:   {tall: "pillar", nt: 2, rough: "rubble", nr: 3},
  water:   {tall: "pillar", nt: 2, hill: 1, rough: "rubble", nr: 3},
  archive: {tall: "shelf", low: "crate", nt: 3, hill: 1, rough: "rubble", nr: 2},
  snow:    {tall: "boulder", nt: 2, hill: 2, rough: "drift", nr: 5},
  fort:    {tall: "pillar", low: "barrel", nt: 2, hill: 2, rough: "rubble", nr: 3},
  mirror:  {tall: "mirror", low: "rock", nt: 3},
  dungeon: {tall: "pillar", low: "barrel", nt: 2, rough: "rubble", nr: 3, holy: 1},
  throne:  {tall: "pillar", low: "rock", nt: 2, hill: 1, rough: "rubble", nr: 2},
};
const TER_INFO = {
  high:   [["Altura", "High ground", "Altura"], ["Da qui i tiri a distanza hanno +2 a colpire e +2 di gittata contro chi sta più in basso. Salirci costa 1 movimento in più.", "Ranged attacks from here get +2 to hit and +2 range against lower targets. Climbing up costs 1 extra movement.", "Desde aquí los ataques a distancia tienen +2 al ataque y +2 de alcance contra objetivos más bajos. Subir cuesta 1 movimiento más."]],
  brush:  [["Sterpaglia", "Brush", "Maleza"], ["Terreno difficile: entrare costa 2 movimento. Chi ci sta dentro ha mezza copertura (+2 CA) dai tiri a distanza. Il fuoco la incendia.", "Difficult terrain: entering costs 2 movement. Whoever stands in it has half cover (+2 AC) against ranged attacks. Fire sets it ablaze.", "Terreno difícil: entrar cuesta 2 de movimiento. Quien está dentro tiene media cobertura (+2 CA) contra ataques a distancia. El fuego la incendia."]],
  hay:    [["Paglia", "Straw", "Paja"], ["Terreno difficile: entrare costa 2 movimento. Chi ci sta dentro ha mezza copertura (+2 CA) dai tiri a distanza. Brucia facilmente.", "Difficult terrain: entering costs 2 movement. Whoever stands in it has half cover (+2 AC) against ranged attacks. It burns easily.", "Terreno difícil: entrar cuesta 2 de movimiento. Quien está dentro tiene media cobertura (+2 CA) contra ataques a distancia. Arde con facilidad."]],
  rubble: [["Macerie", "Rubble", "Escombros"], ["Terreno difficile: entrare costa 2 movimento.", "Difficult terrain: entering costs 2 movement.", "Terreno difícil: entrar cuesta 2 de movimiento."]],
  drift:  [["Neve alta", "Deep snow", "Nieve profunda"], ["Terreno difficile: entrare costa 2 movimento.", "Difficult terrain: entering costs 2 movement.", "Terreno difícil: entrar cuesta 2 de movimiento."]],
  holy:   [["Cerchio sacro", "Holy circle", "Círculo sagrado"], ["All'inizio del turno cura 1d4+1 PF a chi ci sta sopra. I non morti invece subiscono 1d6 danni radiosi.", "At the start of a turn it heals 1d4+1 HP to whoever stands on it. The undead take 1d6 radiant damage instead.", "Al inicio del turno cura 1d4+1 PG a quien esté encima. Los muertos vivientes reciben 1d6 de daño radiante."]],
  fire:   [["Fuoco", "Fire", "Fuego"], ["Chi entra o inizia il turno tra le fiamme subisce 1d6 danni da fuoco. Si spegne in pochi round e può propagarsi alla sterpaglia vicina.", "Entering or starting a turn in the flames deals 1d6 fire damage. It dies out in a few rounds and can spread to nearby brush.", "Entrar o empezar el turno entre las llamas causa 1d6 de daño de fuego. Se apaga en pocas rondas y puede propagarse a la maleza cercana."]],
  ash:    [["Cenere", "Ash", "Ceniza"], ["Sterpaglia bruciata: terreno normale, nessuna copertura.", "Burnt brush: normal ground, no cover.", "Maleza quemada: terreno normal, sin cobertura."]],
  tall:   [["Ostacolo alto", "Tall obstacle", "Obstáculo alto"], ["Blocca la linea di vista: non si può tirare né lanciare incantesimi attraverso. Chi ci sta dietro è al sicuro dai tiri.", "Blocks line of sight: nothing can be shot or cast through it. Whoever hides behind it is safe from shots.", "Bloquea la línea de visión: no se puede disparar ni lanzar conjuros a través. Quien se esconde detrás está a salvo de disparos."]],
};

/* ---------- rules helpers ---------- */
const terAt = (x, y) => CB && CB.ter ? CB.ter[K(x, y)] : undefined;
const onHigh = p => terAt(p.x, p.y) === "high";
const inBrush = p => !!(CB && CB.ter && CB.ter[K(p.x, p.y)] === "brush" && !(CB.fire && CB.fire[K(p.x, p.y)]));
const isRough = k => { const t = CB.ter && CB.ter[k]; return t === "brush" || t === "rubble" || t === "drift"; };
function stepCost(fx, fy, tx, ty) {
  if (!CB || !CB.ter) return 1; const k = K(tx, ty); let c = 1;
  if (isRough(k)) c++;
  if (CB.ter[k] === "high" && CB.ter[K(fx, fy)] !== "high") c++;
  return c;
}
const effR = (p, r) => r > 1 && p && onHigh(p) ? r + 2 : r;
const highBonus = (a, t, o) => (o.ranged || dist(a, t) > 1) && onHigh(a) && !onHigh(t) ? 2 : 0;
// line of sight: blocked when the line between the two centres crosses the core of a tall obstacle
function losClear(a, t) {
  if (!CB || !CB.tall || !CB.tall.size || dist(a, t) <= 1) return true;
  const ax = a.x + .5, ay = a.y + .5, bx = t.x + .5, by = t.y + .5, n = Math.ceil(Math.hypot(bx - ax, by - ay) * 10);
  for (let i = 1; i < n; i++) { const px = ax + (bx - ax) * i / n, py = ay + (by - ay) * i / n, cx = Math.floor(px), cy = Math.floor(py);
    if ((cx === a.x && cy === a.y) || (cx === t.x && cy === t.y)) continue;
    if (CB.tall.has(K(cx, cy)) && Math.abs(px - cx - .5) < .36 && Math.abs(py - cy - .5) < .36) return false; }
  return true;
}
const canSee = (a, t) => losClear(a, t);
// exposed: flanked in melee, or (at range) with no cover while already engaged by one of the attacker's allies
function exposed(a, t, o) {
  if (!CB) return false;
  const melee = !o.ranged && dist(a, t) <= (o.reach || 1);
  if (melee) return flanked(a, t);
  if (coverFor(a, t, o) > 0) return false;
  return CB.units.some(x => x !== a && x.side === a.side && alive(x) && dist(x, t) <= 1 && !x.cond.asleep && !x.cond.stun);
}
function terInfoAt(k) {
  if (!CB || !CB.ter) return null;
  if (CB.fire && CB.fire[k]) return "fire";
  if (CB.tall && CB.tall.has(k)) return "tall";
  const t = CB.ter[k]; if (!t) return null;
  if (t === "brush" && (TCFG[mapKey()] || {}).hay) return "hay";
  return t;
}

/* ---------- generation ---------- */
function genTerrain() {
  const cfg = TCFG[ENC[CB.key].map] || {};
  CB.ter = {}; CB.fire = {}; CB.tall = new Set();
  const free = (x, y) => inGrid(x, y) && !CB.ob.has(K(x, y)) && !CB.ter[K(x, y)];
  const pick = (y0, y1) => { for (let g = 0; g < 60; g++) { const x = Math.floor(Math.random() * COLS), y = y0 + Math.floor(Math.random() * (y1 - y0 + 1)); if (free(x, y)) return [x, y]; } return null; };
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  // tall obstacles: a few of the existing obstacles, preferring the middle of the board
  const obs = [...CB.ob].sort(() => Math.random() - .5).sort((a, b) => Math.abs(+a.split(",")[1] - 4) - Math.abs(+b.split(",")[1] - 4));
  obs.slice(0, Math.min(cfg.nt || 0, Math.ceil(obs.length / 2))).forEach(k => CB.tall.add(k));
  // hills of 2-3 tiles
  for (let h = 0; h < (cfg.hill || 0); h++) { const s = pick(2, 6); if (!s) continue; CB.ter[K(...s)] = "high"; let [x, y] = s;
    for (let e = 0; e < 1 + (Math.random() < .5 ? 1 : 0); e++) { const n = N4.map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => free(a, b) && b >= 1 && b <= ROWS - 2); if (!n.length) break; [x, y] = n[Math.floor(Math.random() * n.length)]; CB.ter[K(x, y)] = "high"; } }
  // patches of difficult terrain
  let left = cfg.nr || 0;
  for (let g = 0; left > 0 && g < 40; g++) { const s = pick(1, ROWS - 2); if (!s) break; let [x, y] = s; const size = Math.min(left, 2 + Math.floor(Math.random() * 2));
    for (let i = 0; i < size; i++) { if (free(x, y)) { CB.ter[K(x, y)] = cfg.rough; left--; } const n = N4.map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => free(a, b)); if (!n.length) break; [x, y] = n[Math.floor(Math.random() * n.length)]; } }
  if (cfg.holy) { const s = pick(3, 5); if (s) CB.ter[K(...s)] = "holy"; }
}

/* ---------- fire ---------- */
function igniteArea(c, rad) {
  if (!CB || !CB.ter) return; let n = 0;
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const k = K(x, y); if (dist(c, {x, y}) <= rad && CB.ter[k] === "brush" && !CB.fire[k]) { CB.fire[k] = 3; n++; } }
  if (n) { logL(tr(["La sterpaglia prende fuoco!", "The brush catches fire!", "¡La maleza se incendia!"])); paintTerrain(); if (typeof SFX !== "undefined" && SFX.fire) SFX.fire(); }
}
function tickFire() {
  if (!CB || !CB.fire) return; const ks = Object.keys(CB.fire); if (!ks.length) return; const nf = [];
  ks.forEach(k => { const [x, y] = k.split(",").map(Number);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const n = K(x + dx, y + dy); if (CB.ter[n] === "brush" && !CB.fire[n] && Math.random() < .4) nf.push(n); });
    if (--CB.fire[k] <= 0) { delete CB.fire[k]; CB.ter[k] = "ash"; } });
  nf.forEach(n => { if (!CB.fire[n]) CB.fire[n] = 2; });
  if (nf.length) logL(tr(["Il fuoco si propaga.", "The fire spreads.", "El fuego se propaga."]));
  paintTerrain();
}
async function burnUnit(u) { logL(`${u.name}: ${tr(["tra le fiamme", "in the flames", "entre las llamas"])}`); fxImpact(u, "fire", false); await applyDmg(u, roll("1d6").total, "fire", null); }
function fireFX() {
  const ks = Object.keys(CB.fire); if (!ks.length) return; const C = CB.cell, low = PREF.lowfx;
  ks.forEach(k => { if (Math.random() > (low ? .12 : .5)) return; const [tx, ty] = k.split(",").map(Number), px = (tx + .2 + Math.random() * .6) * C, py = (ty + .4 + Math.random() * .45) * C;
    part({x: px, y: py, vx: (Math.random() - .5) * .3, vy: -.5 - Math.random() * .7, col: ["#fff1b0", "#ffc04a", "#ff7a2a", "#ff4a1a"][Math.floor(Math.random() * 4)], size: 1.8 + Math.random() * 2.6, max: 18 + Math.random() * 16, g: -.015, drag: .96});
    if (Math.random() < .1) part({x: px, y: py - C * .2, vx: (Math.random() - .5) * .3, vy: -.35, col: "rgba(60,50,50,.4)", size: C * .16, shape: "smoke", max: 50, add: false}); });
}

/* ---------- start-of-turn terrain effects; returns true if the unit fell ---------- */
async function terrainTurnStart(u) {
  if (!CB || !CB.ter || !alive(u)) return false; const k = K(u.x, u.y);
  if (CB.fire[k]) await burnUnit(u);
  else if (CB.ter[k] === "holy") {
    if (u.side === "e" && u.def.undead) { logL(`${u.name}: ${tr(TER_INFO.holy[0])}`); await fxColumn(u, "radiant"); await applyDmg(u, roll("1d6").total, "radiant", null); }
    else if (u.hp < u.maxhp && !(u.side === "p" && u.down)) { const n = rnd(4) + 1;
      if (u.side === "p") heal(u, n); else { u.hp = Math.min(u.maxhp, u.hp + n); floatAt(u, "+" + n, "#9be0a6"); fxHeal(u); logL(`${u.name} ${T_("heals")} ${n} ${T_("hp")}`); placeTokens(); } }
  }
  return !alive(u);
}
// extra value of a tile for the enemy AI
function terrainScore(u, k) {
  let s = 0; const t = CB.ter && CB.ter[k];
  if (CB.fire && CB.fire[k]) s -= 8;
  if (t === "holy") s += u.def.undead ? -7 : u.hp < u.maxhp ? 1.5 : .3;
  return s;
}

/* ---------- leaders: when the leader falls, the followers flee ---------- */
const LEADS = {
  mill: {
    start: ["Snik comanda! Chi scappa, Snik se lo mangia!", "Snik is boss! Who runs, Snik eats!", "¡Snik manda! ¡Quien huya, Snik se lo come!"],
    rally: [["Snik guarda! Combattere, combattere!", "Snik is watching! Fight, fight!", "¡Snik mira! ¡Luchar, luchar!"],
            ["Se Snik vince, più oro per tutti!", "If Snik wins, more gold for all!", "¡Si Snik gana, más oro para todos!"],
            ["Nessuno scappa finché c'è Snik…", "Nobody runs while Snik stands…", "Nadie huye mientras Snik siga en pie…"]],
    hurt: ["Snik sanguina… Snik sanguina!", "Snik bleeds… Snik bleeds!", "Snik sangra… ¡Snik sangra!"],
    fall: ["Snik è morto! Via, via, via!", "Snik is dead! Run, run, run!", "¡Snik ha muerto! ¡Corred, corred!"],
  },
  bandits: {
    start: ["Ai vostri posti, ragazzi. Nessuno si muove senza il mio ordine.", "Take your places, lads. Nobody moves without my word.", "A vuestros puestos, muchachos. Nadie se mueve sin mi orden."],
    rally: [["Tenete la linea, il capo ci guarda!", "Hold the line, the boss is watching!", "¡Mantened la línea, la jefa nos mira!"],
            ["Finché Mira è in piedi, il ponte è nostro.", "While Mira stands, the bridge is ours.", "Mientras Mira siga en pie, el puente es nuestro."],
            ["Mira ci paga doppio per questi!", "Mira pays double for these!", "¡Mira nos paga el doble por estos!"]],
    hurt: ["Il capo è ferita… non mi pagano abbastanza per questo.", "The boss is hurt… they don't pay me enough for this.", "La jefa está herida… no me pagan lo suficiente para esto."],
    fall: ["Mira è a terra! Ognuno per sé!", "Mira's down! Every man for himself!", "¡Mira ha caído! ¡Sálvese quien pueda!"],
  },
  varga: {
    start: ["Figli pallidi, la mia voce è la vostra volontà.", "Pale children, my voice is your will.", "Hijos pálidos, mi voz es vuestra voluntad."],
    rally: [["Varga parla e noi obbediamo…", "Varga speaks and we obey…", "Varga habla y nosotros obedecemos…"],
            ["La sua voce ci tiene in piedi…", "His voice keeps us standing…", "Su voz nos mantiene en pie…"],
            ["Senza il Pallido siamo solo ossa e fame…", "Without the Pale One we are only bones and hunger…", "Sin el Pálido solo somos huesos y hambre…"]],
    hurt: ["La voce del Pallido trema…", "The Pale One's voice trembles…", "La voz del Pálido tiembla…"],
    fall: ["Il Pallido tace… la sua voce è sparita… fuggite!", "The Pale One is silent… his voice is gone… flee!", "El Pálido calla… su voz se ha ido… ¡huid!"],
  },
  doran: {
    start: ["Restate dove vi ho messi. Siete pagati per questo.", "Stay where I put you. That's what you're paid for.", "Quedaos donde os puse. Para eso se os paga."],
    rally: [["Doran ha detto di tenerli qui!", "Doran said to hold them here!", "¡Doran dijo que los retuviéramos aquí!"],
            ["Paga lui, combattiamo noi…", "He pays, we fight…", "Él paga, nosotros luchamos…"],
            ["Se cade Doran, chi ci paga?", "If Doran falls, who pays us?", "Si cae Doran, ¿quién nos paga?"]],
    hurt: ["Doran sta perdendo… e la nostra paga con lui.", "Doran is losing… and our pay with him.", "Doran está perdiendo… y nuestra paga con él."],
    fall: ["Doran è caduto! Il contratto è finito!", "Doran is down! The contract is over!", "¡Doran ha caído! ¡Se acabó el contrato!"],
  },
};
LEADS.varga_small = LEADS.varga;
const leaderU = () => CB && CB.lead ? CB.units.find(u => u.uid === CB.lead) : null;
function bark(u, txt, ms = 2600) {
  logL(`${u.name}: «${txt}»`);
  try { const bw = $("#bw"), tk = $("#t_" + u.uid); if (!bw || !tk || !tk.getBoundingClientRect) return;
    const r = tk.getBoundingClientRect(), R = bw.getBoundingClientRect(), d = document.createElement("div");
    d.className = "bark " + u.side; d.textContent = txt;
    d.style.left = Math.max(100, Math.min(R.width - 100, r.left + r.width / 2 - R.left)) + "px"; d.style.top = Math.max(44, r.top - R.top + 6) + "px";
    bw.appendChild(d); setTimeout(() => d.classList.add("out"), ms); setTimeout(() => d.remove(), ms + 450);
  } catch (e) {}
}
async function leaderIntro() {
  const L = leaderU(), d = LEADS[CB.key]; if (!L || !d) return;
  placeTokens(); await sleep(250); bark(L, tr(d.start), 3000); await sleep(1500);
}
async function followerBark(u) {
  const L = leaderU(), d = LEADS[CB.key]; if (!L || !d || CB.routed || u === L || L.hp <= 0) return;
  if (L.hp < L.maxhp / 2 && !CB.hurtBark) { CB.hurtBark = 1; bark(u, tr(d.hurt)); await sleep(1200); return; }
  if (CB.barkRound === CB.round || Math.random() > (CB.round <= 2 ? .6 : .35)) return;
  CB.barkRound = CB.round; const lines = d.rally.filter(l => l !== CB.lastBark), l = lines[Math.floor(Math.random() * lines.length)]; CB.lastBark = l;
  bark(u, tr(l)); await sleep(1100);
}
async function leaderFalls(L) {
  CB.routed = 1; const d = LEADS[CB.key] || {}, fol = foes(); if (!fol.length) return;
  if (d.fall) { bark(fol[0], tr(d.fall)); await sleep(1300); }
  fol.forEach(f => { f.fled = 1; f.hp = 0; CB.xp += Math.round(f.def.xp / 2);
    logL(`${f.name} ${tr(f.def.undead ? ["si dissolve", "dissolves", "se disuelve"] : ["fugge", "flees", "huye"])}`);
    const tk = $("#t_" + f.uid); if (tk) tk.classList.add("fled"); fxPoof(f); });
  placeTokens(); await sleep(600);
}

/* ---------- ink painters ---------- */
function tallShadow(x, cx, cy, C) {
  const clip = () => { x.beginPath(); x.moveTo(cx - C * .3, cy + C * .06); x.lineTo(cx + C * .08, cy - C * .28); x.lineTo(cx + C * .66, cy + C * .3); x.lineTo(cx + C * .28, cy + C * .66); x.closePath(); };
  x.save(); x.globalAlpha = .9; hatch(x, clip, cx + C * .2, cy + C * .2, C * .9, -Math.PI / 4, 2.2, .38, .6); x.restore();
}
function paintTerrainLayer(x, C) {
  if (!CB || !CB.ter) return; const cfg = TCFG[mapKey()] || {}, ks = Object.keys(CB.ter);
  ks.filter(k => CB.ter[k] === "high").forEach(k => inkHigh(x, k, C));
  // the board is turned 90° in landscape: draw each tile's details turned back, so tufts still grow upwards
  const land = isLand();
  ks.forEach(k => { const t = CB.ter[k], [tx, ty] = k.split(",").map(Number), l = tx * C, tp = ty * C;
    x.save(); if (land) { x.translate(l + C / 2, tp + C / 2); x.rotate(-Math.PI / 2); x.translate(-l - C / 2, -tp - C / 2); }
    if (t === "brush") (cfg.hay ? inkHay : inkBrush)(x, l, tp, C);
    else if (t === "rubble") inkRubble(x, l, tp, C); else if (t === "drift") inkDrift(x, l, tp, C);
    else if (t === "holy") inkHoly(x, l, tp, C); else if (t === "ash") inkAsh(x, l, tp, C);
    x.restore(); });
  Object.keys(CB.fire || {}).forEach(k => { const [tx, ty] = k.split(",").map(Number); inkBurning(x, tx * C, ty * C, C); });
}
function inkHigh(x, k, C) {
  // a hillock drawn like an old map: contour rings, hachures down the slope, shaded side
  const [tx, ty] = k.split(",").map(Number), cx = (tx + .5) * C, cy = (ty + .5) * C;
  wash(x, cx, cy, C * .75, "#fff6dc", .6); wash(x, cx, cy, C * .5, "#c9a868", .2);
  const ring = (r, rough) => ipoly(cx, cy, r, 18, rough);
  const r1 = ring(C * .45, .08), r2 = ring(C * .3, .1), r3 = ring(C * .15, .12);
  hatch(x, () => { jpath(x, r1, true); x.moveTo(cx + C * .5, cy); x.arc(cx - C * .12, cy - C * .12, C * .42, 0, 7, true); }, cx + C * .2, cy + C * .2, C * .6, Math.PI / 4, 2.3, .35, .5);
  istroke(x, r1, 1.3, .85); istroke(x, r2, .9, .7); istroke(x, r3, .8, .6);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + IR() * .15, r0 = C * .45, l = C * (.06 + IR() * .04); iseg(x, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + l), cy + Math.sin(a) * (r0 + l), .8, .6); }
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r0 = C * .3, l = C * .1; iseg(x, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + l), cy + Math.sin(a) * (r0 + l), .6, .45); }
}
function inkBrush(x, l, t, C) {
  wash(x, l + C / 2, t + C / 2, C * .6, "#5f7a35", .3);
  for (let i = 0; i < 6; i++) { const bx = l + C * (.15 + IR() * .7), by = t + C * (.3 + IR() * .6), n = 4 + Math.floor(IR() * 3);
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k / (n - 1) - .5) * 1.4 + (IR() - .5) * .2, len = C * (.1 + IR() * .1); iseg(x, bx, by, bx + Math.cos(a) * len, by + Math.sin(a) * len, .7, .75); } }
  for (let i = 0; i < 2; i++) { let px = l + C * (.2 + IR() * .5), py = t + C * (.2 + IR() * .5); const pts = [[px, py]]; for (let k = 0; k < 5; k++) { px += C * .06; py += (k % 2 ? -1 : 1) * C * .05; pts.push([px, py]); } istroke(x, pts, .6, .6, false); }
}
function inkHay(x, l, t, C) {
  wash(x, l + C / 2, t + C / 2, C * .62, "#e0b030", .5); wash(x, l + C / 2, t + C / 2, C * .4, "#f0c850", .3);
  for (let i = 0; i < 26; i++) { const px = l + C * (.12 + IR() * .76), py = t + C * (.12 + IR() * .76), a = IR() * Math.PI, len = C * (.1 + IR() * .12); iseg(x, px, py, px + Math.cos(a) * len, py + Math.sin(a) * len, .6, .6); }
}
function inkRubble(x, l, t, C) {
  wash(x, l + C / 2, t + C / 2, C * .55, "#8a8070", .22);
  for (let i = 0; i < 8; i++) { const px = l + C * (.15 + IR() * .7), py = t + C * (.15 + IR() * .7), r = C * (.04 + IR() * .06), pts = ipoly(px, py, r, 5 + Math.floor(IR() * 3), .4);
    x.fillStyle = "rgba(150,140,120,.35)"; jpath(x, pts, true); x.fill(); if (IR() > .5) hatch(x, () => jpath(x, pts, true), px, py, r * 1.4, Math.PI / 4, 1.8, .45, .5); istroke(x, pts, .8, .8); }
}
function inkDrift(x, l, t, C) {
  wash(x, l + C / 2, t + C / 2, C * .6, "#ffffff", .5);
  for (let i = 0; i < 3; i++) { const px = l + C * (.2 + IR() * .6), py = t + C * (.3 + i * .22), w = C * (.18 + IR() * .1); x.strokeStyle = INK(.5); x.lineWidth = .8; x.beginPath(); x.moveTo(px - w, py); x.quadraticCurveTo(px, py - C * .12, px + w, py); x.stroke(); }
  stip(x, l + C / 2, t + C / 2, 10, C * .4, .3);
}
function inkHoly(x, l, t, C) {
  const cx = l + C / 2, cy = t + C / 2;
  wash(x, cx, cy, C * .55, "#e8b830", .4);
  istroke(x, ipoly(cx, cy, C * .38, 22, .03), 1.2, .8); istroke(x, ipoly(cx, cy, C * .29, 20, .03), .8, .7);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .2, r = C * .335, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; iseg(x, px - 2, py - 2, px + 2, py + 2, .8, .8); if (i % 2) iseg(x, px - 2, py + 2, px + 2, py - 2, .8, .8); }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; iseg(x, cx, cy, cx + Math.cos(a) * C * .15, cy + Math.sin(a) * C * .15, 1, .75); }
}
function inkAsh(x, l, t, C) {
  wash(x, l + C / 2, t + C / 2, C * .6, "#2a1a10", .35); stip(x, l + C / 2, t + C / 2, 40, C * .42, .55);
  for (let i = 0; i < 4; i++) { const bx = l + C * (.2 + IR() * .6), by = t + C * (.4 + IR() * .45); iseg(x, bx, by, bx + (IR() - .5) * 4, by - C * (.08 + IR() * .08), .9, .8); }
}
function inkBurning(x, l, t, C) { wash(x, l + C / 2, t + C / 2, C * .62, "#d0401a", .38); wash(x, l + C / 2, t + C / 2, C * .35, "#ffb040", .25); }
Object.assign(INKO, {
  boulder(x, cx, cy, C) {
    inkShadow(x, cx + C * .12, cy + C * .24, C * .5, C * .2);
    [[cx + C * .14, cy + C * .08, C * .22], [cx - C * .04, cy - C * .06, C * .38]].forEach(([px, py, r]) => { const pts = ipoly(px, py, r, 10, .3);
      x.fillStyle = "rgba(150,140,120,.45)"; jpath(x, pts, true); x.fill(); hatch(x, () => jpath(x, pts, true), px + r * .35, py + r * .3, r, Math.PI / 4, 2, .55, .6); istroke(x, pts, 1.7, .95); });
    iseg(x, cx - C * .2, cy - C * .2, cx - C * .02, cy - C * .02, .9, .65); iseg(x, cx - C * .02, cy - C * .02, cx + C * .06, cy - C * .16, .9, .65); },
  stump(x, cx, cy, C) {
    inkShadow(x, cx + C * .08, cy + C * .14, C * .32, C * .13);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + .6 + IR() * .4; iseg(x, cx + Math.cos(a) * C * .17, cy + Math.sin(a) * C * .17, cx + Math.cos(a) * C * .3, cy + Math.sin(a) * C * .3, 1.2, .8); }
    x.fillStyle = "rgba(190,150,100,.5)"; x.beginPath(); x.arc(cx, cy, C * .2, 0, 7); x.fill(); istroke(x, ipoly(cx, cy, C * .2, 14, .1), 1.4, .9);
    [.14, .09, .045].forEach(r => { x.strokeStyle = INK(.5); x.lineWidth = .6; x.beginPath(); x.arc(cx + 1, cy, C * r, 0, 7); x.stroke(); }); iseg(x, cx, cy, cx + C * .17, cy - C * .06, .7, .6); },
  cratestack(x, cx, cy, C) { INKO.crate(x, cx - C * .08, cy + C * .08, C * .95); INKO.crate(x, cx + C * .06, cy - C * .12, C * .78); },
});

/* ---------- board: path overlay, leader crown, action zones, move confirmation ---------- */
const _buildCombatT = buildCombat;
buildCombat = function () {
  _buildCombatT(); if (!CB) return;
  $("#board").insertAdjacentHTML("beforeend", `<svg id="psvg" aria-hidden="true"></svg>`);
  const L = leaderU(); if (L) { const inr = $("#t_" + L.uid + " .in"); if (inr) inr.insertAdjacentHTML("beforeend", `<i class="lcrown" title="♛">${icon("crown")}</i>`); }
};
const _placeTokensL = placeTokens;
placeTokens = function () { _placeTokensL(); if (!CB) return; CB.units.forEach(u => { const t = $("#t_" + u.uid); if (t) { t.classList.toggle("lead", !!u.leader && !CB.routed); t.classList.toggle("fled", !!u.fled); } }); };

function zoneOf(u, s) {
  if (!s || !canUse(u, s)) return null; const sp = selSpec(u, s);
  if (s.k === "ab" && s.key === "overwatch") { const p = owProfile(u); return p ? {kind: "ow", r: effR(u, p.r), los: p.r > 1} : null; }
  if (s.k === "ab" && s.key === "turn") return {kind: "ab", r: 6, los: false};
  if (sp.tgt === "enemy") return {kind: "atk", r: sp.r, los: sp.r > 1};
  if (sp.tgt === "area" || sp.tgt === "tile" || sp.tgt === "ally") return {kind: "ab", r: sp.r, los: sp.r > 1};
  if (s.k === "sp" && SPELLS[s.key].rad) return {kind: "ab", r: SPELLS[s.key].rad, los: false};
  return null;
}
function movePreviewSVG() {
  const sv = $("#psvg"); if (!sv) return; const C = CB.cell; sv.setAttribute("width", COLS * C); sv.setAttribute("height", ROWS * C); sv.setAttribute("viewBox", `0 0 ${COLS * C} ${ROWS * C}`);
  const mv = CB.mvp, u = cur(); if (!mv || !u) { sv.innerHTML = ""; return; }
  const P = mv.path.map(k => k.split(",").map(Number)), pt = ([a, b]) => `${(a + .5) * C},${(b + .5) * C}`;
  let h = `<polyline points="${P.map(pt).join(" ")}" class="pl${mv.dash ? " dash" : ""}"/>`;
  let spent = 0;
  for (let i = 1; i < P.length; i++) { spent += stepCost(P[i - 1][0], P[i - 1][1], P[i][0], P[i][1]); const [a, b] = P[i], k = K(a, b);
    const hot = CB.fire[k] ? "fire" : provokers(u, {x: P[i - 1][0], y: P[i - 1][1]}, {x: a, y: b}).length ? "risk" : spent > u.mv ? "dsh" : "";
    if (i < P.length - 1) h += `<circle cx="${(a + .5) * C}" cy="${(b + .5) * C}" r="${C * .07}" class="pd ${hot}"/>`; }
  const [ex, ey] = P[P.length - 1], cx = (ex + .5) * C, cy = (ey + .5) * C;
  h += `<circle cx="${cx}" cy="${cy}" r="${C * .3}" class="pe${mv.dash ? " dash" : ""}"/>`;
  h += `<text x="${cx}" y="${cy}" class="pt" ${isLand() ? `transform="rotate(-90 ${cx} ${cy})"` : ""} dy=".35em" style="font-size:${Math.round(C * .3)}px">${mv.cost}</text>`;
  sv.innerHTML = h;
}
function moveInfoHTML(u, mv) {
  const dest = mv.k, ti = terInfoAt(dest), path = mv.path; let risk = "";
  for (let i = 1; i < path.length; i++) { if (CB.fire[path[i]]) { risk = tr(["attraversa le fiamme", "crosses the flames", "atraviesa las llamas"]); break; } const [fx, fy] = path[i - 1].split(",").map(Number), [tx, ty] = path[i].split(",").map(Number); if (provokers(u, {x: fx, y: fy}, {x: tx, y: ty}).length) { risk = tr(["provoca attacchi d'opportunità", "provokes opportunity attacks", "provoca ataques de oportunidad"]); break; } }
  if (!risk && tileRisk(u, new Map(path.map((k, i) => [k, {p: i ? path[i - 1] : null}])), dest) === "ow") risk = tr(["passa nel raggio di una guardia", "crosses an overwatch zone", "cruza una zona de vigilancia"]);
  const left = u.mv + (mv.dash ? u.spd : 0) - mv.cost;
  const title = mv.then ? tr(["Avvicinati e attacca", "Approach and attack", "Acércate y ataca"]) : tr(["Movimento", "Move", "Movimiento"]);
  const tags = [`<span class="cost-t m" title="${tr(["movimento usato / disponibile", "movement used / available", "movimiento usado / disponible"])}">${mv.cost}/${mv.cost + left} ▸</span>`]; if (mv.dash) tags.push(`<span class="cost-t a">${tr(ABIL.dash.n)} · ${hasF(u.ref, "cunning") && u.bon > 0 ? T_("bonus") : T_("action")}</span>`);
  const notes = []; if (ti) notes.push(`<b>${tr(TER_INFO[ti][0])}</b>: ${tr(TER_INFO[ti][1])}`); if (risk) notes.push(`<span class="rk">● ${risk}</span>`);
  return `<div class="mvbar"><div class="mvt"><b>${title}</b>${tags.join("")}${notes.length ? `<p class="hint">${notes.join(" · ")}</p>` : `<p class="hint">${tr(["Tocca di nuovo la casella o premi Vai.", "Tap the tile again or press Go.", "Toca de nuevo la casilla o pulsa Ir."])}</p>`}</div>
    <button class="mvgo" id="mvGo">${icon("end")}<span>${mv.then ? tr(["Vai e attacca", "Go & attack", "Ir y atacar"]) : tr(["Vai", "Go", "Ir"])}</span></button><button class="mvno" id="mvNo" aria-label="${T_("close")}">✕</button></div>`;
}
const _renderCombatZ = renderCombat;
renderCombat = function () {
  _renderCombatZ(); if (!CB || !$("#board")) return;
  const u = cur(), mine = u && u.side === "p" && !CB.busy && !CB.ended;
  if (CB.deploy) { const L = leaderU(); if (L) { const p = $("#info"); if (p && !p.querySelector(".lead")) (p.querySelector("p") || p).insertAdjacentHTML(p.querySelector("p") ? "beforebegin" : "beforeend", `<p class="hint lead">${icon("crown")} ${esc(L.name)} ${tr(["guida questo gruppo.", "leads this group.", "dirige este grupo."])}</p>`); } movePreviewSVG(); return; }
  const cells = document.querySelectorAll("#board .cell");
  // enemy overwatch zones are always visible
  // an enemy's overwatch zone is shown when you inspect it
  const ows = CB.units.filter(o => o === CB.inspect && o.side === "e" && o.hp > 0 && o.cond.ow && canReact(o)).map(o => ({o, p: owProfile(o)})).filter(z => z.p);
  const zone = mine && !CB.mvp ? zoneOf(u, CB.sel) : null;
  const R2 = mine && !CB.mvp && dashOK(u) ? reachOf(u, u.mv + u.spd) : null, R1 = R2 ? reachOf(u, u.mv) : null;
  cells.forEach(cel => {
    const x = +cel.dataset.x, y = +cel.dataset.y, k = K(x, y), p = {x, y}; if (CB.ob.has(k)) return;
    if (ows.some(z => dist(z.o, p) <= effR(z.o, z.p.r) && dist(z.o, p) > 0 && sees(z.o, p, z.p.r))) cel.classList.add("z-eow");
    if (zone) { const d = dist(u, p); if (d > 0 && d <= zone.r) cel.classList.add(!zone.los || sees(u, p, zone.r) ? "z-" + zone.kind : "z-los"); }
    if (R2 && R2.has(k) && !R1.has(k) && !unitAt(x, y)) cel.classList.add("reach2");
    if (CB.mvp && CB.mvp.k === k) cel.classList.add("pdest");
  });
  movePreviewSVG();
  // exposed targets: wider critical range
  if (mine && CB.sel) { const sp = selSpec(u);
    if (sp.tgt === "enemy") CB.units.forEach(o => { const tk = $("#t_" + o.uid); if (!tk || !tk.classList.contains("tg")) return; if (exposed(u, o, {ranged: sp.r > 1, reach: sp.r > 1 ? sp.r : 1})) tk.querySelector(".chance").insertAdjacentHTML("beforeend", `<i class="ex" title="${tr(["esposto: critico con 18–20", "exposed: critical on 18–20", "expuesto: crítico con 18–20"])}">✸</i>`); }); }
  const info = $("#info"); if (!info) return;
  if (mine && CB.mvp) { info.innerHTML = moveInfoHTML(u, CB.mvp); $("#mvGo").onclick = () => confirmMove(); $("#mvNo").onclick = () => { CB.mvp = null; renderCombat(); }; return; }
  if (CB.tileInfo && !CB.inspect) { const ti = terInfoAt(CB.tileInfo); if (ti) info.innerHTML = `<b>${tr(TER_INFO[ti][0])}</b><p>${tr(TER_INFO[ti][1])}</p>`; return; }
  if (CB.inspect && CB.inspect.leader && !CB.routed && CB.inspect.hp > 0) info.insertAdjacentHTML("beforeend", `<p class="hint lead">${icon("crown")} ${tr(["Capo del gruppo: i suoi seguaci combattono finché resta in piedi.", "Leader of the group: the followers fight as long as it stands.", "Jefe del grupo: sus seguidores luchan mientras siga en pie."])}</p>`);
  if (mine && CB.sel && !CB.inspect) { const sp = selSpec(u); const h = info.querySelector("p.hint");
    if (h && sp.tgt === "enemy" && sp.r > 1 && onHigh(u)) h.insertAdjacentHTML("beforeend", ` · <span class="hg">${icon("hill")} ${tr(["altura: +2 a colpire, +2 gittata", "high ground: +2 to hit, +2 range", "altura: +2 al ataque, +2 alcance"])}</span>`);
    if (h && sp.tgt === "enemy" && foes().some(f => dist(u, f) <= sp.r && sp.r > 1 && !sees(u, f, sp.r))) h.insertAdjacentHTML("beforeend", ` · <span class="nl">${tr(["◼ fuori vista", "◼ out of sight", "◼ fuera de vista"])}</span>`); }
};

/* ---------- tips and options ---------- */
TIPS.push(
  ["hill", TER_INFO.high[0], TER_INFO.high[1]],
  ["brush", ["Terreno difficile e sterpaglia", "Difficult terrain and brush", "Terreno difícil y maleza"], ["Sterpaglia, macerie e neve alta costano 2 movimento. La sterpaglia dà mezza copertura a chi ci sta dentro, ma prende fuoco: un incantesimo di fuoco la trasforma in una trappola.", "Brush, rubble and deep snow cost 2 movement. Brush gives half cover to whoever stands in it, but it burns: a fire spell turns it into a trap.", "Maleza, escombros y nieve profunda cuestan 2 de movimiento. La maleza da media cobertura a quien está dentro, pero arde: un conjuro de fuego la convierte en una trampa."]],
  ["eye", ["Linea di vista", "Line of sight", "Línea de visión"], ["Gli ostacoli alti, con l'ombra tratteggiata lunga, bloccano la vista: niente tiri né incantesimi attraverso. Le caselle scure nella zona d'azione sono fuori vista.", "Tall obstacles, with the long hatched shadow, block sight: no shots or spells through them. Dark tiles in the action zone are out of sight.", "Los obstáculos altos, con la sombra rayada larga, bloquean la vista: ni disparos ni conjuros a través. Las casillas oscuras de la zona de acción están fuera de vista."]],
  ["sun", TER_INFO.holy[0], TER_INFO.holy[1]],
  ["burst", ["Bersagli esposti", "Exposed targets", "Objetivos expuestos"], ["Un nemico fiancheggiato in mischia, o senza copertura e già impegnato da un tuo alleato, è esposto (✸): i colpi critici arrivano con 18, 19 e 20. Vale anche contro di te.", "An enemy flanked in melee, or without cover and already engaged by one of your allies, is exposed (✸): critical hits land on 18, 19 and 20. It works against you too.", "Un enemigo flanqueado cuerpo a cuerpo, o sin cobertura y ya trabado por un aliado tuyo, está expuesto (✸): los críticos llegan con 18, 19 y 20. También vale contra ti."]],
  ["wind", ["Movimento e zone d'azione", "Movement and action zones", "Movimiento y zonas de acción"], ["Tocca una casella per vedere il percorso, poi tocca di nuovo o premi Vai. Punti blu: movimento; punti dorati: serve lo Scatto. Zone: rosso attacco, arancione incantesimi e abilità, giallo guardia.", "Tap a tile to see the path, then tap again or press Go. Blue dots: movement; golden dots: needs a Dash. Zones: red attack, orange spells and abilities, yellow overwatch.", "Toca una casilla para ver el recorrido y vuelve a tocar o pulsa Ir. Puntos azules: movimiento; dorados: requiere Correr. Zonas: rojo ataque, naranja conjuros y habilidades, amarillo vigilancia."]],
  ["crown", ["Capi", "Leaders", "Jefes"], ["Alcuni gruppi seguono un capo, segnato dalla corona. Ascolta cosa dicono i nemici: se il capo cade, i seguaci potrebbero darsi alla fuga e lo scontro finisce.", "Some groups follow a leader, marked by a crown. Listen to what the enemies say: if the leader falls, the followers may flee and the fight ends.", "Algunos grupos siguen a un jefe, marcado con una corona. Escucha lo que dicen los enemigos: si el jefe cae, los seguidores pueden huir y el combate termina."]],
);
const _extraOptsT = extraOptsHTML;
extraOptsHTML = function () {
  return `<h3>${tr(["Movimento in combattimento", "Combat movement", "Movimiento en combate"])}</h3><div class="seg"><button data-qm="0" aria-pressed="${!PREF.quickMove}">${tr(["Con conferma", "With confirmation", "Con confirmación"])}</button><button data-qm="1" aria-pressed="${!!PREF.quickMove}">${tr(["Immediato", "Immediate", "Inmediato"])}</button></div>` + _extraOptsT();
};
const _openMenuT = openMenu;
openMenu = function (tab) {
  _openMenuT(tab);
  if (tab === "opts") document.querySelectorAll(".modal [data-qm]").forEach(b => b.onclick = () => { PREF.quickMove = b.dataset.qm === "1"; store(PREF_KEY, PREF); openMenu("opts"); });
};
