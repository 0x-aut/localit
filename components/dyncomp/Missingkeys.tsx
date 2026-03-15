"use client";

import Image from "next/image";
import { useState } from "react";

type MissingKey = {
  locale: string;
  localeCountry: string;
  localeFlag: string;
  keyName: string;
  affectedRoutes: string[];
  status: "missing" | "outdated";
};

const mockMissingKeys: MissingKey[] = [
  {
    locale: "de",
    localeCountry: "Germany",
    localeFlag: "DE",
    keyName: "checkout.button.confirm",
    affectedRoutes: ["/checkout", "/cart", "/summary"],
    status: "missing",
  },
  {
    locale: "de",
    localeCountry: "Germany",
    localeFlag: "DE",
    keyName: "nav.settings.title",
    affectedRoutes: ["/settings"],
    status: "outdated",
  },
  {
    locale: "de",
    localeCountry: "Germany",
    localeFlag: "DE",
    keyName: "dashboard.empty.message",
    affectedRoutes: ["/dashboard"],
    status: "missing",
  },
  {
    locale: "ja",
    localeCountry: "Japan",
    localeFlag: "JP",
    keyName: "checkout.button.confirm",
    affectedRoutes: ["/checkout", "/cart", "/summary"],
    status: "missing",
  },
  {
    locale: "ja",
    localeCountry: "Japan",
    localeFlag: "JP",
    keyName: "pricing.plan.free.description",
    affectedRoutes: ["/pricing"],
    status: "missing",
  },
  {
    locale: "ja",
    localeCountry: "Japan",
    localeFlag: "JP",
    keyName: "auth.login.subtitle",
    affectedRoutes: ["/login"],
    status: "missing",
  },
  {
    locale: "ja",
    localeCountry: "Japan",
    localeFlag: "JP",
    keyName: "settings.profile.save",
    affectedRoutes: ["/settings"],
    status: "outdated",
  },
  {
    locale: "ja",
    localeCountry: "Japan",
    localeFlag: "JP",
    keyName: "nav.help.tooltip",
    affectedRoutes: ["/dashboard", "/runs"],
    status: "missing",
  },
  {
    locale: "es",
    localeCountry: "Spain",
    localeFlag: "ES",
    keyName: "footer.legal.privacy",
    affectedRoutes: ["/"],
    status: "outdated",
  },
];

const STATUS_STYLES = {
  missing: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B]/20",
    label: "missing",
  },
  outdated: {
    bg: "bg-[#3d9eff]/10",
    text: "text-[#3d9eff]",
    border: "border-[#3d9eff]/20",
    label: "outdated",
  },
};

function LocaleFilterPill({
  label,
  flag,
  isActive,
  onClick,
}: {
  label: string;
  flag?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-x-1.5 px-2 py-0.5 rounded-sm border text-xs font-sans tracking-[-0.05em] transition-all duration-150 cursor-pointer ${
        isActive
          ? "bg-[#1A1A1A] border-[#2A2A2A] text-[#EDEDED]"
          : "bg-transparent border-transparent text-[#555555] hover:text-[#A1A1A1] hover:border-[#2A2A2A]"
      }`}
    >
      {flag && (
        <Image
          src={`https://flagsapi.com/${flag}/flat/16.png`}
          alt={label}
          width={14}
          height={14}
        />
      )}
      {label}
    </button>
  );
}

export function MissingKeysTable({
  missingKeys = mockMissingKeys,
}: {
  missingKeys?: MissingKey[];
}) {
  const [activeLocale, setActiveLocale] = useState<string>("all");

  // Build unique locale list for filter pills
  const locales = Array.from(
    new Map(
      missingKeys.map((k) => [
        k.locale,
        { code: k.locale, country: k.localeCountry, flag: k.localeFlag },
      ])
    ).values()
  );

  // Filter + sort by most affected routes
  const filtered = missingKeys
    .filter((k) => activeLocale === "all" || k.locale === activeLocale)
    .sort((a, b) => b.affectedRoutes.length - a.affectedRoutes.length);

  return (
    <div className="flex flex-col gap-y-2 w-full px-1 py-2">
      {/* Header + filters */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm font-normal tracking-[-0.05em]">
          Missing Keys
          {missingKeys.length > 0 && (
            <span className="font-mono text-xs text-[#555555] ml-2">
              {missingKeys.length}
            </span>
          )}
        </span>
        <div className="flex items-center gap-x-1">
          <LocaleFilterPill
            label="All"
            isActive={activeLocale === "all"}
            onClick={() => setActiveLocale("all")}
          />
          {locales.map((locale) => (
            <LocaleFilterPill
              key={locale.code}
              label={locale.code}
              flag={locale.flag}
              isActive={activeLocale === locale.code}
              onClick={() => setActiveLocale(locale.code)}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <span className="font-sans text-sm tracking-[-0.05em] text-[#22C55E]">
            ✓ All keys translated
          </span>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left py-1.5 px-2 font-sans text-xs font-normal tracking-[-0.05em] text-[#555555] w-[12%]">
                  Locale
                </th>
                <th className="text-left py-1.5 px-2 font-sans text-xs font-normal tracking-[-0.05em] text-[#555555] w-[40%]">
                  Key
                </th>
                <th className="text-left py-1.5 px-2 font-sans text-xs font-normal tracking-[-0.05em] text-[#555555] w-[35%]">
                  Affected Routes
                </th>
                <th className="text-left py-1.5 px-2 font-sans text-xs font-normal tracking-[-0.05em] text-[#555555] w-[13%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((key, i) => {
                const style = STATUS_STYLES[key.status];
                return (
                  <tr
                    key={`${key.locale}-${key.keyName}-${i}`}
                    className="border-b border-[#2A2A2A] hover:bg-[#111111] transition-colors duration-100"
                  >
                    {/* Locale */}
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-x-1.5">
                        <Image
                          src={`https://flagsapi.com/${key.localeFlag}/flat/16.png`}
                          alt={key.localeCountry}
                          width={14}
                          height={14}
                        />
                        <span className="font-mono text-xs tracking-[-0.05em] text-[#A1A1A1]">
                          {key.locale}
                        </span>
                      </div>
                    </td>

                    {/* Key name */}
                    <td className="py-2 px-2">
                      <span className="font-mono text-xs tracking-[-0.05em] text-[#EDEDED]">
                        {key.keyName}
                      </span>
                    </td>

                    {/* Affected routes */}
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {key.affectedRoutes.map((route) => (
                          <span
                            key={route}
                            className="font-mono text-xs tracking-[-0.05em] text-[#555555] bg-[#1A1A1A] border border-[#2A2A2A] px-1.5 py-0.5 rounded-xs"
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-2">
                      <span
                        className={`font-sans text-xs tracking-[-0.05em] px-1.5 py-0.5 rounded-xs border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}