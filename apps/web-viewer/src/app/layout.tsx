import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CogniCore™ Viewer',
  description: 'Teilnehmer-Ansicht für CogniCore™ – Live-Präsentation, Signale und Captions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={montserrat.variable}>
      <body className="bg-brand-black font-montserrat antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
