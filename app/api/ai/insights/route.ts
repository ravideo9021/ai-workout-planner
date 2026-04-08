import { NextRequest, NextResponse } from 'next/server';
import { runAIPipeline } from '../../../lib/ai/pipeline/aiPlanner';
import { UserPreferences, WorkoutLog } from '../../../types/workoutTypes';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const preferences = body?.preferences as UserPreferences | undefined;
    const workoutHistory = (Array.isArray(body?.workoutHistory) ? body.workoutHistory : []) as WorkoutLog[];

    if (!preferences) {
      return NextResponse.json({ error: 'Preferences are required.' }, { status: 400 });
    }

    const { insights, meta } = await runAIPipeline(preferences, workoutHistory.slice(-30));
    return NextResponse.json({ insights, modelSignals: meta.modelSignals, nextBestActions: meta.nextBestActions });
  } catch (error) {
    console.error('ai-insights-error', error);
    return NextResponse.json({ error: 'Unable to generate insights right now.' }, { status: 500 });
  }
}
