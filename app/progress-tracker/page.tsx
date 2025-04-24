'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function ProgressTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="pt-24 pb-16 container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Fitness Progress</h1>
      
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'history', label: 'Workout History' },
                { id: 'metrics', label: 'Body Metrics' },
                { id: 'goals', label: 'Goals' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Summary Cards */}
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h3 className="text-lg font-medium mb-2">Workouts Completed</h3>
                <p className="text-4xl font-bold">24</p>
                <p className="text-sm opacity-80 mt-2">Last workout: Yesterday</p>
              </div>
              
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-lg font-medium mb-2">Current Streak</h3>
                <p className="text-4xl font-bold">7 days</p>
                <p className="text-sm opacity-80 mt-2">Your longest: 14 days</p>
              </div>
              
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <h3 className="text-lg font-medium mb-2">Workout Minutes</h3>
                <p className="text-4xl font-bold">860</p>
                <p className="text-sm opacity-80 mt-2">This month</p>
              </div>
            </div>
            
            {/* Progress Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
                <div className="h-64 flex items-end justify-between gap-2 pt-6">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    // Generate random heights for demonstration
                    const height = Math.floor(Math.random() * (100 - 20) + 20);
                    const isToday = index === 3; // Pretend Thursday is today
                    
                    return (
                      <div key={day} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full ${isToday ? 'bg-blue-500' : 'bg-blue-300'} rounded-t transition-all hover:opacity-80`} 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-sm mt-2 text-gray-400">{day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Strength Progress</h2>
                <div className="space-y-6">
                  {['Bench Press', 'Squats', 'Deadlift'].map(exercise => {
                    // Generate random progress data for demonstration
                    const currentWeight = Math.floor(Math.random() * (200 - 80) + 80);
                    const startWeight = currentWeight - Math.floor(Math.random() * 40);
                    const progress = Math.round(((currentWeight - startWeight) / startWeight) * 100);
                    
                    return (
                      <div key={exercise}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{exercise}</span>
                          <span className="text-sm text-gray-400">{startWeight} → {currentWeight} lbs</span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${Math.min(100, progress)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{progress}% increase</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* History Tab Content */}
        {activeTab === 'history' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Workouts</h2>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Search workouts" 
                  className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="btn-primary rounded-l-none py-2 px-4">Search</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Workout Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Intensity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {[
                    { 
                      date: 'Aug 12, 2023', 
                      type: 'Upper Body Strength', 
                      duration: '45 min', 
                      intensity: 'High'
                    },
                    { 
                      date: 'Aug 10, 2023', 
                      type: 'HIIT Cardio', 
                      duration: '30 min', 
                      intensity: 'Very High'
                    },
                    { 
                      date: 'Aug 9, 2023', 
                      type: 'Lower Body Strength', 
                      duration: '60 min', 
                      intensity: 'Medium'
                    },
                    { 
                      date: 'Aug 7, 2023', 
                      type: 'Yoga', 
                      duration: '45 min', 
                      intensity: 'Low'
                    },
                    { 
                      date: 'Aug 5, 2023', 
                      type: 'Full Body Circuit', 
                      duration: '50 min', 
                      intensity: 'High'
                    }
                  ].map((workout, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{workout.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{workout.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{workout.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          workout.intensity === 'Low' ? 'bg-green-900 text-green-300' :
                          workout.intensity === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                          workout.intensity === 'High' ? 'bg-orange-900 text-orange-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {workout.intensity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                        <button className="text-gray-400 hover:text-gray-300">Log</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Metrics Tab Content */}
        {activeTab === 'metrics' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Body Metrics</h2>
            <p className="text-gray-400 mb-8">Track your physical measurements and see your progress over time.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Measurements</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Weight', value: '178 lbs', change: '-2.3 lbs' },
                    { name: 'Body Fat', value: '18%', change: '-0.8%' },
                    { name: 'Chest', value: '42 in', change: '+0.5 in' },
                    { name: 'Waist', value: '34 in', change: '-1.0 in' },
                    { name: 'Arms', value: '15 in', change: '+0.25 in' }
                  ].map((metric) => (
                    <div key={metric.name} className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <span className="font-medium">{metric.name}</span>
                      <div className="text-right">
                        <span className="block text-lg">{metric.value}</span>
                        <span className={`text-xs ${metric.change.startsWith('-') ? 'text-green-400' : metric.change.startsWith('+') ? 'text-blue-400' : 'text-gray-400'}`}>
                          {metric.change} (30 days)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Add New Measurement</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Measurement Type
                    </label>
                    <select className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md">
                      <option>Weight</option>
                      <option>Body Fat</option>
                      <option>Chest</option>
                      <option>Waist</option>
                      <option>Arms</option>
                      <option>Legs</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Value
                    </label>
                    <div className="flex">
                      <input 
                        type="number" 
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-l-md"
                        placeholder="0"
                      />
                      <select className="bg-gray-700 border border-gray-600 text-white border-l-0 rounded-r-md px-2">
                        <option>lbs</option>
                        <option>kg</option>
                        <option>%</option>
                        <option>in</option>
                        <option>cm</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button className="btn-primary w-full">
                      Save Measurement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Goals Tab Content */}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Your Fitness Goals</h2>
              <p className="text-gray-400 mb-6">Setting clear, achievable goals is key to making progress.</p>
              
              <div className="space-y-6">
                {[
                  { 
                    title: 'Lose 10 pounds', 
                    deadline: 'Sep 30, 2023',
                    progress: 30,
                    category: 'Weight Loss'
                  },
                  { 
                    title: 'Run a 5K under 25 minutes', 
                    deadline: 'Oct 15, 2023',
                    progress: 65,
                    category: 'Cardio'
                  },
                  { 
                    title: 'Bench press 225 lbs', 
                    deadline: 'Dec 31, 2023',
                    progress: 40,
                    category: 'Strength'
                  }
                ].map((goal, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{goal.title}</h3>
                        <p className="text-sm text-gray-400">Due by {goal.deadline}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                        {goal.category}
                      </span>
                    </div>
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.progress < 30 ? 'bg-red-500' : 
                            goal.progress < 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button className="btn-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 