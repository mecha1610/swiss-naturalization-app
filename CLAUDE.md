# CLAUDE.md — Naturalisation Quiz GE

## Contexte du projet

Application web de révision QCM pour l'examen oral de naturalisation suisse.

- Candidat : Marine Claver, commune de Troinex (GE-1256)
- Examen : 31 mars 2026
- Deadline livraison : 25 mars 2026

---

## Stack — ne jamais dévier de ça

- **Framework** : React 18 + Vite
- **Style** : Tailwind CSS v3
- **Données** : JSON statique embarqué (`src/data/questions.json`)
- **Persistance** : localStorage uniquement (poids répétition espacée)
- **Déploiement** : `npm run build` → dossier `dist/` → Netlify drag & drop
- **Langue** : français uniquement, aucune string en anglais dans l'UI
- **Pas de backend, pas d'API externe, pas d'auth**

---

## Structure de fichiers — respecter exactement

```
naturalisation-quiz/
├── public/
│   └── favicon.ico
├── src/
│   ├── data/
│   │   └── questions.json
│   ├── components/
│   │   ├── HomeScreen.jsx
│   │   ├── ThemeGrid.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── AnswerFeedback.jsx
│   │   ├── ScoreBar.jsx
│   │   ├── ThemeStats.jsx
│   │   └── ExamMode.jsx
│   ├── hooks/
│   │   └── useSpacedRepetition.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── CLAUDE.md
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Schema questions.json — immuable

Chaque question respecte exactement ce schema :

```json
{
  "id": 1,
  "theme": "politique_ch",
  "difficulty": 2,
  "choices": 4,
  "question": "Combien de membres compte le Conseil fédéral ?",
  "options": ["5", "6", "7", "9"],
  "correct": 2,
  "explanation": "Le Conseil fédéral est composé de 7 membres élus par l'Assemblée fédérale pour 4 ans. Ils gouvernent collégialement — aucun membre n'a de pouvoir supérieur aux autres."
}
```

**Champs :**

- `id` — entier unique, séquentiel
- `theme` — enum strict : `politique_ch` | `geneve` | `troinex` | `histoire` | `droits` | `geographie`
- `difficulty` — `1` (facile) | `2` (moyen) | `3` (difficile)
- `choices` — `3` ou `4` selon difficulté (3 = facile, 4 = moyen/difficile)
- `options` — array de strings, longueur == `choices`
- `correct` — index 0-based dans `options`
- `explanation` — 2-4 phrases en français, explique le fond, pas juste la réponse

---

## Banque de questions — 86 questions à générer

### Répartition

| Theme slug | Label UI | Nb | Difficulté dominante |
|---|---|---|---|
| `politique_ch` | Politique suisse | 18 | mix 2/3 |
| `geneve` | Canton de Genève | 16 | mix 1/2 |
| `troinex` | Commune de Troinex | 10 | 1 |
| `histoire` | Histoire suisse | 14 | mix 1/2 |
| `droits` | Droits & devoirs | 14 | mix 2/3 |
| `geographie` | Géographie & société | 14 | mix 1/2 |

### Questions à intégrer — politique_ch (18)

1. Combien de membres compte le Conseil fédéral ? → **7** (idx 2) `["5","6","7","9"]`
2. Qui élit le Conseil fédéral ? → **l'Assemblée fédérale** `["Le peuple suisse","Le Conseil des États","L'Assemblée fédérale"]`
3. Combien de signatures pour une initiative populaire fédérale ? → **100 000** `["50 000","100 000","150 000"]`
4. Combien de signatures pour un référendum facultatif ? → **50 000** `["30 000","50 000","100 000"]`
5. Combien de membres compte le Conseil national ? → **200** `["100","150","200","246"]`
6. Combien de membres compte le Conseil des États ? → **46** `["26","36","46","52"]`
7. Quelle est la durée d'une législature fédérale ? → **4 ans** `["3 ans","4 ans","5 ans","6 ans"]`
8. Quelle est la capitale fédérale de la Suisse ? → **Berne** `["Zurich","Berne","Genève","Lausanne"]`
9. Combien de langues nationales la Suisse reconnaît-elle ? → **4** `["2","3","4"]`
10. Qu'est-ce que le référendum obligatoire ? → **Vote peuple ET cantons pour toute révision constitutionnelle** `["Vote du peuple uniquement","Vote peuple ET cantons pour toute révision constitutionnelle","Vote des cantons uniquement","Vote du parlement"]`
11. Qui préside la Confédération en 2026 ? → **Karin Keller-Sutter** `["Viola Amherd","Karin Keller-Sutter","Guy Parmelin","Ignazio Cassis"]`
12. Où siège le Tribunal fédéral ? → **Lausanne** `["Berne","Zurich","Lausanne","Genève"]`
13. Qu'est-ce que la concordance ? → **Représentation proportionnelle des partis au Conseil fédéral** `["Droit de veto cantonal","Représentation proportionnelle des partis au Conseil fédéral","Accord de coalition écrit","Majorité qualifiée au parlement"]`
14. En quelle année la Suisse a-t-elle rejoint l'ONU ? → **2002** `["1945","1992","2002","2008"]`
15. Quel est le principe de subsidiarité ? → **Les décisions se prennent au niveau le plus bas possible** `["L'État prime sur les cantons","Les décisions se prennent au niveau le plus bas possible","Le parlement a toujours le dernier mot","Les communes sont subordonnées aux cantons"]`
16. Quelle est la double majorité requise pour les initiatives populaires ? → **Majorité du peuple ET majorité des cantons** `["Majorité du peuple uniquement","Majorité des cantons uniquement","Majorité du peuple ET majorité des cantons","Majorité des deux chambres"]`
17. Combien de cantons compte la Suisse ? → **26** `["23","25","26","28"]`
18. Quel parti politique n'existe pas en Suisse ? → **La République En Marche** `["UDC","PS","PLR","La République En Marche"]`

### Questions à intégrer — geneve (16)

1. Combien de membres compte le Grand Conseil genevois ? → **100** `["80","100","120","150"]`
2. Combien de membres compte le Conseil d'État genevois ? → **7** `["5","7","9"]`
3. Combien de communes compte le canton de Genève ? → **45** `["26","35","45","56"]`
4. Pour combien d'années les conseillers d'État genevois sont-ils élus ? → **5 ans** `["4 ans","5 ans","6 ans"]`
5. Quelle est la population du canton de Genève ? → **environ 520 000 habitants** `["environ 250 000","environ 380 000","environ 520 000","environ 750 000"]`
6. En quelle année Genève a-t-elle rejoint la Confédération ? → **1815** `["1291","1648","1815","1848"]`
7. Quelle est la hauteur du Jet d'eau de Genève ? → **140 mètres** `["80 mètres","120 mètres","140 mètres","200 mètres"]`
8. Quelle institution internationale est née à Genève en 1863 ? → **Le CICR** `["L'ONU","Le CICR","L'OMS","La Croix-Rouge française"]`
9. Quelle fête genevoise commémore la résistance de 1602 ? → **L'Escalade** `["La Fête de Genève","L'Escalade","Le Jeûne genevois","La Bénichon"]`
10. Quel fleuve traverse Genève ? → **Le Rhône** `["L'Arve","Le Rhône","La Versoix","Le Léman"]`
11. Quelle est la durée de résidence minimale à Genève pour demander la naturalisation cantonale ? → **2 ans à Genève (5 en Suisse)** `["1 an à Genève","2 ans à Genève (5 en Suisse)","3 ans à Genève","5 ans à Genève"]`
12. Quel est le siège du gouvernement cantonal genevois ? → **L'Hôtel de Ville** `["Le Palais fédéral","L'Hôtel de Ville","La Maison de la paix","Le Palais des Nations"]`
13. Combien d'organisations internationales siègent à Genève ? → **Plus de 200** `["Environ 50","Environ 100","Plus de 200","Environ 500"]`
14. Quel lac borde Genève ? → **Le lac Léman** `["Le lac de Neuchâtel","Le lac de Constance","Le lac Léman","Le lac de Bienne"]`
15. Quelle montagne domine le paysage genevois côté français ? → **Le Salève** `["Le Jura","Le Salève","Le Mont-Blanc","Les Voirons"]`
16. Qu'est-ce que le Grand Genève ? → **Agglomération transfrontalière franco-suisse** `["Nom officiel du canton","Agglomération transfrontalière franco-suisse","Quartier historique de Genève","Organisation internationale basée à Genève"]`

### Questions à intégrer — troinex (10)

1. Dans quel canton se trouve Troinex ? → **Genève** `["Vaud","Genève","Fribourg"]`
2. Quel est le code postal de Troinex ? → **1256** `["1200","1226","1256","1279"]`
3. Troinex est limitrophe de quelle commune française ? → **Saint-Julien-en-Genevois** `["Annemasse","Saint-Julien-en-Genevois","Thonon-les-Bains"]`
4. Quel est le type de commune de Troinex ? → **Commune résidentielle à caractère rural préservé** `["Commune industrielle","Commune résidentielle à caractère rural préservé","Commune universitaire","Chef-lieu de district"]`
5. Troinex fait partie de quelle agglomération ? → **Le Grand Genève** `["La Métropole lémanique","Le Grand Genève","L'Arc lémanique","Genève Agglo"]`
6. Quel est l'organe exécutif d'une commune genevoise comme Troinex ? → **Le Conseil administratif ou le Maire** `["Le Conseil d'État","Le Grand Conseil","Le Conseil administratif ou le Maire","Le Tribunal de commune"]`
7. Quelle est la population approximative de Troinex ? → **environ 2 500 habitants** `["environ 500 habitants","environ 2 500 habitants","environ 10 000 habitants","environ 25 000 habitants"]`
8. Quel transport en commun dessert Troinex ? → **Les bus TPG** `["Le tram","Le train CFF","Les bus TPG","Le métro"]`
9. Quelle vue naturelle caractérise Troinex ? → **Vue sur le Salève et la campagne genevoise** `["Vue sur le lac Léman","Vue sur les Alpes valaisannes","Vue sur le Salève et la campagne genevoise","Vue sur le Jura"]`
10. De quelle région genevoise Troinex fait-elle partie ? → **La rive gauche du Rhône / secteur Arve-Lac** `["La Champagne genevoise","Le Mandement","La rive gauche du Rhône / secteur Arve-Lac","Les Trois-Chêne"]`

### Questions à intégrer — histoire (14)

1. En quelle année a été signé le Pacte fédéral fondateur ? → **1291** `["1215","1291","1315","1648"]`
2. Quels sont les trois cantons fondateurs ? → **Uri, Schwytz, Unterwald** `["Berne, Zurich, Lucerne","Uri, Schwytz, Unterwald","Genève, Vaud, Fribourg","Bâle, Soleure, Schaffhouse"]`
3. En quelle année les femmes ont-elles obtenu le droit de vote fédéral ? → **1971** `["1948","1959","1971","1981"]`
4. Quel est le dernier canton à avoir accordé le droit de vote cantonal aux femmes ? → **Appenzell Rhodes-Intérieures (1990)** `["Valais (1970)","Uri (1986)","Appenzell Rhodes-Intérieures (1990)","Schwyz (1990)"]`
5. En quelle année la Suisse a-t-elle adhéré à l'ONU ? → **2002** `["1945","1972","1992","2002"]`
6. En quelle année la Constitution fédérale actuelle a-t-elle été adoptée ? → **1999** `["1848","1874","1948","1999"]`
7. Que commémore la Fête nationale du 1er août ? → **Le Pacte fédéral de 1291** `["La bataille de Marignan","La Réforme protestante","Le Pacte fédéral de 1291","L'indépendance vis-à-vis de la France"]`
8. En quelle année la Suisse a-t-elle rejoint l'Espace Schengen ? → **2008** `["2004","2006","2008","2010"]`
9. Quel général suisse symbolise la résistance lors de la 2e Guerre mondiale ? → **Henri Guisan** `["Guillaume Tell","Henri Guisan","Charles Pictet de Rochemont","Ludwig Forrer"]`
10. En quelle année la Suisse a-t-elle refusé d'adhérer à l'EEE ? → **1992** `["1989","1992","1995","2001"]`
11. Quelle bataille a consolidé l'indépendance suisse face aux Habsbourg ? → **Morgarten (1315)** `["Grandson (1476)","Marignan (1515)","Morgarten (1315)","Morat (1476)"]`
12. Où a été signée la première Convention de Genève ? → **Genève, 1864** `["Paris, 1856","Genève, 1864","Vienne, 1815","La Haye, 1899"]`
13. En quelle année la neutralité suisse a-t-elle été reconnue internationalement ? → **1815 (Congrès de Vienne)** `["1648","1789","1815 (Congrès de Vienne)","1848"]`
14. Quelle est la date de fondation du CICR ? → **1863** `["1848","1863","1889","1919"]`

### Questions à intégrer — droits (14)

1. À quel âge peut-on voter en Suisse ? → **18 ans** `["16 ans","18 ans","20 ans","21 ans"]`
2. Combien de mois ont les résidents pour s'affilier à une caisse-maladie ? → **3 mois** `["1 mois","3 mois","6 mois","12 mois"]`
3. Le service militaire est-il obligatoire en Suisse ? → **Oui, pour les hommes suisses** `["Non, il est volontaire","Oui, pour tous les résidents","Oui, pour les hommes suisses","Oui, pour les hommes et femmes suisses"]`
4. Qu'est-ce que le service civil ? → **Alternative au service militaire pour raison de conscience** `["Service de sécurité civile obligatoire","Alternative au service militaire pour raison de conscience","Service d'utilité publique pour les étrangers","Formation aux premiers secours obligatoire"]`
5. Combien d'années de résidence faut-il pour la naturalisation fédérale ordinaire ? → **10 ans** `["5 ans","8 ans","10 ans","12 ans"]`
6. Quel est le premier pilier du système de retraite suisse ? → **AVS** `["LPP","AVS","3e pilier","AI"]`
7. À quel âge ouvre le droit à la rente AVS pour les hommes ? → **65 ans** `["60 ans","62 ans","64 ans","65 ans"]`
8. Qu'est-ce que le deuxième pilier ? → **LPP — prévoyance professionnelle obligatoire** `["AVS améliorée","LPP — prévoyance professionnelle obligatoire","Épargne retraite volontaire","Assurance invalidité"]`
9. Quelle est la durée légale minimale des vacances pour un employé adulte ? → **4 semaines** `["2 semaines","3 semaines","4 semaines","5 semaines"]`
10. Qu'est-ce que le secret du vote ? → **Nul ne peut être contraint de révéler son choix électoral** `["Le vote se fait anonymement en ligne","Nul ne peut être contraint de révéler son choix électoral","Les résultats sont secrets pendant 24h","Seuls les juges connaissent les résultats"]`
11. Qu'est-ce que la LAMal ? → **Loi sur l'assurance-maladie obligatoire pour tous les résidents** `["Loi sur les accidents du travail","Loi sur l'assurance-maladie obligatoire pour tous les résidents","Loi sur l'aide sociale","Loi sur l'assurance maternité"]`
12. Qu'est-ce que le droit de pétition ? → **Droit de s'adresser par écrit aux autorités sans formalité** `["Droit de manifester dans la rue","Droit de s'adresser par écrit aux autorités sans formalité","Droit de contester une loi devant le tribunal","Droit de demander une votation populaire"]`
13. Qui peut signer une initiative populaire fédérale ? → **Tout citoyen suisse ayant le droit de vote** `["Tout résident en Suisse","Tout citoyen suisse ayant le droit de vote","Tout résident avec permis C","Tout contribuable suisse"]`
14. Qu'est-ce que l'initiative populaire cantonale genevoise ? → **Proposition de loi signée par 10 000 citoyens genevois** `["Proposition de loi signée par 5 000 citoyens","Proposition de loi signée par 10 000 citoyens genevois","Vote communal organisé par la Mairie","Pétition au Grand Conseil"]`

### Questions à intégrer — geographie (14)

1. Quel est le plus haut sommet de Suisse ? → **Pointe Dufour (4 634 m)** `["Cervin","Jungfrau","Pointe Dufour (4 634 m)","Eiger"]`
2. Quel est le plus grand lac entièrement suisse ? → **Lac de Neuchâtel** `["Lac de Constance","Lac Léman","Lac de Neuchâtel","Lac de Thoune"]`
3. Quelles sont les trois régions géographiques de la Suisse ? → **Jura, Plateau, Alpes** `["Nord, Centre, Sud","Jura, Plateau, Alpes","Forêt, Plaine, Montagne","Rhénanie, Mittelland, Tessin"]`
4. Combien de cantons sont entièrement francophones ? → **4** `["3","4","5","6"]`
5. Quels sont les 4 cantons entièrement francophones ? → **Genève, Vaud, Neuchâtel, Jura** `["Genève, Vaud, Fribourg, Valais","Genève, Vaud, Neuchâtel, Jura","Genève, Berne, Neuchâtel, Jura","Genève, Vaud, Neuchâtel, Fribourg"]`
6. Quel est le canton le plus peuplé de Suisse ? → **Zurich** `["Berne","Zurich","Vaud","Genève"]`
7. Où siège le Tribunal fédéral ? → **Lausanne** `["Berne","Zurich","Lausanne","Lucerne"]`
8. Quel est le principal aéroport desservant Genève ? → **Genève-Cointrin** `["Kloten","Genève-Cointrin","Euro Airport Basel","Sion"]`
9. Quelle ville est traversée à la fois par le Rhône et l'Arve ? → **Genève** `["Lausanne","Genève","Sion","Martigny"]`
10. Combien de demi-cantons compte la Suisse ? → **6** `["4","6","8","10"]`
11. Dans quelle ville se trouve le Palais fédéral ? → **Berne** `["Zurich","Genève","Berne","Lucerne"]`
12. Quel est le canton officiellement trilingue (DE/FR/IT) ? → **Grisons** `["Valais","Fribourg","Grisons","Berne"]`
13. Quelle est la longueur approximative de la Suisse d'ouest en est ? → **350 km** `["150 km","220 km","350 km","500 km"]`
14. Quel pays ne partage pas de frontière avec la Suisse ? → **La Belgique** `["L'Autriche","Le Liechtenstein","La Belgique","La France"]`

---

## Algorithme de répétition espacée — implémentation exacte

Fichier : `src/hooks/useSpacedRepetition.js`

```javascript
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'nq_weights'

function loadWeights() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function useSpacedRepetition() {
  const [weights, setWeights] = useState(loadWeights)

  const updateWeight = useCallback((id, correct) => {
    setWeights(prev => {
      const current = prev[id] ?? 1
      const next = correct
        ? Math.max(0.2, current * 0.6)
        : Math.min(5, current * 3)
      const updated = { ...prev, [id]: next }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const pickWeighted = useCallback((questions) => {
    if (!questions.length) return null
    const total = questions.reduce((s, q) => s + (weights[q.id] ?? 1), 0)
    let r = Math.random() * total
    for (const q of questions) {
      r -= (weights[q.id] ?? 1)
      if (r <= 0) return q
    }
    return questions[questions.length - 1]
  }, [weights])

  const getDueCount = useCallback((questions) => {
    return questions.filter(q => (weights[q.id] ?? 1) > 1.5).length
  }, [weights])

  const resetWeights = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setWeights({})
  }, [])

  return { weights, updateWeight, pickWeighted, getDueCount, resetWeights }
}
```

---

## Comportement attendu des composants

### App.jsx

- State global : `screen` (`home` | `quiz` | `exam`)
- Passe les props vers HomeScreen, QuizScreen, ExamMode
- Gère le thème sélectionné et le mode

### HomeScreen.jsx

- Affiche 4 métriques : questions répondues, correctes, % réussite, nb "à revoir"
- Appelle ThemeGrid et ThemeStats
- Boutons : "Question aléatoire" + "Mode examen blanc"

### ThemeGrid.jsx

- Grille responsive 2 colonnes mobile / 3 desktop
- Chaque thème : icône + label + nb questions + barre de progression
- Click → lance QuizScreen filtré sur ce thème

### QuizScreen.jsx

- Reçoit `questions` (filtrées par thème ou toutes)
- Utilise `useSpacedRepetition` pour la pioche
- Affiche QuestionCard → AnswerFeedback → bouton suivant

### QuestionCard.jsx

- Affiche question + options (3 ou 4 boutons)
- Après clic : colore correct en vert, incorrect en rouge + montre le bon
- Désactive tous les boutons après sélection

### AnswerFeedback.jsx

- Toujours affiché après réponse (bonne ou mauvaise)
- Bloc coloré : vert si correct, rouge si incorrect
- Texte : `question.explanation`

### ExamMode.jsx

- Pioche 20 questions pondérées toutes thématiques
- Pas de retour arrière
- Résumé final : score /20, liste des ratées, thèmes faibles

### ThemeStats.jsx

- Tableau ou liste : par thème → nb répondues / total, % réussite
- Couleur : rouge < 50%, orange < 75%, vert ≥ 75%

---

## Labels UI des thèmes

```javascript
export const THEMES = [
  { id: 'politique_ch', label: 'Politique suisse',    icon: '🏛️', total: 18 },
  { id: 'geneve',       label: 'Canton de Genève',    icon: '🌊', total: 16 },
  { id: 'troinex',      label: 'Commune de Troinex',  icon: '🏡', total: 10 },
  { id: 'histoire',     label: 'Histoire suisse',     icon: '📜', total: 14 },
  { id: 'droits',       label: 'Droits & devoirs',    icon: '⚖️', total: 14 },
  { id: 'geographie',   label: 'Géographie & société',icon: '🗺️', total: 14 },
]
```

---

## Commandes de référence

```bash
# Initialisation
npm create vite@latest naturalisation-quiz -- --template react
cd naturalisation-quiz
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Développement
npm run dev

# Build production
npm run build
# → dist/ prêt pour Netlify
```

---

## Ce que Claude Code NE doit PAS faire

- Ajouter un backend ou une base de données
- Appeler une API externe (pas d'Anthropic API, pas de fetch vers l'extérieur)
- Créer un système d'authentification
- Traduire quoi que ce soit en anglais dans l'UI
- Modifier le schema JSON des questions
- Utiliser un framework CSS autre que Tailwind
- Ajouter des dépendances non listées

---

## Risques connus

| Point | Action requise avant déploiement |
|---|---|
| Présidente CF 2026 | Vérifier : Karin Keller-Sutter (question politique_ch #11) |
| Données Troinex | Valider sur troinex.ch : population exacte, nom syndic/maire |
| Troinex district | Confirmer le nom exact du district / secteur administratif |
