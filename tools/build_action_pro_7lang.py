from pathlib import Path
import re

INDEX = Path("index.html")
MARKER = "<!-- DIGIY ACTION PRO 7 LANGUES MONOFICHIER -->"

html = INDEX.read_text(encoding="utf-8")

if "<iframe" in html.lower():
    raise SystemExit("Refus: la base contient un iframe")

if MARKER in html:
    print("Extension déjà installée")
    raise SystemExit(0)

html = re.sub(
    r'<meta name="digiy-build" content="[^"]+"\s*/?>',
    '<meta name="digiy-build" content="action-pro-7lang-monofichier-20260731-v1"/>',
    html,
    count=1,
)
html = re.sub(
    r'<meta name="digiy-lang" content="[^"]+"\s*/?>',
    '<meta name="digiy-lang" content="fr-en-es-de-it-nl-ar-20260731"/>',
    html,
    count=1,
)

extension = r'''
<!-- DIGIY ACTION PRO 7 LANGUES MONOFICHIER -->
<style id="digiy-action-7lang-style">
  .langSwitch{display:none!important}
  #digiyLang7{
    position:sticky;top:0;z-index:60;
    display:flex;align-items:center;gap:5px;
    margin:0 0 4px;padding:6px 4px;
    overflow-x:auto;scrollbar-width:none;
    direction:ltr;background:rgba(255,249,234,.94);
    backdrop-filter:blur(12px);
    border:1px solid rgba(18,60,45,.10);
    border-radius:18px;
  }
  #digiyLang7::-webkit-scrollbar{display:none}
  #digiyLang7 button{
    flex:0 0 auto;min-width:45px;min-height:34px;
    padding:0 8px;border-radius:999px;
    border:1px solid rgba(18,60,45,.14);
    background:rgba(255,255,255,.82);color:#102f24;
    font-size:10px;font-weight:1000;cursor:pointer;
  }
  #digiyLang7 button[aria-pressed="true"]{
    background:linear-gradient(135deg,#fff2bf,#f6c453);
    border-color:rgba(246,196,83,.9);
    box-shadow:0 5px 13px rgba(18,60,45,.10);
  }
  html[dir="rtl"] textarea,
  html[dir="rtl"] .examplePhrase,
  html[dir="rtl"] .results,
  html[dir="rtl"] .ask{text-align:right;direction:rtl}
</style>
<script id="digiy-action-7lang-runtime">
(function(){
  "use strict";
  if(window.__DIGIY_ACTION_7LANG_MONO__) return;
  window.__DIGIY_ACTION_7LANG_MONO__ = true;

  const LANGS=["fr","en","es","de","it","nl","ar"];
  const KEY="digiy_action_lang_7";
  const LEGACY="digiy_voice_lang_v1";
  const LOCALE={fr:"fr-FR",en:"en-US",es:"es-ES",de:"de-DE",it:"it-IT",nl:"nl-NL",ar:"ar-SA"};
  const NativeUtterance=window.SpeechSynthesisUtterance;
  let lastNativeQuery="";
  let applying=false;

  const UI={
    fr:{title:"La Voix du Business — DIGIYLYFE",desc:"La Voix du Business DIGIYLYFE — demande simple, fiches directes, contact direct.",logo:"J’ÉCOUTE",label:"Parler ici ou dicter ton besoin",ask:"Demande vocale ou écrite",placeholder:"GO",examples:"🟥 EXEMPLES POUR PARLER",see:"VOIR",clear:"EFFACER",consigne:"🎧 Consignes",consigneLine:"📱 Besoin d’aide ? Appuie sur <b>GO</b> pour parler. Puis touche <b>VOIR</b> — DIGIY comprend et les fiches remontent.",resultTitle:"Fiches qui remontent",resultIntro:"Les résultats remontent directement après la demande.",empty:"Aucune fiche exacte.",footer:"La Voix du Business — DIGIYLYFE",audio:"Bienvenue dans La Voix du Business DIGIY. Appuie sur GO pour parler naturellement, ou choisis une icône rapide. Puis touche VOIR. DIGIY comprend le besoin et remonte les fiches utiles.",guide:"Consigne téléphone. Appuie sur GO pour parler. Ensuite appuie sur VOIR. DIGIY comprend et les fiches remontent.",reply:"J’ai compris ta demande. Les fiches utiles sont prêtes. DIGIY prépare, le terrain garde la main."},
    en:{title:"The Business Voice — DIGIYLYFE",desc:"DIGIYLYFE Business Voice — simple request, direct cards and direct contact.",logo:"I LISTEN",label:"Speak here or type what you need",ask:"Voice or written request",placeholder:"GO",examples:"🟥 EXAMPLES TO SPEAK",see:"SEE",clear:"CLEAR",consigne:"🎧 Guide",consigneLine:"📱 Need help? Tap <b>GO</b> to speak. Then tap <b>SEE</b> — DIGIY understands and the cards appear.",resultTitle:"Cards that appear",resultIntro:"Results appear directly after the request.",empty:"No exact card yet.",footer:"The Business Voice — DIGIYLYFE",audio:"Welcome to the DIGIY Business Voice. Tap GO to speak naturally, or choose a quick icon. Then tap SEE. DIGIY understands the need and brings up useful cards.",guide:"Phone guide. Tap GO to speak. Then tap SEE. DIGIY understands and the cards appear.",reply:"I understood your request. The useful cards are ready. DIGIY prepares and the field keeps control."},
    es:{title:"La Voz del Negocio — DIGIYLYFE",desc:"La Voz del Negocio DIGIYLYFE — solicitud simple, fichas directas y contacto directo.",logo:"ESCUCHO",label:"Habla aquí o escribe lo que necesitas",ask:"Solicitud por voz o escrita",placeholder:"GO",examples:"🟥 EJEMPLOS PARA HABLAR",see:"VER",clear:"BORRAR",consigne:"🎧 Guía",consigneLine:"📱 ¿Necesitas ayuda? Pulsa <b>GO</b> para hablar. Después pulsa <b>VER</b>: DIGIY entiende y aparecen las fichas.",resultTitle:"Fichas disponibles",resultIntro:"Los resultados aparecen directamente después de la solicitud.",empty:"Todavía no hay una ficha exacta.",footer:"La Voz del Negocio — DIGIYLYFE",audio:"Bienvenido a La Voz del Negocio DIGIY. Pulsa GO para hablar con naturalidad o elige un icono rápido. Después pulsa VER. DIGIY entiende la necesidad y muestra las fichas útiles.",guide:"Guía del teléfono. Pulsa GO para hablar. Después pulsa VER. DIGIY entiende y aparecen las fichas.",reply:"He entendido tu solicitud. Las fichas útiles están listas. DIGIY prepara y el terreno mantiene el control."},
    de:{title:"Die Stimme des Geschäfts — DIGIYLYFE",desc:"DIGIYLYFE Business Voice — einfache Anfrage, direkte Karten und direkter Kontakt.",logo:"ICH HÖRE",label:"Sprich hier oder schreibe, was du brauchst",ask:"Sprach- oder Texteingabe",placeholder:"GO",examples:"🟥 BEISPIELE ZUM SPRECHEN",see:"SEHEN",clear:"LÖSCHEN",consigne:"🎧 Anleitung",consigneLine:"📱 Hilfe nötig? Tippe auf <b>GO</b> und sprich. Tippe danach auf <b>SEHEN</b> — DIGIY versteht und die Karten erscheinen.",resultTitle:"Verfügbare Karten",resultIntro:"Die Ergebnisse erscheinen direkt nach der Anfrage.",empty:"Noch keine genaue Karte.",footer:"Die Stimme des Geschäfts — DIGIYLYFE",audio:"Willkommen bei der DIGIY Business Voice. Tippe auf GO und sprich natürlich oder wähle ein Symbol. Tippe danach auf SEHEN. DIGIY versteht den Bedarf und zeigt nützliche Karten.",guide:"Telefonanleitung. Tippe auf GO und sprich. Tippe danach auf SEHEN. DIGIY versteht und die Karten erscheinen.",reply:"Ich habe deine Anfrage verstanden. Die nützlichen Karten sind bereit. DIGIY bereitet vor und das Feld behält die Kontrolle."},
    it:{title:"La Voce del Business — DIGIYLYFE",desc:"La Voce del Business DIGIYLYFE — richiesta semplice, schede dirette e contatto diretto.",logo:"ASCOLTO",label:"Parla qui o scrivi ciò che ti serve",ask:"Richiesta vocale o scritta",placeholder:"GO",examples:"🟥 ESEMPI PER PARLARE",see:"VEDI",clear:"CANCELLA",consigne:"🎧 Guida",consigneLine:"📱 Serve aiuto? Premi <b>GO</b> e parla. Poi premi <b>VEDI</b> — DIGIY capisce e compaiono le schede.",resultTitle:"Schede disponibili",resultIntro:"I risultati compaiono subito dopo la richiesta.",empty:"Nessuna scheda esatta per ora.",footer:"La Voce del Business — DIGIYLYFE",audio:"Benvenuto nella Voce del Business DIGIY. Premi GO per parlare naturalmente o scegli un’icona rapida. Poi premi VEDI. DIGIY capisce il bisogno e mostra le schede utili.",guide:"Guida telefono. Premi GO e parla. Poi premi VEDI. DIGIY capisce e compaiono le schede.",reply:"Ho capito la tua richiesta. Le schede utili sono pronte. DIGIY prepara e il territorio mantiene il controllo."},
    nl:{title:"De Stem van het Bedrijf — DIGIYLYFE",desc:"DIGIYLYFE Business Voice — eenvoudige vraag, directe kaarten en direct contact.",logo:"IK LUISTER",label:"Spreek hier of typ wat je nodig hebt",ask:"Gesproken of geschreven vraag",placeholder:"GO",examples:"🟥 VOORBEELDEN OM TE SPREKEN",see:"BEKIJK",clear:"WISSEN",consigne:"🎧 Gids",consigneLine:"📱 Hulp nodig? Tik op <b>GO</b> en spreek. Tik daarna op <b>BEKIJK</b> — DIGIY begrijpt het en de kaarten verschijnen.",resultTitle:"Beschikbare kaarten",resultIntro:"De resultaten verschijnen direct na de vraag.",empty:"Nog geen exacte kaart.",footer:"De Stem van het Bedrijf — DIGIYLYFE",audio:"Welkom bij de DIGIY Business Voice. Tik op GO en spreek natuurlijk of kies een snel pictogram. Tik daarna op BEKIJK. DIGIY begrijpt de vraag en toont nuttige kaarten.",guide:"Telefoongids. Tik op GO en spreek. Tik daarna op BEKIJK. DIGIY begrijpt het en de kaarten verschijnen.",reply:"Ik heb je vraag begrepen. De nuttige kaarten staan klaar. DIGIY bereidt voor en het terrein houdt de controle."},
    ar:{title:"صوت الأعمال — DIGIYLYFE",desc:"صوت الأعمال DIGIYLYFE — طلب بسيط وبطاقات مباشرة وتواصل مباشر.",logo:"أستمع",label:"تحدث هنا أو اكتب ما تحتاج إليه",ask:"طلب صوتي أو مكتوب",placeholder:"GO",examples:"🟥 أمثلة للتحدث",see:"اعرض",clear:"امسح",consigne:"🎧 الإرشادات",consigneLine:"📱 هل تحتاج إلى مساعدة؟ اضغط <b>GO</b> وتحدث، ثم اضغط <b>اعرض</b> — يفهم DIGIY وتظهر البطاقات.",resultTitle:"البطاقات المتاحة",resultIntro:"تظهر النتائج مباشرة بعد الطلب.",empty:"لا توجد بطاقة مطابقة حتى الآن.",footer:"صوت الأعمال — DIGIYLYFE",audio:"مرحباً بك في صوت الأعمال DIGIY. اضغط GO وتحدث بشكل طبيعي أو اختر رمزاً سريعاً. ثم اضغط اعرض. يفهم DIGIY حاجتك ويعرض البطاقات المفيدة.",guide:"إرشادات الهاتف. اضغط GO وتحدث، ثم اضغط اعرض. يفهم DIGIY وتظهر البطاقات.",reply:"فهمت طلبك. البطاقات المفيدة جاهزة. DIGIY يجهز والميدان يحتفظ بالقرار."}
  };

  const QUICK={
    fr:["Je veux dire ma recherche à DIGIY","Je veux découvrir les adresses de Sarlat","Je veux une idée de sortie sur la Petite Côte","Je cherche un chauffeur pour AIBD demain matin","Je veux voir les chauffeurs disponibles","Je cherche une chambre ce week-end à Saly","Je veux réserver une table ce soir","J’ai besoin d’un artisan pour une réparation","Je veux voir les commerces locaux","Je cherche un produit dans une boutique","Je cherche un emploi ou une mission","Je veux publier une annonce dans le réseau","Je veux envoyer une preuve Wave","Je veux venir chez DIGIY ou trouver la route","Je cherche un logement avec option solidaire","Je veux écouter la vision DIGIYLYFE","Je veux être guidé par l’assistant DIGIY"],
    en:["I want to tell DIGIY what I am looking for","I want to discover places in Sarlat","I want an outing idea on the Petite Côte","I need a driver for AIBD tomorrow morning","I want to see available drivers","I need a room this weekend in Saly","I want to book a table tonight","I need an artisan for a repair","I want to see local shops","I am looking for a product in a shop","I am looking for a job or a mission","I want to publish an announcement in the network","I want to send a Wave payment proof","I want to come to DIGIY or find the route","I need lodging with a solidarity option","I want to listen to the DIGIYLYFE vision","I want guidance from the DIGIY assistant"],
    es:["Quiero decirle a DIGIY lo que busco","Quiero descubrir direcciones en Sarlat","Quiero una idea de salida en la Petite Côte","Busco un conductor para AIBD mañana por la mañana","Quiero ver los conductores disponibles","Busco una habitación este fin de semana en Saly","Quiero reservar una mesa esta noche","Necesito un artesano para una reparación","Quiero ver los comercios locales","Busco un producto en una tienda","Busco trabajo o una misión","Quiero publicar un anuncio en la red","Quiero enviar una prueba de pago Wave","Quiero venir a DIGIY o encontrar la ruta","Busco alojamiento con opción solidaria","Quiero escuchar la visión DIGIYLYFE","Quiero que el asistente DIGIY me guíe"],
    de:["Ich möchte DIGIY sagen, wonach ich suche","Ich möchte Adressen in Sarlat entdecken","Ich suche eine Ausflugsidee an der Petite Côte","Ich brauche morgen früh einen Fahrer zum AIBD","Ich möchte verfügbare Fahrer sehen","Ich suche dieses Wochenende ein Zimmer in Saly","Ich möchte heute Abend einen Tisch reservieren","Ich brauche einen Handwerker für eine Reparatur","Ich möchte lokale Geschäfte sehen","Ich suche ein Produkt in einem Geschäft","Ich suche Arbeit oder einen Auftrag","Ich möchte eine Anzeige im Netzwerk veröffentlichen","Ich möchte einen Wave-Zahlungsnachweis senden","Ich möchte zu DIGIY kommen oder die Route finden","Ich suche eine Unterkunft mit solidarischer Option","Ich möchte die Vision von DIGIYLYFE hören","Ich möchte vom DIGIY-Assistenten geführt werden"],
    it:["Voglio dire a DIGIY cosa sto cercando","Voglio scoprire gli indirizzi di Sarlat","Voglio un’idea per un’uscita sulla Petite Côte","Cerco un autista per AIBD domani mattina","Voglio vedere gli autisti disponibili","Cerco una camera questo fine settimana a Saly","Voglio prenotare un tavolo stasera","Ho bisogno di un artigiano per una riparazione","Voglio vedere i negozi locali","Cerco un prodotto in un negozio","Cerco un lavoro o una missione","Voglio pubblicare un annuncio nella rete","Voglio inviare una prova di pagamento Wave","Voglio venire da DIGIY o trovare la strada","Cerco un alloggio con opzione solidale","Voglio ascoltare la visione DIGIYLYFE","Voglio essere guidato dall’assistente DIGIY"],
    nl:["Ik wil DIGIY vertellen wat ik zoek","Ik wil adressen in Sarlat ontdekken","Ik wil een uitstapje aan de Petite Côte","Ik zoek morgenochtend een chauffeur naar AIBD","Ik wil beschikbare chauffeurs zien","Ik zoek dit weekend een kamer in Saly","Ik wil vanavond een tafel reserveren","Ik heb een vakman nodig voor een reparatie","Ik wil lokale winkels zien","Ik zoek een product in een winkel","Ik zoek werk of een opdracht","Ik wil een advertentie in het netwerk plaatsen","Ik wil een Wave-betalingsbewijs sturen","Ik wil naar DIGIY komen of de route vinden","Ik zoek accommodatie met een solidariteitsoptie","Ik wil de visie van DIGIYLYFE beluisteren","Ik wil begeleiding van de DIGIY-assistent"],
    ar:["أريد أن أخبر DIGIY بما أبحث عنه","أريد اكتشاف عناوين في سارلا","أريد فكرة لنزهة على الساحل الصغير","أبحث عن سائق إلى مطار AIBD صباح الغد","أريد رؤية السائقين المتاحين","أبحث عن غرفة في سالي لعطلة نهاية الأسبوع","أريد حجز طاولة هذا المساء","أحتاج إلى حرفي لإجراء إصلاح","أريد رؤية المتاجر المحلية","أبحث عن منتج في متجر","أبحث عن عمل أو مهمة","أريد نشر إعلان في الشبكة","أريد إرسال إثبات دفع Wave","أريد الوصول إلى DIGIY أو معرفة الطريق","أبحث عن سكن بخيار تضامني","أريد الاستماع إلى رؤية DIGIYLYFE","أريد إرشاد مساعد DIGIY"]
  };

  const EXAMPLES={
    fr:["Je cherche un plombier à Saly","Je cherche un entrepreneur maçon à Saly","Je cherche un électricien à Saly","Je cherche du solaire à Dakar","Je cherche des serviettes à Saly","Je cherche un appartement à Saly pour 4 personnes","Je cherche un chauffeur pour AIBD","Je veux une idée de sortie sur la Petite Côte","Je veux réserver une table ce soir","Je cherche un restaurant à Sarlat","Je cherche une chambre à Sarlat","Je veux envoyer une preuve Wave"],
    en:["I am looking for a plumber in Saly","I am looking for a masonry contractor in Saly","I am looking for an electrician in Saly","I am looking for solar service in Dakar","I am looking for towels in Saly","I am looking for an apartment in Saly for 4 people","I am looking for a driver for AIBD","I want an outing idea on the Petite Côte","I want to book a table tonight","I am looking for a restaurant in Sarlat","I am looking for a room in Sarlat","I want to send a Wave payment proof"],
    es:["Busco un fontanero en Saly","Busco un albañil en Saly","Busco un electricista en Saly","Busco energía solar en Dakar","Busco toallas en Saly","Busco un apartamento en Saly para 4 personas","Busco un conductor para AIBD","Quiero una idea de salida en la Petite Côte","Quiero reservar una mesa esta noche","Busco un restaurante en Sarlat","Busco una habitación en Sarlat","Quiero enviar una prueba de pago Wave"],
    de:["Ich suche einen Klempner in Saly","Ich suche einen Maurer in Saly","Ich suche einen Elektriker in Saly","Ich suche Solarservice in Dakar","Ich suche Handtücher in Saly","Ich suche eine Wohnung in Saly für 4 Personen","Ich suche einen Fahrer zum AIBD","Ich suche eine Ausflugsidee an der Petite Côte","Ich möchte heute Abend einen Tisch reservieren","Ich suche ein Restaurant in Sarlat","Ich suche ein Zimmer in Sarlat","Ich möchte einen Wave-Zahlungsnachweis senden"],
    it:["Cerco un idraulico a Saly","Cerco un muratore a Saly","Cerco un elettricista a Saly","Cerco un servizio solare a Dakar","Cerco asciugamani a Saly","Cerco un appartamento a Saly per 4 persone","Cerco un autista per AIBD","Voglio un’idea per un’uscita sulla Petite Côte","Voglio prenotare un tavolo stasera","Cerco un ristorante a Sarlat","Cerco una camera a Sarlat","Voglio inviare una prova di pagamento Wave"],
    nl:["Ik zoek een loodgieter in Saly","Ik zoek een metselaar in Saly","Ik zoek een elektricien in Saly","Ik zoek zonne-energie in Dakar","Ik zoek handdoeken in Saly","Ik zoek een appartement in Saly voor 4 personen","Ik zoek een chauffeur naar AIBD","Ik wil een uitstapje aan de Petite Côte","Ik wil vanavond een tafel reserveren","Ik zoek een restaurant in Sarlat","Ik zoek een kamer in Sarlat","Ik wil een Wave-betalingsbewijs sturen"],
    ar:["أبحث عن سباك في سالي","أبحث عن بنّاء في سالي","أبحث عن كهربائي في سالي","أبحث عن خدمة طاقة شمسية في داكار","أبحث عن مناشف في سالي","أبحث عن شقة في سالي لأربعة أشخاص","أبحث عن سائق إلى AIBD","أريد فكرة لنزهة على الساحل الصغير","أريد حجز طاولة هذا المساء","أبحث عن مطعم في سارلا","أبحث عن غرفة في سارلا","أريد إرسال إثبات دفع Wave"]
  };

  const META={
    en:{"Fiche officielle":"Official card","Fiche publique":"Public card","Partenaire qualifié":"Qualified partner","Référencé public":"Public listing","Secteur à préciser":"Area to confirm","Catégorie":"Category","Secteur":"Area","FICHE":"CARD","APPELER":"CALL","OUVRIR":"OPEN"},
    es:{"Fiche officielle":"Ficha oficial","Fiche publique":"Ficha pública","Partenaire qualifié":"Socio cualificado","Référencé public":"Ficha pública","Secteur à préciser":"Zona por confirmar","Catégorie":"Categoría","Secteur":"Zona","FICHE":"FICHA","APPELER":"LLAMAR","OUVRIR":"ABRIR"},
    de:{"Fiche officielle":"Offizielle Karte","Fiche publique":"Öffentliche Karte","Partenaire qualifié":"Qualifizierter Partner","Référencé public":"Öffentlicher Eintrag","Secteur à préciser":"Gebiet bestätigen","Catégorie":"Kategorie","Secteur":"Gebiet","FICHE":"KARTE","APPELER":"ANRUFEN","OUVRIR":"ÖFFNEN"},
    it:{"Fiche officielle":"Scheda ufficiale","Fiche publique":"Scheda pubblica","Partenaire qualifié":"Partner qualificato","Référencé public":"Scheda pubblica","Secteur à préciser":"Zona da confermare","Catégorie":"Categoria","Secteur":"Zona","FICHE":"SCHEDA","APPELER":"CHIAMA","OUVRIR":"APRI"},
    nl:{"Fiche officielle":"Officiële kaart","Fiche publique":"Openbare kaart","Partenaire qualifié":"Gekwalificeerde partner","Référencé public":"Openbare vermelding","Secteur à préciser":"Gebied bevestigen","Catégorie":"Categorie","Secteur":"Gebied","FICHE":"KAART","APPELER":"BELLEN","OUVRIR":"OPEN"},
    ar:{"Fiche officielle":"بطاقة رسمية","Fiche publique":"بطاقة عامة","Partenaire qualifié":"شريك مؤهل","Référencé public":"بطاقة عامة","Secteur à préciser":"المنطقة تحتاج إلى تأكيد","Catégorie":"الفئة","Secteur":"المنطقة","FICHE":"البطاقة","APPELER":"اتصل","OUVRIR":"افتح"}
  };

  const RULES=[
    [/plomb|plumb|fontaner|klempner|idraulic|loodgieter|سباك|تسرب/,"plombier plomberie fuite robinet wc sanitaire"],
    [/maçon|macon|mason|builder|albañ|maurer|murator|metselaar|بنّاء|بناء|construction|construccion|costruzione/,"macon maçon maçonnerie batisseur bâtisseur construction"],
    [/électric|electric|elektrik|elettric|كهربائي|strom|corrente/,"electricien électricien electricite électricité courant"],
    [/solair|solar|fotovolta|zonne|طاقة شمسية|ألواح شمسية/,"solaire panneau panneaux batterie energie régulateur"],
    [/chauff|driver|taxi|airport|aibd|conductor|chofer|fahrer|flughafen|autista|aeroporto|luchthaven|سائق|مطار|توصيل/,"chauffeur driver taxi aibd trajet transfert voiture"],
    [/chambre|logement|location|appart|room|flat|house|villa|lodg|accommodation|hotel|habitaci|alojamiento|zimmer|wohnung|unterkunft|camera|alloggio|kamer|woning|غرفة|سكن|شقة|فندق/,"chambre appartement logement location villa dormir nuit hébergement hôtel"],
    [/réserv|reserv|booking|book|table|restaurant|dinner|lunch|mesa|comer|tisch|essen|prenotar|tavolo|mangiare|tafel|eten|حجز|طاولة|مطعم|عشاء/,"réserver reservation table restaurant manger diner"],
    [/boutique|commerce|produit|shop|store|market|product|buy|tienda|comprar|geschäft|laden|produkt|negozio|winkel|متجر|منتج|شراء/,"boutique market produit acheter serviette drap commerce"],
    [/emploi|travail|mission|job|work|employment|trabajo|empleo|arbeit|auftrag|lavoro|incarico|werk|opdracht|عمل|وظيفة|مهمة/,"emploi travail job mission recrute postuler"],
    [/sortie|visite|découvr|activit|outing|visit|discover|tour|salida|ausflug|entdecken|uscita|scoprire|uitstap|ontdekken|نزهة|زيارة|اكتشاف/,"sortie visite découvrir idée activité explore petite cote"],
    [/paiement|argent|wave|preuve|payment|money|proof|pago|dinero|zahlung|geld|nachweis|pagamento|denaro|betaling|bewijs|دفع|مال|إثبات/,"paiement pay argent wave preuve reçu"],
    [/adresse|route|venir|address|direction|map|dirección|ruta|kommen|weg|strada|indirizzo|adres|طريق|عنوان|خريطة/,"adresse route venir carte localisation"],
    [/annonce|réseau|reseau|publier|announcement|network|publish|anuncio|red|anzeige|netzwerk|annuncio|rete|advertentie|netwerk|إعلان|شبكة|نشر/,"annonce réseau publier visibilité"],
    [/audio|écouter|ecouter|vision|assistant|guide|help|listen|escuchar|ayuda|hören|hilfe|ascoltare|aiuto|luisteren|hulp|استماع|صوت|مساعدة/,"audio écouter vision assistant aide guide"]
  ];

  function safe(value){const x=String(value||"").toLowerCase().split("-")[0];return LANGS.includes(x)?x:"fr"}
  function actual(){try{return safe(new URLSearchParams(location.search).get("lang")||localStorage.getItem(KEY)||navigator.language)}catch(_){return"fr"}}
  function base(lang){return lang==="en"?"en":"fr"}
  function locale(){return LOCALE[actual()]||"fr-FR"}
  function persist(lang){try{localStorage.setItem(KEY,lang);localStorage.setItem(LEGACY,base(lang))}catch(_){}}
  function nativeButton(lang){return document.querySelector('[data-lang-choice="'+base(lang)+'"], [data-lang="'+base(lang)+'"]')}
  function setText(selector,value){const el=document.querySelector(selector);if(el&&value!=null&&el.textContent!==value)el.textContent=value}
  function setAria(selector,value){const el=document.querySelector(selector);if(el&&value!=null)el.setAttribute("aria-label",value)}
  function normalize(value){return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
  function expand(value){const source=String(value||"");const n=normalize(source);let extra="";RULES.forEach(function(rule){if(rule[0].test(n))extra+=" "+rule[1]});return source+extra}

  function buildBar(){
    if(document.getElementById("digiyLang7"))return;
    const bar=document.createElement("nav");bar.id="digiyLang7";bar.setAttribute("aria-label","Choisir la langue");
    const labels={fr:"🇫🇷 FR",en:"🇬🇧 EN",es:"🇪🇸 ES",de:"🇩🇪 DE",it:"🇮🇹 IT",nl:"🇳🇱 NL",ar:"🌙 AR"};
    LANGS.forEach(function(lang){const b=document.createElement("button");b.type="button";b.dataset.lang7=lang;b.textContent=labels[lang];bar.appendChild(b)});
    (document.querySelector(".app")||document.body).prepend(bar);
  }

  function applyStatic(){
    if(applying)return;applying=true;
    const lang=actual(),u=UI[lang]||UI.fr;
    document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    document.title=u.title;const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=u.desc;
    document.querySelectorAll("#digiyLang7 button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.lang7===lang?"true":"false")});
    setText(".logoText",u.logo);setAria(".ask",u.ask);setText('label[for="q"]',u.label);
    const q=document.getElementById("q");if(q){q.placeholder=u.placeholder;q.setAttribute("aria-label",u.label)}
    setText("#examplesToggle",u.examples);setAria("#listenBtn",u.label);setAria("#searchBtn",u.see);
    setText("#searchBtn span",u.see);setText("#clearBtn span",u.clear);setText("#consigneBtn",u.consigne);
    const line=document.querySelector(".consignesLine span");if(line&&line.innerHTML!==u.consigneLine)line.innerHTML=u.consigneLine;
    setText(".resultTitle",u.resultTitle);setText(".resultIntro",u.resultIntro);setText("#empty",u.empty);setText("footer",u.footer);
    (QUICK[lang]||QUICK.fr).forEach(function(text,index){const el=document.querySelectorAll(".chip[data-q]")[index];if(el){el.dataset.q=text;el.setAttribute("aria-label",text);el.title=text}});
    (EXAMPLES[lang]||EXAMPLES.fr).forEach(function(text,index){const el=document.querySelectorAll(".examplePhrase[data-q]")[index];if(el){el.dataset.q=text;const visible=el.querySelector(".fr")||el.querySelector("span")||el;if(visible.textContent!==text)visible.textContent=text}});
    applying=false;
  }

  function applyDynamic(){
    const lang=actual();if(lang==="fr")return;const map=META[lang]||{};
    document.querySelectorAll("#cards .tag,#cards .miniMeta span,#cards .card-actions a").forEach(function(el){
      let value=(el.textContent||"").trim();const translated=map[value];if(translated&&value!==translated)el.textContent=translated;
    });
  }

  function setLanguage(value){
    const lang=safe(value);persist(lang);
    try{const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url.pathname+url.search+url.hash)}catch(_){}
    const native=nativeButton(lang);if(native)native.click();
    persist(lang);requestAnimationFrame(function(){applyStatic();applyDynamic()});
  }

  function speakOwn(text){
    if(!NativeUtterance||!("speechSynthesis"in window))return;
    window.speechSynthesis.cancel();const u=new NativeUtterance(text);u.lang=locale();u.rate=actual()==="ar"?.84:.9;window.__DIGIY_NATIVE_SPEAK__(u);
  }

  if("speechSynthesis"in window&&NativeUtterance){
    const nativeSpeak=window.speechSynthesis.speak.bind(window.speechSynthesis);window.__DIGIY_NATIVE_SPEAK__=nativeSpeak;
    window.speechSynthesis.speak=function(utterance){
      const lang=actual();if(lang==="fr"||lang==="en"){try{utterance.lang=LOCALE[lang]}catch(_){}return nativeSpeak(utterance)}
      const text=(utterance&&utterance.text)||"";const replacement=/j.?ai compris|i understood/i.test(text)?(UI[lang]||UI.fr).reply:text;
      const fresh=new NativeUtterance(replacement);fresh.lang=LOCALE[lang];fresh.rate=utterance&&utterance.rate?utterance.rate:(lang==="ar"?.84:.9);return nativeSpeak(fresh);
    };
  }

  const NativeRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(NativeRecognition){
    function WrappedRecognition(){
      const recognition=new NativeRecognition();
      return new Proxy(recognition,{set:function(target,property,value){target[property]=property==="lang"?locale():value;return true}});
    }
    WrappedRecognition.prototype=NativeRecognition.prototype;
    window.SpeechRecognition=WrappedRecognition;window.webkitSpeechRecognition=WrappedRecognition;
  }

  window.addEventListener("click",function(event){
    const target=event.target instanceof Element?event.target.closest("button,a"):null;if(!target)return;
    if(target.dataset.lang7){event.preventDefault();event.stopImmediatePropagation();setLanguage(target.dataset.lang7);return}
    const lang=actual(),u=UI[lang]||UI.fr;
    if(lang!=="fr"&&lang!=="en"&&(target.id==="introBtn"||target.id==="audioFloat"||target.id==="consigneBtn")){
      event.preventDefault();event.stopImmediatePropagation();speakOwn(target.id==="consigneBtn"?u.guide:u.audio);return;
    }
    const field=document.getElementById("q");
    if(target.id==="searchBtn"&&field&&lang!=="fr"&&lang!=="en"){
      lastNativeQuery=field.value.trim();field.value=expand(lastNativeQuery);setTimeout(function(){field.value=lastNativeQuery;applyDynamic()},80);
    }
    if(target.matches(".chip[data-q],.examplePhrase[data-q]")&&lang!=="fr"&&lang!=="en"){
      const native=target.dataset.q||"";lastNativeQuery=native;target.dataset.q=expand(native);setTimeout(function(){target.dataset.q=native;if(field)field.value=native;applyDynamic()},100);
    }
  },true);

  buildBar();setLanguage(actual());
  const cards=document.getElementById("cards");if(cards)new MutationObserver(function(){requestAnimationFrame(applyDynamic)}).observe(cards,{childList:true});
  window.addEventListener("storage",function(e){if(e.key===KEY)setLanguage(e.newValue||"fr")});
})();
</script>
'''

if "</body>" not in html:
    raise SystemExit("Balise </body> introuvable")

html = html.replace("</body>", extension + "\n</body>", 1)

checks = {
    "marker": MARKER in html,
    "no_iframe": "<iframe" not in html.lower(),
    "seven_languages": all(f'"{code}"' in extension for code in ["fr", "en", "es", "de", "it", "nl", "ar"]),
    "stable_directory": "annuaire-public-digiy.js" in html,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("Contrôles échoués: " + ", ".join(failed))

INDEX.write_text(html, encoding="utf-8")
print("ACTION PRO monofichier 7 langues généré")
