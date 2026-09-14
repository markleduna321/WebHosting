---
applyTo: "resources/js/**"
---


# Premium UI Design System — Modern & Animated

> **Design goal:** Interfaces that feel alive, intentional, and expensive.
> Every surface has depth. Every interaction has feedback.
> Motion is a layer of communication — not decoration.
> Dark is the primary canvas. Light is the exception.

Stack assumption: Laravel + Inertia.js + React + Tailwind + Framer Motion,
scoped to `resources/js/**` in this project. Component code samples below
assume this stack unless noted otherwise.

## How to use this file

This file covers, in order: core principles and anti-patterns, the color
and typography system, glassmorphism/depth basics, and animation rules —
followed by full pattern sections for layout (hero, navbar, pricing, forms,
modals, mobile) and components (cards, tables, inputs, nav, empty states)
and animation code (Framer Motion presets, micro-interactions, counters).
Never ship the "old style" patterns in the tables below — check generated
UI against the Anti-Patterns table before finishing.


## 1. The 5 Principles of Premium UI

1. **Depth over flatness** — Layers, blur, glow, and gradient create a sense
   of space. Flat cards with `border-slate-200` are dead. Glassmorphic panels
   with ambient light are alive.
2. **Motion is meaning** — Animation communicates state change, hierarchy,
   and causality. A button that physically responds to a click is more
   trustworthy than one that doesn't. Every interaction must have a reaction.
3. **Restraint in color, boldness in scale** — One dominant accent color.
   Everything else is dark neutral. The accent is used sparingly — when it
   appears, it commands attention. Typography is large and confident.
4. **Dark first** — Design for dark mode first. Light mode is the
   afterthought. Rich dark backgrounds with luminous foreground elements
   create premium depth that flat light UIs cannot.
5. **Micro-details win** — The gradient border on hover. The spring bounce
   on click. The staggered list reveal. Invisible individually, they
   collectively define "premium."

### What to Stop Using (Old-Style Patterns)

| ❌ Old style | ✅ Modern replacement |
|---|---|
| `bg-white` cards on `bg-gray-50` | Glassmorphic panels on dark gradient canvas |
| `border border-slate-200` dividers | Gradient separators, spacing, or glow |
| `shadow-sm` everywhere | Ambient colored glow (`shadow-[0_0_30px_rgba(...)]`) |
| Flat, static hover states | Spring-animated scale + glow on hover |
| `rounded-lg` on everything | `rounded-2xl` / `rounded-3xl` for premium surfaces |
| Solid color backgrounds | Mesh gradients, noise texture, gradient overlays |
| Abrupt page/modal appearance | Framer Motion enter/exit with spring physics |
| `text-2xl font-bold` page titles | `text-4xl lg:text-5xl font-black` display headings |
| Skeleton loaders only | Skeleton + shimmer animation + staggered reveal |
| Single-column form layouts | Bento grid, asymmetric, overlapping sections |
| Plain top nav, no scroll behavior | Sticky glass navbar with scroll-aware blur/shrink |
| Generic 3-box pricing grid | Highlighted "recommended" tier with scale + glow |
| Instant modal pop-in | `AnimatePresence` scale/fade with backdrop blur |
| Same layout at every breakpoint | Deliberate mobile-first reflow, not just shrinking |


## 2. Color System — Dark First

```js
// tailwind.config.js — extend colors
colors: {
  canvas: {
    DEFAULT: '#080C14',   // deepest background (page canvas)
    subtle:  '#0D1321',   // slightly lighter panels
    raised:  '#111827',   // raised surfaces
    overlay: '#1a2236',   // highest elevated surface
  },
  glass: {
    border:  'rgba(255,255,255,0.08)',
    border2: 'rgba(255,255,255,0.12)',
    bg:      'rgba(255,255,255,0.04)',
    bg2:     'rgba(255,255,255,0.07)',
  },
}
```

**Accent — pick ONE per project, everything else is semantic:**

| Accent | Base | Glow |
|---|---|---|
| Electric Blue | `#3B82F6` | `rgba(59,130,246,0.35)` |
| Violet | `#8B5CF6` | `rgba(139,92,246,0.35)` |
| Emerald | `#10B981` | `rgba(16,185,129,0.35)` |
| Rose | `#F43F5E` | `rgba(244,63,94,0.35)` |
| Amber | `#F59E0B` | `rgba(245,158,11,0.35)` |
| Cyan | `#06B6D4` | `rgba(6,182,212,0.35)` |

**Text hierarchy on dark:** `text-white` (display) → `text-slate-100`
(primary) → `text-slate-400` (secondary) → `text-slate-500` (muted) →
`text-slate-600` (disabled).

**Semantic colors:** success `emerald`, warning `amber`, danger `red`,
info `blue`, neutral `slate` — each as `bg-{c}-500/10 text-{c}-400
border-{c}-500/20`.

**Gradient text** for headlines/labels only, never body copy:
```jsx
<h1 className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
  Premium Heading
</h1>
```

**Mesh gradient canvas** — every page wrapper gets ambient blurred orbs
behind the content (see the Hero Section and Authenticated App Page
Skeleton patterns later in this file).


## 3. Typography — Premium Scale

| Context | Classes |
|---|---|
| Hero title | `text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white` |
| Section title | `text-3xl lg:text-4xl font-bold tracking-tight` (gradient white→slate) |
| Eyebrow label | `text-xs font-semibold tracking-widest uppercase text-{accent}-400` |
| Page title (app) | `text-2xl font-bold text-white` |
| Card title | `text-base font-semibold text-slate-100` |
| Body | `text-sm text-slate-400` |
| Label | `text-xs font-medium text-slate-500` |
| Caption | `text-xs text-slate-600` |
| Table head | `text-xs font-semibold text-slate-500 uppercase tracking-wider` |

For character/word reveal animations (hero headlines), see the Animated
Text Reveal section later in this file.


## 4. Glassmorphism & Depth — Quick Reference

```jsx
// Standard glass card
<div className="relative rounded-2xl border border-white/10
  bg-white/[0.03] backdrop-blur-xl p-6
  shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.5)]">
  content
</div>
```

`backdrop-blur-xl` is the **minimum** for real glass — `blur-sm` is not
glassmorphism. Full patterns (elevated glass, accent-glow glass, animated
gradient borders, ambient colored shadows) are in the Glass Panels &
Depth section later in this file.


## 5. Animation Rules (apply everywhere)

- **Framer Motion for component animation** — not Tailwind alone for
  multi-property animation.
- **Spring physics over linear easing.** Default: `stiffness: 300-400,
  damping: 25-30`.
- **Duration budget:** 200–500ms for UI elements, 600–900ms for page-level
  transitions. Never over 1s for interactive feedback.
- **Stagger delay:** 60–100ms between children; over 120ms feels slow.
- **`once: true`** on scroll triggers — never re-trigger on scroll-up.
- **`will-change: transform`** on heavily animated elements.
- **Respect reduced motion** via `useReducedMotion()` — swap variants to
  `{}` when true.
- **Only animate `transform` and `opacity`** for performance. Never animate
  `width`, `height`, `top`, `left`, or other layout properties.
- **`layout` prop** on Framer Motion elements whose size/position changes
  dynamically (list items added/removed).

Full preset objects (`fadeUp`, `staggerContainer`, `scaleIn`, springs),
button/card micro-interactions, magnetic hover, animated number counters,
and CSS-only fallbacks (no Framer Motion) are in the Animation System
section later in this file.


## 6. Anti-Patterns — Never Ship These

| ❌ Never | ✅ Modern replacement |
|---|---|
| `bg-white` cards | Glass panels on dark canvas |
| `shadow-sm` only | Ambient colored glow shadows |
| `rounded-lg` on cards | `rounded-2xl` / `rounded-3xl` |
| `border-slate-200` separators | `border-white/[0.08]` on dark |
| Static hover — color only | Scale + glow + color shift together |
| `transition-all duration-300` blindly | Specific props: `transition-[box-shadow,transform]` |
| CSS animation on layout props | Only `transform` and `opacity` |
| `animate-spin` for loading | Shimmer skeleton matching content shape |
| Multiple accent colors | One accent, semantic colors for status only |
| `text-black` | `text-white` or `text-slate-100` on dark |
| No page transition | Framer Motion `fadeUp` on every page mount |
| Instant list render | Staggered `variants` on list containers |
| `font-bold` everywhere | `font-black` for display, `font-semibold` for UI |
| Gradient text on body copy | Gradient text on headlines/key labels only |
| `blur-sm` glassmorphism | `backdrop-blur-xl` minimum |
| Colored backgrounds in tables | Dark neutral rows; color only in badges |
| Fixed-width layout on mobile | Fluid, mobile-first reflow (see layout-patterns.md) |
| Nav links that just reappear on scroll | Sticky glass navbar with scroll-aware state |


## 7. What follows

The sections below contain the full pattern library: Layout Patterns (hero,
navbar, pricing, forms, modals, mobile rules), then Component Patterns
(glass panels, buttons, cards, bento grid, tables, inputs, sidebar nav,
empty states), then the Animation System (Framer Motion presets, code for
every micro-interaction referenced above).

---
---

## Layout Patterns — Hero, Navigation, Pricing, Forms, Modals, Mobile

These are the patterns most requests for a "premium landing page" or
"modern marketing site" actually need, plus the mobile-responsive rules
that apply across all of them. Pair with the Component Patterns and
Animation System sections (presets referenced below: `fadeUp`,
`staggerContainer`, `scaleIn`, `spring`).

## Table of Contents
1. Hero Section
2. Sticky Glass Navbar (+ mobile menu)
3. Pricing Table
4. Forms (multi-field, validation)
5. Modals / Dialogs
6. Mobile Responsiveness Rules

---

## 1. Hero Section

Full-viewport hero with mesh-gradient canvas, eyebrow label, animated
headline, subhead, dual CTA, and a staggered reveal on mount.

```jsx
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#080C14]">
    {/* Ambient mesh */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px]
        rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px]
        rounded-full bg-violet-600/12 blur-[120px]" />
    </div>

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
    >
      <motion.p variants={fadeUp}
        className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4">
        Now in public beta
      </motion.p>

      <motion.h1 variants={fadeUp}
        className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight
          text-white leading-[0.95]">
        Build something <br />
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400
          bg-clip-text text-transparent">
          extraordinary.
        </span>
      </motion.h1>

      <motion.p variants={fadeUp}
        className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
        One short sentence on what the product does and who it's for.
      </motion.p>

      <motion.div variants={fadeUp}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500
            text-white text-sm font-semibold rounded-xl
            shadow-[0_0_25px_rgba(59,130,246,0.35)]
            hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
            transition-[box-shadow,background] duration-300">
          Get Started Free
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold
            text-slate-200 border border-white/[0.1] bg-white/[0.03]
            hover:bg-white/[0.06] transition-colors duration-300">
          Watch Demo
        </motion.button>
      </motion.div>
    </motion.div>
  </section>
);
```

Notes:
- Headline stack: eyebrow → `font-black` headline (with a gradient accent
  span on the key word) → one-sentence subhead → dual CTA. Don't add more
  than one supporting paragraph above the fold.
- Primary CTA gets the glow-shadow treatment; secondary CTA stays a quiet
  outline — never two loud buttons side by side.
- On mobile, CTAs stack full-width (`flex-col sm:flex-row`, `w-full
  sm:w-auto`) — never shrink a two-button row to fit, stack it.

---

## 2. Sticky Glass Navbar (+ mobile menu)

Scroll-aware: transparent at the top of the page, condenses into a glass
bar once the user scrolls.

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'rgba(8,12,20,0.7)' : 'rgba(8,12,20,0)',
        borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-xl
        ${scrolled ? 'py-3' : 'py-5'} transition-[padding] duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <span className="text-white font-bold text-lg">Logo</span>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Product', 'Pricing', 'Docs'].map(item => (
            <a key={item} href="#" className="text-sm text-slate-400
              hover:text-white transition-colors">{item}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-slate-300 hover:text-white
            transition-colors">Sign in</a>
          <motion.a href="#" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white
              text-sm font-semibold rounded-lg
              shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors">
            Get Started
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 text-slate-300 min-w-[44px] min-h-[44px]
            flex items-center justify-center">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.33,1,0.68,1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]
              bg-[#080C14]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {['Product', 'Pricing', 'Docs'].map(item => (
                <a key={item} href="#" className="px-3 py-3 rounded-xl text-sm
                  text-slate-300 hover:bg-white/[0.05] hover:text-white
                  transition-colors min-h-[44px] flex items-center">{item}</a>
              ))}
              <a href="#" className="mt-2 px-3 py-3 rounded-xl text-sm font-semibold
                text-center bg-blue-600 text-white min-h-[44px]
                flex items-center justify-center">Get Started</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
```

Notes:
- Mobile menu is a height/opacity `AnimatePresence` panel, not a full-screen
  takeover unless the nav has 6+ items.
- Every tappable target is at least 44×44px (`min-h-[44px]`) — this matters
  more than it looks like it should.

---

## 3. Pricing Table

Three tiers, middle one visually "recommended" via scale + glow + border —
never a flat 3-up grid where every card looks the same weight.

```jsx
const tiers = [
  { name: 'Starter', price: '$0', tagline: 'For trying things out', featured: false },
  { name: 'Pro', price: '$29', tagline: 'For growing teams', featured: true },
  { name: 'Enterprise', price: 'Custom', tagline: 'For scale & compliance', featured: false },
];

<motion.div variants={staggerContainer} initial="hidden" animate="visible"
  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
  {tiers.map(tier => (
    <motion.div key={tier.name} variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative rounded-2xl p-8 border backdrop-blur-xl
        ${tier.featured
          ? 'border-blue-500/30 bg-blue-500/[0.05] md:scale-105 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
          : 'border-white/[0.08] bg-white/[0.03]'}`}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1
          rounded-full text-xs font-semibold bg-blue-600 text-white
          shadow-[0_0_15px_rgba(59,130,246,0.4)]">
          Most Popular
        </span>
      )}
      <h3 className="text-sm font-semibold text-slate-300">{tier.name}</h3>
      <p className="mt-3 text-4xl font-black text-white">
        {tier.price}
        {tier.price !== 'Custom' && <span className="text-base font-medium text-slate-500">/mo</span>}
      </p>
      <p className="mt-2 text-sm text-slate-500">{tier.tagline}</p>

      <ul className="mt-6 space-y-3">
        {['Feature one', 'Feature two', 'Feature three'].map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
            <Check className="w-4 h-4 text-blue-400 shrink-0" /> {f}
          </li>
        ))}
      </ul>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
          ${tier.featured
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            : 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08]'}`}>
        {tier.price === 'Custom' ? 'Contact Sales' : 'Choose Plan'}
      </motion.button>
    </motion.div>
  ))}
</motion.div>
```

Notes:
- On mobile, tiers stack single-column (`grid-cols-1 md:grid-cols-3`) and
  the featured tier drops its `md:scale-105` so it doesn't get cramped.
- Only one tier gets the accent glow/border — restraint applies here too.

---

## 4. Forms (Multi-Field, Validation)

```jsx
const Field = ({ label, error, ...props }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-3 text-sm text-slate-100 rounded-xl
        bg-white/[0.04] border placeholder:text-slate-600
        focus:outline-none focus:ring-2 transition-all duration-200
        ${error
          ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
          : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 focus:bg-white/[0.06]'}`}
    />
    {error && (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-400">{error}</motion.p>
    )}
  </div>
);

// Two-column on desktop, stacked on mobile
<form className="rounded-2xl border border-white/[0.08] bg-white/[0.03]
  backdrop-blur-xl p-6 sm:p-8 space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <Field label="First name" placeholder="Juan" />
    <Field label="Last name" placeholder="Dela Cruz" />
  </div>
  <Field label="Email" type="email" placeholder="you@company.com"
    error="Enter a valid email address" />
  <Field label="Message" as="textarea" />

  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
    type="submit"
    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500
      text-white text-sm font-semibold rounded-xl
      shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-[box-shadow,background] duration-300">
    Submit
  </motion.button>
</form>
```

Notes:
- Error messages animate in (`fadeUp`-style, small `y` offset) rather than
  appearing instantly — it's a state change and deserves a reaction.
- Field grids collapse to one column below `sm:` — never force two narrow
  columns on a phone-width form.

---

## 5. Modals / Dialogs

`AnimatePresence` for both the backdrop and the panel — scale + fade, never
an instant pop-in.

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto
            sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md
            rounded-2xl border border-white/[0.1]
            bg-gradient-to-b from-white/[0.08] to-[#0D1321]
            backdrop-blur-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="mt-4 text-sm text-slate-400">{children}</div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm
              text-slate-300 hover:bg-white/[0.05] transition-colors
              min-h-[44px]">Cancel</button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-blue-600 hover:bg-blue-500 min-h-[44px]
                shadow-[0_0_15px_rgba(59,130,246,0.3)]">Confirm</motion.button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
```

Notes:
- On mobile, the panel is inset from the screen edges (`inset-x-4`) rather
  than a fixed max-width centered box, so it doesn't touch the viewport
  edges.
- Backdrop and panel are separate `motion` elements with their own
  transitions — the backdrop fades, the panel springs.

---

## 6. Mobile Responsiveness Rules

- **Mobile-first reflow, not shrinking.** Multi-column layouts (bento
  grids, pricing tiers, form fields) go `grid-cols-1` by default and add
  `sm:`/`md:`/`lg:` columns up — never ship a desktop grid and let Tailwind
  squeeze it.
- **Touch targets ≥ 44×44px** for every button, link, and icon-button.
  Add `min-h-[44px]` (and width where relevant) even if the visual icon is
  smaller.
- **Stack CTAs and button rows** (`flex-col sm:flex-row`, `w-full
  sm:w-auto`) instead of shrinking button text or padding to fit.
- **Reduce ambient glow blur radius on mobile** if performance matters —
  large `blur-[120px]` orbs are cheap on desktop GPUs but can jank on
  low-end phones; consider `blur-[60px] md:blur-[120px]`.
- **Simplify motion on small screens where it competes with content**, e.g.
  drop `whileHover` magnetic effects entirely on touch (there's no hover) —
  keep `whileTap` feedback instead.
- **Typography scales down**, not just wraps: hero `text-5xl sm:text-6xl
  lg:text-7xl` — don't leave a `text-7xl` headline unscaled on a 375px
  viewport.
- **Sticky/fixed elements respect safe areas** — add `pb-[env(safe-area-inset-bottom)]`
  to fixed bottom bars/nav on iOS.
- **Test the breakpoint where nav becomes a hamburger** (`md:` in the
  navbar pattern above) actually matches where the desktop nav items would
  start wrapping — don't just copy `md:` everywhere by default.
-e 
---
---

## Component Patterns — Dark Premium

Covers glass panels, buttons, cards, bento grids, tables, inputs, badges,
sidebar nav, and empty states. Pair with the Animation System section later in this file for the Framer
Motion presets (`fadeUp`, `staggerContainer`, etc.) used throughout these
examples.

## Table of Contents
1. Glass Panels & Depth
2. Buttons & Badges
3. KPI / Stat Cards
4. Bento Grid Layout
5. Tables
6. Inputs
7. Sidebar Navigation
8. Empty States
9. Authenticated App Page Skeleton

---

## 1. Glass Panels & Depth

```jsx
// Standard glass card
<div className="relative rounded-2xl border border-white/10
  bg-white/[0.03] backdrop-blur-xl p-6
  shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.5)]">
  content
</div>

// Elevated glass card (higher prominence)
<div className="relative rounded-2xl border border-white/[0.08]
  bg-gradient-to-b from-white/[0.07] to-white/[0.02]
  backdrop-blur-2xl p-6
  shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_60px_rgba(0,0,0,0.6)]">
  content
</div>

// Glass card with accent glow (featured/primary items)
<div className="relative rounded-2xl border border-blue-500/20
  bg-blue-500/[0.05] backdrop-blur-xl p-6
  shadow-[0_0_40px_rgba(59,130,246,0.15),0_0_0_1px_rgba(59,130,246,0.15)]">
  content
</div>
```

### Gradient Border

```jsx
// Static gradient border via wrapper
<div className="p-px rounded-2xl bg-gradient-to-b from-white/20 to-white/5">
  <div className="rounded-2xl bg-canvas p-6">content</div>
</div>

// Animated gradient border on hover
<div className="group relative rounded-2xl p-px
  bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-cyan-500/30
  hover:from-blue-500 hover:via-violet-500 hover:to-cyan-500
  transition-all duration-500">
  <div className="rounded-2xl bg-[#0D1321] p-6">content</div>
</div>
```

### Ambient Glow (Colored Shadows)

```jsx
className="shadow-[0_0_30px_rgba(59,130,246,0.25)]
  hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-shadow duration-500"
// Violet: shadow-[0_0_30px_rgba(139,92,246,0.25)]
// Success: shadow-[0_0_20px_rgba(16,185,129,0.3)]
```

### Mesh Gradient Background (Page Canvas)

```jsx
<div className="min-h-screen bg-[#080C14] relative overflow-hidden">
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-[600px] h-[600px]
      rounded-full bg-blue-600/10 blur-[120px]" />
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px]
      rounded-full bg-violet-600/10 blur-[120px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-[800px] h-[400px] rounded-full bg-cyan-600/5 blur-[150px]" />
  </div>
  <div className="relative z-10">...</div>
</div>
```

---

## 2. Buttons & Badges

```jsx
import { motion } from 'framer-motion';

// Primary button — scale + glow on hover, press feedback on tap
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
  className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold
    rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]
    hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]
    hover:bg-blue-500 transition-[box-shadow,background] duration-300"
>
  Get Started
</motion.button>

// Icon button — spring rotate
<motion.button
  whileHover={{ rotate: 15, scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: "spring", stiffness: 400, damping: 20 }}
  className="p-2 rounded-xl text-slate-400 hover:text-white
    hover:bg-white/10 transition-colors"
>
  <Settings className="w-4 h-4" />
</motion.button>
```

```jsx
// Badges
const badge = {
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10  text-amber-400  border border-amber-500/20",
  danger:  "bg-red-500/10    text-red-400    border border-red-500/20",
  info:    "bg-blue-500/10   text-blue-400   border border-blue-500/20",
  neutral: "bg-slate-500/10  text-slate-400  border border-slate-500/20",
};

<span className={`inline-flex items-center gap-1 px-2.5 py-0.5
  rounded-full text-xs font-medium ${badge.success}`}>
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
  Active
</span>
```

---

## 3. KPI / Stat Card (Dark + Animated)

```jsx
<motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  whileHover={{ y: -3 }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  className="relative rounded-2xl border border-white/[0.08]
    bg-gradient-to-b from-white/[0.06] to-white/[0.02]
    backdrop-blur-xl p-6 overflow-hidden"
>
  <div className="absolute -top-4 -right-4 w-24 h-24
    rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

  <div className="flex items-center justify-between mb-4">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Total Revenue
    </p>
    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
      <TrendingUp className="w-4 h-4 text-blue-400" />
    </div>
  </div>

  <AnimatedNumber target={48290} prefix="₱" className="text-3xl font-bold text-white" />

  <div className="mt-2 flex items-center gap-1.5">
    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
      <TrendingUp className="w-3 h-3" /> +8.2%
    </span>
    <span className="text-xs text-slate-600">vs last month</span>
  </div>
</motion.div>
```
`AnimatedNumber` is defined in the Animation System section.

---

## 4. Bento Grid (Modern Layout)

```jsx
<div className="grid grid-cols-12 grid-rows-auto gap-4">

  {/* Large feature card — spans 8 cols, 2 rows */}
  <motion.div variants={fadeUp} className="col-span-12 md:col-span-8 row-span-2
    rounded-3xl border border-white/[0.08] bg-white/[0.03]
    backdrop-blur-xl p-8 min-h-[280px] overflow-hidden relative">
    <div className="absolute -top-20 -right-20 w-60 h-60
      rounded-full bg-blue-600/15 blur-[80px] pointer-events-none" />
    <div className="relative">
      <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
        Core Feature
      </p>
      <h3 className="text-2xl font-bold text-white mb-2">Feature Headline</h3>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
        Description that sells the value. Keep it one or two sentences.
      </p>
    </div>
  </motion.div>

  {/* Small stat card */}
  <motion.div variants={fadeUp} className="col-span-12 md:col-span-4
    rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
    stat content
  </motion.div>

  {/* Medium card */}
  <motion.div variants={fadeUp} className="col-span-12 md:col-span-4
    rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
    feature content
  </motion.div>

</div>
```

---

## 5. Premium Table (Dark)

```jsx
<motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  className="rounded-2xl border border-white/[0.08]
    bg-white/[0.02] backdrop-blur-xl overflow-hidden"
>
  <div className="px-6 py-4 border-b border-white/[0.06]
    flex items-center justify-between">
    <h3 className="text-base font-semibold text-slate-100">Table Title</h3>
    <button className="text-xs text-blue-400 hover:text-blue-300
      font-medium transition-colors">View all →</button>
  </div>
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-white/[0.04]">
        <th className="text-left px-6 py-3 text-xs font-semibold
          text-slate-600 uppercase tracking-wider">Column</th>
      </tr>
    </thead>
    <motion.tbody
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="divide-y divide-white/[0.04]"
    >
      {rows.map((row) => (
        <motion.tr key={row.id} variants={fadeUp}
          className="hover:bg-white/[0.03] transition-colors duration-150
            group cursor-pointer">
          <td className="px-6 py-4 text-slate-300">{row.value}</td>
        </motion.tr>
      ))}
    </motion.tbody>
  </table>
</motion.div>
```
Dark neutral rows only — color lives in badges, never in row backgrounds.

---

## 6. Premium Input (Dark)

```jsx
<div className="space-y-2">
  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
    Field Label
  </label>
  <div className="relative">
    <input
      className="w-full px-4 py-3 text-sm text-slate-100
        bg-white/[0.04] border border-white/[0.08] rounded-xl
        placeholder:text-slate-600
        focus:outline-none focus:border-blue-500/50
        focus:ring-2 focus:ring-blue-500/20 focus:bg-white/[0.06]
        transition-all duration-200"
    />
    {/* Error state: border-red-500/50 focus:ring-red-500/20 */}
  </div>
  <p className="text-xs text-red-400">Error message</p>
</div>
```
See the Forms section (Layout Patterns) for full multi-field form layouts
and validation states.

---

## 7. Sidebar Navigation (Dark Premium)

```jsx
// Active link
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl
  bg-blue-500/10 border border-blue-500/20
  text-blue-400 font-medium text-sm
  shadow-[0_0_15px_rgba(59,130,246,0.1)]">
  <Icon className="w-4 h-4 shrink-0" />
  <span>Dashboard</span>
</Link>

// Inactive link
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl
  text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
  font-medium text-sm transition-colors duration-150 group">
  <Icon className="w-4 h-4 shrink-0 group-hover:text-slate-300 transition-colors" />
  <span>Reports</span>
</Link>
```
For the mobile version of navigation (slide-over / bottom nav), see the
Sticky Glass Navbar section (Layout Patterns).

---

## 8. Empty State (Dark)

```jsx
<motion.div
  variants={scaleIn}
  initial="hidden"
  animate="visible"
  className="flex flex-col items-center justify-center py-24 text-center"
>
  <div className="relative mb-6">
    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08]
      flex items-center justify-center">
      <FolderOpen className="w-7 h-7 text-slate-600" />
    </div>
    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />
  </div>
  <h3 className="text-lg font-semibold text-slate-200">Nothing here yet</h3>
  <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">
    Get started by creating your first item.
  </p>
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5
      bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold
      rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
  >
    <Plus className="w-4 h-4" /> Create Item
  </motion.button>
</motion.div>
```

---

## 9. Authenticated App Page Skeleton

```jsx
<PageTransition>
  <div className="min-h-screen bg-[#080C14] relative">
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px]
        rounded-full bg-blue-600/8 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px]
        rounded-full bg-violet-600/8 blur-[120px]" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            Section
          </p>
          <h1 className="text-3xl font-bold text-white">Page Title</h1>
          <p className="mt-1 text-sm text-slate-500">Supporting description</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-5 py-2.5
            bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold
            rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]
            hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300">
          <Plus className="w-4 h-4" /> Add Item
        </motion.button>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => <KpiCard key={kpi.id} {...kpi} />)}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <PremiumTable data={data} />
      </motion.div>
    </div>
  </div>
</PageTransition>
```
`PageTransition` is defined in the Animation System section.
-e 
---
---

## Animation System — Framer Motion

All the actual Framer Motion code: setup, reusable presets, usage patterns,
page transitions, micro-interactions, and CSS-only fallbacks for when a
Framer Motion dependency isn't available.

## Table of Contents
1. Installation & Presets
2. Usage Patterns (single, staggered list, scroll-triggered)
3. Page / Route Transitions
4. Micro-Interactions (buttons, cards, magnetic hover)
5. Animated Number Counter
6. Animated Text Reveal
7. Shimmer Loading Effect
8. CSS-Only Animations (no library)

---

## 1. Installation & Presets

```bash
npm install framer-motion
```

```js
// resources/js/lib/animations.js

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] } }
};

// Stagger container — apply to parent
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

// Springs — for physical interactions
export const spring = { type: "spring", stiffness: 400, damping: 30 };
export const softSpring = { type: "spring", stiffness: 200, damping: 25 };
```

---

## 2. Usage Patterns

```jsx
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

// Single element reveal
<motion.div variants={fadeUp} initial="hidden" animate="visible">
  <Card />
</motion.div>

// Staggered list — parent + children
<motion.ul variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={fadeUp}>
      <ItemCard item={item} />
    </motion.li>
  ))}
</motion.ul>

// Scroll-triggered reveal
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-80px" });

<motion.div ref={ref} variants={fadeUp} initial="hidden"
  animate={isInView ? "visible" : "hidden"}>
  content
</motion.div>
```

Reduced motion:
```jsx
import { useReducedMotion } from 'framer-motion';
const reduce = useReducedMotion();
const variants = reduce ? {} : fadeUp;
```

---

## 3. Page / Route Transitions (Inertia + Framer Motion)

```jsx
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
  >
    {children}
  </motion.div>
);

const DashboardPage = () => (
  <PageTransition>{/* page content */}</PageTransition>
);
```

---

## 4. Micro-Interactions

Every interactive element must physically respond. Static = cheap.

```jsx
// Primary button — scale + glow on hover, press feedback on tap
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
  className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold
    rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]
    hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]
    hover:bg-blue-500 transition-[box-shadow,background] duration-300"
>
  Get Started
</motion.button>

// Card lift + glow on hover
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
  className="rounded-2xl border border-white/10 bg-white/[0.03]
    backdrop-blur-xl p-6 cursor-pointer
    hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]
    transition-[border-color,box-shadow] duration-300"
>
  content
</motion.div>
```

### Magnetic Hover (subtle pull toward cursor)

```jsx
import { useMotionValue, useSpring, motion } from 'framer-motion';

const x = useMotionValue(0);
const y = useMotionValue(0);
const springX = useSpring(x, { stiffness: 150, damping: 20 });
const springY = useSpring(y, { stiffness: 150, damping: 20 });

const handleMouse = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  x.set((e.clientX - cx) * 0.15);
  y.set((e.clientY - cy) * 0.15);
};

<motion.div style={{ x: springX, y: springY }} onMouseMove={handleMouse}
  onMouseLeave={() => { x.set(0); y.set(0); }}>
  <button>Hover me</button>
</motion.div>
```

---

## 5. Animated Number Counter

```jsx
import { useMotionValue, useSpring, useInView, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const AnimatedNumber = ({ target, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}<motion.span>{spring.get().toFixed(0)}</motion.span>{suffix}
    </span>
  );
};

<AnimatedNumber target={48290} prefix="₱" />
<AnimatedNumber target={98.7} suffix="%" />
```

---

## 6. Animated Text Reveal

```jsx
import { motion } from 'framer-motion';

// Character-by-character reveal
const word = "Premium";
<div className="flex overflow-hidden">
  {word.split("").map((char, i) => (
    <motion.span key={i}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: i * 0.04, duration: 0.5, ease: [0.33,1,0.68,1] }}>
      {char}
    </motion.span>
  ))}
</div>

// Fade-up reveal (words), for use with staggerChildren on the parent
const fadeUpWord = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.33,1,0.68,1] }
  })
};
```

---

## 7. Shimmer Loading Effect

```js
// tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { backgroundPosition: '-200% center' },
    '100%': { backgroundPosition: '200% center' },
  }
},
animation: { shimmer: 'shimmer 2s linear infinite' }
```
```jsx
<div className="h-4 rounded-lg bg-gradient-to-r
  from-slate-800 via-slate-700 to-slate-800
  bg-[length:200%_100%] animate-shimmer" />
```
Use shimmer skeletons that match the shape of the content they replace —
never a generic spinner for content loading.

---

## 8. CSS-Only Animations (No Library Required)

Use when Framer Motion isn't installed, or for purely decorative/ambient
effects that don't need JS orchestration.

```css
/* Floating animation — decorative elements */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }

/* Shimmer — skeleton loaders */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.animate-shimmer {
  background: linear-gradient(90deg, #1e2a3a 25%, #243040 50%, #1e2a3a 75%);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

/* Gradient border pulse */
@keyframes gradient-rotate {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-border {
  background: linear-gradient(270deg, #3B82F6, #8B5CF6, #06B6D4);
  background-size: 300% 300%;
  animation: gradient-rotate 4s ease infinite;
}

/* Pulse glow — active indicators */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.3); }
  50%       { box-shadow: 0 0 25px rgba(59,130,246,0.6); }
}
.animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }

/* Typing cursor */
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.cursor { animation: blink 1s step-end infinite; }
```
