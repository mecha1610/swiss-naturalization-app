import { motion } from 'framer-motion'
import type { Question } from '../types'

interface Props {
  question: Question
  selectedIndex: number | null
  onSelect: (index: number) => void
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export function QuestionCard({ question, selectedIndex, onSelect }: Props) {
  const answered = selectedIndex !== null

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.correct
          const isSelected = idx === selectedIndex
          const isWrongSelection = answered && isSelected && !isCorrect

          let cls =
            'w-full text-left px-5 py-4 rounded-2xl font-medium transition-all border-2 flex items-center gap-3 '

          if (!answered) {
            cls +=
              'border-slate-200 bg-white text-slate-700 hover:border-swiss-red hover:text-swiss-red active:scale-[0.98]'
          } else if (isCorrect) {
            cls += 'border-green-500 bg-green-50 text-green-700'
          } else if (isSelected) {
            cls += 'border-red-400 bg-red-50 text-red-600'
          } else {
            cls += 'border-slate-100 bg-slate-50 text-slate-400'
          }

          if (answered) cls += ' cursor-not-allowed'

          return (
            <motion.button
              key={idx}
              className={cls}
              disabled={answered}
              onClick={() => onSelect(idx)}
              animate={isWrongSelection ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={isWrongSelection ? { duration: 0.4, repeat: 0 } : {}}
            >
              <span className="text-xs font-black opacity-50 shrink-0 w-5">
                {OPTION_LETTERS[idx]}
              </span>
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
