'use client';

import { useState } from 'react';

type SignalType = 'begriff' | 'pause' | 'wasser' | 'frage';

interface IncomingSignal {
  id: string;
  type: SignalType;
  participantId: string;
  timestamp: Date;
  message?: string;
  dismissed: boolean;
  answered: boolean;
}

const SIGNAL_CONFIG: Record<SignalType, { label: string; emoji: string; color: string }> = {
  begriff: { label: 'Begriff erklären', emoji: '🔍', color: '#1E3A8A' },
  pause: { label: 'Pause', emoji: '⏸', color: '#F2B705' },
  wasser: { label: 'Wasser', emoji: '💧', color: '#6B3FA0' },
  frage: { label: 'Frage', emoji: '🙋', color: '#3FA34D' },
};

// TODO: Replace with real signals from WebSocket
const MOCK_SIGNALS: IncomingSignal[] = [
  { id: '1', type: 'frage', participantId: 'P-042', timestamp: new Date(Date.now() - 120000), message: 'Was ist der Unterschied zwischen deklarativem und prozeduralem Gedächtnis?', dismissed: false, answered: false },
  { id: '2', type: 'begriff', participantId: 'P-017', timestamp: new Date(Date.now() - 240000), message: undefined, dismissed: false, answered: false },
  { id: '3', type: 'frage', participantId: 'P-031', timestamp: new Date(Date.now() - 360000), message: 'Können Erwachsene noch neue Neuronen bilden?', dismissed: false, answered: false },
  { id: '4', type: 'pause', participantId: 'P-008', timestamp: new Date(Date.now() - 480000), message: undefined, dismissed: true, answered: false },
  { id: '5', type: 'wasser', participantId: 'P-025', timestamp: new Date(Date.now() - 600000), message: undefined, dismissed: true, answered: false },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function SignalFeed() {
  const [signals, setSignals] = useState<IncomingSignal[]>(MOCK_SIGNALS);
  const [filter, setFilter] = useState<SignalType | 'all'>('all');

  const counts = signals.reduce((acc, s) => {
    if (!s.dismissed) acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<SignalType, number>);

  const filtered = signals.filter((s) => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  const dismiss = (id: string) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, dismissed: true } : s));
    // TODO: Send dismiss signal to API/WebSocket
  };

  const markAnswered = (id: string) => {
    setSignals((prev) => prev.map((s) => s.id === id ? { ...s, answered: true, dismissed: true } : s));
    // TODO: Send answered signal to API/WebSocket
  };

  const clearAll = () => {
    setSignals((prev) => prev.map((s) => ({ ...s, dismissed: true })));
  };

  return (
    <div className="space-y-5">
      {/* Summary counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(SIGNAL_CONFIG) as SignalType[]).map((key) => {
          const cfg = SIGNAL_CONFIG[key];
          const count = counts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'all' : key)}
              aria-pressed={filter === key}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left min-h-[56px]
                ${filter === key
                  ? 'border-opacity-60 shadow-lg'
                  : 'border-white/10 bg-white/4 hover:bg-white/8'
                }
              `}
              style={{
                background: filter === key ? `${cfg.color}20` : undefined,
                borderColor: filter === key ? `${cfg.color}50` : undefined,
              }}
            >
              <span className="text-2xl">{cfg.emoji}</span>
              <div>
                <p className="text-xl font-black text-white">{count}</p>
                <p className="text-xs text-gray-500 font-medium">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feed header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          {filter === 'all' ? 'Alle Signale' : SIGNAL_CONFIG[filter].label}
          {' '}
          <span className="text-gray-600 font-normal">
            ({filtered.filter((s) => !s.dismissed).length} offen)
          </span>
        </h2>
        <button
          onClick={clearAll}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-medium"
          aria-label="Alle Signale als erledigt markieren"
        >
          Alle erledigen
        </button>
      </div>

      {/* Signal list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-medium">Keine Signale vorhanden</p>
          </div>
        )}

        {filtered.map((signal) => {
          const cfg = SIGNAL_CONFIG[signal.type];
          return (
            <div
              key={signal.id}
              className={`
                glass-card rounded-2xl p-5 border transition-all
                ${signal.dismissed ? 'opacity-40 border-white/4' : 'border-white/10'}
              `}
              style={!signal.dismissed ? { borderLeftColor: cfg.color, borderLeftWidth: '3px' } : undefined}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{cfg.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${cfg.color}20`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-600">{signal.participantId}</span>
                      <span className="text-xs text-gray-700">{formatTime(signal.timestamp)}</span>
                      {signal.answered && (
                        <span className="text-xs text-brand-green font-bold">✓ Beantwortet</span>
                      )}
                    </div>
                    {signal.message && (
                      <p className="text-sm text-gray-200 leading-snug">{signal.message}</p>
                    )}
                  </div>
                </div>

                {!signal.dismissed && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {signal.type === 'frage' && (
                      <button
                        onClick={() => markAnswered(signal.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs font-semibold hover:bg-brand-green/25 transition-all min-h-[36px]"
                        aria-label="Frage als beantwortet markieren"
                      >
                        ✓ Beantwortet
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(signal.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/10 transition-all min-h-[36px]"
                      aria-label="Signal verwerfen"
                    >
                      Erledigt
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
