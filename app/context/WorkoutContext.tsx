'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AIInsight,
  AuthUser,
  UserPreferences,
  WorkoutGenerationMeta,
  WorkoutLog,
  WorkoutPlan
} from '../types/workoutTypes';

interface WorkoutContextType {
  user: AuthUser | null;
  authLoading: boolean;
  userPreferences: UserPreferences | null;
  workoutPlan: WorkoutPlan | null;
  workoutHistory: WorkoutLog[];
  generationMeta: WorkoutGenerationMeta | null;
  aiInsights: AIInsight[];
  isGenerating: boolean;
  generationError: string | null;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshFromServer: () => Promise<void>;
  saveUserPreferences: (preferences: UserPreferences) => Promise<void>;
  generateWorkoutPlan: (preferencesOverride?: UserPreferences, force?: boolean) => Promise<void>;
  resetWorkoutPlan: () => void;
  logWorkout: (entry: Omit<WorkoutLog, 'id' | 'completedAt'>) => Promise<void>;
  getReadinessTrend: () => 'improving' | 'stable' | 'declining';
}

const STORAGE_KEYS = {
  preferences: 'ai-workout-preferences-v2',
  plan: 'ai-workout-plan-v2',
  history: 'ai-workout-history-v2',
  meta: 'ai-workout-meta-v2'
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([]);
  const [generationMeta, setGenerationMeta] = useState<WorkoutGenerationMeta | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const persist = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('workout-context-persist-error', error);
    }
  };

  const hydrateLocal = () => {
    try {
      const storedPreferences = localStorage.getItem(STORAGE_KEYS.preferences);
      const storedPlan = localStorage.getItem(STORAGE_KEYS.plan);
      const storedHistory = localStorage.getItem(STORAGE_KEYS.history);
      const storedMeta = localStorage.getItem(STORAGE_KEYS.meta);

      if (storedPreferences) setUserPreferences(JSON.parse(storedPreferences));
      if (storedPlan) setWorkoutPlan(JSON.parse(storedPlan));
      if (storedHistory) setWorkoutHistory(JSON.parse(storedHistory));
      if (storedMeta) setGenerationMeta(JSON.parse(storedMeta));
    } catch (error) {
      console.error('workout-context-load-error', error);
    }
  };

  const fetchUser = async (): Promise<AuthUser | null> => {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const payload = await safeJson(res);
    return payload.user || null;
  };

  const refreshFromServer = async () => {
    const res = await fetch('/api/user/plan', { cache: 'no-store' });
    if (!res.ok) return;
    const payload = await safeJson(res);

    setWorkoutPlan(payload.plan || null);
    setUserPreferences(payload.preferences || null);
    setWorkoutHistory(payload.workoutHistory || []);
    setGenerationMeta(payload.meta || null);
    setAIInsights(payload.insights || []);

    if (payload.plan) persist(STORAGE_KEYS.plan, payload.plan);
    if (payload.preferences) persist(STORAGE_KEYS.preferences, payload.preferences);
    if (payload.workoutHistory) persist(STORAGE_KEYS.history, payload.workoutHistory);
    if (payload.meta) persist(STORAGE_KEYS.meta, payload.meta);
  };

  useEffect(() => {
    hydrateLocal();
    (async () => {
      try {
        const currentUser = await fetchUser();
        setUser(currentUser);
        if (currentUser) await refreshFromServer();
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const payload = await safeJson(res);
    if (!res.ok) throw new Error(payload?.error || 'Sign up failed');
    setUser(payload.user);
    await refreshFromServer();
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const payload = await safeJson(res);
    if (!res.ok) throw new Error(payload?.error || 'Sign in failed');
    setUser(payload.user);
    await refreshFromServer();
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setAIInsights([]);
  };

  const saveUserPreferences = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    persist(STORAGE_KEYS.preferences, preferences);

    if (!user) return;
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences })
    });
    if (!res.ok) {
      const payload = await safeJson(res);
      throw new Error(payload?.error || 'Failed to save preferences');
    }
  };

  const generateWorkoutPlan = async (preferencesOverride?: UserPreferences, force = false) => {
    const payloadPreferences = preferencesOverride || userPreferences;
    if (!payloadPreferences) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      if (user) {
        const res = await fetch('/api/user/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: payloadPreferences, force })
        });
        const payload = await safeJson(res);
        if (!res.ok) throw new Error(payload?.error || 'Plan generation failed');

        setWorkoutPlan(payload.plan || null);
        setUserPreferences(payload.preferences || payloadPreferences);
        setWorkoutHistory(payload.workoutHistory || []);
        setGenerationMeta(payload.meta || null);
        setAIInsights(payload.insights || []);

        if (payload.plan) persist(STORAGE_KEYS.plan, payload.plan);
        if (payload.meta) persist(STORAGE_KEYS.meta, payload.meta);
        if (payload.workoutHistory) persist(STORAGE_KEYS.history, payload.workoutHistory);
        persist(STORAGE_KEYS.preferences, payload.preferences || payloadPreferences);
        return;
      }

      const response = await fetch('/api/ai/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: payloadPreferences,
          workoutHistory
        })
      });

      const payload = await safeJson(response);
      if (!response.ok) throw new Error(payload?.error || 'Plan generation failed');

      setWorkoutPlan(payload.plan);
      setGenerationMeta(payload.meta);
      setAIInsights(payload.insights || []);
      persist(STORAGE_KEYS.plan, payload.plan);
      persist(STORAGE_KEYS.meta, payload.meta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error while generating plan.';
      setGenerationError(message);
      console.error('generate-plan-error', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWorkoutPlan = () => {
    setWorkoutPlan(null);
    setGenerationMeta(null);
    setAIInsights([]);
    persist(STORAGE_KEYS.plan, null);
    persist(STORAGE_KEYS.meta, null);
  };

  const logWorkout = async (entry: Omit<WorkoutLog, 'id' | 'completedAt'>) => {
    if (user) {
      const res = await fetch('/api/user/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      const payload = await safeJson(res);
      if (!res.ok) throw new Error(payload?.error || 'Failed to log workout');
      const updated = payload.workoutHistory || [];
      setWorkoutHistory(updated);
      persist(STORAGE_KEYS.history, updated);
      return;
    }

    const next: WorkoutLog = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      completedAt: new Date().toISOString()
    };

    const updated = [next, ...workoutHistory].slice(0, 100);
    setWorkoutHistory(updated);
    persist(STORAGE_KEYS.history, updated);
  };

  const getReadinessTrend = () => {
    if (workoutHistory.length < 6) return 'stable';
    const recent = workoutHistory.slice(0, 3);
    const prior = workoutHistory.slice(3, 6);
    const score = (items: WorkoutLog[]) =>
      items.reduce((sum, item) => sum + item.completionRate - item.perceivedDifficulty * 4, 0) / items.length;
    const delta = score(recent) - score(prior);
    if (delta > 8) return 'improving';
    if (delta < -8) return 'declining';
    return 'stable';
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      userPreferences,
      workoutPlan,
      workoutHistory,
      generationMeta,
      aiInsights,
      isGenerating,
      generationError,
      signUp,
      signIn,
      signOut,
      refreshFromServer,
      saveUserPreferences,
      generateWorkoutPlan,
      resetWorkoutPlan,
      logWorkout,
      getReadinessTrend
    }),
    [
      user,
      authLoading,
      userPreferences,
      workoutPlan,
      workoutHistory,
      generationMeta,
      aiInsights,
      isGenerating,
      generationError
    ]
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

export default WorkoutProvider;
