'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';

export default function Navbar() {
  const { user, authLoading, signOut } = useWorkout();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-[#060912]/86 border-b border-slate-700/50' : 'bg-transparent'
      }`}
    >
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-cyan-300 text-lg">
            <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-cyan-400/15 border border-cyan-300/40">⚡</span>
            PulseForge
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <NavLink href="/create-workout" label="Plan Builder" />
            <NavLink href="/progress-tracker" label="Analytics" />
            <NavLink href="/about" label="Method" />
            {user?.role === 'coach' || user?.role === 'admin' ? <NavLink href="/dashboard/coach" label="Coach" /> : null}
            {user?.role === 'admin' ? <NavLink href="/dashboard/admin" label="Admin" /> : null}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {authLoading ? (
              <span className="text-sm muted">Loading</span>
            ) : user ? (
              <>
                <span className="text-sm text-slate-200">{user.name}</span>
                <button onClick={() => signOut()} className="btn-muted py-2 px-4 text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/sign-in" className="btn-brand py-2 px-4 text-sm">
                Sign In
              </Link>
            )}
          </div>

          <button onClick={() => setOpen((v) => !v)} className="md:hidden btn-muted py-2 px-3 text-sm">
            Menu
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 glass-card p-3 space-y-2">
            <MobileLink href="/create-workout" label="Plan Builder" close={() => setOpen(false)} />
            <MobileLink href="/progress-tracker" label="Analytics" close={() => setOpen(false)} />
            <MobileLink href="/about" label="Method" close={() => setOpen(false)} />
            {user?.role === 'coach' || user?.role === 'admin' ? (
              <MobileLink href="/dashboard/coach" label="Coach" close={() => setOpen(false)} />
            ) : null}
            {user?.role === 'admin' ? <MobileLink href="/dashboard/admin" label="Admin" close={() => setOpen(false)} /> : null}
            {user ? (
              <button
                onClick={async () => {
                  await signOut();
                  setOpen(false);
                }}
                className="w-full btn-muted text-sm"
              >
                Sign Out
              </button>
            ) : (
              <MobileLink href="/sign-in" label="Sign In" close={() => setOpen(false)} />
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="hover:text-cyan-300 transition-colors">
      {label}
    </Link>
  );
}

function MobileLink({ href, label, close }: { href: string; label: string; close: () => void }) {
  return (
    <Link href={href} className="block w-full btn-muted text-sm" onClick={close}>
      {label}
    </Link>
  );
}
