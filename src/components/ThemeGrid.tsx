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
