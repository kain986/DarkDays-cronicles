/* =================== CHAPTER IV — THE WAR OF THE GODS =================== */
defineChapter({
  id: "ch4",
  num: ["Capitolo IV", "Chapter IV", "Capítulo IV"],
  title: ["La Guerra degli Dèi", "The War of the Gods", "La Guerra de los Dioses"],
  blurb: ["Morrhan ha aperto l'occhio nel cielo e mangia le stelle una alla volta. Per uccidere un dio serve il cuore di un altro dio: quello di Aurel, sepolto nel Deserto di Vetro. Intanto l'esercito della Fame marcia su Vesperia.",
          "Morrhan has opened his eye in the sky and is eating the stars one by one. To kill a god you need the heart of another god: Aurel's, buried in the Desert of Glass. Meanwhile the army of Hunger marches on Vesperia.",
          "Morrhan ha abierto el ojo en el cielo y se come las estrellas una a una. Para matar a un dios hace falta el corazón de otro dios: el de Aurel, enterrado en el Desierto de Vidrio. Mientras tanto, el ejército del Hambre marcha sobre Vesperia."],
  start: "ch4_start",
  maxLevel: 38,
  endings: {ch4_end_held: ["Vesperia regge", "Vesperia Holds", "Vesperia resiste"], ch4_end_fallen: ["La caduta di Vesperia", "The Fall of Vesperia", "La caída de Vesperia"]},
});
const LOC4 = {
  sky: ["Sotto l'Occhio", "Beneath the Eye", "Bajo el Ojo"],
  council: ["Il consiglio di guerra, Vesperia", "The war council, Vesperia", "El consejo de guerra, Vesperia"],
  road: ["La Strada Grigia", "The Grey Road", "El Camino Gris"],
  desert: ["Il Deserto di Vetro", "The Desert of Glass", "El Desierto de Vidrio"],
  tomb: ["Il corpo di Aurel", "The body of Aurel", "El cuerpo de Aurel"],
  walls: ["Le mura di Vesperia", "The walls of Vesperia", "Las murallas de Vesperia"],
  bridge: ["Il Ponte Vecchio", "The Old Bridge", "El Puente Viejo"],
};

/* ---------- foes ---------- */
mkFoe("spawn", {n: ["Progenie della Fame", "Spawn of Hunger", "Progenie del Hambre"], lv: 27, role: "brute", ic: "fang", an: ["Artigli", "Claws", "Garras"]});
mkFoe("maw_beast", {n: ["Fauce caduta", "Fallen Maw", "Fauce caída"], lv: 28, role: "elite", ic: "fang", an: ["Inghiottire", "Swallow", "Engullir"], drain: 1, hpm: 1.2});
mkFoe("glasswraith", {n: ["Spettro di vetro", "Glass wraith", "Espectro de vidrio"], lv: 30, role: "skirm", ic: "eye", an: ["Schegge", "Shards", "Esquirlas"], vuln: "blunt"});
mkFoe("hollowangel", {n: ["Angelo cavo", "Hollow angel", "Ángel hueco"], lv: 32, role: "soldier", ic: "sun", an: ["Lancia di luce", "Spear of light", "Lanza de luz"], t: "radiant", res: "radiant", reach: 2});
mkFoe("firstwarden", {n: ["Il Primo Custode", "The First Warden", "El Primer Custodio"], lv: 33, role: "boss", ic: "sun", hpm: 1, an: ["Spada del mattino", "Morning sword", "Espada de la mañana"], t: "radiant", st: "radiant", sn: ["Raggio", "Ray", "Rayo"], res: "radiant"});
mkFoe("hunger_soldier", {n: ["Soldato della Fame", "Soldier of Hunger", "Soldado del Hambre"], lv: 34, role: "soldier", ic: "helm", an: ["Mannaia", "Cleaver", "Cuchilla"]});
mkFoe("hunger_archer", {n: ["Arciere della Fame", "Archer of Hunger", "Arquero del Hambre"], lv: 34, role: "archer", ic: "bow", an: ["Frecce d'osso", "Bone arrows", "Flechas de hueso"]});
mkFoe("tooth", {n: ["Dente di Morrhan", "Tooth of Morrhan", "Diente de Morrhan"], lv: 35, role: "elite", ic: "fang", an: ["Zanna", "Fang", "Colmillo"], t: "pierce"});
mkFoe("general", {n: ["Il Generale della Fame", "The General of Hunger", "El General del Hambre"], lv: 37, role: "boss", ic: "crown", hpm: .9, an: ["Spadone di denti", "Greatsword of teeth", "Mandoble de dientes"], t: "slash", sn: ["Fame", "Hunger", "Hambre"]});

/* ---------- encounters ---------- */
Object.assign(ENC, {
  maw_road: {map: "road", foes: ["maw_beast", "spawn", "spawn", "spawn"], gold: 600},
  glass: {map: "desert", foes: ["glasswraith", "glasswraith", "glasswraith", "glasswraith", "glasswraith", "glasswraith"], gold: 600},
  angels: {map: "desert", foes: ["hollowangel", "hollowangel", "hollowangel", "hollowangel", "glasswraith"], gold: 700},
  firstwarden: {map: "cathedral", foes: ["firstwarden", "hollowangel", "hollowangel"], gold: 1500,
    tele: {foe: "firstwarden", every: 2, shape: "row", dmg: "10d8", type: "radiant", n: ["Mezzogiorno", "Noon", "Mediodía"], bark: ["«Guardate il sole, se ne avete il coraggio.»", "“Look at the sun, if you dare.”", "«Mirad al sol, si os atrevéis.»"]}, tac: 1},
  siege_walls: {map: "fort", foes: ["hunger_soldier", "hunger_soldier", "hunger_soldier", "hunger_archer", "hunger_archer"], gold: 800,
    reinf: [{r: 3, foes: ["spawn", "spawn"], bark: ["Scale d'osso contro le mura! Ne salgono altri!", "Bone ladders against the walls! More are climbing!", "¡Escalas de hueso contra las murallas! ¡Suben más!"]}], tac: 1},
  bridge: {map: "bridge", foes: ["tooth", "hunger_soldier", "hunger_soldier", "spawn"], gold: 900,
    reinf: [{r: 2, foes: ["spawn", "hunger_soldier"], bark: ["La seconda ondata attraversa il fiume a nuoto!", "The second wave swims across the river!", "¡La segunda oleada cruza el río a nado!"]}, {r: 4, foes: ["tooth"], bark: ["Un altro Dente sale dall'acqua!", "Another Tooth rises from the water!", "¡Otro Diente sale del agua!"]}], tac: 1},
  general: {map: "ruins", foes: ["general", "tooth"], gold: 2000,
    tele: {foe: "general", every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "12d8", type: "necrotic", n: ["Bocca dal cielo", "Mouth from the sky", "Boca del cielo"], bark: ["«Il mio signore ha fame. Guardate in alto.»", "“My lord is hungry. Look up.”", "«Mi señor tiene hambre. Mirad arriba.»"]},
    phase: {foe: "general", at: .5, spawn: ["hunger_soldier", "hunger_soldier"], bark: ["Il Generale pianta lo spadone nel terreno: dalla terra escono soldati.", "The General plants his greatsword in the ground: soldiers climb out of the earth.", "El General clava el mandoble en el suelo: de la tierra salen soldados."]}, tac: 1},
});
CHAPTER_QUESTS.push(
  {s: "ch4_on", d: "ch4_done", n: ["La Guerra degli Dèi", "The War of the Gods", "La Guerra de los Dioses"],
    t: () => !has("ch4_act1") ? ["Riunisci gli alleati a Vesperia.", "Gather your allies in Vesperia.", "Reúne a tus aliados en Vesperia."] :
      !has("ch4_act2") ? ["Trova il cuore di Aurel nel Deserto di Vetro.", "Find Aurel's heart in the Desert of Glass.", "Encuentra el corazón de Aurel en el Desierto de Vidrio."] :
      ["Difendi Vesperia dall'esercito della Fame.", "Defend Vesperia from the army of Hunger.", "Defiende Vesperia del ejército del Hambre."]},
);
