import Link from 'next/link';

// TODO: Replace with real event data from Admin API
const EVENTS = [
  {
    id: 'evt-1',
    title: 'Neurologie-Symposium 2025',
    org: 'Medizinische Hochschule Hamburg',
    date: '15.03.2025',
    sessions: 6,
    teachers: ['Dr. Anna Müller', 'Prof. Klein', 'Dr. Berger'],
    status: 'planned',
    attendees: 180,
  },
  {
    id: 'evt-2',
    title: 'Pharmakologie Blockkurs – Frühjahr',
    org: 'Universität Leipzig, Medizinische Fakultät',
    date: '22.03.2025',
    sessions: 4,
    teachers: ['Prof. Schmidt', 'Dr. Wagner'],
    status: 'planned',
    attendees: 95,
  },
  {
    id: 'evt-3',
    title: 'Intensivkurs Notfallmedizin',
    org: 'AT Medical GmbH® Fortbildungszentrum',
    date: '08.03.2025',
    sessions: 8,
    teachers: ['Dr. Hoffmann', 'Dr. Schreiber', 'Prof. Braun'],
    status: 'active',
    attendees: 240,
  },
  {
    id: 'evt-4',
    title: 'Anatomie Prüfungsvorbereitung',
    org: 'Medizinische Hochschule Hamburg',
    date: '01.03.2025',
    sessions: 3,
    teachers: ['Dr. Klein'],
    status: 'completed',
    attendees: 67,
  },
];

const STATUS_CONFIG = {
  planned: { label: 'Geplant', color: '#1E3A8A', bg: 'rgba(30,58,138,0.15)', border: 'rgba(30,58,138,0.3)' },
  active: { label: 'Laufend', color: '#3FA34D', bg: 'rgba(63,163,77,0.15)', border: 'rgba(63,163,77,0.3)' },
  completed: { label: 'Abgeschlossen', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.2)' },
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

export default function EventsPage() {
  return (
    <AdminShell activeNav="/events">
      <header className="sticky top-0 z-10 px-6 py-4 bg-gray-950/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Event-Planung</h1>
            <p className="text-xs text-gray-500">Veranstaltungen planen, koordinieren und verwalten</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-blue-700 transition-all min-h-[44px]"
            aria-label="Neues Event erstellen"
          >
            {/* TODO: Open event creation modal */}
            + Neues Event
          </button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Geplante Events', value: '2', color: '#1E3A8A' },
            { label: 'Laufende Events', value: '1', color: '#3FA34D' },
            { label: 'Abgeschlossene Events', value: '1', color: '#6b7280' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 border border-white/8">
              <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Events list */}
        <div className="space-y-4">
          {EVENTS.map((event) => {
            const status = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={event.id} className="glass-card rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-600">📅 {event.date}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{event.org}</p>

                    <div className="flex flex-wrap gap-2">
                      {event.teachers.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/25 text-brand-purple text-xs font-semibold">
                          🎓 {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 flex-shrink-0">
                    <div className="text-center md:text-right">
                      <p className="text-2xl font-black text-white">{event.attendees}</p>
                      <p className="text-xs text-gray-600">Teilnehmer</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xl font-black text-white">{event.sessions}</p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                    <button className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all min-h-[36px]" aria-label={`${event.title} bearbeiten`}>
                      Bearbeiten
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="px-6 py-4 border-t border-white/5 text-center">
        <p className="text-xs text-gray-700">CogniCore™ · A product by AT Medical GmbH® · © {new Date().getFullYear()}</p>
      </footer>
    </AdminShell>
  );
}
