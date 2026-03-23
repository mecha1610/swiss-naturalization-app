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
