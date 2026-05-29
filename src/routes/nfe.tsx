import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, MetricCard, StatusBadge } from "@/components/AppShell";
import { brl } from "@/lib/format";
import { nfes as seed, type NFe } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Download, Plus, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/nfe")({
  head: () => ({ meta: [{ title: "NF-e — GestãoPro" }] }),
  component: NFePage,
});

function NFePage() {
  const [items, setItems] = useState<NFe[]>(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [openNew, setOpenNew] = useState(false);
  const [confirmResend, setConfirmResend] = useState<NFe | null>(null);
  const pageSize = 6;

  const filtered = useMemo(
    () =>
      items.filter((n) => {
        const matchQ = !q || `${n.numero} ${n.destinatario} ${n.cnpj}`.toLowerCase().includes(q.toLowerCase());
        const matchS = status === "todos" || n.status === status;
        return matchQ && matchS;
      }),
    [items, q, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totals = {
    hoje: items.filter((n) => n.emissao.startsWith("24/04")).length,
    pendentes: items.filter((n) => n.status === "Pendente").length,
    canceladas: items.filter((n) => n.status === "Cancelada").length,
    total: items.filter((n) => n.status !== "Cancelada").reduce((s, n) => s + n.valor, 0),
  };

  return (
    <AppShell
      title="Emissão de NF-e"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => toast.success("Lista exportada em XML")}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nova NF-e</Button>
            </DialogTrigger>
            <NovaNFeModal
              onSubmit={(n) => {
                setItems((p) => [n, ...p]);
                setOpenNew(false);
                toast.success(`NF-e ${n.numero} enviada para a Sefaz`);
              }}
            />
          </Dialog>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Emitidas hoje" value={String(totals.hoje)} hint={<span className="text-primary">Enviado para Sefaz</span>} />
        <MetricCard label="Pendentes" value={String(totals.pendentes)} hint={<span className="text-[oklch(0.78_0.15_75)]">Aguardando</span>} tone="warning" />
        <MetricCard label="Canceladas" value={String(totals.canceladas)} hint="Hoje" tone="negative" />
        <MetricCard label="Total emitido" value={brl(totals.total)} hint={<span className="text-primary">+8% vs mês ant.</span>} />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Busca por número, CNPJ ou destinatário" className="pl-9" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="Autorizada">Autorizada</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" className="w-[160px]" defaultValue="2026-05-01" />
          <Input type="date" className="w-[160px]" defaultValue="2026-05-15" />
        </div>

        <div className="mt-4 overflow-x-auto">
          {view.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <FileText className="mb-3 h-10 w-10 opacity-50" />
              <p className="text-sm">Nenhuma NF-e encontrada com os filtros atuais.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Número</th>
                  <th className="p-3">Emissão</th>
                  <th className="p-3">Destinatário</th>
                  <th className="p-3">CNPJ / CPF</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Chave NF-e</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {view.map((n) => (
                  <tr key={n.numero} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{n.numero}</td>
                    <td className="p-3 text-muted-foreground">{n.emissao}</td>
                    <td className="p-3">{n.destinatario}</td>
                    <td className="p-3 text-muted-foreground">{n.cnpj}</td>
                    <td className="p-3 text-right font-medium">{brl(n.valor)}</td>
                    <td className="p-3"><StatusBadge status={n.status} /></td>
                    <td className="p-3 text-xs text-muted-foreground truncate max-w-[180px]">{n.chave}</td>
                    <td className="p-3">
                      {n.status === "Pendente" ? (
                        <Button size="sm" variant="outline" onClick={() => setConfirmResend(n)}>Reenviar</Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => toast.message(`Visualizando ${n.numero}`)}>Ver</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: pages }).map((_, i) => (
            <Button key={i} size="sm" variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="icon" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!confirmResend} onOpenChange={(o) => !o && setConfirmResend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reenviar NF-e {confirmResend?.numero}?</AlertDialogTitle>
            <AlertDialogDescription>
              A nota será reenviada para a Sefaz. Confirme antes de continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmResend) {
                  setItems((p) =>
                    p.map((x) => (x.numero === confirmResend.numero ? { ...x, status: "Autorizada", chave: "3523 " + Math.random().toString().slice(2, 6) + " ..." } : x)),
                  );
                  toast.success(`NF-e ${confirmResend.numero} reenviada com sucesso`);
                }
                setConfirmResend(null);
              }}
            >
              Confirmar reenvio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function NovaNFeModal({ onSubmit }: { onSubmit: (n: NFe) => void }) {
  const [destinatario, setDestinatario] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [cfop, setCfop] = useState("5102");
  const [ncm, setNcm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!destinatario.trim()) e.destinatario = "Informe o destinatário";
    if (!cnpj.trim()) e.cnpj = "Informe o CNPJ/CPF";
    if (!produto.trim()) e.produto = "Informe o produto/serviço";
    if (!valor || Number(valor) <= 0) e.valor = "Informe um valor válido";
    if (!ncm.trim()) e.ncm = "Informe o NCM";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Verifique os campos do formulário");
      return;
    }
    const next = Math.floor(28 + Math.random() * 100);
    const now = new Date();
    const stamp = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    onSubmit({
      numero: `#${String(next).padStart(6, "0")}`,
      emissao: stamp,
      destinatario,
      cnpj,
      valor: Number(valor),
      status: "Autorizada",
      chave: `3523 ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ...`,
    });
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Nova NF-e</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Destinatário</Label>
          <Input value={destinatario} onChange={(e) => setDestinatario(e.target.value)} placeholder="Nome / razão social" />
          {errors.destinatario && <p className="mt-1 text-xs text-destructive">{errors.destinatario}</p>}
        </div>
        <div>
          <Label>CNPJ / CPF</Label>
          <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
          {errors.cnpj && <p className="mt-1 text-xs text-destructive">{errors.cnpj}</p>}
        </div>
        <div>
          <Label>Valor (R$)</Label>
          <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
          {errors.valor && <p className="mt-1 text-xs text-destructive">{errors.valor}</p>}
        </div>
        <div className="col-span-2">
          <Label>Produto / Serviço</Label>
          <Input value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Descrição do item" />
          {errors.produto && <p className="mt-1 text-xs text-destructive">{errors.produto}</p>}
        </div>
        <div>
          <Label>CFOP</Label>
          <Input value={cfop} onChange={(e) => setCfop(e.target.value)} placeholder="5102" />
        </div>
        <div>
          <Label>NCM</Label>
          <Input value={ncm} onChange={(e) => setNcm(e.target.value)} placeholder="2106.90.10" />
          {errors.ncm && <p className="mt-1 text-xs text-destructive">{errors.ncm}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button onClick={submit}>Emitir NF-e</Button>
      </DialogFooter>
    </DialogContent>
  );
}