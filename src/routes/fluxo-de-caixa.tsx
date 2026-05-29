import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, MetricCard, StatusBadge } from "@/components/AppShell";
import { brl } from "@/lib/format";
import { cashflowLast7Days, lancamentos as seed, type Lancamento } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/fluxo-de-caixa")({
  head: () => ({ meta: [{ title: "Fluxo de Caixa — GestãoPro" }] }),
  component: FluxoPage,
});

function FluxoPage() {
  const [items, setItems] = useState<Lancamento[]>(seed);
  const [open, setOpen] = useState(false);

  const totalEntradas = items.filter((i) => i.tipo === "Entrada").reduce((s, i) => s + i.valor, 0);
  const totalSaidas = items.filter((i) => i.tipo === "Saída").reduce((s, i) => s + i.valor, 0);

  const categorias = ["Vendas PDV", "Delivery", "Fornecedores", "Despesas fixas"];
  const breakdown = categorias.map((c) => ({
    cat: c,
    valor: items
      .filter((i) => i.categoria === c)
      .reduce((s, i) => s + (i.tipo === "Entrada" ? i.valor : -i.valor), 0),
  }));

  return (
    <AppShell
      title="Fluxo de Caixa"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => toast.success("Relatório exportado com sucesso")}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Novo lançamento
              </Button>
            </DialogTrigger>
            <NovoLancamentoModal
              onSubmit={(l) => {
                setItems((prev) => [l, ...prev]);
                setOpen(false);
                toast.success("Lançamento registrado");
              }}
            />
          </Dialog>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Saldo atual" value={brl(11250)} hint="Caixa aberto" />
        <MetricCard label="Entradas do mês" value={brl(38420)} hint={<span className="text-primary">+14% vs mês anterior</span>} tone="positive" />
        <MetricCard label="Saídas do mês" value={brl(27170)} hint={<span className="text-destructive">-6% vs mês anterior</span>} tone="negative" />
        <MetricCard label="Resultado do mês" value={brl(11250)} hint="Positivo" tone="positive" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <p className="text-sm text-muted-foreground">Entradas x Saídas — últimos 7 dias</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0 0)" vertical={false} />
                <XAxis dataKey="dia" stroke="oklch(0.7 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0 0)" fontSize={12} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.22 0 0)", border: "1px solid oklch(0.32 0 0)", borderRadius: 8 }}
                  formatter={(v: number) => brl(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="entradas" name="Entradas" fill="oklch(0.68 0.16 158)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas" fill="oklch(0.62 0.22 25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Resumo do dia</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Abertura do caixa</span>
              <span>{brl(8820)}</span>
            </div>
            {breakdown.map((b) => (
              <div key={b.cat} className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">{b.cat}</span>
                <span className={b.valor >= 0 ? "text-primary" : "text-destructive"}>
                  {b.valor >= 0 ? "+" : ""}{brl(b.valor)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-1 font-medium">
              <span>Saldo atual</span>
              <span className="text-primary">{brl(8820 + totalEntradas - totalSaidas)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <p className="text-sm text-muted-foreground">Lançamentos do dia</p>
        </div>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Hora</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descrição</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((i, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground">{i.hora}</td>
                  <td className="p-3"><StatusBadge status={i.tipo} /></td>
                  <td className="p-3">{i.descricao}</td>
                  <td className="p-3 text-muted-foreground">{i.categoria}</td>
                  <td className={`p-3 text-right font-medium ${i.tipo === "Entrada" ? "text-primary" : "text-destructive"}`}>
                    {i.tipo === "Entrada" ? "+" : "-"} {brl(i.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
      <p className="text-sm">Nenhum lançamento registrado hoje.</p>
    </div>
  );
}

function NovoLancamentoModal({ onSubmit }: { onSubmit: (l: Lancamento) => void }) {
  const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!descricao.trim()) e.descricao = "Informe a descrição";
    if (!categoria) e.categoria = "Selecione a categoria";
    if (!valor || Number(valor) <= 0) e.valor = "Informe um valor válido";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Verifique os campos do formulário");
      return;
    }
    const now = new Date();
    onSubmit({
      hora: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      tipo,
      descricao,
      categoria,
      valor: Number(valor),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo lançamento</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as "Entrada" | "Saída")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Entrada">Entrada</SelectItem>
              <SelectItem value="Saída">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Descrição</Label>
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: Venda PDV #00129" />
          {errors.descricao && <p className="mt-1 text-xs text-destructive">{errors.descricao}</p>}
        </div>
        <div>
          <Label>Categoria</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Vendas PDV">Vendas PDV</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Fornecedores">Fornecedores</SelectItem>
              <SelectItem value="Despesas fixas">Despesas fixas</SelectItem>
            </SelectContent>
          </Select>
          {errors.categoria && <p className="mt-1 text-xs text-destructive">{errors.categoria}</p>}
        </div>
        <div>
          <Label>Valor (R$)</Label>
          <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
          {errors.valor && <p className="mt-1 text-xs text-destructive">{errors.valor}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button onClick={submit}>Salvar lançamento</Button>
      </DialogFooter>
    </DialogContent>
  );
}