# La Voix du Business — ACTION DIGIY

Dépôt : `BEAUVILLE/pro-action-digiy`

## Rôle réel du dépôt

Ce dépôt porte **ACTION.PRO**, la porte publique d’écoute, de recherche et d’orientation de DIGIYLYFE.

L’utilisateur écrit ou dicte un besoin. ACTION DIGIY reconnaît l’intention, le métier et la zone, puis affiche une fiche publique ou une route DIGIY utile.

```text
LA VOIX écoute
↓
L’OREILLE comprend
↓
ROUTE DIRECTE sélectionne
↓
Fiche publique / module public / contact direct
```

ACTION.PRO est public. Il n’existe dans ce dépôt actif :

- ni page `pro.html` ;
- ni page `pin.html` ;
- ni garde `guard.js` ;
- ni session professionnelle locale.

Les cockpits privés appartiennent aux dépôts métier concernés. Chaque module professionnel reste responsable de sa propre protection et de sa validation humaine.

## Point d’entrée actif

### `index.html`

Page publique unique.

Elle contient :

- l’interface française et anglaise ;
- la saisie écrite et vocale ;
- le moteur public d’intentions ;
- le rendu des fiches et des routes ;
- les résumés de résultats ;
- les libellés publics `DIGIY CARNET` et `PRO CARNET`.

Elle charge réellement :

1. `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` ;
2. `annuaire-public-digiy.js` ;
3. son moteur JavaScript intégré.

La configuration Supabase publique présente dans l’index est un emplacement inactif tant que les valeurs `REMPLACER_...` ne sont pas renseignées. Le moteur local reste alors le fonctionnement réel.

### `annuaire-public-digiy.js`

Annuaire public officiel chargé par `index.html`.

Il fournit notamment :

- Babacar et Helage pour la plomberie ;
- Kourant pour l’électricité ;
- Mbaye pour la maçonnerie ;
- DIGIY Solaire ;
- Lamine pour les trajets et AIBD ;
- Astou et les autres fiches publiques.

Les identifiants des fiches embarquées dans l’index et dans l’annuaire doivent rester identiques afin d’éviter les doublons.

## Séparation public / professionnel

### Dans ACTION.PRO

Le public peut :

- exprimer un besoin ;
- consulter une fiche ;
- ouvrir un lien public ;
- contacter directement un professionnel ;
- accéder à une porte DIGIY publique.

ACTION.PRO ne conserve aucun PIN et ne crée aucune session professionnelle.

### Dans les modules métier

Une route vers un espace professionnel peut conserver son ancienne URL technique pour compatibilité, par exemple `pro-pay.digiylyfe.com`, tout en affichant `PRO CARNET`.

La protection éventuelle du cockpit, le contrôle PIN, la durée de session et la validation finale relèvent exclusivement du module métier de destination.

## Nomenclature CARNET

Affichage public :

- `DIGIY PAY` devient `DIGIY CARNET` ;
- `PRO PAY` devient `PRO CARNET`.

Compatibilité technique conservée :

- mot-clé interne `pay` ;
- identifiant interne `PAY` ;
- classes historiques comme `payCard` ;
- URL `https://pay.digiylyfe.com/` ;
- URL `https://pro-pay.digiylyfe.com/`.

## Scripts présents mais non chargés

Les fichiers ci-dessous ne sont pas chargés par `index.html`. Ils sont conservés comme éléments dormants tant qu’un audit de leurs éventuels consommateurs externes n’autorise pas leur suppression :

- `digiy-voix-annuaire-bridge.js` ;
- `digiy-audio-reponse-v1.js` ;
- `assets/js/action-digiy-astou-override.js` ;
- `assets/js/action-digiy-pro-orient.js` ;
- `assets/js/action-digiy-pro.js` ;
- `assets/js/action-digiy-public-duo-fr-wo.js` ;
- `assets/js/action-digiy-public-precision-serviettes-saly.js` ;
- `assets/js/action-digiy-voice-float.js` ;
- `assets/js/digiy-retour-voix.js` ;
- `assets/js/moteur-intentions-digiy.js` ;
- `assets/js/public-fiches-index.js`.

Leur présence ne signifie pas qu’ils participent à la page publique actuelle.

## Doctrine

**DIGIY prépare. Le professionnel valide. Le terrain garde la main.**

ACTION.PRO ne confirme aucune opération métier à la place d’un professionnel et n’expose aucune clé privée.

## Contrôles minimum avant publication

```text
Je cherche un plombier à Saly
→ Babacar puis Helage

Je cherche un électricien à Saly
→ Kourant uniquement

Je cherche un entrepreneur maçon à Saly
→ Mbaye uniquement

Je cherche du solaire à Dakar
→ DIGIY Solaire uniquement

Je cherche un chauffeur pour AIBD
→ Lamine uniquement
```

Les cinq équivalents anglais doivent produire les mêmes fiches. `professional` peut déclencher une recherche professionnelle large ; le mot `service` seul ne le peut pas.
