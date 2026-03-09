'use client';

import { useState, type FormEvent } from 'react';
import Sidebar from '@/components/Sidebar';

interface SessionSettings {
  presentationUrl: string;
  pollsEnabled: boolean;
  questionsEnabled: boolean;
  captionsEnabled: boolean;
  recordingEnabled: boolean;
  coachIntervalMinutes: number;
  eventTitle: string;
  teacherName: string;
  eventOrg: string;
}

const DEFAULT_SETTINGS: SessionSettings = {
  presentationUrl: '',
  pollsEnabled: true,
  questionsEnabled: true,
  captionsEnabled: true,
  recordingEnabled: false,
  coachIntervalMinutes: 20,
  eventTitle: 'Einführung in die Neurologie – Modul 3',
  teacherName: 'Dr. Anna Müller',
  eventOrg: 'Medizinische Hochschule Hamburg',
};

function Toggle({ checked, onChange, label, id }: { checked: boolean; onChange: () => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-1">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-blue' : 'bg-gray-700'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof SessionSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Save settings to API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeRoute="/dashboard/settings" />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
          <h1 className="text-xl font-black text-white">Session-Einstellungen</h1>
          <p className="text-xs text-gray-500">Präsentation, Features und Branding konfigurieren</p>
        </header>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-w-2xl">
          {/* Presentation URL */}
          <section className="glass-card rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Präsentation</h2>
            <div>
              <label htmlFor="pres-url" className="block text-sm font-semibold text-gray-300 mb-2">
                Präsentations-URL
              </label>
              <input
                id="pres-url"
                type="url"
                value={settings.presentationUrl}
                onChange={(e) => setSettings((prev) => ({ ...prev, presentationUrl: e.target.value }))}
                placeholder="https://gamma.app/... oder https://slides.google.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
              <p className="text-xs text-gray-600 mt-1.5">
                {/* TODO: Support Gamma, Google Slides, PowerPoint Online, custom iframe URLs */}
                Unterstützt: Gamma, Google Slides, PowerPoint Online, beliebige embed-fähige URLs
              </p>
            </div>
          </section>

          {/* Feature toggles */}
          <section className="glass-card rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Features</h2>
            <div className="space-y-2 divide-y divide-white/5">
              <Toggle id="polls" checked={settings.pollsEnabled} onChange={() => toggle('pollsEnabled')} label="Live-Polls aktivieren" />
              <div className="pt-2">
                <Toggle id="questions" checked={settings.questionsEnabled} onChange={() => toggle('questionsEnabled')} label="Fragen von Teilnehmern erlauben" />
              </div>
              <div className="pt-2">
                <Toggle id="captions" checked={settings.captionsEnabled} onChange={() => toggle('captionsEnabled')} label="Live-Captions aktivieren" />
              </div>
              <div className="pt-2">
                <Toggle id="recording" checked={settings.recordingEnabled} onChange={() => toggle('recordingEnabled')} label="Session aufzeichnen" />
              </div>
            </div>
          </section>

          {/* CogniCoach interval */}
          <section className="glass-card rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">CogniCoach™</h2>
            <p className="text-xs text-gray-600 mb-4">
              Automatische Erinnerungen für Wissensüberprüfung in festgelegten Intervallen.
            </p>
            <div>
              <label htmlFor="coach-interval" className="block text-sm font-semibold text-gray-300 mb-2">
                Erinnerungsintervall: <span className="text-brand-gold">{settings.coachIntervalMinutes} Minuten</span>
              </label>
              <input
                id="coach-interval"
                type="range"
                min={5}
                max={60}
                step={5}
                value={settings.coachIntervalMinutes}
                onChange={(e) => setSettings((prev) => ({ ...prev, coachIntervalMinutes: Number(e.target.value) }))}
                className="w-full accent-brand-gold h-2 rounded-full"
                aria-label={`Intervall: ${settings.coachIntervalMinutes} Minuten`}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
          </section>

          {/* Branding / Event info */}
          <section className="glass-card rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Veranstaltungsinfo</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="event-title" className="block text-sm font-semibold text-gray-300 mb-2">Veranstaltungstitel</label>
                <input
                  id="event-title"
                  type="text"
                  value={settings.eventTitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, eventTitle: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div>
                <label htmlFor="teacher-name" className="block text-sm font-semibold text-gray-300 mb-2">Dozent / Referent</label>
                <input
                  id="teacher-name"
                  type="text"
                  value={settings.teacherName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, teacherName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
              <div>
                <label htmlFor="event-org" className="block text-sm font-semibold text-gray-300 mb-2">Organisation / Institution</label>
                <input
                  id="event-org"
                  type="text"
                  value={settings.eventOrg}
                  onChange={(e) => setSettings((prev) => ({ ...prev, eventOrg: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-brand-blue text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/20 min-h-[44px]"
            >
              {saved ? '✓ Gespeichert' : 'Einstellungen speichern'}
            </button>
            {saved && <p className="text-brand-green text-sm font-semibold">Änderungen wurden übernommen.</p>}
          </div>
        </form>

        <footer className="px-6 py-4 border-t border-white/5 text-center">
          <p className="text-xs text-gray-700">CogniCore™ · A product by AT Medical GmbH® · © {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}
