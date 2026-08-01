/* DIGIYLYFE — Fiche publique Nazir Driver — 2026-08-01 */
(function (global) {
  "use strict";

  const NAZIR_DRIVER = {
    id: "nazir-driver",
    kind: "directory",
    public: true,
    icon: "🚗",
    nom: "Nazir Driver",
    title: "Nazir Driver — Chauffeur Saly · Mbour · AIBD",
    metier: "chauffeur",
    activite: "Trajets directs · Transferts aéroport · Déplacements régionaux",
    categorie: "DRIVER",
    sousCategorie: "chauffeur privé",
    secteur: "Saly · Mbour · AIBD · Multi-région",
    zoneAffichage: "Saly · Mbour · AIBD · Multi-région",
    zones: ["Saly", "Mbour", "AIBD", "Petite Côte", "Multi-région", "Sénégal"],
    statut: "fiche_officielle",
    labelStatut: "Fiche officielle DIGIY DRIVER",
    priorite: 120,
    priority: 120,
    phone: "221778310298",
    whatsapp: "221778310298",
    url: "https://galerie-chauffeurs.digiylyfe.com/nazir-driver.html",
    cardImageUrl: "https://galerie-chauffeurs.digiylyfe.com/nazir-driver-card.svg",
    description: "Nazir Driver est disponible à Saly, Mbour, AIBD et multi-région pour les trajets directs, transferts aéroport, déplacements régionaux et mises à disposition. Contact direct par téléphone ou WhatsApp.",
    keys: [
      "nazir", "nazir driver", "chauffeur", "chauffeur privé", "chauffeur prive",
      "driver", "taxi", "vtc", "transport", "trajet", "course", "transfert",
      "aibd", "aéroport", "aeroport", "saly", "mbour", "petite côte", "petite cote",
      "multi-région", "multi region", "mise à disposition", "mise a disposition"
    ],
    forbidden: ["chauffe eau", "chauffage", "fuite", "plomberie"],
    wa: "Bonjour Nazir Driver, je viens de DIGIYLYFE et je souhaite organiser un trajet."
  };

  function addNazir(source) {
    const list = Array.isArray(source) ? source.slice() : [];
    const index = list.findIndex(function (item) {
      return item && item.id === NAZIR_DRIVER.id;
    });
    if (index >= 0) list[index] = NAZIR_DRIVER;
    else list.unshift(NAZIR_DRIVER);
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
    return addNazir(base);
  };

  global.DIGIY_PUBLIC_DIRECTORY = addNazir(global.DIGIY_PUBLIC_DIRECTORY);

  if (global.DIGIY_ANNUAIRE_PUBLIC) {
    global.DIGIY_ANNUAIRE_PUBLIC.version = "20260801-nazir-driver";
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = addNazir(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }

  if (global.DIGIY_ANNUAIRE_MULTI) {
    global.DIGIY_ANNUAIRE_MULTI.version = "20260801-nazir-driver";
    global.DIGIY_ANNUAIRE_MULTI.annuaire = addNazir(global.DIGIY_ANNUAIRE_MULTI.annuaire);
  }

  try {
    global.dispatchEvent(new CustomEvent("digiy:nazir-driver-ready", {
      detail: { id: NAZIR_DRIVER.id, phone: NAZIR_DRIVER.phone }
    }));
  } catch (_) {}
})(window);
