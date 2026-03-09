'use client';

import { useState } from 'react';

interface SignalPadProps {
  sessionCode: string;
  onFrageOpen: () => void;
}

type SignalKey = 'begriff' | 'pause' | 'wasser';

const SIGNAL_BUTTONS = [
  {
    key: 'begriff' as SignalKey,
    label: 'Begriff erklären',
    emoji: '🔍',
    color: '#1E3A8A',
    shadow: 'rgba(30,58,138,0.4)',
    description: 'Ich benötige eine Erklärung zu einem Begriff',
  },
  {
    key: 'pause' as SignalKey,
    label: 'Pause',
    emoji: '⏸',
    color: '#F2B705',
    shadow: 'rgba(242,183,5,0.4)',
    description: 'Ich brauche eine kurze Pause',
  },
  {
    key: 'wasser' as SignalKey,
    label: 'Wasser',
    emoji: '💧',
    color: '#6B3FA0',
    shadow: 'rgba(107,63,160,0.4)',
    description: 'Ich benötige Wasser',
  },
] as const;

export default function SignalPad({ sessionCode, onFrageOpen }: SignalPadProps) {
  const [cooldowns, setCooldowns] = useState<Record<SignalKey, boolean>>({
    begriff: false,
    pause: false,
    wasser: false,
  });
  const [sent, setSent] = useState<Record<SignalKey, boolean>>({
    begriff: false,
    pause: false,
    wasser: false,
  });

  const handleSignal = (key: SignalKey) => {
    if (cooldowns[key]) return;
    // TODO: Send signal via WebSocket to server
    setSent((prev) => ({ ...prev, [key]: true }));
    setCooldowns((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSent((prev) => ({ ...prev, [key]: false }));
      setCooldowns((prev) => ({ ...prev, [key]: false }));
    }, 8000);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <p className="text-xs text-gray-600 text-center font-medium uppercase tracking-wider">Signal senden</p>

      {/* Main signal buttons */}
      <div className="space-y-3">
        {SIGNAL_BUTTONS.map((btn) => {
          const isSent = sent[btn.key];
          const isCooldown = cooldowns[btn.key];
          return (
            <button
              key={btn.key}
              onClick={() => handleSignal(btn.key)}
              disabled={isCooldown}
              aria-label={btn.description}
              aria-pressed={isSent}
              className={`
                w-full rounded-2xl py-6 px-6 flex items-center gap-5
                font-black text-xl text-white text-left
                transition-all duration-200 touch-btn
                min-h-[88px]
                ${isCooldown ? 'opacity-60 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.01] active:scale-[0.97]'}
              `}
              style={{
                background: isSent
                  ? `linear-gradient(135deg, ${btn.color}ee, ${btn.color}aa)`
                  : `linear-gradient(135deg, ${btn.color}22, ${btn.color}11)`,
                border: `2px solid ${isSent ? btn.color : btn.color + '44'}`,
                boxShadow: isSent ? `0 8px 32px ${btn.shadow}` : 'none',
              }}
            >
              <span className="text-4xl leading-none" aria-hidden="true">
                {isSent ? '✓' : btn.emoji}
              </span>
              <span className="flex-1">
                <span className="block" style={{ color: isSent ? '#fff' : btn.color }}>
                  {isSent ? 'Gesendet!' : btn.label}
                </span>
                {isCooldown && !isSent && (
                  <span className="text-xs font-medium text-gray-500 mt-0.5 block">Bitte warte kurz…</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Frage senden – special button */}
      <button
        onClick={onFrageOpen}
        aria-label="Eine Frage stellen"
        className="
          w-full rounded-2xl py-6 px-6 flex items-center gap-5
          font-black text-xl text-white text-left
          transition-all duration-200 touch-btn min-h-[88px]
          active:scale-[0.97] hover:scale-[1.01]
        "
        style={{
          background: 'linear-gradient(135deg, #3FA34D22, #3FA34D11)',
          border: '2px solid #3FA34D44',
        }}
      >
        <span className="text-4xl leading-none" aria-hidden="true">🙋</span>
        <span>
          <span className="block text-brand-green">Frage senden</span>
          <span className="text-xs font-medium text-gray-500 mt-0.5 block">Textnachricht an Dozent</span>
        </span>
      </button>

      <p className="text-center text-xs text-gray-700 pb-2">
        Session {sessionCode} · CogniCore™ by AT Medical GmbH®
      </p>
    </div>
  );
}
