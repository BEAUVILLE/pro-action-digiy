/* DIGIYLYFE — ACTION DIGIY PRO
   Rôle : moteur du carrefour vocal métier pro.html.
   Doctrine : ACTION DIGIY prépare, le module métier contrôle, le professionnel valide.
   Rien n'est envoyé, payé, publié, réservé ou confirmé automatiquement.
*/
(function(){
  "use strict";

  var VERSION = "action-digiy-pro-official-20260606";
  var CONFIG = {
    storageKey: "DIGIY_ACTION_QUEUE",
    latestKey: "DIGIY_PENDING_ACTION",
    routes: {
      PAY: "https://pro-pay.digiylyfe.com/action.html",
      POS: "https://commerce-pro.digiylyfe.com/action.html",
      MARKET: "https://pro-market.digiylyfe.com/oreille.html",
      DRIVER: "https://pro-driver.digiylyfe.com/oreille.html",
      LOC: "https://pro-loc.digiylyfe.com/oreille.html",
      RESA: "https://pro-resa-resto.digiylyfe.com/oreille.html",
      RESTO: "https://pro-resto.digiylyfe.com/oreille.html",
      EXPLORE: "https://pro-explore.digiylyfe.com/submit.html",
      RESEAU_DIGIY: "https://reseau-digiy.digiylyfe.com/oreille.html",
      BUILD: "https://pro-build.digiylyfe.com/oreille.html",
      JOBS: "https://pro-job.digiylyfe.com/oreille.html",
      HUB: "https://digiy-hub.digiylyfe.com/"
    }
  };

  function $(id){ return document.getElementById(id); }
  function safeEl(id){ return $(id) || {textContent:"",value:"",classList:{add:function(){},remove:function(){},toggle:function(){}},addEventListener:function(){},disabled:false}; }

  var els = {
    voiceText: safeEl("voiceText"), startBtn: safeEl("startBtn"), stopBtn: safeEl("stopBtn"), prepareBtn: safeEl("prepareBtn"), clearBtn: safeEl("clearBtn"),
    statusPill: safeEl("statusPill"), statusText: safeEl("statusText"), result: safeEl("result"),
    rAction: safeEl("rAction"), rAmount: safeEl("rAmount"), rQty: safeEl("rQty"), rUnit: safeEl("rUnit"), rRoute: safeEl("rRoute"), rChannel: safeEl("rChannel"), rConfidence: safeEl("rConfidence"), rRule: safeEl("rRule"), rSummary: safeEl("rSummary"),
    openModuleBtn: safeEl("openModuleBtn"), saveDraftBtn: safeEl("saveDraftBtn"), copyBtn: safeEl("copyBtn"), cancelDraftBtn: safeEl("cancelDraftBtn"), toast: safeEl("toast")
  };

  var recognition = null;
  var currentDraft = null;
  var listenBuffer = "";
  var prepareTimer = null;

  function toast(message){
    if(!els.toast || !els.toast.classList) return;
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ els.toast.classList.remove("show"); }, 2600);
  }
  function setStatus(text, live){
    els.statusText.textContent = text;
    els.statusPill.classList.toggle("on", !!live);
  }
  function fixMojibake(t){
    return String(t || "")
      .replace(/Ã\u00a0/g,"à").replace(/Ã\s+/g,"à ").replace(/Ã$/g,"à")
      .replace(/Ã©/g,"é").replace(/Ã¨/g,"è").replace(/Ãª/g,"ê").replace(/Ã«/g,"ë")
      .replace(/Ã /g,"à").replace(/Ã¡/g,"á").replace(/Ã¢/g,"â").replace(/Ã¤/g,"ä")
      .replace(/Ã´/g,"ô").replace(/Ã¶/g,"ö").replace(/Ã¹/g,"ù").replace(/Ã»/g,"û").replace(/Ã¼/g,"ü")
      .replace(/Ã®/g,"î").replace(/Ã¯/g,"ï").replace(/Ã§/g,"ç")
      .replace(/â\u20ac\u2122/g,"’").replace(/â€™/g,"’").replace(/Â/g,"");
  }
  function normalizeText(t){
    return fixMojibake(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g," ").replace(/[.,;:!?]/g," ").replace(/\s+/g," ").trim();
  }
  function cleanForDisplay(t){
    return fixMojibake(t).trim()
      .replace(/^\s*action\s+(digi\s+i|diji\s+i|dgi\s+i|dj|d\s*j|dji|digiy)\s*/i,"")
      .replace(/^\s*digiy\s*/i,"")
      .replace(/^\s*digi\s*i\s*/i,"")
      .replace(/^\s*(note|ajoute|ajouter|prépare|prepare|crée|cree|mets|met)\s+/i,"")
      .replace(/\bmodule\s+(pos|poste|post|pay|paie|paye)\b/gi," ")
      .replace(/\b(web|wêve|weve|wève|wavee|ouève|ouve|waf|wef)\b/gi,"Wave")
      .replace(/\bfrancs?\b/gi,"")
      .replace(/\s+/g," ")
      .trim();
  }
  function includesAny(text, words){ return words.some(function(w){ return text.indexOf(w) >= 0; }); }
  function allNumbers(t){
    var out = [];
    fixMojibake(t).replace(/\d[\d\s.,]*/g,function(m){
      var n = Number(String(m).replace(/[^\d]/g,""));
      if(Number.isFinite(n) && n > 0) out.push(n);
      return m;
    });
    return out;
  }

  var NUMBER_WORDS = {un:1, une:1, deux:2, trois:3, quatre:4, cinq:5, six:6, sept:7, huit:8, neuf:9, dix:10, onze:11, douze:12, treize:13, quatorze:14, quinze:15, seize:16, vingt:20, trente:30, quarante:40, cinquante:50};
  var NUMBER_WORD_RE = "un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante";
  function wordNumber(w){ return NUMBER_WORDS[normalizeText(w)] || 0; }
  function quantityFromWordsOrDigits(t){
    var n = normalizeText(t);
    var digit = n.match(/(?:^|\b)(\d{1,3})\s*(?:x\s+)?[a-z]/i);
    if(digit){ var q = Number(digit[1]); if(q > 0 && q < 1000) return q; }
    var word = n.match(new RegExp("(?:^|\\b)(" + NUMBER_WORD_RE + ")\\s+(?:x\\s+)?[a-z]","i"));
    if(word){ var qw = wordNumber(word[1]); if(qw > 0 && qw < 1000) return qw; }
    return null;
  }
  function extractChannel(t){
    var n = normalizeText(t);
    if(includesAny(n,["wave","ouve","oueve","web","weve"])) return "Wave";
    if(n.indexOf("orange money") >= 0 || n.indexOf(" om ") >= 0) return "Orange Money";
    if(includesAny(n,["cash","espece","liquide","payer cash","paye cash"])) return "Cash";
    if(n.indexOf("virement") >= 0) return "Virement";
    return "";
  }
  function detectProductSignal(t){
    var n = normalizeText(t);
    return includesAny(n,["serviette","serviettes","bain","drap","draps","linge","fouta","foutas","housse","couette","oreiller","nappe","savon","sac","robe","tissu","creme","produit","article","stock"]);
  }
  function parseSaleDetails(command){
    var n = normalizeText(command), nums = allNumbers(command);
    var quantity = quantityFromWordsOrDigits(command), unitPrice = null, total = null;
    var um = n.match(/(?:a|unite|piece|prix)\s*(\d[\d\s.,]*)/i);
    if(um) unitPrice = Number(um[1].replace(/[^\d]/g,""));
    if(quantity && nums.length >= 1 && !unitPrice) unitPrice = nums[nums.length - 1];
    if(!quantity && nums.length >= 2 && nums[0] > 0 && nums[0] < 1000){ quantity = nums[0]; unitPrice = nums[nums.length - 1]; }
    if(quantity && unitPrice) total = quantity * unitPrice;
    else if(nums.length) total = nums[nums.length - 1];
    return {quantity:quantity, unitPrice:unitPrice, totalAmount:total, amount:total, pricingText: quantity && unitPrice ? quantity + " × " + unitPrice.toLocaleString("fr-FR") + " = " + total.toLocaleString("fr-FR") + " FCFA" : total ? total.toLocaleString("fr-FR") + " FCFA" : ""};
  }
  function extractAmount(t){ return parseSaleDetails(t).amount || null; }

  function detectModule(t){
    var n = normalizeText(t);
    var scores = {PAY:0, POS:0, MARKET:0, DRIVER:0, LOC:0, RESA:0, RESTO:0, EXPLORE:0, RESEAU_DIGIY:0, BUILD:0, JOBS:0};
    function add(m,p){ scores[m] += p; }
    if(includesAny(n,["vente","vendu","recette","revenu","entree","encaisse","encaissement","depense","dette","credit","paiement","paye","payer","facture","recu","wave","cash","orange money"])) add("PAY",4);
    if(detectProductSignal(n)) add("POS",5);
    if(includesAny(n,["stock","produit","prix","quantite","article"])) add("POS",4);
    if(includesAny(n,["market","annonce produit","publier produit","vendre sur market"])) add("MARKET",5);
    if(includesAny(n,["course","trajet","chauffeur","taxi","driver","depart","arrivee","aeroport","client","saly dakar","dakar saly"])) add("DRIVER",5);
    if(includesAny(n,["location","louer","villa","maison","appartement","chambre","logement","loc","nuit"])) add("LOC",5);
    if(includesAny(n,["reservation","reservations","reserver","planning","ferme","fermer","dispo","indisponible","creneau","calendrier"])) add("RESA",5);
    if(includesAny(n,["resto","restaurant","table","menu","commande","dejeuner","diner","repas","cuisine"])) add("RESTO",5);
    if(includesAny(n,["explore","sortie","peche","pêche","visite","excursion","balade","pirogue","petite cote","petite côte","tour","experience","expérience"])) add("EXPLORE",5);
    if(includesAny(n,["reseau","visibilite","notoriete","annonce","faire circuler","publie","publier","cabinet","fiche","qr"])) add("RESEAU_DIGIY",5);
    if(includesAny(n,["build","chantier","artisan","reparation","depannage","plomberie","electricite","travaux","intervention","note chantier","devis"])) add("BUILD",5);
    if(includesAny(n,["job","emploi","poste candidat","cv","recrute","recruter","travail","serveur","serveuse"])) add("JOBS",5);
    if(detectProductSignal(n) && extractAmount(n)) scores.POS += 9;
    if(includesAny(n,["recette","revenu","entree","depense","dette","credit","paiement simple","encaissement dette"])) scores.PAY += 8;
    var winner = "HUB", best = 0;
    Object.entries(scores).forEach(function(pair){ if(pair[1] > best){ best = pair[1]; winner = pair[0]; } });
    return {module:winner, score:best};
  }
  function detectAction(t,m){
    var n = normalizeText(t);
    if(m === "PAY" || m === "POS"){
      if(includesAny(n,["depense","sortie","achat","paye fournisseur"])) return "ADD_EXPENSE";
      if(includesAny(n,["dette","credit","a recevoir","doit"])) return "ADD_RECEIVABLE";
      if(includesAny(n,["recette","vente","vendu","encaisse","paiement","payer","paye","recu"]) || detectProductSignal(n)) return "ADD_SALE";
      return "ADD_MOVEMENT";
    }
    if(m === "DRIVER") return "PREPARE_TRIP";
    if(m === "RESA" || m === "LOC" || m === "RESTO") return includesAny(n,["ferme","fermer","indisponible","bloque","bloquer"]) ? "CLOSE_AVAILABILITY" : "PREPARE_BOOKING";
    if(m === "EXPLORE") return "PREPARE_EXPLORE_ANNOUNCEMENT";
    if(m === "RESEAU_DIGIY") return "PREPARE_ANNOUNCEMENT";
    if(m === "BUILD") return "PREPARE_SERVICE_NOTE";
    if(m === "JOBS") return "PREPARE_JOB_POST";
    if(m === "MARKET") return "PREPARE_MARKET_LISTING";
    return "GENERAL_NOTE";
  }
  function moduleLabel(m){ return ({PAY:"PAY", POS:"POS", MARKET:"MARKET", DRIVER:"DRIVER", LOC:"LOC", RESA:"RESA", RESTO:"RESTO", EXPLORE:"EXPLORE", RESEAU_DIGIY:"RÉSEAU", BUILD:"BUILD", JOBS:"JOBS", HUB:"HUB"})[m] || m; }
  function actionLabel(a){ return ({ADD_EXPENSE:"Préparer dépense", ADD_RECEIVABLE:"Préparer dette client", ADD_SALE:"Préparer recette / vente", ADD_MOVEMENT:"Préparer mouvement", PREPARE_TRIP:"Préparer course", CLOSE_AVAILABILITY:"Préparer fermeture", PREPARE_BOOKING:"Préparer réservation", PREPARE_ANNOUNCEMENT:"Préparer annonce", PREPARE_EXPLORE_ANNOUNCEMENT:"Préparer annonce EXPLORE", PREPARE_SERVICE_NOTE:"Préparer note chantier", PREPARE_JOB_POST:"Préparer offre", PREPARE_MARKET_LISTING:"Préparer annonce", GENERAL_NOTE:"Note générale"})[a] || a; }
  function confidenceLabel(score){ if(score >= 8) return "Forte"; if(score >= 6) return "Bonne"; if(score >= 3) return "Moyenne"; return "À préciser"; }
  function routingRule(module){ return module === "POS" ? "POS détaille la vente" : module === "PAY" ? "PAY reçoit l’argent" : module === "BUILD" ? "BUILD prépare une note chantier" : "Route métier"; }

  function buildDraft(rawText){
    var spokenText = String(rawText || "").trim();
    var commandText = cleanForDisplay(spokenText);
    var detected = detectModule(commandText);
    var module = detected.module;
    var action = detectAction(commandText, module);
    var sale = parseSaleDetails(commandText);
    var channel = extractChannel(commandText);
    return {
      source:"ACTION_DIGIY",
      version:VERSION,
      voiceLayer:"LA_VOIX_DU_BUSINESS",
      status:"draft",
      requiresHumanValidation:true,
      primaryModule:module,
      module:module,
      moduleLabel:moduleLabel(module),
      linkedModules:[],
      linkedModuleLabels:[],
      action:action,
      actionLabel:actionLabel(action),
      spokenText:spokenText,
      rawText:commandText,
      commandText:commandText,
      quantity:sale.quantity,
      unitPrice:sale.unitPrice,
      totalAmount:sale.totalAmount,
      amount:sale.amount,
      currency:sale.amount ? "XOF" : "",
      pricingText:sale.pricingText,
      channel:channel,
      confidence:confidenceLabel(detected.score),
      route:CONFIG.routes[module] || CONFIG.routes.HUB,
      routes:{primary:CONFIG.routes[module] || CONFIG.routes.HUB, linked:[]},
      createdAt:new Date().toISOString(),
      safety:{noAutoSend:true,noAutoPayment:true,noAutoPublish:true,noAutoBooking:true,noAutoConfirmation:true,noAutoProductCreation:true}
    };
  }
  function encodeDraft(d){ try{ return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(d))))); }catch(_){ return ""; } }
  function routeWithDraft(url,d){ var p = encodeDraft(d); return p ? url + "#digiyAction=" + p : url; }
  function readQueue(){ try{ var x = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]"); return Array.isArray(x) ? x : []; }catch(_){ return []; } }
  function saveDraft(d){ var q = readQueue(); q.unshift(d); localStorage.setItem(CONFIG.storageKey, JSON.stringify(q.slice(0,50))); localStorage.setItem(CONFIG.latestKey, JSON.stringify(d)); }
  function renderDraft(d){
    currentDraft = d;
    els.rAction.textContent = d.actionLabel;
    els.rAmount.textContent = d.pricingText || "—";
    els.rQty.textContent = d.quantity ? String(d.quantity) : "—";
    els.rUnit.textContent = d.unitPrice ? d.unitPrice.toLocaleString("fr-FR") + " FCFA" : "—";
    els.rRoute.textContent = d.moduleLabel;
    els.rChannel.textContent = d.channel || "—";
    els.rConfidence.textContent = d.confidence;
    els.rRule.textContent = routingRule(d.module);
    els.rSummary.textContent = (d.pricingText ? "Calcul DIGIY : " + d.pricingText + ". " : "") + routingRule(d.module) + ". Brouillon seulement, validation humaine obligatoire.";
    els.result.classList.add("show");
  }
  function prepareCurrent(){
    var text = els.voiceText.value.trim();
    if(!text){ toast("Parle ou écris une action d’abord."); return; }
    var d = buildDraft(text);
    saveDraft(d);
    renderDraft(d);
    toast("Brouillon préparé.");
  }
  function openModule(){
    if(!currentDraft) prepareCurrent();
    if(!currentDraft) return;
    saveDraft(currentDraft);
    location.href = routeWithDraft(currentDraft.routes.primary || currentDraft.route, currentDraft);
  }
  function copyDraft(){
    if(!currentDraft) prepareCurrent();
    if(!currentDraft) return;
    var t = JSON.stringify(currentDraft, null, 2);
    if(navigator.clipboard){ navigator.clipboard.writeText(t).then(function(){ toast("Brouillon copié."); }).catch(function(){ window.prompt("Copie le brouillon :", t); }); }
    else window.prompt("Copie le brouillon :", t);
  }
  function clearAll(){
    try{ if(recognition) recognition.stop(); }catch(_){ }
    listenBuffer = "";
    clearTimeout(prepareTimer);
    els.voiceText.value = "";
    els.result.classList.remove("show");
    currentDraft = null;
    localStorage.removeItem(CONFIG.latestKey);
    setStatus("Prêt", false);
  }
  function cancelDraft(){ currentDraft = null; localStorage.removeItem(CONFIG.latestKey); els.result.classList.remove("show"); }

  function setupSpeech(){
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ els.startBtn.disabled = true; els.startBtn.textContent = "🎙️ Micro non dispo"; return; }
    recognition = new SR();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = function(){ listenBuffer = ""; setStatus("J’écoute...", true); };
    recognition.onresult = function(e){
      var final = "", interim = "";
      for(var i = e.resultIndex; i < e.results.length; i++){
        var tr = e.results[i][0].transcript;
        if(e.results[i].isFinal) final += tr;
        else interim += tr;
      }
      if(final.trim()) listenBuffer = (listenBuffer + " " + final).trim();
      var visible = (listenBuffer + " " + interim).trim();
      if(visible) els.voiceText.value = visible;
      clearTimeout(prepareTimer);
      prepareTimer = setTimeout(function(){ if(els.voiceText.value.trim().length > 3) prepareCurrent(); }, 900);
    };
    recognition.onerror = function(){ setStatus("Micro fragile", false); };
    recognition.onend = function(){ setStatus("Prêt", false); };
  }

  function bind(){
    els.startBtn.addEventListener("click", function(){
      if(!recognition){ toast("Micro non disponible ici."); return; }
      listenBuffer = ""; clearTimeout(prepareTimer); els.voiceText.value = ""; els.result.classList.remove("show"); currentDraft = null;
      try{ recognition.start(); }catch(_){ toast("Micro déjà lancé."); }
    });
    els.stopBtn.addEventListener("click", function(){ try{ if(recognition) recognition.stop(); }catch(_){ } setStatus("Stop", false); });
    els.prepareBtn.addEventListener("click", prepareCurrent);
    els.clearBtn.addEventListener("click", clearAll);
    els.openModuleBtn.addEventListener("click", openModule);
    els.saveDraftBtn.addEventListener("click", function(){ if(!currentDraft) prepareCurrent(); if(currentDraft){ saveDraft(currentDraft); toast("Brouillon gardé."); } });
    els.copyBtn.addEventListener("click", copyDraft);
    els.cancelDraftBtn.addEventListener("click", cancelDraft);
    Array.prototype.forEach.call(document.querySelectorAll("[data-example]"), function(c){
      c.addEventListener("click", function(){
        listenBuffer = "";
        clearTimeout(prepareTimer);
        els.voiceText.value = c.getAttribute("data-example") || "";
        prepareCurrent();
        var v = document.querySelector(".voice");
        if(v) v.scrollIntoView({behavior:"smooth"});
      });
    });
    setupSpeech();
    window.DIGIY_ACTION_PRO = {version:VERSION, config:CONFIG, buildDraft:buildDraft, saveDraft:saveDraft, prepareCurrent:prepareCurrent, currentDraft:function(){return currentDraft;}};
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
