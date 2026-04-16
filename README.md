# Recoup — Built for Fluent Software Group

![Recoup Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop) *(Screenshot placeholder — replace with actual Vercel screenshot)*

**Live Demo:** [recoup-gilt.vercel.app](https://recoup-gilt.vercel.app/alerts)

Recoup is an AI-native revenue recovery agent built as a portfolio project for the **AI Product Builder** role at Fluent Software Group. It demonstrates how autonomous agents can sit on top of legacy vertical market software (like a Hotel Property Management System) to identify, investigate, and recover leaked revenue with zero human data-mining required.

## The Problem & The thesis
Legacy VMS platforms trap massive amounts of actionable data. Hotel operators specifically lose revenue daily to missed late-checkout fees, un-billed incidentals, and sub-optimal dynamic pricing.

Instead of building another dashboard that requires operators to manually run reports, **Recoup** flips the paradigm:
1. **Agentic Scanning:** An AI agent continuously monitors the PMS data layer (simulated in this demo).
2. **Chain of Thought:** When an anomaly is found, the agent investigates the context (e.g., checking folio balance vs. checkout time).
3. **Human-in-the-loop Resolution:** The operator gets a prioritized alert feed with the AI's step-by-step reasoning and a 1-click "Approve & Apply" action.

## Technical Architecture

Built for immediate, edge-ready deployment:
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (for premium, Stripe-like UX)
- **AI Integration:** Edge API route connecting to **Claude 3 Haiku** (via OpenRouter) for high-speed, zero-latency agent reasoning.
- **State Management:** React Context + Hooks for instantaneous local UI updates on Approve/Dismiss actions.
- **Deployment:** Vercel

## Running Locally

To run this project locally:

```bash
git clone https://github.com/AliHasan-786/recoup.git
cd recoup
npm install
```

Create a `.env.local` file and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-...
NEXT_PUBLIC_APP_NAME=Recoup
```

Start the development server:
```bash
npm run dev
```

## Why this project?
This project was built to showcase:
- **Product Instinct:** Focusing on a specific, high-ROI vertical use-case rather than a generic AI wrapper.
- **UX/Design:** Crafting an enterprise-grade, dark-mode interface that feels trustworthy and reliable.
- **Agentic Workflows:** Implementing real-time LLM streaming to build trust through transparent "agent reasoning" rather than black-box outputs.

---
*Designed & Developed by Ali Hasan*
