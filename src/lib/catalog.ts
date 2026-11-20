/** Dados reais do catalogo do Clodoaldo (fonte: clodoaldo.vercel.app). */

export interface Servico {
  nome: string;
  descricao: string;
  preco: string;
  grupo: string;
}

export const SERVICOS: Servico[] = [
  // Criação de presença
  { nome: "Site Profissional", descricao: "Site rápido e responsivo que converte visita em cliente, com SEO local incluído.", preco: "R$ 1.700 (até 12x)", grupo: "Criação de presença" },
  { nome: "Landing Page", descricao: "Página de conversão para campanhas de Meta/Google Ads: uma oferta, um CTA.", preco: "Sob consulta", grupo: "Criação de presença" },
  { nome: "Página BIO Profissional", descricao: "Cartão de visitas digital para profissionais liberais, com agendamento e WhatsApp.", preco: "Até 72h", grupo: "Criação de presença" },
  { nome: "App sob medida", descricao: "Aplicativo do negócio: pedidos, agenda, fidelidade e catálogo na tela do cliente.", preco: "A combinar por escopo", grupo: "Criação de presença" },
  // Ghost Services
  { nome: "Roteiro Estrategico", descricao: "3 roteiros técnicos e persuasivos para o cliente gravar seu próprio conteúdo.", preco: "R$ 147", grupo: "Ghost Services" },
  { nome: "Edição Viral", descricao: "Edição premium de vídeos brutos com cortes, trilha e legendas estratégicas.", preco: "R$ 297", grupo: "Ghost Services" },
  { nome: "Pack de Criativos", descricao: "Templates editáveis no Canva para posts, stories e capas de vídeo.", preco: "R$ 77", grupo: "Ghost Services" },
  { nome: "Auditoria de Perfil", descricao: "Diagnóstico de bio, destaques e posicionamento com plano de melhoria.", preco: "R$ 347", grupo: "Ghost Services" },
  // Campanhas
  { nome: "Vídeo Dedicado", descricao: "Vídeo 100% dedicado à marca, com roteiro estratégico e CTA de conversão.", preco: "R$ 1.500", grupo: "Campanhas" },
  { nome: "Menção Patrocinada", descricao: "Integração natural da marca em conteúdos de rotina, lifestyle e negócios.", preco: "R$ 700", grupo: "Campanhas" },
  { nome: "Série de Stories", descricao: "3 a 5 stories com enquetes, caixas de perguntas e links de conversão.", preco: "R$ 1.200", grupo: "Campanhas" },
  { nome: "Combo Completo 360", descricao: "Vídeo dedicado + stories + menção: cobertura completa do funil.", preco: "R$ 2.500", grupo: "Campanhas" },
  // Catálogo e recorrência
  { nome: "SEO Local", descricao: "Otimização para aparecer em 1º nas buscas do nicho na cidade.", preco: "R$ 490", grupo: "Catálogo e recorrência" },
  { nome: "Google Meu Negócio", descricao: "Configuração completa e otimização para destaque no Maps.", preco: "R$ 290", grupo: "Catálogo e recorrência" },
  { nome: "Integração com WhatsApp", descricao: "Botão flutuante + formulário que abre WhatsApp com mensagem pronta.", preco: "R$ 190", grupo: "Catálogo e recorrência" },
  { nome: "Cardápio Digital com QR Code", descricao: "Cliente acessa do celular, sem app. Atualização ilimitada por 30 dias.", preco: "R$ 990", grupo: "Catálogo e recorrência" },
  { nome: "Edição de Cardápio Profissional", descricao: "20 itens fotografados com descrições em copywriting que vende.", preco: "R$ 790", grupo: "Catálogo e recorrência" },
  { nome: "Pacote de Artes Redes Sociais", descricao: "12 a 30 artes/mês prontas para postar, com templates, copy e calendário.", preco: "R$ 39/mês", grupo: "Catálogo e recorrência" },
  { nome: "Pacote Recorrência Mensal", descricao: "Site + artes + SEO + suporte, tudo incluso por mensalidade.", preco: "R$ 497/mês", grupo: "Catálogo e recorrência" },
];

export type AgenteStatus = "no-ar" | "planejado";

export interface Agente {
  nome: string;
  descricao: string;
  status: AgenteStatus;
  nicho: string;
  precoSugerido: string;
}

export const AGENTES: Agente[] = [
  {
    nome: "Triagem IA",
    descricao:
      "Plataforma de atendimento inteligente: conversas do WhatsApp viram leads qualificados e atendimentos agendados, com IA de triagem, CRM e agenda.",
    status: "no-ar",
    nicho: "Imobiliárias e clínicas",
    precoSugerido: "Setup + mensalidade",
  },
  {
    nome: "Agente de Agendamento",
    descricao:
      "Confirma e reagenda consultas direto no WhatsApp, integrado ao SinalPix para proteção contra no-show.",
    status: "planejado",
    nicho: "Salões, barbearias e consultórios",
    precoSugerido: "Setup R$ 790 + R$ 197/mês",
  },
  {
    nome: "Agente de Recuperacao",
    descricao:
      "Reengaja clientes inativos com templates aprovados da WhatsApp Cloud API dentro da janela de 24h.",
    status: "planejado",
    nicho: "Comercio local",
    precoSugerido: "R$ 147/mês",
  },
  {
    nome: "Agente SDR de Prospecção",
    descricao:
      "Prospecção automática via Google Maps + Apify com contato inicial por WhatsApp usando template aprovado.",
    status: "planejado",
    nicho: "B2B",
    precoSugerido: "R$ 497/mês",
  },
];

export const KPIS = [
  { valor: "14", rotulo: "Apps no ar", detalhe: "abertos por link" },
  { valor: "+75", rotulo: "Empresas atendidas", detalhe: "desde 2016" },
  { valor: "9", rotulo: "Produtos digitais", detalhe: "venda automatizada" },
  { valor: "485", rotulo: "Leads catalogados", detalhe: "case MeuCorre" },
];

export const ROADMAP = [
  {
    fase: "Fase 1",
    titulo: "WhatsApp Cloud API oficial",
    descricao:
      "Criar conta Meta Business, número dedicado e webhook. Zero risco de ban e preços por mensagem.",
    feito: false,
  },
  {
    fase: "Fase 2",
    titulo: "Agente com base de conhecimento",
    descricao:
      "RAG com o catálogo completo (serviços, preços, prazos) + quiz de qualificação dentro da conversa.",
    feito: false,
  },
  {
    fase: "Fase 3",
    titulo: "Conversão automática",
    descricao:
      "Agenda, link de pagamento PIX, notificação Telegram e dashboard de leads no CRM.",
    feito: false,
  },
  {
    fase: "Fase 4",
    titulo: "Empacotar e vender agentes",
    descricao:
      "Landing page do produto, 2 cases piloto e ativação do programa B2B2C de revenda.",
    feito: false,
  },
];
