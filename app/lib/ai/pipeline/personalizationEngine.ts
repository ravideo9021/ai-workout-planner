import { UserPreferences } from '../../../types/workoutTypes';
import { UserSignals } from './signalEngine';

export interface PersonalizationResult {
  adjustedPreferences: UserPreferences;
  adaptiveGuardrails: string[];
  confidence: number;
}

export const personalizePreferences = (
  preferences: UserPreferences,
  signals: UserSignals
): PersonalizationResult => {
  const adjusted = { ...preferences };
  const adaptiveGuardrails: string[] = [];

  if (signals.fatigueRisk > 0.62) {
    adjusted.timePerSession = Math.max(25, adjusted.timePerSession - 10);
    adaptiveGuardrails.push('Fatigue risk elevated: session duration trimmed for recovery protection.');
  }

  if (signals.consistencyScore < 0.45 && adjusted.daysPerWeek > 4) {
    adjusted.daysPerWeek = 4;
    adaptiveGuardrails.push('Low consistency detected: weekly frequency narrowed to improve adherence.');
  }

  if (signals.progressionMomentum > 0.7 && signals.complianceScore > 0.75) {
    adaptiveGuardrails.push('Positive momentum: progression recommendations increased within safe boundaries.');
  }

  const confidence = Math.max(
    0.5,
    Math.min(
      0.97,
      0.45 * signals.complianceScore +
        0.2 * signals.consistencyScore +
        0.2 * signals.goalAlignment +
        0.15 * (1 - signals.fatigueRisk)
    )
  );

  return {
    adjustedPreferences: adjusted,
    adaptiveGuardrails,
    confidence
  };
};
