import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/components/AuthProvider";
import { JsonLd } from "@/components/JsonLd";
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
export const metadata: Metadata = { metadataBase: new URL("https://zevqyn.dev"), title: "ZEVQYN — AI Research + Career Workspace", description: "Upload research, chat with documents, and turn work into projects, resumes and portfolios.", icons: { icon: [{ url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" }, { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }, { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" }, { url: "/logo.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] } };
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://zevqyn.dev/#organization",
  name: "ZEVQYN",
  url: "https://zevqyn.dev",
  logo: "https://zevqyn.dev/logo.png",
  founder: { "@id": "https://zevqyn.dev/#hussnain-ahmad" },
};
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://zevqyn.dev/#website",
  name: "ZEVQYN",
  url: "https://zevqyn.dev",
  publisher: { "@id": "https://zevqyn.dev/#organization" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4742196891317089" crossOrigin="anonymous"></script><JsonLd data={[ORG_JSON_LD, WEBSITE_JSON_LD]} /></head><body className="min-h-screen antialiased"><Providers><AuthProvider>{children}</AuthProvider></Providers></body></html>);
}
