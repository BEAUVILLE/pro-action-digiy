/* DIGIYLYFE — digiy-retour-voix.js
   Rôle : bouton fixe retour La Voix du Business + nettoyage galerie DRIVER.
   Version : retour-voix-20260714-v7
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

  function normalize(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function isDriverGallery(){
    var host = normalize(location.hostname);
    var path = normalize(location.pathname);
    return host === "galerie-chauffeurs.digiylyfe.com" ||
      (host.endsWith(".github.io") && path.indexOf("galerie-chauffeurs") !== -1);
  }

  function loadLocalGalleryFix(){
    if(!isDriverGallery()) return;
    if(document.getElementById("digiyGalerieRuntimeFix")) return;

    var script = document.createElement("script");
    script.id = "digiyGalerieRuntimeFix";
    script.defer = true;
    script.src = location.hostname.toLowerCase().endsWith(".github.io")
      ? "/galerie-chauffeurs/galerie-runtime-fix.js?v=20260714-1"
      : "/galerie-runtime-fix.js?v=20260714-1";
    document.head.appendChild(script);
  }

  function isRemovedName(value){
    var text = normalize(value);
    return text.indexOf("baptiste") !== -1 ||
      text.indexOf("babacar") !== -1 ||
      text.indexOf("babacard") !== -1;
  }

  function isRemovedHref(value){
    var href = normalize(value);
    return href.indexOf("digiy-driver-part-bapt") !== -1 ||
      href.indexOf("chauffeur-baptiste") !== -1 ||
      href.indexOf("babacar") !== -1 ||
      href.indexOf("babacard") !== -1;
  }

  function containsRemovedDriver(node){
    if(!node) return false;

    if(isRemovedName(node.textContent)) return true;

    var links = Array.prototype.slice.call(
      node.querySelectorAll ? node.querySelectorAll("a[href]") : []
    );

    return links.some(function(a){
      return isRemovedHref(a.getAttribute("href"));
    });
  }

  function genericFeaturedCopy(){
    var title = document.querySelector("#featuredCardWrap .featured-head .title");
    var sub = document.querySelector("#featuredCardWrap .featured-head .sub");

    if(title){
      title.removeAttribute("data-i18n");
      title.textContent = "Chauffeur en vitrine";
    }

    if(sub){
      sub.removeAttribute("data-i18n");
      sub.textContent = "Le premier profil disponible selon les filtres apparaît ici. Ouvrez sa fiche officielle puis contactez-le directement.";
    }
  }

  function removeKnownStaticBlocks(){
    [
      "cardBtnTop",
      "heroCardBtn",
      "cardBtnSection",
      "cardBtnBottom",
      "chauffeur-baptiste",
      "baptisteDirectMain",
      "baptisteDirectAlt"
    ].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.remove();
    });

    document.querySelectorAll("a[href]").forEach(function(el){
      if(isRemovedHref(el.getAttribute("href"))) el.remove();
    });
  }

  function removeDynamicCards(){
    document.querySelectorAll("#drivers .driver").forEach(function(card){
      if(containsRemovedDriver(card)) card.remove();
    });

    var featured = document.getElementById("featuredCardArea");
    if(featured && containsRemovedDriver(featured)){
      featured.className = "featured-empty";
      featured.textContent = "Ce profil n’est plus disponible. Choisissez un autre chauffeur dans la galerie.";
    }
  }

  function refreshVisibleCount(){
    var visible = document.querySelectorAll("#drivers .driver").length;
    var count = document.getElementById("countPill");
    if(count) count.textContent = visible + " chauffeur(s)";
  }

  function cleanDriverGallery(){
    if(!isDriverGallery()) return;

    removeKnownStaticBlocks();
    removeDynamicCards();
    genericFeaturedCopy();
    refreshVisibleCount();
  }

  function protectAudioCopy(){
    if(!isDriverGallery() || typeof window.t !== "function" || window.t.__digiyRemovedDrivers) return;

    var original = window.t;
    var wrapped = function(key){
      var args = Array.prototype.slice.call(arguments, 1);

      if(key === "audio_spoken"){
        return "Bienvenue dans DIGIY DRIVER Ambassadeur. Ici, le client regarde les profils disponibles, la zone, le véhicule et la fiche du chauffeur avant de choisir. Il contacte ensuite directement le chauffeur par WhatsApp ou par SMS. Zéro commission. Le chauffeur garde sa relation, son nom et son argent. Le terrain garde la main.";
      }

      if(key === "featured_title") return "Chauffeur en vitrine";
      if(key === "featured_sub") return "Le premier profil disponible selon les filtres apparaît ici. Ouvrez sa fiche officielle puis contactez-le directement.";

      return original.apply(this, [key].concat(args));
    };

    wrapped.__digiyRemovedDrivers = true;
    window.t = wrapped;
  }

  var cleaning = false;

  function scheduleClean(){
    if(cleaning) return;
    cleaning = true;

    requestAnimationFrame(function(){
      cleaning = false;
      protectAudioCopy();
      cleanDriverGallery();
    });
  }

  if(document.body){
    inject();
    loadLocalGalleryFix();
    scheduleClean();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      inject();
      loadLocalGalleryFix();
      scheduleClean();
    });
  } else {
    inject();
    loadLocalGalleryFix();
    scheduleClean();
  }

  window.addEventListener("load", function(){
    inject();
    loadLocalGalleryFix();
    scheduleClean();
  });

  if(isDriverGallery() && "MutationObserver" in window){
    var observer = new MutationObserver(scheduleClean);
    observer.observe(document.documentElement, {
      childList:true,
      subtree:true
    });
  }

  setTimeout(inject, 500);
  setTimeout(inject, 1500);
  setTimeout(loadLocalGalleryFix, 100);
  setTimeout(loadLocalGalleryFix, 900);
  setTimeout(scheduleClean, 100);
  setTimeout(scheduleClean, 700);
  setTimeout(scheduleClean, 1800);
  setTimeout(scheduleClean, 3500);
})();