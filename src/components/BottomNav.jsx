import { useStore } from '../store/useStore'

// Inline SVG icons matching the screenshot style
const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#4CAF8C' : 'none'}
    stroke={active ? '#4CAF8C' : '#9aaa9a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const ForkKnifeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#4CAF8C' : '#9aaa9a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="3" x2="8" y2="21" />
    <path d="M5 3v4a3 3 0 0 0 6 0V3" />
    <line x1="16" y1="3" x2="16" y2="21" />
  </svg>
)

const ListCheckIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#4CAF8C' : '#9aaa9a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <polyline points="3 6 4 7 6 5" />
    <polyline points="3 12 4 13 6 11" />
    <polyline points="3 18 4 19 6 17" />
  </svg>
)

const SmileIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#4CAF8C' : '#9aaa9a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
  </svg>
)

const UserIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#4CAF8C' : '#9aaa9a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const tabs = [
  { id: 'home',    label: 'หน้าหลัก', Icon: HomeIcon },
  { id: 'food',    label: 'อาหาร',    Icon: ForkKnifeIcon },
  { id: 'habits',  label: 'นิสัย',    Icon: ListCheckIcon },
  { id: 'mood',    label: 'อารมณ์',   Icon: SmileIcon },
  { id: 'profile', label: 'โปรไฟล์',  Icon: UserIcon },
]

export default function BottomNav() {
  const { page, setPage } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all active:scale-95">
              <Icon active={active} />
              <span className="text-[10px] font-medium"
                style={{ color: active ? '#4CAF8C' : '#9aaa9a' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
