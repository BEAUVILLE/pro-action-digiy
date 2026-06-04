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

## À faire avant publication

Dans `pin.html`, remplacer :

```js
const DIGIY_ALLOWED_PINS = ["2026"];
```

par le vrai PIN 4 chiffres du dépôt.



