'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLoginPage() {
  const [password, setPassword] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Bitte gib dein Passwort ein.');
      return;
    }
    setLoading(true);
    setError('');
    // TODO: Authenticate teacher against API, validate session code
    await new Promise((r) => setTimeout(r, 800));
    if (password === 'demo') {
      router.push('/dashboard');
    } else {
      setError('Falsches Passwort. Bitte versuche es erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-brand-blue/10 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-purple/10 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/20 border border-brand-blue/40 text-3xl mb-5">
            🎓
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Cogni<span className="text-brand-gold">Core</span>™
          </h1>
          <p className="text-gray-500 text-sm">Dozenten-Login</p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 border border-white/10"
          aria-label="Dozenten-Anmeldung"
        >
          <div className="space-y-5">
            {/* Session code */}
            <div>
              <label htmlFor="session-code" className="block text-sm font-semibold text-gray-300 mb-2">
                Session-Code <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="session-code"
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase().replace(/\D/g, '').slice(0, 6))}
                placeholder="z.B. 123456"
                inputMode="numeric"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-lg font-mono tracking-widest focus:outline-none focus:border-brand-blue transition-colors"
              />
              <p className="text-xs text-gray-600 mt-1.5">Leer lassen, um eine neue Session zu erstellen</p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dein Dozenten-Passwort"
                required
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-4 rounded-xl bg-brand-blue text-white font-bold text-base hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 min-h-[44px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Anmelden…
              </span>
            ) : (
              'Anmelden & Dashboard öffnen →'
            )}
          </button>

          <p className="text-center text-xs text-gray-600 mt-4">
            Demo: Passwort <code className="bg-white/5 px-1.5 py-0.5 rounded text-gray-400">demo</code>
          </p>
        </form>

        <p className="text-center text-xs text-gray-700 mt-8">
          A product by AT Medical GmbH® · CogniCore™ © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
