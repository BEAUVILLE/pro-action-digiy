/*
  DIGIYLYFE — ACTION PRO · LA VOIX rapide
  Objectif : ne plus attendre trop longtemps la fin navigateur quand la requête
  est déjà transcrite. Le moteur métier et les fiches restent inchangés.
  Version : 20260808-voice-fast-v1
*/
(function (global) {
  "use strict";

  const VERSION = "20260808-voice-fast-v1";
  const SETTLE_MS = 700;

  if (global.DIGIY_VOICE_FAST && global.DIGIY_VOICE_FAST.version === VERSION) return;

  const NativeRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;
  if (!NativeRecognition) {
    global.DIGIY_VOICE_FAST = { version: VERSION, active: false, reason: "speech-recognition-unavailable" };
    return;
  }

  function FastRecognition() {
    const rec = new NativeRecognition();
    let settleTimer = null;
    let stopping = false;

    function clearSettle() {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = null;
    }

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
    });

    rec.addEventListener("error", function () {
      clearSettle();
      stopping = false;
    });

    return rec;
  }

  try {
    Object.setPrototypeOf(FastRecognition, NativeRecognition);
    FastRecognition.prototype = NativeRecognition.prototype;
  } catch (_) {}

  if (global.SpeechRecognition) global.SpeechRecognition = FastRecognition;
  if (global.webkitSpeechRecognition) global.webkitSpeechRecognition = FastRecognition;

  global.DIGIY_VOICE_FAST = {
    version: VERSION,
    active: true,
    settleMs: SETTLE_MS
  };
})(window);
