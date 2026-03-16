"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, ChevronRight, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

type Group = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  role: "owner" | "member";
  project_count: number;
};

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-3 py-24">
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A]">
        <Users size={18} color="#555555" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
          No groups yet
        </span>
        <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
          Create a group to start auditing your projects
        </span>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-sm bg-[#107A4D] hover:bg-[#0D6B42] text-white font-sans text-xs tracking-[-0.05em] transition-colors duration-150 cursor-pointer"
      >
        <Plus size={12} />
        Create your first group
      </button>
    </div>
  );
}

function GroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-3 border-b border-[#2A2A2A] hover:bg-[#111111] transition-colors duration-150 cursor-pointer"
    >
      <div className="flex items-center gap-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
          <span className="font-sans text-sm font-normal text-[#EDEDED] uppercase">
            {group.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <div className="flex items-center gap-x-2">
            <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
              {group.name}
            </span>
            {group.role === "owner" && (
              <Crown size={10} color="#F59E0B" />
            )}
          </div>
          <span className="font-mono text-xs tracking-[-0.05em] text-[#555555]">
            {group.slug}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-6">
        <div className="flex flex-col items-end gap-y-0.5">
          <span className="font-sans text-xs tracking-[-0.05em] text-[#A1A1A1]">
            {group.project_count} project{group.project_count !== 1 ? "s" : ""}
          </span>
          <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
            Created {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}
          </span>
        </div>
        <ChevronRight size={14} color="#555555" />
      </div>
    </div>
  );
}

export function GroupsClient() {
  const router = useRouter();
  const supabase = createClient();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("user", user)
      if (!user) return;

      const { data, error } = await supabase
        .from("group_members")
        .select(`
          role,
          groups (
            id, name, slug, owner_id, created_at
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { referencedTable: "groups", ascending: false });

      if (error || !data) return;

      // Count projects per group
      const groupIds = data.map((d: any) => d.groups.id);
      const { data: projectCounts } = await supabase
        .from("projects")
        .select("group_id")
        .in("group_id", groupIds);

      const countMap: Record<string, number> = {};
      for (const p of projectCounts ?? []) {
        countMap[p.group_id] = (countMap[p.group_id] ?? 0) + 1;
      }

      const mapped: Group[] = data.map((d: any) => ({
        ...d.groups,
        role: d.role,
        project_count: countMap[d.groups.id] ?? 0,
      }));

      setGroups(mapped);
      setLoading(false);
    }

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full px-4 py-4 gap-y-4">
        <div className="flex justify-between items-center">
          <div className="w-16 h-4 bg-[#1A1A1A] rounded-sm animate-pulse" />
          <div className="w-24 h-7 bg-[#1A1A1A] rounded-sm animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-14 bg-[#111111] rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full px-4 py-4 gap-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
          Groups
        </span>
        {groups.length > 0 && (
          <button
            onClick={() => router.push("/groups/create")}
            className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-sm bg-[#107A4D] hover:bg-[#0D6B42] text-white font-sans text-xs tracking-[-0.05em] transition-colors duration-150 cursor-pointer"
          >
            <Plus size={12} />
            New Group
          </button>
        )}
      </div>

      {/* List or empty state */}
      {groups.length === 0 ? (
        <EmptyState onCreateClick={() => router.push("/groups/create")} />
      ) : (
        <div className="flex flex-col border border-[#2A2A2A] rounded-lg overflow-hidden">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => router.push(`/groups/${group.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}