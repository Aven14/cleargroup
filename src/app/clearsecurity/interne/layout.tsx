import { SecuritySidebar } from "@/components/clearsecurity/security-sidebar";

export default function SecurityInterneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent">
      <SecuritySidebar />
      <main className="relative z-10 min-h-screen bg-transparent pt-8 pb-28 pl-56">
        <div className="panel mx-auto max-w-6xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
