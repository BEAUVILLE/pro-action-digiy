/*
  action-digiy-public-annuaire-multi.js
  DIGIYLYFE — Oreille publique / Annuaire public multi-fiches
  Objectif : une demande terrain peut remonter TOUTES les fiches compatibles.
  Doctrine : public only — pas de PIN, pas de cockpit, pas de téléphone complet interne.

  À brancher dans index.html avant </body> :
  <script src="./action-digiy-public-annuaire-multi-final.js?v=20260614-final"></script>
*/

(function () {
  "use strict";

  const VERSION = "20260614-multi-fiches-final";

  const ANNUAIRE_DEFAUT = [
    {
      id: "helage-plombier-saly",
      nom: "Helage",
      metier: "Plombier",
      metiers: ["plombier", "plomberie", "fuite", "robinetterie", "évacuation", "installation eau"],
      categories: ["artisan", "build", "travaux", "maison"],
      zones: ["saly", "petite cote", "petite côte", "mbour"],
      statut: "public",
      icon: "🔧",
      priorite: 100,
      url: "https://helage-plombier.digiylyfe.com/",
      description: "Plombier à Saly pour petits travaux : fuite, robinetterie, évacuation et installation."
    },
    {
      id: "mbaye-macon-saly",
      nom: "Mbaye",
      metier: "Entrepreneur maçon",
      metiers: ["maçon", "macon", "maçonnerie", "maconnerie", "entrepreneur maçon", "construction", "rénovation", "renovation"],
      categories: ["artisan", "build", "travaux", "chantier", "maison"],
      zones: ["saly", "petite cote", "petite côte", "mbour"],
      statut: "public",
      icon: "🏗️",
      priorite: 100,
      url: "https://mbaye-macon.digiylyfe.com/",
      description: "Entrepreneur maçon à Saly pour rénovation, réparation et aménagement."
    },
    {
      id: "kourant-electricite-saly",
      nom: "Zal & Kourant",
      metier: "Électriciens",
      metiers: ["électricien", "electricien", "électricité", "electricite", "courant", "kourant", "prise", "disjoncteur", "tableau électrique", "eclairage", "éclairage", "dépannage électrique", "installation électrique"],
      categories: ["artisan", "build", "travaux", "maison", "électricité"],
      zones: ["saly", "petite cote", "petite côte", "mbour"],
      statut: "public",
      icon: "⚡",
      priorite: 98,
      url: "https://kourant.digiylyfe.com/",
      description: "Électriciens à Saly pour installation, rénovation, dépannage, tableau, prises et éclairage."
    }
  ];

  const ANNUAIRE_PUBLIC = Array.isArray(window.DIGIY_ANNUAIRE_PUBLIC)
    ? window.DIGIY_ANNUAIRE_PUBLIC
    : ANNUAIRE_DEFAUT;

  const METIERS = [
    { canon: "plombier", mots: ["plombier", "plomberie", "fuite", "robinet", "robinetterie", "evacuation", "évacuation", "eau", "sanitaire"] },
    { canon: "maçon", mots: ["maçon", "macon", "maçonnerie", "maconnerie", "chantier", "construction", "mur", "dalle", "rénovation", "renovation"] },
    { canon: "électricien", mots: ["électricien", "electricien", "électricité", "electricite", "courant", "kourant", "prise", "prises", "disjoncteur", "tableau", "tableau électrique", "eclairage", "éclairage", "dépannage électrique", "installation électrique"] },
    { canon: "chauffeur", mots: ["chauffeur", "driver", "taxi", "aibd", "airport", "aéroport", "transport", "conduire", "trajet"] },
    { canon: "location", mots: ["location", "louer", "logement", "villa", "appartement", "chambre", "studio", "nuit", "réserver", "reserver"] },
    { canon: "restaurant", mots: ["restaurant", "resto", "manger", "table", "réservation table", "reserver table", "dîner", "dejeuner", "déjeuner"] },
    { canon: "boutique", mots: ["boutique", "acheter", "produit", "market", "vente", "vendeur", "commerce", "article"] },
    { canon: "emploi", mots: ["emploi", "job", "travail", "mission", "candidat", "recruter", "recrutement"] },
    { canon: "explore", mots: ["sortie", "visiter", "découvrir", "decouvrir", "lieu", "activité", "activite", "tourisme", "explore"] }
  ];

  const ZONES = [
    { canon: "saly", mots: ["saly", "sally"] },
    { canon: "mbour", mots: ["mbour"] },
    { canon: "dakar", mots: ["dakar"] },
    { canon: "aibd", mots: ["aibd", "aéroport", "aeroport", "airport", "diass"] },
    { canon: "thiès", mots: ["thiès", "thies"] },
    { canon: "touba", mots: ["touba"] },
    { canon: "petite côte", mots: ["petite côte", "petite cote", "ngaparou", "somone", "nianning", "popenguine"] }
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

  function includesAny(text, words) {
    const t = normalize(text);
    return (words || []).some(function (word) {
      const w = normalize(word);
      return w && t.includes(w);
    });
  }

  function arrayText(arr) {
    return Array.isArray(arr) ? arr.join(" ") : String(arr || "");
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
    if (/^mailto:/i.test(u) || /^tel:/i.test(u) || /^sms:/i.test(u)) return u;
    return "#";
  }

  function detectIntent(phrase) {
    const texte = normalize(phrase);

    const metiersDetectes = METIERS
      .filter(function (item) {
        return includesAny(texte, item.mots);
      })
      .map(function (item) {
        return item.canon;
      });

    const zonesDetectees = ZONES
      .filter(function (item) {
        return includesAny(texte, item.mots);
      })
      .map(function (item) {
        return item.canon;
      });

    return {
      brut: phrase,
      texte: texte,
      metiers: metiersDetectes,
      zones: zonesDetectees
    };
  }

  function scoreFiche(fiche, intention) {
    if (!fiche || normalize(fiche.statut || "public") !== "public") return -999;

    const ficheMetiers = normalize([
      fiche.metier,
      arrayText(fiche.metiers),
      arrayText(fiche.categories),
      fiche.description
    ].join(" "));

    const ficheZones = normalize([
      fiche.zone,
      arrayText(fiche.zones),
      fiche.description
    ].join(" "));

    let score = Number(fiche.priorite || 0);

    if (intention.metiers.length) {
      const matchMetier = intention.metiers.some(function (m) {
        return ficheMetiers.includes(normalize(m));
      });

      if (!matchMetier) return -999;
      score += 1000;
    }

    if (intention.zones.length) {
      const matchZone = intention.zones.some(function (z) {
        return ficheZones.includes(normalize(z));
      });

      if (!matchZone) return -999;
      score += 500;
    }

    intention.texte.split(" ").forEach(function (mot) {
      if (mot.length >= 4 && ficheMetiers.includes(mot)) score += 15;
      if (mot.length >= 4 && ficheZones.includes(mot)) score += 10;
    });

    return score;
  }

  function chercherFiches(demande) {
    const intention = detectIntent(demande);

    return ANNUAIRE_PUBLIC
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
      })
      .map(function (item) {
        return item.fiche;
      });
  }

  function ensureStyle() {
    if (document.getElementById("digiy-annuaire-multi-style")) return;

    const style = document.createElement("style");
    style.id = "digiy-annuaire-multi-style";
    style.textContent = `
      .digiy-results-wrap{
        margin:18px auto;
        width:min(980px,94vw);
        font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }
      .digiy-results-title{
        color:#f7e7b4;
        font-weight:1000;
        letter-spacing:-.02em;
        margin:0 0 10px;
        font-size:clamp(20px,4vw,32px);
        text-align:left;
      }
      .digiy-results-sub{
        color:rgba(255,255,255,.78);
        margin:0 0 14px;
        font-weight:750;
        line-height:1.35;
      }
      .digiy-results-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
        gap:12px;
      }
      .digiy-card{
        border:1px solid rgba(196,151,63,.38);
        background:linear-gradient(145deg,rgba(17,72,43,.94),rgba(9,36,25,.96));
        color:white;
        border-radius:22px;
        padding:16px;
        box-shadow:0 16px 44px rgba(0,0,0,.28);
      }
      .digiy-card-top{
        display:flex;
        align-items:center;
        gap:10px;
        margin-bottom:8px;
      }
      .digiy-card-icon{
        width:44px;
        height:44px;
        border-radius:16px;
        display:grid;
        place-items:center;
        background:rgba(196,151,63,.18);
        border:1px solid rgba(196,151,63,.4);
        font-size:24px;
      }
      .digiy-card h3{
        margin:0;
        font-size:20px;
        font-weight:1000;
        color:#f7e7b4;
      }
      .digiy-card .job{
        margin:2px 0 0;
        color:rgba(255,255,255,.86);
        font-weight:850;
      }
      .digiy-card .desc{
        margin:10px 0 12px;
        line-height:1.38;
        color:rgba(255,255,255,.86);
        font-weight:650;
      }
      .digiy-card .zone{
        margin:0 0 12px;
        color:rgba(255,255,255,.72);
        font-weight:800;
      }
      .digiy-actions{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .digiy-actions a,
      .digiy-actions button{
        appearance:none;
        border:0;
        cursor:pointer;
        text-decoration:none;
        border-radius:999px;
        padding:10px 13px;
        font-weight:1000;
        font-size:14px;
      }
      .digiy-open{
        color:#0f281c;
        background:linear-gradient(135deg,#f7e7b4,#c4973f);
      }
      .digiy-whatsapp{
        color:#fff;
        background:rgba(255,255,255,.12);
        border:1px solid rgba(255,255,255,.16)!important;
      }
      .digiy-empty{
        border:1px dashed rgba(247,231,180,.35);
        background:rgba(255,255,255,.06);
        color:rgba(255,255,255,.82);
        border-radius:20px;
        padding:16px;
        font-weight:850;
      }
    `;
    document.head.appendChild(style);
  }

  function getResultsBox() {
    let box = document.getElementById("digiy-results") ||
      document.getElementById("resultatsFiches") ||
      document.querySelector("[data-digiy-results]");

    if (box) return box;

    box = document.createElement("section");
    box.id = "digiy-results";
    box.className = "digiy-results-wrap";

    const anchor = document.querySelector("main") || document.body;
    anchor.appendChild(box);

    return box;
  }

  function renderFiche(fiche) {
    const url = safeUrl(fiche.url);
    const zones = Array.isArray(fiche.zones) ? fiche.zones.join(" · ") : (fiche.zone || "Zone à confirmer");
    const metier = fiche.metier || (Array.isArray(fiche.metiers) ? fiche.metiers[0] : "Professionnel DIGIY");
    const whatsapp = safeUrl(fiche.whatsapp);

    return `
      <article class="digiy-card" data-digiy-fiche="${escapeHtml(fiche.id || fiche.nom)}">
        <div class="digiy-card-top">
          <div class="digiy-card-icon">${escapeHtml(fiche.icon || "👤")}</div>
          <div>
            <h3>${escapeHtml(fiche.nom || "Professionnel DIGIY")}</h3>
            <p class="job">${escapeHtml(metier)}</p>
          </div>
        </div>
        <p class="desc">${escapeHtml(fiche.description || "Fiche professionnelle référencée DIGIYLYFE.")}</p>
        <p class="zone">📍 ${escapeHtml(zones)}</p>
        <div class="digiy-actions">
          ${url !== "#" ? `<a class="digiy-open" href="${escapeHtml(url)}" target="_blank" rel="noopener">Ouvrir la fiche ↗</a>` : `<button class="digiy-open" type="button" disabled>Fiche bientôt reliée</button>`}
          ${whatsapp !== "#" ? `<a class="digiy-whatsapp" href="${escapeHtml(whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        </div>
      </article>
    `;
  }

  function afficherFiches(fiches, demande) {
    ensureStyle();

    const box = getResultsBox();
    const total = fiches.length;

    if (!total) {
      box.innerHTML = `
        <div class="digiy-results-wrap">
          <h2 class="digiy-results-title">Aucune fiche trouvée pour le moment</h2>
          <div class="digiy-empty">
            Demande reçue : « ${escapeHtml(demande || "")} ».<br>
            Le terrain n'est pas encore référencé pour cette recherche, ou la fiche n'est pas encore en statut public.
          </div>
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <div class="digiy-results-wrap">
        <h2 class="digiy-results-title">${total} fiche${total > 1 ? "s" : ""} qui remontent</h2>
        <p class="digiy-results-sub">Les résultats compatibles remontent ensemble. Le client choisit, le pro garde la main.</p>
        <div class="digiy-results-grid">
          ${fiches.map(renderFiche).join("")}
        </div>
      </div>
    `;
  }

  function traiterDemande(demande) {
    const texte = String(demande || "").trim();
    if (!texte) return [];

    const fiches = chercherFiches(texte);
    afficherFiches(fiches, texte);

    return fiches;
  }

  function findInput() {
    return document.querySelector("[data-digiy-input]") ||
      document.getElementById("digiy-input") ||
      document.getElementById("voiceInput") ||
      document.getElementById("searchInput") ||
      document.querySelector("textarea") ||
      document.querySelector("input[type='search']") ||
      document.querySelector("input[type='text']");
  }

  function findGoButton() {
    return document.querySelector("[data-digiy-go]") ||
      document.getElementById("digiy-go") ||
      document.getElementById("goBtn") ||
      Array.from(document.querySelectorAll("button,a")).find(function (el) {
        return normalize(el.textContent) === "go" || normalize(el.textContent).includes("voir");
      });
  }

  function bindUI() {
    const input = findInput();
    const button = findGoButton();

    if (button && input && !button.dataset.digiyMultiBound) {
      button.dataset.digiyMultiBound = "1";
      button.addEventListener("click", function () {
        const demande = input.value || input.textContent || "";
        if (demande.trim()) traiterDemande(demande);
      });
    }

    if (input && !input.dataset.digiyMultiEnterBound) {
      input.dataset.digiyMultiEnterBound = "1";
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          const demande = input.value || input.textContent || "";
          if (demande.trim()) traiterDemande(demande);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindUI);
  } else {
    bindUI();
  }

  window.DIGIY_ANNUAIRE_MULTI = {
    version: VERSION,
    annuaire: ANNUAIRE_PUBLIC,
    detectIntent: detectIntent,
    chercherFiches: chercherFiches,
    afficherFiches: afficherFiches,
    traiterDemande: traiterDemande
  };
})();
