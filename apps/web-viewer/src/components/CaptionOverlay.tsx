'use client';

import { useEffect, useRef } from 'react';
import { type Caption } from '@/types/viewer';

interface CaptionOverlayProps {
  captions: Caption[];
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  translationLanguage: string;
}

const fontSizeMap: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export default function CaptionOverlay({
  captions,
  fontSize,
  highContrast,
  translationLanguage,
}: CaptionOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestCaptions = captions.slice(-3);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [captions]);

  if (captions.length === 0) return null;

  return (
    <div
      className="absolute bottom-20 left-0 right-0 px-6 pointer-events-none z-30"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Live Captions"
    >
      <div
        ref={scrollRef}
        className={`
          mx-auto max-w-3xl rounded-xl px-6 py-4
          ${highContrast
            ? 'bg-black text-white'
            : 'bg-black/75 backdrop-blur-sm text-gray-100'
          }
        `}
      >
        {latestCaptions.map((caption) => (
          <div key={caption.id} className="mb-1 last:mb-0">
            <p
              className={`caption-text font-semibold leading-relaxed ${fontSizeMap[fontSize]}`}
              style={{ opacity: caption.isFinal ? 1 : 0.7 }}
            >
              {caption.text}
            </p>
            {caption.translation && translationLanguage !== 'de' && (
              <p
                className={`caption-text text-brand-gold leading-relaxed mt-0.5 ${fontSizeMap[fontSize]}`}
                style={{ fontSize: '85%' }}
              >
                {caption.translation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
