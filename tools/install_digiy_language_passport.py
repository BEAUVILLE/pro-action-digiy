from pathlib import Path
import re

INDEX = Path("index.html")
MARKER = "DIGIY LANGUAGE PASSPORT 7L v1"

html = INDEX.read_text(encoding="utf-8")

if MARKER in html:
    print("Passeport de langue déjà installé")
    raise SystemExit(0)

if "DIGIY ACTION PRO 7 LANGUES MONOFICHIER" not in html:
    raise SystemExit("Runtime ACTION PRO 7 langues introuvable")

html = re.sub(
    r'<meta name="digiy-build" content="[^"]+"\s*/?>',
    '<meta name="digiy-build" content="action-pro-7lang-monofichier-20260731-v3-passport"/>',
    html,
    count=1,
)

old_persist = 'function persist(lang){try{localStorage.setItem(KEY,lang);localStorage.setItem(LEGACY,base(lang))}catch(_){}}'
new_persist = 'function persist(lang){try{localStorage.setItem(KEY,lang);localStorage.setItem(LEGACY,base(lang));localStorage.setItem("digiy-lang",lang)}catch(_){}}'
if old_persist not in html:
    raise SystemExit("Fonction persist attendue introuvable")
html = html.replace(old_persist, new_persist, 1)

anchor = '  function buildBar(){\n'
passport = r'''  /* DIGIY LANGUAGE PASSPORT 7L v1 */
  function isDigiyHost(hostname){
    const host=String(hostname||"").toLowerCase();
    return host==="digiylyfe.com"||host.endsWith(".digiylyfe.com");
  }

  function linkWithLanguage(href){
    try{
      const url=new URL(href,location.href);
      if(!/^https?:$/.test(url.protocol)||!isDigiyHost(url.hostname))return href;
      url.searchParams.set("lang",actual());
      return url.toString();
    }catch(_){return href}
  }

  function propagateLanguage(root){
    const scope=root&&root.querySelectorAll?root:document;
    scope.querySelectorAll('a[href]').forEach(function(link){
      const current=link.getAttribute("href");
      if(!current||current.startsWith("#"))return;
      const next=linkWithLanguage(current);
      if(next!==current)link.setAttribute("href",next);
    });
  }

'''
if anchor not in html:
    raise SystemExit("Point d'injection buildBar introuvable")
html = html.replace(anchor, passport + anchor, 1)

old_apply_end = '    applying=false;\n  }\n\n  function applyDynamic(){'
new_apply_end = '    propagateLanguage(document);\n    applying=false;\n  }\n\n  function applyDynamic(){'
if old_apply_end not in html:
    raise SystemExit("Fin applyStatic introuvable")
html = html.replace(old_apply_end, new_apply_end, 1)

old_bottom = '  const cards=document.getElementById("cards");if(cards)new MutationObserver(function(){requestAnimationFrame(applyDynamic)}).observe(cards,{childList:true});\n  window.addEventListener("storage",function(e){if(e.key===KEY)setLanguage(e.newValue||"fr")});'
new_bottom = '''  const cards=document.getElementById("cards");if(cards)new MutationObserver(function(){requestAnimationFrame(function(){applyDynamic();propagateLanguage(cards)})}).observe(cards,{childList:true});
  const passportObserver=new MutationObserver(function(){requestAnimationFrame(function(){propagateLanguage(document)})});
  passportObserver.observe(document.body,{childList:true,subtree:true});
  propagateLanguage(document);
  window.addEventListener("storage",function(e){if(e.key===KEY||e.key==="digiy-lang")setLanguage(e.newValue||"fr")});'''
if old_bottom not in html:
    raise SystemExit("Bloc final runtime introuvable")
html = html.replace(old_bottom, new_bottom, 1)

checks = {
    "marker": MARKER in html,
    "common_key": 'localStorage.setItem("digiy-lang",lang)' in html,
    "propagation": "function propagateLanguage(root)" in html,
    "seven_languages": 'const LANGS=["fr","en","es","de","it","nl","ar"]' in html,
    "no_iframe": "<iframe" not in html.lower(),
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("Contrôles échoués: " + ", ".join(failed))

INDEX.write_text(html, encoding="utf-8")
print("Passeport de langue ACTION PRO installé")
