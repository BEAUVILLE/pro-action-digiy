const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const memory=new Map(),window={sessionStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)}};
vm.runInNewContext(fs.readFileSync('voice-terrain-dictionary-v1.js','utf8'),{window});
const d=window.DIGIY_VOICE_TERRAIN;
const cases=[
['plombier à Saly','plumber'],['mon lavabo est bouché','plumber'],["j’ai plus d’eau",'plumber'],['plombié','plumber'],['canalisation bouché','plumber'],['dama am fuite','plumber'],
['chauffeur AIBD','driver'],["Il me faut quelqu’un pour me ramener de l’aéroport",'driver'],['récupérer ma mère à la gare','driver'],['chaufeur','driver'],['dama wut taxi','driver'],
['chambre à Saly','loc'],['je cherche où dormir ce soir','loc'],['chambre pas chère','loc'],['chambres','loc'],['fan laa man a fanaan','loc'],
['restaurant','resto'],['où on mange','resto'],['dama bëgg lekk','resto'],['restau','resto'],
['emploi','jobs'],['qui recrute à Mbour','jobs'],['petit boulot','jobs'],['dama wut liggéey','jobs'],
['bonne affaire','announcements'],['bonnes affaires','announcements'],['je vends mon vélo','announcements'],['ocasion','announcements'],
['boutique','commerce'],['où acheter des chaussures','commerce'],['boutik','commerce'],['dama begg jend','commerce'],
['services pro','services'],['aide pour mes papiers','services'],['médecin','health'],['medcin','health']];
for(const [phrase,intent] of cases)assert(d.resolve(phrase).some(r=>r.intent===intent),phrase);
for(const phrase of ['bonjour','merci','tableau','course','déposer','ramener','occasionnel','taxidermie','la porte est ouverte'])assert.equal(d.resolve(phrase).length,0,phrase);
assert.equal(d.resolve('chauffeur et chambre à Saly').length,2);
assert.equal(d.resolve('emploi dans un restaurant').length,2);
assert(d.resolve('ramener à Mbour').some(r=>r.stage==='signals'));
assert(d.expand('récupérer à AIBD').includes('chauffeur'));
assert.equal(d.expand(d.expand('boutik')),d.expand('boutik')+' commerce boutique');
assert.equal(d.unmatched.record('bonjour'),null);
d.unmatched.enable(true);d.unmatched.record('bonjour 221778765785 test@example.com');
assert(!JSON.stringify(d.unmatched.list()).includes('778765785'));assert(!JSON.stringify(d.unmatched.list()).includes('test@example.com'));
assert.equal(d.unmatched.record('plombier'),null);
for(let i=0;i<70;i++)d.unmatched.record('inconnu lettre '+String.fromCharCode(65+i));
assert(d.unmatched.list().length<=50);d.unmatched.clear();assert.equal(d.unmatched.list().length,0);
// Exercise the actual inline expansion entry point, not only the dictionary.
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('  function digiyExpandQuery(text){'),end=html.indexOf('\n  function setStatus',start);
const ctx={window,clean:d.norm};vm.createContext(ctx);vm.runInContext(html.slice(start,end),ctx);
for(const [phrase,intent] of cases){const token=d.rules.find(r=>r.intent===intent).expand;assert(ctx.digiyExpandQuery(phrase).includes(token),phrase)}
// Legacy expansions must remain present (WORLD8 and existing métiers).
const old=require('node:child_process').execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'});
const a=old.indexOf('  function digiyExpandQuery(text){'),b=old.indexOf('\n  function setStatus',a),legacy={window:{},clean:d.norm};vm.createContext(legacy);vm.runInContext(old.slice(a,b),legacy);
for(const phrase of ['plombier à Saly','électricien','maçon','solaire','chauffeur pour AIBD','chambre ce weekend','réserver une table','emploi ou mission','plumber','fontanero','canalizador','idraulico','Klempner','loodgieter','سباك','dama wut plombier'])assert(ctx.digiyExpandQuery(phrase).includes(legacy.digiyExpandQuery(phrase)),phrase);
console.log('Terrain: 35 positive cases, 9 unknown/ambiguous cases, multi-intent, privacy, bounded collection, real expansion, 16 legacy expansions: PASS');
const filter=fs.readFileSync('voice-territory-intent-filter-v1.js','utf8');
let query='';const fctx={window,queryText:()=>d.norm(query),has:(t,words)=>words.some(w=>t.includes(d.norm(w)))};vm.createContext(fctx);
vm.runInContext(filter.slice(filter.indexOf('  function detectNeeds(){'),filter.indexOf('  function detectNeed(){')),fctx);
for(const [phrase,intent] of cases){if(intent==='health')continue;query=phrase;const r=d.rules.find(r=>r.intent===intent);assert(fctx.detectNeeds().some(n=>n.family===r.family&&(!r.specialty||n.specialty===r.specialty)),phrase)}
const health=fs.readFileSync('action-pro-health-route-v1.js','utf8'),hctx={window,norm:d.norm,WORDS:[]};vm.createContext(hctx);vm.runInContext(health.slice(health.indexOf('  function isHealth(v){'),health.indexOf('  function territory(v){')),hctx);assert(hctx.isHealth('medcin'));assert(!hctx.isHealth('boutique'));
console.log('Actual territory filter and health matcher integration: PASS');
