/* DIGIYLYFE — FG NAILS dans ACTION PRO · LA VOIX — 7 langues — 2026-08-05 */
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
    activite: "Onglerie · Soins de beauté · Massage modelant · Lipocavitation ventre · Produits d’hygiène femme et homme",
    categorie: "BEAUTÉ",
    sousCategorie: "onglerie · esthétique · bien-être · hygiène",
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
    description: "FG NAILS accueille sa clientèle à la Résidence Nafil à Saly pour l’onglerie, les soins de beauté, le massage modelant, la lipocavitation ventre et les produits d’hygiène pour femmes et hommes. Contact direct par téléphone ou WhatsApp.",
    keys: [
      "fg nails", "f g nails", "fama", "onglerie", "ongles", "manucure", "pedicure", "pédicure",
      "beaute", "beauté", "esthetique", "esthétique", "soins de beaute", "soins de beauté",
      "bien etre", "bien-être", "massage modelant", "lipocavitation", "lipocavitation ventre", "ventre",
      "hygiene femme", "hygiène femme", "hygiene homme", "hygiène homme", "cosmetique", "cosmétique", "produits de beauté",
      "nail salon", "nails", "manicure", "pedicure", "beauty care", "beauty products", "women hygiene", "men hygiene", "abdominal lipocavitation", "abdomen",
      "salon de uñas", "uñas", "manicura", "pedicura", "belleza", "productos de higiene", "lipocavitación abdominal",
      "nagelstudio", "nagelpflege", "maniküre", "pediküre", "schönheit", "hygieneprodukte", "lipokavitation am bauch",
      "salone unghie", "unghie", "manicure", "pedicure", "bellezza", "prodotti per l igiene", "lipocavitazione addominale",
      "nagelsalon", "nagelverzorging", "manicure", "pedicure", "schoonheid", "hygieneproducten", "lipocavitatie voor de buik",
      "صالون أظافر", "العناية بالأظافر", "مانيكير", "باديكير", "تجميل", "منتجات النظافة", "ليبـوكافيتيشن البطن", "البطن",
      "saly", "résidence nafil", "residence nafil", "clinique des yeux", "petite côte", "petite cote"
    ],
    forbidden: ["garage", "chauffeur", "plomberie", "maçon", "macon", "électricité", "electricite"],
    wa: "Bonjour FG NAILS, je viens de La Voix du Business DIGIYLYFE et je souhaite un renseignement ou un rendez-vous."
  };

  const LANGS = ["fr", "en", "es", "de", "it", "nl", "ar"];
  const TEXT = {
    fr: { label: "💅 FG NAILS", query: "Je cherche une onglerie, des soins de beauté ou une lipocavitation ventre à Saly", line: "Je cherche une onglerie ou des soins de beauté à Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Je cherche une onglerie à Saly" },
    en: { label: "💅 FG NAILS", query: "I need a nail salon, beauty care or abdominal lipocavitation in Saly", line: "I need a nail salon or beauty care in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "I need a nail salon in Saly" },
    es: { label: "💅 FG NAILS", query: "Busco manicura, cuidados de belleza o lipocavitación abdominal en Saly", line: "Busco manicura o cuidados de belleza en Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Busco manicura en Saly" },
    de: { label: "💅 FG NAILS", query: "Ich suche ein Nagelstudio, Schönheitspflege oder Lipokavitation am Bauch in Saly", line: "Ich suche ein Nagelstudio oder Schönheitspflege in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Ich suche ein Nagelstudio in Saly" },
    it: { label: "💅 FG NAILS", query: "Cerco un salone unghie, trattamenti di bellezza o lipocavitazione addominale a Saly", line: "Cerco un salone unghie o trattamenti di bellezza a Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Cerco un salone unghie a Saly" },
    nl: { label: "💅 FG NAILS", query: "Ik zoek een nagelsalon, schoonheidsbehandeling of lipocavitatie voor de buik in Saly", line: "Ik zoek een nagelsalon of schoonheidsbehandeling in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Ik zoek een nagelsalon in Saly" },
    ar: { label: "💅 FG NAILS", query: "أبحث عن صالون أظافر أو خدمات تجميل أو ليبـوكافيتيشن البطن في سالي", line: "أبحث عن صالون أظافر أو خدمات تجميل في سالي", sub: "FG NAILS · Résidence Nafil · Saly", chip: "أبحث عن صالون أظافر في سالي" }
  };

  function addFgNails(source) {
    const list = Array.isArray(source) ? source.slice() : [];
    const index = list.findIndex(function (item) { return item && item.id === FG_NAILS.id; });
    if (index >= 0) list[index] = FG_NAILS;
    else list.unshift(FG_NAILS);
    return list;
  }

  const previousGetter = typeof global.DIGIY_GET_PUBLIC_DIRECTORY === "function"
    ? global.DIGIY_GET_PUBLIC_DIRECTORY.bind(global)
    : null;

  global.DIGIY_GET_PUBLIC_DIRECTORY = function () {
    let base = [];
    try { base = previousGetter ? previousGetter() : global.DIGIY_PUBLIC_DIRECTORY; }
    catch (_) { base = global.DIGIY_PUBLIC_DIRECTORY; }
    return addFgNails(base);
  };

  global.DIGIY_PUBLIC_DIRECTORY = addFgNails(global.DIGIY_PUBLIC_DIRECTORY);

  if (global.DIGIY_ANNUAIRE_PUBLIC) {
    global.DIGIY_ANNUAIRE_PUBLIC.version = "20260805-fg-nails-action-pro-v3";
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = addFgNails(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }
  if (global.DIGIY_ANNUAIRE_MULTI) {
    global.DIGIY_ANNUAIRE_MULTI.version = "20260805-fg-nails-action-pro-v3";
    global.DIGIY_ANNUAIRE_MULTI.annuaire = addFgNails(global.DIGIY_ANNUAIRE_MULTI.annuaire);
  }

  function currentLang() {
    const attr = (document.documentElement.getAttribute("data-digiy-lang") || document.documentElement.lang || "fr").slice(0, 2).toLowerCase();
    if (LANGS.includes(attr)) return attr;
    try {
      const saved = localStorage.getItem("digiy_action_lang_7") || localStorage.getItem("digiy-lang");
      if (LANGS.includes(saved)) return saved;
    } catch (_) {}
    return "fr";
  }

  function runQuery(query) {
    const field = document.getElementById("q");
    if (field) {
      field.value = query;
      field.dispatchEvent(new Event("input", { bubbles: true }));
    }
    document.getElementById("searchBtn")?.click();
    const panel = document.getElementById("examplesPanel");
    const toggle = document.getElementById("examplesToggle");
    if (panel) panel.hidden = true;
    toggle?.setAttribute("aria-expanded", "false");
  }

  function ensureExample() {
    const panel = document.getElementById("examplesPanel");
    if (!panel) return false;
    let button = document.getElementById("fgNailsVoiceExample");
    if (!button) {
      button = document.createElement("button");
      button.id = "fgNailsVoiceExample";
      button.className = "examplePhrase fg-nails-example";
      button.type = "button";
      button.innerHTML = '<span class="mod"></span><span class="fr"></span><span class="wo"></span>';
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        runQuery((TEXT[currentLang()] || TEXT.fr).query);
      });
      const astou = Array.from(panel.querySelectorAll(".examplePhrase")).find(function (el) {
        return /ASTOU/i.test(el.textContent || "");
      });
      if (astou && astou.nextSibling) panel.insertBefore(button, astou.nextSibling);
      else panel.appendChild(button);
    }
    updateExample();
    return true;
  }

  function ensureQuickChip() {
    const grid = document.querySelector(".quickGrid");
    if (!grid) return false;
    let chip = document.getElementById("fgNailsQuickChip");
    if (!chip) {
      chip = document.createElement("button");
      chip.id = "fgNailsQuickChip";
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = "💅";
      chip.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        runQuery((TEXT[currentLang()] || TEXT.fr).chip);
      });
      grid.appendChild(chip);
    }
    chip.dataset.q = (TEXT[currentLang()] || TEXT.fr).chip;
    chip.setAttribute("aria-label", "FG NAILS · Onglerie · Beauté · Saly");
    return true;
  }

  function updateExample() {
    const button = document.getElementById("fgNailsVoiceExample");
    if (!button) return;
    const t = TEXT[currentLang()] || TEXT.fr;
    button.dataset.q = t.query;
    const mod = button.querySelector(".mod");
    const line = button.querySelector(".fr");
    const sub = button.querySelector(".wo");
    if (mod) mod.textContent = t.label;
    if (line) line.textContent = t.line;
    if (sub) sub.textContent = t.sub;
    button.dir = currentLang() === "ar" ? "rtl" : "ltr";
    const chip = document.getElementById("fgNailsQuickChip");
    if (chip) chip.dataset.q = t.chip;
  }

  function installUi() {
    const ok = ensureExample();
    ensureQuickChip();
    return ok;
  }

  if (!installUi()) {
    const observer = new MutationObserver(function () {
      if (installUi()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 15000);
  }

  new MutationObserver(function () { updateExample(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir", "data-digiy-lang"] });
  global.addEventListener("storage", updateExample);

  try {
    global.dispatchEvent(new CustomEvent("digiy:fg-nails-ready", {
      detail: { id: FG_NAILS.id, phone: FG_NAILS.phone, version: "v3" }
    }));
  } catch (_) {}
})(window);
