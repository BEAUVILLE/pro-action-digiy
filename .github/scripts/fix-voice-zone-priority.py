from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')


def once(old, new, label):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {n}')
    s = s.replace(old, new, 1)

once(
'''  function responseDirecte(text, list){
    const t = clean(digiyExpandQuery(text));
    const secteur = detectSecteurFromCleanText(t);
    const direct = (list || []).find(x => x.kind === "directory");
    const en = digiyLang() === "en";
    if(direct){
      const zone = direct.secteur ? (en ? " in " : " à ") + direct.secteur : (secteur ? (en ? " in " : " à ") + secteur.label : "");''',
'''  function responseDirecte(text, list){
    const rawT = clean(text);
    const t = clean(digiyExpandQuery(text));
    const secteur = detectSecteurFromCleanText(rawT) || detectSecteurFromCleanText(t);
    const directCandidate = (list || []).find(x => x.kind === "directory");
    const directMatchesRequestedZone = !directCandidate || !secteur || (
      clean(directCandidate.secteur || "").includes(clean(secteur.label)) ||
      (Array.isArray(directCandidate.zones) && directCandidate.zones.some(z => clean(z) === clean(secteur.label)))
    );
    const direct = directMatchesRequestedZone ? directCandidate : null;
    const en = digiyLang() === "en";
    if(direct){
      const zone = secteur ? (en ? " in " : " à ") + secteur.label : (direct.secteur ? (en ? " in " : " à ") + direct.secteur : "");''',
'prioritize spoken requested zone'
)

once(
'''      if(plumberSearch && plumberCount >= 2){
        return en
          ? "I understood: you are looking for a plumber in Saly. Two plumbers are available: Babacar Plombier Pro, with his official DIGIY BUILD card, and Helage, a qualified partner. I bring up both cards with direct contact."
          : "J’ai compris : tu cherches un plombier à Saly. J’ai deux plombiers disponibles : Babacar Plombier Pro, avec sa fiche officielle DIGIY BUILD, et Helage, partenaire qualifié. Je te remonte leurs deux fiches avec contact direct.";
      }
      if(titleClean.includes("babacar")){
        return en
          ? "I understood: you are looking for a plumber in Saly. I bring up Babacar Plombier Pro with his official DIGIY BUILD card and direct contact."
          : "J’ai compris : tu cherches un plombier à Saly. Je te remonte Babacar Plombier Pro avec sa fiche officielle DIGIY BUILD et son contact direct.";
      }''',
'''      if(plumberSearch && plumberCount >= 2){
        return en
          ? "I understood: you are looking for a plumber" + zone + ". Two plumbers are available: Babacar Plombier Pro, with his official DIGIY BUILD card, and Helage, a qualified partner. I bring up both cards with direct contact."
          : "J’ai compris : tu cherches un plombier" + zone + ". J’ai deux plombiers disponibles : Babacar Plombier Pro, avec sa fiche officielle DIGIY BUILD, et Helage, partenaire qualifié. Je te remonte leurs deux fiches avec contact direct.";
      }
      if(titleClean.includes("babacar")){
        return en
          ? "I understood: you are looking for a plumber" + zone + ". I bring up Babacar Plombier Pro with his official DIGIY BUILD card and direct contact."
          : "J’ai compris : tu cherches un plombier" + zone + ". Je te remonte Babacar Plombier Pro avec sa fiche officielle DIGIY BUILD et son contact direct.";
      }''',
'remove hardcoded Saly from plumber speech'
)

path.write_text(s, encoding='utf-8')

checks = [
    'const rawT = clean(text);',
    'detectSecteurFromCleanText(rawT) || detectSecteurFromCleanText(t)',
    'const directMatchesRequestedZone =',
    'const zone = secteur ? (en ? " in " : " à ") + secteur.label',
    'you are looking for a plumber" + zone',
    'tu cherches un plombier" + zone'
]
text = path.read_text(encoding='utf-8')
for check in checks:
    if check not in text:
        raise SystemExit(f'missing check: {check}')

# The voice-specific hardcoded phrases must be gone.
for bad in [
    'you are looking for a plumber in Saly. Two plumbers are available',
    'tu cherches un plombier à Saly. J’ai deux plombiers disponibles',
    'you are looking for a plumber in Saly. I bring up Babacar',
    'tu cherches un plombier à Saly. Je te remonte Babacar'
]:
    if bad in text:
        raise SystemExit(f'hardcoded voice zone still present: {bad}')

print('VOICE ZONE PATCH OK')
