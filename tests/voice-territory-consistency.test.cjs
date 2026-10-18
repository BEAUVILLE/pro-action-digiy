/* DIGIYLYFE — régression territoire déclaré / intention brute / compteur final.
   Fixtures déterministes : aucune requête réseau ni disponibilité simulée. */
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const html=fs.readFileSync('index.html','utf8');
const filter=fs.readFileSync('voice-territory-intent-filter-v1.js','utf8');
const rails=fs.readFileSync('voice-territory-rails-v1.js','utf8');
const start=html.indexOf('  const SECTEURS_FALLBACK = [');
const end=html.indexOf('  const FICHES_DIRECTES = [',start);
const first=html.indexOf('  function detectSecteurFromCleanText(t){');
const last=html.indexOf('  function isOnlyZoneWord(k){',first);
assert(start>=0&&end>start&&first>=0&&last>first);

const zoneContext={
  window:{DIGIY_TAXONOMY:{territories:{
    saly:{label:'Saly',markers:['saly']},
    aibd:{label:'AIBD',markers:['aibd','diass']},
    sarlat:{label:'Sarlat',markers:['sarlat','dordogne']},
    bordeaux:{label:'Bordeaux',markers:['bordeaux']},
    dakar:{label:'Dakar',markers:['dakar']}
  }}},
  clean:v=>String(v||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase()
};
vm.createContext(zoneContext);
vm.runInContext(html.slice(start,end)+'\nconst SECTEURS_PUBLICS=SECTEURS;\n'+html.slice(first,last),zoneContext);
function serves(text,item){
  zoneContext.rawQuery=text;zoneContext.item=item;
  return vm.runInContext('digiyCardServesSector(item,detectSecteurFromCleanText(clean(rawQuery)))',zoneContext);
}
const lamine={secteur:'AIBD · Saly',zones:['AIBD','Saly','Dakar'],zoneAffichage:'Petite Côte'};
assert.equal(serves('chauffeur à Bordeaux',lamine),false,'AIBD must not prove Bordeaux');
assert.equal(serves('chauffeur pour AIBD',lamine),true,'AIBD real service must remain');
assert.equal(serves('chauffeur à Saly',lamine),true,'Saly driver must remain');
assert.equal(serves('chauffeur à Dakar',lamine),true,'Dakar service must remain');
assert.equal(serves('chambre à Sarlat',{secteur:'Sarlat',zones:['Dordogne']}),true,'Sarlat LOC preserved');
assert.equal(serves('chauffeur à Bordeaux',{secteur:'Bordeaux',zones:['Bordeaux']}),true,'Bordeaux confirmed service accepted');
assert(html.includes('detectSecteurFromCleanText(rawT)'), 'Matching must use raw query');
assert(html.includes('detectSecteurFromCleanText(clean(queryText || ""))'), 'Summary must use raw query');
assert(!rails.includes("summary.innerHTML='<strong>'+((TXT[lang()]||TXT.fr).context)"),'Rails must not overwrite final summary');

class Card{
  constructor(text,href){this.textContent=text;this.href=href;this.removed=false}
  querySelectorAll(){return [{href:this.href}]}
  remove(){this.removed=true}
}
function runCase(query,slug,cardsIn){
  const q={value:query,addEventListener(){}};
  const cards={
    dataset:{digiySearchRendered:'1'},
    querySelectorAll(sel){return sel==='.card'?cardsIn.filter(x=>!x.removed):[]}
  };
  const summary={
    hidden:true,children:[],
    querySelector(sel){return sel==='strong'?this.children.find(x=>x.type==='strong')||null:null},
    replaceChildren(...children){this.children=children}
  };
  const empty={style:{display:'none'}};
  const document={
    getElementById(id){return ({q,cards,resultsSummary:summary,empty})[id]||null},
    createElement(type){return {type,textContent:'',href:''}},
    addEventListener(){},
    documentElement:{lang:'fr'},
    readyState:'complete'
  };
  const window={DIGIY_TAXONOMY:{territories:{}},DIGIY_VOICE_TERRAIN:{
    resolve(){return []},isJobsRestaurantContext(){return false}
  }};
  const context={
    window,document,location:{search:'?territory='+slug+'&lang=fr',href:'https://pro-action-digiy.digiylyfe.com/?territory='+slug},
    URL,URLSearchParams,MutationObserver:class{observe(){}},
    setTimeout(fn){fn()},clearTimeout(){},console
  };
  vm.createContext(context);
  vm.runInContext(filter,context);
  return {visible:cardsIn.filter(x=>!x.removed),summary,empty,
    message:summary.children.map(x=>x.textContent).join(' ')};
}
const driver=()=>new Card('Lamine — Chauffeur privé · DRIVER · AIBD · Saly · Dakar','https://partenaire-lamine.digiylyfe.com/');
const room=()=>new Card('Chez Baptiste · LOC · appartement à Saly','https://part-chez-baptiste.digiylyfe.com/');
const sarlat=()=>new Card('Chez Baptiste · LOC · chambre à Sarlat Dordogne','https://sarlat-chez-baptiste.digiylyfe.com/');
const fakeRoute=()=>new Card('DRIVER · AIBD · route générique','https://digiylyfe.com/module-territoire.html?module=transport&territory=bordeaux');

let r=runCase('chauffeur à Bordeaux','bordeaux',[driver(),fakeRoute()]);
assert.equal(r.visible.length,0,'Bordeaux must not show AIBD driver or synthetic zone in route URL');
assert.match(r.message,/Aucun résultat correspondant pour BORDEAUX/);
assert(r.summary.children.some(x=>x.href&&x.href.includes('#digiyVoiceTerritoryRail')),'Change zone link required');
assert.equal(r.summary.hidden,false);

r=runCase('chauffeur à Saly','petite-cote',[driver(),room()]);
assert.equal(r.visible.length,1,'One chauffeur card retained in Saly');
assert.match(r.message,/1 résultat utile/);
assert(!/disponible/i.test(r.message),'Do not invent availability');

r=runCase('chambre et chauffeur à Saly','petite-cote',[room(),driver()]);
assert.equal(r.visible.length,2,'LOC + DRIVER must both survive');
assert.match(r.message,/LOC \+ DRIVER/,'Combined needs must remain in summary');

r=runCase('chambre à Sarlat','vallee-dordogne',[driver(),sarlat()]);
assert.equal(r.visible.length,1);
assert.match(r.visible[0].textContent,/Sarlat/);
r=runCase('chauffeur à Dakar','dakar',[driver(),room()]);
assert.equal(r.visible.length,1);
r=runCase('chauffeur pour AIBD','petite-cote',[driver(),room()]);
assert.equal(r.visible.length,1);

console.log('Territorial voice V1: raw zone, Bordeaux/AIBD isolation, Saly, Dakar, Sarlat, LOC+DRIVER, post-filter count and empty state PASS');
