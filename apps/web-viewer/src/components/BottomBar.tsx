'use client';

import SignalButton from './SignalButton';
import { type SignalType } from '@/types/viewer';

interface BottomBarProps {
  sessionCode: string;
  visible: boolean;
  onSignal: (type: SignalType) => void;
}

const SIGNALS: { type: SignalType; label: string; emoji: string; color: string; description: string }[] = [
  {
    type: 'begriff',
    label: 'Begriff',
    emoji: '🔍',
    color: '#1E3A8A',
    description: 'Ich brauche eine Erklärung',
  },
  {
    type: 'pause',
    label: 'Pause',
    emoji: '⏸',
    color: '#F2B705',
    description: 'Ich brauche eine kurze Pause',
  },
  {
    type: 'wasser',
    label: 'Wasser',
    emoji: '💧',
    color: '#6B3FA0',
    description: 'Ich brauche Wasser',
  },
  {
    type: 'frage',
    label: 'Frage',
    emoji: '🙋',
    color: '#3FA34D',
    description: 'Ich habe eine Frage',
  },
];

export default function BottomBar({ sessionCode, visible, onSignal }: BottomBarProps) {
  if (!visible) return null;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-sm border-t border-white/10 px-4 py-3"
      aria-label="Audience-Signale"
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-gray-600 text-center mb-2 font-medium">Signal senden</p>
        <div className="grid grid-cols-4 gap-3">
          {SIGNALS.map((signal) => (
            <SignalButton
              key={signal.type}
              type={signal.type}
              label={signal.label}
              emoji={signal.emoji}
              color={signal.color}
              description={signal.description}
              sessionCode={sessionCode}
              onSignal={onSignal}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
