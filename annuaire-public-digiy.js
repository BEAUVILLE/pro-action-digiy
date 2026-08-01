/*
  DIGIYLYFE — Chargeur annuaire public stable + fiche Nazir Driver
  Le cœur historique reste figé sur le commit validé du 31 juillet 2026.
  Le complément Nazir est chargé immédiatement après, avant le moteur ACTION PRO.
*/
(function () {
  "use strict";

  document.write(
    '<script src="https://cdn.jsdelivr.net/gh/BEAUVILLE/pro-action-digiy@2a39840714109edd2d61e540189a8cdc695663d9/annuaire-public-digiy.js"></script>'
  );

  document.write(
    '<script src="./nazir-action-pro-patch.js?v=20260801-nazir-driver"></script>'
  );
})();
