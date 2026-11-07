/* =================== PROGRESSION TO LEVEL 50 & SUBCLASSES =================== */
// Levels 1–20 follow 5e; 21–50 are "epic" levels: proficiency keeps rising slowly,
// ability scores can go up to 24, spell slots and spell power keep growing.
// Each class has two subclasses, chosen at level 3, with features at 3, 7 and 11.

/* ---------- tables ---------- */
for (let L = XPT.length; L <= 50; L++) XPT[L] = XPT[L - 1] + 1000 * (L - 4);
const MAX_LEVEL = 50;
const abCap = c => c.lvl > 20 ? 24 : 20;
(function extendSlots() {
  const rr = (s, n) => { for (let k = 0; k < n; k++) s[k % 4]++; return s; };
  FULL[8] = [4, 3, 3, 2]; FULL[9] = [4, 3, 3, 3];
  for (let L = 10; L <= 50; L++) FULL[L] = rr([4, 3, 3, 3], Math.floor((L - 9) / 5));
  const H = {8: [4, 3, 0, 0], 9: [4, 3, 2, 0], 10: [4, 3, 2, 0], 11: [4, 3, 3, 0], 12: [4, 3, 3, 0], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1], 15: [4, 3, 3, 2], 16: [4, 3, 3, 2]};
  for (let L = 8; L <= 50; L++) HALF[L] = H[L] ? H[L].slice() : rr([4, 3, 3, 3], Math.floor((L - 17) / 6));
})();
(function extendFeats() {
  const add = (cls, l, f) => { const t = CLASS_FEATS[cls]; t[l] = t[l] || []; if (!t[l].includes(f)) t[l].push(f); };
  const drop = (cls, l, f) => { const t = CLASS_FEATS[cls]; if (t[l]) t[l] = t[l].filter(x => x !== f); };
  drop("fighter", 3, "impcrit"); drop("ranger", 3, "colossus");   // now subclass features
  Object.keys(CLASS_FEATS).forEach(cls => [4, 8, 12, 16, 19, 24, 28, 32, 36, 40, 44, 48].forEach(l => add(cls, l, "asi")));
  add("fighter", 14, "asi"); add("rogue", 10, "asi");
  add("fighter", 9, "indomitable"); add("fighter", 11, "extra2"); add("fighter", 20, "extra3");
  add("paladin", 11, "radiant"); add("paladin", 24, "extra2");
  add("rogue", 7, "evasion"); add("rogue", 11, "elusive");
  add("ranger", 9, "landstride"); add("ranger", 24, "extra2");
})();
Object.assign(FEATS, {
  indomitable: ["Indomito", "Indomitable", "Indomable"], extra2: ["Attacco extra (3)", "Extra Attack (3)", "Ataque extra (3)"], extra3: ["Attacco extra (4)", "Extra Attack (4)", "Ataque extra (4)"],
  radiant: ["Colpi radiosi", "Radiant Strikes", "Golpes radiantes"], evasion: ["Elusione", "Evasion", "Evasión"], elusive: ["Inafferrabile", "Elusive", "Escurridizo"], landstride: ["Passo sicuro", "Land's Stride", "Zancada firme"],
  survivor: ["Sopravvissuto", "Survivor", "Superviviente"], supcrit: ["Critico superiore (18–20)", "Superior Critical (18–20)", "Crítico superior (18–20)"],
  superiority: ["Superiorità in combattimento", "Combat Superiority", "Superioridad en combate"], relentless: ["Instancabile", "Relentless", "Incansable"], warlord: ["Signore della guerra", "Warlord", "Señor de la guerra"],
  sacredweapon: ["Arma sacra", "Sacred Weapon", "Arma sagrada"], devaura: ["Aura di devozione", "Aura of Devotion", "Aura de devoción"], nimbus: ["Nimbo sacro", "Holy Nimbus", "Nimbo sagrado"],
  vow: ["Voto di inimicizia", "Vow of Enmity", "Voto de enemistad"], avenger: ["Vendicatore implacabile", "Relentless Avenger", "Vengador implacable"], soulavenger: ["Anima vendicatrice", "Soul of Vengeance", "Alma de venganza"],
  assassinate: ["Assassinare", "Assassinate", "Asesinar"], deadly: ["Lama letale", "Deadly Blade", "Hoja letal"], cutthroat: ["Tagliagole", "Cutthroat", "Degollador"],
  fasthands: ["Mani veloci", "Fast Hands", "Manos rápidas"], supreme: ["Furtività suprema", "Supreme Sneak", "Sigilo supremo"], thiefref: ["Riflessi da furfante", "Thief's Reflexes", "Reflejos de ladrón"],
  multidef: ["Tattiche difensive", "Defensive Tactics", "Tácticas defensivas"], hordebreaker: ["Spezzaorde", "Horde Breaker", "Rompehordas"],
  dread: ["Imboscata del terrore", "Dread Ambusher", "Emboscador terrible"], ironmind: ["Mente di ferro", "Iron Mind", "Mente de hierro"], flurry: ["Raffica del cacciatore", "Stalker's Flurry", "Ráfaga del acechador"],
  sculpt: ["Plasmare incantesimi", "Sculpt Spells", "Esculpir conjuros"], empowered: ["Invocazione potenziata", "Empowered Evocation", "Evocación potenciada"], overchannel: ["Sovraccarico", "Overchannel", "Sobrecarga"],
  arcaneward: ["Protezione arcana", "Arcane Ward", "Custodia arcana"], wardrecharge: ["Protezione rinnovata", "Renewed Ward", "Custodia renovada"], spellres: ["Resistenza agli incantesimi", "Spell Resistance", "Resistencia a conjuros"],
  disciple: ["Discepolo della vita", "Disciple of Life", "Discípulo de la vida"], blessedheal: ["Guaritore benedetto", "Blessed Healer", "Sanador bendito"], supremeheal: ["Guarigione suprema", "Supreme Healing", "Curación suprema"],
  warpriest: ["Sacerdote di guerra", "War Priest", "Sacerdote de guerra"], divinestrike: ["Colpo divino", "Divine Strike", "Golpe divino"], battleavatar: ["Avatar della battaglia", "Avatar of Battle", "Avatar de batalla"],
});
Object.assign(FEAT_D, {
  indomitable: ["Una volta per riposo ritenti un tiro salvezza fallito.", "Once per rest, reroll a failed saving throw.", "Una vez por descanso repites una salvación fallida."],
  extra2: ["Tre attacchi per azione.", "Three attacks per action.", "Tres ataques por acción."], extra3: ["Quattro attacchi per azione.", "Four attacks per action.", "Cuatro ataques por acción."],
  radiant: ["+1d8 radiosi a ogni colpo in mischia.", "+1d8 radiant on every melee hit.", "+1d8 radiante en cada golpe cuerpo a cuerpo."],
  evasion: ["Vantaggio ai tiri salvezza su Destrezza.", "Advantage on Dexterity saving throws.", "Ventaja en las salvaciones de Destreza."],
  elusive: ["Gli attacchi contro di te non hanno mai vantaggio.", "Attacks against you never have advantage.", "Los ataques contra ti nunca tienen ventaja."],
  landstride: ["+1 alla velocità.", "+1 speed.", "+1 a la velocidad."],
  survivor: ["A inizio turno, se sei sotto metà PF, recuperi 5 + Costituzione PF.", "At the start of your turn, below half HP, regain 5 + Constitution HP.", "Al inicio de tu turno, por debajo de la mitad de PG, recuperas 5 + Constitución PG."],
  supcrit: ["Colpo critico con 18, 19 e 20.", "Critical hit on 18, 19 and 20.", "Crítico con 18, 19 y 20."],
  superiority: ["4 dadi di superiorità (d8) per riposo. «Manovra»: il prossimo colpo con l'arma aggiunge il dado ai danni e il bersaglio fa un TS Forza o cade a terra.", "4 superiority dice (d8) per rest. 'Maneuver': your next weapon hit adds the die to damage and the target makes a STR save or falls prone.", "4 dados de superioridad (d8) por descanso. «Maniobra»: tu siguiente golpe con arma suma el dado al daño y el objetivo hace una salvación de FUE o cae derribado."],
  relentless: ["Dadi di superiorità d10, uno in più.", "Superiority dice become d10, one more.", "Los dados de superioridad pasan a d10, uno más."],
  warlord: ["Dadi di superiorità d12, uno in più.", "Superiority dice become d12, one more.", "Los dados de superioridad pasan a d12, uno más."],
  sacredweapon: ["Azione bonus, una volta per riposo: per tutto lo scontro aggiungi il Carisma ai tiri per colpire con le armi.", "Bonus action, once per rest: for the whole fight add Charisma to weapon attack rolls.", "Acción adicional, una vez por descanso: durante todo el combate sumas Carisma a las tiradas de ataque con armas."],
  devaura: ["Gli alleati entro 2 esagoni da te hanno +1 CA.", "Allies within 2 hexes of you get +1 AC.", "Los aliados a 2 hexágonos de ti tienen +1 CA."],
  nimbus: ["A inizio turno i nemici adiacenti subiscono radiosi pari a Carisma + competenza.", "At the start of your turn adjacent enemies take radiant damage equal to Charisma + proficiency.", "Al inicio de tu turno los enemigos adyacentes reciben daño radiante igual a Carisma + competencia."],
  vow: ["Azione bonus, una volta per riposo: vantaggio a tutti i tuoi attacchi contro un nemico.", "Bonus action, once per rest: advantage on all your attacks against one enemy.", "Acción adicional, una vez por descanso: ventaja en todos tus ataques contra un enemigo."],
  avenger: ["+2 alla velocità.", "+2 speed.", "+2 a la velocidad."],
  soulavenger: ["+Carisma ai danni contro il nemico del Voto.", "+Charisma damage against your Vow target.", "+Carisma al daño contra el enemigo del Voto."],
  assassinate: ["Nel primo round hai vantaggio a tutti gli attacchi.", "Advantage on all attacks in the first round.", "Ventaja en todos los ataques en la primera ronda."],
  deadly: ["I dadi dell'Attacco furtivo diventano d8.", "Sneak Attack dice become d8.", "Los dados de Ataque furtivo pasan a d8."],
  cutthroat: ["+2 dadi di Attacco furtivo.", "+2 Sneak Attack dice.", "+2 dados de Ataque furtivo."],
  fasthands: ["Usi pozioni, bombe e pergamene come azione bonus.", "Use potions, bombs and scrolls as a bonus action.", "Usas pociones, bombas y pergaminos como acción adicional."],
  supreme: ["+2 alla velocità.", "+2 speed.", "+2 a la velocidad."],
  thiefref: ["+1 CA e +3 all'iniziativa.", "+1 AC and +3 initiative.", "+1 CA y +3 a la iniciativa."],
  multidef: ["+1 CA.", "+1 AC.", "+1 CA."],
  hordebreaker: ["Uccisore di colossi funziona due volte per turno.", "Colossus Slayer works twice per turn.", "Asesino de colosos funciona dos veces por turno."],
  dread: ["Aggiungi la Saggezza all'iniziativa; nel primo round il primo colpo con l'arma fa +1d8.", "Add Wisdom to initiative; in the first round your first weapon hit deals +1d8.", "Sumas Sabiduría a la iniciativa; en la primera ronda tu primer golpe con arma hace +1d8."],
  ironmind: ["Competenza nei tiri salvezza su Saggezza.", "Proficiency in Wisdom saving throws.", "Competencia en salvaciones de Sabiduría."],
  flurry: ["Una volta per turno, se manchi con un'arma, ritenti l'attacco.", "Once per turn, when you miss with a weapon, attack again.", "Una vez por turno, si fallas con un arma, repites el ataque."],
  sculpt: ["I tuoi incantesimi non danneggiano gli alleati.", "Your spells don't harm allies.", "Tus conjuros no dañan a los aliados."],
  empowered: ["+Intelligenza ai danni dei tuoi incantesimi.", "+Intelligence to your spell damage.", "+Inteligencia al daño de tus conjuros."],
  overchannel: ["+25% ai danni dei tuoi incantesimi.", "+25% spell damage.", "+25% al daño de tus conjuros."],
  arcaneward: ["In ogni scontro una barriera assorbe danni pari a 2 × livello + Intelligenza.", "In every fight a barrier absorbs damage equal to 2 × level + Intelligence.", "En cada combate una barrera absorbe daño igual a 2 × nivel + Inteligencia."],
  wardrecharge: ["Ogni incantesimo con slot ricarica la barriera di 2 + 2 × livello dell'incantesimo.", "Every slotted spell recharges the barrier by 2 + 2 × spell level.", "Cada conjuro con espacio recarga la barrera en 2 + 2 × nivel del conjuro."],
  spellres: ["+2 a tutti i tiri salvezza.", "+2 to all saving throws.", "+2 a todas las salvaciones."],
  disciple: ["Le tue cure danno 2 + livello dell'incantesimo PF in più.", "Your healing spells restore 2 + spell level extra HP.", "Tus curaciones dan 2 + nivel del conjuro PG extra."],
  blessedheal: ["Quando curi un alleato recuperi anche tu 2 + livello dell'incantesimo PF.", "When you heal an ally you also regain 2 + spell level HP.", "Cuando curas a un aliado tú también recuperas 2 + nivel del conjuro PG."],
  supremeheal: ["Le tue cure danno metà del tuo livello in PF in più.", "Your healing restores half your level in extra HP.", "Tus curaciones dan la mitad de tu nivel en PG extra."],
  warpriest: ["Azione bonus: un attacco con l'arma in più. Usi pari alla Saggezza (min. 1) per riposo lungo.", "Bonus action: one extra weapon attack. Uses equal to Wisdom (min. 1) per long rest.", "Acción adicional: un ataque con arma más. Usos iguales a Sabiduría (mín. 1) por descanso largo."],
  divinestrike: ["Una volta per turno, +1d8 ai danni con l'arma.", "Once per turn, +1d8 weapon damage.", "Una vez por turno, +1d8 al daño con arma."],
  battleavatar: ["−3 ai danni taglienti, perforanti e contundenti che subisci.", "−3 to slashing, piercing and bludgeoning damage you take.", "−3 al daño cortante, perforante y contundente que recibes."],
});

/* ---------- subclasses ---------- */
const SUBCLASSES = {
  fighter: {
    champion: {n: ["Campione", "Champion", "Campeón"], ic: "sword", d: ["Forza bruta e critici frequenti. Resiste quando è ferito.", "Raw might and frequent criticals. Holds on when wounded.", "Fuerza bruta y críticos frecuentes. Aguanta cuando está herido."], f: {3: ["impcrit"], 7: ["survivor"], 11: ["supcrit"]}},
    battlemaster: {n: ["Maestro di battaglia", "Battle Master", "Maestro de batalla"], ic: "burst", d: ["Tattico: dadi di superiorità per colpi extra che atterrano i nemici.", "Tactician: superiority dice for extra damage that knocks foes prone.", "Táctico: dados de superioridad para golpes que derriban enemigos."], f: {3: ["superiority"], 7: ["relentless"], 11: ["warlord"]}},
  },
  paladin: {
    devotion: {n: ["Giuramento di devozione", "Oath of Devotion", "Juramento de devoción"], ic: "sun", d: ["Il cavaliere luminoso: arma sacra e un'aura che protegge gli alleati.", "The shining knight: a sacred weapon and an aura that shields allies.", "El caballero luminoso: arma sagrada y un aura que protege a los aliados."], f: {3: ["sacredweapon"], 7: ["devaura"], 11: ["nimbus"]}},
    vengeance: {n: ["Giuramento di vendetta", "Oath of Vengeance", "Juramento de venganza"], ic: "eye", d: ["Il cacciatore implacabile: giura la fine di un nemico e lo insegue.", "The relentless hunter: swears an enemy's end and runs it down.", "El cazador implacable: jura el fin de un enemigo y lo persigue."], f: {3: ["vow"], 7: ["avenger"], 11: ["soulavenger"]}},
  },
  rogue: {
    assassin: {n: ["Assassino", "Assassin", "Asesino"], ic: "dagger", d: ["Colpisce per primo e fa male: vantaggio nel primo round, furtivo più letale.", "Strikes first and hard: advantage in round one, deadlier sneak attacks.", "Golpea primero y fuerte: ventaja en la primera ronda, furtivo más letal."], f: {3: ["assassinate"], 7: ["deadly"], 11: ["cutthroat"]}},
    thief: {n: ["Furfante", "Thief", "Ladrón"], ic: "wind", d: ["Mani rapide e piedi più rapidi: oggetti come azione bonus, più velocità.", "Quick hands, quicker feet: items as a bonus action, more speed.", "Manos rápidas y pies aún más: objetos como acción adicional, más velocidad."], f: {3: ["fasthands"], 7: ["supreme"], 11: ["thiefref"]}},
  },
  ranger: {
    hunter: {n: ["Cacciatore", "Hunter", "Cazador"], ic: "bow", d: ["Abbatte le prede ferite e regge gli scontri lunghi.", "Finishes wounded prey and lasts in long fights.", "Remata a las presas heridas y aguanta en combates largos."], f: {3: ["colossus"], 7: ["multidef"], 11: ["hordebreaker"]}},
    gloom: {n: ["Viandante delle tenebre", "Gloom Stalker", "Acechador sombrío"], ic: "eye", d: ["Agisce prima di tutti e colpisce dall'ombra nel primo round.", "Acts before everyone and strikes from the dark in round one.", "Actúa antes que nadie y golpea desde la sombra en la primera ronda."], f: {3: ["dread"], 7: ["ironmind"], 11: ["flurry"]}},
  },
  wizard: {
    evocation: {n: ["Scuola di invocazione", "School of Evocation", "Escuela de evocación"], ic: "flame", d: ["Fuoco e forza: incantesimi più potenti che risparmiano gli alleati.", "Fire and force: stronger spells that spare your allies.", "Fuego y fuerza: conjuros más potentes que no dañan a los aliados."], f: {3: ["sculpt"], 7: ["empowered"], 11: ["overchannel"]}},
    abjuration: {n: ["Scuola di abiurazione", "School of Abjuration", "Escuela de abjuración"], ic: "shield", d: ["Barriere arcane: assorbe i colpi e resiste alla magia.", "Arcane barriers: soaks blows and resists magic.", "Barreras arcanas: absorbe golpes y resiste la magia."], f: {3: ["arcaneward"], 7: ["wardrecharge"], 11: ["spellres"]}},
  },
  cleric: {
    life: {n: ["Dominio della vita", "Life Domain", "Dominio de la vida"], ic: "heart", d: ["Il guaritore: cure molto più forti.", "The healer: much stronger healing.", "El sanador: curaciones mucho más fuertes."], f: {3: ["disciple"], 7: ["blessedheal"], 11: ["supremeheal"]}},
    war: {n: ["Dominio della guerra", "War Domain", "Dominio de la guerra"], ic: "sword", d: ["Il sacerdote guerriero: attacchi extra e colpi divini.", "The warrior priest: extra attacks and divine strikes.", "El sacerdote guerrero: ataques extra y golpes divinos."], f: {3: ["warpriest"], 7: ["divinestrike"], 11: ["battleavatar"]}},
  },
};
const COMP_SUB = {brenna: "life", kael: "thief", ilyra: "evocation", fenn: "hunter", mira: "battlemaster", doran: "gloom", hrun: "devotion", nessa: "assassin"};
function subOf(c) {
  const T = SUBCLASSES[c.cls]; if (!T || c.lvl < 3) return null;
  if (!c.sub && c.id !== "pc") c.sub = T[COMP_SUB[c.id]] ? COMP_SUB[c.id] : Object.keys(T)[0];
  return T[c.sub] || null;
}
const subName = c => { const s = subOf(c); return s ? tr(s.n) : ""; };
featsOf = function (c) {
  const out = [], add = t => { for (let l = 1; l <= c.lvl; l++) (t[l] || []).forEach(f => { if (!out.includes(f)) out.push(f); }); };
  add(CLASS_FEATS[c.cls] || {}); const s = subOf(c); if (s) add(s.f); return out;
};
function newFeatsAt(c, L) { const s = subOf(c); return [...((CLASS_FEATS[c.cls] || {})[L] || []), ...(s && s.f[L] || [])].filter(f => f !== "asi"); }

/* ---------- derived numbers ---------- */
const attacksN = c => hasF(c, "extra3") ? 4 : hasF(c, "extra2") ? 3 : hasF(c, "extra") ? 2 : 1;
const cantripN = c => 1 + (c.lvl >= 5) + (c.lvl >= 11) + (c.lvl >= 17) + Math.floor(Math.max(0, c.lvl - 20) / 10);
const sneakN = c => (c.lvl <= 20 ? Math.ceil(c.lvl / 2) : 10 + Math.floor((c.lvl - 20) / 4)) + (hasF(c, "cutthroat") ? 2 : 0);
const sneakD = c => hasF(c, "deadly") ? 8 : 6;
const spellPow = c => 1 + Math.max(0, c.lvl - 10) * .03;
const supN = c => hasF(c, "warlord") ? 6 : hasF(c, "relentless") ? 5 : hasF(c, "superiority") ? 4 : 0;
const supD = c => hasF(c, "warlord") ? 12 : hasF(c, "relentless") ? 10 : 8;
const wardMax = c => 2 * c.lvl + abm(c, "int");
const subSpd = c => (hasF(c, "avenger") ? 2 : 0) + (hasF(c, "supreme") ? 2 : 0) + (hasF(c, "landstride") ? 1 : 0);
const subInit = c => (hasF(c, "dread") ? Math.max(0, abm(c, "wis")) : 0) + (hasF(c, "thiefref") ? 3 : 0);
const subSave = (c, ab) => (ab === "wis" && hasF(c, "ironmind") && !CL(c).saves.includes("wis") ? prof(c) : 0) + (hasF(c, "spellres") ? 2 : 0);
const resOf = (c, k) => { c.res = c.res || {}; if (c.res[k] == null) c.res[k] = k === "sup" ? supN(c) : k === "wp" ? Math.max(1, abm(c, "wis")) : 1; return c.res[k]; };
const _acOf = acOf; acOf = function (c) { return _acOf(c) + (hasF(c, "multidef") ? 1 : 0) + (hasF(c, "thiefref") ? 1 : 0); };
const _resetRes = resetRes; resetRes = function (c) { _resetRes(c); c.res.sup = supN(c); c.res.wp = Math.max(1, abm(c, "wis")); c.res.ind = 1; };
const _shortRest = shortRest; shortRest = function () { const r = _shortRest(); if (r) S.party.forEach(c => { if (c.res) { c.res.sup = supN(c); c.res.ind = 1; } }); return r; };

/* ---------- combat hooks (called from 40_combat_rules) ---------- */
function devAura(t) {
  if (t.side !== "p" || !CB) return 0;
  return CB.units.some(p => p.side === "p" && !p.down && p.hp > 0 && hasF(p.ref, "devaura") && dist(p, t) <= 2) ? 1 : 0;
}
function subAdv(a, t, o, res) {
  if (a.side === "p") {
    if (hasF(a.ref, "assassinate") && CB.round === 1 && !res.adv) { res.adv = true; res.why.push("assassin"); }
    if (t.cond && t.cond.vowed === a.uid && !res.adv) { res.adv = true; res.why.push("vow"); }
  }
  if (t.side === "p" && hasF(t.ref, "elusive") && res.adv) res.adv = false;
  return res;
}
function subDmg(a, t, o, crit) {
  const c = a.ref; let x = 0; if (!o.weapon) return 0; const k = crit ? 2 : 1;
  if (a.cond.man && resOf(c, "sup") > 0) { c.res.sup--; delete a.cond.man; x += rnd(supD(c)) * k; logL(`${a.name}: ${tr(ABIL.maneuver.n)}`);
    if (!t.boss && !t.obj && !t.cond.prone && !saveRoll(t, "str", 8 + prof(c) + Math.max(abm(c, "str"), abm(c, "dex")))) { t.cond.prone = 1; floatAt(t, tr(["A terra!", "Prone!", "¡Derribado!"]), "#ffd38a", 1); } }
  if (hasF(c, "dread") && CB.round === 1 && !a.dreadUsed) { a.dreadUsed = 1; x += roll(k + "d8").total; }
  if (hasF(c, "divinestrike") && a.dsT !== CB.turnTok) { a.dsT = CB.turnTok; x += roll(k + "d8").total; }
  if (hasF(c, "radiant") && !o.ranged) x += roll(k + "d8").total;
  if (hasF(c, "soulavenger") && t.cond.vowed === a.uid) x += Math.max(1, abm(c, "cha"));
  return x;
}
function subTurnStart(u) {
  if (u.side !== "p" || u.down || u.hp <= 0) return; const c = u.ref;
  if (hasF(c, "survivor") && u.hp < u.maxhp / 2) heal(u, 5 + Math.max(0, abm(c, "con")));
}
async function subNimbus(u) {
  if (u.side !== "p" || u.down || !hasF(u.ref, "nimbus")) return;
  const c = u.ref, n = Math.max(1, abm(c, "cha")) + prof(c);
  for (const f of foes().filter(f => dist(f, u) <= 1)) { if (!CB || CB.ended) return; logL(`${tr(FEATS.nimbus)} → ${f.name}`); await applyDmg(f, n, "radiant", u); }
}
saveRoll = function (t, ab, dc, cov = 0) {
  let b; if (t.side === "p") { b = saveBonus(t.ref, ab); if (t.cond.bless) b += rnd(4); } else { b = (t.def.sv || 0) + (S.diff === 2 ? 1 : 0); }
  b += cov || 0;
  const d20 = () => { let r = rnd(20); if (t.side === "p" && t.ref.race === "halfling" && r === 1) r = rnd(20); return r; };
  let r = d20(); if (t.side === "p" && ab === "dex" && hasF(t.ref, "evasion")) r = Math.max(r, d20());
  let ok = r + b >= dc; logL(`${t.name}: ${abS(ab)} ${r}${sgn(b)}=${r + b} vs ${dc} — ${ok ? T_("saveOk") : T_("saveKo")}`);
  if (!ok && t.side === "p" && hasF(t.ref, "indomitable") && resOf(t.ref, "ind") > 0) {
    t.ref.res.ind--; r = d20(); ok = r + b >= dc; floatAt(t, tr(FEATS.indomitable), "#ffd38a", 1);
    logL(`${t.name}: ${tr(FEATS.indomitable)} ${r}${sgn(b)}=${r + b} — ${ok ? T_("saveOk") : T_("saveKo")}`);
  }
  return ok;
};
const _attackRoll = attackRoll;
attackRoll = async function (a, t, o) {
  if (!o) return _attackRoll(a, t, o);
  let oo = o;
  if (a.side === "p" && o.weapon) { const c = a.ref; oo = Object.assign({}, o);
    if (hasF(c, "supcrit")) oo.crit = Math.min(oo.crit || 20, 18);
    if (a.cond.sacred) oo.hit = (oo.hit || 0) + Math.max(1, abm(c, "cha")); }
  const once = async () => { const b = devAura(t); t.ac += b; try { return await _attackRoll(a, t, oo); } finally { t.ac -= b; } };
  let d = await once();
  if (!d && a.side === "p" && o.weapon && hasF(a.ref, "flurry") && CB && !CB.ended && a.flT !== CB.turnTok && t.hp > 0) {
    a.flT = CB.turnTok; floatAt(a, tr(FEATS.flurry), "#9fd0ff", 1); await sleep(200); d = await once();
  }
  return d;
};
const _applyDmgP = applyDmg;
applyDmg = async function (t, amt, type, src) {
  if (src && src.side === "p" && src.casting && t !== src) { const c = src.ref;
    if (t.side === "p" && hasF(c, "sculpt")) return;
    if (t.side === "e") { amt *= spellPow(c); if (hasF(c, "empowered")) amt += Math.max(0, abm(c, "int")); if (hasF(c, "overchannel")) amt *= 1.25; } }
  if (t.side === "p" && amt > 0) { const c = t.ref;
    if (hasF(c, "battleavatar") && ["slash", "pierce", "blunt"].includes(type)) amt = Math.max(0, amt - 3);
    if (hasF(c, "arcaneward")) { if (t.ward == null) t.ward = wardMax(c);
      if (t.ward > 0) { const ab = Math.min(t.ward, Math.round(amt)); t.ward -= ab; amt -= ab; if (ab) { floatAt(t, "◈ −" + ab, "#9fc4ff"); logL(`${t.name}: ${tr(FEATS.arcaneward)} −${ab}`); } }
      if (amt <= 0) { placeTokens(); return; } } }
  return _applyDmgP(t, amt, type, src);
};
const _castSpell = castSpell;
castSpell = async function (u, key, target) {
  const sp = SPELLS[key]; u.casting = 1; if (CB) CB.healCtx = {u, lv: sp.lv};
  try { await _castSpell(u, key, target); } finally { u.casting = 0; if (CB) CB.healCtx = null; }
  if (sp.lv > 0 && hasF(u.ref, "wardrecharge")) { const m = wardMax(u.ref); if (u.ward == null) u.ward = m; u.ward = Math.min(m, u.ward + 2 + 2 * sp.lv); floatAt(u, "◈ " + u.ward, "#9fc4ff"); }
};
const _heal = heal;
heal = function (t, amt) {
  const x = CB && CB.healCtx;
  if (!x || t.side !== "p" || x.inH) return _heal(t, amt);
  const c = x.u.ref;
  if (hasF(c, "disciple")) amt += 2 + x.lv;
  if (hasF(c, "supremeheal")) amt += Math.floor(c.lvl / 2);
  _heal(t, amt);
  if (hasF(c, "blessedheal") && t !== x.u && !x.bh && !x.u.down) { x.bh = x.inH = 1; _heal(x.u, 2 + x.lv); x.inH = 0; }
};

/* ---------- new abilities ---------- */
Object.assign(ABIL, {
  maneuver: {n: ["Manovra", "Maneuver", "Maniobra"], d: ["Gratis: il prossimo colpo con l'arma spende un dado di superiorità: lo aggiunge ai danni e il bersaglio fa un TS Forza o cade a terra.", "Free: your next weapon hit spends a superiority die: add it to damage, and the target makes a STR save or falls prone.", "Gratis: tu siguiente golpe con arma gasta un dado de superioridad: lo sumas al daño y el objetivo hace una salvación de FUE o cae derribado."], cost: "free"},
  sacredweapon: {n: FEATS.sacredweapon, d: FEAT_D.sacredweapon, cost: "bon"},
  vow: {n: FEATS.vow, d: FEAT_D.vow, cost: "bon", tgt: "enemy", r: 12},
  warpriest: {n: FEATS.warpriest, d: FEAT_D.warpriest, cost: "bon"},
});
Object.assign(ABIL_IC, {maneuver: "burst", sacredweapon: "sun", vow: "eye", warpriest: "sword"});
const _abilitiesOf = abilitiesOf;
abilitiesOf = function (u) {
  const L = _abilitiesOf(u), c = u.ref;
  if (hasF(c, "superiority")) L.push("maneuver"); if (hasF(c, "sacredweapon")) L.push("sacredweapon");
  if (hasF(c, "vow")) L.push("vow"); if (hasF(c, "warpriest")) L.push("warpriest");
  return L;
};
const _canUse = canUse;
canUse = function (u, s) {
  const c = u.ref;
  if (s && s.k === "it" && !isOil(s.key) && hasF(c, "fasthands") && u.bon > 0 && (S.inv[s.key] || 0) > 0) return true;
  if (s && s.k === "ab") {
    if (s.key === "maneuver") return !u.cond.man && resOf(c, "sup") > 0;
    if (s.key === "sacredweapon") return u.bon > 0 && !u.cond.sacred && resOf(c, "ch") > 0;
    if (s.key === "vow") return u.bon > 0 && resOf(c, "ch") > 0;
    if (s.key === "warpriest") return u.bon > 0 && resOf(c, "wp") > 0;
  }
  return _canUse(u, s);
};
const _useAbility = useAbility;
useAbility = async function (u, key, target) {
  const c = u.ref;
  switch (key) {
    case "maneuver": u.cond.man = 1; floatAt(u, tr(ABIL.maneuver.n), "#ffd38a", 1); placeTokens(); return;
    case "sacredweapon": u.bon--; c.res.ch--; u.cond.sacred = 1; fxHeal(u, "#ffd38a"); floatAt(u, tr(FEATS.sacredweapon), "#ffd38a", 1); logL(`${u.name}: ${tr(FEATS.sacredweapon)}`); placeTokens(); return;
    case "vow": u.bon--; c.res.ch--; foes().forEach(f => { if (f.cond.vowed === u.uid) delete f.cond.vowed; }); target.cond.vowed = u.uid; fxImpact(target, "mark", false); floatAt(target, tr(FEATS.vow), "#ff8f6a", 1); logL(`${u.name}: ${tr(FEATS.vow)} → ${target.name}`); placeTokens(); return;
    case "warpriest": u.bon--; c.res.wp--; u.atkLeft++; floatAt(u, tr(FEATS.warpriest), "#ffd38a", 1); logL(`${u.name}: ${tr(FEATS.warpriest)}`); placeTokens(); return;
  }
  return _useAbility(u, key, target);
};
const _useItemC = useItemC;
useItemC = async function (u, key, target) {
  if (!isOil(key) && hasF(u.ref, "fasthands") && u.bon > 0) { u.bon--; u.act++; }
  return _useItemC(u, key, target);
};
const _actionsOf = actionsOf;
actionsOf = function (u) {
  const L = _actionsOf(u), c = u.ref;
  L.forEach(a => {
    if (a.s.k === "ab" && a.s.key === "maneuver") a.cnt = resOf(c, "sup");
    if (a.s.k === "ab" && (a.s.key === "sacredweapon" || a.s.key === "vow")) a.cnt = resOf(c, "ch");
    if (a.s.k === "ab" && a.s.key === "warpriest") a.cnt = resOf(c, "wp");
    if (a.s.k === "it" && hasF(c, "fasthands") && !isOil(a.s.key)) a.cost = "b";
  });
  return L;
};

/* ---------- subclass choice ---------- */
function showSubPick(after) {
  const p = pc(), T = SUBCLASSES[p.cls]; if (!T) return after && after();
  const lv = l => `<small class="sub-lv">${tr(["Liv.", "Lv.", "Niv."])} ${l}</small>`;
  const m = modal(`<h2>${tr(["Scegli la sottoclasse", "Choose your subclass", "Elige tu subclase"])}</h2>
    <p style="color:var(--muted);margin-top:-4px">${tr(["La scelta è definitiva e dà nuovi privilegi ai livelli 3, 7 e 11.", "The choice is permanent and grants new features at levels 3, 7 and 11.", "La elección es definitiva y da nuevos rasgos en los niveles 3, 7 y 11."])}</p>
    <div class="opts">${Object.keys(T).map(k => { const s = T[k];
      return `<button class="opt sub-opt" data-sub="${k}">${medHTML(s.ic)}<span style="min-width:0"><b>${tr(s.n)}</b><span>${tr(s.d)}</span>
        <span class="sub-f">${Object.keys(s.f).map(l => s.f[l].map(f => `<i>${lv(l)} <b>${tr(FEATS[f])}</b> — ${tr(FEAT_D[f] || ["", "", ""])}</i>`).join("")).join("")}</span></span></button>`; }).join("")}</div>`, {center: 1, locked: 1});
  m.querySelectorAll("[data-sub]").forEach(b => b.onclick = () => {
    p.sub = b.dataset.sub; p.res = p.res || {}; p.res.sup = supN(p); recalc(p);
    toast(tr(T[p.sub].n)); closeModal(); saveGame(true); if (after) after();
  });
}
const _showLevelUp = showLevelUp;
showLevelUp = function () {
  const p = pc();
  if (p && p.lvl >= 3 && !p.sub && SUBCLASSES[p.cls]) return showSubPick(() => _showLevelUp());
  return _showLevelUp();
};
const _renderStoryP = renderStory;
renderStory = function () {
  _renderStoryP.apply(this, arguments);
  const p = S && pc();
  if (p && p.lvl >= 3 && !p.sub && SUBCLASSES[p.cls] && !document.querySelector(".modal")) showSubPick(() => renderStory());
};
