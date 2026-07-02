import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { Header } from "@/features/dashboard/Header";
import { CommandMenu } from "@/components/CommandMenu";

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
    <html lang="en">
      <body className="antialiased">
        <TooltipProvider>
          <CommandMenu />
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto bg-background p-8">
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
