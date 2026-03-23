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

export type Screen = 'home' | 'quiz' | 'exam' | 'entretien'

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
