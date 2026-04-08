import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);
  return NextResponse.json({ workoutHistory: record.workoutHistory });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const day = String(body?.day || '').trim();
  const focus = String(body?.focus || '').trim();
  const completionRate = Number(body?.completionRate || 0);
  const perceivedDifficulty = Number(body?.perceivedDifficulty || 0);
  const notes = String(body?.notes || '').trim();

  if (!day || !focus) {
    return NextResponse.json({ error: 'day and focus are required.' }, { status: 400 });
  }

  if (completionRate < 0 || completionRate > 100 || perceivedDifficulty < 1 || perceivedDifficulty > 10) {
    return NextResponse.json({ error: 'Invalid completion or difficulty range.' }, { status: 400 });
  }

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);
  record.workoutHistory = [
    {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      day,
      focus,
      completionRate,
      perceivedDifficulty,
      notes
    },
    ...record.workoutHistory
  ].slice(0, 200);
  record.updatedAt = new Date().toISOString();

  await repo.saveUserData(record);
  return NextResponse.json({ ok: true, workoutHistory: record.workoutHistory });
}
