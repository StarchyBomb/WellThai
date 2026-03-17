import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function RewardsPopup() {
  const { reward, clearReward } = useStore()

  useEffect(() => {
    if (reward) {
      const t = setTimeout(clearReward, 3500)
      return () => clearTimeout(t)
    }
  }, [reward, clearReward])

  if (!reward) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      {/* Tap to dismiss */}
      <div className="absolute inset-0 pointer-events-auto" onClick={clearReward} />

      {/* Toast card */}
      <div className="relative pointer-events-auto w-full max-w-sm animate-bounce-in mb-20"
        style={{ background: 'var(--card)', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: '16px 20px' }}>
        <div className="flex items-center gap-3">
          {/* Trophy icon */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#fff8e8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>ยอดเยี่ยม!</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>{reward}</p>
          </div>
          <button onClick={clearReward} style={{ color: 'var(--text-sub)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Progress bar auto-dismiss */}
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full" style={{
            background: 'var(--accent)',
            animation: 'shrink 3.5s linear forwards',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
