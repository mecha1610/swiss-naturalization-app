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
