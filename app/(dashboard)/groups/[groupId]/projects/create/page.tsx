"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { createProject } from "./actions";

import * as React from 'react'

export default function CreateProjectPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = React.use(params);
  
  const router = useRouter();

  const [repoUrl, setRepoUrl] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(
        val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      );
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setSlug(
      val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    );
  };

  // Extract repo name from URL e.g. https://github.com/acme/frontend → acme/frontend
  const repoName = (() => {
    try {
      const url = new URL(repoUrl);
      return url.pathname.replace(/^\//, "").replace(/\.git$/, "");
    } catch {
      return repoUrl;
    }
  })();

  const isValid =
    repoUrl.trim() !== "" && name.trim() !== "" && slug.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);

    
    const result = await createProject({
      groupId: groupId,
      name: name.trim(),
      slug: slug.trim(),
      repoUrl: repoUrl.trim(),
      repoName,
    });

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-4 py-4 gap-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-81.25 gap-y-0.5">
          <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
            New Project
          </span>
          <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
            Connect a GitHub repository to start auditing its locales
          </span>
        </div>
        <button
          onClick={() => router.back()}
          className="text-[#555555] hover:text-[#EDEDED] transition-colors duration-150 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-y-4 max-w-85.25 w-85.25">
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          {/* Repo URL */}
          <div className="flex flex-col gap-y-1.5">
            <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
              GitHub Repository URL
            </span>
            <input
              type="text"
              placeholder="https://github.com/acme/frontend"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150"
            />
            {repoName && repoUrl.includes("github.com") && (
              <span className="font-mono text-xs tracking-[-0.05em] text-[#555555]">
                → {repoName}
              </span>
            )}
          </div>

          {/* Project name */}
          <div className="flex flex-col gap-y-1.5">
            <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
              Project name
            </span>
            <input
              type="text"
              placeholder="Frontend"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-sans text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-y-1.5">
            <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
              Slug
            </span>
            <div className="flex items-center border border-[#2A2A2A] rounded-sm bg-[#0A0A0A] overflow-hidden focus-within:border-[#3A3A3A] transition-colors duration-150">
              <span className="font-mono text-xs text-[#555555] px-2.5 py-1.5 border-r border-[#2A2A2A] bg-[#111111] shrink-0">
                localit.dev/p/
              </span>
              <input
                type="text"
                placeholder="frontend"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 bg-transparent px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none"
              />
            </div>
          </div>

          {error && (
            <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
              {error}
            </span>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`flex items-center justify-center gap-x-2 w-full py-2 rounded-sm font-sans text-sm tracking-[-0.05em] transition-all duration-150 ${
              isValid && !isSubmitting
                ? "bg-[#107A4D] text-white cursor-pointer hover:bg-[#0D6B42]"
                : "bg-[#1A1A1A] text-[#555555] cursor-not-allowed border border-[#2A2A2A]"
            }`}
          >
            {isSubmitting ? (
              <div className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <ChevronRight size={14} />
                Create Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}