'use client';

import React, { useState } from 'react';
import { WorkoutPlan as WorkoutPlanType } from '../types/workoutTypes';
import { useWorkout } from '../context/WorkoutContext';

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
}

export default function WorkoutPlan({ plan }: WorkoutPlanProps) {
  const { generationMeta, logWorkout, getReadinessTrend } = useWorkout();
  const [activeDay, setActiveDay] = useState(plan.days[0]?.day || '');

  const active = plan.days.find((day) => day.day === activeDay) || plan.days[0];

  const quickLog = async (completionRate: number, perceivedDifficulty: number) => {
    if (!active) return;
    await logWorkout({
      day: active.day,
      focus: active.focus,
      completionRate,
      perceivedDifficulty,
      notes: 'Quick log from plan view'
    });
  };

  return (
    <div className="space-y-5">
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-300">Generated Plan</p>
            <h2 className="text-2xl md:text-3xl mt-1">{plan.title}</h2>
            <p className="muted mt-1 max-w-2xl">{plan.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-muted text-sm">Export PDF (Soon)</button>
            <button className="btn-brand text-sm">Duplicate Plan</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <Metric label="Readiness" value={`${generationMeta?.readinessScore || '--'}/100`} />
          <Metric label="Weekly Load" value={`${generationMeta?.estimatedWeeklyLoad || '--'} min`} />
          <Metric label="Trend" value={getReadinessTrend()} caps />
        </div>
      </div>

      {plan.aiSummary && (
        <div className="surface-card p-5">
          <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">Coach Summary</p>
          <p className="text-slate-100">{plan.aiSummary}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-4">
        <div className="surface-card p-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Week Structure</p>
          {plan.days.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`w-full text-left rounded-xl border px-3 py-3 transition-all ${
                day.day === active?.day
                  ? 'border-cyan-300/70 bg-cyan-300/10'
                  : 'border-slate-700/70 bg-slate-900/60 hover:border-slate-500'
              }`}
            >
              <p className="font-semibold">{day.day}</p>
              <p className="text-xs muted mt-0.5">{day.focus}</p>
            </button>
          ))}
        </div>

        {active && (
          <div className="surface-card p-5 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-300">{active.day}</p>
                <h3 className="text-xl">{active.focus}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => quickLog(100, 6)} className="btn-brand text-xs px-3 py-2">
                  Log: Completed
                </button>
                <button onClick={() => quickLog(70, 8)} className="btn-muted text-xs px-3 py-2">
                  Log: Challenging
                </button>
              </div>
            </div>

            <Block title="Warm-up" items={active.warmup} tone="cyan" />

            <div>
              <p className="text-sm font-semibold text-cyan-300 mb-2">Main Work</p>
              <div className="space-y-2">
                {active.exercises.map((exercise, idx) => (
                  <article key={`${exercise.name}-${idx}`} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-100">{exercise.name}</p>
                        <p className="text-xs muted mt-1">
                          {exercise.sets} sets · {exercise.reps} · rest {exercise.rest}
                        </p>
                        {exercise.alternatives?.length ? (
                          <p className="text-xs text-emerald-300/90 mt-1">Alternatives: {exercise.alternatives.join(', ')}</p>
                        ) : null}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full border border-slate-600/80 capitalize muted">
                        {exercise.intensity || 'moderate'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <Block title="Cooldown" items={active.cooldown} tone="emerald" />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InsightPanel title="Progression Rules" items={plan.progressionRules || []} />
        <InsightPanel title="Coach Tips" items={plan.coachingTips || []} />
      </div>

      {!!plan.safetyNotes?.length && (
        <div className="rounded-2xl border border-rose-700/60 bg-rose-950/20 p-4">
          <p className="text-sm font-semibold text-rose-300 mb-2">Safety Notes</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-rose-100/90">
            {plan.safetyNotes.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, caps }: { label: string; value: string; caps?: boolean }) {
  return (
    <div className="metric">
      <p className="text-xs muted uppercase tracking-wider">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${caps ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

function Block({ title, items, tone }: { title: string; items: string[]; tone: 'cyan' | 'emerald' }) {
  return (
    <div>
      <p className={`text-sm font-semibold mb-2 ${tone === 'cyan' ? 'text-cyan-300' : 'text-emerald-300'}`}>{title}</p>
      <ul className="space-y-2 text-sm text-slate-200">
        {items.map((item, idx) => (
          <li key={idx} className="rounded-lg border border-slate-700/60 bg-slate-900/50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-card p-4">
      <p className="text-sm font-semibold text-cyan-300 mb-2">{title}</p>
      {items.length ? (
        <ul className="space-y-2 text-sm text-slate-200">
          {items.map((item, idx) => (
            <li key={idx} className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm muted">Not available yet.</p>
      )}
    </div>
  );
}
