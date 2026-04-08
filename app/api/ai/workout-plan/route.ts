import { NextRequest, NextResponse } from 'next/server';
import { runAIPipeline } from '../../../lib/ai/pipeline/aiPlanner';
import { UserPreferences, WorkoutLog } from '../../../types/workoutTypes';

export const runtime = 'nodejs';

interface GeneratePayload {
  preferences?: UserPreferences;
  workoutHistory?: WorkoutLog[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeneratePayload;
    const validation = validatePreferences(body.preferences);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const preferences = validation.value;
    const workoutHistory = Array.isArray(body.workoutHistory) ? body.workoutHistory.slice(-30) : [];
    const { plan, meta, insights } = await runAIPipeline(preferences, workoutHistory);

    return NextResponse.json({
      plan,
      meta,
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('workout-plan-api-error', error);
    return NextResponse.json(
      { error: 'Unable to generate plan right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

const validatePreferences = (input?: UserPreferences): { ok: true; value: UserPreferences } | { ok: false; error: string } => {
  if (!input) return { ok: false, error: 'Missing preferences payload.' };

  const levels = ['beginner', 'intermediate', 'advanced', 'athlete'];
  const goals = ['weight-loss', 'muscle-gain', 'endurance', 'strength', 'flexibility', 'general'];

  if (!levels.includes(input.fitnessLevel)) return { ok: false, error: 'Invalid fitness level.' };
  if (!goals.includes(input.primaryGoal)) return { ok: false, error: 'Invalid primary goal.' };
  if (!Number.isFinite(input.daysPerWeek) || input.daysPerWeek < 1 || input.daysPerWeek > 7) {
    return { ok: false, error: 'Days per week must be 1 to 7.' };
  }
  if (!Number.isFinite(input.timePerSession) || input.timePerSession < 15 || input.timePerSession > 180) {
    return { ok: false, error: 'Time per session must be between 15 and 180 minutes.' };
  }
  if (!Array.isArray(input.equipment) || !Array.isArray(input.workoutPreferences)) {
    return { ok: false, error: 'Equipment and workout preferences must be arrays.' };
  }

  return {
    ok: true,
    value: {
      ...input,
      healthConsiderations: (input.healthConsiderations || '').trim()
    }
  };
};
