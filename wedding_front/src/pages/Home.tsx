import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SAMPLE_STYLES = [
  { label: '세이지그린', from: '#EFE9E1', to: '#C9C2AF' },
  { label: '더스티로즈', from: '#F3DCDC', to: '#D79C9C' },
  { label: '샴페인골드', from: '#F1E4CC', to: '#C9A868' },
  { label: '더스티블루', from: '#DCE4EA', to: '#8FA8B8' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <div className="flex items-center justify-between max-w-[1080px] mx-auto px-6 pt-6">
        <span className="font-serif text-xl font-bold text-stone-800 tracking-tight">우리, 결혼해요</span>
        <Link to="/create" className="px-5 py-2.5 bg-stone-800 text-white rounded-full text-[13px] font-bold">
          시작하기
        </Link>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 pt-16 pb-10 flex flex-wrap items-center gap-12">
        <div className="flex-1 min-w-[300px]">
          <span className="inline-block px-3.5 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-5">
            10분이면 완성되는 모바일 청첩장
          </span>
          <h1 className="font-serif text-[42px] md:text-5xl leading-[1.25] text-stone-900 mb-5 tracking-tight text-wrap-pretty">
            두 사람의 이야기를<br />가장 예쁘게 담아요
          </h1>
          <p className="text-base text-stone-500 leading-relaxed mb-8">
            사진 한 장, 이름 한 줄이면 충분해요.<br />색상과 무드를 고르고 바로 완성된 청첩장을 확인하세요.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/create" className="px-8 py-4 bg-stone-800 text-white rounded-2xl text-[15px] font-bold">
              청첩장 제작하기 →
            </Link>
            <a href="#samples" className="px-8 py-4 bg-white text-stone-800 border border-stone-200 rounded-2xl text-[15px] font-bold">
              샘플 보기
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] flex justify-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-60 h-[480px] rounded-[32px] relative overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg,#2a2825,#1a1a1a)' }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, #2a2825 0px, #2a2825 18px, #322f2b 18px, #322f2b 36px)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.4), rgba(0,0,0,.05) 55%, rgba(250,250,249,.95) 100%)' }} />
            <div className="absolute inset-4 border border-white/25" />
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
              <p className="text-[10px] tracking-[0.5em] text-white/70 mb-4">SPECIAL INVITATION</p>
              <h2 className="font-serif text-3xl">이준서</h2>
              <div className="w-3/5 h-px bg-white/30 my-2.5" />
              <h2 className="font-serif text-3xl mb-5">박하은</h2>
              <p className="text-xs tracking-[0.2em] text-white/70">2026 . 10 . 24</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🎨', title: '색상과 폰트를 골라보세요', desc: '세이지그린부터 더스티로즈까지, 세리프와 고딕 무드까지 취향대로.' },
            { icon: '📱', title: '완성된 화면을 바로 확인', desc: '입력하는 순간 실제 청첩장 화면으로 바로 이어져요.' },
            { icon: '💌', title: '참석여부·방명록·계좌까지', desc: '하객 응대에 필요한 기능이 한 화면에 정리되어 있어요.' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-stone-100 rounded-2xl p-7">
              <p className="text-2xl mb-3">{f.icon}</p>
              <p className="font-bold text-[15px] text-stone-900 mb-1.5">{f.title}</p>
              <p className="text-[13px] text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="samples" className="max-w-[1080px] mx-auto px-6 pb-24">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-orange-600 uppercase font-bold mb-2">Style Preview</p>
          <h2 className="font-serif text-[28px] text-stone-900">마음에 드는 무드를 찾아보세요</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {SAMPLE_STYLES.map((s) => (
            <div
              key={s.label}
              className="aspect-[3/4] rounded-2xl flex items-end p-3.5"
              style={{ background: `linear-gradient(160deg, ${s.from}, ${s.to})` }}
            >
              <span className="text-white text-xs font-bold" style={{ textShadow: '0 1px 4px rgba(0,0,0,.2)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-stone-800 py-16 px-6 text-center">
        <h2 className="font-serif text-white text-[26px] mb-5">지금 바로 나만의 청첩장을 만들어보세요</h2>
        <Link to="/create" className="inline-block px-9 py-4 bg-white text-stone-900 rounded-2xl text-[15px] font-bold">
          청첩장 제작하기 →
        </Link>
      </div>
    </div>
  );
}
