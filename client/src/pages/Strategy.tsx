import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { CONTENT_PILLARS, CONTENT_PLATFORMS, PILLAR_DESCRIPTIONS, type ContentPillar } from "../../../shared/contentConfig";
import { Check, Loader2, Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const defaultGoals = CONTENT_PLATFORMS.map((platform) => ({ platform, weeklyPosts: platform === "Instagram" ? 4 : 2 }));
const defaultPillarTopics = CONTENT_PILLARS.map((pillar) => ({ pillar, subtopics: [pillar === "AI & Automation" ? "Practical workflows" : "Beginner to advanced learning"] }));

export default function Strategy() {
  const strategy = trpc.strategy.get.useQuery();
  const utils = trpc.useUtils();
  const [audience, setAudience] = useState("Creators and freelancers who want practical, simple systems.");
  const [pillarTopics, setPillarTopics] = useState(defaultPillarTopics);
  const [drafts, setDrafts] = useState<Record<ContentPillar, string>>(() => Object.fromEntries(CONTENT_PILLARS.map((pillar) => [pillar, ""])) as Record<ContentPillar, string>);
  const [goals, setGoals] = useState(defaultGoals);

  useEffect(() => {
    if (!strategy.data) return;
    setAudience(strategy.data.targetAudience);
    setPillarTopics(CONTENT_PILLARS.map((pillar) => ({ pillar, subtopics: strategy.data?.pillarSubtopics.find((saved) => saved.pillar === pillar)?.subtopics ?? ["Practical workflows"] })));
    setGoals(defaultGoals.map((goal) => ({ ...goal, weeklyPosts: strategy.data?.postingGoals.find((saved) => saved.platform === goal.platform)?.weeklyPosts ?? goal.weeklyPosts })));
  }, [strategy.data]);

  const save = trpc.strategy.save.useMutation({ onSuccess: async () => { await utils.strategy.get.invalidate(); toast.success("Strategy saved"); }, onError: (error) => toast.error(error.message) });
  const submit = (event: FormEvent) => { event.preventDefault(); save.mutate({ targetAudience: audience, pillarSubtopics: pillarTopics, postingGoals: goals }); };
  const addTopic = (pillar: ContentPillar) => { const topic = drafts[pillar].trim(); if (!topic) return; setPillarTopics(pillarTopics.map((entry) => entry.pillar === pillar && !entry.subtopics.includes(topic) ? { ...entry, subtopics: [...entry.subtopics, topic] } : entry)); setDrafts({ ...drafts, [pillar]: "" }); };
  const removeTopic = (pillar: ContentPillar, topic: string) => setPillarTopics(pillarTopics.map((entry) => entry.pillar === pillar && entry.subtopics.length > 1 ? { ...entry, subtopics: entry.subtopics.filter((item) => item !== topic) } : entry));

  return <>
    <PageHeader eyebrow="Foundation" title="Content strategy" description="Give every pillar its own recurring angles, then set one clear rhythm for all five platforms." />
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Who this is for</p><label className="mt-5 block text-sm font-medium">Target audience</label><textarea value={audience} onChange={(event) => setAudience(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#121512] p-3 text-sm leading-6 text-[#f7f4ed] outline-none transition placeholder:text-[#606860] focus:border-[#d6ff3f]/60" /><p className="mt-2 text-xs text-[#849084]">Keep it clear: who they are, what they want, and what gets in their way.</p></section>
        <section className="rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Pillar-specific sub-topics</p><p className="mt-2 text-sm leading-6 text-[#9ba59a]">Choose repeatable angles for each fixed content pillar.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{pillarTopics.map((entry) => <div key={entry.pillar} className="rounded-xl border border-white/8 bg-[#121512] p-4"><p className="text-sm font-medium text-[#f4f7f3]">{entry.pillar}</p><p className="mt-1 text-xs leading-5 text-[#7f897f]">{PILLAR_DESCRIPTIONS[entry.pillar]}</p><div className="mt-3 flex flex-wrap gap-1.5">{entry.subtopics.map((topic) => <span key={topic} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.03] px-2.5 py-1.5 text-[11px] text-[#c9d0c8]">{topic}<button type="button" onClick={() => removeTopic(entry.pillar, topic)} className="text-[#839083] hover:text-[#ff9f92]" aria-label={`Remove ${topic}`}><X className="size-3" /></button></span>)}</div><div className="mt-3 flex gap-2"><Input value={drafts[entry.pillar]} onChange={(event) => setDrafts({ ...drafts, [entry.pillar]: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTopic(entry.pillar); } }} placeholder="Add sub-topic" className="h-9 border-white/10 bg-[#181b19] text-xs text-[#f7f4ed] placeholder:text-[#606860]" /><Button type="button" onClick={() => addTopic(entry.pillar)} variant="outline" className="h-9 border-white/12 bg-transparent px-3 text-[#d6ff3f] hover:bg-white/5 hover:text-[#d6ff3f]"><Plus className="size-4" /></Button></div></div>)}</div></section>
      </div>
      <div className="space-y-6"><section className="rounded-2xl border border-white/8 bg-[#181b19] p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Weekly publishing goals</p><div className="mt-4 space-y-3">{goals.map((goal, index) => <div key={goal.platform} className="flex items-center justify-between"><span className="text-sm text-[#cbd2ca]">{goal.platform}</span><label className="flex items-center gap-2 text-xs text-[#7f897f]">posts<input value={goal.weeklyPosts} type="number" min={0} max={21} onChange={(event) => setGoals(goals.map((item, itemIndex) => itemIndex === index ? { ...item, weeklyPosts: Number(event.target.value) } : item))} className="w-14 rounded-lg border border-white/10 bg-[#121512] px-2 py-1.5 text-right text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60" /></label></div>)}</div></section><div className="rounded-2xl border border-[#d6ff3f]/15 bg-[#d6ff3f]/[.04] p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Strategy signal</p><p className="mt-2 text-sm leading-6 text-[#bdc6bc]">A clear set of angles makes it easier to turn one topic into native content for multiple platforms.</p></div><Button type="submit" disabled={save.isPending || pillarTopics.some((entry) => entry.subtopics.length === 0)} className="h-11 w-full gap-2 rounded-xl bg-[#d6ff3f] font-semibold text-[#171a18] hover:bg-[#ebff8c]">{save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save strategy</Button></div>
    </form>
  </>;
}
