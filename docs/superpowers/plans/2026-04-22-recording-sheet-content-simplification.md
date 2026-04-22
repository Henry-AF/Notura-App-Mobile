# Recording Sheet Content Simplification Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover transcrição ao vivo e participantes do `RecordingBottomSheet`, preservando a altura do painel e limpando todo o estado morto associado.

**Architecture:** O `RecordingBottomSheet` deixa de depender de dados simulados de acompanhamento ao vivo e passa a renderizar apenas status, timer, waveform e controles. A store `useRecordingStore` é simplificada para manter somente o estado necessário à sessão e ao snap do sheet, enquanto os testes de arquivo passam a garantir que o código removido não volte.

**Tech Stack:** React Native, Animated API, Zustand, `node:test`, TypeScript

---

## Chunk 1: Remover Contratos Mortos

### Task 1: Atualizar os testes para proibir transcrição ao vivo e participantes

**Files:**
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para garantir que:

- `RecordingBottomSheet.tsx` não inclua `RECORDING_PARTICIPANTS`
- `RecordingBottomSheet.tsx` não inclua `RECORDING_LIVE_LINES`
- `RecordingBottomSheet.tsx` não inclua `"Transcrição ao vivo"`
- `useRecordingStore.ts` não inclua `visibleLines`
- `useRecordingStore.ts` não inclua `activeSpeaker`
- `useRecordingStore.ts` não inclua `transcriptTimer`

Exemplo:

```js
assert.ok(
  !bottomSheetSource.includes("RECORDING_PARTICIPANTS") &&
    !bottomSheetSource.includes("RECORDING_LIVE_LINES"),
  "Expected recording sheet to stop rendering live transcript and participant mocks"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL because the current sheet and store still include transcript and participant scaffolding.

- [ ] **Step 3: Write minimal implementation**

Modificar:

- `artifacts/notura/stores/useRecordingStore.ts`
  - remover `RECORDING_PARTICIPANTS`
  - remover `RECORDING_LIVE_LINES`
  - remover `visibleLines`
  - remover `activeSpeaker`
  - remover `transcriptTimer`
  - remover a lógica de progressão de transcrição
- `artifacts/notura/components/RecordingBottomSheet.tsx`
  - remover imports de `Avatar` e `GlassCard`
  - remover renderização dos participantes
  - remover renderização do card de transcrição
  - ajustar a criação da conversa para não depender dos participantes simulados

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/tests/recording-bottom-sheet.test.mjs artifacts/notura/stores/useRecordingStore.ts artifacts/notura/components/RecordingBottomSheet.tsx
git commit -m "refactor: remove recording sheet live transcript scaffolding"
```

## Chunk 2: Reequilibrar Layout e Validar Regressão

### Task 2: Reorganizar o espaço do sheet com mais respiro visual

**Files:**
- Modify: `artifacts/notura/components/RecordingBottomSheet.tsx`
- Modify: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções de contrato visual simples para garantir que:

- o `RecordingBottomSheet` ainda mantenha `WaveformBars`
- o `RecordingBottomSheet` mantenha os controles principais (`Parar`, pausa/retomada, botão principal)
- o componente continue usando `sheetState`, gesto e `expandRecordingSheet`

Exemplo:

```js
assert.ok(
  bottomSheetSource.includes("WaveformBars") &&
    bottomSheetSource.includes('Parar'),
  "Expected recording sheet to stay focused on waveform and core controls after simplification"
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL if the simplified sheet accidentally drops key controls or the expected layout anchors.

- [ ] **Step 3: Write minimal implementation**

Refinar `artifacts/notura/components/RecordingBottomSheet.tsx` para:

- aumentar o espaçamento vertical entre header, timer, waveform e controles
- manter o painel com a altura atual
- evitar cards substitutos ou conteúdo artificial no espaço central
- deixar os controles mais ancorados visualmente no terço inferior do painel

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/tests/recording-bottom-sheet.test.mjs
git commit -m "feat: simplify recording sheet content"
```

### Task 3: Rodar regressão focada

**Files:**
- Test: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/navbar-consistency.test.mjs`

- [ ] **Step 1: Run focused regression tests**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- `node --test artifacts/notura/tests/navbar-consistency.test.mjs`

Expected: PASS

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter @workspace/notura run typecheck`

Expected: The existing pre-existing failures outside the recording flow may remain; document them explicitly and confirm this refinement does not add new typecheck errors in the recording files.

- [ ] **Step 3: Commit**

```bash
git add artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/stores/useRecordingStore.ts artifacts/notura/tests/recording-bottom-sheet.test.mjs docs/superpowers/specs/2026-04-22-recording-sheet-content-simplification-design.md docs/superpowers/plans/2026-04-22-recording-sheet-content-simplification.md
git commit -m "refactor: simplify recording sheet content"
```
