"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";

type Issue = {
  type: "overflow" | "pixel_diff" | "missing_screenshot";
  selector?: string;
  description: string;
  diffPct?: number;
};

type RouteScreenshots = {
  baseline: string;
  current: string;
  diff: string;
};

type RouteItemProps = {
  route: string;
  hasIssues: boolean;
  diffPct: number;
  screenshots: RouteScreenshots;
  issues: Issue[];
};

const mockRoutes: RouteItemProps[] = [
  {
    route: "/",
    hasIssues: false,
    diffPct: 0.4,
    screenshots: {
      baseline: "/mock/baseline-home.png",
      current: "/mock/current-home.png",
      diff: "/mock/diff-home.png",
    },
    issues: [],
  },
  {
    route: "/checkout",
    hasIssues: true,
    diffPct: 12.3,
    screenshots: {
      baseline: "/mock/baseline-checkout.png",
      current: "/mock/current-checkout.png",
      diff: "/mock/diff-checkout.png",
    },
    issues: [
      {
        type: "overflow",
        selector: "button.checkout-cta",
        description: "Button text overflows container by 14px",
      },
      {
        type: "pixel_diff",
        description: "12.3% pixel difference vs baseline",
        diffPct: 12.3,
      },
    ],
  },
  {
    route: "/dashboard",
    hasIssues: true,
    diffPct: 5.1,
    screenshots: {
      baseline: "/mock/baseline-dashboard.png",
      current: "/mock/current-dashboard.png",
      diff: "/mock/diff-dashboard.png",
    },
    issues: [
      {
        type: "overflow",
        selector: "nav li:nth-child(3)",
        description: "Nav item bleeds outside parent by 8px",
      },
    ],
  },
];

function ScreenshotPanel({
  screenshots,
  selectedLocale,
}: {
  screenshots: RouteScreenshots;
  selectedLocale?: string;
}) {
  const panels = [
    { label: "Baseline (en)", src: screenshots.baseline },
    { label: `Current (${selectedLocale ?? "?"})`, src: screenshots.current },
    { label: "Diff", src: screenshots.diff },
  ];

  return (
    <div className="flex gap-x-2 overflow-x-auto pb-2">
      {panels.map(({ label, src }) => (
        <div key={label} className="flex flex-col gap-y-1 shrink-0">
          <span className="font-sans text-xs text-[#A1A1A1] tracking-[-0.05em]">
            {label}
          </span>
          <div className="w-48 h-32 bg-[#1A1A1A] rounded-sm border border-[#2A2A2A] overflow-hidden relative">
            {src ? (
              <Image
                src={src}
                alt={label}
                fill
                className="object-cover object-top"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="font-sans text-xs text-[#555555] tracking-[-0.05em]">
                  No screenshot
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function IssuesList({ issues, diffPct }: { issues: Issue[]; diffPct: number }) {
  return (
    <div className="flex flex-col gap-y-1 mt-2">
      <div className="flex items-center gap-x-1.5">
        <span className="font-sans text-xs text-[#A1A1A1] tracking-[-0.05em]">
          Pixel diff:
        </span>
        <span
          className={`font-mono text-xs tracking-[-0.05em] ${
            diffPct > 3 ? "text-[#EF4444]" : "text-[#22C55E]"
          }`}
        >
          {diffPct.toFixed(1)}%
        </span>
      </div>

      {issues.length === 0 ? (
        <span className="font-sans text-xs text-[#22C55E] tracking-[-0.05em]">
          No issues detected
        </span>
      ) : (
        <div className="flex flex-col gap-y-1">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="flex items-start gap-x-2 py-1 px-1.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A]"
            >
              <CircleX size={12} color="#EF4444" className="mt-0.5 shrink-0" />
              <div className="flex flex-col gap-y-0.5">
                {issue.selector && (
                  <span className="font-mono text-xs text-[#A1A1A1] tracking-[-0.05em]">
                    {issue.selector}
                  </span>
                )}
                <span className="font-sans text-xs text-[#555555] tracking-[-0.05em]">
                  {issue.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type RouteViewProps = {
  routes?: RouteItemProps[];
  selectedLocale?: string;
};

export function RouteView({
  routes = mockRoutes,
  selectedLocale = "de",
}: RouteViewProps) {
  const defaultOpen = routes!.find((r) => r.hasIssues)?.route ?? routes![0]?.route;

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen ? [defaultOpen] : []}
      className="w-full flex flex-col gap-y-0.5"
    >
      {routes!.map((item) => (
        <AccordionItem
          key={item.route}
          value={item.route}
          className="border border-[#2A2A2A] rounded-sm px-2 bg-[#111111]"
        >
          <AccordionTrigger className="flex gap-x-2 items-center justify-between py-2 hover:no-underline">
            <div className="flex items-center gap-x-2">
              {item.hasIssues ? (
                <CircleX size={12} color="#EF4444" />
              ) : (
                <CircleCheck size={12} color="#22C55E" />
              )}
              <span className="font-mono text-xs tracking-[-0.05em] text-[#EDEDED]">
                {item.route}
              </span>
            </div>
            {item.hasIssues && (
              <span className="font-sans text-xs text-[#EF4444] tracking-[-0.05em] mr-2">
                {item.issues.length} issue{item.issues.length > 1 ? "s" : ""}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 pb-3">
            <ScreenshotPanel
              screenshots={item.screenshots}
              selectedLocale={selectedLocale}
            />
            <IssuesList issues={item.issues} diffPct={item.diffPct} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}