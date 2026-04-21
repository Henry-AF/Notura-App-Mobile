# 🌙 Notura — Design System
**Versão:** 1.0  
**Brand primary:** `#5341CD`  
**Última atualização:** Abril 2026

---

## Índice

1. [Color Tokens](#1-color-tokens)
2. [Typography](#2-typography)
3. [Spacing, Radius & Shadows](#3-spacing-radius--shadows)
4. [Inputs](#4-inputs)
5. [Buttons](#5-buttons)
6. [Badges & Tags](#6-badges--tags)
7. [Cards](#7-cards)
8. [Avatars](#8-avatars)
9. [Toggles](#9-toggles)
10. [Navigation](#10-navigation)
11. [Metric Cards](#11-metric-cards)

---

## 1. Color Tokens

### Brand / Primary

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-50` | `#EAE8F9` | Backgrounds sutis, hover states |
| `brand-100` | `#C7C2EF` | Fills leves, desabilitados |
| `brand-200` | `#A49BE5` | Decorativo, ilustrações |
| `brand-300` | `#8174D9` | Ícones secundários |
| `brand-400` | `#6657D3` | Ícones primários, highlights |
| `brand-500` | `#5341CD` | ★ Cor principal da marca |
| `brand-600` | `#4535B8` | Hover em botões primários |
| `brand-700` | `#3526A0` | Active states |
| `brand-800` | `#261888` | Texto em fundos claros da marca |

### Neutral / Gray

| Token | Hex | Uso |
|-------|-----|-----|
| `gray-50` | `#F8F8FB` | Background da página |
| `gray-100` | `#EEEEF4` | Surface secundária |
| `gray-200` | `#D8D8E4` | Borders, divisores |
| `gray-300` | `#B8B8CC` | Placeholders, desabilitados |
| `gray-400` | `#9494AE` | Ícones inativos |
| `gray-500` | `#707090` | Texto auxiliar |
| `gray-600` | `#505070` | Texto secundário |
| `gray-700` | `#343452` | Texto de corpo |
| `gray-800` | `#1A1A36` | Texto principal / dark surface |

### Semantic

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#1D9E75` | Confirmado, disponível |
| `success-bg` | `rgba(29,158,117,0.10)` | Background de success |
| `warning` | `#EF9F27` | Pendente, atenção |
| `warning-bg` | `rgba(239,159,39,0.12)` | Background de warning |
| `error` | `#E24B4A` | Erro, cancelado |
| `error-bg` | `rgba(226,75,74,0.10)` | Background de error |
| `info` | `#378ADD` | Informativo |
| `info-bg` | `rgba(55,138,221,0.10)` | Background de info |

### Surface / Background

| Token | Hex | Uso |
|-------|-----|-----|
| `surface-0` | `#FFFFFF` | Cards, modais |
| `surface-1` | `#F8F8FB` | Page background |
| `surface-2` | `#EEEEF4` | Inputs, sections |
| `surface-dark` | `#1A1A36` | Dark mode surface |
| `border-default` | `#D8D8E4` | Bordas padrão |
| `border-focus` | `#5341CD` | Borda de foco |

---

## 2. Typography

**Fonte:** Sistema (var(--font-sans))  
**Pesos utilizados:** 400 (regular) e 500 (medium)

| Token | Tamanho | Peso | Letter Spacing | Line Height | Uso |
|-------|---------|------|---------------|-------------|-----|
| `type-display` | 48px | 500 | -0.02em | 1.10 | Hero, splash screen |
| `type-h1` | 36px | 500 | -0.015em | 1.20 | Títulos de página |
| `type-h2` | 28px | 500 | -0.01em | 1.30 | Seções principais |
| `type-h3` | 22px | 500 | 0 | 1.30 | Títulos de card |
| `type-h4` | 18px | 500 | 0 | 1.40 | Sub-seções |
| `type-body-l` | 16px | 400 | 0 | 1.60 | Corpo principal |
| `type-body-m` | 14px | 400 | 0 | 1.60 | Corpo secundário |
| `type-body-s` | 13px | 400 | 0 | 1.50 | Textos de apoio |
| `type-label` | 12px | 500 | 0.02em | 1.40 | Labels, categorias |
| `type-caption` | 11px | 400 | 0 | 1.40 | Metadados, timestamps |
| `type-micro` | 10px | 400 | 0.03em | 1.40 | Versão, notas mínimas |

---

## 3. Spacing, Radius & Shadows

### Spacing Scale

| Token | Valor |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |
| `space-32` | 128px |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-xs` | 4px | Tags pequenas, badges compactos |
| `radius-sm` | 8px | Inputs, botões pequenos |
| `radius-md` | 12px | Botões, chips |
| `radius-lg` | 16px | Cards, modais |
| `radius-xl` | 24px | Bottom sheets, painéis |
| `radius-2xl` | 32px | Telas flutuantes |
| `radius-full` | 9999px | Pills, avatares, toggles |

### Shadows / Elevation

| Token | Valor CSS | Uso |
|-------|-----------|-----|
| `shadow-subtle` | `0 1px 3px rgba(83,65,205,0.06)` | Itens em lista |
| `shadow-card` | `0 4px 12px rgba(83,65,205,0.10)` | Cards padrão |
| `shadow-floating` | `0 8px 24px rgba(83,65,205,0.15)` | FAB, menus flutuantes |
| `shadow-focus` | `0 0 0 3px rgba(83,65,205,0.25)` | Foco em inputs e botões |

---

## 4. Inputs

### Anatomia do Input

```
┌─────────────────────────────────────┐
│ Label (12px · 500)                  │
├─────────────────────────────────────┤
│  Ícone?   Placeholder / Valor       │  ← 48px altura, padding 12px 16px
├─────────────────────────────────────┤
│ Helper text / Erro (11px)           │
└─────────────────────────────────────┘
```

### Propriedades Base

| Propriedade | Valor |
|-------------|-------|
| Altura | 48px |
| Padding | 12px 16px |
| Border Radius | `radius-md` (12px) |
| Border | 1.5px solid `border-default` (`#D8D8E4`) |
| Background | `surface-0` (`#FFFFFF`) |
| Font size | 14px |
| Font weight | 400 |
| Color | `gray-800` (`#1A1A36`) |
| Placeholder color | `gray-300` (`#B8B8CC`) |
| Label font size | 12px |
| Label font weight | 500 |
| Label color | `gray-600` (`#505070`) |
| Helper font size | 11px |
| Helper color | `gray-500` (`#707090`) |
| Gap label → input | 4px |
| Gap input → helper | 4px |

### Estados

#### Default
```css
border: 1.5px solid #D8D8E4;
background: #FFFFFF;
color: #1A1A36;
```

#### Hover
```css
border: 1.5px solid #B8B8CC; /* gray-300 */
```

#### Focus
```css
border: 1.5px solid #5341CD;  /* brand-500 */
box-shadow: 0 0 0 3px rgba(83,65,205,0.15);
outline: none;
```

#### Filled (com valor)
```css
border: 1.5px solid #D8D8E4;
color: #1A1A36;
```

#### Error
```css
border: 1.5px solid #E24B4A;
background: rgba(226,75,74,0.04);
/* Helper text: color #E24B4A */
```

#### Success
```css
border: 1.5px solid #1D9E75;
/* Helper text: color #1D9E75 */
```

#### Disabled
```css
border: 1.5px solid #EEEEF4;
background: #F8F8FB;
color: #B8B8CC;
cursor: not-allowed;
opacity: 0.6;
```

### Variantes

#### Input Padrão (Text)
- Uso: Nome, email, busca
- Altura: 48px
- Sem ícone por padrão

#### Input com Ícone Esquerdo
- Ícone: 16×16px, cor `gray-400`
- Padding-left: 44px (espaço para ícone + gap)
- Ícone fica a 14px da borda esquerda

#### Input com Ícone Direito (ação)
- Usado para: senha (olho), busca (lupa), limpar (×)
- Padding-right: 44px
- Ícone clicável: 20×20px, cor `gray-400` → `brand-500` no hover

#### Input de Senha
```
Estado padrão: texto mascarado (••••)
Ícone direito: olho fechado → clique mostra senha
Ícone muda para: olho aberto
```

#### Input de Busca
```
Ícone esquerdo: lupa (gray-400)
Placeholder: "Buscar eventos..."
Border radius: radius-full (pill) quando standalone
```

#### Textarea
| Propriedade | Valor |
|-------------|-------|
| Min height | 96px |
| Resize | vertical apenas |
| Padding | 12px 16px |
| Border radius | `radius-md` (12px) |
| Font size | 14px |
| Line height | 1.6 |
| Contador de caracteres | 11px · gray-400 · alinhado à direita |

#### Input com Prefixo / Sufixo
```
Prefixo: fundo gray-50, borda direita, texto gray-500
Ex: [ R$ ] [___________]
Sufixo: fundo gray-50, borda esquerda
Ex: [___________] [ /mês ]
```

#### Input Select / Dropdown
```
Ícone: chevron-down (gray-400) à direita
Padding-right: 44px
Ao abrir: chevron-up, border brand-500, shadow-focus
```

#### Input Date / Time
```
Ícone: calendário ou relógio (gray-400) à direita
Mesmo padding e altura do input padrão
```

#### Input OTP / Pin (6 dígitos)
```
6 boxes individuais: 48×56px cada
Gap entre boxes: 8px
Border radius: radius-md (12px)
Foco: border brand-500 + shadow-focus
Preenchido: background brand-50, border brand-400, texto brand-700
```

### Grupos de Input

#### Input Group (stacked)
```
Label
┌──────────────────────────────┐
│ Input 1 (email)              │  border-bottom: none, radius-top only
├──────────────────────────────┤
│ Input 2 (senha)              │  border-top: none, radius-bottom only
└──────────────────────────────┘
```
Border entre inputs: 0.5px solid `gray-200`

#### Floating Label
```
Placeholder flutua para cima ao focar ou preencher
Animação: transform translateY(-10px) + scale(0.85)
Duração: 150ms ease
Label em cima: 11px · brand-500 (focus) / gray-500 (filled)
```

### Tokens CSS dos Inputs

```css
/* ---- Input tokens ---- */
--input-height:        48px;
--input-padding-x:     16px;
--input-padding-y:     12px;
--input-radius:        12px;           /* radius-md */
--input-border:        1.5px solid #D8D8E4;
--input-border-focus:  1.5px solid #5341CD;
--input-border-error:  1.5px solid #E24B4A;
--input-border-success:1.5px solid #1D9E75;
--input-bg:            #FFFFFF;
--input-bg-disabled:   #F8F8FB;
--input-color:         #1A1A36;
--input-placeholder:   #B8B8CC;
--input-label-size:    12px;
--input-label-weight:  500;
--input-label-color:   #505070;
--input-helper-size:   11px;
--input-helper-color:  #707090;
--input-icon-size:     16px;
--input-icon-color:    #9494AE;
--input-focus-ring:    0 0 0 3px rgba(83,65,205,0.15);
```

### Regras de Validação (UX)

- Validar **ao sair do campo** (onBlur), nunca em tempo real durante a digitação
- Mensagem de erro: específica e orientativa (ex: "Email inválido" em vez de "Erro")
- Mensagem de sucesso: discreta, só quando necessária
- Campos obrigatórios: asterisco `*` ao lado do label (cor `error`)
- Limite de caracteres: mostrar contador apenas quando restar ≤ 20% do limite
- Não desabilitar o botão de submit — mostrar erros ao tentar enviar

---

## 5. Buttons

### Propriedades Base

| Propriedade | Valor |
|-------------|-------|
| Border radius | `radius-full` (9999px) |
| Font weight | 500 |
| Transition | `all 150ms ease` |
| Cursor | pointer |

### Tamanhos

| Tamanho | Padding | Font size | Height |
|---------|---------|-----------|--------|
| `btn-sm` | 6px 14px | 12px | 32px |
| `btn-md` | 10px 20px | 14px | 44px |
| `btn-lg` | 14px 28px | 16px | 52px |
| `btn-icon` | — | — | 40×40px |

### Variantes

| Variante | Background | Cor texto | Border | Hover |
|----------|-----------|-----------|--------|-------|
| `primary` | `#5341CD` | `#FFFFFF` | — | `#4535B8` |
| `secondary` | transparent | `#5341CD` | 1.5px `#5341CD` | bg `brand-50` |
| `ghost` | transparent | `gray-600` | 1.5px `border-default` | bg `gray-100` |
| `danger` | transparent | `#E24B4A` | 1.5px `#E24B4A` | bg `error-bg` |
| `success` | transparent | `#1D9E75` | 1.5px `#1D9E75` | bg `success-bg` |

### Estados

```css
/* Active */
transform: scale(0.97);

/* Disabled */
opacity: 0.45;
cursor: not-allowed;

/* Loading */
/* Spinner no lugar do ícone ou texto */
cursor: wait;
```

---

## 6. Badges & Tags

| Variante | Background | Cor texto | Border radius |
|----------|-----------|-----------|--------------|
| `badge-primary` | `rgba(83,65,205,0.12)` | `#3C3489` | radius-full |
| `badge-success` | `rgba(29,158,117,0.12)` | `#085041` | radius-full |
| `badge-warning` | `rgba(239,159,39,0.15)` | `#633806` | radius-full |
| `badge-error` | `rgba(226,75,74,0.12)` | `#A32D2D` | radius-full |
| `badge-neutral` | `gray-100` | `gray-600` | radius-full |

**Tamanho:** padding `3px 10px` · font-size `11px` · font-weight `500`  
**Dot opcional:** `6×6px`, border-radius `50%`, mesma cor semântica

---

## 7. Cards

### Event Card

| Propriedade | Valor |
|-------------|-------|
| Background | `surface-0` |
| Border | 0.5px solid `border-default` |
| Border radius | `radius-lg` (16px) |
| Padding | 16px |
| Shadow | `shadow-card` |

**Estrutura interna:**
- Data block: 40×44px, `brand-50` bg, `radius-md`
- Título: `type-h4` (18px · 500)
- Meta: `type-body-s` (13px · 400 · gray-600)
- Tags: badges ao final

### Metric Card

| Propriedade | Valor |
|-------------|-------|
| Background | `surface-1` (`gray-50`) |
| Border radius | `radius-md` (12px) |
| Padding | 14px 16px |
| Label | 12px · gray-500 |
| Valor | 24px · 500 |
| Sub-label | 11px · success |

---

## 8. Avatars

| Tamanho | Dimensões | Font size |
|---------|-----------|-----------|
| `avatar-sm` | 28×28px | 11px |
| `avatar-md` | 40×40px | 15px |
| `avatar-lg` | 56×56px | 20px |

**Stacking:** margem negativa de -8px, border 2px `surface-0`  
**Cores disponíveis:** purple, teal, coral (fundo 15% opacidade, texto 800)

---

## 9. Toggles

| Propriedade | Valor |
|-------------|-------|
| Largura | 44px |
| Altura | 24px |
| Border radius | `radius-full` |
| Background OFF | `border-default` |
| Background ON | `brand-500` (`#5341CD`) |
| Thumb | 18×18px · branco · `radius-full` |
| Transição | 200ms |
| Label | 13px · `gray-800` |

---

## 10. Navigation

### Bottom Navigation (Mobile)

| Propriedade | Valor |
|-------------|-------|
| Background | `surface-0` |
| Border | 0.5px solid `border-default` |
| Border radius | 16px |
| Padding | 6px |
| Item ativo | bg `brand-50`, cor `brand-500` |
| Item inativo | cor `gray-500` |
| Ícone | 18×18px |
| Label | 10px |
| Item border radius | 12px |

**Itens padrão:** Início · Explorar · Agenda · Perfil

---

## 11. Metric Cards

Usados em grids de 2 a 4 colunas para KPIs.

```
┌──────────────────────┐
│ Label (12px · gray)  │
│ 312                  │  ← 24px · 500
│ +8% hoje  ↑          │  ← 11px · success
└──────────────────────┘
```

**Grid recomendado:** `repeat(auto-fit, minmax(140px, 1fr))` com `gap: 12px`

---

## Notas de Implementação

- Sempre usar CSS variables para cores — facilita dark mode e tematização
- Nunca hardcodar cores fora dos tokens definidos neste documento
- Inputs devem ter `transition: border-color 150ms ease` para suavidade
- Todos os componentes interativos precisam de estado `:focus-visible` acessível
- Mínimo 44×44px para áreas de toque em mobile (WCAG 2.5.5)
- Contraste de texto: mínimo 4.5:1 para texto normal (WCAG AA)

---

*Notura Design System v1.0 — Gerado em Abril 2026*
