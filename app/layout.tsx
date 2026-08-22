import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { CartWishlistProvider } from '../contexts/CartWishlistContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { LayoutShell } from '../components/LayoutShell';
import { SkipLink } from '../components/SkipLink';
import { ToastProvider } from '../components/Toast';
import { seoService } from '../services/seoService';


import { ComparisonProvider } from '../contexts/ComparisonContext';
import { ComparisonTray } from '../components/ComparisonTray';
import { AiShoppingAssistant } from '../components/AiShoppingAssistant';

const inter = Inter({ subsets: ['latin'] });

/**
 * Resolves the canonical site URL with a multi-level fallback:
 *  1. NEXT_PUBLIC_APP_URL  (Vercel dashboard or next.config.ts env block)
 *  2. VERCEL_URL           (auto-injected by Vercel for every deployment)
 *  3. Hard-coded production domain (ultimate safe fallback)
 *
 * VERCEL_URL does NOT include a protocol, so we prepend https://.
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://jss-marketplace.vercel.app';
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  return {
    title: {
      default: 'JSS Marketplace - Enterprise Multi-Vendor eCommerce Platform',
      template: '%s | JSS Marketplace',
    },
    description: 'Shop millions of products from verified multi-vendor merchants on JSS Marketplace.',
    keywords: ['eCommerce', 'Multi-vendor', 'Marketplace', 'Online Shopping', 'JSS Marketplace'],
    authors: [{ name: 'JSS Solutions' }],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: 'JSS Marketplace - Enterprise Multi-Vendor eCommerce Platform',
      description: 'Shop millions of products from verified multi-vendor merchants on JSS Marketplace.',
      url: siteUrl,
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
}


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
        <SkipLink />
        <ReactQueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartWishlistProvider>
                  <ToastProvider>
                    <ComparisonProvider>
                      <LayoutShell>
                        {children}
                      </LayoutShell>
                      <ComparisonTray />
                      <AiShoppingAssistant />
                    </ComparisonProvider>
                  </ToastProvider>
                </CartWishlistProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
