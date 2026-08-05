/* DIGIYLYFE — Fiche publique FG NAILS — 2026-08-05 */
(function (global) {
  "use strict";

  const FG_NAILS = {
    id: "fg-nails-saly",
    kind: "directory",
    public: true,
    icon: "💅",
    nom: "FG NAILS",
    title: "FG NAILS — Onglerie · Beauté · Bien-être à Saly",
    metier: "onglerie et soins de beauté",
    activite: "Onglerie · Soins de beauté · Massage modelant · Lipocavitation · Produits d’hygiène femme et homme",
    categorie: "BEAUTÉ",
    sousCategorie: "onglerie · esthétique · bien-être",
    secteur: "Résidence Nafil · Saly",
    zoneAffichage: "Résidence Nafil · face à la Clinique des Yeux · Saly",
    zones: ["Saly", "Résidence Nafil", "Petite Côte", "Mbour", "Sénégal"],
    statut: "fiche_officielle",
    labelStatut: "Fiche officielle DIGIYLYFE",
    priorite: 125,
    priority: 125,
    phone: "221780127062",
    whatsapp: "221780127062",
    url: "https://f-g-nails.digiylyfe.com/",
    productsUrl: "https://f-g-nails.digiylyfe.com/hygiene-bien-etre-saly.html",
    cardImageUrl: "https://f-g-nails.digiylyfe.com/fg-nails-carte-officielle.webp",
    description: "FG NAILS accueille sa clientèle à la Résidence Nafil à Saly pour l’onglerie, les soins de beauté, le massage modelant, la lipocavitation et la présentation de produits d’hygiène pour femmes et hommes. Contact direct par téléphone ou WhatsApp.",
    keys: [
      "fg nails", "f g nails", "onglerie", "ongles", "manucure", "pédicure", "pedicure",
      "beauté", "beaute", "esthétique", "esthetique", "soins de beauté", "soins de beaute",
      "bien-être", "bien etre", "massage modelant", "lipocavitation", "hygiène femme",
      "hygiene femme", "hygiène homme", "hygiene homme", "cosmétique", "cosmetique",
      "saly", "résidence nafil", "residence nafil", "clinique des yeux", "petite côte", "petite cote"
    ],
    forbidden: ["garage", "chauffeur", "plomberie", "maçon", "macon", "électricité", "electricite"],
    wa: "Bonjour FG NAILS, je viens de DIGIYLYFE et je souhaite un renseignement ou un rendez-vous."
  };

  function addFgNails(source) {
    const list = Array.isArray(source) ? source.slice() : [];
    const index = list.findIndex(function (item) {
      return item && item.id === FG_NAILS.id;
    });
    if (index >= 0) list[index] = FG_NAILS;
    else list.unshift(FG_NAILS);
    return list;
  }

  const previousGetter = typeof global.DIGIY_GET_PUBLIC_DIRECTORY === "function"
    ? global.DIGIY_GET_PUBLIC_DIRECTORY.bind(global)
    : null;

  global.DIGIY_GET_PUBLIC_DIRECTORY = function () {
    let base = [];
    try {
      base = previousGetter ? previousGetter() : global.DIGIY_PUBLIC_DIRECTORY;
    } catch (_) {
      base = global.DIGIY_PUBLIC_DIRECTORY;
    }
    return addFgNails(base);
  };

  global.DIGIY_PUBLIC_DIRECTORY = addFgNails(global.DIGIY_PUBLIC_DIRECTORY);

  if (global.DIGIY_ANNUAIRE_PUBLIC) {
    global.DIGIY_ANNUAIRE_PUBLIC.version = "20260805-fg-nails-saly";
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = addFgNails(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }

  if (global.DIGIY_ANNUAIRE_MULTI) {
    global.DIGIY_ANNUAIRE_MULTI.version = "20260805-fg-nails-saly";
    global.DIGIY_ANNUAIRE_MULTI.annuaire = addFgNails(global.DIGIY_ANNUAIRE_MULTI.annuaire);
  }

  try {
    global.dispatchEvent(new CustomEvent("digiy:fg-nails-ready", {
      detail: { id: FG_NAILS.id, phone: FG_NAILS.phone }
    }));
  } catch (_) {}
})(window);