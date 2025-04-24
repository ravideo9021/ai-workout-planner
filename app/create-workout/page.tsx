'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import Navbar from '../components/Navbar';
import WorkoutPlan from '../components/WorkoutPlan';

export default function CreateWorkout() {
  const { saveUserPreferences, generateWorkoutPlan, workoutPlan, isGenerating } = useWorkout();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [animatedItems, setAnimatedItems] = useState(false);
  
  // Form state
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'athlete'>('intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<'weight-loss' | 'muscle-gain' | 'endurance' | 'strength' | 'flexibility' | 'general'>('general');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [timePerSession, setTimePerSession] = useState<number>(45);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutPreferences, setWorkoutPreferences] = useState<string[]>([]);
  const [healthConsiderations, setHealthConsiderations] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setAnimatedItems(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animation after initial load
    const timer = setTimeout(() => {
      setAnimatedItems(true);
    }, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(i => i !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };
  
  const togglePreference = (item: string) => {
    if (workoutPreferences.includes(item)) {
      setWorkoutPreferences(workoutPreferences.filter(i => i !== item));
    } else {
      setWorkoutPreferences([...workoutPreferences, item]);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const userPreferences = {
      fitnessLevel,
      primaryGoal,
      daysPerWeek,
      timePerSession,
      equipment,
      workoutPreferences,
      healthConsiderations
    };
    
    saveUserPreferences(userPreferences);
    await generateWorkoutPlan();
    setFormSubmitted(true);
  };
  
  const handleReset = () => {
    setFormSubmitted(false);
  };
  
  return (
    <>
      <Navbar />

      <div className="pt-24 pb-16 container max-w-4xl mx-auto px-4">
        {/* If plan is generated, show the workout plan */}
        {formSubmitted && workoutPlan ? (
          <div className={`transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-400">Your Personalized Workout Plan</h1>
            <WorkoutPlan plan={workoutPlan} />
            <div className="mt-12 text-center">
              <button 
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-10 rounded-full transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-lg font-medium"
              >
                Create Another Plan
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`mb-8 transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">Create Your Personalized Workout Plan</h1>
              <p className="text-xl text-gray-300">
                Tell us about your fitness goals and preferences, and we'll generate a custom workout plan just for you.
              </p>
            </div>
            
            <div className={`bg-gray-800 rounded-xl p-8 shadow-lg transition-all duration-700 transform ${animatedItems ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Tell Us About Yourself</h2>
              <p className="text-gray-300 mb-6">
                The more we know about your fitness level, goals, and constraints, the better we can tailor your workout plan.
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fitness-level" className="block text-sm font-medium text-white mb-1">
                      Current Fitness Level
                    </label>
                    <select 
                      id="fitness-level" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={fitnessLevel}
                      onChange={(e) => setFitnessLevel(e.target.value as any)}
                    >
                      <option value="beginner">Beginner - New to exercise</option>
                      <option value="intermediate">Intermediate - Some experience</option>
                      <option value="advanced">Advanced - Very experienced</option>
                      <option value="athlete">Athlete - Competitive level</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="primary-goal" className="block text-sm font-medium text-white mb-1">
                      Primary Goal
                    </label>
                    <select 
                      id="primary-goal" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value as any)}
                    >
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Improve Endurance</option>
                      <option value="strength">Increase Strength</option>
                      <option value="flexibility">Enhance Flexibility</option>
                      <option value="general">General Fitness</option>
                    </select>
                  </div>
                </div>
                
                {/* Time and frequency */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="days-per-week" className="block text-sm font-medium text-white mb-1">
                      Days Per Week
                    </label>
                    <select 
                      id="days-per-week" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(day => (
                        <option key={day} value={day}>{day} {day === 1 ? 'day' : 'days'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="time-per-session" className="block text-sm font-medium text-white mb-1">
                      Time Per Session
                    </label>
                    <select 
                      id="time-per-session" 
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={timePerSession}
                      onChange={(e) => setTimePerSession(parseInt(e.target.value))}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>
                
                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Available Equipment
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 
                      'Bench', 'Treadmill', 'Exercise Bike', 'Kettlebells', 'None'
                    ].map(item => (
                      <div 
                        key={item}
                        onClick={() => toggleEquipment(item)}
                        className={`cursor-pointer p-3 rounded-md border ${
                          equipment.includes(item) 
                            ? 'bg-blue-600 border-blue-500 text-white' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Workout Preferences */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Workout Preferences (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'High Intensity', 'Low Impact', 'Strength Training', 'Cardio Focus', 
                      'Core Work', 'Mobility', 'Full Body', 'Upper Body', 'Lower Body'
                    ].map(item => (
                      <div 
                        key={item}
                        onClick={() => togglePreference(item)}
                        className={`cursor-pointer p-3 rounded-md border ${
                          workoutPreferences.includes(item) 
                            ? 'bg-blue-600 border-blue-500 text-white' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional info */}
                <div>
                  <label htmlFor="health-considerations" className="block text-sm font-medium text-white mb-1">
                    Health Considerations or Injuries (Optional)
                  </label>
                  <textarea 
                    id="health-considerations"
                    rows={3}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Let us know about any injuries, limitations, or health concerns we should account for."
                    value={healthConsiderations}
                    onChange={(e) => setHealthConsiderations(e.target.value)}
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isGenerating}
                    className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-md text-lg font-medium transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? 'Creating Your Plan...' : 'Generate Workout Plan'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
} 