/* =================== CHAPTER II — THE CITY OF THE FACELESS =================== */
defineChapter({
  id: "ch2",
  num: ["Capitolo II", "Chapter II", "Capítulo II"],
  title: ["La Città dei Senza Volto", "The City of the Faceless", "La Ciudad de los Sin Rostro"],
  blurb: ["Novanta giorni dopo la Corona di Cenere, il nord si spegne: villaggi interi perdono l'ombra. A Corvelle, la capitale delle maschere, la Chiesa della Notte prega un Ierofante che nessuno ha mai visto in volto.",
          "Ninety days after the Crown of Ash, the north goes dark: whole villages lose their shadows. In Corvelle, the capital of masks, the Church of Night prays to a Hierophant no one has ever seen unmasked.",
          "Noventa días después de la Corona de Ceniza, el norte se apaga: aldeas enteras pierden su sombra. En Corvelle, la capital de las máscaras, la Iglesia de la Noche reza a un Hierofante cuyo rostro nadie ha visto jamás."],
  start: "ch2_start",
  maxLevel: 16,
  endings: {ch2_end_mercy: ["La bambola di pezza", "The Rag Doll", "La muñeca de trapo"], ch2_end_blood: ["Il rogo di Corvelle", "The Burning of Corvelle", "La hoguera de Corvelle"]},
});
const LOC2 = {
  road: ["La Strada di Ferro", "The Iron Road", "El Camino de Hierro"],
  march: ["Le Marche di Ferro", "The Iron Marches", "Las Marcas de Hierro"],
  crow: ["Forte Corvaccia", "Fort Crowhold", "Fuerte Cuervo"],
  ferry: ["Il Traghetto delle Ossa", "The Ferry of Bones", "El Transbordador de Huesos"],
  city: ["Corvelle", "Corvelle", "Corvelle"],
  dyers: ["Il Quartiere dei Tintori", "The Dyers' Quarter", "El Barrio de los Tintoreros"],
  palace: ["Palazzo d'Avorio", "The Ivory Palace", "Palacio de Marfil"],
  inn: ["Locanda «Il Volto Perduto»", "“The Lost Face” inn", "Posada «El Rostro Perdido»"],
  bells: ["Il Campanile dei Quattro", "The Tower of the Four", "El Campanario de los Cuatro"],
  cath: ["Cattedrale della Notte", "Cathedral of Night", "Catedral de la Noche"],
  under: ["La Cattedrale Rovesciata", "The Inverted Cathedral", "La Catedral Invertida"],
};
const GO = ["Continuare", "Go on", "Continuar"];

/* ---------- foes ---------- */
mkFoe("spento", {n: ["Spento", "Extinguished", "Apagado"], lv: 8, role: "brute", ic: "skull", vuln: "radiant", an: ["Unghie", "Nails", "Uñas"]});
mkFoe("spento_r", {n: ["Spento veloce", "Running Extinguished", "Apagado veloz"], lv: 8, role: "skirm", ic: "fang", vuln: "radiant", an: ["Morso", "Bite", "Mordisco"], pack: 1});
mkFoe("shepherd", {n: ["Il Pastore Pallido", "The Pale Shepherd", "El Pastor Pálido"], lv: 10, role: "leader", ic: "crown", sn: ["Richiamo del gregge", "Call of the flock", "Llamada del rebaño"]});
mkFoe("bonedrowned", {n: ["Annegato delle ossa", "Bone-drowned", "Ahogado de huesos"], lv: 10, role: "brute", ic: "skull", undead: 1, vuln: "radiant", an: ["Stretta", "Grip", "Apretón"]});
mkFoe("faceless", {n: ["Volto Vuoto", "Hollow Face", "Rostro Vacío"], lv: 11, role: "skirm", ic: "dagger", an: ["Coltello", "Knife", "Cuchillo"]});
mkFoe("faceless_a", {n: ["Volto Vuoto balestriere", "Hollow Face crossbowman", "Rostro Vacío ballestero"], lv: 11, role: "archer", ic: "bow", an: ["Quadrello", "Bolt", "Virote"]});
mkFoe("maskguard", {n: ["Maschera Bianca", "White Mask", "Máscara Blanca"], lv: 12, role: "soldier", ic: "helm", an: ["Alabarda", "Halberd", "Alabarda"], reach: 2});
mkFoe("chorister", {n: ["Corista Senza Volto", "Faceless Chorister", "Corista Sin Rostro"], lv: 12, role: "caster", ic: "eye", sn: ["Nota spezzata", "Broken note", "Nota rota"], an2: ["Coro del buio", "Choir of dark", "Coro de la oscuridad"]});
mkFoe("chimera", {n: ["Chimera d'Ombra", "Shadow Chimera", "Quimera de Sombra"], lv: 13, role: "boss", ic: "fang", hpm: .8, an: ["Tre bocche", "Three mouths", "Tres bocas"], vuln: "radiant"});
mkFoe("caspian", {n: ["Ser Caspian Vael", "Ser Caspian Vael", "Ser Caspian Vael"], lv: 14, role: "leader", hpm: 1.4, ic: "crown", an: ["Stocco", "Rapier", "Estoque"], t: "pierce", sn: ["Lama d'eclisse", "Eclipse blade", "Hoja de eclipse"]});
mkFoe("harvester", {n: ["Mietitore d'ombre", "Shadow Harvester", "Segador de sombras"], lv: 14, role: "elite", ic: "skull", hpm: .9, an: ["Falce", "Scythe", "Guadaña"], drain: 1, vuln: "radiant"});
mkFoe("lia", {n: ["L'Ierofante Senza Volto", "The Faceless Hierophant", "El Hierofante Sin Rostro"], lv: 16, role: "boss", ic: "crown", hpm: .85, an: ["Mano fredda", "Cold hand", "Mano fría"], sn: ["Ninna nanna nera", "Black lullaby", "Nana negra"], an2: ["La notte ti abbraccia", "The night embraces you", "La noche te abraza"], drain: 1});
mkFoe("lia_poss", {n: ["Lia, posseduta", "Lia, possessed", "Lia, poseída"], lv: 15, role: "boss", ic: "crown", hpm: 1.1, an: ["Mano fredda", "Cold hand", "Mano fría"], sn: ["Voce di Morrhan", "Voice of Morrhan", "Voz de Morrhan"]});
mkObj("choir_pillar", ["Colonna del coro", "Choir pillar", "Columna del coro"], 40, 12, "eye", {vuln: "radiant"});
mkObj("lia_pillar", ["Candela nera", "Black candle", "Vela negra"], 55, 13, "flame", {vuln: "cold"});

/* ---------- encounters ---------- */
Object.assign(ENC, {
  spenti: {map: "ruins", foes: ["spento", "spento", "spento", "spento_r", "spento_r"], gold: 60},
  spenti_easy: {map: "ruins", foes: ["spento", "spento", "spento_r"], gold: 60},
  crow_siege: {lead: "shepherd", map: "fort", foes: ["shepherd", "spento", "spento", "spento_r", "spento_r"], gold: 120,
    reinf: [{r: 3, foes: ["spento", "spento_r"], bark: ["Il gregge sale dalle mura! Altri Spenti!", "The flock climbs the walls! More Extinguished!", "¡El rebaño sube por los muros! ¡Más Apagados!"]}], tac: 1},
  crow_walls: {lead: "shepherd", map: "fort", foes: ["shepherd", "spento", "spento_r", "spento_r"], gold: 120},
  ferry_drowned: {map: "water", foes: ["bonedrowned", "bonedrowned", "bonedrowned", "spento_r"], gold: 80},
  faceless_alley: {map: "city", foes: ["faceless", "faceless", "faceless", "faceless_a", "faceless_a"], gold: 150},
  bell_guards: {map: "tower", foes: ["maskguard", "maskguard", "maskguard", "chorister"], gold: 150},
  ball_masks: {map: "palace", foes: ["maskguard", "maskguard", "faceless", "faceless", "chorister"], gold: 200,
    reinf: [{r: 3, foes: ["faceless", "faceless_a"], bark: ["Dalle gallerie! Altri Volti Vuoti!", "From the galleries! More Hollow Faces!", "¡Desde las galerías! ¡Más Rostros Vacíos!"]}]},
  cath_wardens: {map: "cathedral", foes: ["maskguard", "maskguard", "chorister", "chorister"], gold: 150},
  chimera: {map: "cathedral", foes: ["chimera", "faceless", "faceless_a"], gold: 300,
    phase: {foe: "chimera", at: .5, spawn: ["faceless", "faceless_a"], bark: ["La chimera ulula: le ombre della cattedrale rispondono!", "The chimera howls: the cathedral's shadows answer!", "¡La quimera aúlla: las sombras de la catedral responden!"]}, tac: 1},
  caspian: {lead: "caspian", map: "cathedral", foes: ["caspian", "maskguard", "maskguard", "maskguard", "faceless_a"], gold: 300},
  caspian_ambush: {lead: "caspian", map: "cathedral", foes: ["caspian", "maskguard", "maskguard", "maskguard", "faceless_a", "faceless"], gold: 300},
  harvesters: {map: "cathedral", foes: ["harvester", "harvester", "harvester", "chorister"], gold: 200},
  choir: {map: "cathedral", foes: ["chorister", "chorister", "harvester", "harvester"], gold: 250,
    objs: [["choir_pillar", 0, 3], ["choir_pillar", 6, 3], ["choir_pillar", 3, 1]],
    ritual: {rounds: 5, by: "choir_pillar", spawn: ["harvester"], bark: ["Il coro tocca la nota più bassa… qualcosa risponde dal fondo!", "The choir reaches the lowest note… something answers from the depths!", "El coro alcanza la nota más grave… ¡algo responde desde el fondo!"]}, tac: 1},
  hierophant: {map: "cathedral", foes: ["lia", "chorister", "harvester"], gold: 500,
    objs: [["lia_pillar", 0, 2], ["lia_pillar", 6, 2]], ward: {foe: "lia", by: "lia_pillar", heal: 12},
    tele: {foe: "lia", every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "6d8", type: "necrotic", n: ["Ninna nanna nera", "Black lullaby", "Nana negra"], bark: ["«Dormite. Dormite tutti.»", "“Sleep. Sleep, all of you.”", "«Dormid. Dormid todos.»"]},
    phase: {foe: "lia", at: .5, spawn: ["harvester"], bark: ["La voce della bambina si spezza in mille voci. Morrhan parla attraverso di lei.", "The child's voice breaks into a thousand voices. Morrhan speaks through her.", "La voz de la niña se rompe en mil voces. Morrhan habla a través de ella."]}, tac: 1},
  hierophant_free: {map: "cathedral", foes: ["lia", "harvester"], gold: 500,
    tele: {foe: "lia", every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "6d8", type: "necrotic", n: ["Ninna nanna nera", "Black lullaby", "Nana negra"], bark: ["«Dormite. Dormite tutti.»", "“Sleep. Sleep, all of you.”", "«Dormid. Dormid todos.»"]},
    phase: {foe: "lia", at: .5, spawn: ["harvester"], bark: ["La voce della bambina si spezza in mille voci. Morrhan parla attraverso di lei.", "The child's voice breaks into a thousand voices. Morrhan speaks through her.", "La voz de la niña se rompe en mil voces. Morrhan habla a través de ella."]}, tac: 1},
  lia_possessed: {map: "cathedral", foes: ["lia_poss"], gold: 400,
    tele: {foe: "lia_poss", every: 2, shape: "row", dmg: "6d8", type: "necrotic", n: ["Respiro di Morrhan", "Breath of Morrhan", "Aliento de Morrhan"], bark: ["«Non è più tua figlia. Non è mai stata di nessuno.»", "“She is no one's daughter now. She never was.”", "«Ya no es hija de nadie. Nunca lo fue.»"]}, tac: 1},
});
Object.assign(SAGA_LEADS, {
  shepherd: {
    start: ["«Pecorelle mie, avete fame? C'è carne viva sulle mura.»", "“My little lambs, are you hungry? There's living meat on the walls.”", "«Corderitos míos, ¿tenéis hambre? Hay carne viva en las murallas.»"],
    rally: [["(Gli Spenti si voltano tutti insieme verso il bastone del Pastore.)", "(The Extinguished all turn at once toward the Shepherd's staff.)", "(Los Apagados se vuelven todos a la vez hacia el cayado del Pastor.)"],
            ["«Avanti, gregge. Il pastore vi guarda.»", "“Forward, flock. The shepherd is watching.”", "«Adelante, rebaño. El pastor os mira.»"],
            ["(Finché il bastone suona, gli Spenti non si fermano.)", "(While the staff sounds, the Extinguished don't stop.)", "(Mientras suene el cayado, los Apagados no se detienen.)"]],
    hurt: ["(Il bastone del Pastore trema. Alcuni Spenti si guardano intorno, smarriti.)", "(The Shepherd's staff trembles. Some Extinguished look around, lost.)", "(El cayado del Pastor tiembla. Algunos Apagados miran a su alrededor, perdidos.)"],
    fall: ["(Il bastone si spezza. Gli Spenti si fermano, come svegliati, e scappano nel buio.)", "(The staff breaks. The Extinguished stop, as if woken, and flee into the dark.)", "(El cayado se rompe. Los Apagados se detienen, como si despertaran, y huyen a la oscuridad.)"],
  },
  caspian: {
    start: ["«Niente di personale. Lei mi ha promesso il mio volto, e io lo rivoglio.»", "“Nothing personal. She promised me my face back, and I want it.”", "«Nada personal. Ella me prometió devolverme el rostro, y lo quiero.»"],
    rally: [["«Il capitano è con noi! Tenete la linea!»", "“The captain is with us! Hold the line!”", "«¡El capitán está con nosotros! ¡Mantened la línea!»"],
            ["«Finché Ser Caspian combatte, le Maschere non arretrano.»", "“While Ser Caspian fights, the Masks don't fall back.”", "«Mientras Ser Caspian luche, las Máscaras no retroceden.»"],
            ["«Se cade lui, chi ci ridarà la faccia?»", "“If he falls, who'll give us our faces back?”", "«Si cae él, ¿quién nos devolverá la cara?»"]],
    hurt: ["«Il capitano sanguina… la promessa vale ancora?»", "“The captain's bleeding… is the promise still good?”", "«El capitán sangra… ¿sigue en pie la promesa?»"],
    fall: ["«Caspian è caduto! Toglietevi le maschere e scappate!»", "“Caspian is down! Off with the masks and run!”", "«¡Caspian ha caído! ¡Quitaos las máscaras y huid!»"],
  },
});
SAGA_LEADS.crow_siege = SAGA_LEADS.crow_walls = SAGA_LEADS.shepherd;
SAGA_LEADS.caspian_ambush = SAGA_LEADS.caspian;
CHAPTER_QUESTS.push(
  {s: "ch2_on", d: "ch2_done", n: ["La Città dei Senza Volto", "The City of the Faceless", "La Ciudad de los Sin Rostro"],
    t: () => !has("ch2_act1") ? ["Raggiungi Corvelle attraverso le Marche di Ferro. Qualcosa sta mangiando le ombre della gente del nord.", "Reach Corvelle through the Iron Marches. Something is eating the shadows of the people of the north.", "Llega a Corvelle a través de las Marcas de Hierro. Algo se está comiendo las sombras de la gente del norte."] :
      !has("ch2_act2") ? ["A Corvelle tutti portano la maschera. Scopri chi rapisce la gente dei Tintori e chi è davvero l'Ierofante.", "In Corvelle everyone wears a mask. Find out who is taking the people of the Dyers' Quarter and who the Hierophant really is.", "En Corvelle todos llevan máscara. Descubre quién se lleva a la gente de los Tintoreros y quién es en realidad el Hierofante."] :
      ["Scendi nella Cattedrale Rovesciata e affronta l'Ierofante Senza Volto.", "Go down into the Inverted Cathedral and face the Faceless Hierophant.", "Desciende a la Catedral Invertida y enfréntate al Hierofante Sin Rostro."]},
  {s: "q_bells", d: "bells_done", n: ["✦ Le campane dei Quattro", "✦ The Bells of the Four", "✦ Las campanas de los Cuatro"],
    t: ["Missione segreta. Il campanile di Corvelle nasconde qualcosa a chi sa suonare le quattro campane nell'ordine giusto.", "Secret quest. Corvelle's bell tower hides something from those who can ring the four bells in the right order.", "Misión secreta. El campanario de Corvelle esconde algo a quien sepa tocar las cuatro campanas en el orden correcto."]},
);
