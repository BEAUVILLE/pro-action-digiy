DIGIYLYFE — Correctif ACTION DIGIY / POS — 2026-05-27

Fichiers corrigés :
1. pro-action-digiy/index.html
   - Le carrefour ACTION comprend maintenant les quantités écrites en lettres : un, une, deux, trois, etc.
   - Exemple validé : “deux serviettes de bain à 5000 cash” => POS, quantité 2, prix unité 5 000, total 10 000.

2. mon-commerce-pro/assets/js/action-digiy-receiver.js
   - Le receiver POS recalcule aussi à l’arrivée.
   - Nettoyage ajouté pour les caractères mal décodés : rÃ©sultat => résultat, Ã => à, etc.
   - Le bouton valide seulement le brouillon : aucune vente, aucun paiement, aucun stock confirmé automatiquement.

3. mon-commerce-pro/assets/js/caisse-pos.js
   - Copie inchangée du fichier fourni, gardée dans le ZIP pour le paquet complet.

