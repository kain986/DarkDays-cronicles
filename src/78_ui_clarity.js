/* =================== UI CLARITY: HP BARS, COMPACT SHEET, COMBAT PANEL =================== */

/* ---------- 1. health bars on the miniatures ---------- */
// A plain horizontal bar under every miniature (the old ring around the base was hidden by the minis).
const _placeTokensHP = placeTokens;
placeTokens = function () {
  _placeTokensHP(); if (!CB) return;
  CB.units.forEach(u => { const t = $("#t_" + u.uid); if (!t) return; const inr = t.querySelector(".in"); if (!inr) return;
    let b = inr.querySelector(".hpb"); if (!b) { inr.insertAdjacentHTML("beforeend", `<div class="hpb"><i></i><span></span></div>`); b = inr.querySelector(".hpb"); }
    const f = Math.max(0, Math.min(1, u.hp / u.maxhp)), gone = u.side === "e" ? u.hp <= 0 : u.down;
    b.style.display = gone ? "none" : "";
    const i = b.querySelector("i"); i.style.width = (f * 100) + "%";
    b.className = "hpb " + u.side + (u.obj ? " obj" : "") + (u.side === "p" ? (f < .35 ? " lo" : f < .65 ? " mid" : "") : "");
    // numbers on our characters, and on any enemy being looked at or targeted
    const showN = u.side === "p" || CB.inspect === u || t.classList.contains("tg");
    b.querySelector("span").textContent = showN ? Math.max(0, u.hp) : "";
  });
};

/* ---------- 2. compact character sheet ---------- */
const FEAT_D = {
  secondwind: ["Azione bonus: recuperi 1d10 + livello PF, una volta per riposo.", "Bonus action: regain 1d10 + level HP, once per rest.", "Acción adicional: recuperas 1d10 + nivel PG, una vez por descanso."],
  dueling: ["+2 ai danni con un'arma da mischia a una mano.", "+2 damage with a one-handed melee weapon.", "+2 al daño con un arma cuerpo a cuerpo a una mano."],
  actionsurge: ["Un'azione in più nel turno, una volta per riposo.", "One extra action on your turn, once per rest.", "Una acción más en tu turno, una vez por descanso."],
  impcrit: ["Colpo critico con 19 e 20.", "Critical hit on 19 and 20.", "Crítico con 19 y 20."],
  extra: ["Due attacchi per azione.", "Two attacks per action.", "Dos ataques por acción."],
  lay: ["Cura al tocco con una riserva di PF che si ricarica col riposo lungo.", "Healing touch from a pool of HP that refills on a long rest.", "Curación al tacto con una reserva de PG que se recarga con el descanso largo."],
  smite: ["Dopo un colpo in mischia spendi uno slot: +2d8 radiosi (3d8 ai non morti).", "After a melee hit spend a slot: +2d8 radiant (3d8 vs undead).", "Tras un golpe cuerpo a cuerpo gasta un espacio: +2d8 radiante (3d8 contra muertos vivientes)."],
  aura: ["Tu e gli alleati aggiungete il tuo Carisma ai tiri salvezza.", "You and your allies add your Charisma to saving throws.", "Tú y tus aliados sumáis tu Carisma a las salvaciones."],
  sneak: ["+dadi extra una volta per turno se hai vantaggio o un alleato vicino al bersaglio.", "Extra dice once per turn with advantage or an ally next to the target.", "Dados extra una vez por turno con ventaja o un aliado junto al objetivo."],
  cunning: ["Scatto o Disimpegno come azione bonus.", "Dash or Disengage as a bonus action.", "Correr o Retirada como acción adicional."],
  uncanny: ["Dimezzi i danni del primo colpo che ti arriva nel round.", "Halve the damage of the first hit you take each round.", "Reduces a la mitad el daño del primer golpe que recibes en la ronda."],
  favored: ["+2 ai danni contro i non morti.", "+2 damage against the undead.", "+2 al daño contra muertos vivientes."],
  archery: ["+2 a colpire con le armi a distanza.", "+2 to hit with ranged weapons.", "+2 al ataque con armas a distancia."],
  colossus: ["+1d8 danni una volta per turno a un nemico già ferito.", "+1d8 damage once per turn to a wounded enemy.", "+1d8 de daño una vez por turno a un enemigo ya herido."],
  turn: ["I non morti vicini fanno un TS o restano paralizzati.", "Nearby undead make a save or are stunned.", "Los muertos vivientes cercanos hacen una salvación o quedan paralizados."],
  arcane: ["La tua CA base è 13 + Destrezza.", "Your base AC is 13 + Dexterity.", "Tu CA base es 13 + Destreza."],
};
function sheetCompact(c) {
  const feats = featsOf(c).filter(f => f !== "asi"), sp = spellsOf(c), sm = slotsMax(c), f = Math.max(0, c.hp / c.maxhp);
  const sk = Object.keys(SKILLS).filter(k => c.skills.includes(k)), saves = CL(c).saves || [];
  const init = abm(c, "dex") + (hasFeat(c, "alert") ? 5 : 0) + subInit(c), xpNext = S.level < MAXLV ? XPT[S.level + 1] : null, xpPrev = XPT[S.level] || 0;
  const xpf = xpNext ? Math.max(0, Math.min(1, (S.xp - xpPrev) / (xpNext - xpPrev))) : 1;
  const det = (title, n, body) => `<details class="cs-d"><summary>${title}<b>${n}</b></summary>${body}</details>`;
  return `<div class="cs">
  <div class="cs-head">${medHTML(CL(c).icon, "on")}<div class="cs-id"><b>${esc(c.name)}</b><span>${tr(CL(c).n)} ${c.lvl}${subOf(c) ? " · " + subName(c) : ""} · ${tr(RACES[c.race].n)}${c.bg ? " · " + tr(BGS[c.bg].n) : ""}</span>
    <div class="cs-hp ${f < .35 ? "lo" : f < .65 ? "mid" : ""}"><i style="width:${f * 100}%"></i><span>${T_("hp")} ${c.hp} / ${c.maxhp}</span></div></div></div>
  <div class="cs-pills"><span><b>${acOf(c)}</b>${T_("ac")}</span><span><b>${speedOf(c)}</b>${T_("spd")}</span><span><b>${sgn(init)}</b>${tr(["Iniz.", "Init.", "Inic."])}</span><span><b>+${prof(c)}</b>${tr(["Comp.", "Prof.", "Comp."])}</span><span><b>${c.hdLeft ?? c.lvl}/${c.lvl}</b>d${CL(c).hd}</span></div>
  <div class="cs-ab">${AB.map(k => `<div class="${saves.includes(k) ? "sv" : ""}"><span>${abS(k)}</span><b>${sgn(abm(c, k))}</b><small>${abEff(c, k)}</small><em title="${T_("saves")}">TS ${sgn(saveBonus(c, k))}</em></div>`).join("")}</div>
  <div class="cs-sec">${tr(["Attacchi", "Attacks", "Ataques"])}</div>
  ${weaponsOf(c).map(w => { const p = weapProfile(c, w), m = typeof masteryOf === "function" ? masteryOf(c, p) : null;
    return `<div class="cs-w">${icon(WEAP_IC[w] || "sword")}<b>${p.name}</b><span>${sgn(p.hit)}</span><span>${p.dice}${sgn(p.flat)}</span><small>${p.ranged ? `${tr(["gittata", "range", "alcance"])} ${p.r}` : tr(["mischia", "melee", "cuerpo a cuerpo"])}${m ? ` · ${tr(MASTERY[m].n)}` : ""}</small></div>`; }).join("")}
  <div class="cs-sec">${T_("skills")}</div><div class="taglist">${sk.map(k => `<span>${tr(SKILLS[k][0])} <b>${sgn(skillBonus(c, k))}</b></span>`).join("")}</div>
  ${feats.length || (c.feats || []).length ? det(T_("feats"), feats.length + (c.feats || []).length, feats.map(x => `<p><b>${tr(FEATS[x])}</b>${FEAT_D[x] ? ` — ${tr(FEAT_D[x])}` : ""}</p>`).join("") + (c.feats || []).map(x => `<p class="ft"><b>${tr(FEATLIST[x].n)}</b> — ${tr(FEATLIST[x].d)}</p>`).join("")) : ""}
  ${sp.length ? det(`${T_("spells")}${sm.some(Boolean) ? ` <span class="cs-slots">${sm.map((n, i) => n ? `${["I", "II", "III", "IV"][i]} ${"◆".repeat(c.slots[i])}${"◇".repeat(Math.max(0, n - c.slots[i]))}` : "").filter(Boolean).join("  ")}</span>` : ""}`, sp.length, sp.map(k => `<p><b>${tr(SPELLS[k].n)}</b>${SPELLS[k].lv ? ` <small>${["", "I", "II", "III", "IV"][SPELLS[k].lv]}</small>` : ` <small>${tr(["trucchetto", "cantrip", "truco"])}</small>`} — ${tr(SPELLS[k].d)}</p>`).join("")) : ""}
  ${c.wplus || c.aplus || c.trinket ? `<div class="cs-sec">${tr(["Equipaggiamento", "Equipment", "Equipo"])}</div><div class="taglist">${c.wplus ? `<span>${T_("bonusW")} +${c.wplus}</span>` : ""}${c.aplus ? `<span>${T_("bonusA")} +${c.aplus}</span>` : ""}${c.trinket ? `<span class="tk">${tr(ITEMS[c.trinket].n)}</span>` : ""}</div>` : ""}
  <div class="cs-xp"><span>${T_("xp")} ${S.xp}${xpNext ? ` / ${xpNext}` : ""}</span><div><i style="width:${xpf * 100}%"></i></div></div>
  </div>`;
}

/* ---------- 3. combat panel: action tabs, readable costs ---------- */
const GRP_N = [["Armi", "Weapons", "Armas"], ["Incantesimi", "Spells", "Conjuros"], ["Azioni", "Actions", "Acciones"], ["Oggetti", "Items", "Objetos"]];
const GRP_IC = ["swords", "star", "wind", "potion"];
const _renderCombatUI = renderCombat;
renderCombat = function () {
  _renderCombatUI(); if (!CB || !$("#board")) return;
  const u = cur(), mine = u && u.side === "p" && !CB.busy && !CB.ended && !CB.deploy;
  // explicit action economy: what you still have this turn
  const econ = document.querySelector("#cbp .econ");
  if (econ && mine) econ.innerHTML = `<span class="ec a ${u.act > 0 || u.atkLeft > 0 ? "on" : ""}">◆ ${T_("action")}</span><span class="ec b ${u.bon > 0 ? "on" : ""}">▲ ${T_("bonus")}</span><span class="ec m ${u.mv > 0 ? "on" : ""}">${icon("wind")} ${u.mv}</span>`;
  const hot = $("#hot"); if (!hot || !mine) { const t = $("#grptabs"); if (t) t.remove(); return; }
  const acts = actionsOf(u), groups = [...new Set(acts.map(a => a.grp))].sort();
  const selA = acts.find(a => sameSel(a.s, CB.sel));
  if (CB.grp == null || !groups.includes(CB.grp) || CB.grpFor !== u.uid) { CB.grp = selA ? selA.grp : groups[0]; CB.grpFor = u.uid; }
  hot.querySelectorAll("[data-a]").forEach(b => { const a = acts[+b.dataset.a]; b.hidden = a.grp !== CB.grp; b.querySelector("i.cost") && (b.querySelector("i.cost").className = "cost " + a.cost); });
  hot.querySelectorAll(".sep").forEach(s => s.remove());
  let tabs = $("#grptabs");
  if (!tabs) { hot.parentElement.insertAdjacentHTML("beforebegin", `<div class="grptabs" id="grptabs"></div>`); tabs = $("#grptabs"); }
  tabs.innerHTML = groups.map(g => { const n = acts.filter(a => a.grp === g && canUse(u, a.s)).length, has = acts.some(a => a.grp === g && sameSel(a.s, CB.sel));
    return `<button data-g="${g}" aria-pressed="${g === CB.grp}" class="${has ? "hassel" : ""}">${icon(GRP_IC[g] || "star")}<span>${tr(GRP_N[g] || ["?", "?", "?"])}</span>${n ? `<b>${n}</b>` : ""}</button>`; }).join("");
  tabs.querySelectorAll("[data-g]").forEach(b => b.onclick = () => { CB.grp = +b.dataset.g; renderCombat(); });
};
const _nextTurnUI = nextTurn;
nextTurn = async function () { if (CB) CB.grp = null; return _nextTurnUI(); };
