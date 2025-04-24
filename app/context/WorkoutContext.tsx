import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise, UserPreferences } from '../types/workoutTypes';

interface WorkoutContextType {
  userPreferences: UserPreferences | null;
  workoutPlan: WorkoutPlan | null;
  isGenerating: boolean;
  saveUserPreferences: (preferences: UserPreferences) => void;
  generateWorkoutPlan: () => Promise<void>;
  resetWorkoutPlan: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const saveUserPreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
  };

  const generateWorkoutPlan = async () => {
    if (!userPreferences) return;
    
    setIsGenerating(true);
    
    try {
      // In a real application, this would be an API call to an AI service
      // For demonstration, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock workout plan generation based on user preferences
      const mockPlan = generateMockWorkoutPlan(userPreferences);
      setWorkoutPlan(mockPlan);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      // Handle error state here
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWorkoutPlan = () => {
    setWorkoutPlan(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        userPreferences,
        workoutPlan,
        isGenerating,
        saveUserPreferences,
        generateWorkoutPlan,
        resetWorkoutPlan
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Helper function to generate a mock workout plan based on user preferences
const generateMockWorkoutPlan = (preferences: UserPreferences): WorkoutPlan => {
  const { fitnessLevel, primaryGoal, daysPerWeek, timePerSession, equipment, workoutPreferences } = preferences;
  
  // Basic logic to adjust workout intensity based on fitness level
  const intensityMultiplier = {
    beginner: 0.7,
    intermediate: 1,
    advanced: 1.3,
    athlete: 1.5
  }[fitnessLevel] || 1;
  
  // Generate the appropriate number of workout days
  const days: WorkoutDay[] = [];
  
  // Define different workout focuses based on goals and preferences
  const workoutFocuses = determineWorkoutFocuses(primaryGoal, workoutPreferences, daysPerWeek);
  
  for (let i = 0; i < daysPerWeek; i++) {
    const dayNumber = i + 1;
    const dayName = `Day ${dayNumber}`;
    const focus = workoutFocuses[i % workoutFocuses.length];
    
    days.push({
      day: dayName,
      focus,
      warmup: generateWarmupExercises(focus),
      exercises: generateMainExercises(focus, equipment, intensityMultiplier, timePerSession),
      cooldown: generateCooldownExercises()
    });
  }
  
  return {
    title: `${daysPerWeek}-Day ${capitalizeFirstLetter(primaryGoal)} Workout Plan`,
    description: `Personalized ${fitnessLevel} level workout plan focused on ${primaryGoal}, designed for ${timePerSession} minute sessions.`,
    days
  };
};

const determineWorkoutFocuses = (goal: string, preferences: string[], daysPerWeek: number): string[] => {
  // Logic to determine workout focus distribution based on goal and preferences
  switch (goal) {
    case 'weight-loss':
      return ['Full Body HIIT', 'Cardio', 'Lower Body', 'Upper Body', 'Core & Cardio', 'Active Recovery', 'Cardio'];
    case 'muscle-gain':
      return ['Chest & Triceps', 'Back & Biceps', 'Legs & Shoulders', 'Rest & Recovery', 'Full Body', 'Arms & Core', 'Rest'];
    case 'endurance':
      return ['Long Cardio', 'Tempo Training', 'Interval Training', 'Strength & Endurance', 'Speed Work', 'Recovery', 'Long Cardio'];
    case 'strength':
      return ['Lower Body Strength', 'Upper Body Push', 'Rest', 'Upper Body Pull', 'Full Body Strength', 'Olympic Lifts', 'Rest'];
    case 'flexibility':
      return ['Dynamic Flexibility', 'Strength & Mobility', 'Yoga Flow', 'Active Recovery', 'Balance & Stability', 'Deep Stretching', 'Rest'];
    default:
      return ['Full Body', 'Cardio', 'Upper Body', 'Lower Body', 'HIIT', 'Mobility', 'Rest'];
  }
};

const generateWarmupExercises = (focus: string): string[] => {
  // Common warm-up exercises
  const commonWarmups = [
    'Light jogging or marching in place for 3 minutes',
    'Arm circles (forward and backward) - 10 each direction',
    'Hip rotations - 10 each direction',
    'Bodyweight squats - 10 reps',
    'Jumping jacks - 30 seconds'
  ];
  
  // Additional warm-ups based on focus
  if (focus.includes('Upper Body')) {
    return [...commonWarmups, 'Shoulder rotations - 10 each direction', 'Wall push-ups - 10 reps'];
  } else if (focus.includes('Lower Body')) {
    return [...commonWarmups, 'Leg swings - 10 each leg', 'Walking lunges - 10 each leg'];
  } else {
    return commonWarmups;
  }
};

const generateMainExercises = (focus: string, equipment: string[], intensityMultiplier: number, timePerSession: number): Exercise[] => {
  // This is a simplified version - a real implementation would have more complex logic
  // based on equipment availability, fitness level, etc.
  
  const hasEquipment = (items: string[]) => items.some(item => equipment.includes(item));
  const hasDumbbells = hasEquipment(['Dumbbells']);
  const hasBarbell = hasEquipment(['Barbell']);
  const hasBands = hasEquipment(['Resistance Bands']);
  
  const exercises: Exercise[] = [];
  
  // Number of exercises based on session time
  const exerciseCount = Math.floor(timePerSession / 15) + 2;
  
  if (focus.includes('Upper Body') || focus.includes('Chest') || focus.includes('Back') || focus.includes('Arms')) {
    if (hasBarbell) {
      exercises.push({
        name: 'Bench Press',
        sets: Math.round(4 * intensityMultiplier),
        reps: '8-10',
        rest: '60-90 sec',
        notes: 'Focus on controlled movement'
      });
    }
    
    if (hasDumbbells) {
      exercises.push({
        name: 'Dumbbell Rows',
        sets: Math.round(3 * intensityMultiplier),
        reps: '10-12',
        rest: '60 sec',
        notes: 'Keep back straight'
      });
      
      exercises.push({
        name: 'Overhead Press',
        sets: Math.round(3 * intensityMultiplier),
        reps: '8-10',
        rest: '60-90 sec'
      });
    }
    
    exercises.push({
      name: 'Push-ups',
      sets: Math.round(3 * intensityMultiplier),
      reps: '10-15',
      rest: '45-60 sec',
      notes: 'Modify on knees if needed'
    });
  }
  
  if (focus.includes('Lower Body') || focus.includes('Legs')) {
    if (hasBarbell) {
      exercises.push({
        name: 'Barbell Squats',
        sets: Math.round(4 * intensityMultiplier),
        reps: '8-10',
        rest: '90-120 sec',
        notes: 'Keep chest up, push through heels'
      });
      
      exercises.push({
        name: 'Romanian Deadlifts',
        sets: Math.round(3 * intensityMultiplier),
        reps: '10-12',
        rest: '90 sec',
        notes: 'Focus on hip hinge'
      });
    }
    
    if (hasDumbbells) {
      exercises.push({
        name: 'Walking Lunges',
        sets: Math.round(3 * intensityMultiplier),
        reps: '10 each leg',
        rest: '60 sec'
      });
    }
    
    exercises.push({
      name: 'Bodyweight Squats',
      sets: Math.round(3 * intensityMultiplier),
      reps: '15-20',
      rest: '45-60 sec'
    });
  }
  
  if (focus.includes('Core') || focus.includes('Full Body')) {
    exercises.push({
      name: 'Planks',
      sets: Math.round(3 * intensityMultiplier),
      reps: '30-45 sec',
      rest: '30 sec',
      notes: 'Keep body in straight line'
    });
    
    exercises.push({
      name: 'Russian Twists',
      sets: Math.round(3 * intensityMultiplier),
      reps: '15 each side',
      rest: '45 sec'
    });
  }
  
  if (focus.includes('Cardio') || focus.includes('HIIT')) {
    exercises.push({
      name: 'Burpees',
      sets: Math.round(3 * intensityMultiplier),
      reps: '10-15',
      rest: '30-45 sec',
      notes: 'Modify by stepping back if needed'
    });
    
    exercises.push({
      name: 'Mountain Climbers',
      sets: Math.round(3 * intensityMultiplier),
      reps: '30 sec',
      rest: '30 sec'
    });
    
    exercises.push({
      name: 'Jump Squats',
      sets: Math.round(3 * intensityMultiplier),
      reps: '15',
      rest: '45 sec',
      notes: 'Land softly'
    });
  }
  
  // Ensure we have enough exercises based on the time per session
  while (exercises.length < exerciseCount) {
    exercises.push({
      name: 'Bodyweight Circuit',
      sets: Math.round(2 * intensityMultiplier),
      reps: '30 sec each exercise',
      rest: '60 sec between sets',
      notes: 'Squats, push-ups, sit-ups, and jumping jacks'
    });
  }
  
  // Limit to the calculated exercise count
  return exercises.slice(0, exerciseCount);
};

const generateCooldownExercises = (): string[] => {
  return [
    'Light walking or marching in place - 2 minutes',
    'Quadriceps stretch - 30 seconds each leg',
    'Hamstring stretch - 30 seconds each leg',
    'Chest stretch - 30 seconds',
    'Child\'s pose - 30 seconds',
    'Deep breathing - 5 deep breaths'
  ];
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default WorkoutProvider; 