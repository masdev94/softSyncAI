import { useState } from 'react'
import { motion } from 'framer-motion'
import { DemoAppMockup } from './DemoAppMockup'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

const viewport = { once: true, amount: 0.2 }

export type DemoTabId = 'ai' | 'pipeline' | 'email'

const TABS: { id: DemoTabId; label: string }[] = [
  { id: 'ai', label: 'AI Analyst' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'email', label: 'Email' },
]

/**
 * Product Demo Section – showcases the SoftSync platform in action.
 * Step 5: Tabs for AI Analyst, Pipeline, Email with smooth transitions.
 */
export function ProductDemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTabId>('ai')

  return (
    <section
      id="product-demo"
      className="w-full min-h-screen py-16 md:py-24 bg-white"
      aria-label="Product demo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center mb-4"
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={viewport}
          transition={{ ...fadeUp.transition, delay: 0 }}
        >
          See SoftSync in action
        </motion.h2>
        <motion.p
          className="text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-8"
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={viewport}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
        >
          One interface. Every tool. Zero friction.
        </motion.p>
        <motion.nav
          className="flex justify-center gap-1 mb-8 md:mb-10 overflow-x-auto py-2 md:py-0 scrollbar-thin"
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={viewport}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          aria-label="Demo views"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <DemoAppMockup activeTab={activeTab} />
        </motion.div>
      </div>
    </section>
  )
}
