import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { QuestionCard } from './QuestionCard'
import { AnswerFeedback } from './AnswerFeedback'
import { THEMES } from '../types'
import type { Question } from '../types'
import type { SpacedRepetitionHook } from '../hooks/useSpacedRepetition'

const EXAM_COUNT = 20

interface Props {
  allQuestions: Question[]
  hook: SpacedRepetitionHook
  onBack: () => void
}

export function ExamMode({ allQuestions, hook, onBack }: Props) {
  const { pickWeighted, updateWeight } = hook

  // Pick 20 distinct weighted questions once at mount
  const examQuestions = useMemo<Question[]>(() => {
    const picked: Question[] = []
    const remaining = [...allQuestions]
    for (let i = 0; i < EXAM_COUNT && remaining.length > 0; i++) {
      const q = pickWeighted(remaining)
      if (!q) break
      picked.push(q)
      remaining.splice(remaining.indexOf(q), 1)
    }
    return picked
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally fixed at mount — exam set must not change mid-session

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  // — Summary screen —
  if (done) {
    const score = answers.filter(Boolean).length
    const failed = examQuestions.filter((_, i) => !answers[i])
    const weakThemes = THEMES.filter(theme => {
      const themeQs = examQuestions.filter(q => q.theme === theme.id)
      if (!themeQs.length) return false
      const themeCorrect = themeQs.filter(q => {
        const i = examQuestions.indexOf(q)
        return answers[i]
      }).length
      return themeCorrect / themeQs.length < 0.5
    })

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            score >= 14 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
          }`}
        >
          {score >= 14 ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-2">
          {score} / {EXAM_COUNT}
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">
          {score >= 14
            ? "Excellent ! Prête pour l'oral."
            : 'Continue à réviser, tu vas y arriver !'}
        </p>

        {weakThemes.length > 0 && (
          <div className="w-full max-w-md bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5">
            <p className="text-sm font-bold text-orange-700 mb-3">
              Thèmes à renforcer
            </p>
            {weakThemes.map(t => (
              <p key={t.id} className="text-sm text-orange-600 py-0.5">
                {t.icon} {t.label}
              </p>
            ))}
          </div>
        )}

        {failed.length > 0 && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="text-sm font-bold text-red-700 mb-4">
              Questions ratées ({failed.length})
            </p>
            <div className="space-y-4">
              {failed.map(q => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-slate-700">{q.question}</p>
                  <p className="text-xs text-green-700 mt-1">
                    ✓ {q.options[q.correct]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition active:scale-95"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  // Guard against empty exam set
  if (!examQuestions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-slate-500">Aucune question disponible.</p>
        <button onClick={onBack} className="flex items-center gap-2 text-swiss-red font-semibold">
          Retour à l'accueil
        </button>
      </div>
    )
  }

  // — Quiz screen —
  const current = examQuestions[currentIdx]
  const answered = selectedIndex !== null

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelectedIndex(idx)
    updateWeight(current.id, idx === current.correct)
  }

  const handleNext = () => {
    const newAnswers = [...answers, selectedIndex === current.correct]
    setAnswers(newAnswers)

    setSelectedIndex(null)
    if (currentIdx + 1 >= examQuestions.length) {
      setDone(true)
    } else {
      setCurrentIdx(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-bold text-slate-800">Examen blanc</h1>
        <span className="text-sm font-semibold text-slate-500">
          {currentIdx + 1} / {EXAM_COUNT}
        </span>
      </header>

      {/* Progress strip */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-full bg-swiss-red transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / EXAM_COUNT) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col justify-center gap-5 p-6 w-full max-w-xl mx-auto">
        <QuestionCard
          question={current}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />

        {answered && (
          <>
            <AnswerFeedback
              question={current}
              correct={selectedIndex === current.correct}
            />
            <button
              onClick={handleNext}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition active:scale-95"
            >
              {currentIdx + 1 < examQuestions.length
                ? 'Question suivante →'
                : 'Voir les résultats'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
