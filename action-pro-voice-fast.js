/*
  DIGIYLYFE — ACTION PRO · LA VOIX rapide
  Objectifs :
  - pré-instancier SpeechRecognition dès l'appui / focus sur le bouton voix ;
  - garder l'entrée micro chaude uniquement si l'autorisation est déjà accordée ;
  - valider rapidement une transcription stabilisée ;
  - ne jamais provoquer une nouvelle demande de permission pour le préchauffage.
  Version : 20260808-voice-fast-v2
*/
(function (global) {
  "use strict";

  const VERSION = "20260808-voice-fast-v2";
  const SETTLE_MS = 650;
  const WARM_STREAM_TIMEOUT_MS = 3500;

  if (global.DIGIY_VOICE_FAST && global.DIGIY_VOICE_FAST.version === VERSION) return;

  const NativeRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;
  if (!NativeRecognition) {
    global.DIGIY_VOICE_FAST = { version: VERSION, active: false, reason: "speech-recognition-unavailable" };
    return;
  }

  const enhanced = new WeakSet();
  let warmedRecognition = null;
  let micPermissionGranted = false;
  let warmStream = null;
  let warmStreamTimer = null;
  let warmStreamPending = null;

  function stopWarmStream() {
    if (warmStreamTimer) clearTimeout(warmStreamTimer);
    warmStreamTimer = null;

    if (warmStream) {
      try {
        warmStream.getTracks().forEach(function (track) { track.stop(); });
      } catch (_) {}
    }
    warmStream = null;
  }

  function refreshMicPermission() {
    if (!global.navigator || !navigator.permissions || typeof navigator.permissions.query !== "function") {
      return Promise.resolve(false);
    }

    return navigator.permissions.query({ name: "microphone" }).then(function (status) {
      micPermissionGranted = status && status.state === "granted";

      if (status && typeof status.addEventListener === "function") {
        status.addEventListener("change", function () {
          micPermissionGranted = status.state === "granted";
          if (!micPermissionGranted) stopWarmStream();
        });
      }

      return micPermissionGranted;
    }).catch(function () {
      micPermissionGranted = false;
      return false;
    });
  }

  function warmMicrophoneHardware() {
    if (!micPermissionGranted) return Promise.resolve(false);
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      return Promise.resolve(false);
    }
    if (warmStream) return Promise.resolve(true);
    if (warmStreamPending) return warmStreamPending;

    warmStreamPending = navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      warmStreamPending = null;
      warmStream = stream;

      if (warmStreamTimer) clearTimeout(warmStreamTimer);
      warmStreamTimer = setTimeout(stopWarmStream, WARM_STREAM_TIMEOUT_MS);
      return true;
    }).catch(function () {
      warmStreamPending = null;
      return false;
    });

    return warmStreamPending;
  }

  function enhanceRecognition(rec) {
    if (!rec || enhanced.has(rec)) return rec;
    enhanced.add(rec);

    let settleTimer = null;
    let stopping = false;

    function clearSettle() {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = null;
    }

    rec.addEventListener("start", function () {
      /* Le moteur vocal a maintenant pris la main : on libère le flux de préchauffage
         après un très court chevauchement, sans couper le début de la phrase. */
      setTimeout(stopWarmStream, 180);
    });

    rec.addEventListener("result", function (event) {
      let hasTranscript = false;
      let hasFinal = false;

      try {
        for (let i = event.resultIndex || 0; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result && result[0] && result[0].transcript;
          if (text && String(text).trim()) hasTranscript = true;
          if (result && result.isFinal) hasFinal = true;
        }
      } catch (_) {}

      if (!hasTranscript || hasFinal || stopping) return;

      clearSettle();
      settleTimer = setTimeout(function () {
        if (stopping) return;
        stopping = true;
        try {
          rec.stop();
        } catch (_) {
          stopping = false;
        }
      }, SETTLE_MS);
    });

    rec.addEventListener("end", function () {
      clearSettle();
      stopping = false;
      stopWarmStream();
    });

    rec.addEventListener("error", function () {
      clearSettle();
      stopping = false;
      stopWarmStream();
    });

    return rec;
  }

  function createRecognition() {
    return enhanceRecognition(new NativeRecognition());
  }

  function prewarmRecognition() {
    if (!warmedRecognition) {
      try {
        warmedRecognition = createRecognition();
      } catch (_) {
        warmedRecognition = null;
      }
    }
    return warmedRecognition;
  }

  function FastRecognition() {
    const rec = warmedRecognition || createRecognition();
    warmedRecognition = null;
    return rec;
  }

  try {
    Object.setPrototypeOf(FastRecognition, NativeRecognition);
    FastRecognition.prototype = NativeRecognition.prototype;
  } catch (_) {}

  if (global.SpeechRecognition) global.SpeechRecognition = FastRecognition;
  if (global.webkitSpeechRecognition) global.webkitSpeechRecognition = FastRecognition;

  function prepareVoiceStart() {
    prewarmRecognition();

    if (micPermissionGranted) {
      warmMicrophoneHardware();
    } else {
      refreshMicPermission().then(function (granted) {
        if (granted) warmMicrophoneHardware();
      });
    }
  }

  function bindVoiceButton() {
    const button = document.getElementById("listenBtn");
    if (!button || button.dataset.digiyVoicePrewarmBound === "1") return false;

    button.dataset.digiyVoicePrewarmBound = "1";

    /* pointerdown / touchstart arrivent avant click : le moteur est donc déjà construit
       quand le gestionnaire principal speechListen() s'exécute. */
    button.addEventListener("pointerdown", prepareVoiceStart, { passive: true });
    button.addEventListener("touchstart", prepareVoiceStart, { passive: true });
    button.addEventListener("focus", prepareVoiceStart, { passive: true });
    button.addEventListener("mouseenter", function () {
      prewarmRecognition();
      if (micPermissionGranted) warmMicrophoneHardware();
    }, { passive: true });

    return true;
  }

  refreshMicPermission();

  if (!bindVoiceButton()) {
    const observer = new MutationObserver(function () {
      if (bindVoiceButton()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  global.DIGIY_VOICE_FAST = {
    version: VERSION,
    active: true,
    settleMs: SETTLE_MS,
    prewarm: prewarmRecognition,
    warmMicrophone: warmMicrophoneHardware,
    get microphonePermissionGranted() { return micPermissionGranted; }
  };
})(window);
