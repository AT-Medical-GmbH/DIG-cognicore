'use client';

import { useState } from 'react';
import { type SignalType } from '@/types/viewer';

interface SignalButtonProps {
  type: SignalType;
  label: string;
  emoji: string;
  color: string;
  description: string;
  sessionCode: string;
  onSignal: (type: SignalType) => void;
}

export default function SignalButton({
  type,
  label,
  emoji,
  color,
  description,
  onSignal,
}: SignalButtonProps) {
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleClick = () => {
    if (cooldown) return;
    onSignal(type);
    setSent(true);
    setCooldown(true);
    // TODO: Send signal via WebSocket
    setTimeout(() => {
      setSent(false);
      setCooldown(false);
    }, 5000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={cooldown}
      aria-label={description}
      aria-pressed={sent}
      title={description}
      className={`
        flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl
        border transition-all duration-200 min-h-[70px] touch-manipulation
        ${sent
          ? 'border-opacity-80 scale-95 opacity-80'
          : 'border-white/10 hover:scale-105 hover:border-opacity-60 active:scale-95'
        }
        ${cooldown ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: sent ? `${color}25` : 'rgba(255,255,255,0.04)',
        borderColor: sent ? color : 'rgba(255,255,255,0.1)',
        boxShadow: sent ? `0 0 20px ${color}30` : 'none',
      }}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {sent ? '✓' : emoji}
      </span>
      <span
        className="text-xs font-bold leading-tight"
        style={{ color: sent ? color : '#9ca3af' }}
      >
        {sent ? 'Gesendet' : label}
      </span>
    </button>
  );
}
