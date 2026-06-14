/* =========================================================
   DIGIY AUDIO RÉPONSE V2.2 — PRO ACTION DIGIY
   Fix voix navigateur : déverrouillage garanti au 1er geste.
   
   CHANGEMENTS v2.2 :
   - Hook direct sur #listenBtn, #searchBtn, .chip, .examplePhrase
     → parle immédiatement après le résultat sans attendre MutationObserver.
   - MutationObserver allégé : surveille uniquement #cards (résultats réels).
   - unlockSpeech() appelé en premier sur tout clic utilisateur.
   - answerFromQuery() lit le champ #q directement — source de vérité fiable.

   Chargé par index.html :
   <script src="./digiy-audio-reponse-v1.js?v=20260614-v2-2"></script>
========================================================= */

(function () {
  "use strict";

  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let speechUnlocked = false;
  let userGestureSeen = false;

  /* ── Utilitaires texte ── */
  function clean(txt) {
    return (txt || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ── Déverrouillage voix navigateur ──
     Doit être appelé dans le handler du geste réel (click/touch).
     On joue un silence de 0.01s pour lever le blocage autoplay. */
  function unlockSpeech() {
    userGestureSeen = true;
    if (speechUnlocked) return;
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(" ");
      u.lang = "fr-FR";
      u.volume = 0.001;
      u.rate = 2;
      u.onend = u.onerror = function () { speechUnlocked = true; };
      window.speechSynthesis.speak(u);
      speechUnlocked = true;
    } catch (e) {
      speechUnlocked = true;
    }
  }

  /* ── Voix française ── */
  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      return (
        voices.find(v => v.lang && v.lang.toLowerCase() === "fr-fr") ||
        voices.find(v => v.lang && v.lang.toLowerCase().startsWith("fr")) ||
        voices[0] ||
        null
      );
    } catch (e) { return null; }
  }

  /* ── Lecture voix ── */
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const safeText = (text || "").trim();
    if (!safeText) return;

    if (!userGestureSeen) {
      console.warn("DIGIY AUDIO : en attente d'un geste utilisateur.");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      /* Petit délai pour laisser cancel() s'appliquer proprement */
      setTimeout(function () {
        try {
          window.speechSynthesis.resume();
          const msg = new SpeechSynthesisUtterance(safeText);
          msg.lang = "fr-FR";
          msg.rate = 0.86;
          msg.pitch = 0.95;
          msg.volume = 1;
          const v = pickFrenchVoice();
          if (v) msg.voice = v;

          msg.onstart = function () { console.log("DIGIY AUDIO ▶ voix lancée ✅"); };
          msg.onend   = function () { console.log("DIGIY AUDIO ■ voix terminée"); };
          msg.onerror = function (e) { console.warn("DIGIY AUDIO ⚠ erreur voix", e); };

          window.speechSynthesis.speak(msg);

          /* Anti-pause navigateur */
          setTimeout(function () {
            try {
              if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            } catch (e) {}
          }, 300);
        } catch (e) {
          console.warn("DIGIY AUDIO : impossible de parler", e);
        }
      }, 120);
    } catch (e) { }
  }

  /* ── Construction de la réponse ── */
  function buildReply(raw) {
    const t = clean(raw);

    if (t.includes("chauffeur") || t.includes("driver") || t.includes("taxi") || t.includes("aibd") || t.includes("aeroport") || t.includes("conduis") || t.includes("yobbu")) {
      return { icon: "🚗", title: "DRIVER", text: "J'ai compris : tu cherches un chauffeur. Je remonte la porte DRIVER avec les fiches utiles. Tu peux contacter directement le pro. DIGIY prépare, le client choisit, le terrain garde la main." };
    }
    if (t.includes("logement") || t.includes("maison") || t.includes("chambre") || t.includes("louer") || t.includes("loc") || t.includes("saly") || t.includes("nuit") || t.includes("dormir")) {
      return { icon: "🏠", title: "LOC", text: "J'ai compris : tu cherches un logement ou une location. Je remonte la porte LOC. Le client voit, le pro valide, la relation reste directe." };
    }
    if (t.includes("reserver") || t.includes("reservation") || t.includes("table") || t.includes("restaurant") || t.includes("resa") || t.includes("manger") || t.includes("diner")) {
      return { icon: "📅", title: "RESA", text: "J'ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY prépare la demande, mais la confirmation reste côté professionnel." };
    }
    if (t.includes("artisan") || t.includes("plombier") || t.includes("electricien") || t.includes("chantier") || t.includes("build") || t.includes("travaux") || t.includes("reparer")) {
      return { icon: "🏗️", title: "BUILD", text: "J'ai compris : tu cherches un artisan ou un service terrain. Je remonte la porte BUILD avec les fiches adaptées. Contact direct, pas de détour inutile." };
    }
    if (t.includes("produit") || t.includes("boutique") || t.includes("acheter") || t.includes("market") || t.includes("commerce")) {
      return { icon: "🛍️", title: "MARKET", text: "J'ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce. Le vendeur garde son contact, son argent et sa décision." };
    }
    if (t.includes("emploi") || t.includes("travail") || t.includes("job") || t.includes("mission") || t.includes("liggey")) {
      return { icon: "💼", title: "JOBS", text: "J'ai compris : tu cherches du travail ou une mission. Je remonte la porte JOBS. DIGIY aide à organiser la rencontre, sans remplacer l'humain." };
    }
    if (t.includes("sortie") || t.includes("lieu") || t.includes("visiter") || t.includes("decouvrir") || t.includes("explore") || t.includes("petite cote") || t.includes("activite")) {
      return { icon: "🗺️", title: "EXPLORE", text: "J'ai compris : tu cherches un lieu, une sortie ou une découverte. Je remonte la porte EXPLORE pour ouvrir les bonnes pistes." };
    }
    if (t.includes("wave") || t.includes("preuve") || t.includes("paiement") || t.includes("pay") || t.includes("argent") || t.includes("encaisse")) {
      return { icon: "💳", title: "PAY", text: "J'ai compris : la demande touche à l'argent. Je peux préparer l'action PAY, mais aucune validation ne se fait seule. Le pro vérifie et valide." };
    }
    if (t.includes("audio") || t.includes("ecouter") || t.includes("vision") || t.includes("deglu")) {
      return { icon: "🎵", title: "AUDIO", text: "J'ai compris : tu veux écouter. Je remonte la porte AUDIO DIGIYLYFE." };
    }
    if (t.includes("assistant") || t.includes("aide") || t.includes("guide") || t.includes("infini")) {
      return { icon: "♾️", title: "ASSISTANT", text: "J'ai compris : tu veux être guidé. Je remonte l'assistant DIGIY. Pierre par pierre." };
    }
    if (t.includes("venir") || t.includes("adresse") || t.includes("route") || t.includes("chez digiy")) {
      return { icon: "📍", title: "VENIR", text: "J'ai compris : tu veux venir chez DIGIY. Je remonte la fiche avec la route et l'adresse." };
    }
    if (t.includes("annonce") || t.includes("reseau") || t.includes("publier") || t.includes("com au clic")) {
      return { icon: "📣", title: "RÉSEAU", text: "J'ai compris : tu veux publier ou rejoindre le réseau. Je remonte la porte RÉSEAU DIGIY." };
    }

    return {
      icon: "👂",
      title: "DEMANDE TERRAIN",
      text: "J'ai compris ta demande. Je laisse les fiches remonter et je prépare la bonne orientation. DIGIY écoute, classe et ouvre la voie. Le terrain garde la main."
    };
  }

  /* ── Boîte de réponse ── */
  function ensureBox() {
    let box = document.getElementById("digiy-audio-reponse-box-v2");
    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box-v2";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      Object.assign(box.style, {
        position: "fixed",
        left: "12px",
        right: "12px",
        bottom: "86px",
        zIndex: "99999",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "16px",
        borderRadius: "22px",
        background: "linear-gradient(135deg,rgba(10,54,34,.98),rgba(17,84,52,.98))",
        color: "#fff7df",
        border: "1px solid rgba(196,151,63,.75)",
        boxShadow: "0 18px 45px rgba(0,0,0,.35)",
        fontWeight: "900",
        lineHeight: "1.45",
        fontSize: "15px",
        display: "none"
      });
      document.body.appendChild(box);
    }
    return box;
  }

  /* ── Affichage + lecture ── */
  function answerWithText(queryText) {
    if (!queryText || queryText.length < 3) return;

    const reply = buildReply(queryText);
    const key = reply.title + "::" + clean(queryText).slice(0, 40);
    const now = Date.now();

    if (key === lastAnswerKey && now - lastAnswerAt < 4000) return;

    lastAnswerKey = key;
    lastAnswerAt = now;

    const box = ensureBox();
    box.innerHTML =
      "<div style='font-size:22px;margin-bottom:6px'>" + reply.icon + " " + reply.title + "</div>" +
      "<div>" + reply.text + "</div>";
    box.style.display = "block";

    speak(reply.text);
  }

  /* ── Source de vérité : champ #q ── */
  function readQueryField() {
    const q = document.getElementById("q");
    return q ? (q.value || "").trim() : "";
  }

  /* ── Hook sur les boutons GO / VOIR / chips / exemples ──
     Appelé DANS le gestionnaire de clic donc userGestureSeen = true. */
  function hookButtons() {
    /* GO (listenBtn) et VOIR (searchBtn) */
    ["listenBtn", "searchBtn"].forEach(function (id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", function () {
        unlockSpeech();
        /* Légèrement différé pour laisser render() s'exécuter d'abord */
        setTimeout(function () {
          const txt = readQueryField();
          if (txt) answerWithText(txt);
        }, 500);
      }, { capture: true });
    });

    /* Chips rapides */
    document.querySelectorAll(".chip[data-q]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        unlockSpeech();
        setTimeout(function () {
          const txt = chip.getAttribute("data-q") || readQueryField();
          if (txt) answerWithText(txt);
        }, 500);
      }, { capture: true });
    });

    /* Exemples bilingues */
    document.querySelectorAll(".examplePhrase[data-q]").forEach(function (phrase) {
      phrase.addEventListener("click", function () {
        unlockSpeech();
        setTimeout(function () {
          const txt = phrase.getAttribute("data-q") || readQueryField();
          if (txt) answerWithText(txt);
        }, 500);
      }, { capture: true });
    });
  }

  /* ── MutationObserver allégé : surveille uniquement #cards ──
     Évite les faux positifs sur le body entier. */
  function observeCards() {
    const cards = document.getElementById("cards");
    if (!cards || !("MutationObserver" in window)) return;

    const observer = new MutationObserver(function (mutations) {
      if (!userGestureSeen) return;
      let added = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) { added = true; break; }
      }
      if (!added) return;

      /* Des fiches viennent d'apparaître → lit la demande courante */
      setTimeout(function () {
        const txt = readQueryField();
        if (txt) answerWithText(txt);
      }, 300);
    });

    observer.observe(cards, { childList: true, subtree: false });
  }

  /* ── API publique ── */
  function exposeApi() {
    window.DIGIY_AUDIO_REPONSE_V2 = {
      answer: function (txt) { answerWithText(txt || readQueryField()); },
      speak: speak,
      unlockSpeech: unlockSpeech,
      buildReply: buildReply
    };
  }

  /* ── Préchargement des voix ── */
  function preloadVoices() {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {};
    } catch (e) {}
  }

  /* ── Boot ── */
  function boot() {
    preloadVoices();
    hookButtons();
    observeCards();
    exposeApi();
    console.log("DIGIY AUDIO RÉPONSE V2.2 chargé ✅ — hook direct activé");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

