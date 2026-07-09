/*
  annuaire-public-digiy.js
  DIGIYLYFE — LA VOIX / L'OREILLE / ROUTE DIRECTE
  Version : 20260709-route-directe-v1

  Rôle :
  - Mémoire publique des fiches terrain DIGIY.
  - Comprend métier + zone + intention.
  - Remonte plusieurs fiches compatibles.
  - Public only : pas de PIN, pas de cockpit, pas de secret interne.

  À poser dans le dépôt : annuaire-public-digiy.js
  À brancher avant </body> :
  <script src="./annuaire-public-digiy.js?v=20260709-route-directe-v1"></script>
*/

(function () {
  "use strict";

  const VERSION = "20260709-route-directe-v1";
  const MAX_RESULTS_DEFAULT = 6;

  const DEFAULT_DIRECTORY = [
    {
      id: "helage-plombier-saly",
      kind: "directory",
      public: true,
      statut: "partenaire_qualifie",
      icon: "🔧",
      nom: "Helage",
      title: "Helage — Plombier Saly",
      metier: "plombier",
      activite: "Plombier multi-services",
      categorie: "BUILD",
      sousCategorie: "plomberie",
      zones: ["Saly", "Petite Côte", "Ngaparou", "Somone", "Mbour"],
      priorite: 100,
      phone: "221774513523",
      whatsapp: "221774513523",
      url: "https://helage-plombier.digiylyfe.com/",
      description: "Plombier multi-services à Saly : dépannage, fuites, robinets, WC, installation, salle de bain et petits chantiers sanitaires.",
      keys: ["helage", "plombier", "plomberie", "fuite", "fuites", "robinet", "robinetterie", "wc", "toilette", "lavabo", "douche", "salle de bain", "chauffe eau", "chauffe-eau", "canalisation", "évacuation", "evacuation", "sanitaire", "dépannage", "depannage"]
    },
    {
      id: "mbaye-entrepreneur-macon-saly",
      kind: "directory",
      public: true,
      statut: "partenaire_reference",
      icon: "🧱",
      nom: "Mbaye",
      title: "Mbaye — Entrepreneur maçon à Saly",
      metier: "maçon",
      activite: "Entrepreneur maçon",
      categorie: "BUILD",
      sousCategorie: "maçonnerie",
      zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],
      priorite: 96,
      phone: "",
      whatsapp: "",
      url: "https://build.digiylyfe.com/fiche.html?slug=partenaires-mbaye",
      description: "Entrepreneur maçon à Saly : construction, rénovation, réparation, murs, dalle, béton, chantier maison et petits travaux de maçonnerie.",
      keys: ["mbaye", "maçon", "macon", "maçonnerie", "maconnerie", "entrepreneur", "chantier", "construction", "rénovation", "renovation", "mur", "muret", "dalle", "béton", "beton", "fondation", "carrelage", "enduit", "travaux", "devis"]
    },
    {
      id: "zal-kourant-electricite-build",
      kind: "directory",
      public: true,
      statut: "partenaire_reference",
      icon: "⚡",
      nom: "Zal Kourant",
      title: "Zal Kourant — Électricité & dépannage",
      metier: "électricien",
      activite: "Électricité, dépannage et services bâtiment",
      categorie: "BUILD",
      sousCategorie: "électricité",
      zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone", "Dakar", "Thiès"],
      priorite: 92,
      phone: "",
      whatsapp: "",
      url: "https://build.digiylyfe.com/fiche.html?slug=partenaires-zal-kourant",
      description: "Partenaire bâtiment référencé pour les besoins d’électricité, dépannage, installation, prises, tableau et services utiles.",
      keys: ["zal", "kourant", "courant", "électricien", "electricien", "électricité", "electricite", "panne", "prise", "prises", "interrupteur", "disjoncteur", "tableau", "lumière", "lumiere", "câble", "cable", "dépannage électrique", "depannage electrique"]
    },
    {
      id: "digiy-solaire-installation-depannage",
      kind: "directory",
      public: true,
      statut: "fiche_build_publique",
      icon: "☀️",
      nom: "DIGIY Solaire",
      title: "DIGIY Solaire — Installation & dépannage",
      metier: "solaire",
      activite: "Installation solaire, dépannage, diagnostic et entretien",
      categorie: "BUILD",
      sousCategorie: "solaire",
      zones: ["Dakar", "Saly", "Petite Côte", "Mbour", "Thiès", "Sénégal"],
      priorite: 94,
      phone: "221771342889",
      whatsapp: "221771342889",
      url: "https://digiy-solaire.digiylyfe.com/",
      description: "Installation solaire, dépannage, diagnostic batterie, régulateur, câblage, entretien et conseil énergie.",
      keys: ["solaire", "panneau solaire", "panneaux solaires", "installation solaire", "dépannage solaire", "depannage solaire", "batterie", "régulateur", "regulateur", "câblage", "cablage", "énergie", "energie", "pompe", "frigo", "diagnostic", "entretien"]
    },
    {
      id: "astou-boutique-saly",
      kind: "directory",
      public: true,
      statut: "fiche_market_publique",
      icon: "👜",
      nom: "Astou Boutique",
      title: "Astou Boutique — Maison, plage & élégance",
      metier: "boutique",
      activite: "Linge de maison, plage, style et beauté",
      categorie: "MARKET",
      sousCategorie: "linge maison",
      zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],
      priorite: 93,
      phone: "221778765785",
      whatsapp: "221778765785",
      url: "https://astou-boutique.digiylyfe.com/",
      description: "Boutique à Saly : linge de maison, serviettes, draps, peignoirs, foutas, articles plage, tenues stylées, confection et produits de beauté.",
      keys: ["astou", "boutique", "commerce", "magasin", "linge", "linge de maison", "serviette", "serviettes", "drap", "draps", "peignoir", "peignoirs", "fouta", "foutas", "plage", "piscine", "transat", "hôtel", "hotel", "villa", "robe", "tenue", "beauté", "beaute", "cosmétique", "cosmetique"]
    },
    {
      id: "chez-baptiste-appartement-saly",
      kind: "directory",
      public: true,
      statut: "fiche_loc_publique",
      icon: "🏠",
      nom: "CHEZ BAPTISTE",
      title: "CHEZ BAPTISTE — Appartement à Saly",
      metier: "logement",
      activite: "Appartement à Saly",
      categorie: "LOC",
      sousCategorie: "appartement",
      zones: ["Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],
      priorite: 95,
      phone: "221771342889",
      whatsapp: "221771342889",
      url: "https://part-chez-baptiste.digiylyfe.com/",
      description: "Appartement confortable à Saly pour jusqu’à 4 personnes, quartier paisible, réservation directe propriétaire, paiement direct et contact WhatsApp.",
      keys: ["chez baptiste", "logement", "appartement", "location", "loc", "chambre", "séjour", "sejour", "famille", "amis", "week end", "weekend", "vacances", "4 personnes", "réserver", "reserver", "dormir", "nuit", "nuits", "hébergement", "hebergement", "hôtel", "hotel", "où dormir", "ou dormir"]
    },
    {
      id: "digiy-driver-ambassadeur-baptiste",
      kind: "directory",
      public: true,
      statut: "fiche_driver_publique",
      icon: "🚗",
      nom: "DIGIY DRIVER Ambassadeur",
      title: "DIGIY DRIVER Ambassadeur — Chauffeur avec style",
      metier: "chauffeur",
      activite: "Service chauffeur avec contact direct",
      categorie: "DRIVER",
      sousCategorie: "transport",
      zones: ["AIBD", "Dakar", "Saly", "Petite Côte", "Mbour", "Ngaparou", "Somone"],
      priorite: 94,
      phone: "",
      whatsapp: "",
      url: "https://digiy-driver-part-bapt.digiylyfe.com/",
      description: "Vitrine chauffeur DIGIY DRIVER : QR chauffeur, contact direct, sérieux, discrétion, ponctualité et savoir-vivre.",
      keys: ["chauffeur", "chauffeur saly", "driver", "taxi", "transport", "voiture", "véhicule", "vehicule", "trajet", "course", "aibd", "aéroport", "aeroport", "diass", "transfert", "venir chercher", "ponctualité", "ponctualite", "discrétion", "discretion", "ambassadeur"]
    },
    {
      id: "poulet-tonton-vente-directe",
      kind: "directory",
      public: true,
      statut: "fiche_market_publique",
      icon: "🐔",
      nom: "Poulet Tonton",
      title: "Poulet Tonton — Vente directe",
      metier: "vente de poulets",
      activite: "Poulets 2,5 kg environ — prix maintenu 3 500 FCFA",
      categorie: "MARKET",
      sousCategorie: "alimentation",
      zones: ["Saly", "Mbour", "Petite Côte", "Sénégal"],
      priorite: 91,
      phone: "221778329612",
      whatsapp: "221778329612",
      url: "https://poulet-tonton.digiylyfe.com/",
      description: "Poulets disponibles en vente directe : environ 2,5 kg, prix maintenu à 3 500 FCFA. Contact direct pour disponibilité et quantité.",
      keys: ["poulet", "poulets", "volaille", "volailles", "chair", "ferme", "poulailler", "vente directe", "alimentaire", "alimentation", "2,5 kg", "2kg5", "3500", "3500 fcfa", "tonton"]
    }
  ];

  const MODULE_ROUTES = [
    { code: "BUILD", icon: "🏗️", title: "DIGIY BUILD", url: "https://build.digiylyfe.com/", keys: ["artisan", "réparation", "reparation", "travaux", "maison", "chantier", "plombier", "maçon", "macon", "électricien", "electricien", "solaire"] },
    { code: "DRIVER", icon: "🚗", title: "DIGIY DRIVER", url: "https://driver-client.digiylyfe.com/", keys: ["chauffeur", "driver", "taxi", "aibd", "transport", "trajet", "course"] },
    { code: "LOC", icon: "🏠", title: "DIGIY LOC", url: "https://loc.digiylyfe.com/", keys: ["logement", "location", "chambre", "appartement", "villa", "studio", "dormir", "nuit"] },
    { code: "RESA", icon: "📅", title: "DIGIY RÉSERVATION", url: "https://resa-table-resto.digiylyfe.com/", keys: ["restaurant", "resto", "table", "réserver", "reserver", "manger", "dîner", "diner"] },
    { code: "MARKET", icon: "🛍️", title: "DIGIY MARKET", url: "https://market.digiylyfe.com/", keys: ["boutique", "produit", "acheter", "vente", "commerce", "market", "poulet", "serviette"] },
    { code: "JOBS", icon: "💼", title: "DIGIY JOBS", url: "https://jobs.digiylyfe.com/", keys: ["emploi", "job", "travail", "mission", "recrutement", "candidat"] },
    { code: "EXPLORE", icon: "🗺️", title: "DIGIY EXPLORE", url: "https://explore.digiylyfe.com/", keys: ["sortie", "visite", "tourisme", "activité", "activite", "petite côte", "petite cote"] },
    { code: "PAY", icon: "💳", title: "DIGIY PAY", url: "https://pay.digiylyfe.com/", keys: ["payer", "paiement", "wave", "preuve", "argent", "reçu", "recu"] }
  ];

  const INTENTIONS = [
    { canon: "plombier", module: "BUILD", mots: ["plombier", "plomberie", "fuite", "robinet", "wc", "toilette", "lavabo", "douche", "sanitaire", "canalisation", "eau"] },
    { canon: "maçon", module: "BUILD", mots: ["maçon", "macon", "maçonnerie", "maconnerie", "entrepreneur", "chantier", "construction", "rénovation", "renovation", "mur", "dalle", "béton", "beton"] },
    { canon: "électricien", module: "BUILD", mots: ["électricien", "electricien", "électricité", "electricite", "courant", "kourant", "prise", "disjoncteur", "tableau", "lumière", "lumiere"] },
    { canon: "solaire", module: "BUILD", mots: ["solaire", "panneau solaire", "batterie", "régulateur", "regulateur", "énergie", "energie", "câblage", "cablage"] },
    { canon: "chauffeur", module: "DRIVER", mots: ["chauffeur", "driver", "taxi", "aibd", "aéroport", "aeroport", "transport", "trajet", "course", "transfert"] },
    { canon: "logement", module: "LOC", mots: ["logement", "location", "louer", "appartement", "villa", "chambre", "studio", "nuit", "dormir", "hébergement", "hebergement", "hôtel", "hotel"] },
    { canon: "restaurant", module: "RESA", mots: ["restaurant", "resto", "table", "réserver", "reserver", "manger", "dîner", "diner", "déjeuner", "dejeuner"] },
    { canon: "boutique", module: "MARKET", mots: ["boutique", "commerce", "magasin", "acheter", "produit", "article", "market", "vente", "vendeur"] },
    { canon: "poulet", module: "MARKET", mots: ["poulet", "poulets", "volaille", "volailles", "poulailler", "chair"] },
    { canon: "emploi", module: "JOBS", mots: ["emploi", "job", "travail", "mission", "candidat", "recruter", "recrutement", "stage"] },
    { canon: "explore", module: "EXPLORE", mots: ["sortie", "visite", "visiter", "découvrir", "decouvrir", "tourisme", "activité", "activite", "petite côte", "petite cote"] },
    { canon: "pay", module: "PAY", mots: ["payer", "paiement", "wave", "preuve", "reçu", "recu", "argent", "facture"] }
  ];

  const ZONES = [
    { canon: "Saly", mots: ["saly", "sally"] },
    { canon: "Mbour", mots: ["mbour"] },
    { canon: "Dakar", mots: ["dakar"] },
    { canon: "AIBD", mots: ["aibd", "diass", "aéroport", "aeroport", "airport"] },
    { canon: "Thiès", mots: ["thiès", "thies"] },
    { canon: "Touba", mots: ["touba"] },
    { canon: "Petite Côte", mots: ["petite côte", "petite cote", "ngaparou", "somone", "nianning", "popenguine"] },
    { canon: "Sénégal", mots: ["sénégal", "senegal"] }
  ];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function unique(list) {
    const seen = new Set();
    return (list || []).filter(function (item) {
      const key = normalize(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function arrayText(value) {
    return Array.isArray(value) ? value.join(" ") : String(value || "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(url) {
    const u = String(url || "").trim();
    if (!u || u === "#") return "#";
    if (/^https?:\/\//i.test(u)) return u;
    if (/^(mailto|tel|sms):/i.test(u)) return u;
    return "#";
  }

  function cleanPhone(value) {
    return String(value || "").replace(/[^0-9]/g, "");
  }

  function whatsappUrl(value, message) {
    const raw = String(value || "").trim();
    if (!raw) return "#";
    if (/^https:\/\/wa\.me\//i.test(raw) || /^https:\/\/api\.whatsapp\.com\//i.test(raw)) return raw;

    const phone = cleanPhone(raw);
    if (!phone || phone.length < 8) return "#";

    return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message || "Bonjour, je viens de DIGIYLYFE.");
  }

  function isPublicFiche(fiche) {
    if (!fiche) return false;
    if (fiche.public === false) return false;

    const statut = normalize(fiche.statut || "public");
    const blocked = ["private", "prive", "privé", "draft", "brouillon", "interne", "pro", "cockpit", "pin"];

    return !blocked.some(function (word) {
      return statut.includes(word);
    });
  }

  function getDirectory() {
    const external = Array.isArray(window.DIGIY_ANNUAIRE_PUBLIC)
      ? window.DIGIY_ANNUAIRE_PUBLIC
      : [];

    const source = external.length ? external : DEFAULT_DIRECTORY;

    return source.filter(isPublicFiche);
  }

  function ficheHaystack(fiche) {
    return normalize([
      fiche.id,
      fiche.nom,
      fiche.title,
      fiche.titre,
      fiche.metier,
      fiche.activite,
      fiche.categorie,
      fiche.sousCategorie,
      arrayText(fiche.metiers),
      arrayText(fiche.categories),
      arrayText(fiche.keys),
      arrayText(fiche.mots),
      fiche.description
    ].join(" "));
  }

  function zoneHaystack(fiche) {
    return normalize([
      fiche.zone,
      fiche.secteur,
      fiche.zoneAffichage,
      arrayText(fiche.zones),
      fiche.description
    ].join(" "));
  }

  function includesNormalized(text, word) {
    const t = " " + normalize(text) + " ";
    const w = normalize(word);
    if (!w) return false;

    return t.includes(" " + w + " ") || t.includes(w);
  }

  function detectIntent(phrase) {
    const texte = normalize(phrase);

    const intentions = INTENTIONS.filter(function (item) {
      return item.mots.some(function (mot) {
        return includesNormalized(texte, mot);
      });
    });

    const zones = ZONES.filter(function (zone) {
      return zone.mots.some(function (mot) {
        return includesNormalized(texte, mot);
      });
    });

    const modules = unique(intentions.map(function (item) {
      return item.module;
    }));

    const metiers = unique(intentions.map(function (item) {
      return item.canon;
    }));

    const zoneLabels = unique(zones.map(function (item) {
      return item.canon;
    }));

    return {
      brut: String(phrase || ""),
      texte: texte,
      intentions: intentions,
      metiers: metiers,
      modules: modules,
      zones: zoneLabels,
      hasMeaning: !!(metiers.length || modules.length || zoneLabels.length)
    };
  }

  function scoreFiche(fiche, intention) {
    if (!isPublicFiche(fiche)) return -999;

    const fh = ficheHaystack(fiche);
    const zh = zoneHaystack(fiche);
    const ficheModule = normalize(fiche.categorie || fiche.module || "");
    const ficheKeys = normalize([arrayText(fiche.keys), arrayText(fiche.mots)].join(" "));

    let score = 0;

    if (!intention.hasMeaning) return -999;

    if (intention.metiers.length || intention.modules.length) {
      const matchMetier = intention.metiers.some(function (m) {
        return fh.includes(normalize(m));
      });

      const matchModule = intention.modules.some(function (m) {
        return ficheModule.includes(normalize(m));
      });

      const matchKeys = intention.intentions.some(function (it) {
        return it.mots.some(function (mot) {
          return ficheKeys.includes(normalize(mot));
        });
      });

      if (!matchMetier && !matchModule && !matchKeys) return -999;

      if (matchMetier) score += 900;
      if (matchModule) score += 260;
      if (matchKeys) score += 220;
    }

    if (intention.zones.length) {
      const matchZone = intention.zones.some(function (z) {
        return zh.includes(normalize(z));
      });

      if (!matchZone) return -999;

      score += 430;
    }

    const words = intention.texte.split(" ").filter(function (w) {
      return w.length >= 4;
    });

    words.forEach(function (mot) {
      if (fh.includes(mot)) score += 18;
      if (zh.includes(mot)) score += 10;
    });

    score += Number(fiche.priorite || fiche.priority || 0);

    return score;
  }

  function routeFallback(intention) {
    if (!intention || !intention.modules.length) return [];

    return MODULE_ROUTES
      .filter(function (route) {
        return intention.modules.some(function (m) {
          return normalize(m) === normalize(route.code);
        });
      })
      .map(function (route) {
        return {
          id: "route-" + normalize(route.code),
          kind: "route",
          public: true,
          statut: "route_module",
          icon: route.icon,
          nom: route.title,
          title: route.title + " — route comprise",
          metier: "Route DIGIY",
          activite: "Aucune fiche directe exacte pour le moment",
          categorie: route.code,
          zones: intention.zones,
          priorite: 1,
          url: route.url,
          description: "DIGIY a compris la demande et ouvre la bonne porte. Une fiche directe pourra être ajoutée dès que le partenaire terrain est référencé.",
          keys: route.keys
        };
      });
  }

  function chercherFiches(demande, options) {
    const opts = options || {};
    const limit = Number(opts.limit || MAX_RESULTS_DEFAULT);
    const intention = detectIntent(demande);

    const scored = getDirectory()
      .map(function (fiche) {
        return {
          fiche: fiche,
          score: scoreFiche(fiche, intention)
        };
      })
      .filter(function (item) {
        return item.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });

    let results = scored.map(function (item) {
      const f = Object.assign({}, item.fiche);
      f._score = item.score;
      f._intent = intention;
      return f;
    });

    if (!results.length && opts.fallback !== false) {
      results = routeFallback(intention);
    }

    return results.slice(0, limit);
  }

  function toVoiceCard(fiche) {
    const phone = cleanPhone(fiche.phone || fiche.telephone || "");
    const waMessage = fiche.wa || "Bonjour, je viens de DIGIYLYFE pour " + (fiche.nom || fiche.title || "cette fiche") + ".";
    const wa = whatsappUrl(fiche.whatsapp || fiche.phone || "", waMessage);

    return {
      kind: fiche.kind || "directory",
      sourceId: fiche.id || "",
      public: true,
      priority: Number(fiche.priorite || fiche.priority || 0),
      score: Number(fiche._score || 0),
      icon: fiche.icon || "📍",
      title: fiche.title || fiche.titre || fiche.nom || "Professionnel DIGIY",
      nom: fiche.nom || fiche.title || "Professionnel DIGIY",
      metier: fiche.activite || fiche.metier || "Professionnel DIGIY",
      categorie: fiche.categorie || "DIGIY",
      secteur: fiche.zoneAffichage || fiche.secteur || arrayText(fiche.zones) || fiche.zone || "Zone à confirmer",
      statut: fiche.labelStatut || fiche.statut || "Fiche publique DIGIY",
      description: fiche.description || "Fiche professionnelle référencée DIGIYLYFE.",
      phone: phone,
      url: safeUrl(fiche.url),
      wa: wa,
      waText: waMessage
    };
  }

  function renderVoiceCard(fiche) {
    const card = toVoiceCard(fiche);
    const telHref = card.phone ? "tel:+" + card.phone : "#";
    const url = card.url || "#";
    const wa = card.wa || "#";

    return `
      <article class="card directoryCard" data-digiy-fiche="${escapeHtml(card.sourceId || card.title)}">
        <div class="cover" aria-hidden="true">${escapeHtml(card.icon)}</div>
        <div class="body">
          <span class="tag">${escapeHtml(card.categorie)}</span>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.description)}</p>
          <div class="miniMeta">
            <span>${escapeHtml(card.metier)}</span>
            <span>${escapeHtml(card.secteur)}</span>
          </div>
          <div class="card-actions">
            ${url !== "#" ? `<a class="btn primary" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="Ouvrir la fiche">Ouvrir</a>` : `<span class="btn primary" aria-label="Fiche bientôt reliée">Bientôt</span>`}
            ${wa !== "#" ? `<a class="btn green whatsBtn" href="${escapeHtml(wa)}" target="_blank" rel="noopener" aria-label="WhatsApp">WhatsApp</a>` : `<span class="btn green" aria-hidden="true">WhatsApp</span>`}
            ${card.phone ? `<a class="btn" href="${escapeHtml(telHref)}" aria-label="Appeler">Appeler</a>` : `<span class="btn" aria-hidden="true">Contact</span>`}
          </div>
        </div>
      </article>
    `;
  }

  function ensureStandaloneStyle() {
    if (document.getElementById("digiy-annuaire-public-style")) return;

    const style = document.createElement("style");
    style.id = "digiy-annuaire-public-style";

    style.textContent = `
      .digiy-results-wrap{margin:18px auto;width:min(980px,94vw);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .digiy-results-title{color:#102f24;font-weight:1000;margin:0 0 8px;font-size:clamp(20px,4vw,32px)}
      .digiy-results-sub{color:rgba(16,47,36,.72);margin:0 0 14px;font-weight:850;line-height:1.35}
      .digiy-results-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
      .digiy-card{border:1px solid rgba(18,60,45,.13);background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,252,240,.86));color:#102f24;border-radius:24px;padding:16px;box-shadow:0 16px 44px rgba(18,60,45,.10)}
      .digiy-card-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
      .digiy-card-icon{width:44px;height:44px;border-radius:16px;display:grid;place-items:center;background:rgba(246,196,83,.22);font-size:24px}
      .digiy-card h3{margin:0;font-size:20px;font-weight:1000}
      .digiy-card .job{margin:2px 0 0;color:rgba(16,47,36,.78);font-weight:900}
      .digiy-card .desc{margin:10px 0 12px;line-height:1.38;color:rgba(16,47,36,.78);font-weight:750}
      .digiy-card .zone{margin:0 0 12px;color:rgba(16,47,36,.65);font-weight:900}
      .digiy-actions{display:flex;flex-wrap:wrap;gap:8px}
      .digiy-actions a,.digiy-actions span{border:0;text-decoration:none;border-radius:999px;padding:10px 13px;font-weight:1000;font-size:14px}
      .digiy-open{color:#102f24;background:linear-gradient(135deg,#fff2bf,#f6c453)}
      .digiy-whatsapp{color:#102f24;background:linear-gradient(135deg,#d8ffe6,#7ee6a7)}
      .digiy-call{color:#102f24;background:rgba(18,60,45,.08)}
      .digiy-empty{border:1px dashed rgba(18,60,45,.22);background:rgba(255,255,255,.55);color:rgba(16,47,36,.78);border-radius:20px;padding:16px;font-weight:850}
    `;

    document.head.appendChild(style);
  }

  function getStandaloneBox() {
    let box =
      document.getElementById("digiy-results") ||
      document.getElementById("resultatsFiches") ||
      document.querySelector("[data-digiy-results]");

    if (box) return box;

    box = document.createElement("section");
    box.id = "digiy-results";
    box.className = "digiy-results-wrap";

    (document.querySelector("main") || document.body).appendChild(box);

    return box;
  }

  function renderStandaloneCard(fiche) {
    const card = toVoiceCard(fiche);

    return `
      <article class="digiy-card" data-digiy-fiche="${escapeHtml(card.sourceId || card.title)}">
        <div class="digiy-card-top">
          <div class="digiy-card-icon">${escapeHtml(card.icon)}</div>
          <div>
            <h3>${escapeHtml(card.title)}</h3>
            <p class="job">${escapeHtml(card.metier)}</p>
          </div>
        </div>
        <p class="desc">${escapeHtml(card.description)}</p>
        <p class="zone">📍 ${escapeHtml(card.secteur)}</p>
        <div class="digiy-actions">
          ${card.url !== "#" ? `<a class="digiy-open" href="${escapeHtml(card.url)}" target="_blank" rel="noopener">Ouvrir la fiche ↗</a>` : `<span class="digiy-open">Fiche bientôt reliée</span>`}
          ${card.wa !== "#" ? `<a class="digiy-whatsapp" href="${escapeHtml(card.wa)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
          ${card.phone ? `<a class="digiy-call" href="tel:+${escapeHtml(card.phone)}">Appeler</a>` : ""}
        </div>
      </article>
    `;
  }

  function afficherFiches(fiches, demande) {
    const voiceCardsBox = document.getElementById("cards");
    const empty = document.getElementById("empty");

    if (voiceCardsBox) {
      if (empty) empty.style.display = fiches.length ? "none" : "block";

      voiceCardsBox.innerHTML = fiches.length
        ? fiches.map(renderVoiceCard).join("")
        : `<div class="emptyIcon" aria-hidden="true">🔎</div>`;

      return;
    }

    ensureStandaloneStyle();

    const box = getStandaloneBox();
    const total = fiches.length;

    if (!total) {
      box.innerHTML = `
        <h2 class="digiy-results-title">Aucune fiche trouvée pour le moment</h2>
        <div class="digiy-empty">
          Demande reçue : « ${escapeHtml(demande || "")} ».<br>
          Le terrain n'est pas encore référencé pour cette recherche, ou la fiche n'est pas encore publique.
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <h2 class="digiy-results-title">${total} fiche${total > 1 ? "s" : ""} qui remontent</h2>
      <p class="digiy-results-sub">LA VOIX écoute, L'OREILLE comprend, ROUTE DIRECTE ouvre la bonne porte.</p>
      <div class="digiy-results-grid">
        ${fiches.map(renderStandaloneCard).join("")}
      </div>
    `;
  }

  function traiterDemande(demande, options) {
    const texte = String(demande || "").trim();
    if (!texte) return [];

    const fiches = chercherFiches(texte, options);
    afficherFiches(fiches, texte);

    try {
      window.dispatchEvent(
        new CustomEvent("digiy:annuaire-results", {
          detail: {
            demande: texte,
            fiches: fiches,
            cards: fiches.map(toVoiceCard)
          }
        })
      );
    } catch (_) {}

    return fiches;
  }

  function findInput() {
    return (
      document.querySelector("[data-digiy-input]") ||
      document.getElementById("q") ||
      document.getElementById("digiy-input") ||
      document.getElementById("voiceInput") ||
      document.getElementById("searchInput") ||
      document.querySelector("textarea") ||
      document.querySelector("input[type='search']") ||
      document.querySelector("input[type='text']")
    );
  }

  function findGoButtons() {
    const candidates = [
      document.querySelector("[data-digiy-go]"),
      document.getElementById("searchBtn"),
      document.getElementById("digiy-go"),
      document.getElementById("goBtn")
    ].filter(Boolean);

    if (candidates.length) return candidates;

    return Array.from(document.querySelectorAll("button,a"))
      .filter(function (el) {
        const t = normalize(el.textContent || el.getAttribute("aria-label") || "");
        return t === "go" || t.includes("voir") || t.includes("see") || t.includes("chercher");
      })
      .slice(0, 2);
  }

  function bindUI() {
    const input = findInput();
    if (!input) return;

    findGoButtons().forEach(function (button) {
      if (!button || button.dataset.digiyAnnuaireBound) return;

      button.dataset.digiyAnnuaireBound = "1";

      button.addEventListener("click", function () {
        const demande = input.value || input.textContent || "";
        if (String(demande).trim()) traiterDemande(demande);
      });
    });

    if (!input.dataset.digiyAnnuaireEnterBound) {
      input.dataset.digiyAnnuaireEnterBound = "1";

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          const demande = input.value || input.textContent || "";
          if (String(demande).trim()) traiterDemande(demande);
        }
      });
    }
  }

  if (!Array.isArray(window.DIGIY_ANNUAIRE_PUBLIC) || !window.DIGIY_ANNUAIRE_PUBLIC.length) {
    window.DIGIY_ANNUAIRE_PUBLIC = DEFAULT_DIRECTORY;
  }

  window.DIGIY_ANNUAIRE_MULTI = {
    version: VERSION,
    annuaire: getDirectory(),
    normalize: normalize,
    detectIntent: detectIntent,
    chercherFiches: chercherFiches,
    toVoiceCard: toVoiceCard,
    afficherFiches: afficherFiches,
    traiterDemande: traiterDemande
  };

  window.DIGIY_ROUTE_DIRECTE = window.DIGIY_ANNUAIRE_MULTI;

  if (!window.matchDirectFiches) {
    window.matchDirectFiches = function (texte) {
      return chercherFiches(texte, { limit: 6, fallback: false }).map(toVoiceCard);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindUI);
  } else {
    bindUI();
  }
})();
