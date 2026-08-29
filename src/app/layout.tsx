import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import ReferralTracker from "@/components/referral_tracker";
import { QueryProvider } from "@/components/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from '@/components/providers';
import { BottomNav } from '@/components/layout/BottomNav';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imlinkey.store"),
  title: {
    default: "Imlinkey",
    template: "%s | Imlinkey",
  },
  description:
    "Imlinkey é a plataforma multifuncional para criadores, artistas e profissionais compartilharem links, produtos e experiências de forma segura e inovadora. Não vendemos produtos diretamente; oferecemos subscrição e facilitação de compartilhamento de conteúdos, promovendo monetização e engajamento com seu público.",
  keywords: [
    "Imlinkey",
    "plataforma de links",
    "monetização de conteúdo",
    "influencers",
    "artistas",
    "criadores de conteúdo",
    "engajamento",
    "experiências exclusivas",
    "YouTube",
    "X",
    "TikTok",
    "Instagram",
    "Earn Money",
    "Found people",
  ],
  alternates: {
    canonical: "https://imlinkey.store",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://imlinkey.store",
    siteName: "Imlinkey",
    title: "Imlinkey",
    description:
      "Imlinkey é a plataforma multifuncional que conecta criadores, artistas e fãs através de links, produtos e experiências exclusivas.",
    images: [
      {
        url: "https://imlinkey.store/og-image.png",
        width: 1200,
        height: 630,
        alt: "Imlinkey - Plataforma para criadores e artistas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imlinkey",
    description:
      "Imlinkey é a plataforma multifuncional que conecta criadores, artistas e fãs através de links, produtos e experiências exclusivas.",
    images: ["https://imlinkey.store/og-image.png"],
    creator: "Kordel Mauve @kordelmauve",
  },
  verification: {
    google: "3bL9QRnTOtfbabRXT9qDVxOltNcA-r5FSWF-L4cqER8",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5473975283659581" />
        <link rel="canonical" href="https://imlinkey.store" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Imlinkey",
            url: "https://imlinkey.store",
            logo: "https://imlinkey.store/favicon.png",
            description:
              "Imlinkey é a plataforma multifuncional para criadores, artistas e profissionais compartilharem links, produtos e experiências de forma segura e inovadora. Promove monetização e engajamento com seu público.",
            founder: {
              "@type": "Person",
              name: "Kordel Mauve",
              sameAs: [
                "https://twitter.com/kordelmauve",
                "https://www.instagram.com/kordelmauve/",
                "https://www.x.com/kordelmauve",
              ],
            },
            sameAs: [
              "https://twitter.com/kordelmauve",
              "https://www.instagram.com/kordelmauve/",
              "https://www.x.com/kordelmauve",
              "https://imlinkey.store",
              "https://imlinkey.store/about/",
            ],
            potentialAction: {
              "@type": "SearchAction",
              target: "https://imlinkey.store/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>

        <Providers>
          <QueryProvider>{children}</QueryProvider>
          <BottomNav />
        </Providers>
        <Analytics />
        <SpeedInsights />

        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5473975283659581"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
