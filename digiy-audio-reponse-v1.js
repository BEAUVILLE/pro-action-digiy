/* =========================================================
   DIGIY AUDIO RÉPONSE V2.5 — PRO ACTION DIGIY

   DOCTRINE V2.5 :
   - Les fiches remontent seules.
   - Le bouton VOIR = déclencheur officiel de la VOIX DIGIY.
   - Clic VOIR → geste utilisateur garanti → navigateur autorise speech.
   - Réponse visuelle courte type toast : elle parle puis se range.
   - Le bloc ne doit pas cacher les cartes sur téléphone.
   - MutationObserver supprimé : inutile, les fiches remontent déjà.
========================================================= */

(function () {
  "use strict";

  let speechUnlocked = false;
  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let hideTimer = null;

  /* ── Nettoyage texte ── */
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

  /* ── Voix française ── */
  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return null;
    try {
      const v = window.speechSynthesis.getVoices() || [];
      return v.find(x => x.lang && x.lang.toLowerCase() === "fr-fr")
          || v.find(x => x.lang && x.lang.toLowerCase().startsWith("fr"))
          || v[0] || null;
    } catch (e) { return null; }
  }

  /* ── Parle (appel synchrone depuis un handler clic) ── */
  function speakNow(text) {
    if (!("speechSynthesis" in window) || !text || !text.trim()) return;

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

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

    /* Anti-pause mobile Chrome/Samsung */
    setTimeout(() => {
      try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch(e){}
    }, 350);
  }

  /* ── Déverrouille puis parle, dans le même tick de clic ── */
  function unlockThenSpeak(text) {
    if (!("speechSynthesis" in window) || !text) return;

    if (!speechUnlocked) {
      window.speechSynthesis.cancel();
      const silence = new SpeechSynthesisUtterance(" ");
      silence.lang   = "fr-FR";
      silence.volume = 0.001;
      silence.rate   = 2;
      silence.onend   = () => { speechUnlocked = true; speakNow(text); };
      silence.onerror = () => { speechUnlocked = true; speakNow(text); };
      window.speechSynthesis.speak(silence);
      speechUnlocked = true;
    } else {
      speakNow(text);
    }
  }

  /* ── Réponses DIGIY ── */
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

  /* ── Boîte visuelle réponse : toast mobile non bloquant ── */
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
        top:"calc(env(safe-area-inset-top) + 10px)",
        bottom:"auto",
        zIndex:"99999",
        maxWidth:"560px",
        margin:"0 auto",
        padding:"10px 42px 10px 12px",
        borderRadius:"18px",
        background:"linear-gradient(135deg,rgba(10,54,34,.96),rgba(17,84,52,.96))",
        color:"#fff7df",
        border:"1px solid rgba(196,151,63,.75)",
        boxShadow:"0 12px 28px rgba(0,0,0,.28)",
        fontWeight:"900",
        lineHeight:"1.32",
        fontSize:"13px",
        display:"none",
        transform:"translateY(-8px)",
        opacity:"0",
        transition:"opacity .22s ease, transform .22s ease",
        pointerEvents:"auto"
      });
      document.body.appendChild(box);
    }
    return box;
  }

  function hideBox() {
    const box = document.getElementById("digiy-audio-reponse-box-v2");
    if (!box) return;
    box.style.opacity = "0";
    box.style.transform = "translateY(-8px)";
    setTimeout(() => {
      box.style.display = "none";
    }, 240);
  }

  function showBox(reply) {
    const box = ensureBox();
    clearTimeout(hideTimer);

    box.innerHTML =
      "<button type='button' aria-label='Fermer' id='digiy-reponse-close' " +
      "style='position:absolute;right:8px;top:8px;width:30px;height:30px;border:0;border-radius:999px;background:rgba(255,255,255,.16);color:#fff7df;font-weight:1000;font-size:16px'>×</button>" +
      "<div style='font-size:15px;margin-bottom:3px'>" + escapeHtml(reply.icon + " " + reply.title) + "</div>" +
      "<div style='font-size:12.5px;font-weight:850;opacity:.96'>" + escapeHtml(reply.text) + "</div>";

    box.style.display = "block";
    requestAnimationFrame(() => {
      box.style.opacity = "1";
      box.style.transform = "translateY(0)";
    });

    const close = document.getElementById("digiy-reponse-close");
    if (close) close.onclick = hideBox;

    /* Sur téléphone, la réponse ne doit pas gêner la remontée des modules. */
    hideTimer = setTimeout(hideBox, 5200);
  }

  /* ── Cœur : affiche + parle ── */
  function triggerAnswer(queryText) {
    if (!queryText || queryText.length < 3) return;

    const reply = buildReply(queryText);
    const key = reply.title + "::" + clean(queryText).slice(0, 40);
    const now = Date.now();
    if (key === lastAnswerKey && now - lastAnswerAt < 3000) return;
    lastAnswerKey = key;
    lastAnswerAt = now;

    showBox(reply);

    /* Voix — appelée depuis le tick synchrone du clic */
    unlockThenSpeak(reply.text);
  }

  function readQ() {
    const q = document.getElementById("q");
    return q ? (q.value || "").trim() : "";
  }

  /* ── VOIR = déclencheur officiel de la voix ── */
  function hookVoirButton() {
    const btn = document.getElementById("searchBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const txt = readQ();
      if (txt) triggerAnswer(txt);
    }, true);
  }

  /* ── Chips et exemples : voix au clic direct ── */
  function hookQuickButtons() {
    document.querySelectorAll(".chip[data-q], .examplePhrase[data-q]").forEach(function(el) {
      el.addEventListener("click", function () {
        const txt = el.getAttribute("data-q") || "";
        if (txt) triggerAnswer(txt);
      }, true);
    });
  }

  /* ── API publique ── */
  window.DIGIY_AUDIO_REPONSE_V2 = {
    answer: function(txt) { triggerAnswer(txt || readQ()); },
    speak: speakNow,
    buildReply: buildReply,
    hide: hideBox
  };

  /* ── Boot ── */
  function boot() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.getVoices(); } catch(e){}
    }
    hookVoirButton();
    hookQuickButtons();
    console.log("DIGIY AUDIO RÉPONSE V2.5 ✅ — toast non bloquant");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
