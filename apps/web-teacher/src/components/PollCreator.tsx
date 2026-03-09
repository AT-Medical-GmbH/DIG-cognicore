'use client';

import { useState, type FormEvent } from 'react';

type PollType = 'ja_nein' | 'mc' | 'abcd' | 'freitext' | 'numerisch';

interface PollDraft {
  question: string;
  type: PollType;
  options: string[];
}

interface PollCreatorProps {
  onStart: (poll: PollDraft) => void;
}

const POLL_TYPES: { key: PollType; label: string; icon: string; description: string }[] = [
  { key: 'ja_nein', label: 'Ja / Nein', icon: '✅', description: 'Einfache Zustimmungsabfrage' },
  { key: 'abcd', label: 'ABCD', icon: '🔡', description: 'Vier Antwortoptionen' },
  { key: 'mc', label: 'Multiple Choice', icon: '☑️', description: 'Mehrere auswählbar' },
  { key: 'freitext', label: 'Freitext', icon: '✏️', description: 'Freitext-Eingabe' },
  { key: 'numerisch', label: 'Numerisch', icon: '🔢', description: 'Zahleneingabe' },
];

const DEFAULT_OPTIONS: Record<PollType, string[]> = {
  ja_nein: ['Ja', 'Nein'],
  abcd: ['A: ', 'B: ', 'C: ', 'D: '],
  mc: ['Option 1', 'Option 2', 'Option 3'],
  freitext: [],
  numerisch: [],
};

export default function PollCreator({ onStart }: PollCreatorProps) {
  const [type, setType] = useState<PollType>('abcd');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS['abcd']);

  const handleTypeChange = (newType: PollType) => {
    setType(newType);
    setOptions(DEFAULT_OPTIONS[newType]);
  };

  const handleOptionChange = (i: number, value: string) => {
    const next = [...options];
    next[i] = value;
    setOptions(next);
  };

  const handleAddOption = () => {
    if (options.length < 8) setOptions([...options, '']);
  };

  const handleRemoveOption = (i: number) => {
    if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onStart({ question: question.trim(), type, options: options.filter((o) => o.trim()) });
    setQuestion('');
    setOptions(DEFAULT_OPTIONS[type]);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-white/8">
      {/* Poll type selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Umfrage-Typ</p>
        <div className="flex flex-wrap gap-2">
          {POLL_TYPES.map((pt) => (
            <button
              key={pt.key}
              type="button"
              onClick={() => handleTypeChange(pt.key)}
              aria-pressed={type === pt.key}
              title={pt.description}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px]
                ${type === pt.key
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span>{pt.icon}</span>
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question input */}
      <div className="mb-5">
        <label htmlFor="poll-question" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Frage
        </label>
        <input
          id="poll-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Was ist die Hauptfunktion des Hippocampus?"
          required
          maxLength={280}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-purple transition-colors"
        />
      </div>

      {/* Options (for mc/abcd/ja_nein) */}
      {['mc', 'abcd', 'ja_nein'].includes(type) && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Antwortoptionen</p>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs text-gray-600 font-bold flex-shrink-0">
                  {type === 'abcd' ? String.fromCharCode(65 + i) : i + 1}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                  aria-label={`Option ${i + 1}`}
                />
                {type === 'mc' && options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label={`Option ${i + 1} entfernen`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {type === 'mc' && options.length < 8 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 text-sm text-brand-purple hover:text-purple-400 font-semibold transition-colors"
            >
              + Option hinzufügen
            </button>
          )}
        </div>
      )}

      {/* Freitext/Numerisch hint */}
      {(type === 'freitext' || type === 'numerisch') && (
        <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-500">
            {type === 'freitext'
              ? 'Teilnehmer können einen beliebigen Text als Antwort eingeben.'
              : 'Teilnehmer geben eine Zahl als Antwort ein (z.B. 1–10 Skala).'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!question.trim()}
        className="w-full py-3.5 rounded-xl bg-brand-purple text-white font-bold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-purple/20 min-h-[44px]"
      >
        🚀 Umfrage starten
      </button>
    </form>
  );
}
