'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import PollCreator from '@/components/PollCreator';

type PollType = 'ja_nein' | 'mc' | 'abcd' | 'freitext' | 'numerisch';

interface PollResult {
  id: string;
  question: string;
  type: PollType;
  isActive: boolean;
  totalVotes: number;
  results: Record<string, number>;
  createdAt: Date;
}

// TODO: Replace with real poll data from API/WebSocket
const MOCK_POLL_HISTORY: PollResult[] = [
  {
    id: '1',
    question: 'Habt ihr das Konzept der Neuroplastizität verstanden?',
    type: 'ja_nein',
    isActive: false,
    totalVotes: 43,
    results: { Ja: 35, Nein: 8 },
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    question: 'Welche Gehirnregion ist für das episodische Gedächtnis zuständig?',
    type: 'abcd',
    isActive: false,
    totalVotes: 41,
    results: { 'A: Hippocampus': 28, 'B: Amygdala': 7, 'C: Cerebellum': 4, 'D: Thalamus': 2 },
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
];

const ACTIVE_MOCK_POLL: PollResult = {
  id: '3',
  question: 'Wie bewerte ich mein Verständnis nach dieser Einheit?',
  type: 'abcd',
  isActive: true,
  totalVotes: 31,
  results: { 'A: Sehr gut': 12, 'B: Gut': 14, 'C: Mittelmäßig': 4, 'D: Schlecht': 1 },
  createdAt: new Date(),
};

const POLL_TYPE_COLORS: Record<PollType, string> = {
  ja_nein: '#3FA34D',
  mc: '#1E3A8A',
  abcd: '#6B3FA0',
  freitext: '#F2B705',
  numerisch: '#64748b',
};

const POLL_TYPE_LABELS: Record<PollType, string> = {
  ja_nein: 'Ja / Nein',
  mc: 'Multiple Choice',
  abcd: 'ABCD',
  freitext: 'Freitext',
  numerisch: 'Numerisch',
};

function ResultBar({ label, votes, total, color }: { label: string; votes: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-gray-300 font-medium truncate max-w-[70%]">{label}</span>
        <span className="text-white font-bold ml-2">{pct}% <span className="text-gray-500 text-xs">({votes})</span></span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function PollsPage() {
  const [activePoll, setActivePoll] = useState<PollResult | null>(ACTIVE_MOCK_POLL);
  const [history] = useState<PollResult[]>(MOCK_POLL_HISTORY);

  const handleStopPoll = () => {
    // TODO: Stop poll via API
    setActivePoll(null);
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeRoute="/dashboard/polls" />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
          <h1 className="text-xl font-black text-white">Umfragen</h1>
          <p className="text-xs text-gray-500">Polls erstellen, starten und Ergebnisse analysieren</p>
        </header>

        <div className="p-6 space-y-6">
          {/* Active poll */}
          {activePoll && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Aktive Umfrage
                </h2>
                <button
                  onClick={handleStopPoll}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all min-h-[36px]"
                  aria-label="Umfrage beenden"
                >
                  ■ Beenden
                </button>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-brand-green/20">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: `${POLL_TYPE_COLORS[activePoll.type]}20`,
                      color: POLL_TYPE_COLORS[activePoll.type],
                      border: `1px solid ${POLL_TYPE_COLORS[activePoll.type]}40`,
                    }}
                  >
                    {POLL_TYPE_LABELS[activePoll.type]}
                  </span>
                  <span className="text-xs text-gray-500">{activePoll.totalVotes} Stimmen</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-5">{activePoll.question}</h3>
                <div className="space-y-1">
                  {Object.entries(activePoll.results).map(([label, votes]) => (
                    <ResultBar
                      key={label}
                      label={label}
                      votes={votes}
                      total={activePoll.totalVotes}
                      color={POLL_TYPE_COLORS[activePoll.type]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Create new poll */}
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Neue Umfrage erstellen</h2>
            <PollCreator
              onStart={(poll) => {
                // TODO: Send poll to API/WebSocket
                setActivePoll({ ...poll, id: Date.now().toString(), isActive: true, totalVotes: 0, results: {}, createdAt: new Date() });
              }}
            />
          </section>

          {/* Poll history */}
          <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Verlauf</h2>
            <div className="space-y-3">
              {history.map((poll) => (
                <div key={poll.id} className="glass-card rounded-2xl p-5 border border-white/8">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            background: `${POLL_TYPE_COLORS[poll.type]}15`,
                            color: POLL_TYPE_COLORS[poll.type],
                          }}
                        >
                          {POLL_TYPE_LABELS[poll.type]}
                        </span>
                        <span className="text-xs text-gray-600">
                          {poll.createdAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{poll.question}</h3>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{poll.totalVotes} Stimmen</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(poll.results).map(([label, votes]) => (
                      <ResultBar
                        key={label}
                        label={label}
                        votes={votes}
                        total={poll.totalVotes}
                        color={POLL_TYPE_COLORS[poll.type]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
