/* =================== SAGA TOOLKIT (chapters II–V) =================== */
// Shared helpers for the later chapters: scaled enemies, milestone levelling, high-tier gear and spells.

/* ---------- scaled enemies ---------- */
// mkFoe(key, {n, lv, role, ...}) builds a foe whose numbers follow the party's growth.
//   role: brute | soldier | skirm | archer | caster | elite | leader | boss
const FOE_ROLE = {
  brute:   {hp: 1.3, ac: -1, k: 2, dm: 1,   t: "slash"},
  soldier: {hp: 1.0, ac: 1,  k: 2, dm: .95, t: "slash"},
  skirm:   {hp: .8,  ac: 1,  k: 2, dm: .9,  t: "pierce", spd: 8},
  archer:  {hp: .75, ac: 0,  k: 2, dm: .85, t: "pierce", ranged: 1},
  caster:  {hp: .7,  ac: -1, k: 1, dm: .6,  t: "necrotic", spell: 1},
  elite:   {hp: 2.2, ac: 1,  k: 3, dm: 1.35, t: "slash"},
  leader:  {hp: 3.2, ac: 1,  k: 3, dm: 1.5, t: "slash", boss: 1, spell: 1},
  boss:    {hp: 6.5, ac: 2,  k: 3, dm: 2,   t: "necrotic", boss: 1, spell: 1},
};
function diceFor(avg, die = 8) {
  avg = Math.max(2, avg); const n = Math.max(1, Math.floor(avg / (die * .85))), m = Math.round(avg - n * (die + 1) / 2);
  return n + "d" + die + (m > 0 ? "+" + m : m < 0 ? String(m) : "");
}
function mkFoe(key, o) {
  const R = FOE_ROLE[o.role || "soldier"], L = o.lv, perRound = (5 + 1.05 * L) * R.dm * (o.dmg || 1);
  const b = 5 + Math.floor(L / 3.5) + (o.hit || 0), k = o.k || R.k;
  const f = {
    n: o.n, hp: Math.round(R.hp * (12 + 5.5 * L) * (o.hpm || 1)), ac: 13 + Math.floor(L / 5) + R.ac + (o.acm || 0), spd: o.spd || R.spd || 6,
    ic: o.ic || "skull", xp: Math.round(6 * L * L * R.hp * (o.xpm || 1)), sv: 1 + Math.floor(L / 5) + (R.boss ? 2 : 0),
    atk: [{n: o.an || ["Colpo", "Strike", "Golpe"], b, d: diceFor(perRound / k, o.die || 8), r: R.ranged ? (o.r || 10) : (o.reach || 1), t: o.t || R.t, k, ranged: R.ranged ? 1 : undefined}],
  };
  f.lv = L; if (R.boss) f.boss = 1;
  if (R.spell || o.spells) f.spells = o.spells || [
    {n: o.sn || ["Lancia d'ombra", "Shadow lance", "Lanza de sombra"], b, d: diceFor(perRound * 1.15, 10), r: 10, t: o.st || "necrotic", p: .45},
    {n: o.an2 || ["Ondata di buio", "Wave of dark", "Oleada de oscuridad"], save: "dex", dc: 10 + Math.floor(L / 2.5), rad: 1, d: diceFor(perRound * .9, 6), r: 8, t: o.st || "necrotic", p: .3}];
  ["undead", "construct", "res", "vuln", "pack", "obj"].forEach(x => { if (o[x] != null) f[x] = o[x]; });
  if (o.drain) f.spells && f.spells.forEach(s => { if (!s.save) s.drain = 1; });
  FOES[key] = f; return f;
}
// a static object on the board (pillar, altar, heart...) that can be destroyed
function mkObj(key, n, hp, ac, ic = "flame", extra = {}) { FOES[key] = Object.assign({n, hp, ac, spd: 0, ic, xp: 50, sv: 0, obj: 1, atk: []}, extra); }

/* ---------- milestone levelling ---------- */
// xpTo(L): the party reaches at least level L (capped by the chapter's maximum)
function xpTo(L) { if (!S) return; const t = XPT[Math.min(L, MAXLV)] || 0; if (S.xp < t) { S.xp = t; checkLevel(); } }

/* ---------- barks for leaders declared by chapters (merged into LEADS later) ---------- */
const SAGA_LEADS = {};
const SAGA_TACB = {};

/* ---------- high-tier gear ---------- */
Object.assign(ITEMS, {
  w3: {n: ["Arma di brina nera +3", "Black-frost weapon +3", "Arma de escarcha negra +3"], d: ["+3 a colpire e ai danni con le armi.", "+3 to hit and damage with weapons.", "+3 al ataque y daño con armas."], price: 1400, use: "equip", slot: "w", v: 3},
  w4: {n: ["Arma della marea +4", "Tidebound weapon +4", "Arma de la marea +4"], d: ["+4 a colpire e ai danni con le armi.", "+4 to hit and damage with weapons.", "+4 al ataque y daño con armas."], price: 3200, use: "equip", slot: "w", v: 4},
  w5: {n: ["Arma dell'Ultima Alba +5", "Last Dawn weapon +5", "Arma del Último Alba +5"], d: ["+5 a colpire e ai danni con le armi.", "+5 to hit and damage with weapons.", "+5 al ataque y daño con armas."], price: 7000, use: "equip", slot: "w", v: 5},
  a2: {n: ["Piastre di Corvelle +1", "Corvelle plates +1", "Placas de Corvelle +1"], d: ["+1 alla Classe Armatura (massimo +3).", "+1 to Armor Class (max +3).", "+1 a la Clase de Armadura (máximo +3)."], price: 1100, use: "equip", slot: "a", v: 1, cap: 3},
  a3: {n: ["Scaglie di leviatano +1", "Leviathan scales +1", "Escamas de leviatán +1"], d: ["+1 alla Classe Armatura (massimo +4).", "+1 to Armor Class (max +4).", "+1 a la Clase de Armadura (máximo +4)."], price: 2600, use: "equip", slot: "a", v: 1, cap: 4},
  a4: {n: ["Corazza dell'aurora +1", "Aurora cuirass +1", "Coraza de la aurora +1"], d: ["+1 alla Classe Armatura (massimo +5).", "+1 to Armor Class (max +5).", "+1 a la Clase de Armadura (máximo +5)."], price: 5500, use: "equip", slot: "a", v: 1, cap: 5},
  supreme: {n: ["Pozione suprema", "Supreme potion", "Poción suprema"], d: ["Cura 10d4+20 PF.", "Heals 10d4+20 HP.", "Cura 10d4+20 PG."], price: 450, use: "heal", dice: "10d4+20"},
  titan: {n: ["Elisir del titano", "Titan's elixir", "Elixir del titán"], d: ["Cura 20d4+40 PF.", "Heals 20d4+40 HP.", "Cura 20d4+40 PG."], price: 1200, use: "heal", dice: "20d4+40"},
  starfire: {n: ["Fuoco stellare", "Starfire", "Fuego estelar"], d: ["Lancio: 10d6 radiosi (16d6 ai non morti).", "Thrown: 10d6 radiant (16d6 vs undead).", "Lanzamiento: 10d6 radiante (16d6 contra muertos vivientes)."], price: 600, use: "throw", dmg: "10d6", undead: "16d6", type: "radiant"},
  heartglass: {n: ["Vetro del cuore", "Heartglass", "Vidrio del corazón"], d: ["Materiale: una scheggia del cuore di Morrhan, fredda e viva.", "Material: a shard of Morrhan's heart, cold and alive.", "Material: una astilla del corazón de Morrhan, fría y viva."], price: 300, use: "mat"},
  lia_doll: {n: ["Bambola di pezza", "Rag doll", "Muñeca de trapo"], d: ["Una bambola senza volto. Lia la stringeva nella Cattedrale.", "A faceless doll. Lia was holding it in the Cathedral.", "Una muñeca sin rostro. Lia la apretaba en la Catedral."], price: 0, use: "quest"},
  hrun_hammer: {n: ["Martello di Hrun", "Hrun's hammer", "Martillo de Hrun"], d: ["Ninnolo: +1 CA e +1d6 radiosi contro i non morti. Il martello che ha rifatto la Chiave.", "Trinket: +1 AC and +1d6 radiant vs undead. The hammer that remade the Key.", "Abalorio: +1 CA y +1d6 radiante contra muertos vivientes. El martillo que rehízo la Llave."], price: 0, use: "equip", slot: "t"},
});
const SAGA_SHOPS = {
  corvelle: {n: ["Il Mercato Mascherato", "The Masked Market", "El Mercado Enmascarado"], items: ["potion", "greater", "supreme", "flask", "holywater", "herb", "resin", "bone", "iron", "essence", "sunshard", "scroll_heal", "scroll_fire", "w2", "a2"], forge: 3},
  saltgrave: {n: ["Bottega dei Naufraghi", "The Wreckers' Shop", "Tienda de los Náufragos"], items: ["greater", "supreme", "starfire", "holywater", "iron", "essence", "sunshard", "heartglass", "w3", "a2", "a3"], forge: 3},
  warcamp: {n: ["Le salmerie dell'Alleanza", "The Alliance quartermaster", "La intendencia de la Alianza"], items: ["supreme", "titan", "starfire", "holywater", "iron", "sunshard", "heartglass", "w3", "w4", "a3"], forge: 3},
  lastcamp: {n: ["L'ultimo fuoco", "The last fire", "El último fuego"], items: ["supreme", "titan", "starfire", "heartglass", "sunshard", "w4", "a3", "a4"], forge: 3},
};
Object.assign(SHOPS, SAGA_SHOPS);

/* ---------- high-tier spells ---------- */
Object.assign(SPELLS, {
  coneofcold: {lv: 4, n: ["Cono di freddo", "Cone of Cold", "Cono de frío"], tgt: "area", r: 4, rad: 2, ff: 1, d: ["Area di 19 esagoni vicina: TS COS, 8d8 freddo (metà se riesce).", "19-hex area nearby: CON save, 8d8 cold (half on success).", "Área de 19 hexágonos cercana: salvación de CON, 8d8 de frío (mitad si la supera)."]},
  chainlightning: {lv: 4, n: ["Catena di fulmini", "Chain Lightning", "Cadena de relámpagos"], tgt: "enemy", r: 12, d: ["Un fulmine colpisce il bersaglio e salta su altri 3 nemici entro 4 esagoni: TS DES, 10d8 (metà se riesce).", "A bolt strikes the target and leaps to 3 more enemies within 4 hexes: DEX save, 10d8 (half on success).", "Un rayo golpea al objetivo y salta a otros 3 enemigos a 4 hexágonos: salvación de DES, 10d8 (mitad si la supera)."]},
  meteor: {lv: 4, n: ["Pioggia di meteore", "Meteor Swarm", "Lluvia de meteoros"], tgt: "area", r: 14, rad: 3, ff: 1, d: ["Area enorme (37 esagoni): TS DES, 20d6 fuoco e 20d6 contundenti (metà se riesce).", "Huge area (37 hexes): DEX save, 20d6 fire and 20d6 bludgeoning (half on success).", "Área enorme (37 hexágonos): salvación de DES, 20d6 de fuego y 20d6 contundente (mitad si la supera)."]},
  flamestrike: {lv: 4, n: ["Colonna di fuoco", "Flame Strike", "Columna flamígera"], tgt: "area", r: 10, rad: 1, ff: 1, d: ["Area di 7 esagoni: TS DES, 4d6 fuoco + 4d6 radiosi (metà se riesce).", "7-hex area: DEX save, 4d6 fire + 4d6 radiant (half on success).", "Área de 7 hexágonos: salvación de DES, 4d6 de fuego + 4d6 radiante (mitad si la supera)."]},
  heal: {lv: 4, n: ["Guarigione", "Heal", "Sanar"], tgt: "ally", r: 6, d: ["Cura 70 PF a un alleato e lo rialza.", "Heals an ally for 70 HP and gets them back up.", "Cura 70 PG a un aliado y lo levanta."]},
  massheal: {lv: 4, n: ["Guarigione di massa", "Mass Heal", "Curación en masa"], tgt: "none", d: ["Tutto il gruppo recupera 60 PF.", "The whole party regains 60 HP.", "Todo el grupo recupera 60 PG."]},
  volley: {lv: 3, n: ["Raffica", "Volley", "Andanada"], tgt: "area", r: 14, rad: 2, ff: 1, d: ["Pioggia di frecce su 19 esagoni: TS DES, 8d8 perforanti (metà se riesce).", "A rain of arrows on 19 hexes: DEX save, 8d8 piercing (half on success).", "Lluvia de flechas sobre 19 hexágonos: salvación de DES, 8d8 perforante (mitad si la supera)."]},
  wave: {lv: 3, n: ["Onda distruttiva", "Destructive Wave", "Onda destructiva"], tgt: "none", d: ["I nemici entro 2 esagoni: TS COS, 5d6 tuono + 5d6 radiosi e cadono a terra (metà e in piedi se riesce).", "Enemies within 2 hexes: CON save, 5d6 thunder + 5d6 radiant and knocked prone (half and standing on success).", "Enemigos a 2 hexágonos: salvación de CON, 5d6 de trueno + 5d6 radiante y derribados (mitad y en pie si la superan)."]},
});
CLASSES.wizard.spells[9] = ["coneofcold"]; CLASSES.wizard.spells[13] = ["chainlightning"]; CLASSES.wizard.spells[17] = ["meteor"];
CLASSES.cleric.spells[9] = ["flamestrike"]; CLASSES.cleric.spells[11] = ["heal"]; CLASSES.cleric.spells[17] = ["massheal"];
CLASSES.ranger.spells[13] = ["volley"]; CLASSES.paladin.spells[13] = ["wave"];

/* ---------- battle maps of the later chapters ---------- */
Object.assign(MAPS, {
  ship:      {g: "#2a2016", ob: "#5a4630", obr: "12%", n: 4},
  desert:    {g: "#3a2a1c", ob: "#7a5a3a", obr: "40%", n: 5},
  city:      {g: "#2a2026", ob: "#5a4a5e", obr: "10%", n: 5},
  cathedral: {g: "#1c1622", ob: "#5a4a6e", obr: "50%", n: 5},
  maw:       {g: "#1a0608", ob: "#5a1a24", obr: "40%", n: 5},
  ruins:     {g: "#221c1a", ob: "#4a3a32", obr: "20%", n: 6},
});
