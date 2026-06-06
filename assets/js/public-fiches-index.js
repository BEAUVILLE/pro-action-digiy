/* DIGIYLYFE — index public des fiches
   Une fiche pro = une entrée. La voix publique cherche ici avant de remonter une carte.
   Doctrine : PUBLIC = demande + fiches + contact direct. PRO = module métier protégé.
*/
(function(){
  "use strict";

  var VERSION = "public-fiches-index-20260606";

  var FICHES = [
    {
      id: "astou-boutique-saly",
      status: "active",
      name: "Astou Boutique",
      title: "Astou Boutique — linge & serviettes",
      module_public: "MARKET",
      module_pro: "POS",
      type: "boutique",
      metiers: ["boutique", "commerce", "linge", "textile", "maison", "plage"],
      categories: ["serviettes", "draps", "peignoirs", "foutas", "linge maison", "plage", "tenues", "crèmes"],
      products: ["serviette", "serviettes", "drap", "draps", "peignoir", "peignoirs", "fouta", "foutas", "linge", "linge maison", "linge de bain", "robe", "tenue", "crème"],
      zones: ["Saly", "Petite Côte", "Mbour"],
      keywords: [
        "magasin de serviettes à saly",
        "magasin serviettes saly",
        "boutique serviettes saly",
        "serviettes saly",
        "linge saly",
        "draps saly",
        "linge maison saly",
        "boutique linge saly",
        "astou boutique"
      ],
      desc: "Serviettes, draps, peignoirs, foutas, linge maison, plage, tenues et crèmes. Contact direct avec la boutique.",
      zone_label: "Saly · Petite Côte",
      icon: "🛍️",
      tag: "#boutique locale · #linge · Saly",
      url: "https://astou-boutique.digiylyfe.com/",
      cta: "Voir Astou Boutique",
      phone: "221771342889",
      whatsapp_text: "Bonjour Astou Boutique, je viens de DIGIY. Je cherche des serviettes / du linge à Saly.",
      priority: 100
    }
  ];

  function norm(v){
    return String(v || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
  }

  function hasAny(text, arr){
    var n = norm(text);
    return (arr || []).some(function(x){ return n.indexOf(norm(x)) >= 0; });
  }

  function scoreFiche(query, fiche){
    var q = norm(query);
    if(!q) return 0;
    var score = 0;
    function add(list, points){
      (list || []).forEach(function(x){
        var nx = norm(x);
        if(nx && q.indexOf(nx) >= 0) score += points;
      });
    }
    add(fiche.keywords, 30);
    add(fiche.products, 12);
    add(fiche.categories, 10);
    add(fiche.metiers, 8);
    add(fiche.zones, 14);
    if(q.indexOf(norm(fiche.name)) >= 0 || q.indexOf(norm(fiche.title)) >= 0) score += 40;
    if(hasAny(q, ["magasin", "boutique", "commerce", "acheter", "je cherche", "je veux"]) && fiche.type === "boutique") score += 12;
    if(hasAny(q, ["serviette", "serviettes", "linge", "drap", "draps", "bain"]) && hasAny(q, ["saly", "petite cote", "petite côte"])) score += 40;
    score += Number(fiche.priority || 0) / 100;
    return score;
  }

  function search(query, limit){
    return FICHES
      .filter(function(f){ return f.status !== "inactive"; })
      .map(function(f){ return Object.assign({}, f, {score: scoreFiche(query, f)}); })
      .filter(function(f){ return f.score > 0; })
      .sort(function(a,b){ return b.score - a.score; })
      .slice(0, Number(limit || 8));
  }

  function toCard(fiche, originalQuery){
    var msg = fiche.whatsapp_text || ("Bonjour, je viens de DIGIY. Mon besoin : " + (originalQuery || fiche.title));
    return {
      module: fiche.module_public,
      icon: fiche.icon || "📍",
      tag: fiche.tag || "#fiche publique",
      title: fiche.title || fiche.name,
      zone: fiche.zone_label || (fiche.zones || []).join(" · "),
      desc: fiche.desc || "Fiche publique DIGIY.",
      url: fiche.url,
      cta: fiche.cta || "Voir la fiche",
      wa: msg,
      source: "PUBLIC_FICHES_INDEX",
      fiche_id: fiche.id,
      score: fiche.score || 0
    };
  }

  function searchCards(query, limit){
    return search(query, limit).map(function(f){ return toCard(f, query); });
  }

  window.DIGIY_PUBLIC_FICHES_INDEX = {
    version: VERSION,
    fiches: FICHES,
    norm: norm,
    search: search,
    searchCards: searchCards,
    toCard: toCard
  };
})();
