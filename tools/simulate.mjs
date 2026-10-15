#!/usr/bin/env node
// Automated balance test: a simple bot party plays every encounter of the campaign.
//   node tools/simulate.mjs                 all classes, 4 runs per encounter, Normal
//   node tools/simulate.mjs --quick         2 classes, 2 runs (used by CI)
//   node tools/simulate.mjs --runs 10 --classes fighter,wizard --diff 2
// Exits with code 1 if the game throws or an encounter is won less than 50% of the time.
// Run "node tools/build.mjs" first.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const QUICK = argv.includes("--quick");
const RUNS = +(opt("--runs") || (QUICK ? 2 : 4));
const CLASSES = (opt("--classes") || (QUICK ? "fighter,wizard" : "fighter,paladin,rogue,ranger,wizard,cleric")).split(",");
const DIFF = +(opt("--diff") ?? 1);
const html = readFileSync(join(ROOT, "dist/dark-days-chronicles.html"), "utf8");
let src = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
src = src.replace(/const sleep = ms => [^\n]*;/, "let sleep = ms => Promise.resolve();");
const dummy=()=>new Proxy(function(){},{get:(t,p)=>{ if(p==='querySelectorAll') return ()=>[]; if(p==='classList') return {toggle(){},add(){},remove(){}}; if(p==='style') return {setProperty(){}}; if(p==='dataset') return {}; if(p===Symbol.toPrimitive) return ()=>''; if(p==='clientWidth') return 400; if(p==='clientHeight') return 500; if(p==='getContext') return ()=>dummy(); return dummy(); }, set:()=>true, apply:()=>dummy()});
const ctx={NO_DEPLOY:true, RUNS, performance:{now:()=>0}, requestAnimationFrame:()=>0, getComputedStyle:()=>({}), setImmediate, console, Math, JSON, Promise, Set, Map, setTimeout:(f)=>setImmediate(f), clearTimeout(){}, setInterval:()=>0, clearInterval(){},
  document:{querySelector:()=>dummy(), querySelectorAll:()=>[], createElement:()=>dummy(), documentElement:{}}, window:{addEventListener(){}, devicePixelRatio:1}, navigator:{language:'it'}, localStorage:{getItem:()=>null,setItem(){}} };
vm.createContext(ctx);
const harness=`
let RESULT=null;
winCombat=function(){ syncBack(); RESULT={win:true, rounds:CB.round, hp:allies().map(a=>a.down?0:a.hp/a.maxhp)}; };
loseCombat=function(){ RESULT={win:false, rounds:CB.round}; };
renderCombat=function(){}; buildCombat=function(){}; turnBanner=async function(){}; fxAttackAnim=async function(){}; fxArea=async function(){}; fxProjectile=async function(){}; fxColumn=async function(){}; paintTerrain=function(){}; miniSrc=function(){return ""}; placeTokens=function(){}; floatAt=function(){}; shakeTok=function(){}; showScreen=function(){};
logL=function(s){ CB.log.push(s); };
function bestArea(u,r,rad){ let best=null; for(let x=0;x<7;x++)for(let y=0;y<9;y++){ if(dist(u,{x,y})>r) continue; const inA=inArea({x,y},rad); const e=inA.filter(o=>o.side==='e'&&o.hp>0).length, p=inA.filter(o=>o.side==='p'&&o!==u).length; const sc=e-2*p; if(!best||sc>best.sc) best={x,y,sc,e}; } return best; }
async function botTurn(u){
  const c=u.ref; let guard=0;
  const sp=spellsOf(c);
  const want=k=>sp.includes(k)&&canUse(u,{k:'sp',key:k});
  const hurt=allies().filter(a=>a.down||a.hp<a.maxhp*0.35).sort((a,b)=>a.hp-b.hp)[0];
  if(hurt && want('healingword') && dist(u,hurt)<=8){ CB.sel={k:'sp',key:'healingword'}; await execute(u,hurt); }
  if(hurt && hurt.down && want('masshealingword')){ CB.sel={k:'sp',key:'masshealingword'}; await execute(u,null); }
  if(CB.round===1 && want('bless')){ CB.sel={k:'sp',key:'bless'}; await execute(u,null); }
  if(want('spiritguardians') && !u.cond.sg){ CB.sel={k:'sp',key:'spiritguardians'}; await execute(u,null); }
  if(want('spiritualweapon') && !u.cond.sw){ CB.sel={k:'sp',key:'spiritualweapon'}; await execute(u,null); }
  if(u.cond.sw && canUse(u,{k:'ab',key:'spiritstrike'})){ const t=foes().filter(f=>dist(u,f)<=8)[0]; if(t){ CB.sel={k:'ab',key:'spiritstrike'}; await execute(u,t);} }
  if(hasF(c,'secondwind') && u.hp<u.maxhp*.5 && canUse(u,{k:'ab',key:'secondwind'})){ CB.sel={k:'ab',key:'secondwind'}; await execute(u,null); }
  if(hasF(c,'smite') && canUse(u,{k:'ab',key:'smite'}) && foes().some(f=>f.boss)){ CB.sel={k:'ab',key:'smite'}; await execute(u,null); }
  if(want('huntersmark')){ const t=foes()[0]; if(t){ CB.sel={k:'sp',key:'huntersmark'}; await execute(u,t);} }
  if(hasF(c,'actionsurge') && canUse(u,{k:'ab',key:'actionsurge'}) && foes().some(f=>f.boss)){ CB.sel={k:'ab',key:'actionsurge'}; await execute(u,null); }
  for(const k of ['fireball','icestorm','sleep','burninghands']){ if(want(k)){ const s=SPELLS[k]; const b=bestArea(u,s.r,s.rad); if(b && b.e>=2 && b.sc>=2){ CB.sel={k:'sp',key:k}; await execute(u,{x:b.x,y:b.y}); break; } } }
  if(hurt && want('curewounds') && dist(u,hurt)<=1 && u.act>0){ CB.sel={k:'sp',key:'curewounds'}; await execute(u,hurt); }
  if(hurt && hurt.down && hasF(c,'lay') && canUse(u,{k:'ab',key:'lay'}) && dist(u,hurt)<=1){ CB.sel={k:'ab',key:'lay'}; await execute(u,hurt); }
  if(hurt && (S.inv.potion||0)>0 && u.act>0 && dist(u,hurt)<=1 && hurt.down){ CB.sel={k:'it',key:'potion'}; await execute(u,hurt); }
  while((u.act>0||u.atkLeft>0) && foes().length && guard++<6 && !CB.ended){
    let sel;
    if(c.cls==='wizard'){ sel = want('scorchingray')&&foes().some(f=>f.boss)?{k:'sp',key:'scorchingray'}: want('magicmissile')&&Math.random()<.3?{k:'sp',key:'magicmissile'}:{k:'sp',key:'firebolt'}; }
    else if(c.cls==='cleric' && want('guidingbolt') && Math.random()<.4) sel={k:'sp',key:'guidingbolt'};
    else { const ws=weaponsOf(c).map((w,i)=>({i,p:weapProfile(c,w)})); const near=foes().some(f=>dist(u,f)<=1); const pick= near? ws.find(w=>!w.p.ranged)||ws[0] : ws.find(w=>w.p.ranged)||ws[0]; sel={k:'w',i:pick.i}; }
    CB.sel=sel; const spc=selSpec(u);
    const t=foes().sort((a,b)=>dist(u,a)-dist(u,b))[0];
    const before=u.act+u.atkLeft;
    await onCell(t.x,t.y);
    if(u.act+u.atkLeft===before){ // couldn't reach: move closer
      const R=reachOf(u,u.mv); let best=null; R.forEach((v,k)=>{ const [x,y]=k.split(',').map(Number); if(!freeTile(x,y,u)) return; const d=dist({x,y},t); if(!best||d<best.d) best={x,y,d}; });
      if(best && (best.x!==u.x||best.y!==u.y)) await onCell(best.x,best.y);
      CB.sel={k:'ab',key:'dash'}; break; }
  }
  if(!CB.ended && cur()===u) endTurn();
}
function runFight(key){ return new Promise(res=>{ RESULT=null; CB=null; startCombat(key,'x',false);
  const tick=()=>{ if(RESULT) return res(RESULT); if(CB && !CB.busy && !CB.ended && cur() && cur().side==='p' && !CB.botting){ CB.botting=true; botTurn(cur()).catch(e=>{console.error('BOT',e); RESULT={err:e}}).finally(()=>{ if(CB) CB.botting=false; }); } if(CB&&CB.round>60){ return res({win:false,rounds:99,stall:1}); } setImmediate(tick); };
  tick(); }); }
globalThis.runAll=async function(plan,cls,diff){ const out={};
  for(const [key,lvl,comps] of plan){ let w=0,n=RUNS,rs=0, hpl=0;
    for(let i=0;i<n;i++){
      S={v:1,lang:0,diff:diff,scene:'x',flags:{},seen:{},gold:0,xp:0,level:lvl,inv:{potion:2},party:[],dark:0};
      const pcc=newChar({id:'pc',name:'Pc',race:'human',cls:cls,bg:'soldier',ab:Object.fromEntries(AB.map(k=>[k,CLASSES[cls].rec[k]+1])),skills:CLASSES[cls].skills,lvl});
      if(lvl>=4){ const k=CLASSES[cls].prim; pcc.ab[k]=Math.min(20,pcc.ab[k]+2); recalc(pcc,true);} 
      pcc.wplus = lvl>=5?1:0;
      S.party=[pcc]; comps.forEach(id=>S.party.push(makeComp(id)));
      const r=await runFight(key); if(r.err) { out[key]='ERR'; break; } if(r.win){w++; hpl+=r.hp.reduce((a,b)=>a+b,0)/r.hp.length;} rs+=r.rounds; }
    out[key]=out[key]||(w+'/'+n+' r'+(rs/n).toFixed(1)+' hp'+(w?(hpl/w).toFixed(2):'-')); }
  return out; };
`;
const plan0=[['cart',1,['brenna']],['wolves',2,['brenna']],['mill',2,['brenna','kael']],['cem',2,['brenna','kael']],['camp',3,['brenna','kael']],['camp_easy',3,['brenna','kael']],['varga',4,['brenna','kael']],['bandits',4,['brenna','kael']],['shadows',4,['brenna','kael']],['tower',4,['brenna','kael']],['doran',4,['brenna','kael']],['sewer',4,['brenna','kael']],['drowned',5,['brenna','kael']],['guardians',5,['brenna','kael']],['keeper',5,['brenna','kael','ilyra']],['vault1',5,['brenna','kael','ilyra']],['vault_guard',5,['brenna','kael','ilyra']],['vault_boss',5,['brenna','kael','ilyra']],['vault_boss_hard',5,['brenna','kael','ilyra']],['duke',5,['brenna','kael','ilyra']],['ser_guards',5,['brenna','kael','ilyra']],['pass',6,['brenna','kael','ilyra']],['gate',6,['brenna','kael','ilyra']],['cistern',6,['brenna','kael','ilyra']],['mirror',6,['brenna','kael','ilyra']],['jailers',6,['brenna','kael','ilyra']],['seraphine',6,['brenna','kael','ilyra']],['avatar',7,['brenna','kael','ilyra']],['avatar_weak',7,['brenna','kael','ilyra']]];
vm.runInContext(src+harness, ctx);
let failed = false;
const t0 = Date.now();
for (const cls of CLASSES) {
  const r = await ctx.runAll(plan0, cls, DIFF);
  const weak = Object.entries(r).filter(([k, v]) => v === "ERR" || +v.split("/")[0] < +v.split("/")[1].split(" ")[0] * .5);
  console.log(`${cls.padEnd(8)} ${weak.length ? "WEAK: " + weak.map(([k, v]) => k + " " + v).join(", ") : "ok"}`);
  if (argv.includes("--verbose")) for (const [k, v] of Object.entries(r)) console.log("   ", k.padEnd(16), v);
  if (weak.length) failed = true;
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(failed ? 1 : 0);
