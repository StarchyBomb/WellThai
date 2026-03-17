/**
 * Premium health story card — 1080×1920 (9:16)
 * Modern glassmorphism style with gradient background
 */
export async function exportHealthCard({ profile, meals, water, habitDefs, habitLog, mood, sleep }) {
  const W = 1080, H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // ── Wait for fonts ───────────────────────────────────────────
  try { await document.fonts.load('700 48px Sarabun') } catch {}

  const isDark = document.documentElement.classList.contains('dark')

  // ── Background ───────────────────────────────────────────────
  // Deep gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W * 0.6, H)
  if (isDark) {
    bgGrad.addColorStop(0, '#0a1628')
    bgGrad.addColorStop(0.5, '#0d2818')
    bgGrad.addColorStop(1, '#0a1628')
  } else {
    bgGrad.addColorStop(0, '#0f3d2e')
    bgGrad.addColorStop(0.5, '#1a5c42')
    bgGrad.addColorStop(1, '#0f3d2e')
  }
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Subtle noise texture via small dots
  ctx.save()
  ctx.globalAlpha = 0.03
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
  }
  ctx.restore()

  // Glow orbs
  const orb = (x, y, r, color, alpha) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'transparent')
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  orb(W * 0.8, H * 0.12, 400, '#4CAF8C', 0.25)
  orb(W * 0.1, H * 0.85, 350, '#34d399', 0.18)
  orb(W * 0.5, H * 0.5,  600, '#1a5c42', 0.12)

  // ── Helpers ──────────────────────────────────────────────────
  const f = (size, weight = '400') => `${weight} ${size}px Sarabun, sans-serif`

  const roundRect = (x, y, w, h, r, fillStyle, strokeStyle, strokeW = 1) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill() }
    if (strokeStyle) { ctx.strokeStyle = strokeStyle; ctx.lineWidth = strokeW; ctx.stroke() }
  }

  // Glass card
  const glassCard = (x, y, w, h, r = 32) => {
    roundRect(x, y, w, h, r, 'rgba(255,255,255,0.07)', 'rgba(255,255,255,0.12)', 1.5)
  }

  const PAD = 72
  const CARD_W = W - PAD * 2
  let y = 0

  // ── TOP SECTION ──────────────────────────────────────────────
  y = 90

  // App badge (pill)
  roundRect(PAD, y, 200, 52, 26, '#4CAF8C')
  ctx.fillStyle = 'white'
  ctx.font = f(24, '700')
  ctx.textAlign = 'left'
  ctx.fillText('🌿  สุขภาพดี', PAD + 18, y + 35)

  // Date top right
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = f(26)
  ctx.textAlign = 'right'
  ctx.fillText(
    new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    W - PAD, y + 35
  )

  y += 100

  // Big name
  ctx.fillStyle = 'white'
  ctx.font = f(88, '700')
  ctx.textAlign = 'left'
  ctx.fillText(`สวัสดี, ${profile?.name || 'คุณ'}!`, PAD, y + 70)
  y += 90

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = f(34)
  ctx.fillText('สรุปสุขภาพประจำวัน', PAD, y + 40)
  y += 80

  // Divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, y)
  ctx.lineTo(W - PAD, y)
  ctx.stroke()
  y += 50

  // ── CALORIE CARD ─────────────────────────────────────────────
  const totalCal = meals.reduce((s, m) => s + (m.cal || 0), 0)
  const calGoal  = profile?.calGoal || 1800
  const calPct   = Math.min(totalCal / calGoal, 1)
  const remaining = calGoal - totalCal

  glassCard(PAD, y, CARD_W, 230)

  // Ring
  const ringX = PAD + 115, ringY = y + 115, ringR = 80
  // Track
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2)
  ctx.stroke()
  // Progress
  if (calPct > 0) {
    const grad = ctx.createLinearGradient(ringX - ringR, ringY, ringX + ringR, ringY)
    grad.addColorStop(0, '#4CAF8C')
    grad.addColorStop(1, '#34d399')
    ctx.strokeStyle = grad
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.arc(ringX, ringY, ringR, -Math.PI / 2, -Math.PI / 2 + calPct * Math.PI * 2)
    ctx.stroke()
  }
  // Center text
  ctx.fillStyle = 'white'
  ctx.font = f(46, '700')
  ctx.textAlign = 'center'
  ctx.fillText(totalCal.toLocaleString(), ringX, ringY + 10)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = f(22)
  ctx.fillText('kcal', ringX, ringY + 38)

  // Right text
  ctx.textAlign = 'left'
  ctx.fillStyle = 'white'
  ctx.font = f(36, '700')
  ctx.fillText('แคลอรี่วันนี้', PAD + 250, y + 70)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = f(26)
  ctx.fillText(`เป้าหมาย ${calGoal.toLocaleString()} kcal`, PAD + 250, y + 112)
  ctx.fillStyle = remaining < 0 ? '#FFB3B3' : '#4CAF8C'
  ctx.font = f(30, '600')
  ctx.fillText(
    remaining < 0 ? `เกิน ${Math.abs(remaining).toLocaleString()} kcal` : `เหลือ ${remaining.toLocaleString()} kcal`,
    PAD + 250, y + 155
  )

  // Macro pills
  const macros = [
    { label: 'P', val: meals.reduce((s,m)=>s+(m.protein||0),0), color: '#60a5fa' },
    { label: 'C', val: meals.reduce((s,m)=>s+(m.carbs||0),0),   color: '#fbbf24' },
    { label: 'F', val: meals.reduce((s,m)=>s+(m.fat||0),0),     color: '#f87171' },
  ]
  macros.forEach((m, i) => {
    const mx = PAD + 250 + i * 120
    roundRect(mx, y + 175, 105, 38, 19, 'rgba(255,255,255,0.1)')
    ctx.fillStyle = m.color
    ctx.font = f(20, '700')
    ctx.textAlign = 'center'
    ctx.fillText(`${m.label} ${m.val}g`, mx + 52, y + 200)
  })

  y += 270

  // ── STATS ROW ────────────────────────────────────────────────
  const statW = (CARD_W - 32) / 3
  const statData = [
    {
      label: 'น้ำดื่ม', value: `${water}`, unit: '/8 แก้ว',
      color: '#60a5fa', icon: '💧',
      pct: water / 8,
    },
    {
      label: 'นิสัย', value: `${habitDefs.filter(h=>(habitLog[h.id]??0)>=h.target).length}`, unit: `/${habitDefs.length} ทำแล้ว`,
      color: '#4CAF8C', icon: '✅',
      pct: habitDefs.length ? habitDefs.filter(h=>(habitLog[h.id]??0)>=h.target).length / habitDefs.length : 0,
    },
    {
      label: 'การนอน', value: sleep?.hours ? `${sleep.hours}` : '—', unit: 'ชั่วโมง',
      color: sleep?.hours >= 7 ? '#4CAF8C' : sleep?.hours >= 6 ? '#fbbf24' : '#f87171',
      icon: '🌙',
      pct: sleep?.hours ? Math.min(sleep.hours / 8, 1) : 0,
    },
  ]

  statData.forEach((s, i) => {
    const sx = PAD + i * (statW + 16)
    glassCard(sx, y, statW, 200)

    // Icon
    ctx.font = f(36)
    ctx.textAlign = 'center'
    ctx.fillText(s.icon, sx + statW / 2, y + 52)

    // Value
    ctx.fillStyle = s.color
    ctx.font = f(52, '700')
    ctx.fillText(s.value, sx + statW / 2, y + 115)

    // Unit
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = f(22)
    ctx.fillText(s.unit, sx + statW / 2, y + 148)

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = f(24, '600')
    ctx.fillText(s.label, sx + statW / 2, y + 182)

    // Mini progress bar
    const barX = sx + 20, barY = y + 192, barW = statW - 40
    roundRect(barX, barY, barW, 6, 3, 'rgba(255,255,255,0.1)')
    if (s.pct > 0) {
      roundRect(barX, barY, barW * s.pct, 6, 3, s.color)
    }
  })

  y += 240

  // ── MOOD CARD ────────────────────────────────────────────────
  if (mood) {
    const moodLabels = ['', 'แย่มาก', 'ไม่ค่อยดี', 'เฉยๆ', 'ดี', 'ดีมาก']
    const moodEmojis = ['', '😞', '😑', '🙂', '😊', '😄']
    const moodColors = ['', '#94a3b8', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']

    glassCard(PAD, y, CARD_W, mood.note ? 180 : 130)

    ctx.font = f(52)
    ctx.textAlign = 'left'
    ctx.fillText(moodEmojis[mood.val] || '', PAD + 28, y + 78)

    ctx.fillStyle = moodColors[mood.val] || 'white'
    ctx.font = f(36, '700')
    ctx.fillText(`อารมณ์วันนี้: ${moodLabels[mood.val]}`, PAD + 110, y + 60)

    if (mood.note) {
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = f(26)
      const note = mood.note.length > 45 ? mood.note.slice(0, 45) + '…' : mood.note
      ctx.fillText(`"${note}"`, PAD + 110, y + 105)
    }

    y += mood.note ? 220 : 170
  }

  // ── HABITS CARD ──────────────────────────────────────────────
  if (habitDefs.length > 0) {
    const habH = 80 + habitDefs.length * 72
    glassCard(PAD, y, CARD_W, habH)

    ctx.fillStyle = 'white'
    ctx.font = f(32, '700')
    ctx.textAlign = 'left'
    ctx.fillText('นิสัยประจำวัน', PAD + 28, y + 50)

    habitDefs.forEach((h, i) => {
      const hy = y + 80 + i * 72
      const done = (habitLog[h.id] ?? 0) >= h.target

      // Circle
      ctx.strokeStyle = done ? '#4CAF8C' : 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(PAD + 50, hy + 22, 18, 0, Math.PI * 2)
      ctx.stroke()

      if (done) {
        ctx.fillStyle = '#4CAF8C'
        ctx.beginPath()
        ctx.arc(PAD + 50, hy + 22, 18, 0, Math.PI * 2)
        ctx.fill()
        // Checkmark
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(PAD + 41, hy + 22)
        ctx.lineTo(PAD + 48, hy + 29)
        ctx.lineTo(PAD + 60, hy + 15)
        ctx.stroke()
      }

      ctx.fillStyle = done ? '#4CAF8C' : 'rgba(255,255,255,0.75)'
      ctx.font = f(28, done ? '600' : '400')
      ctx.textAlign = 'left'
      ctx.fillText(h.name, PAD + 88, hy + 30)

      // Separator
      if (i < habitDefs.length - 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(PAD + 28, hy + 60)
        ctx.lineTo(W - PAD - 28, hy + 60)
        ctx.stroke()
      }
    })

    y += habH + 40
  }

  // ── FOOTER ───────────────────────────────────────────────────
  // Bottom gradient fade
  const fadeGrad = ctx.createLinearGradient(0, H - 200, 0, H)
  fadeGrad.addColorStop(0, 'transparent')
  fadeGrad.addColorStop(1, 'rgba(0,0,0,0.4)')
  ctx.fillStyle = fadeGrad
  ctx.fillRect(0, H - 200, W, 200)

  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = f(24)
  ctx.textAlign = 'center'
  ctx.fillText('สร้างด้วย สุขภาพดี App  ·  ดูแลตัวเองทุกวัน 🌿', W / 2, H - 60)

  // ── Download ─────────────────────────────────────────────────
  const link = document.createElement('a')
  link.download = `health-card-${new Date().toISOString().slice(0, 10)}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
}
