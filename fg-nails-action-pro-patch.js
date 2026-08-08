/* DIGIYLYFE — FG NAILS dans ACTION PRO · LA VOIX — services réels + intentions — 7 langues — 2026-08-08 */
(function (global) {
  "use strict";

  const FG_NAILS = {
    id: "fg-nails-saly",
    kind: "directory",
    public: true,
    icon: "💅",
    nom: "FG NAILS",
    title: "FG NAILS — Onglerie · Beauté · Bien-être · Hygiène à Saly",
    metier: "onglerie, beauté, bien-être et soins",
    activite: "Onglerie · Soins de beauté · Massage modelant · Lipocavitation ventre · Produits d’hygiène et produits intimes femme et homme",
    categorie: "BEAUTÉ",
    sousCategorie: "onglerie · esthétique · bien-être · massage · hygiène · produits intimes",
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
    searchSchema: "digiy-service-intent-v1",
    serviceGroups: [
      "onglerie",
      "beauté et esthétique",
      "bien-être",
      "massage modelant",
      "lipocavitation ventre",
      "hygiène intime femme et homme"
    ],
    services: [
      {
        id: "onglerie",
        label: "Onglerie",
        aliases: ["ongles", "manucure", "pédicure", "nail salon", "manicure", "pedicure", "salon de uñas", "manicura", "pedicura", "Nagelstudio", "Maniküre", "Pediküre", "salone unghie", "nagelsalon", "صالون أظافر", "العناية بالأظافر"]
      },
      {
        id: "beaute",
        label: "Soins de beauté",
        aliases: ["beauté", "esthétique", "beauty care", "beauty treatments", "cuidados de belleza", "Schönheitspflege", "trattamenti di bellezza", "schoonheidsbehandeling", "خدمات تجميل"]
      },
      {
        id: "massage-modelant",
        label: "Massage modelant",
        aliases: ["massage", "massage modelant", "modeling massage", "masaje modelador", "modellierende Massage", "massaggio modellante", "modellerende massage", "تدليك"]
      },
      {
        id: "lipocavitation-ventre",
        label: "Lipocavitation ventre",
        aliases: ["lipocavitation", "lipocavitation ventre", "abdominal lipocavitation", "lipocavitación abdominal", "Lipokavitation am Bauch", "lipocavitazione addominale", "lipocavitatie voor de buik", "ليبـوكافيتيشن البطن", "البطن"]
      },
      {
        id: "hygiene-intime",
        label: "Produits d’hygiène et produits intimes femme et homme",
        aliases: [
          "hygiène femme", "hygiene femme", "hygiène homme", "hygiene homme", "hygiène intime", "hygiene intime", "produit intime", "produits intimes", "soin intime", "soins intimes",
          "women hygiene", "men hygiene", "intimate hygiene", "intimate care products",
          "higiene femenina", "higiene masculina", "higiene íntima", "productos íntimos",
          "Damenhygiene", "Herrenhygiene", "Intimhygiene", "Intimpflegeprodukte",
          "igiene donna", "igiene uomo", "igiene intima", "prodotti intimi",
          "hygiëne vrouw", "hygiëne man", "intieme hygiëne", "intieme verzorgingsproducten",
          "منتجات النظافة", "العناية الشخصية", "منتجات العناية الحميمة"
        ]
      }
    ],
    intents: {
      fr: [
        "je cherche une onglerie à Saly",
        "je cherche des soins de beauté à Saly",
        "je cherche un massage modelant à Saly",
        "je cherche une lipocavitation ventre à Saly",
        "je cherche des produits d’hygiène intime femme ou homme à Saly"
      ],
      en: [
        "I need a nail salon in Saly",
        "I need beauty care in Saly",
        "I need a modeling massage in Saly",
        "I need abdominal lipocavitation in Saly",
        "I need intimate hygiene products in Saly"
      ],
      es: [
        "Busco manicura en Saly",
        "Busco cuidados de belleza en Saly",
        "Busco masaje modelador en Saly",
        "Busco lipocavitación abdominal en Saly",
        "Busco productos de higiene íntima en Saly"
      ],
      de: [
        "Ich suche ein Nagelstudio in Saly",
        "Ich suche Schönheitspflege in Saly",
        "Ich suche eine modellierende Massage in Saly",
        "Ich suche Lipokavitation am Bauch in Saly",
        "Ich suche Intimpflegeprodukte in Saly"
      ],
      it: [
        "Cerco un salone unghie a Saly",
        "Cerco trattamenti di bellezza a Saly",
        "Cerco un massaggio modellante a Saly",
        "Cerco lipocavitazione addominale a Saly",
        "Cerco prodotti per l’igiene intima a Saly"
      ],
      nl: [
        "Ik zoek een nagelsalon in Saly",
        "Ik zoek een schoonheidsbehandeling in Saly",
        "Ik zoek een modellerende massage in Saly",
        "Ik zoek lipocavitatie voor de buik in Saly",
        "Ik zoek intieme verzorgingsproducten in Saly"
      ],
      ar: [
        "أبحث عن صالون أظافر في سالي",
        "أبحث عن خدمات تجميل في سالي",
        "أبحث عن تدليك في سالي",
        "أبحث عن ليبـوكافيتيشن البطن في سالي",
        "أبحث عن منتجات العناية الحميمة في سالي"
      ]
    },
    description: "FG NAILS accueille sa clientèle à la Résidence Nafil à Saly pour l’onglerie, les soins de beauté, le massage modelant, la lipocavitation ventre ainsi que des produits d’hygiène et produits intimes pour femmes et hommes. Contact direct par téléphone ou WhatsApp.",
    keys: [
      "fg nails", "f g nails", "fama", "onglerie", "ongles", "manucure", "pedicure", "pédicure",
      "beaute", "beauté", "esthetique", "esthétique", "soins de beaute", "soins de beauté",
      "bien etre", "bien-être", "massage", "massage modelant", "lipocavitation", "lipocavitation ventre", "ventre",
      "hygiene femme", "hygiène femme", "hygiene homme", "hygiène homme", "hygiene intime", "hygiène intime", "produit intime", "produits intimes", "soin intime", "soins intimes", "cosmetique", "cosmétique", "produits de beauté",
      "nail salon", "nails", "manicure", "pedicure", "beauty care", "beauty treatments", "modeling massage", "beauty products", "women hygiene", "men hygiene", "intimate hygiene", "intimate care products", "abdominal lipocavitation", "abdomen",
      "salon de uñas", "uñas", "manicura", "pedicura", "belleza", "cuidados de belleza", "masaje modelador", "higiene íntima", "productos íntimos", "productos de higiene", "lipocavitación abdominal",
      "nagelstudio", "nagelpflege", "maniküre", "pediküre", "schönheit", "schönheitspflege", "modellierende massage", "intimhygiene", "intimpflegeprodukte", "hygieneprodukte", "lipokavitation am bauch",
      "salone unghie", "unghie", "manicure", "pedicure", "bellezza", "trattamenti di bellezza", "massaggio modellante", "igiene intima", "prodotti intimi", "prodotti per l igiene", "lipocavitazione addominale",
      "nagelsalon", "nagelverzorging", "manicure", "pedicure", "schoonheid", "schoonheidsbehandeling", "modellerende massage", "intieme hygiëne", "intieme verzorgingsproducten", "hygieneproducten", "lipocavitatie voor de buik",
      "صالون أظافر", "العناية بالأظافر", "مانيكير", "باديكير", "تجميل", "خدمات تجميل", "تدليك", "منتجات النظافة", "العناية الشخصية", "منتجات العناية الحميمة", "ليبـوكافيتيشن البطن", "البطن",
      "saly", "résidence nafil", "residence nafil", "clinique des yeux", "petite côte", "petite cote"
    ],
    forbidden: ["garage", "chauffeur", "plomberie", "maçon", "macon", "électricité", "electricite"],
    wa: "Bonjour FG NAILS, je viens de La Voix du Business DIGIYLYFE et je souhaite un renseignement sur un service, un soin, un produit ou un rendez-vous."
  };

  const LANGS = ["fr", "en", "es", "de", "it", "nl", "ar"];
  const TEXT = {
    fr: { label: "💅 FG NAILS", query: "Je cherche une onglerie, des soins de beauté, un massage modelant, une lipocavitation ventre ou des produits d’hygiène intime à Saly", line: "Onglerie · beauté · massage · lipocavitation · hygiène intime à Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Je cherche beauté et bien-être à Saly" },
    en: { label: "💅 FG NAILS", query: "I need a nail salon, beauty care, a modeling massage, abdominal lipocavitation or intimate hygiene products in Saly", line: "Nails · beauty · massage · lipocavitation · intimate care in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "I need beauty and wellness in Saly" },
    es: { label: "💅 FG NAILS", query: "Busco manicura, cuidados de belleza, masaje modelador, lipocavitación abdominal o productos de higiene íntima en Saly", line: "Uñas · belleza · masaje · lipocavitación · higiene íntima en Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Busco belleza y bienestar en Saly" },
    de: { label: "💅 FG NAILS", query: "Ich suche ein Nagelstudio, Schönheitspflege, eine modellierende Massage, Lipokavitation am Bauch oder Intimpflegeprodukte in Saly", line: "Nägel · Schönheit · Massage · Lipokavitation · Intimpflege in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Ich suche Schönheit und Wellness in Saly" },
    it: { label: "💅 FG NAILS", query: "Cerco un salone unghie, trattamenti di bellezza, massaggio modellante, lipocavitazione addominale o prodotti per l’igiene intima a Saly", line: "Unghie · bellezza · massaggio · lipocavitazione · igiene intima a Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Cerco bellezza e benessere a Saly" },
    nl: { label: "💅 FG NAILS", query: "Ik zoek een nagelsalon, schoonheidsbehandeling, modellerende massage, lipocavitatie voor de buik of intieme verzorgingsproducten in Saly", line: "Nagels · schoonheid · massage · lipocavitatie · intieme verzorging in Saly", sub: "FG NAILS · Résidence Nafil · Saly", chip: "Ik zoek beauty en wellness in Saly" },
    ar: { label: "💅 FG NAILS", query: "أبحث عن صالون أظافر أو خدمات تجميل أو تدليك أو ليبـوكافيتيشن البطن أو منتجات العناية الحميمة في سالي", line: "أظافر · تجميل · تدليك · ليبـوكافيتيشن · عناية حميمة في سالي", sub: "FG NAILS · Résidence Nafil · Saly", chip: "أبحث عن الجمال والعناية في سالي" }
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
    global.DIGIY_ANNUAIRE_PUBLIC.version = "20260808-fg-nails-service-intents-v4";
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = addFgNails(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }
  if (global.DIGIY_ANNUAIRE_MULTI) {
    global.DIGIY_ANNUAIRE_MULTI.version = "20260808-fg-nails-service-intents-v4";
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
    chip.setAttribute("aria-label", "FG NAILS · Onglerie · Beauté · Bien-être · Hygiène · Saly");
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
      detail: { id: FG_NAILS.id, phone: FG_NAILS.phone, version: "v4" }
    }));
  } catch (_) {}
})(window);
