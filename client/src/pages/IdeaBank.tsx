import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { CONTENT_PILLARS, CONTENT_PLATFORMS, CONTENT_STATUSES, type ContentPillar, type ContentPlatform, type ContentStatus } from "../../../shared/contentConfig";
import { Loader2, Plus, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function IdeaBank() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [pillar, setPillar] = useState<ContentPillar | "All">("All");
  const [platform, setPlatform] = useState<ContentPlatform | "All">("All");
  const [status, setStatus] = useState<ContentStatus | "All">("All");
  const [search, setSearch] = useState("");
  const items = trpc.content.list.useQuery({
    pillar: pillar === "All" ? undefined : pillar,
    platform: platform === "All" ? undefined : platform,
    status: status === "All" ? undefined : status,
  });
  const displayedItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items.data ?? [];
    return (items.data ?? []).filter((item) => `${item.title} ${item.body} ${item.pillar} ${item.platform} ${item.format}`.toLowerCase().includes(term));
  }, [items.data, search]);
  const update = trpc.content.update.useMutation({
    onSuccess: async () => { await utils.content.list.invalidate(); await utils.content.overview.invalidate(); toast.success("Post status updated"); },
    onError: (error) => toast.error(error.message),
  });

  return <>
    <PageHeader eyebrow="Organize" title="Idea bank" description="Every saved idea, draft and polished post — organized by pillar and platform, ready when you need it." action={<Button onClick={() => navigate("/studio")} className="h-11 gap-2 rounded-xl bg-[#d6ff3f] text-[#171a18] hover:bg-[#ebff8c]"><Plus className="size-4" /> New content</Button>} />
    <div className="rounded-2xl border border-white/8 bg-[#181b19] p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center"><span className="shrink-0 text-xs font-semibold uppercase tracking-[.14em] text-[#818c81]">Find content</span><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#778177]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, post copy, pillar or platform" className="border-white/10 bg-[#121512] pl-9 text-[#f7f4ed] placeholder:text-[#606860]" /></div></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><select value={pillar} onChange={(event) => setPillar(event.target.value as ContentPillar | "All")} className="h-10 rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#d3dbd2] outline-none focus:border-[#d6ff3f]/60">{["All", ...CONTENT_PILLARS].map((option) => <option key={option}>{option}</option>)}</select><select value={platform} onChange={(event) => setPlatform(event.target.value as ContentPlatform | "All")} className="h-10 rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#d3dbd2] outline-none focus:border-[#d6ff3f]/60">{["All", ...CONTENT_PLATFORMS].map((option) => <option key={option}>{option}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus | "All")} className="h-10 rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#d3dbd2] outline-none focus:border-[#d6ff3f]/60">{["All", ...CONTENT_STATUSES].map((option) => <option key={option}>{option}</option>)}</select></div>
    </div>
    <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-[#181b19]">{items.isLoading ? <div className="grid min-h-72 place-items-center"><Loader2 className="size-5 animate-spin text-[#d6ff3f]" /></div> : displayedItems.length ? <div className="divide-y divide-white/7">{displayedItems.map((item) => <article key={item.id} className="flex flex-col gap-4 p-5 transition hover:bg-white/[.02] sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-serif text-lg">{item.title}</p><StatusPill status={item.status} /></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#909b90]">{item.body}</p><p className="mt-3 text-xs text-[#7e897e]">{item.pillar} · {item.platform} · {item.format}</p></div><label className="shrink-0 text-xs text-[#899489]">Status<select value={item.status} onChange={(event) => update.mutate({ id: item.id, status: event.target.value as ContentStatus })} className="mt-1 block h-9 rounded-lg border border-white/10 bg-[#121512] px-2 text-sm text-[#e4eae3] outline-none focus:border-[#d6ff3f]/60">{CONTENT_STATUSES.map((option) => <option key={option}>{option}</option>)}</select></label></article>)}</div> : <div className="grid min-h-80 place-items-center text-center"><div><SearchX className="mx-auto size-6 text-[#738073]" /><h2 className="mt-4 font-serif text-2xl">No ideas in this view.</h2><p className="mt-2 text-sm text-[#879287]">Create a post in Content Studio, or loosen your search and filters.</p><button onClick={() => navigate("/studio")} className="mt-4 text-sm font-semibold text-[#d6ff3f]">Open content studio →</button></div></div>}</section>
  </>;
}
