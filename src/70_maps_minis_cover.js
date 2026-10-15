/* =================== INK-AND-QUILL MAPS, PAINTED MINIATURES, COVER =================== */
const INK = a => `rgba(42,27,15,${a})`;
let IRS = 1; const IR = () => (IRS = (IRS * 16807) % 2147483647) / 2147483647;
Object.assign(MSTYLE.road, {wash: "#b88a4a"}); Object.assign(MSTYLE.forest, {wash: "#5f7a45"}); Object.assign(MSTYLE.mill, {wash: "#a87a3a"});
Object.assign(MSTYLE.grave, {wash: "#6a7a62"}); Object.assign(MSTYLE.stones, {wash: "#7a6a8a"}); Object.assign(MSTYLE.bridge, {wash: "#8a7a62"});
Object.assign(MSTYLE.tower, {wash: "#7a5a9a"}); Object.assign(MSTYLE.roof, {wash: "#a85a3a"}); Object.assign(MSTYLE.palace, {wash: "#8a5aa0"});
Object.assign(MSTYLE.sewer, {wash: "#5a7a62"}); Object.assign(MSTYLE.water, {wash: "#4a7a8a"}); Object.assign(MSTYLE.archive, {wash: "#a07a42"});
Object.assign(MSTYLE.snow, {wash: "#8a96a8"}); Object.assign(MSTYLE.fort, {wash: "#6a5a5a"}); Object.assign(MSTYLE.mirror, {wash: "#6a4a9a"});
Object.assign(MSTYLE.dungeon, {wash: "#7a5a3a"}); Object.assign(MSTYLE.throne, {wash: "#8a2a3a"});
MSTYLE.forest.ob = "deadtree";

/* ---------- ink primitives ---------- */
function jpath(x, pts, close) { x.beginPath(); pts.forEach(([px, py], i) => { const jx = px + (IR() - .5) * 1.1, jy = py + (IR() - .5) * 1.1; i ? x.lineTo(jx, jy) : x.moveTo(jx, jy); }); if (close) x.closePath(); }
function iseg(x, x1, y1, x2, y2, w = 1, a = .85) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 7)); x.strokeStyle = INK(a); x.lineWidth = w; x.lineCap = "round"; x.beginPath();
  for (let i = 0; i <= n; i++) { const t = i / n, j = i && i < n ? 1 : 0; const px = x1 + (x2 - x1) * t + (IR() - .5) * 1.1 * j, py = y1 + (y2 - y1) * t + (IR() - .5) * 1.1 * j; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
}
function ipoly(cx, cy, r, n, rough) { const pts = []; const ph = IR() * 6; for (let i = 0; i < n; i++) { const a = ph + i / n * Math.PI * 2, rr = r * (1 + (IR() - .5) * rough); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return pts; }
function istroke(x, pts, w = 1.3, a = .9, close = true) { jpath(x, pts, close); x.strokeStyle = INK(a); x.lineWidth = w; x.lineJoin = "round"; x.stroke(); if (IR() > .4) { jpath(x, pts, close); x.lineWidth = w * .5; x.strokeStyle = INK(a * .5); x.stroke(); } }
function hatch(x, clipFn, cx, cy, r, ang, gap, a = .5, w = .7) {
  x.save(); clipFn(); x.clip(); x.strokeStyle = INK(a); x.lineWidth = w; const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let d = -r; d <= r; d += gap) { const ox = cx - sa * d, oy = cy + ca * d, j = (IR() - .5) * gap * .35; x.beginPath(); x.moveTo(ox - ca * r + j, oy - sa * r); x.lineTo(ox + ca * r + j, oy + sa * r + (IR() - .5) * 1.2); x.stroke(); }
  x.restore();
}
function inkShadow(x, cx, cy, rx, ry) { const clip = () => { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); }; hatch(x, clip, cx, cy, rx + 4, Math.PI / 4, 2.6, .4, .6); }
function wash(x, px, py, r, col, a) { const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(.7, hexA(col, a * .6)); g.addColorStop(1, hexA(col, 0)); x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function stip(x, px, py, n, r, a = .55) { x.fillStyle = INK(a); for (let i = 0; i < n; i++) { const ang = IR() * 7, rr = Math.sqrt(IR()) * r; x.fillRect(px + Math.cos(ang) * rr, py + Math.sin(ang) * rr, .9, .9); } }

/* ---------- parchment + terrain ---------- */
paintTerrain = function () {
  const cv = $("#terrain"); if (!cv || !CB) return; const st = MSTYLE[mapKey()] || MSTYLE.road, C = CB.cell, W = COLS * C, H = ROWS * C;
  const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr;
  const x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  IRS = hashStr(CB.key + (CB.seed || (CB.seed = rnd(9999))));
  // parchment
  x.fillStyle = "#e6d3a8"; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) wash(x, IR() * W, IR() * H, C * (.6 + IR() * 2.4), IR() > .5 ? "#c9a868" : "#f4e6c0", .18 + IR() * .2);
  for (let i = 0; i < W * H / 45; i++) { x.fillStyle = IR() > .5 ? "rgba(120,90,50,.09)" : "rgba(255,250,230,.12)"; x.fillRect(IR() * W, IR() * H, 1, 1); }
  x.strokeStyle = "rgba(110,80,40,.08)"; x.lineWidth = .5; for (let i = 0; i < 160; i++) { const px = IR() * W, py = IR() * H, a = IR() * 7, l = 3 + IR() * 9; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  for (let i = 0; i < 3; i++) { const px = IR() * W, py = IR() * H, r = C * (.4 + IR() * .5); x.strokeStyle = "rgba(130,90,40,.12)"; x.lineWidth = 2.5; x.beginPath(); x.arc(px, py, r, IR() * 3, IR() * 3 + 5.2); x.stroke(); }
  // watercolour wash of the place
  for (let i = 0; i < 26; i++) wash(x, IR() * W, IR() * H, C * (.8 + IR() * 2.2), st.wash || "#a08060", .1 + IR() * .12);
  INKG[st.g](x, W, H, C);
  // grid
  for (let i = 1; i < COLS; i++) iseg(x, i * C, 2, i * C, H - 2, .7, .22);
  for (let j = 1; j < ROWS; j++) iseg(x, 2, j * C, W - 2, j * C, .7, .22);
  paintTerrainLayer(x, C);
  // obstacles back to front: tall ones (they block line of sight) get a long cast shadow
  const tc = TCFG[mapKey()] || {};
  [...CB.ob].map(k => k.split(",").map(Number)).sort((a, b) => a[1] - b[1]).forEach(([ox, oy]) => { const cx = (ox + .5) * C, cy = (oy + .5) * C, tall = CB.tall && CB.tall.has(K(ox, oy));
    if (tall) tallShadow(x, cx, cy, C);
    (INKO[tall ? tc.tall || st.ob : tc.low || st.ob] || INKO.rock)(x, cx, cy, C, st); });
  // burnt edges
  const v = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .36, W / 2, H / 2, Math.max(W, H) * .74); v.addColorStop(0, "rgba(90,55,20,0)"); v.addColorStop(.75, "rgba(110,70,30,.25)"); v.addColorStop(1, "rgba(60,32,10,.75)"); x.fillStyle = v; x.fillRect(0, 0, W, H);
  x.strokeStyle = INK(.6); x.lineWidth = 2; x.strokeRect(3, 3, W - 6, H - 6); x.lineWidth = .7; x.strokeRect(6.5, 6.5, W - 13, H - 13);
  // compass rose
  const rx = W - C * .55, ry = C * .55, rr = C * .32; x.save(); x.globalAlpha = .7; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 - Math.PI / 2; x.beginPath(); x.moveTo(rx + Math.cos(a) * rr, ry + Math.sin(a) * rr); x.lineTo(rx + Math.cos(a + .5) * rr * .3, ry + Math.sin(a + .5) * rr * .3); x.lineTo(rx, ry); x.closePath(); x.fillStyle = i ? "rgba(42,27,15,.25)" : "rgba(140,30,30,.8)"; x.fill(); x.strokeStyle = INK(.8); x.lineWidth = .7; x.stroke(); }
  x.beginPath(); x.arc(rx, ry, rr * .45, 0, 7); x.stroke(); x.restore();
};
const INKG = {
  dirt(x, W, H, C) { for (let i = 0; i < W * H / 150; i++) stip(x, IR() * W, IR() * H, 1, 0, .4);
    for (let i = 0; i < W * H / (C * C) * 1.4; i++) { const px = IR() * W, py = IR() * H, r = 1.6 + IR() * 2.6; istroke(x, ipoly(px, py, r, 6, .5), .6, .7); }
    for (let i = 0; i < 8; i++) { let px = IR() * W, py = IR() * H; const pts = [[px, py]]; for (let k = 0; k < 4; k++) { px += (IR() - .5) * 14; py += (IR() - .5) * 14; pts.push([px, py]); } istroke(x, pts, .6, .5, false); } },
  grass(x, W, H, C) { INKG.dirt(x, W, H, C); for (let i = 0; i < W * H / (C * C) * 4; i++) { const px = IR() * W, py = IR() * H; for (let k = 0; k < 3 + IR() * 3; k++) { const a = -Math.PI / 2 + (IR() - .5) * 1.2; iseg(x, px + k * 1.6, py, px + k * 1.6 + Math.cos(a) * 5, py + Math.sin(a) * (4 + IR() * 4), .6, .6); } } },
  wood(x, W, H, C) { const ph = C / 2; for (let row = 0; row * ph < H; row++) { iseg(x, 0, row * ph, W, row * ph, 1, .55); let px = -IR() * C; while (px < W) { const len = C * (1.2 + IR() * 1.8); iseg(x, px, row * ph, px, row * ph + ph, .9, .55);
      for (let g = 0; g < 2; g++) { const gy = row * ph + 4 + IR() * (ph - 8); x.strokeStyle = INK(.22); x.lineWidth = .5; x.beginPath(); x.moveTo(px + 3, gy); x.bezierCurveTo(px + len * .3, gy + (IR() - .5) * 5, px + len * .6, gy + (IR() - .5) * 5, px + len - 3, gy); x.stroke(); }
      if (IR() > .6) { x.strokeStyle = INK(.4); x.lineWidth = .6; x.beginPath(); x.ellipse(px + len * IR(), row * ph + ph / 2, 3, 1.6, 0, 0, 7); x.stroke(); }
      stip(x, px + 3, row * ph + ph / 2, 1, 0, .8); px += len; } } },
  stone(x, W, H, C) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { const l = xx * C, t = y * C, k = 3 + IR() * 3;
      const pts = [[l + k, t + k * IR()], [l + C - k * IR(), t + k], [l + C - k, t + C - k * IR()], [l + k * IR(), t + C - k]]; istroke(x, pts, .9, .7);
      if (IR() > .7) hatch(x, () => { x.beginPath(); x.rect(l + C * .55, t + C * .55, C * .45, C * .45); }, l + C * .78, t + C * .78, C * .4, Math.PI / 4, 2.4, .3, .5);
      if (IR() > .75) { const pts2 = [[l + C * IR(), t + C * IR()]]; for (let q = 0; q < 3; q++) pts2.push([pts2[q][0] + (IR() - .5) * 12, pts2[q][1] + (IR() - .5) * 12]); istroke(x, pts2, .6, .55, false); }
      stip(x, l + C / 2, t + C / 2, 4, C * .45, .35); } },
  marble(x, W, H, C) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { const l = xx * C, t = y * C; istroke(x, [[l + 1, t + 1], [l + C - 1, t + 1], [l + C - 1, t + C - 1], [l + 1, t + C - 1]], .7, .5);
      if ((xx + y) % 2) hatch(x, () => { x.beginPath(); x.rect(l + 2, t + 2, C - 4, C - 4); }, l + C / 2, t + C / 2, C * .75, Math.PI / 4, 3.2, .22, .5);
      x.strokeStyle = INK(.25); x.lineWidth = .5; x.beginPath(); x.moveTo(l + C * IR(), t); x.bezierCurveTo(l + C * IR(), t + C * .4, l + C * IR(), t + C * .6, l + C * IR(), t + C); x.stroke(); } },
  tiles(x, W, H, C) { const tw = C / 2.4, th = C / 3; for (let row = 0; row * th < H + th; row++) for (let i = -1; i * tw < W + tw; i++) { const px = i * tw + (row % 2 ? tw / 2 : 0), py = row * th; x.strokeStyle = INK(.55); x.lineWidth = .8; x.beginPath(); x.moveTo(px, py + th * .6); x.quadraticCurveTo(px + tw / 2, py + th * 1.2, px + tw, py + th * .6); x.stroke(); if (IR() > .7) hatch(x, () => { x.beginPath(); x.rect(px + tw * .6, py, tw * .4, th); }, px + tw * .8, py + th / 2, th, .5, 2.5, .25, .5); } },
  snow(x, W, H, C) { for (let i = 0; i < W * H / 260; i++) stip(x, IR() * W, IR() * H, 1, 0, .3); for (let i = 0; i < 18; i++) { const px = IR() * W, py = IR() * H, w2 = C * (.5 + IR()); x.strokeStyle = INK(.4); x.lineWidth = .7; x.beginPath(); x.moveTo(px - w2, py); x.quadraticCurveTo(px, py - C * .25, px + w2, py); x.stroke(); }
    for (let i = 0; i < 10; i++) { let px = IR() * W, py = IR() * H; for (let k = 0; k < 4; k++) { x.fillStyle = INK(.35); x.beginPath(); x.ellipse(px + (k % 2) * 4, py, 1.6, 2.6, .3, 0, 7); x.fill(); px += 5; py -= 7; } } },
  obsidian(x, W, H, C) { for (let y = 0; y < ROWS; y++) for (let xx = 0; xx < COLS; xx++) { const l = xx * C, t = y * C; istroke(x, [[l + 2, t + 2], [l + C - 2, t + 2], [l + C - 2, t + C - 2], [l + 2, t + C - 2]], .8, .6);
      hatch(x, () => { x.beginPath(); x.rect(l + 2, t + 2, C - 4, C - 4); }, l + C / 2, t + C / 2, C * .75, (xx + y) % 2 ? Math.PI / 4 : -Math.PI / 4, 3, .28, .5);
      if (IR() > .6) { wash(x, l + C / 2, t + C / 2, C * .55, "#7a3aa8", .25); let px = l + C * IR(), py = t + C * IR(); const pts = [[px, py]]; for (let k = 0; k < 3; k++) { px += (IR() - .5) * C * .5; py += (IR() - .5) * C * .5; pts.push([px, py]); } istroke(x, pts, .8, .8, false); } } },
};
const INKO = {
  rock(x, cx, cy, C) { inkShadow(x, cx + C * .1, cy + C * .2, C * .42, C * .17); const pts = ipoly(cx, cy - C * .04, C * .34, 9, .35);
    x.fillStyle = "rgba(150,140,120,.35)"; jpath(x, pts, true); x.fill(); hatch(x, () => jpath(x, pts, true), cx + C * .12, cy + C * .08, C * .3, Math.PI / 4, 2.2, .55, .6);
    istroke(x, pts, 1.5, .9); iseg(x, cx - C * .12, cy - C * .14, cx + C * .02, cy, .8, .6); iseg(x, cx + C * .02, cy, cx + C * .16, cy - C * .06, .8, .6); },
  deadtree(x, cx, cy, C) { inkShadow(x, cx + C * .14, cy + C * .14, C * .48, C * .22);
    const br = (px, py, a, l, w, d) => { if (d <= 0 || l < 3) return; const ex = px + Math.cos(a) * l, ey = py + Math.sin(a) * l; iseg(x, px, py, ex, ey, w, .85); br(ex, ey, a - .45 - IR() * .3, l * .62, w * .62, d - 1); br(ex, ey, a + .4 + IR() * .3, l * .6, w * .62, d - 1); };
    for (let i = 0; i < 5; i++) br(cx, cy, IR() * 7, C * (.22 + IR() * .1), 1.8, 3);
    x.fillStyle = "#efe6d0"; x.beginPath(); x.arc(cx, cy, C * .16, 0, 7); x.fill(); istroke(x, ipoly(cx, cy, C * .16, 10, .12), 1.4, .9);
    x.strokeStyle = INK(.6); x.lineWidth = .6; [.1, .06].forEach(r => { x.beginPath(); x.arc(cx, cy, C * r, 0, 7); x.stroke(); }); x.fillStyle = INK(.85); x.beginPath(); x.arc(cx + 1, cy + 1, C * .04, 0, 7); x.fill(); },
  tree(x, cx, cy, C) { INKO.deadtree(x, cx, cy, C); },
  barrel(x, cx, cy, C) { inkShadow(x, cx + C * .08, cy + C * .16, C * .38, C * .17); const r = C * .3; x.fillStyle = "rgba(170,120,60,.45)"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    hatch(x, () => { x.beginPath(); x.arc(cx, cy, r, 0, 7); }, cx + r * .4, cy + r * .4, r, Math.PI / 4, 2.4, .4, .6);
    [r, r * .78, r * .42].forEach((rr, i) => istroke(x, ipoly(cx, cy, rr, 14, .03), i ? .9 : 1.5, .9)); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; iseg(x, cx + Math.cos(a) * r * .42, cy + Math.sin(a) * r * .42, cx + Math.cos(a) * r * .78, cy + Math.sin(a) * r * .78, .6, .55); } },
  grave(x, cx, cy, C) { inkShadow(x, cx + C * .1, cy + C * .22, C * .36, C * .14); const w = C * .42, h = C * .52, l = cx - w / 2, t = cy - h * .6;
    x.strokeStyle = INK(.6); x.lineWidth = .8; x.beginPath(); x.ellipse(cx, cy + h * .38, w * .7, C * .1, 0, 0, 7); x.stroke(); stip(x, cx, cy + h * .38, 12, w * .5, .5);
    const shape = () => { x.beginPath(); x.moveTo(l, t + h); x.lineTo(l, t + w / 2); x.arc(cx, t + w / 2, w / 2, Math.PI, 0); x.lineTo(l + w, t + h); x.closePath(); };
    x.fillStyle = "rgba(170,165,160,.5)"; shape(); x.fill(); hatch(x, shape, cx + w * .3, cy, h, Math.PI / 3, 2.3, .45, .6); x.strokeStyle = INK(.9); x.lineWidth = 1.5; shape(); x.stroke();
    iseg(x, cx, t + w * .25, cx, t + w * .75, 1.1, .9); iseg(x, cx - w * .18, t + w * .42, cx + w * .18, t + w * .42, 1.1, .9); },
  menhir(x, cx, cy, C) { inkShadow(x, cx + C * .14, cy + C * .2, C * .4, C * .16); const w = C * .3, h = C * .72;
    const pts = [[cx - w / 2, cy + h * .38], [cx - w * .58, cy - h * .18], [cx - w * .1, cy - h * .52], [cx + w * .48, cy - h * .36], [cx + w / 2, cy + h * .38]];
    x.fillStyle = "rgba(150,140,160,.45)"; jpath(x, pts, true); x.fill(); hatch(x, () => jpath(x, pts, true), cx + w * .3, cy, h, Math.PI / 4, 2.3, .5, .6); istroke(x, pts, 1.5, .9);
    wash(x, cx, cy - h * .05, C * .35, "#8a4ad0", .35); x.strokeStyle = "rgba(110,40,170,.9)"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx - w * .12, cy - h * .2); x.lineTo(cx + w * .1, cy - h * .06); x.lineTo(cx - w * .1, cy + h * .08); x.lineTo(cx + w * .12, cy + h * .2); x.stroke(); },
  crate(x, cx, cy, C) { inkShadow(x, cx + C * .1, cy + C * .2, C * .42, C * .18); const s = C * .58, l = cx - s / 2, t = cy - s / 2 - C * .03;
    x.fillStyle = "rgba(180,130,70,.4)"; x.fillRect(l, t, s, s); hatch(x, () => { x.beginPath(); x.rect(l, t, s, s); }, cx + s * .2, cy + s * .2, s * .5, Math.PI / 4, 3, .3, .5);
    istroke(x, [[l, t], [l + s, t], [l + s, t + s], [l, t + s]], 1.5, .9); istroke(x, [[l + 3, t + 3], [l + s - 3, t + 3], [l + s - 3, t + s - 3], [l + 3, t + s - 3]], .7, .6);
    iseg(x, l + 3, t + 3, l + s - 3, t + s - 3, 1.1, .8); for (let i = 1; i < 3; i++) iseg(x, l, t + i * s / 3, l + s, t + i * s / 3, .5, .4); },
  pillar(x, cx, cy, C) { inkShadow(x, cx + C * .14, cy + C * .16, C * .44, C * .22); const r = C * .3, s = C * .74;
    istroke(x, [[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2], [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2]], 1.1, .8);
    hatch(x, () => { x.beginPath(); x.rect(cx - s / 2, cy - s / 2, s, s); x.arc(cx, cy, r + 2, 0, 7, true); }, cx, cy, s, Math.PI / 4, 2.6, .35, .5);
    x.fillStyle = "rgba(200,192,180,.6)"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); hatch(x, () => { x.beginPath(); x.arc(cx, cy, r, .2, 2.9); x.closePath(); }, cx, cy + r * .5, r, Math.PI / 4, 2.2, .45, .6);
    istroke(x, ipoly(cx, cy, r, 16, .04), 1.6, .9); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; iseg(x, cx + Math.cos(a) * r * .62, cy + Math.sin(a) * r * .62, cx + Math.cos(a) * r * .95, cy + Math.sin(a) * r * .95, .6, .6); }
    x.strokeStyle = INK(.6); x.lineWidth = .8; x.beginPath(); x.arc(cx, cy, r * .55, 0, 7); x.stroke(); },
  chimney(x, cx, cy, C) { inkShadow(x, cx + C * .12, cy + C * .18, C * .42, C * .2); const s = C * .56, l = cx - s / 2, t = cy - s / 2; x.fillStyle = "rgba(170,80,50,.4)"; x.fillRect(l, t, s, s);
    for (let r = 0; r < 4; r++) { iseg(x, l, t + r * s / 4, l + s, t + r * s / 4, .6, .6); for (let c = 0; c < 3; c++) iseg(x, l + c * s / 3 + (r % 2 ? s / 6 : 0), t + r * s / 4, l + c * s / 3 + (r % 2 ? s / 6 : 0), t + (r + 1) * s / 4, .6, .6); }
    istroke(x, [[l, t], [l + s, t], [l + s, t + s], [l, t + s]], 1.5, .9); x.fillStyle = INK(.85); x.fillRect(cx - s * .2, cy - s * .2, s * .4, s * .4); },
  water(x, cx, cy, C) { const pts = ipoly(cx, cy, C * .44, 12, .25); x.fillStyle = "rgba(70,120,140,.42)"; jpath(x, pts, true); x.fill(); wash(x, cx, cy, C * .35, "#2a5a70", .35); istroke(x, pts, 1.3, .85);
    for (let i = 0; i < 4; i++) { const yy = cy - C * .2 + i * C * .13; x.strokeStyle = INK(.5); x.lineWidth = .6; x.beginPath(); for (let k = 0; k <= 4; k++) { const px = cx - C * .22 + k * C * .11, py = yy + (k % 2 ? -1.6 : 1.6); k ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); } },
  shelf(x, cx, cy, C) { inkShadow(x, cx + C * .08, cy + C * .16, C * .5, C * .18); const w = C * .88, h = C * .4, l = cx - w / 2, t = cy - h / 2;
    x.fillStyle = "rgba(150,100,50,.45)"; x.fillRect(l, t, w, h); let px = l + 3; while (px < l + w - 4) { const bw = 2 + IR() * 4; iseg(x, px, t + 3, px, t + h - 3, .6, .7); if (IR() > .6) { x.fillStyle = ["rgba(140,40,30,.4)", "rgba(40,70,110,.4)", "rgba(60,90,40,.4)"][Math.floor(IR() * 3)]; x.fillRect(px, t + 3, bw, h - 6); } px += bw; }
    istroke(x, [[l, t], [l + w, t], [l + w, t + h], [l, t + h]], 1.6, .9); },
  mirror(x, cx, cy, C) { inkShadow(x, cx + C * .1, cy + C * .2, C * .36, C * .14); const pts = [[cx, cy - C * .4], [cx + C * .2, cy - C * .04], [cx + C * .12, cy + C * .36], [cx - C * .14, cy + C * .32], [cx - C * .2, cy - C * .1]];
    x.fillStyle = "rgba(60,30,90,.5)"; jpath(x, pts, true); x.fill(); wash(x, cx, cy, C * .35, "#a060f0", .35); hatch(x, () => jpath(x, pts, true), cx, cy, C * .45, -Math.PI / 3, 2.6, .5, .6); istroke(x, pts, 1.5, .9); iseg(x, cx - C * .05, cy - C * .28, cx + C * .06, cy + C * .2, .9, .5); },
};

/* ---------- cover (5e: half +2, three-quarters +5) ---------- */
function coverOf(a, t) {
  if (!CB || dist(a, t) <= 1) return 0;
  const sol = (MSTYLE[mapKey()] || {}).ob !== "water", solid = k => sol || (CB.tall && CB.tall.has(k));
  const ax = a.x + .5, ay = a.y + .5, bx = t.x + .5, by = t.y + .5, n = Math.ceil(Math.hypot(bx - ax, by - ay) * 8), seen = new Set(); let obs = 0, cre = 0;
  for (let i = 1; i < n; i++) { const px = ax + (bx - ax) * i / n, py = ay + (by - ay) * i / n, cx = Math.floor(px), cy = Math.floor(py);
    if (Math.abs(px - cx - .5) > .42 || Math.abs(py - cy - .5) > .42) continue;
    const k = K(cx, cy); if (seen.has(k) || (cx === a.x && cy === a.y) || (cx === t.x && cy === t.y)) continue; seen.add(k);
    if (CB.ob.has(k)) { if (solid(k)) obs++; } else { const o = unitAt(cx, cy); if (o && o !== a && o !== t && alive(o)) cre++; } }
  if (inBrush(t)) obs++;
  return obs >= 2 ? 5 : (obs || cre) ? 2 : 0;
}
const COVER_T = ["copertura", "cover", "cobertura"];

/* ---------- painted miniatures ---------- */
const CLASS_LOOK = {
  fighter: {armor: "#8c929c", metal: 1, cloak: "#7a1f24", shield: "#7a1f24", pants: "#3a3330"},
  paladin: {armor: "#c9cdd6", metal: 1, tabard: "#efe8d2", cloak: "#2c4a8a", shield: "#efe8d2", emblem: 1, pants: "#4a4a52"},
  rogue: {armor: "#3a2e2a", cloak: "#211b24", hood: "#211b24", pants: "#2a2220"},
  ranger: {armor: "#5a4a30", cloak: "#3d5e34", hood: "#3d5e34", pants: "#4a3a28"},
  wizard: {armor: "#2c3e7a", robe: "#2c3e7a", hat: "wizard", hatc: "#22306a", orb: "#9fc4ff"},
  cleric: {armor: "#9ca0a8", metal: 1, tabard: "#e8d8a8", shield: "#caa650", emblem: 1, pants: "#4a4038"},
};
const RACE_LOOK = {human: {skin: "#e0b48e", hair: "#5a3a22", S: 1, W: 1}, elf: {skin: "#efd2b6", hair: "#e3d39c", ears: 1, S: 1.04, W: .9},
  dwarf: {skin: "#d9a07a", hair: "#8a4a22", beard: 1, S: .8, W: 1.22}, halfling: {skin: "#e8b892", hair: "#6a4422", S: .74, W: 1},
  halforc: {skin: "#8a9a6a", hair: "#1a1a1a", tusks: 1, S: 1.06, W: 1.15}, tiefling: {skin: "#a8505a", hair: "#2a1a2a", horns: 1, S: 1, W: 1}};
const WEAP_LOOK = {longsword: "sword", warhammer: "hammer", javelin: "spear", rapier: "rapier", shortsword: "sword", shortbow: "bow", longbow: "bow", quarterstaff: "staff", mace: "mace"};
const FOE_LOOK = {
  famished: {skin: "#a3a68e", armor: "#55523e", rag: 1, hunch: 1, weapon: "claws", eyes: "#ffe08a"},
  zombie: {skin: "#8c9a72", armor: "#4a4a32", rag: 1, hunch: 1, weapon: "claws", eyes: "#d8ff8a", W: 1.1},
  ghoul: {skin: "#7a8a8a", armor: "#2a2a2a", hunch: 1, weapon: "claws", eyes: "#ff6a3a"},
  drowned: {skin: "#7aa0a0", armor: "#2a4a5a", rag: 1, hunch: 1, weapon: "claws", eyes: "#9ff0e0"},
  skeleton: {skel: 1, weapon: "sword", shield: "#5a4a3a"}, skelarcher: {skel: 1, weapon: "bow"},
  wolf: {quad: 1, fur: "#2e2a34", eyes: "#ff4a5a", Q: 1}, rat: {quad: 1, fur: "#6a4a34", eyes: "#ff8a5a", Q: .72, rattail: 1},
  goblin: {skin: "#6f8f3c", armor: "#5a4030", pants: "#4a3020", S: .68, gob: 1, weapon: "scimitar"},
  gobarcher: {skin: "#6f8f3c", armor: "#4a3a28", pants: "#4a3020", S: .68, gob: 1, weapon: "bow", hood: "#4a5a2a"},
  snik: {skin: "#6f8f3c", armor: "#6a5a40", metal: 1, pants: "#4a3020", S: .78, W: 1.25, gob: 1, hat: "helm", weapon: "scimitar"},
  cultist: {robe: "#8a877e", armor: "#8a877e", hood: "#76736a", mask: "#f2ede0", weapon: "sickle", skin: "#d8c8b0"},
  acolyte: {robe: "#55525e", armor: "#55525e", hood: "#46434e", mask: "#f2ede0", weapon: "censer", glow: "#b48af0", skin: "#d8c8b0"},
  fanatic: {robe: "#4a2a2a", armor: "#4a2a2a", hood: "#3a1a1a", mask: "#f2ede0", sash: "#a8243c", weapon: "sword", skin: "#d8c8b0"},
  varga: {robe: "#d6d2c6", armor: "#d6d2c6", mask: "#9a9a9a", skin: "#ece8de", hair: "#e8e4dc", weapon: "dagger", S: 1.05},
  bandit: {armor: "#6a4a30", hood: "#4a3a2a", pants: "#3a2a20", weapon: "sword", skin: "#d4a07a"},
  xbow: {armor: "#5a4a34", hood: "#3a3a2a", pants: "#3a2a20", weapon: "xbow", skin: "#d4a07a"},
  mira: {armor: "#5a3a2a", cloak: "#8a2a2a", hair: "#2a1a12", eyepatch: 1, weapon: "sword", skin: "#e0b48e", pants: "#3a2a20"},
  shadow: {ghost: 1, robe: "#1a1420", eyes: "#c08cff"}, shade: {ghost: 1, robe: "#2a1a3a", eyes: "#ff8aff", weapon: "sword"},
  warden: {armor: "#3a3440", metal: 1, hat: "lantern", glow: "#b48af0", weapon: "maul", S: 1.1, W: 1.15, pants: "#2a2430"},
  doran: {armor: "#2a2a30", cloak: "#3a3a40", mask: "#8a8a8a", hair: "#1a1416", weapon: "twin", skin: "#e0b48e", pants: "#22222a"},
  dukeguard: {armor: "#5a4a6a", metal: 1, tabard: "#6a3a8a", hat: "helm", weapon: "halberd", pants: "#2a2430", noshadow: 1},
  armor: {armor: "#7a8088", metal: 1, hat: "helm", weapon: "fists", eyes: "#9fc4ff", pants: "#5a6068", empty: 1},
  hknight: {armor: "#24222a", metal: 1, hat: "helm", weapon: "greatsword", eyes: "#ff3a4a", S: 1.12, W: 1.15, pants: "#1a181e", cloak: "#3a0a12"},
  keeper: {ghost: 1, robe: "#1a3a3a", eyes: "#9ff0e0", crown: "#2a5a3a", S: 1.15},
  jailer: {armor: "#4a3a2e", mask: "iron", hat: "helm", weapon: "mace", W: 1.22, pants: "#2a2420", skin: "#c49a7a"},
  obsidian: {armor: "#2a2236", metal: 1, hat: "helm", weapon: "fists", eyes: "#c08cff", S: 1.2, W: 1.25, pants: "#1a1424", empty: 1, glow: "#a060f0"},
  seraphine: {robe: "#140d18", armor: "#140d18", skin: "#a9a6ae", hair: "#e2ded6", weapon: "staff", orb: "#c08cff", S: 1.14, cloak: "#0c080f"},
  avatar: {maw: 1}, avatarw: {maw: 1, chains: 1},
};
function miniLook(u) {
  if (u.side === "p") { const c = u.ref, w = weaponsOf(c)[0];
    return Object.assign({skin: "#e0b48e"}, RACE_LOOK[c.race], CLASS_LOOK[c.cls], {weapon: WEAP_LOOK[w] || "sword"},
      c.id === "brenna" ? {hair: "#b8562a", beard: 1, cloak: "#5a3a22"} : {}, c.id === "kael" ? {hair: "#16121a"} : {}, c.id === "ilyra" ? {hair: "#bdb8b0", hatc: "#3a3a4a", robe: "#4a4a5a", armor: "#4a4a5a"} : {},
      {rim: "#caa650", key: "p_" + c.id + c.cls + c.race}); }
  return Object.assign({skin: "#d0b090", pants: "#2a2420"}, FOE_LOOK[u.foe] || FOE_LOOK.cultist, {rim: "#b8344d", key: "e_" + u.foe});
}
const MINI_CACHE = {};
function miniSrc(u) {
  const L = miniLook(u); if (MINI_CACHE[L.key]) return MINI_CACHE[L.key];
  const cv = document.createElement("canvas"); cv.width = 320; cv.height = 400; const x = cv.getContext("2d"); x.scale(2, 2);
  try { paintMini(x, L, u.boss); } catch (e) { console.error(e); }
  return (MINI_CACHE[L.key] = cv.toDataURL());
}
function fillStroke(x, fill, w = 1.4) { x.fillStyle = fill; x.fill(); x.strokeStyle = "rgba(18,10,6,.9)"; x.lineWidth = w; x.lineJoin = "round"; x.stroke(); }
function grad(x, x0, y0, x1, y1, c, k = .35) { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, shade(c, k)); g.addColorStop(.5, c); g.addColorStop(1, shade(c, -.45)); return g; }
function rrect(x, l, t, w, h, r) { x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath(); }
function paintBase(x, L, big) {
  const cx = 80, cy = 170, rx = big ? 60 : 52, ry = big ? 21 : 18;
  x.fillStyle = "rgba(0,0,0,.45)"; x.beginPath(); x.ellipse(cx + 3, cy + 7, rx + 3, ry + 4, 0, 0, 7); x.fill();
  x.fillStyle = "#0c0908"; x.beginPath(); x.ellipse(cx, cy + 5, rx, ry, 0, 0, 7); x.fill();
  x.fillStyle = "#16110e"; x.fillRect(cx - rx, cy, rx * 2, 5);
  const g = x.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry); g.addColorStop(0, "#4a3a2c"); g.addColorStop(1, "#1e1712"); x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill();
  const fl = L.noshadow ? ["#4a3a5a", "#2a2236"] : L.ghost ? ["#3a3448", "#24202c"] : ["#5a6a32", "#46532a", "#6a5a3a", "#3e4a26"];
  for (let i = 0; i < 260; i++) { const a = Math.random() * 7, r = Math.sqrt(Math.random()); x.fillStyle = fl[i % fl.length]; x.fillRect(cx + Math.cos(a) * rx * .92 * r, cy + Math.sin(a) * ry * .9 * r, 1.4, 1.4); }
  x.strokeStyle = L.rim; x.lineWidth = 2.6; x.beginPath(); x.ellipse(cx, cy + 1.5, rx - 1, ry - .5, 0, .15, Math.PI - .15); x.stroke();
  x.strokeStyle = "rgba(255,240,210,.25)"; x.lineWidth = 1; x.beginPath(); x.ellipse(cx, cy, rx - 1, ry - 1, 0, Math.PI + .3, Math.PI * 2 - .3); x.stroke();
  x.fillStyle = "rgba(0,0,0,.5)"; x.beginPath(); x.ellipse(cx + 4, cy + 2, 24, 8, 0, 0, 7); x.fill();
}
function paintMini(x, L, big) {
  paintBase(x, L, big);
  if (L.maw) return paintMaw(x, L); if (L.quad) return paintQuad(x, L);
  const S = (L.S || 1) * (big ? 1.08 : 1), W = L.W || 1, fx = 80, fy = 168;
  const Y = v => fy - v * S, X = v => fx + v * W;
  const ink = "rgba(18,10,6,.9)";
  x.save(); if (L.ghost) x.globalAlpha = .9;
  // cloak behind
  if (L.cloak) { x.beginPath(); x.moveTo(X(-19), Y(90)); x.quadraticCurveTo(X(-34), Y(40), X(-30), Y(6)); x.lineTo(X(26), Y(6)); x.quadraticCurveTo(X(32), Y(44), X(19), Y(90)); x.closePath(); fillStroke(x, grad(x, X(-30), 0, X(30), 0, L.cloak)); }
  // bow held in left hand behind body
  if (L.weapon === "bow") { x.strokeStyle = "#5a3a1e"; x.lineWidth = 4; x.beginPath(); x.moveTo(X(-30), Y(108)); x.quadraticCurveTo(X(-50), Y(70), X(-30), Y(30)); x.stroke(); x.strokeStyle = "rgba(240,230,200,.8)"; x.lineWidth = .8; x.beginPath(); x.moveTo(X(-30), Y(108)); x.lineTo(X(-30), Y(30)); x.stroke(); }
  if (L.weapon === "staff" || L.weapon === "halberd" || L.weapon === "spear") { const tx = X(30); x.strokeStyle = "#4a2e18"; x.lineWidth = 3.6; x.beginPath(); x.moveTo(tx, Y(0)); x.lineTo(tx + 2, Y(L.weapon === "staff" ? 132 : 140)); x.stroke(); x.strokeStyle = ink; x.lineWidth = .8; x.stroke();
    if (L.weapon === "staff") { const g = x.createRadialGradient(tx + 2, Y(138), 0, tx + 2, Y(138), 16); g.addColorStop(0, "#fff"); g.addColorStop(.3, L.orb || "#9fc4ff"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(tx + 2, Y(138), 16, 0, 7); x.fill(); x.fillStyle = L.orb || "#9fc4ff"; x.beginPath(); x.arc(tx + 2, Y(138), 5, 0, 7); fillStroke(x, L.orb || "#9fc4ff", 1); }
    else if (L.weapon === "halberd") { x.beginPath(); x.moveTo(tx + 2, Y(132)); x.quadraticCurveTo(tx + 20, Y(128), tx + 18, Y(112)); x.lineTo(tx + 2, Y(116)); x.closePath(); fillStroke(x, grad(x, tx, Y(130), tx + 20, Y(110), "#b8bcc6")); x.beginPath(); x.moveTo(tx + 2, Y(150)); x.lineTo(tx - 2, Y(138)); x.lineTo(tx + 6, Y(138)); x.closePath(); fillStroke(x, "#c8ccd6", 1); }
    else { x.beginPath(); x.moveTo(tx + 2, Y(152)); x.lineTo(tx - 3, Y(138)); x.lineTo(tx + 7, Y(138)); x.closePath(); fillStroke(x, "#c8ccd6", 1); } }
  // legs / robe
  if (L.ghost) { const g = x.createLinearGradient(0, Y(90), 0, Y(0)); g.addColorStop(0, L.robe); g.addColorStop(1, "rgba(0,0,0,0)"); x.beginPath(); x.moveTo(X(-16), Y(56)); x.quadraticCurveTo(X(-26), Y(20), X(-14), Y(4)); x.quadraticCurveTo(X(0), Y(14), X(14), Y(2)); x.quadraticCurveTo(X(26), Y(22), X(16), Y(56)); x.closePath(); x.fillStyle = g; x.fill(); }
  else if (L.robe) { x.beginPath(); x.moveTo(X(-15), Y(56)); x.lineTo(X(-25), Y(4)); x.quadraticCurveTo(X(0), Y(-2), X(25), Y(4)); x.lineTo(X(15), Y(56)); x.closePath(); fillStroke(x, grad(x, X(-25), 0, X(25), 0, L.robe)); for (let i = -1; i <= 1; i++) { x.strokeStyle = "rgba(0,0,0,.3)"; x.lineWidth = 1; x.beginPath(); x.moveTo(X(i * 6), Y(50)); x.lineTo(X(i * 10), Y(6)); x.stroke(); } }
  else if (L.skel) { x.strokeStyle = "#e8e0cc"; x.lineWidth = 3.5; x.lineCap = "round"; [[-7, -9], [7, 9]].forEach(([a, b]) => { x.beginPath(); x.moveTo(X(a), Y(50)); x.lineTo(X(b * .9), Y(26)); x.lineTo(X(b), Y(4)); x.stroke(); }); }
  else { const lc = L.pants || "#3a3330"; [[-10, -2], [2, 10]].forEach(([l, r]) => { rrect(x, X(l), Y(52), (r - l) * W, 48 * S, 3); fillStroke(x, grad(x, X(l), 0, X(r), 0, L.metal ? L.armor : lc)); rrect(x, X(l) - 1, Y(14), (r - l) * W + 2, 14 * S, 3); fillStroke(x, "#2a1e16"); }); }
  // torso
  const sh = L.hunch ? 8 : 0;
  if (L.skel) { x.strokeStyle = "#e8e0cc"; x.lineWidth = 3; x.beginPath(); x.moveTo(X(0), Y(52)); x.lineTo(X(0), Y(92)); x.stroke(); for (let i = 0; i < 4; i++) { x.lineWidth = 2; x.beginPath(); x.moveTo(X(-11 + i), Y(86 - i * 8)); x.quadraticCurveTo(X(0), Y(80 - i * 8), X(11 - i), Y(86 - i * 8)); x.stroke(); } x.beginPath(); x.ellipse(X(0), Y(52), 9 * W, 4, 0, 0, 7); x.stroke(); }
  else if (!L.ghost || true) { x.beginPath(); x.moveTo(X(-19 - sh / 2), Y(92 - sh)); x.quadraticCurveTo(X(0), Y(98 - sh), X(19 + sh / 2), Y(92 - sh)); x.lineTo(X(14), Y(50)); x.lineTo(X(-14), Y(50)); x.closePath(); fillStroke(x, grad(x, X(-20), 0, X(20), 0, L.ghost ? L.robe : L.armor));
    if (L.metal) { x.strokeStyle = "rgba(255,255,255,.45)"; x.lineWidth = 2; x.beginPath(); x.moveTo(X(-6), Y(88)); x.lineTo(X(-4), Y(56)); x.stroke(); x.fillStyle = "rgba(255,255,255,.6)"; [[-12, 84], [12, 84]].forEach(([a, b]) => { x.beginPath(); x.arc(X(a), Y(b), 1.4, 0, 7); x.fill(); }); }
    if (L.tabard) { x.beginPath(); x.moveTo(X(-7), Y(88)); x.lineTo(X(7), Y(88)); x.lineTo(X(8), Y(36)); x.lineTo(X(-8), Y(36)); x.closePath(); fillStroke(x, grad(x, X(-8), 0, X(8), 0, L.tabard), 1); if (L.emblem) { x.fillStyle = "#caa650"; x.beginPath(); x.arc(X(0), Y(72), 3.4, 0, 7); x.fill(); } }
    if (L.sash) { x.strokeStyle = L.sash; x.lineWidth = 4; x.beginPath(); x.moveTo(X(-14), Y(88)); x.lineTo(X(12), Y(54)); x.stroke(); }
    if (L.rag) { x.fillStyle = shade(L.armor, -.3); for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(X(i * 6 - 3), Y(50)); x.lineTo(X(i * 6), Y(40 - Math.abs(i) * 2)); x.lineTo(X(i * 6 + 3), Y(50)); x.fill(); } }
    if (!L.robe && !L.ghost) { x.fillStyle = "#2a1c12"; x.fillRect(X(-14), Y(55), 28 * W, 4); x.fillStyle = "#caa650"; x.fillRect(X(-2), Y(55), 4, 4); } }
  // arms
  const arm = (sx, sy, hx, hy, col) => { x.strokeStyle = "rgba(18,10,6,.9)"; x.lineWidth = 9.5 * Math.min(W, 1.2); x.lineCap = "round"; x.beginPath(); x.moveTo(sx, sy); x.lineTo(hx, hy); x.stroke(); x.strokeStyle = col; x.lineWidth = 7 * Math.min(W, 1.2); x.stroke(); x.beginPath(); x.arc(hx, hy, 3.6, 0, 7); fillStroke(x, L.skel ? "#e8e0cc" : L.metal && !L.skin ? L.armor : (L.ghost ? L.robe : L.skin), 1); };
  const armC = L.skel ? "#e8e0cc" : L.ghost ? L.robe : L.robe ? shade(L.robe, .08) : L.metal ? shade(L.armor, -.05) : shade(L.armor, .05);
  const lh = L.weapon === "bow" ? [X(-30), Y(70)] : L.hunch ? [X(-22), Y(52)] : [X(-24), Y(58)];
  const rh = ["staff", "halberd", "spear"].includes(L.weapon) ? [X(30), Y(66)] : L.hunch ? [X(24), Y(50)] : [X(24), Y(60)];
  arm(X(-17), Y(88 - sh), lh[0], lh[1], armC);
  // shield on left arm
  if (L.shield) { const sx = X(-24), sy = Y(64); x.beginPath(); x.moveTo(sx - 12, sy - 14); x.lineTo(sx + 12, sy - 14); x.lineTo(sx + 12, sy + 2); x.quadraticCurveTo(sx + 10, sy + 14, sx, sy + 20); x.quadraticCurveTo(sx - 10, sy + 14, sx - 12, sy + 2); x.closePath(); fillStroke(x, grad(x, sx - 12, sy - 14, sx + 12, sy + 20, L.shield), 1.6);
    x.strokeStyle = "#caa650"; x.lineWidth = 1.5; x.stroke(); if (L.emblem) { x.fillStyle = "#caa650"; x.beginPath(); x.arc(sx, sy, 4, 0, 7); x.fill(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; x.strokeStyle = "#caa650"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(sx + Math.cos(a) * 5.5, sy + Math.sin(a) * 5.5); x.lineTo(sx + Math.cos(a) * 8, sy + Math.sin(a) * 8); x.stroke(); } } }
  // weapon in right hand
  const [hx, hy] = rh; const blade = (len, wid, ang, col) => { x.save(); x.translate(hx, hy); x.rotate(ang); x.beginPath(); x.moveTo(-wid / 2, 0); x.lineTo(-wid / 2, -len); x.lineTo(0, -len - wid); x.lineTo(wid / 2, -len); x.lineTo(wid / 2, 0); x.closePath(); fillStroke(x, grad(x, -wid, 0, wid, 0, col || "#c9ced8", .5), 1.1); x.fillStyle = "#6a4a20"; x.fillRect(-wid - 3, -2, wid * 2 + 6, 3.5); x.fillStyle = "#3a2a18"; x.fillRect(-1.5, 1, 3, 7); x.restore(); };
  const w = L.weapon;
  if (w === "sword") blade(44 * S, 5, .35); else if (w === "rapier") blade(46 * S, 2.6, .45); else if (w === "greatsword") blade(60 * S, 7.5, .25, "#8a8e98");
  else if (w === "dagger" || w === "sickle") blade(20 * S, 4, .6); else if (w === "scimitar") { x.save(); x.translate(hx, hy); x.rotate(.4); x.beginPath(); x.moveTo(-2, 0); x.quadraticCurveTo(-6, -20, 6, -34); x.quadraticCurveTo(4, -18, 3, 0); x.closePath(); fillStroke(x, "#c9ced8", 1); x.restore(); }
  else if (w === "twin") { blade(22 * S, 4, .5); arm(X(-17), Y(88), X(-26), Y(62), armC); x.save(); x.translate(X(-26), Y(62)); x.rotate(-.5); x.beginPath(); x.rect(-2, -22, 4, 22); fillStroke(x, "#c9ced8", 1); x.restore(); }
  else if (w === "hammer" || w === "maul" || w === "mace") { const big2 = w === "maul"; x.save(); x.translate(hx, hy); x.rotate(.3); x.strokeStyle = "#4a2e18"; x.lineWidth = 3.4; x.beginPath(); x.moveTo(0, 8); x.lineTo(0, big2 ? -48 : -36); x.stroke();
    if (w === "mace") { x.beginPath(); x.arc(0, -38, 6.5, 0, 7); fillStroke(x, grad(x, -6, -44, 6, -32, "#9aa0aa"), 1.2); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; x.beginPath(); x.moveTo(Math.cos(a) * 6, -38 + Math.sin(a) * 6); x.lineTo(Math.cos(a) * 10, -38 + Math.sin(a) * 10); x.strokeStyle = "#6a707a"; x.lineWidth = 2; x.stroke(); } }
    else { rrect(x, big2 ? -11 : -8, big2 ? -58 : -44, big2 ? 22 : 16, big2 ? 14 : 10, 2); fillStroke(x, grad(x, -10, -50, 10, -40, big2 ? "#5a4a6a" : "#9aa0aa"), 1.2); } x.restore(); }
  else if (w === "xbow") { x.save(); x.translate(X(4), Y(66)); x.fillStyle = "#4a2e18"; x.fillRect(-4, -3, 30, 5); x.strokeStyle = ink; x.lineWidth = .8; x.strokeRect(-4, -3, 30, 5); x.strokeStyle = "#2a2a2a"; x.lineWidth = 2.5; x.beginPath(); x.moveTo(22, -14); x.quadraticCurveTo(30, -1, 22, 12); x.stroke(); x.restore(); }
  else if (w === "censer") { x.strokeStyle = "#8a7a5a"; x.lineWidth = 1; x.beginPath(); x.moveTo(hx, hy); x.lineTo(hx + 4, hy + 22); x.stroke(); const g = x.createRadialGradient(hx + 4, hy + 26, 0, hx + 4, hy + 26, 16); g.addColorStop(0, L.glow); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(hx + 4, hy + 26, 16, 0, 7); x.fill(); x.beginPath(); x.arc(hx + 4, hy + 26, 5, 0, 7); fillStroke(x, "#8a7a5a", 1); }
  else if (w === "claws") { x.strokeStyle = "#e8e0cc"; x.lineWidth = 1.4; for (let i = -1; i <= 1; i++) { x.beginPath(); x.moveTo(hx + i * 2, hy + 2); x.lineTo(hx + i * 3 + 3, hy + 9); x.stroke(); } }
  else if (w === "spear") {}
  if (w !== "bow" && w !== "twin" || true) arm(X(17), Y(88 - sh), hx, hy, armC);
  // head
  const hY = Y(104 - sh * 1.2), hX = X(L.hunch ? 5 : 1), hr = 11 * Math.min(1.1, (L.S || 1) < .8 ? 1.15 : 1);
  if (L.skel) { x.beginPath(); x.arc(hX, hY, hr * .95, 0, 7); fillStroke(x, grad(x, hX - hr, hY - hr, hX + hr, hY + hr, "#ece4d0"), 1.2); x.fillStyle = "#1a120c"; [-4, 4].forEach(d => { x.beginPath(); x.arc(hX + d, hY, 2.8, 0, 7); x.fill(); }); x.fillRect(hX - 4, hY + 6, 8, 2.5); }
  else if (L.empty) { x.beginPath(); x.arc(hX, hY, hr, 0, 7); fillStroke(x, grad(x, hX - hr, hY - hr, hX + hr, hY + hr, L.armor, .5)); x.fillStyle = "#050505"; x.fillRect(hX - 8, hY - 1, 16, 3.5); }
  else {
    if (L.horns) { x.beginPath(); x.moveTo(hX - 6, hY - 8); x.quadraticCurveTo(hX - 16, hY - 16, hX - 12, hY - 26); x.quadraticCurveTo(hX - 9, hY - 16, hX - 2, hY - 10); fillStroke(x, "#2a1a1a", 1); x.beginPath(); x.moveTo(hX + 6, hY - 8); x.quadraticCurveTo(hX + 16, hY - 16, hX + 12, hY - 26); x.quadraticCurveTo(hX + 9, hY - 16, hX + 2, hY - 10); fillStroke(x, "#2a1a1a", 1); }
    if (L.ears || L.gob) { const big2 = L.gob ? 1.8 : 1; [-1, 1].forEach(s => { x.beginPath(); x.moveTo(hX + s * 9, hY - 2); x.lineTo(hX + s * (14 + 6 * big2), hY - 6 - 4 * big2); x.lineTo(hX + s * 10, hY + 4); x.closePath(); fillStroke(x, L.skin, 1); }); }
    x.beginPath(); x.arc(hX, hY, hr, 0, 7); fillStroke(x, L.ghost ? "#0c0810" : grad(x, hX - hr, hY - hr, hX + hr, hY + hr, L.skin, .25));
    if (!L.ghost && !L.mask) { x.fillStyle = "#1a120c"; x.fillRect(hX + 2, hY - 2, 2.2, 2.2); x.fillRect(hX + 7, hY - 2, 2.2, 2.2); if (L.eyepatch) { x.fillStyle = "#111"; x.beginPath(); x.arc(hX + 3, hY - 1, 3.2, 0, 7); x.fill(); x.strokeStyle = "#111"; x.lineWidth = 1; x.beginPath(); x.moveTo(hX - 10, hY - 5); x.lineTo(hX + 10, hY + 2); x.stroke(); } }
    if (L.tusks) { x.fillStyle = "#f2ead8"; [2, 8].forEach(d => { x.beginPath(); x.moveTo(hX + d - 1, hY + 6); x.lineTo(hX + d, hY + 1); x.lineTo(hX + d + 1.5, hY + 6); x.fill(); }); }
    if (L.mask) { x.beginPath(); x.ellipse(hX + 2, hY + 1, hr * .8, hr * .9, 0, 0, 7); fillStroke(x, L.mask === "iron" ? grad(x, hX - 8, hY - 8, hX + 8, hY + 8, "#5a5a62", .4) : L.mask, 1); x.fillStyle = "#0a0606"; [-1, 6].forEach(d => { x.beginPath(); x.ellipse(hX + d, hY - 1, 2.4, 1.6, 0, 0, 7); x.fill(); }); }
    if (L.beard) { x.beginPath(); x.moveTo(hX - 9, hY + 1); x.quadraticCurveTo(hX - 6, hY + 22, hX + 2, hY + 24); x.quadraticCurveTo(hX + 10, hY + 20, hX + 10, hY + 1); x.closePath(); fillStroke(x, grad(x, hX - 9, hY, hX + 10, hY + 24, L.hair), 1.1); }
    if (L.hood) { x.beginPath(); x.moveTo(hX - hr - 4, hY + 8); x.quadraticCurveTo(hX - hr - 6, hY - hr - 10, hX + 2, hY - hr - 6); x.quadraticCurveTo(hX + hr + 6, hY - hr - 2, hX + hr + 3, hY + 6); x.quadraticCurveTo(hX + hr - 2, hY - 4, hX + 2, hY - hr + 2); x.quadraticCurveTo(hX - hr + 2, hY - 4, hX - hr + 1, hY + 8); x.closePath(); fillStroke(x, grad(x, hX - hr, hY - hr, hX + hr, hY + hr, L.hood), 1.2); }
    else if (L.hat === "wizard") { x.beginPath(); x.ellipse(hX, hY - hr * .55, hr * 1.9, hr * .45, -.08, 0, 7); fillStroke(x, grad(x, hX - 20, 0, hX + 20, 0, L.hatc), 1.2); x.beginPath(); x.moveTo(hX - hr * .9, hY - hr * .7); x.quadraticCurveTo(hX - 2, hY - hr * 2.4, hX + 12, hY - hr * 3.3); x.quadraticCurveTo(hX + 4, hY - hr * 2, hX + hr * .9, hY - hr * .7); x.closePath(); fillStroke(x, grad(x, hX - 10, 0, hX + 10, 0, L.hatc), 1.2); x.fillStyle = "#caa650"; x.fillRect(hX - hr * .85, hY - hr * .95, hr * 1.7, 2.4); }
    else if (L.hat === "helm" || L.hat === "lantern") { x.beginPath(); x.arc(hX, hY - 1, hr + 1.5, Math.PI * .95, Math.PI * 2.05); x.lineTo(hX + hr + 1.5, hY + 4); x.lineTo(hX - hr - 1.5, hY + 4); x.closePath(); fillStroke(x, grad(x, hX - hr, hY - hr, hX + hr, hY, L.hat === "lantern" ? "#3a3440" : (L.metal ? L.armor : "#6a6a72"), .5), 1.2); x.fillStyle = "#050505"; x.fillRect(hX - 1, hY - 3, hr + 1, 2.6);
      if (L.hat === "lantern") { const g = x.createRadialGradient(hX, hY - hr - 6, 0, hX, hY - hr - 6, 20); g.addColorStop(0, "#fff"); g.addColorStop(.3, L.glow); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(hX, hY - hr - 6, 20, 0, 7); x.fill(); x.strokeStyle = ink; x.lineWidth = 1.2; x.strokeRect(hX - 5, hY - hr - 12, 10, 12); } }
    else if (!L.ghost && L.hair && !L.mask) { x.beginPath(); x.arc(hX, hY - 2, hr + .5, Math.PI * .9, Math.PI * 2.05); x.quadraticCurveTo(hX + 4, hY - 5, hX - hr - .5, hY + (L.robe && !L.hat ? 14 : 2)); x.closePath(); fillStroke(x, grad(x, hX - hr, hY - hr, hX + hr, hY, L.hair), 1); if (L.hair === "#e2ded6") { x.beginPath(); x.moveTo(hX - hr, hY); x.quadraticCurveTo(hX - hr - 4, hY + 22, hX - 6, hY + 30); x.lineTo(hX - 2, hY + 6); x.closePath(); fillStroke(x, L.hair, 1); } }
    if (L.crown) { x.beginPath(); x.moveTo(hX - 10, hY - 8); for (let i = 0; i < 5; i++) { x.lineTo(hX - 10 + i * 5 + 2.5, hY - 18 - (i % 2) * 4); x.lineTo(hX - 10 + (i + 1) * 5, hY - 8); } x.closePath(); fillStroke(x, L.crown, 1); }
  }
  if (L.eyes) { [-3, 4].forEach(d => { const g = x.createRadialGradient(hX + d, hY - 1, 0, hX + d, hY - 1, 6); g.addColorStop(0, "#fff"); g.addColorStop(.3, L.eyes); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(hX + d, hY - 1, 6, 0, 7); x.fill(); }); }
  if (L.glow && L.weapon !== "censer" && L.hat !== "lantern") { const g = x.createRadialGradient(80, Y(70), 0, 80, Y(70), 40); g.addColorStop(0, hexA(L.glow, .3)); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(30, Y(110), 100, 90); }
  x.restore();
  // painted highlight wash
  const hl = x.createLinearGradient(40, 30, 120, 170); hl.addColorStop(0, "rgba(255,240,210,.14)"); hl.addColorStop(.5, "rgba(255,240,210,0)"); x.globalCompositeOperation = "source-atop"; x.fillStyle = hl; x.fillRect(0, 0, 160, 200); x.globalCompositeOperation = "source-over";
}
function paintQuad(x, L) {
  const s = L.Q || 1, cx = 78, by = 166; const col = L.fur;
  x.save(); x.translate(cx, by); x.scale(s, s);
  x.strokeStyle = "rgba(18,10,6,.9)"; x.lineWidth = 5.5; x.lineCap = "round"; [[-20, -2], [-10, 2], [14, -2], [24, 2]].forEach(([lx, o]) => { x.beginPath(); x.moveTo(lx, -26); x.lineTo(lx + o, -2); x.stroke(); });
  x.strokeStyle = shade(col, .1); x.lineWidth = 3.6; [[-20, -2], [-10, 2], [14, -2], [24, 2]].forEach(([lx, o]) => { x.beginPath(); x.moveTo(lx, -26); x.lineTo(lx + o, -2); x.stroke(); });
  if (L.rattail) { x.strokeStyle = "#c8a090"; x.lineWidth = 2.2; x.beginPath(); x.moveTo(-30, -30); x.quadraticCurveTo(-58, -22, -54, -56); x.stroke(); }
  else { x.beginPath(); x.moveTo(-30, -36); x.quadraticCurveTo(-50, -44, -54, -26); x.quadraticCurveTo(-44, -34, -30, -28); fillStroke(x, col, 1.2); }
  x.beginPath(); x.ellipse(0, -34, 34, 14, -.05, 0, 7); fillStroke(x, grad(x, 0, -48, 0, -20, col, .3));
  for (let i = 0; i < 9; i++) { x.strokeStyle = "rgba(0,0,0,.35)"; x.lineWidth = 1; x.beginPath(); x.moveTo(-24 + i * 6, -44); x.lineTo(-27 + i * 6, -38); x.stroke(); }
  x.beginPath(); x.moveTo(24, -44); x.quadraticCurveTo(36, -60, 46, -50); x.lineTo(60, -44); x.quadraticCurveTo(58, -36, 46, -36); x.quadraticCurveTo(34, -30, 24, -30); x.closePath(); fillStroke(x, grad(x, 24, -60, 60, -30, col, .35));
  [[34, -56], [42, -58]].forEach(([ex, ey]) => { x.beginPath(); x.moveTo(ex - 4, ey + 6); x.lineTo(ex, ey - 6); x.lineTo(ex + 4, ey + 6); x.closePath(); fillStroke(x, col, 1); });
  x.fillStyle = "#f2ead8"; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(48 + i * 4, -38); x.lineTo(50 + i * 4, -33); x.lineTo(52 + i * 4, -38); x.fill(); }
  const g = x.createRadialGradient(44, -48, 0, 44, -48, 6); g.addColorStop(0, "#fff"); g.addColorStop(.3, L.eyes); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.beginPath(); x.arc(44, -48, 6, 0, 7); x.fill();
  x.restore();
}
function paintMaw(x, L) {
  const cx = 80, cy = 100;
  for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI, l = 40 + Math.random() * 24; x.strokeStyle = "rgba(30,10,40,.85)"; x.lineWidth = 6 - i % 3; x.lineCap = "round"; x.beginPath(); x.moveTo(cx, cy + 10); x.quadraticCurveTo(cx + Math.cos(a) * l * .6 + 10, cy + Math.sin(a) * l * .6, cx + Math.cos(a) * l, cy + Math.sin(a) * l * .9 + 30); x.stroke(); }
  const g = x.createRadialGradient(cx - 10, cy - 20, 4, cx, cy, 52); g.addColorStop(0, "#5a2a70"); g.addColorStop(.6, "#1c0a24"); g.addColorStop(1, "#08020c"); x.beginPath();
  for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, r = 48 + Math.sin(i * 2.7) * 7; i ? x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9) : x.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9); }
  x.closePath(); fillStroke(x, g, 2);
  x.beginPath(); x.ellipse(cx, cy + 10, 26, 16, 0, 0, 7); fillStroke(x, "#0a0006", 1.5);
  x.fillStyle = "#f0e6d0"; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r1 = 26, r2 = 16; const px = cx + Math.cos(a) * r1, py = cy + 10 + Math.sin(a) * r2; x.beginPath(); x.moveTo(px + Math.cos(a + 1.6) * 3, py + Math.sin(a + 1.6) * 3); x.lineTo(px - Math.cos(a) * 8, py - Math.sin(a) * 6); x.lineTo(px + Math.cos(a - 1.6) * 3, py + Math.sin(a - 1.6) * 3); x.fill(); }
  [[-22, -24], [-8, -32], [8, -32], [22, -24], [0, -20]].forEach(([dx, dy], i) => { const gg = x.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, i === 4 ? 9 : 6); gg.addColorStop(0, "#fff"); gg.addColorStop(.3, "#d07aff"); gg.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gg; x.beginPath(); x.arc(cx + dx, cy + dy, i === 4 ? 9 : 6, 0, 7); x.fill(); });
  if (L.chains) { x.strokeStyle = "#e8c870"; x.lineWidth = 2; for (let k = -1; k <= 1; k += 2) for (let i = 0; i < 7; i++) { x.beginPath(); x.ellipse(cx + k * (12 + i * 7), cy - 40 + i * 12, 3, 5, k * .6, 0, 7); x.stroke(); } }
}

/* ---------- hook tokens ---------- */
const _buildCombat0 = buildCombat;
buildCombat = function () {
  _buildCombat0();
  CB.units.forEach(u => { const t = $("#t_" + u.uid); if (!t) return; const d = t.querySelector(".disc"); if (d) { const img = document.createElement("img"); img.className = "mini"; img.alt = ""; img.src = miniSrc(u); d.replaceWith(img); }
    const r = t.querySelector(".ring"); if (r) r.outerHTML = `<svg class="ring" viewBox="0 0 100 40" aria-hidden="true"><ellipse class="trk" cx="50" cy="20" rx="45" ry="15" pathLength="100"/><ellipse class="hp" cx="50" cy="20" rx="45" ry="15" pathLength="100"/></svg>`; });
  placeTokens();
};
const _placeTokens0 = placeTokens;
placeTokens = function () {
  _placeTokens0(); if (!CB) return;
  CB.units.forEach(u => { const t = $("#t_" + u.uid); if (!t) return; const f = Math.max(0, u.hp / u.maxhp); const hp = t.querySelector(".ring .hp"); if (hp) hp.style.strokeDashoffset = 100 * (1 - f);
    t.style.zIndex = 3 + u.y * 2 + (CB.order[CB.ti] === u ? 1 : 0);
    const opp = CB.units.filter(o => o.side !== u.side && alive(o)); if (opp.length) { const n = opp.reduce((a, b) => dist(u, a) <= dist(u, b) ? a : b); if (n.x !== u.x) t.classList.toggle("flip", n.x < u.x); } });
};
/* cover is already part of oddsVs (the old wrapper here counted it twice) */
const _renderCombat0 = renderCombat;
renderCombat = function () {
  _renderCombat0(); if (!CB) return; const u = cur(); const mine = u && u.side === "p" && !CB.busy && !CB.ended;
  CB.units.forEach(o => { const tk = $("#t_" + o.uid); if (!tk) return; const ch = tk.querySelector(".chance"); if (!tk.classList.contains("tg") || !mine) return;
    const cov = coverFor(u, o, {ranged: selSpec(u).r > 1}); if (cov) { ch.innerHTML = `${ch.textContent}<i class="cv">${icon("shield")}+${cov}</i>`; tk.classList.add("cov"); } else tk.classList.remove("cov"); });
  const info = $("#info p.hint"); if (mine && info && CB.sel) { const sp = selSpec(u); if (sp.tgt === "enemy" && sp.r > 1 && foes().some(f => coverOf(u, f))) info.insertAdjacentHTML("beforeend", ` · <span class="covh">${icon("shield")} ${tr(["copertura +2/+5 CA","cover +2/+5 AC","cobertura +2/+5 CA"])}</span>`); }
};
