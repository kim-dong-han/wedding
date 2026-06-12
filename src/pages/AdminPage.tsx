import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  type WeddingInfo, type RsvpEntry, type GuestbookEntry,
  loadWeddingData, saveWeddingData,
  loadRsvps, saveRsvps,
  loadGuestbook, saveGuestbook
} from '../data/wedding-info'
import { Lock, Save, LogOut, Image, MessageCircle, Bell, Truck, Users, BookOpen, Plus, Trash2, Download, ChevronDown, ChevronUp, LayoutDashboard, Music } from 'lucide-react'

type Tab = 'dashboard' | 'basic' | 'account' | 'gallery' | 'interview' | 'notices' | 'transport' | 'rsvp' | 'guestbook' | 'animation' | 'bgm'

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === 'admin1234') {
      setAuthenticated(true)
      setError('')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-12 w-full max-w-md shadow-2xl"
        >
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-serif text-stone-800">Admin</h1>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-5 py-4 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className="w-full py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold"
            >
              로그인
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={16} /> },
  { id: 'basic', label: '기본 정보', icon: <Users size={16} /> },
  { id: 'account', label: '계좌 정보', icon: <Save size={16} /> },
  { id: 'gallery', label: '갤러리', icon: <Image size={16} /> },
  { id: 'interview', label: '인터뷰', icon: <MessageCircle size={16} /> },
  { id: 'notices', label: '공지사항', icon: <Bell size={16} /> },
  { id: 'transport', label: '교통안내', icon: <Truck size={16} /> },
  { id: 'animation', label: '오프닝', icon: <BookOpen size={16} /> },
  { id: 'bgm', label: '배경음악', icon: <Music size={16} /> },
  { id: 'rsvp', label: '참석여부', icon: <Users size={16} /> },
  { id: 'guestbook', label: '방명록', icon: <BookOpen size={16} /> },
]

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [data, setData] = useState<WeddingInfo>(loadWeddingData)
  const [rsvps, setRsvps] = useState<RsvpEntry[]>(loadRsvps)
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(loadGuestbook)

  useEffect(() => {
    saveWeddingData(data)
  }, [data])

  useEffect(() => {
    saveRsvps(rsvps)
  }, [rsvps])

  useEffect(() => {
    saveGuestbook(guestbook)
  }, [guestbook])

  const attendingCount = rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.guests, 0)
  const notAttendingCount = rsvps.filter(r => !r.attending).reduce((sum, r) => sum + r.guests, 0)
  const groomCount = rsvps.filter(r => r.side === 'groom' && r.attending).reduce((sum, r) => sum + r.guests, 0)
  const brideCount = rsvps.filter(r => r.side === 'bride' && r.attending).reduce((sum, r) => sum + r.guests, 0)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-serif text-stone-800">청첩장 관리자</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setData(prev => ({ ...prev }))
                window.location.reload()
              }}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              새로고침
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              <LogOut size={16} /> 로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex gap-6 p-6">
        <nav className="w-48 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white font-bold'
                  : 'text-stone-500 hover:bg-white hover:text-stone-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardStats
              rsvps={rsvps}
              guestbook={guestbook}
              attendingCount={attendingCount}
              notAttendingCount={notAttendingCount}
              groomCount={groomCount}
              brideCount={brideCount}
            />
          )}
          {activeTab === 'basic' && (
            <BasicInfoEditor data={data} onChange={setData} />
          )}
          {activeTab === 'account' && (
            <AccountEditor data={data} onChange={setData} />
          )}
          {activeTab === 'gallery' && (
            <GalleryEditor data={data} onChange={setData} />
          )}
          {activeTab === 'interview' && (
            <InterviewEditor data={data} onChange={setData} />
          )}
          {activeTab === 'notices' && (
            <NoticesEditor data={data} onChange={setData} />
          )}
          {activeTab === 'transport' && (
            <TransportEditor data={data} onChange={setData} />
          )}
          {activeTab === 'animation' && (
            <AnimationEditor data={data} onChange={setData} />
          )}
          {activeTab === 'bgm' && (
            <BgmEditor data={data} onChange={setData} />
          )}
          {activeTab === 'rsvp' && (
            <RsvpViewer rsvps={rsvps} onDelete={(id) => setRsvps(prev => prev.filter(r => r.id !== id))} />
          )}
          {activeTab === 'guestbook' && (
            <GuestbookViewer entries={guestbook} onDelete={(id) => setGuestbook(prev => prev.filter(g => g.id !== id))} />
          )}
        </main>
      </div>
    </div>
  )
}

const DashboardStats = ({
  rsvps, guestbook, attendingCount, notAttendingCount, groomCount, brideCount
}: {
  rsvps: RsvpEntry[]
  guestbook: GuestbookEntry[]
  attendingCount: number
  notAttendingCount: number
  groomCount: number
  brideCount: number
}) => {
  const totalInvited = rsvps.length
  const responseRate = totalInvited > 0 ? Math.round((attendingCount + notAttendingCount) / totalInvited * 100) : 0

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-stone-800">대시보드</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">참석 확정</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{attendingCount}<span className="text-sm font-normal text-stone-400">명</span></p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">불참</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{notAttendingCount}<span className="text-sm font-normal text-stone-400">명</span></p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">신랑측</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{groomCount}<span className="text-sm font-normal text-stone-400">명</span></p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">신부측</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{brideCount}<span className="text-sm font-normal text-stone-400">명</span></p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">RSVP 응답률</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{responseRate}%</p>
          <p className="text-xs text-stone-400 mt-1">전체 {totalInvited}명 중 {attendingCount + notAttendingCount}명 응답</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">방명록</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{guestbook.length}<span className="text-sm font-normal text-stone-400">개</span></p>
        </div>
      </div>
    </div>
  )
}

const BasicInfoEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveWeddingData(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <h2 className="text-xl font-serif text-stone-800 mb-8">기본 정보</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-stone-400 uppercase tracking-widest">날짜</label>
            <input
              type="date"
              value={data.date}
              onChange={e => onChange({ ...data, date: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-stone-400 uppercase tracking-widest">시간</label>
            <input
              type="time"
              value={data.time}
              onChange={e => onChange({ ...data, time: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-widest">인사말</label>
          <textarea
            value={data.message}
            onChange={e => onChange({ ...data, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-widest">예식장 이름</label>
          <input
            value={data.location.name}
            onChange={e => onChange({ ...data, location: { ...data.location, name: e.target.value } })}
            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-widest">홀</label>
          <input
            value={data.location.hall}
            onChange={e => onChange({ ...data, location: { ...data.location, hall: e.target.value } })}
            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-widest">주소</label>
          <input
            value={data.location.address}
            onChange={e => onChange({ ...data, location: { ...data.location, address: e.target.value } })}
            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-stone-400 uppercase tracking-widest">전화번호</label>
          <input
            value={data.location.phone}
            onChange={e => onChange({ ...data, location: { ...data.location, phone: e.target.value } })}
            className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonEditor
            label="신랑"
            person={data.groom}
            onChange={groom => onChange({ ...data, groom })}
          />
          <PersonEditor
            label="신부"
            person={data.bride}
            onChange={bride => onChange({ ...data, bride })}
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="mt-8 flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold"
      >
        <Save size={16} /> {saved ? '저장되었습니다' : '저장하기'}
      </motion.button>
    </section>
  )
}

const PersonEditor = ({
  label, person, onChange,
}: {
  label: string
  person: WeddingInfo['groom']
  onChange: (p: WeddingInfo['groom']) => void
}) => (
  <div className="bg-stone-50 rounded-2xl p-6 space-y-4">
    <h3 className="text-sm font-bold text-stone-600">{label}</h3>
    <div className="space-y-3">
      <div>
        <label className="text-[10px] text-stone-400 uppercase tracking-widest">이름</label>
        <input
          value={person.name}
          onChange={e => onChange({ ...person, name: e.target.value })}
          className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
        />
      </div>
      <div>
        <label className="text-[10px] text-stone-400 uppercase tracking-widest">관계</label>
        <input
          value={person.parentRelation}
          onChange={e => onChange({ ...person, parentRelation: e.target.value })}
          className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-stone-400 uppercase tracking-widest">아버지</label>
          <input
            value={person.parents.father}
            onChange={e => onChange({ ...person, parents: { ...person.parents, father: e.target.value } })}
            className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>
        <div>
          <label className="text-[10px] text-stone-400 uppercase tracking-widest">어머니</label>
          <input
            value={person.parents.mother}
            onChange={e => onChange({ ...person, parents: { ...person.parents, mother: e.target.value } })}
            className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
          />
        </div>
      </div>
    </div>
  </div>
)

const AccountEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveWeddingData(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <h2 className="text-xl font-serif text-stone-800 mb-8">계좌 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['groom', 'bride'] as const).map(side => (
          <div key={side} className="bg-stone-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-600">{side === 'groom' ? '신랑측' : '신부측'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-stone-400 uppercase tracking-widest">은행</label>
                <input
                  value={data[side].account.bank}
                  onChange={e => onChange({ ...data, [side]: { ...data[side], account: { ...data[side].account, bank: e.target.value } } })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 uppercase tracking-widest">계좌번호</label>
                <input
                  value={data[side].account.number}
                  onChange={e => onChange({ ...data, [side]: { ...data[side], account: { ...data[side].account, number: e.target.value } } })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 uppercase tracking-widest">예금주</label>
                <input
                  value={data[side].account.owner}
                  onChange={e => onChange({ ...data, [side]: { ...data[side], account: { ...data[side].account, owner: e.target.value } } })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="mt-8 flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-2xl text-sm font-bold"
      >
        <Save size={16} /> {saved ? '저장되었습니다' : '저장하기'}
      </motion.button>
    </section>
  )
}

const GalleryEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const [newUrl, setNewUrl] = useState('')

  const addImage = () => {
    if (newUrl.trim()) {
      onChange({ ...data, gallery: [...data.gallery, newUrl.trim()] })
      setNewUrl('')
    }
  }

  const removeImage = (index: number) => {
    onChange({ ...data, gallery: data.gallery.filter((_, i) => i !== index) })
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const arr = [...data.gallery]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    onChange({ ...data, gallery: arr })
  }

  const moveDown = (index: number) => {
    if (index === data.gallery.length - 1) return
    const arr = [...data.gallery]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    onChange({ ...data, gallery: arr })
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <h2 className="text-xl font-serif text-stone-800 mb-8">갤러리 관리</h2>
      <div className="flex gap-3 mb-6">
        <input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addImage()}
          placeholder="이미지 URL 입력 후 Enter"
          className="flex-1 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addImage}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> 추가
        </motion.button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.gallery.map((url, i) => (
          <div key={i} className="group relative bg-stone-50 rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              src={url}
              alt={`갤러리 ${i + 1}`}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" text-anchor="middle" font-size="14" fill="%23999">이미지 로딩 실패</text></svg>' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => moveUp(i)} className="p-2 bg-white rounded-full text-stone-700"><ChevronUp size={14} /></button>
              <button onClick={() => moveDown(i)} className="p-2 bg-white rounded-full text-stone-700"><ChevronDown size={14} /></button>
              <button onClick={() => removeImage(i)} className="p-2 bg-red-500 rounded-full text-white"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const InterviewEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const addItem = () => {
    onChange({ ...data, interview: [...data.interview, { question: '', answer: '' }] })
  }

  const removeItem = (index: number) => {
    onChange({ ...data, interview: data.interview.filter((_, i) => i !== index) })
  }

  const updateItem = (index: number, field: 'question' | 'answer', value: string) => {
    const arr = [...data.interview]
    arr[index] = { ...arr[index], [field]: value }
    onChange({ ...data, interview: arr })
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif text-stone-800">신랑신부 인터뷰</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold"
        >
          <Plus size={16} /> 질문 추가
        </motion.button>
      </div>
      <div className="space-y-6">
        {data.interview.map((item, i) => (
          <div key={i} className="bg-stone-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-bold">Q{i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
            <input
              value={item.question}
              onChange={e => updateItem(i, 'question', e.target.value)}
              placeholder="질문을 입력하세요"
              className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
            />
            <textarea
              value={item.answer}
              onChange={e => updateItem(i, 'answer', e.target.value)}
              placeholder="답변을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

const NoticesEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const addItem = () => {
    onChange({ ...data, notices: [...data.notices, { title: '', content: '' }] })
  }

  const removeItem = (index: number) => {
    onChange({ ...data, notices: data.notices.filter((_, i) => i !== index) })
  }

  const updateItem = (index: number, field: 'title' | 'content', value: string) => {
    const arr = [...data.notices]
    arr[index] = { ...arr[index], [field]: value }
    onChange({ ...data, notices: arr })
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif text-stone-800">공지사항</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold"
        >
          <Plus size={16} /> 공지 추가
        </motion.button>
      </div>
      <div className="space-y-6">
        {data.notices.map((item, i) => (
          <div key={i} className="bg-stone-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <input
                value={item.title}
                onChange={e => updateItem(i, 'title', e.target.value)}
                placeholder="공지 제목"
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
              <button onClick={() => removeItem(i)} className="ml-3 text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={item.content}
              onChange={e => updateItem(i, 'content', e.target.value)}
              placeholder="공지 내용을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

const TransportEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const addItem = () => {
    onChange({ ...data, transportation: [...data.transportation, { method: '', description: '' }] })
  }

  const removeItem = (index: number) => {
    onChange({ ...data, transportation: data.transportation.filter((_, i) => i !== index) })
  }

  const updateItem = (index: number, field: 'method' | 'description', value: string) => {
    const arr = [...data.transportation]
    arr[index] = { ...arr[index], [field]: value }
    onChange({ ...data, transportation: arr })
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif text-stone-800">교통 안내</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold"
        >
          <Plus size={16} /> 추가
        </motion.button>
      </div>
      <div className="space-y-6">
        {data.transportation.map((item, i) => (
          <div key={i} className="bg-stone-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <input
                value={item.method}
                onChange={e => updateItem(i, 'method', e.target.value)}
                placeholder="교통수단 (지하철, 버스, 주차 등)"
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
              <button onClick={() => removeItem(i)} className="ml-3 text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={item.description}
              onChange={e => updateItem(i, 'description', e.target.value)}
              placeholder="상세 안내"
              rows={2}
              className="w-full px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20 resize-none"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

const AnimationEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const anim = data.openingAnimation
  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <h2 className="text-xl font-serif text-stone-800 mb-8">오프닝 애니메이션</h2>
      <div className="space-y-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={anim.enabled}
            onChange={e => onChange({ ...data, openingAnimation: { ...anim, enabled: e.target.checked } })}
            className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <span className="text-sm text-stone-600">오프닝 애니메이션 사용</span>
        </label>
        {anim.enabled && (
          <>
            <div className="space-y-2">
              <label className="text-xs text-stone-400 uppercase tracking-widest">메인 텍스트</label>
              <input
                value={anim.text}
                onChange={e => onChange({ ...data, openingAnimation: { ...anim, text: e.target.value } })}
                placeholder="저희 두 사람, 결혼합니다"
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-stone-400 uppercase tracking-widest">서브 텍스트</label>
              <input
                value={anim.subtext}
                onChange={e => onChange({ ...data, openingAnimation: { ...anim, subtext: e.target.value } })}
                placeholder="W E   G E T   M A R R I E D"
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

const popularBgmPresets = [
  {
    title: 'Romantic Wedding Piano',
    url: 'https://archive.org/download/jamendo-344927/01-1571826-GarnaVutka-Romantic%20Wedding%20Piano.mp3',
    description: '로맨틱한 피아노 웨딩 BGM',
  },
  {
    title: 'Love Story',
    url: 'https://archive.org/download/jamendo-562168/01-2160374-Sound%20Gallery%20by%20Dmitry%20Taras-Love%20Story.mp3',
    description: '감성적인 스트링과 피아노 연주',
  },
  {
    title: 'Love Story – Kostia Deep',
    url: 'https://archive.org/download/jamendo-311528/01-1420184-Kostia%20Deep-Love%20Story.mp3',
    description: '부드럽고 잔잔한 피아노 멜로디',
  },
]

const BgmEditor = ({ data, onChange }: { data: WeddingInfo; onChange: (d: WeddingInfo) => void }) => {
  const bgm = data.bgm
  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <h2 className="text-xl font-serif text-stone-800 mb-8">배경 음악</h2>
      <div className="space-y-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={bgm.enabled}
            onChange={e => onChange({ ...data, bgm: { ...bgm, enabled: e.target.checked } })}
            className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <span className="text-sm text-stone-600">배경 음악 사용</span>
        </label>
        {bgm.enabled && (
          <>
            <div className="space-y-2">
              <label className="text-xs text-stone-400 uppercase tracking-widest">음악 제목</label>
              <input
                value={bgm.title}
                onChange={e => onChange({ ...data, bgm: { ...bgm, title: e.target.value } })}
                placeholder="곡 제목"
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-stone-400 uppercase tracking-widest">음악 URL (MP3)</label>
              <input
                value={bgm.url}
                onChange={e => onChange({ ...data, bgm: { ...bgm, url: e.target.value } })}
                placeholder="https://example.com/music.mp3"
                className="w-full px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
              />
            </div>

            <div className="pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">많이 사용하는 음악</p>
              <div className="grid gap-3">
                {popularBgmPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange({ ...data, bgm: { ...bgm, title: preset.title, url: preset.url } })}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      bgm.title === preset.title
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <p className={`text-sm font-bold ${bgm.title === preset.title ? 'text-white' : 'text-stone-800'}`}>
                      {preset.title}
                    </p>
                    <p className={`text-xs mt-1 ${bgm.title === preset.title ? 'text-white/60' : 'text-stone-400'}`}>
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

const RsvpViewer = ({ rsvps, onDelete }: { rsvps: RsvpEntry[]; onDelete: (id: string) => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const exportCsv = () => {
    const header = '이름,구분,하객수,참석여부,메시지,연락처,응답일시'
    const rows = rsvps.map(r =>
      `"${r.name}","${r.side === 'groom' ? '신랑' : '신부'}","${r.guests}","${r.attending ? '참석' : '불참'}","${r.message}","${r.phone}","${r.createdAt}"`
    )
    const bom = '\uFEFF'
    const blob = new Blob([bom + header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rsvp-목록.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif text-stone-800">참석여부 (RSVP)</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={exportCsv}
          className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold"
        >
          <Download size={16} /> CSV 내보내기
        </motion.button>
      </div>
      {rsvps.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-12">아직 응답이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {rsvps.map(r => (
            <div key={r.id} className="bg-stone-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${r.attending ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-bold text-stone-800">{r.name}</p>
                    <p className="text-xs text-stone-400">
                      {r.side === 'groom' ? '신랑' : '신부'}측 · {r.guests}명
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    r.attending ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}>
                    {r.attending ? '참석' : '불참'}
                  </span>
                  {expanded === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {expanded === r.id && (
                <div className="px-5 pb-5 space-y-2 text-sm text-stone-600">
                  <p><span className="text-stone-400">연락처:</span> {r.phone}</p>
                  {r.message && <p><span className="text-stone-400">메시지:</span> {r.message}</p>}
                  <p><span className="text-stone-400">응답일:</span> {new Date(r.createdAt).toLocaleDateString('ko-KR')}</p>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1 mt-2"
                  >
                    <Trash2 size={12} /> 삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const GuestbookViewer = ({ entries, onDelete }: { entries: GuestbookEntry[]; onDelete: (id: string) => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif text-stone-800">방명록</h2>
        <span className="text-xs text-stone-400 bg-stone-50 px-3 py-1 rounded-full">총 {entries.length}개</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-12">아직 방명록이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <div key={e.id} className="bg-stone-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div>
                  <p className="text-sm font-bold text-stone-800">{e.name}</p>
                  <p className="text-xs text-stone-400 line-clamp-1">{e.message}</p>
                </div>
                {expanded === e.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expanded === e.id && (
                <div className="px-5 pb-5 space-y-2 text-sm text-stone-600">
                  <p className="whitespace-pre-wrap">{e.message}</p>
                  <p className="text-stone-400 text-xs">{new Date(e.createdAt).toLocaleDateString('ko-KR')}</p>
                  <button
                    onClick={() => onDelete(e.id)}
                    className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1 mt-2"
                  >
                    <Trash2 size={12} /> 삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminPage
