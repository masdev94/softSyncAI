import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { DemoTabId } from './ProductDemoSection'

const USER_MESSAGE = "Which accounts haven't been contacted in 30 days?"
const AI_MESSAGE =
  "I found 12 accounts with no contact in 30+ days. Top 3: Acme Corp, TechStart Inc, Global Solutions. I can draft re-engagement emails or add them to a sequence—want me to do that?"

/**
 * SoftSync app mockup: sidebar + chat area with simulated typewriter chat.
 * Matches the reference UI (logo, nav, My groups, chat window, input).
 */

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    chat: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    search: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    notification: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    dashboards: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    pipeline: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    people: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    invite: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    send: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  }
  return icons[name] ?? null
}

function SoftSyncLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
        <path d="M8 4v24l8-6V10l8 12V4" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const tabTransition = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
}

export function DemoAppMockup({ activeTab }: { activeTab: DemoTabId }) {
  const [phase, setPhase] = useState<'idle' | 'typing-user' | 'user-done' | 'typing-ai' | 'ai-done'>('idle')
  const userTypingEnabled = phase === 'typing-user' || phase === 'user-done'
  const aiTypingEnabled = phase === 'typing-ai' || phase === 'ai-done'
  const [userText, userComplete] = useTypewriter(USER_MESSAGE, userTypingEnabled, 40)
  const [aiText, aiComplete] = useTypewriter(AI_MESSAGE, aiTypingEnabled, 28)

  useEffect(() => {
    const t = setTimeout(() => setPhase('typing-user'), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'typing-user' || !userComplete) return
    const t = setTimeout(() => setPhase('typing-ai'), 600)
    return () => clearTimeout(t)
  }, [phase, userComplete])

  useEffect(() => {
    if (phase !== 'typing-ai' || !aiComplete) return
    setPhase('ai-done')
  }, [phase, aiComplete])

  return (
    <div className="flex bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden min-h-[420px] md:min-h-[480px] max-h-[80vh] md:max-h-[560px]">
      {/* Sidebar: hidden on mobile, narrow on tablet, full on desktop */}
      <aside className="hidden md:flex md:w-16 lg:w-[240px] flex-shrink-0 bg-neutral-100 border-r border-neutral-200 flex-col">
        <div className="p-2 lg:p-3 border-b border-neutral-200 flex items-center gap-2 justify-center lg:justify-start">
          <SoftSyncLogo className="w-7 h-7 lg:w-8 lg:h-8" />
          <span className="font-semibold text-neutral-800 hidden lg:inline">SoftSync</span>
          <div className="hidden lg:flex ml-auto flex gap-1 text-neutral-500">
            <span className="p-1 rounded hover:bg-neutral-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
            <span className="p-1 rounded hover:bg-neutral-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></span>
          </div>
        </div>
        <nav className="p-2 flex flex-col gap-0.5">
          <a href="#" className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">
            <NavIcon name="chat" />
            <span className="hidden lg:inline">Chat</span>
          </a>
          <a href="#" className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-200">
            <NavIcon name="search" />
            <span className="hidden lg:inline">Search</span>
          </a>
          <a href="#" className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-200">
            <NavIcon name="notification" />
            <span className="hidden lg:inline">Notification</span>
          </a>
          <a href="#" className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-200">
            <NavIcon name="email" />
            <span className="hidden lg:inline">Email</span>
          </a>
          <a href="#" className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-200">
            <NavIcon name="dashboards" />
            <span className="hidden lg:inline">Dashboards</span>
          </a>
        </nav>
        <div className="hidden lg:block px-3 py-2 border-t border-neutral-200">
          <button type="button" className="flex items-center gap-2 w-full text-left text-neutral-600 text-sm font-medium">
            <span>My groups</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div className="mt-1 pl-4 space-y-0.5">
            <div className="flex items-center gap-2 py-1 text-amber-700">
              <span className="text-amber-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></span>
              <span className="text-sm">Leads</span>
            </div>
            <div className="pl-6 text-neutral-500 text-sm flex items-center gap-1.5"><NavIcon name="pipeline" /> Pipeline</div>
            <div className="pl-6 text-neutral-500 text-sm flex items-center gap-1.5"><NavIcon name="people" /> All people</div>
            <div className="flex items-center gap-2 py-1 text-amber-700">
              <span className="text-amber-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></span>
              <span className="text-sm">Clients</span>
            </div>
            <div className="pl-6 text-neutral-500 text-sm flex items-center gap-1.5"><NavIcon name="pipeline" /> Pipeline</div>
            <div className="pl-6 text-neutral-500 text-sm flex items-center gap-1.5"><NavIcon name="people" /> All people</div>
            <button type="button" className="flex items-center gap-2 py-1 text-neutral-500 text-sm hover:text-neutral-700">
              <span className="text-neutral-400">+</span> New Group
            </button>
          </div>
        </div>
        <div className="hidden lg:block px-3 py-2 border-t border-neutral-200 flex-1">
          <button type="button" className="flex items-center gap-2 w-full text-left text-neutral-600 text-sm font-medium">
            <span>Chat</span>
            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <p className="text-neutral-400 text-sm mt-2">No chats yet.</p>
        </div>
        <div className="p-2 lg:p-3 border-t border-neutral-200 mt-auto">
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-neutral-800">Filip Johnson</p>
            <p className="text-xs text-neutral-500">filip@softsync.ai</p>
            <div className="mt-2 flex gap-1">
              <a href="#" className="flex items-center gap-1.5 px-2 py-1.5 rounded text-neutral-600 text-sm hover:bg-neutral-200"><NavIcon name="settings" /> Settings</a>
              <a href="#" className="flex items-center gap-1.5 px-2 py-1.5 rounded text-neutral-600 text-sm hover:bg-neutral-200"><NavIcon name="invite" /> Invite members</a>
            </div>
          </div>
          <div className="flex lg:hidden justify-center">
            <span className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center" aria-hidden>
              <span className="text-xs font-medium text-neutral-600">FJ</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile header: only when sidebar is hidden */}
      <div className="md:hidden flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-neutral-100 border-b border-neutral-200">
        <SoftSyncLogo className="w-7 h-7" />
        <span className="font-semibold text-neutral-800">SoftSync</span>
      </div>

      {/* Main content – tabbed views with transition */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              className="flex-1 flex flex-col min-h-0"
              {...tabTransition}
            >
              <div className="p-4 border-b border-neutral-100">
                <div className="flex items-start gap-3">
                  <SoftSyncLogo className="w-8 h-8 flex-shrink-0" />
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Hi! I'm your SoftSync AI Analyst. I surface insights from your CRM data, flag risks, and help you take action.
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                {(phase === 'typing-user' || phase === 'user-done' || phase === 'typing-ai' || phase === 'ai-done') && (
                  <div className="flex justify-end gap-2">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-neutral-100 px-4 py-3 flex items-end gap-2">
                      <span className="text-sm text-neutral-800">
                        {userText}
                        {phase === 'typing-user' && (
                          <span className="inline-block w-0.5 h-4 ml-0.5 bg-neutral-500 animate-pulse" aria-hidden />
                        )}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0" aria-hidden>
                        <svg className="w-3.5 h-3.5 text-neutral-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                      </span>
                    </div>
                  </div>
                )}
                {(phase === 'typing-ai' || phase === 'ai-done') && (
                  <div className="flex justify-start gap-2">
                    <SoftSyncLogo className="w-7 h-7 flex-shrink-0 mt-1" />
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-indigo-50 border border-indigo-100 px-4 py-3">
                      <span className="text-sm text-neutral-800">
                        {aiText}
                        {phase === 'typing-ai' && (
                          <span className="inline-block w-0.5 h-4 ml-0.5 bg-indigo-500 animate-pulse" aria-hidden />
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-500 mb-2">Find the right people for the right deal...</p>
                <div className="flex gap-2 items-end rounded-xl bg-neutral-50 border border-neutral-200 p-2">
                  <textarea
                    readOnly
                    rows={1}
                    placeholder="Find the right people for the right deal..."
                    className="flex-1 min-w-0 bg-transparent border-0 resize-none text-sm text-neutral-700 placeholder:text-neutral-400 focus:ring-0 focus:outline-none"
                  />
                  <button type="button" className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50" aria-label="Send">
                    <NavIcon name="send" />
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">
                  Press Enter to send. Shift + Enter for new line. Use @ to mention teammates, records, or groups.
                </p>
              </div>
            </motion.div>
          )}
          {activeTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              className="flex-1 flex flex-col min-h-0 overflow-hidden p-4"
              {...tabTransition}
            >
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-sm font-semibold text-neutral-800">Leads pipeline</h3>
                <span className="text-xs text-neutral-500">Real-time</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 min-h-0 flex-1">
                {['New', 'Contacted', 'Qualified', 'Proposal'].map((col, i) => (
                  <div key={col} className="flex-shrink-0 w-[140px] md:w-[160px] rounded-lg bg-neutral-50 border border-neutral-200 p-2 flex flex-col gap-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{col}</p>
                    {[0, 1, 2].slice(0, i + 1).map((j) => (
                      <div
                        key={j}
                        className="rounded-md bg-white border border-neutral-200 p-2.5 shadow-sm text-sm text-neutral-800"
                      >
                        <p className="font-medium">Acme Corp</p>
                        <p className="text-xs text-neutral-500 mt-0.5">$12k · 2 days ago</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === 'email' && (
            <motion.div
              key="email"
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
              {...tabTransition}
            >
              <div className="border-b border-neutral-100 p-3 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  readOnly
                  value="Search emails..."
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 min-w-0"
                />
              </div>
              <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-auto">
                <div className="md:w-48 flex-shrink-0 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
                  {['Re-engagement – Stripe', 'Pipeline health Q3', 'At-risk deals'].map((subj, i) => (
                    <div
                      key={subj}
                      className={`flex-shrink-0 md:flex-shrink px-3 py-2.5 text-sm border-r md:border-r-0 border-b-0 md:border-b border-neutral-100 min-w-[140px] md:min-w-0 ${i === 0 ? 'bg-indigo-50 text-indigo-800 font-medium' : 'text-neutral-600'}`}
                    >
                      {subj}
                    </div>
                  ))}
                </div>
                <div className="flex-1 overflow-auto p-4 min-w-0">
                  <p className="text-xs text-neutral-500 mb-2">Draft · Re-engagement – Stripe</p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Hi there — checking in after a few weeks. We'd love to show you the latest on sync and AI workflows. Happy to find 15 min this week?
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
