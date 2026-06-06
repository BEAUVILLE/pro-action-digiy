
/* DIGIYLYFE ACTION — correctif Astou chargé par SRC.
   Doctrine : Astou s'ajoute APRÈS le moteur public — ne jamais écraser #cards.
   Fix 20260606-v2 : suppression MutationObserver (cause boucle flash).
   Hook sur window.DIGIY_ACTION_PUBLIC.render uniquement.
*/
(function(){
  "use strict";
  var TEL = "221771342889";
  var URL_ASTOU = "https://astou-boutique.digiylyfe.com/";

  function el(id){ return document.getElementById(id); }
  function clean(v){ return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
  function has(t,a){ return a.some(function(w){ return t.indexOf(clean(w)) >= 0; }); }

  function match(v){
    var t = clean(v);
    return has(t,["serviette","linge","drap","bain","peignoir","fouta"])
      && has(t,["saly","petite cote","petite côte"])
      && has(t,["boutique","magasin","acheter","commerce","market","cherche","veux"]);
  }

  function wa(text){
    return "https://wa.me/"+TEL+"?text="+encodeURIComponent(text);
  }

  function inject(){
    var q   = el("q");
    var raw = q ? q.value.trim() : "";

    /* Supprimer ancienne carte Astou si elle existe */
    var old = document.getElementById("astou-card");
    if(old) old.parentNode.removeChild(old);

    /* Si pas de match → on sort, les cartes publiques restent intactes */
    if(!match(raw)) return;

    var box = el("cards");
    if(!box) return;

    var msg = "Bonjour, je cherche des serviettes ou du linge à Saly via DIGIY."
            + (raw ? "\n\nRecherche client : " + raw : "");

    var article = document.createElement("article");
    article.className = "card";
    article.id = "astou-card";
    article.innerHTML =
      '<div class="cover">🛍️</div>' +
      '<div class="body">' +
        '<span class="tag">#boutique · Saly</span>' +
        '<h3>Astou Boutique — linge &amp; serviettes</h3>' +
        '<p>Serviettes, draps, linge et articles utiles. Fiche publique, contact direct, sans commission.</p>' +
        '<div class="card-actions">' +
          '<a class="btn primary" href="' + URL_ASTOU + '" target="_blank" rel="noopener noreferrer">Voir la fiche</a>' +
          '<a class="btn green" href="' + wa(msg) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
        '</div>' +
      '</div>';

    box.insertBefore(article, box.firstChild);

    var status = el("status");
    if(status) status.textContent = "Fiche Astou Boutique + fiches DIGIY remontées.";
  }

  function scheduleInject(){
    setTimeout(inject, 180);
  }

  function hookPublicRender(){
    var pub = window.DIGIY_ACTION_PUBLIC;
    if(pub && pub.render && !pub.__astouHooked){
      var orig = pub.render;
      pub.render = function(){
        orig();
        scheduleInject();
      };
      pub.__astouHooked = true;
    }
  }

  function init(){
    /* Bind sur searchBtn et chips */
    var searchBtn = el("searchBtn");
    if(searchBtn) searchBtn.addEventListener("click", scheduleInject);

    document.querySelectorAll(".chip").forEach(function(b){
      b.addEventListener("click", scheduleInject);
    });

    /* Hook render public — tenter immédiatement puis après chargement */
    hookPublicRender();
    setTimeout(hookPublicRender, 300);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
