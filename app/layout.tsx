import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { CartWishlistProvider } from '../contexts/CartWishlistContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { seoService } from '../services/seoService';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'JSS Marketplace - Enterprise Multi-Vendor eCommerce Platform',
    template: '%s | JSS Marketplace',
  },
  description: 'Shop millions of products from verified multi-vendor merchants on JSS Marketplace.',
  keywords: ['eCommerce', 'Multi-vendor', 'Marketplace', 'Online Shopping', 'JSS Marketplace'],
  authors: [{ name: 'JSS Solutions' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'JSS Marketplace - Enterprise Multi-Vendor eCommerce Platform',
    description: 'Shop millions of products from verified multi-vendor merchants on JSS Marketplace.',
    url: 'http://localhost:3000',
    siteName: 'JSS Marketplace',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSS Marketplace',
    description: 'Shop millions of products from verified multi-vendor merchants.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = seoService.generateOrganizationJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartWishlistProvider>
                  <Header />
                  <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                  </main>
                  <Footer />
                </CartWishlistProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
