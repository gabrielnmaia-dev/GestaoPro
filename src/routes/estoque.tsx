import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, MetricCard, StatusBadge } from "@/components/AppShell";
import { brl } from "@/lib/format";
import { produtos as seed, produtoStatus, type Produto } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/estoque")({
  head: () => ({ meta: [{ title: "Estoque — GestãoPro" }] }),
  component: EstoquePage,
});

function EstoquePage() {
  const [items, setItems] = useState<Produto[]>(seed);
  const [open, setOpen] = useState(false);

  const total = items.length;
  const criticos = items.filter((p) => produtoStatus(p) !== "OK").length;
  const valor = items.reduce((s, p) => s + p.qtd * p.preco, 0);

  return (
    <AppShell
      title="Estoque"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Novo produto</Button>
          </DialogTrigger>
          <NovoProdutoModal
            onSubmit={(p) => {
              setItems((prev) => [p, ...prev]);
              setOpen(false);
              toast.success(`Produto "${p.nome}" cadastrado`);
            }}
          />
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Total de itens" value={String(total)} hint="Produtos cadastrados" />
        <MetricCard label="Itens críticos" value={String(criticos)} hint="Abaixo do mínimo" tone={criticos > 0 ? "warning" : "default"} />
        <MetricCard label="Valor em estoque" value={brl(valor)} hint="Preço de venda" />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <p className="text-sm text-muted-foreground">Produtos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Qtd atual</th>
                <th className="p-3 text-right">Qtd mínima</th>
                <th className="p-3">Unidade</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((p) => (
                <tr key={p.nome} className="hover:bg-muted/30">
                  <td className="p-3 font-medium">{p.nome}</td>
                  <td className="p-3 text-muted-foreground">{p.categoria}</td>
                  <td className="p-3 text-right">{p.qtd}</td>
                  <td className="p-3 text-right text-muted-foreground">{p.qtdMin}</td>
                  <td className="p-3 text-muted-foreground">{p.unidade}</td>
                  <td className="p-3"><StatusBadge status={produtoStatus(p)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function NovoProdutoModal({ onSubmit }: { onSubmit: (p: Produto) => void }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [qtd, setQtd] = useState("");
  const [qtdMin, setQtdMin] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [preco, setPreco] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = "Informe o nome";
    if (!categoria.trim()) e.categoria = "Informe a categoria";
    if (!qtd || Number(qtd) < 0) e.qtd = "Qtd inválida";
    if (!qtdMin || Number(qtdMin) < 0) e.qtdMin = "Qtd mínima inválida";
    if (!preco || Number(preco) <= 0) e.preco = "Preço inválido";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Verifique os campos do formulário");
      return;
    }
    onSubmit({ nome, categoria, qtd: Number(qtd), qtdMin: Number(qtdMin), unidade, preco: Number(preco) });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo produto</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Nome</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
        </div>
        <div>
          <Label>Categoria</Label>
          <Input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Mercearia" />
          {errors.categoria && <p className="mt-1 text-xs text-destructive">{errors.categoria}</p>}
        </div>
        <div>
          <Label>Unidade</Label>
          <Input value={unidade} onChange={(e) => setUnidade(e.target.value)} placeholder="un / kg / L" />
        </div>
        <div>
          <Label>Qtd atual</Label>
          <Input type="number" value={qtd} onChange={(e) => setQtd(e.target.value)} />
          {errors.qtd && <p className="mt-1 text-xs text-destructive">{errors.qtd}</p>}
        </div>
        <div>
          <Label>Qtd mínima</Label>
          <Input type="number" value={qtdMin} onChange={(e) => setQtdMin(e.target.value)} />
          {errors.qtdMin && <p className="mt-1 text-xs text-destructive">{errors.qtdMin}</p>}
        </div>
        <div className="col-span-2">
          <Label>Preço (R$)</Label>
          <Input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
          {errors.preco && <p className="mt-1 text-xs text-destructive">{errors.preco}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button onClick={submit}>Cadastrar produto</Button>
      </DialogFooter>
    </DialogContent>
  );
}