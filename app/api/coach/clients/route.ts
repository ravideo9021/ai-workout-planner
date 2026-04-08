import { NextResponse } from 'next/server';
import { requireRole } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export const runtime = 'nodejs';

export async function GET() {
  const gate = await requireRole(['coach', 'admin']);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });

  const repo = getDataRepository();
  const users = await repo.listUsers();
  const records = await repo.listUserData();

  const athletes = users.filter((user) => user.role === 'athlete');

  const clients = athletes.map((user) => {
    const record = records.find((item) => item.userId === user.id);
    const recent = (record?.workoutHistory || []).slice(0, 5);
    const avgCompletion = recent.length
      ? Math.round(recent.reduce((sum, item) => sum + item.completionRate, 0) / recent.length)
      : 0;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      workoutsLogged: record?.workoutHistory.length || 0,
      latestPlanAt: record?.planGeneratedAt,
      readiness: record?.generationMeta?.readinessScore || null,
      avgCompletion
    };
  });

  return NextResponse.json({ clients });
}
