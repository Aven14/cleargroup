import { DPSidebar } from "@/components/cleardp/dp-sidebar";

export default function ClearDPInterneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mr-56">
      <DPSidebar />
      {children}
    </div>
  );
}
