from pathlib import Path
import re

index_path = Path('index.html')
annuaire_path = Path('annuaire-public-digiy.js')
index = index_path.read_text(encoding='utf-8')
annuaire = annuaire_path.read_text(encoding='utf-8')


def sub_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'{label}: remplacement attendu 1, trouvé {count}')
    return updated


# Version publique explicite. Le script peut être relancé sans casser la branche.
if 'action-pro-7lang-monofichier-20260731-v4-1-intents' not in index:
    index = sub_once(
        index,
        r'action-pro-7lang-monofichier-20260731-v4-routing',
        'action-pro-7lang-monofichier-20260731-v4-1-intents',
        'version build',
    )

# Chez Baptiste est un nom propre : il ne doit jamais être rejeté par la barrière restaurant.
if 'isRestaurantReservationText(t) && !namedBaptisteHit' not in index:
    index = sub_once(
        index,
        r'if\(isRestaurantReservationText\(t\)\s*&&\s*!family\.includes\("restaurant"\)',
        'if(isRestaurantReservationText(t) && !namedBaptisteHit && !family.includes("restaurant")',
        'barrière restaurant',
    )

# MOTEUR NATIF : séparer réserver d'une vraie demande table/restaurant.
old_native_booking = 'if(/\\b(book|booking|reserve|reservation|table|restaurant|dinner|lunch|eat)\\b/.test(t)) extra += " réserver reservation réservation table restaurant manger diner";'
if old_native_booking in index:
    index = index.replace(
        old_native_booking,
        'if(/\\b(table|restaurant|dinner|lunch|eat)\\b/.test(t)) extra += " réserver reservation réservation table restaurant manger diner";\n    if(/\\b(book|booking|reserve|reservation)\\b/.test(t)) extra += " réserver reservation réservation";',
        1,
    )

# MOTEUR NATIF : séparer AUDIO de ASSISTANT/AIDE.
old_native_audio = 'if(/\\b(audio|listen|vision|assistant|guide|help)\\b/.test(t)) extra += " audio écouter vision assistant aide guide";'
if old_native_audio in index:
    index = index.replace(
        old_native_audio,
        'if(/\\b(audio|listen|vision)\\b/.test(t)) extra += " audio écouter vision";\n    if(/\\b(assistant|guide|help)\\b/.test(t)) extra += " assistant aide guide";',
        1,
    )

# COUCHE 7 LANGUES : séparer réservation générique et table/restaurant.
if '"réserver reservation"],' not in index:
    index = sub_once(
        index,
        r'\s*\[/réserv\|reserv\|booking\|book\|table\|restaurant\|dinner\|lunch\|mesa\|comer\|tisch\|essen\|prenotar\|tavolo\|mangiare\|tafel\|eten\|حجز\|طاولة\|مطعم\|عشاء/,"réserver reservation table restaurant manger diner"\],',
        '\n    [/table|restaurant|dinner|lunch|mesa|comer|tisch|essen|tavolo|mangiare|tafel|eten|طاولة|مطعم|عشاء/,"réserver reservation table restaurant manger diner"],\n    [/réserv|reserv|booking|book|prenotar|حجز/,"réserver reservation"],',
        'règles réservation 7 langues',
    )

# COUCHE 7 LANGUES : séparer AUDIO de ASSISTANT/AIDE.
if '"assistant aide guide"]' not in index:
    index = sub_once(
        index,
        r'\s*\[/audio\|écouter\|ecouter\|vision\|assistant\|guide\|help\|listen\|escuchar\|ayuda\|hören\|hilfe\|ascoltare\|aiuto\|luisteren\|hulp\|استماع\|صوت\|مساعدة/,"audio écouter vision assistant aide guide"\]',
        '\n    [/audio|écouter|ecouter|vision|listen|escuchar|hören|ascoltare|luisteren|استماع|صوت/,"audio écouter vision"],\n    [/assistant|guide|help|ayuda|hilfe|aiuto|hulp|مساعدة|إرشاد/,"assistant aide guide"]',
        'règles audio assistant 7 langues',
    )

# Forcer le navigateur à recharger l'annuaire corrigé.
index = re.sub(
    r'\./annuaire-public-digiy\.js\?v=[^"\']+',
    './annuaire-public-digiy.js?v=20260731-routing-v4-1',
    index,
    count=1,
)

annuaire = annuaire.replace('20260731-routing-v4-1-1', '20260731-routing-v4-1')
annuaire = annuaire.replace('20260731-routing-v4', '20260731-routing-v4-1')

required_index = [
    'action-pro-7lang-monofichier-20260731-v4-1-intents',
    'isRestaurantReservationText(t) && !namedBaptisteHit',
    '"réserver reservation"',
    '"audio écouter vision"',
    '"assistant aide guide"',
    'if(/\\b(book|booking|reserve|reservation)\\b/.test(t))',
    'if(/\\b(assistant|guide|help)\\b/.test(t))',
    'annuaire-public-digiy.js?v=20260731-routing-v4-1',
]
for marker in required_index:
    if marker not in index:
        raise SystemExit(f'marqueur index absent: {marker}')

for forbidden in [
    'audio écouter vision assistant aide guide',
    '/réserv|reserv|booking|book|table|restaurant|dinner|lunch',
    '(book|booking|reserve|reservation|table|restaurant|dinner|lunch|eat)',
    '(audio|listen|vision|assistant|guide|help)',
]:
    if forbidden in index:
        raise SystemExit(f'intention encore mélangée: {forbidden}')

if '20260731-routing-v4-1' not in annuaire:
    raise SystemExit('version annuaire absente')

index_path.write_text(index, encoding='utf-8')
annuaire_path.write_text(annuaire, encoding='utf-8')
print('ACTION PRO v4.1 : moteurs natif et 7 langues séparés et contrôlés.')
