import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { WeddingInfo } from '../data/wedding-info';

const MainCover = ({ data }: { data: WeddingInfo }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // ---- Opening intro: phrases reveal one by one, then wipe into the cover ----
  const introPhrases = [
    { main: 'SPECIAL INVITATION', sub: '' },
    { main: `${data.groom.name} · ${data.bride.name}`, sub: '' },
    {
      main: new Date(data.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      sub: data.time,
    },
  ];
  const [phase, setPhase] = useState<'intro' | 'cover'>('intro');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    introPhrases.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 1200 + 300));
    });
    timers.push(setTimeout(() => setPhase('cover'), introPhrases.length * 1200 + 1100));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [daysLeft, setDaysLeft] = useState(0);
  useEffect(() => {
    const target = new Date(data.date).getTime();
    setDaysLeft(Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)));
  }, [data.date]);

  const groomEn = data.groom.nameEn;
  const brideEn = data.bride.nameEn;

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full overflow-hidden bg-[#1a1a1a]">
      {/* Opening intro overlay */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[60] bg-[#1a1a1a] flex items-center justify-center px-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="font-serif text-white text-2xl md:text-4xl tracking-[0.08em]">
                  {introPhrases[step].main}
                </p>
                {introPhrases[step].sub && (
                  <p className="mt-3 text-white/50 text-xs md:text-sm uppercase tracking-[0.5em]">
                    {introPhrases[step].sub}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parallax Background — photo placeholder */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #2a2825 0px, #2a2825 22px, #322f2b 22px, #322f2b 44px)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/25">
          <div className="w-14 h-14 rounded-full border border-white/25" />
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase">Couple Photo</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#fafaf9]" />
      </motion.div>

      {/* Thin decorative frame */}
      <div className="absolute inset-5 md:inset-9 border border-white/25 pointer-events-none z-10" />

      {/* Magazine Style Typography */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: phase === 'cover' ? 1 : 0, letterSpacing: "0.8em" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[13px] md:text-[15px] text-white/70 uppercase font-light mb-10"
        >
          Special Invitation
        </motion.div>

        <div className="flex flex-col gap-2 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === 'cover' ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {groomEn && (
              <p className="text-white/50 text-xs md:text-sm uppercase tracking-[0.5em] mb-2">{groomEn}</p>
            )}
            <h1 className="text-6xl md:text-9xl font-serif text-white tracking-tighter">
              {data.groom.name}
            </h1>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={phase === 'cover' ? { width: "100%" } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="h-[1px] bg-white/30 my-4 mx-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === 'cover' ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-serif text-white tracking-tighter">
              {data.bride.name}
            </h1>
            {brideEn && (
              <p className="text-white/50 text-xs md:text-sm uppercase tracking-[0.5em] mt-2">{brideEn}</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={phase === 'cover' ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="space-y-4"
        >
          <p className="text-xl md:text-2xl font-serif text-white/90 tracking-[0.2em]">
            {data.date.replace(/-/g, ' . ')}
          </p>
          <p className="text-[13px] md:text-sm text-white/60 uppercase tracking-[0.4em]">
            {data.time}
          </p>

          <div className="pt-5 flex justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 border border-white/30 rounded-full text-white/85 text-[11px] uppercase tracking-[0.3em]">
              Wedding Day
              <span className="font-serif text-sm tracking-normal">D-{daysLeft}</span>
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-24 h-24 border border-white/10 rounded-full z-10 hidden md:block"
      />

      {/* Bottom Label + Scroll Cue */}
      <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 items-end z-20">
        <div className="text-[12px] text-stone-400 rotate-90 origin-left translate-y-[-100%] uppercase tracking-widest">
          Est. {data.date.split('-')[0]}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={phase === 'cover' ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-stone-400 font-bold">Scroll</span>
          <div className="relative w-[1px] h-16 bg-white/15 overflow-hidden">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-0 w-full h-1/2 bg-white/70"
            />
          </div>
        </motion.div>

        <div className="text-[12px] text-stone-400 uppercase tracking-widest leading-loose text-right">
          {data.location.name.split(' ').slice(0, -1).join(' ')}<br />{data.location.name.split(' ').slice(-1)}
        </div>
      </div>
    </section>
  );
};

export default MainCover;
