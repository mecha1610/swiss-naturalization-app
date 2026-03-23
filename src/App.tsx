import { useState } from 'react';
import { FlashCard } from './components/FlashCard';
import questionsData from './questions.json';
import { CheckCircle2, RotateCcw, Trophy } from 'lucide-react';

export default function App() {
  const [queue, setQueue] = useState([...questionsData].sort(() => Math.random() - 0.5));
  const [known, setKnown] = useState<number[]>([]);
  
  const currentQuestion = queue.length > 0 ? queue[0] : null;

  const handleAnswer = (knewIt: boolean) => {
    if (!currentQuestion) return;
    
    const newQueue = queue.slice(1);
    
    if (knewIt) {
      setKnown([...known, currentQuestion.id]);
      setQueue(newQueue);
    } else {
      // Re-insert 2 to 4 cards later, or at the end if the queue is small
      const insertIndex = Math.min(newQueue.length, Math.floor(Math.random() * 3) + 2);
      newQueue.splice(insertIndex, 0, currentQuestion);
      setQueue(newQueue);
    }
  };

  const resetProgress = () => {
    setKnown([]);
    setQueue([...questionsData].sort(() => Math.random() - 0.5));
  };

  const progressPercentage = Math.round((known.length / questionsData.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-swiss-red selection:text-white">
      {/* Navbar Minimaliste */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-swiss-red to-swiss-darkred flex items-center justify-center text-white font-black text-sm shadow-md">
            CH
          </div>
          <h1 className="font-bold text-slate-800 text-lg sm:text-xl tracking-tight">Swiss Naturalization</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-semibold">
          <Trophy size={16} className="text-yellow-500" />
          <span>{known.length} / {questionsData.length}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
        {currentQuestion ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center w-full space-y-12">
            
            <FlashCard 
              key={currentQuestion.id}
              question={currentQuestion.question}
              answer={currentQuestion.answer}
              details={currentQuestion.details}
              category={currentQuestion.category}
              onAnswer={handleAnswer}
            />
            
            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider">
                <span>Progression d'apprentissage</span>
                <span className="text-swiss-red">{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-swiss-darkred to-swiss-red transition-all duration-700 ease-out" 
                  style={{ width: `${progressPercentage}%` }} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Félicitations !</h2>
            <p className="text-slate-500 mb-10 max-w-sm text-lg">Vous avez mémorisé toutes les questions de la session. Prête pour le grand oral !</p>
            <button 
              onClick={resetProgress}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
            >
              <RotateCcw size={22} />
              Recommencer la session
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
