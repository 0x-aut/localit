import { Metadata } from "next";
import { ProjectsClient } from "@/components/dyncomp/Projectclient";

export const metadata: Metadata = { title: "Projects | Localit" };

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <ProjectsClient groupId={groupId} />;
}