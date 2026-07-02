import { Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  fetchWeddingInfo, fetchGuestbook, submitRsvp, submitGuestbookEntry, deleteGuestbookEntry,
  type WeddingInfo, type RsvpEntry, type GuestbookEntry,
} from './data/wedding-info';
import { MapPin, Phone, Copy, Heart, Share2, MessageCircle, X, Send, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import MainCover from './components/MainCover';
import { useEffect, useState, useRef } from 'react';
import Home from './pages/Home';
import Builder from './pages/Builder';
import { loadBuilderData, applyBuilderTheme } from './data/builder-store';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
};

const SectionNav = () => {
  const sections = [
    { id: 'cover', label: 'Cover' },
    { id: 'greeting', label: 'Greeting' },
    { id: 'interview', label: 'Interview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'location', label: 'Location' },
    { id: 'connect', label: 'Connect' },
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.findIndex(s => s.id === entry.target.id)
          if (idx !== -1) setActive(idx)
        }
      })
    }, { rootMargin: '-45% 0px -45% 0px' })

    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean)
    els.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            i === active ? 'bg-stone-900 scale-150' : 'bg-stone-300/60 hover:bg-stone-400/80'
          }`}
          aria-label={s.label}
        />
      ))}
    </nav>
  )
}

function WeddingPage() {
  const [data, setData] = useState<WeddingInfo | null>(null)
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([])
  const [showRsvpForm, setShowRsvpForm] = useState(false)
  const [showGuestbookForm, setShowGuestbookForm] = useState(false)
  const [showQr, setShowQr] = useState(false)
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
    const overrides = loadBuilderData()
    applyBuilderTheme(overrides)
    fetchWeddingInfo()
      .then(info => {
        if (!overrides) { setData(info); return; }
        setData({
          ...info,
          groom: { ...info.groom, name: overrides.groomName || info.groom.name },
          bride: { ...info.bride, name: overrides.brideName || info.bride.name },
          date: overrides.date || info.date,
          time: overrides.time || info.time,
          location: { ...info.location, name: overrides.venueName || info.location.name, address: overrides.venueAddress || info.location.address },
        })
      })
      .catch(() => {})
    fetchGuestbook().then(setGuestbook).catch(() => {})
  }, [])

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능을 실행합니다. (실제 운영 시 Kakao SDK 연동 필요)');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  if (!data) return null;

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
              className="absolute -top-8 right-0 text-[15px] text-stone-400 bg-white px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap"
            >
              {data.bgm.title || '배경음악'}
            </motion.p>
          )}
        </div>
      )}

      {/* Mobile QR Button */}
      <div className="fixed bottom-8 left-8 z-[200]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQr(!showQr)}
          className="w-10 h-10 bg-white text-stone-500 rounded-full flex items-center justify-center shadow-lg border border-stone-200 text-[15px] font-bold tracking-tight"
        >
          QR
        </motion.button>
        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-14 left-0 bg-white rounded-2xl p-4 shadow-2xl border border-stone-100"
            >
              <p className="text-[13px] text-stone-400 text-center mb-2 tracking-widest uppercase">Mobile View</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`}
                alt="QR Code"
                className="w-36 h-36 rounded-xl"
              />
              <p className="text-[12px] text-stone-400 text-center mt-2">QR을 스캔하여 모바일에서 열기</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SectionNav />

      <div id="cover"><MainCover data={data} /></div>
      <div id="greeting"><Greeting data={data} /></div>
      <div id="interview"><InterviewSection interview={data.interview} /></div>
      <div id="gallery"><GallerySection images={data.gallery} /></div>
      <div id="location"><LocationSection data={data} transportation={data.transportation} notices={data.notices} /></div>

      <div id="connect">
        <ConnectSection
          data={data}
          guestbook={guestbook}
          showRsvpForm={showRsvpForm}
          onToggleRsvp={() => setShowRsvpForm(!showRsvpForm)}
          onSubmitRsvp={(entry) => {
            submitRsvp({
              name: entry.name, side: entry.side, guests: entry.guests,
              attending: entry.attending, message: entry.message, phone: entry.phone,
            }).catch(() => {})
          }}
          showGuestbookForm={showGuestbookForm}
          onToggleGuestbook={() => setShowGuestbookForm(!showGuestbookForm)}
          onSubmitGuestbook={(entry) => {
            submitGuestbookEntry(entry)
              .then(saved => setGuestbook(prev => [...prev, saved]))
              .catch(() => {})
          }}
          onDeleteGuestbook={(id, password) => {
            deleteGuestbookEntry(id, password)
              .then(ok => {
                if (ok) {
                  setGuestbook(prev => prev.filter(g => g.id !== id));
                } else {
                  alert('비밀번호가 올바르지 않습니다.');
                }
              })
              .catch(() => alert('삭제에 실패했습니다.'))
          }}
        />
      </div>

      <div id="footer"><Footer data={data} onKakaoShare={handleKakaoShare} onCopyLink={copyLink} /></div>
    </main>
  );
}

/** 특정 날짜가 속한 달의 달력 그리드를 만든다. */
const getCalendarGrid = (dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  const targetDate = d.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { targetDate, weeks };
};

const CalendarWidget = ({ date }: { date: string }) => {
  const { targetDate, weeks } = getCalendarGrid(date);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6">
      <p className="text-center font-serif text-sm text-stone-500 tracking-[0.3em] uppercase mb-5">
        {new Date(date).toLocaleDateString('en', { month: 'long' })} {new Date(date).getFullYear()}
      </p>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {dayLabels.map((d, i) => (
          <span key={i} className="text-[11px] text-stone-300 uppercase tracking-widest">{d}</span>
        ))}
        {weeks.flat().map((day, i) => (
          <span key={i} className="flex items-center justify-center h-9">
            {day && (
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-[13px] transition-colors ${
                  day === targetDate ? 'bg-wedding-primary text-white font-bold' : 'text-stone-500'
                }`}
              >
                {day}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

const Greeting = ({ data }: { data: WeddingInfo }) => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const target = new Date(data.date).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, [data.date]);

  return (
  <section className="py-10 md:py-12 px-8 text-center bg-[#fafaf9] relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="max-w-lg mx-auto space-y-6"
    >
      <div className="relative flex flex-col items-center">
        <Heart size={20} className="text-wedding-secondary/40 fill-wedding-secondary/10 relative z-10" />
      </div>

      <p className="text-stone-700 font-serif font-light leading-[2.1] text-base md:text-lg whitespace-pre-line px-2">
        {data.message}
      </p>

      <div className="space-y-3">
        <CalendarWidget date={data.date} />

        <div className="bg-white rounded-2xl p-6 border border-stone-100 space-y-2">
          <p className="text-[13px] tracking-[0.4em] text-wedding-primary uppercase font-bold">Wedding Day</p>
          <p className="text-base font-serif text-stone-800">
            {new Date(data.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
          <p className="text-sm text-stone-500">{data.time}</p>
          <div className="w-6 h-[1px] bg-stone-200 mx-auto my-3" />
          <p className="text-sm text-stone-700 font-medium">{data.location.name}</p>
          {data.location.hall && <p className="text-[13px] text-wedding-primary">{data.location.hall}</p>}
          <p className="text-[13px] text-stone-400">{data.location.address}</p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-wedding-primary/10 text-wedding-primary text-[13px] font-bold rounded-full">
              D-{daysLeft}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
        {[data.groom, data.bride].map((person, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between group px-4"
          >
            <div className="text-left">
              <p className="text-[12px] text-stone-400 mb-0.5 uppercase tracking-widest">Parent</p>
              <p className="text-[13px] text-stone-600 font-light leading-relaxed">
                {person.parents.father} <span className="text-stone-300 mx-0.5">·</span> {person.parents.mother}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-wedding-primary/60 italic font-medium uppercase tracking-tighter">
                {person.parentRelation}
              </span>
              <span className="font-serif text-2xl md:text-3xl text-stone-900 tracking-tighter group-hover:italic transition-all">
                {person.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);}

const InterviewSection = ({ interview }: { interview: { question: string; answer: string }[] }) => {
  if (!interview || interview.length === 0) return null;

  return (
    <section className="py-8 md:py-10 px-6 bg-white">
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-stone-800 tracking-tighter italic">We Asked</h2>
          <p className="text-[13px] tracking-[0.5em] text-wedding-primary uppercase mt-3">Interview</p>
        </div>
        <div className="space-y-4">
          {interview.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-b border-stone-100 pb-4 last:border-0 last:pb-0"
            >
              <p className="font-serif italic text-wedding-primary text-lg mb-2">Q. {item.question}</p>
              <p className="text-stone-600 text-[15px] leading-relaxed pl-4">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const GallerySection = ({ images }: { images: string[] }) => {
  const [selected, setSelected] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const showPrev = () => setSelected(s => (s === null ? null : (s - 1 + images.length) % images.length));
  const showNext = () => setSelected(s => (s === null ? null : (s + 1) % images.length));

  return (
    <section className="py-8 md:py-10 bg-[#fafaf9]">
      <motion.div {...fadeInUp} className="text-center mb-6">
        <h2 className="text-2xl font-serif text-stone-800 tracking-tighter mb-2 italic">The Moments</h2>
        <p className="text-[13px] tracking-[0.5em] text-wedding-primary uppercase">Eternal Love</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-1.5 px-6 max-w-5xl mx-auto">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            onClick={() => setSelected(i)}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
          >
            <img
              src={src}
              alt="Wedding Gallery"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center px-4"
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-white/70 hover:text-white">
              <X size={22} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); showPrev(); }}
              className="absolute left-3 md:left-8 text-white/60 hover:text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[selected]}
              alt="Gallery view"
              onClick={e => e.stopPropagation()}
              className="max-h-[85vh] max-w-full object-contain rounded-lg"
            />
            <button
              onClick={e => { e.stopPropagation(); showNext(); }}
              className="absolute right-3 md:right-8 text-white/60 hover:text-white"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const LocationSection = ({ data, transportation, notices }: { data: WeddingInfo; transportation: { method: string; description: string }[]; notices: { title: string; content: string }[] }) => (
  <section className="py-8 md:py-10 px-6 bg-white">
    <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <p className="text-[15px] tracking-[0.8em] text-wedding-primary font-bold uppercase">Location</p>
        <h3 className="text-2xl font-serif text-stone-800 tracking-tighter">{data.location.name}</h3>
        {data.location.hall && <p className="text-sm text-wedding-primary font-medium">{data.location.hall}</p>}
        <p className="text-[15px] text-stone-500 font-light max-w-xs mx-auto">{data.location.address}</p>
      </div>

      <div className="aspect-video rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-stone-100 relative group">
        <div className="absolute inset-[-60px]">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.7460613271424!2d${data.location.lng}!3d${data.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sko!2skr!4v1710000000000`}
            className="w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <motion.a
          whileHover={{ scale: 1.05, backgroundColor: "#fafaf9" }}
          whileTap={{ scale: 0.95 }}
          href={`tel:${data.location.phone}`}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-full text-[15px] font-bold text-stone-600 shadow-sm border border-stone-100"
        >
          <Phone size={14} /> CALL
        </motion.a>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#333" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-stone-800 text-white rounded-full text-[15px] font-bold shadow-xl shadow-stone-400"
          onClick={() => {
            const url = `https://map.kakao.com/link/to/${encodeURIComponent(data.location.name)},${data.location.lat},${data.location.lng}`;
            window.open(url, '_blank');
          }}
        >
          <MapPin size={14} /> NAVI
        </motion.button>
      </div>

      {transportation.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-stone-100">
          <p className="text-[13px] tracking-[0.5em] text-wedding-primary font-bold uppercase text-center">오시는 길</p>
          {transportation.map((item, i) => (
            <div key={i} className="bg-stone-50 rounded-xl p-3">
              <p className="text-[14px] font-bold text-stone-800 mb-1">{item.method}</p>
              <p className="text-[14px] text-stone-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {notices && notices.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-stone-100">
          <p className="text-[13px] tracking-[0.5em] text-wedding-primary font-bold uppercase text-center">Notice</p>
          {notices.map((n, i) => (
            <div key={i} className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-[13px] font-bold text-stone-800 mb-1">{n.title}</p>
              <p className="text-[13px] text-stone-500 leading-relaxed whitespace-pre-line">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  </section>
);

const ConnectSection = ({
  data, guestbook,
  showRsvpForm, onToggleRsvp, onSubmitRsvp,
  showGuestbookForm, onToggleGuestbook, onSubmitGuestbook, onDeleteGuestbook,
}: {
  data: WeddingInfo
  guestbook: GuestbookEntry[]
  showRsvpForm: boolean
  onToggleRsvp: () => void
  onSubmitRsvp: (entry: RsvpEntry) => void
  showGuestbookForm: boolean
  onToggleGuestbook: () => void
  onSubmitGuestbook: (entry: { name: string; message: string; password: string }) => void
  onDeleteGuestbook: (id: string, password: string) => void
}) => {
  const [tab, setTab] = useState<'account' | 'rsvp' | 'guestbook'>('account');
  const tabs = [
    { key: 'account' as const, label: '마음 전하실 곳' },
    { key: 'rsvp' as const, label: '참석 여부' },
    { key: 'guestbook' as const, label: '방명록' },
  ];

  return (
    <section className="py-8 md:py-10 px-6 bg-[#fafaf9]">
      <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
        <div className="flex gap-1 mb-6 bg-white rounded-full p-1 border border-stone-100 max-w-md mx-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-colors ${
                tab === t.key ? 'bg-stone-900 text-white' : 'text-stone-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'account' && <AccountPanel data={data} />}
        {tab === 'rsvp' && <RsvpPanel showForm={showRsvpForm} onToggle={onToggleRsvp} onSubmit={onSubmitRsvp} />}
        {tab === 'guestbook' && (
          <GuestbookPanel
            entries={guestbook}
            showForm={showGuestbookForm}
            onToggle={onToggleGuestbook}
            onSubmit={onSubmitGuestbook}
            onDelete={onDeleteGuestbook}
          />
        )}
      </motion.div>
    </section>
  );
};

const AccountPanel = ({ data }: { data: WeddingInfo }) => {
  const [revealed, setRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (num: string, key: string) => {
    navigator.clipboard.writeText(num);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return !revealed ? (
    <div className="text-center py-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setRevealed(true)}
        className="px-8 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold"
      >
        마음 전하실 곳 보기
      </motion.button>
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {[
        { label: `신랑 ${data.groom.name}`, info: data.groom, key: 'groom' },
        { label: `신부 ${data.bride.name}`, info: data.bride, key: 'bride' }
      ].map((side) => (
        <div key={side.key} className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 space-y-4">
          <div className="text-center border-b border-stone-100 pb-4">
            <p className="text-[12px] text-stone-400 uppercase tracking-widest">{side.label}</p>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[11px] text-stone-400 uppercase tracking-widest">{side.info.account.bank}</p>
              <p className="text-base font-serif text-stone-800 tracking-tighter">{side.info.account.number}</p>
              <p className="text-[13px] text-stone-500 font-light">예금주: {side.info.account.owner}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => copy(side.info.account.number, side.key)}
              className="p-3 bg-stone-50 rounded-full text-stone-300 hover:text-wedding-primary transition-colors relative"
            >
              <Copy size={14} />
              {copiedKey === side.key && (
                <span className="absolute -top-9 right-0 text-[11px] bg-stone-900 text-white px-2 py-1 rounded-md whitespace-nowrap">
                  복사됨
                </span>
              )}
            </motion.button>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const RsvpPanel = ({ showForm, onToggle, onSubmit }: {
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
    <div className="text-center">
      <p className="text-[14px] text-stone-400 mb-5">소중한 분들의 참석 여부를 알려주세요</p>

        {!showForm && !submitted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className="px-8 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold"
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
              <div className="bg-white rounded-2xl p-5 space-y-3 mt-4 border border-stone-100">
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">이름</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">연락처</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="010-xxxx-xxxx"
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[15px] text-stone-400 uppercase tracking-widest">구분</label>
                    <select
                      value={side}
                      onChange={e => setSide(e.target.value as 'groom' | 'bride')}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                    >
                      <option value="groom">신랑측</option>
                      <option value="bride">신부측</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[15px] text-stone-400 uppercase tracking-widest">인원</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={guests}
                      onChange={e => setGuests(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">참석 여부</label>
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
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">메시지 (선택)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
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
    </div>
  );
};

const GuestbookPanel = ({ entries, showForm, onToggle, onSubmit, onDelete }: {
  entries: GuestbookEntry[]
  showForm: boolean
  onToggle: () => void
  onSubmit: (entry: { name: string; message: string; password: string }) => void
  onDelete: (id: string, password: string) => void
}) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !password.trim()) return
    onSubmit({
      name: name.trim(),
      message: message.trim(),
      password,
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

  const ordered = entries.slice().reverse();
  const visible = showAll ? ordered : ordered.slice(0, 3);

  return (
    <div>
        <p className="text-[14px] text-stone-400 text-center mb-5">축하 메시지를 남겨주세요</p>

        {!showForm && !submitted && (
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggle}
              className="px-8 py-3 bg-stone-900 text-white rounded-2xl text-sm font-bold"
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
              className="overflow-hidden mb-8"
            >
              <div className="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-stone-100">
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">이름</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">비밀번호 (삭제 시 필요)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  />
                </div>
                <div>
                  <label className="text-[15px] text-stone-400 uppercase tracking-widest">메시지</label>
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
              className="text-wedding-primary text-sm font-bold text-center mb-6"
            >
              방명록이 등록되었습니다. 감사합니다.
          </motion.p>
        )}

        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">아직 방명록이 없습니다. 첫 메시지를 남겨주세요!</p>
          ) : (
            visible.map(entry => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 border border-stone-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center text-white text-[13px] font-bold">
                      {entry.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{entry.name}</p>
                      <p className="text-[12px] text-stone-400">{new Date(entry.createdAt).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const pw = prompt('비밀번호를 입력하세요');
                      if (pw !== null) {
                        onDelete(entry.id, pw);
                      }
                    }}
                    className="text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{entry.message}</p>
              </div>
            ))
          )}
          {ordered.length > 3 && (
            <button onClick={() => setShowAll(s => !s)} className="w-full text-center text-[13px] text-stone-400 py-2 hover:text-stone-600">
              {showAll ? '접기' : `방명록 ${ordered.length}개 모두 보기`}
            </button>
          )}
        </div>
    </div>
  );
};

const Footer = ({ data, onKakaoShare, onCopyLink }: {
  data: WeddingInfo
  onKakaoShare: () => void
  onCopyLink: () => void
}) => (
  <footer className="py-8 bg-gradient-to-t from-[#1a1a1a] to-[#2a2a2a] text-center px-8 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <motion.div {...fadeInUp} className="relative z-10 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <p className="text-white/40 text-[12px] tracking-[0.5em] uppercase font-light">SNS</p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#FEE500" }}
            whileTap={{ scale: 0.9 }}
            onClick={onKakaoShare}
            className="w-10 h-10 bg-[#FEE500] text-[#3C1E1E] rounded-full flex items-center justify-center shadow-lg shadow-yellow-900/30"
          >
            <MessageCircle size={16} className="fill-current" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopyLink}
            className="w-10 h-10 bg-white/5 text-white/40 rounded-full flex items-center justify-center border border-white/10 hover:text-stone-900"
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[13px] tracking-[0.4em] text-stone-500 uppercase font-serif italic">
          {data.groom.name} &middot; {data.bride.name}
        </p>
        <p className="text-[12px] text-stone-700 font-light tracking-widest">
          서로의 마음을 전합니다
        </p>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[11px] text-stone-800 font-light tracking-[0.3em]">© 2024 WEDDING INVITATION</p>
      </div>
    </motion.div>
  </footer>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Builder />} />
      <Route path="/invitation" element={<WeddingPage />} />
    </Routes>
  );
}

export default App;
