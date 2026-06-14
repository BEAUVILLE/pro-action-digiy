/* =========================================================
   DIGIY AUDIO RÉPONSE V2.7 — PRO ACTION DIGIY

   CORRECTION MOBILE :
   - GO déverrouille la voix dès le geste utilisateur.
   - Après dictée, la réponse DIGIY parle sans obliger à toucher VOIR.
   - VOIR reste un secours manuel.
   - Le toast audio est très court, en haut, non bloquant.
   - Le texte long de réponse est caché : seule une petite pastille audio apparaît.
   - Aucune boîte ne doit couvrir les fiches ni empêcher les clics.
========================================================= */

(function () {
  "use strict";

  let speechUnlocked = false;
  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let hideTimer = null;
  let goWatcher = null;

  function clean(txt) {
    return (txt || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, " ").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(txt) {
    return (txt || "").toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;
    try {
      const v = window.speechSynthesis.getVoices() || [];
      return v.find(x => x.lang && x.lang.toLowerCase() === "fr-fr")
          || v.find(x => x.lang && x.lang.toLowerCase().startsWith("fr"))
          || v[0] || null;
    } catch (e) { return null; }
  }

  function speakNow(text) {
    if (!("speechSynthesis" in window) || !text || !text.trim()) return;

    try { window.speechSynthesis.cancel(); } catch(e) {}
    try { window.speechSynthesis.resume(); } catch(e) {}

    const msg = new SpeechSynthesisUtterance(text.trim());
    msg.lang   = "fr-FR";
    msg.rate   = 0.86;
    msg.pitch  = 0.95;
    msg.volume = 1;
    const v = pickFrenchVoice();
    if (v) msg.voice = v;

    msg.onstart = () => console.log("DIGIY AUDIO ▶ voix lancée ✅");
    msg.onend   = () => console.log("DIGIY AUDIO ■ terminée");
    msg.onerror = (e) => console.warn("DIGIY AUDIO ⚠", e.error);

    window.speechSynthesis.speak(msg);

    setTimeout(() => {
      try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch(e){}
    }, 350);
  }

  function primeSpeech() {
    if (!("speechSynthesis" in window) || speechUnlocked) return;
    try {
      window.speechSynthesis.cancel();
      const silence = new SpeechSynthesisUtterance(" ");
      silence.lang = "fr-FR";
      silence.volume = 0.001;
      silence.rate = 2;
      silence.onend = () => { speechUnlocked = true; };
      silence.onerror = () => { speechUnlocked = true; };
      window.speechSynthesis.speak(silence);
      speechUnlocked = true;
    } catch(e) {
      speechUnlocked = true;
    }
  }

  function unlockThenSpeak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    if (!speechUnlocked) primeSpeech();
    speakNow(text);
  }

  function buildReply(raw) {
    const t = clean(raw);

    if (t.includes("chauffeur")||t.includes("driver")||t.includes("taxi")||t.includes("aibd")||t.includes("yobbu"))
      return {icon:"🚗",title:"DRIVER",text:"J'ai compris : tu cherches un chauffeur. Je remonte la porte DRIVER avec les fiches utiles. Contact direct, le terrain garde la main."};
    if (t.includes("chambre")||t.includes("logement")||t.includes("louer")||t.includes("saly")||t.includes("nuit")||t.includes("dormir"))
      return {icon:"🏠",title:"LOC",text:"J'ai compris : tu cherches un logement ou une location. Je remonte la porte LOC. Le client voit, le pro valide, la relation reste directe."};
    if (t.includes("reserver")||t.includes("reservation")||t.includes("table")||t.includes("restaurant")||t.includes("resa")||t.includes("manger"))
      return {icon:"📅",title:"RESA",text:"J'ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY prépare, le pro confirme."};
    if (t.includes("artisan")||t.includes("plombier")||t.includes("electricien")||t.includes("build")||t.includes("travaux")||t.includes("reparer"))
      return {icon:"🏗️",title:"BUILD",text:"J'ai compris : tu cherches un artisan ou un service terrain. Je remonte la porte BUILD. Contact direct, pas de détour."};
    if (t.includes("produit")||t.includes("boutique")||t.includes("acheter")||t.includes("market"))
      return {icon:"🛍️",title:"MARKET",text:"J'ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce."};
    if (t.includes("emploi")||t.includes("travail")||t.includes("job")||t.includes("mission")||t.includes("liggey"))
      return {icon:"💼",title:"JOBS",text:"J'ai compris : tu cherches du travail ou une mission. Je remonte la porte JOBS."};
    if (t.includes("sortie")||t.includes("decouvrir")||t.includes("explore")||t.includes("petite cote")||t.includes("activite"))
      return {icon:"🗺️",title:"EXPLORE",text:"J'ai compris : tu cherches une sortie ou un lieu à découvrir. Je remonte la porte EXPLORE."};
    if (t.includes("wave")||t.includes("preuve")||t.includes("paiement")||t.includes("pay")||t.includes("argent"))
      return {icon:"💳",title:"PAY",text:"J'ai compris : la demande touche à l'argent. Je prépare l'action PAY. Le pro vérifie et valide."};
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

    return {icon:"👂",title:"DEMANDE TERRAIN",text:"J'ai compris ta demande. Les fiches sont remontées. DIGIY prépare, le terrain garde la main."};
  }

  function ensureBox() {
    let box = document.getElementById("digiy-audio-reponse-box-v2");
    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box-v2";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      Object.assign(box.style, {
        position:"fixed",
        left:"12px",
        right:"12px",
        top:"calc(env(safe-area-inset-top) + 8px)",
        bottom:"auto",
        zIndex:"99999",
        maxWidth:"480px",
        margin:"0 auto",
        padding:"9px 11px",
        borderRadius:"15px",
        background:"linear-gradient(135deg,rgba(10,54,34,.94),rgba(17,84,52,.94))",
        color:"#fff7df",
        border:"1px solid rgba(196,151,63,.60)",
        boxShadow:"0 10px 24px rgba(0,0,0,.22)",
        fontWeight:"900",
        lineHeight:"1.22",
        fontSize:"12px",
        display:"none",
        transform:"translateY(-7px)",
        opacity:"0",
        transition:"opacity .18s ease, transform .18s ease",
        pointerEvents:"none"
      });
      document.body.appendChild(box);
    }
    return box;
  }

  function hideBox() {
    const box = document.getElementById("digiy-audio-reponse-box-v2");
    if (!box) return;
    box.style.opacity = "0";
    box.style.transform = "translate(-50%, -7px)";
    setTimeout(() => { box.style.display = "none"; }, 200);
  }

  function showBox(reply) {
    const box = ensureBox();
    clearTimeout(hideTimer);

    /*
      MOBILE DIGIY — TEXTE RÉPONSE CACHÉ
      On garde la voix comme vraie réponse.
      On affiche seulement une petite pastille courte, sans texte long,
      pour ne jamais couvrir les fiches ni voler les clics.
    */
    box.setAttribute("aria-label", reply.text || "Réponse audio DIGIY");
    box.innerHTML =
      "<div style='font-size:12px;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'>" +
      escapeHtml("🎧 DIGIY parle · " + reply.title) +
      "</div>";

    Object.assign(box.style, {
      left:"50%",
      right:"auto",
      top:"calc(env(safe-area-inset-top) + 8px)",
      width:"auto",
      maxWidth:"min(78vw, 330px)",
      margin:"0",
      padding:"7px 10px",
      borderRadius:"999px",
      transform:"translate(-50%, -7px)",
      pointerEvents:"none"
    });

    box.style.display = "block";
    requestAnimationFrame(() => {
      box.style.opacity = "1";
      box.style.transform = "translate(-50%, 0)";
    });
    hideTimer = setTimeout(hideBox, 1600);
  }

  function triggerAnswer(queryText) {
    if (!queryText || queryText.length < 3) return;
    const reply = buildReply(queryText);
    const key = reply.title + "::" + clean(queryText).slice(0, 60);
    const now = Date.now();
    if (key === lastAnswerKey && now - lastAnswerAt < 3500) return;
    lastAnswerKey = key;
    lastAnswerAt = now;
    showBox(reply);
    unlockThenSpeak(reply.text);
  }

  function readQ() {
    const q = document.getElementById("q");
    return q ? (q.value || "").trim() : "";
  }

  function watchAfterGo() {
    const initial = clean(readQ());
    const started = Date.now();
    clearInterval(goWatcher);
    goWatcher = setInterval(function () {
      const txt = readQ();
      const nowClean = clean(txt);
      if (txt && txt.length >= 3 && nowClean !== initial) {
        clearInterval(goWatcher);
        goWatcher = null;
        setTimeout(function(){ triggerAnswer(txt); }, 220);
        return;
      }
      if (Date.now() - started > 18000) {
        clearInterval(goWatcher);
        goWatcher = null;
      }
    }, 280);
  }

  function hookVoirButton() {
    document.querySelectorAll("#searchBtn, .viewBtn, [data-search], [data-action='search']").forEach(function(btn){
      btn.addEventListener("click", function () {
        const txt = readQ();
        if (txt) triggerAnswer(txt);
      }, true);
    });
  }

  function hookGoButton() {
    document.querySelectorAll("#listenBtn, .talkBtn, [data-listen], [data-action='listen']").forEach(function(btn){
      btn.addEventListener("click", function () {
        primeSpeech();
        watchAfterGo();
      }, true);
    });
  }

  function hookQuickButtons() {
    document.querySelectorAll(".chip[data-q], .examplePhrase[data-q]").forEach(function(el) {
      el.addEventListener("click", function () {
        primeSpeech();
        const txt = el.getAttribute("data-q") || readQ();
        if (txt) triggerAnswer(txt);
      }, true);
    });
  }

  function hookEnter() {
    const q = document.getElementById("q");
    if (!q) return;
    q.addEventListener("keydown", function(ev){
      if (ev.key === "Enter" && !ev.shiftKey) {
        const txt = readQ();
        if (txt) triggerAnswer(txt);
      }
    }, true);
  }

  window.DIGIY_AUDIO_REPONSE_V2 = {
    answer: function(txt) { triggerAnswer(txt || readQ()); },
    speak: speakNow,
    prime: primeSpeech,
    buildReply: buildReply,
    hide: hideBox,
    version: "2.7-mobile-audio-pill-no-text"
  };

  function boot() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.getVoices(); } catch(e){}
      try { window.speechSynthesis.onvoiceschanged = pickFrenchVoice; } catch(e){}
    }
    hookGoButton();
    hookVoirButton();
    hookQuickButtons();
    hookEnter();
    console.log("DIGIY AUDIO RÉPONSE V2.7 ✅ — GO parle, texte réponse caché, fiches cliquables");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
