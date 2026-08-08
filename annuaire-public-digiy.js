/*
  DIGIYLYFE — Chargeur annuaire public stable + fiches partenaires
  Le cœur historique reste figé sur le commit validé du 31 juillet 2026.
  Les compléments partenaires sont chargés immédiatement après, avant le moteur ACTION PRO.
  Puis la couche services + intentions transforme les services réels en mots compris par LA VOIX.
  Enfin la couche voix rapide raccourcit l'attente après transcription sans toucher au moteur métier.
  Version chargeur : 20260808-voice-fast-v1
*/
(function () {
  "use strict";

  document.write(
    '<script src="https://cdn.jsdelivr.net/gh/BEAUVILLE/pro-action-digiy@2a39840714109edd2d61e540189a8cdc695663d9/annuaire-public-digiy.js"></script>'
  );

  document.write(
    '<script src="./nazir-action-pro-patch.js?v=20260801-nazir-driver"></script>'
  );

  document.write(
    '<script src="./fg-nails-action-pro-patch.js?v=20260808-fg-nails-service-intents-v4"></script>'
  );

  document.write(
    '<script src="./action-pro-service-intents.js?v=20260808-service-intents-v1"></script>'
  );

  document.write(
    '<script src="./action-pro-voice-fast.js?v=20260808-voice-fast-v1"></script>'
  );
})();
