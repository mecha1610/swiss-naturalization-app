# Enrichissement & Mode Expert — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 55 questions (10 Troinex + 45 expert) and a two-section HomeScreen (Révision / Approfondissement) with 3 new expert themes.

**Architecture:** Minimal changes — `types.ts` gains 3 new theme slugs + `expert` flag; `ThemeGrid` and `ThemeStats` gain a `themes` prop replacing the hard-coded `THEMES` import; `HomeScreen` passes filtered theme subsets to each section. No routing, hook, or QuizScreen changes.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, Vite.

**Spec:** `docs/superpowers/specs/2026-03-23-enrichissement-expert-design.md`

---

## File Map

| Action | Path | Change |
|---|---|---|
| MODIFY | `src/types.ts` | +3 theme slugs, `expert?: true` flag, update `troinex` total 10→20 |
| MODIFY | `src/data/questions.json` | +55 questions (IDs 87–141) |
| MODIFY | `src/components/ThemeGrid.tsx` | Add `themes` prop, replace `THEMES.map` with `themes.map` |
| MODIFY | `src/components/ThemeStats.tsx` | Add `themes` prop, replace `THEMES.map` with `themes.map` |
| MODIFY | `src/components/HomeScreen.tsx` | Two sections: Révision (6 thèmes) + Approfondissement (3 thèmes) |

---

## Task 1: Update types.ts

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Replace `src/types.ts` entirely**

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

export interface Question {
  id: number
  theme: Theme
  difficulty: 1 | 2 | 3
  choices: 3 | 4
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type Screen = 'home' | 'quiz' | 'exam'

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

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1 | head -20
```

Expected: only errors about missing `vie_pratique`/`actualite`/`culture` in questions.json (not yet added) — those are acceptable at this stage. No errors in `types.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add vie_pratique, actualite, culture themes with expert flag"
```

---

## Task 2: Add 55 questions to questions.json

**Files:**
- Modify: `src/data/questions.json`

Append the following 55 questions after the last existing entry (id 86). The JSON array must remain valid — add a comma after the last existing entry before appending.

- [ ] **Step 1: Append Troinex supplementary questions (IDs 87–96)**

```json
,
  {
    "id": 87,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 3,
    "question": "Quelles communes genevoises sont directement voisines de Troinex ?",
    "options": ["Carouge et Plan-les-Ouates", "Veyrier et Bardonnex", "Onex et Lancy"],
    "correct": 1,
    "explanation": "Troinex est bordée au nord et à l'est par Veyrier, et à l'ouest par Bardonnex. Au sud, elle est limitrophe de la commune française de Saint-Julien-en-Genevois."
  },
  {
    "id": 88,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 3,
    "question": "Quelle est la superficie approximative de la commune de Troinex ?",
    "options": ["Environ 1 km²", "Environ 4,6 km²", "Environ 15 km²"],
    "correct": 1,
    "explanation": "Troinex s'étend sur environ 4,6 km², ce qui en fait une petite commune à dominante rurale et résidentielle du canton de Genève."
  },
  {
    "id": 89,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel office cantonal gère l'annonce d'arrivée des nouveaux résidents à Troinex comme dans toutes les communes genevoises ?",
    "options": ["La mairie de Troinex", "L'OCPM (Office cantonal de la population et des migrations)", "La police municipale", "Le registre du commerce"],
    "correct": 1,
    "explanation": "Tout nouveau résident doit s'annoncer auprès de l'OCPM dans les 8 jours suivant son arrivée dans le canton de Genève, y compris à Troinex. L'OCPM gère les permis de séjour et l'annonce de domicile."
  },
  {
    "id": 90,
    "theme": "troinex",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la principale activité économique historique de Troinex ?",
    "options": ["L'industrie horlogère", "L'agriculture (arboriculture, maraîchage)", "Le commerce frontalier", "La finance"],
    "correct": 1,
    "explanation": "Troinex a longtemps été une commune agricole avec des vergers et du maraîchage. Son caractère rural préservé reste un trait distinctif de la commune aujourd'hui."
  },
  {
    "id": 91,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel organisme fournit l'électricité, le gaz et l'eau aux habitants de Troinex ?",
    "options": ["EDF", "Les SIG (Services Industriels de Genève)", "La commune elle-même", "Romande Energie"],
    "correct": 1,
    "explanation": "Les SIG fournissent l'électricité, le gaz, l'eau et la chaleur à distance à l'ensemble du canton de Genève, y compris à Troinex. Ils appartiennent au canton et aux communes genevoises."
  },
  {
    "id": 92,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le délai légal pour s'annoncer à l'administration après un déménagement à Troinex ?",
    "options": ["24 heures", "8 jours", "1 mois", "3 mois"],
    "correct": 1,
    "explanation": "En Suisse, tout changement de domicile doit être déclaré à l'administration dans les 8 jours. À Genève, cette démarche se fait auprès de l'OCPM, que l'on soit suisse ou étranger."
  },
  {
    "id": 93,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Pour les élections fédérales, dans quelle circonscription les habitants de Troinex votent-ils ?",
    "options": ["Arrondissement Arve-Lac", "Canton de Genève (circonscription unique)", "Arrondissement de Carouge", "District genevois sud"],
    "correct": 1,
    "explanation": "Pour les élections fédérales au Conseil national, chaque canton constitue une circonscription unique. Les habitants de Troinex votent donc dans la circonscription du canton de Genève."
  },
  {
    "id": 94,
    "theme": "troinex",
    "difficulty": 3,
    "choices": 4,
    "question": "Quels instruments de démocratie directe existent au niveau communal à Troinex ?",
    "options": ["Uniquement le vote du conseil municipal", "Le référendum communal et l'initiative communale", "Le référendum cantonal uniquement", "Aucun vote direct au niveau communal"],
    "correct": 1,
    "explanation": "Les communes genevoises disposent d'instruments de démocratie directe : les citoyens peuvent lancer un référendum ou une initiative communale pour contester ou proposer des décisions locales."
  },
  {
    "id": 95,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle institution gère les actes d'état civil (naissances, mariages) pour les habitants de Troinex ?",
    "options": ["La mairie de Troinex directement", "L'état civil cantonal genevois", "La paroisse locale", "Le Conseil d'État"],
    "correct": 1,
    "explanation": "En Suisse, l'état civil est géré au niveau cantonal. À Genève, c'est l'Office de l'état civil du canton qui enregistre les naissances, mariages et décès pour toutes les communes, y compris Troinex."
  },
  {
    "id": 96,
    "theme": "troinex",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est l'enjeu principal du développement de Troinex dans les prochaines années ?",
    "options": ["Construire un quartier d'affaires", "Préserver le caractère rural face à la pression démographique genevoise", "Développer une zone industrielle frontalière", "Fusionner avec Carouge"],
    "correct": 1,
    "explanation": "Comme beaucoup de communes périurbaines genevoises, Troinex fait face à la pression de l'urbanisation tout en souhaitant conserver ses espaces verts et son cadre de vie rural apprécié."
  }
```

- [ ] **Step 2: Append Vie pratique questions (IDs 97–111)**

```json
  ,
  {
    "id": 97,
    "theme": "vie_pratique",
    "difficulty": 1,
    "choices": 4,
    "question": "À quelle fréquence les résidents genevois doivent-ils remplir leur déclaration d'impôts ?",
    "options": ["Tous les 5 ans", "Chaque année", "Tous les 3 ans", "Uniquement lors d'un changement de situation"],
    "correct": 1,
    "explanation": "En Suisse, la déclaration d'impôts est annuelle. Elle doit être déposée chaque printemps pour l'année précédente. À Genève, le délai habituel est le 31 mars, avec possibilité de demander une prolongation."
  },
  {
    "id": 98,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que l'impôt à la source en Suisse ?",
    "options": ["Un impôt payé en espèces uniquement", "Un impôt prélevé directement sur le salaire des résidents étrangers sans permis C", "Une taxe sur les achats", "Un impôt sur les propriétés foncières"],
    "correct": 1,
    "explanation": "L'impôt à la source est prélevé directement sur le salaire par l'employeur pour les résidents étrangers sans permis C. Depuis 2021, une rectification annuelle est possible via le formulaire de remboursement ou d'imposition ordinaire ultérieure."
  },
  {
    "id": 99,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "À quel âge un enfant commence-t-il l'école à Genève depuis la réforme HarmoS ?",
    "options": ["3 ans", "4 ans", "5 ans", "6 ans"],
    "correct": 1,
    "explanation": "Depuis la réforme HarmoS, le Cycle 1 commence à 4 ans à Genève (école enfantine intégrée). L'école est obligatoire dès 4 ans, ce qui est plus tôt que dans beaucoup d'autres cantons."
  },
  {
    "id": 100,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la structure de l'école obligatoire à Genève ?",
    "options": ["Primaire (6-12 ans), Collège (12-16 ans)", "Cycle 1 (4-8 ans), Cycle 2 (8-12 ans), Cycle d'orientation (12-15 ans)", "École enfantine (3-6 ans), Primaire (6-12 ans), Secondaire", "Jardin d'enfants, Primaire 6 ans, Secondaire"],
    "correct": 1,
    "explanation": "À Genève (HarmoS) : Cycle 1 de 4 à 8 ans, Cycle 2 de 8 à 12 ans, puis le Cycle d'orientation (CO) de 12 à 15 ans. Après le CO, les élèves rejoignent le lycée, l'école de commerce ou la formation professionnelle."
  },
  {
    "id": 101,
    "theme": "vie_pratique",
    "difficulty": 1,
    "choices": 4,
    "question": "Que sont les HUG ?",
    "options": ["Les Hôtels Unis Genevois", "Les Hôpitaux Universitaires de Genève", "Les Hautes Universités Genève", "Un réseau de cliniques privées"],
    "correct": 1,
    "explanation": "Les HUG (Hôpitaux Universitaires de Genève) sont le principal hôpital public du canton. Ils gèrent les urgences, la médecine spécialisée et la recherche. Pour les urgences, le numéro est le 144."
  },
  {
    "id": 102,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la franchise ordinaire minimale de l'assurance maladie LAMal pour un adulte ?",
    "options": ["0 CHF", "300 CHF par an", "1000 CHF par an", "2500 CHF par an"],
    "correct": 1,
    "explanation": "La franchise ordinaire de base LAMal est de 300 CHF par an pour les adultes. Au-delà, une participation de 10% (quote-part) s'applique jusqu'à 700 CHF. Des franchises plus élevées permettent de réduire la prime mensuelle."
  },
  {
    "id": 103,
    "theme": "vie_pratique",
    "difficulty": 1,
    "choices": 4,
    "question": "Que signifie TPG dans le contexte des transports genevois ?",
    "options": ["Transit Postal Genevois", "Transports Publics Genevois", "Taxis et Prestataires Genevois", "Train Périurbain Genevois"],
    "correct": 1,
    "explanation": "Les TPG (Transports Publics Genevois) exploitent les bus, trams et quelques lignes nocturnes du canton. Ils font partie du réseau Léman Pass (anciennement Unireso) qui intègre aussi les CFF et les cars postaux dans la région."
  },
  {
    "id": 104,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel titre de transport intégré couvre les TPG, CFF et cars postaux dans la région genevoise ?",
    "options": ["Interrail", "Le Léman Pass", "SwissPass uniquement", "Metrocom"],
    "correct": 1,
    "explanation": "Le Léman Pass (anciennement Unireso) est le réseau tarifaire intégré qui permet d'utiliser les TPG, les CFF, les cars postaux et d'autres opérateurs avec un seul titre de transport dans les zones définies autour de Genève."
  },
  {
    "id": 105,
    "theme": "vie_pratique",
    "difficulty": 1,
    "choices": 4,
    "question": "Que sont les SIG dans le canton de Genève ?",
    "options": ["Les Sociétés d'Investissement Genevois", "Les Services Industriels de Genève (électricité, gaz, eau, chaleur)", "Les Services d'Intégration Genevois", "Un réseau de téléphonie mobile cantonal"],
    "correct": 1,
    "explanation": "Les SIG (Services Industriels de Genève) sont une entreprise publique qui fournit l'électricité, le gaz naturel, l'eau potable et la chaleur à distance (CAD) à l'ensemble du canton de Genève."
  },
  {
    "id": 106,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "À Genève, quel sac doit-on utiliser pour les ordures ménagères ordinaires ?",
    "options": ["N'importe quel sac plastique", "Le sac-taxe officiel payant", "Un sac biodégradable uniquement", "Les déchets doivent être déposés en vrac"],
    "correct": 1,
    "explanation": "À Genève, les ordures ménagères non recyclables doivent être déposées dans des sacs-taxe officiels payants. Cette taxe au sac encourage la réduction des déchets et le tri sélectif (verre, papier, PET, aluminium)."
  },
  {
    "id": 107,
    "theme": "vie_pratique",
    "difficulty": 1,
    "choices": 4,
    "question": "Où déposer les déchets encombrants (meubles, électroménager) à Genève ?",
    "options": ["Dans les poubelles ordinaires", "Dans les déchetteries communales ou cantonales (points de collecte)", "Dans la rue les jours de collecte spéciale uniquement", "Uniquement par prestataire privé payant"],
    "correct": 1,
    "explanation": "Les déchets encombrants se déposent gratuitement dans les déchetteries genevoises (Cheneviers, Châtelaine, etc.). Certaines communes organisent aussi des collectes spéciales à domicile sur demande."
  },
  {
    "id": 108,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel délai ont les résidents pour s'inscrire auprès de l'OCPM après leur arrivée à Genève ?",
    "options": ["24 heures", "8 jours", "30 jours", "3 mois"],
    "correct": 1,
    "explanation": "Tout nouveau résident — suisse ou étranger — doit s'annoncer à l'OCPM (Office cantonal de la population et des migrations) dans les 8 jours suivant son arrivée dans le canton de Genève."
  },
  {
    "id": 109,
    "theme": "vie_pratique",
    "difficulty": 3,
    "choices": 4,
    "question": "Comment un résident étranger titulaire d'un permis UE peut-il convertir son permis de conduire en permis suisse ?",
    "options": ["En passant obligatoirement l'examen pratique suisse", "En s'adressant à l'OCV dans les 12 mois — échange direct sans examen pour les permis UE", "Automatiquement après 1 an de résidence sans démarche", "En déposant une demande à la police cantonale"],
    "correct": 1,
    "explanation": "Les titulaires d'un permis de conduire UE/AELE peuvent l'échanger contre un permis suisse auprès de l'Office cantonal des véhicules (OCV) sans repasser l'examen, à condition de le faire dans les 12 mois suivant l'établissement."
  },
  {
    "id": 110,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "À quoi sert le numéro AVS à 13 chiffres en Suisse ?",
    "options": ["C'est le numéro de compte bancaire obligatoire", "C'est le numéro d'assurance sociale utilisé pour l'AVS, la LAMal, les impôts et les démarches administratives", "C'est le code de sécurité pour les paiements en ligne", "C'est le numéro d'identification du permis de séjour"],
    "correct": 1,
    "explanation": "Le numéro AVS (NAVS13) est l'identifiant unique de chaque personne en Suisse. Il est utilisé pour les assurances sociales (AVS, AI, APG), la caisse maladie LAMal, les impôts et de nombreuses démarches administratives."
  },
  {
    "id": 111,
    "theme": "vie_pratique",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle est la principale différence entre un permis de séjour B et un permis C en Suisse ?",
    "options": ["Le B est pour les frontaliers, le C pour les résidents", "Le B est temporaire et renouvelable, le C est l'établissement permanent", "Le B permet de voter, le C non", "Il n'y a pas de différence pratique entre les deux"],
    "correct": 1,
    "explanation": "Le permis B (séjour) est temporaire et doit être renouvelé (en général annuellement ou tous les 5 ans). Le permis C (établissement) est permanent et confère des droits quasi équivalents aux citoyens suisses, dont l'accès facilité à la naturalisation."
  }
```

- [ ] **Step 3: Append Actualité suisse questions (IDs 112–126)**

```json
  ,
  {
    "id": 112,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel parti politique a obtenu le plus de sièges au Conseil national lors des élections fédérales d'octobre 2023 ?",
    "options": ["Le PS (Parti Socialiste)", "L'UDC (Union Démocratique du Centre)", "Le Centre", "Le PLR (Parti Libéral-Radical)"],
    "correct": 1,
    "explanation": "L'UDC est resté le premier parti de Suisse avec environ 28% des voix aux élections fédérales de 2023, renforçant sa position au Conseil national. Les partis verts ont en revanche reculé par rapport à leur percée de 2019."
  },
  {
    "id": 113,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle réforme a modifié l'âge de la retraite des femmes en Suisse, approuvée en votation en septembre 2022 ?",
    "options": ["La réforme LPP 2023", "La réforme AVS 21", "La réforme AI 2024", "L'initiative pour une 13e rente AVS"],
    "correct": 1,
    "explanation": "La réforme AVS 21, acceptée de justesse en septembre 2022, a aligné l'âge de la retraite des femmes à 65 ans (comme les hommes). Elle est entrée en vigueur progressivement dès 2024."
  },
  {
    "id": 114,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année l'initiative populaire pour une 13e rente AVS a-t-elle été acceptée en votation populaire ?",
    "options": ["2022", "2023", "2024", "2025"],
    "correct": 2,
    "explanation": "L'initiative pour une 13e rente AVS a été acceptée en mars 2024 par le peuple suisse, une première historique pour une initiative de gauche portant sur les rentes. Elle prévoit une rente supplémentaire chaque année, représentant 8,3% de la rente annuelle."
  },
  {
    "id": 115,
    "theme": "actualite",
    "difficulty": 3,
    "choices": 4,
    "question": "Sous quel nom sont menées les négociations entre la Suisse et l'UE depuis 2024 pour remplacer l'accord-cadre abandonné ?",
    "options": ["Accord de libre-échange élargi", "Approche bilatérale III", "Traité de Schengen II", "Accord-cadre institutionnel renégocié"],
    "correct": 1,
    "explanation": "Après l'abandon de l'accord-cadre en 2021, la Suisse et l'UE ont repris les négociations sous la forme d'une 'approche par paquet' (Bilatérales III), visant à actualiser et consolider les accords bilatéraux existants."
  },
  {
    "id": 116,
    "theme": "actualite",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la position officielle de la Suisse vis-à-vis de l'Union européenne ?",
    "options": ["La Suisse est membre de l'UE depuis 2002", "La Suisse a choisi la voie bilatérale — elle n'est pas membre de l'UE", "La Suisse a soumis une demande d'adhésion en 2020", "La Suisse fait partie de l'UE via l'EEE"],
    "correct": 1,
    "explanation": "La Suisse n'est pas membre de l'Union européenne. Elle a rejeté l'adhésion à l'EEE en 1992 et a choisi la voie des accords bilatéraux (Bilatérales I en 1999, Bilatérales II en 2004) pour régler ses relations avec l'UE."
  },
  {
    "id": 117,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le rôle principal de la Banque Nationale Suisse (BNS) ?",
    "options": ["Gérer les comptes bancaires des citoyens suisses", "Conduire la politique monétaire et garantir la stabilité des prix pour la Suisse", "Financer le budget fédéral", "Superviser les banques commerciales uniquement"],
    "correct": 1,
    "explanation": "La BNS est la banque centrale indépendante de la Suisse. Elle fixe le taux directeur, gère les réserves de change et a pour mandat principal d'assurer la stabilité des prix (lutte contre l'inflation et la déflation)."
  },
  {
    "id": 118,
    "theme": "actualite",
    "difficulty": 3,
    "choices": 4,
    "question": "Quelle initiative populaire sur l'environnement a été rejetée en votation en septembre 2024 ?",
    "options": ["L'initiative pour l'eau propre", "L'initiative pour la biodiversité", "L'initiative contre les pesticides", "L'initiative pour une agriculture durable"],
    "correct": 1,
    "explanation": "L'initiative pour la biodiversité, qui demandait la protection de 30% du territoire suisse et des ressources accrues pour la biodiversité, a été rejetée par le peuple suisse en septembre 2024."
  },
  {
    "id": 119,
    "theme": "actualite",
    "difficulty": 3,
    "choices": 4,
    "question": "Quelle est la composition partisane du Conseil fédéral depuis les élections de 2023 ?",
    "options": ["2 PS + 2 PLR + 2 UDC + 1 Centre", "3 UDC + 2 PS + 2 PLR", "2 PS + 2 PLR + 1 UDC + 2 Verts", "2 PS + 2 Centre + 2 PLR + 1 UDC"],
    "correct": 0,
    "explanation": "Depuis fin 2023, le Conseil fédéral est composé de : 2 PS (Beat Jans, Elisabeth Baume-Schneider), 2 PLR (Karin Keller-Sutter, Ignazio Cassis), 2 UDC (Guy Parmelin, Albert Rösti) et 1 Centre (Viola Amherd)."
  },
  {
    "id": 120,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel a été le résultat des élections fédérales 2023 pour les partis verts suisses ?",
    "options": ["Les Verts ont gagné 20 nouveaux sièges", "Les Verts ont perdu des sièges — recul de la vague verte de 2019", "Les Verts sont devenus le premier parti au Conseil national", "Les Verts ont fusionné avec le PS"],
    "correct": 1,
    "explanation": "Après la vague verte de 2019, les élections fédérales de 2023 ont vu les partis verts (Verts + Vert'libéraux) perdre des sièges au Conseil national, tandis que l'UDC et le Centre progressaient."
  },
  {
    "id": 121,
    "theme": "actualite",
    "difficulty": 1,
    "choices": 4,
    "question": "Qu'est-ce que la 'Romandie' ?",
    "options": ["Le nom officiel du canton de Genève", "La partie francophone de la Suisse (Genève, Vaud, Neuchâtel, Jura, Fribourg romand, Valais romand)", "Une région culturelle de France voisine de la Suisse", "Un ancien nom du lac Léman"],
    "correct": 1,
    "explanation": "La Romandie désigne la partie francophone de la Suisse, regroupant les cantons et demi-cantons de Genève, Vaud, Neuchâtel, Jura, ainsi que les parties francophones de Fribourg (Fribourg romand) et du Valais."
  },
  {
    "id": 122,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel accord permet à la Suisse de participer à l'espace sans frontières intérieures européen Schengen ?",
    "options": ["Le traité de Maastricht", "L'accord d'association à Schengen/Dublin (Bilatérales II, 2004)", "L'accord de libre-échange de 1972", "Le traité de Rome"],
    "correct": 1,
    "explanation": "La Suisse a adhéré à l'espace Schengen en 2008 via l'accord d'association signé dans le cadre des Bilatérales II (2004). Cela supprime les contrôles aux frontières intérieures mais maintient des contrôles douaniers pour les marchandises."
  },
  {
    "id": 123,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le rôle du Tribunal fédéral dans le système suisse ?",
    "options": ["Il juge les membres du Conseil fédéral", "C'est la plus haute juridiction suisse, garant de l'application uniforme du droit fédéral", "C'est un tribunal international basé à Genève", "Il traite uniquement les affaires fiscales fédérales"],
    "correct": 1,
    "explanation": "Le Tribunal fédéral, siégeant à Lausanne, est la plus haute instance judiciaire de Suisse. Il garantit l'application uniforme du droit fédéral et peut être saisi en dernier ressort pour des questions de droit."
  },
  {
    "id": 124,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que la 'formule magique' dans la politique suisse ?",
    "options": ["Une procédure de vote secrète", "La répartition conventionnelle des sièges au Conseil fédéral entre les principaux partis", "Un calcul mathématique pour valider les initiatives populaires", "Le mode de scrutin pour les élections cantonales"],
    "correct": 1,
    "explanation": "La 'formule magique' désigne la répartition des 7 sièges du Conseil fédéral entre les principaux partis selon leur force électorale. Instaurée en 1959, elle a été révisée en 2003 avec l'entrée de l'UDC au détriment du PDC."
  },
  {
    "id": 125,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "En quelle année la Suisse a-t-elle accepté en votation l'ouverture du mariage civil pour les couples de même sexe ?",
    "options": ["2019", "2021", "2023", "2025"],
    "correct": 1,
    "explanation": "Le 26 septembre 2021, les Suisses ont approuvé en votation populaire le mariage pour tous (64% de oui). Le mariage civil entre personnes du même sexe est possible en Suisse depuis le 1er juillet 2022."
  },
  {
    "id": 126,
    "theme": "actualite",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le salaire médian mensuel brut approximatif en Suisse ?",
    "options": ["Environ 2 000-3 000 CHF", "Environ 4 000-5 000 CHF", "Environ 6 500 CHF", "Plus de 10 000 CHF"],
    "correct": 2,
    "explanation": "Le salaire médian en Suisse est d'environ 6 500 CHF brut par mois (source : OFS). Il varie selon le secteur d'activité, le niveau de formation et la région. Genève a l'un des salaires médians les plus élevés de Suisse."
  }
```

- [ ] **Step 4: Append Langue & culture questions (IDs 127–141)**

```json
  ,
  {
    "id": 127,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la date de la Fête nationale suisse ?",
    "options": ["14 juillet", "1er août", "1er septembre", "26 janvier"],
    "correct": 1,
    "explanation": "Le 1er août est la Fête nationale suisse, commémorant le Pacte fédéral de 1291. Elle est célébrée par des feux d'artifice, des discours et des feux de joie dans tout le pays."
  },
  {
    "id": 128,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Que commémore la Fête de l'Escalade célébrée à Genève chaque décembre ?",
    "options": ["La signature de la première Convention de Genève", "La résistance genevoise à l'attaque savoyarde de décembre 1602", "L'adhésion de Genève à la Confédération en 1815", "La naissance de Jean-Jacques Rousseau"],
    "correct": 1,
    "explanation": "L'Escalade commémore l'attaque du duc de Savoie contre Genève dans la nuit du 11 au 12 décembre 1602, repoussée par les Genevois. La tradition veut qu'on brise une marmite en chocolat remplie de légumes en sucre."
  },
  {
    "id": 129,
    "theme": "culture",
    "difficulty": 1,
    "choices": 3,
    "question": "Quel plat est le symbole par excellence de la gastronomie suisse romande et alpine ?",
    "options": ["Le rösti", "La fondue au fromage", "Le birchermüesli"],
    "correct": 1,
    "explanation": "La fondue au fromage est un plat emblématique de la Suisse romande et des régions alpines, à base de fromages fondus (gruyère, vacherin) dans un caquelon. Le rösti est plutôt associé à la Suisse alémanique."
  },
  {
    "id": 130,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel philosophe des Lumières, natif de Genève, a écrit 'Le Contrat social' et 'Émile' ?",
    "options": ["Voltaire", "Jean-Jacques Rousseau", "Denis Diderot", "Montesquieu"],
    "correct": 1,
    "explanation": "Jean-Jacques Rousseau (1712-1778) est né à Genève et est l'un des philosophes des Lumières les plus influents. Ses œuvres ont inspiré la Révolution française et les idées modernes de démocratie et d'éducation."
  },
  {
    "id": 131,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Qu'est-ce que le 'Röstigraben' ?",
    "options": ["Un plat traditionnel bernois", "La frontière culturelle et linguistique entre la Suisse alémanique et romande", "Un glacier des Alpes valaisannes", "Le nom du Rhin en romanche"],
    "correct": 1,
    "explanation": "Le 'Röstigraben' (littéralement 'fossé du rösti') désigne la frontière culturelle et linguistique qui sépare la Suisse alémanique de la Suisse romande. Il reflète des différences de mentalité, de vote et de culture populaire."
  },
  {
    "id": 132,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Quel est le principal musée des beaux-arts de Genève ?",
    "options": ["Le Louvre de Genève", "Le Musée d'Art et d'Histoire (MAH)", "Le Centre Pompidou Genève", "Le Kunsthaus"],
    "correct": 1,
    "explanation": "Le Musée d'Art et d'Histoire (MAH) de Genève est le plus grand musée des beaux-arts de Suisse romande. Il abrite des collections allant de l'Antiquité à l'art contemporain, ainsi qu'une section d'arts appliqués."
  },
  {
    "id": 133,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Que signifie observer le 'Jeûne genevois' ?",
    "options": ["Suivre un régime alimentaire strict pendant une semaine", "Observer le jour officiel de jeûne et de recueillement genevois (jeudi après le 1er dimanche de septembre)", "Participer à un festival gastronomique d'automne", "Faire abstinence pendant le carême"],
    "correct": 1,
    "explanation": "Le Jeûne genevois est un jour férié officiel unique au canton de Genève, qui tombe le jeudi après le premier dimanche de septembre. Héritage de la Réforme protestante, c'est un jour de recueillement, de réflexion et de charité."
  },
  {
    "id": 134,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel sport traditionnel suisse consiste en une lutte dans la sciure de bois ?",
    "options": ["Le hornuss", "Le Schwingen (lutte suisse)", "Le tir à la cible traditionnel", "Le curling"],
    "correct": 1,
    "explanation": "Le Schwingen est la lutte traditionnelle suisse, pratiquée dans une arène de sciure de bois. Les lutteurs (Schwinger) portent des culottes de toile spéciales. C'est l'un des sports nationaux, avec le hornuss et le jeu de drapeau."
  },
  {
    "id": 135,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle particularité a le drapeau national suisse par rapport aux autres drapeaux du monde ?",
    "options": ["Il est le seul drapeau tricolore d'Europe", "Il est l'un des deux seuls drapeaux carrés au monde (avec le Vatican)", "Il est le plus ancien drapeau du monde", "Il est le seul sans inscription ni emblème"],
    "correct": 1,
    "explanation": "Le drapeau suisse est l'un des deux seuls drapeaux carrés au monde, avec celui du Vatican. Il représente une croix blanche sur fond rouge. Cette forme carrée est une exception dans la vexillologie internationale."
  },
  {
    "id": 136,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle chaîne de télévision publique suisse diffuse en français ?",
    "options": ["TF1", "RTS (Radio Télévision Suisse)", "France 2", "RSI"],
    "correct": 1,
    "explanation": "RTS (Radio Télévision Suisse) est le service public de radio et télévision en langue française de la Suisse, dépendant de la SSR SRG. RSI diffuse en italien, SRF en allemand et RTR en romanche."
  },
  {
    "id": 137,
    "theme": "culture",
    "difficulty": 3,
    "choices": 4,
    "question": "Qu'est-ce que le 'Sechseläuten' à Zurich ?",
    "options": ["Une fête genevoise de vendanges", "La fête printanière zurichoise où on brûle le Böög pour prédire l'été", "Un festival de musique bernois", "Une cérémonie civique bâloise"],
    "correct": 1,
    "explanation": "Le Sechseläuten est la fête printanière traditionnelle de Zurich. Son moment fort est la combustion du Böög (bonhomme de neige en coton) : plus vite il explose, plus l'été sera beau selon la tradition."
  },
  {
    "id": 138,
    "theme": "culture",
    "difficulty": 1,
    "choices": 4,
    "question": "Quelle est la langue officielle du canton de Genève ?",
    "options": ["L'allemand et le français", "Le français uniquement", "Le français et l'anglais", "Le romanche et le français"],
    "correct": 1,
    "explanation": "Le français est la seule langue officielle du canton de Genève, conformément à la Constitution cantonale. Genève fait partie de la Romandie, la région francophone de la Suisse."
  },
  {
    "id": 139,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Quelle institution universitaire genevoise a été fondée par Jean Calvin en 1559 ?",
    "options": ["L'EPFL", "L'Université de Genève (UNIGE)", "L'Institut de Hautes Études Internationales (IHEID)", "Le Collège Calvin"],
    "correct": 1,
    "explanation": "L'Université de Genève (UNIGE) a été fondée par Jean Calvin en 1559 sous le nom d'Académie de Genève. C'est l'une des plus anciennes universités de Suisse, avec environ 17 000 étudiants aujourd'hui."
  },
  {
    "id": 140,
    "theme": "culture",
    "difficulty": 2,
    "choices": 4,
    "question": "Quel est le symbole héraldique principal du canton de Genève visible sur ses armoiries ?",
    "options": ["Un lion couronné", "Un aigle impérial et une clé", "Un ours", "Une croix fédérale"],
    "correct": 1,
    "explanation": "Les armoiries de Genève combinent un demi-aigle impérial et une clé de saint Pierre. Ces deux symboles reflètent l'histoire de Genève : ville d'Empire (Saint-Empire romain germanique) et siège d'un évêché (saint Pierre, patron de la cathédrale)."
  },
  {
    "id": 141,
    "theme": "culture",
    "difficulty": 1,
    "choices": 3,
    "question": "Quelle est la monnaie officielle de la Suisse ?",
    "options": ["L'euro", "Le franc suisse (CHF)", "La couronne suisse"],
    "correct": 1,
    "explanation": "La monnaie officielle de la Suisse est le franc suisse (CHF, code ISO 4217). La Suisse n'a pas adopté l'euro malgré ses relations étroites avec l'UE. Un franc suisse vaut 100 centimes (ou rappen en allemand)."
  }
```

- [ ] **Step 5: Verify the JSON is valid**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app
node -e "const q = require('./src/data/questions.json'); console.log('Total questions:', q.length)"
```

Expected: `Total questions: 141`

- [ ] **Step 6: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/questions.json
git commit -m "feat: add 55 questions — Troinex ×10, vie_pratique ×15, actualite ×15, culture ×15"
```

---

## Task 3: Update ThemeGrid — add `themes` prop

**Files:**
- Modify: `src/components/ThemeGrid.tsx`

- [ ] **Step 1: Replace `src/components/ThemeGrid.tsx` entirely**

```tsx
import { ScoreBar } from './ScoreBar'
import type { Theme, Question } from '../types'

type ThemeEntry = { id: Theme; label: string; icon: string; total: number; expert?: true }

interface Props {
  themes: ThemeEntry[]
  allQuestions: Question[]
  history: Record<number, { answered: number; correct: number }>
  onSelectTheme: (theme: Theme) => void
}

export function ThemeGrid({ themes, allQuestions, history, onSelectTheme }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {themes.map(theme => {
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

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1 | head -20
```

Expected: errors only in HomeScreen.tsx (not yet updated — it still passes no `themes` prop). No errors in ThemeGrid.tsx itself.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeGrid.tsx
git commit -m "feat: ThemeGrid accepts themes prop instead of importing THEMES globally"
```

---

## Task 4: Update ThemeStats — add `themes` prop

**Files:**
- Modify: `src/components/ThemeStats.tsx`

- [ ] **Step 1: Replace `src/components/ThemeStats.tsx` entirely**

```tsx
import type { Theme, Question } from '../types'

type ThemeEntry = { id: Theme; label: string; icon: string; total: number; expert?: true }

interface Props {
  themes: ThemeEntry[]
  allQuestions: Question[]
  history: Record<number, { answered: number; correct: number }>
}

export function ThemeStats({ themes, allQuestions, history }: Props) {
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
          {themes.map(theme => {
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

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1 | head -20
```

Expected: errors only in HomeScreen.tsx (not yet updated). No errors in ThemeStats.tsx itself.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeStats.tsx
git commit -m "feat: ThemeStats accepts themes prop instead of importing THEMES globally"
```

---

## Task 5: Update HomeScreen — two sections

**Files:**
- Modify: `src/components/HomeScreen.tsx`

- [ ] **Step 1: Replace `src/components/HomeScreen.tsx` entirely**

```tsx
import { Shuffle, ClipboardList, RotateCcw } from 'lucide-react'
import { ThemeGrid } from './ThemeGrid'
import { ThemeStats } from './ThemeStats'
import { THEMES } from '../types'
import type { Question, Theme } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

const baseThemes = THEMES.filter(t => !t.expert)
const expertThemes = THEMES.filter(t => t.expert)

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
          aria-label="Réinitialiser la progression"
        >
          <RotateCcw size={18} />
        </button>
      </header>

      <main className="flex-1 p-6 w-full max-w-2xl mx-auto space-y-8 pb-12">
        {/* 4 métriques globales */}
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

        {/* Section Révision */}
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Révision
          </p>
          <div className="space-y-4">
            <ThemeGrid
              themes={baseThemes}
              allQuestions={allQuestions}
              history={history}
              onSelectTheme={onStartTheme}
            />
            <ThemeStats
              themes={baseThemes}
              allQuestions={allQuestions}
              history={history}
            />
          </div>
        </div>

        {/* Section Approfondissement */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Approfondissement
            </p>
            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
              ✦ Expert
            </span>
          </div>
          <div className="space-y-4">
            <ThemeGrid
              themes={expertThemes}
              allQuestions={allQuestions}
              history={history}
              onSelectTheme={onStartTheme}
            />
            <ThemeStats
              themes={expertThemes}
              allQuestions={allQuestions}
              history={history}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Full TypeScript check — must be clean**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app && npx tsc --noEmit 2>&1
```

Expected: no errors at all.

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds, bundle ≥ 200KB.

- [ ] **Step 4: Commit**

```bash
git add src/components/HomeScreen.tsx
git commit -m "feat: HomeScreen two-section layout — Révision + Approfondissement Expert"
```

---

## Task 6: Build & Deploy Verification

- [ ] **Step 1: Verify question count and themes**

```bash
cd /Users/thomas/Documents/GitHub/swiss-naturalization-app
node -e "
const q = require('./src/data/questions.json');
const counts = q.reduce((acc, q) => { acc[q.theme] = (acc[q.theme]||0)+1; return acc; }, {});
console.log(counts);
console.log('Total:', q.length);
"
```

Expected:
```
{
  politique_ch: 18,
  geneve: 16,
  troinex: 20,
  histoire: 14,
  droits: 14,
  geographie: 14,
  vie_pratique: 15,
  actualite: 15,
  culture: 15
}
Total: 141
```

- [ ] **Step 2: Production build**

```bash
npm run build 2>&1 | tail -5
```

Expected: success.

- [ ] **Step 3: Push to GitHub (triggers Netlify auto-deploy)**

```bash
git push
```

- [ ] **Step 4: Commit**

No additional commit needed — push was the final step.

---

## Pre-deploy Checklist

- [ ] Vérifier population Troinex sur troinex.ch (Q87–96)
- [ ] Vérifier résultats exacts votations récentes sur admin.ch (Q113, Q114, Q118, Q125)
- [ ] Vérifier état exact des bilatérales III (Q115)
- [ ] Vérifier composition CF 2026 (Q119)
