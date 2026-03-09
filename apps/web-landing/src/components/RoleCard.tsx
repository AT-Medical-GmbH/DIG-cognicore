'use client';

interface RoleCardProps {
  role: 'attendee' | 'teacher' | 'remote';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  href: string;
  accentColor: string;
}

export default function RoleCard({
  title,
  subtitle,
  description,
  icon,
  href,
  accentColor,
}: RoleCardProps) {
  return (
    <a
      href={href}
      className="
        group glass-card rounded-2xl p-8 flex flex-col items-center text-center
        hover:bg-white/[0.07] transition-all duration-300 cursor-pointer
        hover:scale-[1.02] hover:shadow-2xl
        border border-white/10 hover:border-white/20
        min-h-[44px]
      "
      style={{ '--accent': accentColor } as React.CSSProperties}
      aria-label={`Als ${title} (${subtitle}) beitreten`}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform group-hover:scale-110"
        style={{ background: `${accentColor}22`, border: `1.5px solid ${accentColor}44` }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>{subtitle}</p>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <div
        className="mt-6 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all group-hover:shadow-lg"
        style={{ background: accentColor, boxShadow: `0 4px 20px ${accentColor}30` }}
      >
        Weiter →
      </div>
    </a>
  );
}
