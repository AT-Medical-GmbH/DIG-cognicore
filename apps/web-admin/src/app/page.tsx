import Link from 'next/link';

// TODO: Replace with real data from Admin API
const STATS = [
  { label: 'Aktive Sessions', value: '3', icon: '📡', color: '#3FA34D' },
  { label: 'Sessions heute', value: '11', icon: '📅', color: '#1E3A8A' },
  { label: 'Registrierte Dozenten', value: '24', icon: '🎓', color: '#6B3FA0' },
  { label: 'Events geplant', value: '7', icon: '🗓', color: '#F2B705' },
];

const ACTIVE_SESSIONS = [
  { code: '847291', title: 'Neurologie Modul 3', teacher: 'Dr. Anna Müller', participants: 47, startedAt: '09:15' },
  { code: '391042', title: 'Pharmakologie Einführung', teacher: 'Prof. Klein', participants: 31, startedAt: '09:45' },
  { code: '582736', title: 'Anatomie – Herz & Kreislauf', teacher: 'Dr. Berger', participants: 23, startedAt: '10:00' },
];

function AdminShell({ children, activeNav }: { children: React.ReactNode; activeNav: string }) {
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/sessions', label: 'Sessions', icon: '📡' },
    { href: '/events', label: 'Events', icon: '🗓' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
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
                ${activeNav === item.href
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell activeNav="/">
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
        <h1 className="text-xl font-black text-white">CogniCoordinator</h1>
        <p className="text-xs text-gray-500">Plattform-Übersicht und Verwaltung</p>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 border border-white/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
              </div>
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active sessions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Aktive Sessions
            </h2>
            <Link href="/sessions" className="text-xs text-brand-blue hover:text-blue-400 font-semibold transition-colors">
              Alle anzeigen →
            </Link>
          </div>
          <div className="space-y-3">
            {ACTIVE_SESSIONS.map((session) => (
              <div key={session.code} className="glass-card rounded-2xl p-5 border border-brand-green/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{session.title}</p>
                    <p className="text-xs text-gray-500">{session.teacher} · seit {session.startedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div>
                    <p className="text-xl font-black text-white">{session.participants}</p>
                    <p className="text-xs text-gray-600">Teilnehmer</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm font-bold text-white font-mono tracking-widest">{session.code}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick navigation */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Verwaltung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/sessions"
              className="glass-card rounded-2xl p-6 border border-white/8 hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all group"
            >
              <div className="text-3xl mb-3">📡</div>
              <h3 className="font-bold text-white mb-1 group-hover:text-brand-gold transition-colors">Session-Verwaltung</h3>
              <p className="text-sm text-gray-500">Alle Sessions einsehen, verwalten und analysieren.</p>
            </Link>
            <Link
              href="/events"
              className="glass-card rounded-2xl p-6 border border-white/8 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all group"
            >
              <div className="text-3xl mb-3">🗓</div>
              <h3 className="font-bold text-white mb-1 group-hover:text-brand-gold transition-colors">Event-Planung</h3>
              <p className="text-sm text-gray-500">Veranstaltungen planen, Dozenten zuweisen und koordinieren.</p>
            </Link>
          </div>
        </section>
      </div>

      <footer className="px-6 py-4 border-t border-white/5 text-center">
        <p className="text-xs text-gray-700">CogniCore™ · A product by AT Medical GmbH® · © {new Date().getFullYear()}</p>
      </footer>
    </AdminShell>
  );
}
