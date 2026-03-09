'use client';

import Sidebar from '@/components/Sidebar';
import SessionCard from '@/components/SessionCard';
import CoachTimer from '@/components/CoachTimer';

// TODO: Replace with real session data from API/WebSocket
const MOCK_SESSION = {
  code: '847291',
  title: 'Einführung in die Neurologie – Modul 3',
  teacherName: 'Dr. Anna Müller',
  participantCount: 47,
  status: 'active' as const,
  startedAt: new Date(Date.now() - 34 * 60 * 1000),
  captionsEnabled: true,
  pollsEnabled: true,
  signalsEnabled: true,
  recordingEnabled: false,
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeRoute="/dashboard" />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
          <div>
            <h1 className="text-xl font-black text-white">Dashboard</h1>
            <p className="text-xs text-gray-500">Übersicht deiner aktuellen Session</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/15 border border-brand-green/30">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-bold text-brand-green">Session aktiv</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-blue/30 border border-brand-blue/50 flex items-center justify-center text-sm font-bold text-white">
              AM
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Session card */}
          <SessionCard session={MOCK_SESSION} />

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Teilnehmer', value: '47', icon: '👥', color: '#1E3A8A' },
              { label: 'Signale heute', value: '12', icon: '📡', color: '#6B3FA0' },
              { label: 'Polls aktiv', value: '0', icon: '📊', color: '#3FA34D' },
              { label: 'Offene Fragen', value: '3', icon: '❓', color: '#F2B705' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-5 border border-white/8"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: stat.color }}
                  />
                </div>
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CoachTimer and recent signals in grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CogniCoach timer */}
            <CoachTimer defaultInterval={20} />

            {/* Quick actions */}
            <div className="glass-card rounded-2xl p-6 border border-white/8">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a
                  href="/dashboard/polls"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20 hover:bg-brand-blue/20 transition-all text-sm font-semibold text-white min-h-[44px]"
                >
                  <span>📊</span>
                  Neue Umfrage erstellen
                </a>
                <a
                  href="/dashboard/signals"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 transition-all text-sm font-semibold text-white min-h-[44px]"
                >
                  <span>🔔</span>
                  Signale ansehen (3 neu)
                </a>
                <button
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all text-sm font-semibold text-gray-300 min-h-[44px]"
                  aria-label="QR-Code anzeigen"
                >
                  <span>📱</span>
                  QR-Code anzeigen
                </button>
              </div>
            </div>
          </div>

          {/* Session QR code + links */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Teilnehmer-Zugänge</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* QR placeholder */}
              <div className="flex-shrink-0 w-40 h-40 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span className="text-xs">QR-Code</span>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { label: 'Viewer (Teilnehmer)', url: `cognicore.app/viewer/${MOCK_SESSION.code}`, color: '#1E3A8A' },
                  { label: 'Remote (Smartphone)', url: `cognicore.app/remote/${MOCK_SESSION.code}`, color: '#3FA34D' },
                  { label: 'Captions (Companion)', url: `cognicore.app/viewer/${MOCK_SESSION.code}/caption`, color: '#6B3FA0' },
                ].map((link) => (
                  <div key={link.label} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">{link.label}</p>
                      <p className="text-sm text-white font-mono">{link.url}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(link.url)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white border transition-all hover:opacity-80 min-h-[36px]"
                      style={{ borderColor: `${link.color}50`, background: `${link.color}20` }}
                      aria-label={`${link.label} Link kopieren`}
                    >
                      Kopieren
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-white/5 text-center">
          <p className="text-xs text-gray-700">
            CogniCore™ · A product by AT Medical GmbH® · © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
