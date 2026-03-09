import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CogniCore™ Remote',
  description: 'Smartphone-Fernbedienung für CogniCore™-Sessions.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={montserrat.variable}>
      <body className="bg-brand-black font-montserrat antialiased select-none">
        {children}
      </body>
    </html>
  );
}
