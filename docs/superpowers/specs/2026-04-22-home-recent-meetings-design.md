# Home Recent Meetings Design

**Date:** 2026-04-22

**Goal**

Atualizar a seção de recentes na tela inicial para destacar apenas reuniões concluídas no dia atual, com um card compacto e estado vazio explícito.

**Scope**

- Renomear a seção `Recentes` para `Reuniões Recentes`
- Inserir espaçamento visível entre o cabeçalho da seção e a lista
- Filtrar apenas reuniões concluídas feitas hoje
- Ordenar da mais recente para a mais antiga
- Limitar a lista a 3 itens
- Exibir mensagem de vazio quando não houver reuniões concluídas hoje
- Manter `Ver tudo` navegando para a aba `Reuniões`

**Data Rules**

- Fonte de dados: `conversations` do `AppContext`
- Critério de inclusão:
  - `status === "completed"`
  - reunião gravada no dia atual
- Ordenação:
  - mais recente primeiro
- Limite:
  - no máximo 3 itens

Como os dados atuais da aplicação trazem `date`, `dateShort` e `duration`, a implementação deve introduzir uma forma consistente de derivar o momento relativo da gravação para a home. O comportamento esperado é suportar rótulos como `Agora mesmo`, `30 minutos atrás` e `1 hora atrás`.

**UI**

O cabeçalho da seção passa a usar o título `Reuniões Recentes` com `Ver tudo` apontando para `/(tabs)/search`.

Cada item da lista usa um card compacto específico da home com altura menor que os cards da tela `Reuniões`. O card mostra apenas:

- título
- momento relativo da gravação
- duração em estilo tipográfico menor
- status

O card não deve mostrar subtítulo, participantes, avatars, bloco de data ou metadados extras.

**Empty State**

Quando não houver reuniões concluídas hoje, a home deve exibir a mensagem:

`Nenhuma reunião foi feita hoje.`

**Testing**

Cobrir com testes de arquivo:

- título novo da seção
- navegação de `Ver tudo` para `/(tabs)/search`
- filtro por reuniões concluídas de hoje
- limite de 3 itens
- mensagem de vazio
- remoção do uso do card antigo de conversas nessa seção
