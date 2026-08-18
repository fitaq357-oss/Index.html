import React from "react";
import type { ContentStatus } from "../../../shared/contentConfig";

const styles: Record<ContentStatus, string> = {
  Idea: "border-[#b4c3ff]/30 bg-[#b4c3ff]/10 text-[#cdd7ff]",
  Draft: "border-[#ffd788]/30 bg-[#ffd788]/10 text-[#ffe1a5]",
  Ready: "border-[#a2e8bd]/30 bg-[#a2e8bd]/10 text-[#c6f5d7]",
  Published: "border-[#d6ff3f]/30 bg-[#d6ff3f]/10 text-[#d6ff3f]",
};

export function StatusPill({ status }: { status: ContentStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] ${styles[status]}`}>{status}</span>;
}
