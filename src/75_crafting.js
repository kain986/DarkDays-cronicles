/* =================== CRAFTING & MARKET =================== */
// Materials come from fallen enemies, from foraging during rests in the wild and from shops.
// Alchemy can be done anywhere outside combat; smithing needs a forge (Hild in Ashford, Vesperia's market, Hrun's hermitage).
// Some recipes must be learned first (flags rec_*), and some need a particular class in the party.
const RECIPES = [
  {id: "potion", out: "potion", kind: "alc", need: {herb: 2}},
  {id: "flask", out: "flask", kind: "alc", need: {resin: 2}},
  {id: "oil", out: "oil", kind: "alc", need: {resin: 1, herb: 1}},
  {id: "greater", out: "greater", kind: "alc", need: {herb: 2, essence: 1}, learn: "rec_greater"},
  {id: "holywater", out: "holywater", kind: "alc", need: {herb: 1, bone: 2}, learn: "rec_holy", cls: ["cleric", "paladin"]},
  {id: "scroll_heal", out: "scroll_heal", kind: "alc", need: {herb: 2, sunshard: 1}, learn: "rec_scroll", cls: ["cleric", "wizard"]},
  {id: "scroll_fire", out: "scroll_fire", kind: "alc", need: {resin: 2, essence: 1, sunshard: 1}, learn: "rec_scroll", cls: ["wizard"]},
  {id: "w1", out: "w1", kind: "forge", need: {iron: 4}, gold: 60},
  {id: "a1", out: "a1", kind: "forge", need: {iron: 4}, gold: 50},
  {id: "w2", out: "w2", kind: "forge", need: {w1: 1, iron: 2, sunshard: 2}, gold: 150, forge: 2},
];
const LEARN_FROM = {
  rec_greater: ["Si impara da Nonna Grisa, nel Bosco Cavo.", "Learned from Granny Grisa, in the Hollow Woods.", "Se aprende de la abuela Grisa, en el Bosque Hueco."],
  rec_holy: ["Si impara al tempio di Sant'Aurel, ad Ashford.", "Learned at the Shrine of Saint Aurel, in Ashford.", "Se aprende en el templo de San Aurel, en Ashford."],
  rec_scroll: ["Si impara al Grande Archivio di Vesperia.", "Learned at the Great Archive of Vesperia.", "Se aprende en el Gran Archivo de Vesperia."],
};
const CLS_N = c => tr(CLASSES[c].n);
const known = r => !r.learn || has(r.learn);
const clsOK = r => !r.cls || S.party.some(c => r.cls.includes(c.cls));
const haveAll = r => Object.entries(r.need).every(([k, n]) => (S.inv[k] || 0) >= n) && S.gold >= (r.gold || 0);
function craft(r) {
  if (!known(r) || !clsOK(r) || !haveAll(r)) return false;
  Object.entries(r.need).forEach(([k, n]) => { S.inv[k] -= n; if (S.inv[k] <= 0) delete S.inv[k]; });
  S.gold -= r.gold || 0; S.inv[r.out] = (S.inv[r.out] || 0) + 1; S.crafted = (S.crafted || 0) + 1;
  if (typeof SFX !== "undefined" && SFX.coin) SFX.coin();
  toastQ(`${tr(["Creato", "Crafted", "Creado"])}: ${tr(ITEMS[r.out].n)}`); saveGame(true); return true;
}
function needHTML(r) {
  const parts = Object.entries(r.need).map(([k, n]) => { const have = S.inv[k] || 0; return `<span class="${have >= n ? "ok" : "no"}">${tr(ITEMS[k].n)} ${have}/${n}</span>`; });
  if (r.gold) parts.push(`<span class="${S.gold >= r.gold ? "ok" : "no"}">${r.gold} ${T_("gp")}</span>`);
  return parts.join("");
}
function recipesHTML(kind, forgeLv) {
  return RECIPES.filter(r => r.kind === kind).map(r => {
    const it = ITEMS[r.out], k = known(r), c = clsOK(r), fz = r.kind !== "forge" || (forgeLv || 0) >= (r.forge || 1), ok = k && c && fz && haveAll(r);
    const why = !k ? tr(LEARN_FROM[r.learn]) : !c ? `${tr(["Serve nel gruppo", "Requires in the party", "Requiere en el grupo"])}: ${r.cls.map(CLS_N).join(" / ")}` : !fz ? (r.kind === "forge" && !forgeLv ? tr(["Serve una fucina.", "Requires a forge.", "Requiere una forja."]) : tr(["Serve un maestro fabbro (l'eremo di Hrun).", "Requires a master smith (Hrun's hermitage).", "Requiere un maestro herrero (la ermita de Hrun)."])) : "";
    return `<div class="row rcp ${k ? "" : "unk"}"><div class="t"><b>${k ? tr(it.n) : "???"}</b><small>${k ? tr(it.d) : ""}</small><div class="need">${k ? needHTML(r) : ""}</div>${why ? `<small class="why">${why}</small>` : ""}</div>
      <button class="btn small" data-craft="${r.id}" ${ok ? "" : "disabled"}>${tr(["Crea", "Craft", "Crear"])}</button></div>`;
  }).join("");
}
function matsHTML() {
  const mats = Object.keys(ITEMS).filter(k => ITEMS[k].use === "mat");
  return `<div class="mats">${mats.map(k => `<span class="${S.inv[k] ? "" : "zero"}">${icon(ITEMS[k].ic || "star")}<b>${S.inv[k] || 0}</b><small>${tr(ITEMS[k].n)}</small></span>`).join("")}</div>`;
}
function craftTabHTML() {
  return `${matsHTML()}<h3>${tr(["Alchimia · kit da campo", "Alchemy · field kit", "Alquimia · equipo de campo"])}</h3>${recipesHTML("alc")}
    <h3>${tr(["Fucina", "Forge", "Forja"])}</h3><p class="hint" style="font-size:13px;color:var(--muted);margin:0 0 6px">${tr(["Le armi e le armature si lavorano solo in una fucina: Hild ad Ashford, il Mercato delle Candele, l'eremo di Hrun.", "Weapons and armour can only be worked at a forge: Hild in Ashford, the Candle Market, Hrun's hermitage.", "Las armas y armaduras solo se trabajan en una forja: Hild en Ashford, el Mercado de las Velas, la ermita de Hrun."])}</p>${recipesHTML("forge", 0)}`;
}
function bindCraft(m, after) { m.querySelectorAll("[data-craft]").forEach(b => b.onclick = () => { const r = RECIPES.find(x => x.id === b.dataset.craft); if (craft(r)) after(); }); }

// party menu: a crafting tab
const _openMenuC = openMenu;
openMenu = function (tab) {
  _openMenuC(tab === "craft" ? "inv" : tab);
  const m = document.querySelector(".modal"); if (!m) return; const tabs = m.querySelector(".tabs"); if (!tabs) return;
  if (!tabs.querySelector('[data-tab="craft"]')) { const inv = tabs.querySelector('[data-tab="inv"]'); inv.insertAdjacentHTML("afterend", `<button data-tab="craft" aria-pressed="${tab === "craft"}">${tr(["Crafting", "Crafting", "Artesanía"])}</button>`); tabs.querySelector('[data-tab="craft"]').onclick = () => openMenu("craft"); }
  if (tab === "craft") {
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.tab === "craft"));
    const close = m.querySelector("#mClose"), sheet = m.querySelector(".sheet"); [...sheet.children].forEach(ch => { if (ch !== tabs && ch !== close) ch.remove(); });
    tabs.insertAdjacentHTML("afterend", `<div class="crafting">${craftTabHTML()}</div>`);
    bindCraft(m, () => openMenu("craft"));
  }
};

// shops: buying, selling and the forge
openShop = function (id, view) {
  const sh = SHOPS[id], disc = id === "vesperia" && has("pia") ? .8 : 1; view = view || "buy";
  const sellable = Object.keys(S.inv).filter(k => S.inv[k] > 0 && ITEMS[k] && ITEMS[k].price && ITEMS[k].use !== "quest");
  const tabs = `<div class="tabs shoptabs"><button data-v="buy" aria-pressed="${view === "buy"}">${tr(["Compra", "Buy", "Comprar"])}</button><button data-v="sell" aria-pressed="${view === "sell"}">${tr(["Vendi", "Sell", "Vender"])}</button>${sh.forge ? `<button data-v="forge" aria-pressed="${view === "forge"}">${tr(["Fucina", "Forge", "Forja"])}</button>` : ""}</div>`;
  let body = "";
  if (view === "buy") body = sh.items.map(k => { const it = ITEMS[k], p = Math.round(it.price * disc); return `<div class="row"><div class="t"><b>${tr(it.n)}</b>${S.inv[k] ? ` <small style="display:inline">(${S.inv[k]})</small>` : ""}<small>${tr(it.d)}</small></div><button class="btn small" data-buy="${k}" data-p="${p}" ${S.gold < p ? "disabled" : ""}>${p} ${T_("gp")}</button></div>`; }).join("");
  if (view === "sell") body = sellable.length ? sellable.map(k => { const it = ITEMS[k], p = Math.floor(it.price / 2); return `<div class="row"><div class="t"><b>${tr(it.n)}</b> <small style="display:inline">×${S.inv[k]}</small><small>${tr(it.d)}</small></div><button class="btn small" data-sell="${k}" data-p="${p}">+${p} ${T_("gp")}</button></div>`; }).join("") : `<p style="color:var(--muted)">${T_("empty")}</p>`;
  if (view === "forge") body = `${matsHTML()}${recipesHTML("forge", sh.forge)}`;
  const m = modal(`<h2>${tr(sh.n)}</h2><p style="color:var(--muted)">${T_("youHave")}: <b style="color:var(--brass)">${S.gold} ${T_("gp")}</b>${view === "sell" ? ` · ${tr(["i mercanti pagano metà prezzo", "merchants pay half price", "los mercaderes pagan la mitad"])}` : ""}</p>${tabs}${body}
    <button class="btn small" id="shClose" style="margin-top:12px">${T_("close")}</button>`);
  m.querySelectorAll("[data-v]").forEach(b => b.onclick = () => openShop(id, b.dataset.v));
  m.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => { const p = +b.dataset.p; if (S.gold < p) return; S.gold -= p; S.inv[b.dataset.buy] = (S.inv[b.dataset.buy] || 0) + 1; saveGame(true); openShop(id, view); });
  m.querySelectorAll("[data-sell]").forEach(b => b.onclick = () => { const k = b.dataset.sell; if (!S.inv[k]) return; S.inv[k]--; if (!S.inv[k]) delete S.inv[k]; S.gold += +b.dataset.p; if (typeof SFX !== "undefined" && SFX.coin) SFX.coin(); saveGame(true); openShop(id, view); });
  bindCraft(m, () => openShop(id, view));
  m.querySelector("#shClose").onclick = () => { closeModal(); renderStory(); };
};

/* ---------- where materials come from ---------- */
// what each kind of enemy leaves behind: [material, chance]
function dropsOf(f) {
  const k = f.foe, d = f.def;
  if (d.boss) return [["sunshard", 1], ["essence", .7]];
  if (["cultist", "fanatic", "jailer"].includes(k)) return [["essence", .25], ["herb", .3], ["iron", .25]];
  if (["acolyte", "vell", "shadow", "shade", "keeper"].includes(k)) return [["essence", .45]];
  if (["goblin", "gobarcher"].includes(k)) return [["resin", .45], ["iron", .3]];
  if (["bandit", "xbow", "dukeguard", "hknight", "armor"].includes(k)) return [["iron", .55]];
  if (k === "wolf") return [["bone", .45]];
  if (d.undead) return [["bone", .6]];
  return [["herb", .3]];
}
function matDrops() {
  if (!CB) return []; const out = [], cnt = {};
  CB.units.filter(u => u.side === "e" && u.hp <= 0 && !u.fled).forEach(f => dropsOf(f).forEach(([m, p]) => { if (Math.random() < p && (cnt[m] = (cnt[m] || 0) + 1) <= 3) out.push(m); }));
  return out;
}
const _rollLootC = rollLoot;
rollLoot = function (key) { return _rollLootC(key).concat(matDrops()); };
// resting in the wild: the party forages
function forage() {
  const best = S.party.reduce((a, c) => skillBonus(c, "sur") > skillBonus(a, "sur") ? c : a, S.party[0]);
  const r = rnd(20) + skillBonus(best, "sur"), got = {herb: r >= 12 ? 1 + rnd(2) : 1}; if (r >= 15) got.resin = 1; if (r >= 19) got.essence = 1;
  Object.entries(got).forEach(([k, n]) => S.inv[k] = (S.inv[k] || 0) + n);
  toastQ(`${esc(best.name.split(" ")[0])} ${tr(["raccoglie", "forages", "recolecta"])}: ${Object.entries(got).map(([k, n]) => `${n} ${tr(ITEMS[k].n)}`).join(", ")}`);
}

/* ---------- combat use of the new items ---------- */
const isOil = k => ITEMS[k] && ITEMS[k].use === "oil";

/* ---------- the memory thief's barks (secret quest) ---------- */
LEADS.bottler = {
  start: ["Prendeteli vivi: i ricordi dei marchiati valgono doppio.", "Take them alive: the marked ones' memories are worth double.", "Cogedlos vivos: los recuerdos de los marcados valen el doble."],
  rally: [["Lo speziale ci ha promesso l'oblio… niente più paura.", "The apothecary promised us oblivion… no more fear.", "El boticario nos prometió el olvido… nada de miedo."],
          ["Finché Vell ha le fiale, noi non sentiamo dolore.", "As long as Vell has the vials, we feel no pain.", "Mientras Vell tenga los frascos, no sentimos dolor."],
          ["Proteggete il maestro! Senza di lui ricorderemo tutto…", "Protect the master! Without him we'll remember everything…", "¡Proteged al maestro! Sin él lo recordaremos todo…"]],
  hurt: ["Le fiale… si stanno incrinando… ricordo mia madre…", "The vials… they're cracking… I remember my mother…", "Los frascos… se agrietan… recuerdo a mi madre…"],
  fall: ["Vell è caduto… ricordo tutto… via di qui!", "Vell is down… I remember everything… get out!", "Vell ha caído… lo recuerdo todo… ¡fuera de aquí!"],
};
