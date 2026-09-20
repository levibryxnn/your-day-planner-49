# Rota — Fundação de experiência (protótipo navegável)

Copiloto turístico baseado em orçamento. Protótipo mobile-first, dados simulados, sem integrações externas.

## Princípios aplicados

- Orçamento é o elemento de identidade do produto, presente em todas as telas do dia.
- Uma pergunta por vez na configuração; nada de formulário longo.
- Lugares escolhidos pelo usuário nunca são removidos em silêncio — conflito vira explicação curta + opções.
- Sem estética de chat, sem linguagem de IA, sem dashboard.

## Fluxo (único escopo)

```text
Home  ->  Configuração (4 passos)  ->  Lugares que quero incluir
      ->  Geração (transição curta)  ->  Meu Dia  ->  Detalhe da parada
      ->  Modo Passeio
```

Rotas: `/` (home), `/planejar` (passos + lugares + geração, uma rota com estado por etapa), `/meu-dia`, `/passeio`. Detalhe da parada é bottom sheet sobre Meu Dia. Adicionar parada é um fluxo em sheet.

## Telas

**Home** — headline "Quanto você quer gastar no seu próximo dia inesquecível?", campo de cidade (São Paulo), campo monetário grande e tipograficamente dominante (R$500), CTA "Planejar meu dia". Nada de seções de marketing.

**Configuração** — quatro perguntas em sequência com barra de progresso discreta e botão voltar: quem vai (steppers adultos/crianças), horário (início/fim), locomoção (carro / transporte público / a pé), interesses (chips com ícones de traço, sem emoji).

**Lugares que quero incluir** — pergunta opcional, dois caminhos: "Adicionar lugar" (busca simulada com resultados mock) ou "Deixar o Rota escolher tudo". Cada lugar adicionado vira uma linha com miniatura, nome, categoria, remover, e escolha de prioridade: "Quero muito ir" / "Se encaixar no roteiro".

**Geração** — sequência de 4–5 frases curtas com uma animação abstrata sutil de linhas se organizando em timeline. ~2,5s total. Sem spinner, sem linguagem de IA.

**Meu Dia** — cabeçalho São Paulo / sábado; componente de orçamento legível em 1 segundo (total, previsto, livre, barra fina); timeline vertical com 5 paradas mostrando apenas horário, imagem pequena, nome, categoria, duração e custo; marca discreta "Escolhido por você" em texto, sem badge colorido; resumo do dia em texto corrido discreto; ações "Adicionar parada" (discreta) e "Iniciar meu dia" (fixa na base).

**Detalhe da parada** — bottom sheet: imagem, nome, categoria, nota e avaliações simuladas, tempo, custo, horário, descrição de 2–3 linhas, bloco "Por que está no seu roteiro" com texto diferente para sugestão do sistema e para escolha do usuário, ações Manter / Trocar lugar / Tornar prioridade / Ver no mapa (simulado).

**Modo Passeio** — foco em "o que faço agora": próxima parada, saída em X min, chegada prevista, custo, CTA dominante "Começar trajeto"; restante do dia em lista comprimida; ação secundária "Alterar meu plano" abrindo sheet com as sete intenções (comer, descansar, algo gratuito, gastar menos, lugar fechado, adicionar lugar, mudar passeio), cada uma simulando uma reorganização com resultado explicado.

## Conflitos de orçamento/tempo

Um mesmo componente de conflito reutilizado em todos os pontos: frase única em linguagem simples ("Esse restaurante deixa o passeio R$70 acima do orçamento.") + até três opções (Manter e ajustar o restante / Trocar lugar / Aumentar orçamento). Para lugar preferencial não encaixado: aviso discreto com "Ver alternativa" ou "Tornar obrigatório". Nenhuma remoção automática.

Ao adicionar parada com roteiro pronto: pergunta de encaixe, simulação, e resultado narrado ("Adicionei ao almoço e reorganizei duas paradas. Continua dentro dos R$500."), com desfazer.

## Diferenciação visual do que o usuário escolheu

Apenas dois sinais, sem poluição: um marcador fino na lateral do item da timeline e o texto "Escolhido por você" em tamanho pequeno. Sem cor forte, sem ícone extra, sem badge.

## Design system

Tokens em `src/styles.css` (oklch): background, surface, text-primary/secondary, border, primary, success, warning, muted; três estados de preço (confirmado, estimado com "~", indisponível) tratados por variante de texto, não por cor isolada.

Direção visual: base clara e quente, tipografia editorial para títulos e sans altamente legível para interface, raios moderados, sombras quase inexistentes, whitespace generoso, escala de espaçamento em múltiplos de 4.

Componentes base: Button, Input, MoneyInput, Stepper, Chip, Card, Sheet, ProgressDots, PriceTag, SectionHeader.

## Componentes do produto

`BudgetSummary`, `TripTimeline`, `TripStop`, `StopDetailSheet`, `InterestSelector`, `TravelModeSelector`, `PartySelector`, `TimeRangeSelector`, `PlaceSearchSheet`, `SelectedPlaceItem`, `PrioritySelector`, `AddStopFlow`, `ConflictNotice`, `NextStopCard`, `ChangePlanSheet`, `GenerationSequence`.

## Detalhes técnicos

- Camada única de dados simulados em `src/data/` (lugares de São Paulo, roteiro base, buscas), marcada como MOCK DATA; nenhum mock hardcoded em componentes.
- Tipos em `src/types/trip.ts`: `id, name, category, estimatedCost, estimatedDuration, costConfidence, source, selectedByUser, priority (required|preferred|suggested), locked, scheduledTime`.
- Estado do planejamento em um contexto React (`TripProvider`) com reducer: configuração, lugares escolhidos, roteiro gerado, recálculo de orçamento e horários — funções puras em `src/lib/itinerary.ts` para que o motor real possa substituí-las depois.
- Imagens: geradas em resolução pequena, servidas como assets locais; `prefers-reduced-motion` respeitado em todas as transições.
- Acessibilidade: alvos ≥44px, foco visível, labels, semântica, contraste AA.
- `head()` próprio por rota; sem backend, sem login, sem APIs.

## Fora de escopo

Login, backend, Google APIs, IA, pagamentos, múltiplos dias, mapa real, social, gamificação.
