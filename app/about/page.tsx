'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import aboutHeroImage from '../../public/images/workout-woman.jpg';

export default function About() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [animatedItems, setAnimatedItems] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
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
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${scrollPosition > 50 ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a 
            href="/"
            className="text-xl font-bold text-blue-400 flex items-center cursor-pointer hover:text-blue-300 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Workout Planner
          </a>
          <div className="flex items-center space-x-6">
            <a 
              href="/"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative px-2 py-1 focus:outline-none group"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="/create-workout"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative px-2 py-1 focus:outline-none group"
            >
              <span className="relative z-10">Create Workout</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="/about"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative px-2 py-1 focus:outline-none group"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-full text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[40vh] mb-16">
        <div className="absolute inset-0">
          <Image 
            src={aboutHeroImage} 
            alt="About AI Workout Planner" 
            className="object-cover brightness-50"
            fill
            priority
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
          <div className={`max-w-3xl transition-all duration-1000 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">About <span className="text-blue-400">AI Workout Planner</span></h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Learn how we're revolutionizing fitness with artificial intelligence
            </p>
          </div>
        </div>
      </section>
      
      {/* Content Sections */}
      <div className="container max-w-4xl mx-auto px-4 pb-20 space-y-16">
        <div className={`transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">Our Mission</h2>
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
            <p className="text-gray-300 mb-4 text-lg">
              At AI Workout Planner, we believe that fitness should be accessible and personalized for everyone, 
              regardless of experience level or equipment availability. Our mission is to leverage the power of 
              artificial intelligence to create custom workout plans that adapt to your unique needs, goals, and constraints.
            </p>
            <p className="text-gray-300 text-lg">
              We're committed to helping you achieve your fitness goals by providing intelligent workout 
              recommendations that evolve as you progress, keeping your fitness journey engaging, effective, and sustainable.
            </p>
          </div>
        </div>
        
        <div className={`transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">How Our AI Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Data Collection",
                description: "Our system collects information about your fitness level, goals, available equipment, time constraints, and workout preferences through an intuitive questionnaire.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                title: "AI Analysis",
                description: "Our advanced machine learning algorithms analyze your inputs and compare them with proven workout methodologies, exercise science principles, and data from thousands of successful fitness plans.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "Plan Generation",
                description: "Based on this analysis, we generate a personalized workout plan that includes specific exercises, sets, reps, rest periods, and progression strategies tailored to your individual needs.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )
              },
              {
                title: "Continuous Adaptation",
                description: "As you log workouts and provide feedback, our AI learns from your progress and adapts your plan accordingly, ensuring you continue to be challenged and move toward your goals effectively.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }
            ].map((step, i) => (
              <div key={i} className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-default">
                <div className="w-14 h-14 bg-blue-900 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`transition-all duration-500 transform ${animatedItems ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ravi Deo',
                role: 'Fitness Director',
                bio: 'Certified personal trainer with 10+ years of experience designing personalized workout programs.'
              },
              {
                name: 'Arjun Shararat',
                role: 'AI Lead',
                bio: 'Machine Learning with expertise in developing adaptive recommendation systems.'
              },
              {
                name: 'Aditya Bourah',
                role: 'UX Designer',
                bio: 'Specializes in creating intuitive, accessible interfaces for health and fitness applications.'
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-medium text-white text-xl mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`relative bg-gradient-to-br from-blue-900 to-gray-900 p-10 rounded-xl shadow-lg text-center mt-12 overflow-hidden transition-all duration-700 transform ${animatedItems ? 'opacity-100 translate-y-0 delay-450' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to transform your <span className="text-blue-400">fitness journey</span>?</h2>
            <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">
              Join thousands of users who have discovered the power of AI-personalized workout planning.
            </p>
            <a 
              href="/create-workout"
              className="btn-primary bg-blue-600 hover:bg-blue-500 text-white py-4 px-10 text-lg font-medium rounded-full inline-block transition-all hover:shadow-blue-600/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Create Your Plan — Start Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 