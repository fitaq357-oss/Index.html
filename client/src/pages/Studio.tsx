import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { CONTENT_FORMATS, CONTENT_PILLARS, CONTENT_PLATFORMS, TONE_PRESETS, WRITING_STYLE_PRESETS, type ContentFormat, type ContentPillar, type ContentPlatform } from "../../../shared/contentConfig";
import { Copy, Loader2, Save, Sparkles, WandSparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export default function Studio() {
  const utils = trpc.useUtils();
  const [pillar, setPillar] = useState<ContentPillar>("AI & Automation");
  const [platform, setPlatform] = useState<ContentPlatform>("Instagram");
  const [format, setFormat] = useState<ContentFormat>("Caption");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Urdu-English creators and freelancers");
  const [tonePreset, setTonePreset] = useState<(typeof TONE_PRESETS)[number]>("Helpful & clear");
  const [customTone, setCustomTone] = useState("");
  const [stylePreset, setStylePreset] = useState<(typeof WRITING_STYLE_PRESETS)[number]>("Natural everyday voice");
  const [customStyle, setCustomStyle] = useState("");
  const [brief, setBrief] = useState("");
  const [generated, setGenerated] = useState("");
  const generate = trpc.ai.generate.useMutation({ onSuccess: ({ content }) => setGenerated(content), onError: (error) => toast.error(error.message) });
  const save = trpc.content.create.useMutation({ onSuccess: async () => { await utils.content.list.invalidate(); await utils.content.overview.invalidate(); toast.success("Saved to your idea bank"); }, onError: (error) => toast.error(error.message) });
  const effectiveTone = customTone.trim() ? `${tonePreset}. Custom tone note: ${customTone.trim()}` : tonePreset;
  const effectiveStyle = customStyle.trim() ? `${stylePreset}. Custom style guidance: ${customStyle.trim()}` : stylePreset;
  const submit = (event: FormEvent) => { event.preventDefault(); generate.mutate({ pillar, platform, format, topic, audience, tone: effectiveTone, style: effectiveStyle, brief: brief || undefined }); };
  const copy = async () => { await navigator.clipboard.writeText(generated); toast.success("Content copied"); };

  return <>
    <PageHeader eyebrow="Create" title="Content studio" description="Set the topic, platform, tone and writing style — then create content that sounds much more like you." />
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Creative brief</p>
        <div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs font-medium text-[#c7cec5]">Pillar<select value={pillar} onChange={(event) => setPillar(event.target.value as ContentPillar)} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{CONTENT_PILLARS.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-medium text-[#c7cec5]">Platform<select value={platform} onChange={(event) => setPlatform(event.target.value as ContentPlatform)} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{CONTENT_PLATFORMS.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Format<select value={format} onChange={(event) => setFormat(event.target.value as ContentFormat)} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{CONTENT_FORMATS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Topic<Input value={topic} onChange={(event) => setTopic(event.target.value)} required placeholder="e.g. My 3-step client onboarding automation" className="mt-2 border-white/10 bg-[#121512] text-[#f7f4ed] placeholder:text-[#606860]" /></label>
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Audience<Input value={audience} onChange={(event) => setAudience(event.target.value)} required className="mt-2 border-white/10 bg-[#121512] text-[#f7f4ed]" /></label>
        <div className="mt-5 rounded-xl border border-[#d6ff3f]/15 bg-[#d6ff3f]/[.035] p-4"><div className="flex items-center gap-2"><WandSparkles className="size-4 text-[#d6ff3f]" /><p className="text-xs font-bold uppercase tracking-[.14em] text-[#d6ff3f]">Voice controls</p></div><label className="mt-4 block text-xs font-medium text-[#c7cec5]">Tone<select value={tonePreset} onChange={(event) => setTonePreset(event.target.value as (typeof TONE_PRESETS)[number])} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{TONE_PRESETS.map((item) => <option key={item}>{item}</option>)}</select></label><Input value={customTone} onChange={(event) => setCustomTone(event.target.value)} placeholder="Optional: add a custom tone note" className="mt-2 border-white/10 bg-[#181b19] text-[#f7f4ed] placeholder:text-[#606860]" /><label className="mt-4 block text-xs font-medium text-[#c7cec5]">Writing style<select value={stylePreset} onChange={(event) => setStylePreset(event.target.value as (typeof WRITING_STYLE_PRESETS)[number])} className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-[#121512] px-3 text-sm text-[#f7f4ed] outline-none focus:border-[#d6ff3f]/60">{WRITING_STYLE_PRESETS.map((item) => <option key={item}>{item}</option>)}</select></label><textarea value={customStyle} onChange={(event) => setCustomStyle(event.target.value)} rows={3} placeholder="Optional: e.g. simple sentences, no hype, use one personal example" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#181b19] p-3 text-sm text-[#f7f4ed] outline-none placeholder:text-[#606860] focus:border-[#d6ff3f]/60" /></div>
        <label className="mt-4 block text-xs font-medium text-[#c7cec5]">Extra context<textarea value={brief} onChange={(event) => setBrief(event.target.value)} rows={3} placeholder="Any key points or offer to mention?" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#121512] p-3 text-sm text-[#f7f4ed] outline-none placeholder:text-[#606860] focus:border-[#d6ff3f]/60" /></label>
        <Button disabled={generate.isPending || !topic.trim()} className="mt-5 h-11 w-full gap-2 rounded-xl bg-[#d6ff3f] font-semibold text-[#171a18] hover:bg-[#ebff8c]">{generate.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate natural Urdu-English content</Button>
      </form>
      <section className="min-h-[600px] rounded-2xl border border-white/8 bg-[#181b19] p-5 sm:p-8">
        {generated ? <><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6ff3f]">Generated {format}</p><p className="mt-1 text-sm text-[#a2aca1]">{pillar} · {platform} · {tonePreset}</p></div><div className="flex gap-2"><Button type="button" onClick={copy} variant="outline" className="border-white/12 bg-transparent text-[#d4dbd3] hover:bg-white/5 hover:text-white"><Copy className="mr-2 size-4" />Copy</Button><Button type="button" disabled={save.isPending} onClick={() => save.mutate({ title: topic, body: generated, pillar, platform, format, status: "Draft" })} className="bg-[#d6ff3f] text-[#171a18] hover:bg-[#ebff8c]">{save.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}Save</Button></div></div><div className="prose prose-invert prose-sm mt-7 max-w-none whitespace-pre-wrap prose-headings:font-serif prose-p:leading-7 prose-p:text-[#d1d8d0] prose-strong:text-[#d6ff3f]"><Streamdown>{generated}</Streamdown></div></> : <div className="grid min-h-[500px] place-items-center text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#d6ff3f]/20 bg-[#d6ff3f]/10 text-[#d6ff3f]"><Sparkles className="size-5" /></span><h2 className="mt-5 font-serif text-2xl">Make it sound like you.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8e988e]">Choose a base voice, then add your own tone and style notes. Your content stays natural in Roman Urdu-English mix.</p></div></div>}
      </section>
    </div>
  </>;
}
