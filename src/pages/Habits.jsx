import { useState } from 'react'
import { useStore } from '../store/useStore'

const today = () => new Date().toISOString().slice(0, 10)

const last7 = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (6 - i))
  return d.toISOString().slice(0, 10)
})

const dayLabels = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

// Habit icon SVGs
const habitIcons = {
  droplet: (color = '#4CAF8C') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  activity: (color = '#FF8A8A') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  moon: (color = '#F5A623') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  leaf: (color = '#7BC67E') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75" />
      <path d="M22 2S11 2 6 7c-5 5-4 12-4 12s7 1 12-4c5-5 8-13 8-13z" />
    </svg>
  ),
  star: (color = '#A78BFA') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
}

const iconColors = {
  droplet: '#4CAF8C', activity: '#FF8A8A', moon: '#F5A623', leaf: '#7BC67E', star: '#A78BFA',
}
const iconBgs = {
  droplet: '#e8f5ee', activity: '#fff0f0', moon: '#fff8e8', leaf: '#f0f8f0', star: '#f5f0ff',
}

function CheckCircle({ done, onClick }) {
  return (
    <button onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
      style={{
        background: done ? '#4CAF8C' : 'transparent',
        border: `2px solid ${done ? '#4CAF8C' : '#c8d8c8'}`,
      }}>
      {done && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

export default function Habits() {
  const store = useStore()
  const date = today()
  const habitDefs = store.habitDefs
  const log = store.getHabitLog(date)

  const [showAdd, setShowAdd] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: 'star', target: 1, unit: 'ครั้ง' })

  const doneCnt = habitDefs.filter(h => (log[h.id] ?? 0) >= h.target).length
  const pct = habitDefs.length ? Math.round((doneCnt / habitDefs.length) * 100) : 0

  const handleToggle = (habitId) => {
    const def = habitDefs.find(h => h.id === habitId)
    if (!def) return
    const cur = log[habitId] ?? 0
    const done = cur >= def.target
    const next = done ? 0 : def.target
    store.setHabitLog(habitId, next, date)
    const updatedLog = { ...log, [habitId]: next }
    const allDone = habitDefs.every(h => (updatedLog[h.id] ?? 0) >= h.target)
    if (allDone && !done) store.showReward('ทำครบทุกนิสัยแล้ววันนี้! คุณเก่งมาก 🎉')
  }

  const addHabit = () => {
    if (!newHabit.name) return
    store.setHabitDefs([...habitDefs, {
      id: `custom_${Date.now()}`,
      name: newHabit.name,
      icon: newHabit.icon,
      target: +newHabit.target || 1,
      unit: newHabit.unit || 'ครั้ง',
    }])
    setNewHabit({ name: '', icon: 'star', target: 1, unit: 'ครั้ง' })
    setShowAdd(false)
  }

  const removeHabit = (id) => store.setHabitDefs(habitDefs.filter(h => h.id !== id))

  const days = last7()

  return (
    <div className="space-y-4 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          นิสัยประจำวัน
        </h1>
        <span className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'var(--accent)' }} />
      </div>

      {/* Habit list */}
      <div className="space-y-3">
        {habitDefs.map(habit => {
          const done = (log[habit.id] ?? 0) >= habit.target
          const streak = store.getStreak(habit.id)
          const iconFn = habitIcons[habit.icon] || habitIcons.star
          const iconColor = iconColors[habit.icon] || '#A78BFA'
          const iconBg = iconBgs[habit.icon] || '#f5f0ff'

          return (
            <div key={habit.id} className="card flex items-center gap-3"
              style={{ background: done ? 'var(--accent-light)' : 'var(--card)' }}>
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: done ? 'rgba(76,175,140,0.15)' : iconBg }}>
                {iconFn(done ? '#4CAF8C' : iconColor)}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: done ? '#4CAF8C' : 'var(--text)' }}>
                  {habit.name}
                </p>
                {streak >= 3 && (
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#F5A623' }}>
                    🔥 {streak} วันติดต่อกัน!
                  </p>
                )}
              </div>

              {/* Remove (long press area) */}
              <button onClick={() => removeHabit(habit.id)}
                className="p-1 opacity-30 hover:opacity-70 transition-opacity"
                title="ลบนิสัย">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Check */}
              <CheckCircle done={done} onClick={() => handleToggle(habit.id)} />
            </div>
          )
        })}
      </div>

      {/* Add habit */}
      {showAdd ? (
        <div className="card space-y-3">
          <p className="font-semibold" style={{ color: 'var(--text)' }}>เพิ่มนิสัยใหม่</p>
          <input value={newHabit.name} onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))}
            placeholder="ชื่อนิสัย เช่น อ่านหนังสือ 30 นาที" className="input-field" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-sub)' }}>ไอคอน</label>
              <select value={newHabit.icon} onChange={e => setNewHabit(p => ({ ...p, icon: e.target.value }))}
                className="input-field">
                {Object.keys(habitIcons).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-sub)' }}>เป้าหมาย/วัน</label>
              <input type="number" min={1} value={newHabit.target}
                onChange={e => setNewHabit(p => ({ ...p, target: e.target.value }))}
                className="input-field" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ background: 'var(--bg)', color: 'var(--text-sub)' }}>ยกเลิก</button>
            <button onClick={addHabit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}>เพิ่ม</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="card w-full flex items-center justify-center gap-2 py-3 transition-all active:scale-95"
          style={{ border: '1.5px dashed var(--accent)', background: 'var(--accent-light)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF8C" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>เพิ่มนิสัยใหม่</span>
        </button>
      )}

      {/* Weekly heatmap */}
      <div className="card">
        <p className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          📊 สัปดาห์นี้
        </p>
        {/* Day headers */}
        <div className="grid mb-2" style={{ gridTemplateColumns: '28px repeat(7, 1fr)', gap: '6px' }}>
          <div />
          {days.map(d => (
            <div key={d} className="text-center text-xs" style={{ color: 'var(--text-sub)' }}>
              {dayLabels[new Date(d).getDay()]}
            </div>
          ))}
        </div>
        {/* Rows per habit */}
        {habitDefs.map(habit => {
          const iconFn = habitIcons[habit.icon] || habitIcons.star
          const iconColor = iconColors[habit.icon] || '#A78BFA'
          return (
            <div key={habit.id} className="grid mb-2" style={{ gridTemplateColumns: '28px repeat(7, 1fr)', gap: '6px' }}>
              <div className="flex items-center justify-center">
                {iconFn(iconColor)}
              </div>
              {days.map(d => {
                const dayLog = JSON.parse(localStorage.getItem(`healthapp_habits_${d}`) || '{}')
                const done = (dayLog[habit.id] ?? 0) >= habit.target
                return (
                  <div key={d} className="aspect-square rounded-xl transition-colors"
                    style={{ background: done ? '#4CAF8C' : 'var(--border)', minHeight: 32 }} />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
