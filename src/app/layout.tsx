import type { Metadata } from 'next';
import { Quicksand, Nunito } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthListener } from '@/components/auth/AuthListener';

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
  description: 'A clean, modern e-commerce shopping destination for baby & kids essentials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D3748] font-sans antialiased selection:bg-[#FFEAEF] selection:text-[#FF6B8B]"
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
