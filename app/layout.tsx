import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Relationship Analyzer",
  description: "Evaluate and improve your relationships with personalized insights and actionable suggestions",
  keywords: [
    "relationship analyzer",
    "relationship advice",
    "relationship help",
    "relationship analysis",
    "relationship improvement",
    "relationship evaluation"
  ],
  manifest: "/manifest.json?v=1",
  authors: [{ name: "Rohit Kumar Yadav" }],
  creator: "Rohit Kumar Yadav",
  publisher: "Rohit Kumar Yadav",
  applicationName: "Relationship Analyzer",
  metadataBase: new URL('https://breakup-analyzer.resourcesandcarrier.online/'),
  openGraph: {
    title: "Relationship Analyzer",
    description: "Get personalized insights and advice to improve your relationships",
    url: 'https://breakup-analyzer.resourcesandcarrier.online/',
    siteName: 'Relationship Analyzer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relationship Analyzer',
    description: 'Get personalized insights and advice to improve your relationships',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: '#000000'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
