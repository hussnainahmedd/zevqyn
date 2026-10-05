import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/components/AuthProvider";
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
export const metadata: Metadata = { title: "ZEVQYN — AI Research + Career Workspace", description: "Upload research, chat with documents, and turn work into projects, resumes and portfolios.", icons: { icon: "/logo.svg" } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}><body className="min-h-screen antialiased"><Providers><AuthProvider>{children}</AuthProvider></Providers></body></html>);
}
