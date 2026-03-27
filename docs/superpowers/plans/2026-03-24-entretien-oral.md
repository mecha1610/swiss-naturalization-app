# Entretien Oral — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un écran "Entretien oral" avec 28 questions + réponses modèles, deux modes (Lecture / Entraînement) et un suivi de maîtrise par question (localStorage).

**Architecture:** Nouveau fichier de données `entretien.json` (28 questions en 7 catégories) + composant `EntretienScreen.tsx` autonome avec mastery state local. Modifications minimales de `types.ts`, `App.tsx` et `HomeScreen.tsx` pour le câblage. Aucun nouveau hook, aucune dépendance externe.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, lucide-react, framer-motion (AnimatePresence déjà en place), localStorage.

**Spec:** `docs/superpowers/specs/2026-03-23-entretien-oral-design.md`

---

## File Map

| Action | Fichier | Rôle |
|---|---|---|
| CRÉER | `src/data/entretien.json` | 28 questions en 7 catégories |
| CRÉER | `src/components/EntretienScreen.tsx` | Écran principal, mastery, toggle mode |
| MODIFIER | `src/types.ts` | Ajouter `'entretien'` au type `Screen` |
| MODIFIER | `src/App.tsx` | Route + prop threading |
| MODIFIER | `src/components/HomeScreen.tsx` | Bouton "Entretien oral" |

---

## Task 1: Créer entretien.json

**Files:**
- Create: `src/data/entretien.json`

- [ ] **Step 1: Créer le fichier**

```json
[
  {
    "id": "motivations",
    "label": "Motivations",
    "icon": "💭",
    "questions": [
      {
        "id": "m1",
        "question": "Pourquoi souhaitez-vous obtenir la nationalité suisse ?",
        "answer": "Je vis en Suisse depuis plusieurs années et je me sens pleinement intégrée dans ce pays. Je participe à la vie locale à Troinex, je respecte les valeurs suisses de démocratie directe, de neutralité et de diversité. Obtenir la nationalité suisse serait pour moi la reconnaissance officielle d'un ancrage profond et sincère dans ce pays que je considère comme le mien."
      },
      {
        "id": "m2",
        "question": "Qu'est-ce que la nationalité suisse représente pour vous ?",
        "answer": "La nationalité suisse représente le droit de voter et de participer directement aux décisions qui concernent ma vie quotidienne — les votations, les élections. C'est aussi une appartenance à une société multiculturelle et stable, fondée sur le consensus et la subsidiarité."
      },
      {
        "id": "m3",
        "question": "Comment vous êtes-vous intégrée dans la vie locale à Troinex ?",
        "answer": "Je vis à Troinex, une commune à caractère rural que j'apprécie pour son cadre de vie préservé. Je suis les actualités locales et cantonales, je participe aux événements genevois comme l'Escalade ou le Jeûne genevois, et je m'informe régulièrement via la RTS et la Tribune de Genève."
      }
    ]
  },
  {
    "id": "votations",
    "label": "Votations récentes",
    "icon": "🗳️",
    "questions": [
      {
        "id": "v1",
        "question": "Citez une votation fédérale récente et développez.",
        "answer": "En mars 2024, les Suisses ont accepté l'initiative pour une 13e rente AVS. C'est une décision historique : pour la première fois, une initiative de gauche sur les retraites a été acceptée. Elle prévoit une rente supplémentaire chaque année, représentant 8,3% de la rente annuelle. Les partisans arguaient que le pouvoir d'achat des retraités avait été érodé par l'inflation ; les opposants craignaient un coût trop élevé pour les employeurs et l'AVS."
      },
      {
        "id": "v2",
        "question": "Citez une deuxième votation récente et développez.",
        "answer": "En septembre 2024, les Suisses ont rejeté l'initiative pour la biodiversité, qui demandait la protection de 30% du territoire suisse. Les partisans souhaitaient préserver la nature et les espèces menacées ; les opposants craignaient des restrictions trop fortes pour l'agriculture et l'aménagement du territoire. Le résultat reflète la difficulté de concilier protection de l'environnement et intérêts économiques."
      },
      {
        "id": "v3",
        "question": "Qu'est-ce que la réforme AVS 21 ?",
        "answer": "La réforme AVS 21, acceptée en septembre 2022, a aligné l'âge de la retraite des femmes à 65 ans, comme les hommes. En contrepartie, les femmes proches de la retraite ont bénéficié de compensations. Cette réforme a été très disputée : les syndicats y voyaient une injustice, le gouvernement une nécessité pour équilibrer les finances de l'AVS. Elle est entrée en vigueur progressivement dès 2024."
      },
      {
        "id": "v4",
        "question": "Qu'est-ce que la réforme LPP (2e pilier) ?",
        "answer": "La réforme du 2e pilier (LPP) a été soumise aux Suisses en 2024. Elle visait à améliorer la prévoyance des travailleurs à temps partiel, notamment les femmes. Elle a été rejetée de justesse, car certains estimaient qu'elle augmentait les cotisations sans suffisamment améliorer les rentes. Le débat a mis en lumière les inégalités dans le système de retraite suisse."
      },
      {
        "id": "v5",
        "question": "Qu'est-ce que l'accord Suisse-UE (Bilatérales III) ?",
        "answer": "Après l'abandon de l'accord-cadre en 2021, la Suisse et l'UE ont engagé de nouvelles négociations appelées Bilatérales III. L'objectif est de consolider et actualiser les accords bilatéraux existants — notamment sur la libre circulation, les transports et l'énergie — tout en acceptant une reprise dynamique du droit européen. Ce dossier est crucial pour les relations économiques de la Suisse avec son principal partenaire commercial."
      },
      {
        "id": "v6",
        "question": "Comment fonctionne la démocratie directe en Suisse ?",
        "answer": "En Suisse, les citoyens peuvent voter sur des lois et des révisions constitutionnelles plusieurs fois par an. L'initiative populaire permet à 100 000 citoyens de proposer une modification de la Constitution. Le référendum facultatif permet à 50 000 citoyens de contester une loi du Parlement. C'est ce qui distingue fondamentalement la Suisse des autres démocraties : le peuple a le dernier mot."
      }
    ]
  },
  {
    "id": "gouvernements",
    "label": "Gouvernements",
    "icon": "🏛️",
    "questions": [
      {
        "id": "g1",
        "question": "Nommez les membres du Conseil fédéral et leurs partis.",
        "answer": "Le Conseil fédéral compte 7 membres. En 2026 : Karin Keller-Sutter (PLR, présidente), Ignazio Cassis (PLR), Beat Jans (PS), Elisabeth Baume-Schneider (PS), Guy Parmelin (UDC), Albert Rösti (UDC), et le 7e siège du Centre (à vérifier sur admin.ch — Viola Amherd a démissionné fin 2025). Ils gouvernent collégialement — aucun n'a de pouvoir supérieur aux autres."
      },
      {
        "id": "g2",
        "question": "Qui est la présidente de la Confédération en 2026 ?",
        "answer": "La présidente de la Confédération en 2026 est Karin Keller-Sutter, du Parti Libéral-Radical. Elle dirige le Département fédéral des finances. La présidence de la Confédération est tournante : chaque conseiller fédéral devient président pour un an."
      },
      {
        "id": "g3",
        "question": "Nommez les membres du Conseil d'État genevois.",
        "answer": "Le Conseil d'État genevois compte 7 membres élus pour 5 ans, issus de plusieurs partis (PS, PLR, Verts, MCG). Il est dirigé par un président tournant élu annuellement par ses pairs. Les 7 membres se partagent les départements cantonaux : finances, sécurité, instruction publique, santé, territoire, institutions, et cohésion sociale."
      },
      {
        "id": "g4",
        "question": "Qui dirige la commune de Troinex ?",
        "answer": "Troinex est dirigée par un maire et un conseil municipal élus par les citoyens de la commune. L'exécutif communal gère les affaires locales : routes, espaces verts, administration de proximité et vie associative. C'est une petite commune résidentielle d'environ 2 500 habitants."
      },
      {
        "id": "g5",
        "question": "Quelle est la différence entre le Conseil fédéral et le Parlement fédéral ?",
        "answer": "Le Parlement fédéral (Assemblée fédérale) est le pouvoir législatif : il vote les lois. Il est composé de deux chambres — le Conseil national (200 membres, représentant le peuple) et le Conseil des États (46 membres, représentant les cantons). Le Conseil fédéral est le pouvoir exécutif : il gouverne et met en œuvre les lois. C'est la séparation des pouvoirs."
      },
      {
        "id": "g6",
        "question": "Comment est élu le Conseil fédéral ?",
        "answer": "Le Conseil fédéral est élu par l'Assemblée fédérale réunie en séance plénière — les 246 parlementaires des deux chambres réunis. Le peuple n'élit pas directement les conseillers fédéraux. La composition reflète la formule magique : une répartition entre les principaux partis selon leur force électorale."
      }
    ]
  },
  {
    "id": "partis",
    "label": "Partis politiques",
    "icon": "🗂️",
    "questions": [
      {
        "id": "p1",
        "question": "Citez les principaux partis politiques suisses et leur orientation.",
        "answer": "Les quatre principaux partis fédéraux sont l'UDC (droite nationaliste, premier parti de Suisse), le PS (gauche sociale-démocrate), le PLR (droite libérale) et Le Centre (droite modérée, ex-PDC). Les Verts (gauche écologiste) et les Vert'libéraux (centre écologiste) sont aussi importants. À Genève, le MCG (Mouvement Citoyens Genevois) est un parti régionaliste spécifique au canton."
      },
      {
        "id": "p2",
        "question": "Quel est le parti le plus fort en Suisse ?",
        "answer": "L'UDC (Union Démocratique du Centre) est le premier parti de Suisse avec environ 28% des voix aux élections fédérales de 2023. Il défend des positions conservatrices, souverainistes et restrictives sur l'immigration. Sa force explique qu'il dispose de 2 sièges au Conseil fédéral dans la formule magique."
      },
      {
        "id": "p3",
        "question": "Qu'est-ce que la concordance en Suisse ?",
        "answer": "La concordance est le principe selon lequel les principaux partis politiques sont représentés au gouvernement proportionnellement à leur force électorale — c'est la formule magique. Cela favorise le consensus et évite les blocages. C'est une spécificité suisse : le gouvernement n'est pas formé d'une coalition majoritaire comme dans les autres démocraties."
      }
    ]
  },
  {
    "id": "droits",
    "label": "Droits & devoirs",
    "icon": "⚖️",
    "questions": [
      {
        "id": "d1",
        "question": "Quels droits obtiendrez-vous avec la nationalité suisse ?",
        "answer": "En tant que Suissesse, j'aurai le droit de vote et d'éligibilité aux niveaux fédéral, cantonal et communal. Je pourrai signer des initiatives populaires et des référendums. J'aurai également droit à un passeport suisse, à la protection consulaire à l'étranger, et je n'aurai plus besoin de permis de séjour pour vivre en Suisse."
      },
      {
        "id": "d2",
        "question": "Quels devoirs aurez-vous en tant que citoyenne suisse ?",
        "answer": "Le devoir civique principal est de voter — bien que le vote ne soit pas obligatoire en Suisse, il est fortement encouragé. Je devrai respecter les lois fédérales, cantonales et communales, payer mes impôts et m'acquitter de mes obligations légales. En tant que femme, je ne suis pas soumise au service militaire obligatoire, mais je peux y servir volontairement."
      },
      {
        "id": "d3",
        "question": "Comment fonctionne le système de retraite suisse ?",
        "answer": "Le système suisse de retraite repose sur trois piliers. Le premier pilier est l'AVS (rente de base pour tous). Le deuxième pilier est la LPP (prévoyance professionnelle obligatoire pour les salariés). Le troisième pilier est l'épargne volontaire privée (3a ou 3b), avantageuse fiscalement. Ces trois piliers combinés visent à maintenir environ 60% du dernier salaire à la retraite."
      },
      {
        "id": "d4",
        "question": "Qu'est-ce que la LAMal ?",
        "answer": "La LAMal est la Loi sur l'assurance-maladie obligatoire. Toute personne résidant en Suisse doit s'affilier à une caisse maladie dans les 3 mois suivant son arrivée. Elle couvre les soins de base avec une franchise annuelle (minimum 300 CHF) et une quote-part de 10%. À Genève, les primes sont parmi les plus élevées de Suisse."
      }
    ]
  },
  {
    "id": "societal",
    "label": "Thèmes sociétaux genevois",
    "icon": "🏙️",
    "questions": [
      {
        "id": "s1",
        "question": "Quels sont les grands défis du canton de Genève aujourd'hui ?",
        "answer": "Genève fait face à plusieurs défis majeurs : la crise du logement (loyers très élevés, taux de vacance inférieur à 1%), la pression sur les transports publics avec la croissance de l'agglomération transfrontalière du Grand Genève, et les enjeux environnementaux comme la préservation des espaces verts dans un canton très densifié."
      },
      {
        "id": "s2",
        "question": "Que pensez-vous de la situation du logement à Genève ?",
        "answer": "La pénurie de logements est un problème structurel à Genève depuis plusieurs décennies. Le taux de vacance est très bas — moins de 1% — ce qui maintient les loyers parmi les plus élevés de Suisse. Des projets de construction sont en cours dans les communes périurbaines comme Troinex, mais la tension entre urbanisation et préservation du caractère rural est un enjeu récurrent."
      },
      {
        "id": "s3",
        "question": "Parlez-moi de la question de l'intégration et de l'immigration à Genève.",
        "answer": "Genève est une ville très internationale : plus de 40% de sa population est étrangère. Le canton investit dans les cours de français, l'accueil des nouveaux arrivants et la cohésion sociale. Des tensions existent autour de l'accueil des requérants d'asile et de la politique migratoire fédérale. Ma propre démarche de naturalisation s'inscrit dans cette volonté de m'intégrer pleinement."
      }
    ]
  },
  {
    "id": "culture",
    "label": "Vie locale & culture",
    "icon": "🎭",
    "questions": [
      {
        "id": "c1",
        "question": "À quelles fêtes et manifestations participez-vous à Genève ?",
        "answer": "Je participe aux grandes fêtes genevoises : l'Escalade en décembre, qui commémore la résistance genevoise de 1602 avec ses marmites en chocolat et ses défilés costumés. Le Jeûne genevois en septembre est un jour de recueillement unique à Genève. Je suis aussi les événements culturels locaux et je m'informe régulièrement via la RTS et la Tribune de Genève."
      },
      {
        "id": "c2",
        "question": "Quels cantons suisses avez-vous visités ?",
        "answer": "J'ai visité plusieurs cantons suisses : Vaud pour Lausanne et les bords du lac Léman, le Valais pour les stations de ski et les Alpes, Fribourg et sa vieille ville médiévale, et Berne, la capitale fédérale, avec le Palais fédéral. Ces voyages m'ont permis de découvrir la diversité linguistique et culturelle de la Suisse."
      },
      {
        "id": "c3",
        "question": "Quels médias suivez-vous pour vous informer sur l'actualité suisse ?",
        "answer": "Je suis l'actualité principalement via la RTS (Radio Télévision Suisse) — le journal télévisé et rts.ch. Je lis la Tribune de Genève pour l'actualité locale. Je consulte ch.ch pour les informations officielles sur les votations et les droits civiques. Ces sources me permettent de rester informée des enjeux locaux et nationaux."
      }
    ]
  }
]
```

- [ ] **Step 2: Vérifier que le JSON est valide**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app
node -e "const d = require('./src/data/entretien.json'); const total = d.flatMap(c=>c.questions).length; console.log('Catégories:', d.length, '| Questions:', total)"
```

Expected: `Catégories: 7 | Questions: 28`

- [ ] **Step 3: Commit**

```bash
git add src/data/entretien.json
git commit -m "feat: entretien.json — 28 questions en 7 catégories"
```

---

## Task 2: Créer EntretienScreen.tsx

**Files:**
- Create: `src/components/EntretienScreen.tsx`

- [ ] **Step 1: Créer le composant**

```tsx
import { useState, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import categoriesData from '../data/entretien.json'

interface EntretienQuestion {
  id: string
  question: string
  answer: string
}

interface EntretienCategory {
  id: string
  label: string
  icon: string
  questions: EntretienQuestion[]
}

type Mode = 'lecture' | 'entrainement'

const MASTERY_KEY = 'nq_mastery'

function loadMastery(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(MASTERY_KEY) || '{}')
  } catch {
    return {}
  }
}

function QuestionCard({
  q,
  mode,
  mastered,
  onToggleMastery,
}: {
  q: EntretienQuestion
  mode: Mode
  mastered: boolean
  onToggleMastery: () => void
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        mastered
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      <p className="font-semibold text-slate-800 mb-3 leading-snug">{q.question}</p>

      {mode === 'lecture' || revealed ? (
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{q.answer}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition mb-4"
        >
          Voir la réponse ▼
        </button>
      )}

      {(mode === 'lecture' || revealed) && (
        <button
          onClick={onToggleMastery}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
            mastered
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          {mastered ? '✓ Maîtrisée' : '+ Maîtrisée'}
        </button>
      )}
    </div>
  )
}

interface Props {
  onBack: () => void
}

export function EntretienScreen({ onBack }: Props) {
  const categories = categoriesData as EntretienCategory[]
  const [mode, setMode] = useState<Mode>('lecture')
  const [mastery, setMastery] = useState<Record<string, boolean>>(loadMastery)

  const totalCount = categories.flatMap(c => c.questions).length
  const masteredCount = Object.values(mastery).filter(Boolean).length

  const toggleMastery = useCallback((id: string) => {
    setMastery(prev => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(MASTERY_KEY, JSON.stringify(updated))
      } catch {
        /* storage unavailable */
      }
      return updated
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-slate-800">Entretien oral</h1>
        <span className="text-sm font-semibold text-slate-500">
          {masteredCount} / {totalCount} ✓
        </span>
      </header>

      {/* Mode toggle */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(['lecture', 'entrainement'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === m
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'lecture' ? 'Lecture' : 'Entraînement'}
            </button>
          ))}
        </div>
      </div>

      {/* key={mode} resets all revealed states on mode change */}
      <main key={mode} className="flex-1 p-6 w-full max-w-2xl mx-auto space-y-8 pb-12">
        {categories.map(cat => (
          <div key={cat.id}>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {cat.icon} {cat.label}
            </p>
            <div className="space-y-4">
              {cat.questions.map(q => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  mode={mode}
                  mastered={!!mastery[q.id]}
                  onToggleMastery={() => toggleMastery(q.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors (note: `types.ts` still has `Screen` without `'entretien'` — that's fixed in Task 3, acceptable here)

- [ ] **Step 3: Commit**

```bash
git add src/components/EntretienScreen.tsx
git commit -m "feat: EntretienScreen — fiches orales avec modes Lecture/Entraînement et suivi maîtrise"
```

---

## Task 3: Câblage — types.ts + App.tsx + HomeScreen.tsx

**Files:**
- Modify: `src/types.ts` (line 23)
- Modify: `src/App.tsx`
- Modify: `src/components/HomeScreen.tsx`

- [ ] **Step 1: Mettre à jour `src/types.ts` — ajouter `'entretien'` au type Screen**

Remplacer la ligne :
```ts
export type Screen = 'home' | 'quiz' | 'exam'
```
par :
```ts
export type Screen = 'home' | 'quiz' | 'exam' | 'entretien'
```

- [ ] **Step 2: Mettre à jour `src/App.tsx` — importer EntretienScreen et ajouter la route**

Remplacer le fichier entier par :

```tsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { ExamMode } from './components/ExamMode'
import { EntretienScreen } from './components/EntretienScreen'
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
              onStartEntretien={() => setScreen('entretien')}
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

        {screen === 'entretien' && (
          <motion.div
            key="entretien"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <EntretienScreen onBack={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: Mettre à jour `src/components/HomeScreen.tsx` — ajouter prop + bouton**

3a. Dans l'interface Props, ajouter `onStartEntretien: () => void` :

```tsx
interface Props {
  allQuestions: Question[]
  hook: SpacedRepetitionHook
  onStartTheme: (theme: Theme) => void
  onStartRandom: () => void
  onStartExam: () => void
  onStartEntretien: () => void
}
```

3b. Dans la destructuration de la fonction :

```tsx
export function HomeScreen({
  allQuestions,
  hook,
  onStartTheme,
  onStartRandom,
  onStartExam,
  onStartEntretien,
}: Props) {
```

3c. Modifier l'import lucide-react pour ajouter `Mic` :

```tsx
import { Shuffle, ClipboardList, RotateCcw, Mic } from 'lucide-react'
```

3d. Après le bloc `{/* Boutons d'action */}` contenant Aléatoire + Examen blanc, ajouter le bouton Entretien oral. Le bloc existant est :

```tsx
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
```

Remplacer par :

```tsx
        {/* Boutons d'action */}
        <div className="flex flex-col gap-3">
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
          <button
            onClick={onStartEntretien}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
          >
            <Mic size={18} />
            Entretien oral
          </button>
        </div>
```

- [ ] **Step 4: TypeScript check complet — doit être propre**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1
```

Expected: no output (no errors)

- [ ] **Step 5: Build check**

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/App.tsx src/components/HomeScreen.tsx
git commit -m "feat: câblage entretien oral — route App.tsx + bouton HomeScreen"
```

---

## Task 4: Push & vérification finale

- [ ] **Step 1: Vérifier le JSON entretien en production**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app
node -e "
const d = require('./src/data/entretien.json');
const total = d.flatMap(c => c.questions).length;
const ids = d.flatMap(c => c.questions).map(q => q.id);
const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log('Catégories:', d.length);
console.log('Questions:', total);
console.log('IDs dupliqués:', dups.length === 0 ? 'aucun' : dups);
"
```

Expected: `Catégories: 7 | Questions: 28 | IDs dupliqués: aucun`

- [ ] **Step 2: Push**

```bash
git push
```

Expected: push réussi → Netlify auto-deploy déclenché
