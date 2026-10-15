/* =================== UI POLISH: title, creation, story, dice =================== */
Object.assign(ICONS, {
  r_human:'<circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  r_elf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19 14 10M9 15h4M11 12V9"/>',
  r_dwarf:'<path d="M6 9a6 6 0 0 1 12 0"/><path d="M5 9h14M6 10c0 6 3 11 6 11s6-5 6-11"/><path d="M9.5 14c1.2 1 3.8 1 5 0M12 15v4"/>',
  r_halfling:'<circle cx="12" cy="7" r="3.2"/><circle cx="7.3" cy="12" r="3.2"/><circle cx="16.7" cy="12" r="3.2"/><path d="M12 14v7"/>',
  r_orc:'<path d="M5 8a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0z"/><path d="M8.5 16l1-3.5M15.5 16l-1-3.5M9.5 9h.01M14.5 9h.01"/>',
  r_tief:'<path d="M5 2c0 4 2 7 4.5 8M19 2c0 4-2 7-4.5 8"/><circle cx="12" cy="14.5" r="6"/><path d="M10 13.5h.01M14 13.5h.01M10.5 17h3"/>',
  coin:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  swords:'<path d="M4 4l10 10M4 4h3.5M4 4v3.5M20 4 10 14M20 4h-3.5M20 4v3.5M7 16l-3 3M17 16l3 3M8.5 13.5l2 2M15.5 13.5l-2 2"/>',
  d20:'<path d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/><path d="M12 2 6.5 11h11zM6.5 11 12 22l5.5-11M3.3 7l3.2 4M20.7 7l-3.2 4M3.3 17l3.2-6M20.7 17l-3.2-6"/>',
  arrow:'<path d="M5 12h13M13 6l6 6-6 6"/>',
});
const RACE_IC = {human:"r_human", elf:"r_elf", dwarf:"r_dwarf", halfling:"r_halfling", halforc:"r_orc", tiefling:"r_tief"};
const BG_IC = {soldier:"shield", acolyte:"sun", criminal:"dagger", sage:"scroll", noble:"crown", outlander:"leaf"};
const AMB_OF = {road:"ash", village:"embers", graveyard:"motes", forest:"fireflies", hut:"fireflies", camp:"embers", cultcamp:"violet", stones:"violet", mill:"embers", bridge:"ash",
  city:"violet", tower:"violet", bell:"violet", mountain:"ash", fortress:"ash", throne:"embers", dawn:"light", twilight:"light", dark:"violet",
  inn:"dust", tavern2:"dust", shrine:"motes", crypt:"motes", archive:"dust", palace:"violet", sewer:"bubbles", drowned:"bubbles", mirror:"violet", dungeon:"embers", title:"embers"};
BG.title = {sky:["#060509","#2b1f30"], sun:[.5,.24,.2], L:["peaks","fort","fog"]};
const REDUCED = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const medHTML = (ic, cls = "") => `<span class="med ${cls}">${icon(ic)}</span>`;

/* ---------- animated scene art ---------- */
const AMBS = new Map();
function ambient(cv, key) {
  if (!cv) return; paint(cv, key);
  if (REDUCED) return;
  const prev = AMBS.get(cv); if (prev) cancelAnimationFrame(prev);
  const b = BG[key] || BG.road, type = AMB_OF[key] || "ash";
  const off = document.createElement("canvas"); off.width = cv.width; off.height = cv.height; off.getContext("2d").drawImage(cv, 0, 0);
  const x = cv.getContext("2d"), W = cv.clientWidth, H = cv.clientHeight, dpr = cv.width / Math.max(1, W);
  const sun = b.sun ? {x: W * b.sun[0], y: H * b.sun[1], r: Math.min(W, H * 1.6) * b.sun[2]} : null;
  const ps = []; const R = Math.random;
  const spawn = () => {
    if (type === "embers") ps.push({x: R() * W, y: H + 4, vx: (R() - .5) * .3, vy: -.35 - R() * .55, l: 0, m: 220, s: 1 + R() * 1.4, c: R() > .5 ? "255,160,80" : "255,210,130", tw: 0});
    else if (type === "ash") ps.push({x: R() * W * 1.2 - W * .1, y: -4, vx: .15 + R() * .3, vy: .25 + R() * .35, l: 0, m: 400, s: 1 + R(), c: "215,210,205", tw: 0, flat: 1});
    else if (type === "fireflies") ps.push({x: R() * W, y: H * (.35 + R() * .6), vx: (R() - .5) * .35, vy: (R() - .5) * .25, l: 0, m: 260, s: 1.4 + R(), c: "214,240,140", tw: 1});
    else if (type === "violet") ps.push({x: R() * W, y: H * (.3 + R() * .7), vx: (R() - .5) * .15, vy: -.12 - R() * .2, l: 0, m: 260, s: 1.2 + R() * 1.4, c: "190,150,255", tw: 1});
    else if (type === "motes" || type === "dust") ps.push({x: R() * W, y: R() * H, vx: (R() - .5) * .12, vy: (R() - .5) * .1 - .03, l: 0, m: 300, s: .9 + R() * 1.2, c: type === "dust" ? "255,215,160" : "220,215,255", tw: 1});
    else if (type === "bubbles") ps.push({x: R() * W, y: H * (.75 + R() * .25), vx: 0, vy: -.2 - R() * .3, l: 0, m: 160, s: 1.2 + R() * 2, c: "160,230,215", ring: 1});
    else if (type === "light") ps.push({x: R() * W, y: H * (.5 + R() * .5), vx: (R() - .5) * .2, vy: -.25 - R() * .3, l: 0, m: 260, s: 1.2 + R() * 1.5, c: "255,230,170", tw: 1});
  };
  for (let i = 0; i < 40; i++) { spawn(); const q = ps[ps.length - 1]; q.l = Math.floor(R() * q.m * .8); q.x += q.vx * q.l; q.y += q.vy * q.l; }
  const step = t => {
    if (!cv.isConnected) { AMBS.delete(cv); return; }
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(off, 0, 0); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (sun) { const f = .6 + .4 * Math.sin(t / 1100);
      const g = x.createRadialGradient(sun.x, sun.y, sun.r, sun.x, sun.y, sun.r * 3.4); g.addColorStop(0, `rgba(240,225,190,${.22 * f})`); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(sun.x, sun.y, sun.r * 3.4, 0, 7); x.fill();
      x.save(); x.translate(sun.x, sun.y); x.rotate(t / 20000); x.strokeStyle = `rgba(240,225,190,${.12 + .08 * f})`; x.lineWidth = 1;
      for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7, l1 = sun.r * 1.15, l2 = sun.r * (2 + (i % 2) * .7 + Math.sin(t / 700 + i) * .15); x.beginPath(); x.moveTo(Math.cos(a) * l1, Math.sin(a) * l1); x.lineTo(Math.cos(a) * l2, Math.sin(a) * l2); x.stroke(); }
      x.restore(); x.fillStyle = "#040305"; x.beginPath(); x.arc(sun.x, sun.y, sun.r * .985, 0, 7); x.fill(); }
    if (ps.length < 46 && R() < .5) spawn();
    for (let i = ps.length - 1; i >= 0; i--) { const q = ps[i]; q.l++; q.x += q.vx; q.y += q.vy; if (q.flat) q.vx += Math.sin((q.l + i) / 40) * .004;
      if (q.l > q.m || q.y < -10 || q.y > H + 10) { ps.splice(i, 1); continue; }
      const k = q.l / q.m, a = Math.min(1, k * 6, (1 - k) * 4) * (q.tw ? .35 + .65 * Math.abs(Math.sin(q.l / 18 + i)) : .85);
      if (q.ring) { x.strokeStyle = `rgba(${q.c},${a * .6})`; x.lineWidth = .8; x.beginPath(); x.arc(q.x, q.y, q.s, 0, 7); x.stroke(); continue; }
      if (q.flat) { x.fillStyle = `rgba(${q.c},${a * .55})`; x.fillRect(q.x, q.y, q.s, q.s); continue; }
      const g = x.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.s * 3); g.addColorStop(0, `rgba(${q.c},${a})`); g.addColorStop(1, `rgba(${q.c},0)`); x.fillStyle = g; x.beginPath(); x.arc(q.x, q.y, q.s * 3, 0, 7); x.fill(); }
    AMBS.set(cv, requestAnimationFrame(step));
  };
  AMBS.set(cv, requestAnimationFrame(step));
}

/* ---------- title ---------- */
function renderTitle() {
  showScreen("title"); closeModal(); const sv = load(SAVE_KEY);
  $("#title").innerHTML = `<canvas id="tcv" aria-hidden="true"></canvas>
  <div class="title-inner">
    <h1 class="logo"><span class="lg1">Dark Days</span><span class="lg2">Chronicles</span></h1>
    <div class="orn"><i></i>${icon("sun")}<i></i></div>
    <p class="tag">${T_("tag")}</p>
    <div class="tgrid">
      <div><div class="lbl">${T_("lang")}</div>${langSeg()}</div>
      <div><div class="lbl">${T_("diff")}</div>${diffSeg(PREF.diff)}</div>
    </div>
    ${sv ? `<button class="btn primary big" id="tCont"><small>${T_("cont")}</small>${esc(sv.party[0].name)} · ${T_("lvl")} ${sv.level}</button>` : ""}
    <button class="btn ${sv ? "" : "primary big"}" id="tNew">${T_("newg")}</button>
    <p class="foot">${T_("foot")}</p>
  </div>`;
  ambient($("#tcv"), "title");
  $("#title").querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { setLang(+b.dataset.lang); renderTitle(); });
  $("#title").querySelectorAll("[data-diff]").forEach(b => b.onclick = () => { PREF.diff = +b.dataset.diff; store(PREF_KEY, PREF); renderTitle(); });
  $("#tNew").onclick = () => { CR = freshCR(); renderCreate(); };
  if (sv) $("#tCont").onclick = () => { S = sv; if (S.lang != null) setLang(S.lang); goScene(S.scene, true); };
}

/* ---------- creation ---------- */
function optCards(obj, curKey, attr, iconFn) {
  return `<div class="opts">${Object.keys(obj).map(k => `<button class="opt" data-${attr}="${k}" aria-pressed="${curKey === k}">${medHTML(iconFn(k), curKey === k ? "on" : "")}<span style="min-width:0"><b>${tr(obj[k].n)}</b><span>${tr(obj[k].d)}</span></span></button>`).join("")}</div>`;
}
const _renderCreateBase = renderCreate;
renderCreate = function () {
  _renderCreateBase();
  const top = $("#create .top");
  const nm = (CR.name || "").trim() || "—";
  top.insertAdjacentHTML("afterbegin", `<div class="hero">${medHTML(CLASSES[CR.cls].icon, "big on")}<div><b id="heroName">${esc(nm)}</b><span>${tr(RACES[CR.race].n)} · ${tr(CLASSES[CR.cls].n)} · ${tr(BGS[CR.bg].n)}</span></div></div>`);
  const nmIn = $("#pcName"); if (nmIn) nmIn.addEventListener("input", () => { $("#heroName").textContent = nmIn.value.trim() || "—"; });
  $("#create").querySelectorAll("[data-race]").forEach(b => { b.querySelector(".med").innerHTML = icon(RACE_IC[b.dataset.race]); });
  $("#create").querySelectorAll("[data-bg]").forEach(b => { b.querySelector(".med").innerHTML = icon(BG_IC[b.dataset.bg]); });
};

/* ---------- story ---------- */
function chipsHTML() {
  return S.party.map(c => { const f = Math.max(0, c.hp / c.maxhp);
    return `<div class="chip"><span class="pmed${f < .35 ? " lo" : ""}"><svg class="pring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="45"/><circle class="hp" cx="50" cy="50" r="45" style="stroke-dashoffset:${283 * (1 - f)}"/></svg><span class="med sm">${icon(CL(c).icon)}</span></span><span class="cn">${esc(c.name.split(" ")[0])}<small>${c.hp}/${c.maxhp}</small></span></div>`; }).join("");
}
function choiceIcon(ch) { return ch.check ? "d20" : ch.fight ? "swords" : ch.shop ? "coin" : ch.rest ? "moon" : ch.end ? "sun" : "arrow"; }
function renderStory() {
  showScreen("story"); const sc = SC[S.scene];
  const text = tr(typeof sc.t === "function" ? sc.t() : sc.t).replace(/\{n\}/g, pc().name);
  const paras = text.split("\n\n").map(p => (isCard(p) || /^(ATTO|ACT|ACTO) [IV]+ —/.test(p)) ? `<div class="actcard"><div class="orn"><i></i>${icon("sun")}<i></i></div><p>${esc(p)}</p><div class="orn"><i></i><b></b><i></i></div></div>` : `<p>${esc(p)}</p>`).join("");
  const chs = visibleChoices(sc);
  $("#story").innerHTML = `<div class="hud"><div class="chips">${chipsHTML()}</div><span class="gold">${icon("coin")}${S.gold}</span><button class="iconbtn" id="menuBtn" aria-label="${T_("menu")}">${icon("menu")}</button></div>
    <div class="scroll story-scroll" id="storyScroll">
      <div class="art"><canvas id="artcv" aria-hidden="true"></canvas><div class="loc"><span>${esc(tr(sc.loc || ""))}</span></div></div>
      <div class="pagebody"><div class="prose">${paras}</div>
      <div class="orn sm"><i></i><b></b><i></i></div>
      <div class="choices">${chs.map((ch, i) => `<button class="choice k-${choiceIcon(ch)}" data-ch="${i}" ${ch.cost && S.gold < ch.cost ? "disabled" : ""}><span class="n" data-n="${i + 1}"></span><span class="ct">${esc(tr(ch.t))}${choiceTag(ch)}</span><span class="ci">${icon(choiceIcon(ch))}</span></button>`).join("")}</div></div>
    </div>`;
  ambient($("#artcv"), sc.bg);
  $("#menuBtn").onclick = () => openMenu("party");
  $("#story").querySelectorAll("[data-ch]").forEach(b => b.onclick = () => choose(+b.dataset.ch));
  if (S.pendingLv && S.pendingLv.length) showLevelUp();
}

/* ---------- dice ---------- */
function d20SVG(n, cls) {
  return `<svg class="d20s ${cls || ""}" viewBox="0 0 120 120" aria-hidden="true">
    <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b3d5e"/><stop offset=".55" stop-color="#211a2b"/><stop offset="1" stop-color="#120d18"/></linearGradient></defs>
    <polygon points="60,6 107,33 107,87 60,114 13,87 13,33" fill="url(#dg)" class="edge"/>
    <polygon points="60,6 28,58 92,58" class="f f1"/><polygon points="28,58 60,114 92,58" class="f f2"/>
    <path d="M13,33 28,58 13,87M107,33 92,58 107,87M60,6 13,33M60,6 107,33M28,58 60,114M92,58 60,114" class="ln"/>
    <text x="60" y="82" text-anchor="middle" class="num">${n}</text></svg>`;
}
function doCheck(spec) {
  return new Promise(res => {
    let who, bonus, label;
    if (spec.save) { who = pc(); bonus = saveBonus(who, spec.save); label = `${abL(spec.save)} · ${tr(["tiro salvezza","saving throw","salvación"])}`; }
    else { const sk = spec.sk; if (spec.pc || SOCIAL.includes(sk)) who = pc(); else who = S.party.reduce((a, c) => skillBonus(c, sk) > skillBonus(a, sk) ? c : a, pc()); bonus = skillBonus(who, sk); label = tr(SKILLS[sk][0]); }
    const auto = spec.auto && spec.auto(), adv = spec.adv && spec.adv();
    const a = d20For(who), b = adv ? d20For(who) : null, r = adv ? Math.max(a, b) : a, tot = r + bonus;
    const ok = auto || r === 20 || (r !== 1 && tot >= spec.dc);
    const nat = !auto && r === 20 ? tr(["Venti naturale!","Natural 20!","¡Veinte natural!"]) : !auto && r === 1 ? tr(["Uno naturale","Natural 1","Uno natural"]) : "";
    const m = modal(`<div class="dice">
      <div class="lbl">${esc(label)}</div>
      <div class="dc">${T_("dc")} <b>${spec.dc}</b></div>
      <div class="d20wrap" id="d20w">${d20SVG(auto ? "✓" : "?", "rolling")}</div>
      <div class="math" id="dmath" style="visibility:hidden">${auto ? tr(["Sai già come fare.","You already know how.","Ya sabes cómo hacerlo."]) :
        `<span class="who">${esc(who.name)}</span>${adv ? `<span class="chipx">${a} / ${b} · ${T_("adv")}</span>` : ""}<span class="chipx">d20 <b>${r}</b></span><span class="chipx">${sgn(bonus)}</span><span class="chipx tot">= <b>${tot}</b></span>`}</div>
      <div class="res ${ok ? "ok" : "ko"}" id="dres" style="visibility:hidden">${ok ? T_("success") : T_("failure")}${nat ? `<small>${nat}</small>` : ""}</div>
      <button class="btn primary" id="dgo" style="visibility:hidden">${T_("goOn")}</button></div>`, {center: 1, locked: 1});
    const w = $("#d20w"); let n = 0;
    const iv = auto ? null : setInterval(() => { const t = w.querySelector(".num"); if (t) t.textContent = rnd(20); if (++n > 12) clearInterval(iv); }, 60);
    setTimeout(() => { if (iv) clearInterval(iv); w.innerHTML = d20SVG(auto ? "✓" : r, (ok ? "good" : "bad") + (nat ? " nat" : "")); ["dmath", "dres", "dgo"].forEach(id => $("#" + id).style.visibility = "visible"); $("#dgo").focus(); }, auto ? 250 : 900);
    m.querySelector("#dgo").onclick = () => { closeModal(); res(ok); };
  });
}
window.addEventListener("resize", () => setTimeout(() => { if (SCREEN === "story" && S) ambient($("#artcv"), SC[S.scene].bg); else if (SCREEN === "title") ambient($("#tcv"), "title"); }, 200));
