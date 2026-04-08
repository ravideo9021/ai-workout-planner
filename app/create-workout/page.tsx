'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import WorkoutPlan from '../components/WorkoutPlan';
import { useWorkout } from '../context/WorkoutContext';
import { UserPreferences } from '../types/workoutTypes';

const presetBlueprints: Array<{ label: string; description: string; payload: Partial<UserPreferences> }> = [
  {
    label: 'Lean & Athletic',
    description: '4 days, conditioning-forward with muscle retention.',
    payload: { primaryGoal: 'weight-loss', daysPerWeek: 4, timePerSession: 45, workoutPreferences: ['High Intensity', 'Cardio Focus'] }
  },
  {
    label: 'Strength Builder',
    description: '4-5 days, progressive overload focus.',
    payload: { primaryGoal: 'strength', daysPerWeek: 4, timePerSession: 60, workoutPreferences: ['Strength Training', 'Upper Body', 'Lower Body'] }
  },
  {
    label: 'Performance Base',
    description: '3 days, balanced full-body with mobility.',
    payload: { primaryGoal: 'general', daysPerWeek: 3, timePerSession: 45, workoutPreferences: ['Full Body', 'Mobility'] }
  }
];

export default function CreateWorkout() {
  const {
    saveUserPreferences,
    generateWorkoutPlan,
    workoutPlan,
    isGenerating,
    generationError,
    user,
    generationMeta,
    aiInsights
  } = useWorkout();

  const [fitnessLevel, setFitnessLevel] = useState<UserPreferences['fitnessLevel']>('intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<UserPreferences['primaryGoal']>('general');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [timePerSession, setTimePerSession] = useState(45);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutPreferences, setWorkoutPreferences] = useState<string[]>([]);
  const [healthConsiderations, setHealthConsiderations] = useState('');

  useEffect(() => {
    if (!workoutPlan) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [workoutPlan]);

  const estimatedWeeklyMinutes = useMemo(() => daysPerWeek * timePerSession, [daysPerWeek, timePerSession]);

  const applyPreset = (payload: Partial<UserPreferences>) => {
    if (payload.primaryGoal) setPrimaryGoal(payload.primaryGoal);
    if (payload.daysPerWeek) setDaysPerWeek(payload.daysPerWeek);
    if (payload.timePerSession) setTimePerSession(payload.timePerSession);
    if (payload.workoutPreferences) setWorkoutPreferences(payload.workoutPreferences);
  };

  const toggleValue = (value: string, current: string[], setter: (next: string[]) => void) => {
    if (current.includes(value)) setter(current.filter((item) => item !== value));
    else setter([...current, value]);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: UserPreferences = {
      fitnessLevel,
      primaryGoal,
      daysPerWeek,
      timePerSession,
      equipment,
      workoutPreferences,
      healthConsiderations
    };

    await saveUserPreferences(payload);
    await generateWorkoutPlan(payload, true);
  };

  return (
    <>
      <Navbar />
      <div className="section-shell pt-24 pb-12">
        <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <section className="space-y-4">
            <div className="surface-card p-6">
              <p className="text-xs uppercase tracking-wider text-cyan-300">Plan Studio</p>
              <h1 className="text-3xl md:text-4xl mt-1">AI Workout Architect</h1>
              <p className="muted mt-2">
                Define your constraints. The AI pipeline will model signals, personalize safely, and generate a weekly plan.
              </p>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg text-emerald-300 mb-3">Quick Start Presets</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {presetBlueprints.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.payload)}
                    className="text-left rounded-xl border border-slate-700/70 bg-slate-900/60 hover:border-cyan-400/50 p-4"
                  >
                    <p className="font-semibold text-slate-100">{preset.label}</p>
                    <p className="text-xs muted mt-1">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="surface-card p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <SelectBlock
                  label="Fitness level"
                  value={fitnessLevel}
                  onChange={(val) => setFitnessLevel(val as UserPreferences['fitnessLevel'])}
                  options={[
                    ['beginner', 'Beginner'],
                    ['intermediate', 'Intermediate'],
                    ['advanced', 'Advanced'],
                    ['athlete', 'Athlete']
                  ]}
                />
                <SelectBlock
                  label="Primary goal"
                  value={primaryGoal}
                  onChange={(val) => setPrimaryGoal(val as UserPreferences['primaryGoal'])}
                  options={[
                    ['weight-loss', 'Weight Loss'],
                    ['muscle-gain', 'Muscle Gain'],
                    ['endurance', 'Endurance'],
                    ['strength', 'Strength'],
                    ['flexibility', 'Flexibility'],
                    ['general', 'General Fitness']
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <SelectBlock
                  label="Days per week"
                  value={String(daysPerWeek)}
                  onChange={(val) => setDaysPerWeek(parseInt(val, 10))}
                  options={[1, 2, 3, 4, 5, 6, 7].map((v) => [String(v), `${v} ${v === 1 ? 'day' : 'days'}`])}
                />
                <SelectBlock
                  label="Time per session"
                  value={String(timePerSession)}
                  onChange={(val) => setTimePerSession(parseInt(val, 10))}
                  options={[30, 45, 60, 75, 90].map((v) => [String(v), `${v} min`])}
                />
              </div>

              <ChipGroup
                title="Equipment"
                values={['Dumbbells', 'Barbell', 'Resistance Bands', 'Bench', 'Treadmill', 'Exercise Bike', 'Kettlebells', 'None']}
                selected={equipment}
                toggle={(value) => toggleValue(value, equipment, setEquipment)}
              />

              <ChipGroup
                title="Training preferences"
                values={['High Intensity', 'Low Impact', 'Strength Training', 'Cardio Focus', 'Core Work', 'Mobility', 'Full Body', 'Upper Body', 'Lower Body']}
                selected={workoutPreferences}
                toggle={(value) => toggleValue(value, workoutPreferences, setWorkoutPreferences)}
              />

              <div>
                <label className="block text-sm mb-2">Injuries or constraints (optional)</label>
                <textarea
                  className="field min-h-[100px]"
                  value={healthConsiderations}
                  onChange={(e) => setHealthConsiderations(e.target.value)}
                  placeholder="Example: left knee sensitivity, avoid deep jumping drills"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-brand" disabled={isGenerating}>
                  {isGenerating ? 'Synthesizing Plan...' : 'Generate AI Plan'}
                </button>
                <button type="button" className="btn-muted" onClick={() => generateWorkoutPlan(undefined, true)}>
                  Re-run AI with latest signals
                </button>
              </div>

              {generationError && <p className="text-sm text-rose-300">{generationError}</p>}
              {!user && <p className="text-xs muted">Sign in to sync plans across devices and enable weekly auto-regeneration.</p>}
            </form>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-cyan-300">Current Blueprint</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="metric">
                  <p className="text-xs muted">Weekly Minutes</p>
                  <p className="text-lg font-semibold">{estimatedWeeklyMinutes}</p>
                </div>
                <div className="metric">
                  <p className="text-xs muted">Plan Days</p>
                  <p className="text-lg font-semibold">{daysPerWeek}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-emerald-300">AI Signal Snapshot</p>
              {generationMeta?.modelSignals ? (
                <div className="space-y-3 mt-3">
                  {Object.entries(generationMeta.modelSignals).map(([key, value]) => (
                    <SignalBar key={key} label={key} value={value} />
                  ))}
                </div>
              ) : (
                <p className="text-sm muted mt-2">Generate a plan to view model signals and confidence.</p>
              )}
            </div>

            <div className="glass-card p-5">
              <p className="text-xs uppercase tracking-wider text-amber-300">AI Insights</p>
              <ul className="space-y-3 mt-3">
                {(aiInsights.length ? aiInsights : [{ title: 'No insights yet', description: 'Run generation to unlock AI intelligence.', priority: 'low' }]).map(
                  (insight, idx) => (
                    <li key={`${insight.title}-${idx}`} className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
                      <p className="text-sm font-semibold text-slate-100">{insight.title}</p>
                      <p className="text-xs muted mt-1">{insight.description}</p>
                    </li>
                  )
                )}
              </ul>
            </div>
          </aside>
        </div>

        {workoutPlan && (
          <section className="mt-8">
            <WorkoutPlan plan={workoutPlan} />
          </section>
        )}
      </div>
    </>
  );
}

function SelectBlock({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="block text-sm mb-2">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([val, text]) => (
          <option key={val} value={val}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChipGroup({
  title,
  values,
  selected,
  toggle
}: {
  title: string;
  values: string[];
  selected: string[];
  toggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm mb-2">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {values.map((value) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`chip ${active ? 'chip-active' : ''}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SignalBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="capitalize text-slate-300">{label}</span>
        <span className="text-cyan-300">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
