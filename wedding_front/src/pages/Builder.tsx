import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ACCENT_OPTIONS, defaultBuilderData, saveBuilderData, type BuilderData } from '../data/builder-store';

export default function Builder() {
  const navigate = useNavigate();
  const [form, setForm] = useState<BuilderData>(defaultBuilderData);

  const set = <K extends keyof BuilderData>(key: K, value: BuilderData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    saveBuilderData(form);
    navigate('/invitation');
  };

  let dateLabel = form.date;
  try {
    dateLabel = new Date(form.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    /* keep raw */
  }

  const headFontClass = form.fontMood === 'gothic' ? 'font-sans' : 'font-serif';
  const segBtn = (active: boolean) =>
    `flex-1 text-center py-3 rounded-xl text-[13px] font-bold cursor-pointer border ${
      active ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-500 border-stone-200'
    }`;

  return (
    <div className="min-h-screen bg-[#FFF9F3]">
      <div className="flex items-center justify-between max-w-[1080px] mx-auto px-6 py-6">
        <Link to="/" className="font-serif text-lg font-bold text-stone-800">← 우리, 결혼해요</Link>
        <span className="text-[13px] text-stone-400">Step 1 of 1 · 기본 정보</span>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 pb-20 flex flex-wrap-reverse gap-10 items-start">
        <div className="flex-1 min-w-[320px]">
          <h1 className="font-serif text-3xl text-stone-900 mb-2">청첩장 정보를 입력해주세요</h1>
          <p className="text-sm text-stone-500 mb-8">오른쪽에서 바로 미리보기로 확인할 수 있어요.</p>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[13px] font-bold text-stone-800 mb-2.5">강조 색상</p>
              <div className="flex gap-2.5">
                {ACCENT_OPTIONS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => set('accent', a.hex)}
                    aria-label={a.label}
                    className="w-9 h-9 rounded-full"
                    style={{
                      background: a.hex,
                      border: form.accent === a.hex ? '3px solid #292524' : '3px solid transparent',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[13px] font-bold text-stone-800 mb-2.5">폰트 무드</p>
              <div className="flex gap-2">
                <span onClick={() => set('fontMood', 'serif')} className={segBtn(form.fontMood === 'serif')}>세리프 (우아하게)</span>
                <span onClick={() => set('fontMood', 'gothic')} className={segBtn(form.fontMood === 'gothic')}>고딕 (모던하게)</span>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-bold text-stone-800 mb-2.5">레이아웃 밀도</p>
              <div className="flex gap-2">
                <span onClick={() => set('compact', true)} className={segBtn(form.compact === true)}>컴팩트</span>
                <span onClick={() => set('compact', false)} className={segBtn(form.compact === false)}>여유있게</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-400">신랑 이름</label>
                <input
                  value={form.groomName}
                  onChange={(e) => set('groomName', e.target.value)}
                  className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400">신부 이름</label>
                <input
                  value={form.brideName}
                  onChange={(e) => set('brideName', e.target.value)}
                  className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-400">예식 날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400">예식 시간</label>
                <input
                  value={form.time}
                  onChange={(e) => set('time', e.target.value)}
                  placeholder="오후 1시 (13:00)"
                  className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400">예식장 이름</label>
              <input
                value={form.venueName}
                onChange={(e) => set('venueName', e.target.value)}
                className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400">예식장 주소</label>
              <input
                value={form.venueAddress}
                onChange={(e) => set('venueAddress', e.target.value)}
                className="w-full mt-1 px-3 py-3 bg-white border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <span
              onClick={handleSubmit}
              className="text-center py-4 bg-stone-800 text-white rounded-2xl text-[15px] font-bold cursor-pointer"
            >
              완성된 청첩장 보기 →
            </span>
          </div>
        </div>

        <div className="flex-none w-[260px] sticky top-6">
          <div
            className="w-[260px] h-[500px] rounded-[28px] overflow-hidden relative shadow-2xl"
            style={{ background: '#1a1a1a' }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, #2a2825 0px, #2a2825 18px, #322f2b 18px, #322f2b 36px)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.42), rgba(0,0,0,.06) 55%, rgba(250,250,249,.96) 100%)' }} />
            <div className="absolute inset-4 border border-white/25" />
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-5">
              <p className="text-[10px] tracking-[0.5em] text-white/70 mb-4">SPECIAL INVITATION</p>
              <h2 className={`${headFontClass} text-[28px] m-0`}>{form.groomName}</h2>
              <div className="w-3/5 h-px bg-white/30 my-2.5" />
              <h2 className={`${headFontClass} text-[28px] m-0`}>{form.brideName}</h2>
              <p className="text-xs tracking-[0.2em] text-white/75 mt-4">{dateLabel}</p>
              <span className="inline-block mt-3.5 px-4 py-1.5 border border-white/30 rounded-full text-[11px] text-white/85">
                {form.time}
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-stone-400 mt-3">실시간 미리보기</p>
        </div>
      </div>
    </div>
  );
}
