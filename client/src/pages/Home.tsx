import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CONTENT_PILLARS, PILLAR_DESCRIPTIONS } from "../../../shared/contentConfig";
import { ArrowUpRight, CalendarDays, FileText, Lightbulb, Plus, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

const pillarAccents = ["#d6ff3f", "#9ed7ff", "#ffbf8d", "#d7a9ff"];

export default function Home() {
  const [, navigate] = useLocation();
  const overview = trpc.content.overview.useQuery();
  const content = trpc.content.list.useQuery();
  const counts = overview.data ?? { total: 0, ideas: 0, drafts: 0, ready: 0, published: 0, scheduled: 0 };
  const latest = content.data?.slice(0, 4) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Creator operating system"
        title="Make your next post the easy decision."
        description="Your strategy, bilingual ideas and publishing flow — built around the work that matters this week."
        action={<Button onClick={() => navigate("/studio")} className="h-11 gap-2 rounded-xl bg-[#d6ff3f] px-5 font-semibold text-[#171a18] hover:bg-[#ebff8c]"><Plus className="size-4" /> Create content</Button>}
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "All content", value: counts.total, icon: FileText },
          { label: "Ideas", value: counts.ideas, icon: Lightbulb },
          { label: "Drafts", value: counts.drafts, icon: Sparkles },
          { label: "Ready", value: counts.ready, icon: ArrowUpRight },
          { label: "Published", value: counts.published, icon: ArrowUpRight },
          { label: "Scheduled", value: counts.scheduled, icon: CalendarDays },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-white/8 bg-[#181b19] p-4 transition hover:-translate-y-0.5 hover:border-white/15">
            <Icon className="size-4 text-[#d6ff3f]" />
            <p className="mt-5 font-serif text-3xl tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-[#859085]">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#858f85]">Your ecosystem</p><h2 className="mt-1 font-serif text-2xl">Four focused pillars</h2></div>
          <button onClick={() => navigate("/strategy")} className="text-sm font-semibold text-[#d6ff3f] hover:text-[#efffaa]">Edit strategy →</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CONTENT_PILLARS.map((pillar, index) => {
            const pillarCount = content.data?.filter((item) => item.pillar === pillar).length ?? 0;
            return (
              <button key={pillar} onClick={() => navigate("/studio")} className="group rounded-2xl border border-white/8 bg-[#181b19] p-5 text-left transition hover:border-white/20 hover:bg-[#202420]">
                <span className="block size-2 rounded-full" style={{ background: pillarAccents[index] }} />
                <h3 className="mt-6 font-serif text-xl leading-tight group-hover:text-[#d6ff3f]">{pillar}</h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-[#929c92]">{PILLAR_DESCRIPTIONS[pillar]}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/7 pt-4 text-xs text-[#8b958b]"><span>{pillarCount} pieces</span><ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-9 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#858f85]">Recent work</p><h2 className="mt-1 font-serif text-2xl">Content in motion</h2></div><button onClick={() => navigate("/ideas")} className="text-sm text-[#d6ff3f]">View bank →</button></div>
          {latest.length ? <div className="mt-5 divide-y divide-white/7">{latest.map((item) => <div key={item.id} className="flex items-center gap-3 py-4 first:pt-0"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[.03] text-[10px] font-bold text-[#d6ff3f]">{item.platform.slice(0, 2).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-[#879187]">{item.pillar} · {item.format}</p></div><StatusPill status={item.status} /></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-white/12 bg-white/[.02] p-8 text-center"><Sparkles className="mx-auto size-5 text-[#d6ff3f]" /><p className="mt-3 text-sm font-medium">Your idea bank starts here.</p><p className="mt-1 text-xs text-[#879187]">Create a bilingual caption, hook or script in Content Studio.</p><button onClick={() => navigate("/studio")} className="mt-4 text-xs font-bold text-[#d6ff3f]">Generate your first piece →</button></div>}
        </div>
        <div className="rounded-2xl bg-[#d6ff3f] p-6 text-[#171a18]">
          <p className="text-xs font-bold uppercase tracking-[.18em] opacity-60">Quick start</p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05]">A calmer way to make consistent content.</h2>
          <p className="mt-4 text-sm leading-6 opacity-70">Research one pillar, generate an Urdu-English post, then drag it into your week.</p>
          <div className="mt-7 space-y-2 text-sm font-semibold"><button onClick={() => navigate("/research")} className="block hover:underline">01. Find a strong angle</button><button onClick={() => navigate("/studio")} className="block hover:underline">02. Turn it into content</button><button onClick={() => navigate("/calendar")} className="block hover:underline">03. Put it on the calendar</button></div>
        </div>
      </section>
    </>
  );
}
