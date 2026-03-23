# Design — Naturalisation Quiz GE

**Date :** 2026-03-23
**Deadline livraison :** 2026-03-25
**Examen :** 2026-03-31
**Candidat :** Marine Claver, Troinex (GE-1256)

---

## Contexte

Application web de révision QCM pour l'examen oral de naturalisation suisse. Un prototype de flashcard existe déjà (flip card, 12 questions, schema incompatible). Ce design spécifie le rebuild complet selon la spec CLAUDE.md, en conservant la stack TypeScript et l'identité visuelle du prototype.

---

## Décisions clés

| Décision | Choix | Raison |
|---|---|---|
| Approche | MVP strict (Option A) | Délai 2 jours, spec CLAUDE.md suffit |
| Langage | TypeScript (.tsx) | Déjà configuré, meilleure sécurité sur le schema JSON |
| React version | **React 19** (pas 18) | package.json a `"react": "^19.2.4"` — la spec CLAUDE.md mentionne 18 mais le projet est sur 19 |
| UX | QCM (boutons) | Plus adapté à la mémorisation d'un oral que les flashcards |
| Persistance | localStorage uniquement | Pas de backend, déploiement statique |
| Style | Identité prototype conservée | Rouge suisse, cartes arrondies, Tailwind v3 |
| Icônes | `lucide-react` (déjà installé) | Utiliser pour toutes les icônes UI (Trophy, RotateCcw, CheckCircle2, etc.) |
| Animations | Framer Motion ponctuel | **⚠️ Déplacer de devDependencies → dependencies avant build** — fade entre écrans + shake sur erreur |

---

## Architecture

```
src/
├── data/
│   └── questions.json          ← 86 questions, schema CLAUDE.md
├── hooks/
│   └── useSpacedRepetition.ts  ← algorithme exact CLAUDE.md, converti en TS
├── components/
│   ├── HomeScreen.tsx
│   ├── ThemeGrid.tsx
│   ├── QuizScreen.tsx
│   ├── QuestionCard.tsx
│   ├── AnswerFeedback.tsx
│   ├── ScoreBar.tsx
│   ├── ThemeStats.tsx
│   └── ExamMode.tsx
├── App.tsx
├── main.tsx
└── index.css
```

**Fichiers supprimés du prototype :** `src/components/FlashCard.tsx`, `src/questions.json`

---

## Schema questions.json

```ts
interface Question {
  id: number            // entier unique, séquentiel
  theme: Theme          // enum strict (voir ci-dessous)
  difficulty: 1 | 2 | 3
  choices: 3 | 4        // longueur de options[]
  question: string
  options: string[]     // longueur == choices
  correct: number       // index 0-based dans options[]
  explanation: string   // 2-4 phrases françaises
}

type Theme = 'politique_ch' | 'geneve' | 'troinex' | 'histoire' | 'droits' | 'geographie'
```

**Répartition :** politique_ch (18) · geneve (16) · troinex (10) · histoire (14) · droits (14) · géographie (14) = **86 questions**

---

## State management

`App.tsx` gère uniquement :
```ts
screen: 'home' | 'quiz' | 'exam'
selectedTheme: string | null  // null = toutes les questions
```

`useSpacedRepetition` gère tous les poids :
- `weights: Record<number, number>` — persisté en localStorage (clé `nq_weights`)
- `updateWeight(id, correct)` — poids × 0.6 si correct (min 0.2), × 3 si faux (max 5)
- `pickWeighted(questions)` — pioche pondérée aléatoire ; retourne `null` si `questions` est vide (QuizScreen affiche alors un état vide + bouton retour)
- `getDueCount(questions)` — nb questions avec poids > 1.5
- `resetWeights()` — supprime localStorage + réinitialise state

**Second localStorage — historique réponses** (clé `nq_history`) :
```ts
// persisté par updateWeight en même temps que les poids
history: Record<number, { answered: number; correct: number }>
```
Ce second enregistrement permet de calculer les métriques HomeScreen sans ambiguïté :
- **Questions répondues** : `Object.keys(history).length` (questions distinctes touchées)
- **Correctes** : `Object.values(history).filter(h => h.correct > 0).length` (questions ayant au moins une bonne réponse)
- **% réussite** : `sum(history[id].correct) / sum(history[id].answered) × 100` (taux sur toutes les tentatives, dénominateur = total des passages)
- **À revoir** : `getDueCount(allQuestions)` (poids > 1.5)

`resetWeights()` supprime aussi `nq_history`.

ThemeStats se calcule pareillement, filtrée par thème.

---

## UX flow

### HomeScreen
- 4 métriques : questions répondues · correctes · % réussite · nb "à revoir"
- ThemeGrid : grille 2 cols mobile / 3 cols desktop, chaque thème = icône + label + total + barre de progression
- ThemeStats : tableau par thème, rouge < 50% / orange < 75% / vert ≥ 75%
- Boutons : "Question aléatoire" (selectedTheme=null) · "Mode examen blanc"

### QuizScreen
- Reçoit les questions filtrées (par thème ou toutes)
- `useSpacedRepetition` pour la pioche
- QuestionCard : question + 3 ou 4 boutons selon `difficulty`
  - Après clic : correct en vert, incorrect en rouge + correct mis en évidence, tous désactivés
- AnswerFeedback : toujours affiché après réponse — bloc coloré + `explanation`
- Bouton "Suivant" + retour accueil

### ExamMode
- 20 questions pondérées, toutes thématiques
- Pas de retour arrière
- Résumé final : score /20, liste des questions ratées, thèmes faibles
- Bouton "Retour à l'accueil" sur l'écran résumé → `screen = 'home'`

---

## Animations (Framer Motion)

- `AnimatePresence` + `motion.div` sur les transitions entre écrans (fade 200ms)
- `shake` keyframe sur le bouton d'option incorrect sélectionné
- Rien de plus — pas de confetti, pas d'animations de chargement

---

## Labels UI des thèmes

```ts
const THEMES = [
  { id: 'politique_ch', label: 'Politique suisse',     icon: '🏛️', total: 18 },
  { id: 'geneve',       label: 'Canton de Genève',     icon: '🌊', total: 16 },
  { id: 'troinex',      label: 'Commune de Troinex',   icon: '🏡', total: 10 },
  { id: 'histoire',     label: 'Histoire suisse',      icon: '📜', total: 14 },
  { id: 'droits',       label: 'Droits & devoirs',     icon: '⚖️', total: 14 },
  { id: 'geographie',   label: 'Géographie & société', icon: '🗺️', total: 14 },
]
```

---

## Risques connus (CLAUDE.md)

| Point | Action requise avant déploiement |
|---|---|
| Présidente CF 2026 | Vérifier : Karin Keller-Sutter |
| Données Troinex | Valider sur troinex.ch : population exacte, nom syndic |
| Troinex district | Confirmer nom exact du district / secteur administratif |

---

## Déploiement

```bash
npm run build   # → dist/
# Netlify drag & drop du dossier dist/
```
