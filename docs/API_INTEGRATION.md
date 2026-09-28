# Integração de APIs

## Objetivo

Conectar dados reais mantendo o Rota independente de fornecedor e resiliente a falhas.

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
