import { NextResponse } from 'next/server';
import { requireRole } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export const runtime = 'nodejs';

export async function GET() {
  const gate = await requireRole(['admin']);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });

  const repo = getDataRepository();
  const users = await repo.listUsers();
  const data = await repo.listUserData();

  const activeLast7d = data.filter((record) =>
    record.workoutHistory.some((log) => Date.now() - new Date(log.completedAt).getTime() <= 7 * 24 * 60 * 60 * 1000)
  ).length;

  const roleBreakdown = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const avgConfidence =
    data.length > 0
      ? Number(
          (
            data.reduce((sum, record) => sum + (record.generationMeta?.aiConfidence || 0), 0) / data.length
          ).toFixed(2)
        )
      : 0;

  return NextResponse.json({
    totalUsers: users.length,
    roleBreakdown,
    activeLast7d,
    avgConfidence,
    plansGenerated: data.filter((record) => record.planGeneratedAt).length
  });
}
