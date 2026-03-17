import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { DemoTabId } from './ProductDemoSection'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const TOP_NAV_BG = '#1e3a5f'
const TOP_TABS   = ['AI-Analyst', 'Table', 'Pipeline', 'Email'] as const
const TAB_IDS    = ['ai', 'table', 'pipeline', 'email'] as const

type ChatPhase = 'idle' | 'user1' | 'ai1' | 'card' | 'ai2' | 'user2'

const pane = {
  initial:    { opacity: 0, x: 10 },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: -10 },
  transition: { duration: 0.22, ease },
}

const USER_MSG_1 = "Which accounts haven't been contacted in 30 days?"
const AI_MSG_1   = 'Found 3 high-value accounts with no activity in 30+ days. Combined pipeline value: $840K.'
const AI_MSG_2   = 'Want me to draft a personalised re-engagement email for any of these?'
const USER_MSG_2 = 'Yes — draft one for Stripe'

const STALE_ACCOUNTS = [
  { company: 'Stripe',  initial: 'ST', color: '#6366f1', owner: 'Sarah Kim',   value: '$320K', days: '38 days ago' },
  { company: 'Shopify', initial: 'SH', color: '#22c55e', owner: 'Marcus Lee',  value: '$280K', days: '41 days ago' },
  { company: 'Notion',  initial: 'NO', color: '#64748b', owner: 'Priya Nair',  value: '$240K', days: '35 days ago' },
]

const SUGGESTED = [
  "Which accounts haven't been contacted in 30 days?",
  'Draft a re-engagement email for Stripe',
  "What's our pipeline health this quarter?",
  'Show me at-risk deals',
]

type StatusType = 'orange' | 'green' | 'amber' | 'red' | 'teal'

const STATUS_CLS: Record<StatusType, string> = {
  orange: 'bg-orange-50  text-orange-600 border-orange-200',
  green:  'bg-green-50   text-green-600  border-green-200',
  amber:  'bg-amber-50   text-amber-600  border-amber-200',
  red:    'bg-red-50     text-red-600    border-red-200',
  teal:   'bg-teal-50    text-teal-600   border-teal-200',
}

const TABLE_PEOPLE: {
  name: string; initials: string; avatarColor: string;
  companyInitials: string; companyColor: string; company: string;
  email: string; status: string; statusType: StatusType; jobTitle: string;
}[] = [
  { name: 'James Anderson',  initials: 'JA', avatarColor: '#f97316', companyInitials: 'SS',  companyColor: '#6366f1', company: 'SoftSync.ai',       email: 'james.anderson@softsync.ai',       status: 'To connected', statusType: 'orange', jobTitle: 'Product Designer'   },
  { name: 'Michael Turner',  initials: 'MT', avatarColor: '#22c55e', companyInitials: 'EXL', companyColor: '#22c55e', company: 'EXL Exiservice',     email: 'michael.turner@exl.com',           status: 'Connected',    statusType: 'green',  jobTitle: 'Web Designer'       },
  { name: 'Alex Morgan',     initials: 'AM', avatarColor: '#a855f7', companyInitials: 'W',   companyColor: '#f97316', company: 'Wisflux Tech Labs',  email: 'alex.morgan@wisflux.com',          status: 'Pending',      statusType: 'amber',  jobTitle: 'Motion Designer'    },
  { name: 'Emily Carter',    initials: 'EC', avatarColor: '#64748b', companyInitials: 'BR',  companyColor: '#1e293b', company: 'Black Rocket',       email: 'emily.carter@blackrocket.com',     status: 'Rejected',     statusType: 'red',    jobTitle: 'HR Manager'         },
  { name: 'Sophia Reynolds', initials: 'SR', avatarColor: '#3b82f6', companyInitials: 'H',   companyColor: '#64748b', company: 'Hawkscode',          email: 'sophia.reynolds@hawkscode.io',     status: 'Qualified',    statusType: 'teal',   jobTitle: 'Operations Manager' },
]

type TierType = 'purple' | 'blue' | 'orange' | 'red'

const TIER_CLS: Record<TierType, string> = {
  purple: 'bg-purple-100 text-purple-700',
  blue:   'bg-blue-100   text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100    text-red-700',
}

const PIPELINE_COLS: {
  label: string; count: number; dotColor: string;
  cards: { company: string; initial: string; bgColor: string; tier: string; tierType: TierType; value: string; owner: string; ownerInitials: string; ownerColor: string; days: string }[]
}[] = [
  {
    label: 'Lead', count: 213, dotColor: '#3b82f6',
    cards: [
      { company: 'GitHub – x20 Enterprise', initial: 'GH', bgColor: '#1e293b', tier: 'Enterprise', tierType: 'purple', value: '$13,500.00', owner: 'Ethan Blake',  ownerInitials: 'EB', ownerColor: '#6366f1', days: '2d'  },
      { company: 'Slack – Expansion',        initial: 'S',  bgColor: '#6366f1', tier: 'Plus',       tierType: 'purple', value: '$9,600.00',  owner: 'Emily Carter', ownerInitials: 'EC', ownerColor: '#22c55e', days: '25d' },
      { company: 'Stripe',                   initial: 'S',  bgColor: '#635bff', tier: 'Pro',        tierType: 'blue',   value: '$30,620.00', owner: 'Lucas Weber',  ownerInitials: 'LW', ownerColor: '#f97316', days: '4d'  },
    ],
  },
  {
    label: 'Contacted', count: 346, dotColor: '#a855f7',
    cards: [
      { company: 'Intercom – Automations', initial: 'I',  bgColor: '#6366f1', tier: 'Medium', tierType: 'blue',   value: '$12,000.00', owner: 'Sarah Johnson', ownerInitials: 'SJ', ownerColor: '#f97316', days: '7d'  },
      { company: 'Segment – x30 Pro',      initial: 'SG', bgColor: '#f97316', tier: 'Pro',    tierType: 'orange', value: '$8,500.00',  owner: 'David Chen',   ownerInitials: 'DC', ownerColor: '#3b82f6', days: '12d' },
    ],
  },
  {
    label: 'Qualification', count: 62, dotColor: '#ec4899',
    cards: [
      { company: 'Notion – Exec', initial: 'N', bgColor: '#1e293b', tier: 'Medium', tierType: 'blue', value: '$15,000.00', owner: 'Lisa Wang', ownerInitials: 'LW', ownerColor: '#a855f7', days: '5d' },
    ],
  },
  {
    label: 'Evaluation', count: 44, dotColor: '#f97316',
    cards: [
      { company: 'Loom',   initial: 'L', bgColor: '#8b5cf6', tier: 'Medium',    tierType: 'blue', value: '$7,200.00',  owner: 'Alex Kim',     ownerInitials: 'AK', ownerColor: '#22c55e', days: '18d' },
      { company: 'Retool', initial: 'R', bgColor: '#ef4444', tier: 'Excellent',  tierType: 'red',  value: '$22,000.00', owner: 'Maria Garcia', ownerInitials: 'MG', ownerColor: '#f97316', days: '20d' },
    ],
  },
]

function usePaneReveal(delayMs = 100): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])
  return visible
}

const P: Record<string, React.ReactNode> = {
  chat:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  search:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  bell:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  mail:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  clock:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  send:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
  chevron:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 9l-7 7-7-7" />,
  plus:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 4v16m8-8H4" />,
  layout:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />,
  table:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 10h18M3 14h18M10 4v16M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />,
  people:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  settings: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  invite:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
  filter:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
  sort:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />,
  refresh:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  dots:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />,
  kanban:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />,
  enrich:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  import:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
  share:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
  enroll:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
}

function Icon({ n, cls = 'w-4 h-4' }: { n: string; cls?: string }) {
  return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">{P[n]}</svg>
}

function VarTag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium text-blue-600 bg-blue-100 border border-blue-200 mx-0.5">
      {text}
    </span>
  )
}

function PaneHeader({ view }: { view: 'table' | 'pipeline' }) {
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-200 flex-shrink-0">
        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-indigo-600 font-bold">L</span>
        </div>
        <span className="text-[13px] font-semibold text-neutral-800">Leads</span>
        <button className="flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-700 ml-1">
          <Icon n="plus" cls="w-3 h-3" /> Create
        </button>
        <button className="flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-700">
          <Icon n="enroll" cls="w-3 h-3" /> Enroll
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1 text-[12px] text-neutral-500 border border-neutral-200 px-2 py-1 rounded-md hover:bg-neutral-50">
            <Icon n="import" cls="w-3 h-3" /> Smart Import
          </button>
          <button className="flex items-center gap-1 text-[12px] text-neutral-500 border border-neutral-200 px-2 py-1 rounded-md hover:bg-neutral-50">
            <Icon n="share" cls="w-3 h-3" /> Share
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-neutral-200 flex-shrink-0">
        <button className="flex items-center gap-1.5 text-[12px] text-neutral-600 border border-neutral-200 px-2 py-1 rounded-md bg-neutral-50">
          <Icon n={view === 'table' ? 'table' : 'kanban'} cls="w-3 h-3" />
          <span>{view === 'table' ? 'All People – Leads' : 'Pipeline – Leads'}</span>
          <Icon n="chevron" cls="w-2.5 h-2.5" />
        </button>
        <Icon n="settings" cls="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[11px] text-neutral-500">5 in view</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-md px-2.5 py-1.5 flex-shrink-0">
          <Icon n="search" cls="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-400">Search records…</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <button className="p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50"><Icon n="sort"    cls="w-3 h-3" /></button>
          <button className="p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50"><Icon n="filter"  cls="w-3 h-3" /></button>
          <button className="p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50"><Icon n="refresh" cls="w-3 h-3" /></button>
          <button className="p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50"><Icon n="dots"    cls="w-3 h-3" /></button>
        </div>
        {view === 'table' && (
          <button className="flex items-center gap-1 text-[11px] text-neutral-500 border border-neutral-200 px-2 py-1.5 rounded-md hover:bg-neutral-50 ml-1">
            <Icon n="enrich" cls="w-3 h-3" /> Enrich (0)
          </button>
        )}
        <button className="ml-auto p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50 text-neutral-400">
          <Icon n="plus" cls="w-3 h-3" />
        </button>
      </div>
    </>
  )
}

function TablePane() {
  const visible = usePaneReveal()

  return (
    <>
      <PaneHeader view="table" />
      <div className="flex-1 overflow-auto">
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 sticky top-0 z-10">
          <div className="w-8 flex-shrink-0 px-2 py-2">
            <div className="w-3.5 h-3.5 border border-neutral-300 rounded" />
          </div>
          {['Name', 'Company', 'Email', 'Status', 'Job Title'].map((col) => (
            <div key={col} className={`py-2 px-2 text-[11px] font-semibold text-neutral-500 truncate ${
              col === 'Name' ? 'w-36 flex-shrink-0' : col === 'Email' ? 'flex-1 min-w-0' : 'w-28 flex-shrink-0'
            }`}>
              {col}
            </div>
          ))}
        </div>
        {TABLE_PEOPLE.map((person, i) => (
          <motion.div
            key={person.name}
            className="flex items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors group cursor-default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.28, ease }}
          >
            <div className="w-8 flex-shrink-0 px-2 py-2.5">
              <div className="w-3.5 h-3.5 border border-neutral-300 rounded" />
            </div>
            <div className="w-36 flex-shrink-0 flex items-center gap-2 px-2 py-2.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white" style={{ background: person.avatarColor }}>
                {person.initials}
              </div>
              <span className="text-[12px] text-neutral-800 truncate font-medium">{person.name}</span>
            </div>
            <div className="w-28 flex-shrink-0 flex items-center gap-1.5 px-2 py-2.5">
              <div className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white" style={{ background: person.companyColor }}>
                {person.companyInitials.slice(0, 2)}
              </div>
              <span className="text-[11px] text-neutral-600 truncate">{person.company}</span>
            </div>
            <div className="flex-1 min-w-0 px-2 py-2.5">
              <span className="text-[11px] text-neutral-500 truncate block">{person.email}</span>
            </div>
            <div className="w-28 flex-shrink-0 px-2 py-2.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_CLS[person.statusType]}`}>
                {person.status}
              </span>
            </div>
            <div className="w-28 flex-shrink-0 px-2 py-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200">
                {person.jobTitle}
              </span>
            </div>
          </motion.div>
        ))}
        <div className="px-4 py-3">
          <button className="flex items-center gap-1.5 text-[12px] text-neutral-500 border border-dashed border-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-400 hover:text-neutral-700 transition-colors">
            <Icon n="plus" cls="w-3 h-3" /> Add Contacts
          </button>
        </div>
      </div>
    </>
  )
}

function PipelinePane() {
  const visible = usePaneReveal()

  return (
    <>
      <PaneHeader view="pipeline" />
      <div className="flex gap-3 p-3 overflow-x-auto flex-1 min-h-0 bg-neutral-50">
        {PIPELINE_COLS.map((col, ci) => (
          <div key={col.label} className="flex-shrink-0 w-[195px] flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.dotColor }} aria-hidden />
              <span className="text-[12px] font-semibold text-neutral-700">{col.label}</span>
              <span className="text-[11px] text-neutral-400 font-medium">{col.count}</span>
              <button className="ml-auto text-neutral-300 hover:text-neutral-500">
                <Icon n="plus" cls="w-3.5 h-3.5" />
              </button>
            </div>
            {col.cards.map((card, ri) => (
              <motion.div
                key={card.company}
                className="bg-white border border-neutral-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-default"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
                transition={{ delay: ci * 0.07 + ri * 0.06, duration: 0.3, ease }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: card.bgColor }}
                  >
                    {card.initial}
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-800 leading-tight line-clamp-2">{card.company}</p>
                </div>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mb-2 ${TIER_CLS[card.tierType]}`}>
                  {card.tier}
                </span>
                <p className="text-[14px] font-semibold text-neutral-800 mb-2">{card.value}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ background: card.ownerColor }}>
                    {card.ownerInitials}
                  </div>
                  <span className="text-[11px] text-neutral-500 truncate">{card.owner}</span>
                  <div className="ml-auto flex items-center gap-0.5 text-neutral-400">
                    <Icon n="clock" cls="w-3 h-3" />
                    <span className="text-[10px]">{card.days}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

type BodySeg  = { type: 'text'; text: string } | { type: 'tag'; text: string }
type BodyLine = BodySeg[]

const BODY_LINES: BodyLine[] = [
  [{ type: 'text', text: 'Hey ' }, { type: 'tag', text: 'first_name' }, { type: 'text', text: ',' }],
  [{ type: 'text', text: "Hope you're having a fantastic week!" }],
  [
    { type: 'text', text: 'My name is ' },
    { type: 'tag',  text: 'your_name'  },
    { type: 'text', text: " and I'm a business development associate here at " },
    { type: 'tag',  text: 'company'    },
    { type: 'text', text: '.'          },
  ],
  [{ type: 'text', text: 'To be honest, the business development associate is just fancy term to say "I\'m helping companies grow!"' }],
]

function lineLen(line: BodyLine) {
  return line.reduce((n, seg) => n + (seg.type === 'tag' ? 1 : seg.text.length), 0)
}

const LINE_LENS = BODY_LINES.map(lineLen)

function renderLine(line: BodyLine, chars: number): React.ReactNode[] {
  let left = chars
  return line.map((seg, i) => {
    if (left <= 0) return null
    if (seg.type === 'tag') {
      left -= 1
      return <VarTag key={i} text={seg.text} />
    }
    const show = Math.min(left, seg.text.length)
    left -= show
    return <span key={i}>{seg.text.slice(0, show)}</span>
  })
}

function EmailPane({ cycleCount }: { cycleCount: number }) {
  const [visible,  setVisible]  = useState(false)
  const [lineIdx,  setLineIdx]  = useState(-1)
  const [charIdx,  setCharIdx]  = useState(0)

  useEffect(() => {
    setVisible(false)
    setLineIdx(-1)
    setCharIdx(0)
    const t1 = setTimeout(() => setVisible(true), 180)
    const t2 = setTimeout(() => setLineIdx(0),    900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [cycleCount])

  useEffect(() => {
    if (lineIdx < 0 || lineIdx >= BODY_LINES.length) return
    const total = LINE_LENS[lineIdx]
    if (charIdx < total) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 22)
      return () => clearTimeout(t)
    }
    if (lineIdx < BODY_LINES.length - 1) {
      const t = setTimeout(() => { setLineIdx((l) => l + 1); setCharIdx(0) }, 180)
      return () => clearTimeout(t)
    }
  }, [lineIdx, charIdx])

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 flex-shrink-0">
        <div className="flex gap-5">
          {['Sent', 'Drafts', 'Templates'].map((tab, i) => (
            <button
              key={tab}
              className={`text-[13px] font-medium pb-1 transition-colors ${
                i === 0
                  ? 'text-neutral-800 border-b-2 border-neutral-800'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[12px] text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors">
            Save draft
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-white bg-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors font-medium">
            <Icon n="send" cls="w-3 h-3" />
            Send 400
          </button>
        </div>
      </div>
      <motion.div
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <span className="text-[12px] text-neutral-500 w-16 flex-shrink-0">From:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-white">JA</span>
            </div>
            <span className="text-[13px] text-neutral-800 font-medium">James Anderson</span>
            <span className="text-[12px] text-neutral-500">jamesanderson@gmail.com</span>
            <Icon n="chevron" cls="w-3 h-3 text-neutral-400" />
          </div>
        </div>
        <div className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100">
          <span className="text-[12px] text-neutral-500 w-16 flex-shrink-0 pt-0.5">To:</span>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <div className="flex -space-x-1.5">
              {[{ bg: '#6366f1', l: 'A' }, { bg: '#f97316', l: 'B' }, { bg: '#22c55e', l: 'C' }].map((a) => (
                <div key={a.l} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white" style={{ background: a.bg }}>
                  {a.l}
                </div>
              ))}
            </div>
            <span className="text-[13px] text-neutral-800 font-medium">400 recipients</span>
            <span className="text-[11px] text-neutral-400">(each message will be sent individually)</span>
          </div>
          <div className="flex gap-3 text-[12px] text-neutral-400 flex-shrink-0">
            <button className="hover:text-neutral-600">Cc</button>
            <button className="hover:text-neutral-600">Bcc</button>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <span className="text-[12px] text-neutral-500 w-16 flex-shrink-0">Subject:</span>
          <div className="flex items-center flex-wrap gap-0.5 text-[13px] text-neutral-800">
            <span>Can I help</span>
            <VarTag text="company" />
            <span>accomplish</span>
            <VarTag text="tasks" />
            <span>?</span>
          </div>
        </div>
        <div className="px-4 pt-5 pb-6 text-[13px] text-neutral-700 leading-relaxed flex flex-col gap-3">
          {BODY_LINES.map((line, i) => {
            if (i > lineIdx) return null
            const isActive = i === lineIdx
            const chars    = isActive ? charIdx : Infinity
            const lineDone = !isActive || charIdx >= LINE_LENS[i]
            return (
              <motion.p
                key={i}
                className={i === 3 ? 'text-neutral-500' : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {renderLine(line, chars)}
                {isActive && !lineDone && (
                  <span
                    className="inline-block w-[2px] h-[13px] ml-0.5 bg-indigo-500 rounded-sm align-middle animate-pulse"
                    aria-hidden
                  />
                )}
              </motion.p>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}

export function DemoAppMockup({
  activeTab,
  cycleCount,
  onTabChange,
}: {
  activeTab: DemoTabId
  cycleCount: number
  onTabChange: (id: DemoTabId) => void
}) {
  const activeNav         = activeTab === 'email' ? 'mail' : 'chat'
  const topNavActiveIndex = TAB_IDS.indexOf(activeTab)

  const [chatPhase, setChatPhase] = useState<ChatPhase>('idle')
  const phaseIdx = ['idle','user1','ai1','card','ai2','user2'].indexOf(chatPhase)
  const [user1, user1Done] = useTypewriter(USER_MSG_1, phaseIdx >= 1, 32)
  const [ai1,   ai1Done]   = useTypewriter(AI_MSG_1,   phaseIdx >= 2, 24)
  const [ai2,   ai2Done]   = useTypewriter(AI_MSG_2,   phaseIdx >= 4, 28)
  const [user2, user2Done] = useTypewriter(USER_MSG_2, phaseIdx >= 5, 35)
  const startedRef = useRef(false)

  useEffect(() => {
    if (activeTab !== 'ai') return
    const delay = startedRef.current ? 2500 : 3500
    startedRef.current = true
    setChatPhase('idle')
    const t = setTimeout(() => setChatPhase('user1'), delay)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, cycleCount])

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if      (chatPhase === 'user1' && user1Done) t = setTimeout(() => setChatPhase('ai1'),    400)
    else if (chatPhase === 'ai1'   && ai1Done)   t = setTimeout(() => setChatPhase('card'),   400)
    else if (chatPhase === 'card')               t = setTimeout(() => setChatPhase('ai2'),   3000)
    else if (chatPhase === 'ai2'   && ai2Done)   t = setTimeout(() => setChatPhase('user2'), 1200)
    else return
    return () => clearTimeout(t)
  }, [chatPhase, user1Done, ai1Done, ai2Done])

  return (
    <div className="flex flex-col h-[560px] md:h-[700px] overflow-hidden text-neutral-800">
      <div className="h-11 flex-shrink-0 flex items-center px-4 gap-1" style={{ background: TOP_NAV_BG }}>
        {TOP_TABS.map((label, i) => {
          const tabId = TAB_IDS[i]
          const isActive = topNavActiveIndex === i
          return (
            <button
              key={label}
              onClick={() => onTabChange(tabId)}
              className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-1 min-h-0 bg-white">
        <aside
          className="hidden md:flex md:w-[155px] lg:w-[200px] flex-shrink-0 bg-[#f0f2f5] border-r border-neutral-200 flex-col text-neutral-700"
          style={{ overflowY: 'auto', scrollbarWidth: 'none' }}
        >
          <div className="h-[46px] flex items-center px-3 gap-2 border-b border-neutral-200 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-neutral-800 truncate flex-1 hidden lg:block">SoftSync</span>
            <div className="hidden lg:flex items-center gap-1 text-neutral-400 flex-shrink-0">
              <Icon n="chevron" cls="w-3 h-3" />
              <Icon n="layout"  cls="w-3.5 h-3.5" />
            </div>
          </div>
          <nav className="px-2 pt-2.5 pb-1 flex flex-col gap-0.5">
            {[
              { key: 'chat',   icon: 'chat',   label: 'Chat' },
              { key: 'search', icon: 'search', label: 'Search' },
              { key: 'bell',   icon: 'bell',   label: 'Notification' },
              { key: 'mail',   icon: 'mail',   label: 'Email' },
              { key: 'clock',  icon: 'clock',  label: 'Dashboards' },
            ].map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-2.5 px-2.5 py-[5px] rounded-lg cursor-default select-none transition-colors ${
                  activeNav === item.key
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon n={item.icon} cls="w-[15px] h-[15px] flex-shrink-0" />
                <span className="text-[13px] font-medium hidden lg:block truncate">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="px-2 pt-2 border-t border-neutral-200 mt-1">
            <div className="flex items-center gap-1 px-1.5 py-1 mb-0.5">
              <span className="text-[12px] font-medium text-neutral-500 flex-1 hidden lg:block">My groups</span>
              <Icon n="chevron" cls="w-3 h-3 text-neutral-400" />
            </div>
            {[
              { emoji: '🤑', label: 'Leads' },
              { emoji: '🤝', label: 'Clients' },
            ].map((g) => (
              <div key={g.label}>
                <div className="flex items-center gap-2 px-2 py-[5px] rounded-lg cursor-default text-neutral-700 hover:bg-neutral-100 transition-colors">
                  <span className="text-[13px] leading-none flex-shrink-0">{g.emoji}</span>
                  <span className="text-[13px] font-semibold hidden lg:block truncate flex-1">{g.label}</span>
                </div>
                <div className="ml-4 flex flex-col">
                  {[{ icon: 'table', label: 'Pipeline' }, { icon: 'people', label: 'All people' }].map((sub) => (
                    <div key={sub.label} className="flex items-center gap-2 px-2 py-[3px] rounded-md cursor-default text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
                      <Icon n={sub.icon} cls="w-[12px] h-[12px] flex-shrink-0" />
                      <span className="text-[12px] hidden lg:block truncate">{sub.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-2 py-[5px] text-neutral-400 cursor-default hover:text-neutral-600 transition-colors">
              <Icon n="plus" cls="w-3 h-3 flex-shrink-0" />
              <span className="text-[12px] hidden lg:block">New Group</span>
            </div>
          </div>
          <div className="px-2 pt-2 mt-1 border-t border-neutral-200">
            <div className="flex items-center gap-1 px-1.5 py-1">
              <span className="text-[12px] font-medium text-neutral-500 flex-1 hidden lg:block">Chat</span>
              <Icon n="chevron" cls="w-3 h-3 text-neutral-400" />
            </div>
            <p className="text-[12px] text-neutral-400 px-2 pb-1 hidden lg:block">No chats yet</p>
          </div>
          <div className="flex-1" />
          <div className="px-2 pt-2 pb-2 border-t border-neutral-200 flex flex-col gap-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white">FJ</span>
              </div>
              <div className="hidden lg:block min-w-0">
                <p className="text-[13px] font-semibold text-neutral-800 truncate leading-tight">Filip Johnson</p>
                <p className="text-[11px] text-neutral-400 truncate leading-tight">filip@softsync.ai</p>
              </div>
            </div>
            {[{ icon: 'settings', label: 'Settings' }, { icon: 'invite', label: 'Invite members' }].map((item) => (
              <div key={item.icon} className="flex items-center gap-2 px-2 py-[4px] rounded-md cursor-default text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
                <Icon n={item.icon} cls="w-[14px] h-[14px] flex-shrink-0" />
                <span className="text-[12px] hidden lg:block">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="md:hidden h-[46px] flex items-center gap-2 px-4 bg-[#f0f2f5] border-b border-neutral-200 flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-neutral-800">SoftSync</span>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {activeTab === 'ai' && (
              <motion.div key="ai" className="flex-1 flex flex-col min-h-0" {...pane}>
                <div className="flex-1 overflow-auto flex flex-col">
                  <AnimatePresence mode="wait">
                    {chatPhase === 'idle' && (
                      <motion.div
                        key="splash"
                        className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                      >
                        <span className="text-[10px] tracking-[0.22em] text-indigo-500 font-semibold mb-5 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50">
                          SOFTSYNC
                        </span>
                        <h3 className="text-xl md:text-2xl font-semibold text-neutral-800 text-center mb-2 leading-snug">
                          What can SoftSync help<br className="hidden sm:block" /> with today?
                        </h3>
                        <p className="text-[13px] text-neutral-500 text-center mb-6">
                          Get more from your internal data and external sources.
                        </p>
                        <div className="w-full max-w-md flex flex-col gap-2">
                          {SUGGESTED.map((q, i) => (
                            <motion.div
                              key={q}
                              className="px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-[12px] text-neutral-600 cursor-default hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.06 }}
                            >
                              {q}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {chatPhase !== 'idle' && (
                      <motion.div
                        key="conv"
                        className="flex-1 flex flex-col justify-end gap-3 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div className="flex justify-end" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="max-w-[85%] bg-neutral-200 rounded-2xl rounded-br-sm px-4 py-2.5">
                            <span className="text-[13px] text-neutral-800 leading-relaxed">
                              {user1}
                              {chatPhase === 'user1' && <span className="inline-block w-0.5 h-[13px] ml-0.5 bg-neutral-500 align-middle animate-pulse" aria-hidden />}
                            </span>
                          </div>
                        </motion.div>
                        {chatPhase === 'user1' && user1Done && (
                          <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-[9px] font-bold text-white">S</span>
                            </div>
                            <div className="flex gap-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2">
                              {[0, 1, 2].map((i) => (
                                <span key={i} className="w-[5px] h-[5px] rounded-full bg-neutral-400 block animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} aria-hidden />
                              ))}
                            </div>
                          </motion.div>
                        )}
                        {phaseIdx >= 2 && (
                          <motion.div className="flex items-start gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-white">S</span>
                            </div>
                            <div className="max-w-[85%] bg-neutral-100 border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
                              <span className="text-[13px] text-neutral-700 leading-relaxed">
                                {ai1}
                                {chatPhase === 'ai1' && <span className="inline-block w-0.5 h-[13px] ml-0.5 bg-indigo-500 align-middle animate-pulse" aria-hidden />}
                              </span>
                            </div>
                          </motion.div>
                        )}
                        {phaseIdx >= 3 && (
                          <motion.div
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease }}
                          >
                            <div className="w-6 flex-shrink-0 mt-1" aria-hidden />
                            <div className="max-w-[90%] bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
                                <span className="text-indigo-500 text-[13px]">★</span>
                                <span className="text-[13px] font-semibold text-neutral-800">Stale accounts — action needed</span>
                              </div>
                              <ul className="divide-y divide-neutral-100">
                                {STALE_ACCOUNTS.map((row) => (
                                  <li key={row.company} className="flex items-center gap-3 px-4 py-2.5">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: row.color }}>
                                      {row.initial}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[13px] font-medium text-neutral-800 truncate">{row.company}</p>
                                      <p className="text-[11px] text-neutral-500 truncate">{row.owner}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-[12px] font-semibold text-neutral-800">{row.value}</p>
                                      <p className="text-[11px] text-orange-600">{row.days}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <p className="px-4 py-2 text-[11px] text-neutral-400 border-t border-neutral-100">Synced from HubSpot — 4 min ago</p>
                            </div>
                          </motion.div>
                        )}
                        {phaseIdx >= 4 && (
                          <motion.div className="flex items-start gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-white">S</span>
                            </div>
                            <div className="max-w-[85%] bg-neutral-100 border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
                              <span className="text-[13px] text-neutral-700 leading-relaxed">
                                {ai2}
                                {chatPhase === 'ai2' && <span className="inline-block w-0.5 h-[13px] ml-0.5 bg-indigo-500 align-middle animate-pulse" aria-hidden />}
                              </span>
                            </div>
                          </motion.div>
                        )}
                        {phaseIdx >= 5 && (
                          <motion.div className="flex justify-end" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="max-w-[85%] bg-neutral-200 rounded-2xl rounded-br-sm px-4 py-2.5">
                              <span className="text-[13px] text-neutral-800 leading-relaxed">
                                {user2}
                                {!user2Done && <span className="inline-block w-0.5 h-[13px] ml-0.5 bg-neutral-500 align-middle animate-pulse" aria-hidden />}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="px-3 py-3 border-t border-neutral-200 flex-shrink-0 bg-white">
                  <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">S</span>
                    </div>
                    <Icon n="dots" cls="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span className="flex-1 text-[12px] text-neutral-400">Find the right people for the right deal…</span>
                    <button type="button" className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 hover:bg-indigo-500 transition-colors" aria-label="Send">
                      <Icon n="send" cls="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'table' && (
              <motion.div key="table" className="flex-1 flex flex-col min-h-0 overflow-hidden" {...pane}>
                <TablePane />
              </motion.div>
            )}
            {activeTab === 'pipeline' && (
              <motion.div key="pipeline" className="flex-1 flex flex-col min-h-0 overflow-hidden" {...pane}>
                <PipelinePane />
              </motion.div>
            )}
            {activeTab === 'email' && (
              <motion.div key="email" className="flex-1 flex flex-col min-h-0 overflow-hidden" {...pane}>
                <EmailPane cycleCount={cycleCount} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
