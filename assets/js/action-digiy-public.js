/* DIGIYLYFE — La Voix du Business PUBLIC
   Rôle : moteur public de mise en relation.
   Doctrine : le public exprime un besoin, DIGIY fait remonter des fiches, contact direct. Aucun hub pro ouvert.
   Version : action-digiy-public-wolof-v1-20260607
*/
(function(){
  "use strict";

  var VERSION = "action-digiy-public-wolof-v1-20260607";
  var DIGIY_CONTACT = "221771342889";
  var LISTEN_MAX_MS = 18000;
  var SILENCE_AFTER_RESULT_MS = 5200;

  /* ─────────────────────────────────────────────
     FICHES — clés élargies + synonymes terrain
  ───────────────────────────────────────────── */
  var FICHES = [
    {
      module:"DRIVER",icon:"🚗",tag:"#chauffeur",title:"Chauffeur / transfert AIBD",zone:"Saly · Dakar · AIBD",
      desc:"Demande de trajet, transfert, horaire et contact direct.",
      keys:["chauffeur","driver","taxi","aibd","aeroport","aéroport","course","trajet","dakar","saly",
            "conduire","conduite","voiture","vehicule","véhicule","transport","transfert","navette",
            "aller","partir","emmener","ride","moto","mototaxi","sept places","7 places","vdm","diamniadio",
            "mbour","thiès","thies","ziguinchor",
            /* wolof */
            "jëridkat","jëride","shirfer","wecckat","dem","dem ci","wëcc","dem ak","bëgg dem",
            "dem aibd","dem dakar","dem saly","dem mbour","maa ngi dem","jaambur","dëkk"],
      url:"https://galerie-chauffeurs.digiylyfe.com/",cta:"Voir chauffeurs",
      wa:"Bonjour, je cherche un chauffeur / transfert AIBD via DIGIY."
    },
    {
      module:"EXPLORE",icon:"🎣",tag:"#annonce passerelle",title:"Sortie pêche / EXPLORE",zone:"Petite Côte",
      desc:"Le public demande, DIGIY oriente, le contact terrain reste direct.",
      keys:["peche","pêche","sortie","mer","pirogue","petite cote","petite côte","explore","visite","excursion","balade",
            "activite","activité","loisir","bateau","plage","ocean","océan","poisson","sport nautique","kayak",
            "promenade","detente","détente","tourisme","decouverte","découverte","week-end","weekend","vacances",
            /* wolof */
            "fegël","fegëlkat","liggeey reew","dem géej","géej","pirogue","jën","jën bi","dëkk bu bees",
            "yégëlef","dem ci géej","wuute","bokk ci","ñëw fegël"],
      url:"https://explore.digiylyfe.com/",cta:"Voir EXPLORE",
      wa:"Bonjour, je souhaite des informations sur une sortie pêche Petite Côte via DIGIY EXPLORE."
    },
    {
      module:"BUILD",icon:"🧰",tag:"#artisan",title:"Artisan / dépannage BUILD",zone:"Sénégal",
      desc:"Fuite, réparation, chantier, entretien : la porte publique prépare une demande claire.",
      keys:["fuite","plomberie","plombier","electricien","électricien","artisan","reparation","réparation",
            "build","travaux","chantier","depannage","dépannage","maçon","macon","carrelage","peinture",
            "peintre","menuisier","menuiserie","soudure","soudeur","climatisation","clim","electrique","électrique",
            "installation","branchement","coupure","panne","robinet","wc","toilette","tuyau","canalisation",
            "toiture","toit","dalle","fondation","renovation","rénovation","entretien","maintenance",
            "entrepreneur","construire","construction","batir","bâtir","bâtiment","batiment","gros oeuvre",
            "gros œuvre","maison","villa","immeuble","local","bungalow","structure","plan","devis",
            "architecte","ingenieur","ingénieur","terrassement","terrassier","ferrailleur","coffreur",
            "cloture","clôture","mur","ciment","beton","béton","parpaing","agglo","amenagement","aménagement",
            "finition","carreleur","piscine","garage","extension","agrandissement","saly","petite cote","petite côte",
            /* wolof */
            "wallufkat","liggeey","xam-xam","dem liggeey","jeex","jeex na","dëkkë liggeey",
            "artisan wolof","réparer","répare","yëgël devis","wàcc","kër","kër bi","tuyau bi"],
      url:"https://build.digiylyfe.com/",cta:"Décrire le besoin",
      wa:"Bonjour, j'ai besoin d'un artisan / entrepreneur / dépannage via DIGIY BUILD."
    },
    {
      module:"LOC",icon:"🏠",tag:"#logement",title:"Chez Baptiste — Saly",zone:"Saly · Petite Côte",
      desc:"Fiche logement démo : contact direct propriétaire, 0% commission DIGIY.",
      keys:["chez baptiste","baptiste","logement saly","chambre saly","maison saly","villa saly",
            "dormir saly","saly","petite cote","petite côte","loc","location","logement","chambre","villa","maison",
            /* wolof */
            "kër","kër bi","dëkk","joxeel kër","joxeel","guddi","nekk saly","dëkk saly"],
      url:"https://loc.digiylyfe.com/",cta:"Voir Chez Baptiste",
      wa:"Bonjour, je cherche un logement à Saly. Je souhaite voir Chez Baptiste via DIGIY LOC."
    },
    {
      module:"LOC",icon:"🏠",tag:"#logement",title:"Chambre / logement LOC",zone:"Saly · Petite Côte",
      desc:"Besoin de chambre, villa, réservation ou disponibilité.",
      keys:["chambre","logement","villa","maison","nuit","week-end","weekend","reservation","réservation",
            "loc","saly","location","studio","appartement","appart","hebergement","hébergement","dormir",
            "coucher","séjour","sejour","louer","loue","disponible","dispo","airbnb","gite","gîte",
            "mbour","ngaparou","somone","saloum","nianing",
            /* wolof */
            "kër","kër bi","joxeel kër","joxeel ak xaalis","guddi bu nekk","dugg","génn",
            "bëgg nekk","dëkk ci","yégël kër","mën a jënd","nekk ci kër"],
      url:"https://loc.digiylyfe.com/",cta:"Voir LOC",
      wa:"Bonjour, je cherche un logement / une chambre via DIGIY LOC."
    },
    {
      module:"RESA",icon:"📅",tag:"#réservation",title:"Réserver / demander une disponibilité",zone:"Restaurant · logement · service",
      desc:"Le public formule une intention. Le pro confirme ensuite côté module protégé.",
      keys:["resa","réservation","reservation","reserver","réserver","dispo","disponible","creneau","créneau",
            "date","heure","planning","rendez-vous","rdv","agenda","booker","booking","calendrier","place",
            "confirmer","confirmation","retenir","retient","bloquer",
            /* wolof */
            "yégël","yégël bi","bés bi","waxt","dégël","taxawal","mën a yégël","soxor na","bëgg a suur",
            "wax ci kanam","ci kanam","yégël ci kanam"],
      url:"https://resto.digiylyfe.com/",cta:"Demander une réservation",
      wa:"Bonjour, je souhaite faire une demande de réservation via DIGIY."
    },
    {
      module:"RESTO",icon:"🍽️",tag:"#resto",title:"Restaurant / table / menu",zone:"Saly · Dakar · Sénégal",
      desc:"Besoin de table, restaurant, menu, information ou contact direct.",
      keys:["resto","restaurant","table","menu","manger","dejeuner","déjeuner","diner","dîner","repas","commande",
            "nourriture","cuisine","gastronomie","chef","plat","grillades","fruits de mer","brochette","poisson grille",
            "soir","midi","brunch","buffet","lunch","snack","bar","terrasse","grillades","brasserie","cantine",
            /* wolof */
            "lekk","lekk bi","dëkk bu lekk","bëgg lekk","jën ak ceeb","ceeb","thiéboudienne","thiep","yassa",
            "mafé","ceebu jën","lekkal","nekk ci restau","table bi","jënd lekk","liggey restau"],
      url:"https://resto.digiylyfe.com/",cta:"Voir RESTO",
      wa:"Bonjour, je cherche un restaurant / une table via DIGIY RESTO."
    },
    {
      module:"MARKET",icon:"🛍️",tag:"#market",title:"Produits et commerces locaux",zone:"Sénégal",
      desc:"Boutiques, produits, offres locales, contact direct vendeur.",
      keys:["produit","acheter","boutique","market","commerce","serviette","drap","savon","article","prix","stock",
            "vendre","vente","magasin","epicerie","épicerie","superette","supérette","parapharmacie","pharmacie",
            "cosmétique","cosmetique","tissu","pagne","vetement","vêtement","chaussure","accessoire","bijou",
            "electronique","électronique","telephone","téléphone","informatique","fourniture","materiel","matériel",
            "alimentaire","alimentation","eau","boisson","huile","riz","farine","condiment","locale","local",
            /* wolof */
            "jaay","jaaykat","jënd","jëndkat","njëg","njëg bi","marché","listu jaay","dagga",
            "bëgg jënd","jënd ci","nettali","nettali bi","boutik","boutik bi","riz bi","huil","saawur"],
      url:"https://market.digiylyfe.com/",cta:"Voir MARKET",
      wa:"Bonjour, je cherche un produit ou une boutique via DIGIY MARKET."
    },
    {
      module:"POS",icon:"🧾",tag:"#commerce",title:"Commerce / caisse POS",zone:"Professionnels",
      desc:"Information POS côté public. La caisse réelle reste côté pro protégé.",
      keys:["pos","caisse","ticket","vente","vendre","encaisser","boutique","commerce","marchandise",
            "tpe","terminal","recu","reçu","facture","tva","compte","gestion","inventaire","stock",
            /* wolof */
            "ndefarati xaalis","ndefarati","papier jaay","jaay bi","jënd bi","yëgël bu jëm",
            "caisse wolof","fay ci caisse","encaisse"],
      url:"https://commencer-a-payer.digiylyfe.com/?module=POS",cta:"Activer POS",
      wa:"Bonjour, je souhaite des informations sur DIGIY POS / caisse commerce."
    },
    {
      module:"PAY",icon:"💳",tag:"#pay",title:"Paiement / PAY",zone:"Wave · Cash · caisse",
      desc:"Question paiement, activation, preuve ou mise en relation PAY.",
      keys:["pay","paiement","payer","wave","orange money","cash","preuve","recu","reçu","abonnement","activer",
            "virement","transfert","envoyer argent","recevoir argent","solde","mobile money","free money",
            "e-money","eMoney","carte","depot","dépôt","retrait","transaction","règlement","reglement",
            /* wolof */
            "xaalis","fay","fay bi","yégël waxtu","xaalis bi","dooro","ndëy","solde wolof",
            "yëgëlef fay","xaalis bu des","yégël waxtu bi","teral","tëral","wave bi","envoye xaalis"],
      url:"https://commencer-a-payer.digiylyfe.com/?module=PAY",cta:"Voir PAY",
      wa:"Bonjour, je souhaite une information PAY / paiement DIGIY."
    },
    {
      module:"RESEAU_DIGIY",icon:"📣",tag:"#réseau",title:"Réseau DIGIY / annonce",zone:"Visibilité locale",
      desc:"Annonce, fiche, QR, partage et visibilité dans le réseau.",
      keys:["reseau","réseau","annonce","visibilite","visibilité","fiche","qr","partage","publier","promotion",
            "communiquer","communication","affichage","flyer","prospectus","pub","publicite","publicité",
            "mettre en avant","référencer","referencer","notoriete","notoriété","connu","trouver",
            /* wolof */
            "mbokk ak mbokk","dëkk ak dëkk","jëf liggeeykat","xibaar liggeey","bokk ci","wax ci",
            "fegël moom","yëgëlef","visible","digiy reseau","réseau digiy"],
      url:"https://reseau-digiy.digiylyfe.com/",cta:"Voir RÉSEAU",
      wa:"Bonjour, je souhaite une information sur RÉSEAU DIGIY / annonce."
    },
    {
      module:"JOBS",icon:"💼",tag:"#jobs",title:"Emploi / service terrain",zone:"Sénégal",
      desc:"Recherche de poste, service, recrutement ou mission.",
      keys:["emploi","job","jobs","travail","serveur","serveuse","recrute","recruter","mission","candidat","cv",
            "stage","stagiaire","embauche","embaucher","poste","contrat","cdi","cdd","interim","intérim",
            "freelance","prestation","service","technicien","agent","gardien","veileur","cuisinier","cuisinière",
            "receptionniste","réceptionniste","femme chambre","femme de chambre","lingere","lingère","animateur",
            "commerciale","commercial","vendeur","vendeuse","chauffeur emploi","livreur",
            /* wolof */
            "bëgg liggeey","liggeeykat","liggeyéef","bëgg liggeeykat","soppiku liggeeykat",
            "xibaar moom","dox fii","wax ak rekk","jël nit","liggeey bi","xam-xam bi",
            "maa ngi bëgg liggeey","mission wolof","recruter wolof"],
      url:"https://jobs.digiylyfe.com/",cta:"Voir JOBS",
      wa:"Bonjour, je cherche une information JOBS via DIGIY."
    }
  ];

  /* ─────────────────────────────────────────────
     UTILITAIRES
  ───────────────────────────────────────────── */
  function $(id){ return document.getElementById(id); }

  function norm(s){
    return String(s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[''`]/g,"'")
      .trim();
  }

  function waLink(txt){
    return "https://wa.me/" + DIGIY_CONTACT + "?text=" + encodeURIComponent(txt);
  }

  /* tokenise le texte en mots de 3+ lettres */
  function tokens(s){
    return norm(s).split(/[\s,.\-!?;:()]+/).filter(function(w){ return w.length >= 3; });
  }

  /* ─────────────────────────────────────────────
     MOTEUR FUZZY RENFORCÉ
     Score par mot du texte × chaque clé :
       +4  si mot texte  === clé exacte
       +3  si clé contient mot texte (partiel entrant)
       +2  si mot texte contient clé (partiel sortant)
       +5  bonus module name exact
       +2  bonus sur titre normalisé
       +1  bonus sur desc normalisée
  ───────────────────────────────────────────── */
  function matchFiches(text){
    var n = norm(text);
    var toks = tokens(text);

    if(!n || toks.length === 0){
      /* sans texte : top 3 par défaut */
      return FICHES.slice(0,3);
    }

    var scored = FICHES.map(function(f){
      var score = 0;

      toks.forEach(function(tok){
        /* bonus module */
        if(tok === norm(f.module)) score += 5;

        /* bonus titre */
        if(norm(f.title).indexOf(tok) >= 0) score += 2;

        /* bonus desc */
        if(norm(f.desc).indexOf(tok) >= 0) score += 1;

        /* clés */
        f.keys.forEach(function(k){
          var nk = norm(k);
          if(tok === nk)                      score += 4;  // exact
          else if(nk.indexOf(tok) >= 0)       score += 3;  // clé contient mot
          else if(tok.indexOf(nk) >= 0 && nk.length >= 4) score += 2; // mot contient clé (min 4 car)
        });
      });

      /* bonus phrase complète dans les clés (groupes de mots) */
      f.keys.forEach(function(k){
        if(k.indexOf(" ") >= 0 && n.indexOf(norm(k)) >= 0) score += 5;
      });

      return Object.assign({}, f, {score: score});
    });

    /* fiches avec au moins un point */
    var matched = scored
      .filter(function(f){ return f.score > 0; })
      .sort(function(a,b){ return b.score - a.score; })
      .slice(0, 6);

    /* FALLBACK : si rien ne matche, les 3 fiches les plus génériques */
    if(matched.length === 0){
      return [FICHES[0], FICHES[2], FICHES[4]]; /* DRIVER, BUILD, LOC */
    }

    return matched;
  }

  /* ─────────────────────────────────────────────
     RENDU DES CARTES
  ───────────────────────────────────────────── */
  function render(){
    var q = $("q"), cards = $("cards"), status = $("status"), empty = $("empty");
    if(!q || !cards) return;

    var text = q.value.trim();
    var res  = matchFiches(text);

    cards.innerHTML = "";
    if(empty) empty.style.display = (res.length === 0) ? "block" : "none";

    res.forEach(function(f){
      var msg = text ? f.wa + "\n\nBesoin client : " + text : f.wa;
      var el  = document.createElement("article");
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
      if(res.length){
        status.textContent = res.length + " fiche(s) remontée(s). Contact direct.";
      } else {
        status.textContent = "Besoin compris, mais aucune fiche locale exacte. DIGIY peut t'orienter sur WhatsApp.";
      }
    }
  }

  /* ─────────────────────────────────────────────
     MESSAGE WHATSAPP PRÉPARÉ
  ───────────────────────────────────────────── */
  function preparedMessage(){
    var q    = $("q");
    var text = q && q.value.trim()
      ? q.value.trim()
      : "Bonjour, je viens de DIGIY. Je cherche une mise en relation.";
    location.href = waLink("Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : " + text);
  }

  /* ─────────────────────────────────────────────
     RECONNAISSANCE VOCALE
  ───────────────────────────────────────────── */
  function setupSpeech(){
    var btn = $("listenBtn"), q = $("q"), status = $("status");
    var SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recog = null, hardTimer = null, silenceTimer = null, listening = false;

    function setListening(on){
      listening = !!on;
      if(btn){ btn.textContent = on ? "🎙️ J'écoute… parle tranquillement" : "🎙️ Parler"; }
      if(btn){ btn.classList.toggle("isListening", on); }
    }
    function stopTimers(){ clearTimeout(hardTimer); clearTimeout(silenceTimer); }
    function stopListen(){ try{ if(recog) recog.stop(); }catch(_){} }

    if(!btn) return;
    if(!SR){ btn.textContent = "🎙️ Micro indispo"; return; }

    recog = new SR();
    recog.lang           = "fr-FR";
    recog.interimResults = true;
    recog.continuous     = true;
    recog.maxAlternatives = 1;

    recog.onstart = function(){
      setListening(true);
      if(status) status.textContent = "J'écoute… prends ton temps, parle naturellement.";
      stopTimers();
      hardTimer = setTimeout(stopListen, LISTEN_MAX_MS);
    };
    recog.onresult = function(e){
      var txt = "";
      for(var i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      if(q) q.value = txt.trim();
      if(status) status.textContent = "Je t'écoute encore… tu peux compléter.";
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(stopListen, SILENCE_AFTER_RESULT_MS);
    };
    recog.onend = function(){
      stopTimers();
      setListening(false);
      if(status) status.textContent = q && q.value.trim()
        ? "Voix captée. Les fiches remontent."
        : "Micro fermé. Tu peux recommencer ou écrire le besoin.";
      render();
    };
    recog.onerror = function(){
      stopTimers();
      setListening(false);
      if(status) status.textContent = "Micro fragile. Tu peux écrire le besoin.";
    };
    btn.onclick = function(){
      if(listening){ stopListen(); return; }
      try{ recog.start(); }catch(_){ if(status) status.textContent = "Micro déjà lancé."; }
    };
  }

  /* ─────────────────────────────────────────────
     BIND
  ───────────────────────────────────────────── */
  function bind(){
    var searchBtn = $("searchBtn"), msgBtn = $("msgBtn"), clearBtn = $("clearBtn");
    var q = $("q"), status = $("status");

    if(searchBtn) searchBtn.onclick = render;
    if(msgBtn)    msgBtn.onclick    = preparedMessage;
    if(clearBtn)  clearBtn.onclick  = function(){
      if(q) q.value = "";
      render();
      if(status) status.textContent = "Prêt.";
    };

    /* chips */
    Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function(b){
      b.onclick = function(){
        if(q) q.value = b.getAttribute("data-q") || "";
        render();
      };
    });

    setupSpeech();
    render(); /* affiche 3 fiches par défaut au chargement */
  }

  /* ─────────────────────────────────────────────
     EXPOSITION PUBLIQUE
  ───────────────────────────────────────────── */
  window.DIGIY_ACTION_PUBLIC = {
    version    : VERSION,
    fiches     : FICHES,
    matchFiches: matchFiches,
    render     : render
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();



