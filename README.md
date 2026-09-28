# Rota

Rota é um planejador turístico mobile-first orientado por **orçamento, tempo, preferências e contexto real**. O objetivo é transformar as restrições do usuário em um dia executável, com estimativas claras, prioridades preservadas e replanejamento quando o mundo real muda.

> Status: protótipo funcional em evolução. Places, rotas e clima ainda usam dados simulados/adaptadores mock; a base do código já está preparada para provedores reais.

## Princípios do produto

- O orçamento é uma restrição central, não um dado decorativo.
- Escolhas explícitas do usuário têm prioridade sobre sugestões automáticas.
- O Rota nunca deve inventar precisão: dados confirmados, estimados e indisponíveis devem ser diferenciados.
- Falhas de APIs externas devem degradar somente a função afetada, nunca derrubar o passeio inteiro.
- A inteligência fica nos bastidores; a interface não deve parecer um chatbot.
- Mobile-first entre 360–430 px, com acessibilidade e baixa carga cognitiva.

## O que existe hoje

- configuração de destino, data, grupo e idade das crianças;
- orçamento familiar e cálculo de preço por faixa etária;
- interesses e modo de transporte;
- lugares escolhidos pelo usuário com prioridade;
- geração de roteiro mock baseada nas escolhas;
- timeline e modo passeio;
- resolução de conflitos de orçamento;
- simulação de clima horário e reorganização por risco de chuva;
- modelos normalizados e contratos para futuros provedores de Places, Routes e Weather;
- estados de confiança/origem dos dados e gateway de fallback.

## Stack

- React 19
- TanStack Start / TanStack Router
- TypeScript
- Tailwind CSS 4
- Bun
- Lucide React
- Lovable como ambiente conectado de preview/edição

## Estrutura

```text
src/
├─ components/rota/      componentes específicos do produto
├─ lib/
│  ├─ providers/         contratos e adaptadores de provedores externos
│  ├─ budgetEngine.ts    cálculo financeiro
│  ├─ pricingEngine.ts   preços por pessoa/faixa etária
│  ├─ itineraryEngine.ts geração/reorganização do roteiro
│  ├─ weatherEngine.ts   risco climático e replanejamento
│  ├─ providerGateway.ts timeout, falhas e fallback
│  ├─ domain.ts          modelos normalizados independentes de fornecedor
│  ├─ types.ts           tipos do estado do produto
│  └─ tripStore.tsx      estado e ações da experiência
├─ routes/               rotas TanStack
└─ styles.css            tokens e estilos globais

docs/
├─ ARCHITECTURE.md
├─ PRODUCT_RULES.md
└─ API_INTEGRATION.md
```

## Desenvolvimento local

Requisito recomendado: Bun.

```bash
bun install
bun run dev
```

Validação completa:

```bash
bun run typecheck
bun run lint
bun run build
```

A CI executa essas validações em pull requests para `main`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` somente quando uma integração real for implementada.

**Nunca use prefixo `VITE_` para chaves privadas de Places, Routes ou Weather.** Chaves privadas devem permanecer no servidor.

## Dados simulados

Enquanto uma fonte externa ainda não estiver integrada, o produto deve informar isso explicitamente. Mocks não podem ser apresentados como preço, horário, clima ou disponibilidade atual confirmados.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Regras de produto](docs/PRODUCT_RULES.md)
- [Integração de APIs](docs/API_INTEGRATION.md)

## Fluxo de trabalho

`main` deve permanecer utilizável. Mudanças relevantes devem passar por branch, pull request e CI antes do merge.

O projeto está conectado ao Lovable; não reescreva histórico já publicado com force push/rebase destrutivo.
