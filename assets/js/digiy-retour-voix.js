/* DIGIYLYFE — digiy-retour-voix.js
   Rôle : bouton fixe retour La Voix du Business sur toutes les pages publiques.
   Version : retour-voix-20260606-v4
*/
(function(){
  "use strict";

  var LIEN = "https://pro-action-digiy.digiylyfe.com/";
  var ID   = "digiyRetourVoix";

  function inject(){
    if(document.getElementById(ID)) return;
    if(!document.body) return;

    var btn = document.createElement("a");
    btn.id        = ID;
    btn.href      = LIEN;
    btn.innerHTML = "🎙️ La Voix du Business";
    btn.setAttribute("aria-label", "Retour à La Voix du Business DIGIY");
    btn.style.cssText = [
      "position:fixed",
      "bottom:18px",
      "right:18px",
      "z-index:999999",
      "display:inline-flex",
      "align-items:center",
      "gap:8px",
      "min-height:50px",
      "padding:0 22px",
      "border-radius:999px",
      "background:linear-gradient(135deg,#fff2bf,#f6c453)",
      "color:#0d170d",
      "font:900 14px system-ui,-apple-system,sans-serif",
      "text-decoration:none",
      "white-space:nowrap",
      "box-shadow:0 12px 32px rgba(18,60,45,.28)",
      "border:1px solid rgba(255,255,255,.40)"
    ].join(";");

    document.body.appendChild(btn);
  }

  /* Tentatives multiples pour couvrir tous les cas */
  if(document.body){
    inject();
  }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
  window.addEventListener("load", inject);
  setTimeout(inject, 500);
  setTimeout(inject, 1500);

})();
