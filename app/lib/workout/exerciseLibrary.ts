import { UserPreferences } from '../../types/workoutTypes';

export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'core' | 'cardio' | 'mobility';

export interface ExerciseDefinition {
  id: string;
  name: string;
  patterns: MovementPattern[];
  goals: UserPreferences['primaryGoal'][];
  equipment: string[];
  levelMin: UserPreferences['fitnessLevel'];
  levelMax: UserPreferences['fitnessLevel'];
  contraindications: string[];
  intensity: 'low' | 'moderate' | 'high';
  baseMinutes: number;
  defaultReps: string;
  alternatives: string[];
}

export const FITNESS_ORDER: Record<UserPreferences['fitnessLevel'], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  athlete: 3
};

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    patterns: ['squat'],
    goals: ['weight-loss', 'endurance', 'general', 'strength'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['knee pain', 'knee injury'],
    intensity: 'moderate',
    baseMinutes: 7,
    defaultReps: '12-15',
    alternatives: ['Box Squat', 'Chair Squat']
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    patterns: ['squat'],
    goals: ['muscle-gain', 'strength', 'general'],
    equipment: ['Dumbbells', 'Kettlebells'],
    levelMin: 'intermediate',
    levelMax: 'athlete',
    contraindications: ['knee pain', 'knee injury'],
    intensity: 'high',
    baseMinutes: 9,
    defaultReps: '8-12',
    alternatives: ['Split Squat', 'Leg Press']
  },
  {
    id: 'push-up',
    name: 'Push-up',
    patterns: ['push'],
    goals: ['muscle-gain', 'strength', 'weight-loss', 'general'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['shoulder injury', 'wrist pain'],
    intensity: 'moderate',
    baseMinutes: 8,
    defaultReps: '8-15',
    alternatives: ['Incline Push-up', 'Dumbbell Floor Press']
  },
  {
    id: 'db-row',
    name: 'Dumbbell Row',
    patterns: ['pull'],
    goals: ['muscle-gain', 'strength', 'general'],
    equipment: ['Dumbbells'],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['lower back pain'],
    intensity: 'moderate',
    baseMinutes: 8,
    defaultReps: '10-12',
    alternatives: ['Resistance Band Row', 'Chest Supported Row']
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift',
    patterns: ['hinge'],
    goals: ['strength', 'muscle-gain', 'general'],
    equipment: ['Dumbbells', 'Barbell'],
    levelMin: 'intermediate',
    levelMax: 'athlete',
    contraindications: ['lower back pain', 'hamstring strain'],
    intensity: 'high',
    baseMinutes: 10,
    defaultReps: '6-10',
    alternatives: ['Hip Thrust', 'Glute Bridge']
  },
  {
    id: 'plank',
    name: 'Plank',
    patterns: ['core'],
    goals: ['general', 'weight-loss', 'endurance', 'strength'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['shoulder injury'],
    intensity: 'low',
    baseMinutes: 6,
    defaultReps: '30-60 sec',
    alternatives: ['Dead Bug', 'Bird Dog']
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    patterns: ['cardio', 'core'],
    goals: ['weight-loss', 'endurance', 'general'],
    equipment: [],
    levelMin: 'intermediate',
    levelMax: 'athlete',
    contraindications: ['wrist pain', 'lower back pain'],
    intensity: 'high',
    baseMinutes: 7,
    defaultReps: '30-45 sec',
    alternatives: ['March in Place', 'Step-ups']
  },
  {
    id: 'bike-intervals',
    name: 'Exercise Bike Intervals',
    patterns: ['cardio'],
    goals: ['weight-loss', 'endurance', 'general'],
    equipment: ['Exercise Bike'],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: [],
    intensity: 'moderate',
    baseMinutes: 12,
    defaultReps: '8 rounds x 45 sec hard / 60 sec easy',
    alternatives: ['Treadmill Intervals', 'Brisk Walking Intervals']
  },
  {
    id: 'treadmill-intervals',
    name: 'Treadmill Intervals',
    patterns: ['cardio'],
    goals: ['weight-loss', 'endurance', 'general'],
    equipment: ['Treadmill'],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['knee pain', 'ankle injury'],
    intensity: 'moderate',
    baseMinutes: 12,
    defaultReps: '10 rounds x 1 min run / 1 min walk',
    alternatives: ['Bike Intervals', 'Incline Walking']
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    patterns: ['pull', 'mobility'],
    goals: ['general', 'flexibility', 'strength'],
    equipment: ['Resistance Bands'],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: [],
    intensity: 'low',
    baseMinutes: 6,
    defaultReps: '12-20',
    alternatives: ['Face Pull', 'Wall Slides']
  },
  {
    id: 'lunge',
    name: 'Walking Lunge',
    patterns: ['squat'],
    goals: ['weight-loss', 'muscle-gain', 'general', 'strength'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['knee pain'],
    intensity: 'moderate',
    baseMinutes: 8,
    defaultReps: '10-12 each leg',
    alternatives: ['Reverse Lunge', 'Step-up']
  },
  {
    id: 'burpee',
    name: 'Burpee',
    patterns: ['cardio', 'push'],
    goals: ['weight-loss', 'endurance'],
    equipment: [],
    levelMin: 'advanced',
    levelMax: 'athlete',
    contraindications: ['knee pain', 'wrist pain', 'lower back pain'],
    intensity: 'high',
    baseMinutes: 7,
    defaultReps: '8-12',
    alternatives: ['Squat Thrust', 'Modified Burpee']
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    patterns: ['core'],
    goals: ['general', 'flexibility', 'strength'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: [],
    intensity: 'low',
    baseMinutes: 6,
    defaultReps: '8-12 each side',
    alternatives: ['Plank', 'Bird Dog']
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    patterns: ['hinge'],
    goals: ['general', 'strength', 'flexibility'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: ['lower back pain'],
    intensity: 'low',
    baseMinutes: 7,
    defaultReps: '12-20',
    alternatives: ['Hip Thrust', 'Romanian Deadlift']
  },
  {
    id: 'mobility-flow',
    name: 'Mobility Flow',
    patterns: ['mobility'],
    goals: ['flexibility', 'general'],
    equipment: [],
    levelMin: 'beginner',
    levelMax: 'athlete',
    contraindications: [],
    intensity: 'low',
    baseMinutes: 10,
    defaultReps: '8-10 movements x 30 sec each',
    alternatives: ['Yoga Flow', 'Dynamic Stretching']
  }
];
