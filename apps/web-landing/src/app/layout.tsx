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
  title: 'CogniCore™ – Interactive. Integrative. Inclusive.',
  description:
    'CogniCore™ is the accessible, AI-powered audience engagement platform by AT Medical GmbH®. Join sessions, ask questions, and participate fully.',
  keywords: ['CogniCore', 'accessible learning', 'audience engagement', 'AT Medical', 'live captions'],
  authors: [{ name: 'AT Medical GmbH®' }],
  openGraph: {
    title: 'CogniCore™',
    description: 'Interactive. Integrative. Inclusive.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={montserrat.variable}>
      <body className="bg-brand-black font-montserrat antialiased">{children}</body>
    </html>
  );
}
