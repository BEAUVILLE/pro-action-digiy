# Contrôle explicite WORLD8 — PR #12

## Huit langues identifiées dans le runtime actif
`index.html`, bloc `digiy-action-7lang-runtime`, définit réellement huit langues malgré son ancien nom « 7lang ». Wolof = extension terrain FR/Wolof, pas une neuvième langue d'interface.

| Langue | Code | Locale micro configurée | Enrichissement de la PR | Contrôle logique |
|---|---|---|---|---|
| Français | fr | fr-FR | Terrain natif | 10 demandes + 2 négatifs : PASS |
| Anglais | en | en-US | Compatibilité historique | 10 demandes + 2 négatifs : PASS |
| Espagnol | es | es-ES | Compatibilité historique | 10 demandes + 2 négatifs : PASS |
| Portugais | pt | pt-PT | Compatibilité historique, dont RULES.push PT | 10 demandes + 2 négatifs : PASS |
| Allemand | de | de-DE | Compatibilité historique | 10 demandes + 2 négatifs : PASS |
| Italien | it | it-IT | Compatibilité historique | 10 demandes + 2 négatifs : PASS |
| Néerlandais | nl | nl-NL | Compatibilité historique | 10 demandes + 2 négatifs : PASS |
| Arabe | ar | ar-SA | Compatibilité historique + correction ciblée NFD DRIVER | 10 demandes + 2 négatifs : PASS |

Les locales sont des configurations vérifiées dans le code, pas une validation de la reconnaissance acoustique.

## Méthode et référence
`node tests/voice-world8.test.cjs` compare avec le commit immuable avant PR `2412f5a70473f7c9151a736afed22a7ddafc4842`, jamais avec HEAD mouvant. Le test nécessite ce commit dans le clone (`git fetch` si clone superficiel).

Exécute les vraies fonctions du fichier HTML : `clean`, `digiyExpandQuery`, `RULES`, `RULES.push` portugais et wrapper multilingue. Pour chacune des huit langues, deux formulations distinctes pour plomberie, transport, logement, resto et jobs. Vérifie les termes canoniques attendus, la conservation intégrale des expansions historiques, l'absence de nouvelles intentions sans rapport dans le dictionnaire et le filtre, plus deux salutations sans intention par langue.

Total : 80 demandes principales + 16 cas négatifs. Exécution complémentaire du véritable `detectNeeds` avant/après sur saisie brute et sur expansion canonique. Les tests FR/Wolof et confidentialité restent séparés et passent aussi.

## Deux défauts trouvés et corrections minimales
1. Nouveau groupe de signaux DRIVER contenait « chercher » + ville. Les expansions WORLD8 ajoutent souvent « chercher », ce qui créait un besoin transport parasite sur une demande de plombier à Saly. Retrait de ce seul signal générique; récupération, retour, dépôt restent reconnus. Les cas multilingues préviennent sa réintroduction.
2. Défaut historique arabe : NFD décompose `سائق` (chauffeur), et le motif historique composé ne reconnaissait plus le mot seul. Ajout d'un motif borné acceptant la décomposition avec hamza combinée, sans changer les autres expansions. Test garde la preuve que la référence échoue sur `أبحث عن سائق في داكار` et que la version corrigée produit DRIVER.

## Limite historique du filtre final à conserver visible
Le filtre final `detectNeeds` lit la saisie brute, alors que le moteur de recherche utilise la requête expansée. Sur ce corpus, il ne reconnaît pas directement le besoin attendu dans :

| Langue | Demandes brutes sans besoin attendu sur 10 |
|---|---:|
| FR | 0 |
| EN | 2 |
| ES | 8 |
| PT | 7 |
| DE | 7 |
| IT | 8 |
| NL | 7 |
| AR | 10 |

Ces lacunes sont historiques, pas une régression introduite par la PR. Le filtre reconnaît bien les intentions attendues après expansion dans les huit langues. L'absence de besoin brut ne signifie pas automatiquement absence de résultats : un filtre sans besoin n'applique pas de restriction métier. Elle empêche cependant de certifier l'orientation complète, notamment sur demandes mixtes ou avec mots parasites. Le contrôle couvre la préservation des besoins déjà reconnus et l'absence de nouveau besoin sans rapport sur le corpus; il ne masque pas ces lacunes en remplaçant la requête brute du moteur de production.

## Enrichissement natif / futur
- FR : dictionnaire terrain natif enrichi dans cette PR.
- Wolof : expressions ciblées et mélanges FR/Wolof; relecture terrain nécessaire, sans locale d'interface autonome.
- EN, ES, PT, DE, IT, NL, AR : expansions historiques conservées; enrichissement natif de formulations indirectes, fautes et négations à construire ultérieurement. La correction arabe NFD répare un mot historique, elle ne constitue pas un dictionnaire terrain arabe complet.
- Harmonisation du filtre brut avec la couche canonique à traiter explicitement avant une certification complète de routage WORLD8.

## Statut de validation
**Contrôle déterministe WORLD8 des expansions et de non-régression : PASS sur les huit langues testées.** Aucun nouveau classement sans rapport sur le corpus après correction. Cela ne démontre pas l'absence universelle de collisions.

**WORLD8 complet de bout en bout : NON VALIDÉ.** Microphone, synthèse vocale, rendu mobile, RTL réel, contacts terrain et résultats complets restent hors de ce contrôle; lacunes historiques du filtre brut décrites ci-dessus. PR laissée ouverte, aucune fusion ni mise en production.
