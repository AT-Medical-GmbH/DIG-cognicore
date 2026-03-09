'use client';

import SessionJoin from '@/components/SessionJoin';
import RoleCard from '@/components/RoleCard';

const features = [
  {
    icon: '🎤',
    title: 'Live Captions',
    description: 'Automatische Echtzeit-Untertitel mit KI-gestützter Übersetzung in über 30 Sprachen.',
    color: 'text-blue-400',
    border: 'border-brand-blue',
  },
  {
    icon: '📊',
    title: 'Live Polls',
    description: 'Interaktive Abstimmungen – Ja/Nein, Multiple Choice, Freitext und numerische Eingaben.',
    color: 'text-purple-400',
    border: 'border-brand-purple',
  },
  {
    icon: '🙋',
    title: 'Audience Signals',
    description: 'Begriff, Pause, Wasser, Fragen – diskret signalisieren ohne Unterbrechung.',
    color: 'text-green-400',
    border: 'border-brand-green',
  },
  {
    icon: '🤖',
    title: 'CogniCoach™',
    description: 'KI-gestützte Erinnerungen und adaptive Lernunterstützung für Dozenten und Teilnehmer.',
    color: 'text-yellow-400',
    border: 'border-brand-gold',
  },
  {
    icon: '♿',
    title: 'Barrierefreiheit',
    description: 'Kontrastmodi, Schriftgrößen-Anpassung, Screenreader-Support und WCAG 2.1 AA.',
    color: 'text-blue-400',
    border: 'border-brand-blue',
  },
  {
    icon: '📱',
    title: 'Remote Control',
    description: 'Smartphone als barrierefreie Fernbedienung – große Tasten, einhändig bedienbar.',
    color: 'text-purple-400',
    border: 'border-brand-purple',
  },
];

const roles = [
  {
    role: 'attendee' as const,
    title: 'Teilnehmer',
    subtitle: 'Attendee',
    description: 'Präsentation verfolgen, signalisieren und an Umfragen teilnehmen.',
    icon: '👤',
    href: '/join',
    accentColor: '#1E3A8A',
  },
  {
    role: 'teacher' as const,
    title: 'Dozent',
    subtitle: 'Teacher',
    description: 'Session leiten, Polls erstellen und Signale in Echtzeit verwalten.',
    icon: '🎓',
    href: '/teacher',
    accentColor: '#6B3FA0',
  },
  {
    role: 'remote' as const,
    title: 'Remote',
    subtitle: 'Smartphone Control',
    description: 'Große Touch-Tasten für barrierefreie Bedienung vom Smartphone.',
    icon: '📱',
    href: '/remote',
    accentColor: '#3FA34D',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-black text-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-brand-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">
            Cogni<span className="text-brand-gold">Core</span>™
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#join" className="hover:text-white transition-colors">Session beitreten</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#roles" className="hover:text-white transition-colors">Rollen</a>
        </div>
        <a
          href="/teacher"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-blue text-white hover:bg-blue-700 transition-colors"
        >
          Dozenten-Login
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-blue/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-gold/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            A product by AT Medical GmbH®
          </div>

          {/* Wordmark */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none">
            Cogni<span className="text-brand-gold">Core</span>
            <span className="text-3xl md:text-4xl align-super text-gray-400 font-light">™</span>
          </h1>

          {/* Slogan */}
          <p className="text-xl md:text-2xl font-semibold text-gray-300 mb-4 tracking-wide">
            Interactive.{' '}
            <span className="text-brand-purple">Integrative.</span>{' '}
            <span className="text-brand-green">Inclusive.</span>
          </p>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Die barrierefreie Echtzeit-Engagement-Plattform für moderne Lehre und Weiterbildung.
            KI-Untertitel, Live-Polls und Audience-Signals – alles in einer Lösung.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#join"
              className="px-8 py-4 text-lg font-bold rounded-xl bg-brand-blue hover:bg-blue-700 text-white transition-all shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:scale-105"
            >
              Session beitreten →
            </a>
            <a
              href="#features"
              className="px-8 py-4 text-lg font-semibold rounded-xl border border-white/20 text-gray-300 hover:border-white/40 hover:text-white transition-all"
            >
              Features entdecken
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Session Join Section */}
      <section id="join" className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
            Session beitreten
          </h2>
          <p className="text-gray-400 mb-10">
            Gib den 6-stelligen Code ein, den dein Dozent anzeigt.
          </p>
          <SessionJoin />
        </div>
      </section>

      {/* Role Selection */}
      <section id="roles" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">Deine Rolle wählen</h2>
            <p className="text-gray-400">Jede Rolle bietet eine optimierte Oberfläche für deine Bedürfnisse.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <RoleCard key={role.role} {...role} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
              Alles, was moderne Lehre braucht
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              CogniCore™ vereint alle notwendigen Tools in einer barrierefreien,
              intuitiven Plattform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`glass-card rounded-2xl p-6 hover:bg-white/[0.07] transition-all group border ${feature.border}/20`}
              >
                <div className={`text-4xl mb-4`}>{feature.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${feature.color}`}>{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-2xl font-black text-white mb-1">
                Cogni<span className="text-brand-gold">Core</span>™
              </div>
              <p className="text-gray-500 text-sm">Interactive. Integrative. Inclusive.</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-gray-400 text-sm font-semibold">A product by AT Medical GmbH®</p>
              <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} AT Medical GmbH®. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-6 text-xs text-gray-600">
            <a href="/datenschutz" className="hover:text-gray-400 transition-colors">Datenschutz</a>
            <a href="/impressum" className="hover:text-gray-400 transition-colors">Impressum</a>
            <a href="/barrierefreiheit" className="hover:text-gray-400 transition-colors">Barrierefreiheit</a>
            <a href="/kontakt" className="hover:text-gray-400 transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
