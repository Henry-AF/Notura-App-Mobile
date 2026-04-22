# Recording Sheet UX Refinement Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refinar o fluxo atual de gravação para que o bottom sheet desapareça completamente quando fechado, suporte estados visuais claros de snap e use um item `Gravar` consistente com a tab bar.

**Architecture:** A store global de gravação passa a separar `recordingStatus` de `sheetState`, permitindo que a UI trate visibilidade e sessão como eixos independentes. `GlassTabBar`, `RecordingBottomSheet` e `RecordingFloatingIndicator` passam a observar essa store para renderizar o botão `Gravar`, o indicador suspenso e os gestos de snap com regras estáveis de UX.

**Tech Stack:** Expo Router, React Native, Animated API, PanResponder, Zustand, `node:test`, TypeScript

---

## Chunk 1: Modelar Estado e Navegação da Sessão

### Task 1: Cobrir o novo contrato de estado e navegação com testes de arquivo

**Files:**
- Modify: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para garantir que:

- `GlassTabBar` não use mais `recordCircle` nem `backgroundColor: "#FF3B30"` como base do botão `Gravar`
- `GlassTabBar` renderize um marcador discreto de gravação abaixo do ícone, condicionado a `status === "recording"`
- `useRecordingStore` declare um estado visual explícito do sheet, por exemplo `sheetState` com `hidden`, `partial` e `expanded`
- a store exponha ações de controle visual além da sessão: `openRecordingSheet`, `closeRecordingSheet`, `expandRecordingSheet`
- `openRecordingSheet` sirva para reabrir a sessão atual sem criar uma nova

Exemplo de trecho a buscar no teste de store:

```js
assert.ok(
  storeSource.includes("sheetState") &&
    storeSource.includes('"hidden"') &&
    storeSource.includes('"partial"') &&
    storeSource.includes('"expanded"'),
  "Expected recording store to model hidden, partial, and expanded sheet states"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL because the current tab still uses the red circular accent and the store still models visibility as a single boolean.

- [ ] **Step 3: Write minimal implementation**

Modificar os arquivos de produção para introduzir o novo contrato:

- `artifacts/notura/stores/useRecordingStore.ts`
  - substituir `isSheetOpen` por `sheetState`
  - manter `status`, `elapsedSeconds`, `visibleLines`, `activeSpeaker`
  - fazer `openRecordingSheet()` definir `sheetState: "partial"`
  - fazer `closeRecordingSheet()` definir `sheetState: "hidden"`
  - adicionar `expandRecordingSheet()` definindo `sheetState: "expanded"`
  - em `stopRecordingSession()`, resetar sessão e `sheetState: "hidden"`
- `artifacts/notura/components/GlassTabBar.tsx`
  - remover o contêiner circular vermelho do item `Gravar`
  - manter `Gravar` como tab regular
  - adicionar um `recordingDot` pequeno sob o ícone apenas quando `status === "recording"`

Exemplo mínimo da nova base do botão:

```tsx
const recordingStatus = useRecordingStore((state) => state.status);
const showRecordingDot = isRecordingTab && recordingStatus === "recording";
```

- [ ] **Step 4: Run test to verify it passes**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/tests/tabbar-nav.test.mjs artifacts/notura/tests/recording-bottom-sheet.test.mjs artifacts/notura/components/GlassTabBar.tsx artifacts/notura/stores/useRecordingStore.ts
git commit -m "refactor: model recording sheet state explicitly"
```

### Task 2: Ajustar reabertura do fluxo sem criar nova sessão

**Files:**
- Modify: `artifacts/notura/components/GlassTabBar.tsx`
- Modify: `artifacts/notura/components/RecordingFloatingIndicator.tsx`
- Modify: `artifacts/notura/app/record.tsx`
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para garantir que:

- tocar em `Gravar` com sessão ativa só chama `openRecordingSheet`
- tocar no indicador suspenso só reabre o sheet
- a rota legada `record.tsx` continue abrindo o sheet pelo mesmo caminho de reabertura

Exemplo:

```js
assert.ok(
  floatingIndicatorSource.includes("openRecordingSheet"),
  "Expected floating indicator to reopen the current sheet state"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL if any file still assumes open/close based on `isSheetOpen` or mixes reopening with session creation.

- [ ] **Step 3: Write minimal implementation**

Atualizar os componentes para usar apenas a ação de reabertura:

- `artifacts/notura/components/GlassTabBar.tsx`
  - manter `openRecordingSheet()` como única ação do tab `Gravar`
- `artifacts/notura/components/RecordingFloatingIndicator.tsx`
  - manter toque do indicador ligado apenas a `openRecordingSheet()`
- `artifacts/notura/app/record.tsx`
  - preservar compatibilidade de rota antiga, reabrindo o sheet e voltando para a tab anterior

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/components/GlassTabBar.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/app/record.tsx artifacts/notura/tests/recording-bottom-sheet.test.mjs
git commit -m "fix: reopen active recording sessions consistently"
```

## Chunk 2: Refinar UI, Gestos e Invisibilidade Completa

### Task 3: Cobrir invisibilidade real do sheet e regras do indicador

**Files:**
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para garantir que:

- o sheet não renderize `backdrop` quando `sheetState === "hidden"`
- o componente trate `hidden` como estado sem área interativa
- o indicador use `sheetState === "hidden"` em vez de um booleano genérico
- o indicador não apareça quando o sheet estiver em `partial` ou `expanded`

Exemplo:

```js
assert.ok(
  bottomSheetSource.includes('sheetState === "hidden"') ||
    bottomSheetSource.includes('sheetState !== "hidden"'),
  "Expected bottom sheet rendering to branch on explicit hidden state"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL because the current component still keeps the host mounted and drives openness with `isSheetOpen`.

- [ ] **Step 3: Write minimal implementation**

Modificar os componentes visuais:

- `artifacts/notura/components/RecordingBottomSheet.tsx`
  - trocar `isSheetOpen` por `sheetState`
  - só renderizar `backdrop` quando `sheetState !== "hidden"`
  - desligar `pointerEvents` e a área animada quando `sheetState === "hidden"`
  - posicionar o snap `partial` e `expanded` com valores explícitos
- `artifacts/notura/components/RecordingFloatingIndicator.tsx`
  - exibir indicador apenas quando `status !== "idle"` e `sheetState === "hidden"`

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/tests/recording-bottom-sheet.test.mjs
git commit -m "fix: fully hide recording sheet when dismissed"
```

### Task 4: Implementar snaps de gesto e hierarquia visual alinhada ao DESIGN.md

**Files:**
- Modify: `artifacts/notura/components/RecordingBottomSheet.tsx`
- Modify: `artifacts/notura/components/GlassTabBar.tsx`
- Modify: `artifacts/notura/components/RecordingFloatingIndicator.tsx`
- Modify: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para garantir que:

- o `PanResponder` suporte gesto para cima e para baixo
- o fluxo use `expandRecordingSheet()` quando o snap for expandido
- o tab `Gravar` possua um estilo dedicado para a bolinha vermelha, por exemplo `recordingDot`
- o indicador permaneça sem animação pulsante

Exemplo:

```js
assert.ok(
  bottomSheetSource.includes("expandRecordingSheet") &&
    bottomSheetSource.includes("gestureState.dy") &&
    bottomSheetSource.includes("gestureState.vy"),
  "Expected the sheet gesture to choose between expanded and hidden snap states"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL because the current gesture only dismisses downward and the tab still uses the old visual accent.

- [ ] **Step 3: Write minimal implementation**

Aplicar o refinamento visual e de gesto:

- `artifacts/notura/components/RecordingBottomSheet.tsx`
  - mapear `sheetState` para dois snaps visuais: `partial` e `expanded`
  - no `onPanResponderMove`, permitir deslocamento negativo e positivo
  - no release, usar distância e velocidade para escolher entre `expandRecordingSheet()` e `closeRecordingSheet()`
  - manter `openRecordingSheet()` reabrindo em `partial`
- `artifacts/notura/components/GlassTabBar.tsx`
  - alinhar `Gravar` ao mesmo layout dos outros tabs
  - renderizar `recordingDot` entre ícone e label
  - aplicar `accent-primary` ao estado ativo normal
- `artifacts/notura/components/RecordingFloatingIndicator.tsx`
  - manter material claro, timer e waveform curta sem bounce ou pulse

- [ ] **Step 4: Run test to verify it passes**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/GlassTabBar.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/tests/tabbar-nav.test.mjs artifacts/notura/tests/recording-bottom-sheet.test.mjs
git commit -m "feat: refine recording sheet gestures and tab state"
```

## Chunk 3: Regressão e Verificação Final

### Task 5: Executar verificação completa do refinamento

**Files:**
- Modify: `docs/superpowers/specs/2026-04-22-recording-sheet-ux-refinement-design.md`
- Modify: `docs/superpowers/plans/2026-04-22-recording-sheet-ux-refinement.md`
- Test: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/navbar-consistency.test.mjs`
- Test: `artifacts/notura/package.json`

- [ ] **Step 1: Run focused regression tests**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- `node --test artifacts/notura/tests/navbar-consistency.test.mjs`

Expected: PASS

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter @workspace/notura run typecheck`

Expected: PASS. If unrelated pre-existing failures remain, document them explicitly before closing the task.

- [ ] **Step 3: Commit**

```bash
git add artifacts/notura/components/GlassTabBar.tsx artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/stores/useRecordingStore.ts artifacts/notura/app/record.tsx artifacts/notura/tests/tabbar-nav.test.mjs artifacts/notura/tests/recording-bottom-sheet.test.mjs docs/superpowers/specs/2026-04-22-recording-sheet-ux-refinement-design.md docs/superpowers/plans/2026-04-22-recording-sheet-ux-refinement.md
git commit -m "feat: polish recording sheet interaction states"
```
