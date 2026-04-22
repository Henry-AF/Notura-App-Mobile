# Recording Bottom Sheet Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a tela de gravação por um bottom sheet global com estado em `zustand`, indicador flutuante acima da tab bar e reabertura da sessão em andamento.

**Architecture:** O layout das tabs passa a montar um `RecordingBottomSheet` e um `RecordingFloatingIndicator` observando a mesma store `zustand`. A tab bar deixa de navegar para `/record` e passa a abrir o sheet; a store controla abertura/fechamento, timer, status da sessão e finalização da gravação, enquanto o `AppContext` segue responsável apenas pelos dados persistidos da aplicação.

**Tech Stack:** Expo Router, React Native, Animated API, Zustand, testes de arquivo com `node:test`

---

## Chunk 1: Global Recording Flow

### Task 1: Cobrir o novo fluxo global de gravação com testes de arquivo

**Files:**
- Modify: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Create: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`
- Test: `artifacts/notura/tests/tabbar-nav.test.mjs`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para:
- `GlassTabBar` chamar `openRecordingSheet` em vez de `router.push("/record")`
- `TabLayout` montar `RecordingBottomSheet` e `RecordingFloatingIndicator`
- uso de `useRecordingStore`
- reabertura do sheet ao tocar no indicador

- [ ] **Step 2: Run test to verify it fails**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: FAIL because the current app still navigates to `/record` and has no global sheet/indicator/store.

- [ ] **Step 3: Write minimal implementation**

Criar a store e os componentes globais mínimos para satisfazer o fluxo.

- [ ] **Step 4: Run test to verify it passes**

Run:
- `node --test artifacts/notura/tests/tabbar-nav.test.mjs`
- `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/tests/tabbar-nav.test.mjs artifacts/notura/tests/recording-bottom-sheet.test.mjs artifacts/notura/components/GlassTabBar.tsx artifacts/notura/app/(tabs)/_layout.tsx artifacts/notura/stores/useRecordingStore.ts artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/package.json pnpm-lock.yaml
git commit -m "feat: add global recording bottom sheet"
```

### Task 2: Migrar o conteúdo da gravação para o sheet com estado em zustand

**Files:**
- Create: `artifacts/notura/stores/useRecordingStore.ts`
- Create: `artifacts/notura/components/RecordingBottomSheet.tsx`
- Create: `artifacts/notura/components/RecordingFloatingIndicator.tsx`
- Modify: `artifacts/notura/components/GlassTabBar.tsx`
- Modify: `artifacts/notura/app/(tabs)/_layout.tsx`
- Modify: `artifacts/notura/app/record.tsx`
- Modify: `artifacts/notura/context/AppContext.tsx`
- Modify: `artifacts/notura/package.json`
- Test: `artifacts/notura/tests/recording-bottom-sheet.test.mjs`

- [ ] **Step 1: Write the failing test**

Garantir no teste que:
- a store exporta ações para abrir, fechar, iniciar, pausar, retomar e parar
- o indicador depende de `isSheetOpen` e `status`
- a gravação em andamento mantém o timer visível acima da tab bar

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`
Expected: FAIL because the store/actions and indicator conditions still do not exist.

- [ ] **Step 3: Write minimal implementation**

Implementar:
- store `zustand`
- sheet com controles de iniciar/pausar/parar
- indicador flutuante reabrindo o sheet
- integração com `addConversation`

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/recording-bottom-sheet.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/stores/useRecordingStore.ts artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/components/GlassTabBar.tsx artifacts/notura/app/(tabs)/_layout.tsx artifacts/notura/app/record.tsx artifacts/notura/context/AppContext.tsx artifacts/notura/tests/recording-bottom-sheet.test.mjs artifacts/notura/package.json pnpm-lock.yaml
git commit -m "feat: move recording flow into zustand sheet"
```

### Task 3: Verificação final

**Files:**
- Modify: `artifacts/notura/components/GlassTabBar.tsx`
- Modify: `artifacts/notura/app/(tabs)/_layout.tsx`
- Modify: `artifacts/notura/components/RecordingBottomSheet.tsx`
- Modify: `artifacts/notura/components/RecordingFloatingIndicator.tsx`
- Modify: `artifacts/notura/stores/useRecordingStore.ts`
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
Expected: PASS, or if pre-existing failures remain outside this change, document them explicitly.

- [ ] **Step 3: Commit**

```bash
git add artifacts/notura/components/GlassTabBar.tsx artifacts/notura/app/(tabs)/_layout.tsx artifacts/notura/components/RecordingBottomSheet.tsx artifacts/notura/components/RecordingFloatingIndicator.tsx artifacts/notura/stores/useRecordingStore.ts artifacts/notura/tests/tabbar-nav.test.mjs artifacts/notura/tests/recording-bottom-sheet.test.mjs docs/superpowers/specs/2026-04-22-recording-bottom-sheet-design.md docs/superpowers/plans/2026-04-22-recording-bottom-sheet.md artifacts/notura/package.json pnpm-lock.yaml
git commit -m "feat: add floating recording session flow"
```
