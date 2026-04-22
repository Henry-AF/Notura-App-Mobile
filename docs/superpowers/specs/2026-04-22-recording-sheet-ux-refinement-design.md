# Refinamento UX do Recording Sheet

**Data:** 2026-04-22
**Escopo:** Ajustar a experiência do bottom sheet global de gravação para respeitar o `DESIGN.md`, remover resíduos visuais quando fechado e tornar o item `Gravar` da tab bar um tab regular com estado de gravação discreto.

## Objetivo

Refinar o fluxo atual de gravação para que:

- o bottom sheet suma completamente quando fechado
- o sheet só volte ao fluxo visível ao tocar em `Gravar` ou no indicador suspenso
- o item `Gravar` da tab bar tenha a mesma base visual dos outros tabs
- o estado de gravação seja comunicado por uma bolinha vermelha discreta abaixo do ícone
- o gesto vertical permita somente dois resultados claros: fechar ou expandir para tela cheia

## Direção de UX

O fluxo deve seguir uma lógica simples e estável:

- tocar em `Gravar` abre o sheet
- se já existir uma sessão ativa, `Gravar` apenas reabre o sheet no estado atual
- arrastar para cima expande o sheet para tela cheia
- arrastar para baixo fecha o sheet completamente
- com gravação ativa e sheet fechado, o indicador suspenso permanece visível
- tocar no indicador reabre a sessão atual sem resetar o estado

Isso evita ambiguidades entre navegação, gravação e visibilidade da interface.

## Modelo de Estados

Separar o estado da sessão do estado visual do sheet.

### Sessão de gravação

- `idle`
- `recording`
- `paused`

### Estado visual do sheet

- `hidden`
- `partial`
- `expanded`

Regras:

- `hidden` remove completamente o sheet da tela, incluindo backdrop, área tocável e resíduos de layout
- `partial` é o estado padrão ao abrir o fluxo
- `expanded` ocupa a área útil superior da tela, mantendo identidade de sheet e não de rota cheia separada
- `stopRecordingSession()` encerra a sessão e força `sheetState` para `hidden`

## Interações

### Botão `Gravar` na tab bar

- deixa de usar aparência de FAB ou círculo vermelho sólido
- passa a compartilhar a mesma estrutura visual de `Início` e `Reuniões`
- mantém ícone e label alinhados ao design system da navegação
- se não houver sessão ativa, abre o sheet em `partial`
- se houver sessão ativa, reabre o sheet atual e nunca inicia uma segunda sessão

### Indicador de gravação

- aparece apenas quando `recordingStatus !== idle` e `sheetState === hidden`
- fica centralizado acima da tab bar
- em gravação ativa, exibe mic vermelho, timer e waveform curta
- em pausa, troca para estado visual mais calmo com cor de accent e ícone de pausa
- tocar no indicador sempre reabre o sheet no contexto atual

### Gestos do bottom sheet

- arrastar para cima favorece snap em `expanded`
- arrastar para baixo favorece snap em `hidden`
- não deve existir estado intermediário ambíguo após o término do gesto
- a decisão final usa distância e velocidade para escolher o snap mais próximo

## Direção Visual

Aplicar o `DESIGN.md` de forma explícita:

- tab bar como camada premium com material claro e hierarquia consistente
- `Gravar` visualmente igual aos demais tabs, sem destaque estrutural fora da malha da navegação
- bolinha vermelha pequena e centralizada abaixo do ícone como sinal de gravação em andamento
- uso de `accent-primary` para estados ativos normais da navegação
- bottom sheet com cantos amplos, sombra flutuante suave e transição contínua
- em `expanded`, manter handle, respiro superior e sensação de painel elevado
- em `hidden`, nenhuma sobra visual ou área bloqueando a interface

## Comportamento de Usabilidade

- o usuário pode fechar o sheet sem interromper a gravação
- o usuário entende claramente onde retomar a sessão: `Gravar` ou indicador suspenso
- o indicador não compete com o sheet; ele nunca aparece enquanto o sheet estiver aberto
- o app deve continuar totalmente tocável quando o sheet estiver fechado
- a transição entre `partial`, `expanded` e `hidden` deve usar curva suave e previsível, coerente com a linguagem iOS do projeto

## Impacto Técnico

O estado global de gravação deve deixar explícitos os dois eixos de controle:

- `recordingStatus`
- `sheetState`

A implementação deve introduzir ações dedicadas para:

- abrir o sheet
- fechar o sheet
- expandir o sheet
- opcionalmente reduzir de `expanded` para `partial`, se isso for necessário para melhorar o snap interno sem expor essa complexidade ao usuário

O componente do sheet deve deixar de depender de um único `translateY` para simular todos os estados. Ele precisa representar visualmente o snap atual e desmontar ou neutralizar totalmente a UI quando estiver oculto.

## Testes Esperados

Cobrir pelo menos os seguintes comportamentos:

- `Gravar` renderiza como tab regular, sem FAB
- a bolinha vermelha aparece abaixo do ícone apenas durante `recording`
- o sheet não renderiza backdrop nem intercepta toques em `hidden`
- arrasto para cima leva a `expanded`
- arrasto para baixo leva a `hidden`
- tocar em `Gravar` com sessão ativa reabre o sheet atual
- tocar no indicador reabre o sheet
- o indicador só aparece com sessão ativa e sheet fechado

## Fora de Escopo

- alterar o motor da gravação em si
- adicionar novos controles de gravação além dos já existentes
- redesenhar a arquitetura global de tabs fora do item `Gravar`

## Resultado Esperado

O fluxo final deve parecer mais confiável, menos intrusivo e mais consistente com o restante da navegação. O usuário deve perceber que a gravação continua viva mesmo com o sheet fechado, mas sem sentir que existe um painel “preso” na tela quando ele escolhe escondê-lo.
