/* =================== COMBAT =================== */
const COLS = 7, ROWS = 9;
let CB = null, CBSNAP = null;
const K = (x, y) => x + "," + y;
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const alive = u => u.side === "e" ? u.hp > 0 : !u.down;
const cur = () => CB.order[CB.ti];
const unitAt = (x, y) => CB.units.find(u => u.x === x && u.y === y && (u.side === "p" || u.hp > 0));
const foes = () => CB.units.filter(u => u.side === "e" && u.hp > 0);
const allies = () => CB.units.filter(u => u.side === "p");
const inGrid = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
const ABIL = {
  dash:{n:["Scatto","Dash","Correr"], d:["Azione: raddoppia il movimento.","Action: double your movement.","Acción: duplica tu movimiento."], cost:"act"},
  dodge:{n:["Schivata","Dodge","Esquivar"], d:["Azione: gli attacchi contro di te hanno svantaggio fino al tuo prossimo turno.","Action: attacks against you have disadvantage until your next turn.","Acción: los ataques contra ti tienen desventaja hasta tu siguiente turno."], cost:"act"},
  secondwind:{n:FEATS.secondwind, d:["Azione bonus: recuperi 1d10 + livello PF. Una volta per riposo.","Bonus action: regain 1d10 + level HP. Once per rest.","Acción adicional: recuperas 1d10 + nivel PG. Una vez por descanso."], cost:"bon"},
  actionsurge:{n:FEATS.actionsurge, d:["Gratis: ottieni un'azione extra. Una volta per riposo.","Free: gain an extra action. Once per rest.","Gratis: obtienes una acción extra. Una vez por descanso."], cost:"free"},
  lay:{n:FEATS.lay, d:["Azione, tocco: cura usando la riserva (5 × livello per riposo).","Action, touch: heal from your pool (5 × level per rest).","Acción, toque: cura usando la reserva (5 × nivel por descanso)."], cost:"act", tgt:"ally", r:1},
  smite:{n:FEATS.smite, d:["Gratis: il prossimo colpo in mischia spende uno slot per +2d8 radiosi (+1d8 contro non morti).","Free: your next melee hit spends a slot for +2d8 radiant (+1d8 vs undead).","Gratis: tu siguiente golpe cuerpo a cuerpo gasta un espacio para +2d8 radiante (+1d8 contra muertos vivientes)."], cost:"free"},
  cunning:{n:FEATS.cunning, d:["Azione bonus: scatto (raddoppia il movimento).","Bonus action: dash (double movement).","Acción adicional: correr (duplica el movimiento)."], cost:"bon"},
  turn:{n:FEATS.turn, d:["Azione: i non morti entro 6 caselle fanno un TS SAG o restano paralizzati 2 round. Una volta per riposo.","Action: undead within 6 tiles make a WIS save or are stunned for 2 rounds. Once per rest.","Acción: los muertos vivientes a 6 casillas hacen una salvación de SAB o quedan paralizados 2 rondas. Una vez por descanso."], cost:"act"},
  disengage:{n:["Disimpegno","Disengage","Retirada"], d:["Azione: puoi muoverti senza provocare attacchi d'opportunità per questo turno.","Action: you can move without provoking opportunity attacks this turn.","Acción: puedes moverte sin provocar ataques de oportunidad este turno."], cost:"act"},
  cunningdis:{n:["Disimpegno scaltro","Cunning disengage","Retirada astuta"], d:["Azione bonus: disimpegno (nessun attacco d'opportunità).","Bonus action: disengage (no opportunity attacks).","Acción adicional: retirada (sin ataques de oportunidad)."], cost:"bon"},
  overwatch:{n:["Guardia","Overwatch","Vigilancia"], d:["Azione: termini il turno pronto a colpire. Il primo nemico che si muove entro la tua portata subisce un attacco (reazione).","Action: end your turn ready to strike. The first enemy that moves within your reach takes an attack (reaction).","Acción: terminas el turno listo para golpear. El primer enemigo que se mueva a tu alcance recibe un ataque (reacción)."], cost:"act"},
  shove:{n:["Atterrare","Knock down","Derribar"], d:["Sostituisce un attacco: prova di Atletica contro il nemico adiacente. Se riesci cade a terra: gli attacchi in mischia contro di lui hanno vantaggio e rialzarsi gli costa metà movimento. Non funziona sui boss.","Replaces an attack: Athletics contest against an adjacent enemy. On success it falls prone: melee attacks against it have advantage and standing up costs half its movement. Doesn't work on bosses.","Sustituye un ataque: prueba de Atletismo contra un enemigo adyacente. Si lo logras cae derribado: los ataques cuerpo a cuerpo contra él tienen ventaja y levantarse le cuesta la mitad del movimiento. No funciona con jefes."], cost:"atk", tgt:"enemy", r:1},
  power:{n:["Colpo potente","Power attack","Golpe poderoso"], d:["Gratis: il prossimo attacco con l'arma ha −5 a colpire ma +10 ai danni.","Free: your next weapon attack takes −5 to hit but deals +10 damage.","Gratis: tu siguiente ataque con arma tiene −5 al ataque pero +10 al daño."], cost:"free"},
  spiritstrike:{n:["Colpo spirituale","Spiritual strike","Golpe espiritual"], d:["Azione bonus: l'arma spirituale colpisce (1d8 + mod, forza).","Bonus action: the spiritual weapon strikes (1d8 + mod, force).","Acción adicional: el arma espiritual golpea (1d8 + mod, fuerza)."], cost:"bon", tgt:"enemy", r:8},
};

function startCombat(key, win, surprise) {
  CBSNAP = JSON.stringify(S);
  const enc = ENC[key], mp = MAPS[enc.map];
  // scale to party size: a duo faces one fewer non-boss foe
  const fl = enc.foes.slice();
  if (S.party.length <= 2 && fl.length >= 3) { let wi = -1; fl.forEach((k, i) => { if (!FOES[k].boss && (wi < 0 || FOES[k].xp <= FOES[fl[wi]].xp)) wi = i; }); if (wi >= 0) fl.splice(wi, 1); }
  CB = {key, win, surprise, map: mp, units: [], order: [], ti: -1, round: 1, log: [], busy: false, sel: null, pend: null, xp: 0, gold: enc.gold || 0, ended: false, inspect: null, nFoes: fl.length, anyDown: false, deploy: !(typeof NO_DEPLOY !== "undefined" && NO_DEPLOY)};
  // obstacles, keeping the board connected
  for (let t = 0; t < 30; t++) {
    CB.ob = new Set(); let g = 0;
    while (CB.ob.size < mp.n && g++ < 200) { const x = Math.floor(Math.random() * COLS), y = 2 + Math.floor(Math.random() * (ROWS - 4)); CB.ob.add(K(x, y)); }
    if (connected()) break;
  }
  genTerrain();
  const ps = [[3,8],[2,8],[4,8],[3,7],[1,8],[5,8]];
  S.party.forEach((c, i) => { if (c.hp <= 0) c.hp = 1; CB.units.push({uid: "p_" + c.id, side: "p", ref: c, name: c.name.split(" ")[0], hp: c.hp, maxhp: c.maxhp, ac: acOf(c), spd: speedOf(c), icon: CL(c).icon, x: ps[i][0], y: ps[i][1], cond: {}, down: false, react: 1}); });
  const hpMul = [.75, 1, 1.3][S.diff ?? 1], cnt = {};
  fl.forEach(k => cnt[k] = (cnt[k] || 0) + 1);
  const seen = {};
  fl.forEach((k, i) => {
    const d = FOES[k]; seen[k] = (seen[k] || 0) + 1;
    let x, y, g = 0;
    if (d.boss) { x = 3; y = 0; while (unitAtRaw(x, y) && g++ < 20) x = (x + 1) % COLS; }
    else do { x = Math.floor(Math.random() * COLS); y = Math.floor(Math.random() * 3); } while ((unitAtRaw(x, y) || CB.ob.has(K(x, y))) && g++ < 100);
    const hp = Math.max(1, Math.round(d.hp * hpMul));
    CB.units.push({uid: "e" + i, side: "e", foe: k, def: d, name: tr(d.n) + (cnt[k] > 1 ? " " + seen[k] : ""), hp, maxhp: hp, ac: d.ac, spd: d.spd || 6, icon: d.ic, boss: !!d.boss, x, y, cond: surprise ? {surp: 1} : {}, react: 1});
  });
  if (enc.lead) { const L = CB.units.find(u => u.foe === enc.lead); if (L && CB.units.some(u => u.side === "e" && u !== L)) { CB.lead = L.uid; L.leader = 1; } }
  CB.units.forEach(u => u.init = rnd(20) + (u.side === "p" ? abm(u.ref, "dex") + (hasFeat(u.ref, "alert") ? 5 : 0) : (u.def.sv || 0)) + Math.random() * .1);
  CB.order = [...CB.units].sort((a, b) => b.init - a.init);
  showScreen("combat"); buildCombat();
  logL(tr(["Tiro per l'iniziativa…","Rolling initiative…","Tirando iniciativa…"]));
  if (surprise) logL(T_("surprised"));
  if (CB.deploy) { logL(tr(["Schieramento: tocca un tuo personaggio, poi una casella dorata.","Deployment: tap one of your characters, then a golden tile.","Despliegue: toca a uno de tus personajes y luego una casilla dorada."])); renderCombat(); showTipsOnce(); }
  else setTimeout(nextTurn, 450);
}
function startBattle() { if (!CB || !CB.deploy) return; CB.deploy = false; CB.depSel = null; renderCombat(); setTimeout(nextTurn, 250); }
function unitAtRaw(x, y) { return CB.units.find(u => u.x === x && u.y === y); }
function connected() {
  const seen = new Set([K(3, ROWS - 1)]), q = [[3, ROWS - 1]];
  while (q.length) { const [x, y] = q.shift(); for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const nx = x + dx, ny = y + dy, k = K(nx, ny); if (inGrid(nx, ny) && !CB.ob.has(k) && !seen.has(k)) { seen.add(k); q.push([nx, ny]); } } }
  return seen.size === COLS * ROWS - CB.ob.size;
}
function logL(s) { CB.log.push(s); if (CB.log.length > 80) CB.log.shift(); renderLog(); }

/* ---------- reach / BFS ---------- */
// movement cost: 1 per tile, +1 for difficult terrain, +1 to climb onto high ground.
// Paths of equal cost prefer fewer burning tiles, then straight lines.
function reachOf(u, limit, ai) {
  const res = new Map([[K(u.x, u.y), {d: 0, w: 0, pen: 0, p: null}]]), open = [[0, u.x, u.y]];
  while (open.length) {
    let bi = 0; for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
    const [w0, x, y] = open.splice(bi, 1)[0], cur0 = res.get(K(x, y)); if (w0 > cur0.w) continue;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx, ny = y + dy, k = K(nx, ny); if ((!dx && !dy) || !inGrid(nx, ny) || CB.ob.has(k)) continue;
      const o = unitAt(nx, ny); if (o && o.side !== u.side && alive(o)) continue;
      const nd = cur0.d + stepCost(x, y, nx, ny); if (nd > limit) continue;
      const pen = Math.min(999, cur0.pen + (CB.fire && CB.fire[k] ? (ai ? 60 : 20) : 0) + (dx && dy ? .01 : 0)), nw = nd * 1000 + pen;
      const e = res.get(k); if (e && e.w <= nw) continue;
      res.set(k, {d: nd, w: nw, pen, p: K(x, y)}); open.push([nw, nx, ny]);
    }
  }
  return res;
}
const freeTile = (x, y, self) => { const o = unitAt(x, y); return !CB.ob.has(K(x, y)) && (!o || o === self || (o.side === "e" && o.hp <= 0)); };
function pathTo(R, k) { const out = []; while (k) { out.unshift(k); k = R.get(k).p; } return out; }
// returns the movement spent (terrain-aware)
async function walk(u, path) {
  let spent = 0; u.mvStop = false;
  for (let i = 1; i < path.length; i++) {
    const [x, y] = path[i].split(",").map(Number);
    const stop = await provoke(u, {x: u.x, y: u.y}, {x, y});
    if (stop || !alive(u) || !CB || CB.ended) { if (stop) u.mvStop = true; return spent; }
    spent += stepCost(u.x, u.y, x, y); u.x = x; u.y = y; placeTokens(); fxDust(u); await sleep(150);
    if (CB.fire && CB.fire[K(x, y)]) await burnUnit(u);
    if (!alive(u) || !CB || CB.ended) return spent;
    await overwatchCheck(u);
    if (!alive(u) || !CB || CB.ended) return spent;
  }
  return spent;
}
function meleeOf(o) {
  if (o.side === "p") { const c = o.ref, ws = weaponsOf(c), i = ws.findIndex(w => !WEAP[w].ranged); if (i < 0) return null; const p = weapProfile(c, ws[i]);
    return {hit: p.hit, dice: p.dice, flat: p.flat, type: p.t, weapon: 1, finesse: p.finesse, reach: 1, crit: hasF(c, "impcrit") ? 19 : 20}; }
  const a = o.def.atk.find(a => !a.ranged && a.r <= 2); if (!a) return null;
  return {hit: a.b + (S.diff === 0 ? -1 : S.diff === 2 ? 1 : 0), dice: a.d, type: a.t, reach: a.r};
}
function owProfile(o) {
  if (o.side === "p") { const c = o.ref, ws = weaponsOf(c), i = ws.findIndex(w => WEAP[w].ranged);
    if (i >= 0) { const p = weapProfile(c, ws[i]); return {hit: p.hit, dice: p.dice, flat: p.flat, type: p.t, ranged: 1, weapon: 1, r: p.r}; }
    if (spellsOf(c).includes("firebolt")) return {hit: spellAtk(c), dice: c.lvl >= 5 ? "2d10" : "1d10", type: "fire", ranged: 1, r: 10};
    const m = meleeOf(o); return m && Object.assign({r: 1}, m); }
  const a = o.def.atk[0]; return {hit: a.b + (S.diff === 0 ? -1 : S.diff === 2 ? 1 : 0), dice: a.d, type: a.t, ranged: !!a.ranged, r: a.r};
}
const canReact = o => alive(o) && (o.react || 0) > 0 && !o.cond.asleep && !o.cond.stun && !o.cond.surp;
function provokers(m, from, to) {
  if (m.side === "p" && hasFeat(m.ref, "mobile")) return [];
  return CB.units.filter(o => o.side !== m.side && canReact(o) && !o.cond.ow).filter(o => { const mp = meleeOf(o); if (!mp) return false; const r = mp.reach || 1;
    if (!(dist(o, from) <= r && dist(o, to) > r)) return false; return !m.cond.dis || (o.side === "p" && hasFeat(o.ref, "sentinel")); });
}
async function provoke(m, from, to) {
  let stopped = false;
  for (const o of provokers(m, from, to)) {
    if (!alive(m) || CB.ended) return true;
    o.react--; floatAt(o, tr(["Opportunità!","Opportunity!","¡Oportunidad!"]), "#ffb070", 1);
    logL(`${o.name}: ${tr(["attacco d'opportunità","opportunity attack","ataque de oportunidad"])}`);
    const dmg = await attackRoll(o, m, meleeOf(o));
    if (dmg && o.side === "p" && hasFeat(o.ref, "sentinel")) { stopped = true; floatAt(m, tr(["Bloccato!","Stopped!","¡Detenido!"]), "#e8d8a8", 1); }
  }
  return stopped;
}
async function overwatchCheck(m) {
  for (const o of CB.units.filter(o => o.side !== m.side && o.cond.ow && canReact(o))) {
    if (!alive(m) || CB.ended) return; const p = owProfile(o); if (!p) continue;
    if (dist(o, m) > effR(o, p.r || 1)) continue;
    if (p.r > 1 && dist(o, m) > 1 && (!canSee(o, m) || coverOf(o, m) >= 5)) continue;
    o.react--; delete o.cond.ow; floatAt(o, tr(["Guardia!","Overwatch!","¡Vigilancia!"]), "#9fd0ff", 1);
    logL(`${o.name}: ${tr(["fuoco di guardia","overwatch shot","disparo de vigilancia"])}`);
    await attackRoll(o, m, p);
  }
}

/* ---------- turn flow ---------- */
function checkEnd() {
  if (CB.ended) return true;
  if (CB.units.filter(u => u.side === "e").every(u => u.hp <= 0)) { CB.ended = true; setTimeout(winCombat, 600); return true; }
  if (allies().every(u => u.down)) { CB.ended = true; setTimeout(loseCombat, 700); return true; }
  return false;
}
async function nextTurn() {
  if (!CB || checkEnd()) return;
  let guard = 0;
  do { CB.ti++; if (CB.ti >= CB.order.length) { CB.ti = 0; CB.round++; CB.newRound = true; tickFire(); } } while (!alive(CB.order[CB.ti]) && guard++ < 50);
  const u = cur(); u.mv = u.spd; u.act = 1; u.bon = 1; u.atkLeft = 0; u.sneakUsed = 0; u.colUsed = 0; u.react = 1; delete u.cond.dodge; delete u.cond.dis; delete u.cond.ow; delete u.cond.power;
  if (u.cond.prone && !u.cond.asleep && !u.cond.stun) { delete u.cond.prone; u.mv = Math.floor(u.spd / 2); logL(`${u.name}: ${tr(["si rialza","stands up","se levanta"])}`); }
  if (u.side === "e" && u.def.gob) u.cond.dis = 1;
  if (u.side === "p" && u.ref.trinket === "periapt" && u.hp < u.maxhp / 2) heal(u, 2);
  CB.sel = null; CB.pend = null; CB.inspect = null; CB.mvp = null; CB.tileInfo = null;
  const tok = CB.turnTok = (CB.turnTok || 0) + 1;
  CB.busy = true; renderCombat(); await turnBanner(u);
  if (!CB || CB.turnTok !== tok) return; CB.busy = false;
  if (!CB.introDone) { CB.introDone = true; await leaderIntro(); if (!CB || CB.turnTok !== tok) return; }
  if (await terrainTurnStart(u)) { if (!CB) return; if (!checkEnd()) setTimeout(nextTurn, 250); return; }
  if (u.side === "e") {
    // spirit guardians
    for (const p of allies()) if (!p.down && p.cond.sg && dist(p, u) <= 2 && u.hp > 0) { const ok = saveRoll(u, "wis", spellDC(p.ref)); const dmg = roll("3d8").total; logL(`${tr(SPELLS.spiritguardians.n)} → ${u.name}`); await applyDmg(u, ok ? Math.floor(dmg / 2) : dmg, "radiant", p); }
    if (u.hp <= 0) { if (!checkEnd()) setTimeout(nextTurn, 200); return; }
  }
  if (u.cond.surp) { delete u.cond.surp; renderCombat(); await sleep(250); return endTurn(); }
  if (u.cond.asleep) { if (--u.cond.asleep <= 0) delete u.cond.asleep; logL(`${u.name}: Zz…`); renderCombat(); await sleep(350); return endTurn(); }
  if (u.cond.stun) { if (--u.cond.stun <= 0) delete u.cond.stun; logL(`${u.name} ${T_("stunned")}`); renderCombat(); await sleep(400); return endTurn(); }
  if (u.side === "e") { CB.busy = true; renderCombat(); await sleep(380); await followerBark(u); if (!CB || CB.ended) return; await aiTurn(u); CB.busy = false; return endTurn(); }
  CB.sel = defaultSel(u); renderCombat();
}
function endTurn() { if (!CB || CB.ended) return; CB.busy = true; renderCombat(); setTimeout(() => { if (CB) { CB.busy = false; nextTurn(); } }, 160); }
function defaultSel(u) { const c = u.ref; if (c.cls === "wizard") return {k: "sp", key: "firebolt"}; return {k: "w", i: 0}; }

/* ---------- selection specs ---------- */
function selSpec(u, s) {
  s = s || CB.sel; if (!s) return {tgt: "none"};
  if (s.k === "w") { const p = weapProfile(u.ref, weaponsOf(u.ref)[s.i]); return {tgt: "enemy", r: effR(u, p.r), base: p.r}; }
  if (s.k === "sp") { const sp = SPELLS[s.key]; return {tgt: sp.tgt, r: sp.tgt === "enemy" ? effR(u, sp.r || 0) : sp.r || 0, base: sp.r || 0, rad: sp.rad || 0}; }
  if (s.k === "ab") { const a = ABIL[s.key]; return {tgt: a.tgt || "none", r: a.r || 0}; }
  if (s.k === "it") { const it = ITEMS[s.key]; if (it.tgt) return {tgt: it.tgt, r: it.r || 0, rad: it.rad || 0}; return it.use === "throw" ? {tgt: "enemy", r: effR(u, 5), base: 5} : {tgt: "ally", r: 1}; }
  return {tgt: "none"};
}
function slotFor(c, lv) { for (let i = lv - 1; i < 4; i++) if (c.slots[i] > 0) return i; return -1; }
function canUse(u, s) {
  const c = u.ref;
  if (s.k === "w") return u.atkLeft > 0 || u.act > 0;
  if (s.k === "sp") { const sp = SPELLS[s.key]; if (sp.bonus ? u.bon <= 0 : u.act <= 0) return false; return sp.lv === 0 || slotFor(c, sp.lv) >= 0; }
  if (s.k === "it") return u.act > 0 && (S.inv[s.key] || 0) > 0;
  if (s.k === "ab") { const a = ABIL[s.key], k = s.key;
    if (a.cost === "act" && u.act <= 0) return false; if (a.cost === "bon" && u.bon <= 0) return false; if (a.cost === "atk" && u.act <= 0 && u.atkLeft <= 0) return false;
    if (k === "power") return !u.cond.power && (u.act > 0 || u.atkLeft > 0); if (k === "overwatch") return !!owProfile(u); if (k === "cunningdis" || k === "disengage") return !u.cond.dis;
    if (k === "secondwind") return c.res.sw > 0; if (k === "actionsurge") return c.res.as > 0; if (k === "lay") return c.res.lay > 0;
    if (k === "smite") return !u.cond.smite && slotFor(c, 1) >= 0; if (k === "turn") return c.res.ch > 0; if (k === "spiritstrike") return !!u.cond.sw;
    return true; }
  return false;
}
function abilitiesOf(u) {
  const c = u.ref, L = ["dash", "disengage", "dodge", "overwatch", "shove"];
  if (hasFeat(c, "gwm") || hasFeat(c, "sharpshooter")) L.push("power");
  if (hasF(c, "secondwind")) L.push("secondwind"); if (hasF(c, "actionsurge")) L.push("actionsurge");
  if (hasF(c, "lay")) L.push("lay"); if (hasF(c, "smite")) L.push("smite"); if (hasF(c, "cunning")) L.push("cunning", "cunningdis");
  if (hasF(c, "turn")) L.push("turn"); if (u.cond.sw) L.push("spiritstrike");
  return L;
}
function anyLeft(u) {
  if (u.act > 0 || u.atkLeft > 0 || u.mv > 0) return true;
  if (u.bon > 0) { if (abilitiesOf(u).some(k => ABIL[k].cost === "bon" && canUse(u, {k: "ab", key: k}))) return true; if (spellsOf(u.ref).some(k => SPELLS[k].bonus && canUse(u, {k: "sp", key: k}))) return true; }
  if (u.ref.res.as > 0 && hasF(u.ref, "actionsurge")) return true;
  return false;
}

/* ---------- input ---------- */
// sight to a target (ranged effects need line of sight; adjacent creatures are always visible)
const sees = (u, p, r) => r <= 1 || dist(u, p) <= 1 || canSee(u, p);
const quickMove = () => !!PREF.quickMove;
const dashOK = u => u.act > 0 || (hasF(u.ref, "cunning") && u.bon > 0);
async function onCell(x, y) {
  if (!CB || CB.busy || CB.ended) return; const u = cur(); if (!u || u.side !== "p") return;
  const t = unitAt(x, y), s = CB.sel, sp = selSpec(u), k = K(x, y), pend = CB.mvp;
  // tapping the highlighted destination again confirms the planned move
  if (pend && ((pend.k === k && !pend.then) || (pend.then && t === pend.then))) return confirmMove();
  CB.mvp = null; CB.tileInfo = null;
  if (t === u && !(s && canUse(u, s) && sp.tgt === "ally")) { CB.inspect = null; return renderCombat(); }
  if (s && canUse(u, s)) {
    if (sp.tgt === "area" && dist(u, {x, y}) <= sp.r && sees(u, {x, y}, sp.r)) { if (CB.pend && CB.pend.x === x && CB.pend.y === y) return execute(u, {x, y}); CB.pend = {x, y}; return renderCombat(); }
    if (sp.tgt === "tile" && dist(u, {x, y}) <= sp.r && sees(u, {x, y}, sp.r) && freeTile(x, y) && !unitAt(x, y)) return execute(u, {x, y});
    if (t && t.side === "e" && t.hp > 0 && sp.tgt === "enemy") {
      if (dist(u, t) <= sp.r && sees(u, t, sp.r)) return execute(u, t);
      // approach then attack: the closest tile from which the target is in range and in sight
      const R = reachOf(u, u.mv); let best = null;
      R.forEach((v, kk) => { const [ax, ay] = kk.split(",").map(Number), p = {x: ax, y: ay}; if (!freeTile(ax, ay, u)) return; const rr = effR(p, sp.base || sp.r);
        if (dist(p, t) <= rr && sees(p, t, rr) && (!best || v.w < best.w)) best = {k: kk, d: v.d, w: v.w}; });
      if (best) { const mv = {k: best.k, path: pathTo(R, best.k), cost: best.d, then: t}; if (quickMove() || best.k === K(u.x, u.y)) return doMove(u, mv); CB.mvp = mv; CB.inspect = t; return renderCombat(); }
    }
    if (t && t.side === "p" && sp.tgt === "ally" && dist(u, t) <= sp.r && sees(u, t, sp.r)) return execute(u, t);
  }
  if (!t && !CB.ob.has(k) && (u.mv > 0 || dashOK(u))) {
    const R = reachOf(u, u.mv); let RR = R, dash = false;
    if (!R.has(k) && dashOK(u)) { const R2 = reachOf(u, u.mv + u.spd); if (R2.has(k)) { RR = R2; dash = true; } }
    if (RR.has(k) && k !== K(u.x, u.y) && freeTile(x, y, u)) { const mv = {k, path: pathTo(RR, k), cost: RR.get(k).d, dash};
      if (quickMove()) return doMove(u, mv); CB.mvp = mv; CB.inspect = null; return renderCombat(); }
  }
  if (t) { CB.inspect = t; return renderCombat(); }
  CB.inspect = null; if (terInfoAt(k)) CB.tileInfo = k; renderCombat();
}
function confirmMove() { const u = cur(), mv = CB && CB.mvp; if (!mv || !u || CB.busy) return; return doMove(u, mv); }
async function doMove(u, mv) {
  CB.mvp = null; CB.busy = true; CB.pend = null;
  if (mv.dash) { if (hasF(u.ref, "cunning") && u.bon > 0) u.bon--; else u.act--; u.mv += u.spd; logL(`${u.name}: ${tr(ABIL.dash.n)}`); floatAt(u, tr(ABIL.dash.n), "#ffd38a", 1); }
  const st = await walk(u, mv.path); u.mv = Math.max(0, u.mv - st); if (u.mvStop) u.mv = 0; CB.busy = false;
  if (!CB || CB.ended) return;
  const t = mv.then, sp = selSpec(u);
  if (t && alive(u) && t.hp > 0 && CB.sel && canUse(u, CB.sel) && dist(u, t) <= sp.r && sees(u, t, sp.r)) return execute(u, t);
  renderCombat(); autoEnd(u);
}
async function execute(u, target) {
  CB.busy = true; CB.inspect = null; CB.mvp = null; const s = CB.sel;
  try {
    if (s.k === "w") await weaponAttack(u, target, s.i);
    else if (s.k === "sp") await castSpell(u, s.key, target);
    else if (s.k === "ab") await useAbility(u, s.key, target);
    else if (s.k === "it") await useItemC(u, s.key, target);
  } catch (e) { console.error(e); }
  CB.pend = null; CB.busy = false;
  if (checkEnd()) { renderCombat(); return; }
  if (!canUse(u, CB.sel) || CB.sel.k === "it" || CB.sel.k === "ab") CB.sel = canUse(u, defaultSel(u)) ? defaultSel(u) : CB.sel;
  renderCombat(); autoEnd(u);
}
function autoEnd(u) { if (CB && !CB.ended && cur() === u && (!alive(u) || !anyLeft(u))) setTimeout(() => { if (CB && cur() === u && !CB.busy && !CB.ended) endTurn(); }, 450); }

/* ---------- resolution ---------- */
function saveRoll(t, ab, dc, cov = 0) {
  let b; if (t.side === "p") { b = saveBonus(t.ref, ab); if (t.cond.bless) b += rnd(4); } else { b = (t.def.sv || 0) + (S.diff === 2 ? 1 : 0); }
  b += cov || 0;
  let r = rnd(20); if (t.side === "p" && t.ref.race === "halfling" && r === 1) r = rnd(20);
  const ok = r + b >= dc; logL(`${t.name}: ${abS(ab)} ${r}${sgn(b)}=${r + b} vs ${dc} — ${ok ? T_("saveOk") : T_("saveKo")}`); return ok;
}
function adjEnemies(a) { return CB.units.filter(o => o.side !== a.side && alive(o) && dist(o, a) <= 1); }
function allyNear(t, a) { return CB.units.some(o => o !== a && o.side === a.side && alive(o) && dist(o, t) <= 1); }
function flanked(a, t) { if (dist(a, t) !== 1) return false; const ox = 2 * t.x - a.x, oy = 2 * t.y - a.y; return CB.units.some(x => x !== a && x.side === a.side && alive(x) && x.x === ox && x.y === oy && !x.cond.asleep && !x.cond.stun && !x.cond.prone); }
function advInfo(a, t, o) {
  let adv = false, dis = false; const why = [];
  const melee = !o.ranged && dist(a, t) <= (o.reach || 1);
  if (t.cond.asleep || t.cond.stun) { adv = true; why.push("helpless"); }
  if (t.cond.guided) { adv = true; why.push("guided"); }
  if (t.cond.prone) { if (melee) { adv = true; why.push("prone"); } else { dis = true; why.push("pronefar"); } }
  if (melee && flanked(a, t)) { adv = true; why.push("flank"); }
  if (melee && a.side === "e" && a.def.pack && CB.units.some(x => x !== a && x.side === a.side && alive(x) && dist(x, t) <= 1)) { adv = true; why.push("pack"); }
  if (t.cond.dodge) { dis = true; why.push("dodge"); }
  if (a.cond.prone) { dis = true; why.push("selfprone"); }
  if (o.ranged && adjEnemies(a).length) { dis = true; why.push("closerange"); }
  if (t.side === "p" && t.ref.trinket === "cloak_displ" && t.dispR !== CB.round) { dis = true; why.push("displace"); }
  return {adv, dis, why};
}
function coverFor(a, t, o) { if (!(o.ranged || dist(a, t) > 1)) return 0; if (a.side === "p" && o.ranged && hasFeat(a.ref, "sharpshooter")) return 0; return coverOf(a, t); }
async function attackRoll(a, t, o) {
  const ai = advInfo(a, t, o); let adv = ai.adv, dis = ai.dis;
  if (t.cond.guided) delete t.cond.guided;
  if (ai.why.includes("displace")) t.dispR = CB.round;
  const r1 = a.side === "p" ? d20For(a.ref) : rnd(20); let r = r1;
  if (adv !== dis) { const r2 = a.side === "p" ? d20For(a.ref) : rnd(20); r = adv ? Math.max(r1, r2) : Math.min(r1, r2); }
  const pw = o.power ? -5 : 0, hb = highBonus(a, t, o), ex = exposed(a, t, o);
  let bl = a.cond.bless ? rnd(4) : 0, tot = r + o.hit + bl + pw + hb;
  const cov = coverFor(a, t, o), tac = t.ac + cov;
  let crit = r >= (o.crit || 20) - (ex ? 2 : 0); const hit = crit || (r !== 1 && tot >= tac);
  if (hit && t.cond.asleep && !o.ranged && dist(a, t) <= 1) crit = true;
  await fxAttackAnim(a, t, o);
  logL(`${a.name} → ${t.name}: ${r}${sgn(o.hit + bl + pw + hb)}=${tot} vs ${tac}${cov ? ` (${tr(COVER_T)} +${cov})` : ""}${hb ? " " + tr(["(altura)","(high ground)","(altura)"]) : ""}${adv !== dis ? (adv ? " ▲" : " ▼") : ""}${ai.why.includes("flank") ? " " + tr(["(fianco)","(flank)","(flanco)"]) : ""}${ex ? " " + tr(["(esposto)","(exposed)","(expuesto)"]) : ""} — ${hit ? (crit ? T_("crit") : T_("hits")) : T_("misses")}`);
  if (!hit && cov && tot >= t.ac && r !== 1) floatAt(t, tr(["Coperto!","Covered!","¡Cubierto!"]), "#e8d8a8", 1);
  if (!hit) { fxMiss(a, t); floatAt(t, T_("miss"), "#d8cdb8"); await sleep(380); return 0; }
  fxImpact(t, o.type, crit); if (crit) { floatAt(t, T_("crit"), "#ffd38a", 1); fxShake(); }
  let dmg = roll(crit ? critDice(o.dice) : o.dice).total + (o.flat || 0) + (o.power ? 10 : 0);
  if (a.side === "p") {
    const c = a.ref, und = t.def && t.def.undead;
    if (crit && c.race === "halforc" && o.weapon) dmg += roll("1" + o.dice.replace(/^\d*/, "").replace(/[+-].*$/, "")).total;
    if (t.cond.mark === a.uid) dmg += roll(crit ? "2d6" : "1d6").total;
    if (c.cls === "rogue" && o.weapon && (o.finesse || o.ranged) && !a.sneakUsed && (!dis || adv) && (adv || allyNear(t, a))) { a.sneakUsed = 1; const n = Math.ceil(c.lvl / 2) * (crit ? 2 : 1); dmg += roll(n + "d6").total; logL(tr(FEATS.sneak) + "!"); }
    if (hasF(c, "colossus") && o.weapon && !a.colUsed && t.hp < t.maxhp) { a.colUsed = 1; dmg += rnd(8); }
    if (hasF(c, "favored") && und) dmg += 2;
    if (o.weapon && !o.ranged && a.cond.smite) { const i = slotFor(c, 1); if (i >= 0) { c.slots[i]--; delete a.cond.smite; dmg += roll(((und ? 3 : 2) * (crit ? 2 : 1)) + "d8").total; logL(tr(FEATS.smite) + "!"); } }
    if (c.id === "pc" && has("took_flame")) dmg += rnd(4);
    if (c.trinket === "sun_talisman" && o.weapon && und) dmg += rnd(4);
  } else if (S.diff === 2) dmg += 1;
  await applyDmg(t, dmg, o.type, a);
  if (o.type === "fire" && o.ranged) igniteArea(t, 0);
  if (o.onHit && (t.side === "p" ? !t.down : t.hp > 0)) o.onHit(t);
  return dmg;
}
async function applyDmg(t, amt, type, src) {
  if (t.side === "e" && t.hp <= 0) return;
  if (t.side === "e") { if (t.def.vuln === type) amt *= 2; if (t.def.res === type) amt = Math.floor(amt / 2); }
  else { const c = t.ref; if ((type === "poison" && c.race === "dwarf") || (type === "fire" && c.race === "tiefling")) amt = Math.floor(amt / 2);
    if (hasF(c, "uncanny") && t.udRound !== CB.round && amt > 0) { t.udRound = CB.round; amt = Math.floor(amt / 2); } }
  amt = Math.max(0, Math.round(amt)); t.hp -= amt;
  floatAt(t, "−" + amt, t.side === "e" ? "#ffd38a" : "#ff8fa3"); shakeTok(t);
  if (t.cond.asleep) delete t.cond.asleep;
  if (t.hp <= 0) {
    if (t.side === "p") { if (t.ref.race === "halforc" && !t.relUsed) { t.relUsed = 1; t.hp = 1; logL(`${t.name}: ${tr(["Resistenza implacabile!","Relentless endurance!","¡Aguante incansable!"])}`); }
      else { t.hp = 0; t.down = true; CB.anyDown = true; delete t.cond.sg; delete t.cond.sw; delete t.cond.ow; delete t.cond.prone; logL(`${t.name} ${T_("down")}`); fxDeath(t, 1); } }
    else { t.hp = 0; CB.xp += t.def.xp; logL(`${t.name} ${T_("dies")}`); fxDeath(t); }
  }
  placeTokens(); await sleep(280);
  if (t.side === "e" && t.hp <= 0 && CB.lead === t.uid && !CB.routed) await leaderFalls(t);
}
function heal(t, amt) { if (t.side !== "p") return; amt = Math.max(1, amt); t.hp = Math.min(t.maxhp, t.hp + amt); if (t.down && t.hp > 0) t.down = false; floatAt(t, "+" + amt, "#9be0a6"); fxHeal(t); logL(`${t.name} ${T_("heals")} ${amt} ${T_("hp")}`); placeTokens(); }
const inArea = (c, rad) => CB.units.filter(o => dist(o, c) <= rad && (o.side === "p" || o.hp > 0));

function useAttack(u) { if (u.atkLeft > 0) u.atkLeft--; else { u.act--; u.atkLeft = (hasF(u.ref, "extra") ? 2 : 1) - 1; } }
const powerOK = (c, ranged) => ranged ? hasFeat(c, "sharpshooter") : hasFeat(c, "gwm");
async function weaponAttack(u, t, i) {
  const c = u.ref, p = weapProfile(c, weaponsOf(c)[i]); useAttack(u);
  const power = !!u.cond.power && powerOK(c, p.ranged); if (power) delete u.cond.power;
  await attackRoll(u, t, {hit: p.hit, dice: p.dice, flat: p.flat, type: p.t, ranged: p.ranged, weapon: 1, finesse: p.finesse, power, crit: hasF(c, "impcrit") ? 19 : 20});
  if (!p.ranged && t.hp <= 0 && hasFeat(c, "gwm") && u.bon > 0 && cur() === u) { u.bon--; u.atkLeft++; floatAt(u, tr(["Furia!","Cleave!","¡Furia!"]), "#ffd38a", 1); logL(`${u.name}: ${tr(["attacco bonus","bonus attack","ataque adicional"])}`); }
}
async function castSpell(u, key, target) {
  const sp = SPELLS[key], c = u.ref, m = castMod(c), dc = spellDC(c), atk = spellAtk(c);
  if (sp.bonus) u.bon--; else u.act--;
  if (sp.lv > 0) { const i = slotFor(c, sp.lv); if (i >= 0) c.slots[i]--; }
  logL(`${u.name}: ${tr(sp.n)}`);
  switch (key) {
    case "firebolt": await attackRoll(u, target, {hit: atk, dice: c.lvl >= 5 ? "2d10" : "1d10", type: "fire", ranged: 1}); break;
    case "sacredflame": await fxColumn(target, "radiant"); if (!saveRoll(target, "dex", dc)) await applyDmg(target, roll(c.lvl >= 5 ? "2d8" : "1d8").total, "radiant", u); else floatAt(target, T_("saveOk"), "#bdb3a4"); break;
    case "magicmissile": await fxProjectile(u, target, "force"); await applyDmg(target, roll("3d4+3").total, "force", u); break;
    case "sleep": { await fxArea(target, 1, "sleep"); let pool = roll("5d8").total; const ts = inArea(target, 1).filter(t => t.side === "e" && !t.def.undead && !t.def.construct && !t.cond.asleep).sort((a, b) => a.hp - b.hp);
      for (const t of ts) { if (t.hp <= pool) { pool -= t.hp; t.cond.asleep = 10; logL(`${t.name} ${T_("sleeps")}`); floatAt(t, "Zz", "#86a4da"); } else break; } placeTokens(); await sleep(300); break; }
    case "burninghands": case "fireball": case "icestorm": { const dice = {burninghands: "3d6", fireball: "8d6", icestorm: "2d8+4d6"}[key]; const ty = key === "icestorm" ? "cold" : "fire"; if (key !== "burninghands") await fxProjectile(u, target, ty); await fxArea(target, sp.rad, ty); const dmg = roll(dice).total;
      for (const t of inArea(target, sp.rad).filter(t => t !== u && alive(t))) { const ok = saveRoll(t, "dex", dc, coverOf(target, t)); await applyDmg(t, ok ? Math.floor(dmg / 2) : dmg, ty, u); }
      if (ty === "fire") igniteArea(target, sp.rad); break; }
    case "curewounds": heal(target, roll("1d8").total + m); break;
    case "healingword": heal(target, roll("1d4").total + m); break;
    case "masshealingword": allies().forEach(a => heal(a, roll("1d4").total + m)); break;
    case "bless": allies().filter(a => !a.down).forEach(a => fxHeal(a, "#ffd38a")); allies().filter(a => !a.down).forEach(a => a.cond.bless = 1); placeTokens(); break;
    case "guidingbolt": await attackRoll(u, target, {hit: atk, dice: "4d6", type: "radiant", ranged: 1, onHit: t => { t.cond.guided = 1; }}); break;
    case "huntersmark": foes().forEach(f => { if (f.cond.mark === u.uid) delete f.cond.mark; }); target.cond.mark = u.uid; fxImpact(target, "mark", false); placeTokens(); break;
    case "scorchingray": for (let i = 0; i < 3; i++) { let t = target.hp > 0 ? target : foes().filter(f => dist(u, f) <= 12).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!t) break; await attackRoll(u, t, {hit: atk, dice: "2d6", type: "fire", ranged: 1}); } break;
    case "mistystep": fxPoof(u); u.x = target.x; u.y = target.y; placeTokens(); fxPoof(u); await sleep(250); break;
    case "spiritualweapon": fxHeal(u, "#9fc4ff"); u.cond.sw = 1; break;
    case "spiritguardians": await fxArea(u, 2, "radiant"); u.cond.sg = 1; placeTokens(); break;
  }
}
async function useAbility(u, key, target) {
  const c = u.ref, a = ABIL[key];
  if (a.cost === "act") u.act--; if (a.cost === "bon") u.bon--; if (a.cost === "atk") useAttack(u);
  logL(`${u.name}: ${tr(a.n)}`);
  switch (key) {
    case "dash": case "cunning": u.mv += u.spd; break;
    case "dodge": fxHeal(u, "#9fc4ff"); u.cond.dodge = 1; placeTokens(); break;
    case "disengage": case "cunningdis": u.cond.dis = 1; fxPoof(u); break;
    case "overwatch": u.cond.ow = 1; u.atkLeft = 0; floatAt(u, tr(["Guardia","Overwatch","Vigilancia"]), "#9fd0ff", 1); placeTokens(); break;
    case "power": u.cond.power = 1; floatAt(u, "✸", "#ffd38a", 1); placeTokens(); break;
    case "shove": { if (target.boss) { floatAt(target, tr(["Troppo grande","Too big","Demasiado grande"]), "#e8d8a8", 1); break; }
      await fxAttackAnim(u, target, {type: "blunt"});
      const ra = rnd(20) + skillBonus(c, "ath"), rd = rnd(20) + (target.def.sv || 0) + 2;
      logL(`${u.name} → ${target.name}: ${tr(SKILLS.ath[0])} ${ra} vs ${rd}`);
      if (ra >= rd) { target.cond.prone = 1; fxImpact(target, "blunt", false); floatAt(target, tr(["A terra!","Prone!","¡Derribado!"]), "#ffd38a", 1); }
      else { fxMiss(u, target); floatAt(target, T_("saveOk"), "#d8cdb8"); }
      placeTokens(); await sleep(250); break; }
    case "secondwind": c.res.sw--; heal(u, rnd(10) + c.lvl); break;
    case "actionsurge": c.res.as--; u.act++; break;
    case "lay": { const amt = Math.min(c.res.lay, Math.max(1, target.maxhp - target.hp)); c.res.lay -= amt; heal(target, amt); break; }
    case "smite": u.cond.smite = 1; break;
    case "turn": c.res.ch--; await fxArea(u, 6, "radiant"); for (const f of foes().filter(f => f.def.undead && dist(f, u) <= 6)) { if (!saveRoll(f, "wis", spellDC(c))) { f.cond.stun = 2; floatAt(f, "×", "#86a4da"); } } placeTokens(); await sleep(300); break;
    case "spiritstrike": await attackRoll(u, target, {hit: spellAtk(c), dice: "1d8", flat: castMod(c), type: "force"}); break;
  }
}
async function useItemC(u, key, target) {
  const it = ITEMS[key]; u.act--; take(key); logL(`${u.name}: ${tr(it.n)}`);
  if (it.use === "heal") heal(target, roll(it.dice).total);
  else if (it.use === "scroll" && it.spell === "fireball") { await fxProjectile(u, target, "fire"); await fxArea(target, 2, "fire"); const dmg = roll("8d6").total;
    for (const t of inArea(target, 2).filter(t => t !== u && alive(t))) { const ok = saveRoll(t, "dex", 15, coverOf(target, t)); await applyDmg(t, ok ? Math.floor(dmg / 2) : dmg, "fire", u); } igniteArea(target, 2); }
  else if (it.use === "scroll" && it.spell === "massheal") allies().forEach(a => heal(a, roll("2d8+2").total));
  else await attackRoll(u, target, {hit: prof(u.ref) + abm(u.ref, "dex"), dice: "2d6", type: "fire", ranged: 1});
}

/* ---------- AI: utility-based positioning ---------- */
function avgDice(e) { let t = 0; String(e).replace(/\s/g, "").split(/(?=[+-])/).forEach(p => { let sg = 1; if (p[0] === "-") { sg = -1; p = p.slice(1); } else if (p[0] === "+") p = p.slice(1); const m = p.match(/^(\d*)d(\d+)$/); t += m ? sg * (+(m[1] || 1)) * (+m[2] + 1) / 2 : sg * (+p || 0); }); return t; }
function hitP(bonus, ac, adv, dis) { let p = Math.max(.05, Math.min(.95, (21 - (ac - bonus)) / 20)); if (adv && !dis) p = 1 - (1 - p) * (1 - p); else if (dis && !adv) p = p * p; return p; }
const atkBonusAI = () => S.diff === 0 ? -1 : S.diff === 2 ? 1 : 0;
function aiValue(u, t, opt) {
  // expected damage of using opt against t from u's current (possibly hypothetical) tile
  if (dist(u, t) > 1 && !canSee(u, t)) return 0;
  if (opt.sp && opt.sp.save) { const dc = opt.sp.dc; let v = 0; for (const p of inArea(t, opt.sp.rad || 0).filter(p => p.side === "p" && !p.down)) { const sb = saveBonus(p.ref, opt.sp.save); const ps = Math.max(.05, Math.min(.95, (21 - (dc - sb)) / 20)); v += avgDice(opt.sp.d) * (1 - ps * .5); } return v; }
  const a = opt.sp || opt.a, o = {ranged: a.r > 1, reach: a.r};
  const ai = advInfo(u, t, o), cov = (a.r > 1 || dist(u, t) > 1) ? coverOf(u, t) : 0;
  const p = hitP(a.b + atkBonusAI() + highBonus(u, t, o), t.ac + cov, ai.adv, ai.dis), d = avgDice(a.d) * (opt.a ? (a.k || 1) : 1);
  let v = p * d; if (exposed(u, t, o)) v *= 1.1;
  if (t.hp <= d) v *= 1.35;
  if (["wizard", "cleric"].includes(t.ref.cls)) v *= 1.15;
  if (a.para && t.ref.race !== "elf") v *= 1.2;
  return v;
}
function pickTarget(u, r, opt) {
  const o = opt || {a: u.def.atk[0]}; let best = null, bv = -1;
  for (const p of allies()) { if (p.down || dist(u, p) > effR(u, r) || (dist(u, p) > 1 && !canSee(u, p))) continue; const v = aiValue(u, p, o) + Math.random() * .4; if (v > bv) { bv = v; best = p; } }
  return best;
}
function aiReach(u) { return reachOf(u, u.mvAI, true); }
function pathRisk(u, path) {
  // expected damage from opportunity attacks and overwatch along a path
  let risk = 0; const ox = u.x, oy = u.y;
  for (let i = 1; i < path.length; i++) { const [fx, fy] = path[i - 1].split(",").map(Number), [tx, ty] = path[i].split(",").map(Number);
    if (!u.cond.dis) for (const o of provokers(u, {x: fx, y: fy}, {x: tx, y: ty})) { const m = meleeOf(o); risk += hitP(m.hit, u.ac, false, false) * avgDice(m.dice) + (m.flat || 0) * .6; }
    for (const o of allies().filter(o => o.cond.ow && canReact(o))) { const pr = owProfile(o), p = {x: tx, y: ty}; if (pr && dist(o, p) <= effR(o, pr.r) && (pr.r <= 1 || canSee(o, p))) risk += 5; }
    if (CB.fire && CB.fire[path[i]]) risk += 3.5; }
  u.x = ox; u.y = oy; return risk;
}
async function aiMoveToward(u) {
  // no target reachable this turn: close distance, preferring safe tiles
  const R = aiReach(u), targets = allies().filter(p => !p.down); let best = null;
  R.forEach((v, k) => { const [x, y] = k.split(",").map(Number); if (!freeTile(x, y, u)) return; const dd = Math.min(...targets.map(p => dist({x, y}, p))); const sc = dd * 3 + v.d * .2 + pathRisk(u, pathTo(R, k)) * .5; if (!best || sc < best.sc) best = {k, sc}; });
  if (best && best.k !== K(u.x, u.y)) await walk(u, pathTo(R, best.k));
}
async function aiTurn(u) {
  const d = u.def; u.mvAI = u.mv;
  if (d.aura) { u.auraCd = u.auraCd || 0;
    if (u.auraCd <= 0) { u.auraCd = d.aura.every - 1; logL(`${u.name}: ${tr(d.aura.n)}`); await fxArea(u, d.aura.rad, d.aura.t); const dmg = roll(d.aura.d).total;
      for (const p of allies().filter(p => !p.down && dist(p, u) <= d.aura.rad)) { const ok = saveRoll(p, d.aura.save, d.aura.dc); await applyDmg(p, ok ? Math.floor(dmg / 2) : dmg, d.aura.t, u); }
      if (checkEnd()) return; } else u.auraCd--; }
  let opt = null;
  if (d.spells) { const sp = d.spells[Math.floor(Math.random() * d.spells.length)]; if (Math.random() < sp.p) opt = {sp, r: sp.r}; }
  if (!opt) opt = {a: d.atk[0], r: d.atk[0].r};
  const ranged = opt.r > 1;
  // evaluate every reachable tile
  const R = aiReach(u), ox = u.x, oy = u.y; let best = null;
  R.forEach((v, k) => {
    const [x, y] = k.split(",").map(Number); if (!freeTile(x, y, u)) return;
    u.x = x; u.y = y;
    let val = 0; for (const p of allies()) if (!p.down && dist(u, p) <= effR(u, opt.r)) val = Math.max(val, aiValue(u, p, opt));
    let def = terrainScore(u, k);
    if (ranged) { const adj = allies().filter(p => !p.down && dist(u, p) <= 1).length; def -= adj * 4; for (const p of allies()) if (!p.down) def += coverOf(p, u) * .35; }
    u.x = ox; u.y = oy;
    const risk = v.d ? pathRisk(u, pathTo(R, k)) : 0;
    const sc = val + def - risk - v.d * .05 + (v.d === 0 ? .1 : 0);
    if (!best || sc > best.sc) best = {k, sc, val};
  });
  u.x = ox; u.y = oy;
  if (best && best.val > 0) { if (best.k !== K(u.x, u.y)) await walk(u, pathTo(R, best.k)); }
  else if (opt.sp) { opt = {a: d.atk[0], r: d.atk[0].r}; if (!pickTarget(u, opt.r, opt)) await aiMoveToward(u); }
  else await aiMoveToward(u);
  if (!CB || CB.ended || u.hp <= 0) return;
  let t = pickTarget(u, opt.r, opt);
  if (!t && opt.sp) { opt = {a: d.atk[0], r: d.atk[0].r}; t = pickTarget(u, opt.r, opt); }
  if (!t) { if (opt.r > 1 || (d.atk[0] && d.atk[0].ranged)) { u.cond.ow = 1; floatAt(u, tr(["Guardia","Overwatch","Vigilancia"]), "#9fd0ff", 1); logL(`${u.name}: ${tr(["resta in guardia","holds overwatch","se queda vigilando"])}`); placeTokens(); } return; }
  const atkB = atkBonusAI();
  if (opt.sp) {
    const sp = opt.sp; logL(`${u.name}: ${tr(sp.n)}`);
    if (sp.save) { await fxProjectile(u, t, sp.t); await fxArea(t, sp.rad || 0, sp.t); const dmg = roll(sp.d).total; for (const p of inArea(t, sp.rad || 0).filter(p => p.side === "p" && !p.down)) { const ok = saveRoll(p, sp.save, sp.dc + (S.diff === 2 ? 1 : S.diff === 0 ? -1 : 0), sp.save === "dex" ? coverOf(t, p) : 0); await applyDmg(p, ok ? Math.floor(dmg / 2) : dmg, sp.t, u); } if (sp.t === "fire") igniteArea(t, sp.rad || 0); }
    else { const dmg = await attackRoll(u, t, {hit: sp.b + atkB, dice: sp.d, type: sp.t, ranged: sp.r > 1}); if (sp.drain && dmg) { u.hp = Math.min(u.maxhp, u.hp + Math.floor(dmg / 2)); floatAt(u, "+" + Math.floor(dmg / 2), "#c9a7ff"); placeTokens(); } }
    return;
  }
  const a = opt.a;
  for (let i = 0; i < (a.k || 1); i++) {
    if (!t || t.down) t = pickTarget(u, a.r, opt); if (!t) break;
    const dmg = await attackRoll(u, t, {hit: a.b + atkB, dice: a.d, type: a.t, ranged: !!a.ranged, reach: a.r});
    if (dmg && a.para && !t.down && t.ref.race !== "elf" && !saveRoll(t, "con", a.para)) { t.cond.stun = 1; logL(`${t.name} ${T_("stunned")}`); placeTokens(); }
    if (checkEnd() || u.hp <= 0) return;
  }
}

/* ---------- end of battle ---------- */
function syncBack() { allies().forEach(a => { a.ref.hp = a.down ? 1 : Math.max(1, a.hp); }); }
