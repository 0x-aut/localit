"use client";

import {
  House,
  VectorSquare,
  GitBranch,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: House, label: "Overview" },
  { href: "/runs", icon: VectorSquare, label: "Runs" },
  { href: "/repos", icon: GitBranch, label: "Repositories" },
];

const bottomItems = [
  { href: "/settings", icon: Settings2, label: "Settings" },
];

export function ProjectLayout() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`absolute left-0 top-0 z-50 flex flex-col gap-y-3 border-r border-[#2A2A2A] h-full py-2 px-2 bg-[#111111] transition-all duration-200 overflow-hidden ${
        isExpanded ? "w-40" : "w-10.5"
      }`}
    >
      <div className="flex flex-col gap-y-1 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-x-2.5 rounded-sm px-1 py-1 transition-all duration-200 
                ${isExpanded ? "" : "justify-center"}
                ${isActive ? "bg-[#1A1A1A]" : "hover:bg-[#1A1A1A]"}
              `}
            >
              <Icon
                size={16}
                color={isActive ? "#EDEDED" : "#555555"}
                strokeWidth={1.5}
                className="shrink-0"
              />
              {isExpanded && (
                <span
                  className={`text-xs whitespace-nowrap ${
                    isActive ? "text-[#EDEDED]" : "text-[#A1A1A1]"
                  }`}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}

        <hr className="border-[#2A2A2A]" />

        {bottomItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-x-2.5 rounded-sm px-1 py-1 transition-all duration-200 ${
                isActive ? "bg-[#1A1A1A]" : "hover:bg-[#1A1A1A]"
              }`}
            >
              <Icon
                size={16}
                color={isActive ? "#EDEDED" : "#555555"}
                strokeWidth={1.5}
                className="shrink-0"
              />
              {isExpanded && (
                <span
                  className={`text-xs whitespace-nowrap ${
                    isActive ? "text-[#EDEDED]" : "text-[#A1A1A1]"
                  }`}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}