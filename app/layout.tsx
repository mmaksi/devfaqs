import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import {
  Inter,
  Space_Grotesk as spaceGrotesk,
} from 'next/font/google';
import React from 'react';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ],
  variable: '--font-inter',
});

const grotsek = spaceGrotesk({
  subsets: ['latin'],
  weight: [
    '300',
    '400',
    '500',
    '600',
    '700',
  ],
  variable: '--font-spaceGrotesk',
});

export const metadata: Metadata = {
  title: 'TechFAQs',
  description:
    'A community-driven platform for asking and answering programming questons. Get help, share knowledge with developers all around the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} ${grotsek.className}`}
      >
        <ClerkProvider
          afterSignOutUrl='/'
          appearance={{
            elements: {
              formButtonPrimary:
                'primary-gradient',
              footerActionLink:
                'primary-text-gradient hover:text-primary-500',
            },
          }}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
