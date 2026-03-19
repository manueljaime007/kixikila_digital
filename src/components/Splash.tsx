import React from 'react';
import { motion } from 'framer-motion';

export const Splash = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#1A1A1A] flex flex-col items-center justify-between text-white overflow-hidden py-12 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#F23030 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div /> {/* Spacer for top */}

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F23030] rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-red-500/20">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-white/20 rounded-full flex items-center justify-center">
             <div className="text-3xl md:text-4xl">🤝</div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">KIXIKILA<span className="text-[#F23030]">.</span></h1>
        <div className="flex flex-col items-center max-w-[280px] md:max-w-md">
          <p className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-slate-400 font-black text-center leading-relaxed">
            Preservando a tradição,<br className="md:hidden" /> inovando o futuro
          </p>
        </div>
      </motion.div>
      
      <div className="relative z-10 w-full max-w-xs px-8 flex flex-col items-center">
        <p className="text-center italic text-slate-300 mb-8 md:mb-12 text-sm md:text-base">
          "A Kixikila da Banda, <span className="text-[#D9A441] font-bold not-italic">agora digital</span>"
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full py-4 bg-[#F23030] text-white font-black rounded-2xl shadow-xl shadow-red-500/20 uppercase tracking-widest text-sm md:text-base"
        >
          Começar
        </motion.button>
      </div>
    </div>
  );
};
