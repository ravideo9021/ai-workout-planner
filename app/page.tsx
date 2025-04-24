'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import workoutImage from '../public/images/workout-woman.jpg';

export default function Home() {
  const [animatedItems, setAnimatedItems] = useState(false);

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

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image 
            src={workoutImage} 
            alt="Woman working out with dumbbells"
            className="object-cover brightness-50"
            fill
            priority
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
          <div className={`max-w-2xl transition-all duration-1000 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
              Your <span className="text-blue-400">AI-Powered</span> Fitness Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white">
              Get personalized workout plans tailored to your goals, equipment, and fitness level
            </p>
            <Link 
              href="/create-workout"
              className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-10 text-lg font-medium rounded-full inline-block transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Create Your Workout Plan
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-400">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className={`card text-center bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-blue-900 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">1. Input Your Details</h3>
              <p className="text-gray-300">Tell us about your fitness level, goals, available equipment, and time constraints.</p>
            </div>
            
            <div className={`card text-center bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${animatedItems ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-blue-900 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">2. Get Your Plan</h3>
              <p className="text-gray-300">Our AI generates a personalized workout plan optimized for your specific needs.</p>
            </div>
            
            <div className={`card text-center bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${animatedItems ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-blue-900 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">3. Track Progress</h3>
              <p className="text-gray-300">Log your workouts, track improvements, and watch as your plan evolves with your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-400">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Alex Chen",
                role: "Marathon Runner",
                quote: "The AI workout planner has completely transformed my training routine. It adapts perfectly to my marathon preparation schedule!"
              },
              {
                name: "Sarah Johnson",
                role: "Fitness Enthusiast",
                quote: "It's like having a personal trainer that knows exactly what I need. The personalized plans have helped me achieve goals I never thought possible."
              },
              {
                name: "Michael Torres",
                role: "Beginner",
                quote: "As someone new to fitness, this tool has been invaluable. It creates workouts that are challenging but not overwhelming."
              }
            ].map((testimonial, i) => (
              <div key={i} className={`card bg-gray-900 p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${animatedItems ? 'opacity-100 translate-y-0 delay-' + (i * 150) : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{testimonial.name}</h4>
                    <p className="text-blue-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-3xl mx-auto transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Join thousands of users who have achieved their fitness goals with our AI-powered workout planner.
            </p>
            <Link 
              href="/create-workout"
              className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-12 text-lg font-medium rounded-full inline-block transition-all hover:shadow-blue-600/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Get Started Now — It's Free
            </Link>
            <p className="text-gray-400 mt-6">No credit card required. Start training today!</p>
          </div>
        </div>
      </section>
    </>
  );
} 