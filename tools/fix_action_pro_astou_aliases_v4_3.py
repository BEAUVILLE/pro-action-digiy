from pathlib import Path
import re

INDEX_PATH = Path("index.html")
DIRECTORY_PATH = Path("annuaire-public-digiy.js")

index = INDEX_PATH.read_text(encoding="utf-8")
directory = DIRECTORY_PATH.read_text(encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: attendu 1, trouvé {count}")
    return text.replace(old, new, 1)


index = index.replace(
    "action-pro-7lang-monofichier-20260731-v4-2-written",
    "action-pro-7lang-monofichier-20260731-v4-3-market-aliases",
    1,
)
index = re.sub(
    r"\./annuaire-public-digiy\.js\?v=[^\"']+",
    "./annuaire-public-digiy.js?v=20260731-routing-v4-3",
    index,
    count=1,
)
directory = re.sub(r"20260731-routing-v4-2(?:-1)?", "20260731-routing-v4-3", directory)

old_core_market = '[/boutique|commerce|produit|shop|store|market|product|buy|tienda|comprar|geschaft|laden|produkt|negozio|winkel|متجر|منتج|شراء/, " boutique market produit acheter serviette drap commerce"],'
new_core_market = '[/boutique|commerce|produit|shop|store|market|product|buy|towel|sheet|bathrobe|bed linen|home linen|tienda|comprar|toalla|sabana|albornoz|ropa de cama|geschaft|laden|produkt|handtuch|bettwasche|bettlaken|bademantel|negozio|asciugaman|lenzuol|accappatoio|biancheria|winkel|handdoek|laken|beddengoed|badjas|متجر|منتج|شراء|منشفة|مناشف|ملاءة|ملاءات|رداء حمام|مفروشات|بياضات/, " boutique market produit acheter serviette serviettes drap draps peignoir linge commerce"],'
index = replace_once(index, old_core_market, new_core_market, "règle MARKET centrale")

old_runtime_market = '[/boutique|commerce|produit|shop|store|market|product|buy|tienda|comprar|geschäft|laden|produkt|negozio|winkel|متجر|منتج|شراء/,"boutique market produit acheter serviette drap commerce"],'
new_runtime_market = '[/boutique|commerce|produit|shop|store|market|product|buy|towel|sheet|bathrobe|bed linen|home linen|tienda|comprar|toalla|sábana|sabana|albornoz|ropa de cama|geschäft|geschaft|laden|produkt|handtuch|handtücher|handtucher|bettwäsche|bettwasche|bettlaken|bademantel|negozio|asciugaman|lenzuol|accappatoio|biancheria|winkel|handdoek|laken|beddengoed|badjas|متجر|منتج|شراء|منشفة|مناشف|ملاءة|ملاءات|رداء حمام|مفروشات|بياضات/,"boutique market produit acheter serviette serviettes drap draps peignoir linge commerce"],'
index = replace_once(index, old_runtime_market, new_runtime_market, "règle MARKET runtime")

old_astou_keys = '''        "linge",
        "serviette",
        "drap",
        "peignoir",
        "fouta",

        "plage",
        "robe",
        "tenue",
        "beaute"'''
new_astou_keys = '''        "linge",
        "linge de maison",
        "serviette",
        "serviettes",
        "drap",
        "draps",
        "peignoir",
        "peignoirs",
        "fouta",
        "foutas",

        "towel",
        "towels",
        "sheet",
        "sheets",
        "bathrobe",
        "bed linen",
        "home linen",

        "toalla",
        "toallas",
        "sabana",
        "sabanas",
        "sábana",
        "sábanas",
        "albornoz",
        "albornoces",
        "ropa de cama",

        "handtuch",
        "handtucher",
        "handtücher",
        "bettwasche",
        "bettwäsche",
        "bettlaken",
        "bademantel",

        "asciugamano",
        "asciugamani",
        "lenzuolo",
        "lenzuola",
        "accappatoio",
        "biancheria casa",

        "handdoek",
        "handdoeken",
        "laken",
        "lakens",
        "beddengoed",
        "badjas",

        "منشفة",
        "مناشف",
        "ملاءة",
        "ملاءات",
        "رداء حمام",
        "مفروشات",
        "بياضات",

        "plage",
        "robe",
        "tenue",
        "beaute"'''
directory = replace_once(directory, old_astou_keys, new_astou_keys, "alias fiche Astou")

old_intent_market = '''        "linge",
        "serviette",
        "drap",
        "robe"'''
new_intent_market = '''        "linge",
        "serviette",
        "serviettes",
        "drap",
        "draps",
        "peignoir",
        "towel",
        "towels",
        "sheet",
        "sheets",
        "bathrobe",
        "toalla",
        "toallas",
        "sabana",
        "sabanas",
        "albornoz",
        "handtuch",
        "handtucher",
        "bettwasche",
        "bettlaken",
        "bademantel",
        "asciugamano",
        "asciugamani",
        "lenzuolo",
        "lenzuola",
        "accappatoio",
        "handdoek",
        "handdoeken",
        "laken",
        "lakens",
        "beddengoed",
        "badjas",
        "منشفة",
        "مناشف",
        "ملاءة",
        "ملاءات",
        "رداء حمام",
        "robe"'''
directory = replace_once(directory, old_intent_market, new_intent_market, "intention MARKET externe")

for marker in [
    "action-pro-7lang-monofichier-20260731-v4-3-market-aliases",
    "annuaire-public-digiy.js?v=20260731-routing-v4-3",
    "toalla",
    "handtuch",
    "asciugaman",
    "handdoek",
    "مناشف",
]:
    if marker not in index:
        raise SystemExit(f"marqueur index absent: {marker}")

for marker in [
    'id: "astou-boutique"',
    '"toallas"',
    '"handtücher"',
    '"asciugamani"',
    '"handdoeken"',
    '"مناشف"',
    "20260731-routing-v4-3",
]:
    if marker not in directory:
        raise SystemExit(f"marqueur annuaire absent: {marker}")

INDEX_PATH.write_text(index, encoding="utf-8")
DIRECTORY_PATH.write_text(directory, encoding="utf-8")
print("ACTION PRO v4.3 : catalogue Astou reconnu dans les sept langues.")
