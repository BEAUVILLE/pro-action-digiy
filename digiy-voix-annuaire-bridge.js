/*
  digiy-voix-annuaire-bridge.js
  DIGIYLYFE — Pont Voix publique → Annuaire public multi-fiches

  À brancher APRÈS l'annuaire multi :

  <script src="./action-digiy-public-annuaire-multi-final.js?v=20260614-final"></script>
  <script src="./digiy-voix-annuaire-bridge.js?v=20260614-bridge"></script>
*/

(function(){
  "use strict";

  const VERSION = "20260614-voix-annuaire-bridge";
  const MIN_CHARS = 3;
  const DUPLICATE_DELAY = 1400;

  let lastNorm = "";
  let lastAt = 0;
  let pendingText = "";

  function normalize(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function clean(value){
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isUsable(text){
    const t = clean(text);
    if(t.length < MIN_CHARS) return false;

    const n = normalize(t);

    if([
      "go",
      "voir",
      "effacer",
      "ecouter",
      "ecoute",
      "j ecoute",
      "fiches qui remontent"
    ].includes(n)){
      return false;
    }

    return true;
  }

  function readFromDetail(detail){
    if(!detail) return "";

    if(typeof detail === "string") return detail;

    return clean(
      detail.text ||
      detail.texte ||
      detail.transcript ||
      detail.finalTranscript ||
      detail.result ||
      detail.demande ||
      detail.query ||
      detail.message ||
      detail.value ||
      ""
    );
  }

  function readFromElement(el){
    if(!el) return "";

    return clean(
      el.value ||
      el.textContent ||
      el.innerText ||
      ""
    );
  }

  function firstExisting(selectors){
    for(const sel of selectors){
      const el = document.querySelector(sel);
      if(el) return el;
    }
    return null;
  }

  function getVoiceInput(){
    return firstExisting([
      "[data-digiy-voice-input]",
      "[data-digiy-input]",
      "[data-voice-input]",
      "#digiy-input",
      "#digiyInput",
      "#voiceInput",
      "#voiceText",
      "#searchInput",
      "#demandeInput",
      "#demande",
      "#inputVoice",
      "#prompt",
      "textarea",
      "input[type='search']",
      "input[type='text']"
    ]);
  }

  function getTranscriptText(){
    const selectors = [
      "[data-digiy-transcript]",
      "[data-voice-transcript]",
      "[data-digiy-voice-result]",
      "#voiceResult",
      "#voice-result",
      "#transcript",
      "#finalTranscript",
      "#resultText",
      "#actionText",
      ".voice-result",
      ".voiceResult",
      ".transcript",
      ".digiy-transcript"
    ];

    for(const sel of selectors){
      const el = document.querySelector(sel);
      const t = readFromElement(el);
      if(isUsable(t)) return t;
    }

    const input = getVoiceInput();
    const inputText = readFromElement(input);

    if(isUsable(inputText)) return inputText;

    return "";
  }

  function getAnnuaire(){
    return window.DIGIY_ANNUAIRE_MULTI || null;
  }

  function callAnnuaire(text, origin){
    const demande = clean(text);

    if(!isUsable(demande)) return [];

    const norm = normalize(demande);
    const now = Date.now();

    if(norm === lastNorm && now - lastAt < DUPLICATE_DELAY){
      return [];
    }

    lastNorm = norm;
    lastAt = now;
    pendingText = demande;

    const annuaire = getAnnuaire();

    if(!annuaire || typeof annuaire.traiterDemande !== "function"){
      console.warn("[DIGIY] Annuaire multi pas encore disponible. Demande gardée :", demande);
      return [];
    }

    const fiches = annuaire.traiterDemande(demande) || [];

    document.dispatchEvent(new CustomEvent("digiy:annuaire:done", {
      detail: {
        version: VERSION,
        origin: origin || "unknown",
        demande: demande,
        total: fiches.length,
        fiches: fiches
      }
    }));

    return fiches;
  }

  function runFromPage(origin){
    const texte = getTranscriptText();

    if(isUsable(texte)){
      return callAnnuaire(texte, origin || "page");
    }

    return [];
  }

  function bindInput(){
    const input = getVoiceInput();

    if(!input || input.dataset.digiyVoixAnnuaireBound === "1") return;

    input.dataset.digiyVoixAnnuaireBound = "1";

    input.addEventListener("keydown", function(event){
      if(event.key === "Enter" && !event.shiftKey){
        setTimeout(function(){
          callAnnuaire(readFromElement(input), "enter");
        }, 40);
      }
    });

    let timer = null;

    input.addEventListener("input", function(){
      clearTimeout(timer);

      timer = setTimeout(function(){
        callAnnuaire(readFromElement(input), "input-stable");
      }, 650);
    });

    input.addEventListener("change", function(){
      callAnnuaire(readFromElement(input), "change");
    });
  }

  function buttonLooksLikeTrigger(el){
    const txt = normalize(
      el.textContent ||
      el.getAttribute("aria-label") ||
      el.title ||
      ""
    );

    if(!txt) return false;

    return (
      txt === "go" ||
      txt.includes("voir") ||
      txt.includes("chercher") ||
      txt.includes("rechercher") ||
      txt.includes("fiches") ||
      txt.includes("ecoute digiy") ||
      txt.includes("j ecoute")
    );
  }

  function bindButtons(){
    const buttons = Array.from(document.querySelectorAll(
      "[data-digiy-go], [data-digiy-voice-go], [data-voice-go], #digiy-go, #goBtn, #voirBtn, button, a"
    ));

    buttons.forEach(function(btn){
      if(btn.dataset.digiyVoixAnnuaireClickBound === "1") return;

      if(
        !btn.matches("[data-digiy-go], [data-digiy-voice-go], [data-voice-go], #digiy-go, #goBtn, #voirBtn") &&
        !buttonLooksLikeTrigger(btn)
      ){
        return;
      }

      btn.dataset.digiyVoixAnnuaireClickBound = "1";

      btn.addEventListener("click", function(){
        setTimeout(function(){ runFromPage("click-250ms"); }, 250);
        setTimeout(function(){ runFromPage("click-900ms"); }, 900);
        setTimeout(function(){ runFromPage("click-1600ms"); }, 1600);
      });
    });
  }

  function bindVoiceEvents(){
    const events = [
      "digiy:voice",
      "digiy:voice:result",
      "digiy:voice:final",
      "digiy:voice-final",
      "digiy:voice-result",
      "digiy:oreille",
      "digiy:oreille:result",
      "digiy:oreille:final",
      "voice:result",
      "voice:final",
      "speech:result",
      "speech:final"
    ];

    events.forEach(function(eventName){
      const key = "bound_" + eventName.replace(/[^a-z0-9]/gi, "_");

      if(document.documentElement.dataset[key]) return;

      document.addEventListener(eventName, function(event){
        const texte = readFromDetail(event.detail);

        if(isUsable(texte)){
          callAnnuaire(texte, eventName);
        }else{
          setTimeout(function(){
            runFromPage(eventName + ":fallback");
          }, 80);
        }
      });

      document.documentElement.dataset[key] = "1";
    });
  }

  function observeTranscript(){
    const targets = [
      document.querySelector("[data-digiy-transcript]"),
      document.querySelector("[data-voice-transcript]"),
      document.getElementById("voiceResult"),
      document.getElementById("transcript"),
      document.getElementById("finalTranscript"),
      document.getElementById("resultText"),
      document.getElementById("actionText")
    ].filter(Boolean);

    targets.forEach(function(target){
      if(target.dataset.digiyVoixAnnuaireObserved === "1") return;

      target.dataset.digiyVoixAnnuaireObserved = "1";

      let timer = null;

      const obs = new MutationObserver(function(){
        clearTimeout(timer);

        timer = setTimeout(function(){
          callAnnuaire(readFromElement(target), "mutation-transcript");
        }, 500);
      });

      obs.observe(target, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  function retryPending(){
    if(!pendingText) return;

    const annuaire = getAnnuaire();

    if(annuaire && typeof annuaire.traiterDemande === "function"){
      const txt = pendingText;
      pendingText = "";
      callAnnuaire(txt, "pending-ready");
    }
  }

  function bindAll(){
    bindVoiceEvents();
    bindInput();
    bindButtons();
    observeTranscript();
    retryPending();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", bindAll);
  }else{
    bindAll();
  }

  let scanCount = 0;

  const scanner = setInterval(function(){
    bindAll();
    scanCount++;

    if(scanCount >= 20){
      clearInterval(scanner);
    }
  }, 500);

  window.DIGIY_VOIX_ANNUAIRE_BRIDGE = {
    version: VERSION,
    run: callAnnuaire,
    runFromPage: runFromPage,
    getText: getTranscriptText
  };
})();
