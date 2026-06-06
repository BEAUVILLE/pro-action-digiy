/* DIGIYLYFE — digiy-retour-voix.js
   Rôle : injecte un bouton fixe "← La Voix du Business" sur toutes les pages publiques.
   Usage : <script src="./assets/js/digiy-retour-voix.js?v=retour-voix-20260606" defer></script>
   Version : retour-voix-20260606
*/
(function(){
  "use strict";

  var LIEN = "https://pro-action-digiy.digiylyfe.com/";
  var ID   = "digiyRetourVoix";

  function inject(){
    if(document.getElementById(ID)) return;

    /* CSS */
    var style = document.createElement("style");
    style.textContent = [
      "#"+ID+"{",
        "position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:999;",
        "display:inline-flex;align-items:center;gap:8px;",
        "min-height:50px;padding:0 22px;border-radius:999px;",
        "background:linear-gradient(135deg,#fff2bf,#f6c453);",
        "color:#0d170d;font:900 14px system-ui,-apple-system,sans-serif;",
        "text-decoration:none;white-space:nowrap;",
        "box-shadow:0 12px 32px rgba(18,60,45,.28);",
        "border:1px solid rgba(255,255,255,.40);",
        "transition:box-shadow .18s ease,background .18s ease;",
      "}",
      "#"+ID+":hover{",
        "background:linear-gradient(135deg,#fde68a,#f6c453);",
        "box-shadow:0 16px 40px rgba(18,60,45,.38);",
      "}",
      "@media(max-width:520px){",
        "#"+ID+"{left:12px;right:12px;transform:none;justify-content:center;bottom:12px;}",
      "}"
    ].join("");
    document.head.appendChild(style);

    /* Bouton */
    var btn = document.createElement("a");
    btn.id        = ID;
    btn.href      = LIEN;
    btn.innerHTML = "🎙️ La Voix du Business";
    btn.setAttribute("aria-label", "Retour à La Voix du Business DIGIY");

    document.body.appendChild(btn);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
