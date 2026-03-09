import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CogniCore™ – Dozenten-Dashboard',
  description: 'Dozenten-Interface für CogniCore™: Sessions, Polls, Signale und Captions verwalten.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={montserrat.variable}>
      <body className="bg-gray-950 font-montserrat antialiased text-gray-100">
        {children}
      </body>
    </html>
  );
}
