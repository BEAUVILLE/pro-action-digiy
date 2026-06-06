/* DIGIY — précision recherche naturelle publique
   Objectif :
   Quand le client dit naturellement :
   “je cherche un magasin de serviettes à Saly”
   DIGIY remonte une carte précise boutique / linge / serviettes,
   pas seulement le module MARKET générique.

   À charger APRÈS :
   assets/js/action-digiy-public.js
*/

(function () {
  "use strict";

  function norm(v) {
    return String(v || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function hasAny(text, words) {
    return words.some(function (w) {
      return text.indexOf(norm(w)) >= 0;
    });
  }

  function installPrecisionPatch() {
    var api = window.DIGIY_ACTION_PUBLIC;

    if (!api || !Array.isArray(api.fiches)) {
      setTimeout(installPrecisionPatch, 120);
      return;
    }

    var preciseCards = [
      {
        module: "MARKET",
        icon: "🧺",
        tag: "#boutique · #linge",
        title: "Boutiques serviettes & linge — Saly",
        zone: "Saly · Petite Côte",
        desc:
          "Serviettes, draps, linge de bain et linge maison. Contact direct avec les boutiques locales.",
        keys: [
          "magasin",
          "boutique",
          "commerce",
          "serviette",
          "serviettes",
          "linge",
          "linge maison",
          "drap",
          "draps",
          "bain",
          "saly",
          "petite cote",
          "petite côte"
        ],
        url: "https://digiylyfe.com/",
        cta: "Voir les cartes",
        wa:
          "Bonjour, je cherche un magasin de serviettes / linge à Saly via DIGIY."
      },
      {
        module: "MARKET",
        icon: "🛍️",
        tag: "#boutique locale",
        title: "Astou Boutique — linge & serviettes",
        zone: "Saly",
        desc:
          "Carte boutique locale pour serviettes, draps et linge maison. Le client contacte directement.",
        keys: [
          "astou",
          "astou boutique",
          "serviette",
          "serviettes",
          "drap",
          "draps",
          "linge",
          "linge maison",
          "boutique saly",
          "magasin saly"
        ],
        url: "https://digiylyfe.com/",
        cta: "Voir la fiche",
        wa:
          "Bonjour, je cherche des serviettes / du linge à Saly. Je souhaite contacter Astou Boutique via DIGIY."
      }
    ];

    preciseCards
      .slice()
      .reverse()
      .forEach(function (card) {
        var exists = api.fiches.some(function (f) {
          return f && f.title === card.title;
        });

        if (!exists) {
          api.fiches.unshift(card);
        }
      });

    var originalMatch = api.matchFiches;

    api.matchFiches = function (text) {
      var n = norm(text);

      if (!n) {
        return api.fiches.slice(0, 3);
      }

      var productIntent = hasAny(n, [
        "serviette",
        "serviettes",
        "linge",
        "drap",
        "draps",
        "bain"
      ]);

      var shopIntent = hasAny(n, [
        "magasin",
        "boutique",
        "commerce",
        "acheter",
        "je cherche",
        "je veux",
        "ou trouver",
        "où trouver"
      ]);

      var zoneSaly = hasAny(n, [
        "saly",
        "petite cote",
        "petite côte"
      ]);

      var preciseIntent = productIntent && shopIntent && zoneSaly;

      if (preciseIntent) {
        var precise = api.fiches
          .map(function (f) {
            var score = 0;
            var fn = norm(
              [
                f.title,
                f.zone,
                f.desc,
                (f.keys || []).join(" ")
              ].join(" ")
            );

            if (f.title === "Boutiques serviettes & linge — Saly") {
              score += 100;
            }

            if (f.title === "Astou Boutique — linge & serviettes") {
              score += 90;
            }

            if (f.module === "MARKET") {
              score += 20;
            }

            if (fn.indexOf("serviette") >= 0 || fn.indexOf("linge") >= 0) {
              score += 20;
            }

            if (fn.indexOf("saly") >= 0) {
              score += 20;
            }

            (f.keys || []).forEach(function (k) {
              if (n.indexOf(norm(k)) >= 0) {
                score += 2;
              }
            });

            return Object.assign({}, f, { score: score });
          })
          .filter(function (f) {
            return f.score > 0;
          })
          .sort(function (a, b) {
            return b.score - a.score;
          })
          .slice(0, 6);

        return precise;
      }

      if (typeof originalMatch === "function") {
        return originalMatch(text);
      }

      return api.fiches.slice(0, 6);
    };

    var originalRender = api.render;

    api.render = function () {
      if (typeof originalRender === "function") {
        originalRender();
      }

      var q = document.getElementById("q");
      var status = document.getElementById("status");

      if (!q || !status) return;

      var n = norm(q.value);

      if (
        hasAny(n, ["serviette", "serviettes", "linge", "drap", "draps"]) &&
        hasAny(n, ["magasin", "boutique", "commerce", "acheter"]) &&
        hasAny(n, ["saly", "petite cote", "petite côte"])
      ) {
        status.textContent =
          "Recherche précise captée : boutiques serviettes & linge à Saly.";
      }
    };

    window.DIGIY_ACTION_PUBLIC_PRECISION_SERVIETTES_SALY = {
      version: "precision-serviettes-saly-20260606",
      installed: true
    };
  }

  installPrecisionPatch();
})();
