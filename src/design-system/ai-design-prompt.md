# 🧠 Xavigate AI Design Prompt

Use this prompt in ChatGPT, Claude, or other AI tools to ensure all UI components and styles follow the official Xavigate Design System.

---

## 🧩 Context

I have a design system in my app located at:

```
src/design-system/
```

---

## 🎨 Tokens (imported from `@/design-system/theme`)

Available constants:

- `COLORS`
- `SPACE`
- `RADII`
- `FONT_SIZES`
- `FONT_WEIGHTS`
- `LINE_HEIGHTS`
- `FONT_FAMILIES`
- `SHADOWS`

---

## 🧱 Components (imported from `@/design-system/components`)

Available UI components:

- `Button`
- `Input`
- `Textarea`
- `Text`
- `Checkbox`
- `Card`
- `Box`
- `Flex`

---

## ✅ Guidelines for AI

When generating UI components:

- ✅ Use existing components from `@/design-system/components`
- ✅ Use design tokens from `@/design-system/theme`
- ✅ Prefer styles like `SPACE[2]`, not hardcoded numbers
- ✅ Use `COLORS.neutral[300]` or similar — never hex codes like `#ccc`
- ✅ Use the `Text` component with a `variant` prop instead of raw `<h1>`, `<p>`, etc.
- ✅ Use `style={{ ... }}` blocks based on design tokens
- ❌ Do NOT invent components like `FancyButton`
- ❌ Do NOT use raw pixel values or undefined tokens

---

## 🧪 Example Prompt to Use

```text
Create a `Select` dropdown using my design system. Use `SPACE`, `COLORS`, `Text`, and `Input` from the existing kit. It should support a label, disabled state, and full-width option.
```

🛠 Tech Stack
This app uses:

- React
- TypeScript
- CSS-in-JS (style props or inline `style={{}}`)
- No Tailwind classes (but token names resemble Tailwind scales)
  Keep this file updated if your design system evolves.
