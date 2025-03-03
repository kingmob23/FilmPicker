// TODO: Add more meta tags for better SEO and social media sharing.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';
import { UsernamesProvider } from './context/UsernamesContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <UsernamesProvider>
          {children}
        </UsernamesProvider>
      </body>
    </html>
  );
}
