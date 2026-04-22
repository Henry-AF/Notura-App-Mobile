# Simplificação de Conteúdo do Recording Sheet

**Data:** 2026-04-22
**Escopo:** Remover a transcrição ao vivo e a lista de participantes do bottom sheet de gravação, mantendo a altura do painel e redistribuindo o espaço com mais respiro visual.

## Objetivo

Simplificar o `RecordingBottomSheet` para que ele fique centrado apenas no núcleo da ação de gravação:

- status da sessão
- timer
- indicador visual de gravação/pausa
- waveform
- controles principais

Ao mesmo tempo, eliminar o estado e o código hoje usados apenas para renderizar participantes simulados e transcrição ao vivo.

## Direção de UX

O painel deve parecer mais limpo e mais premium, não mais pobre.

Regras:

- remover completamente os blocos de participantes e transcrição ao vivo
- manter a altura atual do sheet em vez de compactá-lo
- usar o espaço liberado para ampliar o respiro entre header, timer, waveform e controles
- manter os controles visualmente mais ancorados no terço inferior do painel
- evitar inserir novos cards ou conteúdo substituto só para “preencher espaço”

## Impacto Visual

- o sheet continua com a mesma estrutura principal
- a área central fica menos densa e mais focada
- o waveform ganha mais protagonismo
- o espaçamento vertical passa a ser parte explícita da hierarquia visual

## Impacto Técnico

Remover do fluxo de gravação tudo que só existe para alimentar UI morta:

- `RECORDING_PARTICIPANTS`
- `RECORDING_LIVE_LINES`
- `visibleLines`
- `activeSpeaker`
- timer interno de transcrição
- qualquer renderização e estilo associados aos blocos removidos

O snapshot final da gravação não precisa mais depender desses participantes simulados ao criar a conversa processada.

## Testes Esperados

- o `RecordingBottomSheet` não renderiza mais participantes
- o `RecordingBottomSheet` não renderiza mais transcrição ao vivo
- a store de gravação não expõe mais estado ligado a participantes/transcrição
- os testes existentes do fluxo continuam cobrindo store, sheet state, gesto e indicador

## Fora de Escopo

- mudar o comportamento do botão `Gravar`
- alterar o fluxo de snap do sheet
- reintroduzir qualquer conteúdo substituto no centro do painel

## Resultado Esperado

O sheet final deve ficar mais calmo, com mais espaço em branco e menos ruído, sem deixar código morto ou simulações internas de conteúdo ao vivo.
