'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const part=html.split('<script id="digiy-action-7lang-runtime">')[1];
assert.ok(part,'Runtime langage PRO ACTION absent');
const runtime=part.split('</script>')[0];
const languages=['fr','wo','zh','en','es','pt','de','it','nl','ar'];
assert.ok(runtime.includes('const LANGS='+JSON.stringify(languages)),'10 langues du runtime');
for (const lang of ['wo','zh']){
  assert.ok(runtime.includes(lang+':"'),'Libellé du bouton manquant : '+lang);
  assert.ok(runtime.includes('UI.'+lang+'='),'Interface manquante : '+lang);
  assert.ok(runtime.includes('QUICK.'+lang+'='),'Recherches rapides manquantes : '+lang);
  assert.ok(runtime.includes('EXAMPLES.'+lang+'='),'Exemples manquants : '+lang);
}
assert.ok(runtime.includes('wo:"wo-SN"')&&runtime.includes('zh:"zh-CN"'),'Locales explicites absentes');
assert.ok(runtime.includes('replace("zh-cn","zh")'),'Alias chinois absent');
assert.ok(runtime.includes('Reconnaissance vocale wolof non vérifiée'),'Garde micro wolof absent');
assert.ok(runtime.includes('&& !selected')||runtime.includes('&&!selected'),'Garde voix indisponible absente');
assert.ok(runtime.includes('/水管工|管道/'),'Recherche plombier chinois absente');
assert.ok(runtime.includes('localStorage.setItem("digiy-lang",lang)'),'Passeport langue absent');
assert.ok(html.includes('document.documentElement.dir=lang==="ar"?"rtl":"ltr"'),'Affichage arabe RTL absent');
assert.ok(html.includes('window.__DIGIY_VOICE_QUERY_RECOGNIZED__'),'Contrat micro existant absent');
assert.ok(html.includes('DIGIY_VOICE_TERRAIN'),'Contrat terrain existant absent');
console.log('OK — PRO ACTION · 10 langues de navigation, WO pilote, ZH texte/recherche, garde voix, terrain préservé');
