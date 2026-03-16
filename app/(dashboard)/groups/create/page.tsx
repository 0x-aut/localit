"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CreateGroupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const isValid = name.trim() !== "" && slug.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setIsSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("groups")
      .insert({ name: name.trim(), slug: slug.trim(), owner_id: user.id })
      .select("id")
      .single();

    if (insertError) {
      setError(
        insertError.message.includes("unique")
          ? "That slug is already taken — try a different one"
          : insertError.message
      );
      setIsSubmitting(false);
      return;
    }

    router.push(`/groups/${data.id}`);
  };

  return (
    <div className="flex flex-col w-full h-full px-4 py-4 gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-0.5">
          <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
            Create Group
          </span>
          <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
            A group contains your projects and their audit runs
          </span>
        </div>
        <button
          onClick={() => router.back()}
          className="text-[#555555] hover:text-[#EDEDED] transition-colors duration-150 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-y-4 max-w-md">
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          {/* Group name */}
          <div className="flex flex-col gap-y-1.5">
            <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
              Group name
            </span>
            <input
              type="text"
              placeholder="Acme Inc"
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
                localit.dev/
              </span>
              <input
                type="text"
                placeholder="acme-inc"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 bg-transparent px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
              {error}
            </span>
          )}

          {/* Submit */}
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
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}