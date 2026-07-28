import { DPSidebar } from "@/components/cleardp/dp-sidebar";

export default function ClearDPInterneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-enter ml-56">
      <DPSidebar />
      {children}
    </div>
  );
}
