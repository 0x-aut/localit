"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, X, Plus, Check } from "lucide-react";
import { createClient, } from "@/lib/supabase/client";
import { createGroup } from "./actions";

type Step = "group" | "invite";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  // Step
  const [step, setStep] = useState<Step>("group");

  // Group fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Invite fields
  const [inviteInput, setInviteInput] = useState("");
  const [invites, setInvites] = useState<string[]>([]);

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

  const addInvite = () => {
    const email = inviteInput.trim().toLowerCase();
    if (!email || invites.includes(email)) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setInvites((prev) => [...prev, email]);
    setInviteInput("");
    setError(null);
  };

  const removeInvite = (email: string) => {
    setInvites((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInvite();
    }
  };

  const isGroupValid = name.trim() !== "" && slug.trim() !== "";

  const handleSubmit = async () => {
    if (!isGroupValid) return;
    setIsSubmitting(true);
    setError(null);
  
    const result = await createGroup(name.trim(), slug.trim(), invites);
    
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4">
      <div className="flex flex-col gap-y-8 w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col gap-y-1">
          <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
            {step === "group" ? "Create your group" : "Invite your team"}
          </span>
          <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
            {step === "group"
              ? "A group is your workspace — it contains all your projects and runs"
              : "Invite teammates by email — they'll get access once they sign in"}
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-x-2">
          {(["group", "invite"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-x-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-xs transition-all duration-150 ${
                  step === s
                    ? "border-[#107A4D] bg-[#107A4D]/15 text-[#22C55E]"
                    : s === "group" && step === "invite"
                    ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                    : "border-[#2A2A2A] text-[#555555]"
                }`}
              >
                {s === "group" && step === "invite"
                  ? <Check size={12} strokeWidth={1.25} color="#FFFFFF" />
                  : i + 1}
              </div>
              <span
                className={`font-sans text-xs tracking-[-0.05em] ${
                  step === s ? "text-[#EDEDED]" : "text-[#555555]"
                }`}
              >
                {s === "group" ? "Group" : "Team"}
              </span>
              {i === 0 && (
                <div className="w-8 h-px bg-[#2A2A2A] mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Group */}
        {step === "group" && (
          <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
            {/* Name */}
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

            {error && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
                {error}
              </span>
            )}

            <button
              onClick={() => isGroupValid && setStep("invite")}
              disabled={!isGroupValid}
              className={`flex items-center justify-center gap-x-2 w-full py-2 rounded-sm font-sans text-sm tracking-[-0.05em] transition-all duration-150 ${
                isGroupValid
                  ? "bg-[#107A4D] text-white cursor-pointer hover:bg-[#0D6B42]"
                  : "bg-[#1A1A1A] text-[#555555] cursor-not-allowed border border-[#2A2A2A]"
              }`}
            >
              Continue
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Step 2 — Invite */}
        {step === "invite" && (
          <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
            {/* Email input */}
            <div className="flex flex-col gap-y-1.5">
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
                Email address
              </span>
              <div className="flex gap-x-2">
                <input
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteInput}
                  onChange={(e) => {
                    setInviteInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-sans text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150"
                />
                <button
                  onClick={addInvite}
                  className="flex items-center justify-center px-2.5 py-1.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={13} color="#A1A1A1" />
                </button>
              </div>
              {error && (
                <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
                  {error}
                </span>
              )}
            </div>

            {/* Invite list */}
            {invites.length > 0 && (
              <div className="flex flex-col gap-y-1">
                {invites.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-sm bg-[#0A0A0A] border border-[#2A2A2A]"
                  >
                    <span className="font-sans text-xs tracking-[-0.05em] text-[#A1A1A1]">
                      {email}
                    </span>
                    <button
                      onClick={() => removeInvite(email)}
                      className="cursor-pointer"
                    >
                      <X size={11} color="#555555" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-y-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-x-2 w-full py-2 rounded-sm font-sans text-sm tracking-[-0.05em] transition-all duration-150 ${
                  !isSubmitting
                    ? "bg-[#107A4D] text-white cursor-pointer hover:bg-[#0D6B42]"
                    : "bg-[#1A1A1A] text-[#555555] cursor-not-allowed border border-[#2A2A2A]"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    {invites.length > 0
                      ? `Create group + invite ${invites.length} member${invites.length > 1 ? "s" : ""}`
                      : "Create group"}
                    <ChevronRight size={14} />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep("group")}
                className="font-sans text-xs tracking-[-0.05em] text-[#555555] hover:text-[#A1A1A1] transition-colors duration-150 cursor-pointer text-center"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}