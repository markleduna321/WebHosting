### Phase 6: Fit plan panel without scrolling

- **Timestamp:** 2026-09-20
- **Mode:** Agent
- **Persona(s) Active:** 🎨 Designer
- **Files Modified/Created:**
  - `resources/js/pages/Auth/register/_sections/PlanDetailsSection.jsx` — Modified. Removed the internal scrollbar (`lg:overflow-y-auto` → `lg:overflow-hidden`); shrank the plan name heading (`text-4xl sm:text-5xl lg:text-6xl` → `text-2xl sm:text-3xl lg:text-4xl`) and price display; tightened panel padding, hero card padding, content spacing, feature-card padding/gaps, and add-on button padding/gaps so the logo, hero card, feature grid, all 6 add-on cards, and footer fit within one viewport height.
- **Issues Encountered:** None.
- **Resolution:** N/A
- **QA Checklist Result:** ✅ All pass.
  - JavaScript purity: ✅ plain JS.
  - Naming/structure: ✅ unchanged.
  - Responsive: ✅ change scoped to the `hidden lg:flex` panel only, no mobile impact. *(Code-level ✅ — requires browser verification that content no longer clips at common laptop viewport heights.)*
  - Guarded commands: ✅ none run.
- **Next Steps:** None — awaiting further instructions.
