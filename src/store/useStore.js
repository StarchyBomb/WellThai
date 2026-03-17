import { create } from 'zustand'

const today = () => new Date().toISOString().slice(0, 10)

// localStorage helpers
const ls = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
    catch { return fallback }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
}

const defaultHabits = [
  { id: 'water', name: 'ดื่มน้ำ 8 แก้ว', icon: 'droplet', target: 8, unit: 'แก้ว' },
  { id: 'exercise', name: 'ออกกำลังกาย', icon: 'activity', target: 1, unit: 'ครั้ง' },
  { id: 'sleep', name: 'นอนหลับ 7-8 ชม.', icon: 'moon', target: 1, unit: 'ครั้ง' },
  { id: 'vegfruit', name: 'ทานผัก-ผลไม้', icon: 'leaf', target: 1, unit: 'ครั้ง' },
]

export const useStore = create((set, get) => ({
  // ── User profile ──────────────────────────────────────────────
  profile: ls.get('healthapp_user_profile', null),
  setProfile: (data) => {
    ls.set('healthapp_user_profile', data)
    set({ profile: data })
  },

  // ── Dark mode ─────────────────────────────────────────────────
  darkMode: ls.get('healthapp_darkmode', false),
  toggleDark: () => set(s => {
    const next = !s.darkMode
    ls.set('healthapp_darkmode', next)
    document.documentElement.classList.toggle('dark', next)
    return { darkMode: next }
  }),

  // ── Active page ───────────────────────────────────────────────
  page: 'home',
  setPage: (page) => set({ page }),

  // ── Meals ─────────────────────────────────────────────────────
  getMeals: (date = today()) => ls.get(`healthapp_meals_${date}`, []),
  addMeal: (meal, date = today()) => {
    const meals = [...ls.get(`healthapp_meals_${date}`, []), { ...meal, id: Date.now() }]
    ls.set(`healthapp_meals_${date}`, meals)
    set({}) // trigger re-render
  },
  removeMeal: (mealId, date = today()) => {
    const meals = ls.get(`healthapp_meals_${date}`, []).filter(m => m.id !== mealId)
    ls.set(`healthapp_meals_${date}`, meals)
    set({})
  },

  // ── Water ─────────────────────────────────────────────────────
  getWater: (date = today()) => ls.get(`healthapp_water_${date}`, 0),
  setWater: (count, date = today()) => {
    ls.set(`healthapp_water_${date}`, count)
    set({})
  },

  // ── Habits ────────────────────────────────────────────────────
  habitDefs: ls.get('healthapp_habit_defs', defaultHabits),
  setHabitDefs: (defs) => {
    ls.set('healthapp_habit_defs', defs)
    set({ habitDefs: defs })
  },
  getHabitLog: (date = today()) => ls.get(`healthapp_habits_${date}`, {}),
  setHabitLog: (habitId, value, date = today()) => {
    const log = ls.get(`healthapp_habits_${date}`, {})
    log[habitId] = value
    ls.set(`healthapp_habits_${date}`, log)
    set({})
  },
  getStreak: (habitId) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().slice(0, 10)
      const log = ls.get(`healthapp_habits_${key}`, {})
      const def = get().habitDefs.find(h => h.id === habitId)
      if (!def) break
      const val = log[habitId] ?? 0
      if (val >= def.target) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  },

  // ── Mood ──────────────────────────────────────────────────────
  getMood: (date = today()) => ls.get(`healthapp_mood_${date}`, null),
  setMood: (data, date = today()) => {
    ls.set(`healthapp_mood_${date}`, data)
    set({})
  },

  // ── Sleep ─────────────────────────────────────────────────────
  getSleep: (date = today()) => ls.get(`healthapp_sleep_${date}`, null),
  setSleep: (data, date = today()) => {
    ls.set(`healthapp_sleep_${date}`, data)
    set({})
  },

  // ── Rewards popup ─────────────────────────────────────────────
  reward: null,
  showReward: (msg) => set({ reward: msg }),
  clearReward: () => set({ reward: null }),

  // ── Onboarding ────────────────────────────────────────────────
  showOnboarding: !ls.get('healthapp_user_profile', null),
  setShowOnboarding: (v) => set({ showOnboarding: v }),
}))
