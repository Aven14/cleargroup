import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AudioProvider } from "@/contexts/audio-context";
import { TransportBackground } from "@/components/layout/transport-background";
import { Navbar } from "@/components/layout/navbar";
import { SidebarRight } from "@/components/layout/sidebar-right";
import { getCurrentUser, ensureBootstrapAdmin } from "@/lib/session";
import { RadioPlayer } from "@/components/audio/radio-player";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ClearGroup — Services urbains Vice City",
  description:
    "Site officiel de ClearGroup, groupe de services urbains regroupant ClearBus (transport) et ClearSecurity (sécurité privée) pour Vice City.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureBootstrapAdmin();
  const user = await getCurrentUser();

  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="antialiased">
        <AudioProvider>
          <TransportBackground />
          <Navbar user={user} />
          <SidebarRight user={user} />
          <main className="relative z-10 min-h-screen bg-transparent pt-8 pb-28">
            <div className="panel ml-56 mr-56 pl-4 pr-4 py-6">
              {children}
            </div>
          </main>
          <RadioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
