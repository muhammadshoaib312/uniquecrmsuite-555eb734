import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Building2,
  Target,
  CheckSquare,
  CalendarDays,
  CalendarRange,
  Activity,
  FileText,
  Megaphone,
  Package,
  FileSpreadsheet,
  Receipt,
  LifeBuoy,
  BarChart3,
  Settings,
  Search,
  Bell,
  Sparkles,
  Bot,
  Workflow,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Palette,
  Command as CommandIcon,
} from "lucide-react";
import { ThemeToggle, UserMenu } from "@/components/ui-kit";
import { CommandPalette } from "@/components/command-palette";
import { NotificationCenter, useNotificationCount } from "@/components/notifications";
import { QuickCreateMenu } from "@/components/quick-create-menu";


const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: UserPlus },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/deals", label: "Deals", icon: Target },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
  { to: "/calendar", label: "Calendar", icon: CalendarRange },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/products", label: "Products", icon: Package },
  { to: "/quotes", label: "Quotes", icon: FileSpreadsheet },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/automation", label: "Automation", icon: Workflow },
  { to: "/design-system", label: "Design System", icon: Palette },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSeed, setPaletteSeed] = useState("");
  const unread = useNotificationCount();

  // Global ⌘K / Ctrl+K keyboard shortcut for the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteSeed("");
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auth routes render without the shell chrome
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return <>{children}</>;
  }


  return (
    <div className="relative min-h-screen">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.24 310 / 0.6), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl animate-float-alt"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.25 340 / 0.55), transparent 70%)" }}
      />

      <div className="relative flex min-h-screen">
        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`glass-strong fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-white/5 p-3 transition-[width,transform] duration-300 ease-out lg:sticky lg:top-0 lg:translate-x-0 ${
            collapsed ? "lg:w-[76px]" : "lg:w-64"
          } ${mobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0"}`}
        >
          <div className="mb-6 flex items-center justify-between gap-2 px-1.5 pt-1">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <div className="gradient-brand-bg glow-shadow-sm grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-base font-semibold tracking-tight">
                    Unique<span className="gradient-text">CRM</span>
                  </span>
                  <span className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    by UniqueWeb
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "gradient-brand-bg text-white glow-shadow-sm"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  {active && !collapsed && (
                    <span
                      aria-hidden
                      className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                      style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow-sm)" }}
                    />
                  )}
                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? "" : "group-hover:scale-110"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="glass mt-3 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[color:var(--brand-pink)]" />
                <span className="text-xs font-semibold">Development Preview</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                UniqueCRM is in active development. New modules ship weekly.
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="mt-3 hidden items-center justify-center gap-2 rounded-lg border border-white/5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground lg:flex"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 px-4 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="glass grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => { setPaletteSeed(searchQ); setPaletteOpen(true); }}
              className="glass relative ml-0 hidden h-10 max-w-md flex-1 items-center gap-2 rounded-lg pl-3 pr-2 text-sm text-muted-foreground transition hover:text-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate text-left">
                {searchQ || "Search leads, contacts, deals, tasks…"}
              </span>
              <kbd className="hidden items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium md:inline-flex">
                <CommandIcon className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            <div className="relative ml-auto flex items-center gap-2">
              <QuickCreateMenu />
              <ThemeToggle />
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="glass relative grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[image:var(--gradient-brand)] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_var(--brand-pink)]">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
              <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
              <UserMenu />
            </div>
          </header>

          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            initialQuery={paletteSeed}
          />

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        </div>
      </div>
    </div>
  );
}
