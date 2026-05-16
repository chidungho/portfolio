import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    const duration = 2700;
    let start: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min((progress / duration) * 100, 100);
      setCount(Math.floor(percentage));
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length);
    }, 900);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 overflow-hidden">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xs text-muted uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-end gap-2 z-10">
        <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums tracking-tighter">
          {String(count).padStart(3, "0")}
        </div>
        <div className="w-full max-w-sm h-[3px] bg-stroke/50 origin-left overflow-hidden relative">
          <div 
            className="absolute inset-0 accent-gradient origin-left"
            style={{ 
              transform: `scaleX(${count / 100})`, 
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)' 
            }}
          />
        </div>
      </div>
    </div>
  );
}