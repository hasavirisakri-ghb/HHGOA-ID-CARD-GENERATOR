import { Playfair_Display, Space_Mono, Press_Start_2P } from 'next/font/google';
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

export const metadata = {
  title: "HH Goa 2026 | PFP Frame Generator",
  description: "Instantly generate your branded Hacker House Goa 2026 profile picture frame.",
};

export const viewport = {
  themeColor: "#165932",
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
