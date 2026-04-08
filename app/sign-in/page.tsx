'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useWorkout } from '../context/WorkoutContext';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useWorkout();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') await signUp(name, email, password);
      else await signIn(email, password);
      router.push('/create-workout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="section-shell pt-28 pb-14">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <section className="glass-card p-7 md:p-10">
            <p className="text-xs uppercase tracking-wider text-cyan-300">Account Portal</p>
            <h1 className="text-3xl md:text-4xl mt-2">{mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}</h1>
            <p className="muted mt-2">
              Authenticate to unlock AI memory: server-synced plans, insight history, and weekly auto-rebuild.
            </p>

            <form className="space-y-4 mt-6" onSubmit={onSubmit}>
              {mode === 'signup' && (
                <label className="block">
                  <span className="text-sm mb-2 block">Name</span>
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
              )}

              <label className="block">
                <span className="text-sm mb-2 block">Email</span>
                <input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>

              <label className="block">
                <span className="text-sm mb-2 block">Password</span>
                <input
                  type="password"
                  className="field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <button type="submit" disabled={loading} className="btn-brand w-full">
                {loading ? 'Authorizing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="mt-4 text-sm text-cyan-300 hover:text-cyan-200"
            >
              {mode === 'signin' ? 'New to PulseForge? Create account' : 'Already have an account? Sign in'}
            </button>

            {user && <p className="text-xs text-emerald-300 mt-4">Signed in as {user.email}</p>}
          </section>

          <aside className="surface-card p-7 md:p-10">
            <p className="text-xs uppercase tracking-wider text-emerald-300">What you unlock</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                Persistent plan memory across sessions and devices
              </li>
              <li className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                AI model signal tracking with confidence scoring
              </li>
              <li className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                Weekly auto-regeneration based on recent workout behavior
              </li>
              <li className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
                Adaptive next-best-actions and recovery alerts
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
