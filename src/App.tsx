import { Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { loadWeddingData, loadRsvps, saveRsvps, loadGuestbook, saveGuestbook, type WeddingInfo, type RsvpEntry, type GuestbookEntry } from './data/wedding-info';
import { MapPin, Phone, Copy, Heart, Share2, MessageCircle, Bell, ChevronDown, X, Send, Play, Pause } from 'lucide-react';
import MainCover from './components/MainCover';
import AdminPage from './pages/AdminPage';
import { useEffect, useState, useRef } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
};

function WeddingPage() {
  const [data] = useState<WeddingInfo>(() => loadWeddingData())
  const [rsvps, setRsvps] = useState<RsvpEntry[]>(() => loadRsvps())
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => loadGuestbook())
  const [showRsvpForm, setShowRsvpForm] = useState(false)
  const [showGuestbookForm, setShowGuestbookForm] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleBgm = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false)
      })
    }
  }

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  useEffect(() => {
    saveRsvps(rsvps)
  }, [rsvps])

  useEffect(() => {
    saveGuestbook(guestbook)
  }, [guestbook])

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능을 실행합니다. (실제 운영 시 Kakao SDK 연동 필요)');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  return (
    <main className="max-w-screen-sm mx-auto bg-[#fafaf9] min-h-screen relative shadow-[0_0_150px_rgba(0,0,0,0.1)] selection:bg-stone-900 selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-stone-900 origin-left z-[100]" style={{ scaleX }} />

      {data.bgm.enabled && data.bgm.url && (
        <audio ref={audioRef} src={data.bgm.url} loop preload="auto" />
      )}

      {data.bgm.enabled && data.bgm.url && (
        <div className="fixed bottom-8 right-8 z-[200]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleBgm}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
              isPlaying
                ? 'bg-wedding-primary text-white shadow-wedding-primary/30'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </motion.button>
          {!isPlaying && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-8 right-0 text-[10px] text-stone-400 bg-white px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap"
            >
              {data.bgm.title || '배경음악'}
            </motion.p>
          )}
        </div>
      )}

      <MainCover data={data} />

      <DDayCounter targetDate={data.date} />
      <Greeting data={data} />
      <WeddingCalendar month={new Date(data.date).getMonth()} year={new Date(data.date).getFullYear()} day={parseInt(data.date.split('-')[2])} time={data.time} />
      <GallerySection images={data.gallery} />
      <LocationSection data={data} />

      {data.interview.length > 0 && (
        <InterviewSection interview={data.interview} expanded={expandedFaq} onToggle={setExpandedFaq} />
      )}

      {data.notices.length > 0 && (
        <NoticesSection notices={data.notices} />
      )}

      {data.transportation.length > 0 && (
        <TransportSection items={data.transportation} />
      )}

      <AccountSection data={data} />

      <RsvpSection
        showForm={showRsvpForm}
        onToggle={() => setShowRsvpForm(!showRsvpForm)}
        onSubmit={(entry) => setRsvps(prev => [...prev, entry])}
      />

      <GuestbookSection
        entries={guestbook}
        showForm={showGuestbookForm}
        onToggle={() => setShowGuestbookForm(!showGuestbookForm)}
        onSubmit={(entry) => setGuestbook(prev => [...prev, entry])}
        onDelete={(id) => {
          const pw = prompt('방명록 비밀번호를 입력하세요');
          const entry = guestbook.find(g => g.id === id);
          if (entry && pw === entry.password) {
            setGuestbook(prev => prev.filter(g => g.id !== id));
          } else {
            alert('비밀번호가 올바르지 않습니다.');
          }
        }}
      />

      <Footer data={data} onKakaoShare={handleKakaoShare} onCopyLink={copyLink} />
    </main>
  );
}

const DDayCounter = ({ targetDate }: { targetDate: string }) => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, [targetDate]);

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

const Greeting = ({ data }: { data: WeddingInfo }) => (
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
        {data.message}
      </p>

      <div className="pt-20 border-t border-stone-200 flex flex-col gap-12">
        {[data.groom, data.bride].map((person, i) => (
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
  </section>
);

const WeddingCalendar = ({ month, year, day, time }: { month: number; year: number; day: number; time: string }) => {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <motion.div
      {...fadeInUp}
      className="max-w-md mx-auto mt-24 p-12 bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-50"
    >
      <div className="text-center mb-12 font-serif text-3xl text-stone-800 tracking-tighter">
        {monthNames[month]}
      </div>
      <div className="grid grid-cols-7 gap-y-6 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className={`text-[10px] font-bold tracking-widest pb-4 ${d === 'S' ? 'text-wedding-secondary/60' : 'text-stone-300'}`}>{d}</div>
        ))}
        {Array(startDay).fill(0).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(d => (
          <div key={d} className="relative flex items-center justify-center h-12">
            {d === day ? (
              <div className="relative w-12 h-12 flex items-center justify-center cursor-default">
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
                <span className="relative text-lg text-white font-serif font-bold italic z-10">{d}</span>
              </div>
            ) : (
              <span className={`text-lg transition-all duration-500 ${
                d % 7 === (7 - startDay) % 7 ? 'text-wedding-secondary/80' : 'text-stone-400 hover:text-stone-600'
              }`}>{d}</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col items-center gap-2">
        <p className="text-stone-400 text-[11px] tracking-[0.3em] font-light">CEREMONY AT {time.toUpperCase()}</p>
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

const GallerySection = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) return null;

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
            whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            className="break-inside-avoid rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-200/50 cursor-pointer group relative"
          >
            <img
              src={src}
              alt="Wedding Gallery"
              className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const LocationSection = ({ data }: { data: WeddingInfo }) => (
  <section className="py-32 px-6 bg-white">
    <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <p className="text-[11px] tracking-[0.8em] text-wedding-primary font-bold uppercase">Location</p>
        <h3 className="text-3xl font-serif text-stone-800 tracking-tighter">{data.location.name}</h3>
        {data.location.hall && <p className="text-sm text-wedding-primary font-medium">{data.location.hall}</p>}
        <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">{data.location.address}</p>
      </div>

      <div className="aspect-video rounded-[4rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-[1px] border-stone-100 relative group">
        <div className="absolute inset-[-60px]">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.7460613271424!2d${data.location.lng}!3d${data.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sko!2skr!4v1710000000000`}
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
          href={`tel:${data.location.phone}`}
          className="flex items-center justify-center gap-3 px-12 py-6 bg-white rounded-full text-[13px] font-bold text-stone-600 shadow-sm border border-stone-100"
        >
          <Phone size={16} /> CALL HOTEL
        </motion.a>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#333" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 px-12 py-6 bg-stone-800 text-white rounded-full text-[13px] font-bold shadow-2xl shadow-stone-400"
          onClick={() => {
            const url = `https://map.kakao.com/link/to/${encodeURIComponent(data.location.name)},${data.location.lat},${data.location.lng}`;
            window.open(url, '_blank');
          }}
        >
          <MapPin size={16} /> GET DIRECTIONS
        </motion.button>
      </div>
    </motion.div>
  </section>
);

const InterviewSection = ({ interview, expanded, onToggle }: {
  interview: { question: string; answer: string }[]
  expanded: number | null
  onToggle: (i: number | null) => void
}) => (
  <section className="py-32 px-6 bg-white">
    <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
      <div className="text-center mb-20">
        <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">Q&A</p>
        <h2 className="text-3xl font-serif text-stone-800 tracking-tighter mt-4 italic">Love Story</h2>
      </div>
      <div className="space-y-4">
        {interview.map((item, i) => (
          <div key={i} className="bg-stone-50 rounded-2xl overflow-hidden">
            <button
              onClick={() => onToggle(expanded === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="text-sm font-bold text-stone-800">{item.question}</span>
              <motion.div
                animate={{ rotate: expanded === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-stone-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm text-stone-600 leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

const NoticesSection = ({ notices }: { notices: { title: string; content: string }[] }) => (
  <section className="py-20 px-6 bg-[#fafaf9]">
    <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">Notice</p>
        <h2 className="text-2xl font-serif text-stone-800 tracking-tighter mt-3">안내사항</h2>
      </div>
      <div className="space-y-4">
        {notices.map((n, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 mb-2">{n.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

const TransportSection = ({ items }: { items: { method: string; description: string }[] }) => (
  <section className="py-20 px-6 bg-white">
    <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">Transport</p>
        <h2 className="text-2xl font-serif text-stone-800 tracking-tighter mt-3">오시는 길</h2>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-stone-50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-stone-800 mb-2">{item.method}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

const AccountSection = ({ data }: { data: WeddingInfo }) => {
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
            { label: `신랑 ${data.groom.name}`, info: data.groom },
            { label: `신부 ${data.bride.name}`, info: data.bride }
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

const RsvpSection = ({ showForm, onToggle, onSubmit }: {
  showForm: boolean
  onToggle: () => void
  onSubmit: (entry: RsvpEntry) => void
}) => {
  const [name, setName] = useState('')
  const [side, setSide] = useState<'groom' | 'bride'>('groom')
  const [guests, setGuests] = useState(1)
  const [attending, setAttending] = useState(true)
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      side,
      guests,
      attending,
      message: message.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    })
    setSubmitted(true)
    setName('')
    setSide('groom')
    setGuests(1)
    setAttending(true)
    setMessage('')
    setPhone('')
    setTimeout(() => {
      setSubmitted(false)
      onToggle()
    }, 2000)
  }

  return (
    <section className="py-24 px-6 bg-white">
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">RSVP</p>
        <h2 className="text-2xl font-serif text-stone-800 tracking-tighter mt-3 mb-2">참석 여부</h2>
        <p className="text-sm text-stone-400 mb-8">소중한 분들의 참석 여부를 알려주세요</p>

        {!showForm && !submitted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className="px-10 py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold"
          >
            참석 여부 전달하기
          </motion.button>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="overflow-hidden text-left"
            >
              <div className="bg-stone-50 rounded-2xl p-6 space-y-4 mt-6">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">이름</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">연락처</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="010-xxxx-xxxx"
                    required
                    className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest">구분</label>
                    <select
                      value={side}
                      onChange={e => setSide(e.target.value as 'groom' | 'bride')}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                    >
                      <option value="groom">신랑측</option>
                      <option value="bride">신부측</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-widest">인원</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={guests}
                      onChange={e => setGuests(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">참석 여부</label>
                  <div className="flex gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                        attending ? 'bg-wedding-primary text-white' : 'bg-white text-stone-500 border border-stone-200'
                      }`}
                    >
                      참석
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                        !attending ? 'bg-stone-400 text-white' : 'bg-white text-stone-500 border border-stone-200'
                      }`}
                    >
                      불참
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">메시지 (선택)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send size={14} /> 전송하기
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-wedding-primary text-sm font-bold mt-6"
          >
            감사합니다. 참석 여부가 전달되었습니다.
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};

const GuestbookSection = ({ entries, showForm, onToggle, onSubmit, onDelete }: {
  entries: GuestbookEntry[]
  showForm: boolean
  onToggle: () => void
  onSubmit: (entry: GuestbookEntry) => void
  onDelete: (id: string) => void
}) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !password.trim()) return
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      password,
      createdAt: new Date().toISOString(),
    })
    setSubmitted(true)
    setName('')
    setPassword('')
    setMessage('')
    setTimeout(() => {
      setSubmitted(false)
      onToggle()
    }, 2000)
  }

  return (
    <section className="py-24 px-6 bg-[#fafaf9]">
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-wedding-primary uppercase font-bold">Guestbook</p>
          <h2 className="text-2xl font-serif text-stone-800 tracking-tighter mt-3 mb-2">방명록</h2>
          <p className="text-sm text-stone-400">축하 메시지를 남겨주세요</p>
        </div>

        {!showForm && !submitted && (
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggle}
              className="px-10 py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold"
            >
              방명록 작성하기
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm border border-stone-100">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">이름</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">비밀번호 (삭제 시 필요)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest">메시지</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send size={14} /> 남기기
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-wedding-primary text-sm font-bold text-center mb-12"
          >
            방명록이 등록되었습니다. 감사합니다.
          </motion.p>
        )}

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-12">아직 방명록이 없습니다. 첫 메시지를 남겨주세요!</p>
          ) : (
            entries.slice().reverse().map(entry => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {entry.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{entry.name}</p>
                      <p className="text-[10px] text-stone-400">{new Date(entry.createdAt).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const pw = prompt('비밀번호를 입력하세요');
                      if (pw === entry.password) {
                        onDelete(entry.id);
                      } else if (pw !== null) {
                        alert('비밀번호가 올바르지 않습니다.');
                      }
                    }}
                    className="text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{entry.message}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
};

const Footer = ({ data, onKakaoShare, onCopyLink }: {
  data: WeddingInfo
  onKakaoShare: () => void
  onCopyLink: () => void
}) => (
  <footer className="py-40 bg-[#1a1a1a] text-center px-10 relative overflow-hidden">
    <motion.div {...fadeInUp} className="relative z-10 space-y-16">
      <div className="flex flex-col items-center gap-8">
        <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase">Share our love</p>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#FEE500" }}
            whileTap={{ scale: 0.9 }}
            onClick={onKakaoShare}
            className="w-16 h-16 bg-[#FEE500] text-[#3C1E1E] rounded-full flex items-center justify-center shadow-2xl shadow-yellow-900/40"
          >
            <MessageCircle size={24} className="fill-current" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopyLink}
            className="w-16 h-16 bg-white/5 text-white/40 rounded-full flex items-center justify-center border border-white/10 hover:text-stone-900"
          >
            <Share2 size={24} />
          </motion.button>
        </div>
      </div>

      <div className="pt-20 border-t border-white/5 space-y-6">
        <p className="text-[10px] tracking-[1em] text-stone-600 uppercase italic">Everlasting</p>
        <p className="text-sm text-stone-400 font-serif italic tracking-widest uppercase">
          {data.groom.name} & {data.bride.name}
        </p>
        <p className="text-[9px] text-stone-700 font-light mt-10">© 2024 BESPOKE WEDDING INVITATION</p>
      </div>
    </motion.div>
  </footer>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<WeddingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
