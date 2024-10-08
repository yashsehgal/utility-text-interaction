import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import ApplicationContextProvider from '@/providers/application-context-provider';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Utility | Interactable Text',
  description:
    'A simple utility example for rendering text with interactive components',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ApplicationContextProvider>{children}</ApplicationContextProvider>
      </body>
    </html>
  );
}
