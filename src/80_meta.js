/* =================== META: save slots, export/import, bestiary, achievements, options =================== */
Object.assign(ICONS, {
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4zM20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
});
const SLOT_KEYS = ["ddc-slot-1", "ddc-slot-2", "ddc-slot-3"];

/* ---------- saving ---------- */
saveGame = function (silent) { if (!S) return; S.savedAt = Date.now(); const ok = store(SAVE_KEY, S); if (!silent) toast(ok ? T_("saved") : T_("noStore")); };
function slotLine(s) {
  if (!s || !s.party || !s.party[0]) return `<small>${tr(["Vuoto", "Empty", "Vacío"])}</small>`;
  const c = s.party[0], sc = SC[s.scene], when = s.savedAt ? new Date(s.savedAt).toLocaleString(LANG_CODES[LG], {day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"}) : "";
  return `<small>${esc(c.name)} · ${tr(CLASSES[c.cls].n)} ${T_("lvl")} ${s.level} · ${esc(tr(sc && sc.loc || ""))}${when ? " · " + when : ""}</small>`;
}
function loadState(s) { if (!s || !s.party || !SC[s.scene]) return false; S = s; if (S.lang != null) setLang(S.lang); closeModal(); goScene(S.scene, true); return true; }
const encodeSave = s => "DDC1:" + btoa(unescape(encodeURIComponent(JSON.stringify(s))));
function decodeSave(code) { try { const t = String(code).trim().replace(/^DDC1:/, ""); return JSON.parse(decodeURIComponent(escape(atob(t)))); } catch (e) { return null; } }
function openSaves(mode) {
  const canSave = mode === "story" && S;
  const auto = load(SAVE_KEY);
  const rows = [[SAVE_KEY, tr(["Salvataggio automatico", "Autosave", "Guardado automático"]), auto, false],
    ...SLOT_KEYS.map((k, i) => [k, `${tr(["Slot", "Slot", "Ranura"])} ${i + 1}`, load(k), true])];
  const m = modal(`<h2>${tr(["Salvataggi", "Saved games", "Partidas guardadas"])}</h2>
    ${rows.map(([k, n, s, manual]) => `<div class="row"><div class="t"><b>${n}</b>${slotLine(s)}</div>
      ${canSave && manual ? `<button class="btn small" data-save="${k}">${tr(["Salva", "Save", "Guardar"])}</button>` : ""}
      ${s && s.party ? `<button class="btn small" data-load="${k}">${tr(["Carica", "Load", "Cargar"])}</button>` : ""}</div>`).join("")}
    <h3>${tr(["Codice di salvataggio", "Save code", "Código de guardado"])}</h3>
    <p style="font-size:14px;color:var(--muted)">${tr(["Copia il codice per spostare la partita su un altro telefono o tenerne una copia. Incolla un codice per riprenderla.", "Copy the code to move your game to another phone or keep a backup. Paste a code to resume it.", "Copia el código para llevar la partida a otro teléfono o guardar una copia. Pega un código para retomarla."])}</p>
    <textarea id="saveCode" class="codebox" rows="3" spellcheck="false" placeholder="DDC1:…"></textarea>
    <div class="who" style="margin-top:8px">${canSave ? `<button id="exp">${tr(["Mostra il codice di questa partita", "Show this game's code", "Mostrar el código de esta partida"])}</button><button id="cpy">${icon("copy")}</button>` : ""}<button id="imp">${tr(["Carica dal codice", "Load from code", "Cargar desde el código"])}</button></div>
    <p id="saveMsg" class="hint" style="font-size:13px;color:var(--brass);min-height:18px"></p>
    <button class="btn small" id="svX" style="margin-top:6px">${T_("close")}</button>`);
  const msg = t => { const e = m.querySelector("#saveMsg"); if (e) e.textContent = t; }, box = m.querySelector("#saveCode");
  m.querySelectorAll("[data-save]").forEach(b => b.onclick = () => { S.savedAt = Date.now(); store(b.dataset.save, S); SFX.ui(); openSaves(mode); toast(T_("saved")); });
  m.querySelectorAll("[data-load]").forEach(b => b.onclick = () => { const s = load(b.dataset.load); if (!loadState(s)) msg(tr(["Salvataggio non valido.", "Invalid save.", "Guardado no válido."])); });
  const ex = m.querySelector("#exp"); if (ex) ex.onclick = () => { S.savedAt = Date.now(); box.value = encodeSave(S); box.focus(); box.select(); msg(tr(["Codice pronto: copialo e conservalo.", "Code ready: copy it and keep it safe.", "Código listo: cópialo y guárdalo."])); };
  const cp = m.querySelector("#cpy"); if (cp) cp.onclick = () => { if (!box.value) box.value = encodeSave(S); box.select(); try { navigator.clipboard.writeText(box.value).then(() => msg(tr(["Copiato.", "Copied.", "Copiado."])), () => msg(tr(["Seleziona il testo e copialo a mano.", "Select the text and copy it manually.", "Selecciona el texto y cópialo a mano."]))); } catch (e) { msg(tr(["Seleziona il testo e copialo a mano.", "Select the text and copy it manually.", "Selecciona el texto y cópialo a mano."])); } };
  m.querySelector("#imp").onclick = () => { const s = decodeSave(box.value); if (!s || !loadState(s)) msg(tr(["Il codice non è valido. Controlla di averlo incollato tutto.", "The code isn't valid. Check you pasted all of it.", "El código no es válido. Comprueba que lo pegaste entero."])); };
  m.querySelector("#svX").onclick = () => { closeModal(); if (SCREEN === "story") renderStory(); };
}

/* ---------- bestiary ---------- */
function bestiaryHTML() {
  const B = (S && S.bestiary) || {}, keys = Object.keys(FOES), seen = keys.filter(k => B[k]);
  return `<p style="font-size:14px;color:var(--muted);margin:0 0 8px">${seen.length}/${keys.length} ${tr(["creature incontrate", "creatures met", "criaturas encontradas"])}</p><div class="bestiary">${keys.map(k => { const d = FOES[k], b = B[k];
    if (!b) return `<div class="beast unk"><div class="bimg">?</div><div class="bt"><b>???</b></div></div>`;
    const traits = []; if (d.boss) traits.push(tr(["boss", "boss", "jefe"])); if (d.undead) traits.push(tr(["non morto", "undead", "muerto viviente"])); if (d.construct) traits.push(tr(["costrutto", "construct", "constructo"])); if (d.vuln) traits.push(`<span class="vu">${tr(["vuln.", "vuln.", "vuln."])} ${d.vuln}</span>`); if (d.res) traits.push(`<span class="re">${tr(["resiste", "resists", "resiste"])} ${d.res}</span>`); if (d.pack) traits.push(tr(["branco", "pack", "manada"]));
    return `<div class="beast"><img class="bimg" alt="" src="${miniSrc({side: "e", foe: k, boss: !!d.boss})}"><div class="bt"><b>${tr(d.n)}</b><small>${T_("hp")} ${d.hp} · ${T_("ac")} ${d.ac} · ${T_("spd")} ${d.spd}</small><small>${[...d.atk, ...(d.spells || [])].map(a => `${tr(a.n)} ${a.d}`).join(" · ")}</small><small>${traits.join(" · ")}</small><small class="kills">${tr(["Sconfitti", "Defeated", "Derrotados"])}: ${b.kills || 0}</small></div></div>`; }).join("")}</div>`;
}
const _startCombatM = startCombat;
startCombat = function (key, win, sur) { const r = _startCombatM(key, win, sur); if (S && CB) { S.bestiary = S.bestiary || {}; CB.units.filter(u => u.side === "e").forEach(u => { S.bestiary[u.foe] = S.bestiary[u.foe] || {kills: 0}; }); } return r; };
const _fxDeathM = fxDeath;
fxDeath = function (t, small) { if (!small && t.side === "e" && S && S.bestiary && S.bestiary[t.foe]) S.bestiary[t.foe].kills++; return _fxDeathM(t, small); };

/* ---------- achievements (kept across playthroughs) ---------- */
const ACH = [
  ["first_win", "swords", ["Primo sangue", "First blood", "Primera sangre"], ["Vinci il tuo primo combattimento.", "Win your first battle.", "Gana tu primer combate."]],
  ["flawless_boss", "shield", ["Senza un graffio", "Without a scratch", "Sin un rasguño"], ["Sconfiggi un boss senza che nessuno del gruppo cada.", "Defeat a boss with nobody in the party falling.", "Derrota a un jefe sin que nadie del grupo caiga."]],
  ["speed", "bolt", ["Fulmine", "Lightning", "Relámpago"], ["Vinci 10 scontri entro il limite di round.", "Win 10 battles within the round limit.", "Gana 10 combates dentro del límite de rondas."]],
  ["nat20", "d20", ["Favore degli dèi", "Favour of the gods", "Favor de los dioses"], ["Ottieni un 20 naturale in una prova.", "Roll a natural 20 on a check.", "Saca un 20 natural en una prueba."]],
  ["collector", "star", ["Collezionista", "Collector", "Coleccionista"], ["Possiedi 6 accessori magici diversi.", "Own 6 different magic trinkets.", "Posee 6 accesorios mágicos distintos."]],
  ["vault", "crown", ["Le Volte violate", "The Vaults breached", "Las Bóvedas profanadas"], ["Sconfiggi il Custode d'Ossidiana.", "Defeat the Obsidian Warden.", "Derrota al Guardián de Obsidiana."]],
  ["brothers", "hand", ["Fratelli", "Brothers", "Hermanos"], ["Riconcilia Kael con suo fratello Doran.", "Reconcile Kael with his brother Doran.", "Reconcilia a Kael con su hermano Doran."]],
  ["redeem", "heart", ["Redenzione", "Redemption", "Redención"], ["Ricorda a Seraphine chi era sua figlia.", "Remind Seraphine who her daughter was.", "Recuérdale a Seraphine quién era su hija."]],
  ["end_dawn", "sun", ["L'Alba", "The Dawn", "El Alba"], ["Riporta il sole nel cielo.", "Return the sun to the sky.", "Devuelve el sol al cielo."]],
  ["end_twilight", "moon", ["Il Crepuscolo libero", "The Free Twilight", "El Crepúsculo libre"], ["Spezza il legame tra il sole e gli dèi.", "Break the bond between sun and gods.", "Rompe el vínculo entre el sol y los dioses."]],
  ["end_dark", "skull", ["Il Re di Cenere", "The Ash King", "El Rey de Ceniza"], ["Prendi il potere di Morrhan.", "Take Morrhan's power.", "Toma el poder de Morrhan."]],
  ["merciless", "flame", ["Spietato", "Merciless", "Despiadado"], ["Completa la storia a difficoltà Spietata.", "Finish the story on Merciless difficulty.", "Completa la historia en dificultad Despiadada."]],
];
function unlock(id) {
  PREF.ach = PREF.ach || {}; if (PREF.ach[id]) return; PREF.ach[id] = Date.now(); store(PREF_KEY, PREF);
  const a = ACH.find(a => a[0] === id); if (!a) return; SFX.join(); toastQ(`${tr(["Impresa", "Achievement", "Logro"])}: ${tr(a[2])}`);
}
function checkAch() {
  if (!S) return; const f = S.flags || {};
  if (f.vault_done) unlock("vault"); if (f.doran_ally) unlock("brothers"); if (f.ser_redeemed) unlock("redeem");
  ["end_dawn", "end_twilight", "end_dark"].forEach(e => { if (f[e]) unlock(e); });
  if (f.game_done && S.diff === 2) unlock("merciless");
  const tk = new Set(Object.keys(S.inv || {}).filter(k => ITEMS[k] && ITEMS[k].slot === "t")); S.party.forEach(c => { if (c.trinket) tk.add(c.trinket); }); if (tk.size >= 6) unlock("collector");
}
function achHTML() {
  const A = PREF.ach || {}, n = ACH.filter(a => A[a[0]]).length;
  return `<p style="font-size:14px;color:var(--muted);margin:0 0 8px">${n}/${ACH.length}</p><div class="achs">${ACH.map(([id, ic, nm, d]) => `<div class="ach${A[id] ? " got" : ""}">${medHTML(ic, "sm" + (A[id] ? " on" : ""))}<div><b>${tr(nm)}</b><small>${tr(d)}</small></div></div>`).join("")}</div>`;
}
function openAch() { const m = modal(`<h2>${tr(["Imprese", "Achievements", "Logros"])}</h2>${achHTML()}<button class="btn small" id="achX" style="margin-top:12px">${T_("close")}</button>`); m.querySelector("#achX").onclick = () => { closeModal(); if (SCREEN === "story") renderStory(); }; }
const _goSceneM = goScene;
goScene = function (id, noOnce) { const r = _goSceneM(id, noOnce); try { checkAch(); } catch (e) {} return r; };
const _winCombatM = winCombat;
winCombat = function () {
  if (CB) { unlock("first_win"); if (!CB.anyDown && CB.units.some(u => u.side === "e" && u.boss)) unlock("flawless_boss");
    if (CB.round <= 3 + Math.ceil(CB.nFoes / 2)) { PREF.achC = PREF.achC || {}; PREF.achC.speed = (PREF.achC.speed || 0) + 1; store(PREF_KEY, PREF); if (PREF.achC.speed >= 10) unlock("speed"); } }
  return _winCombatM();
};
const _doCheckM = doCheck;
doCheck = function (spec) { const p = _doCheckM(spec); setTimeout(() => { const r = $("#dres"); if (r && r.querySelector("small") && r.classList.contains("ok")) unlock("nat20"); }, 960); return p; };

/* ---------- options: text size, reduced effects ---------- */
function applyPrefs() { const a = $("#app"); if (!a) return; a.style.setProperty("--txt", [.9, 1, 1.15][PREF.txt ?? 1]); a.classList.toggle("lowfx", !!PREF.lowfx); }
const _ambientM = ambient;
ambient = function (cv, key) { if (PREF.lowfx) { const p = AMBS.get(cv); if (p) cancelAnimationFrame(p); paint(cv, key); return; } return _ambientM(cv, key); };
const _fxInitM = fxInit;
fxInit = function () { _fxInitM(); if (PREF.lowfx) FX.amb = null; };
function extraOptsHTML() {
  return `<h3>${tr(["Dimensione testo", "Text size", "Tamaño del texto"])}</h3><div class="seg">${[0, 1, 2].map(i => `<button data-txt="${i}" aria-pressed="${(PREF.txt ?? 1) === i}">${["A−", "A", "A+"][i]}</button>`).join("")}</div>
  <h3>${tr(["Effetti visivi", "Visual effects", "Efectos visuales"])}</h3><div class="seg"><button data-lowfx="0" aria-pressed="${!PREF.lowfx}">${tr(["Completi", "Full", "Completos"])}</button><button data-lowfx="1" aria-pressed="${!!PREF.lowfx}">${tr(["Ridotti (batteria)", "Reduced (battery)", "Reducidos (batería)"])}</button></div>
  <div style="display:grid;gap:8px;margin-top:14px"><button class="btn small" id="oSaves">${icon("save")} ${tr(["Salvataggi e codice", "Saves and code", "Partidas y código"])}</button><button class="btn small" id="oAch">${tr(["Imprese", "Achievements", "Logros"])}</button></div>`;
}
const _openMenuM = openMenu;
openMenu = function (tab) {
  if (tab === "best") {
    const m = modal(`<div class="tabs">${[["party", T_("party")], ["inv", T_("inv")], ["journal", T_("journal")], ["best", tr(["Bestiario", "Bestiary", "Bestiario"])], ["opts", T_("settings")]].map(([k, n]) => `<button data-tab="${k}" aria-pressed="${k === tab}">${n}</button>`).join("")}</div>${bestiaryHTML()}<button class="btn small" id="mClose" style="margin-top:14px">${T_("close")}</button>`);
    m.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => openMenu(b.dataset.tab));
    m.querySelector("#mClose").onclick = () => { closeModal(); if (SCREEN === "story") renderStory(); };
    return;
  }
  _openMenuM(tab);
  const tabs = document.querySelector(".modal .tabs"); if (tabs && !tabs.querySelector('[data-tab="best"]')) { const j = tabs.querySelector('[data-tab="journal"]'); j.insertAdjacentHTML("afterend", `<button data-tab="best" aria-pressed="false">${tr(["Bestiario", "Bestiary", "Bestiario"])}</button>`); tabs.querySelector('[data-tab="best"]').onclick = () => openMenu("best"); }
  if (tab === "opts") { const h = document.querySelector(".modal .sheet"), first = h.querySelector(".vol"); const anchor = h.querySelector("#oSave") ? h.querySelector("#oSave").parentElement : null;
    if (anchor) anchor.insertAdjacentHTML("beforebegin", extraOptsHTML());
    h.querySelectorAll("[data-txt]").forEach(b => b.onclick = () => { PREF.txt = +b.dataset.txt; store(PREF_KEY, PREF); applyPrefs(); openMenu("opts"); });
    h.querySelectorAll("[data-lowfx]").forEach(b => b.onclick = () => { PREF.lowfx = b.dataset.lowfx === "1"; store(PREF_KEY, PREF); applyPrefs(); openMenu("opts"); });
    const sv = h.querySelector("#oSaves"); if (sv) sv.onclick = () => openSaves("story");
    const ac = h.querySelector("#oAch"); if (ac) ac.onclick = openAch; }
};

/* ---------- title additions ---------- */
const _renderTitleM = renderTitle;
renderTitle = function () {
  _renderTitleM(); applyPrefs();
  const foot = $("#title .foot"); if (!foot) return;
  foot.insertAdjacentHTML("beforebegin", `<div class="trow"><button class="btn small" id="tLoad">${tr(["Carica partita", "Load game", "Cargar partida"])}</button><button class="btn small" id="tAch">${tr(["Imprese", "Achievements", "Logros"])} · ${Object.keys(PREF.ach || {}).length}/${ACH.length}</button></div>`);
  foot.insertAdjacentHTML("beforeend", ` · v${GAME_VERSION}`);
  $("#tLoad").onclick = () => openSaves("title"); $("#tAch").onclick = openAch;
};

/* ---------- update check (Android app only; reads the latest GitHub release) ---------- */
const UPD = {repo: "kain986/darkdays-cronicles", api: "https://api.github.com/repos/kain986/darkdays-cronicles/releases/latest", page: "https://github.com/kain986/darkdays-cronicles/releases/latest"};
function verNewer(a, b) { const pa = String(a).replace(/^v/i, "").split(/[.-]/).map(n => parseInt(n, 10) || 0), pb = String(b).replace(/^v/i, "").split(/[.-]/).map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) { const x = pa[i] || 0, y = pb[i] || 0; if (x !== y) return x > y; } return false; }
async function fetchLatest() {
  const ctl = typeof AbortController !== "undefined" ? new AbortController() : null; const tm = ctl ? setTimeout(() => ctl.abort(), 8000) : 0;
  try { const r = await fetch(UPD.api, {headers: {Accept: "application/vnd.github+json"}, signal: ctl ? ctl.signal : undefined}); if (!r.ok) return null;
    const j = await r.json(); const apk = (j.assets || []).find(a => /\.apk$/i.test(a.name));
    return {tag: j.tag_name, name: j.name || j.tag_name, notes: j.body || "", url: apk ? apk.browser_download_url : UPD.page, page: j.html_url || UPD.page, at: Date.now()}; }
  catch (e) { return null; } finally { if (tm) clearTimeout(tm); }
}
async function checkUpdates(manual) {
  if (typeof IS_APP === "undefined" || !IS_APP) { if (manual) toast(tr(["Stai giocando la versione web, che è sempre aggiornata.", "You're playing the web version, which is always up to date.", "Estás jugando la versión web, que siempre está actualizada."])); return; }
  if (!manual && PREF.upd && Date.now() - PREF.upd.at < 6 * 3600e3) { showUpdateBadge(PREF.upd); return; }
  if (manual) toast(tr(["Controllo aggiornamenti…", "Checking for updates…", "Buscando actualizaciones…"]));
  const L = await fetchLatest();
  if (!L) { if (manual) toast(tr(["Impossibile controllare: sei offline?", "Couldn't check: are you offline?", "No se pudo comprobar: ¿sin conexión?"])); return; }
  PREF.upd = L; store(PREF_KEY, PREF);
  if (verNewer(L.tag, GAME_VERSION)) { showUpdateBadge(L); if (manual) openUpdate(L); }
  else if (manual) toast(tr(["Hai già l'ultima versione", "You have the latest version", "Ya tienes la última versión"]) + ` (v${GAME_VERSION})`);
}
function showUpdateBadge(L) {
  if (!L || !verNewer(L.tag, GAME_VERSION) || SCREEN !== "title" || $("#updB")) return;
  const foot = $("#title .foot"); if (!foot) return;
  foot.insertAdjacentHTML("beforebegin", `<button class="updb" id="updB">${icon("star")}<span><b>${tr(["Nuova versione disponibile", "New version available", "Nueva versión disponible"])}: ${esc(L.tag)}</b><small>${tr(["Tocca per vedere le novità", "Tap to see what's new", "Toca para ver las novedades"])}</small></span></button>`);
  $("#updB").onclick = () => openUpdate(L);
}
function openUpdate(L) {
  const notes = esc(L.notes).replace(/\r/g, "").split("\n").filter(l => l.trim()).slice(0, 14).map(l => l.replace(/^[-*]\s*/, "• ").replace(/^#+\s*/, "")).join("<br>");
  const m = modal(`<h2>${tr(["Aggiornamento", "Update", "Actualización"])} ${esc(L.tag)}</h2>
    <p style="color:var(--muted);font-size:14px">${tr(["Versione installata", "Installed version", "Versión instalada"])}: v${GAME_VERSION}</p>
    ${notes ? `<div class="relnotes">${notes}</div>` : ""}
    <p style="font-size:14px;color:var(--muted)">${tr(["Scarica il nuovo APK e aprilo: si installa sopra questa versione e i salvataggi restano. Per sicurezza puoi prima copiare il codice di salvataggio dalle Opzioni.", "Download the new APK and open it: it installs over this version and your saves stay. To be safe you can copy your save code from Options first.", "Descarga el nuevo APK y ábrelo: se instala sobre esta versión y las partidas se conservan. Por seguridad puedes copiar antes el código de guardado en Opciones."])}</p>
    <a class="btn primary" id="updGo" href="${esc(L.url)}" target="_blank" rel="noopener">${tr(["Scarica l'aggiornamento", "Download the update", "Descargar la actualización"])}</a>
    <a class="btn small" href="${esc(L.page)}" target="_blank" rel="noopener" style="margin-top:8px">${tr(["Pagina della versione", "Release page", "Página de la versión"])}</a>
    <button class="btn small" id="updX" style="margin-top:8px">${tr(["Più tardi", "Later", "Más tarde"])}</button>`, {center: 1});
  m.querySelector("#updX").onclick = closeModal;
}
const _renderTitleU = renderTitle;
renderTitle = function () { _renderTitleU(); if (PREF.upd) showUpdateBadge(PREF.upd); setTimeout(() => checkUpdates(false), 600); };
const _extraOptsU = extraOptsHTML;
extraOptsHTML = function () { return _extraOptsU() + `<button class="btn small" id="oUpd" style="margin-top:8px">${tr(["Controlla aggiornamenti", "Check for updates", "Buscar actualizaciones"])} · v${GAME_VERSION}</button>`; };
const _openMenuU = openMenu;
openMenu = function (tab) { _openMenuU(tab); const b = document.querySelector("#oUpd"); if (b) b.onclick = () => checkUpdates(true); };

/* ---------- chapters screen ---------- */
function openChapters() {
  const auto = load(SAVE_KEY);
  const rows = CHAPTERS.map((c, i) => {
    const endSave = load("ddc-chapter-" + c.id), prev = CHAPTERS[i - 1];
    const doneEnding = [auto, endSave].map(s => s && s.chaptersDone && s.chaptersDone[c.id]).find(Boolean);
    const playing = auto && (auto.chapter || "ch1") === c.id && auto.scene !== "ch_wait";
    const prevEnd = prev && load("ddc-chapter-" + prev.id);
    let status = doneEnding ? `✓ ${tr(["completato", "completed", "completado"])}${c.endings && c.endings[doneEnding] ? " · " + tr(c.endings[doneEnding]) : ""}` : playing ? tr(["in corso", "in progress", "en curso"]) : "";
    const canStart = prev && prevEnd && !playing;
    return `<div class="chap${doneEnding ? " done" : ""}"><div class="cnum">${esc(tr(c.num))}</div><b>${esc(tr(c.title))}</b><p>${esc(tr(c.blurb || ["", "", ""]))}</p>
      ${status ? `<small>${status}</small>` : ""}${canStart ? `<button class="btn small" data-chstart="${prev.id}">${tr(["Inizia con il gruppo del capitolo precedente", "Start with the party from the previous chapter", "Empezar con el grupo del capítulo anterior"])}</button>` : ""}</div>`; }).join("");
  const m = modal(`<h2>${tr(["Capitoli", "Chapters", "Capítulos"])}</h2>${rows}
    <div class="chap next"><div class="cnum">${tr(["Prossimamente", "Coming soon", "Próximamente"])}</div><b>${tr(["Nuovi capitoli", "New chapters", "Nuevos capítulos"])}</b><p>${tr(["Nuovi archi narrativi arriveranno con gli aggiornamenti. La tua partita alla fine di ogni capitolo resta conservata, con personaggi, oggetti e scelte.", "New story arcs will arrive with updates. Your game at the end of each chapter is kept, with characters, items and choices.", "Nuevos arcos narrativos llegarán con las actualizaciones. Tu partida al final de cada capítulo se conserva, con personajes, objetos y decisiones."])}</p></div>
    <button class="btn small" id="chX" style="margin-top:10px">${T_("close")}</button>`);
  m.querySelectorAll("[data-chstart]").forEach(b => b.onclick = () => { const s = load("ddc-chapter-" + b.dataset.chstart); if (s) { closeModal(); loadState(s); } });
  m.querySelector("#chX").onclick = closeModal;
}
const _renderTitleC = renderTitle;
renderTitle = function () {
  _renderTitleC();
  const row = $("#title .trow"); if (row && !$("#tChap")) { row.insertAdjacentHTML("afterend", `<button class="btn small" id="tChap">${tr(["Capitoli", "Chapters", "Capítulos"])}</button>`); $("#tChap").onclick = openChapters; }
  const cont = $("#tCont"), sv = load(SAVE_KEY); if (cont && sv) { const c = chapterOf(sv); cont.querySelector("small") ? cont.querySelector("small").textContent = `${T_("cont")} · ${tr(c.num)}` : null; }
};
const _slotLineC = slotLine;
slotLine = function (s) { const r = _slotLineC(s); if (!s || !s.party) return r; return r.replace("<small>", `<small>${esc(tr(chapterOf(s).num))} · `); };
const _journalHTMLC = journalHTML;
journalHTML = function () { return (S ? `<div class="jch"><span>${esc(tr(chapterOf(S).num))}</span><b>${esc(tr(chapterOf(S).title))}</b></div>` : "") + _journalHTMLC(); };
