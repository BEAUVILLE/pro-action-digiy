from pathlib import Path
import re

index_path = Path('index.html')
annuaire_path = Path('annuaire-public-digiy.js')
index = index_path.read_text(encoding='utf-8')
annuaire = annuaire_path.read_text(encoding='utf-8')

index = index.replace(
    'action-pro-7lang-monofichier-20260731-v4-3-market-aliases',
    'action-pro-7lang-monofichier-20260731-v4-4-astou-direct',
    1,
)
index = re.sub(
    r'\./annuaire-public-digiy\.js\?v=[^"\']+',
    './annuaire-public-digiy.js?v=20260731-routing-v4-4',
    index,
    count=1,
)
annuaire = re.sub(r'20260731-routing-v4-3(?:-1)?', '20260731-routing-v4-4', annuaire)

# Arabic text must survive annuaire normalization.
annuaire = annuaire.replace(
    '.replace(\n        /[^a-z0-9\\s]/g,\n        " "\n      )',
    '.replace(\n        /[^a-z0-9\\u0600-\\u06FF\\s]/g,\n        " "\n      )',
    1,
)

# Rank exact words typed by the client above generic translated family words.
if 'function directRelevance(item, t, secteur, rawT){' not in index:
    index = index.replace(
        'function directRelevance(item, t, secteur){',
        'function directRelevance(item, t, secteur, rawT){',
        1,
    )

anchor = '''    const keyHit = keys.some(k => {
      const ck = clean(k);
      return ck && !isOnlyZoneWord(ck) && t.includes(ck);
    });

    const mainHit = [item.metier, item.categorie, item.title].some(v => {
      const cv = clean(v);
      return cv && t.includes(cv);
    });'''
replacement = '''    const rawKeyHits = keys
      .map(k => clean(k))
      .filter(ck => ck && !isOnlyZoneWord(ck) && rawT.includes(ck));

    const rawNameHit = [item.nom, item.title, item.titre]
      .filter(Boolean)
      .some(v => {
        const cv = clean(v);
        return cv && rawT.includes(cv);
      });

    const keyHit = keys.some(k => {
      const ck = clean(k);
      return ck && !isOnlyZoneWord(ck) && t.includes(ck);
    });

    const mainHit = [item.metier, item.categorie, item.title].some(v => {
      const cv = clean(v);
      return cv && t.includes(cv);
    });'''
if 'const rawKeyHits = keys' not in index:
    if anchor not in index:
        raise SystemExit('bloc keyHit introuvable')
    index = index.replace(anchor, replacement, 1)

index = index.replace(
    'if(!keyHit && !mainHit && !genericHit && !namedBaptisteHit) return null;',
    'if(!rawKeyHits.length && !rawNameHit && !keyHit && !mainHit && !genericHit && !namedBaptisteHit) return null;',
    1,
)
index = index.replace(
    'need: (namedBaptisteHit ? 4 : 0) + (mainHit ? 2 : 0) + (keyHit ? 1 : 0),',
    'need: (namedBaptisteHit ? 30 : 0) + (rawNameHit ? 20 : 0) + (rawKeyHits.length ? 12 + Math.min(rawKeyHits.length, 6) : 0) + (mainHit ? 2 : 0) + (keyHit ? 1 : 0),',
    1,
)

old_match = '''  function matchDirectFiches(text){
    const t = clean(digiyExpandQuery(text));
    const secteur = detectSecteurFromCleanText(t);'''
new_match = '''  function matchDirectFiches(text){
    const rawT = clean(text);
    const t = clean(digiyExpandQuery(text));
    const secteur = detectSecteurFromCleanText(t);'''
if old_match in index:
    index = index.replace(old_match, new_match, 1)
index = index.replace(
    'directRelevance(item, t, secteur)',
    'directRelevance(item, t, secteur, rawT)',
    1,
)

# Explicit Astou spoken/text response.
needle = '''      if(titleClean.includes("bcheikh")){
        return en
          ? "I understood: you are looking for clothing in Saly. I bring up the BCHEIKH public shop with its products, prices and direct storefront."
          : "J’ai compris : tu cherches des vêtements à Saly. Je te remonte la boutique publique BCHEIKH avec ses produits, ses prix et sa vitrine directe.";
      }'''
astou_block = '''      if(titleClean.includes("astou")){
        return en
          ? "I understood: you are looking for home linen or beach products in Saly. I bring up Astou Boutique with direct contact."
          : "J’ai compris : tu cherches du linge de maison ou des articles de plage à Saly. Je te remonte Astou Boutique avec son contact direct.";
      }
'''
if 'titleClean.includes("astou")' not in index:
    if needle not in index:
        raise SystemExit('bloc réponse BCHEIKH introuvable')
    index = index.replace(needle, astou_block + needle, 1)

required = [
    'action-pro-7lang-monofichier-20260731-v4-4-astou-direct',
    'rawKeyHits',
    'rawNameHit',
    'directRelevance(item, t, secteur, rawT)',
    'titleClean.includes("astou")',
    'annuaire-public-digiy.js?v=20260731-routing-v4-4',
]
for marker in required:
    if marker not in index:
        raise SystemExit(f'marqueur absent: {marker}')

for marker in ['"toallas"', '"handtücher"', '"asciugamani"', '"handdoeken"', '"مناشف"']:
    if marker not in annuaire:
        raise SystemExit(f'alias Astou absent: {marker}')

index_path.write_text(index, encoding='utf-8')
annuaire_path.write_text(annuaire, encoding='utf-8')
print('ACTION PRO v4.4 : produit exact et nom exact prioritaires, Astou verrouillée.')
