import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog',
  },
  description: 'A blog powered by Notion and Next.js',
};

/**
 * 루트 레이아웃 컴포넌트
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            Built with Notion and Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
