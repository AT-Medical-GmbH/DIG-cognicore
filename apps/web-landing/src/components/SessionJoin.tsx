'use client';

import { useState, useRef, type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionJoin() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const sessionCode = digits.join('');

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const clean = value.replace(/\D/g, '');
    if (!clean && value) return;

    // Handle paste of full code
    if (clean.length === 6) {
      const newDigits = clean.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      return;
    }

    const char = clean.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sessionCode.length !== 6) {
      setError('Bitte gib den vollständigen 6-stelligen Code ein.');
      return;
    }
    setLoading(true);
    // TODO: Validate session code against API before redirect
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/viewer/${sessionCode}`);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 md:p-10 border border-white/10">
      {/* QR Placeholder */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-40 h-40 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="text-xs text-gray-600">QR-Code scannen</span>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mb-6 font-medium">— oder Code eingeben —</div>

      {/* 6-digit input */}
      <div className="flex items-center justify-center gap-3 mb-6" role="group" aria-label="6-stelliger Session-Code">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={6}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
            aria-label={`Stelle ${i + 1} des Session-Codes`}
            className={`
              w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white/5
              text-white caret-brand-gold outline-none transition-all
              focus:border-brand-blue focus:bg-white/8 focus:shadow-lg focus:shadow-brand-blue/20
              ${digit ? 'border-brand-blue/60' : 'border-white/15'}
              ${error ? 'border-red-500/60' : ''}
            `}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || sessionCode.length !== 6}
        className="
          w-full py-4 text-lg font-bold rounded-xl bg-brand-blue text-white
          hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
          transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40
          hover:scale-[1.02] active:scale-[0.98]
          min-h-[44px]
        "
        aria-label="Session beitreten"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verbinde…
          </span>
        ) : (
          'Beitreten →'
        )}
      </button>

      <p className="text-center text-xs text-gray-600 mt-4">
        Den Code bekommst du von deinem Dozenten oder auf dem Beamer angezeigt.
      </p>
    </form>
  );
}
