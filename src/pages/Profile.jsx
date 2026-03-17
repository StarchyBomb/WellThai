import { useState } from 'react'
import { useStore } from '../store/useStore'
import { exportHealthCard } from '../utils/exportHealthCard'

function calcBMR(w, h, a, g) {
  return g === 'male'
    ? Math.round(88.362 + 13.397 * w + 4.799 * h - 5.677 * a)
    : Math.round(447.593 + 9.247 * w + 3.098 * h - 4.330 * a)
}
function calcTDEE(bmr, act) {
  return Math.round(bmr * ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }[act] || 1.2))
}

const today = () => new Date().toISOString().slice(0, 10)

export default function Profile() {
  const store = useStore()
  const profile = store.profile || {}

  const [name, setName]       = useState(profile.name || '')
  const [calGoal, setCalGoal] = useState(profile.calGoal || 1800)
  const [referral, setReferral] = useState(profile.referral || '')
  const [saved, setSaved]     = useState(false)
  const [exporting, setExporting] = useState(false)

  const save = () => {
    store.setProfile({ ...profile, name, calGoal: +calGoal, referral })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    store.showReward('บันทึกโปรไฟล์เรียบร้อย!')
  }

  const handleExportCard = async () => {
    setExporting(true)
    const date = today()
    try {
      await exportHealthCard({
        profile: { ...profile, name, calGoal: +calGoal },
        meals:     store.getMeals(date),
        water:     store.getWater(date),
        habitDefs: store.habitDefs,
        habitLog:  store.getHabitLog(date),
        mood:      store.getMood(date),
        sleep:     store.getSleep(date),
      })
    } finally {
      setExporting(false)
    }
  }

  const bmi = profile.weight && profile.height
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : null

  return (
    <div className="space-y-4 page-enter">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        โปรไฟล์
      </h1>

      {/* Profile form */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-light)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <input value={name} onChange={e => { setName(e.target.value); setSaved(false) }}
            placeholder="ชื่อของคุณ" className="input-field flex-1" />
        </div>

        {/* Body stats (read-only from onboarding) */}
        {(profile.weight || profile.height) && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'น้ำหนัก', value: profile.weight ? `${profile.weight} kg` : '—' },
              { label: 'ส่วนสูง', value: profile.height ? `${profile.height} cm` : '—' },
              { label: 'อายุ',    value: profile.age    ? `${profile.age} ปี`    : '—' },
              { label: 'BMI',     value: bmi || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center py-2 rounded-xl" style={{ background: 'var(--bg)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="text-sm mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-sub)' }}>
            เป้าหมายแคลอรี่ต่อวัน (kcal)
          </label>
          <input type="number" value={calGoal}
            onChange={e => { setCalGoal(e.target.value); setSaved(false) }}
            className="input-field" />
          {profile.tdee && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>
              TDEE ของคุณ: {profile.tdee} kcal/วัน
            </p>
          )}
        </div>

        <button onClick={save} className="btn-primary"
          style={{ background: saved ? '#34d399' : 'var(--accent)' }}>
          {saved ? '✓ บันทึกแล้ว' : 'บันทึก'}
        </button>
      </div>

      {/* Dark mode */}
      <div className="card flex items-center justify-between" style={{ cursor: 'pointer' }}
        onClick={store.toggleDark}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: store.darkMode ? '#1a2a3a' : '#fff8e8' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={store.darkMode ? '#60a5fa' : '#F5A623'} strokeWidth="2" strokeLinecap="round">
              {store.darkMode
                ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
                : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              }
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
              {store.darkMode ? 'โหมดกลางคืน' : 'โหมดกลางวัน'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
              {store.darkMode ? 'กดเพื่อเปลี่ยนเป็นโหมดสว่าง' : 'กดเพื่อเปลี่ยนเป็นโหมดมืด'}
            </p>
          </div>
        </div>
        {/* Toggle — self-contained, no overflow */}
        <div style={{ position: 'relative', width: 40, height: 22, flexShrink: 0, cursor: 'pointer' }}
          onClick={store.toggleDark}>
          <div style={{
            width: 40, height: 22, borderRadius: 11,
            background: store.darkMode ? 'var(--accent)' : 'var(--border)',
            transition: 'background 0.2s',
          }} />
          <div style={{
            position: 'absolute', top: 3,
            left: store.darkMode ? 21 : 3,
            width: 16, height: 16, borderRadius: '50%',
            background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            transition: 'left 0.2s',
          }} />
        </div>
      </div>

      {/* Health card export */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#f0f0ff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>ข้อมูลของคุณ</p>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
              ข้อมูลทั้งหมดเก็บในอุปกรณ์ของคุณเท่านั้น ไม่ส่งไปที่ใด 🔒
            </p>
          </div>
        </div>

        {/* Export health card as image */}
        <button onClick={handleExportCard} disabled={exporting}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #4CAF8C, #34d399)', color: 'white', opacity: exporting ? 0.7 : 1 }}>
          {exporting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              กำลังสร้างรูป...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              บันทึกเป็นรูปสุขภาพ (Story)
            </>
          )}
        </button>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-sub)' }}>
          ดาวน์โหลดรูป 9:16 สำหรับลงสตอรี่
        </p>
      </div>

      {/* Referral */}
      <div className="card">
        <p className="font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          🎁 รหัสชวนเพื่อน
        </p>
        <input value={referral}
          onChange={e => setReferral(e.target.value)}
          onBlur={() => store.setProfile({ ...store.profile, referral })}
          placeholder="กรอกรหัสชวนเพื่อน"
          className="input-field" />
      </div>

      {/* Premium */}
      <div className="card text-center py-6"
        style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, #f0f8ff 100%)', border: '1px solid var(--border)' }}>
        <span className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}>Premium</span>
        <p className="font-bold text-lg mt-3" style={{ color: 'var(--text)' }}>ปลดล็อคฟีเจอร์ทั้งหมด</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
          กราฟ 30 วัน · ส่งออก PDF · วิเคราะห์เชิงลึก
        </p>
        <p className="text-2xl font-bold mt-2" style={{ color: 'var(--accent)' }}>฿299/เดือน</p>
        <button className="btn-primary mt-4" style={{ maxWidth: 200, margin: '16px auto 0' }}>
          อัพเกรดเลย
        </button>
      </div>
    </div>
  )
}
