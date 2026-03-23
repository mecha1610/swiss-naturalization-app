import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { AnswerFeedback } from './AnswerFeedback'
import { THEMES } from '../types'
import type { Question } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

interface Props {
  questions: Question[]
  hook: SpacedRepetitionHook
  onBack: () => void
}

export function QuizScreen({ questions, hook, onBack }: Props) {
  const { pickWeighted, updateWeight } = hook
  const [current, setCurrent] = useState<Question | null>(() => pickWeighted(questions))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-slate-500">Aucune question disponible pour ce thème.</p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-swiss-red font-semibold"
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </button>
      </div>
    )
  }

  const themeLabel = THEMES.find(t => t.id === current.theme)?.label ?? current.theme
  const answered = selectedIndex !== null

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    updateWeight(current.id, idx === current.correct)
  }

  const handleNext = () => {
    const next = pickWeighted(questions)
    setCurrent(next)
    setSelectedIndex(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-slate-500">{themeLabel}</span>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-5 p-6 w-full max-w-xl mx-auto">
        <QuestionCard
          question={current}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />

        {answered && (
          <>
            <AnswerFeedback question={current} correct={selectedIndex === current.correct} />
            <button
              onClick={handleNext}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition active:scale-95"
            >
              Question suivante →
            </button>
          </>
        )}
      </main>
    </div>
  )
}
