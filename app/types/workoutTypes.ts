export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  intensity?: 'low' | 'moderate' | 'high';
  estimatedMinutes?: number;
  alternatives?: string[];
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface WorkoutPlan {
  title: string;
  description: string;
  days: WorkoutDay[];
  generatedAt?: string;
  aiSummary?: string;
  coachingTips?: string[];
  safetyNotes?: string[];
  progressionRules?: string[];
}

export interface UserPreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'athlete';
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'endurance' | 'strength' | 'flexibility' | 'general';
  daysPerWeek: number;
  timePerSession: number;
  equipment: string[];
  workoutPreferences: string[];
  healthConsiderations?: string;
}

export interface WorkoutLog {
  id: string;
  completedAt: string;
  day: string;
  focus: string;
  completionRate: number;
  perceivedDifficulty: number;
  notes?: string;
}

export interface WorkoutGenerationMeta {
  readinessScore: number;
  estimatedWeeklyLoad: number;
  algorithmVersion: string;
  warnings: string[];
  rationale: string[];
  aiConfidence?: number;
  modelSignals?: Record<string, number>;
  nextBestActions?: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin';
  createdAt: string;
}

export interface AIInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}
