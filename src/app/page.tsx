"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AGENTES,
  KPIS,
  ROADMAP,
  SERVICOS,
  type AgenteStatus,
} from "@/lib/catalog";
import {
  Bot,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  MessageSquareText,
  Settings,
  ShieldAlert,
  Smartphone,
  Store,
  Users,
} from "lucide-react";

type AuthState = "loading" | "guest" | "admin";
type SectionId = "dashboard" | "servicos" | "agentes" | "leads" | "config";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "servicos", label: "Serviços", icon: Store },
  { id: "agentes", label: "Agentes", icon: MessageSquareText },
  { id: "leads", label: "Leads", icon: Users },
  { id: "config", label: "Configurações", icon: Settings },
];

const GRUPOS_SERVICOS = Array.from(new Set(SERVICOS.map((s) => s.grupo)));

export default function OpenBotPainel() {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [section, setSection] = useState<SectionId>("dashboard");
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      setAuth(res.ok ? "admin" : "guest");
    } catch {
      setAuth("guest");
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setLoginError(data.error || "Falha no login.");
        return;
      }
      setPassword("");
      setAuth("admin");
      toast({ title: "Bem-vindo de volta!", description: "Sessão iniciada com segurança." });
    } catch {
      setLoginError("Não foi possível conectar ao servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuth("guest");
    setEmail("");
    toast({ title: "Sessão encerrada." });
  }

  async function handleInstall() {
    if (!installEvt) return;
    await installEvt.prompt();
    const { outcome } = await installEvt.userChoice;
    if (outcome === "accepted") {
      toast({ title: "Aplicativo instalado!", description: "Abra pela tela inicial do seu celular." });
    }
    setInstallEvt(null);
  }

  /* ---------- Telas ---------- */

  if (auth === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Carregando o painel…</p>
      </div>
    );
  }

  if (auth === "guest") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Image
                src="/icons/icon-192.png"
                alt="Logo OpenBot"
                width={80}
                height={80}
                className="rounded-2xl"
                priority
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">OpenBot</h1>
                <p className="text-sm text-muted-foreground">
                  Painel do Clodoaldo — serviços, agentes e leads
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entrar no painel</CardTitle>
                <CardDescription>
                  Acesso restrito ao administrador.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4" aria-label="Formulário de login">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="min-h-11"
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm text-destructive" role="alert">
                      {loginError}
                    </p>
                  )}
                  <Button type="submit" className="w-full min-h-11" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Entrando…
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Uso pessoal e não comercial ·{" "}
              <a
                href="https://clodoaldo.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                clodoaldo.vercel.app
              </a>
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- Painel autenticado ---------- */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Image
            src="/icons/icon-192.png"
            alt="Logo OpenBot"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="mr-auto">
            <span className="font-semibold leading-none">OpenBot</span>
            <span className="block text-[11px] text-muted-foreground leading-tight">
              Painel do Clodoaldo
            </span>
          </div>
          {installEvt && (
            <Button size="sm" variant="outline" onClick={handleInstall} className="gap-1.5">
              <Download className="h-4 w-4" aria-hidden="true" />
              Instalar app
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="gap-1.5 text-muted-foreground"
            aria-label="Sair do painel"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
        {/* Navegação mobile: scroll horizontal */}
        <nav
          className="md:hidden border-t"
          aria-label="Navegação do painel"
        >
          <div className="flex gap-1 overflow-x-auto px-3 py-2">
            {SECTIONS.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={section === s.id ? "default" : "ghost"}
                onClick={() => setSection(s.id)}
                className="gap-1.5 shrink-0"
                aria-current={section === s.id ? "page" : undefined}
              >
                <s.icon className="h-4 w-4" aria-hidden="true" />
                {s.label}
              </Button>
            ))}
          </div>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-52 shrink-0" aria-label="Menu lateral">
          <nav className="sticky top-20 space-y-1">
            {SECTIONS.map((s) => (
              <Button
                key={s.id}
                variant={section === s.id ? "default" : "ghost"}
                onClick={() => setSection(s.id)}
                className="w-full justify-start gap-2"
                aria-current={section === s.id ? "page" : undefined}
              >
                <s.icon className="h-4 w-4" aria-hidden="true" />
                {s.label}
              </Button>
            ))}
            <Separator className="my-3" />
            <a
              href="https://clodoaldo.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Meu site
            </a>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {section === "dashboard" && <DashboardSection />}
          {section === "servicos" && <ServicosSection />}
          {section === "agentes" && <AgentesSection />}
          {section === "leads" && <LeadsSection />}
          {section === "config" && (
            <ConfigSection
              email={email}
              canInstall={Boolean(installEvt)}
              onInstall={handleInstall}
            />
          )}
        </main>
      </div>

      <footer className="mt-auto border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <span>OpenBot — Painel do Clodoaldo · uso pessoal</span>
          <span>
            {new Date().getFullYear()} ·{" "}
            <a
              href="https://clodoaldo.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              clodoaldo.vercel.app
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Seções ---------- */

function DashboardSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Visão geral do ecossistema digital — dados reais do portfólio.
        </p>
      </div>

      {/* Sincronização OpenBot ↔ Media-Kit: dados reais de prospecção/WhatsApp */}
      <EcossistemaCard />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.rotulo} className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardDescription className="text-xs">{k.rotulo}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-emerald-500">{k.valor}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.detalhe}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            Próximos passos — roteiro dos agentes
          </CardTitle>
          <CardDescription>
            Plano acordado para transformar o Triagem IA em linha de produtos vendáveis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ROADMAP.map((r) => (
            <div key={r.fase} className="flex gap-3">
              {r.feito ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-medium">
                  <Badge variant="outline" className="mr-2 align-middle text-[10px]">
                    {r.fase}
                  </Badge>
                  {r.titulo}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{r.descricao}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ServicosSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Serviços</h2>
        <p className="text-sm text-muted-foreground">
          Catálogo completo com preços — referência para atendimento e propostas.
        </p>
      </div>
      {GRUPOS_SERVICOS.map((grupo) => (
        <div key={grupo} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {grupo}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICOS.filter((s) => s.grupo === grupo).map((s) => (
              <Card key={s.nome} className="p-4 flex flex-col">
                <CardHeader className="p-0 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{s.nome}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {s.preco}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 text-sm text-muted-foreground">
                  {s.descricao}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: AgenteStatus }) {
  return status === "no-ar" ? (
    <Badge className="bg-emerald-500 text-emerald-950 hover:bg-emerald-500">
      No ar
    </Badge>
  ) : (
    <Badge variant="outline">Planejado</Badge>
  );
}

function AgentesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Agentes de IA</h2>
        <p className="text-sm text-muted-foreground">
          Linha de produtos para criar e vender — construídos sobre a WhatsApp
          Cloud API oficial (zero risco de ban).
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {AGENTES.map((a) => (
          <Card
            key={a.nome}
            className={`p-5 flex flex-col gap-2 ${
              a.status === "no-ar" ? "border-emerald-500/50" : ""
            }`}
          >
            <CardHeader className="p-0">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bot
                    className={`h-5 w-5 ${
                      a.status === "no-ar" ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {a.nome}
                </CardTitle>
                <StatusBadge status={a.status} />
              </div>
              <CardDescription className="pt-1">{a.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-auto space-y-1">
              <p className="text-xs text-muted-foreground">
                Nicho: <span className="text-foreground">{a.nicho}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Preço sugerido: <span className="text-foreground">{a.precoSugerido}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Próximo passo técnico:</span>{" "}
          criar a conta Meta Business + webhook da Cloud API e evoluir o Triagem IA
          com RAG do catálogo (Fases 1 e 2 do roadmap).
        </CardContent>
      </Card>
    </div>
  );
}

function LeadsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Leads</h2>
        <p className="text-sm text-muted-foreground">
          Leads qualificados pelo agente de WhatsApp aparecerão aqui.
        </p>
      </div>
      <Card className="p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Nenhum lead ainda</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Conecte a WhatsApp Cloud API oficial (Meta) na Fase 1 do roadmap para
              receber leads do seu site e dos clientes direto neste painel.
            </p>
          </div>
          <Button variant="outline" disabled className="gap-2" title="Disponível na Fase 1">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Conectar WhatsApp (Fase 1)
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ConfigSection({
  email,
  canInstall,
  onInstall,
}: {
  email: string;
  canInstall: boolean;
  onInstall: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Conta, instalação do app e segurança.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conta</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">
            Administrador:{" "}
            <span className="text-foreground font-medium">
              {email || "clodoaldo608@gmail.com"}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            Instalar como aplicativo
          </CardTitle>
          <CardDescription>
            Este painel é um PWA: pode ser instalado no celular e no PC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onInstall} disabled={!canInstall} className="gap-2 min-h-11">
            <Download className="h-4 w-4" aria-hidden="true" />
            {canInstall ? "Instalar agora" : "Já instalado ou indisponível"}
          </Button>
          {!canInstall && (
            <p className="mt-2 text-xs text-muted-foreground">
              Dica: no celular, use o menu do navegador &quot;Adicionar à tela inicial&quot;;
              no PC, o ícone de instalação na barra de endereço.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Segurança
          </CardTitle>
          <CardDescription>
            Ações recomendadas após o deploy (as credenciais não ficam no código).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Revogar o token do GitHub e o token da Vercel usados no deploy.</p>
          <p>2. Trocar a senha do painel por uma senha forte (atual: numérica de 8 dígitos).</p>
          <p>3. Manter o repositório privado — atualmente ele é privado.</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Sincronização OpenBot ↔ Media-Kit (clodoaldo.vercel.app) ---------- */

interface EcossistemaOverview {
  ok?: boolean;
  full?: boolean;
  gerado_em?: string;
  fonte?: string;
  erro?: string;
  prospeccao?: {
    hoje_primeiros_contatos: number;
    meta_diaria: number;
    hoje_followups: number;
    pendentes: number;
    respondentes_7d: number;
  };
  kanban?: Record<string, number>;
  agentes?: Array<{ nome: string; status: string; detalhe: string }>;
  respondentes_recentes?: Array<{
    nome: string;
    nicho: string;
    respondeu_em: string | null;
  }>;
}

function EcossistemaCard() {
  const [dados, setDados] = useState<EcossistemaOverview | null>(null);
  const [estado, setEstado] = useState<"loading" | "ok" | "erro">("loading");

  const carregar = useCallback(async () => {
    setEstado("loading");
    try {
      const res = await fetch("/api/ecossistema", { cache: "no-store" });
      if (!res.ok) throw new Error("indisponível");
      const d = (await res.json()) as EcossistemaOverview;
      setDados(d);
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const p = dados?.prospeccao;
  const kanban = dados?.kanban ?? {};
  const meta = p?.meta_diaria ?? 18;

  const miniKpis = [
    { rotulo: "Prospecção hoje", valor: p ? `${p.hoje_primeiros_contatos}/${meta}` : "—", detalhe: "1ºs contatos enviados" },
    { rotulo: "Follow-ups hoje", valor: p ? String(p.hoje_followups) : "—", detalhe: "retomadas 48h" },
    { rotulo: "Respondentes (7d)", valor: p ? String(p.respondentes_7d) : "—", detalhe: "leads que responderam" },
    { rotulo: "Fila pendente", valor: p ? String(p.pendentes) : "—", detalhe: "aguardando envio" },
  ];

  return (
    <Card className="border-emerald-500/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          Ecossistema ao vivo
          <Badge variant="outline" className="text-[10px]">
            sincronizado
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 px-2 text-xs"
            onClick={carregar}
            title="Atualizar agora"
          >
            {estado === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              "Atualizar"
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Prospecção, WhatsApp e kanban em tempo real do clodoaldo.vercel.app
          {dados?.gerado_em
            ? ` · ${new Date(dados.gerado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {estado === "erro" && (
          <p className="text-sm text-destructive" role="alert">
            Não consegui falar com o Media-Kit agora. O resto do painel segue
            normal — tente atualizar em alguns segundos.
          </p>
        )}
        {estado === "ok" && p && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {miniKpis.map((k) => (
                <div key={k.rotulo} className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">{k.rotulo}</p>
                  <p className="text-2xl font-bold text-emerald-500">{k.valor}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{k.detalhe}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(kanban).map(([st, n]) => (
                <Badge key={st} variant="secondary" className="text-xs">
                  kanban {st}: {n}
                </Badge>
              ))}
            </div>

            {dados?.agentes && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Agentes rodando
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {dados.agentes.map((a) => (
                    <div
                      key={a.nome}
                      className="flex items-start gap-2 rounded-lg border p-2.5"
                    >
                      {a.status === "no-ar" ? (
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium leading-tight">{a.nome}</p>
                        <p className="text-xs text-muted-foreground">{a.detalhe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dados?.respondentes_recentes &&
              dados.respondentes_recentes.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Responderam nos últimos 7 dias
                  </p>
                  {dados.respondentes_recentes.slice(0, 5).map((r, i) => (
                    <p key={`${r.nome}-${i}`} className="text-sm text-muted-foreground">
                      <span className="text-foreground">{r.nome}</span>{" "}
                      <span className="text-xs">({r.nicho || "nicho n/d"})</span>
                    </p>
                  ))}
                </div>
              )}
          </>
        )}
        <a
          href="https://clodoaldo.vercel.app/admin"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs underline underline-offset-2 hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Abrir admin completo do Media-Kit
        </a>
      </CardContent>
    </Card>
  );
}
