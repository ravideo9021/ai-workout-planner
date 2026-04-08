# AI Workout Planner

A production-oriented Next.js fitness platform that generates personalized, adaptive workout plans using a hybrid AI pipeline: safety constraints + scoring algorithm + LLM coaching summaries (Gemini/OpenAI).

Live site: https://ai-workout-planner-chi.vercel.app

## Features

- Constraint-aware workout generation (equipment, injuries, level)
- Weighted exercise ranking for goal alignment and session time budgets
- Adaptive progression rules from workout completion and perceived difficulty
- AI coaching summaries and tips (Gemini first, OpenAI fallback)
- Real workout logging and readiness trend analytics
- Account system with secure cookie sessions (sign up, sign in, sign out)
- Server-side user data persistence for plans, preferences, and workout logs
- Automatic weekly plan regeneration for signed-in users
- Nightly AI rescore jobs and weekly refresh cron endpoints
- Role-based dashboards (`athlete`, `coach`, `admin`)
- Mobile-responsive design and persistent local state

## Tech Stack

- **Framework**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **AI Providers**: Gemini API (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ravideo9021/ai-workout-planner.git
   cd ai-workout-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### AI setup

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_key_here
# Optional fallback
OPENAI_API_KEY=your_openai_key_here
```

Provider priority:
1. Gemini
2. OpenAI
3. Built-in fallback coach text

### Auth setup

Add an auth secret to `.env.local`:

```bash
AUTH_SECRET=replace_with_a_long_random_secret
CRON_SECRET=replace_with_a_long_random_secret
DATA_BACKEND=json
# For DATA_BACKEND=prisma
DATABASE_URL=postgresql://user:password@localhost:5432/pulseforge
ADMIN_EMAILS=admin@example.com
COACH_EMAILS=coach@example.com
```

## Project Structure

```
ai-workout-planner/
├── app/               # Next.js app directory
│   ├── components/    # Reusable UI components
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   ├── api/           # API routes
│   ├── types/         # TypeScript type definitions
│   ├── about/         # About page
│   ├── create-workout/# Workout creation page
│   ├── progress-tracker/# Progress tracking page
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── public/            # Static assets
└── README.md          # Project documentation
```

## Architecture

### AI-first pipeline
- `app/lib/ai/pipeline/signalEngine.ts`: derives compliance/fatigue/consistency/momentum/goal-alignment signals
- `app/lib/ai/pipeline/personalizationEngine.ts`: applies adaptive guardrails and computes AI confidence
- `app/lib/ai/pipeline/aiPlanner.ts`: orchestrates full pipeline (signals -> personalization -> plan -> coach -> insights)
- `app/lib/ai/coachService.ts`: Gemini/OpenAI coaching synthesis

### Generation and APIs
- `app/api/ai/workout-plan/route.ts`: AI plan generation endpoint (guest + signed-in support)
- `app/api/ai/insights/route.ts`: AI insights endpoint for model signals and next-best actions
- `app/lib/workout/planEngine.ts`: deterministic plan synthesis core
- `app/lib/workout/exerciseLibrary.ts`: exercise metadata and contraindication constraints

### Account and persistence
- `app/api/auth/*`: account APIs (signup, login, logout, session check)
- `app/api/user/*`: authenticated plan/preferences/workout APIs
- `app/lib/server/db.ts`: JSON database layer for persistent user data
- `app/lib/server/autoPlanner.ts`: weekly plan auto-regeneration logic
- `app/context/WorkoutContext.tsx`: client orchestration state and AI insight hydration

### Role dashboards and cron jobs
- `app/dashboard/coach/page.tsx`: coach dashboard for athlete readiness and completion
- `app/dashboard/admin/page.tsx`: admin operations dashboard
- `app/api/cron/nightly-rescore/route.ts`: nightly AI signal and insight rescoring
- `app/api/cron/weekly-refresh/route.ts`: weekly plan regeneration sweep
- `app/lib/server/jobs/aiJobs.ts`: background job implementations

Cron invocation example:

```bash
curl -X POST http://localhost:3000/api/cron/nightly-rescore -H \"x-cron-secret: $CRON_SECRET\"
curl -X POST http://localhost:3000/api/cron/weekly-refresh -H \"x-cron-secret: $CRON_SECRET\"
```

### Prisma/Postgres
- `prisma/schema.prisma`: relational schema for users, sessions, and AI state
- Switch backend with `DATA_BACKEND=prisma` and run:
  - `npm run prisma:generate`
  - `npm run prisma:push` (or `npm run prisma:migrate`)

Role assignment:
- Default new users are `athlete`.
- Configure env-based auto roles with `ADMIN_EMAILS` and `COACH_EMAILS`.
- Admin can update roles via `POST /api/admin/users/role`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
