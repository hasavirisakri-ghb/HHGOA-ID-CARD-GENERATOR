import { Playfair_Display, Space_Mono, Press_Start_2P } from 'next/font/google';
import { SITE_URL } from '../lib/site';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start',
});

const TITLE = "HH Goa 2026 | PFP Frame Generator";
const DESCRIPTION = "Upload a photo, get a branded HH Goa 2026 profile picture frame in seconds. Download it or share it straight to X with #FrameInGoa.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'HH Goa 2026 PFP Frame Generator',
  keywords: ['HH Goa 2026', 'Hacker House Goa', 'PFP frame', 'profile picture generator', 'FrameInGoa'],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'HH Goa 2026',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#165932',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${spaceMono.variable} ${pressStart.variable}`}>
        {children}
      </body>
    </html>
  );
}
