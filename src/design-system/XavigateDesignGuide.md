💥 Yes, Rasta — let’s lock it in.

---

### 📂 Where to Put It:

Create it here:

```
frontend/src/design-system/XavigateDesignGuide.md
```

This is perfect because:

* It lives right next to the components and tokens it references
* Easy for you to open + copy/paste into Claude/GPT as needed
* Easy to version with the rest of your design system

---

### 📄 GFC: `frontend/src/design-system/XavigateDesignGuide.md`

````md
# 🧭 Xavigate Design Guide for AI Assistants (Claude / ChatGPT)

This document contains all necessary info to help AI tools generate accurate, aligned UI for the Xavigate frontend. It defines what components, tokens, and types are available — and how to use them properly.

Use this as your reference when building screens, suggesting UI, or writing code. Assume this file reflects the latest state of the design system.

---

## ✅ COMPONENTS (from `@/design-system/components`)

Each component is reusable, token-based, and should be used instead of writing raw HTML or custom styles.

### 🧱 Layout & Structure

- `Layout`: Wraps the full page, adds padding + max-width.
- `Section`: Adds vertical spacing between content blocks.
- `PageTitle`: Styled `<h1>` with heading font, weight, spacing.
- `Divider`: Horizontal line to separate content.
- `Card`: Basic container block.

### 📥 Inputs & Forms

- `Input`: Single-line input with padding, font, radius.
- `Textarea`: Multi-line input.
- `Checkbox`, `Select`, `Switch`, `Slider`
- `Form`: Wrapper for `<form>`.
- `FormGroup`: Wraps label + field with spacing.

### 🔤 Typography

- `Text`: Typographic component with variants:
  - `'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'caption' | 'button'`
- `Tag`, `Tabs`: Status labels or navigation UI.

---

## 🎨 TOKENS (from `@/design-system/theme`)

These constants define your design language — use them instead of hardcoded styles.

```ts
COLORS.primary.DEFAULT       // brand blue
COLORS.magenta.light         // accent pink
SPACING.md                   // spacing (e.g. padding: SPACING.md)
FONT_SIZES['2xl']            // heading size
RADIUS.md                    // border-radius
SHADOWS.sm                   // drop shadow
LINE_HEIGHTS.normal
FONT_FAMILIES.body
````

---

## 🔄 Component Inventory (Auto-Generated)

<!-- START:COMPONENTS -->
- `Button.stories`
- `Button`
- `Card`
- `Checkbox`
- `Form`
- `FormGroup`
- `Icon`
- `Input`
- `Layout`
- `Modal`
- `PageTitle`
- `RadioGroup`
- `Section`
- `Select`
- `Slider`
- `Switch`
- `Tabs`
- `Tag`
- `Text`
- `Textarea`
<!-- END:COMPONENTS -->

---

## 🧩 SHARED TYPES (from `@/design-system/types.ts`)

```ts
type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type LabelPosition = 'top' | 'left';
```

These are reused in components like `Button`, `Input`, `FormGroup`.


---

<!-- START:TOKENS -->
...will be replaced...
<!-- END:TOKENS -->


---

## 🧠 IMPORT RULES

Always import from the design system root:

```tsx
import { Button, Layout, COLORS } from '@/design-system';
```

Do NOT import from raw paths or local folders.

---

## ⚠️ AI INSTRUCTIONS

✅ DO:

* Use `@/design-system` components in UI
* Use `COLORS`, `SPACING`, and `FONT_SIZES` for styles
* Use `Layout`, `Section`, and `PageTitle` to wrap new screens
* Use `Text` with proper `variant` props instead of raw `<h1>`, `<p>`, etc.

❌ DO NOT:

* Suggest raw HTML like `<button>` or `<input>`
* Use hardcoded styles like `padding: "20px"`
* Create new styled components unless instructed

---

## 🧪 EXAMPLE SCREEN

```tsx
import {
  Layout,
  PageTitle,
  Section,
  Text,
  Input,
  Button
} from '@/design-system';

<Layout>
  <PageTitle>Update Profile</PageTitle>
  <Section>
    <Text variant="body">Enter your details below.</Text>
    <Input placeholder="Name" value={name} onChange={setName} />
    <Button variant="primary">Save</Button>
  </Section>
</Layout>
```

---

## 📌 Tip for AI Users

At the start of every Claude or ChatGPT session, paste this message:

> “Use the following design system for all screen/UI suggestions. Only use components and tokens from this system. No custom styles. Here's the system: \[paste this doc]”

