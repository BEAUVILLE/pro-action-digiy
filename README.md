[README.md](https://github.com/user-attachments/files/28577763/README.md)# La Voix du Business — ACTION DIGIY

Dépôt : `pro-action-digiy`

## Structure posée

- `index.html` : porte publique ouverte. Le public écrit/parle son besoin, DIGIY fait remonter des fiches et ouvre le contact direct.
- `pin.html` : entrée PRO par PIN 4 chiffres.
- `guard.js` : protège uniquement la partie PRO.
- `pro.html` : ACTION DIGIY PRO, carrefour vocal métier protégé.
- `session.html` : fermeture/nettoyage session.

## Doctrine

La Voix du Business capte l’intention.
ACTION DIGIY route vers le bon métier.
Le module prépare.
Le pro valide.

Côté public : ouvert, mise en relation directe.
Côté pro : protégé, actions métier en brouillon, validation humaine obligatoire.

LA VOIX DIGIY est la porte publique intelligente de DIGIYLYFE.

Elle permet à un utilisateur d’exprimer un besoin simple :
artisan, chauffeur, logement, boutique, produit, réservation, emploi ou paiement.

Le moteur interne ROUTE DIRECTE analyse la demande, reconnaît le métier, la zone et l’intention, puis remonte la bonne fiche publique ou le bon module DIGIY.

LA VOIX écoute.
L’OREILLE comprend.
ROUTE DIRECTE ouvre la bonne porte.

## À faire avant publication

Dans `pin.html`, remplacer :

```js
const DIGIY_ALLOWED_PINS = ["2026"];
```

par le vrai PIN 4 chiffres du dépôt.



