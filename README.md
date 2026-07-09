# La Voix du Business — ACTION DIGIY

Dépôt : `BEAUVILLE/pro-action-digiy`

## Rôle du dépôt

Ce dépôt porte **LA VOIX DIGIY**, la porte publique intelligente de DIGIYLYFE.

Le public écrit ou parle un besoin simple :

- artisan
- chauffeur
- logement
- boutique
- produit
- réservation
- emploi
- paiement
- annonce terrain

DIGIY comprend la demande, reconnaît le métier, la zone et l’intention, puis remonte la bonne fiche publique ou le bon module DIGIY.

## Doctrine

**LA VOIX écoute.  
L’OREILLE comprend.  
ROUTE DIRECTE ouvre la bonne porte.**

La Voix du Business capte l’intention.  
L’Oreille DIGIY reconnaît les mots du terrain.  
Route Directe amène le besoin vers la bonne fiche, le bon module ou le bon contact.

Côté public : ouvert, simple, direct.  
Côté pro : protégé, actions métier en brouillon, validation humaine obligatoire.

DIGIY prépare.  
Le professionnel valide.  
Le terrain garde la main.

## Structure du dépôt

### `index.html`

Porte publique ouverte.

L’utilisateur écrit ou parle son besoin.  
DIGIY fait remonter des fiches publiques, des modules ou des contacts directs.

### `annuaire-public-digiy.js`

Mémoire publique des fiches terrain.

Contient les professionnels, services, zones, mots-clés, liens publics, WhatsApp et routes utiles.

C’est la base de **L’OREILLE DIGIY**.

### `digiy-voix-annuaire-bridge.js`

Pont entre LA VOIX et l’annuaire public.

Il capte les demandes écrites, vocales ou issues des boutons rapides, puis appelle **ROUTE DIRECTE**.

### `action-digiy-public-duo-fr-wo.js`

Couche langue et voix.

Gère :

- le micro public
- le français
- le wolof terrain
- les expressions locales
- l’enrichissement des demandes avant routage

Ce fichier ne doit pas refaire l’annuaire.  
Il prépare seulement une demande plus claire pour Route Directe.

### `pin.html`

Entrée PRO par PIN 4 chiffres.

Attention : sur GitHub Pages, un PIN côté navigateur reste une protection légère, pas une vraie sécurité serveur.

### `guard.js`

Protège uniquement la partie PRO côté interface.

Ne protège jamais des données sensibles réelles si elles sont exposées dans le code public.

### `pro.html`

ACTION DIGIY PRO.

Carrefour vocal métier protégé pour préparer les actions professionnelles.

### `session.html`

Fermeture et nettoyage de session.

## Séparation public / pro

### Public

Le public peut :

- exprimer un besoin
- voir une fiche
- ouvrir un contact direct
- envoyer un WhatsApp
- appeler si le numéro est public
- accéder à une route DIGIY utile

Le public ne doit jamais voir :

- données internes
- téléphone privé non validé
- propriétaire interne
- note admin
- cockpit
- secret
- clé privée

### PRO

Le pro peut préparer des actions métier, mais rien ne doit partir sans validation humaine.

La règle reste simple :

**Le module prépare.  
Le pro valide.**

## Chaîne de fonctionnement

```text
Utilisateur
↓
LA VOIX DIGIY
↓
L’OREILLE DIGIY
↓
ROUTE DIRECTE
↓
Fiche publique / Module / WhatsApp / Contact direct


