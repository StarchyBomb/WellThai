import { useState, useMemo, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../store/useStore'
import { thaiFood, foodCategories } from '../data/thaiFood'

const today = () => new Date().toISOString().slice(0, 10)

const mealTimes = [
  { id: 'morning', label: 'เช้า',    emoji: '🌅', color: '#fbbf24' },
  { id: 'lunch',   label: 'กลางวัน', emoji: '☀️', color: '#f97316' },
  { id: 'dinner',  label: 'เย็น',    emoji: '🌙', color: '#818cf8' },
  { id: 'snack',   label: 'ของว่าง', emoji: '🍪', color: '#f472b6' },
]

const cats = ['ทั้งหมด', ...foodCategories]

function CalorieRing({ current, goal }) {
  const r = 56, circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(current / goal, 1))
  const over = current > goal
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 4px' }}>
      <div style={{ position: 'relative' }}>
        <svg width={130} height={130}>
          <circle cx={65} cy={65} r={r} fill="none" stroke="var(--border)" strokeWidth={10} />
          <circle cx={65} cy={65} r={r} fill="none"
            stroke={over ? '#f87171' : 'var(--accent)'}
            strokeWidth={10} strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" className="progress-ring-circle" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{current.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: 'var(--text-sub)' }}>/ {goal.toLocaleString()} kcal</span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: over ? '#f87171' : 'var(--text-sub)', marginTop: 4 }}>
        {over ? `เกิน ${(current - goal).toLocaleString()} kcal` : `เหลือ ${(goal - current).toLocaleString()} kcal`}
      </p>
    </div>
  )
}

// ── Food Search Modal — rendered via portal so it's never clipped ──────────
function FoodSearchModal({ mealTime, onClose, onAdd }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('ทั้งหมด')
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState({ name: '', cal: '', protein: '', carbs: '', fat: '' })
  const [addedIds, setAddedIds] = useState(new Set())

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const results = useMemo(() => {
    let list = thaiFood
    if (cat !== 'ทั้งหมด') list = list.filter(f => f.category === cat)
    if (search.trim()) list = list.filter(f => f.name.includes(search.trim()))
    return list
  }, [search, cat])

  const handleAdd = (food) => {
    onAdd(food)
    setAddedIds(prev => new Set([...prev, food.id ?? food.name]))
    setTimeout(() => setAddedIds(prev => {
      const n = new Set(prev); n.delete(food.id ?? food.name); return n
    }), 1200)
  }

  const addCustom = () => {
    if (!custom.name || !custom.cal) return
    onAdd({ name: custom.name, cal: +custom.cal, protein: +custom.protein || 0, carbs: +custom.carbs || 0, fat: +custom.fat || 0, custom: true })
    setCustom({ name: '', cal: '', protein: '', carbs: '', fat: '' })
    setShowCustom(false)
  }

  const mealInfo = mealTimes.find(m => m.id === mealTime)

  // Detect desktop (md breakpoint = 768px)
  const isDesktop = window.innerWidth >= 768

  const modal = (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      {/* Dialog / Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isDesktop ? 560 : 640,
          maxHeight: isDesktop ? '85dvh' : '92dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--card)',
          borderRadius: isDesktop ? 20 : '24px 24px 0 0',
          overflow: 'hidden',
          boxShadow: isDesktop
            ? '0 20px 60px rgba(0,0,0,0.3)'
            : '0 -8px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Drag handle — mobile only */}
        {!isDesktop && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px 12px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: mealInfo?.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {mealInfo?.emoji}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: 0 }}>เพิ่มอาหาร</p>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', margin: 0 }}>มื้อ{mealInfo?.label}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--bg)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-sub)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`ค้นหาจาก ${thaiFood.length} รายการ...`}
              autoFocus
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                borderRadius: 12, fontSize: 14,
                background: 'var(--bg)', color: 'var(--text)',
                border: '1.5px solid var(--border)',
                outline: 'none', fontFamily: 'Sarabun, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Category chips — always scrollable horizontally */}
        <div style={{
          display: 'flex', gap: 8, padding: '0 16px 10px',
          overflowX: 'scroll', flexShrink: 0,
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none', scrollbarWidth: 'none',
        }}
          className="no-scrollbar"
        >
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                whiteSpace: 'nowrap', flexShrink: 0,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Sarabun, sans-serif',
                background: cat === c ? 'var(--accent)' : 'var(--bg)',
                color: cat === c ? 'white' : 'var(--text-sub)',
                transition: 'background 0.15s, color 0.15s',
                boxShadow: cat === c ? '0 2px 8px rgba(76,175,140,0.3)' : 'none',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ padding: '0 16px 6px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-sub)', margin: 0 }}>
            {results.length} รายการ{cat !== 'ทั้งหมด' ? ` ในหมวด "${cat}"` : ''}
          </p>
        </div>

        {/* Food list — this is the only scrollable part */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', minHeight: 0 }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🔍</p>
              <p>ไม่พบ "{search}"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 8 }}>
              {results.map(food => {
                const justAdded = addedIds.has(food.id ?? food.name)
                return (
                  <button
                    key={food.id}
                    onClick={() => handleAdd(food)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 12,
                      background: justAdded ? 'var(--accent-light)' : 'var(--bg)',
                      border: `1.5px solid ${justAdded ? 'var(--accent)' : 'transparent'}`,
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'background 0.15s, border-color 0.15s',
                      fontFamily: 'Sarabun, sans-serif',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {food.name}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-sub)', margin: '2px 0 0' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{food.cal} kcal</span>
                        {' · '}P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                      </p>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginLeft: 10,
                      background: justAdded ? 'var(--accent)' : 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}>
                      {justAdded ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Custom food footer */}
        <div style={{ padding: '10px 16px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              style={{
                width: '100%', padding: '10px', borderRadius: 12,
                background: 'var(--accent-light)', color: 'var(--accent)',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'Sarabun, sans-serif',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              เพิ่มอาหารที่ไม่มีในรายการ
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input value={custom.name} onChange={e => setCustom(p => ({ ...p, name: e.target.value }))}
                placeholder="ชื่ออาหาร" className="input-field" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {[['cal','kcal'],['protein','P(g)'],['carbs','C(g)'],['fat','F(g)']].map(([k, ph]) => (
                  <input key={k} type="number" value={custom[k]}
                    onChange={e => setCustom(p => ({ ...p, [k]: e.target.value }))}
                    placeholder={ph} className="input-field"
                    style={{ textAlign: 'center' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowCustom(false)}
                  style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'var(--bg)', color: 'var(--text-sub)', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Sarabun, sans-serif' }}>
                  ยกเลิก
                </button>
                <button onClick={addCustom}
                  style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Sarabun, sans-serif' }}>
                  เพิ่ม
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

// ── Main Food page ───────────────────────────────────────────────────────────
export default function Food() {
  const store = useStore()
  const date = today()
  const meals = store.getMeals(date)
  const calGoal = store.profile?.calGoal || 1800
  const totalCal = meals.reduce((s, m) => s + (m.cal || 0), 0)

  const [activeMeal, setActiveMeal] = useState('morning')
  const [showModal, setShowModal] = useState(false)

  const handleAdd = useCallback((food) => {
    store.addMeal({ ...food, mealTime: activeMeal })
  }, [activeMeal, store])

  return (
    <div className="space-y-4 page-enter">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
        🍽️ อาหาร
      </h1>

      {/* Calorie summary card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <CalorieRing current={totalCal} goal={calGoal} />
          <div style={{ flex: 1 }}>
            {[
              { label: 'โปรตีน', val: meals.reduce((s,m)=>s+(m.protein||0),0), color: '#60a5fa' },
              { label: 'คาร์บ',  val: meals.reduce((s,m)=>s+(m.carbs||0),0),   color: '#fbbf24' },
              { label: 'ไขมัน', val: meals.reduce((s,m)=>s+(m.fat||0),0),     color: '#f87171' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{label}</span>
                <div style={{ flex: 1, margin: '0 10px', height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: color, width: `${Math.min(val / 150 * 100, 100)}%`, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 36, textAlign: 'right' }}>{val}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal time tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {mealTimes.map(({ id, label, emoji, color }) => {
          const active = activeMeal === id
          const count = meals.filter(m => m.mealTime === id).length
          return (
            <button key={id} onClick={() => setActiveMeal(id)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 12,
                background: active ? 'var(--accent)' : 'var(--card)',
                color: active ? 'white' : 'var(--text-sub)',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
                fontFamily: 'Sarabun, sans-serif',
                boxShadow: active ? `0 2px 10px rgba(76,175,140,0.3)` : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.15s', position: 'relative',
              }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{emoji}</div>
              <div>{label}</div>
              {count > 0 && (
                <div style={{
                  position: 'absolute', top: 4, right: 6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: active ? 'rgba(255,255,255,0.3)' : color,
                  color: 'white', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {count}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Add food button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          width: '100%', padding: '12px', borderRadius: 14,
          background: 'var(--accent-light)',
          border: '1.5px dashed var(--accent)',
          color: 'var(--accent)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'Sarabun, sans-serif', transition: 'opacity 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        เพิ่มอาหาร — มื้อ{mealTimes.find(m => m.id === activeMeal)?.label}
      </button>

      {/* Meal lists */}
      {mealTimes.map(({ id, label, emoji }) => {
        const items = meals.filter(m => m.mealTime === id)
        if (!items.length) return null
        const sub = items.reduce((s, m) => s + m.cal, 0)
        return (
          <div key={id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {emoji} {label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{sub} kcal</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(meal => (
                <div key={meal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {meal.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-sub)', margin: '2px 0 0' }}>
                      {meal.cal} kcal · P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                    </p>
                  </div>
                  <button onClick={() => store.removeMeal(meal.id, date)}
                    style={{ padding: 6, marginLeft: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--border)', flexShrink: 0, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--border)'}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {meals.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>🍽️</p>
          <p style={{ color: 'var(--text-sub)', fontSize: 15 }}>ยังไม่มีมื้ออาหารวันนี้</p>
          <p style={{ color: 'var(--text-sub)', fontSize: 13, marginTop: 4 }}>กดปุ่มด้านบนเพื่อเริ่มบันทึก</p>
        </div>
      )}

      {showModal && (
        <FoodSearchModal
          mealTime={activeMeal}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
