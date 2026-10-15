"use strict";
/* =================== LANGUAGE =================== */
var GAME_VERSION = "dev"; // replaced by tools/build.mjs
var IS_APP = false;      // true only in the Android build (enables the update check)
let LG = 0; // 0 it, 1 en, 2 es
const LANG_CODES = ["it","en","es"];
const tr = a => a == null ? "" : (Array.isArray(a) ? (a[LG] != null ? a[LG] : a[0]) : String(a));
const UI = {
  tag:["Quaranta giorni senza alba.","Forty days without a dawn.","Cuarenta días sin amanecer."],
  sub:["Cronache","Chronicles","Crónicas"],
  newg:["Nuova partita","New game","Nueva partida"],
  cont:["Continua","Continue","Continuar"],
  lang:["Lingua","Language","Idioma"],
  diff:["Difficoltà","Difficulty","Dificultad"],
  d0:["Racconto","Story","Relato"], d1:["Normale","Normal","Normal"], d2:["Spietata","Merciless","Despiadada"],
  foot:["GDR tattico a turni ispirato alle regole della 5ª edizione","Turn-based tactical RPG inspired by 5th edition rules","RPG táctico por turnos inspirado en las reglas de 5ª edición"],
  cc:["Creazione del personaggio","Character creation","Creación de personaje"],
  name:["Nome","Name","Nombre"], namePh:["Il tuo nome","Your name","Tu nombre"],
  race:["Razza","Race","Raza"], cls:["Classe","Class","Clase"], bgr:["Background","Background","Trasfondo"],
  abil:["Caratteristiche","Ability scores","Características"], summary:["Riepilogo","Summary","Resumen"],
  pts:["Punti rimasti","Points left","Puntos restantes"],
  rec:["Distribuzione consigliata","Recommended spread","Reparto recomendado"],
  pbHelp:["Acquisto a punti (27): ogni punteggio va da 8 a 15. I bonus razziali si aggiungono dopo.","Point buy (27): each score ranges 8–15. Racial bonuses are added afterwards.","Compra por puntos (27): cada puntuación va de 8 a 15. Los bonos raciales se suman después."],
  next:["Avanti","Next","Siguiente"], back:["Indietro","Back","Atrás"],
  begin:["Inizia l'avventura","Begin the adventure","Comenzar la aventura"],
  hp:["PF","HP","PG"], ac:["CA","AC","CA"], lvl:["Liv.","Lv.","Niv."], gp:["mo","gp","po"],
  spd:["Velocità","Speed","Velocidad"], prof:["Competenza","Proficiency","Competencia"], init:["Iniziativa","Initiative","Iniciativa"],
  skills:["Abilità","Skills","Habilidades"], feats:["Privilegi","Features","Rasgos"], spells:["Incantesimi","Spells","Conjuros"],
  saves:["Tiri salvezza","Saving throws","Salvaciones"], weapons:["Armi","Weapons","Armas"],
  menu:["Menu","Menu","Menú"], party:["Gruppo","Party","Grupo"], inv:["Inventario","Inventory","Inventario"], journal:["Diario","Journal","Diario"],
  settings:["Opzioni","Options","Opciones"], save:["Salva ora","Save now","Guardar ahora"], saved:["Partita salvata","Game saved","Partida guardada"],
  noStore:["Il salvataggio non è disponibile in questo browser.","Saving is not available in this browser.","El guardado no está disponible en este navegador."],
  toTitle:["Torna al titolo","Back to title","Volver al título"], close:["Chiudi","Close","Cerrar"],
  goOn:["Continua","Continue","Continuar"],
  success:["Successo","Success","Éxito"], failure:["Fallimento","Failure","Fracaso"],
  dc:["CD","DC","CD"], adv:["vantaggio","advantage","ventaja"],
  rested:["Il gruppo riposa: punti ferita, slot e capacità ripristinati.","The party rests: hit points, slots and abilities restored.","El grupo descansa: puntos de golpe, espacios y aptitudes restaurados."],
  noGold:["Non hai abbastanza monete.","Not enough coin.","No tienes suficientes monedas."],
  buy:["Compra","Buy","Comprar"], use:["Usa","Use","Usar"], equip:["Equipaggia","Equip","Equipar"], whoQ:["Su chi?","On whom?","¿A quién?"],
  shop:["Bottega","Shop","Tienda"], youHave:["Hai","You have","Tienes"],
  xp:["PE","XP","PX"], nextLv:["prossimo livello","next level","siguiente nivel"],
  levelUp:["Livello superiore!","Level up!","¡Subida de nivel!"],
  asi:["Aumento dei punteggi: scegli una caratteristica (+2, max 20)","Ability score improvement: choose one score (+2, max 20)","Mejora de característica: elige una (+2, máx. 20)"],
  joined:["si unisce al gruppo","joins the party","se une al grupo"],
  got:["Ottenuto","Received","Obtenido"], lost:["Speso","Spent","Gastado"],
  active:["in corso","active","en curso"], done:["completata","completed","completada"],
  noQuests:["Nessuna missione per ora.","No quests yet.","Sin misiones por ahora."],
  empty:["Lo zaino è vuoto.","Your pack is empty.","La mochila está vacía."],
  bonusW:["Bonus arma","Weapon bonus","Bono de arma"], bonusA:["Bonus armatura","Armor bonus","Bono de armadura"],
  partyDown:["a terra","down","caído"],
  round:["Round","Round","Ronda"],
  move:["Movimento","Move","Movimiento"], action:["Azione","Action","Acción"], bonus:["Bonus","Bonus","Adicional"],
  endTurn:["Fine turno","End turn","Fin del turno"],
  magic:["Magie","Spells","Conjuros"], abil2:["Capacità","Abilities","Aptitudes"], items:["Oggetti","Items","Objetos"],
  cancel:["Annulla","Cancel","Cancelar"],
  victory:["Vittoria","Victory","Victoria"], defeat:["Sconfitta","Defeat","Derrota"],
  defeatTxt:["Il buio si chiude su di voi. Ma la storia non è ancora scritta.","Darkness closes over you. But the story is not yet written.","La oscuridad se cierra sobre vosotros. Pero la historia aún no está escrita."],
  retry:["Riprova lo scontro","Retry the battle","Reintentar el combate"],
  enemyTurn:["Turno nemico","Enemy turn","Turno enemigo"],
  tapMove:["Tocca una casella per muoverti, un nemico per attaccare.","Tap a tile to move, an enemy to attack.","Toca una casilla para moverte, un enemigo para atacar."],
  tapTarget:["Scegli un bersaglio.","Choose a target.","Elige un objetivo."],
  tapArea:["Scegli il centro. Tocca di nuovo per confermare.","Pick the centre. Tap again to confirm.","Elige el centro. Toca de nuevo para confirmar."],
  tapTile:["Scegli una casella libera.","Choose a free tile.","Elige una casilla libre."],
  slotsL:["Slot","Slots","Espacios"], cantrip:["trucchetto","cantrip","truco"],
  hits:["colpisce","hits","golpea"], misses:["manca","misses","falla"], crit:["CRITICO!","CRITICAL!","¡CRÍTICO!"],
  heals:["recupera","regains","recupera"], down:["è a terra!","is down!","¡cae!"], dies:["è sconfitto","is defeated","es derrotado"],
  saveOk:["resiste","resists","resiste"], saveKo:["non resiste","fails","falla"],
  sleeps:["si addormenta","falls asleep","se duerme"], stunned:["è paralizzato","is stunned","queda paralizado"],
  surprised:["Nemici sorpresi!","Enemies surprised!","¡Enemigos sorprendidos!"],
  miss:["mancato","miss","fallo"], asleepS:["Zz","Zz","Zz"],
  rewards:["Ricompense","Rewards","Recompensas"],
  allyRange:["Alleato a portata","Ally in reach","Aliado al alcance"],
  aoeWarn:["colpisce anche gli alleati","also hits allies","también afecta a aliados"],
  over:["Fine","The End","Fin"],
  credits:["Grazie per aver giocato a Dark Days Chronicles.","Thank you for playing Dark Days Chronicles.","Gracias por jugar a Dark Days Chronicles."],
  install:["Su Android: menu del browser → «Aggiungi a schermata Home» per giocare a schermo intero.","On Android: browser menu → “Add to Home screen” to play full screen.","En Android: menú del navegador → «Añadir a pantalla de inicio» para jugar a pantalla completa."],
  act:["Atto","Act","Acto"],
  free:["gratis","free","gratis"],
  uses:["usi","uses","usos"],
  pool:["riserva","pool","reserva"],
  armed:["pronta","ready","lista"],
  rollFor:["tira","rolls","tira"],
};
const T_ = k => tr(UI[k]);

const AB = ["str","dex","con","int","wis","cha"];
const ABN = {
  str:[["FOR","Forza"],["STR","Strength"],["FUE","Fuerza"]],
  dex:[["DES","Destrezza"],["DEX","Dexterity"],["DES","Destreza"]],
  con:[["COS","Costituzione"],["CON","Constitution"],["CON","Constitución"]],
  int:[["INT","Intelligenza"],["INT","Intelligence"],["INT","Inteligencia"]],
  wis:[["SAG","Saggezza"],["WIS","Wisdom"],["SAB","Sabiduría"]],
  cha:[["CAR","Carisma"],["CHA","Charisma"],["CAR","Carisma"]],
};
const abS = k => ABN[k][LG][0], abL = k => ABN[k][LG][1];

const SKILLS = {
  ath:[["Atletica","Athletics","Atletismo"],"str"],
  ste:[["Furtività","Stealth","Sigilo"],"dex"],
  sle:[["Rapidità di mano","Sleight of Hand","Juego de manos"],"dex"],
  arc:[["Arcano","Arcana","Arcanos"],"int"],
  his:[["Storia","History","Historia"],"int"],
  inv:[["Indagare","Investigation","Investigación"],"int"],
  rel:[["Religione","Religion","Religión"],"int"],
  ins:[["Intuizione","Insight","Perspicacia"],"wis"],
  med:[["Medicina","Medicine","Medicina"],"wis"],
  per:[["Percezione","Perception","Percepción"],"wis"],
  sur:[["Sopravvivenza","Survival","Supervivencia"],"wis"],
  dec:[["Inganno","Deception","Engaño"],"cha"],
  inti:[["Intimidire","Intimidation","Intimidación"],"cha"],
  pers:[["Persuasione","Persuasion","Persuasión"],"cha"],
};
const SOCIAL = ["dec","inti","pers","ins"];

/* =================== ICONS =================== */
const ICONS = {
  sword:'<path d="M20 4 9 15M20 4h-5M20 4v5M7 13l4 4M4.5 19.5l3.5-3.5"/>',
  shield:'<path d="M12 3l7 3v5c0 5-3.4 8.2-7 10-3.6-1.8-7-5-7-10V6z"/><path d="M12 7v10M8 11h8"/>',
  dagger:'<path d="M18 3l3 3-9.5 9.5-3-3zM7.5 11.5l5 5M4 20l4.5-4.5"/>',
  bow:'<path d="M5 3c9 1 15 7 16 16M5 3l16 16"/><path d="M4 20l8-8M13 6h5v5"/>',
  star:'<path d="M12 2.5l2.6 6.4 6.9.5-5.3 4.4 1.7 6.7L12 16.8l-5.9 3.7 1.7-6.7L2.5 9.4l6.9-.5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  skull:'<path d="M12 3a7 7 0 0 0-7 7v3l2 2v4h10v-4l2-2v-3a7 7 0 0 0-7-7z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/><path d="M10 19v-2M14 19v-2"/>',
  fang:'<path d="M3 6l4.5 12L12 9l4.5 9L21 6"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  crown:'<path d="M3 18h18l-1.6-10-4.9 4.6L12 5l-2.5 7.6L4.6 8z"/>',
  flame:'<path d="M12 2c3 5 7 7 7 12a7 7 0 0 1-14 0c0-3 1.6-5 3-6 0 3 2 4 2 4 0-4 2-7 2-10z"/>',
  helm:'<path d="M5 20v-8a7 7 0 0 1 14 0v8z"/><path d="M5 13h14M12 13v7"/>',
  drop:'<path d="M12 3s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12z"/>',
  leaf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19 14 10"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  hand:'<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V4a1.5 1.5 0 0 1 3 0v6M13 10V5a1.5 1.5 0 0 1 3 0v7M16 12v-2a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.6L7 14"/>',
};
const icon = k => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.star}</svg>`;

/* =================== RACES =================== */
const RACES = {
  human:{n:["Umano","Human","Humano"], bonus:{str:1,dex:1,con:1,int:1,wis:1,cha:1}, spd:6, skill:"per",
    d:["Versatili e ostinati. +1 a tutte le caratteristiche, competenza in Percezione.","Versatile and stubborn. +1 to every ability, proficient in Perception.","Versátiles y tenaces. +1 a todas las características, competencia en Percepción."]},
  elf:{n:["Elfo","Elf","Elfo"], bonus:{dex:2,int:1}, spd:6, skill:"per", trait:"fey",
    d:["Antichi e vigili. +2 DES, +1 INT. Immuni al sonno magico e alla paralisi dei ghoul.","Ancient and watchful. +2 DEX, +1 INT. Immune to magical sleep and ghoul paralysis.","Antiguos y atentos. +2 DES, +1 INT. Inmunes al sueño mágico y a la parálisis de los necrófagos."]},
  dwarf:{n:["Nano","Dwarf","Enano"], bonus:{con:2,wis:1}, spd:5, trait:"dwarf",
    d:["Duri come la roccia. +2 COS, +1 SAG, +1 PF per livello, resistenza al veleno. Velocità 5.","Hard as bedrock. +2 CON, +1 WIS, +1 HP per level, poison resistance. Speed 5.","Duros como la roca. +2 CON, +1 SAB, +1 PG por nivel, resistencia al veneno. Velocidad 5."]},
  halfling:{n:["Halfling","Halfling","Mediano"], bonus:{dex:2,cha:1}, spd:5, trait:"lucky",
    d:["Piccoli e fortunati. +2 DES, +1 CAR. Fortunato: ritira gli 1 naturali sul d20. Velocità 5.","Small and lucky. +2 DEX, +1 CHA. Lucky: reroll natural 1s on the d20. Speed 5.","Pequeños y afortunados. +2 DES, +1 CAR. Suertudo: repite los 1 naturales en el d20. Velocidad 5."]},
  halforc:{n:["Mezzorco","Half-Orc","Semiorco"], bonus:{str:2,con:1}, spd:6, skill:"inti", trait:"orc",
    d:["Feroci e tenaci. +2 FOR, +1 COS. Resistenza implacabile (resta a 1 PF una volta per scontro), critici selvaggi.","Fierce and enduring. +2 STR, +1 CON. Relentless endurance (stay at 1 HP once per fight), savage criticals.","Feroces y tenaces. +2 FUE, +1 CON. Aguante incansable (quedas a 1 PG una vez por combate), críticos salvajes."]},
  tiefling:{n:["Tiefling","Tiefling","Tiflin"], bonus:{cha:2,int:1}, spd:6, trait:"fire",
    d:["Sangue infernale. +2 CAR, +1 INT, resistenza al fuoco. Guardati con sospetto ovunque.","Infernal blood. +2 CHA, +1 INT, fire resistance. Eyed with suspicion everywhere.","Sangre infernal. +2 CAR, +1 INT, resistencia al fuego. Mirados con recelo en todas partes."]},
};

/* =================== CLASSES =================== */
const CLASSES = {
  fighter:{n:["Guerriero","Fighter","Guerrero"], icon:"sword", hd:10, armor:"heavy", shield:true, prim:"str", saves:["str","con"], skills:["ath","per"], weapons:["longsword","javelin"],
    rec:{str:15,dex:13,con:14,int:8,wis:12,cha:10},
    d:["Maestro delle armi. Recupero, Impeto d'azione, Attacco extra al 5° livello. Il più resistente.","Master of arms. Second Wind, Action Surge, Extra Attack at level 5. The toughest.","Maestro de armas. Nuevas energías, Oleada de acción, Ataque extra a nivel 5. El más resistente."]},
  paladin:{n:["Paladino","Paladin","Paladín"], icon:"sun", hd:10, armor:"heavy", shield:true, prim:"str", cast:"cha", caster:"half", saves:["wis","cha"], skills:["ath","pers"], weapons:["longsword","javelin"],
    rec:{str:15,dex:10,con:14,int:8,wis:10,cha:14},
    spells:{2:["bless","curewounds"]},
    d:["Cavaliere giurato. Imposizione delle mani, Punizione divina, Aura di protezione. Ottimo oratore.","Sworn knight. Lay on Hands, Divine Smite, Aura of Protection. A fine speaker.","Caballero juramentado. Imposición de manos, Castigo divino, Aura de protección. Buen orador."]},
  rogue:{n:["Ladro","Rogue","Pícaro"], icon:"dagger", hd:8, armor:"light", prim:"dex", saves:["dex","int"], skills:["ste","sle","dec","inv"], weapons:["rapier","shortbow"],
    rec:{str:8,dex:15,con:14,int:12,wis:10,cha:13},
    d:["Lama nell'ombra. Attacco furtivo, Azione scaltra, Schivata prodigiosa. Tante abilità.","Blade in the dark. Sneak Attack, Cunning Action, Uncanny Dodge. Many skills.","Hoja en la sombra. Ataque furtivo, Acción astuta, Esquiva asombrosa. Muchas habilidades."]},
  ranger:{n:["Ranger","Ranger","Explorador"], icon:"bow", hd:10, armor:"medium", prim:"dex", cast:"wis", caster:"half", saves:["str","dex"], skills:["sur","per","ste"], weapons:["longbow","shortsword"],
    rec:{str:10,dex:15,con:14,int:8,wis:14,cha:10},
    spells:{2:["huntersmark","curewounds"]},
    d:["Cacciatore dei confini. Nemico prescelto (non morti), Marchio del cacciatore, Uccisore di colossi.","Hunter of the borderlands. Favored enemy (undead), Hunter's Mark, Colossus Slayer.","Cazador de las fronteras. Enemigo predilecto (muertos vivientes), Marca del cazador, Asesino de colosos."]},
  wizard:{n:["Mago","Wizard","Mago"], icon:"star", hd:6, armor:"mage", prim:"int", cast:"int", caster:"full", saves:["int","wis"], skills:["arc","inv","his"], weapons:["quarterstaff"],
    rec:{str:8,dex:14,con:14,int:15,wis:12,cha:8},
    spells:{1:["firebolt","magicmissile","sleep","burninghands"],3:["scorchingray","mistystep"],5:["fireball"],7:["icestorm"]},
    d:["Studioso dell'arcano. Fragile ma devastante: Sonno, Dardo incantato, Palla di fuoco.","Scholar of the arcane. Fragile but devastating: Sleep, Magic Missile, Fireball.","Erudito de lo arcano. Frágil pero devastador: Dormir, Proyectil mágico, Bola de fuego."]},
  cleric:{n:["Chierico","Cleric","Clérigo"], icon:"shield", hd:8, armor:"medium", shield:true, prim:"wis", cast:"wis", caster:"full", saves:["wis","cha"], skills:["rel","ins","med"], weapons:["mace"],
    rec:{str:14,dex:10,con:14,int:8,wis:15,cha:10},
    spells:{1:["sacredflame","curewounds","healingword","bless","guidingbolt"],3:["spiritualweapon"],5:["spiritguardians","masshealingword"]},
    d:["Voce del divino. Cure, Benedizione, Scacciare non morti, Guardiani spirituali.","Voice of the divine. Healing, Bless, Turn Undead, Spirit Guardians.","Voz de lo divino. Curación, Bendecir, Expulsar muertos vivientes, Guardianes espirituales."]},
};
const FULL = {1:[2,0,0,0],2:[3,0,0,0],3:[4,2,0,0],4:[4,3,0,0],5:[4,3,2,0],6:[4,3,3,0],7:[4,3,3,1]};
const HALF = {1:[0,0,0,0],2:[2,0,0,0],3:[3,0,0,0],4:[3,0,0,0],5:[4,2,0,0],6:[4,2,0,0],7:[4,3,0,0]};
// XP needed for each level. Chapter I caps at level 7; later chapters raise MAXLV via maxLevel.
const XPT = [0,0,300,900,2000,4000,7000,11000,15000,20000,26000,33000,41000];
let MAXLV = 7;

/* feature names */
const FEATS = {
  secondwind:["Recupero","Second Wind","Nuevas energías"], dueling:["Stile: duello (+2 danni)","Style: dueling (+2 damage)","Estilo: duelo (+2 daño)"],
  actionsurge:["Impeto d'azione","Action Surge","Oleada de acción"], impcrit:["Critico migliorato (19–20)","Improved Critical (19–20)","Crítico mejorado (19–20)"],
  extra:["Attacco extra","Extra Attack","Ataque extra"], asi:["Aumento dei punteggi","Ability Score Improvement","Mejora de característica"],
  lay:["Imposizione delle mani","Lay on Hands","Imposición de manos"], smite:["Punizione divina","Divine Smite","Castigo divino"], aura:["Aura di protezione","Aura of Protection","Aura de protección"],
  sneak:["Attacco furtivo","Sneak Attack","Ataque furtivo"], cunning:["Azione scaltra","Cunning Action","Acción astuta"], uncanny:["Schivata prodigiosa","Uncanny Dodge","Esquiva asombrosa"],
  favored:["Nemico prescelto: non morti (+2)","Favored enemy: undead (+2)","Enemigo predilecto: muertos vivientes (+2)"], archery:["Stile: tiro (+2 a distanza)","Style: archery (+2 ranged)","Estilo: tiro (+2 a distancia)"], colossus:["Uccisore di colossi","Colossus Slayer","Asesino de colosos"],
  turn:["Scacciare non morti","Turn Undead","Expulsar muertos vivientes"],
  arcane:["Armatura magica permanente","Permanent Mage Armor","Armadura de mago permanente"],
};
const CLASS_FEATS = {
  fighter:{1:["secondwind","dueling"],2:["actionsurge"],3:["impcrit"],4:["asi"],5:["extra"],6:["asi"]},
  paladin:{1:["lay"],2:["smite","dueling"],4:["asi"],5:["extra"],6:["aura"]},
  rogue:{1:["sneak"],2:["cunning"],4:["asi"],5:["uncanny"]},
  ranger:{1:["favored"],2:["archery"],3:["colossus"],4:["asi"],5:["extra"]},
  wizard:{1:["arcane"],4:["asi"]},
  cleric:{2:["turn"],4:["asi"]},
};

/* =================== BACKGROUNDS =================== */
const BGS = {
  soldier:{n:["Soldato","Soldier","Soldado"], skills:["ath","inti"], gold:15, d:["Hai servito sotto un vessillo che ora nessuno ricorda. Atletica, Intimidire.","You served under a banner no one remembers. Athletics, Intimidation.","Serviste bajo un estandarte que ya nadie recuerda. Atletismo, Intimidación."]},
  acolyte:{n:["Accolito","Acolyte","Acólito"], skills:["ins","rel"], gold:10, d:["Cresciuto tra i ceri di Sant'Aurel. Intuizione, Religione.","Raised among the candles of Saint Aurel. Insight, Religion.","Criado entre los cirios de San Aurel. Perspicacia, Religión."]},
  criminal:{n:["Criminale","Criminal","Criminal"], skills:["dec","ste"], gold:20, d:["Conosci i vicoli e chi li abita. Inganno, Furtività.","You know the alleys and who lives in them. Deception, Stealth.","Conoces los callejones y a quien vive en ellos. Engaño, Sigilo."]},
  sage:{n:["Sapiente","Sage","Sabio"], skills:["arc","his"], gold:10, d:["Hai passato più notti sui libri che sotto le stelle. Arcano, Storia.","You spent more nights over books than under stars. Arcana, History.","Pasaste más noches sobre libros que bajo las estrellas. Arcanos, Historia."]},
  noble:{n:["Nobile","Noble","Noble"], skills:["pers","his"], gold:40, d:["Un nome antico e un forziere quasi vuoto. Persuasione, Storia.","An old name and a nearly empty coffer. Persuasion, History.","Un apellido antiguo y un cofre casi vacío. Persuasión, Historia."]},
  outlander:{n:["Viandante","Outlander","Forastero"], skills:["sur","med"], gold:10, d:["Le strade selvagge sono state la tua casa. Sopravvivenza, Medicina.","The wild roads were your home. Survival, Medicine.","Los caminos salvajes fueron tu hogar. Supervivencia, Medicina."]},
};

/* =================== COMPANIONS =================== */
const COMPS = {
  brenna:{name:"Brenna Ironvow", race:"dwarf", cls:"cleric", ab:{str:14,dex:10,con:16,int:10,wis:16,cha:10}, skills:["rel","ins","med","ath"], weapons:["warhammer"]},
  kael:{name:"Kael Varn", race:"human", cls:"rogue", ab:{str:10,dex:16,con:13,int:12,wis:11,cha:14}, skills:["ste","sle","dec","inv","per"], weapons:["rapier","shortbow"]},
  ilyra:{name:"Ilyra", race:"elf", cls:"wizard", ab:{str:8,dex:15,con:13,int:17,wis:12,cha:10}, skills:["arc","inv","his","per"], weapons:["quarterstaff"]},
};

/* =================== WEAPONS =================== */
const WEAP = {
  longsword:{n:["Spada lunga","Longsword","Espada larga"], d:"1d8", st:"str", r:1, t:"slash"},
  warhammer:{n:["Martello da guerra","Warhammer","Martillo de guerra"], d:"1d8", st:"str", r:1, t:"blunt"},
  javelin:{n:["Giavellotto","Javelin","Jabalina"], d:"1d6", st:"str", r:5, ranged:1, t:"pierce"},
  rapier:{n:["Stocco","Rapier","Estoque"], d:"1d8", st:"fin", r:1, t:"pierce"},
  shortbow:{n:["Arco corto","Shortbow","Arco corto"], d:"1d6", st:"dex", r:8, ranged:1, t:"pierce"},
  longbow:{n:["Arco lungo","Longbow","Arco largo"], d:"1d8", st:"dex", r:10, ranged:1, t:"pierce"},
  shortsword:{n:["Spada corta","Shortsword","Espada corta"], d:"1d6", st:"fin", r:1, t:"slash"},
  quarterstaff:{n:["Bastone","Quarterstaff","Bastón"], d:"1d6", st:"str", r:1, t:"blunt"},
  mace:{n:["Mazza","Mace","Maza"], d:"1d6", st:"str", r:1, t:"blunt"},
};

/* =================== SPELLS =================== */
const SPELLS = {
  firebolt:{lv:0, n:["Dardo di fuoco","Fire Bolt","Descarga de fuego"], tgt:"enemy", r:10, d:["Attacco a distanza, 1d10 fuoco (2d10 dal 5°).","Ranged attack, 1d10 fire (2d10 from level 5).","Ataque a distancia, 1d10 fuego (2d10 desde nivel 5)."]},
  sacredflame:{lv:0, n:["Fiamma sacra","Sacred Flame","Llama sagrada"], tgt:"enemy", r:8, d:["TS Destrezza o 1d8 radiosi (2d8 dal 5°).","DEX save or 1d8 radiant (2d8 from level 5).","Salvación de DES o 1d8 radiante (2d8 desde nivel 5)."]},
  magicmissile:{lv:1, n:["Dardo incantato","Magic Missile","Proyectil mágico"], tgt:"enemy", r:12, d:["Colpisce sempre: 3d4+3 forza.","Never misses: 3d4+3 force.","Nunca falla: 3d4+3 fuerza."]},
  sleep:{lv:1, n:["Sonno","Sleep","Dormir"], tgt:"area", r:9, rad:1, d:["Addormenta nemici per 5d8 PF totali (area 3×3). Non morti immuni.","Puts enemies to sleep up to 5d8 total HP (3×3 area). Undead immune.","Duerme enemigos hasta 5d8 PG en total (área 3×3). Muertos vivientes inmunes."]},
  burninghands:{lv:1, n:["Mani brucianti","Burning Hands","Manos ardientes"], tgt:"area", r:2, rad:1, ff:1, d:["Area 3×3 vicina: TS DES, 3d6 fuoco (metà se riesce).","Nearby 3×3 area: DEX save, 3d6 fire (half on success).","Área 3×3 cercana: salvación DES, 3d6 fuego (mitad si la supera)."]},
  curewounds:{lv:1, n:["Cura ferite","Cure Wounds","Curar heridas"], tgt:"ally", r:1, d:["Tocco: cura 1d8 + modificatore.","Touch: heals 1d8 + modifier.","Toque: cura 1d8 + modificador."]},
  healingword:{lv:1, bonus:1, n:["Parola guaritrice","Healing Word","Palabra curativa"], tgt:"ally", r:8, d:["Azione bonus a distanza: cura 1d4 + modificatore. Rialza gli alleati a terra.","Bonus action at range: heals 1d4 + modifier. Raises downed allies.","Acción adicional a distancia: cura 1d4 + modificador. Levanta aliados caídos."]},
  bless:{lv:1, n:["Benedizione","Bless","Bendecir"], tgt:"none", d:["Tutto il gruppo aggiunge 1d4 ai tiri per colpire e ai tiri salvezza per lo scontro.","The whole party adds 1d4 to attack rolls and saves for the fight.","Todo el grupo suma 1d4 a ataques y salvaciones durante el combate."]},
  guidingbolt:{lv:1, n:["Dardo tracciante","Guiding Bolt","Saeta guía"], tgt:"enemy", r:12, d:["Attacco: 4d6 radiosi; il prossimo attacco contro il bersaglio ha vantaggio.","Attack: 4d6 radiant; next attack against the target has advantage.","Ataque: 4d6 radiante; el siguiente ataque contra el objetivo tiene ventaja."]},
  huntersmark:{lv:1, bonus:1, n:["Marchio del cacciatore","Hunter's Mark","Marca del cazador"], tgt:"enemy", r:18, d:["Azione bonus: +1d6 danni a ogni tuo colpo sul bersaglio.","Bonus action: +1d6 damage on each of your hits against the target.","Acción adicional: +1d6 de daño en cada golpe tuyo contra el objetivo."]},
  scorchingray:{lv:2, n:["Raggio rovente","Scorching Ray","Rayo abrasador"], tgt:"enemy", r:12, d:["Tre raggi, ognuno un attacco da 2d6 fuoco.","Three rays, each a 2d6 fire attack.","Tres rayos, cada uno un ataque de 2d6 fuego."]},
  mistystep:{lv:2, bonus:1, n:["Passo velato","Misty Step","Paso brumoso"], tgt:"tile", r:6, d:["Azione bonus: teletrasporto fino a 6 caselle.","Bonus action: teleport up to 6 tiles.","Acción adicional: teletransporte hasta 6 casillas."]},
  spiritualweapon:{lv:2, bonus:1, n:["Arma spirituale","Spiritual Weapon","Arma espiritual"], tgt:"none", d:["Azione bonus: evoca un'arma; nei turni seguenti attacca come azione bonus (1d8 + mod).","Bonus action: summon a weapon; on later turns strike as a bonus action (1d8 + mod).","Acción adicional: invoca un arma; en turnos siguientes ataca como acción adicional (1d8 + mod)."]},
  fireball:{lv:3, n:["Palla di fuoco","Fireball","Bola de fuego"], tgt:"area", r:12, rad:2, ff:1, d:["Area 5×5: TS DES, 8d6 fuoco (metà se riesce).","5×5 area: DEX save, 8d6 fire (half on success).","Área 5×5: salvación DES, 8d6 fuego (mitad si la supera)."]},
  spiritguardians:{lv:3, n:["Guardiani spirituali","Spirit Guardians","Guardianes espirituales"], tgt:"none", d:["I nemici che iniziano il turno entro 2 caselle subiscono 3d8 radiosi (TS SAG dimezza).","Enemies starting their turn within 2 tiles take 3d8 radiant (WIS save halves).","Los enemigos que empiezan su turno a 2 casillas reciben 3d8 radiante (salvación SAB a la mitad)."]},
  masshealingword:{lv:3, bonus:1, n:["Parola guaritrice di massa","Mass Healing Word","Palabra curativa en masa"], tgt:"none", d:["Azione bonus: tutto il gruppo recupera 1d4 + mod e si rialza.","Bonus action: the whole party regains 1d4 + mod and stands up.","Acción adicional: todo el grupo recupera 1d4 + mod y se levanta."]},
  icestorm:{lv:4, n:["Tempesta di ghiaccio","Ice Storm","Tormenta de hielo"], tgt:"area", r:12, rad:2, ff:1, d:["Area 5×5: TS DES, 2d8+4d6 (metà se riesce).","5×5 area: DEX save, 2d8+4d6 (half on success).","Área 5×5: salvación DES, 2d8+4d6 (mitad si la supera)."]},
};

/* =================== ITEMS =================== */
const ITEMS = {
  potion:{n:["Pozione di guarigione","Healing potion","Poción de curación"], d:["Cura 2d4+2 PF.","Heals 2d4+2 HP.","Cura 2d4+2 PG."], price:25, use:"heal", dice:"2d4+2"},
  greater:{n:["Pozione superiore","Greater potion","Poción mayor"], d:["Cura 4d4+4 PF.","Heals 4d4+4 HP.","Cura 4d4+4 PG."], price:60, use:"heal", dice:"4d4+4"},
  flask:{n:["Fuoco dell'alchimista","Alchemist's fire","Fuego de alquimista"], d:["Da lanciare in combattimento: 2d6 fuoco a un nemico entro 5 caselle.","Throw in combat: 2d6 fire to an enemy within 5 tiles.","Para lanzar en combate: 2d6 fuego a un enemigo a 5 casillas."], price:15, use:"throw"},
  w1:{n:["Arma rifinita +1","Fine weapon +1","Arma refinada +1"], d:["+1 a colpire e ai danni con le armi.","+1 to hit and damage with weapons.","+1 al ataque y daño con armas."], price:200, use:"equip", slot:"w", v:1},
  a1:{n:["Piastre rinforzate +1","Reinforced plates +1","Placas reforzadas +1"], d:["+1 alla Classe Armatura (massimo +2).","+1 to Armor Class (max +2).","+1 a la Clase de Armadura (máximo +2)."], price:180, use:"equip", slot:"a", v:1},
  w2:{n:["Arma dei Custodi +2","Sunwarden weapon +2","Arma de los Custodios +2"], d:["+2 a colpire e ai danni con le armi.","+2 to hit and damage with weapons.","+2 al ataque y daño con armas."], price:550, use:"equip", slot:"w", v:2},
  dawnblade:{n:["Lama dell'Aurora (+1)","Dawn Blade (+1)","Hoja de la Aurora (+1)"], d:["La spada di Sir Aldric. +1 a colpire e ai danni.","Sir Aldric's sword. +1 to hit and damage.","La espada de Sir Aldric. +1 al ataque y daño."], use:"equip", slot:"w", v:1},
  letter:{n:["Lettera di Seraphine","Seraphine's letter","Carta de Seraphine"], d:["Sigillata con cera grigia. Apre le porte di Vesperia.","Sealed with grey wax. Opens the gates of Vesperia.","Sellada con cera gris. Abre las puertas de Vesperia."], quest:1},
  key:{n:["Chiave dell'Alba","Key of Dawn","Llave del Alba"], d:["Una chiave d'oro a forma di raggio di sole. È calda.","A golden key shaped like a sunbeam. It is warm.","Una llave de oro con forma de rayo de sol. Está caliente."], quest:1},
  coin:{n:["Moneta della Corona Cava","Hollow Crown coin","Moneda de la Corona Hueca"], d:["Argento annerito, inciso con una corona vuota.","Blackened silver stamped with an empty crown.","Plata ennegrecida con una corona vacía grabada."], quest:1},
};
Object.assign(ITEMS, {
  scroll_fire:{n:["Pergamena: Palla di fuoco","Scroll: Fireball","Pergamino: Bola de fuego"], d:["Chiunque può leggerla in combattimento: area 5×5, TS DES CD 15, 8d6 fuoco.","Anyone can read it in combat: 5×5 area, DEX save DC 15, 8d6 fire.","Cualquiera puede leerlo en combate: área 5×5, salvación DES CD 15, 8d6 fuego."], price:150, use:"scroll", spell:"fireball", tgt:"area", r:12, rad:2},
  scroll_heal:{n:["Pergamena: Cura di gruppo","Scroll: Mass Cure","Pergamino: Curación en grupo"], d:["In combattimento: tutto il gruppo recupera 2d8+2 PF e si rialza.","In combat: the whole party regains 2d8+2 HP and stands up.","En combate: todo el grupo recupera 2d8+2 PG y se levanta."], price:110, use:"scroll", spell:"massheal", tgt:"none"},
  ring_prot:{n:["Anello di protezione","Ring of Protection","Anillo de protección"], d:["Accessorio: +1 alla CA e a tutti i tiri salvezza.","Trinket: +1 to AC and all saving throws.","Accesorio: +1 a la CA y a todas las salvaciones."], price:450, use:"equip", slot:"t"},
  amulet_health:{n:["Amuleto della salute","Amulet of Health","Amuleto de salud"], d:["Accessorio: la tua Costituzione diventa 19.","Trinket: your Constitution becomes 19.","Accesorio: tu Constitución pasa a ser 19."], price:600, use:"equip", slot:"t", setAb:["con", 19]},
  gauntlets_ogre:{n:["Guanti della forza dell'orco","Gauntlets of Ogre Power","Guanteletes de fuerza de ogro"], d:["Accessorio: la tua Forza diventa 19.","Trinket: your Strength becomes 19.","Accesorio: tu Fuerza pasa a ser 19."], price:600, use:"equip", slot:"t", setAb:["str", 19]},
  headband_int:{n:["Fascia dell'intelletto","Headband of Intellect","Diadema del intelecto"], d:["Accessorio: la tua Intelligenza diventa 19.","Trinket: your Intelligence becomes 19.","Accesorio: tu Inteligencia pasa a ser 19."], price:600, use:"equip", slot:"t", setAb:["int", 19]},
  boots_wind:{n:["Stivali del vento","Boots of the Wind","Botas del viento"], d:["Accessorio: +2 alla velocità.","Trinket: +2 speed.","Accesorio: +2 a la velocidad."], price:380, use:"equip", slot:"t"},
  cloak_displ:{n:["Mantello di dislocazione","Cloak of Displacement","Capa de desplazamiento"], d:["Accessorio: il primo attacco contro di te in ogni round ha svantaggio.","Trinket: the first attack against you each round has disadvantage.","Accesorio: el primer ataque contra ti cada ronda tiene desventaja."], price:520, use:"equip", slot:"t"},
  periapt:{n:["Periapto della chiusura delle ferite","Periapt of Wound Closure","Periapto de cierre de heridas"], d:["Accessorio: se sei sotto metà PF, all'inizio del tuo turno recuperi 2 PF.","Trinket: below half HP, you regain 2 HP at the start of your turn.","Accesorio: por debajo de la mitad de PG, recuperas 2 PG al inicio de tu turno."], price:400, use:"equip", slot:"t"},
  sun_talisman:{n:["Talismano del sole","Sun Talisman","Talismán del sol"], d:["Accessorio: i colpi con l'arma infliggono +1d4 danni ai non morti.","Trinket: weapon hits deal +1d4 damage to undead.","Accesorio: los golpes con arma infligen +1d4 de daño a muertos vivientes."], price:300, use:"equip", slot:"t"},
  pearl_power:{n:["Perla del potere","Pearl of Power","Perla de poder"], d:["Accessorio per incantatori: +1 slot incantesimo (di 2° livello dal 3° livello).","Caster trinket: +1 spell slot (2nd level from character level 3).","Accesorio de lanzador: +1 espacio de conjuro (de 2º nivel desde nivel 3)."], price:500, use:"equip", slot:"t"},
  eye_hawk:{n:["Lente del falco","Hawk's Lens","Lente del halcón"], d:["Accessorio: +2 ai tiri per colpire a distanza con le armi.","Trinket: +2 to hit with ranged weapon attacks.","Accesorio: +2 al ataque a distancia con armas."], price:350, use:"equip", slot:"t"},
});
const FEATLIST = {
  sharpshooter:{n:["Tiratore scelto","Sharpshooter","Tirador experto"], d:["I tuoi attacchi a distanza con l'arma ignorano la copertura. Sblocca «Colpo potente» a distanza: −5 a colpire, +10 danni.","Your ranged weapon attacks ignore cover. Unlocks ranged “Power attack”: −5 to hit, +10 damage.","Tus ataques a distancia con arma ignoran la cobertura. Desbloquea «Golpe poderoso» a distancia: −5 al ataque, +10 de daño."], ic:"bow"},
  gwm:{n:["Maestro d'armi","Weapon Master","Maestro de armas"], d:["Sblocca «Colpo potente» in mischia: −5 a colpire, +10 danni. Quando abbatti un nemico in mischia ottieni un attacco extra come azione bonus.","Unlocks melee “Power attack”: −5 to hit, +10 damage. When you drop an enemy in melee you get an extra attack as a bonus action.","Desbloquea «Golpe poderoso» cuerpo a cuerpo: −5 al ataque, +10 de daño. Al abatir a un enemigo cuerpo a cuerpo obtienes un ataque extra como acción adicional."], ic:"sword"},
  tough:{n:["Robusto","Tough","Duro"], d:["+2 punti ferita per livello.","+2 hit points per level.","+2 puntos de golpe por nivel."], ic:"heart"},
  alert:{n:["Allerta","Alert","Alerta"], d:["+5 all'iniziativa: agisci quasi sempre per primo.","+5 to initiative: you almost always act first.","+5 a la iniciativa: casi siempre actúas primero."], ic:"eye"},
  mobile:{n:["Mobile","Mobile","Móvil"], d:["+2 alla velocità e non provochi mai attacchi d'opportunità.","+2 speed and you never provoke opportunity attacks.","+2 a la velocidad y nunca provocas ataques de oportunidad."], ic:"wind"},
  sentinel:{n:["Sentinella","Sentinel","Centinela"], d:["I tuoi attacchi d'opportunità funzionano anche contro chi si disimpegna, e se colpisci il nemico si ferma sul posto.","Your opportunity attacks work even against creatures that disengage, and a hit stops the enemy in its tracks.","Tus ataques de oportunidad funcionan incluso contra quien se retira, y si aciertas el enemigo se detiene."], ic:"shield"},
};
const COMP_FEAT = {brenna: "tough", kael: "mobile", ilyra: "alert"};
const LOOT = {
  mill:["eye_hawk"], cem:["sun_talisman"], varga:["periapt"], varga_small:["periapt"], bandits:["cloak_displ"], tower:["pearl_power"], doran:["boots_wind"],
  duke:["ring_prot"], vault_boss:["w2","scroll_fire"], vault_boss_hard:["w2","scroll_fire"], vault_guard:["greater"], keeper:["amulet_health"], ser_guards:["headband_int"], pass:["gauntlets_ogre"], jailers:["scroll_fire","scroll_heal"],
};
const SHOPS = {
  ashford:{n:["Bottega di Mara la Vecchia","Old Mara's shop","Tienda de la vieja Mara"], items:["potion","flask","scroll_heal","a1"]},
  vesperia:{n:["Mercato delle Candele","Candle Market","Mercado de las Velas"], items:["potion","greater","flask","scroll_heal","scroll_fire","w1","a1","w2","boots_wind","ring_prot"]},
};

/* =================== FOES =================== */
const FOES = {
  famished:{n:["Morto affamato","Famished dead","Muerto hambriento"], hp:10, ac:10, spd:4, ic:"skull", xp:75, sv:0, undead:1, atk:[{n:["Artigli","Claws","Garras"], b:2, d:"1d6", r:1, t:"slash"}]},
  wolf:{n:["Lupo d'ombra","Shadow wolf","Lobo de sombra"], hp:11, ac:13, spd:8, ic:"fang", xp:50, sv:1, pack:1, atk:[{n:["Morso","Bite","Mordisco"], b:4, d:"2d4+2", r:1, t:"pierce"}]},
  goblin:{n:["Goblin","Goblin","Goblin"], hp:7, ac:15, spd:6, ic:"dagger", xp:50, sv:1, atk:[{n:["Scimitarra","Scimitar","Cimitarra"], b:4, d:"1d6+2", r:1, t:"slash"}]},
  gobarcher:{n:["Goblin arciere","Goblin archer","Goblin arquero"], hp:7, ac:13, spd:6, ic:"bow", xp:50, sv:1, atk:[{n:["Arco corto","Shortbow","Arco corto"], b:4, d:"1d6+2", r:8, t:"pierce", ranged:1}]},
  snik:{n:["Snik, capo goblin","Snik the goblin boss","Snik, jefe goblin"], hp:24, ac:17, spd:6, ic:"crown", xp:200, sv:2, atk:[{n:["Scimitarra","Scimitar","Cimitarra"], b:4, d:"1d6+2", r:1, t:"slash", k:2}]},
  skeleton:{n:["Scheletro","Skeleton","Esqueleto"], hp:13, ac:13, spd:6, ic:"skull", xp:50, sv:1, undead:1, vuln:"blunt", atk:[{n:["Spada corta","Shortsword","Espada corta"], b:4, d:"1d6+2", r:1, t:"pierce"}]},
  skelarcher:{n:["Scheletro arciere","Skeleton archer","Esqueleto arquero"], hp:13, ac:13, spd:6, ic:"bow", xp:50, sv:1, undead:1, vuln:"blunt", atk:[{n:["Arco corto","Shortbow","Arco corto"], b:4, d:"1d6+2", r:8, t:"pierce", ranged:1}]},
  zombie:{n:["Zombi","Zombie","Zombi"], hp:22, ac:8, spd:4, ic:"skull", xp:50, sv:0, undead:1, atk:[{n:["Schianto","Slam","Golpe"], b:3, d:"1d6+1", r:1, t:"blunt"}]},
  cultist:{n:["Pallido","Pale cultist","Pálido"], hp:9, ac:12, spd:6, ic:"eye", xp:25, sv:0, atk:[{n:["Falcetto","Sickle","Hoz"], b:3, d:"1d6+1", r:1, t:"slash"}]},
  acolyte:{n:["Accolito della Corona","Crown acolyte","Acólito de la Corona"], hp:14, ac:12, spd:6, ic:"flame", xp:100, sv:1, atk:[{n:["Pugnale","Dagger","Daga"], b:2, d:"1d4", r:1, t:"pierce"}], spells:[{n:["Dardo d'ombra","Shadow bolt","Saeta de sombra"], b:4, d:"2d6", r:8, t:"necrotic", p:.75}]},
  ghoul:{n:["Ghoul","Ghoul","Necrófago"], hp:22, ac:12, spd:6, ic:"fang", xp:200, sv:1, undead:1, atk:[{n:["Artigli paralizzanti","Paralyzing claws","Garras paralizantes"], b:4, d:"2d4+2", r:1, t:"slash", para:10}]},
  varga:{n:["Varga il Pallido","Varga the Pale","Varga el Pálido"], hp:52, ac:14, spd:6, ic:"crown", boss:1, xp:450, sv:2, atk:[{n:["Pugnale ricurvo","Curved dagger","Daga curva"], b:5, d:"2d4+3", r:1, t:"pierce", k:2}], spells:[{n:["Prosciugamento pallido","Pale drain","Drenaje pálido"], b:5, d:"2d8", r:6, t:"necrotic", p:.4, drain:1}]},
  bandit:{n:["Bandito","Bandit","Bandido"], hp:11, ac:12, spd:6, ic:"dagger", xp:25, sv:0, atk:[{n:["Sciabola","Sabre","Sable"], b:3, d:"1d6+1", r:1, t:"slash"}]},
  xbow:{n:["Balestriere","Crossbowman","Ballestero"], hp:11, ac:12, spd:6, ic:"bow", xp:25, sv:0, atk:[{n:["Balestra","Crossbow","Ballesta"], b:3, d:"1d8+1", r:8, t:"pierce", ranged:1}]},
  mira:{n:["Mira Benda","Mira Patch","Mira Parche"], hp:55, ac:15, spd:6, ic:"crown", boss:1, xp:450, sv:2, atk:[{n:["Spada","Sword","Espada"], b:5, d:"1d8+3", r:1, t:"slash", k:2}]},
  shadow:{n:["Ombra","Shadow","Sombra"], hp:16, ac:12, spd:8, ic:"eye", xp:100, sv:1, vuln:"radiant", atk:[{n:["Tocco gelido","Chill touch","Toque gélido"], b:4, d:"2d6+2", r:1, t:"necrotic"}]},
  warden:{n:["Guardiano della Lanterna","Lantern Warden","Guardián de la Linterna"], hp:60, ac:16, spd:6, ic:"helm", boss:1, xp:450, sv:2, res:"fire", atk:[{n:["Mazza ardente","Burning maul","Maza ardiente"], b:5, d:"1d10+3", r:1, t:"fire", k:2}]},
  doran:{n:["Doran Varn","Doran Varn","Doran Varn"], hp:32, ac:14, spd:6, ic:"dagger", boss:1, xp:200, sv:2, atk:[{n:["Lame gemelle","Twin blades","Hojas gemelas"], b:5, d:"1d8+3", r:1, t:"slash", k:2}]},
  dukeguard:{n:["Guardia senz'ombra","Shadowless guard","Guardia sin sombra"], hp:40, ac:16, spd:6, ic:"helm", xp:200, sv:2, atk:[{n:["Alabarda","Halberd","Alabarda"], b:5, d:"1d10+3", r:1, t:"slash"}]},
  rat:{n:["Ratto gigante","Giant rat","Rata gigante"], hp:7, ac:12, spd:6, ic:"fang", xp:25, sv:0, atk:[{n:["Morso","Bite","Mordisco"], b:4, d:"1d4+2", r:1, t:"pierce"}]},
  drowned:{n:["Annegato","Drowned one","Ahogado"], hp:30, ac:10, spd:5, ic:"drop", xp:150, sv:1, undead:1, atk:[{n:["Abbraccio","Grasp","Abrazo"], b:4, d:"2d6+2", r:1, t:"blunt"}]},
  armor:{n:["Armatura animata","Animated armor","Armadura animada"], hp:33, ac:18, spd:5, ic:"helm", xp:200, sv:2, construct:1, atk:[{n:["Pugno d'acciaio","Steel fist","Puño de acero"], b:4, d:"1d6+2", r:1, t:"blunt", k:2}]},
  keeper:{n:["Custode Annegato","Drowned Keeper","Guardián Ahogado"], hp:110, ac:14, spd:6, ic:"crown", boss:1, xp:700, sv:3, undead:1, vuln:"radiant", atk:[{n:["Artiglio nero","Black claw","Garra negra"], b:6, d:"2d8+3", r:1, t:"necrotic", k:2}], spells:[{n:["Marea gelida","Freezing tide","Marea helada"], save:"con", dc:14, d:"3d8", rad:1, r:8, t:"cold", p:.35}]},
  fanatic:{n:["Fanatico della Corona","Crown fanatic","Fanático de la Corona"], hp:40, ac:13, spd:6, ic:"flame", xp:450, sv:2, atk:[{n:["Lama sacrificale","Sacrificial blade","Hoja sacrificial"], b:5, d:"1d8+3", r:1, t:"slash", k:2}], spells:[{n:["Lancia d'ombra","Shadow lance","Lanza de sombra"], b:5, d:"2d8", r:8, t:"necrotic", p:.45}]},
  hknight:{n:["Cavaliere Cavo","Hollow Knight","Caballero Hueco"], hp:65, ac:17, spd:6, ic:"helm", xp:700, sv:3, construct:1, atk:[{n:["Spadone","Greatsword","Mandoble"], b:6, d:"1d10+4", r:1, t:"slash", k:2}]},
  shade:{n:["Riflesso d'ombra","Mirror shade","Reflejo de sombra"], hp:36, ac:13, spd:7, ic:"eye", xp:200, sv:2, vuln:"radiant", atk:[{n:["Lama riflessa","Mirrored blade","Hoja reflejada"], b:5, d:"2d6+3", r:1, t:"necrotic"}]},
  jailer:{n:["Carceriere","Jailer","Carcelero"], hp:45, ac:15, spd:6, ic:"helm", xp:300, sv:2, atk:[{n:["Mazza chiodata","Morningstar","Lucero del alba"], b:5, d:"1d10+3", r:1, t:"blunt", k:2}]},
  obsidian:{n:["Custode d'Ossidiana","Obsidian Warden","Guardián de Obsidiana"], hp:115, ac:17, spd:5, ic:"helm", boss:1, xp:700, sv:3, construct:1, vuln:"blunt", res:"fire", atk:[{n:["Pugni di vetro nero","Black glass fists","Puños de vidrio negro"], b:6, d:"2d8+3", r:1, t:"blunt", k:2}], spells:[{n:["Pioggia di schegge","Shard burst","Lluvia de esquirlas"], save:"dex", dc:14, d:"3d6", rad:1, r:6, t:"slash", p:.35}]},
  seraphine:{n:["Seraphine, Madre della Notte","Seraphine, Mother of Night","Seraphine, Madre de la Noche"], hp:175, ac:16, spd:6, ic:"crown", boss:1, xp:1800, sv:4,
    atk:[{n:["Bastone del lutto","Staff of mourning","Báculo del luto"], b:7, d:"2d6+4", r:1, t:"blunt", k:2}],
    spells:[{n:["Lancia della notte","Night lance","Lanza de la noche"], b:7, d:"4d8", r:8, t:"necrotic", p:.4},{n:["Velo della notte","Veil of night","Velo de la noche"], save:"dex", dc:15, d:"3d8", rad:1, r:8, t:"necrotic", p:.35}]},
  avatar:{n:["Avatar di Morrhan","Avatar of Morrhan","Avatar de Morrhan"], hp:240, ac:16, spd:6, ic:"fang", boss:1, xp:3000, sv:4, res:"necrotic", vuln:"radiant",
    atk:[{n:["Fauci","Maw","Fauces"], b:8, d:"2d10+5", r:2, t:"pierce", k:2}],
    aura:{n:["Fame del dio","Hunger of the god","Hambre del dios"], save:"con", dc:15, d:"2d10", rad:2, t:"necrotic", every:2}},
  avatarw:{n:["Avatar di Morrhan (incatenato)","Avatar of Morrhan (chained)","Avatar de Morrhan (encadenado)"], hp:160, ac:15, spd:5, ic:"fang", boss:1, xp:3000, sv:3, res:"necrotic", vuln:"radiant",
    atk:[{n:["Fauci","Maw","Fauces"], b:7, d:"2d10+4", r:2, t:"pierce", k:2}],
    aura:{n:["Fame del dio","Hunger of the god","Hambre del dios"], save:"con", dc:14, d:"2d8", rad:2, t:"necrotic", every:3}},
};

/* =================== ENCOUNTERS =================== */
const MAPS = {
  road:{g:"#2a2620", ob:"#4a4237", obr:"30%", n:5},
  forest:{g:"#1d211c", ob:"#d9d2c0", obr:"50%", n:8},
  mill:{g:"#2b241c", ob:"#5b4630", obr:"12%", n:6},
  grave:{g:"#1f1e22", ob:"#57545e", obr:"35% 35% 8% 8%", n:8},
  stones:{g:"#232027", ob:"#6b6575", obr:"18%", n:6},
  bridge:{g:"#25221d", ob:"#4d4436", obr:"10%", n:5},
  tower:{g:"#211a2a", ob:"#3c2f50", obr:"50%", n:5},
  roof:{g:"#2b2124", ob:"#55363d", obr:"10%", n:4},
  palace:{g:"#2a2018", ob:"#7a5f2c", obr:"50%", n:6},
  sewer:{g:"#1b2420", ob:"#33463d", obr:"20%", n:6},
  water:{g:"#16232b", ob:"#2e4655", obr:"18%", n:6},
  archive:{g:"#261f18", ob:"#4f3b25", obr:"6%", n:8},
  snow:{g:"#2b2a2e", ob:"#5d5c63", obr:"40%", n:7},
  fort:{g:"#1b1719", ob:"#3e3238", obr:"8%", n:5},
  mirror:{g:"#16141c", ob:"#5a4f7a", obr:"8%", n:6},
  dungeon:{g:"#1c1a18", ob:"#46403a", obr:"14%", n:6},
  throne:{g:"#1a1218", ob:"#4b2a3a", obr:"50%", n:4},
};
const ENC = {
  cart:{map:"road", foes:["famished","famished","famished"], gold:5},
  wolves:{map:"forest", foes:["wolf","wolf","wolf"]},
  mill:{map:"mill", foes:["goblin","goblin","gobarcher","snik"], gold:20},
  cem:{map:"grave", foes:["skeleton","skeleton","skelarcher","zombie"]},
  camp:{map:"forest", foes:["cultist","cultist","cultist","cultist","acolyte","acolyte"], gold:15},
  camp_easy:{map:"forest", foes:["cultist","cultist","acolyte"], gold:15},
  varga:{map:"stones", foes:["varga","cultist","cultist","ghoul"], gold:30},
  varga_small:{map:"stones", foes:["varga","ghoul"], gold:30},
  bandits:{map:"bridge", foes:["bandit","bandit","xbow","xbow","mira"], gold:20},
  shadows:{map:"road", foes:["shadow","shadow","shadow"]},
  tower:{map:"tower", foes:["warden","acolyte","acolyte","shadow","shadow"], gold:30},
  doran:{map:"roof", foes:["doran","cultist","cultist","acolyte"], gold:20},
  duke:{map:"palace", foes:["dukeguard","dukeguard","dukeguard","acolyte"], gold:40},
  sewer:{map:"sewer", foes:["rat","rat","rat","rat","drowned"]},
  drowned:{map:"water", foes:["drowned","drowned","drowned","drowned"]},
  guardians:{map:"water", foes:["armor","armor","armor"]},
  keeper:{map:"water", foes:["keeper","shadow","shadow","drowned"], gold:60},
  ser_guards:{map:"archive", foes:["fanatic","fanatic","acolyte","cultist","cultist"]},
  pass:{map:"snow", foes:["hknight","hknight","wolf","wolf"]},
  gate:{map:"fort", foes:["hknight","hknight","fanatic","acolyte","acolyte"], gold:30},
  gate_easy:{map:"fort", foes:["hknight","fanatic","acolyte","cultist"], gold:30},
  cistern:{map:"sewer", foes:["drowned","drowned","fanatic","fanatic"]},
  mirror:{map:"mirror", foes:["shade","shade","shade","shade","shade"]},
  mirror_easy:{map:"mirror", foes:["shade","shade","shade","shade"]},
  jailers:{map:"dungeon", foes:["jailer","jailer","jailer","fanatic"], gold:40},
  seraphine:{map:"throne", foes:["seraphine","shade","shade","fanatic"]},
  avatar:{map:"throne", foes:["avatar","shade","shade"]},
  vault1:{map:"dungeon", foes:["skeleton","skeleton","skeleton","skelarcher","skelarcher","armor"], gold:25},
  vault_guard:{map:"dungeon", foes:["armor","armor","armor"]},
  vault_boss:{map:"mirror", foes:["obsidian","shade","shade"], gold:80},
  vault_boss_hard:{map:"mirror", foes:["obsidian","shade","shade","shadow","shadow"], gold:80},
  avatar_weak:{map:"throne", foes:["avatarw"]},
};
