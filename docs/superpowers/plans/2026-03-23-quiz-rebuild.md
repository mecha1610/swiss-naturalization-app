# Naturalisation Quiz GE — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Swiss naturalization quiz app as a full QCM (multiple-choice) application with 86 questions, 6 themes, spaced repetition, and exam mode.

**Architecture:** Single-page React 19 + TypeScript app. `App.tsx` is a state machine (`home | quiz | exam`). `useSpacedRepetition` manages all persistence via localStorage. All 8 screen components receive data/hook as props — no internal data fetching.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v3 (custom swiss-red colors), Framer Motion (animations), lucide-react (icons), localStorage (persistence).

**Spec:** `docs/superpowers/specs/2026-03-23-quiz-design.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| DELETE | `src/components/FlashCard.tsx` | Old flashcard component (replaced by QCM) |
| DELETE | `src/questions.json` | Old schema (incompatible) |
| DELETE | `src/App.css` | Old prototype stylesheet (unused in new App.tsx) |
| MODIFY | `package.json` | Move framer-motion + lucide-react to dependencies |
| KEEP   | `vite.config.ts` | Already correct (TS variant of spec's `vite.config.js`) |
| MODIFY | `src/index.css` | Remove 3D flip utilities, keep base styles |
| MODIFY | `tailwind.config.js` | Add shake keyframe animation |
| CREATE | `src/types.ts` | Question interface, Theme type, Screen type, THEMES constant |
| CREATE | `src/data/questions.json` | 86 questions in QCM schema |
| CREATE | `src/hooks/useSpacedRepetition.ts` | Weighted pick + localStorage persistence |
| CREATE | `src/components/AnswerFeedback.tsx` | Colored feedback block + explanation text |
| CREATE | `src/components/ScoreBar.tsx` | Progress bar with label |
| CREATE | `src/components/QuestionCard.tsx` | Question + option buttons + shake animation |
| CREATE | `src/components/QuizScreen.tsx` | Quiz orchestration (pick → answer → next) |
| CREATE | `src/components/ThemeGrid.tsx` | 6 theme cards with per-theme progress |
| CREATE | `src/components/ThemeStats.tsx` | Per-theme stats table (red/orange/green) |
| CREATE | `src/components/HomeScreen.tsx` | Dashboard: 4 metrics + ThemeGrid + ThemeStats |
| CREATE | `src/components/ExamMode.tsx` | 20-question exam + summary screen |
| REWRITE | `src/App.tsx` | State machine wiring all screens |

---

## Task 1: Setup & Cleanup

**Files:**
- Delete: `src/components/FlashCard.tsx`
- Delete: `src/questions.json`
- Modify: `package.json`
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Move framer-motion and lucide-react to dependencies**

In `package.json`, move both `"framer-motion": "^12.38.0"` and `"lucide-react": "^1.0.1"` from `devDependencies` into `dependencies`:

```json
"dependencies": {
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "framer-motion": "^12.38.0",
  "lucide-react": "^1.0.1"
},
```

Remove both entries from `devDependencies`.

- [ ] **Step 2: Run install to update lockfile**

```bash
npm install
```

Expected: installs cleanly, no errors.

- [ ] **Step 3: Delete old prototype files**

```bash
git rm src/components/FlashCard.tsx src/questions.json src/App.css
```

- [ ] **Step 4: Clean up index.css**

Replace `src/index.css` content entirely — remove 3D flip utilities, keep base + font:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}
```

- [ ] **Step 5: Add shake keyframe to tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          red: '#FF0000',
          darkred: '#D90000',
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite compiles (App.tsx will error since it still imports FlashCard — that's expected, fix in next task).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: setup — move runtime deps, remove prototype files, add shake animation"
```

---

## Task 2: Types & Constants

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create `src/types.ts`**

```ts
export type Theme =
  | 'politique_ch'
  | 'geneve'
  | 'troinex'
  | 'histoire'
  | 'droits'
  | 'geographie'

export interface Question {
  id: number
  theme: Theme
  difficulty: 1 | 2 | 3
  choices: 3 | 4
  question: string
  options: string[]
  correct: number       // index 0-based dans options[]
  explanation: string
}

export type Screen = 'home' | 'quiz' | 'exam'

export const THEMES: { id: Theme; label: string; icon: string; total: number }[] = [
  { id: 'politique_ch', label: 'Politique suisse',     icon: '🏛️', total: 18 },
  { id: 'geneve',       label: 'Canton de Genève',     icon: '🌊', total: 16 },
  { id: 'troinex',      label: 'Commune de Troinex',   icon: '🏡', total: 10 },
  { id: 'histoire',     label: 'Histoire suisse',      icon: '📜', total: 14 },
  { id: 'droits',       label: 'Droits & devoirs',     icon: '⚖️', total: 14 },
  { id: 'geographie',   label: 'Géographie & société', icon: '🗺️', total: 14 },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add Question/Theme/Screen types and THEMES constant"
```

---

## Task 3: Questions Data (86 questions)

**Files:**
- Create: `src/data/questions.json`

All 86 questions are specified in `CLAUDE.md`. The JSON format is:
```json
{ "id": N, "theme": "...", "difficulty": 1|2|3, "choices": 3|4, "question": "...", "options": [...], "correct": N, "explanation": "..." }
```

- [ ] **Step 1: Create `src/data/` directory and `questions.json`**

```bash
mkdir -p src/data
```

Create `src/data/questions.json` with the complete array below (all 86 questions from CLAUDE.md):

```json
[
  {
    "id": 1,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de membres compte le Conseil fédéral ?",
    "options": ["5", "6", "7", "9"],
    "correct": 2,
    "explanation": "Le Conseil fédéral est composé de 7 membres élus par l'Assemblée fédérale pour 4 ans. Ils gouvernent collégialement — aucun membre n'a de pouvoir supérieur aux autres."
  },
  {
    "id": 2,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 3,
    "question": "Qui élit le Conseil fédéral ?",
    "options": ["Le peuple suisse", "Le Conseil des États", "L'Assemblée fédérale"],
    "correct": 2,
    "explanation": "Le Conseil fédéral est élu par l'Assemblée fédérale (réunion des deux chambres : Conseil national et Conseil des États). Le peuple n'élit pas directement les conseillers fédéraux."
  },
  {
    "id": 3,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 3,
    "question": "Combien de signatures faut-il pour une initiative populaire fédérale ?",
    "options": ["50 000", "100 000", "150 000"],
    "correct": 1,
    "explanation": "Une initiative populaire fédérale requiert 100 000 signatures de citoyens suisses, collectées en 18 mois. Elle permet de proposer une modification de la Constitution fédérale."
  },
  {
    "id": 4,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 3,
    "question": "Combien de signatures faut-il pour un référendum facultatif ?",
    "options": ["30 000", "50 000", "100 000"],
    "correct": 1,
    "explanation": "Le référendum facultatif nécessite 50 000 signatures en 100 jours contre une loi votée par le Parlement. Si les signatures sont réunies, le peuple vote pour accepter ou rejeter la loi."
  },
  {
    "id": 5,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de membres compte le Conseil national ?",
    "options": ["100", "150", "200", "246"],
    "correct": 2,
    "explanation": "Le Conseil national compte 200 membres, élus proportionnellement à la population de chaque canton pour 4 ans. C'est la chambre du peuple du Parlement fédéral."
  },
  {
    "id": 6,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de membres compte le Conseil des États ?",
    "options": ["26", "36", "46", "52"],
    "correct": 2,
    "explanation": "Le Conseil des États compte 46 membres : 2 par canton (soit 40) et 1 par demi-canton (soit 6). C'est la chambre des cantons du Parlement fédéral."
  },
  {
    "id": 7,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la durée d'une législature fédérale ?",
    "options": ["3 ans", "4 ans", "5 ans", "6 ans"],
    "correct": 1,
    "explanation": "Une législature fédérale dure 4 ans. Le Conseil national est réélu intégralement tous les 4 ans, les conseillers fédéraux sont aussi élus pour 4 ans (rééligibles sans limite)."
  },
  {
    "id": 8,
    "theme": "politique_ch",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la capitale fédérale de la Suisse ?",
    "options": ["Zurich", "Berne", "Genève", "Lausanne"],
    "correct": 1,
    "explanation": "Berne est la ville fédérale de Suisse depuis 1848. Le Parlement, le Conseil fédéral et la Chancellerie fédérale y siègent. Zurich est la plus grande ville, mais n'est pas la capitale."
  },
  {
    "id": 9,
    "theme": "politique_ch",
    "difficulty": 1,
    "choices": 3,
    "question": "Combien de langues nationales la Suisse reconnaît-elle ?",
    "options": ["2", "3", "4"],
    "correct": 2,
    "explanation": "La Suisse reconnaît 4 langues nationales : l'allemand, le français, l'italien et le romanche. L'allemand est parlé par environ 63% de la population, le français par 23%, l'italien par 8% et le romanche par moins de 1%."
  },
  {
    "id": 10,
    "theme": "politique_ch",
    "difficulty": 3,
    "choices": 4,
    "question": "Qu'est-ce que le référendum obligatoire ?",
    "options": ["Vote du peuple uniquement", "Vote peuple ET cantons pour toute révision constitutionnelle", "Vote des cantons uniquement", "Vote du parlement"],
    "correct": 1,
    "explanation": "Le référendum obligatoire s'applique automatiquement à toute révision de la Constitution fédérale. Il exige la double majorité : majorité du peuple ET majorité des cantons. Sans ces deux majorités, la révision est rejetée."
  },
  {
    "id": 11,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Qui préside la Confédération en 2026 ?",
    "options": ["Viola Amherd", "Karin Keller-Sutter", "Guy Parmelin", "Ignazio Cassis"],
    "correct": 1,
    "explanation": "Karin Keller-Sutter est présidente de la Confédération pour l'année 2026. La présidence est tournante : chaque conseiller fédéral préside le Conseil fédéral à tour de rôle pour un an."
  },
  {
    "id": 12,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Où siège le Tribunal fédéral ?",
    "options": ["Berne", "Zurich", "Lausanne", "Genève"],
    "correct": 2,
    "explanation": "Le Tribunal fédéral siège à Lausanne. C'est la plus haute instance judiciaire de Suisse. Il existe aussi une Cour pénale fédérale à Bellinzone et un Tribunal administratif fédéral à Saint-Gall."
  },
  {
    "id": 13,
    "theme": "politique_ch",
    "difficulty": 3,
    "choices": 4,
    "question": "Qu'est-ce que la concordance ?",
    "options": ["Droit de veto cantonal", "Représentation proportionnelle des partis au Conseil fédéral", "Accord de coalition écrit", "Majorité qualifiée au parlement"],
    "correct": 1,
    "explanation": "La concordance (ou formule magique) désigne la représentation équilibrée des principaux partis politiques au Conseil fédéral. Elle vise à refléter la composition du Parlement et de l'électorat. C'est un principe fondamental de la démocratie de consensus suisse."
  },
  {
    "id": 14,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Suisse a-t-elle rejoint l'ONU ?",
    "options": ["1945", "1992", "2002", "2008"],
    "correct": 2,
    "explanation": "La Suisse a rejoint l'ONU en 2002, après un référendum populaire approuvé à 54,6%. Bien que siège de nombreuses agences onusiennes à Genève, la Suisse avait longtemps refusé d'adhérer pour préserver sa neutralité."
  },
  {
    "id": 15,
    "theme": "politique_ch",
    "difficulty": 3,
    "choices": 4,
    "question": "Quel est le principe de subsidiarité ?",
    "options": ["L'État prime sur les cantons", "Les décisions se prennent au niveau le plus bas possible", "Le parlement a toujours le dernier mot", "Les communes sont subordonnées aux cantons"],
    "correct": 1,
    "explanation": "Le principe de subsidiarité signifie que les décisions doivent être prises au niveau le plus proche possible des citoyens. La Confédération n'intervient que si les cantons ou les communes ne peuvent pas résoudre le problème eux-mêmes."
  },
  {
    "id": 16,
    "theme": "politique_ch",
    "difficulty": 3,
    "choices": 4,
    "question": "Quelle est la double majorité requise pour les initiatives populaires ?",
    "options": ["Majorité du peuple uniquement", "Majorité des cantons uniquement", "Majorité du peuple ET majorité des cantons", "Majorité des deux chambres"],
    "correct": 2,
    "explanation": "Pour qu'une initiative populaire soit acceptée, elle doit obtenir la majorité du peuple (plus de 50% des votants) ET la majorité des cantons (plus de 50% des cantons votent oui). Sans cette double majorité, l'initiative est rejetée."
  },
  {
    "id": 17,
    "theme": "politique_ch",
    "difficulty": 1,
    "choices": 4,
    "question": "Combien de cantons compte la Suisse ?",
    "options": ["23", "25", "26", "28"],
    "correct": 2,
    "explanation": "La Suisse compte 26 cantons, dont 6 demi-cantons (Obwald, Nidwald, Appenzell Rhodes-Extérieures, Appenzell Rhodes-Intérieures, Bâle-Ville, Bâle-Campagne). Les demi-cantons n'ont qu'un seul représentant au Conseil des États."
  },
  {
    "id": 18,
    "theme": "politique_ch",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel parti politique n'existe pas en Suisse ?",
    "options": ["UDC", "PS", "PLR", "La République En Marche"],
    "correct": 3,
    "explanation": "La République En Marche (LREM, rebaptisé Renaissance) est un parti français fondé par Emmanuel Macron. En Suisse, les principaux partis sont l'UDC (droite), le PS (gauche), le PLR (libéraux-radicaux) et Le Centre."
  },
  {
    "id": 19,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de membres compte le Grand Conseil genevois ?",
    "options": ["80", "100", "120", "150"],
    "correct": 1,
    "explanation": "Le Grand Conseil genevois, parlement cantonal, compte 100 membres élus pour 5 ans à la proportionnelle. Il vote les lois cantonales et contrôle le gouvernement (Conseil d'État)."
  },
  {
    "id": 20,
    "theme": "geneve",
    "difficulty": 1,
    "choices": 3,
    "question": "Combien de membres compte le Conseil d'État genevois ?",
    "options": ["5", "7", "9"],
    "correct": 1,
    "explanation": "Le Conseil d'État genevois est composé de 7 membres élus directement par le peuple pour 5 ans. C'est l'organe exécutif du canton de Genève, chaque conseiller dirigeant un département."
  },
  {
    "id": 21,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de communes compte le canton de Genève ?",
    "options": ["26", "35", "45", "56"],
    "correct": 2,
    "explanation": "Le canton de Genève compte 45 communes, dont la Ville de Genève (la plus grande), et de nombreuses communes rurales comme Troinex. Genève est l'un des cantons suisses avec le plus petit territoire mais le plus densément peuplé."
  },
  {
    "id": 22,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 3,
    "question": "Pour combien d'années les conseillers d'État genevois sont-ils élus ?",
    "options": ["4 ans", "5 ans", "6 ans"],
    "correct": 1,
    "explanation": "Les conseillers d'État genevois sont élus pour 5 ans au suffrage universel direct. Genève est l'un des rares cantons où les membres de l'exécutif sont élus directement par le peuple (et non par le parlement)."
  },
  {
    "id": 23,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la population du canton de Genève ?",
    "options": ["environ 250 000", "environ 380 000", "environ 520 000", "environ 750 000"],
    "correct": 2,
    "explanation": "Le canton de Genève compte environ 520 000 habitants, ce qui en fait le troisième canton le plus peuplé de Suisse après Zurich et Berne. Sa population est très internationale, avec plus de 40% d'étrangers."
  },
  {
    "id": 24,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année Genève a-t-elle rejoint la Confédération ?",
    "options": ["1291", "1648", "1815", "1848"],
    "correct": 2,
    "explanation": "Genève a rejoint officiellement la Confédération helvétique en 1815, lors du Congrès de Vienne. Auparavant, elle était une cité-État indépendante, puis avait été annexée par la France de 1798 à 1813."
  },
  {
    "id": 25,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la hauteur du Jet d'eau de Genève ?",
    "options": ["80 mètres", "120 mètres", "140 mètres", "200 mètres"],
    "correct": 2,
    "explanation": "Le Jet d'eau de Genève s'élève à 140 mètres de hauteur. Il projette 500 litres d'eau par seconde à une vitesse de 200 km/h. C'est l'un des symboles les plus reconnaissables de Genève, visible depuis toute la ville."
  },
  {
    "id": 26,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle institution internationale est née à Genève en 1863 ?",
    "options": ["L'ONU", "Le CICR", "L'OMS", "La Croix-Rouge française"],
    "correct": 1,
    "explanation": "Le Comité international de la Croix-Rouge (CICR) a été fondé à Genève en 1863 par Henry Dunant, suite à sa rencontre avec les blessés de la bataille de Solférino. Le CICR est une organisation humanitaire neutre qui protège les victimes de conflits armés."
  },
  {
    "id": 27,
    "theme": "geneve",
    "difficulty": 1,
    "choices": 3,
    "question": "Quelle fête genevoise commémore la résistance de 1602 ?",
    "options": ["La Fête de Genève", "L'Escalade", "Le Jeûne genevois"],
    "correct": 1,
    "explanation": "L'Escalade commémore la nuit du 11 au 12 décembre 1602, où les Genevois repoussèrent une attaque surprise des troupes du duc de Savoie. La fête est célébrée chaque année avec des défilés en costumes, des cortèges aux flambeaux et la brisure traditionnelle de la marmite en chocolat."
  },
  {
    "id": 28,
    "theme": "geneve",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel fleuve traverse Genève ?",
    "options": ["L'Arve", "Le Rhône", "La Versoix", "Le Léman"],
    "correct": 1,
    "explanation": "Le Rhône traverse Genève en sortant du lac Léman. À Genève, il reçoit l'Arve (venant de la vallée de Chamonix) à la Jonction. Le Rhône est le seul fleuve qui sort du lac Léman."
  },
  {
    "id": 29,
    "theme": "geneve",
    "difficulty": 3,
    "choices": 4,
    "question": "Quelle est la durée de résidence minimale à Genève pour demander la naturalisation cantonale ?",
    "options": ["1 an à Genève", "2 ans à Genève (5 en Suisse)", "3 ans à Genève", "5 ans à Genève"],
    "correct": 1,
    "explanation": "Pour demander la naturalisation genevoise, il faut résider 2 ans dans le canton de Genève (dont les derniers 12 mois de manière continue) et 5 ans en Suisse. Ces années de résidence s'additionnent aux exigences fédérales."
  },
  {
    "id": 30,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le siège du gouvernement cantonal genevois ?",
    "options": ["Le Palais fédéral", "L'Hôtel de Ville", "La Maison de la paix", "Le Palais des Nations"],
    "correct": 1,
    "explanation": "Le gouvernement cantonal genevois (Conseil d'État) siège à l'Hôtel de Ville de Genève, situé sur la vieille ville. C'est aussi là que siège le Grand Conseil (parlement cantonal). Le bâtiment date du XVIe siècle."
  },
  {
    "id": 31,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien d'organisations internationales siègent à Genève ?",
    "options": ["Environ 50", "Environ 100", "Plus de 200", "Environ 500"],
    "correct": 2,
    "explanation": "Plus de 200 organisations internationales siègent à Genève, dont l'ONU (Office des Nations Unies), le CICR, l'OMS, l'OMC, et de nombreuses autres. Genève est souvent appelée la 'capitale mondiale de la diplomatie'."
  },
  {
    "id": 32,
    "theme": "geneve",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel lac borde Genève ?",
    "options": ["Le lac de Neuchâtel", "Le lac de Constance", "Le lac Léman", "Le lac de Bienne"],
    "correct": 2,
    "explanation": "Le lac Léman (aussi appelé lac de Genève) borde Genève au nord-ouest. Avec 580 km², c'est le plus grand lac d'Europe de l'Ouest. Il est partagé entre la Suisse (cantons de Genève, Vaud, Valais) et la France (Haute-Savoie)."
  },
  {
    "id": 33,
    "theme": "geneve",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle montagne domine le paysage genevois côté français ?",
    "options": ["Le Jura", "Le Salève", "Le Mont-Blanc", "Les Voirons"],
    "correct": 1,
    "explanation": "Le Salève, montagne française visible depuis presque toute la région genevoise, est accessible par téléphérique depuis Veyrier-du-Lac. Bien qu'il soit en France (Haute-Savoie), il est intimement lié au paysage et à la culture genevoise."
  },
  {
    "id": 34,
    "theme": "geneve",
    "difficulty": 3,
    "choices": 4,
    "question": "Qu'est-ce que le Grand Genève ?",
    "options": ["Nom officiel du canton", "Agglomération transfrontalière franco-suisse", "Quartier historique de Genève", "Organisation internationale basée à Genève"],
    "correct": 1,
    "explanation": "Le Grand Genève est une agglomération transfrontalière regroupant le canton de Genève, le district de Nyon (Vaud) et une partie de l'Ain et de la Haute-Savoie (France). Elle compte environ 1 million d'habitants et constitue un bassin de vie et d'emploi intégré."
  },
  {
    "id": 35,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 3,
    "question": "Dans quel canton se trouve Troinex ?",
    "options": ["Vaud", "Genève", "Fribourg"],
    "correct": 1,
    "explanation": "Troinex est une commune du canton de Genève. Elle est située au sud de la ville de Genève, dans le secteur Arve-Lac, à proximité de la frontière française."
  },
  {
    "id": 36,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel est le code postal de Troinex ?",
    "options": ["1200", "1226", "1256", "1279"],
    "correct": 2,
    "explanation": "Le code postal de Troinex est 1256. Ce code postal est unique à la commune et permet de l'identifier parmi les 45 communes du canton de Genève."
  },
  {
    "id": 37,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 3,
    "question": "Troinex est limitrophe de quelle commune française ?",
    "options": ["Annemasse", "Saint-Julien-en-Genevois", "Thonon-les-Bains"],
    "correct": 1,
    "explanation": "Troinex partage une frontière avec Saint-Julien-en-Genevois, commune française de Haute-Savoie. Cette proximité avec la France est typique des communes du secteur Arve-Lac du canton de Genève."
  },
  {
    "id": 38,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel est le type de commune de Troinex ?",
    "options": ["Commune industrielle", "Commune résidentielle à caractère rural préservé", "Commune universitaire", "Chef-lieu de district"],
    "correct": 1,
    "explanation": "Troinex est une commune résidentielle à caractère rural préservé. Elle conserve un tissu agricole et naturel important tout en étant une commune résidentielle prisée pour sa qualité de vie et sa proximité avec Genève."
  },
  {
    "id": 39,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Troinex fait partie de quelle agglomération ?",
    "options": ["La Métropole lémanique", "Le Grand Genève", "L'Arc lémanique", "Genève Agglo"],
    "correct": 1,
    "explanation": "Troinex fait partie de l'agglomération du Grand Genève, qui regroupe le canton de Genève, le district de Nyon et des territoires français voisins. Cette agglomération transfrontalière facilite la coordination des transports, de l'urbanisme et du développement économique."
  },
  {
    "id": 40,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est l'organe exécutif d'une commune genevoise comme Troinex ?",
    "options": ["Le Conseil d'État", "Le Grand Conseil", "Le Conseil administratif ou le Maire", "Le Tribunal de commune"],
    "correct": 2,
    "explanation": "Dans les communes genevoises, l'organe exécutif est soit un Conseil administratif (communes plus grandes) soit un Maire (communes plus petites comme Troinex). Le Maire est élu directement par les citoyens de la commune."
  },
  {
    "id": 41,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la population approximative de Troinex ?",
    "options": ["environ 500 habitants", "environ 2 500 habitants", "environ 10 000 habitants", "environ 25 000 habitants"],
    "correct": 1,
    "explanation": "Troinex compte environ 2 500 habitants. C'est une commune de taille modeste, typique des villages résidentiels du canton de Genève. Sa population a progressivement augmenté grâce à son attractivité résidentielle."
  },
  {
    "id": 42,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel transport en commun dessert Troinex ?",
    "options": ["Le tram", "Le train CFF", "Les bus TPG", "Le métro"],
    "correct": 2,
    "explanation": "Troinex est desservie par les bus des Transports publics genevois (TPG). Les TPG gèrent l'ensemble du réseau de transports en commun du canton de Genève, incluant trams, bus et quelques lignes de bateaux."
  },
  {
    "id": 43,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle vue naturelle caractérise Troinex ?",
    "options": ["Vue sur le lac Léman", "Vue sur les Alpes valaisannes", "Vue sur le Salève et la campagne genevoise", "Vue sur le Jura"],
    "correct": 2,
    "explanation": "Troinex offre une vue caractéristique sur le Salève et la campagne genevoise environnante. Sa position sur les hauteurs du secteur Arve-Lac lui confère un cadre paysager préservé, avec les champs et vignes typiques de cette zone rurale genevoise."
  },
  {
    "id": 44,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "De quelle région genevoise Troinex fait-elle partie ?",
    "options": ["La Champagne genevoise", "Le Mandement", "La rive gauche du Rhône / secteur Arve-Lac", "Les Trois-Chêne"],
    "correct": 2,
    "explanation": "Troinex appartient au secteur Arve-Lac, sur la rive gauche du Rhône. Ce secteur regroupe plusieurs communes du sud du canton de Genève, caractérisées par leur tissu rural, leurs zones naturelles et leur proximité avec la frontière française."
  },
  {
    "id": 45,
    "theme": "histoire",
    "difficulty": 1,
    "choices": 4,
    "question": "En quelle année a été signé le Pacte fédéral fondateur ?",
    "options": ["1215", "1291", "1315", "1648"],
    "correct": 1,
    "explanation": "Le Pacte fédéral a été signé en 1291 par les cantons d'Uri, Schwytz et Unterwald. Ce document est considéré comme l'acte fondateur de la Confédération suisse, raison pour laquelle le 1er août 1291 est célébré comme Fête nationale."
  },
  {
    "id": 46,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "Quels sont les trois cantons fondateurs de la Suisse ?",
    "options": ["Berne, Zurich, Lucerne", "Uri, Schwytz, Unterwald", "Genève, Vaud, Fribourg", "Bâle, Soleure, Schaffhouse"],
    "correct": 1,
    "explanation": "Les trois cantons fondateurs sont Uri, Schwytz et Unterwald (aujourd'hui divisé en Obwald et Nidwald). Ils ont signé le Pacte fédéral en 1291 pour se défendre mutuellement et résister aux Habsbourg. Le nom 'Suisse' vient du canton de Schwytz."
  },
  {
    "id": 47,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année les femmes ont-elles obtenu le droit de vote fédéral ?",
    "options": ["1948", "1959", "1971", "1981"],
    "correct": 2,
    "explanation": "Les femmes suisses ont obtenu le droit de vote au niveau fédéral en 1971, après plusieurs refus populaires (1959 notamment). La Suisse est l'un des derniers pays d'Europe occidentale à avoir accordé ce droit aux femmes."
  },
  {
    "id": 48,
    "theme": "histoire",
    "difficulty": 3,
    "choices": 4,
    "question": "Quel est le dernier canton à avoir accordé le droit de vote cantonal aux femmes ?",
    "options": ["Valais (1970)", "Uri (1986)", "Appenzell Rhodes-Intérieures (1990)", "Schwyz (1990)"],
    "correct": 2,
    "explanation": "Appenzell Rhodes-Intérieures est le dernier canton suisse à avoir accordé le droit de vote aux femmes au niveau cantonal, en 1990 — et seulement sur décision du Tribunal fédéral. C'est 19 ans après le suffrage fédéral de 1971."
  },
  {
    "id": 49,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Suisse a-t-elle adhéré à l'ONU ?",
    "options": ["1945", "1972", "1992", "2002"],
    "correct": 3,
    "explanation": "La Suisse a rejoint l'ONU en 2002, suite à une votation populaire. C'est très tardif : l'ONU a été fondée en 1945. La Suisse avait longtemps refusé d'adhérer pour préserver sa neutralité, bien qu'elle héberge le siège européen de l'ONU à Genève."
  },
  {
    "id": 50,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Constitution fédérale actuelle a-t-elle été adoptée ?",
    "options": ["1848", "1874", "1948", "1999"],
    "correct": 3,
    "explanation": "La Constitution fédérale actuelle a été adoptée en 1999 et est entrée en vigueur en 2000. Elle remplace la Constitution de 1874. Elle codifie les droits fondamentaux, l'organisation fédérale et les instruments de démocratie directe."
  },
  {
    "id": 51,
    "theme": "histoire",
    "difficulty": 1,
    "choices": 4,
    "question": "Que commémore la Fête nationale du 1er août ?",
    "options": ["La bataille de Marignan", "La Réforme protestante", "Le Pacte fédéral de 1291", "L'indépendance vis-à-vis de la France"],
    "correct": 2,
    "explanation": "La Fête nationale suisse du 1er août commémore le Pacte fédéral de 1291, signé par les cantons d'Uri, Schwytz et Unterwald. Elle est célébrée depuis 1891 (600e anniversaire) avec des feux de joie, des discours et des feux d'artifice."
  },
  {
    "id": 52,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Suisse a-t-elle rejoint l'Espace Schengen ?",
    "options": ["2004", "2006", "2008", "2010"],
    "correct": 2,
    "explanation": "La Suisse a rejoint l'Espace Schengen en 2008, permettant la libre circulation des personnes entre la Suisse et les pays membres de l'UE sans contrôles aux frontières. Cet accord fait partie des accords bilatéraux entre la Suisse et l'Union européenne."
  },
  {
    "id": 53,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel général suisse symbolise la résistance lors de la 2e Guerre mondiale ?",
    "options": ["Guillaume Tell", "Henri Guisan", "Charles Pictet de Rochemont", "Ludwig Forrer"],
    "correct": 1,
    "explanation": "Henri Guisan (1874-1960) est le général de l'armée suisse pendant la Seconde Guerre mondiale. Il est célèbre pour le Réduit national (1940), stratégie de repli dans les Alpes pour défendre le territoire suisse. Il reste l'une des figures historiques les plus populaires de Suisse."
  },
  {
    "id": 54,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Suisse a-t-elle refusé d'adhérer à l'EEE ?",
    "options": ["1989", "1992", "1995", "2001"],
    "correct": 1,
    "explanation": "En décembre 1992, les Suisses ont rejeté à 50,3% l'adhésion à l'Espace économique européen (EEE). Ce refus a conduit la Suisse à négocier des accords bilatéraux avec l'Union européenne, qui régissent aujourd'hui ses relations avec l'UE."
  },
  {
    "id": 55,
    "theme": "histoire",
    "difficulty": 3,
    "choices": 4,
    "question": "Quelle bataille a consolidé l'indépendance suisse face aux Habsbourg ?",
    "options": ["Grandson (1476)", "Marignan (1515)", "Morgarten (1315)", "Morat (1476)"],
    "correct": 2,
    "explanation": "La bataille de Morgarten (1315) est la première grande victoire militaire de la Confédération contre les Habsbourg. Les confédérés d'Uri, Schwytz et Unterwald ont battu la chevalerie autrichienne, consolidant leur indépendance et inspirant d'autres cantons à les rejoindre."
  },
  {
    "id": 56,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "Où a été signée la première Convention de Genève ?",
    "options": ["Paris, 1856", "Genève, 1864", "Vienne, 1815", "La Haye, 1899"],
    "correct": 1,
    "explanation": "La première Convention de Genève a été signée à Genève en 1864, à l'initiative d'Henry Dunant et du Comité international de la Croix-Rouge. Elle établit les règles humanitaires pour le traitement des soldats blessés en temps de guerre."
  },
  {
    "id": 57,
    "theme": "histoire",
    "difficulty": 3,
    "choices": 4,
    "question": "En quelle année la neutralité suisse a-t-elle été reconnue internationalement ?",
    "options": ["1648", "1789", "1815 (Congrès de Vienne)", "1848"],
    "correct": 2,
    "explanation": "La neutralité perpétuelle de la Suisse a été reconnue et garantie internationalement par le Congrès de Vienne en 1815. Cette neutralité est depuis lors un pilier de la politique étrangère suisse et explique notamment son rôle de médiateur et d'hôte d'organisations internationales."
  },
  {
    "id": 58,
    "theme": "histoire",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la date de fondation du CICR ?",
    "options": ["1848", "1863", "1889", "1919"],
    "correct": 1,
    "explanation": "Le Comité international de la Croix-Rouge (CICR) a été fondé à Genève en 1863 par Henry Dunant et quatre autres Genevois. Il est né de la volonté d'Henry Dunant d'organiser une aide humanitaire neutre après avoir été témoin de la bataille de Solférino (1859)."
  },
  {
    "id": 59,
    "theme": "droits",
    "difficulty": 1,
    "choices": 4,
    "question": "À quel âge peut-on voter en Suisse ?",
    "options": ["16 ans", "18 ans", "20 ans", "21 ans"],
    "correct": 1,
    "explanation": "En Suisse, le droit de vote s'acquiert à 18 ans au niveau fédéral et dans la quasi-totalité des cantons. Quelques cantons (Glaris) permettent le vote cantonal dès 16 ans, mais c'est l'exception."
  },
  {
    "id": 60,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de mois ont les résidents pour s'affilier à une caisse-maladie en arrivant en Suisse ?",
    "options": ["1 mois", "3 mois", "6 mois", "12 mois"],
    "correct": 1,
    "explanation": "Toute personne s'installant en Suisse dispose de 3 mois pour s'affilier à une caisse-maladie (assurance de base LAMal). L'assurance est rétroactive au jour d'arrivée. Sans affiliation dans ce délai, la caisse-maladie est désignée d'office par le canton."
  },
  {
    "id": 61,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Le service militaire est-il obligatoire en Suisse ?",
    "options": ["Non, il est volontaire", "Oui, pour tous les résidents", "Oui, pour les hommes suisses", "Oui, pour les hommes et femmes suisses"],
    "correct": 2,
    "explanation": "Le service militaire est obligatoire pour tous les hommes de nationalité suisse dès 18 ans. Les femmes peuvent servir volontairement. Les hommes suisses qui ne font pas le service militaire (pour raisons de conscience) peuvent effectuer un service civil de durée supérieure."
  },
  {
    "id": 62,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que le service civil ?",
    "options": ["Service de sécurité civile obligatoire", "Alternative au service militaire pour raison de conscience", "Service d'utilité publique pour les étrangers", "Formation aux premiers secours obligatoire"],
    "correct": 1,
    "explanation": "Le service civil est une alternative au service militaire pour les hommes suisses qui, par conviction, ne peuvent accomplir le service armé. Il dure 1,5 fois plus longtemps que le service militaire et s'effectue dans des établissements d'utilité publique (hôpitaux, EMS, nature et environnement, etc.)."
  },
  {
    "id": 63,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien d'années de résidence faut-il pour la naturalisation fédérale ordinaire ?",
    "options": ["5 ans", "8 ans", "10 ans", "12 ans"],
    "correct": 2,
    "explanation": "La naturalisation fédérale ordinaire requiert 10 ans de résidence en Suisse (les années passées en Suisse entre 8 et 18 ans comptent double). S'y ajoutent les exigences cantonales et communales, variables selon les cantons."
  },
  {
    "id": 64,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le premier pilier du système de retraite suisse ?",
    "options": ["LPP", "AVS", "3e pilier", "AI"],
    "correct": 1,
    "explanation": "L'AVS (Assurance-vieillesse et survivants) est le premier pilier du système de retraite suisse, obligatoire pour tous les résidents et travailleurs. Elle vise à couvrir les besoins vitaux. Elle est financée par les cotisations des employés, employeurs et de la Confédération."
  },
  {
    "id": 65,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "À quel âge ouvre le droit à la rente AVS pour les hommes ?",
    "options": ["60 ans", "62 ans", "64 ans", "65 ans"],
    "correct": 3,
    "explanation": "L'âge de la retraite AVS est fixé à 65 ans pour les hommes. Depuis la réforme AVS 21 (2024), l'âge de la retraite des femmes a été harmonisé à 65 ans également (auparavant 64 ans). Une retraite anticipée ou ajournée est possible sous conditions."
  },
  {
    "id": 66,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que le deuxième pilier ?",
    "options": ["AVS améliorée", "LPP — prévoyance professionnelle obligatoire", "Épargne retraite volontaire", "Assurance invalidité"],
    "correct": 1,
    "explanation": "Le deuxième pilier est la LPP (Loi sur la prévoyance professionnelle), obligatoire pour tous les salariés gagnant plus d'un certain seuil. Les cotisations sont partagées entre employeur et employé. L'objectif est de permettre au retraité de maintenir son niveau de vie habituel."
  },
  {
    "id": 67,
    "theme": "droits",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la durée légale minimale des vacances pour un employé adulte en Suisse ?",
    "options": ["2 semaines", "3 semaines", "4 semaines", "5 semaines"],
    "correct": 2,
    "explanation": "Le Code des obligations suisse garantit un minimum de 4 semaines de vacances par année pour les employés adultes (5 semaines pour les moins de 20 ans). De nombreuses conventions collectives et contrats prévoient davantage."
  },
  {
    "id": 68,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que le secret du vote ?",
    "options": ["Le vote se fait anonymement en ligne", "Nul ne peut être contraint de révéler son choix électoral", "Les résultats sont secrets pendant 24h", "Seuls les juges connaissent les résultats"],
    "correct": 1,
    "explanation": "Le secret du vote est un droit fondamental garanti par la Constitution suisse : nul ne peut être contraint de révéler son choix électoral. En Suisse, le vote par correspondance est très répandu, ce qui garantit aussi la liberté de vote à domicile."
  },
  {
    "id": 69,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que la LAMal ?",
    "options": ["Loi sur les accidents du travail", "Loi sur l'assurance-maladie obligatoire pour tous les résidents", "Loi sur l'aide sociale", "Loi sur l'assurance maternité"],
    "correct": 1,
    "explanation": "La LAMal (Loi fédérale sur l'assurance-maladie) rend l'assurance-maladie de base obligatoire pour toute personne résidant en Suisse. Chaque résident doit s'affilier à une caisse-maladie dans les 3 mois suivant son arrivée. Les primes varient selon les cantons et les caisses."
  },
  {
    "id": 70,
    "theme": "droits",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que le droit de pétition ?",
    "options": ["Droit de manifester dans la rue", "Droit de s'adresser par écrit aux autorités sans formalité", "Droit de contester une loi devant le tribunal", "Droit de demander une votation populaire"],
    "correct": 1,
    "explanation": "Le droit de pétition, garanti par la Constitution, permet à toute personne (y compris les étrangers et les mineurs) d'adresser une requête, une protestation ou une suggestion aux autorités sans formalité particulière. Les autorités n'ont pas l'obligation d'y donner suite mais doivent en prendre connaissance."
  },
  {
    "id": 71,
    "theme": "droits",
    "difficulty": 3,
    "choices": 4,
    "question": "Qui peut signer une initiative populaire fédérale ?",
    "options": ["Tout résident en Suisse", "Tout citoyen suisse ayant le droit de vote", "Tout résident avec permis C", "Tout contribuable suisse"],
    "correct": 1,
    "explanation": "Seuls les citoyens suisses ayant le droit de vote (âgés de 18 ans ou plus) peuvent signer une initiative populaire fédérale. Les étrangers résidant en Suisse, même depuis longtemps, ne peuvent pas signer — c'est une différence fondamentale entre résidence et citoyenneté."
  },
  {
    "id": 72,
    "theme": "droits",
    "difficulty": 3,
    "choices": 4,
    "question": "Qu'est-ce que l'initiative populaire cantonale genevoise ?",
    "options": ["Proposition de loi signée par 5 000 citoyens", "Proposition de loi signée par 10 000 citoyens genevois", "Vote communal organisé par la Mairie", "Pétition au Grand Conseil"],
    "correct": 1,
    "explanation": "L'initiative populaire cantonale genevoise permet à 10 000 citoyens genevois ayant le droit de vote de proposer une modification de la constitution ou une loi cantonale. Si les signatures sont réunies, le Grand Conseil examine la proposition et/ou la soumet au vote populaire."
  },
  {
    "id": 73,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le plus haut sommet de Suisse ?",
    "options": ["Cervin", "Jungfrau", "Pointe Dufour (4 634 m)", "Eiger"],
    "correct": 2,
    "explanation": "La Pointe Dufour (4 634 m) dans le massif du Mont Rose (Valais) est le point culminant de la Suisse. Elle est nommée en l'honneur du général Guillaume-Henri Dufour. Le Cervin (4 478 m) et la Jungfrau (4 158 m) sont plus célèbres mais moins élevés."
  },
  {
    "id": 74,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le plus grand lac entièrement suisse ?",
    "options": ["Lac de Constance", "Lac Léman", "Lac de Neuchâtel", "Lac de Thoune"],
    "correct": 2,
    "explanation": "Le lac de Neuchâtel (217 km²) est le plus grand lac entièrement situé en territoire suisse. Le lac Léman est plus grand (580 km²) mais est partagé avec la France. Le lac de Constance est partagé avec l'Allemagne et l'Autriche."
  },
  {
    "id": 75,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelles sont les trois régions géographiques de la Suisse ?",
    "options": ["Nord, Centre, Sud", "Jura, Plateau, Alpes", "Forêt, Plaine, Montagne", "Rhénanie, Mittelland, Tessin"],
    "correct": 1,
    "explanation": "Les trois grandes régions géographiques de la Suisse sont : le Jura (au nord-ouest), le Plateau (Mittelland, au centre), et les Alpes (au sud). Le Plateau concentre la majorité de la population et des activités économiques. Genève se situe dans le Plateau, au pied du Jura."
  },
  {
    "id": 76,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de cantons sont entièrement francophones ?",
    "options": ["3", "4", "5", "6"],
    "correct": 1,
    "explanation": "4 cantons sont entièrement francophones : Genève, Vaud, Neuchâtel et Jura. Les cantons de Fribourg, Berne et Valais sont bilingues (français et allemand). La partie francophone de la Suisse est souvent appelée 'Romandie'."
  },
  {
    "id": 77,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quels sont les 4 cantons entièrement francophones ?",
    "options": ["Genève, Vaud, Fribourg, Valais", "Genève, Vaud, Neuchâtel, Jura", "Genève, Berne, Neuchâtel, Jura", "Genève, Vaud, Neuchâtel, Fribourg"],
    "correct": 1,
    "explanation": "Les 4 cantons entièrement francophones sont Genève, Vaud, Neuchâtel et le Jura (le plus récent, fondé en 1979). Fribourg, Berne et le Valais sont officiellement bilingues (français-allemand), avec une majorité francophone dans certaines zones."
  },
  {
    "id": 78,
    "theme": "geographie",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel est le canton le plus peuplé de Suisse ?",
    "options": ["Berne", "Zurich", "Vaud", "Genève"],
    "correct": 1,
    "explanation": "Zurich est le canton le plus peuplé de Suisse avec environ 1,6 million d'habitants. C'est aussi le centre économique et financier du pays, siège des deux plus grandes banques suisses et de nombreuses multinationales. Genève est le 3e canton le plus peuplé."
  },
  {
    "id": 79,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Où siège le Tribunal fédéral ?",
    "options": ["Berne", "Zurich", "Lausanne", "Lucerne"],
    "correct": 2,
    "explanation": "Le Tribunal fédéral siège à Lausanne. C'est la plus haute instance judiciaire de Suisse, compétente pour les recours en dernière instance dans les domaines civil, pénal et administratif. Il existe aussi des tribunaux fédéraux spécialisés à Bellinzone et Saint-Gall."
  },
  {
    "id": 80,
    "theme": "geographie",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel est le principal aéroport desservant Genève ?",
    "options": ["Kloten", "Genève-Cointrin", "Euro Airport Basel", "Sion"],
    "correct": 1,
    "explanation": "L'Aéroport International de Genève (anciennement Cointrin) est le principal aéroport de la région genevoise. Il est l'un des plus fréquentés de Suisse avec environ 17 millions de passagers par an. L'aéroport de Kloten dessert Zurich."
  },
  {
    "id": 81,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle ville est traversée à la fois par le Rhône et l'Arve ?",
    "options": ["Lausanne", "Genève", "Sion", "Martigny"],
    "correct": 1,
    "explanation": "Genève est traversée par le Rhône (qui sort du lac Léman) et reçoit l'Arve (venant de la vallée de Chamonix) au lieu dit La Jonction. Ce confluent est un symbole géographique de la ville — on peut y observer les eaux grises de l'Arve se mêlant aux eaux bleues du Rhône."
  },
  {
    "id": 82,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Combien de demi-cantons compte la Suisse ?",
    "options": ["4", "6", "8", "10"],
    "correct": 1,
    "explanation": "La Suisse compte 6 demi-cantons : Obwald et Nidwald (anciennement Unterwald), Appenzell Rhodes-Extérieures et Appenzell Rhodes-Intérieures, Bâle-Ville et Bâle-Campagne. Les demi-cantons n'ont qu'un seul représentant au Conseil des États (au lieu de deux)."
  },
  {
    "id": 83,
    "theme": "geographie",
    "difficulty": 1,
    "choices": 4,
    "question": "Dans quelle ville se trouve le Palais fédéral ?",
    "options": ["Zurich", "Genève", "Berne", "Lucerne"],
    "correct": 2,
    "explanation": "Le Palais fédéral (Bundeshaus) se trouve à Berne, ville fédérale de la Suisse depuis 1848. Il abrite les deux chambres du Parlement fédéral (Conseil national et Conseil des États) ainsi que le Conseil fédéral."
  },
  {
    "id": 84,
    "theme": "geographie",
    "difficulty": 3,
    "choices": 4,
    "question": "Quel est le canton officiellement trilingue (DE/FR/IT) ?",
    "options": ["Valais", "Fribourg", "Grisons", "Berne"],
    "correct": 2,
    "explanation": "Les Grisons (Graubünden) sont le seul canton officiellement trilingue avec trois langues : l'allemand, le romanche et l'italien. C'est aussi le plus grand canton de Suisse en superficie. Le romanche n'est officiel qu'au niveau cantonal dans les Grisons."
  },
  {
    "id": 85,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la longueur approximative de la Suisse d'ouest en est ?",
    "options": ["150 km", "220 km", "350 km", "500 km"],
    "correct": 2,
    "explanation": "La Suisse mesure environ 350 km d'ouest en est (de Genève à Saint-Gall) et environ 220 km du nord au sud. C'est un pays relativement petit (41 285 km²) mais avec une géographie très variée (Jura, Plateau, Alpes)."
  },
  {
    "id": 86,
    "theme": "geographie",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel pays ne partage pas de frontière avec la Suisse ?",
    "options": ["L'Autriche", "Le Liechtenstein", "La Belgique", "La France"],
    "correct": 2,
    "explanation": "La Belgique ne partage pas de frontière avec la Suisse. La Suisse est bordée par 5 pays : la France (à l'ouest et au sud-ouest), l'Allemagne (au nord), l'Autriche (à l'est), le Liechtenstein (à l'est) et l'Italie (au sud)."
  }
]
```

- [ ] **Step 2: Verify question count**

```bash
grep -c '"id":' src/data/questions.json
```

Expected: `86`

```bash
grep '"theme":' src/data/questions.json | sort | uniq -c
```

Expected (18 politique_ch · 16 geneve · 10 troinex · 14 histoire · 14 droits · 14 geographie):

Expected:
```
86 questions
{
  politique_ch: 18,
  geneve: 16,
  troinex: 10,
  histoire: 14,
  droits: 14,
  geographie: 14
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/questions.json
git commit -m "feat: add 86 QCM questions across 6 themes"
```

---

## Task 4: useSpacedRepetition Hook

**Files:**
- Create: `src/hooks/useSpacedRepetition.ts`

- [ ] **Step 1: Create `src/hooks/` directory**

```bash
mkdir -p src/hooks
```

- [ ] **Step 2: Create `src/hooks/useSpacedRepetition.ts`**

```ts
import { useState, useCallback } from 'react'
import type { Question } from '../types'

const WEIGHTS_KEY = 'nq_weights'
const HISTORY_KEY = 'nq_history'

type Weights = Record<number, number>
type History = Record<number, { answered: number; correct: number }>

function loadWeights(): Weights {
  try { return JSON.parse(localStorage.getItem(WEIGHTS_KEY) || '{}') } catch { return {} }
}

function loadHistory(): History {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}') } catch { return {} }
}

export function useSpacedRepetition() {
  const [weights, setWeights] = useState<Weights>(loadWeights)
  const [history, setHistory] = useState<History>(loadHistory)

  const updateWeight = useCallback((id: number, correct: boolean) => {
    setWeights(prev => {
      const current = prev[id] ?? 1
      const next = correct
        ? Math.max(0.2, current * 0.6)
        : Math.min(5, current * 3)
      const updated = { ...prev, [id]: next }
      localStorage.setItem(WEIGHTS_KEY, JSON.stringify(updated))
      return updated
    })
    setHistory(prev => {
      const entry = prev[id] ?? { answered: 0, correct: 0 }
      const updated = {
        ...prev,
        [id]: {
          answered: entry.answered + 1,
          correct: entry.correct + (correct ? 1 : 0),
        },
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const pickWeighted = useCallback((questions: Question[]): Question | null => {
    if (!questions.length) return null
    const total = questions.reduce((s, q) => s + (weights[q.id] ?? 1), 0)
    let r = Math.random() * total
    for (const q of questions) {
      r -= (weights[q.id] ?? 1)
      if (r <= 0) return q
    }
    return questions[questions.length - 1]
  }, [weights])

  const getDueCount = useCallback((questions: Question[]) => {
    return questions.filter(q => (weights[q.id] ?? 1) > 1.5).length
  }, [weights])

  const resetWeights = useCallback(() => {
    localStorage.removeItem(WEIGHTS_KEY)
    localStorage.removeItem(HISTORY_KEY)
    setWeights({})
    setHistory({})
  }, [])

  return { weights, history, updateWeight, pickWeighted, getDueCount, resetWeights }
}

export type SpacedRepetitionHook = ReturnType<typeof useSpacedRepetition>
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSpacedRepetition.ts
git commit -m "feat: add useSpacedRepetition hook with nq_weights + nq_history localStorage"
```

---

## Task 5: AnswerFeedback & ScoreBar (leaf components)

**Files:**
- Create: `src/components/AnswerFeedback.tsx`
- Create: `src/components/ScoreBar.tsx`

- [ ] **Step 1: Create `src/components/AnswerFeedback.tsx`**

```tsx
import type { Question } from '../types'

interface Props {
  question: Question
  correct: boolean
}

export function AnswerFeedback({ question, correct }: Props) {
  return (
    <div
      className={`w-full rounded-2xl p-5 border ${
        correct
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <p className={`text-sm font-bold mb-2 ${correct ? 'text-green-700' : 'text-red-600'}`}>
        {correct ? '✓ Correct !' : '✗ Incorrect'}
      </p>
      <p className="text-sm text-slate-700 leading-relaxed">
        {question.explanation}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/ScoreBar.tsx`**

```tsx
interface Props {
  value: number   // 0–100
  label?: string
}

export function ScoreBar({ value, label }: Props) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span>{label}</span>
          <span className="text-swiss-red">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-swiss-darkred to-swiss-red transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AnswerFeedback.tsx src/components/ScoreBar.tsx
git commit -m "feat: add AnswerFeedback and ScoreBar leaf components"
```

---

## Task 6: QuestionCard

**Files:**
- Create: `src/components/QuestionCard.tsx`

- [ ] **Step 1: Create `src/components/QuestionCard.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { Question } from '../types'

interface Props {
  question: Question
  selectedIndex: number | null
  onSelect: (index: number) => void
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export function QuestionCard({ question, selectedIndex, onSelect }: Props) {
  const answered = selectedIndex !== null

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.correct
          const isSelected = idx === selectedIndex
          const isWrongSelection = answered && isSelected && !isCorrect

          let cls =
            'w-full text-left px-5 py-4 rounded-2xl font-medium transition-all border-2 flex items-center gap-3 '

          if (!answered) {
            cls +=
              'border-slate-200 bg-white text-slate-700 hover:border-swiss-red hover:text-swiss-red active:scale-[0.98]'
          } else if (isCorrect) {
            cls += 'border-green-500 bg-green-50 text-green-700'
          } else if (isSelected) {
            cls += 'border-red-400 bg-red-50 text-red-600'
          } else {
            cls += 'border-slate-100 bg-slate-50 text-slate-400'
          }

          return (
            <motion.button
              key={idx}
              className={cls}
              disabled={answered}
              onClick={() => onSelect(idx)}
              animate={isWrongSelection ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xs font-black opacity-50 shrink-0 w-5">
                {OPTION_LETTERS[idx]}
              </span>
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QuestionCard.tsx
git commit -m "feat: add QuestionCard with QCM buttons and shake animation"
```

---

## Task 7: QuizScreen

**Files:**
- Create: `src/components/QuizScreen.tsx`

- [ ] **Step 1: Create `src/components/QuizScreen.tsx`**

```tsx
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { AnswerFeedback } from './AnswerFeedback'
import { THEMES } from '../types'
import type { Question } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

interface Props {
  questions: Question[]
  hook: SpacedRepetitionHook
  onBack: () => void
}

export function QuizScreen({ questions, hook, onBack }: Props) {
  const { pickWeighted, updateWeight } = hook
  const [current, setCurrent] = useState<Question | null>(() => pickWeighted(questions))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-slate-500">Aucune question disponible pour ce thème.</p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-swiss-red font-semibold"
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </button>
      </div>
    )
  }

  const themeLabel = THEMES.find(t => t.id === current.theme)?.label ?? current.theme
  const answered = selectedIndex !== null

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    updateWeight(current.id, idx === current.correct)
  }

  const handleNext = () => {
    const next = pickWeighted(questions)
    setCurrent(next)
    setSelectedIndex(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-500">{themeLabel}</span>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-5 p-6 w-full max-w-xl mx-auto">
        <QuestionCard
          question={current}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />

        {answered && (
          <>
            <AnswerFeedback question={current} correct={selectedIndex === current.correct} />
            <button
              onClick={handleNext}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition active:scale-95"
            >
              Question suivante →
            </button>
          </>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QuizScreen.tsx
git commit -m "feat: add QuizScreen with weighted question pick and answer flow"
```

---

## Task 8: ThemeGrid & ThemeStats

**Files:**
- Create: `src/components/ThemeGrid.tsx`
- Create: `src/components/ThemeStats.tsx`

- [ ] **Step 1: Create `src/components/ThemeGrid.tsx`**

```tsx
import { ScoreBar } from './ScoreBar'
import { THEMES } from '../types'
import type { Theme, Question } from '../types'

interface Props {
  allQuestions: Question[]
  history: Record<number, { answered: number; correct: number }>
  onSelectTheme: (theme: Theme) => void
}

export function ThemeGrid({ allQuestions, history, onSelectTheme }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {THEMES.map(theme => {
        const qs = allQuestions.filter(q => q.theme === theme.id)
        const answered = qs.filter(q => history[q.id]).length
        const progress = Math.round((answered / theme.total) * 100)

        return (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-swiss-red/40 transition-all text-left active:scale-[0.97]"
          >
            <div className="text-2xl mb-3">{theme.icon}</div>
            <p className="font-bold text-slate-800 text-sm leading-tight mb-1">
              {theme.label}
            </p>
            <p className="text-xs text-slate-400 mb-4">{theme.total} questions</p>
            <ScoreBar value={progress} />
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/ThemeStats.tsx`**

```tsx
import { THEMES } from '../types'
import type { Question } from '../types'

interface Props {
  allQuestions: Question[]
  history: Record<number, { answered: number; correct: number }>
}

export function ThemeStats({ allQuestions, history }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
            <th className="text-left px-5 py-3 font-semibold">Thème</th>
            <th className="text-right px-5 py-3 font-semibold">Répondues</th>
            <th className="text-right px-5 py-3 font-semibold">Réussite</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {THEMES.map(theme => {
            const qs = allQuestions.filter(q => q.theme === theme.id)
            const answered = qs.filter(q => history[q.id]).length
            const totalAttempts = qs.reduce(
              (s, q) => s + (history[q.id]?.answered ?? 0),
              0
            )
            const totalCorrect = qs.reduce(
              (s, q) => s + (history[q.id]?.correct ?? 0),
              0
            )
            const pct =
              totalAttempts > 0
                ? Math.round((totalCorrect / totalAttempts) * 100)
                : null

            const color =
              pct === null
                ? 'text-slate-400'
                : pct >= 75
                ? 'text-green-600'
                : pct >= 50
                ? 'text-orange-500'
                : 'text-red-500'

            return (
              <tr key={theme.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-medium text-slate-700">
                  {theme.icon} {theme.label}
                </td>
                <td className="px-5 py-3 text-right text-slate-500">
                  {answered}/{theme.total}
                </td>
                <td className={`px-5 py-3 text-right font-bold ${color}`}>
                  {pct !== null ? `${pct}%` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeGrid.tsx src/components/ThemeStats.tsx
git commit -m "feat: add ThemeGrid and ThemeStats components"
```

---

## Task 9: HomeScreen

**Files:**
- Create: `src/components/HomeScreen.tsx`

- [ ] **Step 1: Create `src/components/HomeScreen.tsx`**

```tsx
import { Shuffle, ClipboardList, RotateCcw } from 'lucide-react'
import { ThemeGrid } from './ThemeGrid'
import { ThemeStats } from './ThemeStats'
import type { Question, Theme } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

interface Props {
  allQuestions: Question[]
  hook: SpacedRepetitionHook
  onStartTheme: (theme: Theme) => void
  onStartRandom: () => void
  onStartExam: () => void
}

export function HomeScreen({
  allQuestions,
  hook,
  onStartTheme,
  onStartRandom,
  onStartExam,
}: Props) {
  const { history, getDueCount, resetWeights } = hook

  const answered = Object.keys(history).length
  const correct = Object.values(history).filter(h => h.correct > 0).length
  const totalAttempts = Object.values(history).reduce((s, h) => s + h.answered, 0)
  const totalCorrect = Object.values(history).reduce((s, h) => s + h.correct, 0)
  const pct =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const due = getDueCount(allQuestions)

  const metrics = [
    { label: 'Répondues', value: String(answered), icon: '📝' },
    { label: 'Correctes',  value: String(correct),  icon: '✅' },
    { label: '% Réussite', value: `${pct}%`,        icon: '📊' },
    { label: 'À revoir',   value: String(due),       icon: '🔄' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-swiss-red to-swiss-darkred flex items-center justify-center text-white font-black text-sm shadow-md">
            CH
          </div>
          <h1 className="font-bold text-slate-800 text-lg tracking-tight">
            Naturalisation
          </h1>
        </div>
        <button
          onClick={resetWeights}
          className="text-slate-400 hover:text-slate-700 transition p-2"
          title="Réinitialiser la progression"
        >
          <RotateCcw size={18} />
        </button>
      </header>

      <main className="flex-1 p-6 w-full max-w-2xl mx-auto space-y-8 pb-12">
        {/* 4 métriques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map(m => (
            <div
              key={m.label}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center"
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-2xl font-black text-slate-800">{m.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onStartRandom}
            className="flex-1 bg-swiss-red hover:bg-swiss-darkred text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-red-200"
          >
            <Shuffle size={18} />
            Aléatoire
          </button>
          <button
            onClick={onStartExam}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
          >
            <ClipboardList size={18} />
            Examen blanc
          </button>
        </div>

        {/* Grille des thèmes */}
        <ThemeGrid
          allQuestions={allQuestions}
          history={history}
          onSelectTheme={onStartTheme}
        />

        {/* Tableau des stats */}
        <ThemeStats allQuestions={allQuestions} history={history} />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HomeScreen.tsx
git commit -m "feat: add HomeScreen with metrics, ThemeGrid, and ThemeStats"
```

---

## Task 10: ExamMode

**Files:**
- Create: `src/components/ExamMode.tsx`

- [ ] **Step 1: Create `src/components/ExamMode.tsx`**

```tsx
import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { AnswerFeedback } from './AnswerFeedback'
import { THEMES } from '../types'
import type { Question } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

const EXAM_COUNT = 20

interface Props {
  allQuestions: Question[]
  hook: SpacedRepetitionHook
  onBack: () => void
}

export function ExamMode({ allQuestions, hook, onBack }: Props) {
  const { pickWeighted, updateWeight } = hook

  // Pick 20 distinct weighted questions once at mount
  const examQuestions = useMemo<Question[]>(() => {
    const picked: Question[] = []
    const remaining = [...allQuestions]
    for (let i = 0; i < EXAM_COUNT && remaining.length > 0; i++) {
      const q = pickWeighted(remaining)
      if (!q) break
      picked.push(q)
      remaining.splice(remaining.indexOf(q), 1)
    }
    return picked
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally fixed at mount — exam set must not change mid-session

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  // — Summary screen —
  if (done) {
    const score = answers.filter(Boolean).length
    const failed = examQuestions.filter((_, i) => !answers[i])
    const weakThemes = THEMES.filter(theme => {
      const themeQs = examQuestions.filter(q => q.theme === theme.id)
      if (!themeQs.length) return false
      const themeCorrect = themeQs.filter(q => {
        const i = examQuestions.indexOf(q)
        return answers[i]
      }).length
      return themeCorrect / themeQs.length < 0.5
    })

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            score >= 14 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
          }`}
        >
          {score >= 14 ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-2">
          {score} / {EXAM_COUNT}
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">
          {score >= 14
            ? "Excellent ! Prête pour l'oral."
            : 'Continue à réviser, tu vas y arriver !'}
        </p>

        {weakThemes.length > 0 && (
          <div className="w-full max-w-md bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5">
            <p className="text-sm font-bold text-orange-700 mb-3">
              Thèmes à renforcer
            </p>
            {weakThemes.map(t => (
              <p key={t.id} className="text-sm text-orange-600 py-0.5">
                {t.icon} {t.label}
              </p>
            ))}
          </div>
        )}

        {failed.length > 0 && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="text-sm font-bold text-red-700 mb-4">
              Questions ratées ({failed.length})
            </p>
            <div className="space-y-4">
              {failed.map(q => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-slate-700">{q.question}</p>
                  <p className="text-xs text-green-700 mt-1">
                    ✓ {q.options[q.correct]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition active:scale-95"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  // — Quiz screen —
  const current = examQuestions[currentIdx]
  const answered = selectedIndex !== null

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    updateWeight(current.id, idx === current.correct)
  }

  const handleNext = () => {
    const newAnswers = [...answers, selectedIndex === current.correct]
    setAnswers(newAnswers)

    if (currentIdx + 1 >= examQuestions.length) {
      setDone(true)
    } else {
      setCurrentIdx(prev => prev + 1)
      setSelectedIndex(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-bold text-slate-800">Examen blanc</h1>
        <span className="text-sm font-semibold text-slate-500">
          {currentIdx + 1} / {EXAM_COUNT}
        </span>
      </header>

      {/* Progress strip */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-full bg-swiss-red transition-all duration-300"
          style={{ width: `${(currentIdx / EXAM_COUNT) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col justify-center gap-5 p-6 w-full max-w-xl mx-auto">
        <QuestionCard
          question={current}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />

        {answered && (
          <>
            <AnswerFeedback
              question={current}
              correct={selectedIndex === current.correct}
            />
            <button
              onClick={handleNext}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition active:scale-95"
            >
              {currentIdx + 1 < examQuestions.length
                ? 'Question suivante →'
                : 'Voir les résultats'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExamMode.tsx
git commit -m "feat: add ExamMode with 20-question exam and summary screen"
```

---

## Task 11: App.tsx — Wire Everything

**Files:**
- Rewrite: `src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx` entirely**

```tsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { ExamMode } from './components/ExamMode'
import { useSpacedRepetition } from './hooks/useSpacedRepetition'
import questionsData from './data/questions.json'
import type { Screen, Theme, Question } from './types'

const allQuestions = questionsData as Question[]

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const hook = useSpacedRepetition()

  const filteredQuestions = selectedTheme
    ? allQuestions.filter(q => q.theme === selectedTheme)
    : allQuestions

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-swiss-red selection:text-white">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              allQuestions={allQuestions}
              hook={hook}
              onStartTheme={(theme: Theme) => {
                setSelectedTheme(theme)
                setScreen('quiz')
              }}
              onStartRandom={() => {
                setSelectedTheme(null)
                setScreen('quiz')
              }}
              onStartExam={() => setScreen('exam')}
            />
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <QuizScreen
              questions={filteredQuestions}
              hook={hook}
              onBack={() => { setSelectedTheme(null); setScreen('home') }}
            />
          </motion.div>
        )}

        {screen === 'exam' && (
          <motion.div
            key="exam"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <ExamMode
              allQuestions={allQuestions}
              hook={hook}
              onBack={() => setScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server compiles without errors**

```bash
npm run dev
```

Expected: Vite compiles cleanly. Open http://localhost:5173 and verify:
- HomeScreen visible with 4 metric cards showing 0
- 6 theme cards visible in ThemeGrid
- ThemeStats table visible below
- "Aléatoire" button works → QuizScreen opens
- Question displayed with option buttons
- Click an option → correct goes green, wrong goes red with shake, explanation appears
- "Question suivante →" button cycles to next question
- Back arrow → returns to HomeScreen
- "Examen blanc" button → ExamMode with 20 questions
- After all 20 → summary shows score + failed questions + "Retour à l'accueil"
- Answer a few questions → metrics update on HomeScreen

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire App.tsx state machine — home/quiz/exam with AnimatePresence"
```

---

## Task 12: Build & Deploy Verification

- [ ] **Step 1: TypeScript check**

```bash
npm run build
```

Expected: `tsc -b` passes without errors, then Vite bundles to `dist/`.

- [ ] **Step 2: Check bundle includes framer-motion**

```bash
ls -lh dist/assets/*.js | sort -k5 -rh | head -5
```

Expected: largest `.js` bundle should be ≥ 200KB (framer-motion is ~150KB min). If the main bundle is tiny, framer-motion wasn't bundled — re-check `package.json` dependencies.

- [ ] **Step 3: Preview the production build**

```bash
npm run preview
```

Open the preview URL and repeat the smoke test from Task 11 Step 2.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: production build verified — ready for Netlify deploy"
```

- [ ] **Step 5: Deploy to Netlify**

Drag & drop the `dist/` folder onto https://app.netlify.com/drop

---

## Pre-deploy Checklist (from CLAUDE.md risks)

- [ ] Verify question ID 11 (`politique_ch`): "Qui préside la Confédération en 2026 ?" → Karin Keller-Sutter
- [ ] Verify question ID 41 (`troinex`): "Quelle est la population approximative de Troinex ?" → valider sur troinex.ch
- [ ] Verify question ID 37 (`troinex`): "Troinex est limitrophe de quelle commune française ?" → Saint-Julien-en-Genevois
- [ ] Verify question ID 44 (`troinex`): "De quelle région genevoise Troinex fait-elle partie ?" → confirmer "secteur Arve-Lac"
