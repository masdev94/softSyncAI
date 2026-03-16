# SoftSync — Animated Product Demo

A standalone, animated product demo section for the [SoftSync](https://softsync.ai) website. It showcases the platform (sidebar, AI chat, pipeline, and email) in an engaging, B2B-appropriate way so visitors quickly understand what the product does.

**Tech:** React 19, TypeScript, Vite, Tailwind CSS v4, framer-motion.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (e.g. `http://localhost:5173`). Build for production with `npm run build`; preview the build with `npm run preview`.

## What’s in the repo

- **Product demo section** — Full-width section with a heading, short tagline, and an interactive mockup of the SoftSync app.
- **App mockup** — Sidebar (nav, My groups, user) and a main area that switches by tab: **AI Analyst** (chat with typewriter), **Pipeline** (kanban-style columns), **Email** (thread list + draft).
- **Animations** — Section content fades/slides in on scroll; the AI Analyst tab runs an auto typewriter (user question → AI reply); tab changes use a short slide transition.
- **Responsive** — Desktop: full sidebar and labels. Tablet: narrow sidebar (icons only). Mobile: sidebar hidden, compact header; tabs and pipeline/email layouts adapt.

Key files:

| Path | Role |
|------|------|
| `src/App.tsx` | Renders the product demo section. |
| `src/components/ProductDemoSection.tsx` | Section layout, title, tabs (AI / Pipeline / Email), scroll-in animations. |
| `src/components/DemoAppMockup.tsx` | Sidebar + tabbed main content (chat, pipeline, email), typewriter state, responsive sidebar. |
| `src/hooks/useTypewriter.ts` | Hook for character-by-character typewriter effect. |

## Choices made

- **React + Tailwind + framer-motion** — Keeps UI, styling, and animation in one stack. Framer-motion gives declarative scroll and tab transitions and keeps the code easy to adjust (durations, easing, stagger) without touching CSS keyframes.

- **Typewriter + tabs** — The simulated chat (user question then AI answer) shows the product in action without feeling playful; the three tabs (AI Analyst, Pipeline, Email) mirror real app surfaces and give a clear “state change” to animate, similar to product sites like Attio.

- **One auto-play sequence** — The typewriter runs once on load (with a short delay) so the demo doesn’t loop or distract. Visitors can still switch tabs to explore Pipeline and Email.

- **Responsive sidebar** — Full sidebar on desktop, icon-only strip on tablet, and hidden on mobile with a simple “SoftSync” header. That keeps the mockup readable on small screens without shrinking the main content too much.

- **Tailwind v4** — Uses the CSS-first setup (`@import "tailwindcss"` in `src/index.css`) and no JS config, which fits a small, focused demo and keeps styling co-located with components.
