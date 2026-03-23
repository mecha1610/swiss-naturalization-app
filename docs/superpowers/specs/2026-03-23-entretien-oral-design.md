# Design — Section Entretien Oral

**Date :** 2026-03-23
**Projet :** Swiss Naturalization Quiz GE
**Candidat :** Marine Claver, Troinex (GE-1256)
**Source :** Document OCPM « Entretien pour la naturalisation : comment bien se préparer ? »

---

## Objectif

Ajouter un écran "Entretien oral" permettant à Marine de préparer les questions orales de l'entretien de naturalisation. Contrairement au QCM, l'entretien évalue la capacité à *développer* des sujets, connaître l'actualité, et parler de sa vie personnelle.

---

## Décisions clés

| Décision | Choix | Raison |
|---|---|---|
| Format | Questions + réponses modèles | L'OCPM attend des développements oraux, pas des QCM |
| Modes | Lecture + Entraînement (toggle) | Mode C choisi — les deux |
| Suivi | Bouton "✓ Maîtrisée" par question | Motivation visible, YAGNI vs éditabilité |
| Stockage mastery | `nq_mastery` en localStorage | Cohérent avec le reste de l'app |
| Données | `src/data/entretien.json` | Séparation claire contenu/code |
| Accès | Bouton 3e sur HomeScreen | Pas de nouvelle route complexe |

---

## Fichiers

| Action | Fichier | Changement |
|---|---|---|
| CRÉER | `src/data/entretien.json` | 28 questions en 7 catégories avec réponses modèles |
| CRÉER | `src/components/EntretienScreen.tsx` | Écran principal (types `EntretienQuestion`/`EntretienCategory` déclarés inline dans ce fichier, pas dans `types.ts`) |
| MODIFIER | `src/types.ts` | `Screen` union : ajouter `'entretien'` (seul changement) |
| MODIFIER | `src/App.tsx` | Importer `EntretienScreen` ; ajouter état `'entretien'` dans `AnimatePresence` ; passer `onStartEntretien={() => setScreen('entretien')}` à `HomeScreen` |
| MODIFIER | `src/components/HomeScreen.tsx` | Ajouter prop `onStartEntretien: () => void` à l'interface `Props` ; ajouter bouton sous Aléatoire/Examen blanc |

**Fichiers inchangés :** `QuizScreen.tsx`, `ExamMode.tsx`, `ThemeGrid.tsx`, `ThemeStats.tsx`, `useSpacedRepetition.ts`, `questions.json`

---

## Schema entretien.json

```ts
// Types déclarés inline dans EntretienScreen.tsx (pas dans types.ts)
interface EntretienQuestion {
  id: string           // ex: "m1", "v2", "g3"
  question: string     // question posée à l'oral
  answer: string       // réponse modèle pour Marine (1-4 phrases, ton oral)
}

interface EntretienCategory {
  id: string
  label: string
  icon: string
  questions: EntretienQuestion[]
}

// entretien.json = EntretienCategory[]
```

## Props EntretienScreen

```tsx
interface Props {
  onBack: () => void
}

export function EntretienScreen({ onBack }: Props) { ... }
```

---

## UX EntretienScreen

```
┌──────────────────────────────────────┐
│ ← Entretien oral          12 / 28 ✓ │
├──────────────────────────────────────┤
│  [  Lecture  ] [  Entraînement  ]    │
├──────────────────────────────────────┤
│ 💭 Motivations                       │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Pourquoi souhaitez-vous obtenir  │ │
│ │ la nationalité suisse ?          │ │
│ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ │
│ │ [LECTURE]  Réponse visible       │ │
│ │ [ENTRAÎN.] [Voir la réponse ▼]   │ │
│ │                                  │ │
│ │              [ ✓ Maîtrisée ]     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ 🗳️ Votations récentes               │
│ ...                                  │
└──────────────────────────────────────┘
```

### Comportement des cartes

**Mode Lecture :**
- Question + réponse toujours visibles
- Bouton "✓ Maîtrisée" toujours visible
- Questions maîtrisées : fond `bg-green-50`, bordure `border-green-200`, texte "✓ Maîtrisée" en vert

**Mode Entraînement :**
- Question visible
- Réponse masquée par défaut → bouton `"Voir la réponse ▼"` (slate-600)
- Après tap : réponse révélée + bouton "✓ Maîtrisée" apparaît
- L'état "réponse révélée" est local (`useState` par carte), non persisté
- Changer le toggle de mode (Lecture ↔ Entraînement) remet toutes les réponses à l'état masqué (reset via `key={mode}` sur le composant de liste)

### Layout scroll
Page unique scrollable, pas de sticky headers, pas d'accordéon. Les catégories sont séparées par un titre de section (`text-sm font-bold text-slate-400 uppercase tracking-wider`). 28 questions au total.

### Compteur mastery
```tsx
const totalCount = categories.flatMap(c => c.questions).length  // 28
const masteredCount = Object.values(mastery).filter(Boolean).length
```
Le toggle mode n'est pas persisté en localStorage — il revient à `'lecture'` à chaque navigation vers l'écran.

### Header

```tsx
<header>
  <button onClick={onBack}><ArrowLeft /></button>
  <h1>Entretien oral</h1>
  <span>{masteredCount} / {totalCount} ✓</span>
</header>
```

### Toggle mode

```tsx
// Deux boutons côte à côte, style pill
// Actif : bg-slate-800 text-white
// Inactif : bg-slate-100 text-slate-500
type Mode = 'lecture' | 'entrainement'
```

### Bouton HomeScreen

```tsx
// Mic importé depuis lucide-react (déjà utilisé dans le projet)
import { Shuffle, ClipboardList, RotateCcw, Mic } from 'lucide-react'

<button onClick={onStartEntretien}
  className="w-full bg-slate-600 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg">
  <Mic size={18} />
  Entretien oral
</button>
```

---

## Contenu entretien.json — 28 questions

### Catégorie 1 : Motivations (💭, 3 questions)

**m1** — Pourquoi souhaitez-vous obtenir la nationalité suisse ?
*Réponse :* « Je vis en Suisse depuis plusieurs années et je me sens pleinement intégrée dans ce pays. Je participe à la vie locale à Troinex, je respecte les valeurs suisses de démocratie directe, de neutralité et de diversité. Obtenir la nationalité suisse serait pour moi la reconnaissance officielle d'un ancrage profond et sincère dans ce pays que je considère comme le mien. »

**m2** — Qu'est-ce que la nationalité suisse représente pour vous ?
*Réponse :* « La nationalité suisse représente le droit de voter et de participer directement aux décisions qui concernent ma vie quotidienne — les votations, les élections. C'est aussi une appartenance à une société multiculturelle et stable, fondée sur le consensus et la subsidiarité. »

**m3** — Comment vous êtes-vous intégrée dans la vie locale à Troinex ?
*Réponse :* « Je vis à Troinex, une commune à caractère rural que j'apprécie pour son cadre de vie préservé. Je suis les actualités locales et cantonales, je participe aux événements genevois comme l'Escalade ou le Jeûne genevois, et je m'informe régulièrement via la RTS et la Tribune de Genève. »

---

### Catégorie 2 : Votations récentes (🗳️, 6 questions)

**v1** — Citez une votation fédérale récente et développez.
*Réponse :* « En mars 2024, les Suisses ont accepté l'initiative pour une 13e rente AVS. C'est une décision historique : pour la première fois, une initiative de gauche sur les retraites a été acceptée. Elle prévoit une rente supplémentaire chaque année, représentant 8,3% de la rente annuelle. Les partisans arguaient que le pouvoir d'achat des retraités avait été érodé par l'inflation ; les opposants craignaient un coût trop élevé pour les employeurs et l'AVS. »

**v2** — Citez une deuxième votation récente et développez.
*Réponse :* « En septembre 2024, les Suisses ont rejeté l'initiative pour la biodiversité, qui demandait la protection de 30% du territoire suisse. Les partisans souhaitaient préserver la nature et les espèces menacées ; les opposants craignaient des restrictions trop fortes pour l'agriculture et l'aménagement du territoire. Le résultat reflète la difficulté de concilier protection de l'environnement et intérêts économiques. »

**v3** — Qu'est-ce que la réforme AVS 21 ?
*Réponse :* « La réforme AVS 21, acceptée en septembre 2022, a aligné l'âge de la retraite des femmes à 65 ans, comme les hommes. En contrepartie, les femmes proches de la retraite ont bénéficié de compensations. Cette réforme a été très disputée : les syndicats y voyaient une injustice, le gouvernement une nécessité pour équilibrer les finances de l'AVS. Elle est entrée en vigueur progressivement dès 2024. »

**v4** — Qu'est-ce que la réforme LPP (2e pilier) ?
*Réponse :* « La réforme du 2e pilier (LPP) a été soumise aux Suisses en 2024. Elle visait à améliorer la prévoyance des travailleurs à temps partiel, notamment les femmes. Elle a été rejetée de justesse, car certains estimaient qu'elle augmentait les cotisations sans suffisamment améliorer les rentes. Le débat a mis en lumière les inégalités dans le système de retraite suisse. »

**v5** — Qu'est-ce que l'accord Suisse-UE (Bilatérales III) ?
*Réponse :* « Après l'abandon de l'accord-cadre en 2021, la Suisse et l'UE ont engagé de nouvelles négociations appelées Bilatérales III. L'objectif est de consolider et actualiser les accords bilatéraux existants — notamment sur la libre circulation, les transports et l'énergie — tout en acceptant une reprise dynamique du droit européen. Ce dossier est crucial pour les relations économiques de la Suisse avec son principal partenaire commercial. »

**v6** — Comment fonctionne la démocratie directe en Suisse ?
*Réponse :* « En Suisse, les citoyens peuvent voter sur des lois et des révisions constitutionnelles plusieurs fois par an. L'initiative populaire permet à 100 000 citoyens de proposer une modification de la Constitution. Le référendum facultatif permet à 50 000 citoyens de contester une loi du Parlement. C'est ce qui distingue fondamentalement la Suisse des autres démocraties : le peuple a le dernier mot. »

---

### Catégorie 3 : Gouvernements (🏛️, 6 questions)

**g1** — Nommez les membres du Conseil fédéral et leurs partis.
*Réponse :* « Le Conseil fédéral compte 7 membres. En 2026 : Karin Keller-Sutter (PLR, présidente 2026), Ignazio Cassis (PLR), Beat Jans (PS), Elisabeth Baume-Schneider (PS), Guy Parmelin (UDC), Albert Rösti (UDC), et le 7e siège du Centre (à vérifier sur admin.ch — Viola Amherd a démissionné fin 2025, son successeur Centre est à confirmer). Ils gouvernent collégialement — aucun n'a de pouvoir supérieur aux autres. »

⚠️ **À vérifier avant déploiement** : nom exact du 7e conseiller fédéral (Centre) sur admin.ch/conseil-federal

**g2** — Qui est la présidente de la Confédération en 2026 ?
*Réponse :* « La présidente de la Confédération en 2026 est Karin Keller-Sutter, du Parti Libéral-Radical. Elle dirige le Département fédéral des finances. La présidence de la Confédération est tournante : chaque conseiller fédéral devient président pour un an. »

**g3** — Nommez les membres du Conseil d'État genevois.
*Réponse :* « Le Conseil d'État genevois compte 7 membres élus pour 5 ans. Il est composé de conseillers d'État issus de plusieurs partis : PS, PLR, Verts, MCG et indépendants. Il est dirigé par un président tournant élu annuellement par ses pairs. Les 7 membres se partagent les départements cantonaux (finances, sécurité, instruction publique, etc.). »

**g4** — Qui dirige la commune de Troinex ?
*Réponse :* « Troinex est dirigée par un Conseil administratif ou un maire élu par les citoyens de la commune. La commune de Troinex est une petite commune résidentielle d'environ 2 500 habitants, dont l'exécutif communal gère les affaires locales : routes, espaces verts, vie associative et administration de proximité. »

**g5** — Quelle est la différence entre le Conseil fédéral et le Parlement fédéral ?
*Réponse :* « Le Parlement fédéral (Assemblée fédérale) est le pouvoir législatif : il vote les lois. Il est composé de deux chambres — le Conseil national (200 membres, représentant le peuple) et le Conseil des États (46 membres, représentant les cantons). Le Conseil fédéral est le pouvoir exécutif : il gouverne et met en œuvre les lois. C'est la séparation des pouvoirs. »

**g6** — Comment est élu le Conseil fédéral ?
*Réponse :* « Le Conseil fédéral est élu par l'Assemblée fédérale réunie en séance plénière — c'est-à-dire les 246 parlementaires des deux chambres réunis. Le peuple n'élit pas directement les conseillers fédéraux. La composition reflète la "formule magique" : une répartition entre les principaux partis selon leur force électorale. »

---

### Catégorie 4 : Partis politiques (🗂️, 3 questions)

**p1** — Citez les principaux partis politiques suisses et leur orientation.
*Réponse :* « Les quatre principaux partis fédéraux sont l'UDC (droite nationaliste, premier parti de Suisse), le PS (gauche sociale-démocrate), le PLR (droite libérale), et Le Centre (droite modérée, ex-PDC). Les Verts (gauche écologiste) et les Vert'libéraux (centre écologiste) sont aussi importants. À Genève, le MCG (Mouvement Citoyens Genevois) est un parti régionaliste spécifique au canton. »

**p2** — Quel est le parti le plus fort en Suisse ?
*Réponse :* « L'UDC (Union Démocratique du Centre) est le premier parti de Suisse avec environ 28% des voix aux élections fédérales de 2023. Il défend des positions conservatrices, souverainistes et restrictives sur l'immigration. Sa force explique qu'il dispose de 2 sièges au Conseil fédéral dans la "formule magique". »

**p3** — Qu'est-ce que la concordance en Suisse ?
*Réponse :* « La concordance est le principe selon lequel les principaux partis politiques sont représentés au gouvernement proportionnellement à leur force électorale — c'est la "formule magique". Cela favorise le consensus et évite les blocages. C'est une spécificité suisse : le gouvernement n'est pas formé d'une coalition majoritaire comme dans les autres démocraties. »

---

### Catégorie 5 : Droits & devoirs (⚖️, 4 questions)

**d1** — Quels droits obtiendrez-vous avec la nationalité suisse ?
*Réponse :* « En tant que Suissesse, j'aurai le droit de vote et d'éligibilité aux niveaux fédéral, cantonal et communal. Je pourrai signer des initiatives populaires et des référendums. J'aurai également droit à un passeport suisse, à la protection consulaire à l'étranger, et je n'aurai plus besoin de permis de séjour pour vivre en Suisse. »

**d2** — Quels devoirs aurez-vous en tant que citoyenne suisse ?
*Réponse :* « Le devoir civique principal est de voter — bien que le vote ne soit pas obligatoire en Suisse, il est fortement encouragé. Je devrai aussi respecter les lois fédérales, cantonales et communales, payer mes impôts et m'acquitter de mes obligations légales. En tant que femme, je ne suis pas soumise au service militaire obligatoire, mais je peux y servir volontairement. »

**d3** — Comment fonctionne le système de retraite suisse ?
*Réponse :* « Le système suisse de retraite repose sur trois piliers. Le premier pilier est l'AVS (rente de base pour tous, financée par les cotisations). Le deuxième pilier est la LPP (prévoyance professionnelle obligatoire pour les salariés). Le troisième pilier est l'épargne volontaire privée (3a ou 3b), avantageuse fiscalement. Ces trois piliers combinés visent à maintenir environ 60% du dernier salaire à la retraite. »

**d4** — Qu'est-ce que la LAMal ?
*Réponse :* « La LAMal est la Loi sur l'assurance-maladie obligatoire. Toute personne résidant en Suisse doit s'affilier à une caisse maladie dans les 3 mois suivant son arrivée. Elle couvre les soins de base avec une franchise annuelle (minimum 300 CHF) et une quote-part de 10%. Les primes varient selon la caisse choisie, la franchise et le canton. À Genève, les primes sont parmi les plus élevées de Suisse. »

---

### Catégorie 6 : Thèmes sociétaux genevois (🏙️, 3 questions)

**s1** — Quels sont les grands défis du canton de Genève aujourd'hui ?
*Réponse :* « Genève fait face à plusieurs défis majeurs : la crise du logement (les loyers sont très élevés et les appartements rares), la pression sur les transports publics avec la croissance de l'agglomération transfrontalière du Grand Genève, et les enjeux environnementaux comme la qualité de l'air et la préservation des espaces verts dans un canton très densifié. »

**s2** — Que pensez-vous de la situation du logement à Genève ?
*Réponse :* « La pénurie de logements est un problème structurel à Genève depuis plusieurs décennies. Le taux de vacance est très bas — moins de 1% — ce qui maintient les loyers parmi les plus élevés de Suisse. Des projets de construction sont en cours, notamment dans les communes périurbaines comme Troinex, mais la tension entre urbanisation et préservation du caractère rural est un enjeu récurrent. »

**s3** — Parlez-moi de la question de l'intégration et de l'immigration à Genève.
*Réponse :* « Genève est une ville très internationale : plus de 40% de sa population est étrangère. L'intégration est un sujet central : le canton investit dans les cours de français, l'accueil des nouveaux arrivants et la cohésion sociale. Des tensions existent autour de l'accueil des requérants d'asile et de la politique migratoire fédérale. Ma propre démarche de naturalisation s'inscrit dans cette volonté de m'intégrer pleinement. »

---

### Catégorie 7 : Vie locale & culture (🎭, 3 questions)

**c1** — À quelles fêtes et manifestations participez-vous à Genève ?
*Réponse :* « Je participe aux grandes fêtes genevoises : l'Escalade en décembre, qui commémore la résistance genevoise de 1602 avec ses marmites en chocolat et ses défilés costumés. Le Jeûne genevois en septembre est un jour de recueillement et de réflexion unique à Genève. Je suis aussi les événements culturels locaux et je m'informe régulièrement via la RTS et la Tribune de Genève. »

**c2** — Quels cantons suisses avez-vous visités ?
*Réponse :* « J'ai visité plusieurs cantons suisses. Vaud pour Lausanne et les bords du lac Léman. Le Valais pour les stations de ski et les Alpes. Fribourg et sa vieille ville médiévale. Berne, la capitale fédérale, avec le Palais fédéral. Ces voyages m'ont permis de découvrir la diversité linguistique et culturelle de la Suisse, de la Romandie à la Suisse alémanique. »

**c3** — Quels médias suivez-vous pour vous informer sur l'actualité suisse ?
*Réponse :* « Je suis l'actualité suisse principalement via la RTS (Radio Télévision Suisse) — le journal télévisé et le site rts.ch. Je lis aussi la Tribune de Genève pour l'actualité locale genevoise et troinexoise. Je consulte ch.ch pour les informations officielles sur les votations et les droits civiques. Ces sources me permettent de rester informée des enjeux locaux et nationaux. »

---

## Types TypeScript

```ts
// Ajouter dans src/types.ts
export type Screen = 'home' | 'quiz' | 'exam' | 'entretien'
```

---

## Mastery localStorage

```ts
const MASTERY_KEY = 'nq_mastery'
// Format : Record<string, boolean>
// { "m1": true, "v2": false, ... }
```

Géré localement dans `EntretienScreen` (useState + localStorage direct) — pas dans le hook spaced repetition.

---

## Risques

| Point | Action |
|---|---|
| **7e conseiller fédéral (Centre)** | ⚠️ Vérifier nom sur admin.ch/conseil-federal avant déploiement — Viola Amherd démissionnée fin 2025, successeur inconnu |
| Membres Conseil d'État GE | Vérifier composition exacte 2025-2026 sur ge.ch |
| Maire/exécutif Troinex | Vérifier nom exact sur troinex.ch |
| Votations post-août 2025 | Thomas à compléter avec votations nov 2025 + mars 2026 (ajouter en `v7`, `v8`… dans entretien.json) |
| Réponses personnelles (motivations, cantons) | Marine devra adapter à sa situation personnelle |
