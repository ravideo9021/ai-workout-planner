import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';
import { regeneratePlanForRecord, shouldRegenerateWeekly } from '../../../lib/server/autoPlanner';
import { AIInsight, WorkoutGenerationMeta } from '../../../types/workoutTypes';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);

  let meta: WorkoutGenerationMeta | null = record.generationMeta || null;
  let insights: AIInsight[] | null = record.aiInsights || null;
  if (shouldRegenerateWeekly(record)) {
    const generated = await regeneratePlanForRecord(record);
    meta = generated?.meta || null;
    insights = generated?.insights || null;
    await repo.saveUserData(record);
  }

  return NextResponse.json({
    plan: record.plan,
    preferences: record.preferences,
    workoutHistory: record.workoutHistory,
    planGeneratedAt: record.planGeneratedAt,
    meta,
    insights
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const force = Boolean(body?.force);

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);
  if (body?.preferences) {
    record.preferences = body.preferences;
  }

  if (!record.preferences) {
    return NextResponse.json({ error: 'Preferences required before generating a plan.' }, { status: 400 });
  }

  if (!force && !shouldRegenerateWeekly(record) && record.plan) {
    return NextResponse.json({
      plan: record.plan,
      preferences: record.preferences,
      workoutHistory: record.workoutHistory,
      planGeneratedAt: record.planGeneratedAt,
      meta: null
    });
  }

  const generated = await regeneratePlanForRecord(record);
  if (!generated) {
    return NextResponse.json({ error: 'Unable to generate plan' }, { status: 500 });
  }

  await repo.saveUserData(record);

  return NextResponse.json({
    plan: record.plan,
    preferences: record.preferences,
    workoutHistory: record.workoutHistory,
    planGeneratedAt: record.planGeneratedAt,
    meta: generated.meta,
    insights: generated.insights
  });
}
