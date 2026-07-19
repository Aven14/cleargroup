import { SecuritySidebar } from "@/components/clearsecurity/security-sidebar";

export default function SecurityInterneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-canvas">
      <SecuritySidebar />
      <main className="relative z-10 min-h-screen bg-canvas pt-8 pb-28 ml-56">
        {children}
      </main>
    </div>
  );
}
