/* DIGIYLYFE ACTION — correctif Astou chargé par SRC.
   Doctrine : Astou s'ajoute APRÈS le moteur public — ne jamais écraser #cards.
   Fix 20260606 : délai porté à 200ms, lecture textarea au moment d'exécution,
   injection en prepend (pas innerHTML) pour ne pas effacer les fiches publiques.
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
      && has(t,["saly","petite cote","petite cote"])
      && has(t,["boutique","magasin","acheter","commerce","market","cherche","veux"]);
  }

  function wa(text){
    return "https://wa.me/"+TEL+"?text="+encodeURIComponent(text);
  }

  function inject(){
    /* Lit le textarea AU MOMENT de l'exécution (pas avant) */
    var q   = el("q");
    var raw = q ? q.value.trim() : "";
    if(!match(raw)) return;

    var box = el("cards");
    if(!box) return;

    /* Ne pas injecter deux fois */
    if(document.getElementById("astou-card")) return;

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

    /* Ajoute EN PREMIER sans toucher aux autres cartes */
    box.insertBefore(article, box.firstChild);

    var status = el("status");
    if(status) status.textContent = "Fiche Astou Boutique + fiches DIGIY remontées.";
  }

  /* Délai 200ms — laisse le moteur public finir son render avant d'ajouter */
  function scheduleInject(){
    setTimeout(inject, 200);
  }

  function init(){
    ["searchBtn"].forEach(function(id){
      var b = el(id);
      if(b) b.addEventListener("click", scheduleInject);
    });

    document.querySelectorAll(".chip").forEach(function(b){
      b.addEventListener("click", scheduleInject);
    });

    /* Voix : render() est appelé dans onend, on s'y accroche via MutationObserver */
    var box = el("cards");
    if(box && window.MutationObserver){
      var obs = new MutationObserver(function(){
        /* Quand #cards est modifié par le moteur public, on vérifie si Astou doit s'ajouter */
        clearTimeout(obs._t);
        obs._t = setTimeout(inject, 80);
      });
      obs.observe(box, {childList: true});
    }
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
