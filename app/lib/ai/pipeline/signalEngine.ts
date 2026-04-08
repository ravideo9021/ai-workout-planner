import { UserPreferences, WorkoutLog } from '../../../types/workoutTypes';

export interface UserSignals {
  complianceScore: number;
  fatigueRisk: number;
  consistencyScore: number;
  progressionMomentum: number;
  goalAlignment: number;
}

export const deriveUserSignals = (
  preferences: UserPreferences,
  history: WorkoutLog[]
): UserSignals => {
  if (history.length === 0) {
    return {
      complianceScore: 0.72,
      fatigueRisk: 0.28,
      consistencyScore: 0.65,
      progressionMomentum: 0.55,
      goalAlignment: 0.7
    };
  }

  const recent = history.slice(0, 14);
  const completionAvg = recent.reduce((sum, log) => sum + log.completionRate, 0) / recent.length;
  const difficultyAvg = recent.reduce((sum, log) => sum + log.perceivedDifficulty, 0) / recent.length;

  const uniqueDays = new Set(recent.map((log) => new Date(log.completedAt).toDateString())).size;
  const consistencyScore = Math.min(1, uniqueDays / Math.max(4, preferences.daysPerWeek + 1));
  const complianceScore = Math.max(0, Math.min(1, completionAvg / 100));
  const fatigueRisk = Math.max(0, Math.min(1, (difficultyAvg - 4) / 6));

  const oldWindow = history.slice(14, 28);
  const oldCompletion = oldWindow.length
    ? oldWindow.reduce((sum, log) => sum + log.completionRate, 0) / oldWindow.length
    : completionAvg - 5;

  const progressionMomentum = Math.max(0, Math.min(1, 0.5 + (completionAvg - oldCompletion) / 50));

  const goalAlignment = inferGoalAlignment(preferences.primaryGoal, recent, completionAvg, difficultyAvg);

  return {
    complianceScore,
    fatigueRisk,
    consistencyScore,
    progressionMomentum,
    goalAlignment
  };
};

const inferGoalAlignment = (
  goal: UserPreferences['primaryGoal'],
  recent: WorkoutLog[],
  completionAvg: number,
  difficultyAvg: number
) => {
  const cardioSessions = recent.filter((log) => /cardio|conditioning|interval/i.test(log.focus)).length;
  const strengthSessions = recent.filter((log) => /strength|upper|lower|push|pull/i.test(log.focus)).length;

  if (goal === 'weight-loss' || goal === 'endurance') {
    const ratio = cardioSessions / Math.max(1, recent.length);
    return Math.max(0, Math.min(1, ratio * 1.4));
  }

  if (goal === 'strength' || goal === 'muscle-gain') {
    const ratio = strengthSessions / Math.max(1, recent.length);
    return Math.max(0, Math.min(1, ratio * 1.3));
  }

  const blended = (completionAvg / 100 + (10 - difficultyAvg) / 10) / 2;
  return Math.max(0, Math.min(1, blended));
};
