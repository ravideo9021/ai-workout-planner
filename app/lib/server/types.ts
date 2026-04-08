import { UserPreferences, WorkoutLog, WorkoutPlan } from '../../types/workoutTypes';
import { AIInsight, WorkoutGenerationMeta } from '../../types/workoutTypes';

export type UserRole = 'athlete' | 'coach' | 'admin';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface UserDataRecord {
  userId: string;
  preferences: UserPreferences | null;
  plan: WorkoutPlan | null;
  workoutHistory: WorkoutLog[];
  planGeneratedAt: string | null;
  generationMeta: WorkoutGenerationMeta | null;
  aiInsights: AIInsight[];
  updatedAt: string;
}

export interface AppDatabase {
  users: UserRecord[];
  userData: UserDataRecord[];
  sessions: Array<{
    token: string;
    userId: string;
    expiresAt: string;
    createdAt: string;
  }>;
}
