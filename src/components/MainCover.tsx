import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { weddingData } from '../data/wedding-info';

const MainCover = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full overflow-hidden bg-[#1a1a1a]">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Wedding" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fafaf9]" />
      </motion.div>

      {/* Magazine Style Typography */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.8em" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[10px] md:text-xs text-white/80 uppercase font-light mb-12"
        >
          Special Invitation
        </motion.div>

        <div className="flex flex-col gap-2 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-7xl md:text-9xl font-serif text-white tracking-tighter"
          >
            {weddingData.groom.name}
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 1 }}
            className="h-[1px] bg-white/30 my-4"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-7xl md:text-9xl font-serif text-white tracking-tighter"
          >
            {weddingData.bride.name}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="space-y-4"
        >
          <p className="text-xl md:text-2xl font-serif text-white/90 tracking-[0.2em]">
            2024 . 10 . 26
          </p>
          <p className="text-[11px] md:text-sm text-white/60 uppercase tracking-[0.4em]">
            Saturday . 01:00 PM
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-24 h-24 border border-white/10 rounded-full z-10 hidden md:block"
      />
      
      {/* Bottom Label */}
      <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 items-end z-20">
        <div className="text-[10px] text-stone-400 rotate-90 origin-left translate-y-[-100%] uppercase tracking-widest">
          Est. 2024
        </div>
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">Scroll Down</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-stone-400 to-transparent" />
        </motion.div>
        <div className="text-[10px] text-stone-400 uppercase tracking-widest leading-loose text-right">
          The Riverside<br />Hotel Seoul
        </div>
      </div>
    </section>
  );
};

export default MainCover;
