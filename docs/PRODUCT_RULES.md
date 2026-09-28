# Regras de produto

Estas regras são invariantes do Rota e devem ser lidas antes de mudanças relevantes.

## Experiência

1. Mobile-first.
2. O orçamento permanece visível e compreensível.
3. Uma decisão por etapa sempre que possível.
4. A interface não deve parecer chatbot, dashboard SaaS ou template genérico de IA.
5. Whitespace e hierarquia devem fazer mais trabalho do que cards e badges.
6. Não adicionar funcionalidades fora do escopo sem necessidade real.

## Intenção do usuário

1. Parada marcada como **Quero muito ir** nunca é removida silenciosamente.
2. Parada **Se encaixar no roteiro** pode ser flexibilizada, mas o motivo deve ser explicável.
3. Ao surgir conflito, mostrar consequências e alternativas.
4. Replanejamento preserva primeiro as decisões humanas.

Prioridade conceitual:

1. lugares obrigatórios escolhidos pelo usuário;
2. compromissos de horário;
3. orçamento máximo;
4. horário final;
5. preferências;
6. sugestões automáticas.

## Dados

Nunca inventar precisão.

- confirmado → valor exato;
- estimado → usar sinalização de estimativa;
- desconhecido → informar indisponibilidade;
- desatualizado → revalidar antes de tratar como atual.

Preço de uma atração não deve ser tratado automaticamente como preço do grupo. Regras por adulto/criança/faixa etária devem ser consideradas quando disponíveis.

## Clima e mundo real

Atividades externas devem ser avaliadas contra previsão horária. Antes e durante o passeio, dados críticos devem poder ser revalidados.

O sistema deve preferir reorganizar horário/ordem antes de remover uma intenção importante do usuário.

## Código

- Não duplicar componente existente.
- Não introduzir biblioteca de UI completa para resolver um componente simples.
- Não espalhar regras de negócio dentro da UI.
- Não acoplar o produto ao formato de um fornecedor externo.
- Não incluir segredos no frontend.
- Preservar build, typecheck e lint verdes.
