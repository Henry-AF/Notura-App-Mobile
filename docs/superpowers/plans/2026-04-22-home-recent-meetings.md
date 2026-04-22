# Home Recent Meetings Implementation Plan

> **For agentic workers:** REQUIRED: Use $subagent-driven-development (if subagents available) or $executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar a seção da home para mostrar até 3 reuniões concluídas de hoje com um card compacto, tempo relativo e estado vazio explícito.

**Architecture:** A home passa a derivar uma lista `recentCompletedMeetingsToday` a partir de `conversations`, filtrando por status concluído e por data de hoje, ordenando do item mais recente para o mais antigo. Um componente compacto dedicado à home renderiza o conteúdo mínimo pedido, enquanto um helper local formata o momento relativo da gravação sem alterar a tela de `Reuniões`.

**Tech Stack:** Expo Router, React Native, TypeScript, testes de arquivo com `node:test`

---

## Chunk 1: Home Recent Meetings

### Task 1: Cobrir a nova seção com teste de arquivo

**Files:**
- Modify: `artifacts/notura/tests/home-premium-layout.test.mjs`
- Test: `artifacts/notura/tests/home-premium-layout.test.mjs`

- [ ] **Step 1: Write the failing test**

Adicionar asserções para:
- `Reuniões Recentes`
- filtro de hoje e `completed`
- `slice(0, 3)`
- mensagem `Nenhuma reunião foi feita hoje.`
- navegação `router.push("/(tabs)/search")`
- remoção do `ConversationCard` na seção

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/home-premium-layout.test.mjs`
Expected: FAIL because the home still renders `Recentes` and uses the old conversation card section.

- [ ] **Step 3: Write minimal implementation**

Atualizar a home para:
- renomear a seção
- calcular a lista filtrada e ordenada
- renderizar um novo card compacto
- exibir o estado vazio

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/home-premium-layout.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/tests/home-premium-layout.test.mjs artifacts/notura/app/(tabs)/index.tsx artifacts/notura/components/HomeRecentMeetingCard.tsx
git commit -m "feat: refresh home recent meetings"
```

### Task 2: Implementar o card compacto da home

**Files:**
- Create: `artifacts/notura/components/HomeRecentMeetingCard.tsx`
- Modify: `artifacts/notura/app/(tabs)/index.tsx`
- Test: `artifacts/notura/tests/home-premium-layout.test.mjs`

- [ ] **Step 1: Write the failing test**

Garantir no teste de arquivo que a home passe a referenciar `HomeRecentMeetingCard` e o helper de tempo relativo.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test artifacts/notura/tests/home-premium-layout.test.mjs`
Expected: FAIL because the component and helper still do not exist in the home source.

- [ ] **Step 3: Write minimal implementation**

Criar um componente compacto com:
- título
- tempo relativo
- duração em tipografia menor
- status

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test artifacts/notura/tests/home-premium-layout.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add artifacts/notura/app/(tabs)/index.tsx artifacts/notura/components/HomeRecentMeetingCard.tsx artifacts/notura/tests/home-premium-layout.test.mjs
git commit -m "feat: add compact recent meetings card"
```

### Task 3: Verificação final

**Files:**
- Modify: `artifacts/notura/app/(tabs)/index.tsx`
- Modify: `artifacts/notura/components/HomeRecentMeetingCard.tsx`
- Test: `artifacts/notura/tests/home-premium-layout.test.mjs`
- Test: `artifacts/notura/tests/meetings-screen.test.mjs`
- Test: `artifacts/notura/tests/home-greeting.test.mjs`
- Test: `artifacts/notura/tests/home-plan-usage.test.mjs`

- [ ] **Step 1: Run focused regression tests**

Run:
- `node --test artifacts/notura/tests/home-premium-layout.test.mjs`
- `node --test artifacts/notura/tests/home-greeting.test.mjs`
- `node --test artifacts/notura/tests/home-plan-usage.test.mjs`
- `node --test artifacts/notura/tests/meetings-screen.test.mjs`

Expected: PASS

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter @workspace/notura run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add artifacts/notura/app/(tabs)/index.tsx artifacts/notura/components/HomeRecentMeetingCard.tsx artifacts/notura/tests/home-premium-layout.test.mjs docs/superpowers/specs/2026-04-22-home-recent-meetings-design.md docs/superpowers/plans/2026-04-22-home-recent-meetings.md
git commit -m "feat: update home recent meetings section"
```
