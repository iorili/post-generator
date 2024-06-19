import "@/styles/globals.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const WEBSITE_URL: string = process.env.NEXT_PUBLIC_ANALYTICS_URL || "";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PlausibleProvider trackOutboundLinks={true} domain={WEBSITE_URL}>
        <main className={inter.className}>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </main>
      </PlausibleProvider>
    </>
  );
}
