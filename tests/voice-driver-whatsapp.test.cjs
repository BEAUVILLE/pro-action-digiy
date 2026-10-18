/* LA VOIX -> WhatsApp direct DRIVER : aucun envoi automatique, aucune donnée inventée. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
function section(start,end){
  const a=html.indexOf(start),b=html.indexOf(end,a);
  assert(a>=0&&b>a,'Source section missing: '+start);
  return html.slice(a,b);
}
const helpers=section('  function digiyDriverContactMessage(item, rawRequest){','  function waLink(message){')+
  section('  function waLinkPhone(phone, message){','  const RESULT_PROFESSION_INTENTS =');
const realRender=section('  function render(list, queryText){','  function bringResultsIntoView(){');
assert(realRender.includes('digiyDriverContactMessage(item, queryText)'),'Actual directory action must use the handoff');
const driver={
  kind:'directory',title:'Lamine — Chauffeur privé',categorie:'DRIVER',metier:'chauffeur privé',
  secteur:'AIBD · Saly · Dakar',statut:'Fiche officielle DIGIY DRIVER',icon:'🚗',
  phone:'221784413680',url:'https://partenaire-lamine.digiylyfe.com/',
  wa:'Bonjour Lamine, je viens de DIGIYLYFE pour un besoin de transport.'
};
const loc={
  kind:'directory',title:'Chez Baptiste',categorie:'LOC',metier:'logement',secteur:'Saly',
  statut:'Fiche officielle',icon:'🏠',phone:'221770000001',
  url:'https://loc.digiylyfe.com/',wa:'Bonjour, je viens pour une chambre.'
};
function run(items,request,lang='fr'){
  const cards={innerHTML:'',dataset:{},nodes:[],appendChild(fragment){this.nodes=fragment.nodes}};
  const empty={style:{display:'none'}};
  const document={
    documentElement:{lang},
    createElement(tag){return {tag,innerHTML:'',className:''}},
    createDocumentFragment(){return {nodes:[],appendChild(node){this.nodes.push(node)}}}
  };
  const context={cards,empty,document,
    updateResultsSummary(){},
    setStatus(){},
    digiyLang(){return lang},
    clean:v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
    waLink:msg=>'https://wa.me/221770000000?text='+encodeURIComponent(msg||''),
    console,encodeURIComponent};
  vm.createContext(context);
  vm.runInContext(helpers+'\n'+realRender,context);
  context.render(items,request);
  const links=cards.nodes.map(node=>{
    const found=node.innerHTML.match(/href="(https:\/\/wa\.me\/[^"]+)"/);
    return found?new URL(found[1]):null;
  });
  return {cards,links,messages:links.map(url=>url?.searchParams.get('text')||'')};
}
const trip="Je cherche un chauffeur de l'AIBD à Saly demain matin. Nous sommes trois avec quatre bagages.";
let r=run([driver],trip);
assert.equal(r.cards.nodes.length,1);
assert.equal(r.links[0].pathname,'/221784413680','Direct phone belongs to Lamine, not DIGIY');
assert(r.messages[0].startsWith(driver.wa),'Keep the professional existing greeting');
for(const part of ["AIBD","Saly","demain matin","trois","quatre bagages"])assert(r.messages[0].includes(part),part+' must survive');
assert(r.messages[0].includes(trip),'Pass through the original input, not an enriched machine query');
assert(/confirmer/i.test(r.messages[0]),'Ask the professional for confirmation');
assert(!/disponible demain à|confirmé pour demain|tarif de [0-9]|commission 10%/i.test(r.messages[0]),'No fictitious confirmation or price');
assert(!r.cards.nodes[0].innerHTML.includes(trip),'Do not print raw request as unescaped HTML');
const before=run([driver],'');
assert.equal(before.messages[0],driver.wa,'Missing request falls back to the current safe greeting');
r=run([loc,driver],'Je cherche une chambre et un chauffeur à Saly pour deux personnes.');
assert.equal(r.messages[0],loc.wa,'LOC remains unchanged: never send the driver request to LOC automatically');
assert.match(r.messages[1],/chambre et un chauffeur/,'Multi-intent remains unchanged and reaches driver');
const en=run([driver],'I need a driver from AIBD to Saly, three passengers and four bags.','en');
assert.match(en.messages[0],/My request : I need a driver/);
assert.match(en.messages[0],/four bags/);
for(const locale of ['fr','en','es','pt','it','de','nl','ar']){
  const ans=run([driver],'AIBD → Saly · 3 voyageurs · 4 valises',locale);
  assert(ans.messages[0].includes('3 voyageurs · 4 valises'),locale+' exact input');
  assert(ans.messages[0].includes('AIBD → Saly'),locale+' accents intact');
}
r=run([driver],'Départ AIBD & destination Saly ? <texte> "deux valises"');
assert.equal(r.links[0].searchParams.get('text'),r.messages[0],'WhatsApp URL query preserves special characters');
const long=run([driver],'chauffeur '+('x'.repeat(1500)));
assert.match(long.messages[0],/Texte abrégé/,'Long request must be explicitly marked as shortened');
assert(long.messages[0].length<1400,'Limit very long WhatsApp URLs');
const nonDriver=run([{...driver,categorie:'BUILD',metier:'plombier'}],'Il me faut un plombier à Saly');
assert.equal(nonDriver.messages[0],driver.wa,'No generic propagation into non DRIVER services');
const noPhone=run([{...driver,phone:''}],trip);
assert.equal(noPhone.links[0],null,'Do not fabricate WhatsApp or use fallback DIGIY phone');
console.log('LA VOIX -> WhatsApp DRIVER: real render link, original trip/date/passengers/luggage, 8L, no invented data, LOC untouched, no phone fallback PASS');
