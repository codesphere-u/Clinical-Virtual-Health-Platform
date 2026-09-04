# ADR-015: Web Architecture & Aura Clinical Design System

## Status
Accepted

## Context
Web applications serve Patients (`apps/patient-web`), Clinicians (`apps/clinician-web`), and Administrators (`apps/admin-web`). These interfaces must be responsive, accessible (WCAG 2.2 AA/AAA), lightning-fast, and designed specifically to avoid the visually dated and cluttered interfaces of legacy EHRs (e.g. SystmOne).

## Decision
1. **Framework**: **Next.js 15 with App Router**:
   - React Server Components (RSC) for initial page renders and zero-bundle clinical data views.
   - Client Components strictly scoped to interactive widgets (e.g. Live Video Room, Rich SOAP Editor, Slot Picker).
2. **Aura Clinical Design System (`packages/design-system`)**:
   - Shared Tailwind CSS design plugin with carefully calibrated clinical palette:
     - `aura-teal` (`#0D746F`): Trust, clarity, primary interactive anchor.
     - `aura-slate` (`#0F172A`, `#F8FAFC`): Deep readable charcoal text on soothing neutral surfaces.
     - `aura-rose` (`#E11D48`): High-contrast critical alerts and allergies (never rely on color alone; paired with icons and labels).
     - `aura-emerald` (`#059669`): Verified credentials and compliance badges.
     - `aura-amber` (`#D97706`): Safeguarding warnings and expiring licenses.
3. **Accessibility**:
   - Full keyboard navigability with visible focus indicators.
   - Semantic HTML5 landmark tags (`<main>`, `<nav>`, `<aside>`).
   - Screen-reader aria attributes on all clinical status indicators and chart elements.

## Consequences
- Single shared UI component library (`packages/design-system/src/components`) consumed by all three Next.js applications.
