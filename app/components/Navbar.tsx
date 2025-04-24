'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/"
            className="text-xl font-bold text-blue-400 flex items-center cursor-pointer hover:text-blue-300 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Workout Planner
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative group font-medium"
            >
              <span>Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/create-workout"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative group font-medium"
            >
              <span>Create Workout</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/progress-tracker"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative group font-medium"
            >
              <span>Progress Tracker</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about"
              className="text-white hover:text-blue-400 transition-colors cursor-pointer relative group font-medium"
            >
              <span>About</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-5 rounded-full transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 py-2 px-2 bg-gray-800/80 backdrop-blur-sm rounded-lg">
            <Link 
              href="/"
              className="text-white hover:text-blue-400 transition-colors py-2 px-3 rounded-md hover:bg-gray-700/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/create-workout"
              className="text-white hover:text-blue-400 transition-colors py-2 px-3 rounded-md hover:bg-gray-700/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Workout
            </Link>
            <Link 
              href="/progress-tracker"
              className="text-white hover:text-blue-400 transition-colors py-2 px-3 rounded-md hover:bg-gray-700/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Progress Tracker
            </Link>
            <Link 
              href="/about"
              className="text-white hover:text-blue-400 transition-colors py-2 px-3 rounded-md hover:bg-gray-700/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-all text-center font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 