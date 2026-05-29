import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/configuracoes/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — GestãoPro" }] }),
  component: () => (
    <AppShell title="Usuários">
      <div className="rounded-lg border border-border bg-card p-8">
        <h2 className="text-lg font-semibold">Gestão de usuários</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cadastre operadores de caixa, gerentes e administradores. Defina perfis de acesso para PDV,
          fluxo de caixa, estoque e emissão fiscal. Esta seção será expandida nas próximas versões.
        </p>
      </div>
    </AppShell>
  ),
});