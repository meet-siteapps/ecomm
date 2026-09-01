import type { Metadata } from 'next';
import { Quicksand, Nunito } from 'next/font/google';
import './globals.css';
import { Header } from '@/frontend/components/layout/Header';
import { Footer } from '@/frontend/components/layout/Footer';
import { AuthListener } from '@/frontend/components/auth/AuthListener';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Baby Ladoo | Curated Baby & Kids Essentials',
  description: 'A clean, playful, and modern e-commerce shopping destination for safe, 100% organic baby & kids essentials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#FAF4EE] text-[#193653] font-sans antialiased selection:bg-[#FDE8EB] selection:text-[#F27A8A]"
        suppressHydrationWarning
      >
        <AuthListener />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
