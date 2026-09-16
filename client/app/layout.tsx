import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LunaTasks Pro - 3D Academic & Personal Task Management',
  description: 'Professional 3D student task manager powered by Next.js, Express, Neon DB, and Clerk Auth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-black text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
