[README-voix-business-action-digiy.md](https://github.com/user-attachments/files/28577225/README-voix-business-action-digiy.md)[Uploading README-voix-business-action-digiy.# DIGIYLYFE — La Voix du Business / ACTION DIGIY

## Doctrine validée

**La Voix du Business** est la couche haute.

**ACTION DIGIY** reste le moteur transversal en dessous.

Le principe est simple :

> La voix capte l’intention.  
> ACTION DIGIY ouvre le bon métier.  
> Le module prépare la directive.  
> Le pro vérifie et valide.

Rien n’est confirmé automatiquement.

---

## Architecture

```txt
LA VOIX DU BUSINESS
↓
ACTION DIGIY
↓
MODULE MÉTIER
↓
VALIDATION HUMAINE
```

Cette page centrale n’est pas un module métier.

Elle sert de **carrefour vocal transversal** pour router les directives vers les modules DIGIYLYFE.

---

## Fichier principal

```txt
pro-action-digiy/index.html
```

Nom visible conseillé dans la page :

```txt
La Voix du Business
ACTION DIGIY · carrefour vocal métier
```

---

## Rôle du hub central

Le hub central permet au pro de parler ou d’écrire une directive simple :

```txt
deux serviettes de bain à 5000 cash
recette boutique 10000 Wave
course demain 8h Saly Dakar client Mamadou
réserver chambre du 25 au 27 client Awa
je veux annoncer une sortie pêche Petite Côte
```

ACTION DIGIY prépare ensuite un brouillon et route vers le bon métier.

---

## Routes métier

```txt
POS      → commerce-pro/action.html
PAY      → pro-pay/action.html
DRIVER   → pro-driver/oreille.html
LOC      → pro-loc/oreille.html
RESA     → pro-resa-resto/oreille.html
RÉSEAU   → reseau-digiy/oreille.html
BUILD    → pro-build/oreille.html
MARKET   → pro-market/oreille.html
JOBS     → pro-job/oreille.html
```

POS et PAY sont les deux routes les plus sensibles :

```txt
POS = détail de vente : article, quantité, prix unité, total.
PAY = argent final : recette, dépense, encaissement, dette, canal de paiement.
```

Règle : **ne pas doubler POS et PAY**.

---

## Exemple POS validé

Phrase :

```txt
deux serviettes de bain à 5000 cash
```

Lecture attendue :

```txt
Module : POS
Quantité : 2
Prix unité : 5 000 FCFA
Total : 10 000 FCFA
Canal : Cash
Statut : brouillon
```

Le POS affiche et contrôle.

Le pro valide seulement après vérification.

---

## Exemple PAY validé

Phrase :

```txt
recette boutique 10000 Wave
```

Lecture attendue :

```txt
Module : PAY
Type : recette
Montant : 10 000 FCFA
Canal : Wave
Statut : brouillon
```

PAY reçoit uniquement l’argent final.

Il ne détaille pas les articles vendus.

---

## Sécurité métier

ACTION DIGIY ne doit jamais :

```txt
confirmer une vente automatiquement
confirmer un paiement automatiquement
publier une annonce automatiquement
réserver automatiquement
modifier un stock automatiquement
remplacer le jugement du pro
```

Tous les brouillons doivent porter :

```js
requiresHumanValidation: true
```

---

## Mémoire courte

Les directives doivent rester en brouillon dans le navigateur :

```js
localStorage.setItem("DIGIY_PENDING_ACTION", JSON.stringify(draft));
```

ou selon le contexte :

```js
sessionStorage.setItem("DIGIY_ACTION_PENDING", JSON.stringify(draft));
```

Ne pas exposer de téléphone, client sensible ou donnée privée dans l’URL.

---

## Correctif historique — 2026-05-27

Fichiers concernés par le correctif ACTION DIGIY / POS :

### 1. `pro-action-digiy/index.html`

- Le carrefour ACTION comprend les quantités écrites en lettres : un, une, deux, trois, etc.
- Exemple validé :

```txt
deux serviettes de bain à 5000 cash
```

Résultat attendu :

```txt
POS
quantité 2
prix unité 5 000
 total 10 000
```

### 2. `mon-commerce-pro/assets/js/action-digiy-receiver.js`

- Le receiver POS recalcule aussi à l’arrivée.
- Nettoyage ajouté pour les caractères mal décodés :

```txt
rÃ©sultat → résultat
Ã → à
```

- Le bouton valide seulement le brouillon.
- Aucune vente, aucun paiement, aucun stock confirmé automatiquement.

### 3. `mon-commerce-pro/assets/js/caisse-pos.js`

- Copie inchangée du fichier fourni.
- Gardée dans le paquet complet pour continuité POS.

---

## Phrase doctrine courte

> La voix donne la direction.  
> ACTION DIGIY ouvre le bon métier.  
> Le module prépare.  
> Le pro valide.

---

## Signature

**DIGIYLYFE — La Voix du Business**  
**ACTION DIGIY — moteur transversal métier**  
**Validation humaine obligatoire**
md…]()


