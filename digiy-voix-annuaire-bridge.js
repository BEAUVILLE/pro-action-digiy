/*
  digiy-voix-annuaire-bridge.js
  DIGIYLYFE — Pont LA VOIX → L'OREILLE → ROUTE DIRECTE

  Version : 20260709-route-directe-bridge-v1

  Rôle :
  - Capte une demande écrite, vocale ou issue d’un bouton rapide.
  - Appelle l’annuaire public / ROUTE DIRECTE.
  - Évite les doubles déclenchements.
  - Garde LA VOIX simple côté public.

  À brancher APRÈS annuaire-public-digiy.js :

  <script src="./annuaire-public-digiy.js?v=20260709-route-directe-v1"></script>
  <script src="./digiy-voix-annuaire-bridge.js?v=20260709-route-directe-bridge-v1"></script>
*/

(function () {
  "use strict";

  const VERSION = "20260709-route-directe-bridge-v1";
  const MIN_CHARS = 3;
  const DUPLICATE_DELAY = 900;
  const PENDING_RETRY_MS = 500;
  const PENDING_RETRY_MAX = 24;

  let lastNorm = "";
  let lastAt = 0;
  let pendingText = "";
  let retryCount = 0;
  let scanCount = 0;

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function clean(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isUsable(text) {
    const t = clean(text);
    if (t.length < MIN_CHARS) return false;

    const n = normalize(t);

    const blocked = [
      "go",
      "voir",
      "see",
      "clear",
      "effacer",
      "ecouter",
      "ecoute",
      "j ecoute",
      "fiches qui remontent",
      "cards that appear",
      "resultats directs",
      "direct results"
    ];

    return !blocked.includes(n);
  }

  function setStatus(icon, label) {
    const status = document.getElementById("status");
    if (!status) return;

    status.textContent = icon || "•";
    if (label) status.setAttribute("title", label);
    if (label) status.setAttribute("aria-label", label);
  }

  function readFromDetail(detail) {
    if (!detail) return "";
    if (typeof detail === "string") return clean(detail);

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
      detail.phrase ||
      ""
    );
  }

  function readFromElement(el) {
    if (!el) return "";

    return clean(
      el.value ||
      el.textContent ||
      el.innerText ||
      ""
    );
  }

  function firstExisting(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function getVoiceInput() {
    return firstExisting([
      "[data-digiy-voice-input]",
      "[data-digiy-input]",
      "[data-voice-input]",
      "#q",
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

  function getTranscriptText() {
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

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      const t = readFromElement(el);
      if (isUsable(t)) return t;
    }

    const input = getVoiceInput();
    const inputText = readFromElement(input);

    if (isUsable(inputText)) return inputText;

    return "";
  }

  function getRouteDirecte() {
    return (
      window.DIGIY_ROUTE_DIRECTE ||
      window.DIGIY_ANNUAIRE_MULTI ||
      null
    );
  }

  function dispatch(name, detail) {
    try {
      document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (_) {}
  }

  function callRouteDirecte(text, origin, options) {
    const demande = clean(text);

    if (!isUsable(demande)) return [];

    const norm = normalize(demande);
    const now = Date.now();
    const force = options && options.force === true;

    if (!force && norm === lastNorm && now - lastAt < DUPLICATE_DELAY) {
      return [];
    }

    lastNorm = norm;
    lastAt = now;
    pendingText = demande;

    const route = getRouteDirecte();

    if (!route) {
      setStatus("⏳", "ROUTE DIRECTE en attente");
      console.warn("[DIGIY] ROUTE DIRECTE pas encore disponible. Demande gardée :", demande);

      dispatch("digiy:route-directe:pending", {
        version: VERSION,
        origin: origin || "unknown",
        demande: demande
      });

      return [];
    }

    let fiches = [];

    try {
      setStatus("🔎", "ROUTE DIRECTE cherche");

      if (typeof route.traiterDemande === "function") {
        fiches = route.traiterDemande(demande, options || {}) || [];
      } else if (typeof route.chercherFiches === "function") {
        fiches = route.chercherFiches(demande, options || {}) || [];

        if (typeof route.afficherFiches === "function") {
          route.afficherFiches(fiches, demande);
        }
      } else {
        console.warn("[DIGIY] ROUTE DIRECTE trouvée, mais aucune fonction exploitable.");
        setStatus("⚠️", "ROUTE DIRECTE non exploitable");
        return [];
      }

      pendingText = "";
      setStatus(fiches.length ? "✅" : "🔎", fiches.length ? "Fiches trouvées" : "Route comprise");

      dispatch("digiy:route-directe:done", {
        version: VERSION,
        origin: origin || "unknown",
        demande: demande,
        total: fiches.length,
        fiches: fiches
      });

      maybeScrollResults();

      return fiches;
    } catch (err) {
      console.warn("[DIGIY] Erreur ROUTE DIRECTE :", err);

      setStatus("⚠️", "Erreur ROUTE DIRECTE");

      dispatch("digiy:route-directe:error", {
        version: VERSION,
        origin: origin || "unknown",
        demande: demande,
        error: String(err && err.message ? err.message : err)
      });

      return [];
    }
  }

  function maybeScrollResults() {
    const cards = document.getElementById("cards");
    const results = document.querySelector(".results") || document.getElementById("digiy-results");

    if (!results && !cards) return;

    const target = results || cards;

    setTimeout(function () {
      try {
        target.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      } catch (_) {}
    }, 80);
  }

  function runFromPage(origin, options) {
    const texte = getTranscriptText();

    if (isUsable(texte)) {
      return callRouteDirecte(texte, origin || "page", options || {});
    }

    return [];
  }

  function bindInput() {
    const input = getVoiceInput();

    if (!input || input.dataset.digiyVoixAnnuaireBound === "1") return;

    input.dataset.digiyVoixAnnuaireBound = "1";

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        setTimeout(function () {
          callRouteDirecte(readFromElement(input), "enter", { force: true });
        }, 30);
      }
    });

    input.addEventListener("change", function () {
      callRouteDirecte(readFromElement(input), "change");
    });

    /*
      On ne déclenche pas automatiquement à chaque frappe par défaut.
      Sur le terrain, le client peut hésiter, corriger, écrire lentement.
      Si une page veut l’autorecherche, elle peut ajouter :
      data-digiy-autosearch="true"
    */
    if (input.getAttribute("data-digiy-autosearch") === "true") {
      let timer = null;

      input.addEventListener("input", function () {
        clearTimeout(timer);

        timer = setTimeout(function () {
          callRouteDirecte(readFromElement(input), "input-stable");
        }, 700);
      });
    }
  }

  function buttonText(el) {
    return normalize(
      el.textContent ||
      el.getAttribute("aria-label") ||
      el.title ||
      ""
    );
  }

  function buttonLooksLikeSearch(el) {
    const txt = buttonText(el);
    if (!txt) return false;

    return (
      txt === "go" ||
      txt === "voir" ||
      txt === "see" ||
      txt.includes("voir les fiches") ||
      txt.includes("see the cards") ||
      txt.includes("chercher") ||
      txt.includes("rechercher") ||
      txt.includes("fiches")
    );
  }

  function buttonLooksLikeVoice(el) {
    const txt = buttonText(el);
    if (!txt) return false;

    return (
      txt.includes("parler") ||
      txt.includes("speak") ||
      txt.includes("ecoute") ||
      txt.includes("j ecoute") ||
      txt.includes("micro") ||
      txt.includes("voice")
    );
  }

  function bindSearchButtons() {
    const buttons = Array.from(document.querySelectorAll(
      "[data-digiy-go], [data-digiy-search], [data-digiy-route], #searchBtn, #voirBtn, #digiy-go, #goBtn, button, a"
    ));

    buttons.forEach(function (btn) {
      if (!btn || btn.dataset.digiyVoixAnnuaireClickBound === "1") return;

      const explicit = btn.matches(
        "[data-digiy-go], [data-digiy-search], [data-digiy-route], #searchBtn, #voirBtn, #digiy-go, #goBtn"
      );

      if (!explicit && !buttonLooksLikeSearch(btn)) return;

      btn.dataset.digiyVoixAnnuaireClickBound = "1";

      btn.addEventListener("click", function () {
        setTimeout(function () {
          runFromPage("search-click", { force: true });
        }, 120);
      });
    });
  }

  function bindVoiceButtons() {
    const buttons = Array.from(document.querySelectorAll(
      "[data-digiy-voice-go], [data-voice-go], #listenBtn, button"
    ));

    buttons.forEach(function (btn) {
      if (!btn || btn.dataset.digiyVoixAnnuaireVoiceBound === "1") return;

      const explicit = btn.matches("[data-digiy-voice-go], [data-voice-go], #listenBtn");

      if (!explicit && !buttonLooksLikeVoice(btn)) return;

      btn.dataset.digiyVoixAnnuaireVoiceBound = "1";

      btn.addEventListener("click", function () {
        /*
          Après clic micro, certains navigateurs mettent du temps à poser le texte.
          On tente plusieurs lectures propres, sans forcer les doublons.
        */
        setTimeout(function () { runFromPage("voice-click-400ms"); }, 400);
        setTimeout(function () { runFromPage("voice-click-1100ms"); }, 1100);
        setTimeout(function () { runFromPage("voice-click-2000ms"); }, 2000);
      });
    });
  }

  function bindQuickButtons() {
    const buttons = Array.from(document.querySelectorAll(
      "[data-q], .chip, .examplePhrase"
    ));

    buttons.forEach(function (btn) {
      if (!btn || btn.dataset.digiyVoixAnnuaireQuickBound === "1") return;

      btn.dataset.digiyVoixAnnuaireQuickBound = "1";

      btn.addEventListener("click", function () {
        setTimeout(function () {
          const input = getVoiceInput();
          const fromInput = readFromElement(input);
          const fromData = clean(btn.getAttribute("data-q") || "");

          callRouteDirecte(fromInput || fromData, "quick-button", { force: true });
        }, 140);
      });
    });
  }

  function bindVoiceEvents() {
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
      "speech:final",
      "digiy:transcript",
      "digiy:transcript:final"
    ];

    events.forEach(function (eventName) {
      const key = "digiyBridgeBound_" + eventName.replace(/[^a-z0-9]/gi, "_");

      if (document.documentElement.dataset[key] === "1") return;

      document.addEventListener(eventName, function (event) {
        const texte = readFromDetail(event.detail);

        if (isUsable(texte)) {
          callRouteDirecte(texte, eventName, { force: true });
        } else {
          setTimeout(function () {
            runFromPage(eventName + ":fallback");
          }, 90);
        }
      });

      document.documentElement.dataset[key] = "1";
    });
  }

  function observeTranscript() {
    const targets = [
      document.querySelector("[data-digiy-transcript]"),
      document.querySelector("[data-voice-transcript]"),
      document.querySelector("[data-digiy-voice-result]"),
      document.getElementById("voiceResult"),
      document.getElementById("transcript"),
      document.getElementById("finalTranscript"),
      document.getElementById("resultText"),
      document.getElementById("actionText")
    ].filter(Boolean);

    targets.forEach(function (target) {
      if (!target || target.dataset.digiyVoixAnnuaireObserved === "1") return;

      target.dataset.digiyVoixAnnuaireObserved = "1";

      let timer = null;

      const obs = new MutationObserver(function () {
        clearTimeout(timer);

        timer = setTimeout(function () {
          callRouteDirecte(readFromElement(target), "mutation-transcript");
        }, 500);
      });

      obs.observe(target, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  function retryPending() {
    if (!pendingText) return;

    const route = getRouteDirecte();

    if (route && (typeof route.traiterDemande === "function" || typeof route.chercherFiches === "function")) {
      const txt = pendingText;
      pendingText = "";

      callRouteDirecte(txt, "pending-ready", { force: true });
    }
  }

  function bindAll() {
    bindVoiceEvents();
    bindInput();
    bindSearchButtons();
    bindVoiceButtons();
    bindQuickButtons();
    observeTranscript();
    retryPending();
  }

  function boot() {
    bindAll();

    const scanner = setInterval(function () {
      bindAll();
      scanCount++;

      if (scanCount >= 20) {
        clearInterval(scanner);
      }
    }, 500);

    const pendingScanner = setInterval(function () {
      retryPending();
      retryCount++;

      if (!pendingText || retryCount >= PENDING_RETRY_MAX) {
        clearInterval(pendingScanner);
      }
    }, PENDING_RETRY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.DIGIY_VOIX_ANNUAIRE_BRIDGE = {
    version: VERSION,
    run: callRouteDirecte,
    runFromPage: runFromPage,
    getText: getTranscriptText,
    getRoute: getRouteDirecte,
    bindAll: bindAll
  };
})();
