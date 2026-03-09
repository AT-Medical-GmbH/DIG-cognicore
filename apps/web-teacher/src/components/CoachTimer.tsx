'use client';

import { useState, useEffect, useCallback } from 'react';

interface CoachTimerProps {
  defaultInterval: number; // minutes
}

export default function CoachTimer({ defaultInterval }: CoachTimerProps) {
  const [intervalMinutes, setIntervalMinutes] = useState(defaultInterval);
  const [secondsLeft, setSecondsLeft] = useState(defaultInterval * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [triggered, setTriggered] = useState(false);

  const totalSeconds = intervalMinutes * 60;
  const progress = secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 45;

  const handleTrigger = useCallback(() => {
    // TODO: Trigger CogniCoach review prompt via WebSocket/API
    setTriggered(true);
    setTimeout(() => {
      setTriggered(false);
      setSecondsLeft(intervalMinutes * 60);
    }, 4000);
  }, [intervalMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleTrigger();
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isRunning, intervalMinutes, handleTrigger]);

  const handleReset = () => {
    setSecondsLeft(intervalMinutes * 60);
    setTriggered(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-bold text-white">CogniCoach™</h2>
          <p className="text-xs text-gray-500">Wissensüberprüfungs-Timer</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning((v) => !v)}
            aria-label={isRunning ? 'Timer pausieren' : 'Timer starten'}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-all min-h-[36px]"
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={handleReset}
            aria-label="Timer zurücksetzen"
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-all min-h-[36px]"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative flex-shrink-0 w-28 h-28" role="timer" aria-label={`CogniCoach Timer: ${formatTime(secondsLeft)}`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={triggered ? '#3FA34D' : '#F2B705'}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {triggered ? (
              <span className="text-2xl">🎯</span>
            ) : (
              <>
                <span className="text-xl font-black text-white font-mono">{formatTime(secondsLeft)}</span>
                <span className="text-[10px] text-gray-600">verbleibend</span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3">
          {triggered && (
            <div className="p-3 rounded-xl bg-brand-green/15 border border-brand-green/30">
              <p className="text-xs font-bold text-brand-green">🎯 CogniCoach ausgelöst!</p>
              <p className="text-xs text-gray-400 mt-0.5">Stelle jetzt eine Verständnisfrage.</p>
            </div>
          )}

          <div>
            <label htmlFor="coach-interval-mini" className="block text-xs text-gray-500 mb-1">
              Intervall: <span className="text-brand-gold font-bold">{intervalMinutes} min</span>
            </label>
            <input
              id="coach-interval-mini"
              type="range"
              min={5}
              max={60}
              step={5}
              value={intervalMinutes}
              onChange={(e) => {
                const val = Number(e.target.value);
                setIntervalMinutes(val);
                setSecondsLeft(val * 60);
              }}
              className="w-full accent-brand-gold"
              aria-label={`Intervall: ${intervalMinutes} Minuten`}
            />
          </div>

          <button
            onClick={handleTrigger}
            className="w-full py-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold hover:bg-brand-gold/25 transition-all min-h-[36px]"
            aria-label="CogniCoach jetzt auslösen"
          >
            🎯 Jetzt auslösen
          </button>
        </div>
      </div>
    </div>
  );
}
