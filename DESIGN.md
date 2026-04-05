# Design System: @empireoe/mobile-ui

Authoritative tokens and patterns live in **`src/lib/theme.ts`**. This document mirrors that file for AI agents and reviewers. If code and this file disagree, **update the doc or the code together**—`theme.ts` is the runtime source of truth.

Monorepo context: see **`../DESIGN.md`** for optional `awesome-design-md` references on web; this package overrides those for React Native.

---

## 1. Visual theme & atmosphere

- **Default:** Light, product-style UI—soft gray canvas (`#f9fafb`), white cards, blue primary (`#2563eb`). Clear hierarchy, comfortable density, rounded rectangles (8–16px), subtle borders over heavy chrome.
- **Dark:** Gray-900 surfaces (`#111827` / `#1f2937`), light text. Use `commonStyles.screenDark`, `cardDark`, `inputDark` and dark text tokens.
- **Premium flows:** `premiumDark` shifts toward black cards and iOS-like blue `#007AFF`; `PremiumLoginScreen` and `premiumTabBarOptions` align with that lane.
- **Per-product accents:** Use `productColors` for tab bars, headers, or key CTAs so each Empire app keeps a distinct accent without forking the whole palette. **Empire Digital** uses Apple Blue (`#0071e3` in `productColors.empireDigital`), aligned with `awesome-design-md-main/design-md/apple/DESIGN.md` and `empire-digital-web`. The Digital Expo apps may override `primary` in their local `theme.ts` (e.g. `#2997ff` on OLED) while keeping login/marketing accents on `productColors.empireDigital`.

---

## 2. Color palette & roles

### Brand & primary (light default)

| Token | Hex | Role |
|-------|-----|------|
| `colors.primary` | `#2563eb` | Primary buttons, links, active states |
| `colors.primaryLight` | `#eff6ff` | Tinted backgrounds |
| `colors.primaryDark` | `#1d4ed8` | Pressed / emphasis |

### Semantic

| Token | Hex | Role |
|-------|-----|------|
| `success` / `successLight` | `#059669` / `#dcfce7` | Positive outcomes |
| `warning` / `warningLight` | `#d97706` / `#fef3c7` | Caution |
| `danger` / `dangerLight` | `#dc2626` / `#fef2f2` | Errors, destructive |
| `info` / `infoLight` | `#2563eb` / `#eff6ff` | Informational |

### Neutrals — light

| Token | Hex | Role |
|-------|-----|------|
| `background` | `#f9fafb` | Screen base |
| `card` | `#ffffff` | Elevated surfaces |
| `cardBorder` | `#f3f4f6` | Card edge |
| `border` | `#e5e7eb` | Dividers, outlines |
| `inputBorder` | `#d1d5db` | Fields |
| `text` | `#111827` | Primary copy |
| `textSecondary` | `#374151` | Secondary |
| `textMuted` | `#6b7280` | Tertiary |
| `textPlaceholder` | `#9ca3af` | Placeholders |

### Neutrals — dark (`dark*`)

`darkBackground`, `darkCard`, `darkCardBorder`, `darkBorder`, `darkInputBorder`, `darkText`, `darkTextSecondary`, `darkTextMuted`, `darkTextPlaceholder` — mirror the light roles on darker surfaces.

### Status pills

`statusNew`, `statusActive`, `statusPending`, `statusCompleted`, `statusRejected` — map workflow states to gray / blue / amber / green / red.

### Per-product accents (`productColors`)

| Key | Hex | Typical product |
|-----|-----|-----------------|
| `empireo` | `#171717` | EmpireO.AI (premium ink) |
| `recruitment` | `#0071e3` | Recruitment (Apple Blue, `recruitment-web` / apple spec) |
| `eoe` | `#171717` | EOE |
| `empireDigital` | `#0071e3` | Empire Digital (Apple Blue) |
| `lwe` | `#533afd` | LWE (Stripe spec) |
| `afterServices` | `#ff385c` | After Services (Airbnb Rausch Red) |
| `egpn` | `#f59e0b` | EGPN |
| `codnov` | `#3b82f6` | Codnov |

### Apple system colors (`appleColors`)

Use for native-feeling system UI or parity with iOS labels/separators—not as a replacement for `colors` on branded screens.

---

## 3. Typography

**Sizes (`fontSizes`):** `xs` 10 → `5xl` 28 (see `theme.ts` for full map).  
**Weights (`fontWeights`):** `normal` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800.

**Presets (`typography`):**

| Preset | Use |
|--------|-----|
| `h1` | Top-level screen title (22px, bold) |
| `h2` | Section title (20px, bold) |
| `h3` | Subsection (17px, bold) |
| `body` | Main copy (14px, secondary color, lineHeight 22) |
| `bodySmall` | Supporting text (13px, muted) |
| `caption` | Meta, timestamps (11px, muted) |
| `label` | Form labels (11px, semibold) |
| `button` | Primary button label (15px, semibold, white) |

Dark mode: override `color` with `darkText` / `darkTextSecondary` / `darkTextMuted` as needed.

---

## 4. Spacing, radius, elevation

**Spacing (`spacing`):** `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 20, `2xl` 24, `3xl` 32, `4xl` 40; **`screenPadding`** 20, **`screenTop`** 60 for default safe content inset.

**Radius (`radius`):** `sm` 8 … `3xl` 20; **`full`** 9999; **`pill`** 20 for chips/status.

**Shadow:** `cardShadow` — light elevation (opacity 0.08, radius 8, `elevation: 2` on Android).

---

## 5. Component patterns (`commonStyles`)

| Style | Role |
|-------|------|
| `screen` / `screenDark` | Root scroll/container background |
| `screenContent` | Horizontal padding + top inset |
| `card` / `cardDark` | Bordered rounded panel, `marginBottom: md` |
| `input` / `inputDark` | Single-line field shell |
| `buttonPrimary` | Filled primary CTA |
| `buttonOutline` | Secondary CTA |
| `pill` | Status / tag container |
| `row` / `rowBetween` | Horizontal layouts |

**Prefer exported components** when they exist: `FormTextInput`, `FormSelect`, `AnimatedButton`, `EmptyState`, `Toast`, `Skeleton*`, `FAB`, `BottomSheet`, etc.—extend in-app rather than duplicating patterns.

---

## 6. Layout principles

- Use **`spacing.screenPadding`** for horizontal screen margins unless a component defines its own.
- Stack sections with **`spacing.md`** or **`spacing.lg`** between cards.
- Keep touch targets at least ~44pt effective size for primary actions (platform guideline).
- Lists: use **`InfiniteList`** + **`useInfiniteList`** where pagination applies.

---

## 7. Do’s and don’ts

**Do**

- Import `colors`, `spacing`, `radius`, `typography`, `commonStyles` from `@empireoe/mobile-ui`.
- Pick **`productColors[productKey]`** for the active app when accenting navigation or hero actions.
- Use **`premiumDark`** / **`premiumTabBarOptions`** only for flows explicitly designed as “premium” (e.g. login).

**Don’t**

- Scatter raw hex values that duplicate `theme.ts`—add a token or extend `productColors`.
- Mix unrelated accent systems on one screen (e.g. random purple CTAs on a recruitment-blue app without intent).
- Ignore dark variants when the screen supports dark mode.

---

## 8. Responsive & platform notes

- React Native: use `StyleSheet`, flex layouts, and safe area libraries as the host app already does.
- Shadows: iOS uses `shadow*`; Android uses `elevation` on `cardShadow`.
- Haptics: `tapLight`, `tapMedium`, `notifySuccess`, etc. from `lib/haptics` for feedback on key interactions.

---

## 9. Agent prompt guide

- **“Build a settings row list”** — `commonStyles.card`, `rowBetween`, `typography.body`, `colors.textSecondary`, `spacing.lg`.
- **“Primary + secondary actions”** — `buttonPrimary` + white text via `typography.button`; outline via `buttonOutline` + `colors.text` / `primary`.
- **“Status badge”** — `commonStyles.pill` + `status*` background/text contrast from semantic colors.
- **“EmpireO-branded header”** — `productColors.empireo` for active tab / key CTA.
- **“Empire Digital accent”** — `productColors.empireDigital` (`#0071e3`); use app `theme.ts` overrides for OLED primary if needed.

When adding new shared primitives, extend **`theme.ts`** and update **this `DESIGN.md`** in the same change.
