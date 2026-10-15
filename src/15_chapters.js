/* =================== CHAPTERS =================== */
// The story is split into chapters. Each chapter lives in src/chapters/<id>_<name>/ and registers
// itself with defineChapter(). Party, items, level and story flags carry over from one chapter to
// the next, so a later chapter can react to earlier choices (e.g. has("doran_ally")).
const SC = {};
const cat = (...parts) => { const p = parts.filter(Boolean); return [0,1,2].map(i => p.map(x => x[i]).join("\n\n")); };
const CHAPTERS = [];
function defineChapter(c) { if (CHAPTERS.some(x => x.id === c.id)) throw new Error("duplicate chapter " + c.id); CHAPTERS.push(c); return c; }
const chapterById = id => CHAPTERS.find(c => c.id === id) || CHAPTERS[0];
const chapterOf = s => chapterById((s && s.chapter) || "ch1");
function nextChapter(id) { const i = CHAPTERS.findIndex(c => c.id === id); return i >= 0 ? CHAPTERS[i + 1] || null : null; }
const chapterName = c => `${tr(c.num)} — ${tr(c.title)}`;
// Shown when a chapter is finished and the next one has not been released yet.
SC.ch_wait = {bg:"dawn", loc:["Fine del capitolo","End of chapter","Fin del capítulo"],
  t:()=>{ const c = chapterOf(S); return cat(
    ["Il tuo viaggio non finisce qui.","Your journey doesn't end here.","Tu viaje no termina aquí."],
    [`Hai completato ${tr(c.num)} — ${tr(c.title)}. La partita è conservata con il gruppo, gli oggetti e tutte le scelte che hai fatto: quando un aggiornamento porterà il capitolo successivo, potrai riprenderla da qui.`,
     `You have completed ${tr(c.num)} — ${tr(c.title)}. Your game is kept with your party, items and every choice you made: when an update brings the next chapter, you can resume from here.`,
     `Has completado ${tr(c.num)} — ${tr(c.title)}. La partida se conserva con tu grupo, los objetos y todas tus decisiones: cuando una actualización traiga el siguiente capítulo, podrás continuar desde aquí.`]); },
  ch:[{t:["Torna al titolo","Back to title","Volver al título"], toTitle:1}]};
