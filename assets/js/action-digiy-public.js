/* DIGIYLYFE — La Voix du Business PUBLIC
   Rôle : moteur public de mise en relation.
   Doctrine : le public exprime un besoin, DIGIY fait remonter des fiches, contact direct. Aucun hub pro ouvert.
*/
(function(){
  "use strict";

  var VERSION = "action-digiy-public-official-20260606";
  var DIGIY_CONTACT = "221771342889";

  var FICHES = [
    {module:"DRIVER",icon:"🚗",tag:"#chauffeur",title:"Chauffeur / transfert AIBD",zone:"Saly · Dakar · AIBD",desc:"Demande de trajet, transfert, horaire et contact direct.",keys:["chauffeur","driver","taxi","aibd","aeroport","aéroport","course","trajet","dakar","saly"],url:"https://galerie-chauffeurs.digiylyfe.com/",cta:"Voir chauffeurs",wa:"Bonjour, je cherche un chauffeur / transfert AIBD via DIGIY."},
    {module:"EXPLORE",icon:"🎣",tag:"#annonce passerelle",title:"Sortie pêche / EXPLORE",zone:"Petite Côte",desc:"Le public demande, DIGIY oriente, le contact terrain reste direct.",keys:["peche","pêche","sortie","mer","pirogue","petite cote","petite côte","explore","visite","excursion","balade"],url:"https://explore.digiylyfe.com/",cta:"Voir EXPLORE",wa:"Bonjour, je souhaite des informations sur une sortie pêche Petite Côte via DIGIY EXPLORE."},
    {module:"BUILD",icon:"🧰",tag:"#artisan",title:"Artisan / dépannage BUILD",zone:"Sénégal",desc:"Fuite, réparation, chantier, entretien : la porte publique prépare une demande claire.",keys:["fuite","plomberie","plombier","electricien","électricien","artisan","reparation","réparation","build","travaux","chantier","depannage","dépannage"],url:"https://build.digiylyfe.com/",cta:"Décrire le besoin",wa:"Bonjour, j’ai besoin d’un artisan / dépannage via DIGIY BUILD."},
    {module:"LOC",icon:"🏠",tag:"#logement",title:"Chez Baptiste — Saly",zone:"Saly · Petite Côte",desc:"Fiche logement démo : contact direct propriétaire, 0% commission DIGIY.",keys:["chez baptiste","baptiste","logement saly","chambre saly","maison saly","villa saly","dormir saly","saly","petite cote","petite côte","loc","location","logement","chambre","villa","maison"],url:"https://loc.digiylyfe.com/",cta:"Voir Chez Baptiste",wa:"Bonjour, je cherche un logement à Saly. Je souhaite voir Chez Baptiste via DIGIY LOC."},
    {module:"LOC",icon:"🏠",tag:"#logement",title:"Chambre / logement LOC",zone:"Saly · Petite Côte",desc:"Besoin de chambre, villa, réservation ou disponibilité.",keys:["chambre","logement","villa","maison","nuit","week-end","weekend","reservation","réservation","loc","saly","location"],url:"https://loc.digiylyfe.com/",cta:"Voir LOC",wa:"Bonjour, je cherche un logement / une chambre via DIGIY LOC."},
    {module:"RESA",icon:"📅",tag:"#réservation",title:"Réserver / demander une disponibilité",zone:"Restaurant · logement · service",desc:"Le public formule une intention. Le pro confirme ensuite côté module protégé.",keys:["resa","réservation","reservation","reserver","réserver","dispo","disponible","creneau","créneau","date","heure","planning"],url:"https://digiylyfe.com/digiy-resto/",cta:"Demander une réservation",wa:"Bonjour, je souhaite faire une demande de réservation via DIGIY."},
    {module:"RESTO",icon:"🍽️",tag:"#resto",title:"Restaurant / table / menu",zone:"Saly · Dakar · Sénégal",desc:"Besoin de table, restaurant, menu, information ou contact direct.",keys:["resto","restaurant","table","menu","manger","dejeuner","déjeuner","diner","dîner","repas","commande"],url:"https://digiylyfe.com/digiy-resto/",cta:"Voir RESTO",wa:"Bonjour, je cherche un restaurant / une table via DIGIY RESTO."},
    {module:"MARKET",icon:"🛍️",tag:"#market",title:"Produits et commerces locaux",zone:"Sénégal",desc:"Boutiques, produits, offres locales, contact direct vendeur.",keys:["produit","acheter","boutique","market","commerce","serviette","drap","savon","article","prix","stock"],url:"https://digiylyfe.com/",cta:"Voir MARKET",wa:"Bonjour, je cherche un produit ou une boutique via DIGIY MARKET."},
    {module:"POS",icon:"🧾",tag:"#commerce",title:"Commerce / caisse POS",zone:"Professionnels",desc:"Information POS côté public. La caisse réelle reste côté pro protégé.",keys:["pos","caisse","ticket","vente","vendre","encaisser","boutique","commerce","marchandise"],url:"https://commencer-a-payer.digiylyfe.com/?module=POS",cta:"Activer POS",wa:"Bonjour, je souhaite des informations sur DIGIY POS / caisse commerce."},
    {module:"PAY",icon:"💳",tag:"#pay",title:"Paiement / PAY",zone:"Wave · Cash · caisse",desc:"Question paiement, activation, preuve ou mise en relation PAY.",keys:["pay","paiement","payer","wave","orange money","cash","preuve","recu","reçu","abonnement","activer"],url:"https://commencer-a-payer.digiylyfe.com/?module=PAY",cta:"Voir PAY",wa:"Bonjour, je souhaite une information PAY / paiement DIGIY."},
    {module:"RESEAU_DIGIY",icon:"📣",tag:"#réseau",title:"Réseau DIGIY / annonce",zone:"Visibilité locale",desc:"Annonce, fiche, QR, partage et visibilité dans le réseau.",keys:["reseau","réseau","annonce","visibilite","visibilité","fiche","qr","partage","publier","promotion"],url:"https://reseau-digiy.digiylyfe.com/",cta:"Voir RÉSEAU",wa:"Bonjour, je souhaite une information sur RÉSEAU DIGIY / annonce."},
    {module:"JOBS",icon:"💼",tag:"#jobs",title:"Emploi / service terrain",zone:"Sénégal",desc:"Recherche de poste, service, recrutement ou mission.",keys:["emploi","job","jobs","travail","serveur","serveuse","recrute","recruter","mission","candidat","cv"],url:"https://digiylyfe.com/",cta:"Voir JOBS",wa:"Bonjour, je cherche une information JOBS via DIGIY."}
  ];

  function $(id){ return document.getElementById(id); }
  function norm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim(); }
  function waLink(txt){ return "https://wa.me/" + DIGIY_CONTACT + "?text=" + encodeURIComponent(txt); }
  function matchFiches(text){
    var n = norm(text);
    if(!n) return FICHES.slice(0,3);
    return FICHES.map(function(f){
      var score = 0;
      f.keys.forEach(function(k){ if(n.indexOf(norm(k)) >= 0) score += 2; });
      if(n.indexOf(norm(f.module)) >= 0) score += 3;
      return Object.assign({}, f, {score:score});
    }).filter(function(f){ return f.score > 0; }).sort(function(a,b){ return b.score - a.score; }).slice(0,6);
  }
  function render(){
    var q = $("q"), cards = $("cards"), status = $("status"), empty = $("empty");
    if(!q || !cards) return;
    var text = q.value.trim();
    var res = matchFiches(text);
    cards.innerHTML = "";
    if(empty) empty.style.display = res.length ? "none" : "block";
    res.forEach(function(f){
      var msg = text ? f.wa + "\n\nBesoin client : " + text : f.wa;
      var el = document.createElement("article");
      el.className = "card";
      el.innerHTML = '<div class="cover">' + f.icon + '</div><div class="body"><span class="tag">' + f.tag + ' · ' + f.zone + '</span><h3>' + f.title + '</h3><p>' + f.desc + '</p><div class="card-actions"><a class="btn primary" href="' + f.url + '">' + (f.cta || "Voir fiche") + '</a><a class="btn green" target="_blank" rel="noopener noreferrer" href="' + waLink(msg) + '">WhatsApp</a></div></div>';
      cards.appendChild(el);
    });
    if(status) status.textContent = res.length ? res.length + " fiche(s) remontée(s). Contact direct." : "Besoin compris, mais aucune fiche locale exacte.";
  }
  function preparedMessage(){
    var q = $("q");
    var text = q && q.value.trim() ? q.value.trim() : "Bonjour, je viens de DIGIY. Je cherche une mise en relation.";
    location.href = waLink("Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : " + text);
  }
  function setupSpeech(){
    var btn = $("listenBtn"), q = $("q"), status = $("status");
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!btn) return;
    if(!SR){ btn.textContent = "🎙️ Micro indispo"; return; }
    var recog = new SR();
    recog.lang = "fr-FR";
    recog.interimResults = true;
    recog.continuous = false;
    recog.onstart = function(){ if(status) status.textContent = "J’écoute..."; };
    recog.onresult = function(e){
      var txt = "";
      for(var i=0;i<e.results.length;i++) txt += e.results[i][0].transcript;
      if(q) q.value = txt;
    };
    recog.onend = function(){ if(status) status.textContent = "Voix captée. Tu peux voir les fiches."; render(); };
    recog.onerror = function(){ if(status) status.textContent = "Micro fragile. Écris le besoin."; };
    btn.onclick = function(){ try{ recog.start(); }catch(_){ if(status) status.textContent = "Micro déjà lancé."; } };
  }
  function bind(){
    var searchBtn = $("searchBtn"), msgBtn = $("msgBtn"), clearBtn = $("clearBtn"), q = $("q"), status = $("status");
    if(searchBtn) searchBtn.onclick = render;
    if(msgBtn) msgBtn.onclick = preparedMessage;
    if(clearBtn) clearBtn.onclick = function(){ if(q) q.value = ""; render(); if(status) status.textContent = "Prêt."; };
    Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function(b){
      b.onclick = function(){ if(q) q.value = b.getAttribute("data-q") || ""; render(); };
    });
    setupSpeech();
    render();
  }

  window.DIGIY_ACTION_PUBLIC = {version:VERSION, fiches:FICHES, matchFiches:matchFiches, render:render};
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
