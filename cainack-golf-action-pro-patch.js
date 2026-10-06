/* Cainack DIOUF - Golf Saly - LA VOIX */
(function () {
  "use strict";
  var item = {
    id: "cainack-diouf-golf",
    nom: "Cainack DIOUF",
    titre: "Professeur de golf a Saly",
    badge: "EXPLORE - Golf",
    zone: "Saly - Senegal",
    url: "https://digiylyfe.com/assets/Carte%20promotionnelle%20de%20golf%20tropicale.png",
    type: "carte",
    statut: "public",
    categories: ["explore", "sport", "loisirs", "golf", "cours"],
    zones: ["saly", "senegal"],
    mots: ["cainack", "diouf", "golf", "professeur de golf", "cours de golf", "initiation golf", "perfectionnement golf", "sport", "loisirs", "saly"],
    description: "Professeur de golf a Saly pour initiation, cours individuels ou en groupe et perfectionnement."
  };
  var tries = 0;
  var timer = setInterval(function () {
    tries += 1;
    var list = window.DIGIY_ANNUAIRE_PUBLIC;
    if (Array.isArray(list)) {
      if (!list.some(function (x) { return x && x.id === item.id; })) list.unshift(item);
      clearInterval(timer);
    } else if (tries > 40) clearInterval(timer);
  }, 50);
})();