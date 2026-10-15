/* =================== BOOT =================== */
let resizeT = null;
window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => {
  if (SCREEN === "combat" && CB) sizeBoard(); else if (SCREEN === "story" && S) paint($("#artcv"), SC[S.scene].bg); else if (SCREEN === "title") paint($("#tcv"), "title");
}, 150); });
function boot(data) {
  const p = load(PREF_KEY); if (p) PREF = {...PREF, ...p};
  else { const nl = (navigator.language || "it").slice(0, 2); PREF.lang = nl === "en" ? 1 : nl === "es" ? 2 : 0; }
  setLang(PREF.lang);
  if (data && data.S) { S = data.S; if (data.PREF) PREF = data.PREF; setLang(S.lang ?? PREF.lang); goScene(S.scene, true); return; }
  renderTitle();
}
window.claude?.hot?.snapshot?.(() => ({S: CB ? (CBSNAP ? JSON.parse(CBSNAP) : S) : S, PREF}));
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
