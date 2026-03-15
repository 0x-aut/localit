import { Metadata } from "next"
import { ProjectLayout } from "@/components/dyncomp/ProjectLayout";

export const metadata: Metadata = {
  title: "Localit | Runs",
  description: "See your runs in localit",
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="flex h-full overflow-hidden relative">
      <ProjectLayout />
      <main className="ml-10.5 flex-1 h-full">{children}</main>
    </div>
  )
}