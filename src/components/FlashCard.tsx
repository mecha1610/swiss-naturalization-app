import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FlashCardProps {
  question: string;
  answer: string;
  details?: string;
  category: string;
  onAnswer: (knewIt: boolean) => void;
}

export function FlashCard({ question, answer, details, category, onAnswer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when question changes
  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 h-96 relative">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 flex flex-col items-center justify-center text-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mt-6">
            {question}
          </h2>
          <p className="absolute bottom-6 text-sm text-slate-400 font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Touchez pour révéler
          </p>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-swiss-red text-white rounded-3xl shadow-[0_8px_30px_rgba(255,0,0,0.2)] p-6 pt-16 pb-24 flex flex-col items-center justify-center text-center rotate-y-180 overflow-y-auto"
        >
          <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-red-100 bg-black/20 px-3 py-1.5 rounded-full">
            {category}
          </span>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-relaxed">
            {answer}
          </h2>
          
          {details && (
            <p className="text-sm text-white/90 bg-black/10 p-4 rounded-2xl mt-2 w-full leading-relaxed">
              {details}
            </p>
          )}
          
          <div className="absolute bottom-6 w-full flex justify-center gap-4 px-6">
            <button 
              onClick={(e) => { e.stopPropagation(); onAnswer(false); }}
              className="flex-1 bg-black/20 hover:bg-black/30 text-white py-3.5 rounded-2xl font-semibold transition active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              À revoir
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onAnswer(true); }}
              className="flex-1 bg-white hover:bg-slate-50 text-swiss-red py-3.5 rounded-2xl font-bold shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Je savais
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
