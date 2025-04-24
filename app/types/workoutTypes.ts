export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
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