import { useEffect } from 'react'
import { useStore } from './store/useStore'
import SideNav from './components/SideNav'
import BottomNav from './components/BottomNav'
import RewardsPopup from './components/RewardsPopup'
import Onboarding from './components/Onboarding'
import Home from './pages/Home'
import Food from './pages/Food'
import Habits from './pages/Habits'
import Mood from './pages/Mood'
import Profile from './pages/Profile'

const pages = { home: Home, food: Food, habits: Habits, mood: Mood, profile: Profile }

export default function App() {
  const { page, darkMode, showOnboarding } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const PageComponent = pages[page] || Home

  return (
    <div className="min-h-dvh font-sarabun" style={{ background: 'var(--bg)' }}>
      {showOnboarding && <Onboarding />}

      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        <main className="px-4 pt-5 pb-28">
          <PageComponent key={page} />
        </main>
        <BottomNav />
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: '240px 1fr', minHeight: '100dvh' }}>
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen overflow-y-auto"
          style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}>
          <SideNav />
        </aside>

        {/* Content area — scrollable */}
        <main className="overflow-y-auto" style={{ maxHeight: '100dvh' }}>
          {/* Top bar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            padding: '14px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
          }}>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', margin: 0 }}>
              {({ home:'หน้าหลัก', food:'อาหาร', habits:'นิสัยประจำวัน', mood:'อารมณ์ & จิตใจ', profile:'โปรไฟล์' })[page]}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: 0 }}>
              {new Date().toLocaleDateString('th-TH', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>

          {/* Page content — left-aligned, comfortable padding */}
          <div style={{ maxWidth: 860, padding: '28px 32px 48px' }}>
            <PageComponent key={page} />
          </div>
        </main>
      </div>

      <RewardsPopup />
    </div>
  )
}
