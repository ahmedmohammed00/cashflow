import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';

const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-cairo',
});

export const metadata: Metadata = {
    title: 'CashFlow POS',
    description: 'تطبيق نقاط البيع',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body className={cn('min-h-screen bg-background antialiased flex flex-col', cairo.className)}>

        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        </body>
        </html>
    );
}
