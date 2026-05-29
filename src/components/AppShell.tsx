import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, ShoppingCart, Package, Wallet, FileText, Users, Scale } from "lucide-react";

const navMain = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pdv", label: "PDV / Vendas", icon: ShoppingCart },
  { to: "/estoque", label: "Estoque", icon: Package },
  { to: "/fluxo-de-caixa", label: "Fluxo de caixa", icon: Wallet },
  { to: "/nfe", label: "NF-e", icon: FileText },
] as const;

const navConfig = [
  { to: "/configuracoes/usuarios", label: "Usuários", icon: Users },
  { to: "/configuracoes/fiscal", label: "Fiscal", icon: Scale },
] as const;

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const NavItem = ({ to, label, Icon }: { to: string; label: string; Icon: typeof LayoutDashboard }) => {
    const active = pathname === to || pathname.startsWith(to + "/");
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-[220px] flex-col border-r border-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">G</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">GestãoPro</span>
        </div>
        <nav className="flex-1 space-y-6 p-3">
          <div>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Principal
            </p>
            <div className="space-y-1">
              {navMain.map((i) => (
                <NavItem key={i.to} to={i.to} label={i.label} Icon={i.icon} />
              ))}
            </div>
          </div>
          <div>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Configurações
            </p>
            <div className="space-y-1">
              {navConfig.map((i) => (
                <NavItem key={i.to} to={i.to} label={i.label} Icon={i.icon} />
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t border-sidebar-border p-3 text-xs text-sidebar-foreground/60">
          Carlos Menezes
          <div className="text-[10px] text-sidebar-foreground/40">Proprietário</div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-3">
            {actions}
            <span className="text-xs text-muted-foreground">{today}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              CM
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>

        <footer className="flex h-9 items-center justify-between border-t border-border bg-card px-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Sistema online · Sefaz conectada
          </span>
          <span>Ambiente: Produção · Último sync 14:32</span>
        </footer>
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "positive" | "negative" | "warning";
}) {
  const valueClass =
    tone === "positive"
      ? "text-primary"
      : tone === "negative"
        ? "text-destructive"
        : tone === "warning"
          ? "text-[oklch(0.78_0.15_75)]"
          : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Autorizada: "bg-primary/15 text-primary border-primary/30",
    Pendente: "bg-[oklch(0.78_0.15_75)]/15 text-[oklch(0.78_0.15_75)] border-[oklch(0.78_0.15_75)]/30",
    Cancelada: "bg-destructive/15 text-destructive border-destructive/30",
    Entrada: "bg-primary/15 text-primary border-primary/30",
    "Saída": "bg-destructive/15 text-destructive border-destructive/30",
    OK: "bg-primary/15 text-primary border-primary/30",
    "Estoque baixo": "bg-[oklch(0.78_0.15_75)]/15 text-[oklch(0.78_0.15_75)] border-[oklch(0.78_0.15_75)]/30",
    "Crítico": "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        styles[status] || "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}