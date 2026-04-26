import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from '@/infrastructure/common/config';
import { AuthProvider } from '@/presentation/contexts/AuthContext';
import { ThemeProvider } from '@/presentation/contexts/ThemeContext';
import { ToastProvider } from '@/presentation/contexts/ToastContext';
import Header from '@/presentation/components/Header';
import Footer from '@/presentation/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.app.name,
  description: APP_CONFIG.app.description,
};

export const viewport = {
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full transition-colors duration-300 bg-luxury-surface">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <div className="min-h-full flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
