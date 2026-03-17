import { useStore } from '../store/useStore'

const today = () => new Date().toISOString().slice(0, 10)

// Calorie ring
function CalorieRing({ current, goal }) {
  const r = 70
  const circ = 2 * Math.PI * r
  const pct = Math.min(current / goal, 1)
  const offset = circ * (1 - pct)
  const over = current > goal

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative">
        <svg width={170} height={170}>
          <circle cx={85} cy={85} r={r} fill="none" stroke="#e8ede8" strokeWidth={12} />
          <circle cx={85} cy={85} r={r} fill="none"
            stroke={over ? '#FFB3B3' : '#4CAF8C'}
            strokeWidth={12}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="progress-ring-circle"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
            {current.toLocaleString()}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-sub)' }}>/ {goal.toLocaleString()} kcal</span>
        </div>
      </div>
      <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
        {over
          ? `เกินเป้า ${(current - goal).toLocaleString()} kcal`
          : `อีก ${(goal - current).toLocaleString()} kcal ถึงเป้า`}
      </p>
    </div>
  )
}

// Quick action icons
const quickActions = [
  {
    label: 'เพิ่มมื้ออาหาร', page: 'food', color: '#e8f5ee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="3" x2="8" y2="21" /><path d="M5 3v4a3 3 0 0 0 6 0V3" /><line x1="16" y1="3" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    label: 'เช็คนิสัย', page: 'habits', color: '#fff0f0',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
        <polyline points="3 6 4 7 6 5" /><polyline points="3 12 4 13 6 11" /><polyline points="3 18 4 19 6 17" />
      </svg>
    ),
  },
  {
    label: 'บันทึกอารมณ์', page: 'mood', color: '#fff8e8',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
      </svg>
    ),
  },
  {
    label: 'บันทึกการนอน', page: 'mood', color: '#f0f0ff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
]

export default function Home() {
  const store = useStore()
  const date = today()
  const profile = store.profile

  const meals = store.getMeals(date)
  const totalCal = meals.reduce((s, m) => s + (m.cal || 0), 0)
  const calGoal = profile?.calGoal || 1800

  const water = store.getWater(date)
  const waterGoal = 8

  const habitDefs = store.habitDefs
  const habitLog = store.getHabitLog(date)
  const habitsDone = habitDefs.filter(h => (habitLog[h.id] ?? 0) >= h.target).length

  const mood = store.getMood(date)
  const moodEmojis = ['😔', '😐', '🙂', '😊', '😄']

  const sleep = store.getSleep(date)

  const dayTh = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleWaterAdd = () => {
    if (water < waterGoal) {
      const next = water + 1
      store.setWater(next, date)
      if (next === waterGoal) store.showReward('ดื่มน้ำครบ 8 แก้วแล้ว! ร่างกายขอบคุณนะ')
    }
  }
  const handleWaterRemove = () => { if (water > 0) store.setWater(water - 1, date) }

  return (
    <div className="space-y-4 page-enter">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          สวัสดี! 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>{dayTh}</p>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>วันนี้เป็นอย่างไรบ้าง?</p>
      </div>

      {/* Calorie ring card */}
      <div className="card">
        <CalorieRing current={totalCal} goal={calGoal} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Habits */}
        <button onClick={() => store.setPage('habits')} className="card text-center active:scale-95 transition-all">
          <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            {habitsDone}/{habitDefs.length}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>นิสัยสำเร็จ</p>
        </button>

        {/* Mood */}
        <button onClick={() => store.setPage('mood')} className="card text-center active:scale-95 transition-all">
          <p className="text-2xl">{mood ? moodEmojis[mood.val - 1] : '—'}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>อารมณ์วันนี้</p>
        </button>

        {/* Sleep */}
        <button onClick={() => store.setPage('mood')} className="card text-center active:scale-95 transition-all">
          <p className="text-xl font-bold" style={{ color: sleep?.hours >= 7 ? 'var(--accent)' : sleep?.hours >= 6 ? '#F5A623' : sleep ? '#FF8A8A' : 'var(--text)' }}>
            {sleep ? sleep.hours : '—'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>ชม. นอน</p>
        </button>
      </div>

      {/* Water card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>ดื่มน้ำ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-sub)' }}>
              {water} / {waterGoal} แก้ว
            </span>
          </div>
        </div>

        {/* Water drop buttons */}
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <button
              key={i}
              onClick={() => i < water ? handleWaterRemove() : handleWaterAdd()}
              className="transition-all active:scale-90"
              title={i < water ? 'คลิกเพื่อลบ' : 'คลิกเพื่อเพิ่ม'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={i < water ? '#4CAF8C' : 'none'}
                stroke={i < water ? '#4CAF8C' : '#c8d8c8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚡</span>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>ทำอะไรดี?</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, page, color, icon }) => (
            <button
              key={label}
              onClick={() => store.setPage(page)}
              className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition-all"
              style={{ padding: '14px 8px' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
                {icon}
              </div>
              <span className="text-[11px] text-center leading-tight" style={{ color: 'var(--text-sub)' }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Premium banner */}
      <div className="card" style={{ background: 'var(--accent-light)', border: '1px solid #c8e8d8' }}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent)', color: 'white' }}>Premium</span>
            <p className="font-bold mt-2" style={{ color: 'var(--text)' }}>ดูข้อมูลย้อนหลัง 30 วัน</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>อัพเกรด Premium ฿299/เดือน</p>
          </div>
          <button
            onClick={() => store.setPage('profile')}
            className="text-xs px-3 py-1.5 rounded-lg font-medium mt-1"
            style={{ background: 'var(--accent)', color: 'white' }}>
            อัพเกรด
          </button>
        </div>
      </div>
    </div>
  )
}
