# LA VOIX — enrichissement terrain, 5 octobre 2026

## Cartographie observée
- `index.html`: moteur déterministe actif, expansion FR/Wolof et WORLD8, classement et recherche publique. Aucun remplacement.
- `annuaire-public-digiy.js` → core annuaire, rails territoriaux, filtre intention/territoire et contrôle des abonnements.
- `voice-territory-rails-v1.js`: portes métier territoriales et mots de classement.
- `voice-territory-intent-filter-v1.js`: plusieurs besoins, spécialités et suppression des fiches incompatibles.
- `action-pro-health-route-v1.js`: orientation existante vers SANTÉ, sans diagnostic.
- `digiy-observability-v1.js`: traces locales existantes; distinctes du nouveau collecteur.
- `assets/js/action-digiy-public-duo-fr-wo.js`, `moteur-intentions-digiy.js`: couches historiques présentes, non chargées directement par l'index actuel.
- `supabase/functions/digiy-intent-parser/index.ts`: parser Mistral existant, non requis par la recherche primaire; inchangé.
- Le dictionnaire de `BEAUVILLE/digiylyfe.com` sert la recherche classique; ce chantier porte uniquement sur `BEAUVILLE/pro-action-digiy`.

## Lacunes et réponse
Les règles dispersées ne couvraient pas systématiquement lavabo bouché, formulations de récupération/retour, petit boulot, fautes et besoins administratifs. Un nouveau fichier centralise neuf familles, leurs mots directs, synonymes, expressions, variantes et groupes de signaux. Normalisation accents/apostrophes/ponctuation; limites de mots pour éviter les sous-chaînes. Pondération heuristique 100/85/80/75/60, sans prétendre donner une probabilité. Plusieurs intentions peuvent coexister.

Les nouvelles expressions ne sont pas recopiées dans les rails. Le moteur d'expansion et le filtre territorial consultent le même dictionnaire. Les expansions historiques restent présentes avant les nouveaux termes. Le cache PWA est versionné et inclut le nouveau fichier.

## Ambiguïtés et limites
Les règles historiques restent en place: elles peuvent encore classer des mots larges comme course, table, porte. Le nouveau dictionnaire n'ajoute pas de classement sur ces mots isolés, mais ne supprime pas ces comportements historiques. Une phrase multi-intention ne déclenche aucune opération. Les négations sont prévues dans le schéma (`negative`) mais leur traitement linguistique général n'est pas implémenté. Wolof: variantes explicitement listées, à relire avec des locuteurs terrain; aucune promesse de compréhension universelle. « J'ai plus d'eau » peut aussi décrire une coupure réseau: orientation plombier à confirmer par l'utilisateur.

## Phrases non reconnues
Pas de migration ni de collecte distante activée. Collecteur volontaire local à la session, 50 phrases maximum, dédoublonnage, expurgation téléphone/email/liens; aucun stockage audio. Activation de diagnostic: `DIGIY_VOICE_TERRAIN.unmatched.enable(true)`; inspection `list()`; suppression `clear()`. Désactivé par défaut. Le crochet se déclenche seulement après recherche sans résultat et sans intention terrain reconnue.

Schéma: id, phrase expurgée, transcription_raw expurgée, language déclarée par l'interface (non détectée), territory URL, date, returned_intent, score, corrected_intent. Ces derniers restent null en l'absence de données fiables. L'expurgation ne garantit pas l'anonymisation des noms/adresses: aucun envoi central automatique. Les intentions uniquement reconnues par les anciens moteurs peuvent manquer au nouveau collecteur; à vérifier avant toute collecte centrale.

## Validation
`node tests/voice-terrain.test.cjs`: expressions anciennes/nouvelles, fautes, courtes, FR/Wolof, cas ambigus, multi-intentions, absence d'intention, confidentialité, borne de session, vraie fonction inline d'expansion, 16 expansions historiques WORLD8 conservées, vrai filtre territorial et matcher santé.
Pas de validation microphone, transcription acoustique, rendu mobile ni contacts réels. WORLD8 complet non déclaré. Aucune fusion/déploiement/migration.
