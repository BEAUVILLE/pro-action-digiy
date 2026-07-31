from pathlib import Path
import re


def replace_exact(text: str, old: str, new: str, expected: int, label: str) -> str:
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{label}: attendu {expected}, trouvé {count}")
    return text.replace(old, new)


def sub_once(text: str, pattern: str, replacement: str, label: str, flags: int = 0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: remplacement introuvable ou multiple ({count})")
    return updated


index_path = Path("index.html")
annuaire_path = Path("annuaire-public-digiy.js")
index = index_path.read_text(encoding="utf-8")
annuaire = annuaire_path.read_text(encoding="utf-8")

# Version publique explicite.
index = replace_exact(
    index,
    'action-pro-7lang-monofichier-20260731-v3-passport',
    'action-pro-7lang-monofichier-20260731-v4-routing',
    1,
    "version build",
)

# La porte VOIX ne doit plus capter une recherche métier juste parce qu'elle contient
# les mots génériques « recherche », « demande » ou « besoin ».
index = replace_exact(
    index,
    '{keys:["voix","parler","recherche","demande","besoin","j’écoute","jecoute","écoute","ecoute","waxal","soxla"], icon:"🎙️", title:"VOIX"',
    '{keys:["voix","parler","dictée","dictee","micro","j’écoute","jecoute","écoute","ecoute","waxal","soxla"], icon:"🎙️", title:"VOIX"',
    1,
    "clés porte VOIX",
)

# Variantes de nom dans les deux fiches de secours intégrées au monofichier.
index = replace_exact(
    index,
    '"chez baptiste","logement"',
    '"chez baptiste","baptiste","chez batist","batist","باتيست","logement"',
    2,
    "variantes Chez Baptiste Saly",
)
index = replace_exact(
    index,
    '"sarlat chez baptiste","chez baptiste sarlat","chambre"',
    '"sarlat chez baptiste","chez baptiste sarlat","chez baptiste","baptiste","chez batist","batist","باتيست","chambre"',
    2,
    "variantes Chez Baptiste Sarlat",
)

# Un nom propre exact est prioritaire, même si la phrase ne contient pas le mot logement.
family_line = '    const family = clean([item.metier, item.categorie, item.title, item.sousCategorie].filter(Boolean).join(" "));\n'
named_block = family_line + '''    const namedBaptisteHit = (\n      t.includes("chez baptiste") ||\n      t.includes("che baptiste") ||\n      t.includes("sche baptiste") ||\n      t.includes("baptiste") ||\n      t.includes("batist") ||\n      t.includes("باتيست")\n    ) && clean(item.title || "").includes("baptiste");\n'''
index = replace_exact(index, family_line, named_block, 1, "détection nom propre")
index = replace_exact(
    index,
    'if((family.includes("loc") || family.includes("logement") || family.includes("appartement")) && !isHousingText(t)){',
    'if((family.includes("loc") || family.includes("logement") || family.includes("appartement")) && !isHousingText(t) && !namedBaptisteHit){',
    1,
    "verrou logement",
)
index = replace_exact(
    index,
    'if(!keyHit && !mainHit && !genericHit) return null;',
    'if(!keyHit && !mainHit && !genericHit && !namedBaptisteHit) return null;',
    1,
    "acceptation nom propre",
)
index = replace_exact(
    index,
    'need: (mainHit ? 2 : 0) + (keyHit ? 1 : 0),',
    'need: (namedBaptisteHit ? 4 : 0) + (mainHit ? 2 : 0) + (keyHit ? 1 : 0),',
    1,
    "priorité nom propre",
)

# Toute variante vocale du nom est ramenée au nom officiel et à l'intention logement.
index = replace_exact(
    index,
    '  const RULES=[\n',
    '  const RULES=[\n    [/(?:chez|che|sche)?\\s*baptist|batist|باتيست/," chez baptiste logement chambre hébergement dormir"],\n',
    1,
    "règle multilingue Baptiste",
)

# Les sept langues utilisent désormais le même moteur natif à chaque recherche.
# On ne dépend plus d'une modification temporaire du champ pendant 80 ms.
expand_line = '  function expand(value){const source=String(value||"");const n=normalize(source);let extra="";RULES.forEach(function(rule){if(rule[0].test(n))extra+=" "+rule[1]});return source+extra}\n'
bridge = expand_line + '''\n  const nativeCoreExpand = typeof window.digiyExpandQuery === "function"\n    ? window.digiyExpandQuery\n    : null;\n  if(nativeCoreExpand){\n    window.digiyExpandQuery=function(value){\n      return nativeCoreExpand(expand(value));\n    };\n  }\n'''
index = replace_exact(index, expand_line, bridge, 1, "pont moteur sept langues")

old_search = '''    if(target.id==="searchBtn"&&field&&lang!=="fr"&&lang!=="en"){\n      lastNativeQuery=field.value.trim();field.value=expand(lastNativeQuery);setTimeout(function(){field.value=lastNativeQuery;applyDynamic()},80);\n    }\n    if(target.matches(".chip[data-q],.examplePhrase[data-q]")&&lang!=="fr"&&lang!=="en"){\n      const native=target.dataset.q||"";lastNativeQuery=native;target.dataset.q=expand(native);setTimeout(function(){target.dataset.q=native;if(field)field.value=native;applyDynamic()},100);\n    }\n'''
new_search = '''    if(target.id==="searchBtn"&&field){\n      lastNativeQuery=field.value.trim();\n    }\n    if(target.matches(".chip[data-q],.examplePhrase[data-q]")){\n      lastNativeQuery=target.dataset.q||"";\n    }\n'''
index = replace_exact(index, old_search, new_search, 1, "suppression temporisation multilingue")

# Annuaire public officiel : même jeu de variantes que le secours monofichier.
annuaire = annuaire.replace(
    'Version : 20260725-sarlat-v1',
    'Version : 20260731-routing-v4',
    1,
)
annuaire = annuaire.replace(
    'const VERSION = "20260725-sarlat-v1";',
    'const VERSION = "20260731-routing-v4";',
    1,
)
old_keys = 'keys: ["sarlat chez baptiste", "chez baptiste sarlat", "chambre", "chambre privée", "chez l habitant", "dormir", "hébergement", "logement", "nuit", "dormir à sarlat", "chambre à sarlat"],'
new_keys = 'keys: ["sarlat chez baptiste", "chez baptiste sarlat", "chez baptiste", "baptiste", "chez batist", "batist", "باتيست", "chambre", "chambre privée", "chez l habitant", "dormir", "hébergement", "logement", "nuit", "dormir à sarlat", "chambre à sarlat"],'
annuaire = replace_exact(annuaire, old_keys, new_keys, 1, "annuaire Chez Baptiste")

# Contrôles de doctrine et de sécurité fonctionnelle.
required_index = [
    'action-pro-7lang-monofichier-20260731-v4-routing',
    'const namedBaptisteHit',
    'window.digiyExpandQuery=function(value)',
    '"chez baptiste","baptiste","chez batist"',
    'title:"VOIX"',
    'title:"SARLAT CHEZ BAPTISTE — Chambre privée"',
    'title:"CHEZ BAPTISTE — Appartement à Saly"',
]
for marker in required_index:
    if marker not in index:
        raise SystemExit(f"marqueur index absent: {marker}")
if '"recherche","demande","besoin"' in index:
    raise SystemExit("les mots génériques sont encore dans la porte VOIX")
if "iframe" in index.lower():
    raise SystemExit("iframe interdit")
if '20260731-routing-v4' not in annuaire or '"chez baptiste", "baptiste"' not in annuaire:
    raise SystemExit("annuaire public non corrigé")

index_path.write_text(index, encoding="utf-8")
annuaire_path.write_text(annuaire, encoding="utf-8")
print("Correctif ACTION PRO v4 appliqué : nom propre + moteur 7 langues stable.")
