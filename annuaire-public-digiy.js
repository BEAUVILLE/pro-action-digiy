/*
  annuaire-public-digiy.js
  DIGIYLYFE — Annuaire public officiel de LA VOIX
  Version : 20260720-bcheikh-v1

  Résultats attendus :
  plombier     → Babacar + Helage
  électricien  → Kourant
  maçon        → Mbaye
  chauffeur    → Lamine
  vêtements    → BCHEIKH
*/

(function (global) {
  "use strict";

  const VERSION = "20260720-bcheikh-v1";
  const MAX_RESULTS = 6;

  const DIRECTORY = [
    {
      id: "babacar-plombier-pro-saly",
      kind: "directory",
      public: true,

      icon: "🔧",

      nom: "Babacar Plombier Pro",
      title: "Babacar Plombier Pro — Saly",

      metier: "plombier",
      activite:
        "Plomberie · dépannage · installation sanitaire",

      categorie: "BUILD",
      sousCategorie: "plomberie",

      secteur: "Saly",
      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],

      statut: "fiche_officielle",
      labelStatut:
        "Fiche officielle DIGIY BUILD",

      priorite: 100,

      phone: "221776125124",
      whatsapp: "221776125124",

      url:
        "https://babacar-plombier-pro.digiylyfe.com/",

      description:
        "Dépannage de fuite, robinet, WC, lavabo, douche, chasse d’eau, tuyauterie, installation sanitaire et petits travaux de plomberie.",

      keys: [
        "babacar",
        "babacar plombier pro",

        "plombier",
        "plomberie",

        "fuite",
        "eau qui coule",
        "eau au sol",

        "robinet",
        "wc",
        "toilette",
        "lavabo",
        "douche",
        "chasse d eau",

        "tuyau",
        "tuyauterie",
        "canalisation",
        "evacuation",

        "sanitaire",
        "depannage",
        "installation"
      ],

      wa:
        "Bonjour Babacar Plombier Pro, je viens de DIGIYLYFE pour un besoin de plomberie."
    },

    {
      id: "helage-plombier-saly",
      kind: "directory",
      public: true,

      icon: "🔧",

      nom: "Helage",
      title: "Helage — Plombier Saly",

      metier: "plombier",
      activite:
        "Plomberie · dépannage · multi-services",

      categorie: "BUILD",
      sousCategorie: "plomberie",

      secteur: "Saly",
      zones: [
        "Saly",
        "Mbour",
        "Ngaparou",
        "Somone",
        "Petite Côte"
      ],

      statut: "partenaire_qualifie",
      labelStatut:
        "Partenaire qualifié DIGIY BUILD",

      priorite: 90,

      phone: "221774513523",
      whatsapp: "221774513523",

      url:
        "https://helage-plombier.digiylyfe.com/",

      description:
        "Plomberie multi-services, dépannage, fuites, robinets, WC, évacuations et installations sanitaires.",

      keys: [
        "helage",
        "plombier",
        "plomberie",
        "fuite",
        "fuites",
        "robinet",
        "robinetterie",
        "wc",
        "toilette",
        "lavabo",
        "douche",
        "chauffe-eau",
        "chauffe eau",
        "desengorgement",
        "désengorgement",
        "evacuation",
        "évacuation",
        "depannage",
        "dépannage",
        "installation",
        "salle de bain",
        "sanitaire",
        "ndox"
      ],

      wa:
        "Bonjour Helage, je viens de DIGIYLYFE pour votre service de plomberie à Saly."
    },

    {
      id: "partenaires-kourant",
      kind: "directory",
      public: true,

      icon: "⚡",

      nom: "Kourant Électricien",
      title: "Kourant Électricien — Saly",

      metier: "électricien",
      activite:
        "Installation · rénovation · dépannage électrique",

      categorie: "BUILD",
      sousCategorie: "électricité",

      secteur: "Saly",
      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],

      statut: "fiche_officielle",
      labelStatut:
        "Fiche officielle DIGIY BUILD",

      priorite: 100,

      phone: "221772084781",
      whatsapp: "221772084781",

      url:
        "https://kourant.digiylyfe.com/",

      cardImageUrl:
        "https://kourant.digiylyfe.com/carte-visite.png?v=20260714-v3",

      description:
        "Installation électrique, rénovation, tableaux, disjoncteurs, prises, éclairage, recherche de panne et dépannage.",

      keys: [
        "kourant",
        "courant",

        "electricien",
        "electricite",

        "plus de courant",
        "panne electrique",

        "disjoncteur",
        "tableau electrique",

        "prise",
        "interrupteur",

        "lumiere",
        "eclairage",

        "cablage",
        "installation electrique",
        "renovation electrique",
        "depannage electrique"
      ],

      wa:
        "Bonjour Kourant, je viens de DIGIYLYFE pour un besoin en électricité."
    },

    {
      id: "partenaires-mbaye",
      kind: "directory",
      public: true,

      icon: "🧱",

      nom: "Mbaye Diouf",
      title: "Mbaye Diouf — Bâtisseur",

      metier: "bâtisseur",
      activite:
        "Villas modernes · piscines · rénovation · extensions",

      categorie: "BUILD",
      sousCategorie: "construction",

      secteur:
        "Saly · Mbour · Thiès",

      zones: [
        "Saly",
        "Mbour",
        "Thiès",
        "Petite Côte"
      ],

      statut: "fiche_officielle",
      labelStatut:
        "Fiche officielle DIGIY BUILD",

      priorite: 100,

      phone: "221776427113",
      whatsapp: "221776427113",

      url:
        "https://mbaye-macon.digiylyfe.com/",

      cardImageUrl:
        "https://mbaye-macon.digiylyfe.com/carte-visite.png?v=20260714-v3",

      description:
        "Construction de villas, piscines béton, rénovation, extensions et finitions haut de gamme. Devis après visite.",

      keys: [
        "mbaye",
        "mbaye diouf",

        "macon",
        "maconnerie",
        "batisseur",
        "entrepreneur",

        "construction",
        "construire une villa",
        "villa",

        "piscine",
        "piscine beton",

        "renovation",
        "extension",
        "agrandir",

        "fondation",
        "mur",
        "dalle",
        "beton",
        "chantier",
        "finitions",
        "devis"
      ],

      wa:
        "Bonjour Mbaye, je viens de DIGIYLYFE pour un projet de construction ou de rénovation."
    },

    {
      id: "lamine-driver",
      kind: "directory",
      public: true,

      icon: "🚗",

      nom: "Lamine",
      title: "Lamine — Chauffeur privé",

      metier: "chauffeur",
      activite:
        "Transferts AIBD · Petite Côte · trajets privés",

      categorie: "DRIVER",
      sousCategorie:
        "transport de personnes",

      secteur:
        "AIBD · Saly · Mbour · Thiès",

      zones: [
        "AIBD",
        "Saly",
        "Mbour",
        "Thiès",
        "Dakar",
        "Petite Côte"
      ],

      statut: "fiche_officielle",
      labelStatut:
        "Fiche officielle DIGIY DRIVER",

      priorite: 100,

      phone: "221784413680",
      whatsapp: "221784413680",

      url:
        "https://partenaire-lamine.digiylyfe.com/",

      cardImageUrl:
        "https://partenaire-lamine.digiylyfe.com/carte-visite.png?v=20260714-v3",

      description:
        "Chauffeur privé pour transferts AIBD, trajets vers Saly, Mbour, Thiès, Dakar et circuits sur la Petite Côte.",

      keys: [
        "lamine",

        "chauffeur",
        "chauffeur prive",
        "driver",
        "taxi",
        "vtc",

        "transport de personne",

        "aibd",
        "aeroport",
        "avion",
        "vol",

        "transfert",
        "trajet",
        "course",

        "venir me chercher",
        "recuperer quelqu un",
        "deposer quelqu un",

        "bagages"
      ],

      forbidden: [
        "chauffe eau",
        "chauffage",
        "fuite",
        "plomberie"
      ],

      wa:
        "Bonjour Lamine, je viens de DIGIYLYFE pour un besoin de transport."
    },

    {
      id: "digiy-solaire-installation-depannage",
      kind: "directory",
      public: true,

      icon: "☀️",

      nom: "DIGIY Solaire",
      title:
        "DIGIY Solaire — Installation et dépannage",

      metier: "solaire",
      activite:
        "Installation · diagnostic · entretien solaire",

      categorie: "BUILD",
      sousCategorie: "solaire",

      secteur:
        "Dakar · Saly · Sénégal",

      zones: [
        "Dakar",
        "Saly",
        "Mbour",
        "Thiès",
        "Petite Côte",
        "Sénégal"
      ],

      statut: "fiche_publique",
      labelStatut:
        "Fiche publique DIGIY BUILD",

      priorite: 90,

      phone: "221771342889",
      whatsapp: "221771342889",

      url:
        "https://digiy-solaire.digiylyfe.com/",

      description:
        "Installation solaire, diagnostic batterie, régulateur, câblage, entretien et dépannage.",

      keys: [
        "solaire",
        "panneau solaire",
        "batterie solaire",
        "regulateur",
        "onduleur",
        "energie solaire",
        "installation solaire",
        "depannage solaire",
        "diagnostic solaire"
      ],

      wa:
        "Bonjour DIGIY Solaire, je viens de DIGIYLYFE pour un besoin solaire."
    },

    {
      id: "astou-boutique",
      kind: "directory",
      public: true,

      icon: "👜",

      nom: "Astou Boutique",
      title: "Astou Boutique — Saly",

      metier: "boutique",
      activite:
        "Linge de maison · plage · style · beauté",

      categorie: "MARKET",
      sousCategorie: "boutique",

      secteur: "Saly",

      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],

      statut: "fiche_publique",
      labelStatut:
        "Fiche publique DIGIY MARKET",

      priorite: 90,

      phone: "221778765785",
      whatsapp: "221778765785",

      url:
        "https://astou-boutique.digiylyfe.com/",

      description:
        "Linge de maison, serviettes, draps, peignoirs, foutas, articles de plage, tenues et beauté.",

      keys: [
        "astou",
        "boutique",
        "commerce",
        "magasin",

        "linge",
        "serviette",
        "drap",
        "peignoir",
        "fouta",

        "plage",
        "robe",
        "tenue",
        "beaute"
      ],

      wa:
        "Bonjour Astou Boutique, je viens de DIGIYLYFE pour voir vos produits."
    },

    {
      id: "bcheikh-market-saly",
      kind: "directory",
      public: true,

      icon: "👕",

      nom: "BCHEIKH",
      title: "BCHEIKH — Vêtements à Saly",

      metier: "boutique de vêtements",
      activite:
        "Tee-shirts · polos · caleçons · packs de 3 pièces",

      categorie: "MARKET",
      sousCategorie: "vêtements homme",

      secteur: "Saly",

      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],

      statut: "fiche_publique",
      labelStatut:
        "Fiche publique DIGIY MARKET",

      priorite: 101,

      phone: "",
      whatsapp: "",

      url:
        "https://bcheikh.digiylyfe.com/",

      description:
        "Tee-shirts et polos à 7 000 FCFA l’unité, pack de 3 pièces à 20 000 FCFA et poche de 3 caleçons à 7 000 FCFA. Paiement direct au vendeur.",

      keys: [
        "bcheikh",
        "b cheikh",
        "vetement",
        "vetements",
        "habit",
        "habits",
        "mode",
        "boutique vetements",
        "tee-shirt",
        "tee shirt",
        "t-shirt",
        "tshirt",
        "polo",
        "polos",
        "calecon",
        "calecons",
        "sous-vetement",
        "sous vetement",
        "sous-vetements",
        "sous vetements",
        "pack 3 pieces",
        "pack de 3 pieces",
        "trois pieces",
        "poche de 3 calecons",
        "7000 fcfa",
        "20000 fcfa"
      ],

      wa:
        "Bonjour BCHEIKH, je viens de DIGIYLYFE pour voir vos vêtements."
    },

    {
      id: "poulet-tonton",
      kind: "directory",
      public: true,

      icon: "🐔",

      nom: "Poulet Tonton",
      title:
        "Poulet Tonton — Vente directe",

      metier:
        "vente de poulets",

      activite:
        "Poulets environ 2,5 kg · prix maintenu 3 500 FCFA",

      categorie: "MARKET",
      sousCategorie: "alimentation",

      secteur:
        "Saly · Mbour · Petite Côte",

      zones: [
        "Saly",
        "Mbour",
        "Petite Côte",
        "Sénégal"
      ],

      statut: "fiche_publique",
      labelStatut:
        "Fiche publique DIGIY MARKET",

      priorite: 88,

      phone: "221778329612",
      whatsapp: "221778329612",

      url:
        "https://poulet-tonton.digiylyfe.com/",

      description:
        "Poulets disponibles en vente directe. Disponibilité et quantité à confirmer directement.",

      keys: [
        "poulet",
        "poulets",
        "volaille",
        "poulailler",
        "vente directe",
        "2 5 kg",
        "3500",
        "alimentation"
      ],

      wa:
        "Bonjour, je viens de DIGIYLYFE pour les poulets disponibles."
    }
  ];

  const INTENTIONS = [
    {
      canon: "plombier",
      module: "BUILD",

      mots: [
        "plombier",
        "plomberie",
        "fuite",
        "eau qui coule",
        "eau au sol",
        "robinet",
        "wc",
        "toilette",
        "lavabo",
        "douche",
        "chasse d eau",
        "tuyau",
        "canalisation",
        "sanitaire"
      ]
    },

    {
      canon: "électricien",
      module: "BUILD",

      mots: [
        "electricien",
        "electricite",
        "plus de courant",
        "panne electrique",
        "disjoncteur",
        "tableau electrique",
        "prise",
        "interrupteur",
        "lumiere",
        "eclairage",
        "cablage"
      ]
    },

    {
      canon: "construction",
      module: "BUILD",

      mots: [
        "macon",
        "maconnerie",
        "batisseur",
        "entrepreneur",
        "construction",
        "villa",
        "piscine",
        "renovation",
        "extension",
        "fondation",
        "mur",
        "dalle",
        "beton",
        "chantier"
      ]
    },

    {
      canon: "solaire",
      module: "BUILD",

      mots: [
        "solaire",
        "panneau solaire",
        "batterie solaire",
        "regulateur",
        "onduleur",
        "energie solaire"
      ]
    },

    {
      canon: "chauffeur",
      module: "DRIVER",

      mots: [
        "chauffeur",
        "driver",
        "taxi",
        "vtc",
        "aibd",
        "aeroport",
        "avion",
        "vol",
        "transport",
        "trajet",
        "course",
        "transfert",
        "venir me chercher",
        "recuperer quelqu un"
      ],

      interdits: [
        "chauffe eau",
        "chauffage"
      ]
    },

    {
      canon: "boutique",
      module: "MARKET",

      mots: [
        "boutique",
        "commerce",
        "magasin",
        "acheter",
        "produit",
        "linge",
        "serviette",
        "drap",
        "robe"
      ]
    },

    {
      canon: "vêtements",
      module: "MARKET",

      mots: [
        "bcheikh",
        "b cheikh",
        "vetement",
        "vetements",
        "habit",
        "habits",
        "mode",
        "boutique vetements",
        "tee-shirt",
        "tee shirt",
        "t-shirt",
        "tshirt",
        "polo",
        "polos",
        "calecon",
        "calecons",
        "sous-vetement",
        "sous vetement",
        "sous-vetements",
        "sous vetements",
        "pack 3 pieces",
        "pack de 3 pieces",
        "trois pieces",
        "poche de 3 calecons"
      ]
    },

    {
      canon: "poulet",
      module: "MARKET",

      mots: [
        "poulet",
        "poulets",
        "volaille",
        "poulailler"
      ]
    },

    {
      canon: "logement",
      module: "LOC",

      mots: [
        "logement",
        "location",
        "appartement",
        "villa a louer",
        "chambre",
        "studio",
        "dormir",
        "hebergement",
        "hotel"
      ]
    },

    {
      canon: "restaurant",
      module: "RESA",

      mots: [
        "restaurant",
        "resto",
        "table",
        "reserver",
        "manger",
        "diner",
        "dejeuner",
        "a emporter"
      ]
    },

    {
      canon: "emploi",
      module: "JOBS",

      mots: [
        "emploi",
        "job",
        "travail",
        "mission",
        "stage",
        "recruter",
        "candidat"
      ]
    },

    {
      canon: "explore",
      module: "EXPLORE",

      mots: [
        "sortie",
        "visite",
        "visiter",
        "decouvrir",
        "tourisme",
        "activite",
        "plage",
        "excursion"
      ]
    }
  ];

  const ZONES = [
    {
      canon: "Saly",
      mots: [
        "saly",
        "sally"
      ]
    },

    {
      canon: "Mbour",
      mots: [
        "mbour"
      ]
    },

    {
      canon: "Dakar",
      mots: [
        "dakar"
      ]
    },

    {
      canon: "AIBD",
      mots: [
        "aibd",
        "diass",
        "aeroport",
        "airport"
      ]
    },

    {
      canon: "Thiès",
      mots: [
        "thies"
      ]
    },

    {
      canon: "Petite Côte",

      mots: [
        "petite cote",
        "ngaparou",
        "somone",
        "nianning",
        "popenguine"
      ]
    },

    {
      canon: "Sénégal",
      mots: [
        "senegal"
      ]
    }
  ];

  const MODULE_ROUTES = {
    BUILD: {
      icon: "🏗️",
      title: "DIGIY BUILD",
      url:
        "https://build.digiylyfe.com/"
    },

    DRIVER: {
      icon: "🚗",
      title: "DIGIY DRIVER",
      url:
        "https://driver-client.digiylyfe.com/"
    },

    LOC: {
      icon: "🏠",
      title: "DIGIY LOC",
      url:
        "https://loc.digiylyfe.com/"
    },

    RESA: {
      icon: "🍽️",
      title: "DIGIY RESA",
      url:
        "https://resa-table-resto.digiylyfe.com/"
    },

    MARKET: {
      icon: "🛍️",
      title: "DIGIY MARKET",
      url:
        "https://market.digiylyfe.com/"
    },

    JOBS: {
      icon: "💼",
      title: "DIGIY JOBS",
      url:
        "https://jobs.digiylyfe.com/"
    },

    EXPLORE: {
      icon: "🗺️",
      title: "DIGIY EXPLORE",
      url:
        "https://explore.digiylyfe.com/"
    }
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /[’']/g,
        " "
      )

      .replace(
        /[^a-z0-9\s]/g,
        " "
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();
  }

  function includesNormalized(
    text,
    word
  ) {
    const source =
      " " + normalize(text) + " ";

    const needle =
      normalize(word);

    return Boolean(
      needle &&
      (
        source.includes(
          " " + needle + " "
        ) ||
        source.includes(needle)
      )
    );
  }

  function unique(list) {
    return Array.from(
      new Set(
        (list || []).filter(Boolean)
      )
    );
  }

  function arrayText(value) {
    return Array.isArray(value)
      ? value.join(" ")
      : String(value || "");
  }

  function cleanPhone(value) {
    return String(value || "")
      .replace(
        /[^0-9]/g,
        ""
      );
  }

  function whatsappUrl(
    value,
    message
  ) {
    const phone =
      cleanPhone(value);

    if (
      !phone ||
      phone.length < 8
    ) {
      return "#";
    }

    return (
      "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent(
        message ||
        "Bonjour, je viens de DIGIYLYFE."
      )
    );
  }

  function detectIntent(phrase) {
    const texte =
      normalize(phrase);

    const intentions =
      INTENTIONS.filter(
        function (item) {
          const blocked =
            (
              item.interdits ||
              []
            ).some(
              function (word) {
                return includesNormalized(
                  texte,
                  word
                );
              }
            );

          if (blocked) {
            return false;
          }

          return item.mots.some(
            function (word) {
              return includesNormalized(
                texte,
                word
              );
            }
          );
        }
      );

    const zones =
      ZONES.filter(
        function (zone) {
          return zone.mots.some(
            function (word) {
              return includesNormalized(
                texte,
                word
              );
            }
          );
        }
      );

    return {
      brut:
        String(phrase || ""),

      texte:
        texte,

      intentions:
        intentions,

      metiers:
        unique(
          intentions.map(
            function (item) {
              return item.canon;
            }
          )
        ),

      modules:
        unique(
          intentions.map(
            function (item) {
              return item.module;
            }
          )
        ),

      zones:
        unique(
          zones.map(
            function (item) {
              return item.canon;
            }
          )
        ),

      hasMeaning:
        Boolean(
          intentions.length ||
          zones.length
        )
    };
  }

  function ficheHaystack(fiche) {
    return normalize(
      [
        fiche.id,
        fiche.nom,
        fiche.title,
        fiche.metier,
        fiche.activite,
        fiche.categorie,
        fiche.sousCategorie,
        arrayText(fiche.keys),
        fiche.description
      ].join(" ")
    );
  }

  function zoneHaystack(fiche) {
    return normalize(
      [
        fiche.secteur,
        fiche.zoneAffichage,
        arrayText(fiche.zones)
      ].join(" ")
    );
  }

  function scoreFiche(
    fiche,
    intention
  ) {
    if (
      !fiche ||
      fiche.public === false ||
      !intention.hasMeaning
    ) {
      return -999;
    }

    const ficheText =
      ficheHaystack(fiche);

    const zoneText =
      zoneHaystack(fiche);

    const ficheModule =
      normalize(
        fiche.categorie || ""
      );

    const forbidden =
      (
        fiche.forbidden ||
        []
      ).some(
        function (word) {
          return includesNormalized(
            intention.texte,
            word
          );
        }
      );

    if (forbidden) {
      return -999;
    }

    let score = 0;

    if (
      intention.intentions.length
    ) {
      const matchIntent =
        intention.intentions.some(
          function (item) {
            if (
              normalize(item.module) !==
              ficheModule
            ) {
              return false;
            }

            return item.mots.some(
              function (word) {
                return ficheText.includes(
                  normalize(word)
                );
              }
            );
          }
        );

      if (!matchIntent) {
        return -999;
      }

      score += 1000;
    }

    if (
      intention.zones.length
    ) {
      const matchZone =
        intention.zones.some(
          function (zone) {
            return zoneText.includes(
              normalize(zone)
            );
          }
        );

      if (!matchZone) {
        return -999;
      }

      score += 420;
    }

    intention.texte
      .split(" ")

      .filter(
        function (word) {
          return word.length >= 4;
        }
      )

      .forEach(
        function (word) {
          if (
            ficheText.includes(word)
          ) {
            score += 22;
          }

          if (
            zoneText.includes(word)
          ) {
            score += 8;
          }
        }
      );

    score += Number(
      fiche.priorite || 0
    );

    return score;
  }

  function routeFallback(
    intention
  ) {
    if (
      !intention ||
      !intention.modules.length
    ) {
      return [];
    }

    return intention.modules

      .map(
        function (code) {
          const route =
            MODULE_ROUTES[code];

          if (!route) {
            return null;
          }

          return {
            id:
              "route-" +
              normalize(code),

            kind:
              "route",

            public:
              true,

            statut:
              "route_module",

            icon:
              route.icon,

            nom:
              route.title,

            title:
              route.title +
              " — route comprise",

            metier:
              "Direction comprise",

            activite:
              "Aucune fiche publique exacte n’est encore branchée",

            categorie:
              code,

            zones:
              intention.zones,

            priorite:
              1,

            url:
              route.url,

            description:
              "DIGIY a compris la direction, mais ne fabrique pas de professionnel inexistant."
          };
        }
      )

      .filter(Boolean);
  }

  function chercherFiches(
    demande,
    options
  ) {
    const opts =
      options || {};

    const limit =
      Number(
        opts.limit ||
        MAX_RESULTS
      );

    const intention =
      detectIntent(demande);

    let results =
      DIRECTORY

        .map(
          function (fiche) {
            return {
              fiche:
                fiche,

              score:
                scoreFiche(
                  fiche,
                  intention
                )
            };
          }
        )

        .filter(
          function (item) {
            return item.score > 0;
          }
        )

        .sort(
          function (a, b) {
            return b.score - a.score;
          }
        )

        .map(
          function (item) {
            return Object.assign(
              {},
              item.fiche,
              {
                _score:
                  item.score,

                _intent:
                  intention
              }
            );
          }
        );

    if (
      !results.length &&
      opts.fallback !== false
    ) {
      results =
        routeFallback(
          intention
        );
    }

    return results.slice(
      0,
      limit
    );
  }

  function toVoiceCard(fiche) {
    const phone =
      cleanPhone(
        fiche.phone ||
        fiche.whatsapp ||
        ""
      );

    const waText =
      fiche.wa ||
      (
        "Bonjour, je viens de DIGIYLYFE pour " +
        (
          fiche.nom ||
          fiche.title ||
          "cette fiche"
        ) +
        "."
      );

    return {
      kind:
        fiche.kind ||
        "directory",

      sourceId:
        fiche.id ||
        "",

      public:
        true,

      priority:
        Number(
          fiche.priorite ||
          0
        ),

      score:
        Number(
          fiche._score ||
          0
        ),

      icon:
        fiche.icon ||
        "📍",

      title:
        fiche.title ||
        fiche.nom ||
        "Professionnel DIGIY",

      nom:
        fiche.nom ||
        fiche.title ||
        "Professionnel DIGIY",

      metier:
        fiche.activite ||
        fiche.metier ||
        "Professionnel DIGIY",

      categorie:
        fiche.categorie ||
        "DIGIY",

      secteur:
        fiche.secteur ||
        fiche.zoneAffichage ||
        arrayText(
          fiche.zones
        ) ||
        "Zone à confirmer",

      statut:
        fiche.labelStatut ||
        fiche.statut ||
        "Fiche publique DIGIY",

      description:
        fiche.description ||
        "",

      phone:
        phone,

      url:
        fiche.url ||
        "#",

      image:
        fiche.cardImageUrl ||
        "",

      wa:
        waText,

      waUrl:
        whatsappUrl(
          fiche.whatsapp ||
          fiche.phone ||
          "",
          waText
        )
    };
  }

  function traiterDemande(
    demande,
    options
  ) {
    return chercherFiches(
      demande,
      options
    );
  }

  global.DIGIY_GET_PUBLIC_DIRECTORY =
    function () {
      return DIRECTORY.slice();
    };

  global.DIGIY_PUBLIC_DIRECTORY =
    DIRECTORY.slice();

  global.DIGIY_ANNUAIRE_PUBLIC = {
    version:
      VERSION,

    fiches:
      DIRECTORY.slice()
  };

  global.DIGIY_ANNUAIRE_MULTI = {
    version:
      VERSION,

    annuaire:
      DIRECTORY.slice(),

    normalize:
      normalize,

    detectIntent:
      detectIntent,

    chercherFiches:
      chercherFiches,

    toVoiceCard:
      toVoiceCard,

    traiterDemande:
      traiterDemande
  };

  global.DIGIY_ROUTE_DIRECTE =
    global.DIGIY_ANNUAIRE_MULTI;

  global.matchDirectFiches =
    function (texte) {
      return chercherFiches(
        texte,
        {
          limit:
            MAX_RESULTS,

          fallback:
            false
        }
      ).map(
        toVoiceCard
      );
    };

  try {
    global.dispatchEvent(
      new CustomEvent(
        "digiy:annuaire-ready",
        {
          detail: {
            version:
              VERSION,

            count:
              DIRECTORY.length
          }
        }
      )
    );
  } catch (_) {}
})(window);

