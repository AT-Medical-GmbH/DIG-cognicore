'use client';

interface SessionCardProps {
  session: {
    code: string;
    title: string;
    teacherName: string;
    participantCount: number;
    status: 'active' | 'paused' | 'ended';
    startedAt: Date;
    captionsEnabled: boolean;
    pollsEnabled: boolean;
    signalsEnabled: boolean;
    recordingEnabled: boolean;
  };
}

const STATUS_CONFIG = {
  active: { label: 'Aktiv', color: '#3FA34D', bg: 'rgba(63,163,77,0.15)', border: 'rgba(63,163,77,0.3)' },
  paused: { label: 'Pausiert', color: '#F2B705', bg: 'rgba(242,183,5,0.15)', border: 'rgba(242,183,5,0.3)' },
  ended: { label: 'Beendet', color: '#6b7280', bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)' },
};

function formatDuration(startedAt: Date): string {
  const diffMs = Date.now() - startedAt.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}min`;
  return `${mins}min`;
}

export default function SessionCard({ session }: SessionCardProps) {
  const status = STATUS_CONFIG[session.status];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8">
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        {/* Main info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
            <span className="text-xs text-gray-500">seit {formatDuration(session.startedAt)}</span>
          </div>
          <h2 className="text-xl font-black text-white mb-1">{session.title}</h2>
          <p className="text-sm text-gray-500">{session.teacherName}</p>
        </div>

        {/* Session code */}
        <div className="text-center md:text-right">
          <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wider">Session-Code</p>
          <p className="text-4xl font-black text-white tracking-[0.2em] font-mono">{session.code}</p>
          <p className="text-xs text-gray-500 mt-1">{session.participantCount} Teilnehmer</p>
        </div>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/5">
        {[
          { label: 'Captions', enabled: session.captionsEnabled, color: '#6B3FA0' },
          { label: 'Polls', enabled: session.pollsEnabled, color: '#1E3A8A' },
          { label: 'Signale', enabled: session.signalsEnabled, color: '#3FA34D' },
          { label: 'Aufzeichnung', enabled: session.recordingEnabled, color: '#F2B705' },
        ].map((feat) => (
          <span
            key={feat.label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: feat.enabled ? `${feat.color}18` : 'rgba(255,255,255,0.04)',
              color: feat.enabled ? feat.color : '#4b5563',
              border: `1px solid ${feat.enabled ? feat.color + '35' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span>{feat.enabled ? '●' : '○'}</span>
            {feat.label}
          </span>
        ))}
      </div>
    </div>
  );
}
