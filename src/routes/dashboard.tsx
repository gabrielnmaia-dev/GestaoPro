import { createFileRoute } from "@tanstack/react-router";
import { AppShell, MetricCard, StatusBadge } from "@/components/AppShell";
import { brl } from "@/lib/format";
import { nfes, salesLast7Days } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GestãoPro" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const recent = nfes.slice(0, 4);
  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Vendas hoje" value={brl(3840)} hint={<span className="text-primary">+12% vs ontem</span>} />
        <MetricCard label="Saldo do caixa" value={brl(11250)} hint={<span className="text-primary">Caixa aberto</span>} />
        <MetricCard label="NF-e emitidas hoje" value="27" hint={<span className="text-[oklch(0.78_0.15_75)]">2 pendentes</span>} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <p className="text-sm text-muted-foreground">Vendas — últimos 7 dias</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0 0)" vertical={false} />
                <XAxis dataKey="dia" stroke="oklch(0.7 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0 0)" fontSize={12} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.22 0 0)", border: "1px solid oklch(0.32 0 0)", borderRadius: 8 }}
                  formatter={(v: number) => brl(v)}
                />
                <Bar dataKey="vendas" fill="oklch(0.68 0.16 158)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Fluxo de caixa</p>
          <div className="mt-4 space-y-4 text-sm">
            <Row label="Entradas" value={brl(4320)} tone="positive" />
            <Row label="Saídas" value={`- ${brl(1890)}`} tone="negative" />
            <Row label="Saldo do dia" value={`+ ${brl(2430)}`} tone="positive" />
            <div className="border-t border-border pt-3">
              <Row label="Saldo acumulado" value={brl(11250)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Últimas NF-e emitidas</p>
        <ul className="mt-3 divide-y divide-border">
          {recent.map((n) => (
            <li key={n.numero} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={n.status} />
                <span className="text-sm">NF-e {n.numero}</span>
                <span className="text-xs text-muted-foreground">{n.destinatario}</span>
              </div>
              <span className="text-sm font-medium">{brl(n.valor)}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  const cls = tone === "positive" ? "text-primary" : tone === "negative" ? "text-destructive" : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${cls}`}>{value}</span>
    </div>
  );
}