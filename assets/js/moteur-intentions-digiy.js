/* DIGIYLYFE — MOTEUR D’INTENTIONS TERRAIN
   Dépôt : BEAUVILLE/pro-action-digiy
   Chemin : assets/js/moteur-intentions-digiy.js
   Version : 2026-07-14-v1

   VOIX → intention → direction → module → fiche réelle → humain

   Fonctionnement local :
   - aucune API obligatoire ;
   - aucun token consommé ;
   - une demande claire ouvre une fiche réelle ;
   - une direction future peut être comprise sans inventer de résultat.
*/

(function (global) {
  "use strict";

  const VERSION = "2026-07-14-v1";

  const PROFILES = {
    "lamine-driver": {
      id: "lamine-driver",
      active: true,
      module: "DRIVER",
      icon: "🚗",
      name: "Lamine",
      activity: "Chauffeur privé · Transferts AIBD · Petite Côte",
      zones: [
        "AIBD",
        "Saly",
        "Mbour",
        "Thiès",
        "Dakar",
        "Petite Côte"
      ],
      phone: "221784413680",
      profileUrl: "https://partenaire-lamine.digiylyfe.com/",
      cardImageUrl:
        "https://partenaire-lamine.digiylyfe.com/carte-visite.png",
      services: [
        "transfert AIBD",
        "course locale",
        "trajet Dakar",
        "circuit Petite Côte",
        "mise à disposition"
      ]
    },

    "babacar-plombier": {
      id: "babacar-plombier",
      active: true,
      module: "BUILD",
      icon: "🔧",
      name: "Babacar Plombier Pro",
      activity:
        "Plombier professionnel · Dépannage · Installation sanitaire",
      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],
      phone: "221776125124",
      profileUrl:
        "https://babacar-plombier-pro.digiylyfe.com/",
      cardImageUrl: "",
      services: [
        "dépannage fuite",
        "robinet",
        "lavabo",
        "WC",
        "douche",
        "sanitaire",
        "tuyauterie"
      ]
    },

    "mbaye-batisseur": {
      id: "mbaye-batisseur",
      active: true,
      module: "BUILD",
      icon: "🧱",
      name: "Mbaye Diouf",
      activity:
        "Bâtisseur · Villas modernes · Piscines · Rénovation",
      zones: [
        "Saly",
        "Mbour",
        "Thiès",
        "Petite Côte"
      ],
      phone: "221776427113",
      profileUrl:
        "https://mbaye-macon.digiylyfe.com/",
      cardImageUrl:
        "https://mbaye-macon.digiylyfe.com/carte-visite.png",
      services: [
        "construction de villa",
        "piscine béton",
        "rénovation",
        "extension",
        "finitions haut de gamme"
      ]
    },

    "kourant-electricien": {
      id: "kourant-electricien",
      active: true,
      module: "BUILD",
      icon: "⚡",
      name: "Kourant Électricien",
      activity:
        "Électricien · Installation · Rénovation · Dépannage",
      zones: [
        "Saly",
        "Mbour",
        "Petite Côte"
      ],
      phone: "221772084781",
      profileUrl:
        "https://kourant.digiylyfe.com/",
      cardImageUrl:
        "https://kourant.digiylyfe.com/carte-visite.png",
      services: [
        "panne électrique",
        "installation électrique",
        "tableau électrique",
        "prises",
        "éclairage",
        "câblage"
      ]
    }
  };

  const DIRECTIONS = [
    {
      id: "se_deplacer",
      active: true,
      module: "DRIVER",
      icon: "🚗",
      label:
        "Se déplacer ou transporter une personne",

      profileIds: [
        "lamine-driver"
      ],

      positive: [
        "chauffeur",
        "driver",
        "taxi",
        "vtc",
        "transport de personne",
        "transfert aibd",
        "transfert aeroport",
        "mon avion arrive",
        "venir me chercher",
        "recuperer quelqu un",
        "aller a",
        "trajet",
        "course",
        "deposer quelqu un",
        "mise a disposition",
        "bagages",
        "aibd",
        "aeroport"
      ],

      forbidden: [
        "chauffe eau",
        "chauffage",
        "plomberie",
        "robinet",
        "fuite",
        "sanitaire"
      ],

      situations: [
        {
          id: "transfert_aeroport",

          signals: [
            "aibd",
            "aeroport",
            "avion",
            "vol",
            "arrivee",
            "depart",
            "bagages"
          ],

          question:
            "Quel est le trajet, pour quel moment et pour combien de personnes ?"
        },

        {
          id: "course_locale",

          signals: [
            "course",
            "trajet",
            "venir chercher",
            "deposer",
            "aller a"
          ],

          question:
            "D’où partez-vous et où souhaitez-vous aller ?"
        }
      ],

      noResult:
        "Aucun chauffeur officiel n’est encore disponible pour cette zone."
    },

    {
      id: "reparer_eau",
      active: true,
      module: "BUILD",
      icon: "🔧",
      label:
        "Réparer un problème d’eau ou de plomberie",

      profileIds: [
        "babacar-plombier"
      ],

      positive: [
        "plombier",
        "plomberie",
        "l eau coule",
        "eau au sol",
        "fuite",
        "tuyau perce",
        "robinet casse",
        "robinet ne ferme plus",
        "lavabo bouche",
        "wc bouche",
        "chasse d eau",
        "douche",
        "sanitaire",
        "mauvaise odeur",
        "pression faible",
        "canalisation",
        "tuyauterie"
      ],

      forbidden: [
        "chauffeur",
        "taxi",
        "vtc",
        "driver",
        "solaire"
      ],

      situations: [
        {
          id: "depannage_fuite",

          signals: [
            "fuite",
            "eau coule",
            "eau au sol",
            "tuyau perce"
          ],

          question:
            "Où se trouve la fuite et depuis quand ?"
        },

        {
          id: "sanitaire_bouche",

          signals: [
            "wc bouche",
            "lavabo bouche",
            "evacuation",
            "canalisation"
          ],

          question:
            "Quel équipement est bouché et dans quelle pièce ?"
        }
      ],

      noResult:
        "Aucun plombier officiel n’est encore disponible pour cette zone."
    },

    {
      id: "reparer_electricite",
      active: true,
      module: "BUILD",
      icon: "⚡",
      label:
        "Réparer, installer ou rénover l’électricité",

      profileIds: [
        "kourant-electricien"
      ],

      positive: [
        "electricien",
        "electricite",
        "plus de courant",
        "panne electrique",
        "disjoncteur saute",
        "prise chauffe",
        "prise ne marche plus",
        "lumiere clignote",
        "installer un tableau",
        "ajouter des prises",
        "cablage",
        "interrupteur",
        "installation electrique",
        "renovation electrique"
      ],

      forbidden: [
        "plomberie",
        "fuite",
        "chauffeur",
        "taxi",
        "solaire"
      ],

      situations: [
        {
          id: "depannage_electrique",

          signals: [
            "panne",
            "plus de courant",
            "disjoncteur",
            "prise chauffe",
            "clignote"
          ],

          question:
            "La panne concerne toute la maison ou seulement une partie ?"
        },

        {
          id: "installation_electrique",

          signals: [
            "installer",
            "ajouter des prises",
            "tableau electrique",
            "cablage"
          ],

          question:
            "S’agit-il d’une nouvelle installation ou d’une rénovation ?"
        }
      ],

      noResult:
        "Aucun électricien officiel n’est encore disponible pour cette zone."
    },

    {
      id: "construire_renover",
      active: true,
      module: "BUILD",
      icon: "🧱",
      label:
        "Construire, agrandir ou rénover",

      profileIds: [
        "mbaye-batisseur"
      ],

      positive: [
        "macon",
        "maconnerie",
        "batisseur",
        "construire une villa",
        "faire une piscine",
        "agrandir une piece",
        "faire une extension",
        "construire un mur",
        "faire une dalle",
        "terminer un chantier",
        "renover une maison",
        "fondations",
        "beton",
        "finitions"
      ],

      forbidden: [
        "solaire",
        "panneau photovoltaique",
        "chauffeur",
        "plomberie seule"
      ],

      situations: [
        {
          id: "construction_villa",

          signals: [
            "villa",
            "maison neuve",
            "fondations",
            "construction complete"
          ],

          question:
            "Où se trouve le projet et disposez-vous déjà de plans ?"
        },

        {
          id: "construction_piscine",

          signals: [
            "piscine",
            "bassin",
            "piscine beton"
          ],

          question:
            "Où souhaitez-vous construire la piscine et avez-vous les dimensions ?"
        },

        {
          id: "renovation_extension",

          signals: [
            "renover",
            "extension",
            "agrandir",
            "terminer chantier",
            "finitions"
          ],

          question:
            "Quelle partie souhaitez-vous rénover ou agrandir ?"
        }
      ],

      noResult:
        "Aucun bâtisseur officiel n’est encore disponible pour cette zone."
    },

    {
      id: "manger_reserver",
      active: false,
      futureReady: true,
      module: "RESA",
      icon: "🍽️",
      label:
        "Manger, réserver une table ou commander",

      profileIds: [],

      positive: [
        "ou manger",
        "restaurant",
        "reserver une table",
        "manger du poisson",
        "dejeuner",
        "diner",
        "a emporter",
        "livraison repas"
      ],

      forbidden: [],
      situations: [],

      noResult:
        "La direction RESA est comprise, mais aucun restaurant officiel n’est encore branché."
    },

    {
      id: "dormir_sejourner",
      active: false,
      futureReady: true,
      module: "LOC",
      icon: "🏠",
      label:
        "Dormir, séjourner ou trouver un logement",

      profileIds: [],

      positive: [
        "ou dormir",
        "chambre",
        "appartement",
        "logement",
        "hotel",
        "residence",
        "week end",
        "pres de la plage"
      ],

      forbidden: [],
      situations: [],

      noResult:
        "La direction LOC est comprise, mais aucun logement officiel n’est encore branché."
    },

    {
      id: "decouvrir_sortir",
      active: false,
      futureReady: true,
      module: "EXPLORE",
      icon: "🗺️",
      label:
        "Découvrir un lieu, sortir ou pratiquer une activité",

      profileIds: [],

      positive: [
        "que visiter",
        "ou sortir",
        "activite avec les enfants",
        "plage calme",
        "decouvrir",
        "visite",
        "excursion",
        "peche",
        "balade"
      ],

      forbidden: [],
      situations: [],

      noResult:
        "La direction EXPLORE est comprise, mais aucun lieu officiel n’est encore branché."
    },

    {
      id: "acheter_produit",
      active: false,
      futureReady: true,
      module: "MARKET",
      icon: "🛍️",
      label:
        "Acheter ou trouver un produit",

      profileIds: [],

      positive: [
        "acheter",
        "produit",
        "boutique",
        "prix",
        "disponible",
        "robe",
        "linge",
        "commande"
      ],

      forbidden: [],
      situations: [],

      noResult:
        "La direction MARKET est comprise, mais aucune boutique officielle n’est encore branchée."
    },

    {
      id: "trouver_travail",
      active: false,
      futureReady: true,
      module: "JOBS",
      icon: "💼",
      label:
        "Trouver un emploi, une mission ou un profil",

      profileIds: [],

      positive: [
        "emploi",
        "travail",
        "mission",
        "stage",
        "recruter",
        "candidat",
        "postuler"
      ],

      forbidden: [],
      situations: [],

      noResult:
        "La direction JOBS est comprise, mais aucune offre active ne correspond encore."
    },

    {
      id: "organiser_activite",
      active: false,
      futureReady: true,
      module: "CARNET",
      icon: "📒",
      label:
        "Organiser les encaissements, dépenses et preuves",

      profileIds: [],

      positive: [
        "enregistrer une vente",
        "noter une depense",
        "voir mes entrees",
        "preuve wave",
        "organiser mon argent",
        "carnet professionnel"
      ],

      forbidden: [],
      situations: [],
      sensitiveAction: true,

      noResult:
        "DIGIY peut préparer la route CARNET, mais l’espace professionnel reste protégé."
    }
  ];

  const ZONES = [
    "saly",
    "mbour",
    "dakar",
    "thies",
    "aibd",
    "diass",
    "ngaparou",
    "somone",
    "petite cote"
  ];

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function has(text, term) {
    const source = normalize(text);
    const needle = normalize(term);

    return Boolean(
      source &&
      needle &&
      source.includes(needle)
    );
  }

  function count(text, terms) {
    return (terms || []).reduce(function (total, term) {
      return total + (has(text, term) ? 1 : 0);
    }, 0);
  }

  function detectZone(text) {
    const source = normalize(text);

    const zone = ZONES.find(function (item) {
      return source.includes(item);
    });

    if (!zone) {
      return "";
    }

    if (zone === "thies") {
      return "Thiès";
    }

    if (zone === "petite cote") {
      return "Petite Côte";
    }

    if (zone === "aibd") {
      return "AIBD";
    }

    return zone.charAt(0).toUpperCase() + zone.slice(1);
  }

  function detectSituation(direction, text) {
    let best = null;

    (direction.situations || []).forEach(function (situation) {
      const score = count(text, situation.signals);

      if (
        score &&
        (!best || score > best.score)
      ) {
        best = {
          id: situation.id,
          score: score,
          question: situation.question || ""
        };
      }
    });

    return best;
  }

  function scoreDirection(direction, text) {
    const positive = count(
      text,
      direction.positive
    );

    const forbidden = count(
      text,
      direction.forbidden
    );

    if (!positive || forbidden) {
      return null;
    }

    const situation = detectSituation(
      direction,
      text
    );

    return {
      direction: direction,
      situation: situation,

      score:
        positive * 30 +
        (situation ? situation.score * 12 : 0) +
        (direction.active ? 5 : 0)
    };
  }

  function profilesFor(direction, zone) {
    return (direction.profileIds || [])
      .map(function (id) {
        return PROFILES[id];
      })

      .filter(function (profile) {
        return profile && profile.active;
      })

      .map(function (profile) {
        const zoneScore =
          zone &&
          profile.zones.some(function (item) {
            return normalize(item).includes(
              normalize(zone)
            );
          })
            ? 1
            : 0;

        return Object.assign(
          {},
          profile,
          {
            zoneScore: zoneScore
          }
        );
      })

      .sort(function (a, b) {
        return b.zoneScore - a.zoneScore;
      });
  }

  function classify(text, options) {
    const settings = Object.assign(
      {
        includeFutureDirections: true,
        minimumScore: 30
      },
      options || {}
    );

    const query = String(text || "").trim();

    if (!query) {
      return {
        ok: false,
        type: "empty",
        message:
          "Exprime ton besoin avec une phrase simple."
      };
    }

    const zone = detectZone(query);

    const candidates = DIRECTIONS
      .filter(function (direction) {
        return (
          direction.active ||
          settings.includeFutureDirections
        );
      })

      .map(function (direction) {
        return scoreDirection(
          direction,
          query
        );
      })

      .filter(Boolean)

      .filter(function (candidate) {
        return (
          candidate.score >=
          settings.minimumScore
        );
      })

      .sort(function (a, b) {
        return b.score - a.score;
      });

    if (!candidates.length) {
      return {
        ok: false,
        type: "unknown",
        query: query,
        zone: zone,
        confidence: 0,

        message:
          "Cela concerne un déplacement, l’eau, l’électricité, la construction, un logement, un repas, un produit ou un travail ?"
      };
    }

    const best = candidates[0];
    const second = candidates[1] || null;

    const confidence = second
      ? Math.max(
          0,
          Math.min(
            1,
            (
              best.score -
              second.score +
              30
            ) / 100
          )
        )
      : Math.max(
          0.55,
          Math.min(
            1,
            best.score / 100
          )
        );

    const profiles = profilesFor(
      best.direction,
      zone
    );

    return {
      ok: true,

      type:
        profiles.length
          ? "profiles"
          : "direction",

      query: query,
      zone: zone,

      confidence:
        Number(confidence.toFixed(2)),

      directionId:
        best.direction.id,

      directionLabel:
        best.direction.label,

      module:
        best.direction.module,

      icon:
        best.direction.icon,

      situation:
        best.situation,

      profiles:
        profiles,

      question:
        best.situation
          ? best.situation.question
          : "",

      message:
        profiles.length
          ? profiles.length +
            " fiche officielle trouvée."
          : best.direction.noResult
    };
  }

  function profileToCard(profile) {
    return {
      kind: "directory",
      sourceId: profile.id,
      public: true,
      priority: 100,

      icon:
        profile.icon || "📍",

      title:
        profile.name,

      metier:
        profile.activity,

      categorie:
        profile.module,

      secteur:
        (profile.zones || []).join(" · "),

      statut:
        "Fiche officielle DIGIY",

      phone:
        profile.phone || "",

      url:
        profile.profileUrl || "#",

      image:
        profile.cardImageUrl || "",

      services:
        profile.services || [],

      wa:
        "Bonjour " +
        profile.name +
        ", je vous contacte depuis La Voix du Business DIGIY."
    };
  }

  function classifyToCards(text, options) {
    const result = classify(
      text,
      options
    );

    return {
      result: result,

      cards:
        result.ok
          ? (result.profiles || [])
              .map(profileToCard)
          : []
    };
  }

  function splitComplexRequest(text) {
    return DIRECTIONS
      .map(function (direction) {
        return scoreDirection(
          direction,
          text
        );
      })

      .filter(Boolean)

      .sort(function (a, b) {
        return b.score - a.score;
      })

      .map(function (candidate) {
        return {
          directionId:
            candidate.direction.id,

          label:
            candidate.direction.label,

          module:
            candidate.direction.module,

          score:
            candidate.score
        };
      });
  }

  function runTests() {
    const tests = [
      [
        "Mon avion arrive à AIBD demain et je vais à Saly.",
        "se_deplacer"
      ],

      [
        "L’eau coule sous mon lavabo.",
        "reparer_eau"
      ],

      [
        "Le disjoncteur saute quand j’allume la climatisation.",
        "reparer_electricite"
      ],

      [
        "Je veux construire une villa avec piscine à Saly.",
        "construire_renover"
      ]
    ];

    const results = tests.map(function (test) {
      const result = classify(test[0]);

      return {
        input: test[0],
        expected: test[1],

        received:
          result.directionId ||
          result.type,

        passed:
          result.directionId ===
          test[1]
      };
    });

    const chauffeEau = classify(
      "Je cherche un chauffe-eau."
    );

    results.push({
      input:
        "Je cherche un chauffe-eau.",

      expected:
        "ne pas classer DRIVER",

      received:
        chauffeEau.directionId ||
        chauffeEau.type,

      passed:
        chauffeEau.directionId !==
        "se_deplacer"
    });

    return results;
  }

  global.DIGIY_INTENTIONS =
    Object.freeze({
      version: VERSION,

      profiles: PROFILES,
      directions: DIRECTIONS,

      normalize: normalize,
      detectZone: detectZone,

      classify: classify,
      classifyToCards:
        classifyToCards,

      splitComplexRequest:
        splitComplexRequest,

      profileToCard:
        profileToCard,

      runTests:
        runTests
    });

  global.dispatchEvent(
    new CustomEvent(
      "digiy:intentions-ready",
      {
        detail: {
          version: VERSION,

          profiles:
            Object.keys(PROFILES).length,

          directions:
            DIRECTIONS.length
        }
      }
    )
  );
})(window);
