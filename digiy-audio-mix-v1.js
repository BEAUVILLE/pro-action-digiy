/* =========================================================
   DIGIY AUDIO MIX V1 — HUB
   Lecteur + Oreille + Assistant + Moteur d’intention unique

   Doctrine :
   - La voix lit.
   - L’oreille écoute.
   - L’assistant prépare.
   - Le pro valide.
   - PAY / argent / suppression / validation = jamais automatique.

   Installation :
   1) Placer ce fichier à côté de index.html
   2) Ajouter avant </body> :
      <script src="./digiy-audio-mix-v1.js?v=20260614-hub-1"></script>
========================================================= */

(function () {
  "use strict";

  const DIGIY_AUDIO = {
    lang: "fr-FR",
    rate: 0.86,
    pitch: 0.95,
    speaking: false,
    listening: false,
    recognition: null
  };

  /* Routes HUB — adapte seulement si tes fichiers ont un autre nom */
  const DIGIY_ROUTES = {
    accueil: "./index.html",
    hub: "./index.html",
    pay: "./pay.html",
    driver: "./driver.html",
    loc: "./loc.html",
    resa: "./resa.html",
    market: "./market.html",
    jobs: "./jobs.html",
    build: "./build.html",
    explore: "./explore.html",
    commerce: "./mon-commerce.html",
    qr: "./qr.html"
  };

  function clean(txt) {
    return (txt || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function getPageText() {
    const main =
      $("[data-digiy-read]") ||
      $("main") ||
      $(".page") ||
      $(".container") ||
      document.body;

    const raw = (main && main.innerText ? main.innerText : "")
      .replace(/\s+/g, " ")
      .trim();

    return raw.slice(0, 1400);
  }

  function ensureAssistantBox() {
    let box = document.getElementById("digiy-audio-assistant");

    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-assistant";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");

      box.style.position = "fixed";
      box.style.left = "14px";
      box.style.right = "14px";
      box.style.bottom = "92px";
      box.style.zIndex = "9999";
      box.style.padding = "14px 16px";
      box.style.borderRadius = "20px";
      box.style.background = "rgba(10, 40, 25, 0.95)";
      box.style.color = "#fff7df";
      box.style.border = "1px solid rgba(196,151,63,0.62)";
      box.style.boxShadow = "0 18px 42px rgba(0,0,0,0.38)";
      box.style.fontWeight = "800";
      box.style.fontSize = "15px";
      box.style.lineHeight = "1.35";
      box.style.backdropFilter = "blur(10px)";
      box.style.webkitBackdropFilter = "blur(10px)";
      box.style.display = "none";

      document.body.appendChild(box);
    }

    return box;
  }

  function showAssistant(text) {
    const box = ensureAssistantBox();
    box.textContent = "🎧 DIGIY AUDIO · " + text;
    box.style.display = "block";
  }

  function hideAssistantSoon() {
    const box = document.getElementById("digiy-audio-assistant");
    if (!box) return;

    window.clearTimeout(box._digiyTimer);
    box._digiyTimer = window.setTimeout(function () {
      if (!DIGIY_AUDIO.speaking && !DIGIY_AUDIO.listening) {
        box.style.display = "none";
      }
    }, 7000);
  }

  function stopSpeak() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    DIGIY_AUDIO.speaking = false;
  }

  function stopListen() {
    try {
      if (DIGIY_AUDIO.recognition) {
        DIGIY_AUDIO.recognition.stop();
      }
    } catch (e) {}

    DIGIY_AUDIO.listening = false;
  }

  function speak(text) {
    const safeText = (text || "").toString().trim();

    if (!safeText) return;

    if (!("speechSynthesis" in window)) {
      showAssistant("Lecteur vocal non disponible sur ce navigateur.");
      hideAssistantSoon();
      return;
    }

    /* Sécurité : quand DIGIY parle, le micro se coupe */
    stopListen();
    stopSpeak();

    const msg = new SpeechSynthesisUtterance(safeText);
    msg.lang = DIGIY_AUDIO.lang;
    msg.rate = DIGIY_AUDIO.rate;
    msg.pitch = DIGIY_AUDIO.pitch;

    msg.onstart = function () {
      DIGIY_AUDIO.speaking = true;
    };

    msg.onend = function () {
      DIGIY_AUDIO.speaking = false;
      hideAssistantSoon();
    };

    msg.onerror = function () {
      DIGIY_AUDIO.speaking = false;
      showAssistant("La lecture audio a été interrompue.");
      hideAssistantSoon();
    };

    window.speechSynthesis.speak(msg);
  }

  function readPage() {
    const text = getPageText();

    if (!text) {
      showAssistant("Je ne trouve pas de texte clair à lire sur cette page.");
      speak("Je ne trouve pas de texte clair à lire sur cette page.");
      return;
    }

    showAssistant("Lecture de la page.");
    speak(text);
  }

  function navigateTo(url) {
    if (!url) {
      showAssistant("La route n’est pas encore branchée.");
      speak("La route n’est pas encore branchée.");
      return;
    }

    window.location.href = url;
  }

  function prepareAction(label, callback, sensitive) {
    showAssistant(
      sensitive
        ? "Action préparée : " + label + ". Validation humaine nécessaire."
        : "Action comprise : " + label + "."
    );

    speak(
      sensitive
        ? "J’ai compris. Je prépare l’action, mais le pro doit valider."
        : "J’ai compris. J’ouvre la bonne porte."
    );

    if (!sensitive && typeof callback === "function") {
      window.setTimeout(callback, 950);
    }
  }

  function isMoneyIntent(t) {
    return (
      t.includes("depense") ||
      t.includes("encaisse") ||
      t.includes("encaisser") ||
      t.includes("paiement") ||
      t.includes("paye") ||
      t.includes("payer") ||
      t.includes("wave") ||
      t.includes("orange money") ||
      t.includes("om") ||
      t.includes("free money") ||
      t.includes("gasoil") ||
      t.includes("carburant") ||
      t.includes("dette") ||
      t.includes("credit") ||
      t.includes("facture")
    );
  }

  function isDeleteOrRiskIntent(t) {
    return (
      t.includes("supprime") ||
      t.includes("efface") ||
      t.includes("delete") ||
      t.includes("vider") ||
      t.includes("annule") ||
      t.includes("annuler") ||
      t.includes("valide paiement") ||
      t.includes("valider paiement")
    );
  }

  function routeIntent(rawText) {
    const heard = (rawText || "").toString().trim();
    const t = clean(heard);

    if (!t) return;

    showAssistant("J’ai entendu : “" + heard + "”");

    /* Stop immédiat */
    if (
      t === "stop" ||
      t.includes("digiy stop") ||
      t.includes("arrete") ||
      t.includes("silence")
    ) {
      stopSpeak();
      stopListen();
      showAssistant("Arrêt demandé.");
      hideAssistantSoon();
      return;
    }

    /* Lecture */
    if (
      t.includes("lis la page") ||
      t.includes("lire la page") ||
      t.includes("ecoute la page") ||
      t.includes("lecture")
    ) {
      showAssistant("Très bien. Je lis la page.");
      speak("Très bien. Je lis la page.");
      window.setTimeout(readPage, 650);
      return;
    }

    /* Sécurité : argent et actions risquées */
    if (isMoneyIntent(t)) {
      prepareAction("mouvement PAY à préparer", null, true);
      return;
    }

    if (isDeleteOrRiskIntent(t)) {
      prepareAction("action sensible à vérifier", null, true);
      return;
    }

    /* Routes principales HUB */
    if (
      t.includes("ouvre pay") ||
      t.includes("mon argent") ||
      t.includes("porte pay")
    ) {
      prepareAction("ouvrir PAY", function () {
        navigateTo(DIGIY_ROUTES.pay);
      });
      return;
    }

    if (
      t.includes("ouvre driver") ||
      t.includes("je conduis") ||
      t.includes("chauffeur") ||
      t.includes("conduire")
    ) {
      prepareAction("ouvrir DRIVER", function () {
        navigateTo(DIGIY_ROUTES.driver);
      });
      return;
    }

    if (
      t.includes("ouvre loc") ||
      t.includes("je loue") ||
      t.includes("location") ||
      t.includes("logement")
    ) {
      prepareAction("ouvrir LOC", function () {
        navigateTo(DIGIY_ROUTES.loc);
      });
      return;
    }

    if (
      t.includes("ouvre resa") ||
      t.includes("je reserve") ||
      t.includes("reservation") ||
      t.includes("restaurant") ||
      t.includes("table")
    ) {
      prepareAction("préparer une réservation", null, true);
      return;
    }

    if (
      t.includes("ouvre market") ||
      t.includes("je vends") ||
      t.includes("boutique") ||
      t.includes("produit")
    ) {
      prepareAction("ouvrir MARKET", function () {
        navigateTo(DIGIY_ROUTES.market);
      });
      return;
    }

    if (
      t.includes("ouvre jobs") ||
      t.includes("travail") ||
      t.includes("emploi") ||
      t.includes("mission")
    ) {
      prepareAction("ouvrir JOBS", function () {
        navigateTo(DIGIY_ROUTES.jobs);
      });
      return;
    }

    if (
      t.includes("ouvre build") ||
      t.includes("artisan") ||
      t.includes("service") ||
      t.includes("chantier") ||
      t.includes("metier")
    ) {
      prepareAction("ouvrir BUILD", function () {
        navigateTo(DIGIY_ROUTES.build);
      });
      return;
    }

    if (
      t.includes("ouvre explore") ||
      t.includes("sortie") ||
      t.includes("lieu") ||
      t.includes("decouvrir") ||
      t.includes("tourisme")
    ) {
      prepareAction("ouvrir EXPLORE", function () {
        navigateTo(DIGIY_ROUTES.explore);
      });
      return;
    }

    if (
      t.includes("mon commerce") ||
      t.includes("caisse") ||
      t.includes("pos")
    ) {
      prepareAction("ouvrir Mon Commerce", function () {
        navigateTo(DIGIY_ROUTES.commerce);
      });
      return;
    }

    if (
      t.includes("qr") ||
      t.includes("fiche") ||
      t.includes("carte")
    ) {
      prepareAction("fiche ou QR à préparer", null, true);
      return;
    }

    if (
      t.includes("accueil") ||
      t.includes("retour") ||
      t.includes("ouvre hub") ||
      t.includes("menu")
    ) {
      prepareAction("retour au HUB", function () {
        navigateTo(DIGIY_ROUTES.hub);
      });
      return;
    }

    /* Parole normale = note terrain */
    showAssistant("Demande terrain gardée : “" + heard + "”");
    speak("J’ai compris. Je garde cela comme demande terrain.");
  }

  function startListen() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showAssistant("La reconnaissance vocale n’est pas disponible sur ce navigateur.");
      speak("La reconnaissance vocale n’est pas disponible ici.");
      return;
    }

    stopSpeak();

    let rec;

    try {
      rec = new SpeechRecognition();
    } catch (e) {
      showAssistant("Impossible d’ouvrir le micro sur ce navigateur.");
      return;
    }

    DIGIY_AUDIO.recognition = rec;

    rec.lang = DIGIY_AUDIO.lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = function () {
      DIGIY_AUDIO.listening = true;
      showAssistant("J’écoute...");
    };

    rec.onresult = function (event) {
      let text = "";

      try {
        text = event.results[0][0].transcript;
      } catch (e) {
        text = "";
      }

      DIGIY_AUDIO.listening = false;

      if (text) {
        routeIntent(text);
      } else {
        showAssistant("Je n’ai pas bien entendu. Réessaie doucement.");
        hideAssistantSoon();
      }
    };

    rec.onerror = function (event) {
      DIGIY_AUDIO.listening = false;

      const error = event && event.error ? event.error : "audio";
      if (error === "not-allowed") {
        showAssistant("Micro bloqué. Autorise le micro dans le navigateur.");
      } else {
        showAssistant("Je n’ai pas bien entendu. Réessaie doucement.");
      }

      hideAssistantSoon();
    };

    rec.onend = function () {
      DIGIY_AUDIO.listening = false;
      hideAssistantSoon();
    };

    try {
      rec.start();
    } catch (e) {
      DIGIY_AUDIO.listening = false;
      showAssistant("Le micro est déjà actif ou non disponible.");
      hideAssistantSoon();
    }
  }

  function makeButton(label, action) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.setAttribute("data-digiy-audio", action);

    btn.style.border = "0";
    btn.style.borderRadius = "999px";
    btn.style.padding = "13px 10px";
    btn.style.fontWeight = "1000";
    btn.style.fontSize = "14px";
    btn.style.background = "linear-gradient(135deg,#c4973f,#f2d27a)";
    btn.style.color = "#12351f";
    btn.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
    btn.style.cursor = "pointer";

    return btn;
  }

  function installControls() {
    if (document.getElementById("digiy-audio-controls")) return;

    const bar = document.createElement("div");
    bar.id = "digiy-audio-controls";
    bar.style.position = "fixed";
    bar.style.left = "12px";
    bar.style.right = "12px";
    bar.style.bottom = "14px";
    bar.style.zIndex = "10000";
    bar.style.display = "grid";
    bar.style.gridTemplateColumns = "1fr 1fr 1fr";
    bar.style.gap = "8px";
    bar.style.maxWidth = "720px";
    bar.style.margin = "0 auto";

    bar.appendChild(makeButton("👂 Écouter", "listen"));
    bar.appendChild(makeButton("🎧 Lire", "read"));
    bar.appendChild(makeButton("■ Stop", "stop"));

    document.body.appendChild(bar);

    bar.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-digiy-audio");

      if (action === "listen") startListen();
      if (action === "read") readPage();
      if (action === "stop") {
        stopSpeak();
        stopListen();
        showAssistant("Arrêt demandé.");
        hideAssistantSoon();
      }
    });
  }

 function removeFloatingControls() {
  const oldBar = document.getElementById("digiy-audio-controls");
  if (oldBar) oldBar.remove();
}

function getDemandText() {
  const field =
    document.querySelector("[data-digiy-input]") ||
    document.querySelector("#digiy-voice-input") ||
    document.querySelector("#voiceInput") ||
    document.querySelector("#digiyInput") ||
    document.querySelector("textarea") ||
    document.querySelector("input[placeholder*='Parler']") ||
    document.querySelector("input[placeholder*='dicter']") ||
    document.querySelector("input[type='text']");

  return field && field.value ? field.value.trim() : "";
}

function bindExistingProActionControls() {
  if (window.__DIGIY_AUDIO_PRO_ACTION_BOUND__) return;
  window.__DIGIY_AUDIO_PRO_ACTION_BOUND__ = true;

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("button, a, [role='button']");
    if (!btn) return;

    const label = (btn.innerText || btn.textContent || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!label) return;

    if (label.includes("ecouter") || label.includes("j ecoute") || label.includes("🎙")) {
      e.preventDefault();
      startListen();
      return;
    }

    if (label === "go" || label.includes("go")) {
      const text = getDemandText();

      if (text) {
        e.preventDefault();
        routeIntent(text);
      }

      return;
    }

    if (label.includes("lire") || label.includes("audio") || label.includes("🎧")) {
      e.preventDefault();
      readPage();
      return;
    }

    if (label.includes("stop") || label.includes("arreter") || label.includes("■")) {
      e.preventDefault();
      stopSpeak();
      stopListen();
      showAssistant("Arrêt demandé.");
      hideAssistantSoon();
      return;
    }
  });
}

function boot() {
  removeFloatingControls();
  bindExistingProActionControls();

  window.DIGIY_AUDIO_MIX = {
    speak: speak,
    listen: startListen,
    read: readPage,
    stop: function () {
      stopSpeak();
      stopListen();
      showAssistant("Arrêt demandé.");
      hideAssistantSoon();
    },
    routeIntent: routeIntent,
    routes: DIGIY_ROUTES
  };
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
