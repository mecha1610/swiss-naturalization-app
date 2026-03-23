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
