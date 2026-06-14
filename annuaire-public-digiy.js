/* =========================================================
   annuaire-public-digiy.js
   DIGIYLYFE — Annuaire public des fiches PRO et partenaires

   Rôle :
   - Nourrir la voix publique sans modifier l’index à chaque fiche
   - Classer par métier / secteur / catégorie / statut
   - Remonter les fiches directes avant les modules généraux

   Doctrine :
   - Public = visible côté client
   - Partenaire référencé = pas de PIN, pas de cockpit
   - PRO = fiche visible + priorité plus haute
   ========================================================= */

window.DIGIY_PUBLIC_DIRECTORY = [
  {
    id: "helage-plombier-saly",
    public: true,

    statut: "partenaire_qualifie",
    labelStatut: "Partenaire qualifié DIGIY",
    priorite: 10,

    nom: "Helage",
    titre: "Helage — Plombier Saly",
    metier: "plombier",
    activite: "Plombier multi-services",
    categorie: "artisan",
    sousCategorie: "plomberie",

    secteur: "Saly",
    zones: ["Saly", "Petite Côte", "Ngaparou", "Somone", "Mbour"],

    mots: [
      "plombier",
      "plomberie",
      "fuite",
      "robinet",
      "robinetterie",
      "wc",
      "toilette",
      "lavabo",
      "douche",
      "salle de bain",
      "chauffe-eau",
      "canalisation",
      "evacuation",
      "évacuation",
      "depannage",
      "dépannage",
      "installation",
      "sanitaire"
    ],

    description:
      "Plombier multi-services à Saly : dépannage, fuites, robinets, WC, installation, salle de bain et petits chantiers sanitaires.",

    url: "https://helage-plombier.digiylyfe.com/",
    whatsapp: "221774513523",

    icon: "🔧",
    image:
      "https://digiylyfe.net/wp-content/uploads/2026/05/ChatGPT-Image-14-mai-2026-04_01_44.png",

    actions: {
      ouvrir: "Ouvrir la fiche",
      whatsapp: "WhatsApp direct",
      appel: "Appeler"
    }
  },

  {
    id: "chez-baptiste-appartement-saly",
    public: true,

    statut: "fiche_loc_publique",
    labelStatut: "Fiche LOC publique DIGIY",
    priorite: 10,

    nom: "CHEZ BAPTISTE",
    titre: "CHEZ BAPTISTE — Appartement à Saly",
    metier: "logement",
    activite: "Appartement à Saly",
    categorie: "loc",
    sousCategorie: "appartement",

    secteur: "Saly",
    zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],

    mots: [
      "logement",
      "appartement",
      "location",
      "loc",
      "chambre",
      "séjour",
      "sejour",
      "famille",
      "amis",
      "week-end",
      "weekend",
      "vacances",
      "saly",
      "petite cote",
      "petite côte",
      "4 personnes",
      "quartier calme",
      "quartier paisible",
      "senelec",
      "sénélec",
      "réserver",
      "reserver"
    ],

    description:
      "Appartement confortable à Saly pour jusqu’à 4 personnes, quartier paisible, réservation directe propriétaire, paiement direct et contact WhatsApp.",

    url: "https://part-chez-baptiste.digiylyfe.com/",
    whatsapp: "221771342889",

    icon: "🏠",
    image: "",

    infos: {
      capacite: "4 personnes max",
      nuit: "30 000 FCFA",
      semaine: "175 000 FCFA",
      mois: "550 000 FCFA",
      note: "Sénélec en sus selon consommation"
    },

    actions: {
      ouvrir: "Ouvrir la fiche",
      whatsapp: "Demander par WhatsApp",
      appel: "Appeler"
    }
    },

{
  id: "astou-boutique-saly",
  public: true,

  statut: "fiche_market_publique",
  labelStatut: "Fiche boutique DIGIY",
  priorite: 10,

  nom: "Astou Boutique",
  titre: "Astou Boutique — Maison, plage & élégance",
  metier: "boutique",
  activite: "Linge de maison, plage, style et beauté",
  categorie: "commerce",
  sousCategorie: "linge-maison",

  secteur: "Saly",
  zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],

  mots: [
    "boutique",
    "commerce",
    "magasin",
    "linge",
    "linge de maison",
    "serviette",
    "serviettes",
    "drap",
    "draps",
    "peignoir",
    "peignoirs",
    "fouta",
    "foutas",
    "plage",
    "piscine",
    "transat",
    "transats",
    "hotel",
    "hôtel",
    "villa",
    "maison d'hote",
    "maison d’hôte",
    "location courte duree",
    "location courte durée",
    "robe",
    "robes",
    "tenue",
    "tenues",
    "confection",
    "beaute",
    "beauté",
    "creme",
    "crème",
    "cosmetique",
    "cosmétique"
  ],

  description:
    "Astou Boutique à Saly : linge de maison, serviettes, draps, peignoirs, foutas, articles plage, tenues stylées, confection et produits de beauté.",

  url: "https://astou-boutique.digiylyfe.com/",
  whatsapp: "221778765785",

  icon: "👜",
  image: "",

  infos: {
    familles: "Maison, hôtels, villas, plage, style et beauté",
    zone: "Saly, Sénégal",
    note: "Contacter Astou pour connaître les produits disponibles et préparer la visite."
  },

  actions: {
    ouvrir: "Ouvrir la boutique",
    whatsapp: "WhatsApp direct",
    appel: "Appeler"
  }
},

{
  id: "digiy-driver-ambassadeur-baptiste",
  public: true,

  statut: "fiche_driver_publique",
  labelStatut: "Fiche DRIVER publique DIGIY",
  priorite: 10,

  nom: "DIGIY DRIVER Ambassadeur",
  titre: "DIGIY DRIVER Ambassadeur — Chauffeur avec style",
  metier: "chauffeur",
  activite: "Service chauffeur avec contact direct",
  categorie: "transport",
  sousCategorie: "driver",

  secteur: "Saly",
  zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone", "AIBD", "Dakar"],

  mots: [
    "chauffeur",
    "driver",
    "taxi",
    "transport",
    "voiture",
    "véhicule",
    "vehicule",
    "trajet",
    "course",
    "aibd",
    "aéroport",
    "aeroport",
    "dakar",
    "saly",
    "mbour",
    "petite côte",
    "petite cote",
    "ponctualité",
    "ponctualite",
    "discrétion",
    "discretion",
    "ambassadeur",
    "carte chauffeur",
    "qr chauffeur",
    "contact direct"
  ],

  description:
    "Vitrine chauffeur DIGIY DRIVER Ambassadeur : présentation propre, QR chauffeur, contact direct, sérieux, discrétion, ponctualité et savoir-vivre.",

  url: "https://digiy-driver-part-bapt.digiylyfe.com/",
  whatsapp: "",

  icon: "🚗",
  image: "",

  infos: {
    service: "Chauffeur / DRIVER",
    note: "Contact direct et carte chauffeur selon profil disponible."
  },

  actions: {
    ouvrir: "Ouvrir la fiche DRIVER",
    whatsapp: "WhatsApp direct",
    appel: "Appeler"
  }
}
];

/* =========================================================
   Helper simple : permet à l’index voix de lire l’annuaire
   sans connaître la structure interne.
   ========================================================= */

window.DIGIY_GET_PUBLIC_DIRECTORY = function () {
  return Array.isArray(window.DIGIY_PUBLIC_DIRECTORY)
    ? window.DIGIY_PUBLIC_DIRECTORY.filter(function (item) {
        return item && item.public === true;
      })
    : [];
};
