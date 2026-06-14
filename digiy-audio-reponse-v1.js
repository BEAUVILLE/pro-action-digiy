/* =========================================================
   DIGIY AUDIO RÉPONSE V2.3 — PRO ACTION DIGIY
   Fix voix : unlock + speak dans le MÊME tick synchrone.

   CHANGEMENTS v2.3 :
   - unlockSpeech() ET speak() appelés en synchrone dans le handler clic.
   - Texte préparé AVANT le setTimeout, speak() déclenché tout de suite.
   - MutationObserver sur #cards uniquement (pas body entier).
   - Source de vérité = #q (champ texte).
========================================================= */

(function () {
  "use strict";

  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let speechUnlocked = false;
  let pendingText = "";

  function clean(txt) {
    return (txt || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/['']/g, " ").replace(/\s+/g, " ").trim();
  }

  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      return voices.find(v => v.lang && v.lang.toLowerCase() === "fr-fr")
          || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("fr"))
          || voices[0] || null;
    } catch (e) { return null; }
  }

  /* ── Parle immédiatement (doit être dans le tick du geste) ── */
  function speakNow(text) {
    if (!("speechSynthesis" in window)) return;
    const safeText = (text || "").trim();
    if (!safeText) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const msg = new SpeechSynthesisUtterance(safeText);
      msg.lang = "fr-FR";
      msg.rate = 0.86;
      msg.pitch = 0.95;
      msg.volume = 1;
      const v = pickFrenchVoice();
      if (v) msg.voice = v;

      msg.onstart = () => console.log("DIGIY AUDIO ▶ voix lancée ✅");
      msg.onend   = () => console.log("DIGIY AUDIO ■ terminée");
      msg.onerror = (e) => console.warn("DIGIY AUDIO ⚠", e.error);

      window.speechSynthesis.speak(msg);

      /* Anti-pause mobile */
      setTimeout(() => {
        try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch(e){}
      }, 300);
    } catch (e) {
      console.warn("DIGIY AUDIO : parler impossible", e);
    }
  }

  /* ── Déverrouille ET parle en synchrone ── */
  function unlockAndSpeak(text) {
    if (!("speechSynthesis" in window)) return;
    if (!text || !text.trim()) return;

    if (!speechUnlocked) {
      /* Premier geste : on joue un silence puis la vraie phrase */
      try {
        window.speechSynthesis.cancel();
        const silence = new SpeechSynthesisUtterance(" ");
        silence.lang = "fr-FR";
        silence.volume = 0.001;
        silence.rate = 2;
        silence.onend = () => {
          speechUnlocked = true;
          speakNow(text);
        };
        silence.onerror = () => {
          speechUnlocked = true;
          speakNow(text);
        };
        window.speechSynthesis.speak(silence);
        speechUnlocked = true; /* optimiste — évite double unlock */
      } catch (e) {
        speechUnlocked = true;
        speakNow(text);
      }
    } else {
      speakNow(text);
    }
  }

  /* ── Réponses ── */
  function buildReply(raw) {
    const t = clean(raw);

    if (t.includes("chauffeur")||t.includes("driver")||t.includes("taxi")||t.includes("aibd")||t.includes("yobbu"))
      return {icon:"🚗",title:"DRIVER",text:"J'ai compris : tu cherches un chauffeur. Je remonte la porte DRIVER avec les fiches utiles. Tu peux contacter directement le pro. DIGIY prépare, le client choisit, le terrain garde la main."};
    if (t.includes("chambre")||t.includes("logement")||t.includes("louer")||t.includes("saly")||t.includes("nuit")||t.includes("dormir")||(t.includes("loc")&&!t.includes("local")))
      return {icon:"🏠",title:"LOC",text:"J'ai compris : tu cherches un logement ou une location. Je remonte la porte LOC. Le client voit, le pro valide, la relation reste directe."};
    if (t.includes("reserver")||t.includes("reservation")||t.includes("table")||t.includes("restaurant")||t.includes("resa")||t.includes("manger"))
      return {icon:"📅",title:"RESA",text:"J'ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY prépare la demande, mais la confirmation reste côté professionnel."};
    if (t.includes("artisan")||t.includes("plombier")||t.includes("electricien")||t.includes("build")||t.includes("travaux")||t.includes("reparer"))
      return {icon:"🏗️",title:"BUILD",text:"J'ai compris : tu cherches un artisan ou un service terrain. Je remonte la porte BUILD avec les fiches adaptées. Contact direct, pas de détour inutile."};
    if (t.includes("produit")||t.includes("boutique")||t.includes("acheter")||t.includes("market"))
      return {icon:"🛍️",title:"MARKET",text:"J'ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce. Le vendeur garde son contact, son argent et sa décision."};
    if (t.includes("emploi")||t.includes("travail")||t.includes("job")||t.includes("mission")||t.includes("liggey"))
      return {icon:"💼",title:"JOBS",text:"J'ai compris : tu cherches du travail ou une mission. Je remonte la porte JOBS. DIGIY aide à organiser la rencontre, sans remplacer l'humain."};
    if (t.includes("sortie")||t.includes("decouvrir")||t.includes("explore")||t.includes("petite cote")||t.includes("activite"))
      return {icon:"🗺️",title:"EXPLORE",text:"J'ai compris : tu cherches un lieu, une sortie ou une découverte. Je remonte la porte EXPLORE pour ouvrir les bonnes pistes."};
    if (t.includes("wave")||t.includes("preuve")||t.includes("paiement")||t.includes("pay")||t.includes("argent"))
      return {icon:"💳",title:"PAY",text:"J'ai compris : la demande touche à l'argent. Je peux préparer l'action PAY, mais aucune validation ne se fait seule. Le pro vérifie et valide."};
    if (t.includes("audio")||t.includes("ecouter")||t.includes("vision")||t.includes("deglu"))
      return {icon:"🎵",title:"AUDIO",text:"J'ai compris : tu veux écouter. Je remonte la porte AUDIO DIGIYLYFE."};
    if (t.includes("assistant")||t.includes("aide")||t.includes("guide")||t.includes("infini"))
      return {icon:"♾️",title:"ASSISTANT",text:"J'ai compris : tu veux être guidé. Je remonte l'assistant DIGIY. Pierre par pierre."};
    if (t.includes("venir")||t.includes("adresse")||t.includes("route")||t.includes("chez digiy"))
      return {icon:"📍",title:"VENIR",text:"J'ai compris : tu veux venir chez DIGIY. Je remonte la fiche avec la route et l'adresse."};
    if (t.includes("annonce")||t.includes("reseau")||t.includes("publier"))
      return {icon:"📣",title:"RÉSEAU",text:"J'ai compris : tu veux publier ou rejoindre le réseau. Je remonte la porte RÉSEAU DIGIY."};
    if (t.includes("commerce")||t.includes("magasin")||t.includes("local"))
      return {icon:"👜",title:"COMMERCE",text:"J'ai compris : tu cherches un commerce local. Je remonte la porte COMMERCE."};

    return {icon:"👂",title:"DEMANDE TERRAIN",text:"J'ai compris ta demande. Je laisse les fiches remonter et je prépare la bonne orientation. DIGIY écoute, classe et ouvre la voie. Le terrain garde la main."};
  }

  /* ── Boîte visuelle ── */
  function ensureBox() {
    let box = document.getElementById("digiy-audio-reponse-box-v2");
    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box-v2";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      Object.assign(box.style, {
        position:"fixed", left:"12px", right:"12px", bottom:"86px",
        zIndex:"99999", maxWidth:"760px", margin:"0 auto", padding:"16px",
        borderRadius:"22px",
        background:"linear-gradient(135deg,rgba(10,54,34,.98),rgba(17,84,52,.98))",
        color:"#fff7df", border:"1px solid rgba(196,151,63,.75)",
        boxShadow:"0 18px 45px rgba(0,0,0,.35)",
        fontWeight:"900", lineHeight:"1.45", fontSize:"15px", display:"none"
      });
      document.body.appendChild(box);
    }
    return box;
  }

  /* ── Affiche + parle ── */
  function triggerAnswer(queryText) {
    if (!queryText || queryText.length < 3) return;

    const reply = buildReply(queryText);
    const key = reply.title + "::" + clean(queryText).slice(0, 40);
    const now = Date.now();
    if (key === lastAnswerKey && now - lastAnswerAt < 4000) return;

    lastAnswerKey = key;
    lastAnswerAt = now;

    /* Affiche la boîte */
    const box = ensureBox();
    box.innerHTML =
      "<div style='font-size:22px;margin-bottom:6px'>" + reply.icon + " " + reply.title + "</div>" +
      "<div>" + reply.text + "</div>";
    box.style.display = "block";

    /* Parle — TOUJOURS appelé depuis le tick du geste via nos hooks */
    unlockAndSpeak(reply.text);
  }

  function readQ() {
    const q = document.getElementById("q");
    return q ? (q.value || "").trim() : "";
  }

  /* ── Hooks boutons — synchrones, dans le handler clic ── */
  function hookButtons() {

    /* GO / VOIR */
    ["listenBtn", "searchBtn"].forEach(function(id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", function() {
        /* Lit le champ maintenant, avant tout délai */
        const txt = readQ();
        if (txt) triggerAnswer(txt);
      }, true);
    });

    /* Chips rapides */
    document.querySelectorAll(".chip[data-q]").forEach(function(chip) {
      chip.addEventListener("click", function() {
        const txt = chip.getAttribute("data-q") || "";
        /* #q sera rempli par le script principal 1 tick après → on lit data-q directement */
        if (txt) triggerAnswer(txt);
      }, true);
    });

    /* Exemples bilingues */
    document.querySelectorAll(".examplePhrase[data-q]").forEach(function(phrase) {
      phrase.addEventListener("click", function() {
        const txt = phrase.getAttribute("data-q") || "";
        if (txt) triggerAnswer(txt);
      }, true);
    });
  }

  /* ── MutationObserver sur #cards uniquement ── */
  function observeCards() {
    const cards = document.getElementById("cards");
    if (!cards || !("MutationObserver" in window)) return;

    const observer = new MutationObserver(function(mutations) {
      let added = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) { added = true; break; }
      }
      if (!added) return;
      /* Fiches ajoutées après une recherche → si déjà unlocked, on lit */
      if (speechUnlocked) {
        const txt = readQ();
        if (txt && txt.length > 2) triggerAnswer(txt);
      }
    });

    observer.observe(cards, { childList: true });
  }

  /* ── API publique ── */
  window.DIGIY_AUDIO_REPONSE_V2 = {
    answer: function(txt) { triggerAnswer(txt || readQ()); },
    speak: speakNow,
    unlockAndSpeak: unlockAndSpeak,
    buildReply: buildReply
  };

  /* ── Boot ── */
  function boot() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.getVoices(); } catch(e){}
      try { window.speechSynthesis.onvoiceschanged = function(){}; } catch(e){}
    }
    hookButtons();
    observeCards();
    console.log("DIGIY AUDIO RÉPONSE V2.3 chargé ✅ — sync unlock+speak actif");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();


