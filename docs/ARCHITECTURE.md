# Arquitetura do Rota

## Objetivo

A arquitetura deve permitir trocar provedores externos sem reconstruir a interface ou o motor de planejamento.

A UI nunca deve consumir diretamente o formato bruto do Google Places, Google Routes, Weather API ou outro fornecedor.

```text
Provedores externos
      ↓
adapters/providers
      ↓
modelos normalizados do Rota
      ↓
engines
      ↓
tripStore
      ↓
UI
```

## Camadas

### `src/lib/domain.ts`

Define os modelos normalizados:

- `DestinationRef`
- `RotaPlace`
- `RotaRoute`
- `RotaWeatherForecast`
- `DataField<T>`
- `SourceReference`
- `ProviderResult<T>`

Esses modelos são independentes do fornecedor.

### `src/lib/providers/`

`contracts.ts` define as interfaces que provedores reais devem implementar:

- `PlacesProvider`
- `RoutesProvider`
- `WeatherProvider`

`mockProviders.ts` implementa os mesmos contratos com dados simulados. Isso permite validar a arquitetura antes de pagar por APIs.

### Engines

- `budgetEngine.ts`: soma de paradas/despesas e saldo.
- `pricingEngine.ts`: custo do grupo e regras por idade.
- `itineraryEngine.ts`: composição, horários, prioridades e orçamento.
- `weatherEngine.ts`: classificação de risco climático e reorganização.

Engines devem ser preferencialmente puras e testáveis.

### `tripStore.tsx`

Responsável por estado e ações da experiência. Não deve virar um segundo motor de regras; cálculos complexos devem permanecer nas engines.

## Confiabilidade

Todo dado externo relevante deve conseguir responder:

1. qual é o valor;
2. de onde veio;
3. quando foi obtido/verificado;
4. qual é o nível de confiança.

Estados padrão:

- `confirmed`
- `estimated`
- `stale`
- `unknown`
- `unavailable`

## Falhas externas

`providerGateway.ts` centraliza timeout e classificação de falhas.

Princípio: **falha parcial, nunca falha total**.

Exemplos:

- Places indisponível → preservar roteiro existente e marcar dados não confirmados.
- Routes indisponível → manter última estimativa segura.
- Weather indisponível → não inventar previsão.
- quota/rate limit → degradar e tentar novamente mais tarde.

## Segurança

Chaves privadas pertencem ao servidor. Nunca expor credenciais em componentes React ou variáveis `VITE_*`.

## Regra de dependência

Componentes podem depender de store/domain. Engines podem depender de domain/types. Providers podem depender de contracts/domain.

Evitar dependência circular e evitar que componentes importem SDKs de terceiros diretamente.
