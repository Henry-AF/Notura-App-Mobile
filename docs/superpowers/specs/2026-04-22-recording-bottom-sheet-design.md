# Recording Bottom Sheet Design

**Date:** 2026-04-22

**Goal**

Transformar a experiência de gravação em um bottom sheet global que pode ser fechado sem interromper a gravação, com um indicador flutuante acima da tab bar para mostrar que o microfone continua ativo e permitir reabrir o sheet no mesmo estado.

**Scope**

- Trocar o fluxo atual de tela cheia de gravação por um bottom sheet global
- Permitir fechar o sheet durante a gravação sem parar o processo
- Mostrar um indicador flutuante acima da tab bar quando a gravação estiver ativa e o sheet estiver fechado
- Reabrir o sheet ao tocar nesse indicador
- Migrar o estado hoje local de gravação para uma store global com `zustand`

**Architecture**

O estado de gravação deixa de viver em `record.tsx` e passa a ser controlado por uma store `zustand`, responsável por:

- visibilidade do bottom sheet
- status da gravação (`idle`, `recording`, `paused`)
- tempo decorrido
- speaker ativo
- linhas visíveis da transcrição simulada
- ações de abrir, fechar, iniciar, pausar, retomar e parar

O layout das tabs monta duas camadas globais:

- `RecordingBottomSheet`
- `RecordingFloatingIndicator`

Essas camadas observam a mesma store e permanecem disponíveis em qualquer aba.

**Navigation Behavior**

- O item `Gravar` da tab bar passa a abrir o bottom sheet, em vez de navegar para uma tela cheia
- Fechar o sheet enquanto estiver gravando apenas esconde a interface
- Se a gravação estiver ativa e o sheet estiver fechado, o indicador flutuante permanece visível acima da tab bar
- Tocar no indicador reabre o sheet exatamente no estado atual
- Ao parar a gravação, a store cria a conversa, remove o indicador e fecha o sheet

**UI**

`RecordingBottomSheet`

- aparece sobre o conteúdo atual das tabs
- mantém os controles principais já existentes: iniciar, pausar/retomar, parar e marcar
- adapta o layout atual para altura de sheet, com pegador visual e header mais compacto

`RecordingFloatingIndicator`

- fica centralizado acima da tab bar
- mostra ícone de microfone, timer e animações sutis
- indica claramente quando está gravando
- quando pausado, muda o estado visual mas continua servindo como atalho para reabrir o sheet

**State Management**

Usar `zustand` no lugar do estado atual espalhado entre `record.tsx` e `AppContext`.

Responsabilidades da store:

- guardar o estado efêmero da sessão de gravação
- iniciar/parar timers
- controlar o estado visual do sheet e do indicador
- expor ações simples para os componentes globais e para a tab bar

O `AppContext` continua responsável por dados persistidos da aplicação, mas não pelo ciclo de vida da gravação.

**Testing**

Cobrir com testes de arquivo:

- tab bar usa abertura do sheet em vez de navegação para `/record`
- layout das tabs monta o bottom sheet e o indicador global
- indicador aparece quando a gravação está ativa e o sheet está fechado
- tocar no indicador reabre o sheet
- parar a gravação remove o indicador e encerra a sessão
