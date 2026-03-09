'use client';

import { useState, useEffect, useRef } from 'react';
import { type Caption } from '@/types/viewer';

// TODO: Replace with real captions from WebSocket (speech-to-text stream)
const MOCK_CAPTIONS: Caption[] = [
  { id: '1', text: 'Willkommen zur heutigen Vorlesung über kognitive Neurowissenschaften.', timestamp: Date.now() - 30000, isFinal: true },
  { id: '2', text: 'Wir beginnen mit einem Überblick über die Grundstrukturen des Gehirns.', timestamp: Date.now() - 25000, isFinal: true },
  { id: '3', text: 'Der präfrontale Kortex spielt eine entscheidende Rolle bei der Entscheidungsfindung und der Regulation von Emotionen.', timestamp: Date.now() - 20000, isFinal: true },
  { id: '4', text: 'Das limbische System ist für emotionale Verarbeitung und Gedächtnis zuständig.', timestamp: Date.now() - 15000, isFinal: true },
  { id: '5', text: 'Studien zeigen, dass regelmäßige kognitive Stimulation die Neuroplastizität fördert.', timestamp: Date.now() - 10000, isFinal: true },
  { id: '6', text: 'Neuroplastizität bezeichnet die Fähigkeit des Gehirns, sich durch Erfahrungen zu verändern.', timestamp: Date.now() - 5000, isFinal: true },
  { id: '7', text: 'Aktuelle Forschungen deuten darauf hin, dass...', timestamp: Date.now(), isFinal: false },
];

const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'uk', label: 'Українська' },
  { code: 'pl', label: 'Polski' },
];

interface CaptionPageProps {
  params: { sessionCode: string };
}

export default function CaptionPage({ params }: CaptionPageProps) {
  const { sessionCode } = params;
  const [captions, setCaptions] = useState<Caption[]>(MOCK_CAPTIONS);
  const [language, setLanguage] = useState('de');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [highContrast, setHighContrast] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // TODO: Connect to WebSocket for real-time captions
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [captions, autoScroll]);

  const fontSizeClasses: Record<string, string> = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-3xl leading-loose',
  };

  const handleExport = () => {
    // TODO: Export real captions from session
    const text = captions
      .filter((c) => c.isFinal)
      .map((c) => {
        const time = new Date(c.timestamp).toLocaleTimeString('de-DE');
        return `[${time}] ${c.text}`;
      })
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognicore-captions-${sessionCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'bg-black text-white' : 'bg-gray-950 text-gray-100'}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-black text-white">
            Cogni<span className="text-brand-gold">Core</span>™ <span className="text-gray-500 font-medium">Captions</span>
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-green/15 border border-brand-green/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-xs text-brand-green font-semibold">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all min-h-[44px]"
            aria-label="Captions als TXT exportieren"
          >
            ⬇ Export TXT
          </button>
        </div>
      </header>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-gray-900/50 border-b border-white/5">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="lang-select" className="text-xs text-gray-500 font-medium">Sprache:</label>
          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-purple"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium">Größe:</span>
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-2 py-1 rounded text-xs font-bold transition-all min-h-[32px] ${fontSize === size ? 'bg-brand-purple text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>

        {/* High contrast */}
        <label className="flex items-center gap-1.5 cursor-pointer">
          <button
            role="switch"
            aria-checked={highContrast}
            onClick={() => setHighContrast((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors ${highContrast ? 'bg-brand-gold' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-xs text-gray-400">Hoher Kontrast</span>
        </label>

        {/* Auto-scroll */}
        <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
          <button
            role="switch"
            aria-checked={autoScroll}
            onClick={() => setAutoScroll((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors ${autoScroll ? 'bg-brand-green' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${autoScroll ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-xs text-gray-400">Auto-Scroll</span>
        </label>
      </div>

      {/* Captions area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-4"
        aria-live="polite"
        aria-label="Live-Untertitel"
      >
        {captions.map((caption) => (
          <div
            key={caption.id}
            className={`${caption.isFinal ? 'opacity-100' : 'opacity-60'} transition-opacity`}
          >
            <p className={`text-xs text-gray-600 mb-1 font-mono`}>
              {new Date(caption.timestamp).toLocaleTimeString('de-DE')}
            </p>
            <p className={`${fontSizeClasses[fontSize]} font-semibold ${highContrast ? 'text-white' : 'text-gray-100'}`}>
              {caption.text}
            </p>
            {caption.translation && language !== 'de' && (
              <p className={`${fontSizeClasses[fontSize]} text-brand-gold mt-1`} style={{ fontSize: '85%' }}>
                {caption.translation}
              </p>
            )}
          </div>
        ))}
        {/* Live indicator */}
        <div className="flex items-center gap-2 text-gray-600 text-sm py-4">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span>Warte auf neue Captions…</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center text-xs text-gray-700 border-t border-white/5">
        CogniCore™ · Session {sessionCode} · A product by AT Medical GmbH®
      </footer>
    </div>
  );
}
