from pathlib import Path

index_path = Path('index.html')
annuaire_path = Path('annuaire-public-digiy.js')
index = index_path.read_text(encoding='utf-8')
annuaire = annuaire_path.read_text(encoding='utf-8')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: attendu 1, trouvé {count}')
    return text.replace(old, new, 1)

index = replace_once(
    index,
    'action-pro-7lang-monofichier-20260731-v4-routing',
    'action-pro-7lang-monofichier-20260731-v4-1-intents',
    'version build',
)

# Un nom propre Chez Baptiste ne doit jamais être rejeté par la barrière restaurant.
index = replace_once(
    index,
    'if(isRestaurantReservationText(t) && !family.includes("restaurant") && !family.includes("reservation") && !family.includes("réservation")){',
    'if(isRestaurantReservationText(t) && !namedBaptisteHit && !family.includes("restaurant") && !family.includes("reservation") && !family.includes("réservation")){',
    'barrière restaurant',
)

# Séparer l'acte générique de réserver d'une vraie intention table/restaurant.
old_reservation_rule = '    [/réserv|reserv|booking|book|table|restaurant|dinner|lunch|mesa|comer|tisch|essen|prenotar|tavolo|mangiare|tafel|eten|حجز|طاولة|مطعم|عشاء/,"réserver reservation table restaurant manger diner"],'
new_reservation_rules = '''    [/table|restaurant|dinner|lunch|mesa|comer|tisch|essen|tavolo|mangiare|tafel|eten|طاولة|مطعم|عشاء/,"réserver reservation table restaurant manger diner"],
    [/réserv|reserv|booking|book|prenotar|حجز/,"réserver reservation"],'''
index = replace_once(index, old_reservation_rule, new_reservation_rules, 'règles réservation')

# Séparer écouter/audio de aide/assistant.
old_audio_rule = '    [/audio|écouter|ecouter|vision|assistant|guide|help|listen|escuchar|ayuda|hören|hilfe|ascoltare|aiuto|luisteren|hulp|استماع|صوت|مساعدة/,"audio écouter vision assistant aide guide"]'
new_audio_rules = '''    [/audio|écouter|ecouter|vision|listen|escuchar|hören|ascoltare|luisteren|استماع|صوت/,"audio écouter vision"],
    [/assistant|guide|help|ayuda|hilfe|aiuto|hulp|مساعدة|إرشاد/,"assistant aide guide"]'''
index = replace_once(index, old_audio_rule, new_audio_rules, 'règles audio assistant')

# Forcer le navigateur à relire l'annuaire corrigé au lieu d'un ancien cache.
index = replace_once(
    index,
    './annuaire-public-digiy.js?v=20260725-sarlat-v1',
    './annuaire-public-digiy.js?v=20260731-routing-v4-1',
    'cache annuaire',
)

annuaire = annuaire.replace('20260731-routing-v4', '20260731-routing-v4-1')

required = [
    'action-pro-7lang-monofichier-20260731-v4-1-intents',
    '!namedBaptisteHit',
    '"réserver reservation"',
    '"audio écouter vision"',
    '"assistant aide guide"',
    'annuaire-public-digiy.js?v=20260731-routing-v4-1',
]
for marker in required:
    if marker not in index:
        raise SystemExit(f'marqueur absent: {marker}')
if 'audio écouter vision assistant aide guide' in index:
    raise SystemExit('audio et assistant encore mélangés')
if 'réserver reservation table restaurant manger diner"],\n    [/réserv' not in index:
    raise SystemExit('règles réservation non séparées')

index_path.write_text(index, encoding='utf-8')
annuaire_path.write_text(annuaire, encoding='utf-8')
print('Intentions v4.1 séparées : logement/réservation et audio/assistant.')
