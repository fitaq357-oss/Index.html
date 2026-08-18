import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { CONTENT_PILLARS, type ContentPillar } from "../../../shared/contentConfig";
import { Loader2, Search, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export default function Research() {
  const [pillar, setPillar] = useState<ContentPillar>("AI & Automation");
  const [audience, setAudience] = useState("Urdu-English creators and freelancers");
  const [focus, setFocus] = useState("");
  const [report, setReport] = useState("");
  const research = trpc.ai.research.useMutation({ onSuccess: ({ report: nextReport }) => setReport(nextReport), onError: (error) => toast.error(error.message) });
  const submit = (event: FormEvent) => { event.preventDefault(); research.mutate({ pillar, audience, focus: focus || undefined }); };

  return <>
    <PageHeader eyebrow="Discover" title="Niche research" description="Turn a broad pillar into practical topics, keyword directions and hooks you can use this week." />
    <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Research brief</p>
        <label className="mt-5 block text-xs font-medium text-[#c7cec5]">Content pillar</label><select value={pillar} onChange={(e) => setPillar(e.target.value as ContentPillar)} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{CONTENT_PILLARS.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Audience</label><Input value={audience} onChange={(e) => setAudience(e.target.value)} className="mt-2 border-white/10 bg-[#121512] text-[#f7f4ed] placeholder:text-[#606860]" />
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Optional focus</label><textarea value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. beginner automation systems for freelancers" rows={4} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#121512] p-3 text-sm text-[#f7f4ed] outline-none placeholder:text-[#606860] focus:border-[#d6ff3f]/60" />
        <Button disabled={research.isPending} className="mt-5 h-11 w-full gap-2 rounded-xl bg-[#d6ff3f] font-semibold text-[#171a18] hover:bg-[#ebff8c]">{research.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Build research brief</Button>
        <p className="mt-3 text-center text-[10px] leading-4 text-[#7f897f]">Trend directions are strategic prompts, not verified real-time data.</p>
      </form>
      <section className="min-h-[540px] rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-8">
        {report ? <div className="prose prose-invert prose-sm max-w-none prose-headings:font-serif prose-headings:text-[#f7f4ed] prose-strong:text-[#d6ff3f] prose-p:text-[#c1c9c0] prose-li:text-[#c1c9c0]"><Streamdown>{report}</Streamdown></div> : <div className="grid min-h-[460px] place-items-center text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#d6ff3f]/20 bg-[#d6ff3f]/10 text-[#d6ff3f]"><Sparkles className="size-5" /></span><h2 className="mt-5 font-serif text-2xl">Find an angle worth making.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8e988e]">Select a pillar, add your audience, and get an Urdu-English research brief with actionable next steps.</p></div></div>}
      </section>
    </div>
  </>;
}
