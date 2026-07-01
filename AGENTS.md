## Project Overview

Billy is a local-first, cross-platform ERP application built with Expo, designed for Indian MSMEs.

Core domains include:

- **Sales:** CRM, Sales, Point of Sale (PoS), Rental
- **Finance:** Accounting, Invoicing, Expenses, Documents, Spreadsheets, Sign
- **Inventory & Manufacturing:** Inventory, Manufacturing (BOMs), PLM, Purchase, Maintenance, Quality
- **HR:** Employees, Recruitment, Time Off, Appraisals, Referral, Fleet
- **Services:** Projects, Timesheet, Helpdesk, Planning, Appointments
- **Productivity:** Discuss, Approvals

**Modules to focus on first:** Sales, Purchases, Inventory, Parties, Payments, GST, Business Profile Settings, Reports.

Getting Billy functional and release-ready is the priority. More modules will be added after launch.

---

## Tech Stack

Use the existing stack unless the user explicitly approves changes.

| Layer              | Tool                        |
| ------------------ | --------------------------- |
| Framework          | Expo + Expo Router          |
| Language           | TypeScript (Strict)         |
| Styling            | NativeWind v5               |
| Icons              | Lucide React Native         |
| Local Database     | Drizzle ORM + `expo-sqlite` |
| State Management   | Zustand                     |
| Forms & Validation | React Hook Form + Zod       |
| Dates              | `date-fns`                  |
| PDF Generation     | `expo-print`                |
| Scanning           | `expo-camera` (barcode/QR)  |

Do not introduce major libraries without user approval. If a new library would significantly simplify or improve the implementation, recommend it and ask for permission before adding or installing it.

> "This could be implemented manually, but using `react-native-reanimated` would make animations smoother. Do you want me to add it?"

---

## Development Philosophy

**CORE DIRECTIVE: Make it real, then make it functional.**

Always build the UI/UX and screens _first_. Only move on to business logic, state management, and database integration after the interface is fully laid out, visually accurate, and approved.

Every task follows these phases in order. **Do not skip ahead.**

### Phase 1 — Skeleton

Lay out the screen structure using static placeholder content. Focus only on layout, hierarchy, and spacing. No logic. No real data.

### Phase 2 — Static UI

Replace placeholders with real typography, colors, icons, and representative dummy data. The screen must look production-ready at this point.

### Phase 3 — Interactive UI

Add navigation, local `useState` for UI-only state (e.g., open/close modals, tab selection), and animations. No database. No Zustand stores yet.

### Phase 4 — Data Layer

Wire up Drizzle queries, Zustand stores, and React Hook Form. The UI should not change visually at this phase — only data becomes real.

### Phase 5 — Business Logic

Implement calculations (GST, totals, paise arithmetic), Zod schema validation, and ERP-specific rules. This is the last phase.

**Checklist before starting any task:**

1. Read this file.
2. Read the files you will modify.
3. Confirm which phase the task is in.
4. Keep changes focused and follow existing patterns.
5. Prefer readable code over clever code.
6. Build the smallest correct implementation first.
7. Refactor only when it clearly improves maintainability.

---

## Git & Version Control

### `.gitignore` Rules

The following must always be in `.gitignore`. Never commit these.

```gitignore
# ─── Development Reference Files ──────────────────────────────────────────────
/temp/
temp/

# ─── Expo & React Native ──────────────────────────────────────────────────────
node_modules/
.expo/
dist/
web-build/
expo-env.d.ts

# ─── Native Build Artifacts ───────────────────────────────────────────────────
android/
ios/
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# ─── Environment & Secrets ────────────────────────────────────────────────────
.env
.env.local
.env.*.local

# ─── Logs ─────────────────────────────────────────────────────────────────────
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# ─── OS Files ─────────────────────────────────────────────────────────────────
.DS_Store
Thumbs.db
Desktop.ini

# ─── Editor ───────────────────────────────────────────────────────────────────
.vscode/settings.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
```

### `temp/` Folder Rules

The `/temp/` folder at the project root is a local-only development reference area.

- It may contain design screenshots, reference PDFs, sample data files, or experimental code.
- **It must never be committed.** It is already in `.gitignore`.
- Do not import anything from `/temp/` in application code. If a reference file is needed permanently, move it to the appropriate directory first.
- Do not mention `/temp/` file paths in commit messages or PR descriptions.

### Pre-commit Checklist

Before every commit:

```bash
npm run lint       # Must pass with 0 errors
npm run typecheck  # Must pass with 0 errors
```

Consider adding **Husky + lint-staged** to enforce these automatically on every commit. Ask the user before installing.

---

## Money & Formatting Rules (Critical for Indian MSMEs)

Because this is a financial application, monetary handling must be strictly typed and formatted to avoid floating-point errors and locale bugs.

### Storage: Integer Paise Only

All monetary values **must** be stored and passed around as integer paise.

```
₹100.50  →  10050 (paise)
₹1,000   →  100000 (paise)
```

**Never use floats for money.**

### Branded Type

Always use the branded type to prevent accidental mixing with plain numbers:

```typescript
type Paise = number & { readonly __brand: "Paise" };
```

### Formatting (`formatINR`)

- Use the globally provided `formatINR(paise: Paise): string` for all UI rendering.
- **`formatINR` divides by 100 internally. Never pass `amount / 100` into it.** This is the most common double-division bug.
- The formatter uses the Indian Numbering System (Lakhs/Crores): `1,00,000` not `100,000`.
- Do not use default `Intl.NumberFormat` without explicitly setting `locale: 'en-IN'` and verifying output.

### Arithmetic

When performing arithmetic on paise values, cast results back to the branded type:

```typescript
const total = lineItems.reduce(
  (sum, item) => sum + item.amountPaise,
  0,
) as Paise;
```

---

## Indian Compliance & GST

These are centralized constants and utilities. Do not hard-code values inline — always import from their canonical location.

### GST Tax Slabs

```typescript
// lib/constants/gst.ts
export const GST_SLABS = [0, 5, 12, 18, 28] as const;
export type GSTSlab = (typeof GST_SLABS)[number];

// Store rates as integers (percent × 100) to avoid float math
// e.g., 18% = 1800, 5% = 500
export const GST_RATE_MAP: Record<GSTSlab, number> = {
  0: 0,
  5: 500,
  12: 1200,
  18: 1800,
  28: 2800,
};
```

### Financial Year

India's financial year runs **April 1 → March 31**, not January–December.

```typescript
// lib/utils/dates.ts
export function getFinancialYear(date: Date): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  if (month >= 3) return `FY ${year}-${String(year + 1).slice(2)}`;
  return `FY ${year - 1}-${String(year).slice(2)}`;
}
// getFinancialYear(new Date('2024-11-01')) → "FY 2024-25"
// getFinancialYear(new Date('2025-02-01')) → "FY 2024-25"
```

### Validators

Centralize all Indian identifier validation in `lib/utils/validators.ts`:

```typescript
export function isValidGSTIN(value: string): boolean {
  // Format: 2-digit state code + 10-char PAN + 1 entity + 1 checksum + 1 (Z)
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    value,
  );
}

export function isValidPAN(value: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
}
```

### Zod Integration

Extend Zod with these validators in a shared schema file so forms pick them up automatically:

```typescript
export const GSTINSchema = z
  .string()
  .refine(isValidGSTIN, "Invalid GSTIN format");
export const PANSchema = z.string().refine(isValidPAN, "Invalid PAN format");
```

---

## Data, Forms & State Guidelines

### Local-First Database (Drizzle ORM + expo-sqlite)

- Always assume the app must work offline. Read/write from the local SQLite database first.
- Define all table schemas in `lib/db/schema.ts` using Drizzle's schema builder.
- All migrations live in `lib/db/migrations/`. Never mutate the DB schema manually.
- Do not run raw SQL strings in components. Use Drizzle's query builder.
- Do not use direct API fetches in components unless explicitly instructed.

### Form Handling (React Hook Form + Zod)

- Never use large `useState` objects for complex ERP forms.
- All forms use **React Hook Form** for performance and **Zod** for schema validation.
- Define the Zod schema first, derive the TypeScript type from it with `z.infer<>`, then pass the schema to `useForm`.

```typescript
const invoiceSchema = z.object({
  partyId: z.string().uuid(),
  amountPaise: z.number().int().min(1) as z.ZodType<Paise>,
  gstSlab: z.enum(["0", "5", "12", "18", "28"]),
  date: z.date(),
});
type InvoiceFormValues = z.infer<typeof invoiceSchema>;
```

### Global State (Zustand)

- Keep React Context limited to session/auth only.
- Use Zustand for app-wide UI state (e.g., active business profile, sidebar state, sync status).
- Each module gets its own Zustand store file in `lib/stores/`.
- Do not mix UI state and DB-fetched data in the same store slice.

---

## PDF Generation & Printing

Invoices and receipts are core ERP outputs. Use `expo-print` for all PDF generation.

- All invoice/receipt HTML templates live in `lib/templates/`.
- Templates receive typed data objects — never pass raw DB rows directly.
- All monetary values passed to templates must already be formatted strings via `formatINR`.
- Test PDF output on both iOS and Android before marking a feature complete.
- For POS thermal receipt printing, flag it as a separate sub-task. It requires a Bluetooth printer library — ask for user approval before adding one.

---

## Scanning (Inventory & PoS)

Use `expo-camera` for barcode and QR code scanning.

- Wrap the camera scanner in a reusable `<BarcodeScanner />` component in `components/shared/`.
- Always handle camera permission states: `undetermined`, `granted`, `denied`. Show appropriate UI for each.
- Scanned values are raw strings — always validate/look up against the local DB before using.

---

## Architecture Guidelines

Follow the existing project structure. Do not reorganize folders unless requested.

```text
assets/
  fonts/                # Custom fonts
  images/               # Centralized image exports (see Icons & Images)
constants/              # App-wide constants (GST slabs, financial year, app config)
src/
  app/                  # File-based routing (screens only)
  components/
    shared/             # Truly reusable across modules
    [module]/           # Module-specific components
  data/                 # Data layer, mock data or models
  hooks/                # Custom React hooks
  lib/
    db/
      schema.ts         # Table definitions
      migrations/       # All DB migrations
      queries/          # Query functions per module
    templates/          # PDF/print HTML templates
  providers/            # React context providers
  store/                # store slices
  types/                # Centralized TypeScript types
  utils/                # Shared utilities (formatINR, validators, dates)
```

Screens in `src/app/` should compose components. They must not contain large reusable UI blocks or complex logic chunks directly.

---

## UI Rules

When implementing UI:

- Match provided designs as closely as possible.
- Preserve spacing, typography, colors, and hierarchy.
- Build responsive mobile layouts.
- Maintain visual consistency across screens.
- Always use the custom font setup in the `global.css` file.

### Design Consistency Discipline

- Always use custom typography utility classes (e.g., `h1`, `h2`, `body-md`, `caption` defined in `global.css`) to ensure custom fonts are used uniformly.
- Avoid arbitrary or inline font styling.

### Custom Fonts in React Native

When setting up custom fonts in `@utility` classes in `global.css`, **do not include `font-weight`**. Including `fontWeight` alongside a specific custom font file (like `PlusJakartaSans-Bold`) breaks font rendering on Android, causing it to fall back to the system default. The font file itself contains the weight.

---

## Styling Rules

Use NativeWind v5 for styling. Before writing any styling code:

- Check the installed NativeWind version.
- Follow NativeWind v5 syntax.
- Avoid `StyleSheet` unless NativeWind cannot handle the requirement.
- **Reusable classnames:** Declare highly reusable NativeWind classnames in `global.css` using `@utility` directives.

Use `StyleSheet` or inline styles **only** in these scenarios:

| Component / Scenario           | Why                             | Use Instead                           |
| ------------------------------ | ------------------------------- | ------------------------------------- |
| **SafeAreaView**               | `className` not supported       | Inline styles or `StyleSheet`         |
| **Button**                     | Cannot customize via className  | `TouchableOpacity` with custom styles |
| **KeyboardAvoidingView**       | Behavior props not in className | Inline styles or `StyleSheet`         |
| **Modal**                      | `visible`, `transparent` props  | Inline styles                         |
| **ScrollView**                 | `contentContainerStyle`         | `StyleSheet`                          |
| **TextInput**                  | Input-specific props            | Inline styles                         |
| **Animated.View**              | Animated style values           | `StyleSheet` with animated values     |
| **Dynamic styles**             | Runtime-calculated styles       | `StyleSheet.create()` or inline       |
| **Platform-specific**          | iOS/Android-only props          | Conditional inline styles             |
| **Pressable/TouchableOpacity** | `style` for pressed states      | `StyleSheet`                          |
| **Shadow (iOS/Android)**       | Different syntax per platform   | `StyleSheet` with platform checks     |
| **Transform arrays**           | Complex transforms              | `StyleSheet`                          |
| **Z-index**                    | Sometimes needs explicit value  | `StyleSheet`                          |

### SafeAreaView Example

```tsx
// ✅ CORRECT
import { SafeAreaView } from "react-native-safe-area-context";
function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* content */}
    </SafeAreaView>
  );
}

// ❌ INCORRECT
function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">{/* content */}</SafeAreaView>
  );
}
```

---

## Expo Rules

- Prefer official Expo APIs whenever the functionality already exists.
- Use Expo Router for navigation. Do not replace it.
- Check `expo-doctor` output before adding any new native dependency.

---

## Icons & Images

### Icons

Use Lucide React Native consistently. Reuse existing icons whenever possible.

### Images

Use centralized image exports. Never import assets directly throughout the application.

```typescript
// assets/images/index.ts
import logo from "@/assets/images/logo.png";
import icon from "@/assets/images/icon-black.png";

export const images = { logo, icon };
```

```tsx
// Usage
import { images } from "@/assets/images";
<Image source={images.logo} />;
```

---

## TypeScript Rules

- **Strict TypeScript.** Avoid `any`.
- Prefer proper types and interfaces.
- Use type imports where appropriate (`import type { Foo } from '...'`).
- Fix type errors — never suppress them.

Never use:

```typescript
// ❌ Forbidden
@ts-ignore
@ts-nocheck
as any
```

---

## Component Rules

- **Extract reusable UI** only when it provides clear value. Avoid premature abstraction.
- Components are predictable: they rely on passed props for data and callbacks, not internal fetches.
- Screens compose components — they do not contain large self-contained UI blocks.

---

## Error Handling

- Wrap every top-level screen in an **Error Boundary** component (`components/shared/ErrorBoundary.tsx`).
- For async operations (DB reads, PDF generation), always handle the error state explicitly — never assume success.
- Do not use empty `catch` blocks. At minimum, log the error and show user feedback.
- Before any module ships, verify its behavior when the DB is empty, when data is malformed, and when device storage is full.

---

## Backup & Export

Because Billy is local-first, the user's data lives on-device. Before any module ships to production:

- Confirm whether that module's data is included in the backup scope.
- The backup/export strategy (e.g., export to JSON, cloud sync) must be considered at the architecture stage, not retrofitted later.
- Do not make architectural decisions that would make future backup/sync impossible (e.g., non-serializable local IDs, device-only UUIDs without a sync key).

---

## Linting & Validation

Always run before committing:

```bash
npm run lint
npm run typecheck
```

Both must pass with **zero errors**. Do not submit work with suppressed warnings.

---

## Communication

After completing any task:

- Explain what changed.
- List the files affected.
- Explain how to verify the change.
- Flag anything that is deferred to a later phase.
- Be concise and practical.

---

## Final Reminder

Before every implementation:

1. Read this file.
2. Read the source files you will modify.
3. Identify the current phase (Skeleton → Static → Interactive → Data → Logic).
4. Follow existing patterns.
5. Keep implementations clean.
6. Build production-quality Expo code.
