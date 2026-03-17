import { useStore } from '../store/useStore'

const tabs = [
  {
    id: 'home', label: 'หน้าหลัก',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? '#4CAF8C' : 'none'}
        stroke={active ? '#4CAF8C' : 'var(--text-sub)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'food', label: 'อาหาร',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#4CAF8C' : 'var(--text-sub)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="3" x2="8" y2="21"/>
        <path d="M5 3v4a3 3 0 0 0 6 0V3"/>
        <line x1="16" y1="3" x2="16" y2="21"/>
      </svg>
    ),
  },
  {
    id: 'habits', label: 'นิสัย',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#4CAF8C' : 'var(--text-sub)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="6" x2="21" y2="6"/>
        <line x1="10" y1="12" x2="21" y2="12"/>
        <line x1="10" y1="18" x2="21" y2="18"/>
        <polyline points="3 6 4 7 6 5"/>
        <polyline points="3 12 4 13 6 11"/>
        <polyline points="3 18 4 19 6 17"/>
      </svg>
    ),
  },
  {
    id: 'mood', label: 'อารมณ์',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#4CAF8C' : 'var(--text-sub)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3"/>
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'โปรไฟล์',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#4CAF8C' : 'var(--text-sub)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function SideNav() {
  const { page, setPage, darkMode, toggleDark } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 12px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 24 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🌿</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', margin: 0 }}>สุขภาพดี</p>
          <p style={{ fontSize: 11, color: 'var(--text-sub)', margin: 0 }}>Thai Health App</p>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tabs.map(({ id, label, icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-sub)',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: 'Sarabun, sans-serif',
                transition: 'background 0.15s',
              }}>
              {icon(active)}
              <span>{label}</span>
              {active && (
                <div style={{
                  marginLeft: 'auto', width: 6, height: 6,
                  borderRadius: '50%', background: 'var(--accent)',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Dark mode toggle — fixed at bottom */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
        <button onClick={toggleDark}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-sub)', fontFamily: 'Sarabun, sans-serif',
          }}>
          {/* Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-sub)" strokeWidth="2" strokeLinecap="round">
            {darkMode
              ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>
              : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            }
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {darkMode ? 'โหมดสว่าง' : 'โหมดมืด'}
          </span>
          {/* Toggle — contained, no overflow */}
          <div style={{ marginLeft: 'auto', position: 'relative', width: 40, height: 22, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 22, borderRadius: 11,
              background: darkMode ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.2s',
            }} />
            <div style={{
              position: 'absolute',
              top: 3, left: darkMode ? 21 : 3,
              width: 16, height: 16,
              borderRadius: '50%', background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'left 0.2s',
            }} />
          </div>
        </button>
      </div>
    </div>
  )
}
