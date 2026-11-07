/* =================== CHAPTER V — THE LAST DAWN =================== */
defineChapter({
  id: "ch5",
  num: ["Capitolo V", "Chapter V", "Capítulo V"],
  title: ["L'Ultima Alba", "The Last Dawn", "El Último Alba"],
  blurb: ["La Corona di Cenere è diventata una gola, e tutta Valtenebra scivola dentro. Hai il cuore di Aurel che batte con il tuo. Scendi nello stomaco di un dio per l'ultima volta. Cinque finali.",
          "The Crown of Ash has become a throat, and all of Valtenebra is sliding into it. You have Aurel's heart beating with your own. Go down into a god's stomach one last time. Five endings.",
          "La Corona de Ceniza se ha convertido en una garganta, y todo Valtenebra se desliza dentro. Tienes el corazón de Aurel latiendo con el tuyo. Desciende al estómago de un dios por última vez. Cinco finales."],
  start: "ch5_start",
  maxLevel: 50,
  endings: {
    ch5_end_dawn: ["L'Ultima Alba", "The Last Dawn", "El Último Alba"],
    ch5_end_sun: ["Il Sole Nuovo", "The New Sun", "El Sol Nuevo"],
    ch5_end_godless: ["Il Mondo Senza Dèi", "The Godless World", "El Mundo Sin Dioses"],
    ch5_end_hunger: ["La Fame", "The Hunger", "El Hambre"],
    ch5_end_all: ["La Fine di Tutto", "The End of Everything", "El Fin de Todo"],
  },
});
const LOC5 = {
  valley: ["Valtenebra", "Valtenebra", "Valtenebra"],
  ashford: ["Le rovine di Ashford", "The ruins of Ashford", "Las ruinas de Ashford"],
  crypt: ["Cripta dei Custodi", "Crypt of the Sunwardens", "Cripta de los Custodios"],
  stones: ["Le Pietre di Varga", "The Stones of Varga", "Las Piedras de Varga"],
  mouth: ["La bocca della Gola", "The mouth of the Throat", "La boca de la Garganta"],
  gullet: ["La Gola", "The Throat", "La Garganta"],
  echoes: ["La Sala degli Echi", "The Hall of Echoes", "La Sala de los Ecos"],
  stomach: ["Lo stomaco del dio", "The god's stomach", "El estómago del dios"],
  bones: ["Le ossa di Aurel", "The bones of Aurel", "Los huesos de Aurel"],
  heart: ["Il cuore di Morrhan", "The heart of Morrhan", "El corazón de Morrhan"],
};

/* ---------- foes ---------- */
mkFoe("eaten", {n: ["Mangiato", "Eaten", "Devorado"], lv: 39, role: "brute", ic: "fang", an: ["Morsi", "Bites", "Mordiscos"], drain: 1});
mkFoe("eaten_choir", {n: ["Cantore della Gola", "Throat cantor", "Cantor de la Garganta"], lv: 40, role: "caster", ic: "eye", sn: ["Canto che svuota", "Hollowing song", "Canto que vacía"], an2: ["Coro", "Chorus", "Coro"]});
mkFoe("choirmother", {n: ["La Madre del Coro", "The Choir Mother", "La Madre del Coro"], lv: 41, role: "leader", ic: "crown", an: ["Abbraccio", "Embrace", "Abrazo"], sn: ["Ninna nanna della Gola", "Lullaby of the Throat", "Nana de la Garganta"]});
mkFoe("tooth5", {n: ["Dente della Gola", "Throat tooth", "Diente de la Garganta"], lv: 42, role: "elite", ic: "fang", an: ["Zanna", "Fang", "Colmillo"], t: "pierce"});
mkFoe("gatekeeper", {n: ["Il Portinaio di Denti", "The Gatekeeper of Teeth", "El Portero de Dientes"], lv: 43, role: "leader", ic: "crown", hpm: .7, an: ["Mascella", "Jaw", "Mandíbula"], t: "blunt", sn: ["Ruggito", "Roar", "Rugido"]});
mkFoe("echo", {n: ["Eco dei caduti", "Echo of the fallen", "Eco de los caídos"], lv: 44, role: "soldier", ic: "skull", undead: 1, vuln: "radiant", an: ["Mano gelida", "Cold hand", "Mano helada"], t: "necrotic"});
mkFoe("echo_lead", {n: ["Il Coro dei Morti", "The Choir of the Dead", "El Coro de los Muertos"], lv: 45, role: "leader", ic: "crown", undead: 1, vuln: "radiant", an: ["Martello d'ombra", "Shadow hammer", "Martillo de sombra"], t: "necrotic", sn: ["Voce che conosci", "A voice you know", "Una voz que conoces"]});
mkFoe("lia_ash", {n: ["Lia di cenere", "Lia of ash", "Lia de ceniza"], lv: 45, role: "boss", ic: "crown", hpm: .8, an: ["Dita bruciate", "Burned fingers", "Dedos quemados"], t: "fire", st: "fire", sn: ["Rogo di Corvelle", "Pyre of Corvelle", "Hoguera de Corvelle"]});
mkFoe("tongue", {n: ["Lingua della Gola", "Throat tongue", "Lengua de la Garganta"], lv: 46, role: "elite", ic: "drop", an: ["Frusta", "Lash", "Látigo"], t: "blunt", reach: 2});
mkFoe("hand", {n: ["La Mano di Morrhan", "The Hand of Morrhan", "La Mano de Morrhan"], lv: 46, role: "boss", ic: "hand", hpm: .75, an: ["Stretta", "Grip", "Apretón"], t: "blunt", sn: ["Dita del dio", "Fingers of the god", "Dedos del dios"]});
mkFoe("morrhan", {n: ["Morrhan, il Dio Affamato", "Morrhan, the Hungry God", "Morrhan, el Dios Hambriento"], lv: 48, role: "boss", ic: "eye", hpm: 1.1, an: ["Fauci", "Maw", "Fauces"], t: "necrotic", sn: ["Sguardo che divora", "Devouring gaze", "Mirada que devora"]});
mkFoe("morrhan2", {n: ["Il cuore di Morrhan", "The heart of Morrhan", "El corazón de Morrhan"], lv: 50, role: "boss", ic: "heart", hpm: .85, an: ["Battito", "Heartbeat", "Latido"], t: "necrotic", sn: ["Fame ultima", "Last hunger", "Hambre última"], drain: 1});
mkObj("m_eye", ["Occhio della Gola", "Eye of the Throat", "Ojo de la Garganta"], 120, 17, "eye", {vuln: "radiant"});

/* ---------- encounters ---------- */
const TELE5 = {
  gaze: {foe: "morrhan", every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "14d8", type: "necrotic", n: ["Sguardo che divora", "Devouring gaze", "Mirada que devora"], bark: ["«Vi vedo. Vi ho sempre visti.»", "“I see you. I have always seen you.”", "«Os veo. Siempre os he visto.»"]},
  beat: {foe: "morrhan2", every: 2, shape: "burst", rad: 1, cnt: 2, dmg: "12d8", type: "necrotic", n: ["Battito", "Heartbeat", "Latido"], bark: ["(Il cuore del dio si contrae. Le pareti di carne si chiudono sugli esagoni segnati.)", "(The god's heart contracts. The walls of flesh close on the marked hexes.)", "(El corazón del dios se contrae. Las paredes de carne se cierran sobre los hexágonos marcados.)"]},
};
Object.assign(ENC, {
  eaten_crypt: {lead: "choirmother", map: "ruins", foes: ["choirmother", "eaten", "eaten", "eaten", "eaten_choir"], gold: 2000},
  throat_gate: {lead: "gatekeeper", map: "maw", foes: ["gatekeeper", "tooth5", "eaten", "eaten"], gold: 2500,
    reinf: [{r: 3, foes: ["eaten"], bark: ["Dalle pareti della Gola si staccano altri Mangiati!", "More Eaten tear themselves from the walls of the Throat!", "¡De las paredes de la Garganta se desprenden más Devorados!"]}], tac: 1},
  throat_host: {lead: "gatekeeper", map: "maw", foes: ["gatekeeper", "eaten", "eaten"], gold: 2500},
  teeth: {map: "maw", foes: ["tooth5", "tooth5", "tooth5", "eaten_choir"], gold: 2200},
  echoes: {lead: "echo_lead", map: "mirror", foes: ["echo_lead", "echo", "echo", "echo"], gold: 2800},
  lia_ash: {map: "cathedral", foes: ["lia_ash", "eaten_choir", "eaten"], gold: 3000,
    tele: {foe: "lia_ash", every: 2, shape: "row", dmg: "12d8", type: "fire", n: ["Rogo di Corvelle", "Pyre of Corvelle", "Hoguera de Corvelle"], bark: ["«Bruciava così. Ricordi? Bruciava così.»", "“It burned like this. Remember? It burned like this.”", "«Ardía así. ¿Recuerdas? Ardía así.»"]}, tac: 1},
  hand: {map: "maw", foes: ["hand", "tongue"], gold: 3500,
    tele: {foe: "hand", every: 2, shape: "row", dmg: "10d8", type: "blunt", n: ["Dita del dio", "Fingers of the god", "Dedos del dios"], bark: ["(Cinque dita grandi come torri si sollevano dal fondo. Una fila di esagoni si fa rossa.)", "(Five fingers as tall as towers rise from the depths. A row of hexes turns red.)", "(Cinco dedos altos como torres se alzan del fondo. Una fila de hexágonos se vuelve roja.)"]},
    phase: {foe: "hand", at: .5, spawn: ["eaten"], bark: ["Il palmo della Mano si apre: dentro ci sono persone, ancora vive, che cadono verso di voi.", "The Hand's palm opens: inside are people, still alive, falling toward you.", "La palma de la Mano se abre: dentro hay personas, aún vivas, que caen hacia vosotros."]}, tac: 1},
  morrhan: {map: "maw", foes: ["morrhan", "tongue"], gold: 5000,
    objs: [["m_eye", 0, 2], ["m_eye", 6, 2], ["m_eye", 3, 1]], ward: {foe: "morrhan", by: "m_eye", heal: 25}, tele: TELE5.gaze, tac: 1},
  morrhan_w: {map: "maw", foes: ["morrhan", "tongue"], gold: 5000,
    objs: [["m_eye", 0, 2], ["m_eye", 6, 2]], ward: {foe: "morrhan", by: "m_eye", heal: 25}, tele: TELE5.gaze, tac: 1},
  morrhan2: {map: "maw", foes: ["morrhan2", "tongue"], gold: 8000, tele: TELE5.beat,
    phase: {foe: "morrhan2", at: .5, spawn: ["eaten", "echo"], bark: ["Il cuore si squarcia: ne escono tutti quelli che il dio ha mangiato, e vi corrono incontro.", "The heart tears open: out come all those the god has eaten, running at you.", "El corazón se desgarra: salen todos los que el dios ha devorado, y corren hacia vosotros."]}, tac: 1},
});
Object.assign(SAGA_LEADS, {
  choirmother: {
    start: ["«Figli miei, cantate. Il dio ha fame, e noi siamo già cibo.»", "“My children, sing. The god is hungry, and we are already food.”", "«Hijos míos, cantad. El dios tiene hambre, y nosotros ya somos comida.»"],
    rally: [["(I Mangiati aprono la bocca tutti insieme e cantano la stessa nota.)", "(The Eaten open their mouths all together and sing the same note.)", "(Los Devorados abren la boca todos a la vez y cantan la misma nota.)"],
            ["«La Madre canta, e noi non sentiamo più dolore.»", "“Mother sings, and we feel no more pain.”", "«La Madre canta, y ya no sentimos dolor.»"],
            ["(Finché la Madre canta, i Mangiati non sentono le ferite.)", "(While Mother sings, the Eaten don't feel their wounds.)", "(Mientras la Madre cante, los Devorados no sienten las heridas.)"]],
    hurt: ["(La voce della Madre si incrina. Alcuni Mangiati chiudono la bocca, e piangono.)", "(Mother's voice cracks. Some of the Eaten close their mouths, and weep.)", "(La voz de la Madre se quiebra. Algunos Devorados cierran la boca, y lloran.)"],
    fall: ["(Il canto si spezza. I Mangiati si ricordano di avere un nome, e fuggono urlando.)", "(The song breaks. The Eaten remember they have names, and flee screaming.)", "(El canto se rompe. Los Devorados recuerdan que tienen nombre, y huyen gritando.)"],
  },
  gatekeeper: {
    start: ["«Chi entra nella Gola non esce. Chi esce non è più chi è entrato.»", "“Whoever enters the Throat does not come out. Whoever comes out is no longer who went in.”", "«Quien entra en la Garganta no sale. Quien sale ya no es quien entró.»"],
    rally: [["(I Denti battono gli uni contro gli altri, come una mascella che mastica.)", "(The Teeth clack against each other, like a chewing jaw.)", "(Los Dientes chocan entre sí, como una mandíbula que mastica.)"],
            ["«Il Portinaio tiene la porta! Masticate!»", "“The Gatekeeper holds the door! Chew!”", "«¡El Portero sostiene la puerta! ¡Masticad!»"],
            ["(Finché il Portinaio è in piedi, la porta di denti resta chiusa.)", "(While the Gatekeeper stands, the door of teeth stays shut.)", "(Mientras el Portero siga en pie, la puerta de dientes sigue cerrada.)"]],
    hurt: ["(La mascella del Portinaio si spacca. I Denti esitano.)", "(The Gatekeeper's jaw cracks. The Teeth hesitate.)", "(La mandíbula del Portero se parte. Los Dientes dudan.)"],
    fall: ["(La porta di denti si apre con un rumore di ossa. I Denti scivolano giù nella Gola.)", "(The door of teeth opens with a sound of bones. The Teeth slide down into the Throat.)", "(La puerta de dientes se abre con un ruido de huesos. Los Dientes se deslizan Garganta abajo.)"],
  },
  echo_lead: {
    start: ["«Perché tu sei vivo e noi no?» (Sono le voci di tutti quelli che hai seppellito.)", "“Why are you alive and we are not?” (It is the voices of everyone you have buried.)", "«¿Por qué tú vives y nosotros no?» (Son las voces de todos los que has enterrado.)"],
    rally: [["«Ci hai lasciati indietro. Resta con noi, adesso.»", "“You left us behind. Stay with us, now.”", "«Nos dejaste atrás. Quédate con nosotros, ahora.»"],
            ["«Fa freddo, qui. Vieni a scaldarci.»", "“It's cold, here. Come and warm us.”", "«Hace frío, aquí. Ven a calentarnos.»"],
            ["(Finché il Coro canta, gli echi tornano su ogni volta che cadono.)", "(While the Choir sings, the echoes rise each time they fall.)", "(Mientras el Coro cante, los ecos se levantan cada vez que caen.)"]],
    hurt: ["(Le voci si confondono. Per un momento ne senti una sola, e ti chiede scusa.)", "(The voices blur. For a moment you hear just one, and it says it's sorry.)", "(Las voces se confunden. Por un momento oyes solo una, y te pide perdón.)"],
    fall: ["(Il Coro tace. Gli echi si voltano, e ti salutano, e se ne vanno.)", "(The Choir falls silent. The echoes turn, and wave to you, and go.)", "(El Coro calla. Los ecos se vuelven, y te dicen adiós, y se van.)"],
  },
});
SAGA_LEADS.throat_host = SAGA_LEADS.gatekeeper;
CHAPTER_QUESTS.push(
  {s: "ch5_on", d: "ch5_done", n: ["L'Ultima Alba", "The Last Dawn", "El Último Alba"],
    t: () => !has("ch5_act1") ? ["Torna a Valtenebra e raggiungi la bocca della Gola.", "Return to Valtenebra and reach the mouth of the Throat.", "Vuelve a Valtenebra y llega a la boca de la Garganta."] :
      !has("ch5_act2") ? ["Scendi nella Gola fino allo stomaco del dio.", "Go down the Throat to the god's stomach.", "Desciende por la Garganta hasta el estómago del dios."] :
      ["Affronta Morrhan e scegli che cosa farne del suo cuore e di quello di Aurel.", "Face Morrhan and choose what to do with his heart and Aurel's.", "Enfréntate a Morrhan y elige qué hacer con su corazón y con el de Aurel."]},
);
