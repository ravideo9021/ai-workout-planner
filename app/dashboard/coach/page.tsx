'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

type ClientSummary = {
  id: string;
  name: string;
  email: string;
  workoutsLogged: number;
  latestPlanAt: string | null;
  readiness: number | null;
  avgCompletion: number;
};

export default function CoachDashboardPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/coach/clients');
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || 'Unable to load coach dashboard.');
        return;
      }
      setClients(payload.clients || []);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="section-shell pt-24 pb-12 space-y-4">
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-wider text-emerald-300">Coach</p>
          <h1 className="text-3xl mt-1">Athlete Coaching Console</h1>
          <p className="muted mt-2">Review athlete readiness and plan recency to prioritize coaching interventions.</p>
        </div>

        {error && <p className="text-rose-300">{error}</p>}

        <div className="surface-card p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700/70">
                <th className="py-2 pr-4">Athlete</th>
                <th className="py-2 pr-4">Workouts Logged</th>
                <th className="py-2 pr-4">Readiness</th>
                <th className="py-2 pr-4">Avg Completion</th>
                <th className="py-2">Last Plan</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-800/60">
                  <td className="py-2 pr-4">
                    <p className="text-slate-100">{client.name}</p>
                    <p className="text-xs muted">{client.email}</p>
                  </td>
                  <td className="py-2 pr-4 muted">{client.workoutsLogged}</td>
                  <td className="py-2 pr-4 muted">{client.readiness ?? '--'}</td>
                  <td className="py-2 pr-4 muted">{client.avgCompletion}%</td>
                  <td className="py-2 muted">{client.latestPlanAt ? new Date(client.latestPlanAt).toLocaleDateString() : 'Never'}</td>
                </tr>
              ))}
              {!clients.length && !error && (
                <tr>
                  <td className="py-4 muted" colSpan={5}>
                    No athlete records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
