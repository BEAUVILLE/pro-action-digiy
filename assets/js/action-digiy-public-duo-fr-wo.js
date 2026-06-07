/* DIGIYLYFE — La Voix du Business PUBLIC
   Rôle : moteur public de mise en relation.
   Doctrine : le public exprime un besoin, DIGIY fait remonter des fiches, contact direct. Aucun hub pro ouvert.
   Version : action-digiy-public-duo-fr-wo-v2-20260607
*/
(function(){
  "use strict";

  var VERSION = "action-digiy-public-duo-fr-wo-v2-20260607";
  var DIGIY_CONTACT = "221771342889";
  var LISTEN_MAX_MS = 18000;
  var SILENCE_AFTER_RESULT_MS = 5200;

  /* ─────────────────────────────────────────────
     LANGUE — FRANÇAIS / WOLOF
  ───────────────────────────────────────────── */
  var LANG_STORAGE_KEY = "digiy_action_public_lang";
  var currentLang = detectInitialLang();

  var UI = {
    auto:{
      label:"Duo FR/Wolof",
      statusReady:"Prêt. Écris ou parle ton besoin.",
      listen:"🎙️ Parler",
      listening:"🎙️ J'écoute… parle tranquillement",
      listenStatus:"J'écoute… prends ton temps, parle naturellement.",
      listenMore:"Je t'écoute encore… tu peux compléter.",
      voiceOk:"Voix captée. Les fiches remontent.",
      micClosed:"Micro fermé. Tu peux recommencer ou écrire le besoin.",
      micFragile:"Micro fragile. Tu peux écrire le besoin.",
      micAlready:"Micro déjà lancé.",
      micUnavailable:"🎙️ Micro indispo",
      found:function(n){ return n + " fiche(s) remontée(s). Contact direct."; },
      notFound:"Besoin compris, mais aucune fiche locale exacte. DIGIY peut t'orienter sur WhatsApp.",
      msgPrefix:"Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : ",
      fallbackNeed:"Bonjour, je viens de DIGIY. Je cherche une mise en relation."
    },
    fr:{
      label:"Français",
      statusReady:"Prêt. Écris ou parle ton besoin.",
      listen:"🎙️ Parler",
      listening:"🎙️ J'écoute… parle tranquillement",
      listenStatus:"J'écoute… prends ton temps, parle naturellement.",
      listenMore:"Je t'écoute encore… tu peux compléter.",
      voiceOk:"Voix captée. Les fiches remontent.",
      micClosed:"Micro fermé. Tu peux recommencer ou écrire le besoin.",
      micFragile:"Micro fragile. Tu peux écrire le besoin.",
      micAlready:"Micro déjà lancé.",
      micUnavailable:"🎙️ Micro indispo",
      found:function(n){ return n + " fiche(s) remontée(s). Contact direct."; },
      notFound:"Besoin compris, mais aucune fiche locale exacte. DIGIY peut t'orienter sur WhatsApp.",
      msgPrefix:"Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : ",
      fallbackNeed:"Bonjour, je viens de DIGIY. Je cherche une mise en relation."
    },
    wo:{
      label:"Wolof",
      statusReady:"Jàmm. Bindal walla waxal sa soxla.",
      listen:"🎙️ Waxal",
      listening:"🎙️ Maa ngi déglu… waxal ndànk",
      listenStatus:"Maa ngi déglu… waxal sa soxla ci lu leer.",
      listenMore:"Maa ngi déglu ba tey… mën nga yokk.",
      voiceOk:"Baax na. Fiche yi di génn.",
      micClosed:"Micro tëju na. Mën nga dellu wax walla bind.",
      micFragile:"Micro bi dafa doyadi. Mën nga bind sa soxla.",
      micAlready:"Micro bi tàmbali na ba noppi.",
      micUnavailable:"🎙️ Micro amul",
      found:function(n){ return n + " fiche(s) génn nañu. Jokkook pro bi direct."; },
      notFound:"Soxla bi déggoo nañu, waaye fiche bu leer amagul. DIGIY mën na la yóbbu ci WhatsApp.",
      msgPrefix:"Bonjour, je viens de La Voix du Business DIGIY. Sama soxla mooy : ",
      fallbackNeed:"Bonjour, je viens de DIGIY. Dama bëgg mise en relation."
    }
  };

  function $(id){ return document.getElementById(id); }

  function normLang(v){
    v = String(v || "").toLowerCase().trim();
    if(v === "fr" || v.indexOf("fr-") === 0 || v.indexOf("fr_") === 0) return "fr";
    if(v === "wo" || v === "wolof" || v.indexOf("wo-") === 0 || v.indexOf("wo_") === 0) return "wo";
    if(v === "auto" || v === "duo") return "auto";
    return "";
  }

  function detectInitialLang(){
    try{
      var params = new URLSearchParams(location.search || "");
      var urlLang = normLang(params.get("lang") || params.get("l"));
      if(urlLang) return urlLang;
    }catch(_){}

    try{
      var stored = normLang(localStorage.getItem(LANG_STORAGE_KEY));
      if(stored) return stored;
    }catch(_){}

    try{
      var htmlLang = document.documentElement.getAttribute("lang") || "";
      var bodyLang = document.body && (document.body.getAttribute("data-digiy-lang") || document.body.getAttribute("data-lang")) || "";
      return normLang(bodyLang || htmlLang) || "auto";
    }catch(_){}

    return "auto";
  }

  function ui(key){
    var pack = UI[currentLang] || UI.auto;
    return pack[key] || UI.auto[key] || "";
  }

  function foundLabel(n){
    var pack = UI[currentLang] || UI.auto;
    return (pack.found || UI.auto.found)(n);
  }

  function speechLang(){
    return currentLang === "wo" ? "fr-SN" : "fr-FR";
  }

  function setLang(lang){
    currentLang = normLang(lang) || "auto";
    try{ localStorage.setItem(LANG_STORAGE_KEY, currentLang); }catch(_){}
    updateLangUI();

    var btn = $("listenBtn");
    if(btn && !btn.classList.contains("isListening")) btn.textContent = ui("listen");

    var status = $("status");
    if(status && (!status.textContent || status.textContent === "Prêt.")) status.textContent = ui("statusReady");

    render();
    return currentLang;
  }

  function getLang(){
    return currentLang;
  }

  /* ─────────────────────────────────────────────
     STYLE DUO — PAS DE COLONNES
  ───────────────────────────────────────────── */
  function ensureDuoStyle(){
    if(document.getElementById("digiy-duo-lang-style")) return;

    var st = document.createElement("style");
    st.id = "digiy-duo-lang-style";
    st.textContent =
      ".duo-langbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0 12px}" +
      ".duo-langbar .duo-langbtn{border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:inherit;border-radius:999px;padding:8px 12px;font-weight:900;cursor:pointer}" +
      ".duo-langbar .duo-langbtn.isActive{background:linear-gradient(135deg,#f7d676,#b88423);color:#15100a;border-color:transparent;box-shadow:0 10px 24px rgba(0,0,0,.18)}" +
      ".duo-langhint{opacity:.82;font-size:.88rem;font-weight:750}" +
      "@media(max-width:520px){.duo-langbar{display:grid;grid-template-columns:1fr;gap:8px}.duo-langbar .duo-langbtn{width:100%;justify-content:center}.duo-langhint{display:block;text-align:center}}";
    document.head.appendChild(st);
  }

  function ensureDuoLangBar(){
    var q = $("q");
    if(!q || document.getElementById("digiy-duo-langbar")) return;

    ensureDuoStyle();

    var bar = document.createElement("div");
    bar.id = "digiy-duo-langbar";
    bar.className = "duo-langbar";
    bar.setAttribute("aria-label", "Choix langue DIGIY");

    ["auto","fr","wo"].forEach(function(l){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "duo-langbtn";
      b.setAttribute("data-digiy-lang-choice", l);
      b.textContent = UI[l].label;
      b.onclick = function(){ setLang(l); };
      bar.appendChild(b);
    });

    var hint = document.createElement("span");
    hint.className = "duo-langhint";
    hint.textContent = "Duo automatique : français + mots terrain Wolof.";
    bar.appendChild(hint);

    var parent = q.parentNode;
    if(parent) parent.insertBefore(bar, q);

    updateLangUI();
  }

  function updateLangUI(){
    Array.prototype.forEach.call(document.querySelectorAll("[data-digiy-lang-choice]"), function(b){
      b.classList.toggle("isActive", b.getAttribute("data-digiy-lang-choice") === currentLang);
    });

    var manualSelect = $("digiyLang") || $("langMode");
    if(manualSelect && manualSelect.value !== currentLang) manualSelect.value = currentLang;

    var hint = document.querySelector("#digiy-duo-langbar .duo-langhint");
    if(hint){
      hint.textContent =
        currentLang === "wo"
          ? "Wolof devant, fiches directes derrière."
          : currentLang === "fr"
            ? "Français devant, mots terrain Wolof reconnus."
            : "Duo automatique : français + mots terrain Wolof.";
    }
  }

  /* ─────────────────────────────────────────────
     NORMALISATION
  ───────────────────────────────────────────── */
  function norm(s){
    return String(s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[’‘ʼ`´]/g,"'")
      .replace(/[^a-z0-9#?&=+\s'\-]/g," ")
      .replace(/\s+/g," ")
      .trim();
  }

  function tokens(s){
    return norm(s).split(/[\s,.\-!?;:()]+/).filter(function(w){ return w.length >= 3; });
  }

  function waLink(txt){
    return "https://wa.me/" + DIGIY_CONTACT + "?text=" + encodeURIComponent(txt);
  }

  /* ─────────────────────────────────────────────
     LEXIQUE WOLOF TERRAIN — OFFICIEL DIGIY
  ───────────────────────────────────────────── */
  var EXTRA_KEYS = {
    DRIVER:[
      "foo bëgg dem","foo begg dem","dama bëgg taxi","dama begg taxi","dama bëgg chauffeur","dama begg chauffeur",
      "damay dem","maa ngi dem","maa ngi dem ci kanam","waaw dem nanu","fëkk nanu","fekk nanu",
      "maa ngi soxor","maa ngi dem ak jaambur","fay bi wave la wala cash","wave la wala cash",
      "kanam dafa sëkk","kanam dafa sekk","duma mën dem","duma men dem","yóbbu ma","yobbu ma",
      "chauffeur bi","taxi bi","voiture bi","auto bi","dem aibd","dem dakar","dem saly","dem mbour"
    ],
    EXPLORE:[
      "dama bëgg génn","dama begg genn","fan lañuy dem","fan lanuy dem","dama bëgg sortie","dama begg sortie",
      "dem plage","dem géej","dem geej","sortie géej","sortie geej","xoolal activité","xoolal activite",
      "xoolal sortie","dama bëgg excursion","dama begg excursion","dama bëgg balade","dama begg balade",
      "ñëw fegël","new fegel","jën bi","jen bi"
    ],
    BUILD:[
      "dama am panne","dama am fuite","ndox mi","courant bi","lamp bi","defar kër","defar ker",
      "dama bëgg artisan","dama begg artisan","dama bëgg devis","dama begg devis",
      "liggéey kër","liggeey ker","chantier bi","robinet bi","tuyau bi","mur bi",
      "am na dara ci liggeey bi","tey dinaa dem ci sa kër","tey dinaa dem ci sa ker"
    ],
    LOC:[
      "dama bëgg chambre","dama begg chambre","dama bëgg kër","dama begg ker","dama bëgg logement",
      "dama begg logement","fan laa mën a fanaane","fan laa men a fanaane","dama bëgg fanaane",
      "kër bi mën a jënd","ker bi men a jend","guddi bu nekk","dalal ak jàmm ci kër bi",
      "dalal ak jamm ci ker bi","yégël bi dégël na","yegel bi degel na","woo ma ci kanam"
    ],
    RESA:[
      "dama bëgg yégël","dama begg yegel","dama bëgg réserver","dama begg reserver",
      "yégël bi dégël na","yegel bi degel na","bés bou ñenn","bes bou nenn","waxt bou ñenn",
      "waxt bou nenn","am nga dispo","am nga place","mën nga taxawal ci kanam","men nga taxawal ci kanam",
      "nit ñu am ñaata lañu","nit nu am naata lanu","taxawal ma","réserve ma","reserve ma"
    ],
    RESTO:[
      "dama bëgg lekk","dama begg lekk","loo bëgg lekk","loo begg lekk","loo bëgg naan","loo begg naan",
      "fan lañuy lekk","fan lanuy lekk","am nga yégël","am nga yegel","bëgg nga yóbbu dem",
      "begg nga yobbu dem","dalal ak jàmm ñëw fii","dalal ak jamm new fii","ceebu jën","ceebu jen",
      "thiéboudienne","thieboudienne","yassa","mafé","mafe","menu bi","table bi"
    ],
    MARKET:[
      "dama bëgg jënd","dama begg jend","dama bëgg produit","dama begg produit","dama bëgg prix",
      "dama begg prix","njëg bi","njeg bi","boutique bi","boutik bi","maa ngi am ci teral",
      "maa ngi bind sa dagga","fii la listu jaay bi","fii la sa papier jaay bi","nettali bi jeex na",
      "jënd ci","jend ci","jaay","jaaykat"
    ],
    POS:[
      "caisse bi","dama bëgg caisse","dama begg caisse","maa ngi ubbi ndefarati xaalis bi",
      "maa ngi tëj ndefarati xaalis bi","maa ngi tej ndefarati xaalis bi","jaay bi dégël na",
      "jaay bi degel na","fii la sa papier jaay bi","jaay bi taxawal na","stock bi","vente bi",
      "dama bëgg gérer boutique","dama begg gerer boutique"
    ],
    PAY:[
      "dama bëgg fay","dama begg fay","bëgg a fay léegi","begg a fay leegi","dama bëgg payer",
      "dama begg payer","yónni ci wave","yonni ci wave","fay bi fëkk na","fay bi fekk na",
      "fay bi fëkkul ba léegi","fay bi fekkul ba leegi","yóbbu foto fay bi","yobbu foto fay bi",
      "xaalis bi","wave bi","orange money bi","preuve bi","abonnement bi"
    ],
    RESEAU_DIGIY:[
      "dama bëgg annonce","dama begg annonce","dama bëgg visibilité","dama begg visibilite",
      "dama bëgg fiche","dama begg fiche","dama bëgg qr","dama begg qr","ñëw bokk ci digiy réseau bi",
      "new bokk ci digiy reseau bi","bokk sa qr code bi","bind sa xibaar bi ci réseau bi",
      "bind sa xibaar bi ci reseau bi","soppi sa xibaar bi","xibaar liggeey bi","wone sama liggéey",
      "wone sama liggeey"
    ],
    JOBS:[
      "dama bëgg liggéey","dama begg liggeey","maa ngi bëgg liggeey","maa ngi begg liggeey",
      "maa ngi wut liggéey","maa ngi wut liggeey","dama bëgg job","dama begg job",
      "dama bëgg mission","dama begg mission","dama bëgg recruter","dama begg recruter",
      "am naa liggeyéef bi","am naa liggeyeef bi","lan la xam xam mi","dinaa la woo ngir wax",
      "jël naa la","jel naa la","cv bi","candidat bi"
    ]
  };

  function allKeys(f){
    var base = f && f.keys ? f.keys : [];
    var extra = EXTRA_KEYS[(f && f.module) || ""] || [];
    return base.concat(extra);
  }

  /* ─────────────────────────────────────────────
     FICHES PUBLIQUES — CARTES, PAS COLONNES
  ───────────────────────────────────────────── */
  var FICHES = [
    {
      module:"DRIVER",icon:"🚗",tag:"#chauffeur",title:"Chauffeur / transfert AIBD",zone:"Saly · Dakar · AIBD",
      desc:"Demande de trajet, transfert, horaire et contact direct.",
      keys:[
        "chauffeur","driver","taxi","aibd","aeroport","aéroport","course","trajet","dakar","saly",
        "conduire","conduite","voiture","vehicule","véhicule","transport","transfert","navette",
        "aller","partir","emmener","ride","moto","mototaxi","sept places","7 places","vdm","diamniadio",
        "mbour","thiès","thies","ziguinchor","jëridkat","jëride","shirfer","wecckat","dem","dem ci",
        "wëcc","dem ak","bëgg dem","dem aibd","dem dakar","dem saly","dem mbour","maa ngi dem",
        "jaambur","dëkk","foo bëgg dem","waaw dem nanu","fay bi wave la wala cash"
      ],
      url:"https://galerie-chauffeurs.digiylyfe.com/",
      cta:"Voir chauffeurs",
      wa:"Bonjour, je cherche un chauffeur / transfert AIBD via DIGIY."
    },
    {
      module:"EXPLORE",icon:"🎣",tag:"#sortie",title:"Sortie pêche / EXPLORE",zone:"Petite Côte",
      desc:"Sortie, visite, balade, découverte, activité locale et contact direct.",
      keys:[
        "peche","pêche","sortie","mer","pirogue","petite cote","petite côte","explore","visite",
        "excursion","balade","activite","activité","loisir","bateau","plage","ocean","océan",
        "poisson","sport nautique","kayak","promenade","detente","détente","tourisme","decouverte",
        "découverte","week-end","weekend","vacances","fegël","fegëlkat","dem géej","géej","jën",
        "jën bi","dëkk bu bees","yégëlef","ñëw fegël"
      ],
      url:"https://explore.digiylyfe.com/",
      cta:"Voir EXPLORE",
      wa:"Bonjour, je souhaite des informations sur une sortie ou une activité locale via DIGIY EXPLORE."
    },
    {
      module:"BUILD",icon:"🧰",tag:"#artisan",title:"Artisan / dépannage BUILD",zone:"Sénégal",
      desc:"Fuite, réparation, chantier, entretien : la demande est préparée clairement.",
      keys:[
        "fuite","plomberie","plombier","electricien","électricien","artisan","reparation","réparation",
        "build","travaux","chantier","depannage","dépannage","maçon","macon","carrelage","peinture",
        "peintre","menuisier","menuiserie","soudure","soudeur","climatisation","clim","electrique",
        "électrique","installation","branchement","coupure","panne","robinet","wc","toilette","tuyau",
        "canalisation","toiture","toit","dalle","fondation","renovation","rénovation","entretien",
        "maintenance","entrepreneur","construire","construction","batir","bâtir","bâtiment","batiment",
        "gros oeuvre","gros œuvre","maison","villa","immeuble","local","bungalow","structure","plan",
        "devis","architecte","ingenieur","ingénieur","terrassement","terrassier","ferrailleur","coffreur",
        "cloture","clôture","mur","ciment","beton","béton","parpaing","agglo","amenagement","aménagement",
        "finition","carreleur","piscine","garage","extension","agrandissement","wallufkat","liggeey",
        "xam-xam","dem liggeey","jeex","jeex na","kër","kër bi","tuyau bi"
      ],
      url:"https://build.digiylyfe.com/",
      cta:"Décrire le besoin",
      wa:"Bonjour, j'ai besoin d'un artisan / entrepreneur / dépannage via DIGIY BUILD."
    },
    {
      module:"LOC",icon:"🏠",tag:"#logement",title:"Chez Baptiste — Saly",zone:"Saly · Petite Côte",
      desc:"Fiche logement démo : contact direct propriétaire, 0% commission DIGIY.",
      keys:[
        "chez baptiste","baptiste","logement saly","chambre saly","maison saly","villa saly",
        "dormir saly","saly","petite cote","petite côte","loc","location","logement","chambre",
        "villa","maison","kër","kër bi","dëkk","joxeel kër","joxeel","guddi","nekk saly","dëkk saly"
      ],
      url:"https://loc.digiylyfe.com/",
      cta:"Voir Chez Baptiste",
      wa:"Bonjour, je cherche un logement à Saly. Je souhaite voir Chez Baptiste via DIGIY LOC."
    },
    {
      module:"LOC",icon:"🏠",tag:"#logement",title:"Chambre / logement LOC",zone:"Saly · Petite Côte",
      desc:"Besoin de chambre, villa, réservation ou disponibilité.",
      keys:[
        "chambre","logement","villa","maison","nuit","week-end","weekend","reservation","réservation",
        "loc","saly","location","studio","appartement","appart","hebergement","hébergement","dormir",
        "coucher","séjour","sejour","louer","loue","disponible","dispo","airbnb","gite","gîte",
        "mbour","ngaparou","somone","saloum","nianing","kër","kër bi","joxeel kër","guddi bu nekk",
        "dugg","génn","bëgg nekk","dëkk ci","yégël kër"
      ],
      url:"https://loc.digiylyfe.com/",
      cta:"Voir LOC",
      wa:"Bonjour, je cherche un logement / une chambre via DIGIY LOC."
    },
    {
      module:"RESA",icon:"📅",tag:"#réservation",title:"Réserver / demander une disponibilité",zone:"Restaurant · logement · service",
      desc:"Le public formule une intention. Le pro confirme ensuite côté module protégé.",
      keys:[
        "resa","réservation","reservation","reserver","réserver","dispo","disponible","creneau","créneau",
        "date","heure","planning","rendez-vous","rdv","agenda","booker","booking","calendrier","place",
        "confirmer","confirmation","retenir","retient","bloquer","yégël","yégël bi","bés bi","waxt",
        "dégël","taxawal","mën a yégël","bëgg a suur","wax ci kanam","ci kanam","dama bëgg yégël"
      ],
      url:"https://resto.digiylyfe.com/",
      cta:"Demander une réservation",
      wa:"Bonjour, je souhaite faire une demande de réservation via DIGIY."
    },
    {
      module:"RESTO",icon:"🍽️",tag:"#resto",title:"Restaurant / table / menu",zone:"Saly · Dakar · Sénégal",
      desc:"Besoin de table, restaurant, menu, information ou contact direct.",
      keys:[
        "resto","restaurant","table","menu","manger","dejeuner","déjeuner","diner","dîner","repas",
        "commande","nourriture","cuisine","gastronomie","chef","plat","grillades","fruits de mer",
        "brochette","poisson grille","soir","midi","brunch","buffet","lunch","snack","bar","terrasse",
        "brasserie","cantine","lekk","lekk bi","dëkk bu lekk","bëgg lekk","jën ak ceeb","ceeb",
        "thiéboudienne","thiep","yassa","mafé","ceebu jën","lekkal","table bi","jënd lekk",
        "loo bëgg lekk","loo bëgg naan","am nga yégël"
      ],
      url:"https://resto.digiylyfe.com/",
      cta:"Voir RESTO",
      wa:"Bonjour, je cherche un restaurant / une table via DIGIY RESTO."
    },
    {
      module:"MARKET",icon:"🛍️",tag:"#market",title:"Produits et commerces locaux",zone:"Sénégal",
      desc:"Boutiques, produits, offres locales, contact direct vendeur.",
      keys:[
        "produit","acheter","boutique","market","commerce","serviette","drap","savon","article","prix",
        "stock","vendre","vente","magasin","epicerie","épicerie","superette","supérette","parapharmacie",
        "pharmacie","cosmétique","cosmetique","tissu","pagne","vetement","vêtement","chaussure",
        "accessoire","bijou","electronique","électronique","telephone","téléphone","informatique",
        "fourniture","materiel","matériel","alimentaire","alimentation","eau","boisson","huile","riz",
        "farine","condiment","locale","local","jaay","jaaykat","jënd","jëndkat","njëg","njëg bi",
        "marché","listu jaay","dagga","bëgg jënd","boutik","boutik bi","riz bi"
      ],
      url:"https://market.digiylyfe.com/",
      cta:"Voir MARKET",
      wa:"Bonjour, je cherche un produit ou une boutique via DIGIY MARKET."
    },
    {
      module:"POS",icon:"🧾",tag:"#commerce",title:"Commerce / caisse POS",zone:"Professionnels",
      desc:"Information POS côté public. La caisse réelle reste côté pro protégé.",
      keys:[
        "pos","caisse","ticket","vente","vendre","encaisser","boutique","commerce","marchandise",
        "tpe","terminal","recu","reçu","facture","tva","compte","gestion","inventaire","stock",
        "ndefarati xaalis","papier jaay","jaay bi","jënd bi","caisse wolof","fay ci caisse","encaisse",
        "maa ngi ubbi ndefarati xaalis bi","jaay bi dégël na"
      ],
      url:"https://commencer-a-payer.digiylyfe.com/?module=POS",
      cta:"Activer POS",
      wa:"Bonjour, je souhaite des informations sur DIGIY POS / caisse commerce."
    },
    {
      module:"PAY",icon:"💳",tag:"#pay",title:"Paiement / PAY",zone:"Wave · Cash · caisse",
      desc:"Question paiement, activation, preuve ou mise en relation PAY.",
      keys:[
        "pay","paiement","payer","wave","orange money","cash","preuve","recu","reçu","abonnement",
        "activer","virement","transfert","envoyer argent","recevoir argent","solde","mobile money",
        "free money","e-money","emoney","carte","depot","dépôt","retrait","transaction","règlement",
        "reglement","xaalis","fay","fay bi","xaalis bi","dooro","ndëy","wave bi","envoye xaalis",
        "bëgg a fay léegi","yónni ci wave","fay bi fëkk na","yóbbu foto fay bi"
      ],
      url:"https://commencer-a-payer.digiylyfe.com/?module=PAY",
      cta:"Voir PAY",
      wa:"Bonjour, je souhaite une information PAY / paiement DIGIY."
    },
    {
      module:"RESEAU_DIGIY",icon:"📣",tag:"#réseau",title:"Réseau DIGIY / annonce",zone:"Visibilité locale",
      desc:"Annonce, fiche, QR, partage et visibilité dans le réseau.",
      keys:[
        "reseau","réseau","annonce","visibilite","visibilité","fiche","qr","partage","publier",
        "promotion","communiquer","communication","affichage","flyer","prospectus","pub","publicite",
        "publicité","mettre en avant","référencer","referencer","notoriete","notoriété","connu","trouver",
        "bokk","xibaar","xibaar liggeey","bokk sa qr code bi","bind sa xibaar bi","soppi sa xibaar bi",
        "ñëw bokk ci digiy réseau bi"
      ],
      url:"https://reseau-digiy.digiylyfe.com/",
      cta:"Voir RÉSEAU",
      wa:"Bonjour, je souhaite une information sur RÉSEAU DIGIY / annonce."
    },
    {
      module:"JOBS",icon:"💼",tag:"#jobs",title:"Emploi / service terrain",zone:"Sénégal",
      desc:"Recherche de poste, service, recrutement ou mission.",
      keys:[
        "emploi","job","jobs","travail","serveur","serveuse","recrute","recruter","mission","candidat",
        "cv","stage","stagiaire","embauche","embaucher","poste","contrat","cdi","cdd","interim",
        "intérim","freelance","prestation","service","technicien","agent","gardien","veilleur",
        "cuisinier","cuisinière","receptionniste","réceptionniste","femme chambre","femme de chambre",
        "lingere","lingère","animateur","commerciale","commercial","vendeur","vendeuse","chauffeur emploi",
        "livreur","bëgg liggeey","liggeeykat","liggeyéef","xam-xam","maa ngi bëgg liggeey",
        "am naa liggeyéef bi","dinaa la woo ngir wax","jël naa la"
      ],
      url:"https://jobs.digiylyfe.com/",
      cta:"Voir JOBS",
      wa:"Bonjour, je cherche une information JOBS via DIGIY."
    }
  ];

  /* ─────────────────────────────────────────────
     MATCHING
  ───────────────────────────────────────────── */
  function matchFiches(text){
    var n = norm(text);
    var toks = tokens(text);

    if(!n || toks.length === 0){
      return FICHES.slice(0, 3);
    }

    var scored = FICHES.map(function(f){
      var score = 0;
      var title = norm(f.title);
      var desc = norm(f.desc);
      var moduleName = norm(f.module);

      toks.forEach(function(tok){
        if(tok === moduleName) score += 6;
        if(title.indexOf(tok) >= 0) score += 2;
        if(desc.indexOf(tok) >= 0) score += 1;

        allKeys(f).forEach(function(k){
          var nk = norm(k);
          if(!nk) return;

          if(tok === nk) score += 5;
          else if(nk.indexOf(tok) >= 0) score += 3;
          else if(tok.indexOf(nk) >= 0 && nk.length >= 4) score += 2;
        });
      });

      allKeys(f).forEach(function(k){
        var nk = norm(k);
        if(nk.indexOf(" ") >= 0 && n.indexOf(nk) >= 0) score += 7;
      });

      return Object.assign({}, f, {score: score});
    });

    var matched = scored
      .filter(function(f){ return f.score > 0; })
      .sort(function(a,b){ return b.score - a.score; })
      .slice(0, 6);

    if(matched.length === 0){
      return [FICHES[0], FICHES[2], FICHES[4]];
    }

    return matched;
  }

  /* ─────────────────────────────────────────────
     RENDU — CARTES
  ───────────────────────────────────────────── */
  function render(){
    var q = $("q");
    var cards = $("cards");
    var status = $("status");
    var empty = $("empty");

    if(!q || !cards) return;

    var text = q.value.trim();
    var res = matchFiches(text);

    cards.innerHTML = "";
    if(empty) empty.style.display = (res.length === 0) ? "block" : "none";

    res.forEach(function(f){
      var msg = text ? f.wa + "\n\nBesoin client : " + text : f.wa;

      var el = document.createElement("article");
      el.className = "card";
      el.innerHTML =
        '<div class="cover">' + f.icon + '</div>' +
        '<div class="body">' +
          '<span class="tag">' + f.tag + ' · ' + f.zone + '</span>' +
          '<h3>' + f.title + '</h3>' +
          '<p>' + f.desc + '</p>' +
          '<div class="card-actions">' +
            '<a class="btn primary" href="' + f.url + '">' + (f.cta || "Voir fiche") + '</a>' +
            '<a class="btn green" target="_blank" rel="noopener noreferrer" href="' + waLink(msg) + '">WhatsApp</a>' +
          '</div>' +
        '</div>';

      cards.appendChild(el);
    });

    if(status){
      status.textContent = res.length ? foundLabel(res.length) : ui("notFound");
    }
  }

  /* ─────────────────────────────────────────────
     WHATSAPP
  ───────────────────────────────────────────── */
  function preparedMessage(){
    var q = $("q");
    var text = q && q.value.trim() ? q.value.trim() : ui("fallbackNeed");
    location.href = waLink(ui("msgPrefix") + text);
  }

  /* ─────────────────────────────────────────────
     MICRO
  ───────────────────────────────────────────── */
  function setupSpeech(){
    var btn = $("listenBtn");
    var q = $("q");
    var status = $("status");
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recog = null;
    var hardTimer = null;
    var silenceTimer = null;
    var listening = false;

    function setListening(on){
      listening = !!on;
      if(btn) btn.textContent = on ? ui("listening") : ui("listen");
      if(btn) btn.classList.toggle("isListening", on);
    }

    function stopTimers(){
      clearTimeout(hardTimer);
      clearTimeout(silenceTimer);
    }

    function stopListen(){
      try{ if(recog) recog.stop(); }catch(_){}
    }

    if(!btn) return;

    if(!SR){
      btn.textContent = ui("micUnavailable");
      return;
    }

    recog = new SR();
    recog.lang = speechLang();
    recog.interimResults = true;
    recog.continuous = true;
    recog.maxAlternatives = 1;

    recog.onstart = function(){
      setListening(true);
      if(status) status.textContent = ui("listenStatus");
      stopTimers();
      hardTimer = setTimeout(stopListen, LISTEN_MAX_MS);
    };

    recog.onresult = function(e){
      var txt = "";
      for(var i = 0; i < e.results.length; i++){
        txt += e.results[i][0].transcript;
      }

      if(q) q.value = txt.trim();
      if(status) status.textContent = ui("listenMore");

      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(stopListen, SILENCE_AFTER_RESULT_MS);
    };

    recog.onend = function(){
      stopTimers();
      setListening(false);

      if(status){
        status.textContent = q && q.value.trim() ? ui("voiceOk") : ui("micClosed");
      }

      render();
    };

    recog.onerror = function(){
      stopTimers();
      setListening(false);
      if(status) status.textContent = ui("micFragile");
    };

    btn.onclick = function(){
      if(listening){
        stopListen();
        return;
      }

      try{
        recog.lang = speechLang();
        recog.start();
      }catch(_){
        if(status) status.textContent = ui("micAlready");
      }
    };
  }

  /* ─────────────────────────────────────────────
     BIND
  ───────────────────────────────────────────── */
  function bind(){
    var searchBtn = $("searchBtn");
    var msgBtn = $("msgBtn");
    var clearBtn = $("clearBtn");
    var q = $("q");
    var status = $("status");

    ensureDuoLangBar();

    var manualSelect = $("digiyLang") || $("langMode");
    if(manualSelect){
      manualSelect.value = currentLang;
      manualSelect.onchange = function(){ setLang(manualSelect.value); };
    }

    if(searchBtn) searchBtn.onclick = render;
    if(msgBtn) msgBtn.onclick = preparedMessage;

    if(clearBtn){
      clearBtn.onclick = function(){
        if(q) q.value = "";
        render();
        if(status) status.textContent = ui("statusReady");
      };
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function(b){
      b.onclick = function(){
        if(q) q.value = b.getAttribute("data-q") || "";
        render();
      };
    });

    if(status && !status.textContent) status.textContent = ui("statusReady");

    setupSpeech();
    render();
  }

  /* ─────────────────────────────────────────────
     EXPOSITION
  ───────────────────────────────────────────── */
  window.DIGIY_ACTION_PUBLIC = {
    version: VERSION,
    fiches: FICHES,
    matchFiches: matchFiches,
    render: render,
    setLang: setLang,
    getLang: getLang
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", bind);
  }else{
    bind();
  }

})();


