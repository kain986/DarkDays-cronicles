/* =================== AUDIO: procedural music & sound effects (Web Audio) =================== */
const AU = {ctx: null, mood: null, want: null, bar: 0, step: 0, nextT: 0, timer: null, lastStep: 0};
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
PREF.music = PREF.music ?? .6; PREF.sfx = PREF.sfx ?? .85;

function auInit() {
  if (AU.ctx) return true;
  const C = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext); if (!C) return false;
  const c = AU.ctx = new C();
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .005; comp.release.value = .2; comp.connect(c.destination);
  AU.master = c.createGain(); AU.master.connect(comp);
  AU.mus = c.createGain(); AU.mus.connect(AU.master);
  AU.track = c.createGain(); AU.track.connect(AU.mus);
  AU.sfx = c.createGain(); AU.sfx.connect(AU.master);
  // reverb from synthetic impulse
  const len = c.sampleRate * 3.4, ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  AU.rev = c.createConvolver(); AU.rev.buffer = ir; const rg = c.createGain(); rg.gain.value = .55; AU.rev.connect(rg); rg.connect(AU.master);
  const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; AU.noise = nb;
  auVolumes();
  if (typeof document !== "undefined" && document.addEventListener) document.addEventListener("visibilitychange", () => { if (!AU.ctx) return; document.hidden ? AU.ctx.suspend() : AU.ctx.resume(); });
  return true;
}
function auVolumes() { if (!AU.ctx) return; const t = AU.ctx.currentTime; AU.mus.gain.setTargetAtTime(PREF.music * 1.5, t, .1); AU.sfx.gain.setTargetAtTime(PREF.sfx * .9, t, .05); }
function auUnlock() { if (!auInit()) return; if (AU.ctx.state === "suspended") AU.ctx.resume(); if (AU.want && AU.mood !== AU.want) music(AU.want, true); }
if (typeof document !== "undefined" && document.addEventListener) { document.addEventListener("pointerdown", auUnlock, true); document.addEventListener("keydown", auUnlock, true); }
const auOK = () => AU.ctx && AU.ctx.state === "running";

/* ---------- voices ---------- */
function tone(t, f, dur, o = {}) {
  const c = AU.ctx, osc = c.createOscillator(), g = c.createGain();
  osc.type = o.type || "sine"; osc.frequency.setValueAtTime(f, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + (o.glide || dur)); if (o.det) osc.detune.value = o.det;
  let n = osc;
  if (o.filt) { const fl = c.createBiquadFilter(); fl.type = o.ft || "lowpass"; fl.frequency.setValueAtTime(o.filt, t); if (o.fto) fl.frequency.exponentialRampToValueAtTime(o.fto, t + (o.fdur || dur)); fl.Q.value = o.q || .8; osc.connect(fl); n = fl; }
  n.connect(g); const v = o.vol ?? .2, a = o.att ?? .005;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a);
  if (o.hold) { g.gain.setValueAtTime(v, t + Math.max(a, dur - (o.rel || .3))); g.gain.linearRampToValueAtTime(0.0001, t + dur); }
  else g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(o.dest || AU.sfx); if (o.rev) { const s = c.createGain(); s.gain.value = o.rev; g.connect(s); s.connect(AU.rev); }
  osc.start(t); osc.stop(t + dur + .05);
}
function noise(t, dur, o = {}) {
  const c = AU.ctx, src = c.createBufferSource(), g = c.createGain(), fl = c.createBiquadFilter();
  src.buffer = AU.noise; src.loop = true; src.playbackRate.value = o.rate || 1;
  fl.type = o.ft || "bandpass"; fl.frequency.setValueAtTime(o.f || 1000, t); if (o.fto) fl.frequency.exponentialRampToValueAtTime(o.fto, t + (o.fdur || dur)); fl.Q.value = o.q || 1;
  src.connect(fl); fl.connect(g); const v = o.vol ?? .2, a = o.att ?? .003;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a);
  if (o.hold) { g.gain.setValueAtTime(v, t + dur - (o.rel || .2)); g.gain.linearRampToValueAtTime(0.0001, t + dur); } else g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(o.dest || AU.sfx); if (o.rev) { const s = c.createGain(); s.gain.value = o.rev; g.connect(s); s.connect(AU.rev); }
  src.start(t, Math.random() * 1.5); src.stop(t + dur + .05);
}
function bell(t, f, dur, vol, dest, rev = .6) { [[1, 1], [2.76, .45], [5.4, .22], [8.9, .1]].forEach(([r, a]) => tone(t, f * r, dur / (r > 1 ? r * .6 : 1), {vol: vol * a, dest, rev})); }
function pluck(t, f, dur, vol, dest, rev = .3) { tone(t, f, dur, {type: "triangle", vol, filt: 3200, fto: 600, fdur: dur * .6, dest, rev}); tone(t, f * 2, dur * .4, {type: "sine", vol: vol * .25, dest, rev}); }
function pad(t, f, dur, vol, dest, bright = 900) { [-9, 9].forEach(d => tone(t, f, dur, {type: "sawtooth", det: d, vol: vol * .5, att: Math.min(1.6, dur * .4), hold: 1, rel: Math.min(1.4, dur * .4), filt: bright, q: .5, dest, rev: .7})); }
function brass(t, f, dur, vol, dest) { tone(t, f, dur, {type: "sawtooth", vol, att: .04, hold: 1, rel: .15, filt: 300, fto: 2400, fdur: .12, q: 2, dest, rev: .35}); tone(t, f * 1.005, dur, {type: "sawtooth", vol: vol * .6, att: .05, hold: 1, rel: .15, filt: 1400, dest}); }
function kick(t, vol, dest) { tone(t, 120, .35, {to: 38, glide: .18, vol, dest}); noise(t, .03, {f: 2000, vol: vol * .2, dest}); }
function snare(t, vol, dest) { noise(t, .18, {ft: "highpass", f: 1400, vol, dest, rev: .25}); tone(t, 210, .08, {type: "triangle", vol: vol * .5, dest}); }
function tom(t, f, vol, dest) { tone(t, f, .4, {to: f * .55, glide: .3, vol, dest, rev: .3}); }
function hat(t, vol, dest) { noise(t, .04, {ft: "highpass", f: 7000, vol, dest}); }

/* ---------- music ---------- */
const SCALES = {aeo: [0, 2, 3, 5, 7, 8, 10], dor: [0, 2, 3, 5, 7, 9, 10], phr: [0, 1, 3, 5, 7, 8, 10], maj: [0, 2, 4, 5, 7, 9, 11], loc: [0, 1, 3, 5, 6, 8, 10]};
const chord = (root, scale, deg) => [0, 2, 4].map(k => { const i = deg + k; return root + scale[i % 7] + 12 * Math.floor(i / 7); });
let MRNG = 1; const mr = () => (MRNG = (MRNG * 16807) % 2147483647) / 2147483647;
const TRACKS = {
  title: {bpm: 54, root: 50, sc: "aeo", prog: [0, 5, 2, 6], bar(t, b, B, d, cs) {
    pad(t, mtof(cs[0] - 12), B, .09, d, 700); pad(t, mtof(cs[1]), B, .06, d, 900); pad(t, mtof(cs[2]), B, .05, d, 900);
    tone(t, mtof(cs[0] - 24), B, {type: "sine", vol: .16, att: 1, hold: 1, rel: 1, dest: d});
    for (let i = 0; i < 4; i++) if (mr() < .45) bell(t + i * B / 4 + mr() * .1, mtof(cs[Math.floor(mr() * 3)] + 24), 3.5, .05, d, .9); }},
  town: {bpm: 84, root: 57, sc: "dor", prog: [0, 3, 0, 6], bar(t, b, B, d, cs) {
    const e = B / 8, pat = [0, 1, 2, 1, 0, 2, 1, 2];
    pat.forEach((k, i) => pluck(t + i * e, mtof(cs[k] + (i > 3 ? 12 : 0)), .9, .07, d));
    tone(t, mtof(cs[0] - 24), B * .48, {type: "triangle", vol: .13, filt: 500, dest: d}); tone(t + B / 2, mtof(cs[2] - 24), B * .48, {type: "triangle", vol: .11, filt: 500, dest: d});
    pad(t, mtof(cs[1]), B, .03, d, 1100);
    [0, 3, 4, 6].forEach(i => tom(t + i * e, i ? 160 : 110, .06, d));
    if (b % 2 === 1) for (let i = 0; i < 3; i++) if (mr() < .5) pluck(t + (4 + i) * e, mtof(cs[Math.floor(mr() * 3)] + 24), .6, .045, d, .5); }},
  wild: {bpm: 60, root: 52, sc: "phr", prog: [0, 1, 0, 6], bar(t, b, B, d, cs) {
    tone(t, mtof(40), B, {type: "sawtooth", vol: .06, att: 1.5, hold: 1, rel: 1.2, filt: 220, dest: d}); tone(t, mtof(28), B, {type: "sine", vol: .14, att: 1.5, hold: 1, rel: 1.2, dest: d});
    pad(t, mtof(cs[1]), B, .045, d, 600); pad(t, mtof(cs[2] + 12), B, .02, d, 1200);
    if (mr() < .5) noise(t + mr() * B * .5, B * .7, {ft: "bandpass", f: 500, fto: 1400, q: 3, vol: .035, att: 1.2, hold: 1, rel: 1.2, dest: d, rev: .5});
    for (let i = 0; i < 2; i++) if (mr() < .4) tone(t + mr() * B, mtof(cs[Math.floor(mr() * 3)] + 24), 2.6, {vol: .035, det: (mr() - .5) * 30, rev: .9, dest: d}); }},
  camp: {bpm: 66, root: 55, sc: "aeo", prog: [0, 5, 2, 6], bar(t, b, B, d, cs) {
    const q = B / 4; [0, 1, 2, 1].forEach((k, i) => pluck(t + i * q, mtof(cs[k]), 1.6, .07, d, .45));
    if (b % 2) pluck(t + 2.5 * q, mtof(cs[2] + 12), 1.2, .04, d, .6);
    tone(t, mtof(cs[0] - 24), B, {type: "triangle", vol: .1, att: .3, hold: 1, rel: .6, filt: 400, dest: d}); pad(t, mtof(cs[0]), B, .03, d, 800);
    for (let i = 0; i < 6; i++) if (mr() < .6) noise(t + mr() * B, .015, {ft: "highpass", f: 3000, vol: .03 + mr() * .03, dest: d}); }},
  dread: {bpm: 50, root: 49, sc: "loc", prog: [0, 1, 0, 4], bar(t, b, B, d, cs) {
    tone(t, mtof(25), B, {type: "sawtooth", vol: .07, att: 2, hold: 1, rel: 1.5, filt: 160, dest: d}); tone(t, mtof(31), B, {type: "sawtooth", vol: .04, att: 2, hold: 1, rel: 1.5, filt: 180, dest: d});
    pad(t, mtof(cs[0]), B, .04, d, 500); pad(t, mtof(cs[0] + 6), B, .025, d, 500);
    kick(t, .16, d); kick(t + .28, .1, d); kick(t + B / 2, .14, d); kick(t + B / 2 + .28, .08, d);
    if (mr() < .55) bell(t + B * (.3 + mr() * .5), mtof(cs[Math.floor(mr() * 3)] + 12 + (mr() < .3 ? 1 : 0)), 4, .04, d, .9);
    if (b % 4 === 3) noise(t, B, {ft: "bandpass", f: 300, fto: 900, q: 6, vol: .04, att: B * .7, hold: 1, rel: .5, dest: d, rev: .7}); }},
  battle: {bpm: 132, root: 50, sc: "aeo", prog: [0, 5, 6, 0, 0, 5, 3, 4], bar(t, b, B, d, cs) {
    const e = B / 8, low = cs[0] - 24, fifth = low + 7;
    [low, low, fifth, low, low + 12, low, fifth, low + 10].forEach((m, i) => tone(t + i * e, mtof(m), e * .9, {type: "sawtooth", vol: .085, filt: 900, fto: 300, fdur: e, q: 2, dest: d}));
    tone(t, mtof(cs[0] - 36), B, {type: "sine", vol: .1, att: .02, hold: 1, rel: .2, dest: d});
    kick(t, .24, d); kick(t + 3 * e, .14, d); kick(t + 4 * e, .22, d); if (b % 2) kick(t + 7 * e, .12, d);
    snare(t + 2 * e, .12, d); snare(t + 6 * e, .12, d);
    for (let i = 0; i < 8; i++) hat(t + i * e, i % 2 ? .02 : .035, d);
    if (b % 2 === 0) cs.forEach(m => brass(t, mtof(m), e * 2.6, .045, d));
    if (b % 4 === 3) [5, 6, 7].forEach((i, k) => tom(t + i * e, 200 - k * 40, .14, d));
    if (b % 8 >= 4) { const mel = [cs[2] + 12, cs[1] + 12, cs[0] + 12, cs[1] + 12]; mel.forEach((m, i) => tone(t + i * B / 4, mtof(m), B / 4 * .95, {type: "square", vol: .03, filt: 1800, att: .02, hold: 1, rel: .08, dest: d, rev: .3})); } }},
  boss: {bpm: 144, root: 48, sc: "phr", prog: [0, 1, 0, 6, 0, 1, 5, 4], bar(t, b, B, d, cs) {
    const e = B / 8, low = cs[0] - 24;
    [0, 0, 1, 0, 0, 6, 0, 1].forEach((k, i) => tone(t + i * e, mtof(low + (k === 1 ? 1 : k === 6 ? 6 : 0)), e * .9, {type: "sawtooth", vol: .09, filt: 700, fto: 250, fdur: e, q: 3, dest: d}));
    tone(t, mtof(cs[0] - 36), B, {type: "sine", vol: .12, att: .02, hold: 1, rel: .2, dest: d});
    for (let i = 0; i < 8; i++) if (i % 2 === 0 || i === 3 || i === 7) kick(t + i * e, i % 4 === 0 ? .24 : .14, d);
    snare(t + 2 * e, .13, d); snare(t + 6 * e, .13, d); for (let i = 0; i < 8; i++) hat(t + i * e, .025, d);
    cs.forEach(m => brass(t, mtof(m - 12), e * 3, .045, d)); if (b % 2) brass(t + 4 * e, mtof(cs[0] - 6), e * 2, .04, d);
    pad(t, mtof(cs[0] + 12), B, .03, d, 1800); pad(t, mtof(cs[2] + 12), B, .025, d, 1800);
    if (b % 4 === 3) for (let i = 0; i < 4; i++) tom(t + (4 + i) * e, 220 - i * 35, .16, d); }},
  dawn: {bpm: 72, root: 50, sc: "maj", prog: [0, 4, 5, 3], bar(t, b, B, d, cs) {
    pad(t, mtof(cs[0]), B, .06, d, 1600); pad(t, mtof(cs[1]), B, .05, d, 1600); pad(t, mtof(cs[2]), B, .05, d, 1600);
    tone(t, mtof(cs[0] - 24), B, {type: "triangle", vol: .12, att: .6, hold: 1, rel: .6, filt: 600, dest: d});
    [0, 1, 2, 1, 2, 3].forEach((k, i) => bell(t + i * B / 6, mtof((k === 3 ? cs[0] + 12 : cs[k]) + 12), 2.5, .04, d, .8)); }},
};
const MOOD_OF = {road: "wild", graveyard: "wild", forest: "wild", hut: "wild", bridge: "wild", mill: "wild", sewer: "wild", drowned: "wild", mountain: "wild",
  village: "town", inn: "town", tavern2: "town", shrine: "camp", city: "town", palace: "town", archive: "camp", crypt: "dread",
  camp: "camp", cultcamp: "dread", stones: "dread", tower: "dread", bell: "dread", fortress: "dread", mirror: "dread", dungeon: "dread", throne: "dread",
  dawn: "dawn", twilight: "camp", dark: "dread", title: "title"};
function music(mood, force) {
  AU.want = mood; if (!auOK()) return; if (AU.mood === mood && !force) return;
  const c = AU.ctx, t = c.currentTime, old = AU.track;
  old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(old.gain.value, t); old.gain.linearRampToValueAtTime(0.0001, t + 1.4);
  setTimeout(() => { try { old.disconnect(); } catch (e) {} }, 1600);
  const lvl = ({town: 1.7, dread: 1.6, camp: 1.3, battle: 1.15, boss: .75, wild: 1.2})[mood] || 1;
  AU.track = c.createGain(); AU.track.gain.setValueAtTime(0.0001, t); AU.track.gain.linearRampToValueAtTime(lvl, t + 1.8); AU.track.connect(AU.mus);
  AU.mood = mood; AU.bar = 0; AU.nextT = t + .15; MRNG = mood ? hashStr(mood) : 7;
  if (!AU.timer) AU.timer = setInterval(schedule, 120);
}
function schedule() {
  if (!auOK() || !AU.mood) return; const tr0 = TRACKS[AU.mood]; if (!tr0) return;
  const B = 240 / tr0.bpm, c = AU.ctx;
  if (AU.nextT < c.currentTime - B) AU.nextT = c.currentTime + .05;
  while (AU.nextT < c.currentTime + .6) {
    const deg = tr0.prog[AU.bar % tr0.prog.length], cs = chord(tr0.root, SCALES[tr0.sc], deg);
    try { tr0.bar(AU.nextT, AU.bar, B, AU.track, cs); } catch (e) { console.error(e); }
    AU.nextT += B; AU.bar++;
  }
}

/* ---------- sound effects ---------- */
const SFX = {
  ui() { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, 1250, .05, {type: "triangle", vol: .05}); tone(t + .018, 1880, .04, {vol: .025}); },
  page() { if (!auOK()) return; const t = AU.ctx.currentTime; noise(t, .16, {f: 2400, fto: 900, q: .8, vol: .06, att: .03}); tone(t, 520, .12, {type: "triangle", vol: .03, rev: .2}); },
  dice() { if (!auOK()) return; const t = AU.ctx.currentTime; for (let i = 0; i < 9; i++) { const k = t + i * .075 + Math.random() * .03; noise(k, .03, {ft: "bandpass", f: 2500 + Math.random() * 2500, q: 4, vol: .1 * (1 - i / 12)}); tone(k, 700 + Math.random() * 500, .03, {type: "square", vol: .015, filt: 2000}); } },
  success(nat) { if (!auOK()) return; const t = AU.ctx.currentTime; [72, 76, 79, nat ? 84 : 0].forEach((m, i) => m && bell(t + i * .09, mtof(m), 1.6, .07)); if (nat) noise(t, 1.2, {ft: "highpass", f: 6000, vol: .03, att: .3, rev: .8}); },
  failure(nat) { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, mtof(nat ? 45 : 52), .7, {type: "sawtooth", vol: .06, filt: 600, rev: .5}); tone(t + .18, mtof(nat ? 44 : 51), 1, {type: "sawtooth", vol: .06, filt: 500, rev: .5}); },
  swing() { if (!auOK()) return; const t = AU.ctx.currentTime; noise(t, .16, {f: 600, fto: 3200, fdur: .12, q: 1.4, vol: .14, att: .03}); },
  bow() { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, 330, .12, {type: "triangle", to: 180, vol: .1}); noise(t + .02, .24, {f: 1800, fto: 4500, q: 2, vol: .06, att: .05}); },
  cast(type) { if (!auOK()) return; const t = AU.ctx.currentTime;
    if (type === "fire") { noise(t, .5, {ft: "lowpass", f: 400, fto: 2600, fdur: .3, vol: .16, att: .05, rev: .3}); tone(t, 90, .5, {type: "sawtooth", vol: .05, filt: 300}); }
    else if (type === "cold") for (let i = 0; i < 6; i++) tone(t + i * .04, 2200 + Math.random() * 1800, .25, {vol: .03, rev: .7});
    else if (type === "radiant") [76, 83, 88].forEach((m, i) => bell(t + i * .04, mtof(m), 1.2, .045));
    else if (type === "necrotic") { tone(t, 180, .6, {type: "sawtooth", to: 55, vol: .07, filt: 600, rev: .5}); noise(t, .6, {f: 300, q: 3, vol: .06, att: .1}); }
    else if (type === "force") for (let i = 0; i < 3; i++) tone(t + i * .07, 1500, .12, {type: "square", to: 300, vol: .04, filt: 3000, rev: .3});
    else if (type === "sleep") [79, 76, 72].forEach((m, i) => tone(t + i * .16, mtof(m), .9, {vol: .05, rev: .8}));
    else tone(t, 600, .3, {to: 1200, vol: .05, rev: .4}); },
  hit(type, crit) { if (!auOK()) return; const t = AU.ctx.currentTime;
    if (type === "blunt") { tone(t, 140, .2, {to: 48, vol: .26}); noise(t, .12, {ft: "lowpass", f: 900, vol: .14}); }
    else if (type === "slash" || type === "pierce") { noise(t, .1, {f: 3000, q: 1.2, vol: .16}); tone(t, 140, .14, {to: 60, vol: .18}); tone(t, 1750 + Math.random() * 400, .18, {type: "square", vol: .018, filt: 4000}); }
    else if (type === "fire") { noise(t, .35, {ft: "lowpass", f: 2400, fto: 300, vol: .16}); tone(t, 90, .3, {to: 40, vol: .16}); }
    else if (type === "necrotic") { tone(t, 110, .4, {type: "sawtooth", to: 40, vol: .1, filt: 400}); noise(t, .3, {f: 400, q: 2, vol: .08}); }
    else if (type === "radiant") { bell(t, mtof(88), .8, .05); noise(t, .2, {ft: "highpass", f: 5000, vol: .05}); }
    else if (type === "cold") { noise(t, .25, {ft: "highpass", f: 4500, vol: .1}); tone(t, 2600, .3, {vol: .03}); }
    else { tone(t, 900, .15, {type: "square", to: 200, vol: .05, filt: 2500}); tone(t, 120, .15, {to: 50, vol: .14}); }
    if (crit) { tone(t, 60, .5, {to: 30, vol: .3}); noise(t, .4, {ft: "lowpass", f: 1500, vol: .12, rev: .5}); bell(t + .05, mtof(91), .9, .04); } },
  miss() { if (!auOK()) return; const t = AU.ctx.currentTime; noise(t, .2, {f: 900, fto: 2200, q: 1, vol: .07, att: .04}); },
  boom(type) { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, 95, .9, {to: 28, glide: .6, vol: .4}); noise(t, 1.2, {ft: "lowpass", f: type === "cold" ? 5000 : 1800, fto: 200, fdur: 1, vol: .24, rev: .6}); if (type === "radiant") [72, 79, 84].forEach(m => bell(t, mtof(m), 2, .05)); if (type === "sleep") SFX.cast("sleep"); },
  heal() { if (!auOK()) return; const t = AU.ctx.currentTime; [67, 71, 74, 79].forEach((m, i) => tone(t + i * .07, mtof(m), .8, {vol: .045, rev: .7})); noise(t, .6, {ft: "highpass", f: 6000, vol: .02, att: .2, rev: .6}); },
  death(foe) { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, foe ? 260 : 330, .7, {type: "sawtooth", to: foe ? 55 : 110, vol: .07, filt: 900, rev: .5}); noise(t, .5, {ft: "lowpass", f: 700, vol: .08, att: .05}); },
  step() { if (!auOK()) return; const now = AU.ctx.currentTime; if (now - AU.lastStep < .09) return; AU.lastStep = now; noise(now, .05, {ft: "lowpass", f: 500 + Math.random() * 200, vol: .07}); },
  turn(side) { if (!auOK()) return; const t = AU.ctx.currentTime; if (side === "e") { tone(t, 98, 1.4, {vol: .09, rev: .7}); tone(t, 98 * 2.4, 1, {vol: .025, rev: .7}); } else bell(t, mtof(79), 1.2, .035); },
  victory() { if (!auOK()) return; const t = AU.ctx.currentTime; [62, 66, 69, 74].forEach((m, i) => brass(t + i * .14, mtof(m), .3, .07, AU.sfx)); [62, 66, 69, 74].forEach(m => brass(t + .6, mtof(m), 1.6, .05, AU.sfx)); kick(t + .6, .3, AU.sfx); },
  defeat() { if (!auOK()) return; const t = AU.ctx.currentTime; [50, 53, 57].forEach(m => tone(t, mtof(m - 12), 3, {type: "sawtooth", vol: .05, att: .4, filt: 500, fto: 150, fdur: 3, rev: .7})); tone(t, 55, 3, {vol: .2}); },
  levelup() { if (!auOK()) return; const t = AU.ctx.currentTime; [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => bell(t + i * .07, mtof(m), 1.4, .045)); noise(t + .4, 1.4, {ft: "highpass", f: 5000, vol: .03, att: .3, rev: .8}); },
  coin() { if (!auOK()) return; const t = AU.ctx.currentTime; tone(t, 2100, .25, {type: "square", vol: .025, filt: 5000}); tone(t + .07, 2800, .35, {type: "square", vol: .022, filt: 5000, rev: .3}); },
  join() { if (!auOK()) return; const t = AU.ctx.currentTime; [62, 69, 74].forEach((m, i) => bell(t + i * .12, mtof(m), 2, .05)); },
};

/* ---------- hooks into game flow ---------- */
(function hook() {
  const wrap = (f, before, after) => { const g = function (...a) { if (before) before(...a); const r = f.apply(this, a); if (after) after(r, ...a); return r; }; return g; };
  fxAttackAnim = wrap(fxAttackAnim, (a, t, o) => { const ty = o.type || "slash"; if (["pierce", "slash", "blunt"].includes(ty)) (o.ranged ? SFX.bow() : SFX.swing()); else SFX.cast(ty); });
  fxImpact = wrap(fxImpact, (t, ty, crit) => SFX.hit(ty, crit));
  fxMiss = wrap(fxMiss, () => SFX.miss());
  fxDeath = wrap(fxDeath, (t, small) => SFX.death(!small));
  fxHeal = wrap(fxHeal, (t, col) => { if (!col) SFX.heal(); else SFX.cast("radiant"); });
  fxArea = wrap(fxArea, (c, rad, ty) => { if (ty === "sleep") SFX.cast("sleep"); else if (rad >= 1) SFX.boom(ty); else SFX.hit(ty); });
  fxColumn = wrap(fxColumn, (t, ty) => SFX.cast(ty));
  fxPoof = wrap(fxPoof, () => SFX.cast("force"));
  fxDust = wrap(fxDust, () => SFX.step());
  turnBanner = wrap(turnBanner, u => SFX.turn(u.side));
  winCombat = wrap(winCombat, () => { SFX.victory(); music(null); });
  loseCombat = wrap(loseCombat, () => { SFX.defeat(); music(null); });
  showLevelUp = wrap(showLevelUp, () => SFX.levelup());
  join = wrap(join, (id) => { if (!inP(id)) SFX.join(); });
  gold = wrap(gold, (n) => { if (n > 0) SFX.coin(); });
  openMenu = wrap(openMenu, () => SFX.ui());
  openShop = wrap(openShop, () => SFX.ui());
  choose = wrap(choose, () => SFX.page());
  const _doCheck = doCheck;
  doCheck = function (spec) { SFX.dice(); setTimeout(() => { const r = $("#dres"); if (r) (r.classList.contains("ok") ? SFX.success(!!r.querySelector("small")) : SFX.failure(!!r.querySelector("small"))); }, 930); return _doCheck(spec); };
  onSlot = wrap(onSlot, () => SFX.ui());
  const _startCombat = startCombat;
  startCombat = function (key, win, sur) { const r = _startCombat(key, win, sur); music(ENC[key].foes.some(f => FOES[f].boss) ? "boss" : "battle"); return r; };
  const _renderStory = renderStory;
  renderStory = function () { _renderStory(); const sc = SC[S.scene]; music(MOOD_OF[sc.bg] || "wild"); addSoundBtn("#story .hud", "#menuBtn"); };
  const _renderTitle = renderTitle;
  renderTitle = function () { _renderTitle(); music("title"); const ti = $("#title"); ti.insertAdjacentHTML("beforeend", `<button class="iconbtn sndbtn" id="sndT" aria-label="Audio">${icon(PREF.music + PREF.sfx > 0 ? "note" : "mute")}</button>`); $("#sndT").onclick = toggleMute; };
})();
Object.assign(ICONS, {note: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', mute: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M23 9l-6 6M17 9l6 6"/>'});
function addSoundBtn(bar, before) { const h = $(bar), m = $(before); if (!h || !m || $("#sndS")) return; m.insertAdjacentHTML("beforebegin", `<button class="iconbtn" id="sndS" aria-label="Audio">${icon(PREF.music + PREF.sfx > 0 ? "note" : "mute")}</button>`); $("#sndS").onclick = toggleMute; }
function toggleMute() {
  auUnlock();
  if (PREF.music + PREF.sfx > 0) { PREF._m = PREF.music; PREF._s = PREF.sfx; PREF.music = 0; PREF.sfx = 0; }
  else { PREF.music = PREF._m || .6; PREF.sfx = PREF._s || .85; }
  store(PREF_KEY, PREF); auVolumes();
  document.querySelectorAll("#sndT,#sndS").forEach(b => b.innerHTML = icon(PREF.music + PREF.sfx > 0 ? "note" : "mute"));
}
function audioOptsHTML() {
  return `<h3>${tr(["Audio","Audio","Audio"])}</h3>
  <label class="vol"><span>${tr(["Musica","Music","Música"])}</span><input type="range" id="volM" min="0" max="100" value="${Math.round(PREF.music * 100)}"></label>
  <label class="vol"><span>${tr(["Effetti","Effects","Efectos"])}</span><input type="range" id="volS" min="0" max="100" value="${Math.round(PREF.sfx * 100)}"></label>`;
}
function bindAudioOpts(m) {
  const vm = m.querySelector("#volM"), vs = m.querySelector("#volS"); if (!vm) return;
  vm.oninput = () => { auUnlock(); PREF.music = vm.value / 100; auVolumes(); store(PREF_KEY, PREF); };
  vs.oninput = () => { auUnlock(); PREF.sfx = vs.value / 100; auVolumes(); store(PREF_KEY, PREF); };
  vs.onchange = () => SFX.hit("slash");
}
