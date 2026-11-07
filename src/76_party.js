/* =================== PARTY FORMATION =================== */
// Up to 4 characters travel and fight; the other recruited companions (roster of 8) wait at camp.
// The formation can be changed from the party menu whenever you are not in combat.
function formationHTML() {
  const res = S.reserve || [], canEdit = SCREEN === "story";
  const line = (c, where) => `<div class="row fm"><span class="fmi">${icon(CL(c).icon || "star")}</span><div class="t"><b>${esc(c.name)}</b><small>${tr(CLASSES[c.cls].n)} · ${tr(RACES[c.race].n)} · ${T_("hp")} ${c.hp}/${c.maxhp}</small></div>
    ${canEdit && where === "a" && c.id !== "pc" ? `<button class="btn small" data-bench="${c.id}">${tr(["Al campo", "To camp", "Al campamento"])}</button>` : ""}
    ${canEdit && where === "r" ? (S.party.length < PARTY_MAX ? `<button class="btn small" data-call="${c.id}">${tr(["Nel gruppo", "Join party", "Al grupo"])}</button>` : `<div class="swap">${S.party.filter(a => a.id !== "pc").map(a => `<button class="btn small" data-swap="${c.id}" data-out="${a.id}">⇄ ${esc(a.name.split(" ")[0])}</button>`).join("")}</div>`) : ""}</div>`;
  const fallen = (S.fallen || []).map(id => COMPS[id] ? COMPS[id].name : id);
  return `<h3>${tr(["Formazione", "Formation", "Formación"])} · ${S.party.length}/${PARTY_MAX}</h3>
    ${S.party.map(c => line(c, "a")).join("")}
    ${res.length ? `<h3>${tr(["All'accampamento", "At camp", "En el campamento"])}</h3>${res.map(c => line(c, "r")).join("")}` : ""}
    ${!canEdit ? `<p class="hint" style="font-size:13px;color:var(--muted)">${tr(["La formazione si cambia fuori dal combattimento.", "The formation can be changed outside combat.", "La formación se cambia fuera del combate."])}</p>` : ""}
    <p class="hint" style="font-size:13px;color:var(--muted)">${tr(["Compagni reclutati", "Companions recruited", "Compañeros reclutados"])}: ${roster().length}/${ROSTER_MAX}</p>
    ${fallen.length ? `<p class="fallen">✝ ${tr(["In memoria", "In memory", "En memoria"])}: ${fallen.map(esc).join(", ")}</p>` : ""}`;
}
function benchComp(id) { if (S.party.length <= 1) return; const c = S.party.find(x => x.id === id); if (!c || c.id === "pc") return; S.party = S.party.filter(x => x !== c); (S.reserve = S.reserve || []).push(c); }
function callComp(id) { const c = (S.reserve || []).find(x => x.id === id); if (!c || S.party.length >= PARTY_MAX) return; S.reserve = S.reserve.filter(x => x !== c); S.party.push(c); }
const _openMenuP = openMenu;
openMenu = function (tab) {
  _openMenuP(tab);
  if (tab !== "party") return;
  const m = document.querySelector(".modal .sheet"); if (!m) return; const close = m.querySelector("#mClose");
  close.insertAdjacentHTML("beforebegin", `<div class="formation">${formationHTML()}</div>`);
  const redo = () => { saveGame(true); menuMember = 0; openMenu("party"); if (SCREEN === "story") { const h = $(".chips") || $("#chips"); if (h && typeof chipsHTML === "function") h.innerHTML = chipsHTML(); } };
  m.querySelectorAll("[data-bench]").forEach(b => b.onclick = () => { benchComp(b.dataset.bench); redo(); });
  m.querySelectorAll("[data-call]").forEach(b => b.onclick = () => { callComp(b.dataset.call); redo(); });
  m.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { benchComp(b.dataset.out); callComp(b.dataset.swap); redo(); });
};
