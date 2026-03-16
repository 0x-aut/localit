import { Metadata } from "next"
import { GroupsClient } from "@/components/dyncomp/Groupsclient";

export const metadata: Metadata = {
  title: "Groups | Localit",
}

export default function GroupsPage() {
  return <GroupsClient />
}