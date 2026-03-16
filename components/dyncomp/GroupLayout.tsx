"use client";

import {
  Boxes,
  FolderGit2,
  Users,
  BarChart2,
  CreditCard,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type GroupLayoutProps = {
  groupId: string;
};

export function GroupLayout({ groupId }: GroupLayoutProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { href: `/groups/${groupId}`, icon: Boxes, label: "Projects" },
    { href: `/groups/${groupId}/team`, icon: Users, label: "Team" },
    { href: `/groups/${groupId}/usage`, icon: BarChart2, label: "Usage" },
    { href: `/groups/${groupId}/billing`, icon: CreditCard, label: "Billing" },
  ];
  
  const bottomItems = [
    { href: `/groups/${groupId}/settings`, icon: Settings2, label: "Settings" },
  ];

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
      </div>
    </aside>
  );
}