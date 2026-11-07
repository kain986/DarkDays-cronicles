/* =================== TACTICAL ENCOUNTERS =================== */
// Signature fights get mechanics that reward thinking over trading blows. Each is declared on the
// encounter (ENC[key]) and handled here:
//   objs:   [[foe, x, y], ...]   objects on the board (braziers…): they don't act, but can be destroyed
//   ward:   {foe, by, heal}      the boss takes half damage and heals each round while any `by` object stands
//   ritual: {rounds, by, heal, spawn, bark}  if any `by` object still stands after N rounds, the rite completes
//   tele:   {foe, every, shape: "burst"|"row", rad, n, dmg, type, n:[name], bark}  telegraphed attack: the boss marks
//           hexes on its turn and strikes them at the start of its next turn — step out of the red hexes!
//   reinf:  [{r, foes, bark}]     reinforcements arriving at the start of round r
//   phase:  {foe, at, spawn, bark, tele}  when the boss drops below `at` of its HP: second phase
const DIFF_DMG = () => [.6, 1, 1.25][S.diff ?? 1];
Object.assign(FOES, {
  brazier: {n: ["Braciere d'ombra", "Shadow brazier", "Brasero de sombra"], hp: 10, ac: 10, spd: 0, ic: "flame", xp: 50, sv: 0, obj: 1, vuln: "cold", atk: []},
});
const tacEnc = () => CB && ENC[CB.key] || {};
const objsAlive = foe => CB.units.filter(u => u.obj && u.hp > 0 && (!foe || u.foe === foe));
function freeSpawn(rows) {
  const opts = []; for (const y of rows) for (let x = 0; x < COLS; x++) if (!CB.ob.has(K(x, y)) && !unitAtRaw(x, y)) opts.push([x, y]);
  return opts.length ? opts[Math.floor(Math.random() * opts.length)] : null;
}
function spawnFoe(k, x, y, extra = {}) {
  const d = FOES[k], hpMul = [.75, 1, 1.3][S.diff ?? 1], hp = Math.max(1, Math.round(d.hp * hpMul)), n = CB.units.filter(u => u.foe === k).length + 1;
  const u = Object.assign({uid: "e" + (CB.uidN = (CB.uidN || 100) + 1), side: "e", foe: k, def: d, name: tr(d.n) + (n > 1 ? " " + n : ""), hp, maxhp: hp, ac: d.ac, spd: d.spd || 6, icon: d.ic, boss: !!d.boss, obj: !!d.obj, x, y, cond: {}, react: 1, init: rnd(20)}, extra);
  CB.units.push(u); if (!u.obj) CB.order.push(u);
  return u;
}
// a token for a creature that appears mid-fight
function addToken(u) {
  const b = $("#board"); if (!b) return; const t = document.createElement("div"); t.className = "tok " + u.side + (u.boss ? " boss" : "") + (u.obj ? " obj" : ""); t.id = "t_" + u.uid;
  t.innerHTML = `<div class="in"><div class="base"></div><div class="aura"></div><svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="trk" cx="50" cy="50" r="46"/><circle class="hp" cx="50" cy="50" r="46"/></svg><div class="disc">${icon(uIcon(u))}</div><span class="st"></span><span class="chance"></span></div>`;
  b.appendChild(t);
  if (!u.obj && typeof miniSrc === "function") { const d = t.querySelector(".disc"); const img = document.createElement("img"); img.className = "mini"; img.alt = ""; img.src = miniSrc(u); d.replaceWith(img); }
}
function tacSetup(enc) {
  CB.tac = {log: []};
  (enc.objs || []).forEach(([k, x, y]) => { CB.ob.delete(K(x, y)); if (CB.ter) delete CB.ter[K(x, y)]; const o = unitAtRaw(x, y); if (o) { const s = freeSpawn([0, 1, 2]); if (s) { o.x = s[0]; o.y = s[1]; } } spawnFoe(k, x, y); });
  if (enc.ward) { const b = CB.units.find(u => u.foe === enc.ward.foe); if (b) b.ward = 1; }
}
const _buildCombatTac = buildCombat;
buildCombat = function () { _buildCombatTac(); if (!CB) return; CB.units.filter(u => u.obj).forEach(u => { const t = $("#t_" + u.uid); if (t) t.classList.add("obj"); }); };

/* ---------- start of each round ---------- */
function tacRound() {
  if (!CB || !CB.tac) return; const enc = tacEnc(), r = CB.round;
  (enc.reinf || []).forEach(w => { if (w.r !== r || CB.tac["rf" + r]) return; CB.tac["rf" + r] = 1; const got = [];
    w.foes.forEach(k => { const s = freeSpawn([0, 1]); if (s) got.push(spawnFoe(k, s[0], s[1])); });
    got.forEach(addToken); if (got.length) CB.tac.msg = {who: got[0], txt: tr(w.bark), log: tr(["Rinforzi!", "Reinforcements!", "¡Refuerzos!"])}; });
  if (enc.ward) { const b = CB.units.find(u => u.ward && u.hp > 0); if (b && objsAlive(enc.ward.by).length && b.hp < b.maxhp) { const h = Math.min(b.maxhp - b.hp, enc.ward.heal); if (h > 0) { b.hp += h; CB.tac.healed = {u: b, h}; } } }
  if (enc.ritual && !CB.tac.ritualDone && r > enc.ritual.rounds && objsAlive(enc.ritual.by).length) {
    CB.tac.ritualDone = 1; const b = CB.units.find(u => u.foe === enc.ward?.foe && u.hp > 0);
    if (b) { b.hp = Math.min(b.maxhp, b.hp + Math.ceil(b.maxhp / 2)); } const got = []; (enc.ritual.spawn || []).forEach(k => { const s = freeSpawn([0, 1, 2]); if (s) got.push(spawnFoe(k, s[0], s[1])); }); got.forEach(addToken);
    CB.tac.msg = {who: b || got[0], txt: tr(enc.ritual.bark), log: tr(["Il rito si è compiuto!", "The rite is complete!", "¡El rito se ha completado!"]), big: 1};
  }
  placeTokens();
}
// messages, healing and telegraphed strikes, at the start of a unit's turn
async function tacTurnStart(u) {
  if (!CB || !CB.tac) return false;
  if (CB.tac.healed) { const {u: b, h} = CB.tac.healed; CB.tac.healed = null; floatAt(b, "+" + h, "#b07ae8"); fxHeal(b, "#b07ae8"); logL(`${b.name}: +${h} ${T_("hp")} (${tr(["bracieri", "braziers", "braseros"])})`); await sleep(350); }
  if (CB.tac.msg) { const m = CB.tac.msg; CB.tac.msg = null; logL(m.log); if (m.big) fxShake(); if (m.who && typeof bark === "function") bark(m.who, m.txt, 2800); await sleep(1300); }
  const T = CB.tac.tele; if (T && T.by === u.uid) { CB.tac.tele = null; await resolveTele(T); if (!alive(u)) return true; }
  return false;
}
/* ---------- telegraphed attacks ---------- */
function teleCfg() { const e = tacEnc(); return CB.tac && CB.tac.phase2 && e.phase && e.phase.tele || e.tele; }
function planTele(u, cfg) {
  const targets = allies().filter(p => !p.down); if (!targets.length) return null; const cells = new Set();
  if (cfg.shape === "row") {
    const rows = {}; targets.forEach(p => rows[p.y] = (rows[p.y] || 0) + 1); const y = +Object.keys(rows).sort((a, b) => rows[b] - rows[a])[0];
    for (let x = 0; x < COLS; x++) cells.add(K(x, y));
  } else {
    const n = cfg.cnt || 1, picked = [];
    for (let i = 0; i < n; i++) { let best = null, bv = -1;
      targets.forEach(p => { if (picked.includes(p)) return; const v = targets.filter(q => dist(q, p) <= cfg.rad).length + (picked.length ? 0 : Math.random() * .5); if (v > bv) { bv = v; best = p; } });
      if (!best) break; picked.push(best);
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (dist({x, y}, best) <= cfg.rad && !CB.ob.has(K(x, y))) cells.add(K(x, y)); }
  }
  return {by: u.uid, cells, cfg};
}
async function resolveTele(T) {
  const u = CB.units.find(x => x.uid === T.by), cfg = T.cfg; if (!u || !alive(u)) return;
  logL(`${u.name}: ${tr(cfg.n)}!`);
  const hits = CB.units.filter(x => alive(x) && T.cells.has(K(x.x, x.y)) && x !== u);
  const centers = [...T.cells].map(k => k.split(",").map(Number)); fxShake();
  for (const [x, y] of centers.filter((_, i) => i % 3 === 0)) fxImpact({x, y}, cfg.type, true);
  await sleep(300);
  for (const t of hits) await applyDmg(t, Math.max(1, Math.round(roll(cfg.dmg).total * DIFF_DMG())), cfg.type, u);
  if (!hits.length) { logL(tr(["Nessuno è stato colpito.", "Nobody was hit.", "Nadie fue alcanzado."])); floatAt(u, tr(["Mancato!", "Missed!", "¡Fallado!"]), "#d8cdb8", 1); }
  if (cfg.type === "fire") T.cells.forEach(k => { const [x, y] = k.split(",").map(Number); igniteArea({x, y}, 0); });
  placeTokens(); renderCombat(); await sleep(350);
}
// the boss uses its turn to mark the next strike (every N of its turns); returns true if the turn is spent
async function tacEnemyAct(u) {
  const cfg = teleCfg(); if (!cfg || u.foe !== cfg.foe || CB.tac.tele) return false;
  u.teleN = (u.teleN || 0) + 1; if ((u.teleN - 1) % cfg.every) return false;
  const T = planTele(u, cfg); if (!T) return false; CB.tac.tele = T;
  logL(`${u.name}: ${tr(cfg.n)} — ${tr(["esci dagli esagoni rossi!", "get out of the red hexes!", "¡sal de los hexágonos rojos!"])}`);
  if (typeof bark === "function") bark(u, tr(cfg.bark), 2600);
  fxImpact(u, cfg.type, false); renderCombat(); await sleep(1100);
  return true;
}
/* ---------- damage: wards and second phases ---------- */
const _applyDmgTac = applyDmg;
applyDmg = async function (t, amt, type, src) {
  if (CB && t.ward && t.hp > 0 && objsAlive(tacEnc().ward && tacEnc().ward.by).length) { amt = Math.ceil(amt / 2); floatAt(t, tr(["Protetto", "Warded", "Protegido"]), "#b07ae8"); }
  await _applyDmgTac(t, amt, type, src);
  if (!CB) return; const e = tacEnc();
  if (t.obj && t.hp <= 0) { logL(`${t.name}: ${tr(["distrutto", "destroyed", "destruido"])}`); fxDeath(t);
    if (e.ward && !objsAlive(e.ward.by).length) { const b = CB.units.find(u => u.ward && u.hp > 0); if (b) { floatAt(b, tr(["Protezione spezzata!", "Ward broken!", "¡Protección rota!"]), "#ffd38a", 1); logL(tr(["Gli ultimi bracieri si spengono: la protezione è spezzata.", "The last braziers go out: the ward is broken.", "Los últimos braseros se apagan: la protección se ha roto."])); } } }
  const ph = e.phase;
  if (ph && !CB.tac.phase2 && t.foe === ph.foe && t.hp > 0 && t.hp <= t.maxhp * ph.at) {
    CB.tac.phase2 = 1; logL(tr(["Seconda fase!", "Second phase!", "¡Segunda fase!"])); fxShake();
    if (typeof bark === "function") bark(t, tr(ph.bark), 3000);
    const got = []; (ph.spawn || []).forEach(k => { const s = freeSpawn([0, 1, 2]); if (s) got.push(spawnFoe(k, s[0], s[1])); }); got.forEach(addToken); placeTokens(); await sleep(900);
  }
};

/* ---------- board: red hexes, objectives ---------- */
function goalLines() {
  const e = tacEnc(), L = [];
  if (!CB.tac) return L;
  if (CB.tac.tele) L.push(`<span class="warn">⚠ ${tr(teleCfg() ? teleCfg().n : ["Colpo", "Strike", "Golpe"])}: ${tr(["esci dagli esagoni rossi!", "leave the red hexes!", "¡sal de los hexágonos rojos!"])}</span>`);
  if (e.ward) { const n = objsAlive(e.ward.by).length; if (n) L.push(`${icon("flame")} ${e.ward.by === "brazier" ? tr(["Bracieri", "Braziers", "Braseros"]) : tr(FOES[e.ward.by].n)}: ${n} · ${tr(["capo protetto", "leader warded", "jefe protegido"])}`); }
  if (e.ritual && !CB.tac.ritualDone && objsAlive(e.ritual.by).length) { const left = e.ritual.rounds - CB.round + 1; L.push(`${icon("skull")} ${tr(["Il rito si compie tra", "The rite completes in", "El rito se completa en"])} ${Math.max(0, left)} ${tr(["round", "rounds", "rondas"])}`); }
  (e.reinf || []).forEach(w => { if (!CB.tac["rf" + w.r] && w.r - CB.round <= 2 && w.r > CB.round) L.push(`${icon("end")} ${tr(["Rinforzi in arrivo", "Reinforcements coming", "Refuerzos en camino"])}`); });
  return L;
}
const _renderCombatTac = renderCombat;
renderCombat = function () {
  _renderCombatTac(); if (!CB || !$("#board")) return;
  if (CB.tac && CB.tac.tele) document.querySelectorAll("#board .cell").forEach(c => { if (CB.tac.tele.cells.has(K(+c.dataset.x, +c.dataset.y))) c.classList.add("tele"); });
  const bw = $("#bw"); if (!bw) return; let gb = $("#goalbar"); const L = CB.deploy ? goalPreview() : goalLines();
  if (!L.length) { if (gb) gb.remove(); return; }
  if (!gb) { gb = document.createElement("div"); gb.id = "goalbar"; bw.appendChild(gb); }
  gb.innerHTML = L.map(l => `<div>${l}</div>`).join("");
};
// during deployment: what this fight is about
function goalPreview() {
  const e = tacEnc(), L = [];
  if (e.ward) L.push(`${icon("flame")} ${tr(["Il capo è protetto dai bracieri d'ombra: spegnili per ferirlo davvero.", "The leader is warded by the shadow braziers: put them out to really hurt him.", "El jefe está protegido por los braseros de sombra: apágalos para herirlo de verdad."])}`);
  if (e.ritual) L.push(`${icon("skull")} ${tr(["Se i bracieri bruciano ancora dopo", "If the braziers still burn after", "Si los braseros siguen ardiendo tras"])} ${e.ritual.rounds} ${tr(["round, il rito si compie.", "rounds, the rite completes.", "rondas, el rito se completa."])}`);
  if (e.tele) L.push(`⚠ ${tr(["Il nemico prepara colpi devastanti: quando vedi esagoni rossi, spostati.", "The enemy charges devastating strikes: when you see red hexes, move.", "El enemigo prepara golpes devastadores: cuando veas hexágonos rojos, muévete."])}`);
  if (e.reinf) L.push(`${icon("end")} ${tr(["Arriveranno rinforzi: chiudi in fretta o tieni la posizione.", "Reinforcements will arrive: finish fast or hold your ground.", "Llegarán refuerzos: acaba rápido o mantén la posición."])}`);
  if (e.phase) L.push(`${icon("crown")} ${tr(["Il boss ha una seconda fase.", "The boss has a second phase.", "El jefe tiene una segunda fase."])}`);
  return L;
}

/* ---------- the signature fights ---------- */
const TACB = {
  reinfGob: ["Snik chiama i cugini! Dal fienile!", "Snik calls the cousins! From the hayloft!", "¡Snik llama a los primos! ¡Del pajar!"],
  ritual: ["Il cerchio è chiuso… Morrhan, bevi!", "The circle is closed… Morrhan, drink!", "El círculo está cerrado… ¡Morrhan, bebe!"],
  lantern: ["La lanterna vede tutto… e brucia tutto!", "The lantern sees all… and burns all!", "¡La linterna lo ve todo… y lo quema todo!"],
  wave: ["L'acqua ricorda ogni annegato…", "The water remembers every drowned soul…", "El agua recuerda a cada ahogado…"],
  walls: ["Rinforzi dalle mura! Chiudete il cancello!", "Reinforcements from the walls! Shut the gate!", "¡Refuerzos desde las murallas! ¡Cerrad la puerta!"],
  guards: ["Guardie! Al salone!", "Guards! To the hall!", "¡Guardias! ¡Al salón!"],
  obsid: ["Il vetro si spezza… e ogni scheggia ha fame.", "The glass breaks… and every shard is hungry.", "El cristal se rompe… y cada astilla tiene hambre."],
  ser: ["Basta giocare, figlio mio.", "Enough games, my child.", "Se acabó el juego, hijo mío."],
  serT: ["Inginocchiati nell'ombra.", "Kneel in the shadow.", "Arrodíllate en la sombra."],
  maw: ["FAME.", "HUNGER.", "HAMBRE."],
};
Object.assign(ENC.mill, {reinf: [{r: 3, foes: ["goblin", "gobarcher"], bark: TACB.reinfGob}], tac: 1});
[["varga", 6], ["varga_small", 7]].forEach(([k, rounds]) => Object.assign(ENC[k], {objs: [["brazier", 0, 3], ["brazier", 6, 3]], ward: {foe: "varga", by: "brazier", heal: 3}, ritual: {rounds, by: "brazier", spawn: ["ghoul"], bark: TACB.ritual}, tac: 1}));
Object.assign(ENC.tower, {tele: {foe: "warden", every: 2, shape: "burst", rad: 1, dmg: "4d6", type: "fire", n: ["Lanterna del Guardiano", "Warden's Lantern", "Linterna del Guardián"], bark: TACB.lantern}, tac: 1});
Object.assign(ENC.keeper, {tele: {foe: "keeper", every: 2, shape: "row", dmg: "3d8", type: "cold", n: ["Onda nera", "Black wave", "Ola negra"], bark: TACB.wave}, tac: 1});
Object.assign(ENC.duke, {reinf: [{r: 2, foes: ["dukeguard"], bark: TACB.guards}]});
Object.assign(ENC.gate, {reinf: [{r: 3, foes: ["hknight", "acolyte"], bark: TACB.walls}], tac: 1});
["vault_boss", "vault_boss_hard"].forEach(k => Object.assign(ENC[k], {phase: {foe: "obsidian", at: .5, spawn: ["shade", "shade"], bark: TACB.obsid}, tac: 1}));
Object.assign(ENC.seraphine, {phase: {foe: "seraphine", at: .5, spawn: ["shade", "shade"], bark: TACB.ser, tele: {foe: "seraphine", every: 2, shape: "burst", rad: 1, dmg: "4d8", type: "necrotic", n: ["Abbraccio della Notte", "Embrace of Night", "Abrazo de la Noche"], bark: TACB.serT}}, tac: 1});
["avatar", "avatar_weak"].forEach(k => { if (!ENC[k]) return; const boss = ENC[k].foes.find(f => FOES[f].boss) || ENC[k].foes[0];
  Object.assign(ENC[k], {tele: {foe: boss, every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "3d8", type: "necrotic", n: ["Fauci di Morrhan", "Maw of Morrhan", "Fauces de Morrhan"], bark: TACB.maw}, tac: 1}); });

TIPS.push(["burst", ["Scontri tattici", "Tactical fights", "Combates tácticos"], ["Alcuni scontri hanno regole proprie, descritte nel riquadro in alto sulla mappa: bracieri che proteggono il capo, riti a tempo, rinforzi, boss con una seconda fase. Quando un nemico prepara un colpo, gli esagoni rossi mostrano dove cadrà al suo prossimo turno: spostati.", "Some fights have their own rules, shown in the box at the top of the map: braziers warding the leader, timed rites, reinforcements, bosses with a second phase. When an enemy charges a strike, the red hexes show where it will land on its next turn: move.", "Algunos combates tienen reglas propias, descritas en el recuadro de arriba del mapa: braseros que protegen al jefe, ritos con tiempo, refuerzos, jefes con segunda fase. Cuando un enemigo prepara un golpe, los hexágonos rojos muestran dónde caerá en su próximo turno: muévete."]]);
