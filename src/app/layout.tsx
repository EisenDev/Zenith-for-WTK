import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarSovereign } from "@/components/sidebar-sovereign";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "ZENITH | Sovereign Hotel Intelligence",
  description: "Advanced AI-driven hotel reputation and operations dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} font-sans antialiased text-sm`}>
        <SidebarProvider>
          <SidebarSovereign />
          <SidebarInset className="bg-background">
            <header className="flex h-16 shrink-0 items-center gap-2 px-8 border-b border-white/5 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 font-poppins">ZENITH Grand Resort</span>
                <span className="text-muted-foreground/10 text-lg">/</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground font-poppins">Portfolio Alpha</span>
              </div>
            </header>
            <main className="flex-1 p-8 premium-gradient overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
