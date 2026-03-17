import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const today = () => new Date().toISOString().slice(0, 10)

const moods = [
  { val: 1, emoji: '😞', label: 'แย่มาก',   color: '#94a3b8' },
  { val: 2, emoji: '😑', label: 'ไม่ค่อยดี', color: '#fbbf24' },
  { val: 3, emoji: '🙂', label: 'เฉยๆ',     color: '#34d399' },
  { val: 4, emoji: '😊', label: 'ดี',        color: '#60a5fa' },
  { val: 5, emoji: '😄', label: 'ดีมาก',    color: '#a78bfa' },
]

const dayLabels = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

function useMoodChart() {
  return useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const data = JSON.parse(localStorage.getItem(`healthapp_mood_${key}`) || 'null')
    return { day: dayLabels[d.getDay()], val: data?.val ?? null }
  }), [])
}

function useSleepWeek() {
  return useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const s = JSON.parse(localStorage.getItem(`healthapp_sleep_${key}`) || 'null')
    return { day: dayLabels[d.getDay()], hours: s?.hours ?? 0 }
  }), [])
}

// Custom Y-axis tick with emoji
const MoodYTick = ({ x, y, payload }) => {
  const m = moods.find(m => m.val === payload.value)
  if (!m) return null
  return (
    <text x={x - 4} y={y + 5} textAnchor="end" fontSize={14}>
      {m.emoji}
    </text>
  )
}

export default function Mood() {
  const store = useStore()
  const date = today()
  const saved = store.getMood(date)
  const savedSleep = store.getSleep(date)

  const [selected, setSelected] = useState(saved?.val ?? null)
  const [note, setNote] = useState(saved?.note ?? '')
  const [isSaved, setIsSaved] = useState(!!saved)

  const [bed, setBed] = useState(savedSleep?.bed || '23:00')
  const [wake, setWake] = useState(savedSleep?.wake || '07:00')
  const [sleepSaved, setSleepSaved] = useState(!!savedSleep)

  const chartData = useMoodChart()
  const sleepData = useSleepWeek()

  const calcHours = (b, w) => {
    const [bh, bm] = b.split(':').map(Number)
    const [wh, wm] = w.split(':').map(Number)
    let mins = (wh * 60 + wm) - (bh * 60 + bm)
    if (mins < 0) mins += 24 * 60
    return +(mins / 60).toFixed(1)
  }
  const sleepHours = calcHours(bed, wake)
  const weekAvg = (() => {
    const valid = sleepData.filter(d => d.hours > 0)
    return valid.length ? +(valid.reduce((s, d) => s + d.hours, 0) / valid.length).toFixed(1) : 0
  })()

  const saveMood = () => {
    if (!selected) return
    store.setMood({ val: selected, note }, date)
    setIsSaved(true)
    if (selected >= 4) store.showReward('ดีใจที่วันนี้อารมณ์ดีนะ! ดูแลตัวเองต่อไปเลย')
  }

  const saveSleep = () => {
    store.setSleep({ bed, wake, hours: sleepHours }, date)
    setSleepSaved(true)
    if (sleepHours >= 7) store.showReward(`นอนหลับ ${sleepHours} ชั่วโมง! ร่างกายได้พักผ่อนเต็มที่`)
  }

  // Format time for display
  const fmt12 = (t) => {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  }

  return (
    <div className="space-y-4 page-enter">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
        🌈 อารมณ์ &amp; จิตใจ
      </h1>

      {/* Mood check-in */}
      <div className="card">
        <p className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>วันนี้เป็นอย่างไรบ้าง?</p>
        <p className="text-sm mb-4" style={{ color: 'var(--text-sub)' }}>เลือกอารมณ์ของคุณ</p>

        <div className="flex justify-between gap-1">
          {moods.map(m => (
            <button key={m.val} onClick={() => { setSelected(m.val); setIsSaved(false) }}
              className="flex flex-col items-center gap-1.5 flex-1 py-2 rounded-xl transition-all active:scale-90"
              style={{ background: selected === m.val ? 'var(--accent-light)' : 'transparent' }}>
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[10px] font-medium" style={{ color: selected === m.val ? 'var(--accent)' : 'var(--text-sub)' }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Journal */}
      <div className="card">
        <p className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          📝 บันทึกสั้นๆ
        </p>
        <textarea value={note}
          onChange={e => { setNote(e.target.value.slice(0, 280)); setIsSaved(false) }}
          placeholder="วันนี้รู้สึกอย่างไร..."
          rows={3}
          className="input-field resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{note.length}/280</span>
          <button onClick={saveMood}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: selected ? 'var(--accent)' : '#c8d8c8' }}
            disabled={!selected}>
            {isSaved ? 'บันทึกแล้ว ✓' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* 7-day mood chart */}
      <div className="card">
        <p className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          📈 แนวโน้มอารมณ์ 7 วัน
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-sub)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={<MoodYTick />} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              formatter={(v) => [moods.find(m => m.val === v)?.label || v, 'อารมณ์']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12, background: 'var(--card)' }}
            />
            <Line type="monotone" dataKey="val" stroke="#4CAF8C" strokeWidth={2.5}
              dot={{ fill: '#4CAF8C', r: 4, strokeWidth: 0 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep tracker */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            🌙 บันทึกการนอน
          </p>
          {weekAvg > 0 && (
            <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
              เฉลี่ย {weekAvg} ชม./สัปดาห์
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-sub)' }}>เข้านอน</label>
            <div className="input-field flex items-center justify-between cursor-pointer"
              onClick={() => document.getElementById('bed-input').showPicker?.()}>
              <span style={{ color: 'var(--text)' }}>{fmt12(bed)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <input id="bed-input" type="time" value={bed}
                onChange={e => { setBed(e.target.value); setSleepSaved(false) }}
                className="sr-only" />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-sub)' }}>ตื่นนอน</label>
            <div className="input-field flex items-center justify-between cursor-pointer"
              onClick={() => document.getElementById('wake-input').showPicker?.()}>
              <span style={{ color: 'var(--text)' }}>{fmt12(wake)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <input id="wake-input" type="time" value={wake}
                onChange={e => { setWake(e.target.value); setSleepSaved(false) }}
                className="sr-only" />
            </div>
          </div>
        </div>

        {/* Hours display */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>ระยะเวลานอน</p>
            <p className="text-2xl font-bold" style={{
              color: sleepHours < 6 ? '#FF8A8A' : sleepHours < 7 ? '#F5A623' : '#4CAF8C'
            }}>
              {sleepHours} <span className="text-sm font-normal" style={{ color: 'var(--text-sub)' }}>ชั่วโมง</span>
            </p>
          </div>
          <button onClick={saveSleep}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: 'var(--accent)' }}>
            {sleepSaved ? 'บันทึกแล้ว ✓' : 'บันทึก'}
          </button>
        </div>

        {/* Weekly sleep — squares like habit heatmap */}
        <div>
          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
            {sleepData.map(({ day }) => (
              <div key={day} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-sub)' }}>{day}</div>
            ))}
          </div>
          {/* Squares */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {sleepData.map(({ day, hours: h }) => {
              const hasData = h > 0
              const isGood = h >= 7
              const isOk   = h >= 6 && h < 7
              const bg = !hasData
                ? 'var(--border)'
                : isGood ? '#4CAF8C'
                : isOk   ? '#FFD580'
                : '#FFB3B3'
              return (
                <div key={day} title={hasData ? `${h} ชม.` : 'ไม่มีข้อมูล'}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600,
                    color: hasData ? 'white' : 'transparent',
                    transition: 'background 0.2s',
                    minHeight: 36,
                  }}>
                  {hasData ? h : ''}
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
            {[['#4CAF8C','≥7 ชม.'],['#FFD580','6-7 ชม.'],['#FFB3B3','<6 ชม.']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 10, color: 'var(--text-sub)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
