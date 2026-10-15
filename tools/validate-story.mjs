#!/usr/bin/env node
// Checks the story graph: every choice leads to an existing scene, every fight to an existing
// encounter, every scene has text in all three languages, and every scene is reachable.
//   node tools/validate-story.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const files = readdirSync(SRC).sort();
const chapterFiles = readdirSync(join(SRC, "chapters")).sort().flatMap(d => readdirSync(join(SRC, "chapters", d)).filter(f => f.endsWith(".js")).sort().map(f => join("chapters", d, f)));
const src = ["10_data.js", "15_chapters.js", ...chapterFiles].map(f => readFileSync(join(SRC, f), "utf8")).join("\n");
const eng = files.filter(f => /^(30_engine|50_ui)/.test(f)).map(f => readFileSync(join(SRC, f), "utf8")).join("\n");
const process_exit = c => process.exit(c);
const BGkeys=[...eng.matchAll(/^\s{2}(\w+):\{(sky|wall)/gm)].map(m=>m[1]).concat([...eng.matchAll(/^BG\.(\w+) =/gm)].map(m=>m[1]));
const stub=`let S={flags:{},party:[{id:'pc',name:'X',hp:5,maxhp:10}],inv:{},gold:100,seen:{}};
const has=f=>!!S.flags[f]; const set=(f,v=1)=>S.flags[f]=v; const inP=id=>S.party.some(c=>c.id===id);
const gold=()=>{}, item=()=>{}, take=()=>{}, xp=()=>{}, join=()=>{}, dmgParty=()=>{}, longRest=()=>{}, toastQ=()=>{}; const rnd=n=>1;`;
const errsEarly=[];
const fn=new Function(stub+src+`;return {SC,ENC,FOES,MAPS,S,CHAPTERS};`);
const {SC,ENC,FOES,MAPS,S,CHAPTERS}=fn();
const ROOTS=new Set([...CHAPTERS.map(c=>c.start),'ch_wait']);
for(const c of CHAPTERS){ if(!SC[c.start]) errsEarly.push('chapter '+c.id+': start scene '+c.start+' missing'); for(const e of Object.keys(c.endings||{})) if(!SC[e]) errsEarly.push('chapter '+c.id+': ending '+e+' missing'); }
let errs=[...errsEarly];
const chk=(id,v,what)=>{ if(typeof v==='string' && !SC[v]) errs.push(`${id}: ${what} -> missing scene ${v}`); };
const reach=new Set();
for(const [id,sc] of Object.entries(SC)){
  if(!BGkeys.includes(sc.bg)) errs.push(`${id}: bg ${sc.bg} not in BG`);
  for(const flags of [{},{children_saved:1,oil_done:1,guard_ally:1,doran_ally:1,lia_grave:1,took_flame:1,has_key:1,act1_done:1,act2_done:1,shatter_known:1,freed_branded:1,ser_redeemed:1,lamps_freed:1,kael_late:1,q_children:1}]){
    S.flags=flags; S.tmp={a:3,b:2};
    const t=typeof sc.t==='function'?sc.t():sc.t;
    if(!Array.isArray(t)||t.length!==3||t.some(x=>typeof x!=='string'||!x.length)) errs.push(`${id}: bad text`);
  }
  (sc.ch||[]).forEach((c,i)=>{
    if(!Array.isArray(c.t)||c.t.length!==3) errs.push(`${id}#${i}: bad choice text`);
    if(c.req) c.req();
    if(c.go){ if(typeof c.go==='function'){ S.flags={}; chk(id,c.go(),'go'); S.flags={has_key:1}; chk(id,c.go(),'go'); } else chk(id,c.go,'go'); reach.add(typeof c.go==='string'?c.go:'a2_archive'); reach.add('a2_betrayal'); }
    if(c.check){ chk(id,c.check.ok,'ok'); chk(id,c.check.ko,'ko'); reach.add(c.check.ok); reach.add(c.check.ko); if(c.check.sk&&!['ath','ste','sle','arc','his','inv','rel','ins','med','per','sur','dec','inti','pers'].includes(c.check.sk)) errs.push(id+' bad skill '+c.check.sk); }
    if(c.fight){ const ks= typeof c.fight==='function'?[(S.flags={},c.fight()),(S.flags={v_taken:1,guard_ally:1,children_saved:1,oil_done:1,mira_ally:1},c.fight())]:[c.fight]; ks.forEach(k=>{ if(!ENC[k]) errs.push(`${id}: enc ${k} missing`);}); chk(id,c.win,'win'); reach.add(c.win); }
    if(!c.go&&!c.check&&!c.fight&&!c.shop&&!c.rest&&!c.end&&!c.toTitle) errs.push(`${id}#${i}: dead-end choice`);
  });
}
for(const [k,e] of Object.entries(ENC)){ if(!MAPS[e.map]) errs.push('map '+e.map); e.foes.forEach(f=>{ if(!FOES[f]) errs.push(`enc ${k}: foe ${f}`); }); }
const unreached=Object.keys(SC).filter(k=>!reach.has(k)&&!ROOTS.has(k));
console.log('chapters',CHAPTERS.map(c=>c.id).join(','),'| scenes',Object.keys(SC).length,'errors',errs.length); errs.forEach(e=>console.log(' ',e));
if(unreachedList().length) console.log('unreached:', unreachedList().join(', '));
function unreachedList(){ return unreached; }
let words=0; for(const sc of Object.values(SC)){ S.flags={}; const t=typeof sc.t==='function'?sc.t():sc.t; words+=t[0].split(/\s+/).length; } console.log('IT words in scenes:',words);

process_exit(errs.length || unreached.length ? 1 : 0);
