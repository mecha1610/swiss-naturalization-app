# Design — Enrichissement & Mode Expert

**Date :** 2026-03-23
**Projet :** Swiss Naturalization Quiz GE
**Candidat :** Marine Claver, Troinex (GE-1256)

---

## Objectif

Enrichir la base de questions et ajouter une section "Approfondissement" sur la HomeScreen, regroupant 3 nouveaux thèmes experts et des questions supplémentaires pour Troinex.

---

## Décisions clés

| Décision | Choix | Raison |
|---|---|---|
| Structure "expert" | Flag `expert: true` sur les thèmes | Réutilise l'architecture existante, zéro refactoring |
| Affichage | Deux sections HomeScreen (Révision / Approfondissement) | Séparation visuelle claire sans nouvelle route |
| Nouveaux thèmes | `vie_pratique`, `actualite`, `culture` | Couvre les lacunes identifiées |
| Troinex | 10 → 20 questions | Thème le plus spécifique à l'oral |
| QuizScreen / ExamMode | Inchangés | Un thème expert se lance comme un thème normal |

---

## Nouveaux thèmes

| Slug | Label UI | Icône | Nb questions | Difficulté dominante |
|---|---|---|---|---|
| `vie_pratique` | Vie pratique | 🚌 | 15 | mix 1/2 |
| `actualite` | Actualité suisse | 📰 | 15 | mix 2/3 |
| `culture` | Langue & culture | 🎭 | 15 | mix 1/2 |

---

## Modifications de fichiers

| Fichier | Action | Détail |
|---|---|---|
| `src/types.ts` | Modifier | Ajouter 3 slugs au type `Theme`, flag `expert` dans `THEMES` |
| `src/data/questions.json` | Modifier | +10 Troinex, +45 nouvelles questions |
| `src/components/HomeScreen.tsx` | Modifier | Deux sections : Révision + Approfondissement |
| `src/components/ThemeGrid.tsx` | Modifier | Accepte un prop `questions` filtré par thèmes |
| `src/components/ThemeStats.tsx` | Modifier | Idem |

**Fichiers inchangés :** `App.tsx`, `QuizScreen.tsx`, `ExamMode.tsx`, `useSpacedRepetition.ts`, `QuestionCard.tsx`, `AnswerFeedback.tsx`, `ScoreBar.tsx`

---

## Schema types.ts

```ts
export type Theme =
  | 'politique_ch'
  | 'geneve'
  | 'troinex'
  | 'histoire'
  | 'droits'
  | 'geographie'
  | 'vie_pratique'
  | 'actualite'
  | 'culture'

export const THEMES: { id: Theme; label: string; icon: string; total: number; expert?: true }[] = [
  { id: 'politique_ch', label: 'Politique suisse',     icon: '🏛️', total: 18 },
  { id: 'geneve',       label: 'Canton de Genève',     icon: '🌊', total: 16 },
  { id: 'troinex',      label: 'Commune de Troinex',   icon: '🏡', total: 20 },
  { id: 'histoire',     label: 'Histoire suisse',      icon: '📜', total: 14 },
  { id: 'droits',       label: 'Droits & devoirs',     icon: '⚖️', total: 14 },
  { id: 'geographie',   label: 'Géographie & société', icon: '🗺️', total: 14 },
  { id: 'vie_pratique', label: 'Vie pratique',         icon: '🚌', total: 15, expert: true },
  { id: 'actualite',    label: 'Actualité suisse',     icon: '📰', total: 15, expert: true },
  { id: 'culture',      label: 'Langue & culture',     icon: '🎭', total: 15, expert: true },
]
```

---

## UX HomeScreen

```
┌──────────────────────────────────────┐
│ Header CH · Naturalisation  [reset]  │
├──────────────────────────────────────┤
│ [4 métriques globales]               │
│ [Aléatoire] [Examen blanc]           │
│                                      │
│ ── Révision ──                       │
│ ThemeGrid (6 thèmes de base)         │
│ ThemeStats (6 thèmes de base)        │
│                                      │
│ ── Approfondissement ✦ ──            │
│ ThemeGrid (3 thèmes experts)         │
│ ThemeStats (3 thèmes experts)        │
└──────────────────────────────────────┘
```

- Les métriques globales (répondues, correctes, % réussite, à revoir) portent sur **toutes** les questions (base + expert)
- Le bouton "Aléatoire" pioche dans **toutes** les questions
- Chaque thème (base ou expert) se lance en QuizScreen filtré — comportement identique

---

## Contenu des nouvelles questions

### Troinex — 10 questions supplémentaires (IDs 87-96)

Sujets à couvrir :
- Histoire de la commune (date de fondation, blason)
- Écoles et infrastructures locales
- Associations et vie communautaire
- Autorités actuelles (syndic/maire, conseil municipal)
- Connexion TPG (numéros de lignes)
- Superficie et densité de population
- Projets d'urbanisme récents
- Élections municipales

### Vie pratique (IDs 97-111)

Sujets :
- TPG : réseau, abonnements, zones tarifaires
- SIG (Services Industriels de Genève) : électricité, gaz, eau
- Scolarité : âge d'entrée, structure scolaire genevoise (primaire/CO/lycée)
- Système de santé : médecin traitant, urgences HUG, assurance LAMal franchises
- Impôts : déclaration annuelle, impôt à la source
- Permis de conduire : équivalence, délai de conversion
- Poubelles et tri des déchets à Genève
- Office cantonal de la population (OCP) : démarches de résidence

### Actualité suisse (IDs 112-126)

Sujets :
- Composition actuelle du Conseil fédéral (7 membres, partis)
- Présidente 2026 : Karin Keller-Sutter
- Votations fédérales récentes (2024-2026)
- Élections fédérales 2023 : résultats majeurs
- Réforme AVS 21 (retraite femmes à 65 ans)
- Initiative biodiversité (rejetée 2024)
- Accord-cadre Suisse-UE : état des négociations 2025
- Inflation et politique monétaire BNS

### Langue & culture (IDs 127-141)

Sujets :
- Fêtes nationales : 1er août, Jeûne genevois, Escalade
- Gastronomie : fondue, raclette, rösti, birchermüesli
- Symboles : croix suisse, William Tell, drapeau cantonal GE
- Expressions courantes en suisse romand
- Institutions culturelles genevoises (Grand Théâtre, Musée d'Art et d'Histoire)
- Sport national : hornuss, lutte suisse, Schwingen
- Médias : RTS, Le Temps, Tribune de Genève
- Monnaie : franc suisse, swissness

---

## Total questions après enrichissement

| Thème | Avant | Après |
|---|---|---|
| politique_ch | 18 | 18 |
| geneve | 16 | 16 |
| troinex | 10 | 20 |
| histoire | 14 | 14 |
| droits | 14 | 14 |
| geographie | 14 | 14 |
| vie_pratique | — | 15 |
| actualite | — | 15 |
| culture | — | 15 |
| **Total** | **86** | **141** |

---

## Risques

| Point | Action |
|---|---|
| Autorités Troinex | Valider nom du syndic/maire actuel sur troinex.ch |
| Votations récentes | Vérifier dates et résultats exacts sur admin.ch/ch.ch |
| Accord Suisse-UE | Vérifier état exact des négociations (situation mai 2026) |
| Réforme AVS | Confirmer date d'entrée en vigueur |
