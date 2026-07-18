import { ClearBusSidebar } from "@/components/clearbus/clearbus-sidebar";

export default function ClearBusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent">
      <ClearBusSidebar />
      <main className="relative z-10 min-h-screen bg-transparent pt-8 pb-28">
        {children}
      </main>
    </div>
  );
}
