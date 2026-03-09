'use client';

import { type Session } from '@/types/viewer';

interface TopBarProps {
  session: Session;
  onSettingsToggle: () => void;
  onCaptionsToggle: () => void;
  captionsVisible: boolean;
}

export default function TopBar({ session, onSettingsToggle, onCaptionsToggle, captionsVisible }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-950/90 backdrop-blur-sm border-b border-white/10 h-14">
      {/* Left: Branding + Session info */}
      <div className="flex items-center gap-3">
        <span className="text-base font-black text-white hidden sm:block">
          Cogni<span className="text-brand-gold">Core</span>™
        </span>
        <div className="w-px h-5 bg-white/10 hidden sm:block" />
        <div>
          <p className="text-sm font-semibold text-white leading-tight">{session.title}</p>
          <p className="text-xs text-gray-500 leading-tight">{session.teacherName}</p>
        </div>
        <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green/15 border border-brand-green/30">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-xs text-brand-green font-semibold">{session.participantCount}</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Session code badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <span className="text-xs text-gray-500">Code:</span>
          <span className="text-sm font-bold text-white tracking-widest font-mono">{session.code}</span>
        </div>

        {/* Captions toggle */}
        <button
          onClick={onCaptionsToggle}
          aria-label={captionsVisible ? 'Captions ausblenden' : 'Captions einblenden'}
          aria-pressed={captionsVisible}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[44px]
            ${captionsVisible
              ? 'bg-brand-purple/20 border border-brand-purple/40 text-brand-purple'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span className="hidden sm:inline">Captions</span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsToggle}
          aria-label="Einstellungen öffnen"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
