/*
  action-digiy-public-duo-fr-wo.js
  DIGIYLYFE — LA VOIX / Duo Français-Wolof

  Version : 20260709-duo-fr-wo-route-directe-v1

  Rôle :
  - Gérer le micro public.
  - Gérer le mode Français / Wolof / Duo automatique.
  - Comprendre des phrases terrain Wolof simples.
  - Transformer une parole locale en demande exploitable par ROUTE DIRECTE.
  - Ne PAS refaire l’annuaire.
  - Ne PAS ouvrir de cockpit pro.
  - Ne PAS exposer de secret interne.

  À brancher après :
  <script src="./annuaire-public-digiy.js?v=20260709-route-directe-v1"></script>
  <script src="./digiy-voix-annuaire-bridge.js?v=20260709-route-directe-bridge-v1"></script>
  <script src="./action-digiy-public-duo-fr-wo.js?v=20260709-duo-fr-wo-route-directe-v1"></script>
*/

(function () {
  "use strict";

  const VERSION = "20260709-duo-fr-wo-route-directe-v1";

  const DIGIY_CONTACT = "221771342889";
  const LANG_STORAGE_KEY = "digiy_action_public_lang_v2";

  const LISTEN_MAX_MS = 18000;
  const SILENCE_AFTER_RESULT_MS = 5200;

  let currentLang = detectInitialLang();
  let recognition = null;
  let listening = false;
  let hardTimer = null;
  let silenceTimer = null;
  let lastFinalText = "";

  const UI = {
    auto: {
      label: "Duo FR/Wolof",
      hint: "Duo automatique : français + mots terrain Wolof.",
      ready: "Prêt. Écris ou parle ton besoin.",
      listen: "👂 GO",
      listening: "🎙️ J’écoute…",
      listenStatus: "J’écoute… parle tranquillement.",
      listenMore: "Je t’écoute encore… tu peux compléter.",
      voiceOk: "Voix captée. ROUTE DIRECTE cherche les fiches.",
      micClosed: "Micro fermé. Tu peux recommencer ou écrire le besoin.",
      micFragile: "Micro fragile. Tu peux écrire le besoin.",
      micUnavailable: "🎙️ Micro indispo",
      micAlready: "Micro déjà lancé.",
      search: "ROUTE DIRECTE cherche.",
      noText: "Écris ou parle ton besoin d’abord.",
      clear: "Demande effacée.",
      msgPrefix: "Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : ",
      fallbackNeed: "Bonjour, je viens de DIGIY. Je cherche une mise en relation."
    },
    fr: {
      label: "Français",
      hint: "Français devant, mots terrain reconnus derrière.",
      ready: "Prêt. Écris ou parle ton besoin.",
      listen: "👂 GO",
      listening: "🎙️ J’écoute…",
      listenStatus: "J’écoute… parle naturellement.",
      listenMore: "Je t’écoute encore… tu peux compléter.",
      voiceOk: "Voix captée. ROUTE DIRECTE cherche les fiches.",
      micClosed: "Micro fermé. Tu peux recommencer ou écrire le besoin.",
      micFragile: "Micro fragile. Tu peux écrire le besoin.",
      micUnavailable: "🎙️ Micro indispo",
      micAlready: "Micro déjà lancé.",
      search: "ROUTE DIRECTE cherche.",
      noText: "Écris ou parle ton besoin d’abord.",
      clear: "Demande effacée.",
      msgPrefix: "Bonjour, je viens de La Voix du Business DIGIY. Voici mon besoin : ",
      fallbackNeed: "Bonjour, je viens de DIGIY. Je cherche une mise en relation."
    },
    wo: {
      label: "Wolof",
      hint: "Wolof devant, fiches directes derrière.",
      ready: "Jàmm. Bindal walla waxal sa soxla.",
      listen: "👂 GO",
      listening: "🎙️ Maa ngi déglu…",
      listenStatus: "Maa ngi déglu… waxal sa soxla ci lu leer.",
      listenMore: "Maa ngi déglu ba tey… mën nga yokk.",
      voiceOk: "Baax na. ROUTE DIRECTE di seet fiche yi.",
      micClosed: "Micro tëju na. Mën nga dellu wax walla bind.",
      micFragile: "Micro bi dafa doyadi. Mën nga bind sa soxla.",
      micUnavailable: "🎙️ Micro amul",
      micAlready: "Micro bi tàmbali na ba noppi.",
      search: "ROUTE DIRECTE di seet fiche yi.",
      noText: "Bindal walla waxal sa soxla ba pare.",
      clear: "Soxla bi far na.",
      msgPrefix: "Bonjour, je viens de La Voix du Business DIGIY. Sama soxla mooy : ",
      fallbackNeed: "Bonjour, je viens de DIGIY. Dama bëgg mise en relation."
    }
  };

  const WOLOF_EXPANSIONS = [
    {
      match: ["dama wut plombier", "damaa wut plombier", "plombier ci saly", "ndox mi", "robinet bi", "tuyau bi", "dama am fuite"],
      add: "je cherche un plombier à Saly fuite robinet eau plomberie"
    },
    {
      match: ["dama wut macon", "damaa wut macon", "dama wut maçon", "entrepreneur macon", "mur bi", "chantier bi", "defar ker", "defar kër"],
      add: "je cherche un maçon entrepreneur construction rénovation chantier à Saly"
    },
    {
      match: ["dama wut electricien", "damaa wut electricien", "courant bi", "kourant bi", "prise bi", "lamp bi", "panne courant"],
      add: "je cherche un électricien électricité dépannage courant prise lumière à Saly"
    },
    {
      match: ["dama wut solaire", "panneau solaire", "batterie bi", "regulateur bi", "energie solaire"],
      add: "je cherche solaire installation panneau batterie régulateur dépannage Dakar Saly"
    },
    {
      match: ["dama wut chauffeur", "damaa wut chauffeur", "dama begg taxi", "dama bëgg taxi", "yobbu ma", "yóbbu ma", "dem aibd", "dem dakar", "dem saly"],
      add: "je cherche un chauffeur driver taxi transfert AIBD Dakar Saly"
    },
    {
      match: ["dama begg chambre", "dama bëgg chambre", "dama wut chambre", "dama wut logement", "fan laa men a fanaane", "fan laa mën a fanaane", "guddi", "ker bi", "kër bi"],
      add: "je cherche une chambre logement appartement location nuit dormir Saly Petite Côte"
    },
    {
      match: ["dama begg lekk", "dama bëgg lekk", "fan lanuy lekk", "fan lañuy lekk", "table bi", "menu bi", "ceebu jen", "ceebu jën", "yassa", "mafe", "mafé"],
      add: "je veux réserver une table restaurant manger menu ceebu jen yassa Saly"
    },
    {
      match: ["dama begg jend", "dama bëgg jënd", "dama wut produit", "njeg bi", "njëg bi", "boutik bi", "jaay", "jaaykat"],
      add: "je cherche un produit boutique commerce market acheter prix vente"
    },
    {
      match: ["poulet", "poulets", "poulailler", "guinar", "ginaar", "volaille"],
      add: "je cherche poulet poulets volaille vente directe Poulet Tonton 3500 FCFA"
    },
    {
      match: ["dama begg liggeey", "dama bëgg liggéey", "maa ngi wut liggeey", "maa ngi wut liggéey", "job", "mission", "cv bi"],
      add: "je cherche un emploi job mission travail candidat recrutement"
    },
    {
      match: ["dama begg fay", "dama bëgg fay", "yonni ci wave", "yónni ci wave", "preuve bi", "wave bi", "xaalis bi", "fay bi"],
      add: "je veux payer envoyer preuve Wave paiement reçu argent DIGIY PAY"
    },
    {
      match: ["dama begg sortie", "dama bëgg sortie", "dama begg genn", "dama bëgg génn", "fan lanuy dem", "fan lañuy dem", "dem geej", "dem géej"],
      add: "je veux une sortie visite activité tourisme explore Petite Côte"
    },
    {
      match: ["dama begg annonce", "dama bëgg annonce", "dama begg fiche", "dama bëgg fiche", "qr bi", "xibaar bi", "visibilite", "visibilité"],
      add: "je veux publier une annonce fiche QR visibilité réseau DIGIY"
    }
  ];

  const COMMON_TERRAIN_EXPANSIONS = [
    {
      match: ["réparer l'eau", "reparer l eau", "problème d'eau", "probleme d eau"],
      add: "plombier plomberie fuite robinet canalisation"
    },
    {
      match: ["réparer courant", "reparer courant", "pas de courant", "problème électricité", "probleme electricite"],
      add: "électricien électricité dépannage prise tableau"
    },
    {
      match: ["aller aeroport", "aller aéroport", "aller aibd", "chercher aibd", "déposer aibd", "deposer aibd"],
      add: "chauffeur driver taxi transfert AIBD"
    },
    {
      match: ["dormir saly", "où dormir", "ou dormir", "chambre weekend", "chambre week end"],
      add: "logement chambre appartement location Saly"
    },
    {
      match: ["vendre poulet", "acheter poulet", "poulets disponibles", "poulet tonton"],
      add: "poulet poulets volaille vente directe 3500 FCFA Poulet Tonton"
    }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function normLang(value) {
    const v = String(value || "").toLowerCase().trim();

    if (v === "fr" || v.indexOf("fr-") === 0 || v.indexOf("fr_") === 0) return "fr";
    if (v === "wo" || v === "wolof" || v.indexOf("wo-") === 0 || v.indexOf("wo_") === 0) return "wo";
    if (v === "auto" || v === "duo") return "auto";

    return "";
  }

  function detectInitialLang() {
    try {
      const params = new URLSearchParams(location.search || "");
      const urlLang = normLang(params.get("lang") || params.get("l"));
      if (urlLang) return urlLang;
    } catch (_) {}

    try {
      const stored = normLang(localStorage.getItem(LANG_STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}

    try {
      const htmlLang = document.documentElement.getAttribute("lang") || "";
      const dataLang = document.documentElement.getAttribute("data-digiy-lang") || "";
      return normLang(dataLang || htmlLang) || "auto";
    } catch (_) {}

    return "auto";
  }

  function ui(key) {
    const pack = UI[currentLang] || UI.auto;
    return pack[key] || UI.auto[key] || "";
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’‘ʼ`´]/g, "'")
      .replace(/[^a-z0-9#?&=+\s'\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function clean(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasAny(text, words) {
    const n = normalize(text);

    return (words || []).some(function (word) {
      const w = normalize(word);
      return w && n.indexOf(w) >= 0;
    });
  }

  function uniqueAppend(base, extra) {
    const b = clean(base);
    const e = clean(extra);

    if (!e) return b;
    if (!b) return e;

    const nb = normalize(b);
    const ne = normalize(e);

    if (nb.indexOf(ne) >= 0) return b;

    return b + " " + e;
  }

  function expandQuery(text) {
    let original = clean(text);
    let expanded = original;

    if (!original) return "";

    WOLOF_EXPANSIONS.forEach(function (item) {
      if (hasAny(original, item.match)) {
        expanded = uniqueAppend(expanded, item.add);
      }
    });

    COMMON_TERRAIN_EXPANSIONS.forEach(function (item) {
      if (hasAny(original, item.match)) {
        expanded = uniqueAppend(expanded, item.add);
      }
    });

    return expanded;
  }

  function displayOriginalQuery(text) {
    const q = $("q");
    if (!q) return;
    q.value = clean(text);
  }

  function setStatus(icon, label) {
    const status = $("status");
    if (!status) return;

    status.textContent = icon || "•";

    if (label) {
      status.setAttribute("title", label);
      status.setAttribute("aria-label", label);
    }
  }

  function dispatch(name, detail) {
    try {
      document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (_) {}
  }

  function routeDirecte(text, origin, options) {
    const original = clean(text);
    const expanded = expandQuery(original);

    if (!original) {
      setStatus("⚠️", ui("noText"));
      return [];
    }

    setStatus("🔎", ui("search"));

    dispatch("digiy:duo:query", {
      version: VERSION,
      origin: origin || "duo",
      original: original,
      expanded: expanded,
      lang: currentLang
    });

    if (
      window.DIGIY_VOIX_ANNUAIRE_BRIDGE &&
      typeof window.DIGIY_VOIX_ANNUAIRE_BRIDGE.run === "function"
    ) {
      return window.DIGIY_VOIX_ANNUAIRE_BRIDGE.run(expanded, origin || "duo", Object.assign({ force: true }, options || {})) || [];
    }

    if (
      window.DIGIY_ROUTE_DIRECTE &&
      typeof window.DIGIY_ROUTE_DIRECTE.traiterDemande === "function"
    ) {
      return window.DIGIY_ROUTE_DIRECTE.traiterDemande(expanded, Object.assign({ force: true }, options || {})) || [];
    }

    if (
      window.DIGIY_ANNUAIRE_MULTI &&
      typeof window.DIGIY_ANNUAIRE_MULTI.traiterDemande === "function"
    ) {
      return window.DIGIY_ANNUAIRE_MULTI.traiterDemande(expanded, Object.assign({ force: true }, options || {})) || [];
    }

    setStatus("⏳", "ROUTE DIRECTE en attente");

    dispatch("digiy:voice:final", {
      version: VERSION,
      text: expanded,
      original: original,
      lang: currentLang
    });

    return [];
  }

  function waLink(text) {
    return "https://wa.me/" + DIGIY_CONTACT + "?text=" + encodeURIComponent(text);
  }

  function preparedMessage() {
    const q = $("q");
    const text = q && clean(q.value) ? clean(q.value) : ui("fallbackNeed");
    const expanded = expandQuery(text);

    location.href = waLink(ui("msgPrefix") + text + "\n\nRoute DIGIY : " + expanded);
  }

  function ensureDuoStyle() {
    if (document.getElementById("digiy-duo-lang-style")) return;

    const st = document.createElement("style");
    st.id = "digiy-duo-lang-style";

    st.textContent = `
      .duo-langbar{
        display:flex;
        gap:8px;
        align-items:center;
        flex-wrap:wrap;
        margin:0 0 8px;
      }
      .duo-langbar .duo-langbtn{
        border:1px solid rgba(18,60,45,.13);
        background:rgba(255,255,255,.70);
        color:#102f24;
        border-radius:999px;
        padding:8px 12px;
        font-weight:1000;
        cursor:pointer;
        box-shadow:0 8px 18px rgba(18,60,45,.06);
      }
      .duo-langbar .duo-langbtn.isActive{
        background:linear-gradient(135deg,#fff2bf,#f6c453);
        border-color:rgba(246,196,83,.75);
        color:#102f24;
      }
      .duo-langhint{
        color:rgba(16,47,36,.72);
        font-size:12px;
        font-weight:900;
      }
      @media(max-width:520px){
        .duo-langbar{
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          gap:6px;
        }
        .duo-langbar .duo-langbtn{
          width:100%;
          padding:8px 6px;
          font-size:12px;
        }
        .duo-langhint{
          grid-column:1/-1;
          text-align:center;
        }
      }
    `;

    document.head.appendChild(st);
  }

  function ensureDuoLangBar() {
    const q = $("q");

    if (!q || document.getElementById("digiy-duo-langbar")) return;

    ensureDuoStyle();

    const bar = document.createElement("div");
    bar.id = "digiy-duo-langbar";
    bar.className = "duo-langbar";
    bar.setAttribute("aria-label", "Choix langue DIGIY");

    ["auto", "fr", "wo"].forEach(function (lang) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "duo-langbtn";
      btn.setAttribute("data-digiy-lang-choice", lang);
      btn.textContent = UI[lang].label;

      btn.addEventListener("click", function () {
        setLang(lang);
      });

      bar.appendChild(btn);
    });

    const hint = document.createElement("span");
    hint.className = "duo-langhint";
    hint.textContent = ui("hint");
    bar.appendChild(hint);

    q.parentNode.insertBefore(bar, q);

    updateLangUI();
  }

  function updateLangUI() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-digiy-lang-choice]"), function (btn) {
      const active = btn.getAttribute("data-digiy-lang-choice") === currentLang;

      btn.classList.toggle("isActive", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const hint = document.querySelector("#digiy-duo-langbar .duo-langhint");
    if (hint) hint.textContent = ui("hint");

    const manualSelect = $("digiyLang") || $("langMode");
    if (manualSelect && manualSelect.value !== currentLang) {
      manualSelect.value = currentLang;
    }

    const listenBtn = $("listenBtn");
    if (listenBtn && !listening) {
      const span = listenBtn.querySelector("span");

      if (span) span.textContent = "GO";
      else listenBtn.textContent = ui("listen");
    }
  }

  function setLang(lang) {
    currentLang = normLang(lang) || "auto";

    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch (_) {}

    updateLangUI();

    if (!listening) {
      setStatus("•", ui("ready"));
    }

    return currentLang;
  }

  function getLang() {
    return currentLang;
  }

  function speechLang() {
    if (currentLang === "wo") return "fr-SN";
    return "fr-FR";
  }

  function stopTimers() {
    clearTimeout(hardTimer);
    clearTimeout(silenceTimer);
  }

  function setListening(on) {
    listening = !!on;

    const btn = $("listenBtn");
    if (!btn) return;

    btn.classList.toggle("listening", listening);
    btn.classList.toggle("isListening", listening);

    const span = btn.querySelector("span");
    if (span) {
      span.textContent = listening ? "..." : "GO";
    } else {
      btn.textContent = listening ? ui("listening") : ui("listen");
    }
  }

  function stopListen() {
    try {
      if (recognition) recognition.stop();
    } catch (_) {}
  }

  function setupSpeech() {
    const btn = $("listenBtn");
    const q = $("q");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!btn || !q) return;

    if (!SR) {
      btn.setAttribute("aria-label", ui("micUnavailable"));
      setStatus("⚠️", ui("micUnavailable"));
      return;
    }

    recognition = new SR();
    recognition.lang = speechLang();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      setListening(true);
      setStatus("🎙️", ui("listenStatus"));

      stopTimers();

      hardTimer = setTimeout(function () {
        stopListen();
      }, LISTEN_MAX_MS);
    };

    recognition.onresult = function (event) {
      let interim = "";
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        const part = event.results[i][0] && event.results[i][0].transcript
          ? event.results[i][0].transcript
          : "";

        if (event.results[i].isFinal) finalText += part + " ";
        else interim += part + " ";
      }

      const combined = clean((finalText || interim || "").trim());

      if (combined) {
        q.value = combined;
        lastFinalText = combined;

        dispatch("digiy:voice:result", {
          version: VERSION,
          text: expandQuery(combined),
          original: combined,
          lang: currentLang,
          final: !!finalText
        });
      }

      setStatus("🎙️", ui("listenMore"));

      clearTimeout(silenceTimer);

      silenceTimer = setTimeout(function () {
        stopListen();
      }, SILENCE_AFTER_RESULT_MS);
    };

    recognition.onend = function () {
      stopTimers();
      setListening(false);

      const original = clean(q.value || lastFinalText);

      if (original) {
        setStatus("✅", ui("voiceOk"));

        const expanded = expandQuery(original);

        dispatch("digiy:voice:final", {
          version: VERSION,
          text: expanded,
          original: original,
          lang: currentLang
        });

        routeDirecte(original, "speech-final", { force: true });
      } else {
        setStatus("•", ui("micClosed"));
      }
    };

    recognition.onerror = function () {
      stopTimers();
      setListening(false);
      setStatus("⚠️", ui("micFragile"));
    };

    btn.addEventListener("click", function (event) {
      event.preventDefault();

      if (listening) {
        stopListen();
        return;
      }

      try {
        lastFinalText = "";
        recognition.lang = speechLang();
        recognition.start();
      } catch (_) {
        setStatus("⚠️", ui("micAlready"));
      }
    });
  }

  function bindSearchButton() {
    const searchBtn = $("searchBtn");
    const q = $("q");

    if (!searchBtn || !q || searchBtn.dataset.digiyDuoSearchBound === "1") return;

    searchBtn.dataset.digiyDuoSearchBound = "1";

    searchBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const text = clean(q.value);

      if (!text) {
        setStatus("⚠️", ui("noText"));
        return;
      }

      routeDirecte(text, "duo-search-click", { force: true });
    }, true);
  }

  function bindMessageButton() {
    const msgBtn = $("msgBtn");

    if (!msgBtn || msgBtn.dataset.digiyDuoMsgBound === "1") return;

    msgBtn.dataset.digiyDuoMsgBound = "1";

    msgBtn.addEventListener("click", function (event) {
      event.preventDefault();
      preparedMessage();
    });
  }

  function bindClearButton() {
    const clearBtn = $("clearBtn");
    const q = $("q");
    const cards = $("cards");
    const empty = $("empty");

    if (!clearBtn || !q || clearBtn.dataset.digiyDuoClearBound === "1") return;

    clearBtn.dataset.digiyDuoClearBound = "1";

    clearBtn.addEventListener("click", function (event) {
      event.preventDefault();

      q.value = "";
      lastFinalText = "";

      if (cards) {
        cards.innerHTML = '<div class="emptyIcon" aria-hidden="true">👆</div>';
      }

      if (empty) empty.style.display = "none";

      setStatus("•", ui("ready"));
      dispatch("digiy:duo:clear", { version: VERSION });
    });
  }

  function bindQuickButtons() {
    const q = $("q");

    if (!q) return;

    Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function (btn) {
      if (btn.dataset.digiyDuoQuickBound === "1") return;

      btn.dataset.digiyDuoQuickBound = "1";

      btn.addEventListener("click", function (event) {
        const text = clean(btn.getAttribute("data-q") || "");

        if (!text) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        displayOriginalQuery(text);
        routeDirecte(text, "duo-quick-button", { force: true });
      }, true);
    });
  }

  function bindManualLangSelect() {
    const manualSelect = $("digiyLang") || $("langMode");

    if (!manualSelect || manualSelect.dataset.digiyDuoLangBound === "1") return;

    manualSelect.dataset.digiyDuoLangBound = "1";
    manualSelect.value = currentLang;

    manualSelect.addEventListener("change", function () {
      setLang(manualSelect.value);
    });
  }

  function bindInputEnter() {
    const q = $("q");

    if (!q || q.dataset.digiyDuoEnterBound === "1") return;

    q.dataset.digiyDuoEnterBound = "1";

    q.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        routeDirecte(q.value, "duo-enter", { force: true });
      }
    });
  }

  function boot() {
    ensureDuoLangBar();
    bindManualLangSelect();
    bindSearchButton();
    bindMessageButton();
    bindClearButton();
    bindQuickButtons();
    bindInputEnter();
    setupSpeech();

    updateLangUI();
    setStatus("•", ui("ready"));
  }

  window.DIGIY_ACTION_PUBLIC = {
    version: VERSION,
    setLang: setLang,
    getLang: getLang,
    expandQuery: expandQuery,
    routeDirecte: routeDirecte,
    preparedMessage: preparedMessage
  };

  window.DIGIY_DUO_FR_WO = window.DIGIY_ACTION_PUBLIC;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

