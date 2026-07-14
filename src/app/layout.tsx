import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { Header } from "@/features/dashboard/Header";
import { CommandMenu } from "@/components/CommandMenu";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResourceVault AI",
  description: "Your AI-powered personal knowledge vault. Save anything. Find everything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}
    >
      <body className="antialiased font-sans bg-background text-foreground">
        <TooltipProvider>
          <CommandMenu />
          <div className="flex h-screen overflow-hidden bg-background bg-vault-glow">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 border-l border-border/60">
              <Header />
              <main className="flex-1 overflow-y-auto bg-background p-8 scrollbar-vault">
                <div className="max-w-[1200px] mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
