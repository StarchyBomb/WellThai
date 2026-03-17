import { useState } from 'react'
import { useStore } from '../store/useStore'

function calcBMR(w, h, a, g) {
  return g === 'male'
    ? Math.round(88.362 + 13.397 * w + 4.799 * h - 5.677 * a)
    : Math.round(447.593 + 9.247 * w + 3.098 * h - 4.330 * a)
}
function calcTDEE(bmr, act) {
  return Math.round(bmr * ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }[act] || 1.2))
}

export default function Onboarding() {
  const store = useStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', weight: '', height: '', age: '',
    gender: 'female', activity: 'moderate',
  })

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const bmr = form.weight && form.height && form.age
    ? calcBMR(+form.weight, +form.height, +form.age, form.gender) : null
  const tdee = bmr ? calcTDEE(bmr, form.activity) : null

  const finish = () => {
    store.setProfile({ ...form, bmr, tdee, calGoal: tdee || 1800 })
    store.setShowOnboarding(false)
    store.showReward(`ยินดีต้อนรับ ${form.name || 'คุณ'}! เริ่มดูแลสุขภาพด้วยกันเลย`)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-2 rounded-full transition-all"
              style={{
                width: i === step ? 32 : 8,
                background: i === step ? 'var(--accent)' : 'var(--border)',
              }} />
          ))}
        </div>

        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="text-7xl">🌿</div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>สวัสดี!</h2>
              <p className="mt-2" style={{ color: 'var(--text-sub)' }}>
                แอปติดตามสุขภาพสำหรับคนไทย<br />เริ่มต้นด้วยการบอกเราเกี่ยวกับตัวคุณ
              </p>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary text-base py-4">เริ่มเลย</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>ข้อมูลพื้นฐาน</h2>
            <div>
              <label className="text-sm mb-1.5 block" style={{ color: 'var(--text-sub)' }}>ชื่อ (ไม่บังคับ)</label>
              <input value={form.name} onChange={f('name')} placeholder="ชื่อของคุณ" className="input-field" />
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-sub)' }}>เพศ</label>
              <div className="flex gap-3">
                {[['female', 'หญิง'], ['male', 'ชาย']].map(([v, l]) => (
                  <button key={v} onClick={() => setForm(p => ({ ...p, gender: v }))}
                    className="flex-1 py-3 rounded-xl font-medium transition-all active:scale-95"
                    style={{
                      background: form.gender === v ? 'var(--accent)' : 'var(--card)',
                      color: form.gender === v ? 'white' : 'var(--text-sub)',
                      border: `1.5px solid ${form.gender === v ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary">ถัดไป →</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>ข้อมูลร่างกาย</h2>
            <div className="grid grid-cols-3 gap-3">
              {[['weight','น้ำหนัก (kg)','65'],['height','ส่วนสูง (cm)','165'],['age','อายุ (ปี)','28']].map(([k,l,ph]) => (
                <div key={k}>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-sub)' }}>{l}</label>
                  <input type="number" value={form[k]} onChange={f(k)} placeholder={ph}
                    className="input-field text-center font-bold" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: 'var(--text-sub)' }}>ระดับกิจกรรม</label>
              <div className="space-y-2">
                {[
                  ['sedentary', 'นั่งทำงาน ไม่ค่อยออกกำลังกาย'],
                  ['light', 'ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์'],
                  ['moderate', 'ออกกำลังกาย 3-5 วัน/สัปดาห์'],
                  ['active', 'ออกกำลังกายหนัก 6-7 วัน/สัปดาห์'],
                ].map(([v, l]) => (
                  <button key={v} onClick={() => setForm(p => ({ ...p, activity: v }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-left transition-all active:scale-98"
                    style={{
                      background: form.activity === v ? 'var(--accent)' : 'var(--card)',
                      color: form.activity === v ? 'white' : 'var(--text)',
                      border: `1.5px solid ${form.activity === v ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {tdee && (
              <div className="rounded-xl p-4 text-center"
                style={{ background: 'var(--accent-light)', border: '1px solid #c8e8d8' }}>
                <p className="text-sm" style={{ color: 'var(--text-sub)' }}>แคลอรี่ที่แนะนำต่อวัน</p>
                <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent)' }}>
                  {tdee} <span className="text-base font-normal">kcal</span>
                </p>
              </div>
            )}
            <button onClick={finish} className="btn-primary">เริ่มใช้งาน ✓</button>
          </div>
        )}
      </div>
    </div>
  )
}
