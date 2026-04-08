'use client';

import React from 'react';
import Navbar from '../components/Navbar';

const architectureBlocks = [
  {
    title: 'Signal Engine',
    text: 'Transforms workout history into measurable AI signals: compliance, fatigue, consistency, momentum, and goal alignment.'
  },
  {
    title: 'Personalization Engine',
    text: 'Adjusts frequency and session volume automatically using guardrails to maintain progress while reducing overtraining risk.'
  },
  {
    title: 'Plan Synthesis Engine',
    text: 'Builds sessions with constraint-aware exercise selection, weighted scoring, and time-budget optimization.'
  },
  {
    title: 'Coach Layer',
    text: 'Uses Gemini to generate explainable summaries, priorities, and next-best actions for each planning cycle.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="section-shell pt-24 pb-12 space-y-6">
        <section className="surface-card p-7">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Method</p>
          <h1 className="text-3xl md:text-4xl mt-1">AI-Centric Training Architecture</h1>
          <p className="muted mt-2 max-w-3xl">
            PulseForge is structured as an intelligence platform, not a static workout app. Every feature is routed through an adaptive AI pipeline designed for explainability, safety, and progress velocity.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          {architectureBlocks.map((block) => (
            <article key={block.title} className="glass-card p-5">
              <h2 className="text-xl text-cyan-300">{block.title}</h2>
              <p className="text-sm muted mt-2">{block.text}</p>
            </article>
          ))}
        </section>

        <section className="surface-card p-6">
          <h3 className="text-2xl mb-3">Why this architecture matters</h3>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2">Plans are grounded in behavior signals, not random prompts.</li>
            <li className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2">Adaptation is deterministic where safety matters and generative where coaching adds value.</li>
            <li className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2">The system supports long-term personalization by persisting stateful user training history.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
