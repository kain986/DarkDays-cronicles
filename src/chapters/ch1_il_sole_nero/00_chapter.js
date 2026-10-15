/* =================== CHAPTER I — THE BLACK SUN =================== */
// Registry entry for this chapter. A future chapter adds its own folder under src/chapters/
// with the same structure: 00_chapter.js (defineChapter + start scene) and the act files.
defineChapter({
  id: "ch1",
  num: ["Capitolo I", "Chapter I", "Capítulo I"],
  title: ["Il Sole Nero", "The Black Sun", "El Sol Negro"],
  blurb: ["Quaranta giorni senza alba. Un marchio sulla tua mano, una madre che piange i suoi figli, una città che dimentica. Tre atti, dal villaggio di Ashford alla Corona di Cenere.",
          "Forty days without a dawn. A mark on your hand, a mother mourning her children, a city that forgets. Three acts, from the village of Ashford to the Crown of Ash.",
          "Cuarenta días sin amanecer. Una marca en tu mano, una madre que llora a sus hijos, una ciudad que olvida. Tres actos, de la aldea de Ashford a la Corona de Ceniza."],
  start: "ch1_start",
  maxLevel: 7,
  endings: {end_dawn: ["L'Alba", "The Dawn", "El Alba"], end_twilight: ["Il Crepuscolo libero", "The Free Twilight", "El Crepúsculo libre"], end_dark: ["Il Re di Cenere", "The Ash King", "El Rey de Ceniza"]},
});
SC.ch1_start = {bg:"road", loc:["Valtenebra","Valtenebra","Valtenebra"],
  t:["CAPITOLO I — IL SOLE NERO\n\nNelle cronache di Valtenebra quei giorni non hanno un nome. Chi li ha vissuti li chiama soltanto i giorni bui.",
     "CHAPTER I — THE BLACK SUN\n\nIn the chronicles of Valtenebra those days have no name. Those who lived through them simply call them the dark days.",
     "CAPÍTULO I — EL SOL NEGRO\n\nEn las crónicas de Valtenebra esos días no tienen nombre. Quienes los vivieron los llaman simplemente los días oscuros."],
  ch:[{t:["Comincia","Begin","Comenzar"], go:"a1_intro"}]};
