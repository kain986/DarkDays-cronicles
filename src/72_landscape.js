/* =================== LANDSCAPE LAYOUT =================== */
// Phones held sideways get a two-column layout: the battle map is turned 90° so the party
// stands on the left and the enemy on the right, with the action panel on the side.
const LANDQ = typeof matchMedia !== "undefined" ? matchMedia("(orientation: landscape) and (max-height: 620px)") : null;
const isLand = () => !!(LANDQ && LANDQ.matches);
BG.title_land = {sky: ["#060509", "#2b1f30"], sun: [.24, .34, .13], L: ["peaks", "hills", "fog"]};
function applyLand() { const a = typeof document !== "undefined" && $("#app"); if (a) a.classList.toggle("land", isLand()); }
function onLandChange() {
  applyLand();
  if (SCREEN === "combat" && CB) { sizeBoard(); renderCombat(); }
  else if (SCREEN === "story" && S) renderStory();
  else if (SCREEN === "title") renderTitle();
  else if (SCREEN === "create") renderCreate();
}
if (LANDQ) { if (LANDQ.addEventListener) LANDQ.addEventListener("change", onLandChange); else if (LANDQ.addListener) LANDQ.addListener(onLandChange); }
applyLand();
// floating combat text lives outside the turned board so it always reads upright and rises upward
const _floatAtL = floatAt;
floatAt = function (u, txt, col, big) {
  if (!isLand()) return _floatAtL(u, txt, col, big);
  const bw = $("#bw"), tk = $("#t_" + u.uid); if (!bw || !tk || !CB) return;
  const br = bw.getBoundingClientRect(), r = tk.getBoundingClientRect();
  const d = document.createElement("div"); d.className = "fl" + (big ? " big" : ""); d.textContent = txt; d.style.color = col;
  d.style.left = (r.left + r.width / 2 - br.left) + "px"; d.style.top = (r.top - br.top - r.height * .45 + (big ? -6 : 2)) + "px"; bw.appendChild(d); setTimeout(() => d.remove(), 1300);
};
const _fxInitL = fxInit;
fxInit = function () { _fxInitL(); if (isLand()) FX.amb = null; };
const _renderTitleL = renderTitle;
renderTitle = function () {
  _renderTitleL(); applyLand();
  if (isLand()) ambient($("#tcv"), "title_land");
};
// Android: orientation preference (the app starts in landscape)
function setOrientation(m) { PREF.orient = m; store(PREF_KEY, PREF); try { if (window.DDCAndroid && window.DDCAndroid.setOrientation) window.DDCAndroid.setOrientation(m); } catch (e) {} }
try { if (typeof window !== "undefined" && window.DDCAndroid && window.DDCAndroid.setOrientation) window.DDCAndroid.setOrientation(PREF.orient || "land"); } catch (e) {}
const _extraOptsL = extraOptsHTML;
extraOptsHTML = function () {
  const hasBridge = typeof window !== "undefined" && window.DDCAndroid;
  const o = PREF.orient || "land";
  return (hasBridge ? `<h3>${tr(["Orientamento", "Orientation", "Orientación"])}</h3><div class="seg">${[["land", ["Orizzontale", "Landscape", "Horizontal"]], ["port", ["Verticale", "Portrait", "Vertical"]], ["auto", ["Automatico", "Automatic", "Automática"]]].map(([k, n]) => `<button data-orient="${k}" aria-pressed="${o === k}">${tr(n)}</button>`).join("")}</div>` : "") + _extraOptsL();
};
const _openMenuL = openMenu;
openMenu = function (tab) { _openMenuL(tab); document.querySelectorAll(".modal [data-orient]").forEach(b => b.onclick = () => { setOrientation(b.dataset.orient); openMenu("opts"); }); };
