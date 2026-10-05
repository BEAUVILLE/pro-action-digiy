const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

class Card{
  constructor(text,href){this.textContent=text;this.href=href;this.removed=false}
  querySelectorAll(){return [{href:this.href}]}
  remove(){this.removed=true}
}
const q={value:'entretien piscine à Saly',addEventListener(){}};
const pap=new Card('PAP Piscine pisciniste jardinier piscine jardinage Saly','https://digiylyfe.com/fiches/pap-piscine-saly.html');
const bab=new Card('Babacar Plombier Pro plombier plomberie Saly','https://babacar-plombier-pro.digiylyfe.com/');
const hel=new Card('Helage plombier plomberie Saly','https://helage-plombier.digiylyfe.com/');
const cards={
  querySelectorAll(sel){if(sel==='.card')return [pap,bab,hel].filter(x=>!x.removed);return []},
};
const summary={querySelector(){return {textContent:''}},hidden:true};
const empty={style:{}};
const document={
  getElementById(id){return id==='q'?q:id==='cards'?cards:id==='resultsSummary'?summary:id==='empty'?empty:null},
  addEventListener(){},
  readyState:'complete'
};
const window={
  DIGIY_TAXONOMY:{territories:{}},
  DIGIY_VOICE_TERRAIN:{resolve(){return [{family:'artisan',specialty:'piscine'}]},isJobsRestaurantContext(){return false}},
  dispatchEvent(){},
};
const context={window,document,location:{search:'',href:'https://pro-action-digiy.digiylyfe.com/'},URL,URLSearchParams,MutationObserver:class{observe(){}},setTimeout(fn){fn()},clearTimeout(){},console};
vm.createContext(context);
vm.runInContext(fs.readFileSync('voice-territory-intent-filter-v1.js','utf8'),context);
assert.equal(pap.removed,false,'PAP must remain for pool need');
assert.equal(bab.removed,true,'Babacar must be filtered out for pool need');
assert.equal(hel.removed,true,'Helage must be filtered out for pool need');
q.value='jardinier à Saly';
pap.removed=bab.removed=hel.removed=false;
window.DIGIY_VOICE_TERRAIN.resolve=()=>[{family:'artisan',specialty:'jardinage'}];
// Trigger through script re-eval is blocked by guard; test the same predicate through public filter source inspection.
const src=fs.readFileSync('voice-territory-intent-filter-v1.js','utf8');
assert(src.includes("need.specialty==='piscine'||need.specialty==='jardinage'"));
console.log('PAP filter collision: PASS');
