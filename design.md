# Design System & Aesthetics Specification — ApnaDoodh Marketplace

This document outlines the visual system, typography, color palettes, and interactive UI patterns used across the ApnaDoodh website.

---

## 1. Design Philosophy

ApnaDoodh uses a modern, clean, premium layout inspired by Apple-like minimal structures and material-fluid designs. The core principles are:
* **Rich Aesthetics**: High contrast, vibrant focus points, clean shadows, and smooth container corners.
* **Liquid Glassmorphism**: Cards and headers use semi-transparent white fills, fine outlines, and blur filters to blend with dynamic backgrounds.
* **Micro-Animations**: Hover actions use Framer Motion springs to provide instant interactive feedback.

---

## 2. Visual Foundation

### 2.1. Color System
The theme parameters are configured in [globals.css](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/app/globals.css) under Tailwind `@theme` directives:
* **Primary Brand Blue**: `#356be9` (Used for primary actions, buttons, and focused tags).
* **Blue Palette Extensions**:
  - `blue-50`: `#f0f4ff` (Tag backgrounds, light alerts)
  - `blue-100`: `#e0e9ff` (Soft borders)
  - `blue-600`: `#356be9` (Primary Brand Blue)
  - `blue-700`: `#2a52ce` (Hover state blue)
  - `blue-950`: `#192551` (Dark headers, heavy texts)
* **Backgrounds & Text**:
  - Background: `#ffffff` (Pure white)
  - Secondary card backgrounds: `#f8fafc` (Slate 50)
  - Primay text: `#020617` (Slate 950)
  - Secondary text: `#64748b` (Slate 500)

### 2.2. Typography
* **Primary Font Family**: Inter (`var(--font-inter)`), backed by system-ui sans-serif fallbacks.
* **Sizes & Weights**:
  - Main Page Headers: `text-3xl font-black` to `text-4xl font-black` (Heavy weight tracking tight).
  - Component Titles: `text-base font-extrabold` or `text-lg font-bold`.
  - Body Copies: `text-xs leading-5` to `text-sm leading-6` (Semi-bold or Medium weights).

---

## 3. Core UI Design Patterns

### 3.1. Glassmorphism Utilities
Cards, navigation bars, and overlays use the glass utility class:
```css
.bg-glass {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
}
```
Combined with transparent borders (`border-white/60`) and soft shadows (`shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]`) to create a floating layer effect.

### 3.2. Skeleton Shimmers
To prevent content jumps, block skeletons are rendered with a linear gradient shimmer animation:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}
```

### 3.3. Spring Animations (Framer Motion)
Standard interactive scaling configuration:
* **Buttons**: `whileTap={{ scale: 0.95 }}`
* **Interactive Cards**: `whileHover={{ scale: 1.01 }}` or dynamic transitions:
```typescript
transition: { type: "spring", stiffness: 280, damping: 28 }
```
This ensures high-end micro-interactions when hovering over elements.
