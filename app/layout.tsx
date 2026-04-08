import React from 'react';
import './globals.css';
import ClientProviders from './components/ClientProviders';

export const metadata = {
  title: 'PulseForge AI Fitness',
  description: 'Adaptive AI workout platform with coaching, progression intelligence, and recovery-aware planning.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <footer className="border-t border-slate-800/70 bg-[#060912]/90">
              <div className="section-shell py-8 flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-cyan-300">PulseForge AI Fitness</p>
                  <p className="text-sm muted">Train with intelligence. Recover with intention. Progress with data.</p>
                </div>
                <div className="text-sm muted flex gap-5">
                  <span>Adaptive Plans</span>
                  <span>Weekly Rebuild</span>
                  <span>Coach AI</span>
                </div>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
