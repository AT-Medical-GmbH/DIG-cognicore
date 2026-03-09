'use client';

import { useState, type FormEvent } from 'react';
import SignalPad from '@/components/SignalPad';

interface RemotePageProps {
  params: { sessionCode: string };
}

export default function RemotePage({ params }: RemotePageProps) {
  const { sessionCode } = params;
  const [frageOpen, setFrageOpen] = useState(false);
  const [frageText, setFrageText] = useState('');
  const [frageSubmitted, setFrageSubmitted] = useState(false);
  const [activePoll, setActivePoll] = useState<{
    question: string;
    options: string[];
    voted: string | null;
  } | null>({
    // TODO: Replace with real poll from WebSocket
    question: 'Verstehst du das Konzept der Neuroplastizität?',
    options: ['Ja, klar!', 'Größtenteils', 'Nicht wirklich', 'Nein'],
    voted: null,
  });

  const handleFrageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!frageText.trim()) return;
    // TODO: Send question via WebSocket
    setFrageSubmitted(true);
    setTimeout(() => {
      setFrageOpen(false);
      setFrageSubmitted(false);
      setFrageText('');
    }, 2500);
  };

  const handlePollVote = (option: string) => {
    if (!activePoll || activePoll.voted) return;
    // TODO: Send poll vote via WebSocket
    setActivePoll((prev) => prev ? { ...prev, voted: option } : null);
  };

  return (
    <div className="flex flex-col h-screen bg-brand-black overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-white/10">
        <div>
          <p className="text-xs text-gray-500 font-medium">Remote · Session</p>
          <p className="text-lg font-black text-white tracking-widest font-mono">{sessionCode}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-white">
            Cogni<span className="text-brand-gold">Core</span>™
          </p>
          <p className="text-xs text-gray-600">A product by AT Medical GmbH®</p>
        </div>
      </header>

      {/* Main scrollable area */}
      <main className="flex-1 overflow-y-auto">
        {/* Active poll */}
        {activePoll && (
          <section className="mx-4 mt-4 p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <p className="text-xs font-bold text-brand-gold uppercase tracking-wider">Aktive Umfrage</p>
            </div>
            <p className="text-sm font-semibold text-white mb-4 leading-snug">{activePoll.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {activePoll.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handlePollVote(option)}
                  disabled={!!activePoll.voted}
                  aria-pressed={activePoll.voted === option}
                  className={`
                    py-4 px-3 rounded-xl font-bold text-sm transition-all touch-btn min-h-[56px]
                    ${activePoll.voted === option
                      ? 'bg-brand-gold text-brand-black border-2 border-brand-gold shadow-lg shadow-brand-gold/30'
                      : activePoll.voted
                        ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/15 active:scale-95'
                    }
                  `}
                >
                  {activePoll.voted === option ? '✓ ' : ''}{option}
                </button>
              ))}
            </div>
            {activePoll.voted && (
              <p className="text-center text-xs text-brand-green mt-3 font-semibold">
                ✓ Antwort gesendet: „{activePoll.voted}"
              </p>
            )}
          </section>
        )}

        {/* Signal pad */}
        <SignalPad
          sessionCode={sessionCode}
          onFrageOpen={() => setFrageOpen(true)}
        />
      </main>

      {/* Frage modal */}
      {frageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setFrageOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Frage senden"
        >
          <div className="w-full bg-gray-900 rounded-t-3xl p-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-white">🙋 Frage senden</h2>
              <button
                onClick={() => setFrageOpen(false)}
                className="text-gray-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {frageSubmitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-lg font-bold text-brand-green">Frage gesendet!</p>
                <p className="text-sm text-gray-400 mt-1">Dein Dozent sieht deine Frage.</p>
              </div>
            ) : (
              <form onSubmit={handleFrageSubmit}>
                <textarea
                  value={frageText}
                  onChange={(e) => setFrageText(e.target.value)}
                  placeholder="Deine Frage eingeben…"
                  rows={3}
                  maxLength={300}
                  autoFocus
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-base outline-none focus:border-brand-green resize-none"
                  aria-label="Frage eingeben"
                />
                <div className="flex items-center justify-between mt-1 mb-4">
                  <span className="text-xs text-gray-600">{frageText.length}/300</span>
                </div>
                <button
                  type="submit"
                  disabled={!frageText.trim()}
                  className="w-full py-4 rounded-2xl bg-brand-green text-white font-black text-lg disabled:opacity-40 transition-all shadow-lg shadow-brand-green/20 touch-btn min-h-[64px]"
                >
                  Frage senden →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
