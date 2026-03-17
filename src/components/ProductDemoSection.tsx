import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DemoAppMockup } from './DemoAppMockup'

export type DemoTabId = 'ai' | 'table' | 'pipeline' | 'email'

const TAB_DURATION: Record<DemoTabId, number> = {
  ai:       18000,
  table:    12000,
  pipeline: 12000,
  email:    12000,
}

const TABS_ORDER: DemoTabId[] = ['ai', 'table', 'pipeline', 'email']

const FEATURE_CARDS = [
  {
    icon: 'connect',
    title: 'Connect everything',
    desc: 'Sync your CRM, email, calendar, and tools into one unified workspace — no manual imports needed.',
  },
  {
    icon: 'enrich',
    title: 'Auto-enrich records',
    desc: 'Automatically keep contacts and company data fresh with real-time enrichment from trusted sources.',
  },
  {
    icon: 'visibility',
    title: 'Full relationship visibility',
    desc: 'See every interaction, deal, and touchpoint in one place — across your entire team.',
  },
  {
    icon: 'activate',
    title: 'Activate faster',
    desc: 'Turn data into action with AI-powered suggestions, follow-up reminders, and pipeline automation.',
  },
]

const ease = [0.25, 0.46, 0.45, 0.94] as const

const SECTION_BG     = '#17172A'
const HIGHLIGHT_COLOR = '#B3B3FF'

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: -260, left: -200,
          background: 'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(99,102,241,0.10) 45%, transparent 70%)',
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 620, height: 620,
          bottom: -220, right: -160,
          background: 'radial-gradient(circle, rgba(139,92,246,0.32) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)',
        }}
        animate={{ x: [0, -50, 28, 0], y: [0, -34, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480,
          top: '30%', left: 'calc(50% - 240px)',
          background: 'radial-gradient(circle, rgba(179,179,255,0.14) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.22, 0.90, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function BackgroundNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const N        = 34
    const MAX_DIST = 190
    const SPEED    = 0.38

    type Node = { x: number; y: number; vx: number; vy: number; r: number }

    let w = canvas.width
    let h = canvas.height

    const nodes: Node[] = Array.from({ length: N }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 2.5 + 2.0,
    }))

    let raf: number

    function frame() {
      if (!ctx || !canvas) return
      w = canvas.width
      h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x <= 0 || n.x >= w) { n.vx *= -1; n.x = Math.max(0, Math.min(w, n.x)) }
        if (n.y <= 0 || n.y >= h) { n.vy *= -1; n.y = Math.max(0, Math.min(h, n.y)) }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.hypot(dx, dy)
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.55
            ctx.strokeStyle = `rgba(179,179,255,${a.toFixed(3)})`
            ctx.lineWidth = 1.0
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 2.8, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(179,179,255,0.10)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(209,209,255,0.82)'
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  )
}

export function ProductDemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTabId>('ai')
  const [cycleCount, setCycleCount] = useState(0)

  const goToTab = useCallback((id: DemoTabId) => {
    setActiveTab(id)
    setCycleCount((c) => c + 1)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const idx = TABS_ORDER.indexOf(activeTab)
      goToTab(TABS_ORDER[(idx + 1) % TABS_ORDER.length])
    }, TAB_DURATION[activeTab])
    return () => clearTimeout(t)
  }, [activeTab, cycleCount, goToTab])

  return (
    <section
      id="product-demo"
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ background: SECTION_BG }}
      aria-label="Product demo"
    >
      <BackgroundOrbs />
      <BackgroundNetwork />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight mb-4">
            Built to{' '}
            <span style={{ color: HIGHLIGHT_COLOR }}>Sync</span>
            ,{' '}
            <span style={{ color: HIGHLIGHT_COLOR }}>Enrich</span>
            {' '}and{' '}
            <span style={{ color: HIGHLIGHT_COLOR }}>Activate</span>
            {' '}your workflow
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Turns disconnected data stack into one intelligent system — helping you stay focused, move faster, and close more deals.
          </p>
        </motion.div>

        <motion.div
          className="mb-14 md:mb-18"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <div className="rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
            <DemoAppMockup activeTab={activeTab} cycleCount={cycleCount} onTabChange={goToTab} />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <FeatureIcon name={card.icon} />
              <h3 className="text-[15px] font-semibold text-white mt-3 mb-2">{card.title}</h3>
              <p className="text-[13px] text-white/60 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.2, ease }}
        >
          <p className="text-[13px] text-white/50 mb-6">+ Add upcoming feature</p>
          <a
            href="https://app.softsync.ai/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Start for free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-white/40 text-sm mt-3">Try for free for 14 days · No credit card needed</p>
        </motion.div>
      </div>
    </section>
  )
}

const _ic = 'w-8 h-8 flex-shrink-0'
const _st = HIGHLIGHT_COLOR
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  connect: (
    <svg className={_ic} viewBox="0 0 24 24" fill="none" stroke={_st} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M8 8l2 2 2-2M14 14l2 2 2-2" />
    </svg>
  ),
  enrich: (
    <svg className={_ic} viewBox="0 0 24 24" fill="none" stroke={_st} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 11-9-9 9 0 019 9z" />
      <path d="M21 3v2h-2M3 21v-2h2M21 21l-1.5-1.5M3 3l1.5 1.5M21 9h-2M3 9h2M9 21v2M9 3v2" />
    </svg>
  ),
  visibility: (
    <svg className={_ic} viewBox="0 0 24 24" fill="none" stroke={_st} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  activate: (
    <svg className={_ic} viewBox="0 0 24 24" fill="none" stroke={_st} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
}

function FeatureIcon({ name }: { name: string }) {
  return <div style={{ color: _st }}>{FEATURE_ICONS[name] ?? null}</div>
}
