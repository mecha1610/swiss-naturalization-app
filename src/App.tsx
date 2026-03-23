import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './components/HomeScreen'
import { QuizScreen } from './components/QuizScreen'
import { ExamMode } from './components/ExamMode'
import { EntretienScreen } from './components/EntretienScreen'
import { useSpacedRepetition } from './hooks/useSpacedRepetition'
import questionsData from './data/questions.json'
import type { Screen, Theme, Question } from './types'

const allQuestions = questionsData as Question[]

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const hook = useSpacedRepetition()

  const filteredQuestions = selectedTheme
    ? allQuestions.filter(q => q.theme === selectedTheme)
    : allQuestions

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-swiss-red selection:text-white">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              allQuestions={allQuestions}
              hook={hook}
              onStartTheme={(theme: Theme) => {
                setSelectedTheme(theme)
                setScreen('quiz')
              }}
              onStartRandom={() => {
                setSelectedTheme(null)
                setScreen('quiz')
              }}
              onStartExam={() => setScreen('exam')}
              onStartEntretien={() => setScreen('entretien')}
            />
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <QuizScreen
              questions={filteredQuestions}
              hook={hook}
              onBack={() => { setSelectedTheme(null); setScreen('home') }}
            />
          </motion.div>
        )}

        {screen === 'exam' && (
          <motion.div
            key="exam"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <ExamMode
              allQuestions={allQuestions}
              hook={hook}
              onBack={() => setScreen('home')}
            />
          </motion.div>
        )}
        {screen === 'entretien' && (
          <motion.div
            key="entretien"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <EntretienScreen onBack={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
