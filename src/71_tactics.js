/* =================== TACTICAL LAYER: deployment, risk preview, inspection, tips =================== */
Object.assign(ICONS, {help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.2h.01"/>'});
const TIPS = [
  ["shield", ["Copertura", "Cover", "Cobertura"], ["Ostacoli o creature tra il tiratore e il bersaglio danno +2 CA (mezza) o +5 (tre quarti). Vale anche per te: riparati dietro rocce e colonne.", "Obstacles or creatures between shooter and target give +2 AC (half) or +5 (three-quarters). It works for you too: hide behind rocks and pillars.", "Obstáculos o criaturas entre el tirador y el objetivo dan +2 CA (media) o +5 (tres cuartos). También te protege a ti: escóndete tras rocas y columnas."]],
  ["swords", ["Fianco", "Flanking", "Flanqueo"], ["Attacca in mischia un nemico che ha un tuo alleato sul lato opposto: hai vantaggio. I lupi cacciano in branco e fanno lo stesso con te.", "Melee an enemy with one of your allies on the opposite side: you get advantage. Wolves hunt in packs and do the same to you.", "Ataca cuerpo a cuerpo a un enemigo con un aliado tuyo en el lado opuesto: tienes ventaja. Los lobos cazan en manada y te lo hacen a ti."]],
  ["end", ["Attacchi d'opportunità", "Opportunity attacks", "Ataques de oportunidad"], ["Allontanarsi da un nemico adiacente gli concede un attacco gratuito. Usa Disimpegno per sganciarti. Le caselle con il punto arancione sono a rischio.", "Moving away from an adjacent enemy gives it a free attack. Use Disengage to break away. Tiles with an orange dot are risky.", "Alejarte de un enemigo adyacente le da un ataque gratis. Usa Retirada para separarte. Las casillas con punto naranja son peligrosas."]],
  ["eye", ["Guardia", "Overwatch", "Vigilancia"], ["Termina il turno pronto a colpire: il primo nemico che si muove entro la tua portata subisce un attacco. Gli arcieri nemici fanno lo stesso: occhio al simbolo ◉.", "End your turn ready to strike: the first enemy that moves within your reach takes an attack. Enemy archers do it too: watch for the ◉ symbol.", "Termina el turno listo para golpear: el primer enemigo que se mueva a tu alcance recibe un ataque. Los arqueros enemigos también: atento al símbolo ◉."]],
  ["hand", ["Atterrare", "Knock down", "Derribar"], ["Al posto di un attacco butti a terra un nemico adiacente: gli attacchi in mischia contro di lui hanno vantaggio e rialzarsi gli costa metà movimento.", "Instead of an attack, knock an adjacent enemy prone: melee attacks against it have advantage and standing up costs half its movement.", "En lugar de un ataque, derriba a un enemigo adyacente: los ataques cuerpo a cuerpo contra él tienen ventaja y levantarse le cuesta la mitad del movimiento."]],
  ["star", ["Sfide e bottino", "Challenges and loot", "Desafíos y botín"], ["Vinci senza caduti o in pochi round per avere ricompense extra. I nemici più forti custodiscono oggetti magici unici.", "Win with nobody down or within a few rounds for extra rewards. The strongest foes carry unique magic items.", "Gana sin caídos o en pocas rondas para obtener recompensas extra. Los enemigos más fuertes guardan objetos mágicos únicos."]],
];
function showTips(force) {
  if (!force && (PREF.tipsSeen || 0) >= 2) return; PREF.tipsSeen = 2; store(PREF_KEY, PREF);
  const m = modal(`<h2>${tr(["Tattica", "Tactics", "Táctica"])}</h2><p style="color:var(--muted);font-size:14px">${tr(["Prima di ogni scontro puoi schierare il gruppo: tocca un personaggio e poi una casella dorata.", "Before each fight you can deploy the party: tap a character, then a golden tile.", "Antes de cada combate puedes desplegar al grupo: toca un personaje y luego una casilla dorada."])}</p>
    <div class="tips">${TIPS.map(([ic, n, d]) => `<div class="tip">${medHTML(ic, "sm")}<div><b>${tr(n)}</b><p>${tr(d)}</p></div></div>`).join("")}</div>
    <button class="btn primary" id="tipX" style="margin-top:12px">${T_("goOn")}</button>`, {center: 1});
  m.querySelector("#tipX").onclick = closeModal;
}
function showTipsOnce() { if ((PREF.tipsSeen || 0) < 2) setTimeout(() => showTips(), 350); }

/* ---------- deployment ---------- */
const depZone = (x, y) => y >= ROWS - 2 && !CB.ob.has(K(x, y));
function deployTap(x, y) {
  const t = unitAt(x, y), sel = CB.depSel;
  if (t && t.side === "p") { if (sel && sel !== t) { const sx = sel.x, sy = sel.y; sel.x = t.x; sel.y = t.y; t.x = sx; t.y = sy; CB.depSel = null; } else CB.depSel = sel === t ? null : t; SFX.ui(); }
  else if (sel && !t && depZone(x, y)) { sel.x = x; sel.y = y; CB.depSel = null; SFX.step(); }
  renderCombat();
}
const _onCellT = onCell;
onCell = async function (x, y) { if (CB && CB.deploy) return deployTap(x, y); return _onCellT(x, y); };

/* ---------- risk of moving to a tile ---------- */
function tileRisk(u, R, k) {
  const path = pathTo(R, k);
  for (let i = 1; i < path.length; i++) { const [fx, fy] = path[i - 1].split(",").map(Number), [tx, ty] = path[i].split(",").map(Number);
    if (provokers(u, {x: fx, y: fy}, {x: tx, y: ty}).length) return "oa";
    if (CB.fire && CB.fire[path[i]]) return "fire";
    for (const o of CB.units) if (o.side !== u.side && o.cond.ow && canReact(o)) { const p = owProfile(o), q = {x: tx, y: ty}; if (p && dist(o, q) <= effR(o, p.r) && sees(o, q, p.r)) return "ow"; } }
  return null;
}

/* ---------- status markers ---------- */
const _placeTokensT = placeTokens;
placeTokens = function () {
  _placeTokensT(); if (!CB) return;
  CB.units.forEach(u => { const st = $("#t_" + u.uid + " .st"); if (!st) return; let h = "";
    if (u.cond.ow) h += `<i class="c-o">◉</i>`; if (u.cond.prone) h += `<i class="c-x">▽</i>`; if (u.cond.power) h += `<i class="c-b">✸</i>`; if (u.cond.dis) h += `<i>»</i>`;
    if (h) st.insertAdjacentHTML("beforeend", h);
    const tk = $("#t_" + u.uid); if (tk) tk.classList.toggle("depsel", !!CB.deploy && CB.depSel === u); });
};

/* ---------- render additions ---------- */
const _renderCombatT = renderCombat;
renderCombat = function () {
  _renderCombatT(); if (!CB || !$("#board")) return;
  if (!$("#helpB")) { $("#ini").insertAdjacentHTML("afterbegin", `<button class="iconbtn helpb" id="helpB" aria-label="?">${icon("help")}</button>`); $("#helpB").onclick = () => showTips(true); }
  if (CB.deploy) return renderDeploy();
  const u = cur(), mine = u && u.side === "p" && !CB.busy && !CB.ended;
  let risky = false;
  if (mine && u.mv > 0) { const R = reachOf(u, u.mv);
    document.querySelectorAll("#board .cell.reach").forEach(cel => { const k = K(+cel.dataset.x, +cel.dataset.y); if (!R.has(k)) return; const r = tileRisk(u, R, k); if (r) { cel.classList.add("risk"); risky = true; } }); }
  if (mine && CB.sel) { const sp = selSpec(u);
    if (sp.tgt === "enemy") CB.units.forEach(o => { const tk = $("#t_" + o.uid); if (!tk || !tk.classList.contains("tg")) return; const ai = advInfo(u, o, {ranged: sp.r > 1}); const ch = tk.querySelector(".chance");
      if (ai.adv && !ai.dis) ch.insertAdjacentHTML("afterbegin", `<i class="adv">▲</i>`); else if (ai.dis && !ai.adv) ch.insertAdjacentHTML("afterbegin", `<i class="dis">▼</i>`); }); }
  const info = $("#info");
  if (CB.inspect && CB.inspect.side === "e") { const e = CB.inspect, d = e.def, cd = e.cond;
    const atk = [...d.atk, ...(d.spells || [])].map(a => `${tr(a.n)} ${a.b != null ? sgn(a.b) + " · " : tr(["TS ","save ","salv. "]) + abS(a.save) + " " + a.dc + " · "}${a.d}${a.r > 1 ? " · " + a.r + "▸" : ""}`).join(" | ");
    const tags = []; if (d.vuln) tags.push(`<span class="vu">${tr(["vulnerabile","vulnerable","vulnerable"])}: ${d.vuln}</span>`); if (d.res) tags.push(`<span class="re">${tr(["resiste","resists","resiste"])}: ${d.res}</span>`); if (d.undead) tags.push(tr(["non morto","undead","muerto viviente"])); if (cd.ow) tags.push(tr(["in guardia","on overwatch","vigilando"])); if (cd.prone) tags.push(tr(["a terra","prone","derribado"]));
    if (mine) { const cv = coverOf(u, e); if (cv) tags.push(`${tr(COVER_T)} +${cv}`); }
    info.innerHTML = `<b>${esc(e.name)}</b><span class="cost-t a">${T_("ac")} ${e.ac}</span><p>${esc(atk)}</p><p class="hint">${tags.join(" · ")}</p>`; }
  else if (mine && risky) { const h = info.querySelector("p.hint"); if (h) h.insertAdjacentHTML("beforeend", ` · <span class="rk">● ${tr(["rischio di attacchi","risk of attacks","riesgo de ataques"])}</span>`); }
};
function renderDeploy() {
  document.querySelectorAll("#board .cell").forEach(cel => { const x = +cel.dataset.x, y = +cel.dataset.y, t = unitAt(x, y); cel.className = "cell" + (depZone(x, y) && !(t && t.side === "e") ? " dep" : ""); });
  placeTokens();
  $("#info").innerHTML = `<b>${tr(["Schieramento","Deployment","Despliegue"])}</b><span class="cost-t a">${CB.nFoes} ${tr(["nemici","enemies","enemigos"])}</span><p>${tr(["Tocca un personaggio, poi una casella dorata.","Tap a character, then a golden tile.","Toca un personaje y luego una casilla dorada."])}</p><p class="hint">${tr(["sfida: vinci entro","challenge: win within","desafío: gana en"])} ${3 + Math.ceil(CB.nFoes / 2)} ${tr(["round","rounds","rondas"])}</p>`;
  const s = CB.depSel;
  $("#cbp").innerHTML = s ? `<div class="por p">${icon(uIcon(s))}</div><div class="who2"><div class="nm"><b>${esc(s.name)}</b><small>${tr(CL(s.ref).n)}</small></div><div class="hpbar"><i style="width:${s.hp / s.maxhp * 100}%"></i><span>${s.hp} / ${s.maxhp}</span></div></div>` : `<div class="who2"><p class="hint" style="margin:0;color:var(--muted);font-family:var(--f-ui);font-size:13px">${tr(["Nessun personaggio selezionato","No character selected","Ningún personaje seleccionado"])}</p></div>`;
  $("#hot").innerHTML = `<button class="startb" id="startB">${icon("swords")}<span>${tr(["Inizia la battaglia","Begin the battle","Comenzar la batalla"])}</span></button>`;
  $("#startB").onclick = () => { SFX.turn("p"); startBattle(); };
  $("#aEnd").disabled = true;
}
