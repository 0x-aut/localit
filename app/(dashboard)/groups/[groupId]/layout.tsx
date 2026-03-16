"use client";

import { use } from "react";
import { usePathname } from "next/navigation";
import { ProjectLayout } from "@/components/dyncomp/ProjectLayout";
import { GroupLayout } from "@/components/dyncomp/GroupLayout";

export default function GroupIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const pathname = usePathname();
  const base = `/groups/${groupId}`;

  const groupOnlyRoutes = [
    base,
    `${base}/team`,
    `${base}/usage`,
    `${base}/billing`,
    `${base}/settings`,
  ];

  const showGroupLayout = groupOnlyRoutes.includes(pathname);

  // Extract projectSlug from pathname
  const projectSlug = pathname.match(/\/projects\/([^/]+)/)?.[1] ?? "";

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {showGroupLayout ? (
        <GroupLayout groupId={groupId} />
      ) : (
        <ProjectLayout groupId={groupId} projectSlug={projectSlug} />
      )}
      <main className="flex-1 h-full ml-10.5 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}