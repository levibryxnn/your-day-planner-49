# Day Planner Pro

MISSÃO

Você atuará como uma equipe sênior multidisciplinar de produto digital formada conceitualmente por:

Principal Product Designer;

Senior UX Designer;

UX Researcher;

Interaction Designer;

Design Systems Engineer;

Product Manager;

Senior Frontend Engineer;

especialista em produtos mobile consumer;

especialista em acessibilidade;

especialista em psicologia cognitiva aplicada a interfaces.

Seu objetivo NÃO é simplesmente gerar algumas telas bonitas.

Seu objetivo é projetar a fundação de experiência de usuário de um produto digital que poderá se tornar um aplicativo comercial real e escalável.

Trabalhe com mentalidade de produto de alto nível.

Priorize:

clareza;
simplicidade;
confiança;
utilidade;
velocidade de decisão;
redução de carga cognitiva;
hierarquia visual;
consistência;
sensação de produto premium.

Não revele raciocínio interno detalhado.

Entregue apenas decisões, justificativas resumidas e o resultado final.

PRODUTO

Estamos construindo provisoriamente um produto chamado Rota.

O nome poderá mudar futuramente.

Rota é um copiloto turístico baseado em orçamento.

Ele não é:

um chatbot;

um blog de turismo;

um catálogo de pontos turísticos;

uma lista de restaurantes;

um gerador genérico de itinerários.

A proposta é:

Transformar dinheiro + tempo disponível + preferências pessoais + lugares que o usuário deseja visitar em um dia turístico otimizado e executável.

Exemplo:

“Estou em São Paulo com minha esposa e minha filha. Tenho R$500 para passar o dia, quero voltar às 21h e quero obrigatoriamente levá-las ao restaurante X e ao ponto turístico Y.”

O produto deverá futuramente conseguir transformar essa informação em:

roteiro;

atrações;

alimentação;

deslocamentos;

horários;

previsão de gastos;

saldo restante;

alternativas;

lugares escolhidos pelo próprio usuário;

replanejamento em tempo real.

Porém NÃO implemente essas tecnologias nesta primeira etapa.

OBJETIVO DESTA PRIMEIRA ETAPA

Nesta etapa queremos validar apenas:

A EXPERIÊNCIA FUNDAMENTAL DO USUÁRIO.

Construa um protótipo funcional mobile-first usando dados simulados realistas.

Não integrar:

Google Places;
Google Maps real;
Google Routes;
IA externa;
Supabase;
pagamentos;
login;
APIs;
dados meteorológicos;
trânsito;
reservas.

Não construir backend complexo.

Crie uma experiência navegável simulando o produto final.

O resultado deve permitir que uma pessoa utilize o protótipo e imediatamente pense:

“Eu usaria isso para organizar meu passeio.”

PRINCÍPIO CENTRAL

A tecnologia deve desaparecer.

O usuário não deve sentir que está “conversando com uma IA”.

Ele deve sentir que o aplicativo:

entendeu o que ele quer e organizou tudo.

Evite completamente interfaces centradas em chat.

IA futuramente será infraestrutura invisível.

PRINCÍPIO DE COCRIAÇÃO

O sistema não deve assumir que sempre sabe mais sobre a cidade do que o usuário.

O usuário pode:

conhecer a cidade;

já ter morado nela;

ter recebido uma recomendação;

querer apresentar determinado lugar para outra pessoa;

possuir um restaurante favorito;

querer obrigatoriamente visitar uma atração;

ter compromisso em determinado local;

desejar incluir uma experiência específica.

Portanto, o produto deve permitir que o usuário combine:

lugares escolhidos por ele + lugares sugeridos pelo sistema.

A experiência não deve ser:

“o aplicativo decide tudo”.

Deve ser:

“você escolhe o que importa e nós organizamos o restante.”

USUÁRIO PRINCIPAL

Considere inicialmente uma pessoa comum que:

está visitando uma cidade;

pode ou não conhecer bem o local;

possui orçamento limitado;

não quer passar horas pesquisando;

quer aproveitar melhor o dia;

pode estar acompanhada;

pode estar com crianças;

pode já conhecer alguns lugares que deseja incluir;

não quer fazer cálculos constantemente;

não quer abrir cinco aplicativos diferentes;

não quer ler grandes blocos de texto.

O usuário provavelmente está usando o aplicativo na rua.

Portanto poderá estar:

com apenas uma mão livre;
sob luz do sol;
andando;
com pressa;
com internet instável;
cansado;
distraído.

Toda decisão de UX deve considerar isso.

JOB TO BE DONE

O principal trabalho que o usuário está contratando o produto para fazer é:

“Tenho determinado dinheiro, determinado tempo e algumas coisas que quero fazer. Organize o melhor dia possível para mim sem me fazer ultrapassar meus limites.”

Todas as decisões devem servir esse objetivo.

REGRA DE CARGA COGNITIVA

Nunca apresentar ao usuário uma quantidade desnecessária de decisões.

Utilize progressive disclosure.

Mostre primeiro apenas o necessário.

Informações secundárias devem aparecer quando solicitadas.

Exemplo:

não apresentar simultaneamente:

horário;
telefone;
endereço;
site;
descrição;
dez avaliações;
cinco botões;
menu;
distância;
transporte;
história do local;
preço;
tags.

Apresente primeiro:

nome;
imagem;
horário;
custo;
tempo da atividade.

O restante aparece progressivamente.

REGRA DAS DECISÕES

Sempre que possível:

1 pergunta = 1 decisão.

Evite formulários extensos.

Transforme configuração em uma experiência fluida.

O usuário deve sentir que está montando um passeio, não preenchendo cadastro.

FLUXO PRINCIPAL

Implemente apenas:

HOME
→ CONFIGURAÇÃO
→ LUGARES QUE QUERO INCLUIR
→ GERAÇÃO SIMULADA
→ MEU DIA
→ DETALHE DE UMA PARADA
→ MODO PASSEIO

Este é o único fluxo obrigatório nesta etapa.

Não aumente o escopo.

CENÁRIO REAL DE DEMONSTRAÇÃO

Todo o protótipo deve utilizar este cenário para evitar Lorem Ipsum e conteúdo genérico:

Destino:

São Paulo

Data:

sábado

Grupo:

2 adultos + 1 criança

Orçamento:

R$500

Horário:

09:00 até 21:00

Transporte:

carro

Preferências:

parques;
gastronomia;
cultura;
atividades adequadas para família.

Lugar escolhido pelo próprio usuário:

um restaurante favorito conhecido anteriormente.

Utilize locais plausíveis de São Paulo apenas como dados simulados.

Não afirme que preços ou horários representam informações atuais.

Marque claramente internamente como MOCK DATA.

EXPERIÊNCIA 1 — HOME

A Home precisa comunicar o produto em poucos segundos.

Evite landing page tradicional de SaaS.

NÃO criar inicialmente:

“Features”;
“Testimonials”;
“Pricing”;
“FAQ”;
“Why choose us”;
grandes textos institucionais.

A primeira experiência deve estar focada na ação.

Headline sugerida:

Quanto você quer gastar no seu próximo dia inesquecível?

Subtexto extremamente curto.

Campo:

Onde você quer passear?

Exemplo:

São Paulo

Campo monetário de destaque:

Quanto você quer gastar?

R$500

CTA:

Planejar meu dia

O orçamento deve parecer elemento central da identidade do produto.

Não trate dinheiro como campo secundário.

EXPERIÊNCIA 2 — CONFIGURAÇÃO

Após o usuário tocar em “Planejar meu dia”, não exiba um formulário gigante.

Utilize etapas progressivas.

Pergunta:

Quem vai com você?

Controles extremamente simples para:

Adultos

Crianças

Depois:

Quanto tempo temos?

Horário inicial

Horário final

Depois:

Como vocês querem se locomover?

Carro

Transporte público

A pé

Depois:

O que faria esse dia valer a pena?

Utilizar seleção visual de interesses.

Exemplos:

Natureza

Comer bem

Cultura

Crianças

Compras

História

Experiências locais

Fotografia

Não utilizar emojis como principal linguagem visual.

Prefira ícones consistentes e sofisticados.

EXPERIÊNCIA 2.1 — LUGARES QUE O USUÁRIO QUER INCLUIR

Depois das preferências, faça uma pergunta opcional:

Tem algum lugar que você já quer incluir no seu dia?

Subtexto:

“Pode ser um restaurante que você conhece, uma atração que alguém recomendou ou simplesmente um lugar que você não quer deixar de visitar.”

A ação deve ser claramente opcional.

Botões:

Adicionar lugar

Deixar o Rota escolher tudo

Ao selecionar “Adicionar lugar”, abrir uma busca simulada.

Exemplos:

Restaurante X

Parque X

Museu X

Café X

Ponto turístico X

Nesta primeira versão os resultados serão MOCK DATA.

Permita adicionar mais de um lugar.

Cada local adicionado deve aparecer como um item simples contendo:

nome;
categoria;
pequena imagem;
ação para remover.

TIPOS DE PRIORIDADE DO LUGAR

Depois que o usuário adicionar um local, permitir opcionalmente definir:

Quero muito ir

ou

Se encaixar no roteiro

Evite linguagem técnica.

Internamente podem corresponder a:

REQUIRED_STOP

PREFERRED_STOP

Mas nunca mostrar esses termos ao usuário.

LUGAR OBRIGATÓRIO

Quando o usuário selecionar:

Quero muito ir

o sistema deve tratar aquele local como uma restrição prioritária.

O restante do roteiro deverá ser organizado ao redor dele sempre que possível.

O sistema NÃO deve remover silenciosamente esse local.

Se houver conflito com:

orçamento;
horário;
distância;
tempo disponível;
outro lugar obrigatório;

o sistema deve explicar de maneira extremamente simples.

Exemplo:

“Esse restaurante deixa o passeio R$70 acima do orçamento.”

Então apresentar opções:

Manter e ajustar o restante

Trocar restaurante

Aumentar orçamento

Nunca decidir sozinho remover algo explicitamente escolhido pelo usuário.

LUGAR PREFERENCIAL

Quando o usuário selecionar:

Se encaixar no roteiro

o sistema deverá tentar incluir o local, mas poderá substituí-lo caso exista uma configuração significativamente melhor.

Caso não consiga incluí-lo, informar de maneira discreta:

“Não conseguimos encaixar este lugar sem prejudicar bastante o restante do dia.”

Oferecer:

Ver alternativa

ou

Tornar obrigatório

INTERAÇÃO DE ADICIONAR DURANTE O ROTEIRO

Mesmo depois do roteiro criado, o usuário deve poder adicionar um novo lugar.

Na tela “Meu Dia”, incluir uma ação discreta:

Adicionar parada

O usuário poderá selecionar ou buscar um local.

Depois perguntar:

Como você quer encaixar este lugar?

Opções:

Quero ir de qualquer jeito

Encaixe se fizer sentido

Em seguida simular uma reorganização do roteiro.

Exemplo:

“Adicionei o restaurante ao almoço e reorganizei duas paradas. Seu orçamento continua dentro dos R$500.”

Ou:

“Consigo adicionar esse lugar, mas o passeio ficará aproximadamente R$45 acima do orçamento.”

Dar controle ao usuário.

EXPERIÊNCIA 3 — GERAÇÃO

Crie uma transição curta entre configuração e resultado.

Não utilizar:

spinner genérico;
“AI is thinking”;
“Generating itinerary”;
robôs;
cérebros;
estrelas mágicas;
animações clichês de inteligência artificial.

A experiência deve transmitir competência.

Mostrar sequencialmente mensagens curtas como:

“Encontrando lugares que combinam com vocês.”

“Encaixando os lugares que você escolheu.”

“Equilibrando passeio e orçamento.”

“Organizando o melhor percurso.”

“Seu dia está pronto.”

Pode haver uma animação abstrata extremamente sutil mostrando o roteiro sendo organizado.

A duração simulada deve parecer rápida.

EXPERIÊNCIA 4 — MEU DIA

Esta é a tela mais importante do produto.

Ela deve provocar imediatamente a sensação:

“Está tudo organizado.”

No topo:

São Paulo

baixo nível de destaque:

Sábado

Depois criar um componente principal de orçamento.

Exemplo:

R$500
seu orçamento

R$386 previstos

R$114 livres

Não criar gráfico complexo.

Não criar dashboard financeiro.

Deve ser compreendido em aproximadamente 1 segundo.

TIMELINE

Abaixo do orçamento apresentar o dia como uma timeline vertical.

Dados simulados:

09:00

Parque Ibirapuera

Natureza

1h45

Grátis

11:15

Museu de Arte Moderna

Cultura

1h30

R$50

13:20

Restaurante escolhido pelo usuário

Almoço

1h20

~R$145

Mostrar discretamente:

Escolhido por você

15:30

Avenida Paulista

Passeio

2h

Grátis

18:00

Café

Pausa

50min

~R$55

Use imagens realistas adequadas ao contexto.

A imagem deve enriquecer a experiência, não dominar toda a interface.

Cada parada precisa mostrar apenas:

horário;
imagem;
nome;
categoria;
duração;
custo.

Quando o local tiver sido adicionado pelo usuário, permitir uma identificação visual muito discreta.

Não utilizar badges chamativos.

Exemplo:

Escolhido por você

DISTINÇÃO DE PREÇO

Prepare desde já o design para três estados:

CONFIRMADO

ESTIMADO

DESCONHECIDO

Exemplo visual:

Grátis

R$50

~R$145

Preço indisponível

Não utilizar linguagem técnica como:

confidence score;
API;
estimated field;
data source.

RESUMO DO DIA

Apresentar discretamente:

5 paradas

aproximadamente 8h de atividades

R$386 previstos

R$114 de margem

1 lugar escolhido por você

Não transformar isso em dashboard.

EXPERIÊNCIA 5 — DETALHE DO LOCAL

Ao tocar numa parada, apresentar uma página ou bottom sheet elegante.

Mostrar:

imagem;
nome;
categoria;
nota simulada;
quantidade simulada de avaliações;
tempo sugerido;
custo;
horário previsto.

Descrição curta:

máximo aproximadamente 2 ou 3 linhas.

Criar uma seção:

Por que está no seu roteiro

Para uma sugestão do sistema:

“Boa opção para começar o dia, combina com passeio em família e não consome seu orçamento.”

Para um lugar escolhido pelo usuário:

“Você escolheu este lugar. Organizamos o restante do roteiro para encaixá-lo sem ultrapassar seu orçamento.”

Essa diferença deve reforçar a sensação de que o sistema respeita as decisões do usuário.

Ações:

Manter no roteiro

Trocar lugar

Tornar prioridade

“Ver no mapa” pode existir visualmente, mas será simulado nesta versão.

EXPERIÊNCIA 6 — MODO PASSEIO

Depois que o usuário iniciar o dia, a aplicação muda de comportamento.

O foco deixa de ser planejamento.

O foco passa a ser:

O que faço agora?

No topo:

Seu dia em São Paulo

Saldo planejado:

R$114 livres

Componente principal:

Próxima parada

Parque Ibirapuera

Você deve sair em:

18 min

Chegada prevista:

09:02

Custo:

Grátis

CTA dominante:

Começar trajeto

Abaixo dele:

visualização discreta do restante do dia.

ALTERAR MEU PLANO

Criar uma ação secundária:

Alterar meu plano

Ao selecionar, apresentar opções:

Quero comer

Quero descansar

Quero algo gratuito

Quero gastar menos

Quero um lugar fechado

Quero adicionar um lugar

Quero mudar o passeio

Essa interação futuramente será conectada ao motor inteligente.

Por enquanto apenas simule o comportamento.

FILOSOFIA DE REPLANEJAMENTO

Futuramente, sempre que alguma coisa mudar, preservar primeiro aquilo que possui maior importância para o usuário.

Prioridade conceitual:

lugares marcados pelo usuário como “Quero muito ir”;

compromissos com horário fixo;

orçamento máximo;

horário de término;

preferências;

sugestões automáticas.

Nunca substituir silenciosamente uma escolha importante feita pelo usuário.

O aplicativo deve reorganizar o dia ao redor das intenções humanas, não obrigar o usuário a seguir a decisão do algoritmo.

EXPERIÊNCIA EMOCIONAL

Queremos provocar principalmente cinco sentimentos:

CONTROLE

“Sei quanto posso gastar.”

TRANQUILIDADE

“Não preciso organizar tudo.”

DESCOBERTA

“Estou encontrando coisas interessantes.”

CONFIANÇA

“O aplicativo parece saber o que está fazendo.”

AUTONOMIA

“O roteiro é meu. Posso colocar aquilo que importa para mim.”

Toda escolha visual deve reforçar pelo menos um desses sentimentos.

DIREÇÃO VISUAL

Quero um produto:

sofisticado;
humano;
leve;
editorial;
contemporâneo;
premium;
acolhedor;
extremamente legível.

Inspire-se nos princípios de qualidade encontrados em produtos como:

Airbnb — apresentação de lugares e fotografias;

Google Maps — eficiência da informação geográfica;

Uber — clareza da próxima ação;

Apple — hierarquia e refinamento visual.

NÃO copie layouts, componentes ou identidade dessas empresas.

Use apenas princípios de produto.

EVITAR ESTÉTICA DE “APP FEITO POR IA”

É extremamente importante.

NÃO utilizar:

gradiente roxo/azul genérico;
background com blobs abstratos;
efeitos glassmorphism excessivos;
ícones aleatórios;
cards para absolutamente tudo;
bordas arredondadas exageradas em todos os elementos;
emoji como sistema de ícones;
textos como “Powered by AI”;
robôs;
ícones de cérebro;
ícones de sparkle em excesso;
dezenas de badges;
dashboards cheios de métricas;
hero enorme com ilustração genérica;
shadows fortes;
animações chamativas;
layout corporativo SaaS;
Lorem Ipsum;
frases publicitárias genéricas.

Se algum elemento parecer pertencente a um template genérico de SaaS, redesenhe.

DESIGN SYSTEM

Antes de construir múltiplas telas, estabeleça um pequeno design system reutilizável.

Defina internamente:

background;
surface;
text-primary;
text-secondary;
border;
primary;
success;
warning;
muted.

Utilize tokens.

Não espalhe valores de cores hardcoded pelos componentes.

Defina:

tipografia;
escala de espaçamento;
border radius;
botões;
inputs;
cards;
bottom sheets;
navigation;
chips de seleção;
timeline;
budget component.

Todos devem reutilizar os mesmos padrões.

TIPOGRAFIA

A tipografia deve transmitir personalidade.

Evite aparência de dashboard empresarial.

Escolha uma família altamente legível para interface e, se fizer sentido, uma família complementar para títulos.

Priorize:

legibilidade;
personalidade;
boa renderização mobile.

Não sacrifique performance.

ESPAÇAMENTO

Use whitespace generoso.

Evite densidade excessiva.

Utilize uma escala consistente baseada aproximadamente em múltiplos de 4 ou 8.

Não faça todos os elementos ocuparem containers visuais.

Whitespace pode organizar a interface sozinho.

COMPONENTIZAÇÃO

Estruture componentes reutilizáveis.

Exemplos conceituais:

BudgetSummary

TripStop

TripTimeline

InterestSelector

TravelModeSelector

PlaceDetail

NextStopCard

TripProgress

ExpenseIndicator

BottomActionSheet

UserSelectedPlace

PrioritySelector

AddStopFlow

Não necessariamente utilize exatamente esses nomes caso exista arquitetura melhor.

Não concentre tudo em um único arquivo ou componente gigante.

MODELO DE DADOS FUTURO

Mesmo utilizando MOCK DATA, prepare conceitualmente cada parada para possuir informações como:

id

name

category

estimatedCost

estimatedDuration

source

selectedByUser

priority

locked

scheduledTime

Internamente:

selectedByUser = true/false

priority = required/preferred/suggested

locked = true/false

Não apresentar esses termos técnicos ao usuário.

Eles existirão apenas para preparar a arquitetura futura.

MOBILE FIRST

Projetar primeiro para largura aproximada de smartphone moderno.

O produto deve funcionar muito bem entre aproximadamente:

360px e 430px de largura.

Depois adapte responsivamente para tablet e desktop.

Não desenhe desktop e simplesmente comprima para celular.

INTERAÇÕES

Utilize microinterações discretas.

Exemplos:

seleção de interesse;
adição de local;
mudança de prioridade;
mudança de etapa;
resultado aparecendo;
expansão de parada;
reorganização da timeline;
transição para modo passeio.

Animações devem:

orientar;
confirmar;
dar continuidade.

Nunca apenas decorar.

Respeitar usuários que preferem reduced motion.

ACESSIBILIDADE

Garantir:

bom contraste;
tamanho adequado de toque;
navegação por teclado quando aplicável;
focus states;
labels apropriados;
semântica HTML;
não depender apenas de cor;
tipografia confortável;
áreas de toque adequadas.

Meta mínima:

WCAG AA quando aplicável.

PERFORMANCE PERCEBIDA

Mesmo sendo protótipo:

evite telas pesadas;

não carregue imagens gigantes desnecessariamente;

evite animações custosas;

mantenha interação fluida;

priorize carregamento visual rápido.

ARQUITETURA PARA O FUTURO

Embora esta versão use MOCK DATA, organize a arquitetura para permitir que posteriormente os dados simulados sejam substituídos por:

Google Places;
Google Routes;
dados meteorológicos;
benefícios;
banco próprio;
motor de otimização;
modelo de IA.

Componentes não devem depender diretamente de objetos mock hardcoded espalhados pela interface.

Crie uma camada central de dados simulados.

A arquitetura deverá permitir futuramente que lugares adicionados pelo usuário sejam convertidos em restrições do motor de otimização.

NÃO FAZER AGORA

Não implementar:

login;
cadastro;
backend;
Supabase;
Google API;
OpenAI API;
pagamentos;
hotel;
passagens;
voos;
viagens de vários dias;
marketplace;
social;
gamificação;
chatbot;
painel administrativo.

Não adicione funcionalidades que eu não solicitei.

Escopo é uma restrição.

CRITÉRIOS DE ACEITAÇÃO

A primeira versão é considerada bem-sucedida somente se:

uma pessoa compreender a proposta do aplicativo em menos de 5 segundos;

conseguir criar um passeio sem treinamento;

orçamento for percebido como elemento central;

o fluxo inteiro puder ser realizado em smartphone;

nenhuma tela parecer dashboard corporativo;

nenhuma tela parecer chatbot;

a interface possuir identidade consistente;

informações importantes tiverem hierarquia evidente;

o usuário conseguir saber imediatamente “o que faço agora?” durante o passeio;

o protótipo parecer produto comercial, não demonstração tecnológica;

o usuário conseguir adicionar facilmente um lugar que deseja visitar;

o usuário compreender claramente quais lugares foram escolhidos por ele e quais foram sugeridos pelo sistema;

o sistema nunca remover silenciosamente uma parada marcada como importante pelo usuário;

adicionar uma parada após a criação do roteiro deve parecer uma reorganização natural, não a criação de um roteiro completamente novo.

TESTE DE QUALIDADE INTERNO

Antes de considerar a implementação concluída, faça uma revisão silenciosa de cada tela usando estes critérios:

CLAREZA
O usuário entende imediatamente o propósito?

HIERARQUIA
Está claro o que é mais importante?

CARGA COGNITIVA
Existe informação desnecessária?

CONSISTÊNCIA
Componentes seguem o mesmo sistema?

MOBILE
Funciona confortavelmente com uma mão?

CONFIANÇA
O aplicativo parece confiável?

PERSONALIDADE
Parece um produto próprio em vez de template?

AÇÃO
Está evidente qual é o próximo passo?

AUTONOMIA
O usuário sente que pode alterar o roteiro sem perder o trabalho já feito?

RESPEITO À INTENÇÃO
As escolhas explícitas do usuário permanecem protegidas?

Caso algum item esteja fraco, refine antes de finalizar.

Não apresente esse raciocínio interno.

ETAPA DE PLANEJAMENTO

ANTES DE ESCREVER CÓDIGO:

Analise esta especificação.

Proponha a arquitetura de UX para este fluxo.

Defina o design system inicial.

Defina os componentes reutilizáveis necessários.

Defina como lugares escolhidos pelo usuário serão visualmente diferenciados sem criar poluição.

Defina como a interface lidará com conflitos entre orçamento, tempo e lugares obrigatórios.

Identifique eventuais conflitos ou ambiguidades que possam prejudicar seriamente a implementação.

Apresente um resumo curto do plano.

NÃO implemente funcionalidades externas.

NÃO aumente o escopo.

Depois de estabelecer essa fundação, implemente somente o fluxo descrito.

REGRA FINAL

Sempre que houver conflito entre:

mais funcionalidades

e

uma experiência mais simples,

prefira a experiência mais simples.

Sempre que houver conflito entre:

mostrar mais informação

e

mostrar a informação certa no momento certo,

prefira a informação certa no momento certo.

Sempre que houver conflito entre:

uma sugestão automática do sistema

e

uma intenção explicitamente declarada pelo usuário,

preserve a intenção do usuário sempre que for viável.

Quando não for viável, explique o conflito e dê opções.

Nunca remova silenciosamente algo que o usuário declarou importante.

O objetivo não é impressionar o usuário com tecnologia.

O objetivo é fazer o usuário pensar:

“Eu tenho R$500, sei os lugares que quero conhecer e agora sei exatamente como aproveitar meu dia.”

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a515ade-b201-43b7-8879-eacdce8e4de1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
