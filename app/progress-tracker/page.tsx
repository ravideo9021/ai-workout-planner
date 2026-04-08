'use client';

import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useWorkout } from '../context/WorkoutContext';

export default function ProgressTracker() {
  const { workoutHistory, generationMeta, getReadinessTrend, workoutPlan, aiInsights } = useWorkout();

  const analytics = useMemo(() => {
    const last30 = workoutHistory.filter(
      (log) => Date.now() - new Date(log.completedAt).getTime() <= 1000 * 60 * 60 * 24 * 30
    );

    const completed = last30.length;
    const avgCompletion = completed
      ? Math.round(last30.reduce((sum, item) => sum + item.completionRate, 0) / completed)
      : 0;
    const avgDifficulty = completed
      ? Number((last30.reduce((sum, item) => sum + item.perceivedDifficulty, 0) / completed).toFixed(1))
      : 0;

    const byFocus = last30.reduce<Record<string, number>>((acc, item) => {
      acc[item.focus] = (acc[item.focus] || 0) + 1;
      return acc;
    }, {});

    const topFocus = Object.entries(byFocus).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { completed, avgCompletion, avgDifficulty, topFocus, byFocus };
  }, [workoutHistory]);

  const trend = getReadinessTrend();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="section-shell pt-24 pb-12 space-y-5">
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Analytics Console</p>
          <h1 className="text-3xl md:text-4xl mt-1">AI Progress Command Center</h1>
          <p className="muted mt-2">Review behavior signals, monitor readiness, and execute next-best actions suggested by the AI pipeline.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Stat title="Sessions (30d)" value={String(analytics.completed)} hint="logged sessions" />
          <Stat title="Completion" value={`${analytics.avgCompletion}%`} hint="average execution" />
          <Stat title="Difficulty" value={`${analytics.avgDifficulty}/10`} hint="perceived effort" />
          <Stat title="Trend" value={trend} hint="readiness direction" cap />
        </div>

        <div className="grid xl:grid-cols-[0.58fr_0.42fr] gap-4">
          <div className="space-y-4">
            <div className="surface-card p-5">
              <h2 className="text-xl mb-3 text-cyan-300">Model Signals</h2>
              {generationMeta?.modelSignals ? (
                <div className="space-y-3">
                  {Object.entries(generationMeta.modelSignals).map(([key, value]) => (
                    <SignalRow key={key} label={key} value={value} />
                  ))}
                </div>
              ) : (
                <p className="text-sm muted">Generate a plan to see model signals.</p>
              )}
            </div>

            <div className="surface-card p-5">
              <h2 className="text-xl mb-3 text-cyan-300">Focus Distribution</h2>
              {Object.keys(analytics.byFocus).length ? (
                <div className="space-y-3">
                  {Object.entries(analytics.byFocus).map(([focus, count]) => (
                    <FocusBar key={focus} label={focus} count={count} total={analytics.completed} />
                  ))}
                </div>
              ) : (
                <p className="text-sm muted">No focus distribution yet.</p>
              )}
            </div>

            <div className="surface-card p-5">
              <h2 className="text-xl mb-3 text-cyan-300">Recent Logs</h2>
              {workoutHistory.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-slate-700/70">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Focus</th>
                        <th className="py-2 pr-4">Completion</th>
                        <th className="py-2">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workoutHistory.slice(0, 12).map((log) => (
                        <tr key={log.id} className="border-b border-slate-800/60">
                          <td className="py-2 pr-4 text-slate-200">{new Date(log.completedAt).toLocaleDateString()}</td>
                          <td className="py-2 pr-4 muted">{log.focus}</td>
                          <td className="py-2 pr-4 muted">{log.completionRate}%</td>
                          <td className="py-2 muted">{log.perceivedDifficulty}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm muted">No logs yet. Log sessions from your plan screen.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-emerald-300">AI Confidence</p>
              <p className="text-3xl mt-1">{Math.round((generationMeta?.aiConfidence || 0) * 100) || '--'}%</p>
              <p className="text-sm muted mt-2">Confidence improves as the system sees more real workout logs and recovery patterns.</p>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-amber-300">Next Best Actions</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {(generationMeta?.nextBestActions || ['Generate a plan to get personalized action items.']).map((action, idx) => (
                  <li key={idx} className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2">
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-cyan-300">AI Insight Feed</p>
              <ul className="mt-3 space-y-2">
                {(aiInsights.length ? aiInsights : [{ title: 'No insight yet', description: 'Run AI plan generation.', priority: 'low' }]).map(
                  (insight, idx) => (
                    <li key={`${insight.title}-${idx}`} className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3">
                      <p className="text-sm font-semibold text-slate-100">{insight.title}</p>
                      <p className="text-xs muted mt-1">{insight.description}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-2 text-cyan-300">{insight.priority} priority</p>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-lg text-cyan-300 mb-2">Plan Context</h3>
              <p className="text-sm text-slate-100">{workoutPlan?.title || 'No active plan.'}</p>
              <p className="text-xs muted mt-2">Top focus: {analytics.topFocus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, hint, cap }: { title: string; value: string; hint: string; cap?: boolean }) {
  return (
    <div className="metric">
      <p className="text-xs uppercase tracking-wider muted">{title}</p>
      <p className={`text-2xl mt-1 font-semibold ${cap ? 'capitalize' : ''}`}>{value}</p>
      <p className="text-xs muted mt-1">{hint}</p>
    </div>
  );
}

function SignalRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="capitalize text-slate-300">{label}</span>
        <span className="text-cyan-300">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FocusBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-200">{label}</span>
        <span className="muted">{count} sessions</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-300 to-cyan-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
