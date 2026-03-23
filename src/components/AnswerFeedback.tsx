import type { Question } from '../types'

interface Props {
  question: Question
  correct: boolean
}

export function AnswerFeedback({ question, correct }: Props) {
  return (
    <div
      className={`w-full rounded-2xl p-5 border ${
        correct
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <p className={`text-sm font-bold mb-2 ${correct ? 'text-green-700' : 'text-red-600'}`}>
        {correct ? '✓ Correct !' : '✗ Incorrect'}
      </p>
      <p className="text-sm text-slate-700 leading-relaxed">
        {question.explanation}
      </p>
    </div>
  )
}
