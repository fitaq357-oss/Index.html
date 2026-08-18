import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Compass,
  FolderHeart,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Compass, label: "Strategy", path: "/strategy" },
  { icon: Search, label: "Research", path: "/research" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Clapperboard, label: "AI Reels", path: "/reels" },
  { icon: PenLine, label: "Content Studio", path: "/studio" },
  { icon: FolderHeart, label: "Idea Bank", path: "/ideas" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location, navigate] = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#111313]" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111313] px-5 text-[#f7f4ed] grid place-items-center">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl border border-[#d6ff3f]/20 bg-[#d6ff3f]/10 text-[#d6ff3f] shadow-[0_0_50px_rgba(214,255,63,.1)]">
            <Sparkles className="size-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#a0a89d]">Content command center</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight">Sign in to build with focus.</h1>
          <p className="mt-4 text-sm leading-6 text-[#aeb5aa]">Your strategy, research, content and calendar stay together in one private workspace.</p>
          <Button onClick={() => startLogin()} className="mt-8 w-full bg-[#d6ff3f] text-[#1b1d18] hover:bg-[#ebff8c]">Sign in to Content Pilot</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111313] text-[#f7f4ed] selection:bg-[#d6ff3f] selection:text-[#161714] lg:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-white/8 bg-[#171a18] lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r">
        <div className="flex h-[88px] items-center justify-between px-5 lg:px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-left" aria-label="Go to overview">
            <span className="grid size-9 place-items-center rounded-xl bg-[#d6ff3f] text-[#161714] shadow-[0_8px_24px_rgba(214,255,63,.14)]"><Sparkles className="size-[18px]" /></span>
            <span>
              <span className="block font-serif text-xl leading-none tracking-tight">Content Pilot</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#848d83]">Strategy system</span>
            </span>
          </button>
          <PanelLeft className="hidden size-4 text-[#6f776e] lg:block" />
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:px-4 lg:py-3" aria-label="Primary navigation">
          {menuItems.map(({ icon: Icon, label, path }) => {
            const active = location === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all lg:mb-1 lg:w-full ${active ? "bg-[#d6ff3f] text-[#171a18] shadow-[0_8px_20px_rgba(214,255,63,.1)]" : "text-[#9aa39a] hover:bg-white/5 hover:text-[#f7f4ed]"}`}
              >
                <Icon className="size-[17px]" />
                <span className="font-medium">{label}</span>
                {active && <ChevronRight className="ml-auto hidden size-4 lg:block" />}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 mt-auto hidden rounded-2xl border border-white/8 bg-[linear-gradient(145deg,rgba(214,255,63,.12),rgba(214,255,63,0))] p-4 lg:block">
          <p className="text-xs font-semibold text-[#d6ff3f]">Create with momentum</p>
          <p className="mt-1 text-xs leading-5 text-[#adb5aa]">Plan your week, then turn one good idea into five native posts.</p>
          <button onClick={() => navigate("/studio")} className="mt-3 text-xs font-semibold text-[#f7f4ed] hover:text-[#d6ff3f]">Open content studio →</button>
        </div>

        <div className="flex items-center gap-3 border-t border-white/8 p-4 lg:mt-5">
          <Avatar className="size-9 border border-white/10 bg-[#252a25]">
            <AvatarFallback className="bg-transparent text-xs text-[#d6ff3f]">{user.name?.slice(0, 1).toUpperCase() || "C"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#f7f4ed]">{user.name || "Creator"}</p>
            <p className="truncate text-xs text-[#808980]">Personal workspace</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 text-[#7d867d] transition hover:bg-white/5 hover:text-[#f7f4ed]" aria-label="Sign out"><LogOut className="size-4" /></button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
