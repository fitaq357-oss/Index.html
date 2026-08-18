import { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-white/8 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d6ff3f]">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-[#f7f4ed] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#9fa99e]">{description}</p>
      </div>
      {action}
    </header>
  );
}
