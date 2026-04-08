import { generateCoachSummary } from '../coachService';
import { buildWorkoutPlan } from '../../workout/planEngine';
import { AIInsight, UserPreferences, WorkoutGenerationMeta, WorkoutLog, WorkoutPlan } from '../../../types/workoutTypes';
import { deriveUserSignals } from './signalEngine';
import { personalizePreferences } from './personalizationEngine';

export interface AIPipelineResult {
  plan: WorkoutPlan;
  meta: WorkoutGenerationMeta;
  insights: AIInsight[];
}

export const runAIPipeline = async (
  preferences: UserPreferences,
  workoutHistory: WorkoutLog[] = []
): Promise<AIPipelineResult> => {
  const signals = deriveUserSignals(preferences, workoutHistory);
  const personalization = personalizePreferences(preferences, signals);

  const { plan, meta } = buildWorkoutPlan(personalization.adjustedPreferences, workoutHistory);

  const coach = await generateCoachSummary({
    preferences: personalization.adjustedPreferences,
    rationale: [...meta.rationale, ...personalization.adaptiveGuardrails],
    safetyNotes: plan.safetyNotes || []
  });

  plan.aiSummary = coach.summary;
  plan.coachingTips = [...(plan.coachingTips || []), ...coach.extraTips];

  const modelSignals: Record<string, number> = {
    compliance: round2(signals.complianceScore),
    fatigueRisk: round2(signals.fatigueRisk),
    consistency: round2(signals.consistencyScore),
    momentum: round2(signals.progressionMomentum),
    goalAlignment: round2(signals.goalAlignment)
  };

  meta.algorithmVersion = 'v3.1-ai-pipeline';
  meta.aiConfidence = round2(personalization.confidence);
  meta.modelSignals = modelSignals;
  meta.nextBestActions = deriveNextBestActions(signals, preferences);
  meta.rationale.push(`AI pipeline provider: ${coach.provider}`);
  meta.rationale.push(...personalization.adaptiveGuardrails);

  const insights = buildInsights(signals, meta, plan);

  return { plan, meta, insights };
};

export const buildInsights = (
  signals: ReturnType<typeof deriveUserSignals>,
  meta: WorkoutGenerationMeta,
  plan: WorkoutPlan
): AIInsight[] => {
  const insights: AIInsight[] = [];

  if (signals.fatigueRisk > 0.62) {
    insights.push({
      title: 'Recovery Alert',
      description: 'Fatigue risk is trending high. Prioritize sleep and use one lower-intensity session this week.',
      priority: 'high'
    });
  }

  if (signals.consistencyScore < 0.5) {
    insights.push({
      title: 'Consistency Opportunity',
      description: 'Keep at least 3 locked workout slots in your calendar to stabilize adherence.',
      priority: 'high'
    });
  }

  insights.push({
    title: 'Plan Confidence',
    description: `AI confidence is ${Math.round((meta.aiConfidence || 0.7) * 100)}% based on your recent workout signal quality.`,
    priority: 'medium'
  });

  if (plan.progressionRules?.length) {
    insights.push({
      title: 'Progression Focus',
      description: plan.progressionRules[0],
      priority: 'medium'
    });
  }

  return insights.slice(0, 4);
};

const deriveNextBestActions = (
  signals: ReturnType<typeof deriveUserSignals>,
  preferences: UserPreferences
) => {
  const actions = ['Log session completion and difficulty after each workout to strengthen AI adaptation.'];

  if (signals.fatigueRisk > 0.62) {
    actions.push('Replace one high-intensity workout with mobility + low-impact cardio this week.');
  }

  if (signals.complianceScore < 0.7) {
    actions.push('Reduce setup friction: pre-select equipment and start time the night before workouts.');
  }

  if (preferences.primaryGoal === 'strength' || preferences.primaryGoal === 'muscle-gain') {
    actions.push('Track top-set load weekly and target 2.5-5% progression every 1-2 weeks if recovery is stable.');
  }

  return actions.slice(0, 3);
};

const round2 = (value: number) => Math.round(value * 100) / 100;
