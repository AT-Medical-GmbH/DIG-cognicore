'use client';

import { useState, useRef, type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RemoteHomePage() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const code = digits.join('');

  const handleChange = (i: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 6) {
      setDigits(clean.split(''));
      inputRefs.current[5]?.focus();
      return;
    }
    const char = clean.slice(-1);
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    setError('');
    if (char && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      const next = [...digits];
      next[i - 1] = '';
      setDigits(next);
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Bitte gib den vollständigen 6-stelligen Code ein.');
      return;
    }
    setLoading(true);
    // TODO: Validate session code against API
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-black px-5 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-3xl font-black text-white mb-1">
            Cogni<span className="text-brand-gold">Core</span>™
          </h1>
          <p className="text-gray-400 text-sm">Remote Control</p>
        </div>

        {/* Join form */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white text-center mb-5">Session-Code eingeben</h2>

          <div
            className="flex items-center justify-center gap-2 mb-5"
            role="group"
            aria-label="6-stelliger Session-Code"
          >
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
                aria-label={`Stelle ${i + 1}`}
                className={`
                  w-10 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white/5
                  text-white outline-none transition-all touch-btn
                  focus:border-brand-green focus:shadow-lg
                  ${digit ? 'border-brand-green/60' : 'border-white/15'}
                  ${error ? 'border-red-500/60' : ''}
                `}
              />
            ))}
          </div>

          {error && <p role="alert" className="text-red-400 text-xs text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-5 rounded-2xl bg-brand-green text-white font-black text-xl hover:bg-green-600 disabled:opacity-40 transition-all shadow-lg shadow-brand-green/20 touch-btn min-h-[64px]"
            aria-label="Session beitreten"
          >
            {loading ? '⏳ Verbinde…' : '▶ Beitreten'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-700 mt-8">
          A product by AT Medical GmbH® · CogniCore™
        </p>
      </div>
    </div>
  );
}
