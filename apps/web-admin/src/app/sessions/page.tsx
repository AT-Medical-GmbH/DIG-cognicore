import Link from 'next/link';

// TODO: Replace with real data from Admin API
const ALL_SESSIONS = [
  { code: '847291', title: 'Neurologie Modul 3', teacher: 'Dr. Anna Müller', participants: 47, status: 'active', date: 'Heute, 09:15', duration: '1h 23min' },
  { code: '391042', title: 'Pharmakologie Einführung', teacher: 'Prof. Klein', participants: 31, status: 'active', date: 'Heute, 09:45', duration: '53min' },
  { code: '582736', title: 'Anatomie – Herz & Kreislauf', teacher: 'Dr. Berger', participants: 23, status: 'active', date: 'Heute, 10:00', duration: '38min' },
  { code: '129384', title: 'Klinische Pharmakologie', teacher: 'Dr. Meier', participants: 55, status: 'ended', date: 'Heute, 08:00', duration: '1h 45min' },
  { code: '874561', title: 'Grundlagen der Psychiatrie', teacher: 'Prof. Schmidt', participants: 62, status: 'ended', date: 'Gestern, 14:00', duration: '2h 10min' },
  { code: '203948', title: 'Notfallmedizin Crashkurs', teacher: 'Dr. Wagner', participants: 38, status: 'ended', date: 'Gestern, 10:30', duration: '1h 30min' },
];

const STATUS_CONFIG = {
  active: { label: 'Aktiv', color: '#3FA34D', bg: 'rgba(63,163,77,0.15)', border: 'rgba(63,163,77,0.3)' },
  paused: { label: 'Pausiert', color: '#F2B705', bg: 'rgba(242,183,5,0.15)', border: 'rgba(242,183,5,0.3)' },
  ended: { label: 'Beendet', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.2)' },
};

function AdminShell({ children, activeNav }: { children: React.ReactNode; activeNav: string }) {
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/sessions', label: 'Sessions', icon: '📡' },
    { href: '/events', label: 'Events', icon: '🗓' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <aside className="w-60 flex-shrink-0 bg-gray-900 border-r border-white/5 flex flex-col">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="text-xl font-black text-white">
            Cogni<span className="text-brand-gold">Core</span>™
          </div>
          <p className="text-xs text-gray-600 mt-0.5">CogniCoordinator Admin</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px]
                ${activeNav === item.href ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
              aria-current={activeNav === item.href ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-gray-600">A product by AT Medical GmbH®</p>
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} CogniCore™</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <AdminShell activeNav="/sessions">
      <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
        <h1 className="text-xl font-black text-white">Session-Verwaltung</h1>
        <p className="text-xs text-gray-500">Alle Sessions einsehen und verwalten</p>
      </header>

      <div className="p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {['Alle', 'Aktiv', 'Beendet'].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px] ${
                f === 'Alle' ? 'bg-brand-blue text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
              aria-pressed={f === 'Alle'}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto">
            {/* TODO: Implement search */}
            <input
              type="search"
              placeholder="Session suchen…"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue w-56"
              aria-label="Session suchen"
            />
          </div>
        </div>

        {/* Sessions table */}
        <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Session-Liste">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Veranstaltung</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Dozent</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Teilnehmer</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ALL_SESSIONS.map((session) => {
                  const status = STATUS_CONFIG[session.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr key={session.code} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-white text-sm tracking-wider">{session.code}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{session.title}</p>
                        <p className="text-xs text-gray-600">{session.duration}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">{session.teacher}</td>
                      <td className="px-5 py-4 text-sm font-bold text-white">{session.participants}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{session.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all min-h-[32px]" aria-label={`Session ${session.code} Details`}>
                            Details
                          </button>
                          {session.status === 'active' && (
                            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all min-h-[32px]" aria-label={`Session ${session.code} beenden`}>
                              Beenden
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="px-6 py-4 border-t border-white/5 text-center">
        <p className="text-xs text-gray-700">CogniCore™ · A product by AT Medical GmbH® · © {new Date().getFullYear()}</p>
      </footer>
    </AdminShell>
  );
}
