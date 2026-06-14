/* =========================================================
   DIGIY AUDIO RÉPONSE V1 — PRO ACTION DIGIY

   Objectif :
   - Ne pas casser les fiches qui remontent déjà.
   - Ajouter une vraie réponse assistant après GO / VOIR / demande.
   - Lire la réponse à voix haute quand le navigateur l’autorise.
   - Garder la doctrine : DIGIY prépare, le pro valide.
========================================================= */

(function () {
  "use strict";

  let lastText = "";
  let lastTime = 0;

  function clean(txt) {
    return (txt || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findDemandText() {
    const fields = Array.from(
      document.querySelectorAll(
        "[data-digiy-input], #digiy-voice-input, #voiceInput, #digiyInput, #q, #query, textarea, input[type='text'], [contenteditable='true']"
      )
    );

    for (const field of fields) {
      const value =
        field.value ||
        field.innerText ||
        field.textContent ||
        "";

      const txt = value.trim();

      if (txt && txt.length > 1) {
        return txt;
      }
    }

    return "";
  }

  function ensureReplyBox() {
    let box = document.getElementById("digiy-audio-reponse-box");

    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");

      box.style.margin = "14px auto";
      box.style.maxWidth = "760px";
      box.style.padding = "16px";
      box.style.borderRadius = "22px";
      box.style.background = "linear-gradient(135deg, rgba(10,54,34,.96), rgba(17,84,52,.96))";
      box.style.color = "#fff7df";
      box.style.border = "1px solid rgba(196,151,63,.65)";
      box.style.boxShadow = "0 18px 45px rgba(0,0,0,.28)";
      box.style.fontWeight = "900";
      box.style.lineHeight = "1.45";
      box.style.fontSize = "15px";

      const target =
        document.querySelector("[data-digiy-results]") ||
        document.querySelector("#results") ||
        document.querySelector("#fiches") ||
        document.querySelector("main") ||
        document.body;

      if (target && target !== document.body) {
        target.parentNode.insertBefore(box, target);
      } else {
        document.body.insertBefore(box, document.body.firstChild);
      }
    }

    return box;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = "fr-FR";
      msg.rate = 0.86;
      msg.pitch = 0.95;

      window.speechSynthesis.speak(msg);
    } catch (e) {}
  }

  function buildReply(rawText) {
    const t = clean(rawText);

    if (
      t.includes("chauffeur") ||
      t.includes("driver") ||
      t.includes("taxi") ||
      t.includes("aibd") ||
      t.includes("aeroport") ||
      t.includes("conduis")
    ) {
      return {
        icon: "🚗",
        title: "DRIVER",
        text:
          "J’ai compris : tu cherches un chauffeur. Je remonte la porte DRIVER avec les fiches utiles. Tu peux contacter directement le pro. DIGIY prépare, le client choisit, le terrain garde la main."
      };
    }

    if (
      t.includes("logement") ||
      t.includes("maison") ||
      t.includes("chambre") ||
      t.includes("location") ||
      t.includes("louer") ||
      t.includes("loc")
    ) {
      return {
        icon: "🏠",
        title: "LOC",
        text:
          "J’ai compris : tu cherches un logement ou une location. Je remonte la porte LOC. Le client voit, le pro valide, la relation reste directe."
      };
    }

    if (
      t.includes("reserver") ||
      t.includes("reservation") ||
      t.includes("table") ||
      t.includes("restaurant") ||
      t.includes("resto")
    ) {
      return {
        icon: "📅",
        title: "RESA",
        text:
          "J’ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY peut préparer la demande, mais la confirmation reste côté professionnel."
      };
    }

    if (
      t.includes("artisan") ||
      t.includes("plombier") ||
      t.includes("macon") ||
      t.includes("electricien") ||
      t.includes("chantier") ||
      t.includes("service")
    ) {
      return {
        icon: "🏗️",
        title: "BUILD",
        text:
          "J’ai compris : tu cherches un artisan ou un service terrain. Je remonte la porte BUILD avec les fiches adaptées. Contact direct, pas de détour inutile."
      };
    }

    if (
      t.includes("boutique") ||
      t.includes("produit") ||
      t.includes("acheter") ||
      t.includes("market") ||
      t.includes("commerce")
    ) {
      return {
        icon: "🛍️",
        title: "MARKET / COMMERCE",
        text:
          "J’ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce. Le client voit l’offre, le vendeur garde son contact et sa décision."
      };
    }

    if (
      t.includes("emploi") ||
      t.includes("travail") ||
      t.includes("job") ||
      t.includes("mission")
    ) {
      return {
        icon: "💼",
        title: "JOBS",
        text:
          "J’ai compris : tu cherches du travail ou une mission. Je remonte la porte JOBS. DIGIY aide à organiser la rencontre, sans remplacer l’humain."
      };
    }

    if (
      t.includes("sortie") ||
      t.includes("lieu") ||
      t.includes("visiter") ||
      t.includes("decouvrir") ||
      t.includes("explore")
    ) {
      return {
        icon: "📍",
        title: "EXPLORE",
        text:
          "J’ai compris : tu cherches un lieu, une sortie ou une découverte. Je remonte la porte EXPLORE pour ouvrir les bonnes pistes."
      };
    }

    if (
      t.includes("payer") ||
      t.includes("paiement") ||
      t.includes("wave") ||
      t.includes("depense") ||
      t.includes("encaisse") ||
      t.includes("argent") ||
      t.includes("pay")
    ) {
      return {
        icon: "💳",
        title: "PAY",
        text:
          "J’ai compris : la demande touche à l’argent. Je peux préparer l’action PAY, mais aucune validation ne doit se faire seule. Le pro vérifie et valide."
      };
    }

    return {
      icon: "👂",
      title: "DEMANDE TERRAIN",
      text:
        "J’ai compris ta demande. Je laisse les fiches remonter et je prépare la bonne orientation. DIGIY écoute, classe et ouvre la voie. Le terrain garde la main."
    };
  }

  function answerNow(source) {
    const text = findDemandText();

    if (!text) return;

    const now = Date.now();

    if (text === lastText && now - lastTime < 2500) {
      return;
    }

    lastText = text;
    lastTime = now;

    const reply = buildReply(text);
    const box = ensureReplyBox();

    box.innerHTML =
      "<div style='font-size:22px;margin-bottom:6px'>" +
      reply.icon +
      " " +
      reply.title +
      "</div>" +
      "<div>" +
      reply.text +
      "</div>";

    speak(reply.text);
  }

  function bindClicks() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("button, a, [role='button'], .btn, .pill, .chip");
      if (!btn) return;

      const label = clean(btn.innerText || btn.textContent || "");

      if (
        label === "go" ||
        label.includes("go") ||
        label.includes("voir") ||
        label.includes("ecouter") ||
        label.includes("j ecoute") ||
        label.includes("🎙") ||
        label.includes("🔎") ||
        label.includes("👂")
      ) {
        setTimeout(function () {
          answerNow("click");
        }, 350);
      }
    });
  }

  function bindEnter() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;

      const target = e.target;
      if (!target) return;

      const tag = (target.tagName || "").toLowerCase();

      if (
        tag === "textarea" ||
        tag === "input" ||
        target.getAttribute("contenteditable") === "true"
      ) {
        setTimeout(function () {
          answerNow("enter");
        }, 350);
      }
    });
  }

  function exposeApi() {
    window.DIGIY_AUDIO_REPONSE = {
      answer: answerNow,
      speak: speak,
      buildReply: buildReply
    };
  }

  function boot() {
    bindClicks();
    bindEnter();
    exposeApi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
