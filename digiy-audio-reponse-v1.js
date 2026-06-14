/* =========================================================
   DIGIY AUDIO RÉPONSE V2.1 — PRO ACTION DIGIY
   Version robuste + déverrouillage voix navigateur.

   Objectif :
   - Garder la remontée des fiches existante.
   - Afficher la réponse DIGIY après GO / clic / entrée / mutation.
   - Lire la réponse à voix haute après le vrai clic utilisateur.
   - Garder la doctrine : DIGIY prépare, le pro valide.

   Chargé actuellement par index.html :
   <script src="./digiy-audio-reponse-v1.js?v=20260614-pro-action-reponse-1"></script>
========================================================= */

(function () {
  "use strict";

  let lastDemand = "";
  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let timer = null;
  let userGestureSeen = false;
  let speechUnlocked = false;
  let voicesReady = false;

  function clean(txt) {
    return (txt || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function textOf(el) {
    if (!el) return "";
    return (el.value || el.innerText || el.textContent || "").toString().trim();
  }

  function preloadVoices() {
    if (!("speechSynthesis" in window)) return;

    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) voicesReady = true;

      window.speechSynthesis.onvoiceschanged = function () {
        voicesReady = true;
      };
    } catch (e) {}
  }

  function unlockSpeech() {
    userGestureSeen = true;

    if (speechUnlocked) return;
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const u = new SpeechSynthesisUtterance(" ");
      u.lang = "fr-FR";
      u.volume = 0.01;
      u.rate = 1;
      u.pitch = 1;

      u.onstart = function () {
        speechUnlocked = true;
      };

      u.onend = function () {
        speechUnlocked = true;
      };

      u.onerror = function () {
        speechUnlocked = true;
      };

      window.speechSynthesis.speak(u);
      speechUnlocked = true;
      console.log("DIGIY AUDIO : voix déverrouillée ✅");
    } catch (e) {
      console.warn("DIGIY AUDIO : déverrouillage voix impossible", e);
    }
  }

  function findDemandText() {
    const selectors = [
      "[data-digiy-input]",
      "#digiy-voice-input",
      "#voiceInput",
      "#digiyInput",
      "#searchInput",
      "#search",
      "#q",
      "#query",
      "textarea",
      "input[type='search']",
      "input[type='text']",
      "[contenteditable='true']"
    ];

    for (const sel of selectors) {
      const nodes = Array.from(document.querySelectorAll(sel));
      for (const node of nodes) {
        const txt = textOf(node);
        if (txt && txt.length > 2) {
          lastDemand = txt;
          return txt;
        }
      }
    }

    return lastDemand || "";
  }

  function inferDemandFromPage() {
    const body = clean(document.body ? document.body.innerText : "");

    if (body.includes("driver") || body.includes("chauffeur") || body.includes("aibd")) {
      return "chauffeur";
    }

    if (body.includes("loc") || body.includes("logement") || body.includes("location") || body.includes("chambre")) {
      return "logement";
    }

    if (body.includes("resa") || body.includes("reservation") || body.includes("table")) {
      return "reservation";
    }

    if (body.includes("build") || body.includes("artisan") || body.includes("chantier")) {
      return "artisan";
    }

    if (body.includes("market") || body.includes("boutique") || body.includes("produit")) {
      return "boutique";
    }

    if (body.includes("jobs") || body.includes("emploi") || body.includes("mission")) {
      return "emploi";
    }

    if (body.includes("pay") || body.includes("paiement") || body.includes("argent")) {
      return "pay";
    }

    return "";
  }

  function buildReply(raw) {
    const t = clean(raw);

    if (
      t.includes("chauffeur") ||
      t.includes("driver") ||
      t.includes("taxi") ||
      t.includes("aibd") ||
      t.includes("aeroport") ||
      t.includes("conduis")
    ) {
      return {
        icon: "🚗",
        title: "DRIVER",
        text:
          "J’ai compris : tu cherches un chauffeur. Je remonte la porte DRIVER avec les fiches utiles. Tu peux contacter directement le pro. DIGIY prépare, le client choisit, le terrain garde la main."
      };
    }

    if (
      t.includes("logement") ||
      t.includes("maison") ||
      t.includes("chambre") ||
      t.includes("location") ||
      t.includes("louer") ||
      t.includes("loc") ||
      t.includes("weekend") ||
      t.includes("week end")
    ) {
      return {
        icon: "🏠",
        title: "LOC",
        text:
          "J’ai compris : tu cherches un logement ou une location. Je remonte la porte LOC. Le client voit, le pro valide, la relation reste directe."
      };
    }

    if (
      t.includes("reserver") ||
      t.includes("reservation") ||
      t.includes("table") ||
      t.includes("restaurant") ||
      t.includes("resto")
    ) {
      return {
        icon: "📅",
        title: "RESA",
        text:
          "J’ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY prépare la demande, mais la confirmation reste côté professionnel."
      };
    }

    if (
      t.includes("artisan") ||
      t.includes("plombier") ||
      t.includes("macon") ||
      t.includes("electricien") ||
      t.includes("chantier") ||
      t.includes("service") ||
      t.includes("reparation")
    ) {
      return {
        icon: "🏗️",
        title: "BUILD",
        text:
          "J’ai compris : tu cherches un artisan ou un service terrain. Je remonte la porte BUILD avec les fiches adaptées. Contact direct, pas de détour inutile."
      };
    }

    if (
      t.includes("boutique") ||
      t.includes("produit") ||
      t.includes("acheter") ||
      t.includes("market") ||
      t.includes("commerce")
    ) {
      return {
        icon: "🛍️",
        title: "MARKET",
        text:
          "J’ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce. Le vendeur garde son contact, son argent et sa décision."
      };
    }

    if (
      t.includes("emploi") ||
      t.includes("travail") ||
      t.includes("job") ||
      t.includes("mission")
    ) {
      return {
        icon: "💼",
        title: "JOBS",
        text:
          "J’ai compris : tu cherches du travail ou une mission. Je remonte la porte JOBS. DIGIY aide à organiser la rencontre, sans remplacer l’humain."
      };
    }

    if (
      t.includes("sortie") ||
      t.includes("lieu") ||
      t.includes("visiter") ||
      t.includes("decouvrir") ||
      t.includes("explore") ||
      t.includes("petite cote")
    ) {
      return {
        icon: "📍",
        title: "EXPLORE",
        text:
          "J’ai compris : tu cherches un lieu, une sortie ou une découverte. Je remonte la porte EXPLORE pour ouvrir les bonnes pistes."
      };
    }

    if (
      t.includes("payer") ||
      t.includes("paiement") ||
      t.includes("wave") ||
      t.includes("depense") ||
      t.includes("encaisse") ||
      t.includes("argent") ||
      t.includes("pay") ||
      t.includes("preuve")
    ) {
      return {
        icon: "💳",
        title: "PAY",
        text:
          "J’ai compris : la demande touche à l’argent. Je peux préparer l’action PAY, mais aucune validation ne se fait seule. Le pro vérifie et valide."
      };
    }

    return {
      icon: "👂",
      title: "DEMANDE TERRAIN",
      text:
        "J’ai compris ta demande. Je laisse les fiches remonter et je prépare la bonne orientation. DIGIY écoute, classe et ouvre la voie. Le terrain garde la main."
    };
  }

  function ensureBox() {
    let box = document.getElementById("digiy-audio-reponse-box-v2");

    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box-v2";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");

      box.style.position = "fixed";
      box.style.left = "12px";
      box.style.right = "12px";
      box.style.bottom = "86px";
      box.style.zIndex = "99999";
      box.style.maxWidth = "760px";
      box.style.margin = "0 auto";
      box.style.padding = "16px";
      box.style.borderRadius = "22px";
      box.style.background =
        "linear-gradient(135deg, rgba(10,54,34,.98), rgba(17,84,52,.98))";
      box.style.color = "#fff7df";
      box.style.border = "1px solid rgba(196,151,63,.75)";
      box.style.boxShadow = "0 18px 45px rgba(0,0,0,.35)";
      box.style.fontWeight = "900";
      box.style.lineHeight = "1.45";
      box.style.fontSize = "15px";
      box.style.display = "none";

      document.body.appendChild(box);
    }

    return box;
  }

  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;

    try {
      const voices = window.speechSynthesis.getVoices() || [];
      return (
        voices.find(function (v) {
          return v.lang && v.lang.toLowerCase() === "fr-fr";
        }) ||
        voices.find(function (v) {
          return v.lang && v.lang.toLowerCase().startsWith("fr");
        }) ||
        voices[0] ||
        null
      );
    } catch (e) {
      return null;
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      console.warn("DIGIY AUDIO : speechSynthesis indisponible");
      return;
    }

    const safeText = (text || "").toString().trim();
    if (!safeText) return;

    if (!userGestureSeen) {
      console.warn("DIGIY AUDIO : voix attend un geste utilisateur");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const msg = new SpeechSynthesisUtterance(safeText);
      msg.lang = "fr-FR";
      msg.rate = 0.86;
      msg.pitch = 0.95;
      msg.volume = 1;

      const frVoice = pickFrenchVoice();
      if (frVoice) msg.voice = frVoice;

      msg.onstart = function () {
        console.log("DIGIY AUDIO : voix lancée ✅");
      };

      msg.onend = function () {
        console.log("DIGIY AUDIO : voix terminée ✅");
      };

      msg.onerror = function (e) {
        console.warn("DIGIY AUDIO : erreur voix", e);
      };

      window.speechSynthesis.speak(msg);

      /* Certains navigateurs se mettent en pause sans raison : petit rappel propre. */
      window.setTimeout(function () {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        } catch (e) {}
      }, 250);
    } catch (e) {
      console.warn("DIGIY AUDIO : impossible de parler", e);
    }
  }

  function answerNow(reason) {
    let demand = findDemandText();

    if (!demand) {
      demand = inferDemandFromPage();
    }

    if (!demand) return;

    const reply = buildReply(demand);
    const key = reply.title + "::" + clean(demand);
    const now = Date.now();

    if (key === lastAnswerKey && now - lastAnswerAt < 4000) {
      return;
    }

    lastAnswerKey = key;
    lastAnswerAt = now;

    const box = ensureBox();

    box.innerHTML =
      "<div style='font-size:22px;margin-bottom:6px'>" +
      reply.icon +
      " " +
      reply.title +
      "</div>" +
      "<div>" +
      reply.text +
      "</div>";

    box.style.display = "block";

    speak(reply.text);
  }

  function scheduleAnswer(reason, delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      answerNow(reason);
    }, delay || 800);
  }

  function bindInputs() {
    document.addEventListener(
      "input",
      function (e) {
        const target = e.target;
        if (!target) return;

        const tag = (target.tagName || "").toLowerCase();
        const editable = target.getAttribute("contenteditable") === "true";

        if (
          tag === "textarea" ||
          tag === "input" ||
          editable ||
          target.matches("[data-digiy-input]")
        ) {
          const txt = textOf(target);
          if (txt && txt.length > 2) {
            lastDemand = txt;
          }
        }
      },
      true
    );
  }

  function bindClicks() {
    ["pointerdown", "click", "pointerup", "touchstart", "touchend"].forEach(function (eventName) {
      document.addEventListener(
        eventName,
        function () {
          unlockSpeech();
          scheduleAnswer(eventName, 900);
        },
        true
      );
    });

    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Enter") {
          unlockSpeech();
          scheduleAnswer("enter", 500);
        }
      },
      true
    );
  }

  function observeResults() {
    if (!document.body || !("MutationObserver" in window)) return;

    const observer = new MutationObserver(function (mutations) {
      let changed = false;

      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          changed = true;
          break;
        }
      }

      if (changed) {
        const body = clean(document.body.innerText || "");

        if (
          body.includes("fiches qui remontent") ||
          body.includes("driver") ||
          body.includes("loc") ||
          body.includes("resa") ||
          body.includes("build") ||
          body.includes("market") ||
          body.includes("jobs") ||
          body.includes("pay") ||
          body.includes("chambre") ||
          body.includes("chauffeur")
        ) {
          scheduleAnswer("mutation", 650);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function exposeApi() {
    window.DIGIY_AUDIO_REPONSE_V2 = {
      answer: answerNow,
      speak: speak,
      unlockSpeech: unlockSpeech,
      buildReply: buildReply
    };
  }

  function boot() {
    document.documentElement.setAttribute("data-digiy-audio-reponse-v2", "voice-unlock");

    preloadVoices();
    bindInputs();
    bindClicks();
    observeResults();
    exposeApi();

    console.log("DIGIY AUDIO RÉPONSE V2.1 chargé ✅");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
