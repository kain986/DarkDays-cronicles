/* =================== COMBAT PRESENTATION =================== */
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
Object.assign(ICONS, {
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  bolt:'<path d="M13 2 5 13h6l-1 9 8-11h-6z"/>',
  burst:'<path d="M12 2l2 6 6-3-3 6 6 2-6 2 3 6-6-3-2 6-2-6-6 3 3-6-6-2 6-2-3-6 6 3z"/>',
  wind:'<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5"/>',
  potion:'<path d="M9 3h6M10 3v5l-4 7a4 4 0 0 0 3.5 6h5A4 4 0 0 0 18 15l-4-7V3"/><path d="M7.5 14h9"/>',
  hammer:'<path d="M5 21 14 12M11 5l8 8 2.5-2.5-8-8zM9.5 6.5l2-2M17.5 14.5l2-2"/>',
  staff:'<path d="M5 21 16 8"/><circle cx="18" cy="6" r="3"/><path d="M18 1.5v1.5M22.5 6H21"/>',
  mace:'<path d="M4 20l8-8"/><circle cx="15.5" cy="8.5" r="4"/><path d="M15.5 2.5v2M21.5 8.5h-2M15.5 14.5v-2M9.5 8.5h2"/>',
  javelin:'<path d="M3 21 18 6M14 4h6v6"/>',
  wolf:'<path d="M4 3l4 6h8l4-6v10l-4 7H8l-4-7z"/><path d="M9.5 13h.01M14.5 13h.01M10.5 17h3"/>',
  ghost:'<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.4-2-2.3 2-2.3-2-2.3 2-2.3-2z"/><path d="M9.5 11h.01M14.5 11h.01"/>',
  maw:'<path d="M2 8c4-4 16-4 20 0-2 10-18 10-20 0z"/><path d="M5 9l1.5 3L8 9l1.5 3L11 9l1.5 3L14 9l1.5 3L17 9l1.5 3L20 9"/>',
  goblin:'<path d="M2 7l5 3a5 5 0 0 1 10 0l5-3-2 7a8 8 0 0 1-16 0z"/><path d="M9.5 13h.01M14.5 13h.01M10 17h4"/>',
  rat:'<path d="M2 15c0-4 4-7 9-7 3 0 6 2 7 4l3 1-3 2c-1 2-4 3-7 3H8l-3 3"/><path d="M15.5 11.5h.01"/>',
  scroll:'<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M5 6a2 2 0 1 1 2-2M9 9h6M9 13h6"/>',
  end:'<path d="M5 12h12M13 6l6 6-6 6"/>',
});
const FOE_IC = {wolf:"wolf", rat:"rat", goblin:"goblin", gobarcher:"goblin", shadow:"ghost", shade:"ghost", avatar:"maw", avatarw:"maw", ghoul:"skull"};
const WEAP_IC = {longsword:"sword", warhammer:"hammer", javelin:"javelin", rapier:"dagger", shortsword:"dagger", shortbow:"bow", longbow:"bow", quarterstaff:"staff", mace:"mace"};
const SPELL_IC = {firebolt:"flame", sacredflame:"sun", magicmissile:"star", sleep:"moon", burninghands:"burst", curewounds:"heart", healingword:"heart", bless:"sun", guidingbolt:"bolt", huntersmark:"target", scorchingray:"flame", mistystep:"wind", spiritualweapon:"sword", fireball:"burst", spiritguardians:"sun", masshealingword:"heart", icestorm:"star"};
const ABIL_IC = {dash:"wind", dodge:"shield", secondwind:"heart", actionsurge:"bolt", lay:"hand", smite:"sun", cunning:"wind", turn:"sun", spiritstrike:"sword", disengage:"end", cunningdis:"end", overwatch:"eye", shove:"hand", power:"burst"};
const TYPE_COL = {fire:"#ff8a3c", cold:"#a9dcff", radiant:"#ffe08a", necrotic:"#b07ae8", force:"#9fb6ff", sleep:"#8fb0ea", mark:"#ff5a72", poison:"#8fd16a", slash:"#f3e6c8", pierce:"#f3e6c8", blunt:"#f3e6c8"};
const MSTYLE = {
  road:{g:"dirt", base:"#3b3226", ob:"rock", light:"rgba(230,205,170,.12)", amb:"ash"},
  forest:{g:"grass", base:"#232a21", ob:"tree", light:"rgba(170,190,230,.10)", amb:"fireflies"},
  mill:{g:"wood", base:"#3a2a1c", ob:"barrel", light:"rgba(255,170,90,.2)", amb:"embers"},
  grave:{g:"grass", base:"#25271f", ob:"grave", light:"rgba(170,190,235,.12)", amb:"motes"},
  stones:{g:"grass", base:"#2a2722", ob:"menhir", light:"rgba(190,150,250,.16)", amb:"motes"},
  bridge:{g:"stone", base:"#39342d", ob:"crate", light:"rgba(255,170,90,.14)", amb:"embers"},
  tower:{g:"stone", base:"#2d2638", ob:"pillar", light:"rgba(180,130,250,.24)", amb:"motes"},
  roof:{g:"tiles", base:"#3e2b2c", ob:"chimney", light:"rgba(180,130,250,.14)", amb:"ash"},
  palace:{g:"marble", base:"#3a3042", ob:"pillar", light:"rgba(210,170,255,.18)", amb:"motes"},
  sewer:{g:"stone", base:"#23302a", ob:"water", light:"rgba(120,200,160,.14)", amb:"drips"},
  water:{g:"stone", base:"#1e2b32", ob:"water", light:"rgba(110,200,190,.16)", amb:"drips"},
  archive:{g:"wood", base:"#3b2c1e", ob:"shelf", light:"rgba(255,200,120,.18)", amb:"motes"},
  snow:{g:"snow", base:"#4a4851", ob:"rock", light:"rgba(225,225,245,.10)", amb:"ash"},
  fort:{g:"stone", base:"#2b2529", ob:"pillar", light:"rgba(255,120,70,.16)", amb:"embers"},
  mirror:{g:"obsidian", base:"#17141f", ob:"mirror", light:"rgba(170,120,250,.22)", amb:"motes"},
  dungeon:{g:"stone", base:"#2b2722", ob:"pillar", light:"rgba(255,140,60,.18)", amb:"embers"},
  throne:{g:"obsidian", base:"#1f1319", ob:"pillar", light:"rgba(240,200,120,.16)", amb:"embers"},
};
const mapKey = () => ENC[CB.key].map;
const uIcon = u => u.side === "e" ? (FOE_IC[u.foe] || u.icon) : u.icon;

/* ---------- board construction ---------- */
function buildCombat() {
  $("#combat").innerHTML = `
  <div class="init" id="ini"></div>
  <div class="board-wrap" id="bw"><div class="board" id="board"><canvas id="terrain" aria-hidden="true"></canvas><canvas id="fx" aria-hidden="true"></canvas></div><div class="banner" id="ban" hidden></div></div>
  <div class="info" id="info" aria-live="polite"></div>
  <div class="cbp" id="cbp"></div>
  <div class="hotrow"><div class="hot" id="hot"></div><button class="endbtn" id="aEnd">${icon("end")}<span>${T_("endTurn")}</span></button></div>
  <button class="cblog" id="cblog" aria-label="Log"></button>`;
  const b = $("#board");
  let h = ""; for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) h += `<div class="cell" data-x="${x}" data-y="${y}"></div>`;
  b.insertAdjacentHTML("beforeend", h);
  CB.units.forEach(u => {
    const t = document.createElement("div"); t.className = "tok " + u.side + (u.boss ? " boss" : ""); t.id = "t_" + u.uid;
    t.innerHTML = `<div class="in"><div class="base"></div><div class="aura"></div><svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="trk" cx="50" cy="50" r="46"/><circle class="hp" cx="50" cy="50" r="46"/></svg><div class="disc">${icon(uIcon(u))}</div><span class="st"></span><span class="chance"></span></div>`;
    b.appendChild(t);
  });
  b.onclick = e => { const c = e.target.closest(".cell"); if (c) onCell(+c.dataset.x, +c.dataset.y); };
  $("#aEnd").onclick = () => { if (CB && !CB.busy && cur() && cur().side === "p") endTurn(); };
  $("#cblog").onclick = openLog;
  sizeBoard(); renderCombat();
  if (typeof ResizeObserver !== "undefined") { if (CB.ro) CB.ro.disconnect(); CB.ro = new ResizeObserver(() => { if (CB && $("#bw")) sizeBoard(); }); CB.ro.observe($("#bw")); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (CB) sizeBoard(); });
}
function sizeBoard() {
  const bw = $("#bw"); if (!bw || !CB) return;
  const land = isLand();
  const W = (land ? bw.clientWidth : Math.min(bw.clientWidth, 560)) - (land ? 20 : 32), H = bw.clientHeight - (land ? 30 : 36);
  const cell = Math.max(24, Math.floor(land ? Math.min(W / ROWS, H / COLS) : Math.min(W / COLS, H / ROWS)));
  if (cell === CB.cell && $("#terrain").width && CB.landAt === land) return;
  CB.landAt = land;
  CB.cell = cell;
  const b = $("#board"); b.style.setProperty("--cell", CB.cell + "px");
  paintTerrain(); fxInit(); placeTokens();
}

/* ---------- terrain painter ---------- */
function shade(hex, f) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b); return `rgb(${r},${g},${b})`; }
function paintTerrain() {
  const cv = $("#terrain"); if (!cv) return; const st = MSTYLE[mapKey()] || MSTYLE.road, C = CB.cell, W = COLS * C, H = ROWS * C;
  const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr;
  const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  let seed = hashStr(CB.key + (CB.seed || (CB.seed = rnd(9999)))); const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  x.fillStyle = st.base; x.fillRect(0, 0, W, H);
  GROUND[st.g](x, W, H, C, R, st.base);
  // grid
  x.strokeStyle = "rgba(0,0,0,.28)"; x.lineWidth = 1;
  for (let i = 1; i < COLS; i++) { x.beginPath(); x.moveTo(i * C + .5, 0); x.lineTo(i * C + .5, H); x.stroke(); }
  for (let j = 1; j < ROWS; j++) { x.beginPath(); x.moveTo(0, j * C + .5); x.lineTo(W, j * C + .5); x.stroke(); }
  x.strokeStyle = "rgba(255,240,210,.05)";
  for (let i = 1; i < COLS; i++) { x.beginPath(); x.moveTo(i * C + 1.5, 0); x.lineTo(i * C + 1.5, H); x.stroke(); }
  // lighting
  const lg = x.createRadialGradient(W * .5, H * .45, C, W * .5, H * .45, H * .75); lg.addColorStop(0, st.light); lg.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = lg; x.fillRect(0, 0, W, H);
  // obstacles, back to front
  [...CB.ob].map(k => k.split(",").map(Number)).sort((a, b) => a[1] - b[1]).forEach(([ox, oy]) => OBST[st.ob](x, (ox + .5) * C, (oy + .5) * C, C, R));
  const v = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .72); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.55)"); x.fillStyle = v; x.fillRect(0, 0, W, H);
}
const GROUND = {
  dirt(x, W, H, C, R, b) { for (let i = 0; i < W * H / 60; i++) { x.fillStyle = R() > .5 ? "rgba(255,230,190,.05)" : "rgba(0,0,0,.12)"; x.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2); }
    for (let i = 0; i < 40; i++) { const px = R() * W, py = R() * H, r = 1.5 + R() * 3; x.fillStyle = shade(b, .18 + R() * .1); x.beginPath(); x.ellipse(px, py, r, r * .7, R() * 3, 0, 7); x.fill(); x.fillStyle = "rgba(0,0,0,.3)"; x.beginPath(); x.ellipse(px + 1, py + 1.2, r, r * .5, 0, 0, 7); x.fill(); }
    for (let i = 0; i < 6; i++) { const g = x.createRadialGradient(R() * W, R() * H, 0, R() * W, R() * H, C * 2); g.addColorStop(0, "rgba(0,0,0,.18)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H); } },
  grass(x, W, H, C, R, b) { GROUND.dirt(x, W, H, C, R, b); const cols = [shade(b, .12), shade(b, .22), shade(b, -.25), "#4a5236", "#3a4a33"];
    for (let i = 0; i < W * H / 18; i++) { const px = R() * W, py = R() * H, l = 3 + R() * 5; x.strokeStyle = cols[Math.floor(R() * cols.length)]; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (R() - .5) * 3, py - l); x.stroke(); } },
  wood(x, W, H, C, R, b) { const ph = C / 2; for (let row = 0; row * ph < H; row++) { let px = -R() * C; while (px < W) { const len = C * (1 + R() * 2); x.fillStyle = shade(b, (R() - .5) * .22); x.fillRect(px, row * ph, len, ph); x.strokeStyle = "rgba(255,220,170,.06)"; for (let g = 0; g < 3; g++) { const gy = row * ph + 3 + R() * (ph - 6); x.beginPath(); x.moveTo(px + 2, gy); x.bezierCurveTo(px + len * .3, gy + (R() - .5) * 4, px + len * .7, gy + (R() - .5) * 4, px + len - 2, gy); x.stroke(); }
      x.fillStyle = "rgba(0,0,0,.55)"; x.fillRect(px + len - 1, row * ph, 1.5, ph); x.fillStyle = "rgba(20,14,10,.8)"; x.fillRect(px + 4, row * ph + ph / 2 - 1, 2, 2); x.fillRect(px + len - 7, row * ph + ph / 2 - 1, 2, 2); px += len; }
    x.fillStyle = "rgba(0,0,0,.5)"; x.fillRect(0, row * ph, W, 1.5); } },
  stone(x, W, H, C, R, b) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { const split = R() > .5, parts = split ? [[0, 0, 1, .5], [0, .5, 1, .5]] : [[0, 0, 1, 1]];
      parts.forEach(([a, c, w, h]) => { const px = xx * C + a * C + 1.5, py = y * C + c * C + 1.5, pw = w * C - 3, ph2 = h * C - 3; x.fillStyle = shade(b, (R() - .5) * .2); x.beginPath(); x.roundRect(px, py, pw, ph2, 3); x.fill();
        x.strokeStyle = "rgba(255,240,215,.07)"; x.beginPath(); x.moveTo(px + 1, py + ph2 - 1); x.lineTo(px + 1, py + 1); x.lineTo(px + pw - 1, py + 1); x.stroke();
        x.strokeStyle = "rgba(0,0,0,.35)"; x.beginPath(); x.moveTo(px + pw, py + 2); x.lineTo(px + pw, py + ph2); x.lineTo(px + 2, py + ph2); x.stroke();
        if (R() > .7) { x.strokeStyle = "rgba(0,0,0,.4)"; x.beginPath(); x.moveTo(px + R() * pw, py + R() * ph2); x.lineTo(px + R() * pw, py + R() * ph2); x.stroke(); }
        if (R() > .8) { x.fillStyle = "rgba(90,120,70,.25)"; x.beginPath(); x.arc(px + R() * pw, py + R() * ph2, 2 + R() * 4, 0, 7); x.fill(); } }); }
    x.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < W * H / 50; i++) x.fillRect(R() * W, R() * H, 1, 1); },
  marble(x, W, H, C, R, b) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { x.fillStyle = (xx + y) % 2 ? shade(b, .1) : shade(b, -.18); x.fillRect(xx * C, y * C, C, C);
      x.strokeStyle = (xx + y) % 2 ? "rgba(255,240,255,.12)" : "rgba(200,170,230,.08)"; x.lineWidth = .8; x.beginPath(); x.moveTo(xx * C + R() * C, y * C); x.bezierCurveTo(xx * C + R() * C, y * C + C * .4, xx * C + R() * C, y * C + C * .6, xx * C + R() * C, y * C + C); x.stroke(); }
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "rgba(255,255,255,.05)"); g.addColorStop(.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255,.04)"); x.fillStyle = g; x.fillRect(0, 0, W, H); },
  tiles(x, W, H, C, R, b) { const tw = C / 2.5, th = C / 3.2; for (let row = 0; row * th < H + th; row++) for (let i = -1; i * tw < W + tw; i++) { const px = i * tw + (row % 2 ? tw / 2 : 0), py = row * th; x.fillStyle = shade(b, (R() - .5) * .25); x.beginPath(); x.moveTo(px, py); x.lineTo(px + tw, py); x.lineTo(px + tw, py + th * .6); x.quadraticCurveTo(px + tw / 2, py + th * 1.15, px, py + th * .6); x.closePath(); x.fill(); x.strokeStyle = "rgba(0,0,0,.4)"; x.stroke(); } },
  snow(x, W, H, C, R, b) { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, shade(b, .25)); g.addColorStop(1, shade(b, -.1)); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 25; i++) { x.fillStyle = R() > .6 ? "rgba(255,255,255,.18)" : "rgba(40,36,40,.22)"; x.fillRect(R() * W, R() * H, 1.4, 1.4); }
    for (let i = 0; i < 14; i++) { x.fillStyle = "rgba(30,26,30,.18)"; x.beginPath(); x.ellipse(R() * W, R() * H, C * (.3 + R() * .6), C * (.15 + R() * .2), R() * 3, 0, 7); x.fill(); } },
  obsidian(x, W, H, C, R, b) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { const g = x.createLinearGradient(xx * C, y * C, xx * C + C, y * C + C); g.addColorStop(0, shade(b, .12)); g.addColorStop(.5, shade(b, -.2)); g.addColorStop(1, shade(b, .04)); x.fillStyle = g; x.fillRect(xx * C + 1, y * C + 1, C - 2, C - 2);
      if (R() > .55) { x.strokeStyle = "rgba(190,130,255,.45)"; x.lineWidth = 1; x.shadowColor = "#b48af0"; x.shadowBlur = 6; x.beginPath(); let px = xx * C + R() * C, py = y * C + R() * C; x.moveTo(px, py); for (let k = 0; k < 3; k++) { px += (R() - .5) * C * .6; py += (R() - .5) * C * .6; x.lineTo(px, py); } x.stroke(); x.shadowBlur = 0; } } },
};
function obShadow(x, cx, cy, rx, ry) { const g = x.createRadialGradient(cx, cy, 0, cx, cy, rx); g.addColorStop(0, "rgba(0,0,0,.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill(); }
const OBST = {
  rock(x, cx, cy, C, R) { obShadow(x, cx + C * .06, cy + C * .2, C * .48, C * .22); const n = 8, pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = C * (.3 + R() * .12); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * .85 - C * .03]); }
    const g = x.createLinearGradient(cx - C * .3, cy - C * .35, cx + C * .3, cy + C * .3); g.addColorStop(0, "#8b8378"); g.addColorStop(.55, "#5a544c"); g.addColorStop(1, "#2a2622"); x.fillStyle = g; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fill();
    x.strokeStyle = "rgba(0,0,0,.5)"; x.lineWidth = 1.2; x.stroke(); x.strokeStyle = "rgba(255,245,225,.25)"; x.beginPath(); x.moveTo(pts[4][0], pts[4][1]); x.lineTo(pts[5][0], pts[5][1]); x.lineTo(pts[6][0], pts[6][1]); x.stroke();
    x.strokeStyle = "rgba(0,0,0,.45)"; x.beginPath(); x.moveTo(cx - C * .05, cy - C * .12); x.lineTo(cx + C * .06, cy + C * .02); x.lineTo(cx + C * .02, cy + C * .14); x.stroke(); },
  tree(x, cx, cy, C, R) { obShadow(x, cx + C * .1, cy + C * .14, C * .5, C * .3);
    x.strokeStyle = "rgba(214,206,190,.75)"; x.lineCap = "round"; for (let i = 0; i < 5; i++) { const a = R() * Math.PI * 2, l = C * (.45 + R() * .2); x.lineWidth = 2.2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); x.stroke(); x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx + Math.cos(a) * l * .7, cy + Math.sin(a) * l * .7); x.lineTo(cx + Math.cos(a + .5) * l * .95, cy + Math.sin(a + .5) * l * .95); x.stroke(); }
    const g = x.createRadialGradient(cx - C * .08, cy - C * .1, C * .04, cx, cy, C * .32); g.addColorStop(0, "#f1ebde"); g.addColorStop(.7, "#bdb5a3"); g.addColorStop(1, "#7d7668"); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, C * .3, 0, 7); x.fill();
    x.strokeStyle = "rgba(90,82,70,.5)"; x.lineWidth = .8; x.beginPath(); x.arc(cx, cy, C * .22, 0, 7); x.stroke(); x.beginPath(); x.arc(cx, cy, C * .17, 0, 7); x.stroke();
    const h = x.createRadialGradient(cx, cy, 0, cx, cy, C * .14); h.addColorStop(0, "#000"); h.addColorStop(1, "#1c1915"); x.fillStyle = h; x.beginPath(); x.arc(cx + C * .02, cy + C * .02, C * .13, 0, 7); x.fill(); },
  barrel(x, cx, cy, C, R) { obShadow(x, cx + C * .06, cy + C * .16, C * .42, C * .22); const r = C * .32; const g = x.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); g.addColorStop(0, "#9a7046"); g.addColorStop(1, "#4c321d"); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.strokeStyle = "#2a2a2e"; x.lineWidth = 2.4; x.beginPath(); x.arc(cx, cy, r - 1.5, 0, 7); x.stroke(); x.lineWidth = 1.6; x.beginPath(); x.arc(cx, cy, r * .62, 0, 7); x.stroke();
    x.strokeStyle = "rgba(0,0,0,.35)"; x.lineWidth = 1; for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(cx + i * r * .3, cy - r * .55); x.lineTo(cx + i * r * .3, cy + r * .55); x.stroke(); }
    x.fillStyle = "rgba(255,220,170,.25)"; x.beginPath(); x.arc(cx - r * .45, cy - r * .45, r * .18, 0, 7); x.fill(); },
  grave(x, cx, cy, C, R) { obShadow(x, cx + C * .08, cy + C * .22, C * .4, C * .16); const w = C * .46, h = C * .56, l = cx - w / 2, t = cy - h * .62;
    x.fillStyle = "#3a3229"; x.beginPath(); x.ellipse(cx, cy + h * .38, w * .62, C * .1, 0, 0, 7); x.fill();
    const g = x.createLinearGradient(l, t, l + w, t + h); g.addColorStop(0, "#9a96a3"); g.addColorStop(1, "#4a4652"); x.fillStyle = g; x.beginPath(); x.moveTo(l, t + h); x.lineTo(l, t + w / 2); x.arc(cx, t + w / 2, w / 2, Math.PI, 0); x.lineTo(l + w, t + h); x.closePath(); x.fill();
    x.fillStyle = "#2f2b35"; x.fillRect(l + w - 3, t + w / 2, 3, h - w / 2); x.strokeStyle = "rgba(20,18,24,.7)"; x.lineWidth = 1.2; [.48, .62, .74].forEach(f => { x.beginPath(); x.moveTo(l + w * .22, t + h * f); x.lineTo(l + w * .7, t + h * f); x.stroke(); });
    if (R() > .5) { x.strokeStyle = "rgba(20,18,24,.8)"; x.beginPath(); x.moveTo(cx, t + w * .22); x.lineTo(cx, t + w * .62); x.moveTo(cx - w * .16, t + w * .38); x.lineTo(cx + w * .16, t + w * .38); x.stroke(); } },
  menhir(x, cx, cy, C, R) { obShadow(x, cx + C * .12, cy + C * .22, C * .45, C * .2); const w = C * .34, h = C * .78; const g = x.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, "#5f5a66"); g.addColorStop(.45, "#8d8796"); g.addColorStop(1, "#3a3640"); x.fillStyle = g;
    x.beginPath(); x.moveTo(cx - w / 2, cy + h * .4); x.lineTo(cx - w * .58, cy - h * .2); x.quadraticCurveTo(cx - w * .2, cy - h * .58, cx + w * .45, cy - h * .38); x.lineTo(cx + w / 2, cy + h * .4); x.closePath(); x.fill();
    x.strokeStyle = "rgba(200,150,255,.75)"; x.shadowColor = "#b48af0"; x.shadowBlur = 8; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx - w * .12, cy - h * .18); x.lineTo(cx + w * .1, cy - h * .05); x.lineTo(cx - w * .1, cy + h * .08); x.lineTo(cx + w * .12, cy + h * .2); x.stroke(); x.shadowBlur = 0; },
  crate(x, cx, cy, C, R) { obShadow(x, cx + C * .08, cy + C * .2, C * .45, C * .2); const s = C * .62, l = cx - s / 2, t = cy - s / 2 - C * .03;
    const g = x.createLinearGradient(l, t, l + s, t + s); g.addColorStop(0, "#a07a4c"); g.addColorStop(1, "#5a3e22"); x.fillStyle = g; x.fillRect(l, t, s, s); x.strokeStyle = "#2c1d10"; x.lineWidth = 2.2; x.strokeRect(l + 1, t + 1, s - 2, s - 2);
    x.lineWidth = 2; x.beginPath(); x.moveTo(l + 2, t + 2); x.lineTo(l + s - 2, t + s - 2); x.stroke(); x.strokeStyle = "rgba(0,0,0,.3)"; x.lineWidth = 1; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(l, t + i * s / 4); x.lineTo(l + s, t + i * s / 4); x.stroke(); } },
  pillar(x, cx, cy, C, R) { obShadow(x, cx + C * .1, cy + C * .16, C * .48, C * .26); const r = C * .34;
    x.fillStyle = "#2a2430"; x.beginPath(); x.arc(cx, cy, r + 2, 0, 7); x.fill();
    const g = x.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r); g.addColorStop(0, "#b8aec2"); g.addColorStop(.6, "#6e6578"); g.addColorStop(1, "#38323f"); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.strokeStyle = "rgba(0,0,0,.35)"; x.lineWidth = 1; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; x.beginPath(); x.moveTo(cx + Math.cos(a) * r * .55, cy + Math.sin(a) * r * .55); x.lineTo(cx + Math.cos(a) * r * .95, cy + Math.sin(a) * r * .95); x.stroke(); }
    x.strokeStyle = "rgba(255,245,230,.3)"; x.beginPath(); x.arc(cx, cy, r * .52, Math.PI * 1.1, Math.PI * 1.7); x.stroke(); },
  chimney(x, cx, cy, C, R) { obShadow(x, cx + C * .1, cy + C * .18, C * .45, C * .22); const s = C * .58, l = cx - s / 2, t = cy - s / 2;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { x.fillStyle = shade("#6b3a30", (R() - .5) * .3); x.fillRect(l + c * s / 3 + (r % 2 ? s / 6 : 0) - (r % 2 && c === 2 ? s / 6 : 0), t + r * s / 4, s / 3 - 1, s / 4 - 1); }
    x.fillStyle = "#0b0808"; x.fillRect(cx - s * .22, cy - s * .22, s * .44, s * .44); },
  water(x, cx, cy, C, R) { const g = x.createRadialGradient(cx, cy, 2, cx, cy, C * .5); g.addColorStop(0, "#0a1418"); g.addColorStop(.75, "#163038"); g.addColorStop(1, "rgba(22,48,56,0)"); x.fillStyle = g;
    x.beginPath(); for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2, r = C * (.4 + R() * .1); i ? x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : x.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill();
    x.strokeStyle = "rgba(150,230,215,.25)"; x.lineWidth = 1; for (let i = 0; i < 3; i++) { x.beginPath(); x.ellipse(cx + (R() - .5) * C * .3, cy + (R() - .5) * C * .3, C * (.06 + i * .06), C * (.03 + i * .03), 0, 0, 7); x.stroke(); }
    if (R() > .5) { x.fillStyle = "#3a2c22"; x.save(); x.translate(cx, cy); x.rotate(R() * 3); x.fillRect(-C * .3, -C * .04, C * .6, C * .08); x.restore(); } },
  shelf(x, cx, cy, C, R) { obShadow(x, cx + C * .08, cy + C * .14, C * .52, C * .22); const w = C * .9, h = C * .44, l = cx - w / 2, t = cy - h / 2;
    x.fillStyle = "#2a1a0e"; x.fillRect(l, t, w, h); let px = l + 3; while (px < l + w - 4) { const bw = 2 + R() * 4; x.fillStyle = ["#7a3b2a","#3b4f6a","#6a5a2a","#4a2f4a","#2f5a3a","#8a6a40"][Math.floor(R() * 6)]; x.fillRect(px, t + 3, bw, h - 6); px += bw + .6; }
    x.strokeStyle = "#140c06"; x.lineWidth = 2.5; x.strokeRect(l, t, w, h); x.fillStyle = "rgba(255,220,170,.12)"; x.fillRect(l, t, w, 2); },
  mirror(x, cx, cy, C, R) { obShadow(x, cx + C * .08, cy + C * .18, C * .4, C * .18); x.save(); x.translate(cx, cy); x.rotate((R() - .5) * .5);
    const g = x.createLinearGradient(-C * .2, -C * .4, C * .2, C * .4); g.addColorStop(0, "#5a4a80"); g.addColorStop(.4, "#1a1426"); g.addColorStop(.6, "#2a2040"); g.addColorStop(1, "#0c0a12"); x.fillStyle = g;
    x.beginPath(); x.moveTo(0, -C * .42); x.lineTo(C * .2, -C * .05); x.lineTo(C * .12, C * .38); x.lineTo(-C * .14, C * .34); x.lineTo(-C * .2, -C * .1); x.closePath(); x.fill();
    x.strokeStyle = "rgba(220,190,255,.8)"; x.shadowColor = "#b48af0"; x.shadowBlur = 10; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-C * .06, -C * .3); x.lineTo(C * .06, C * .2); x.stroke(); x.shadowBlur = 0; x.restore(); },
};

/* ---------- tokens ---------- */
function placeTokens() {
  if (!CB) return; const c = CB.cell, curU = CB.order[CB.ti];
  CB.units.forEach(u => { const t = $("#t_" + u.uid); if (!t) return;
    t.style.transform = `translate(${u.x * c}px,${u.y * c}px)`;
    t.classList.toggle("dead", u.side === "e" && u.hp <= 0); t.classList.toggle("down", u.side === "p" && u.down);
    t.classList.toggle("cur", curU === u && !CB.ended); t.classList.toggle("sg", !!u.cond.sg);
    const f = Math.max(0, u.hp / u.maxhp); const hp = t.querySelector(".ring .hp"); hp.style.strokeDashoffset = 289 * (1 - f); t.classList.toggle("low", f < .35);
    const st = []; if (u.cond.asleep) st.push(["Zz", "z"]); if (u.cond.stun) st.push(["✕", "x"]); if (u.cond.bless) st.push(["✦", "b"]); if (u.cond.mark) st.push(["◎", "m"]); if (u.cond.dodge) st.push(["◇", "d"]); if (u.cond.guided) st.push(["✧", "b"]); if (u.cond.smite) st.push(["☀", "b"]);
    t.querySelector(".st").innerHTML = st.map(([s, k]) => `<i class="c-${k}">${s}</i>`).join("");
  });
}
function floatAt(u, txt, col, big) {
  const b = $("#board"); if (!b || !CB) return; const d = document.createElement("div"); d.className = "fl" + (big ? " big" : ""); d.textContent = txt; d.style.color = col;
  d.style.left = (u.x + .5) * CB.cell + "px"; d.style.top = (u.y * CB.cell + (big ? -6 : 2)) + "px"; b.appendChild(d); setTimeout(() => d.remove(), 1300);
}
function shakeTok(u) { const t = $("#t_" + u.uid); if (!t) return; t.classList.remove("hit"); void t.offsetWidth; t.classList.add("hit"); }

/* ---------- FX engine ---------- */
const FX = {parts: [], anims: [], run: false};
function fxInit() {
  const cv = $("#fx"); if (!cv) return; const dpr = Math.min(2, window.devicePixelRatio || 1);
  FX.W = COLS * CB.cell; FX.H = ROWS * CB.cell; cv.width = FX.W * dpr; cv.height = FX.H * dpr; FX.x = cv.getContext("2d"); FX.x.setTransform(dpr, 0, 0, dpr, 0, 0); FX.cv = cv;
  FX.amb = (MSTYLE[mapKey()] || {}).amb;
  if (!FX.run) { FX.run = true; FX.last = performance.now(); requestAnimationFrame(fxLoop); }
}
const cpos = u => ({x: (u.x + .5) * CB.cell, y: (u.y + .5) * CB.cell});
function part(o) { if (FX.parts.length > 420) return; const q = Object.assign({vx: 0, vy: 0, g: 0, gx: 0, drag: .97, life: 0, max: 40, size: 3, col: "#fff", shape: "dot", add: true}, o);
  // the board is turned 90° in landscape: rotate "screen" motion into board space so smoke still rises
  if (isLand()) { const vx = q.vx; q.vx = q.vy; q.vy = -vx; q.gx = q.g; q.g = 0; }
  FX.parts.push(q); }
function anim(o) { return new Promise(res => { let done = false; const fin = () => { if (!done) { done = true; res(); } }; FX.anims.push(Object.assign({t: 0, done: fin}, o)); setTimeout(fin, (o.dur || 20) * 20 + 400); }); }
function fxLoop(now) {
  if (!CB || SCREEN !== "combat" || !FX.x) { FX.run = false; FX.parts = []; FX.anims = []; return; }
  const x = FX.x, C = CB.cell; x.clearRect(0, 0, FX.W, FX.H);
  // ambient
  if (FX.amb && Math.random() < .25) {
    const a = FX.amb;
    if (a === "embers") part({x: Math.random() * FX.W, y: FX.H + 4, vx: (Math.random() - .5) * .3, vy: -.4 - Math.random() * .6, max: 160, size: 1.6, col: "#ff9a4a", drag: 1});
    else if (a === "ash") part({x: Math.random() * FX.W, y: -4, vx: .2 + Math.random() * .3, vy: .3 + Math.random() * .4, max: 220, size: 1.4, col: "rgba(210,205,200,.7)", drag: 1, add: false});
    else if (a === "motes") part({x: Math.random() * FX.W, y: Math.random() * FX.H, vx: (Math.random() - .5) * .2, vy: -.15, max: 140, size: 1.6, col: "#c9b4ff", drag: 1, tw: 1});
    else if (a === "fireflies") part({x: Math.random() * FX.W, y: Math.random() * FX.H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, max: 150, size: 1.8, col: "#d9f08a", drag: 1, tw: 1});
    else if (a === "drips") part({x: Math.random() * FX.W, y: Math.random() * FX.H, max: 40, size: 0, col: "rgba(160,230,215,.5)", shape: "ripple", drag: 1, add: false});
  }
  if (CB.fire) fireFX();
  // spotlight on the acting unit
  const cu = CB.order[CB.ti];
  if (cu && !CB.ended) { const P = cpos(cu), fl = .85 + Math.sin(now / 260) * .08, r = C * 2.1; const g = x.createRadialGradient(P.x, P.y, C * .2, P.x, P.y, r);
    g.addColorStop(0, cu.side === "e" ? `rgba(255,70,100,${.16 * fl})` : `rgba(255,214,140,${.16 * fl})`); g.addColorStop(1, "rgba(0,0,0,0)"); x.globalCompositeOperation = "lighter"; x.fillStyle = g; x.fillRect(P.x - r, P.y - r, r * 2, r * 2); x.globalCompositeOperation = "source-over"; }
  // anims (projectiles, rings, slashes)
  for (let i = FX.anims.length - 1; i >= 0; i--) { const a = FX.anims[i]; a.t++; const p = Math.min(1, a.t / a.dur); a.draw(x, p, C); if (p >= 1) { FX.anims.splice(i, 1); a.done(); } }
  // particles
  for (let i = FX.parts.length - 1; i >= 0; i--) {
    const q = FX.parts[i]; q.life++; if (q.life >= q.max) { FX.parts.splice(i, 1); continue; }
    q.vx = q.vx * q.drag + (q.gx || 0); q.vy = q.vy * q.drag + q.g; q.x += q.vx; q.y += q.vy;
    const k = 1 - q.life / q.max; let al = q.tw ? (.4 + .6 * Math.abs(Math.sin(q.life * .12))) * Math.min(1, k * 3) : k;
    x.globalCompositeOperation = q.add ? "lighter" : "source-over"; x.globalAlpha = Math.max(0, al);
    if (q.shape === "smoke") { const r = q.size * (1 + (1 - k) * 2.2); const g = x.createRadialGradient(q.x, q.y, 0, q.x, q.y, r); g.addColorStop(0, q.col); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(q.x, q.y, r, 0, 7); x.fill(); }
    else if (q.shape === "spark") { x.strokeStyle = q.col; x.lineWidth = q.size * k + .4; x.beginPath(); x.moveTo(q.x, q.y); x.lineTo(q.x - q.vx * 3, q.y - q.vy * 3); x.stroke(); }
    else if (q.shape === "ripple") { x.strokeStyle = q.col; x.lineWidth = 1; x.beginPath(); x.ellipse(q.x, q.y, (1 - k) * 10, (1 - k) * 5, 0, 0, 7); x.stroke(); }
    else if (q.shape === "glyph") { x.fillStyle = q.col; x.font = `700 ${q.size}px ${getComputedStyle(document.body).fontFamily}`; x.fillText(q.ch, q.x, q.y); }
    else { const g = x.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.size * 2.2); g.addColorStop(0, q.col); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(q.x, q.y, q.size * 2.2, 0, 7); x.fill(); }
  }
  x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
  requestAnimationFrame(fxLoop);
}
function burst(px, py, col, n, spd, opt = {}) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = spd * (.4 + Math.random()); part(Object.assign({x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, col, max: 22 + Math.random() * 18, size: 1.6 + Math.random() * 1.6, shape: "spark", drag: .9}, opt)); } }
function fxProjectile(a, t, type) {
  if (!FX.x || !CB) return Promise.resolve();
  const A = cpos(a), B = cpos(t), d = Math.hypot(B.x - A.x, B.y - A.y), col = TYPE_COL[type] || "#f3e6c8";
  const arrow = ["pierce", "slash", "blunt"].includes(type), dur = Math.max(10, Math.round(d / (arrow ? 13 : 9)));
  return anim({dur, draw(x, p, C) {
    const lift = arrow ? Math.sin(p * Math.PI) * Math.min(d * .12, C) : 0;
    const px = A.x + (B.x - A.x) * p, py = A.y + (B.y - A.y) * p - lift;
    const ang = Math.atan2((B.y - A.y) - (arrow ? Math.cos(p * Math.PI) * Math.min(d * .12, C) * Math.PI * .6 : 0), B.x - A.x);
    if (arrow) { x.save(); x.translate(px, py); x.rotate(ang); x.strokeStyle = "#d9c9a6"; x.lineWidth = 1.8; x.beginPath(); x.moveTo(-C * .32, 0); x.lineTo(C * .12, 0); x.stroke(); x.fillStyle = "#eee"; x.beginPath(); x.moveTo(C * .2, 0); x.lineTo(C * .08, -3.5); x.lineTo(C * .08, 3.5); x.fill(); x.strokeStyle = "#b8344d"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-C * .32, 0); x.lineTo(-C * .4, -4); x.moveTo(-C * .32, 0); x.lineTo(-C * .4, 4); x.stroke(); x.restore(); return; }
    if (type === "force") { for (let k = 0; k < 3; k++) { const o = Math.sin(p * 9 + k * 2) * C * .12; const qx = px - Math.sin(ang) * o - Math.cos(ang) * k * C * .12, qy = py + Math.cos(ang) * o - Math.sin(ang) * k * C * .12; const g = x.createRadialGradient(qx, qy, 0, qx, qy, C * .12); g.addColorStop(0, "#fff"); g.addColorStop(.4, col); g.addColorStop(1, "rgba(0,0,0,0)"); x.globalCompositeOperation = "lighter"; x.fillStyle = g; x.beginPath(); x.arc(qx, qy, C * .12, 0, 7); x.fill(); } x.globalCompositeOperation = "source-over"; return; }
    const r = C * .22; const g = x.createRadialGradient(px, py, 0, px, py, r * 2.2); g.addColorStop(0, "#fff"); g.addColorStop(.3, col); g.addColorStop(1, "rgba(0,0,0,0)");
    x.globalCompositeOperation = type === "necrotic" ? "source-over" : "lighter"; x.fillStyle = g; x.beginPath(); x.arc(px, py, r * 2.2, 0, 7); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.arc(px, py, r * .35, 0, 7); x.fill(); x.globalCompositeOperation = "source-over";
    if (type === "necrotic") part({x: px, y: py, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, col: "rgba(40,10,60,.8)", size: C * .12, shape: "smoke", max: 26, add: false});
    else for (let k = 0; k < 3; k++) part({x: px, y: py, vx: (Math.random() - .5) * 1.2, vy: (Math.random() - .5) * 1.2 - (type === "fire" ? .4 : 0), col: type === "fire" ? ["#ffd38a","#ff8a3c","#ff5a1a"][k] : col, size: 2 + Math.random() * 2, max: 16 + Math.random() * 10});
  }});
}
function fxSlash(a, t, col) {
  if (!FX.x) return Promise.resolve(); const B = cpos(t), A = cpos(a), base = Math.atan2(B.y - A.y, B.x - A.x);
  return anim({dur: 9, draw(x, p, C) { const s = base - 1.2 + p * 2.4; x.globalCompositeOperation = "lighter"; x.strokeStyle = col; x.lineCap = "round";
    for (let k = 0; k < 5; k++) { const aa = s - k * .14; x.globalAlpha = (1 - k / 5) * (1 - p * .6); x.lineWidth = 4 - k * .6; x.beginPath(); x.arc(B.x, B.y, C * .42, aa - .14, aa); x.stroke(); }
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }});
}
async function fxAttackAnim(a, t, o) {
  const tk = $("#t_" + a.uid); if (!tk || !CB) return;
  const type = o.type || "slash", spellish = !["pierce", "slash", "blunt"].includes(type);
  if (o.ranged || spellish && dist(a, t) > 1) {
    const inr = tk.querySelector(".in"); inr.classList.add("cast"); setTimeout(() => inr.classList.remove("cast"), 380);
    await fxProjectile(a, t, type); return;
  }
  const dx = (t.x - a.x) * CB.cell * .3, dy = (t.y - a.y) * CB.cell * .3, inr = tk.querySelector(".in");
  inr.style.transform = isLand() ? `translate(${-dy}px,${dx}px) scale(1.06)` : `translate(${dx}px,${dy}px) scale(1.06)`; await sleep(110);
  fxSlash(a, t, a.side === "e" ? "#ff8a9e" : (TYPE_COL[type] || "#f3e6c8"));
  await sleep(90); inr.style.transform = "";
}
function fxImpact(t, type, crit) {
  if (!FX.x || !CB) return; const P = cpos(t), col = TYPE_COL[type] || "#f3e6c8", C = CB.cell;
  burst(P.x, P.y, col, crit ? 34 : 16, crit ? 4.2 : 2.8);
  if (type === "necrotic") for (let i = 0; i < 8; i++) part({x: P.x, y: P.y, vx: (Math.random() - .5) * 1.4, vy: (Math.random() - .5) * 1.4, col: "rgba(50,10,70,.85)", size: C * .14, shape: "smoke", max: 34, add: false});
  if (type === "fire") for (let i = 0; i < 10; i++) part({x: P.x, y: P.y, vx: (Math.random() - .5) * 1.5, vy: -Math.random() * 1.6, col: "#ffb060", size: 2.4, max: 30, g: -.02});
  anim({dur: crit ? 16 : 11, draw(x, p) { x.globalCompositeOperation = "lighter"; x.globalAlpha = 1 - p; x.strokeStyle = col; x.lineWidth = crit ? 3 : 2; x.beginPath(); x.arc(P.x, P.y, C * (.2 + p * (crit ? .7 : .45)), 0, 7); x.stroke(); x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }});
  shakeTok(t);
}
function fxMiss(a, t) { if (!FX.x || !CB) return; const P = cpos(t); for (let i = 0; i < 6; i++) part({x: P.x + (Math.random() - .5) * CB.cell * .5, y: P.y + CB.cell * .3, vx: (Math.random() - .5) * .8, vy: -.3, col: "rgba(200,190,170,.5)", size: CB.cell * .08, shape: "smoke", max: 24, add: false}); }
function fxDeath(t, small) {
  if (!FX.x || !CB) return; const P = cpos(t), C = CB.cell;
  for (let i = 0; i < (small ? 10 : 22); i++) part({x: P.x + (Math.random() - .5) * C * .4, y: P.y + (Math.random() - .5) * C * .4, vx: (Math.random() - .5) * 1.2, vy: -.4 - Math.random() * .9, col: "rgba(55,46,58,.5)", size: C * .2, shape: "smoke", max: 52, add: false, drag: .97});
  if (!small) burst(P.x, P.y, t.def && t.def.undead ? "#b8c8ff" : "#ff8a5a", 18, 2.2, {g: .05});
}
function fxHeal(t, col = "#9be0a6") { if (!FX.x || !CB) return; const P = cpos(t), C = CB.cell; for (let i = 0; i < 16; i++) part({x: P.x + (Math.random() - .5) * C * .7, y: P.y + C * .3, vx: 0, vy: -.6 - Math.random() * .8, col, size: 1.8 + Math.random(), max: 40 + Math.random() * 20, drag: .99});
  anim({dur: 18, draw(x, p) { x.globalCompositeOperation = "lighter"; x.globalAlpha = (1 - p) * .7; x.strokeStyle = col; x.lineWidth = 2; x.beginPath(); x.ellipse(P.x, P.y + C * .3, C * .4 * (.5 + p * .6), C * .14 * (.5 + p * .6), 0, 0, 7); x.stroke(); x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }}); }
function fxArea(c, rad, type) {
  if (!FX.x || !CB) return Promise.resolve(); const P = {x: (c.x + .5) * CB.cell, y: (c.y + .5) * CB.cell}, C = CB.cell, R = (rad + .5) * C, col = TYPE_COL[type] || "#ffe08a";
  const rr = () => Math.random();
  const n = 36 + rad * 46;
  for (let i = 0; i < n; i++) { const a = rr() * Math.PI * 2, r = Math.sqrt(rr()) * R, px = P.x + Math.cos(a) * r, py = P.y + Math.sin(a) * r;
    if (type === "fire") part({x: px, y: py, vx: Math.cos(a) * (.5 + rr() * 1.5), vy: -1 - rr() * 2.2, col: ["#fff1b0", "#ffc04a", "#ff7a2a", "#ff4a1a"][Math.floor(rr() * 4)], size: 2.5 + rr() * 4.5, max: 24 + rr() * 26, g: -.03, drag: .94});
    else if (type === "cold") part({x: px, y: py, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2 - .5, col: rr() > .5 ? "#ffffff" : "#a9dcff", size: 1.6 + rr() * 2, max: 26 + rr() * 20, shape: "spark", drag: .9});
    else if (type === "necrotic") part({x: px, y: py, vx: Math.cos(a) * .8, vy: -.4 - rr(), col: "rgba(70,20,100,.55)", size: C * (.16 + rr() * .12), shape: "smoke", max: 40 + rr() * 20, add: false});
    else if (type === "sleep") part({x: px, y: py, vx: 0, vy: -.5 - rr() * .4, col: "#bcd2ff", shape: "glyph", ch: "z", size: 10 + rr() * 8, max: 50, add: false, drag: 1});
    else part({x: px, y: py, vx: Math.cos(a) * .6, vy: -.6 - rr() * 1.2, col, size: 2 + rr() * 2.5, max: 30 + rr() * 30}); }
  if (type === "fire" || type === "radiant" || type === "cold") burst(P.x, P.y, type === "fire" ? "#ffd38a" : col, 26 + rad * 14, 4 + rad * 1.6);
  if (type === "necrotic") burst(P.x, P.y, "#c08cff", 20, 3.5);
  if (type === "fire") setTimeout(() => { for (let i = 0; i < 14 + rad * 10; i++) { const a = rr() * Math.PI * 2, r = rr() * R; part({x: P.x + Math.cos(a) * r, y: P.y + Math.sin(a) * r, vx: (rr() - .5) * .6, vy: -.4 - rr() * .6, col: "rgba(70,60,62,.45)", size: C * (.2 + rr() * .15), shape: "smoke", max: 60, add: false, drag: .98}); } }, 260);
  if (rad >= 2 && type !== "sleep") fxShake();
  return anim({dur: 30, draw(x, p) {
    const e = 1 - Math.pow(1 - p, 3), r = R * (.2 + .95 * e), fade = Math.pow(1 - p, 1.4);
    if (p < .25 && type !== "sleep") { x.globalCompositeOperation = "lighter"; x.globalAlpha = (1 - p / .25) * .22; x.fillStyle = type === "necrotic" ? "#5a2a80" : col; x.fillRect(0, 0, FX.W, FX.H); }
    x.globalCompositeOperation = type === "necrotic" ? "source-over" : "lighter";
    const g = x.createRadialGradient(P.x, P.y, 0, P.x, P.y, r);
    if (type === "necrotic") { g.addColorStop(0, "rgba(10,0,20,.75)"); g.addColorStop(.6, "rgba(70,20,110,.45)"); g.addColorStop(1, "rgba(0,0,0,0)"); }
    else { g.addColorStop(0, "rgba(255,255,240,1)"); g.addColorStop(.25, col); g.addColorStop(.7, type === "fire" ? "rgba(255,70,20,.55)" : col); g.addColorStop(1, "rgba(0,0,0,0)"); }
    x.globalAlpha = fade * (type === "sleep" ? .45 : .95); x.fillStyle = g; x.beginPath(); x.arc(P.x, P.y, r, 0, 7); x.fill();
    x.globalAlpha = fade; x.strokeStyle = type === "necrotic" ? "#c08cff" : "#fff3c8"; x.lineWidth = 2 + 6 * (1 - p); x.beginPath(); x.arc(P.x, P.y, r * 1.05, 0, 7); x.stroke();
    if (type === "radiant") { x.lineWidth = 2; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + p; x.beginPath(); x.moveTo(P.x + Math.cos(a) * r * .2, P.y + Math.sin(a) * r * .2); x.lineTo(P.x + Math.cos(a) * r * 1.2, P.y + Math.sin(a) * r * 1.2); x.stroke(); } }
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }});
}
function fxColumn(t, type) { if (!FX.x || !CB) return Promise.resolve(); const P = cpos(t), C = CB.cell, col = TYPE_COL[type] || "#ffe08a";
  return anim({dur: 16, draw(x, p) { const w = C * .34 * Math.sin(p * Math.PI); const g = x.createLinearGradient(P.x - w, 0, P.x + w, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.5, col); g.addColorStop(1, "rgba(0,0,0,0)"); x.globalCompositeOperation = "lighter"; x.fillStyle = g; x.fillRect(P.x - w, 0, w * 2, P.y + C * .3); x.globalCompositeOperation = "source-over"; if (p > .5) burst(P.x, P.y, col, 2, 2); }}); }
function fxPoof(u) { if (!FX.x || !CB) return; const P = cpos(u), C = CB.cell; for (let i = 0; i < 18; i++) part({x: P.x, y: P.y, vx: (Math.random() - .5) * 2.4, vy: (Math.random() - .5) * 2.4, col: "rgba(150,170,255,.5)", size: C * .14, shape: "smoke", max: 30}); }
function fxDust(u) { if (!FX.x || !CB) return; const P = cpos(u), C = CB.cell; for (let i = 0; i < 3; i++) part({x: P.x + (Math.random() - .5) * C * .4, y: P.y + C * .32, vx: (Math.random() - .5) * .6, vy: -.15, col: "rgba(190,175,150,.35)", size: C * .07, shape: "smoke", max: 22, add: false}); }
function fxShake() { const bw = $("#bw"); if (!bw) return; bw.classList.remove("shake"); void bw.offsetWidth; bw.classList.add("shake"); }
async function turnBanner(u) {
  const b = $("#ban"); if (!b || !CB) return;
  const nr = CB.newRound; CB.newRound = false;
  b.className = "banner " + u.side; b.innerHTML = `${nr ? `<small>${T_("round")} ${CB.round}</small>` : ""}<b>${esc(u.name)}</b>`;
  b.hidden = false; void b.offsetWidth; b.classList.add("show");
  await sleep(u.side === "e" ? 620 : 420); if (b) { b.classList.remove("show"); setTimeout(() => { if (b.className.indexOf("show") < 0) b.hidden = true; }, 260); }
}

/* ---------- odds ---------- */
function oddsVs(u, t, s) {
  const c = u.ref; let hit = null, save = null, auto = false, o = {ranged: false};
  if (s.k === "w") { const p = weapProfile(c, weaponsOf(c)[s.i]); hit = p.hit; o = {ranged: p.ranged, weapon: 1}; if (u.cond.power && powerOK(c, p.ranged)) hit -= 5; }
  else if (s.k === "sp") { const k = s.key; if (["firebolt","guidingbolt","scorchingray"].includes(k)) { hit = spellAtk(c); o = {ranged: true}; } else if (k === "sacredflame") save = {dc: spellDC(c), b: (t.def.sv || 0) + (S.diff === 2 ? 1 : 0) + coverOf(u, t)}; else if (k === "magicmissile" || k === "huntersmark") auto = true; else return null; }
  else if (s.k === "ab" && s.key === "spiritstrike") hit = spellAtk(c);
  else if (s.k === "ab" && s.key === "shove") { if (t.boss) return 0; const a = skillBonus(c, "ath"), d = (t.def.sv || 0) + 2; let w = 0; for (let x = 1; x <= 20; x++) for (let y = 1; y <= 20; y++) if (x + a >= y + d) w++; return Math.round(w / 4); }
  else if (s.k === "it" && ITEMS[s.key].use === "throw") { hit = prof(c) + abm(c, "dex"); o = {ranged: true}; }
  else return null;
  if (auto) return 100;
  if (save) return Math.round(Math.max(.05, Math.min(.95, (save.dc - save.b - 1) / 20)) * 100);
  const ai = advInfo(u, t, o), cov = coverFor(u, t, o);
  return Math.round(hitP(hit + (u.cond.bless ? 2.5 : 0) + highBonus(u, t, o), t.ac + cov, ai.adv, ai.dis) * 100);
}

/* ---------- action catalogue for the hotbar ---------- */
function actionsOf(u) {
  const c = u.ref, L = [];
  weaponsOf(c).forEach((w, i) => { const p = weapProfile(c, w); L.push({s: {k: "w", i}, ic: WEAP_IC[w] || "sword", name: p.name, cost: "a", sub: `${sgn(p.hit)} · ${p.dice}${sgn(p.flat)}`, desc: `${p.ranged ? tr(["A distanza","Ranged","A distancia"]) + " " + p.r : tr(["Mischia","Melee","Cuerpo a cuerpo"])} · ${tr(["colpire","to hit","ataque"])} ${sgn(p.hit)} · ${p.dice}${sgn(p.flat)}`, grp: 0}); });
  spellsOf(c).forEach(k => { const sp = SPELLS[k]; const left = sp.lv ? c.slots.slice(sp.lv - 1).reduce((a, b) => a + b, 0) : null; L.push({s: {k: "sp", key: k}, ic: SPELL_IC[k] || "star", name: tr(sp.n), cost: sp.bonus ? "b" : "a", lv: sp.lv, cnt: left, desc: tr(sp.d), ff: sp.ff, grp: 1}); });
  abilitiesOf(u).forEach(k => { const a = ABIL[k]; let cnt = null; if (k === "secondwind") cnt = c.res.sw; if (k === "actionsurge") cnt = c.res.as; if (k === "lay") cnt = c.res.lay; if (k === "turn") cnt = c.res.ch; L.push({s: {k: "ab", key: k}, ic: ABIL_IC[k] || "star", name: tr(a.n), cost: a.cost === "act" ? "a" : a.cost === "bon" ? "b" : "f", cnt, desc: tr(a.d), grp: 2}); });
  Object.keys(S.inv).filter(k => S.inv[k] > 0 && ["heal", "throw", "scroll"].includes(ITEMS[k].use)).forEach(k => L.push({s: {k: "it", key: k}, ic: ITEMS[k].use === "heal" ? "potion" : ITEMS[k].use === "scroll" ? "scroll" : "flame", name: tr(ITEMS[k].n), cost: "a", cnt: S.inv[k], desc: tr(ITEMS[k].d), grp: 3}));
  return L;
}
const sameSel = (a, b) => a && b && a.k === b.k && a.i === b.i && a.key === b.key;

/* ---------- render ---------- */
function renderCombat() {
  if (!CB || !$("#board")) return; const u = cur();
  // initiative ribbon
  $("#ini").innerHTML = `<span class="rd">${T_("round")}<b>${CB.round}</b></span>` + CB.order.map(o => { const f = Math.max(0, o.hp / o.maxhp);
    return `<span class="ini ${o.side}${o === u ? " cur" : ""}${alive(o) ? "" : " gone"}" title="${esc(o.name)}"><span class="ic">${icon(uIcon(o))}</span><i style="width:${f * 100}%"></i></span>`; }).join("");
  const curEl = $("#ini .cur"); if (curEl) curEl.scrollIntoView({inline: "center", block: "nearest", behavior: "smooth"});
  const mine = u && u.side === "p" && !CB.busy && !CB.ended;
  const sp = mine ? selSpec(u) : null, usable = mine && CB.sel && canUse(u, CB.sel);
  const R = mine && u.mv > 0 ? reachOf(u, u.mv) : null;
  const tgtIds = new Set();
  document.querySelectorAll("#board .cell").forEach(cel => {
    const x = +cel.dataset.x, y = +cel.dataset.y, t = unitAt(x, y); let c = "";
    if (mine) {
      if (R && R.has(K(x, y)) && !t && !CB.ob.has(K(x, y))) c = "reach";
      if (usable) {
        if (sp.tgt === "enemy" && t && t.side === "e" && t.hp > 0 && dist(u, t) <= sp.r && sees(u, t, sp.r)) { c = "tgt"; tgtIds.add(t.uid); }
        if (sp.tgt === "ally" && t && t.side === "p" && dist(u, t) <= sp.r && sees(u, t, sp.r)) c = "ally";
        if (sp.tgt === "tile" && !t && dist(u, {x, y}) <= sp.r && sees(u, {x, y}, sp.r) && !CB.ob.has(K(x, y))) c = "path";
        if (sp.tgt === "area") { if (CB.pend && dist(CB.pend, {x, y}) <= sp.rad) c = "area"; else if (dist(u, {x, y}) <= sp.r && !CB.pend && !c && sees(u, {x, y}, sp.r)) c = "range"; }
      }
    }
    cel.className = "cell" + (c ? " " + c : "");
  });
  // hit odds on targetable enemies
  CB.units.forEach(o => { const tk = $("#t_" + o.uid); if (!tk) return; const ch = tk.querySelector(".chance");
    if (mine && tgtIds.has(o.uid)) { const pc = oddsVs(u, o, CB.sel); tk.classList.toggle("tg", pc != null); ch.textContent = pc != null ? pc + "%" : ""; } else tk.classList.remove("tg"); });
  placeTokens();
  // unit panel
  const show = CB.inspect || u;
  if (show) {
    const isP = show.side === "p", f = Math.max(0, show.hp / show.maxhp);
    const conds = []; const cd = show.cond; if (cd.bless) conds.push(tr(SPELLS.bless.n)); if (cd.dodge) conds.push(tr(ABIL.dodge.n)); if (cd.asleep) conds.push(tr(["Addormentato","Asleep","Dormido"])); if (cd.stun) conds.push(tr(["Paralizzato","Stunned","Paralizado"])); if (cd.mark) conds.push(tr(SPELLS.huntersmark.n)); if (cd.sg) conds.push(tr(SPELLS.spiritguardians.n)); if (cd.sw) conds.push(tr(SPELLS.spiritualweapon.n)); if (cd.smite) conds.push(tr(FEATS.smite)); if (cd.guided) conds.push(tr(["Tracciato","Outlined","Marcado"]));
    const sub = isP ? `${tr(CL(show.ref).n)} ${show.ref.lvl}` : (show.boss ? tr(["Capo","Boss","Jefe"]) : tr(["Nemico","Enemy","Enemigo"]));
    const slots = isP ? slotsMax(show.ref).map((n, i) => n ? `<span class="sl">${["I","II","III","IV"][i]} ${"◆".repeat(show.ref.slots[i])}${"◇".repeat(Math.max(0, n - show.ref.slots[i]))}</span>` : "").join("") : "";
    const econ = show === u && isP && !CB.ended ? `<div class="econ"><span class="pa ${u.act > 0 || u.atkLeft > 0 ? "on" : ""}" title="${T_("action")}"></span><span class="pb ${u.bon > 0 ? "on" : ""}" title="${T_("bonus")}"></span><span class="mv">${icon("wind")}<b>${u.mv}</b></span></div>` : "";
    $("#cbp").innerHTML = `<div class="por ${show.side}${show.boss ? " boss" : ""}">${icon(uIcon(show))}</div>
      <div class="who2"><div class="nm"><b>${esc(show.name)}</b><small>${sub}</small></div>
        <div class="hpbar ${f < .35 ? "lo" : ""} ${show.side}"><i style="width:${f * 100}%"></i><span>${Math.max(0, show.hp)} / ${show.maxhp}</span></div>
        <div class="tags">${conds.map(c => `<span>${esc(c)}</span>`).join("")}${slots}</div></div>
      <div class="acb" title="${T_("ac")}"><b>${show.ac}</b><small>${T_("ac")}</small></div>${econ}`;
  }
  // hotbar + info
  const hot = $("#hot"), info = $("#info"), endB = $("#aEnd");
  if (!mine) {
    hot.innerHTML = `<div class="waiting">${u && u.side === "e" && !CB.ended ? `${icon("eye")} ${T_("enemyTurn")}` : "…"}</div>`;
    info.innerHTML = CB.inspect ? `<b>${esc(CB.inspect.name)}</b> · ${T_("hp")} ${Math.max(0, CB.inspect.hp)}/${CB.inspect.maxhp} · ${T_("ac")} ${CB.inspect.ac}` : (u && u.side === "e" && !CB.ended ? `<span class="muted">${esc(u.name)}</span>` : "");
    endB.disabled = true;
  } else {
    endB.disabled = false;
    const acts = actionsOf(u); let lastG = -1;
    hot.innerHTML = acts.map((a, i) => { const ok = canUse(u, a.s), sel = sameSel(CB.sel, a.s); const sep = a.grp !== lastG && lastG >= 0 ? `<span class="sep"></span>` : ""; lastG = a.grp;
      return `${sep}<button class="slot${sel ? " sel" : ""}${ok ? "" : " off"}" data-a="${i}" aria-label="${esc(a.name)}"><span class="si">${icon(a.ic)}</span><span class="sn">${esc(a.name)}</span><i class="cost ${a.cost}"></i>${a.lv ? `<b class="lv">${["","I","II","III","IV"][a.lv]}</b>` : ""}${a.cnt != null ? `<b class="cnt">${a.cnt}</b>` : ""}</button>`; }).join("");
    hot.querySelectorAll("[data-a]").forEach(b => b.onclick = () => onSlot(u, acts[+b.dataset.a]));
    const selA = acts.find(a => sameSel(a.s, CB.sel));
    let hint = sp && sp.tgt === "area" ? T_("tapArea") : sp && sp.tgt === "tile" ? T_("tapTile") : sp && sp.tgt === "ally" ? T_("allyRange") : sp && sp.tgt === "none" ? tr(["Tocca di nuovo l'azione per usarla.","Tap the action again to use it.","Toca la acción de nuevo para usarla."]) : T_("tapMove");
    if (CB.inspect && CB.inspect !== u) hint = `${esc(CB.inspect.name)} · ${T_("hp")} ${Math.max(0, CB.inspect.hp)}/${CB.inspect.maxhp} · ${T_("ac")} ${CB.inspect.ac}`;
    info.innerHTML = selA ? `<b>${esc(selA.name)}</b><span class="cost-t ${selA.cost}">${selA.cost === "a" ? T_("action") : selA.cost === "b" ? T_("bonus") : T_("free")}</span>${selA.ff ? `<span class="ff">${T_("aoeWarn")}</span>` : ""}<p>${esc(selA.desc)}</p><p class="hint">${hint}</p>` : `<p class="hint">${hint}</p>`;
    const selEl = hot.querySelector(".slot.sel"); if (selEl && !CB.scrolled) { selEl.scrollIntoView({inline: "nearest", block: "nearest"}); CB.scrolled = true; }
  }
  renderLog();
}
function onSlot(u, a) {
  if (!CB || CB.busy || cur() !== u) return;
  const ok = canUse(u, a.s), spc = selSpec(u, a.s);
  if (!ok) { CB.sel = a.s; CB.pend = null; renderCombat(); CB.sel = canUse(u, defaultSel(u)) ? defaultSel(u) : a.s; return; }
  if (spc.tgt === "none" && sameSel(CB.sel, a.s)) { execute(u, null); return; }
  if (a.s.k === "it" && spc.tgt === "ally" && sameSel(CB.sel, a.s) && allies().filter(o => dist(o, u) <= 1).length === 1) { execute(u, u); return; }
  CB.sel = a.s; CB.pend = null; CB.inspect = null; CB.mvp = null; CB.tileInfo = null; renderCombat();
}
function renderLog() { const l = $("#cblog"); if (!l || !CB) return; l.innerHTML = CB.log.slice(-2).map(x => `<span>${esc(x)}</span>`).join(""); }
function openLog() { if (!CB) return; const m = modal(`<h2>${tr(["Registro di battaglia","Battle log","Registro de batalla"])}</h2><div class="loglist">${CB.log.slice().reverse().map(x => `<p>${esc(x)}</p>`).join("")}</div><button class="btn small" id="lgX" style="margin-top:12px">${T_("close")}</button>`); m.querySelector("#lgX").onclick = closeModal; }
function pickSheet() {}

/* ---------- end of battle screens ---------- */
function winCombat() {
  syncBack(); const win = CB.win, fastR = 3 + Math.ceil(CB.nFoes / 2);
  const ch1 = !CB.anyDown, ch2 = CB.round <= fastR;
  const gx = Math.round(CB.xp * (ch1 ? 1.2 : 1)), gg = CB.gold + (ch2 ? 15 : 0);
  const loot = rollLoot(CB.key);
  const chal = `<div class="chal"><span class="${ch1 ? "ok" : ""}">${ch1 ? "✓" : "✗"} ${tr(["Nessun caduto","Nobody fell","Nadie cayó"])} <small>+20% ${T_("xp")}</small></span><span class="${ch2 ? "ok" : ""}">${ch2 ? "✓" : "✗"} ${tr(["Entro","Within","En"])} ${fastR} ${tr(["round","rounds","rondas"])} <small>+15 ${T_("gp")}</small></span></div>`;
  const m = modal(`<div class="endcard win"><div class="seal">${icon("sun")}</div><h2>${T_("victory")}</h2>${CB.routed ? `<p class="rout">${icon("crown")} ${tr(["Il capo è caduto: i seguaci sono fuggiti.","The leader fell: the followers fled.","El jefe cayó: sus seguidores huyeron."])}</p>` : ""}${chal}<p class="lbl">${T_("rewards")}</p><div class="rew"><span><b>+${gx}</b>${T_("xp")}</span>${gg ? `<span><b>+${gg}</b>${T_("gp")}</span>` : ""}</div>${loot.length ? `<div class="loot">${loot.map(k => `<div class="li${ITEMS[k].slot === "t" ? " rare" : ""}">${medHTML(ITEMS[k].slot === "t" ? "star" : ITEMS[k].use === "scroll" ? "scroll" : ITEMS[k].use === "heal" ? "potion" : "flame", "sm")}<span>${tr(ITEMS[k].n)}</span></div>`).join("")}</div>` : ""}<button class="btn primary" id="vOk">${T_("goOn")}</button></div>`, {center: 1, locked: 1});
  m.querySelector("#vOk").onclick = () => { closeModal(); CB = null; S.xp += gx; S.gold += gg; loot.forEach(k => S.inv[k] = (S.inv[k] || 0) + 1); checkLevel(); goScene(win); };
}
function rollLoot(key) {
  const out = [], got = S.lootGot = S.lootGot || {};
  (LOOT[key] || []).forEach(k => { if (ITEMS[k].slot === "t") { if (got[k]) return; got[k] = 1; } out.push(k); });
  const act = has("act2_done") ? 3 : has("act1_done") ? 2 : 1, r = Math.random();
  if (r < .35) out.push("potion"); else if (r < .5) out.push("flask"); else if (r < .58 && act >= 2) out.push("scroll_heal"); else if (r < .64 && act >= 2) out.push("scroll_fire"); else if (r < .72 && act >= 2) out.push("greater");
  return out;
}
function loseCombat() {
  const m = modal(`<div class="endcard lose"><div class="seal">${icon("skull")}</div><h2>${T_("defeat")}</h2><p>${T_("defeatTxt")}</p><div style="display:grid;gap:8px"><button class="btn primary" id="lRetry">${T_("retry")}</button><button class="btn small" id="lTitle">${T_("toTitle")}</button></div></div>`, {center: 1, locked: 1});
  m.querySelector("#lRetry").onclick = () => { closeModal(); const k = CB.key, w = CB.win, s = CB.surprise; S = JSON.parse(CBSNAP); startCombat(k, w, s); };
  m.querySelector("#lTitle").onclick = () => { closeModal(); CB = null; renderTitle(); };
}
