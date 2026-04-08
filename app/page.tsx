'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import workoutImage from '../public/images/workout-woman.jpg';
import { useWorkout } from './context/WorkoutContext';

const features = [
  {
    title: 'AI Signal Engine',
    text: 'Continuously models compliance, fatigue risk, consistency, and momentum from workout behavior.'
  },
  {
    title: 'Adaptive Plan Orchestrator',
    text: 'Combines safety constraints, performance signals, and goal optimization to generate weekly plans.'
  },
  {
    title: 'Coach Intelligence Layer',
    text: 'Gemini-powered coaching summaries and next-best actions tailored to your current readiness.'
  }
];

export default function Home() {
  const { user, generationMeta } = useWorkout();

  return (
    <>
      <Navbar />
      <section className="section-shell pt-28 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">
              AI-FIRST FITNESS OPERATING SYSTEM
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Build smarter workouts
              <span className="block text-cyan-300">with adaptive AI architecture</span>
            </h1>
            <p className="text-lg muted max-w-xl">
              PulseForge uses an intelligent pipeline: signal modeling, personalization, plan synthesis, and coaching generation.
              You get explainable plans that evolve with your real training behavior.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/create-workout" className="btn-brand">
                Launch Plan Builder
              </Link>
              <Link href="/progress-tracker" className="btn-muted">
                Open Analytics
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <Stat label="Pipeline" value="v3.1" />
              <Stat label="Model Signals" value="5" />
              <Stat label="Weekly Rebuild" value="Auto" />
              <Stat label="AI Coach" value="Gemini" />
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/60">
                <Image
                  src={workoutImage}
                  alt="Athlete in training"
                  className="object-cover w-full h-[420px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 surface-card p-4">
                  <p className="text-xs uppercase tracking-wider text-cyan-300 mb-1">Live Planning Context</p>
                  <p className="text-sm text-slate-100">
                    {generationMeta?.nextBestActions?.[0] || 'Generate your first plan to unlock real-time AI guidance.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <article key={feature.title} className="surface-card p-5">
              <h3 className="text-lg mb-2 text-cyan-300">{feature.title}</h3>
              <p className="text-sm muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-10 pb-16">
        <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300">Experience Layer</p>
            <h2 className="text-2xl md:text-3xl mt-1">{user ? `Welcome back, ${user.name}` : 'Ready to train with AI precision?'}</h2>
            <p className="muted mt-1">Set goals, generate your plan, log sessions, and let the system adapt automatically.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/create-workout" className="btn-brand">Create Plan</Link>
            <Link href={user ? '/progress-tracker' : '/sign-in'} className="btn-muted">
              {user ? 'View Dashboard' : 'Sign In'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <p className="text-xs uppercase tracking-wider muted">{label}</p>
      <p className="text-xl font-semibold mt-1 text-slate-100">{value}</p>
    </div>
  );
}
