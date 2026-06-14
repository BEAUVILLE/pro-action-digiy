/* =========================================================
   DIGIY AUDIO RÉPONSE V2 — PRO ACTION DIGIY
   Version robuste : répond après GO, clic, entrée, ou remontée des fiches.

   À appeler juste avant </body> :
   <script src="./digiy-audio-reponse-v2.js?v=20260614-3"></script>
========================================================= */

(function () {
  "use strict";

  let lastDemand = "";
  let lastAnswerKey = "";
  let lastAnswerAt = 0;
  let timer = null;
  let userGestureSeen = false;

  function clean(txt) {
    return (txt || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function textOf(el) {
    if (!el) return "";
    return (el.value || el.innerText || el.textContent || "").toString().trim();
  }

  function findDemandText() {
    const selectors = [
      "[data-digiy-input]",
      "#digiy-voice-input",
      "#voiceInput",
      "#digiyInput",
      "#searchInput",
      "#search",
      "#q",
      "#query",
      "textarea",
      "input[type='search']",
      "input[type='text']",
      "[contenteditable='true']"
    ];

    for (const sel of selectors) {
      const nodes = Array.from(document.querySelectorAll(sel));
      for (const node of nodes) {
        const txt = textOf(node);
        if (txt && txt.length > 2) {
          lastDemand = txt;
          return txt;
        }
      }
    }

    return lastDemand || "";
  }

  function inferDemandFromPage() {
    const body = clean(document.body ? document.body.innerText : "");

    if (body.includes("driver") || body.includes("chauffeur") || body.includes("aibd")) {
      return "chauffeur";
    }

    if (body.includes("loc") || body.includes("logement") || body.includes("location")) {
      return "logement";
    }

    if (body.includes("resa") || body.includes("reservation") || body.includes("table")) {
      return "reservation";
    }

    if (body.includes("build") || body.includes("artisan") || body.includes("chantier")) {
      return "artisan";
    }

    if (body.includes("market") || body.includes("boutique") || body.includes("produit")) {
      return "boutique";
    }

    if (body.includes("jobs") || body.includes("emploi") || body.includes("mission")) {
      return "emploi";
    }

    if (body.includes("pay") || body.includes("paiement") || body.includes("argent")) {
      return "pay";
    }

    return "";
  }

  function buildReply(raw) {
    const t = clean(raw);

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
          "J’ai compris : tu veux préparer une réservation. Je remonte la porte RESA. DIGIY prépare la demande, mais la confirmation reste côté professionnel."
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
        title: "MARKET",
        text:
          "J’ai compris : tu cherches un produit ou une boutique. Je remonte la bonne porte commerce. Le vendeur garde son contact, son argent et sa décision."
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
          "J’ai compris : la demande touche à l’argent. Je peux préparer l’action PAY, mais aucune validation ne se fait seule. Le pro vérifie et valide."
      };
    }

    return {
      icon: "👂",
      title: "DEMANDE TERRAIN",
      text:
        "J’ai compris ta demande. Je laisse les fiches remonter et je prépare la bonne orientation. DIGIY écoute, classe et ouvre la voie. Le terrain garde la main."
    };
  }

  function ensureBox() {
    let box = document.getElementById("digiy-audio-reponse-box-v2");

    if (!box) {
      box = document.createElement("div");
      box.id = "digiy-audio-reponse-box-v2";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");

      box.style.position = "fixed";
      box.style.left = "12px";
      box.style.right = "12px";
      box.style.bottom = "86px";
      box.style.zIndex = "99999";
      box.style.maxWidth = "760px";
      box.style.margin = "0 auto";
      box.style.padding = "16px";
      box.style.borderRadius = "22px";
      box.style.background =
        "linear-gradient(135deg, rgba(10,54,34,.98), rgba(17,84,52,.98))";
      box.style.color = "#fff7df";
      box.style.border = "1px solid rgba(196,151,63,.75)";
      box.style.boxShadow = "0 18px 45px rgba(0,0,0,.35)";
      box.style.fontWeight = "900";
      box.style.lineHeight = "1.45";
      box.style.fontSize = "15px";
      box.style.display = "none";

      document.body.appendChild(box);
    }

    return box;
  }

  function speak(text) {
    if (!userGestureSeen) return;
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

  function answerNow(reason) {
    let demand = findDemandText();

    if (!demand) {
      demand = inferDemandFromPage();
    }

    if (!demand) return;

    const reply = buildReply(demand);
    const key = reply.title + "::" + clean(demand);
    const now = Date.now();

    if (key === lastAnswerKey && now - lastAnswerAt < 4000) {
      return;
    }

    lastAnswerKey = key;
    lastAnswerAt = now;

    const box = ensureBox();

    box.innerHTML =
      "<div style='font-size:22px;margin-bottom:6px'>" +
      reply.icon +
      " " +
      reply.title +
      "</div>" +
      "<div>" +
      reply.text +
      "</div>";

    box.style.display = "block";

    speak(reply.text);
  }

  function scheduleAnswer(reason, delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      answerNow(reason);
    }, delay || 800);
  }

  function bindInputs() {
    document.addEventListener(
      "input",
      function (e) {
        const target = e.target;
        if (!target) return;

        const tag = (target.tagName || "").toLowerCase();
        const editable = target.getAttribute("contenteditable") === "true";

        if (
          tag === "textarea" ||
          tag === "input" ||
          editable ||
          target.matches("[data-digiy-input]")
        ) {
          const txt = textOf(target);
          if (txt && txt.length > 2) {
            lastDemand = txt;
          }
        }
      },
      true
    );
  }

  function bindClicks() {
    ["click", "pointerup", "touchend"].forEach(function (eventName) {
      document.addEventListener(
        eventName,
        function () {
          userGestureSeen = true;
          scheduleAnswer(eventName, 900);
        },
        true
      );
    });

    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Enter") {
          userGestureSeen = true;
          scheduleAnswer("enter", 500);
        }
      },
      true
    );
  }

  function observeResults() {
    if (!document.body || !("MutationObserver" in window)) return;

    const observer = new MutationObserver(function (mutations) {
      let changed = false;

      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          changed = true;
          break;
        }
      }

      if (changed) {
        const body = clean(document.body.innerText || "");

        if (
          body.includes("fiches qui remontent") ||
          body.includes("driver") ||
          body.includes("loc") ||
          body.includes("resa") ||
          body.includes("build") ||
          body.includes("market") ||
          body.includes("jobs") ||
          body.includes("pay")
        ) {
          scheduleAnswer("mutation", 600);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function exposeApi() {
    window.DIGIY_AUDIO_REPONSE_V2 = {
      answer: answerNow,
      speak: speak,
      buildReply: buildReply
    };
  }

  function boot() {
    document.documentElement.setAttribute("data-digiy-audio-reponse-v2", "on");

    bindInputs();
    bindClicks();
    observeResults();
    exposeApi();

    console.log("DIGIY AUDIO RÉPONSE V2 chargé ✅");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
