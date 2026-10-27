# Integração de APIs

## Objetivo

Conectar dados reais mantendo o Rota independente de fornecedor e resiliente a falhas.

## Primeira implementação open-data

O primeiro vertical slice usa adaptadores server-side, sem chaves no navegador:

- Nominatim para confirmar destinos e coordenadas. A busca deve ser explícita, com User-Agent identificável e baixa frequência; não usar autocomplete agressivo no endpoint público.
- Photon para busca textual de lugares e categorias a partir de dados OpenStreetMap. Preço, avaliação, fotos, status operacional e horário permanecem desconhecidos quando a fonte não os fornece.
- Open-Meteo para previsão horária. O resultado é atribuído à fonte e o fuso pode ser resolvido pelo parâmetro `timezone=auto`.
- OSRM para matriz de carro e caminhada. A resposta não representa trânsito em tempo real; transporte público permanece no fallback até haver uma fonte GTFS/provedor apropriado.

Os endpoints locais são `/api/destinations`, `/api/places`, `/api/weather` e `/api/routes`. Eles usam `safeProviderCall`, limitam entradas e preservam respostas de fallback sem apresentar dados desconhecidos como confirmados.

O GitHub Pages publica uma variante estática do aplicativo para testes de interface. Nessa variante,
as chamadas server-side são desativadas e o fluxo usa dados de demonstração; isso é uma limitação do
GitHub Pages, que não executa as rotas API do TanStack Start. O build completo deve ser executado em
um runtime server-side para habilitar os provedores open-data.

## Provedores previstos

### Places

Uso esperado: busca de destino, restaurantes, atrações, pontos de lazer, detalhes, status do estabelecimento, horários, ratings e fotos.

Implementação deve obedecer `PlacesProvider` e normalizar respostas para `RotaPlace`.

### Routes

Uso esperado: duração, distância, matriz entre candidatos e trânsito quando necessário.

Implementação deve obedecer `RoutesProvider` e normalizar respostas para `RotaRoute`.

Não calcular matrizes gigantes. Filtrar candidatos antes de chamadas caras.

### Weather

Uso esperado: previsão horária por latitude/longitude para detectar conflito entre atividade externa e chuva/condição adversa.

Implementação deve obedecer `WeatherProvider`.

## Fluxo recomendado para geração

```text
destino canônico
  ↓
busca ampla de candidatos
  ↓
filtros baratos
  ↓
shortlist
  ↓
rotas/matriz
  ↓
detalhes apenas dos finalistas
  ↓
clima por horário
  ↓
motor do Rota
```

A meta é evitar pagar detalhes caros para lugares que nunca entrarão no roteiro.

## Segredos

As chaves abaixo são placeholders futuros:

- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_ROUTES_API_KEY`
- `GOOGLE_WEATHER_API_KEY`

Devem existir somente no ambiente de servidor.

## Fallback

Toda integração deve passar por `safeProviderCall` ou mecanismo equivalente.

Cada falha deve ser classificada em:

- timeout;
- quota excedida;
- rate limit;
- requisição inválida;
- não encontrado;
- indisponibilidade do provedor;
- autorização;
- desconhecido.

Nunca converter uma falha em dado fictício silenciosamente.

## Revalidação

Planejamento e execução têm níveis diferentes de frescor.

Recomendação:

- criação do roteiro → consulta inicial;
- pouco antes do passeio → revalidar status, horários, rotas e clima;
- durante o passeio → revalidar somente o que pode ter mudado e afeta próximas paradas.

## Caching

Cache deve respeitar os termos do fornecedor. Não copiar permanentemente conteúdo que o contrato proíba armazenar.

IDs estáveis próprios do Rota devem ser separados de IDs externos.

## Observabilidade futura

Antes de produção pública, registrar:

- provedor;
- operação;
- latência;
- sucesso/falha;
- fallback acionado;
- custo aproximado da chamada;
- timestamp.

Não registrar chaves, tokens ou conteúdo sensível.
