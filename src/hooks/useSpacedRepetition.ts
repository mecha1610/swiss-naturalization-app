import { useState, useCallback } from 'react'
import type { Question } from '../types'

const WEIGHTS_KEY = 'nq_weights'
const HISTORY_KEY = 'nq_history'

type Weights = Record<number, number>
type History = Record<number, { answered: number; correct: number }>

function loadWeights(): Weights {
  try { return JSON.parse(localStorage.getItem(WEIGHTS_KEY) || '{}') } catch { return {} }
}

function loadHistory(): History {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}') } catch { return {} }
}

export function useSpacedRepetition() {
  const [weights, setWeights] = useState<Weights>(loadWeights)
  const [history, setHistory] = useState<History>(loadHistory)

  const updateWeight = useCallback((id: number, correct: boolean) => {
    setWeights(prev => {
      const current = prev[id] ?? 1
      const next = correct
        ? Math.max(0.2, current * 0.6)
        : Math.min(5, current * 3)
      const updated = { ...prev, [id]: next }
      localStorage.setItem(WEIGHTS_KEY, JSON.stringify(updated))
      return updated
    })
    setHistory(prev => {
      const entry = prev[id] ?? { answered: 0, correct: 0 }
      const updated = {
        ...prev,
        [id]: {
          answered: entry.answered + 1,
          correct: entry.correct + (correct ? 1 : 0),
        },
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const pickWeighted = useCallback((questions: Question[]): Question | null => {
    if (!questions.length) return null
    const total = questions.reduce((s, q) => s + (weights[q.id] ?? 1), 0)
    let r = Math.random() * total
    for (const q of questions) {
      r -= (weights[q.id] ?? 1)
      if (r <= 0) return q
    }
    return questions[questions.length - 1]
  }, [weights])

  const getDueCount = useCallback((questions: Question[]) => {
    return questions.filter(q => (weights[q.id] ?? 1) > 1.5).length
  }, [weights])

  const resetWeights = useCallback(() => {
    localStorage.removeItem(WEIGHTS_KEY)
    localStorage.removeItem(HISTORY_KEY)
    setWeights({})
    setHistory({})
  }, [])

  return { weights, history, updateWeight, pickWeighted, getDueCount, resetWeights }
}

export type SpacedRepetitionHook = ReturnType<typeof useSpacedRepetition>
