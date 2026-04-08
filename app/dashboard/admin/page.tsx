'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

type AdminOverview = {
  totalUsers: number;
  roleBreakdown: Record<string, number>;
  activeLast7d: number;
  avgConfidence: number;
  plansGenerated: number;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/overview');
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || 'Unable to load admin overview.');
        return;
      }
      setData(payload);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="section-shell pt-24 pb-12 space-y-4">
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Admin</p>
          <h1 className="text-3xl mt-1">Platform Operations Dashboard</h1>
          <p className="muted mt-2">Monitor user growth, AI confidence, and weekly planning throughput.</p>
        </div>

        {error && <p className="text-rose-300">{error}</p>}

        {data && (
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-3">
            <Card label="Total Users" value={String(data.totalUsers)} />
            <Card label="Active (7d)" value={String(data.activeLast7d)} />
            <Card label="Plans Generated" value={String(data.plansGenerated)} />
            <Card label="AI Confidence" value={`${Math.round(data.avgConfidence * 100)}%`} />
            <Card label="Roles" value={Object.entries(data.roleBreakdown).map(([k, v]) => `${k}:${v}`).join(' · ')} />
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <p className="text-xs uppercase tracking-wider muted">{label}</p>
      <p className="text-xl mt-1 font-semibold">{value}</p>
    </div>
  );
}
