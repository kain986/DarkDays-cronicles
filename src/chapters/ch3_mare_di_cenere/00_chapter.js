/* =================== CHAPTER III — THE SEA OF ASH =================== */
defineChapter({
  id: "ch3",
  num: ["Capitolo III", "Chapter III", "Capítulo III"],
  title: ["Il Mare di Cenere", "The Sea of Ash", "El Mar de Ceniza"],
  blurb: ["Il cuore di Morrhan è fuggito a sud, dove un faro nero si è acceso da solo sul Mare di Cenere. A Saltgrave la gente si sveglia con bocche nuove sulla pelle. Oltre il mare, la Forgia di Aurel aspetta qualcuno che sappia riforgiare la Chiave.",
          "Morrhan's heart has fled south, where a black lighthouse lit itself over the Sea of Ash. In Saltgrave people wake with new mouths on their skin. Beyond the sea, the Forge of Aurel waits for someone who can reforge the Key.",
          "El corazón de Morrhan ha huido al sur, donde un faro negro se encendió solo sobre el Mar de Ceniza. En Saltgrave la gente despierta con bocas nuevas en la piel. Más allá del mar, la Forja de Aurel espera a alguien capaz de reforjar la Llave."],
  start: "ch3_start",
  maxLevel: 26,
  endings: {ch3_end_harbor: ["Il porto in fiamme", "The Burning Harbour", "El puerto en llamas"], ch3_end_sea: ["L'ultima rotta di Iskra", "Iskra's Last Course", "El último rumbo de Iskra"]},
});
const LOC3 = {
  road: ["La Via del Sale", "The Salt Road", "La Vía de la Sal"],
  port: ["Saltgrave", "Saltgrave", "Saltgrave"],
  docks: ["I moli dei Naufragatori", "The Wreckers' docks", "Los muelles de los Náufragos"],
  chapel: ["La cappella della marea", "The tide chapel", "La capilla de la marea"],
  ship: ["La «Vedova Grigia»", "The “Grey Widow”", "La «Viuda Gris»"],
  sea: ["Il Mare di Cenere", "The Sea of Ash", "El Mar de Ceniza"],
  forge: ["La Forgia di Aurel", "The Forge of Aurel", "La Forja de Aurel"],
  light: ["Il Faro Nero", "The Black Lighthouse", "El Faro Negro"],
};

/* ---------- foes ---------- */
mkFoe("wrecker", {n: ["Naufragatore", "Wrecker", "Náufrago"], lv: 17, role: "soldier", ic: "sword", an: ["Sciabola", "Cutlass", "Alfanje"]});
mkFoe("wrecker_gun", {n: ["Balestriere dei moli", "Dock crossbowman", "Ballestero de los muelles"], lv: 17, role: "archer", ic: "bow", an: ["Quadrello", "Bolt", "Virote"]});
mkFoe("mouthborn", {n: ["Bocca aperta", "Mouthborn", "Boca abierta"], lv: 18, role: "brute", ic: "fang", an: ["Morsi", "Bites", "Mordiscos"], vuln: "radiant"});
mkFoe("drownpriest", {n: ["Sacerdote annegato", "Drowned priest", "Sacerdote ahogado"], lv: 19, role: "caster", ic: "drop", st: "cold", sn: ["Acqua nera", "Black water", "Agua negra"], an2: ["Marea", "Tide", "Marea"]});
mkFoe("highpriest", {n: ["La Voce della Marea", "The Voice of the Tide", "La Voz de la Marea"], lv: 20, role: "leader", ic: "crown", st: "cold", hpm: 1.2, sn: ["Acqua nera", "Black water", "Agua negra"]});
mkFoe("eel", {n: ["Anguilla di cenere", "Ash eel", "Anguila de ceniza"], lv: 20, role: "elite", ic: "fang", an: ["Fauci", "Jaws", "Fauces"], spd: 8});
mkFoe("ghostsailor", {n: ["Marinaio cavo", "Hollow sailor", "Marinero hueco"], lv: 21, role: "soldier", ic: "skull", undead: 1, vuln: "radiant", an: ["Arpione", "Harpoon", "Arpón"], reach: 2});
mkFoe("admiral", {n: ["L'Ammiraglio Cavo", "The Hollow Admiral", "El Almirante Hueco"], lv: 22, role: "leader", ic: "crown", undead: 1, hpm: 1.1, an: ["Sciabola d'ossa", "Bone sabre", "Sable de hueso"], st: "cold"});
mkFoe("bronze", {n: ["Custode di bronzo", "Bronze warden", "Guardián de bronce"], lv: 23, role: "elite", ic: "helm", construct: 1, an: ["Pugni di bronzo", "Bronze fists", "Puños de bronce"], t: "blunt", acm: 2});
mkFoe("heartspawn", {n: ["Figlio del cuore", "Heartspawn", "Hijo del corazón"], lv: 24, role: "brute", ic: "heart", an: ["Artigli", "Claws", "Garras"], drain: 1});
mkFoe("vashka", {n: ["Vashka, la Fame che cammina", "Vashka, the Walking Hunger", "Vashka, el Hambre que camina"], lv: 25, role: "boss", ic: "fang", an: ["Mille denti", "A thousand teeth", "Mil dientes"], sn: ["Ingoiare", "Swallow", "Tragar"], drain: 1});
mkObj("tide_altar", ["Altare della marea", "Tide altar", "Altar de la marea"], 70, 14, "drop", {vuln: "fire"});
mkObj("black_flame", ["Fiamma nera", "Black flame", "Llama negra"], 90, 15, "flame", {vuln: "cold"});

/* ---------- encounters ---------- */
Object.assign(ENC, {
  docks: {map: "city", foes: ["wrecker", "wrecker", "wrecker", "wrecker", "wrecker_gun", "wrecker_gun"], gold: 300},
  mouths: {map: "ruins", foes: ["mouthborn", "mouthborn", "mouthborn", "mouthborn", "drownpriest"], gold: 250},
  tide_rite: {lead: "highpriest", map: "water", foes: ["highpriest", "drownpriest", "mouthborn", "mouthborn"], gold: 400,
    objs: [["tide_altar", 3, 1]], ritual: {rounds: 5, by: "tide_altar", spawn: ["eel"], bark: ["L'altare canta. Dall'acqua nera sale qualcosa con troppi denti.", "The altar sings. Out of the black water rises something with too many teeth.", "El altar canta. Del agua negra sube algo con demasiados dientes."]},
    tele: {foe: "highpriest", every: 2, shape: "row", dmg: "8d8", type: "cold", n: ["Onda di cenere", "Ash wave", "Ola de ceniza"], bark: ["«Che la marea vi prenda!»", "“Let the tide take you!”", "«¡Que la marea os lleve!»"]}, tac: 1},
  eel_attack: {map: "ship", foes: ["eel", "eel", "wrecker"], gold: 250},
  ghostship: {lead: "admiral", map: "ship", foes: ["admiral", "ghostsailor", "ghostsailor", "ghostsailor"], gold: 500,
    reinf: [{r: 3, foes: ["ghostsailor"], bark: ["Dalla stiva della nave fantasma salgono altri marinai, con l'acqua che gli cola dagli occhi.", "From the ghost ship's hold more sailors climb, water running from their eyes.", "De la bodega del barco fantasma suben más marineros, con agua chorreándoles de los ojos."]}], tac: 1},
  forge_trial: {map: "dungeon", foes: ["bronze", "bronze"], gold: 300},
  heartspawn: {map: "maw", foes: ["heartspawn", "heartspawn", "heartspawn", "heartspawn", "drownpriest"], gold: 400},
  vashka: {map: "maw", foes: ["vashka", "heartspawn"], gold: 900,
    objs: [["black_flame", 0, 2], ["black_flame", 6, 2]], ward: {foe: "vashka", by: "black_flame", heal: 20},
    tele: {foe: "vashka", every: 2, shape: "burst", rad: 1, cnt: 3, dmg: "8d8", type: "necrotic", n: ["Fauci del faro", "Maw of the lighthouse", "Fauces del faro"], bark: ["«Aprite la bocca. Tutti. Aprite.»", "“Open your mouths. All of you. Open.”", "«Abrid la boca. Todos. Abrid.»"]},
    phase: {foe: "vashka", at: .5, spawn: ["heartspawn", "heartspawn"], bark: ["Vashka si squarcia il ventre con le mani: ne escono altri figli del cuore.", "Vashka tears its own belly open with its hands: more heartspawn spill out.", "Vashka se desgarra el vientre con las manos: salen más hijos del corazón."]}, tac: 1},
});
Object.assign(SAGA_LEADS, {
  tide_rite: {
    start: ["«Il cuore ha sete. Saltgrave è un calice.»", "“The heart is thirsty. Saltgrave is a chalice.”", "«El corazón tiene sed. Saltgrave es un cáliz.»"],
    rally: [["«La Voce canta, noi rispondiamo!»", "“The Voice sings, we answer!”", "«¡La Voz canta, nosotros respondemos!»"], ["«Finché la Voce parla, l'acqua è nostra.»", "“While the Voice speaks, the water is ours.”", "«Mientras la Voz hable, el agua es nuestra.»"], ["«Se tace la Voce, il mare ci riprende…»", "“If the Voice falls silent, the sea takes us back…”", "«Si calla la Voz, el mar nos reclama…»"]],
    hurt: ["La Voce gorgoglia, l'acqua le esce dalla bocca invece delle parole.", "The Voice gurgles; water comes out of its mouth instead of words.", "La Voz gorgotea; le sale agua por la boca en lugar de palabras."],
    fall: ["La Voce tace. I sacerdoti si gettano in mare, ridendo.", "The Voice falls silent. The priests throw themselves into the sea, laughing.", "La Voz calla. Los sacerdotes se arrojan al mar, riendo."],
  },
  ghostship: {
    start: ["«Equipaggio! Abbiamo ospiti vivi. Fategli spazio nella stiva.»", "“Crew! We have living guests. Make room for them in the hold.”", "«¡Tripulación! Tenemos invitados vivos. Hacedles sitio en la bodega.»"],
    rally: [["«L'Ammiraglio ci guarda, ragazzi!»", "“The Admiral is watching, lads!”", "«¡El Almirante nos mira, muchachos!»"], ["«Finché la sua sciabola si alza, la nave naviga.»", "“While his sabre is raised, the ship sails.”", "«Mientras su sable se alce, el barco navega.»"], ["«Senza l'Ammiraglio affondiamo un'altra volta…»", "“Without the Admiral we sink all over again…”", "«Sin el Almirante nos hundimos otra vez…»"]],
    hurt: ["L'Ammiraglio barcolla. Lo scafo geme con lui.", "The Admiral staggers. The hull groans with him.", "El Almirante se tambalea. El casco gime con él."],
    fall: ["L'Ammiraglio cade, e la nave fantasma comincia ad affondare. L'equipaggio la segue sul fondo, cantando.", "The Admiral falls, and the ghost ship begins to sink. The crew follows it down, singing.", "El Almirante cae, y el barco fantasma empieza a hundirse. La tripulación lo sigue al fondo, cantando."],
  },
});
CHAPTER_QUESTS.push(
  {s: "ch3_on", d: "ch3_done", n: ["Il Mare di Cenere", "The Sea of Ash", "El Mar de Ceniza"],
    t: () => !has("ch3_act1") ? ["Scopri cosa sta succedendo a Saltgrave e trova una nave che attraversi il Mare di Cenere.", "Find out what is happening in Saltgrave and find a ship to cross the Sea of Ash.", "Descubre qué está pasando en Saltgrave y encuentra un barco para cruzar el Mar de Ceniza."] :
      !has("ch3_act2") ? ["Raggiungi la Forgia di Aurel e riforgia la Chiave dell'Alba.", "Reach the Forge of Aurel and reforge the Key of Dawn.", "Llega a la Forja de Aurel y reforja la Llave del Alba."] :
      ["Sali sul Faro Nero e spezza il cuore di Morrhan.", "Climb the Black Lighthouse and break Morrhan's heart.", "Sube al Faro Negro y rompe el corazón de Morrhan."]},
  {s: "q_tide", d: "tide_done", n: ["✦ La campana sommersa", "✦ The Sunken Bell", "✦ La campana hundida"],
    t: ["Missione segreta. La cappella della marea a Saltgrave custodisce una domanda e, a chi risponde, una campana che suona sotto l'acqua.", "Secret quest. The tide chapel in Saltgrave keeps a question and, for whoever answers, a bell that rings under water.", "Misión secreta. La capilla de la marea de Saltgrave guarda una pregunta y, para quien la responda, una campana que suena bajo el agua."]},
);
