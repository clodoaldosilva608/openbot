# OpenBot — Painel do Clodoaldo

PWA instalável (Next.js 16 + TypeScript + Tailwind + shadcn/ui) para gestão
pessoal de serviços, agentes de IA e leads do Clodoaldo Silva
([clodoaldo.vercel.app](https://clodoaldo.vercel.app)).

## O que é

- **Login de administrador** com sessão assinada (HMAC, cookie httpOnly) e
  limite de tentativas por IP.
- **Dashboard** com KPIs reais do ecossistema e roadmap das próximas fases.
- **Serviços**: catálogo completo com preços (site, landing, ghost services,
  campanhas, recorrência).
- **Agentes de IA**: linha de produtos (Triagem IA no ar + 3 planejados) com
  nicho e precificação sugerida.
- **Leads**: estrutura pronta para receber leads da WhatsApp Cloud API (Fase 1).
- **PWA**: manifest, service worker, ícones originais e botão de instalação.

> Este projeto é de **uso pessoal**. Código 100% original — não contém código
> dos projetos OpenBot de terceiros (nightly-labs ou CopilotKit).

## Rodar localmente

```bash
cp .env.example .env.local   # preencha com seus valores
bun install
bun run dev                  # http://localhost:3000
```

## Variáveis de ambiente

| Variável         | Uso                                          |
| ---------------- | -------------------------------------------- |
| `ADMIN_EMAIL`    | E-mail do administrador do painel            |
| `ADMIN_PASSWORD` | Senha do administrador                       |
| `SESSION_SECRET` | Segredo HMAC da sessão (`openssl rand -base64 32`) |

Configure as três no painel da Vercel (Settings → Environment Variables) antes
do deploy de produção. **Nunca** comite os valores reais.

## Deploy na Vercel

```bash
npm i -g vercel
vercel link --project openbot-clodoaldo
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD production
vercel env add SESSION_SECRET production
vercel --prod
```

## Roadmap do produto (Fases 1–4)

1. WhatsApp Cloud API oficial (número dedicado + webhook)
2. Agente com RAG do catálogo + quiz de qualificação
3. Conversão automática (agenda, PIX, Telegram, CRM)
4. Empacotar e vender agentes (landing page, cases, B2B2C)
