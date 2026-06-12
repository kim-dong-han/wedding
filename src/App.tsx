import { motion, useScroll, useSpring } from 'framer-motion';
import { weddingData } from './data/wedding-info';
import { MapPin, Phone, Copy, Heart, Share2, MessageCircle, Bell } from 'lucide-react';
import MainCover from './components/MainCover';
import { useEffect, useState } from 'react';

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
};

// --- D-Day Counter Component ---
const DDayCounter = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const target = new Date(weddingData.date).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  return (
    <motion.div {...fadeInUp} className="flex flex-col items-center gap-4 py-10">
      <div className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">Countdown</div>
      <div className="text-5xl font-serif text-stone-800 tracking-tighter">
        D-{daysLeft}
      </div>
      <div className="flex gap-1">
        {Array(3).fill(0).map((_, i) => <div key={i} className="w-1 h-1 bg-wedding-secondary/30 rounded-full" />)}
      </div>
    </motion.div>
  );
};

// --- Calendar Section (Luxury Style) ---
const WeddingCalendar = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 2; 
  const targetDate = 26;

  return (
    <motion.div 
      {...fadeInUp}
      className="max-w-md mx-auto mt-24 p-12 bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-50"
    >
      <div className="text-center mb-12 font-serif text-3xl text-stone-800 tracking-tighter">
        October
      </div>
      <div className="grid grid-cols-7 gap-y-6 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className={`text-[10px] font-bold tracking-widest pb-4 ${d === 'S' ? 'text-wedding-secondary/60' : 'text-stone-300'}`}>{d}</div>
        ))}
        {Array(startDay).fill(0).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(d => (
          <div 
            key={d} 
            className="relative flex items-center justify-center h-12"
          >
            {d === targetDate ? (
              <div className="relative w-12 h-12 flex items-center justify-center cursor-default">
                {/* Fixed Background Circle with Soft Trending Color (Sage Green) */}
                <motion.div 
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                    boxShadow: [
                      "0 4px 10px rgba(142,151,117,0.2)",
                      "0 4px 20px rgba(142,151,117,0.4)",
                      "0 4px 10px rgba(142,151,117,0.2)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-wedding-primary rounded-full"
                />
                <span className="relative text-lg text-white font-serif font-bold italic z-10">
                  {d}
                </span>
              </div>
            ) : (
              <span className={`text-lg transition-all duration-500 ${
                d % 7 === (7 - startDay) % 7 
                  ? 'text-wedding-secondary/80' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}>
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col items-center gap-2">
        <p className="text-stone-400 text-[11px] tracking-[0.3em] font-light">CEREMONY AT 1:00 PM</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="text-[10px] text-wedding-primary flex items-center gap-1 border-b border-wedding-primary/20 pb-0.5 mt-4"
        >
          <Bell size={10} /> 캘린더에 일정 추가하기
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Masonry Gallery ---
const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <section className="py-32 bg-[#fafaf9]">
      <motion.div {...fadeInUp} className="text-center mb-24">
        <h2 className="text-4xl font-serif text-stone-800 tracking-tighter mb-4 italic">The Moments</h2>
        <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase">Eternal Love</p>
      </motion.div>
      <div className="columns-2 gap-6 px-6 max-w-5xl mx-auto space-y-6">
        {images.map((src, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              transition: { duration: 0.3 }
            }}
            className="break-inside-avoid rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-200/50 cursor-pointer group relative"
          >
            <motion.img 
              src={src} 
              alt="Wedding Gallery" 
              className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Location Section (Clean Color Map) ---
const Location = () => {
  return (
    <section className="py-32 px-6 bg-white">
      <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <p className="text-[11px] tracking-[0.8em] text-wedding-primary font-bold uppercase">Location</p>
          <h3 className="text-3xl font-serif text-stone-800 tracking-tighter">{weddingData.location.name}</h3>
          <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">{weddingData.location.address}</p>
        </div>

        <div className="aspect-video rounded-[4rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-[1px] border-stone-100 relative group">
          <div className="absolute inset-[-60px]">
            <iframe 
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.7460613271424!2d127.0173!3d37.5165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3f70678d91f%3A0xc6f3f009e4f55!2z642UIOumrOuyhOyCrOydtOuTnCDtmLj some placeholder text!5e0!3m2!1sko!2skr!4v1710000000000`} 
              className="w-full h-full border-0 saturate-[1.1] contrast-[1.05]" 
              allowFullScreen={false} 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a 
            whileHover={{ scale: 1.05, backgroundColor: "#fafaf9" }}
            whileTap={{ scale: 0.95 }}
            href={`tel:${weddingData.location.phone}`} 
            className="flex items-center justify-center gap-3 px-12 py-6 bg-white rounded-full text-[13px] font-bold text-stone-600 shadow-sm border border-stone-100"
          >
            <Phone size={16} /> CALL HOTEL
          </motion.a>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#333" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 px-12 py-6 bg-stone-800 text-white rounded-full text-[13px] font-bold shadow-2xl shadow-stone-400"
          >
            <MapPin size={16} /> GET DIRECTIONS
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

// --- Account Section ---
const AccountSection = () => {
  const copy = (num: string) => {
    navigator.clipboard.writeText(num);
    alert('계좌번호가 복사되었습니다.');
  };

  return (
    <section className="py-32 px-6 bg-[#fafaf9]">
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto space-y-20">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-stone-800 tracking-tighter italic">Gift for the Couple</h2>
          <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase mt-4">Registry</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "신랑 김철수", info: weddingData.groom },
            { label: "신부 이영희", info: weddingData.bride }
          ].map((side, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-stone-200/40 border border-stone-50 space-y-6"
            >
              <div className="text-center border-b border-stone-100 pb-6">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">{side.label}</p>
                <p className="text-xs text-wedding-primary font-bold">마음 전하실 곳</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest">{side.info.account.bank}</p>
                    <p className="text-lg font-serif text-stone-800 tracking-tighter">{side.info.account.number}</p>
                    <p className="text-[11px] text-stone-500 font-light">예금주: {side.info.account.owner}</p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => copy(side.info.account.number)}
                    className="p-4 bg-stone-50 rounded-full text-stone-300 hover:text-wedding-primary transition-colors"
                  >
                    <Copy size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// --- App Root (Final Deployment Trigger) ---
function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능을 실행합니다. (실제 운영 시 Kakao SDK 연동 필요)');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  return (
    <main className="max-w-screen-sm mx-auto bg-[#fafaf9] min-h-screen relative shadow-[0_0_150px_rgba(0,0,0,0.1)] selection:bg-stone-900 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-stone-900 origin-left z-[100]" style={{ scaleX }} />
      
      <MainCover />
      <DDayCounter />
      
      {/* Greeting */}
      <section className="py-40 px-10 text-center bg-[#fafaf9] relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="max-w-lg mx-auto space-y-24"
        >
          <div className="relative flex flex-col items-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 w-24 h-24 border border-stone-200 rounded-full border-dashed"
            />
            <Heart size={32} className="text-wedding-secondary/30 fill-wedding-secondary/5 relative z-10" />
          </div>
          
          <p className="text-stone-700 font-serif font-light leading-[2.8] text-xl md:text-3xl whitespace-pre-line italic px-4 tracking-tighter">
            {weddingData.message}
          </p>
          
          <div className="pt-20 border-t border-stone-200 flex flex-col gap-12">
            {[weddingData.groom, weddingData.bride].map((person, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between group px-6"
              >
                <div className="text-left">
                  <p className="text-[10px] text-stone-400 mb-1 uppercase tracking-widest">Parent</p>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {person.parents.father} <span className="text-stone-300 mx-1">·</span> {person.parents.mother}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[11px] text-wedding-primary/60 italic font-medium uppercase tracking-tighter">
                    {person.parentRelation}
                  </span>
                  <span className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tighter group-hover:italic transition-all">
                    {person.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <WeddingCalendar />
      </section>

      <Gallery />
      <Location />
      <AccountSection />

      {/* Share & Footer */}
      <footer className="py-40 bg-[#1a1a1a] text-center px-10 relative overflow-hidden">
        <motion.div {...fadeInUp} className="relative z-10 space-y-16">
          <div className="flex flex-col items-center gap-8">
            <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase">Share our love</p>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "#FEE500" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleKakaoShare}
                className="w-16 h-16 bg-[#FEE500] text-[#3C1E1E] rounded-full flex items-center justify-center shadow-2xl shadow-yellow-900/40"
              >
                <MessageCircle size={24} className="fill-current" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                whileTap={{ scale: 0.9 }}
                onClick={copyLink}
                className="w-16 h-16 bg-white/5 text-white/40 rounded-full flex items-center justify-center border border-white/10 hover:text-stone-900"
              >
                <Share2 size={24} />
              </motion.button>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 space-y-6">
            <p className="text-[10px] tracking-[1em] text-stone-600 uppercase italic">Everlasting</p>
            <p className="text-sm text-stone-400 font-serif italic tracking-widest uppercase">
              {weddingData.groom.name} & {weddingData.bride.name}
            </p>
            <p className="text-[9px] text-stone-700 font-light mt-10">© 2024 BESPOKE WEDDING INVITATION</p>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}

export default App;
