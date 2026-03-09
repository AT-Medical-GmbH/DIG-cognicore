'use client';

import { useState, useCallback } from 'react';
import TopBar from '@/components/TopBar';
import BottomBar from '@/components/BottomBar';
import CaptionOverlay from '@/components/CaptionOverlay';
import { type Session, type Caption, type SignalType, type ViewerSettings } from '@/types/viewer';

// TODO: Replace with real session data from API/WebSocket
const MOCK_SESSION: Session = {
  code: '123456',
  title: 'Einführung in die Neurologie',
  teacherName: 'Dr. Anna Müller',
  presentationUrl: '', // TODO: Set from session API
  participantCount: 47,
  captionsEnabled: true,
  pollsEnabled: true,
  signalsEnabled: true,
  status: 'active',
};

// TODO: Replace with real captions from WebSocket (speech-to-text stream)
const MOCK_CAPTIONS: Caption[] = [
  {
    id: '1',
    text: 'Willkommen zur heutigen Vorlesung über kognitive Neurowissenschaften.',
    timestamp: Date.now() - 5000,
    isFinal: true,
  },
  {
    id: '2',
    text: 'Wir beginnen mit einem Überblick über die Grundstrukturen des Gehirns.',
    timestamp: Date.now() - 2000,
    isFinal: true,
  },
  {
    id: '3',
    text: 'Der präfrontale Kortex ist besonders wichtig für...',
    timestamp: Date.now(),
    isFinal: false,
  },
];

interface ViewerPageProps {
  params: { sessionCode: string };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { sessionCode } = params;
  const session = { ...MOCK_SESSION, code: sessionCode };

  const [settings, setSettings] = useState<ViewerSettings>({
    captionsVisible: true,
    captionFontSize: 'md',
    highContrast: false,
    signalButtonsVisible: true,
    beamerMode: false,
    translationLanguage: 'de',
  });
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [sentSignals, setSentSignals] = useState<string[]>([]);

  const handleSignal = useCallback((type: SignalType) => {
    // TODO: Send signal via WebSocket to server
    setSentSignals((prev) => [...prev, type]);
  }, []);

  const toggleSetting = <K extends keyof ViewerSettings>(key: K) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const presentationUrl = session.presentationUrl;

  return (
    <div
      className="flex flex-col h-screen bg-gray-950 overflow-hidden"
      data-beamer-mode={settings.beamerMode}
    >
      {/* Top bar */}
      <TopBar
        session={session}
        onSettingsToggle={() => setSettingsPanelOpen((v) => !v)}
        onCaptionsToggle={() => toggleSetting('captionsVisible')}
        captionsVisible={settings.captionsVisible}
      />

      {/* Main presentation area */}
      <main className="relative flex-1 overflow-hidden bg-black">
        {presentationUrl ? (
          <iframe
            src={presentationUrl}
            className="w-full h-full border-0"
            title="Präsentation"
            allow="fullscreen"
            aria-label="Präsentations-Embed"
          />
        ) : (
          // Placeholder when no presentation URL is set
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600">Warte auf Präsentation…</p>
              <p className="text-sm text-gray-700 mt-1">
                {/* TODO: Show presentation URL once teacher sets it */}
                Der Dozent hat noch keine Präsentation gestartet.
              </p>
            </div>
            <div className="mt-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-gray-600 mb-1">Session-Code</p>
              <p className="text-3xl font-black text-white tracking-widest font-mono">{sessionCode}</p>
            </div>
          </div>
        )}

        {/* Caption overlay */}
        {settings.captionsVisible && session.captionsEnabled && (
          <CaptionOverlay
            captions={MOCK_CAPTIONS}
            fontSize={settings.captionFontSize}
            highContrast={settings.highContrast}
            translationLanguage={settings.translationLanguage}
          />
        )}
      </main>

      {/* Bottom signal bar */}
      <BottomBar
        sessionCode={sessionCode}
        visible={settings.signalButtonsVisible && session.signalsEnabled}
        onSignal={handleSignal}
      />

      {/* Settings panel (slide-in from right) */}
      {settingsPanelOpen && (
        <aside
          className="fixed inset-y-0 right-0 w-80 bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
          aria-label="Einstellungen"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-bold text-white text-lg">Einstellungen</h2>
            <button
              onClick={() => setSettingsPanelOpen(false)}
              aria-label="Einstellungen schließen"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Caption settings */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Captions</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-300">Captions anzeigen</span>
                  <button
                    role="switch"
                    aria-checked={settings.captionsVisible}
                    onClick={() => toggleSetting('captionsVisible')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.captionsVisible ? 'bg-brand-purple' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.captionsVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </label>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Schriftgröße</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings((prev) => ({ ...prev, captionFontSize: size }))}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${settings.captionFontSize === size ? 'bg-brand-purple text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-300">Hoher Kontrast</span>
                  <button
                    role="switch"
                    aria-checked={settings.highContrast}
                    onClick={() => toggleSetting('highContrast')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.highContrast ? 'bg-brand-gold' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </label>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Übersetzungssprache</p>
                  <select
                    value={settings.translationLanguage}
                    onChange={(e) => setSettings((prev) => ({ ...prev, translationLanguage: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                    aria-label="Übersetzungssprache wählen"
                  >
                    <option value="de">Deutsch (Original)</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="ar">العربية</option>
                    <option value="tr">Türkçe</option>
                    <option value="uk">Українська</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Signal settings */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Signale</h3>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Signal-Buttons anzeigen</span>
                <button
                  role="switch"
                  aria-checked={settings.signalButtonsVisible}
                  onClick={() => toggleSetting('signalButtonsVisible')}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.signalButtonsVisible ? 'bg-brand-blue' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.signalButtonsVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            </section>

            {/* Display settings */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Anzeige</h3>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Beamer-Modus</span>
                <button
                  role="switch"
                  aria-checked={settings.beamerMode}
                  onClick={() => toggleSetting('beamerMode')}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.beamerMode ? 'bg-brand-green' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.beamerMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            </section>

            {/* Caption link */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Companion-Modus</h3>
              <a
                href={`/${sessionCode}/caption`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-brand-purple/15 border border-brand-purple/30 text-brand-purple text-sm font-semibold hover:bg-brand-purple/25 transition-all"
              >
                <span>📝</span>
                Caption-Ansicht öffnen
                <span className="ml-auto text-xs opacity-60">↗</span>
              </a>
              <p className="text-xs text-gray-600 mt-2">
                Öffnet die Caption-Only Ansicht auf einem zweiten Gerät oder in einem neuen Tab.
              </p>
            </section>
          </div>
        </aside>
      )}

      {/* Overlay backdrop for settings panel */}
      {settingsPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSettingsPanelOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
