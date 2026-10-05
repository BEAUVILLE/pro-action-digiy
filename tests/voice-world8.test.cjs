/* Explicit WORLD8 regression gate. Baseline = main before PR #12, immutable SHA. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const BASE='2412f5a70473f7c9151a736afed22a7ddafc4842';
const html=fs.readFileSync('index.html','utf8'),before=cp.execFileSync('git',['show',BASE+':index.html'],{encoding:'utf8'});
function section(source,start,end){const a=source.indexOf(start);assert(a>=0,start);const b=source.indexOf(end,a);assert(b>a,end);return source.slice(a,b)}
function engine(source,terrain){
 const ctx={window:{}};ctx.window=ctx;vm.createContext(ctx);
 if(terrain)vm.runInContext(fs.readFileSync('voice-terrain-dictionary-v1.js','utf8'),ctx);
 // Execute both real production layers: original core, then the WORLD8 wrapper
 // including its Portuguese RULES.push. No replacement alias list in the test.
 vm.runInContext(section(source,'  function clean(s){','  function setStatus'),ctx);
 vm.runInContext(section(source,'  const RULES=[','  function safe(value)'),ctx);
 vm.runInContext(section(source,'  function normalize(value){','  /* DIGIY LANGUAGE PASSPORT'),ctx);
 return ctx;
}
const old=engine(before,false),current=engine(html,true);
const LANGS=vm.runInNewContext(section(html,'  const LANGS=','  const KEY=')+'LANGS');
assert.deepEqual(Array.from(LANGS),['fr','en','es','pt','de','it','nl','ar']);
const LOCALE=vm.runInNewContext(section(html,'  const LOCALE=','  const NativeUtterance=')+'LOCALE');
assert.deepEqual({...LOCALE},{fr:'fr-FR',en:'en-US',es:'es-ES',pt:'pt-PT',de:'de-DE',it:'it-IT',nl:'nl-NL',ar:'ar-SA'});
const expected={plumber:['artisan','plumber','plombier'],driver:['transport','','chauffeur'],loc:['accommodation','','logement'],resto:['food','','restaurant'],jobs:['jobs','','emploi']};
// Two independently phrased requests per intent per language (80 in total).
const matrix={
fr:{plumber:['Je cherche un plombier à Saly','Mon robinet fuit'],driver:['Je cherche un chauffeur pour AIBD','Un taxi pour Dakar'],loc:['Une chambre à Saly','Je cherche un logement'],resto:['Un restaurant à Mbour','Je veux déjeuner'],jobs:['Je cherche un emploi','Je cherche du travail à Mbour']},
en:{plumber:['I need a plumber in Saly','My faucet is leaking'],driver:['I need a driver to the airport','A taxi to Dakar'],loc:['I need a room in Saly','Find accommodation tonight'],resto:['Find a restaurant in Mbour','Where can I eat tonight?'],jobs:['I am looking for a job','Who is hiring in Mbour?']},
es:{plumber:['Busco un fontanero en Saly','Necesito un fontanero'],driver:['Necesito un conductor para el aeropuerto','Un taxi a Dakar'],loc:['Busco una habitación en Saly','Necesito alojamiento'],resto:['Busco un restaurante en Mbour','Dónde puedo comer esta noche?'],jobs:['Busco empleo en Mbour','Necesito trabajo']},
pt:{plumber:['Preciso de um canalizador em Saly','Procuro um encanador'],driver:['Preciso de um motorista para o aeroporto','Um taxi para Dakar'],loc:['Procuro um quarto em Saly','Preciso de alojamento'],resto:['Procuro um restaurante em Mbour','Onde posso jantar?'],jobs:['Procuro emprego em Mbour','Preciso de trabalho']},
de:{plumber:['Ich suche einen Klempner in Saly','Ich brauche einen Klempner'],driver:['Ich brauche einen Fahrer zum Flughafen','Ein Taxi nach Dakar'],loc:['Ich suche ein Zimmer in Saly','Ich brauche eine Unterkunft'],resto:['Ich suche ein Restaurant in Mbour','Wo kann ich essen?'],jobs:['Ich suche Arbeit in Mbour','Ich suche einen Job']},
it:{plumber:['Cerco un idraulico a Saly','Ho bisogno di un idraulico'],driver:['Mi serve un autista per aeroporto','Un taxi per Dakar'],loc:['Cerco una camera a Saly','Mi serve un alloggio'],resto:['Cerco un ristorante a Mbour','Dove posso mangiare?'],jobs:['Cerco lavoro a Mbour','Cerco un incarico']},
nl:{plumber:['Ik zoek een loodgieter in Saly','Ik heb een loodgieter nodig'],driver:['Ik zoek een chauffeur naar de luchthaven','Een taxi naar Dakar'],loc:['Ik zoek een kamer in Saly','Ik zoek een woning'],resto:['Ik zoek een restaurant in Mbour','Waar kan ik eten?'],jobs:['Ik zoek werk in Mbour','Ik zoek een opdracht']},
ar:{plumber:['أحتاج سباك في سالي','أبحث عن سباك'],driver:['أحتاج سائق إلى المطار','أبحث عن سائق في داكار'],loc:['أبحث عن غرفة في سالي','أحتاج سكن'],resto:['أبحث عن مطعم في مبور','أريد عشاء'],jobs:['أبحث عن عمل في مبور','أبحث عن وظيفة']}
};
const negatives={fr:['Bonjour','Merci'],en:['Hello','Thank you'],es:['Hola','Gracias'],pt:['Olá','Obrigado'],de:['Hallo','Danke'],it:['Ciao','Grazie'],nl:['Hallo','Dank je'],ar:['مرحبا','شكرا']};
function filter(source,ctx,query){
 const code=section(source,'  function detectNeeds(){','  function detectNeed(){');
 const f={window:ctx,queryText:()=>ctx.clean(query),has:(t,words)=>words.some(w=>t.includes(ctx.clean(w)))};vm.createContext(f);vm.runInContext(code,f);return JSON.parse(JSON.stringify(f.detectNeeds()));
}
const newFilter=fs.readFileSync('voice-territory-intent-filter-v1.js','utf8'),oldFilter=cp.execFileSync('git',['show',BASE+':voice-territory-intent-filter-v1.js'],{encoding:'utf8'});
function familySet(rows){return [...new Set(rows.map(r=>r.family+':'+r.specialty))].sort()}
let count=0,negativeCount=0;const rawGaps=[];
const repairedHistoricalGap="أبحث عن سائق في داكار";
for(const lang of LANGS){
 assert.equal(Object.keys(matrix[lang]).length,5);
 for(const [intent,phrases] of Object.entries(matrix[lang]))for(const phrase of phrases){
  const [family,specialty,token]=expected[intent],legacy=old.digiyExpandQuery(phrase),next=current.digiyExpandQuery(phrase);
  if(phrase===repairedHistoricalGap) assert(!current.clean(legacy).includes(token),"Arabic NFD defect baseline unexpectedly changed");
  else assert(current.clean(legacy).includes(token),`${lang}/${intent}: historical expansion missing`);
  assert(current.clean(next).includes(token),`${lang}/${intent}: new expansion missing`);
  // Every byte of the historical expansion survives; new additions are appended.
  assert(next.startsWith(legacy),`${lang}/${intent}: historical expansion changed`);
  for(const row of current.DIGIY_VOICE_TERRAIN.resolve(phrase))assert.equal(row.intent,intent,`${lang}: new dictionary collision for ${phrase}`);
  const baseline=filter(oldFilter,old,legacy),actual=filter(newFilter,current,next);
  assert(actual.some(n=>n.family===family&&(!specialty||n.specialty===specialty)),`${lang}/${intent}: expanded filter missing`);
  const added=familySet(actual).filter(n=>!familySet(baseline).includes(n));
  assert(added.every(n=>n===family+':'+specialty),`${lang}/${intent}: unrelated filter addition ${added}`);
  // Production final card filter reads RAW input; don't hide historical gaps.
  const rawBefore=filter(oldFilter,old,phrase),rawAfter=filter(newFilter,current,phrase);
  assert(familySet(rawBefore).every(n=>familySet(rawAfter).includes(n)),`${lang}: raw historical filter regression`);
  assert(familySet(rawAfter).filter(n=>!familySet(rawBefore).includes(n)).every(n=>n===family+':'+specialty),`${lang}: new raw filter collision`);
  if(!rawAfter.some(n=>n.family===family&&(!specialty||n.specialty===specialty)))rawGaps.push({lang,intent,phrase});
  count++;
 }
 for(const phrase of negatives[lang]){
  assert.equal(current.DIGIY_VOICE_TERRAIN.resolve(phrase).length,0,`${lang}: greeting collision`);
  assert.equal(current.digiyExpandQuery(phrase),old.digiyExpandQuery(phrase),`${lang}: negative expansion changed`);negativeCount++;
 }
 console.log(`${lang} (${LOCALE[lang]}): 10 intent expansions + 2 negatives PASS`);
}
assert.equal(count,80);assert.equal(negativeCount,16);
console.log(`WORLD8 deterministic expansion gate: ${count} requests + ${negativeCount} negatives PASS; no new unrelated intent on this corpus.`);
console.log('Historical raw-filter gaps by language (not certified end-to-end): '+JSON.stringify(Object.fromEntries(LANGS.map(lang=>[lang,rawGaps.filter(r=>r.lang===lang).length]))));
