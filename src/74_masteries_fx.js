/* =================== WEAPON MASTERIES & BIG MOMENTS =================== */
// From the 2024 rules: fighters, paladins, rangers and rogues unlock the mastery of their weapons.
const MASTERY = {
  sap:    {n: ["Indebolire", "Sap", "Debilitar"], d: ["Se colpisci, il bersaglio ha svantaggio al suo prossimo attacco.", "On a hit, the target has disadvantage on its next attack.", "Si impactas, el objetivo tiene desventaja en su próximo ataque."], ic: "shield"},
  push:   {n: ["Spingere", "Push", "Empujar"], d: ["Se colpisci, spingi il bersaglio di un esagono. Se sbatte contro un ostacolo o un'altra creatura subisce 1d4 danni; spinto tra le fiamme, brucia.", "On a hit, you push the target one hex. If it slams into an obstacle or another creature it takes 1d4 damage; pushed into flames, it burns.", "Si impactas, empujas al objetivo un hexágono. Si choca con un obstáculo u otra criatura recibe 1d4 de daño; empujado a las llamas, arde."], ic: "wind"},
  slow:   {n: ["Rallentare", "Slow", "Ralentizar"], d: ["Se colpisci, il bersaglio ha 2 esagoni di movimento in meno nel suo prossimo turno.", "On a hit, the target has 2 fewer hexes of movement on its next turn.", "Si impactas, el objetivo tiene 2 hexágonos menos de movimiento en su próximo turno."], ic: "wind"},
  vex:    {n: ["Incalzare", "Vex", "Hostigar"], d: ["Se colpisci, hai vantaggio al tuo prossimo attacco contro lo stesso bersaglio.", "On a hit, you have advantage on your next attack against the same target.", "Si impactas, tienes ventaja en tu próximo ataque contra el mismo objetivo."], ic: "eye"},
  topple: {n: ["Rovesciare", "Topple", "Derribar"], d: ["Se colpisci, il bersaglio fa un TS Costituzione o cade a terra.", "On a hit, the target makes a Constitution save or falls prone.", "Si impactas, el objetivo hace una salvación de Constitución o cae derribado."], ic: "burst"},
};
const MASTER_CLS = ["fighter", "paladin", "ranger", "rogue"];
const masteryOf = (c, p) => c && MASTER_CLS.includes(c.cls) && WEAP[p.key] && WEAP[p.key].m || null;
async function applyMastery(u, t, p, hit) {
  if (u.side !== "p") return; const m = masteryOf(u.ref, p); if (!m || !hit) return;
  const name = tr(MASTERY[m].n), alive_ = () => t.hp > 0 && CB && !CB.ended;
  if (!alive_()) return;
  if (m === "sap") { t.cond.sapped = u.uid; floatAt(t, name, "#c9b8ff"); logL(`${u.name}: ${name} → ${t.name}`); }
  else if (m === "vex") { u.cond.vex = t.uid; floatAt(u, name, "#ffd38a"); logL(`${u.name}: ${name} → ${t.name}`); }
  else if (m === "slow") { t.cond.slow = 2; floatAt(t, name, "#9fd8ff"); logL(`${u.name}: ${name} → ${t.name}`); }
  else if (m === "topple") {
    if (t.boss) return; const dc = 8 + prof(u.ref) + Math.max(abm(u.ref, "str"), abm(u.ref, "dex"));
    if (!saveRoll(t, "con", dc)) { t.cond.prone = 1; floatAt(t, tr(["A terra!", "Prone!", "¡Derribado!"]), "#ffd38a", 1); logL(`${u.name}: ${name} → ${t.name}`); placeTokens(); await sleep(200); }
  } else if (m === "push") {
    if (t.boss) return; const [nx, ny] = opposite(u, t), k = K(nx, ny);
    const blocked = !inGrid(nx, ny) || CB.ob.has(k) || unitAt(nx, ny);
    logL(`${u.name}: ${name} → ${t.name}`);
    if (blocked) { if (inGrid(nx, ny)) { floatAt(t, tr(["Schianto!", "Slam!", "¡Choque!"]), "#ffd38a", 1); fxShake(); await applyDmg(t, rnd(4), "blunt", u); } }
    else { t.x = nx; t.y = ny; placeTokens(); fxDust(t); await sleep(220); if (CB.fire && CB.fire[k] && t.hp > 0) await burnUnit(t); }
  }
}
function masteryTurnStart(u) {
  // effects that last "until the start of the attacker's next turn" end now
  CB.units.forEach(o => { if (o.cond.sapped === u.uid) delete o.cond.sapped; });
  if (u.cond.vex) delete u.cond.vex;
  if (u.cond.slow) { u.mv = Math.max(1, u.mv - u.cond.slow); delete u.cond.slow; logL(`${u.name}: ${tr(MASTERY.slow.n)}`); }
}
// show the mastery of the selected weapon
const _renderCombatM = renderCombat;
renderCombat = function () {
  _renderCombatM(); if (!CB || CB.deploy) return; const u = cur();
  if (!u || u.side !== "p" || !CB.sel || CB.sel.k !== "w" || CB.mvp || CB.inspect) return;
  const p = weapProfile(u.ref, weaponsOf(u.ref)[CB.sel.i]), m = masteryOf(u.ref, p), h = $("#info p.hint");
  if (m && h) h.insertAdjacentHTML("beforeend", ` · <span class="mst">${icon(MASTERY[m].ic)} ${tr(MASTERY[m].n)}: ${tr(MASTERY[m].d)}</span>`);
  const st = []; CB.units.forEach(o => { const tk = $("#t_" + o.uid); if (!tk) return; const s = tk.querySelector(".st"); if (!s) return;
    if (o.cond.sapped && !s.querySelector(".c-sap")) s.insertAdjacentHTML("beforeend", `<i class="c-sap" title="${tr(MASTERY.sap.n)}">▾</i>`);
    if (o.cond.slow && !s.querySelector(".c-slow")) s.insertAdjacentHTML("beforeend", `<i class="c-slow" title="${tr(MASTERY.slow.n)}">≈</i>`);
    if (o.cond.prone && !s.querySelector(".c-pr")) s.insertAdjacentHTML("beforeend", `<i class="c-pr">⤓</i>`);
    if (o.cond.oil && !s.querySelector(".c-oil")) s.insertAdjacentHTML("beforeend", `<i class="c-oil">♨</i>`); });
};

/* ---------- big moments: critical hits and killing blows get a short "kill cam" ---------- */
async function bigMoment(t, kind) {
  if (!CB || PREF.lowfx) return; const bw = $("#bw"); if (!bw) return;
  bw.classList.remove("km", "kc"); void bw.offsetWidth; bw.classList.add(kind === "kill" ? "km" : "kc");
  setTimeout(() => bw && bw.classList.remove("km", "kc"), 700);
  if (kind === "kill") { const P = cpos(t), C = CB.cell; for (let i = 0; i < 26; i++) { const a = Math.random() * 6.28, v = 1 + Math.random() * 2.5; part({x: P.x, y: P.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .6, col: ["#ffe7a8", "#ffc04a", "#fff"][i % 3], size: 1.5 + Math.random() * 2.5, max: 30 + Math.random() * 20, g: .03, drag: .95, shape: "spark"}); } await sleep(420); }
}
const _applyDmgM = applyDmg;
applyDmg = async function (t, amt, type, src) {
  const was = t.side === "e" ? t.hp : null; await _applyDmgM(t, amt, type, src);
  if (CB && t.side === "e" && was > 0 && t.hp <= 0 && !t.fled && (t.boss || t.leader || foes().length === 0)) await bigMoment(t, "kill");
};
TIPS.push(["swords", ["Maestrie delle armi", "Weapon masteries", "Maestrías de armas"], ["Guerrieri, paladini, ranger e ladri sfruttano la maestria della loro arma quando colpiscono: Indebolire (spada lunga, mazza), Incalzare (stocco, spada corta, arco corto), Rallentare (arco lungo, giavellotto), Spingere (martello) e Rovesciare (bastone). Scegliendo l'arma vedi cosa fa.", "Fighters, paladins, rangers and rogues use their weapon's mastery when they hit: Sap (longsword, mace), Vex (rapier, shortsword, shortbow), Slow (longbow, javelin), Push (warhammer) and Topple (quarterstaff). Select the weapon to see what it does.", "Guerreros, paladines, exploradores y pícaros usan la maestría de su arma al impactar: Debilitar (espada larga, maza), Hostigar (estoque, espada corta, arco corto), Ralentizar (arco largo, jabalina), Empujar (martillo) y Derribar (bastón). Al elegir el arma ves qué hace."]]);
