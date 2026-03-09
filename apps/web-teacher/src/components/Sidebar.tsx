'use client';

import Link from 'next/link';

interface SidebarProps {
  activeRoute: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Übersicht', icon: '🏠' },
  { href: '/dashboard/polls', label: 'Umfragen', icon: '📊' },
  { href: '/dashboard/signals', label: 'Signale', icon: '🔔' },
  { href: '/dashboard/settings', label: 'Einstellungen', icon: '⚙️' },
];

export default function Sidebar({ activeRoute }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-white/5 flex flex-col" aria-label="Haupt-Navigation">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="text-xl font-black text-white">
          Cogni<span className="text-brand-gold">Core</span>™
        </div>
        <p className="text-xs text-gray-600 mt-0.5">Dozenten-Dashboard</p>
      </div>

      {/* Session indicator */}
      <div className="mx-4 my-4 px-4 py-3 rounded-xl bg-brand-green/10 border border-brand-green/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-xs font-bold text-brand-green">Session aktiv</span>
        </div>
        <p className="text-lg font-black text-white tracking-widest font-mono">847 291</p>
        <p className="text-xs text-gray-500 mt-0.5">47 Teilnehmer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1" role="navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} min-h-[44px]`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* End session */}
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all min-h-[44px]" aria-label="Session beenden">
          <span>⏹</span>
          Session beenden
        </button>

        <div className="px-4 py-2">
          <p className="text-xs text-gray-600">A product by AT Medical GmbH®</p>
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} CogniCore™</p>
        </div>
      </div>
    </aside>
  );
}
