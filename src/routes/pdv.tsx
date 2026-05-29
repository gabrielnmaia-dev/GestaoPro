import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { brl } from "@/lib/format";
import { produtos } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pdv")({
  head: () => ({ meta: [{ title: "PDV — GestãoPro" }] }),
  component: PDVPage,
});

interface CartItem {
  nome: string;
  preco: number;
  qtd: number;
}

function PDVPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirm, setConfirm] = useState(false);

  const add = (nome: string, preco: number) => {
    setCart((prev) => {
      const found = prev.find((i) => i.nome === nome);
      if (found) return prev.map((i) => (i.nome === nome ? { ...i, qtd: i.qtd + 1 } : i));
      return [...prev, { nome, preco, qtd: 1 }];
    });
  };
  const setQty = (nome: string, delta: number) =>
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i.nome !== nome) return [i];
        const q = i.qtd + delta;
        if (q <= 0) return [];
        return [{ ...i, qtd: q }];
      }),
    );
  const remove = (nome: string) => setCart((prev) => prev.filter((i) => i.nome !== nome));

  const subtotal = cart.reduce((s, i) => s + i.preco * i.qtd, 0);

  return (
    <AppShell title="PDV / Vendas">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Produtos</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {produtos.map((p) => (
                <button
                  key={p.nome}
                  onClick={() => add(p.nome, p.preco)}
                  className="flex flex-col rounded-md border border-border bg-background p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="text-xs text-muted-foreground">{p.categoria}</span>
                  <span className="mt-1 line-clamp-2 text-sm font-medium">{p.nome}</span>
                  <span className="mt-2 text-primary font-semibold">{brl(p.preco)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Carrinho atual</p>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <ShoppingCart className="mb-2 h-10 w-10 opacity-40" />
              <p className="text-sm">Carrinho vazio. Selecione produtos.</p>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {cart.map((i) => (
                <li key={i.nome} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{i.nome}</p>
                      <p className="text-xs text-muted-foreground">{brl(i.preco)}</p>
                    </div>
                    <button onClick={() => remove(i.nome)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.nome, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{i.qtd}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.nome, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold">{brl(i.preco * i.qtd)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-primary">{brl(subtotal)}</span>
            </div>
            <Button className="mt-3 w-full" disabled={cart.length === 0} onClick={() => setConfirm(true)}>
              Finalizar venda
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar venda?</AlertDialogTitle>
            <AlertDialogDescription>
              Total da venda: <span className="font-semibold text-primary">{brl(subtotal)}</span>. Esta ação registra a venda no caixa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success(`Venda finalizada — ${brl(subtotal)}`);
                setCart([]);
                setConfirm(false);
              }}
            >
              Confirmar venda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}