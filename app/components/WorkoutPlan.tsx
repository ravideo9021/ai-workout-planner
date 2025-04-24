import React from 'react';
import { WorkoutPlan as WorkoutPlanType } from '../types/workoutTypes';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan }) => {
  return (
    <div className="workout-plan-container space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{plan.title}</h2>
        <p className="text-gray-300">{plan.description}</p>
      </div>
      
      <div className="space-y-6">
        {plan.days.map((day, dayIndex) => (
          <div key={dayIndex} className="card overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-4 text-white">
              <h3 className="text-lg font-semibold">{day.day}: {day.focus}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Warm-up Section */}
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Warm-up (5-10 minutes)</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {day.warmup.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              
              {/* Main Exercises */}
              <div>
                <h4 className="font-medium text-blue-400 mb-3">Main Workout</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Exercise</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sets</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reps/Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rest</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {day.exercises.map((exercise, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}>
                          <td className="px-4 py-3 text-sm font-medium text-white">{exercise.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{exercise.sets}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{exercise.reps}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{exercise.rest}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{exercise.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Cool-down Section */}
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Cool-down (5-10 minutes)</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {day.cooldown.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-900 p-4 rounded-md text-sm text-blue-300 border border-gray-700">
        <p>
          <strong>Pro tip:</strong> To maximize results, focus on proper form rather than lifting heavier weights. 
          Stay consistent with your workout schedule and adjust intensity as needed.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors">
          Save Workout Plan
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors">
          Adjust Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlan; 