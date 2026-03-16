"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuTrigger,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Boxes, ChevronsUpDown, Box, Plus, Dot, Check } from "lucide-react";
import { signOut } from "@/app/actions/auth";

type Group = { id: string; name: string; slug: string };
type Project = { id: string; name: string; slug: string };

export function MainLayoutComp() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [groups, setGroups] = useState<Group[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Extract groupId and projectSlug from pathname
  // e.g. /groups/abc-123/projects/my-project/runs
  const groupId = pathname.match(/\/groups\/([^/]+)/)?.[1] ?? null;
  const projectSlug = pathname.match(/\/projects\/([^/]+)/)?.[1] ?? null;

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setAvatarUrl(user.user_metadata?.avatar_url ?? null);
      setUserName(user.user_metadata?.user_name ?? user.user_metadata?.full_name ?? null);

      // Fetch all groups user belongs to
      const { data: memberships } = await supabase
        .from("group_members")
        .select("groups(id, name, slug)")
        .eq("user_id", user.id);

      const allGroups: Group[] = memberships
        ?.map((m: any) => m.groups)
        .filter(Boolean) ?? [];

      setGroups(allGroups);

      if (groupId) {
        const found = allGroups.find((g) => g.id === groupId);
        setCurrentGroup(found ?? null);

        // Fetch all projects for current group
        const { data: projectData } = await supabase
          .from("projects")
          .select("id, name, slug")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false });

        setProjects(projectData ?? []);

        if (projectSlug && projectData) {
          const foundProject = projectData.find((p) => p.slug === projectSlug);
          setCurrentProject(foundProject ?? null);
        } else {
          setCurrentProject(null);
        }
      }
    }

    fetchData();
  }, [pathname]);

  return (
    <>
      <nav className="flex w-full justify-between h-10 pl-2 pr-2 items-center border-b border-[#2A2A2A]">
        <div className="flex items-center gap-x-3">
          <Link href="/" className="font-sans text-xs text-[#EDEDED] hover:text-white transition-colors">
            Localit
          </Link>

          {/* Group switcher */}
          {currentGroup && (
            <>
              <span className="font-sans text-xs text-[#555555]">/</span>
              <div className="flex items-center gap-x-1">
                <Link
                  href={`/groups/${currentGroup.id}`}
                  className="flex items-center gap-x-1.5 cursor-pointer"
                >
                  <Boxes size={14} strokeWidth={1.5} color="#555555" />
                  <span className="font-sans text-xs tracking-[-0.05em] font-normal text-[#EDEDED]">
                    {currentGroup.name}
                  </span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="hover:bg-[#1A1A1A] outline-0 border-0">
                      <ChevronsUpDown size={14} color="#555555" strokeWidth={1.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EDEDED] min-w-40">
                    <DropdownMenuGroup>
                      {groups.map((group) => (
                        <DropdownMenuItem
                          key={group.id}
                          onClick={() => router.push(`/groups/${group.id}`)}
                          className={`cursor-pointer gap-x-px text-xs font-sans tracking-[-0.05em] ${
                            group.id === currentGroup.id
                              ? "text-[#EDEDED]"
                              : "text-[#A1A1A1]"
                          }`}
                        >
                          <Boxes size={12} strokeWidth={1.5} className="mr-2" />
                          <div className="flex items-center w-full justify-between">
                            {group.name}
                            {group.id === currentGroup.id && (
                              <Check size={10} color="#555555" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                    <DropdownMenuItem
                      onClick={() => router.push("/groups/create")}
                      className="cursor-pointer text-xs font-sans tracking-[-0.05em] text-[#555555] hover:text-[#EDEDED]"
                    >
                      <Plus size={12} className="mr-2" />
                      New group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {/* Project switcher */}
          {currentGroup && (
            <>
              <span className="font-sans text-xs text-[#555555]">/</span>
              <div className="flex items-center gap-x-1">
                {currentProject ? (
                  <Link
                    href={`/groups/${currentGroup.id}/projects/${currentProject.slug}/dashboard`}
                    className="flex items-center gap-x-1.5 cursor-pointer"
                  >
                    <Box size={14} strokeWidth={1.5} color="#555555" />
                    <span className="font-sans text-xs tracking-[-0.05em] font-normal text-[#EDEDED]">
                      {currentProject.name}
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-x-1.5 text-[#555555]">
                    <Box size={14} strokeWidth={1.5} color="#555555" />
                    <span className="font-sans text-xs tracking-[-0.05em]">
                      Projects
                    </span>
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="hover:bg-[#1A1A1A] outline-0 border-0">
                      <ChevronsUpDown size={14} color="#555555" strokeWidth={1.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EDEDED] min-w-40">
                    <DropdownMenuGroup>
                      {projects.length === 0 ? (
                        <DropdownMenuItem
                          disabled
                          className="text-xs gap-x-px font-sans tracking-[-0.05em] text-[#555555]"
                        >
                          No projects yet
                        </DropdownMenuItem>
                      ) : (
                        projects.map((project) => (
                          <DropdownMenuItem
                            key={project.id}
                            onClick={() =>
                              router.push(
                                `/groups/${currentGroup.id}/projects/${project.slug}/dashboard`
                              )
                            }
                            className={`cursor-pointer gap-x-px text-xs font-sans tracking-[-0.05em] ${
                              project.slug === currentProject?.slug
                                ? "text-[#EDEDED]"
                                : "text-[#A1A1A1]"
                            }`}
                          >
                            <Box size={12} strokeWidth={1.5} className="mr-2" />
                            <div className="flex items-center w-full justify-between">
                              {project.name}
                              {project.slug === currentProject?.slug && (
                                <Check size={10} color="#555555" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/groups/${currentGroup.id}/projects/create`)
                      }
                      className="cursor-pointer text-xs font-sans tracking-[-0.05em] text-[#555555] hover:text-[#EDEDED]"
                    >
                      <Plus size={12} className="mr-2" />
                      New project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Avatar + account dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                size="sm"
                className="bg-[#1A1A1A] border border-[#2A2A2A] cursor-pointer"
              >
                <AvatarImage src={avatarUrl ?? ""} />
                <AvatarFallback className="text-xs text-[#A1A1A1]">
                  {userName?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EDEDED]">
              <DropdownMenuGroup>
                {userName && (
                  <DropdownMenuItem
                    disabled
                    className="text-xs font-sans tracking-[-0.05em] text-[#555555]"
                  >
                    {userName}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-xs font-sans tracking-[-0.05em] text-[#EDEDED]"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}