import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/configuracoes/fiscal")({
  head: () => ({ meta: [{ title: "Fiscal — GestãoPro" }] }),
  component: () => (
    <AppShell title="Configurações fiscais">
      <div className="rounded-lg border border-border bg-card p-8">
        <h2 className="text-lg font-semibold">Parâmetros fiscais</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Configure certificado digital A1/A3, série da NF-e, regime tributário (Simples Nacional / Lucro
          Presumido), CFOPs padrão, alíquotas de ICMS e integração com a Sefaz. Esta seção será expandida
          nas próximas versões.
        </p>
      </div>
    </AppShell>
  ),
});