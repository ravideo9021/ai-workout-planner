import {
  Exercise,
  UserPreferences,
  WorkoutGenerationMeta,
  WorkoutLog,
  WorkoutPlan
} from '../../types/workoutTypes';
import { EXERCISE_LIBRARY, FITNESS_ORDER } from './exerciseLibrary';

interface PlanBuildResult {
  plan: WorkoutPlan;
  meta: WorkoutGenerationMeta;
}

const GOAL_FOCUS_MAP: Record<UserPreferences['primaryGoal'], string[]> = {
  'weight-loss': ['Cardio + Full Body', 'Lower Body + Core', 'Conditioning', 'Upper Body + Core'],
  'muscle-gain': ['Upper Body Push', 'Lower Body Strength', 'Upper Body Pull', 'Full Body Hypertrophy'],
  endurance: ['Intervals', 'Steady Cardio + Core', 'Tempo Work', 'Recovery Conditioning'],
  strength: ['Lower Body Strength', 'Upper Push Strength', 'Upper Pull Strength', 'Power + Core'],
  flexibility: ['Mobility Flow', 'Dynamic Stretch + Core', 'Yoga + Stability', 'Recovery Mobility'],
  general: ['Full Body', 'Cardio + Core', 'Upper Body', 'Lower Body']
};

const LEVEL_SET_MULTIPLIER: Record<UserPreferences['fitnessLevel'], number> = {
  beginner: 0.8,
  intermediate: 1,
  advanced: 1.2,
  athlete: 1.3
};

export const buildWorkoutPlan = (
  preferences: UserPreferences,
  workoutHistory: WorkoutLog[] = []
): PlanBuildResult => {
  const warnings = buildSafetyWarnings(preferences);
  const readinessScore = calculateReadinessScore(workoutHistory);
  const weeklyFocuses = chooseFocuses(preferences);
  const progressionRules = buildProgressionRules(preferences, readinessScore);
  const rationale = buildRationale(preferences, readinessScore);

  const days = weeklyFocuses.slice(0, preferences.daysPerWeek).map((focus, idx) => {
    const exercises = buildSessionExercises(preferences, focus, workoutHistory);
    return {
      day: `Day ${idx + 1}`,
      focus,
      warmup: buildWarmup(focus),
      exercises,
      cooldown: buildCooldown(focus)
    };
  });

  const estimatedWeeklyLoad = days.reduce((sum, day) => {
    const minutes = day.exercises.reduce((acc, ex) => acc + (ex.estimatedMinutes || 7), 0);
    return sum + minutes;
  }, 0);

  const plan: WorkoutPlan = {
    title: `${preferences.daysPerWeek}-Day Adaptive ${humanizeGoal(preferences.primaryGoal)} Plan`,
    description: `Built for ${preferences.fitnessLevel} level, ${preferences.timePerSession} minutes/session, with dynamic progression based on your completion and difficulty feedback.`,
    days,
    generatedAt: new Date().toISOString(),
    progressionRules,
    safetyNotes: warnings,
    coachingTips: buildCoachingTips(preferences, readinessScore)
  };

  return {
    plan,
    meta: {
      readinessScore,
      estimatedWeeklyLoad,
      algorithmVersion: 'v2.0-hybrid-constraint-scoring',
      warnings,
      rationale
    }
  };
};

const buildSessionExercises = (
  preferences: UserPreferences,
  focus: string,
  workoutHistory: WorkoutLog[]
): Exercise[] => {
  const timeBudget = Math.max(20, preferences.timePerSession - 12);
  const normalizedHealth = (preferences.healthConsiderations || '').toLowerCase();
  const recentHardDays = workoutHistory.filter(
    (log) => Date.now() - new Date(log.completedAt).getTime() < 1000 * 60 * 60 * 24 * 5 && log.perceivedDifficulty >= 8
  ).length;

  const candidates = EXERCISE_LIBRARY.filter((exercise) => {
    const levelOk =
      FITNESS_ORDER[preferences.fitnessLevel] >= FITNESS_ORDER[exercise.levelMin] &&
      FITNESS_ORDER[preferences.fitnessLevel] <= FITNESS_ORDER[exercise.levelMax];

    const equipmentOk =
      exercise.equipment.length === 0 ||
      exercise.equipment.some((needed) => preferences.equipment.includes(needed));

    const healthOk = !exercise.contraindications.some((term) => normalizedHealth.includes(term));

    return levelOk && equipmentOk && healthOk;
  });

  const scored = candidates
    .map((exercise) => ({
      exercise,
      score: scoreExercise(exercise, preferences, focus, recentHardDays)
    }))
    .sort((a, b) => b.score - a.score);

  const selected: Exercise[] = [];
  let usedMinutes = 0;

  for (const { exercise } of scored) {
    const estimatedMinutes = Math.min(12, Math.max(5, Math.round(exercise.baseMinutes)));
    if (usedMinutes + estimatedMinutes > timeBudget) continue;

    const prescription = prescribe(exercise, preferences, recentHardDays);
    selected.push({
      name: exercise.name,
      sets: prescription.sets,
      reps: prescription.reps,
      rest: prescription.rest,
      notes: prescription.notes,
      intensity: exercise.intensity,
      estimatedMinutes,
      alternatives: exercise.alternatives.slice(0, 2)
    });

    usedMinutes += estimatedMinutes;
    if (selected.length >= 6) break;
  }

  if (selected.length < 4) {
    selected.push({
      name: 'Low-Impact Conditioning Circuit',
      sets: 3,
      reps: '40 sec work / 20 sec rest',
      rest: '90 sec between rounds',
      notes: 'Use step-ups, squats, and planks at controlled pace.',
      intensity: 'moderate',
      estimatedMinutes: 10,
      alternatives: ['Brisk Walk Intervals', 'Bike Intervals']
    });
  }

  return selected;
};

const scoreExercise = (
  exercise: (typeof EXERCISE_LIBRARY)[number],
  preferences: UserPreferences,
  focus: string,
  recentHardDays: number
) => {
  const goalScore = exercise.goals.includes(preferences.primaryGoal) ? 1 : 0.3;
  const preferenceScore = preferences.workoutPreferences.some((p) =>
    `${exercise.name} ${focus}`.toLowerCase().includes(p.toLowerCase())
  )
    ? 1
    : 0.4;
  const intensityPenalty = recentHardDays >= 3 && exercise.intensity === 'high' ? 0.4 : 0;
  const focusScore = focusMatchScore(exercise.name, focus, exercise.patterns);
  const timeScore = 1 - Math.min(0.5, exercise.baseMinutes / Math.max(20, preferences.timePerSession));
  const equipmentBonus = exercise.equipment.length > 0 ? 0.15 : 0.05;

  return (
    0.35 * goalScore +
    0.2 * preferenceScore +
    0.2 * focusScore +
    0.15 * timeScore +
    0.1 * equipmentBonus -
    intensityPenalty
  );
};

const focusMatchScore = (name: string, focus: string, patterns: string[]) => {
  const lower = `${name} ${focus}`.toLowerCase();
  if (lower.includes('upper') && (patterns.includes('push') || patterns.includes('pull'))) return 1;
  if (lower.includes('lower') && (patterns.includes('squat') || patterns.includes('hinge'))) return 1;
  if (lower.includes('core') && patterns.includes('core')) return 1;
  if (lower.includes('cardio') && patterns.includes('cardio')) return 1;
  if (lower.includes('mobility') && patterns.includes('mobility')) return 1;
  return 0.5;
};

const prescribe = (
  exercise: (typeof EXERCISE_LIBRARY)[number],
  preferences: UserPreferences,
  recentHardDays: number
) => {
  const baseSets = Math.max(2, Math.round(3 * LEVEL_SET_MULTIPLIER[preferences.fitnessLevel]));
  const recoveryAdjustedSets = recentHardDays >= 3 ? Math.max(2, baseSets - 1) : baseSets;

  let reps = exercise.defaultReps;
  let rest = '60 sec';
  let notes = 'Prioritize controlled tempo and full range of motion.';

  if (preferences.primaryGoal === 'strength') {
    reps = exercise.intensity === 'high' ? '4-8' : '6-10';
    rest = exercise.intensity === 'high' ? '90-150 sec' : '75-90 sec';
    notes = 'Stop each set with 1-2 reps in reserve.';
  }

  if (preferences.primaryGoal === 'endurance' || preferences.primaryGoal === 'weight-loss') {
    reps = exercise.intensity === 'high' ? '30-45 sec' : '12-18';
    rest = '30-60 sec';
    notes = 'Keep heart rate elevated while maintaining form.';
  }

  if (preferences.primaryGoal === 'flexibility') {
    reps = exercise.patterns.includes('mobility') ? '45-60 sec' : '10-12';
    rest = '20-40 sec';
    notes = 'Use slow and pain-free range, do not force positions.';
  }

  return {
    sets: recoveryAdjustedSets,
    reps,
    rest,
    notes
  };
};

const chooseFocuses = (preferences: UserPreferences) => {
  const base = GOAL_FOCUS_MAP[preferences.primaryGoal];
  return Array.from({ length: preferences.daysPerWeek }, (_, idx) => base[idx % base.length]);
};

const buildWarmup = (focus: string) => {
  const common = [
    '3 minutes light cardio (walk/cycle)',
    'Dynamic arm circles x 20 total',
    'World’s greatest stretch x 5 each side'
  ];
  if (focus.toLowerCase().includes('lower')) return [...common, 'Glute activation x 2 rounds'];
  if (focus.toLowerCase().includes('upper')) return [...common, 'Band pull-aparts x 20'];
  if (focus.toLowerCase().includes('cardio')) return [...common, 'Gradual pace build-up x 3 minutes'];
  return common;
};

const buildCooldown = (focus: string) => {
  const common = [
    '2 minutes easy breathing walk',
    'Hamstring stretch 30 sec each side',
    'Hip flexor stretch 30 sec each side',
    'Deep nasal breathing x 5 cycles'
  ];
  if (focus.toLowerCase().includes('upper')) return [...common, 'Doorway chest stretch 30 sec each side'];
  if (focus.toLowerCase().includes('lower')) return [...common, 'Calf stretch 30 sec each side'];
  return common;
};

const buildSafetyWarnings = (preferences: UserPreferences) => {
  const warnings: string[] = [];
  if (preferences.healthConsiderations?.trim()) {
    warnings.push('Health/injury notes were detected. Clear new plans with a qualified professional if needed.');
  }
  if (preferences.daysPerWeek >= 6 && preferences.timePerSession >= 60) {
    warnings.push('High weekly load detected. Plan includes built-in recovery adjustments to reduce overtraining risk.');
  }
  if (preferences.primaryGoal === 'weight-loss') {
    warnings.push('Fat-loss outcomes depend on nutrition and sleep consistency in addition to training.');
  }
  return warnings;
};

const calculateReadinessScore = (workoutHistory: WorkoutLog[]) => {
  if (workoutHistory.length === 0) return 70;
  const recent = workoutHistory.slice(-10);
  const completionAvg = recent.reduce((sum, log) => sum + log.completionRate, 0) / recent.length;
  const difficultyAvg = recent.reduce((sum, log) => sum + log.perceivedDifficulty, 0) / recent.length;
  const score = Math.round(completionAvg * 0.7 + (10 - difficultyAvg) * 3);
  return Math.max(40, Math.min(95, score));
};

const buildProgressionRules = (preferences: UserPreferences, readinessScore: number) => {
  const rules = [
    'If you complete all prescribed sets for 2 sessions in a row, increase load 2.5-5% next session.',
    'If perceived difficulty is 9/10 or higher for 2 sessions, reduce total sets by 20% for one week.',
    'Every 4th week is a deload: reduce volume by 30% and keep movement quality high.'
  ];

  if (preferences.primaryGoal === 'endurance') {
    rules.push('Increase interval count by 1 round each week until week 4, then reset and repeat.');
  }

  if (readinessScore < 60) {
    rules.push('Readiness is currently low. Start with conservative loads and prioritize recovery.');
  }

  return rules;
};

const buildRationale = (preferences: UserPreferences, readinessScore: number) => {
  return [
    `Goal priority: ${humanizeGoal(preferences.primaryGoal)} with ${preferences.daysPerWeek} sessions weekly.`,
    `Session length target: ${preferences.timePerSession} minutes with exercise selection optimized for your available equipment.`,
    `Adaptive difficulty enabled using readiness score (${readinessScore}/100) from recent completion and effort trends.`
  ];
};

const buildCoachingTips = (preferences: UserPreferences, readinessScore: number) => {
  const tips = [
    'Track sleep and hydration daily. Recovery quality changes training outcomes more than minor plan tweaks.',
    'Leave 1-2 reps in reserve on most sets to improve consistency and reduce injury risk.'
  ];

  if (preferences.primaryGoal === 'muscle-gain') {
    tips.push('Hit each major muscle group at least twice weekly and maintain a mild calorie surplus.');
  } else if (preferences.primaryGoal === 'weight-loss') {
    tips.push('Add 6,000-10,000 steps/day to amplify fat-loss without adding excessive training stress.');
  }

  if (readinessScore < 65) {
    tips.push('Take one extra low-intensity day this week to restore readiness before progressing load.');
  }

  return tips;
};

const humanizeGoal = (goal: UserPreferences['primaryGoal']) => {
  switch (goal) {
    case 'weight-loss':
      return 'Fat Loss';
    case 'muscle-gain':
      return 'Muscle Gain';
    default:
      return goal.charAt(0).toUpperCase() + goal.slice(1);
  }
};
