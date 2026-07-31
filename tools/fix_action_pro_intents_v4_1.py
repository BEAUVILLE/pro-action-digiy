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


# Version publique explicite et idempotente.
if 'action-pro-7lang-monofichier-20260731-v4-2-written' not in index:
    index = sub_once(
        index,
        r'action-pro-7lang-monofichier-20260731-v4-(?:routing|1-intents)',
        'action-pro-7lang-monofichier-20260731-v4-2-written',
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

# Recherche écrite : intégrer ES, DE, IT, NL et AR dans digiyExpandQuery lui-même.
core_marker = 'DIGIY CORE MULTILINGUE ÉCRIT 7L'
if core_marker not in index:
    anchor_pattern = (
        r'(function digiyExpandQuery\(text\)\{\s*'
        r'const raw = String\(text \|\| ""\);\s*'
        r'const t = clean\(raw\);\s*'
        r'let extra = "";)'
    )
    core_block = r'''

    /* DIGIY CORE MULTILINGUE ÉCRIT 7L
       La saisie clavier, les exemples et la voix utilisent désormais
       exactement le même moteur central, sans temporisation ni détour. */
    const writtenMultilingualRules = [
      [/(?:chez|che|sche)?\s*baptist|batist|باتيست/, " chez baptiste logement chambre hebergement dormir"],
      [/plomb|plumb|fontaner|klempner|idraulic|loodgieter|سباك|تسرب/, " plombier plomberie fuite robinet wc sanitaire"],
      [/macon|mason|builder|alban|maurer|murator|metselaar|بنّاء|بناء|construction|construccion|costruzione/, " macon maçon maçonnerie batisseur bâtisseur construction"],
      [/electric|elektrik|elettric|elektricien|كهرب/, " electricien électricien electricite électricité courant"],
      [/solair|solar|fotovolta|zonne|شمس/, " solaire panneau panneaux batterie energie régulateur"],
      [/chauff|driver|taxi|airport|aibd|conductor|chofer|fahrer|flughafen|autista|aeroporto|luchthaven|سائق|مطار|توصيل/, " chauffeur driver taxi aibd trajet transfert voiture"],
      [/chambre|logement|location|appart|room|flat|house|villa|lodg|accommodation|hotel|habitaci|alojamiento|zimmer|wohnung|unterkunft|camera|alloggio|kamer|woning|غرفة|سكن|شقة|فندق/, " chambre appartement logement location villa dormir nuit hébergement hôtel"],
      [/table|restaurant|dinner|lunch|mesa|comer|tisch|essen|tavolo|mangiare|ristorante|tafel|eten|طاولة|مطعم|عشاء/, " réserver reservation table restaurant manger diner"],
      [/reserv|booking|book|prenot|buchen|reserveren|حجز/, " réserver reservation"],
      [/boutique|commerce|produit|shop|store|market|product|buy|tienda|comprar|geschaft|laden|produkt|negozio|winkel|متجر|منتج|شراء/, " boutique market produit acheter serviette drap commerce"],
      [/emploi|travail|mission|job|work|employment|trabajo|empleo|arbeit|auftrag|lavoro|incarico|werk|opdracht|عمل|وظيفة|مهمة/, " emploi travail job mission recrute postuler"],
      [/sortie|visite|decouvr|activit|outing|visit|discover|tour|salida|ausflug|entdecken|uscita|scoprire|uitstap|ontdekken|نزهة|زيارة|اكتشاف/, " sortie visite découvrir idée activité explore petite cote"],
      [/paiement|argent|wave|preuve|payment|money|proof|pago|dinero|zahlung|geld|nachweis|pagamento|denaro|betaling|bewijs|دفع|مال|إثبات/, " paiement pay argent wave preuve reçu"],
      [/adresse|route|venir|address|direction|map|direccion|ruta|kommen|weg|strada|indirizzo|adres|طريق|عنوان|خريطة/, " adresse route venir carte localisation"],
      [/annonce|reseau|publier|announcement|network|publish|anuncio|red|anzeige|netzwerk|annuncio|rete|advertentie|netwerk|إعلان|شبكة|نشر/, " annonce réseau publier visibilité"],
      [/audio|ecouter|vision|listen|escuchar|horen|ascoltare|luisteren|استماع|صوت/, " audio écouter vision"],
      [/assistant|guide|help|ayuda|hilfe|aiuto|hulp|مساعدة|إرشاد/, " assistant aide guide"]
    ];
    writtenMultilingualRules.forEach(function(rule){
      if(rule[0].test(t)) extra += rule[1];
    });'''
    index = sub_once(index, anchor_pattern, r'\1' + core_block, 'moteur écrit multilingue')

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

# Forcer le navigateur à recharger l'annuaire et l'index corrigés.
index = re.sub(
    r'\./annuaire-public-digiy\.js\?v=[^"\']+',
    './annuaire-public-digiy.js?v=20260731-routing-v4-2',
    index,
    count=1,
)
annuaire = re.sub(r'20260731-routing-v4(?:-1)?', '20260731-routing-v4-2', annuaire)

required_index = [
    'action-pro-7lang-monofichier-20260731-v4-2-written',
    'DIGIY CORE MULTILINGUE ÉCRIT 7L',
    'writtenMultilingualRules',
    'fontaner',
    'klempner',
    'idraulic',
    'loodgieter',
    'سباك',
    'isRestaurantReservationText(t) && !namedBaptisteHit',
    '"réserver reservation"',
    '"audio écouter vision"',
    '"assistant aide guide"',
    'annuaire-public-digiy.js?v=20260731-routing-v4-2',
]
for marker in required_index:
    if marker not in index:
        raise SystemExit(f'marqueur index absent: {marker}')

for forbidden in [
    'audio écouter vision assistant aide guide',
    '(book|booking|reserve|reservation|table|restaurant|dinner|lunch|eat)',
    '(audio|listen|vision|assistant|guide|help)',
]:
    if forbidden in index:
        raise SystemExit(f'intention encore mélangée: {forbidden}')

if '20260731-routing-v4-2' not in annuaire:
    raise SystemExit('version annuaire v4-2 absente')

index_path.write_text(index, encoding='utf-8')
annuaire_path.write_text(annuaire, encoding='utf-8')
print('ACTION PRO v4.2 : recherche écrite branchée sur le moteur central 7 langues.')
