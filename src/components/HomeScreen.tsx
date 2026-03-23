import { Shuffle, ClipboardList, RotateCcw, Mic } from 'lucide-react'
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
  onStartEntretien: () => void
}

export function HomeScreen({
  allQuestions,
  hook,
  onStartTheme,
  onStartRandom,
  onStartExam,
  onStartEntretien,
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
