import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ClientProviders from './components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Workout Planner',
  description: 'Your personalized fitness companion powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-lg font-semibold text-blue-400">AI Workout Planner</p>
                    <p className="text-sm text-gray-400">Your personalized fitness companion</p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a>
                  </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400">
                  <p>© {new Date().getFullYear()} AI Workout Planner. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
} 