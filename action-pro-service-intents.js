/*
  DIGIYLYFE — ACTION PRO · Couche services + intentions
  Objectif : transformer les services réels d'une fiche et les formulations naturelles
  de LA VOIX en mots de recherche compris par le moteur stable ACTION PRO.
  Version : 20260808-service-intents-v1
*/
(function (global) {
  "use strict";

  const VERSION = "20260808-service-intents-v1";

  if (global.DIGIY_ACTION_SERVICE_INTENTS && global.DIGIY_ACTION_SERVICE_INTENTS.version === VERSION) {
    return;
  }

  function addText(value, bucket, depth) {
    if (depth > 6 || value == null) return;

    if (typeof value === "string") {
      const text = value.trim();
      if (text) bucket.push(text);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(function (entry) { addText(entry, bucket, depth + 1); });
      return;
    }

    if (typeof value === "object") {
      Object.keys(value).forEach(function (key) {
        addText(value[key], bucket, depth + 1);
      });
    }
  }

  function uniqueTexts(values) {
    const seen = new Set();
    const out = [];

    values.forEach(function (value) {
      if (typeof value !== "string") return;
      const text = value.trim();
      if (!text) return;
      const signature = text.toLocaleLowerCase();
      if (seen.has(signature)) return;
      seen.add(signature);
      out.push(text);
    });

    return out;
  }

  function enrichItem(source) {
    if (!source || typeof source !== "object") return source;

    const extra = [];
    addText(source.services, extra, 0);
    addText(source.serviceGroups, extra, 0);
    addText(source.intents, extra, 0);
    addText(source.intentions, extra, 0);
    addText(source.aliases, extra, 0);
    addText(source.searchTerms, extra, 0);

    if (!extra.length) return source;

    const currentKeys = Array.isArray(source.keys) ? source.keys : [];
    const currentMots = Array.isArray(source.mots) ? source.mots : currentKeys;
    const enriched = uniqueTexts(currentKeys.concat(currentMots, extra));

    return Object.assign({}, source, {
      keys: enriched,
      mots: enriched,
      searchSchema: source.searchSchema || "digiy-service-intent-v1"
    });
  }

  function enrichList(source) {
    if (!Array.isArray(source)) return [];
    return source.map(enrichItem);
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
    return enrichList(base);
  };

  global.DIGIY_PUBLIC_DIRECTORY = enrichList(global.DIGIY_PUBLIC_DIRECTORY);

  if (global.DIGIY_ANNUAIRE_PUBLIC && Array.isArray(global.DIGIY_ANNUAIRE_PUBLIC.fiches)) {
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = enrichList(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }

  if (global.DIGIY_ANNUAIRE_MULTI && Array.isArray(global.DIGIY_ANNUAIRE_MULTI.annuaire)) {
    global.DIGIY_ANNUAIRE_MULTI.annuaire = enrichList(global.DIGIY_ANNUAIRE_MULTI.annuaire);
  }

  global.DIGIY_ACTION_SERVICE_INTENTS = {
    version: VERSION,
    enrichItem: enrichItem,
    enrichList: enrichList
  };

  try {
    global.dispatchEvent(new CustomEvent("digiy:service-intents-ready", {
      detail: { version: VERSION }
    }));
  } catch (_) {}
})(window);
