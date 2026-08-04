# Material Schedule Calculator Pro

A full-stack-ready, single-page web application that automatically prepares
**Construction Material Schedules from Bills of Quantities**, for Quantity
Surveyors, Engineers and Contractors. Built with React, TypeScript, Tailwind
CSS and Vite, exports professional Excel workbooks (ExcelJS) and PDF reports
(jsPDF), and ships ready to deploy to GitHub Pages, Vercel or Netlify.

The conversion factors and worksheet structure are seeded directly from the
two documents supplied for this project:

- **Conversion Factors for Preparing a Schedule of Materials** (Fred Mweu) —
  see `src/data/conversionFactors.ts`. Every factor is editable at runtime
  from the **Conversion Factors** screen; anything the source document didn't
  cover is filled in with an accepted industry-standard default and clearly
  labelled `Industry standard` rather than `Document`.
- **Material Schedule Template** (Mavencraft Ltd) — its REF / DESCRIPTION /
  UNIT / INPUT QTY / FCTR / QTY / RATE / AMOUNT layout, its per-element
  worksheet structure, and its "carried to Main Summary" methodology are
  reproduced in `src/data/elementTemplates.ts` and the Worksheet screen.
  Loading **Load Sample Project** from the Dashboard recreates the worked
  example from that template so you can see real numbers immediately.

## Features

- **Project Information** form (name, client, consultant, contractor,
  location, BOQ reference, date, prepared by, revision) — appears
  automatically on every worksheet, Excel export, PDF export and summary.
- **Per-element worksheets** — Substructures, Reinforced Concrete Frame,
  Walling, Roofing & Rainwater Disposal, External Finishes, Internal
  Finishes, Windows, Doors, Fittings & Fixtures, External Works — each with
  automatic `Quantity = Input Qty × Conversion Factor` and
  `Amount = Quantity × Rate` calculation, instant totals/subtotals, add /
  remove / reorder rows.
- **Material Library** — editable database of materials, units, default
  rates, suppliers and remarks.
- **Conversion Factors** admin screen — every factor from the source
  document, fully searchable/filterable and editable, with a badge showing
  whether a figure came from the document or an industry-standard default.
- **Rates Library** — focused rate-editing view with CSV import (columns:
  `name, unit, rate, supplier, category`) so a QS can drop in the latest
  market prices.
- **Material Summary** — automatically combines identical materials across
  every worksheet into one schedule (e.g. total cement bags, total sand
  tonnes, total reinforcement kg).
- **Reports** — Grand Summary (with waste factor, labour factor, markup and
  tax applied from Settings), material-cost pie chart and top-materials bar
  chart (Chart.js), one-click **Export Excel** (multi-sheet workbook: Cover
  Sheet, one sheet per element, Rates, Material Summary, Grand Summary —
  merged titles, frozen headers, auto-filters, alternating row colours,
  landscape print setup) and **Export PDF** (cover page, table of contents,
  per-element tables, material summary, grand summary, signature block,
  page numbers and footer).
- **Import BOQ** — drag-and-drop Excel or CSV import that previews rows
  before creating a new worksheet from them.
- **Dashboard** with quick actions, active-project summary and recent
  projects list.
- **Global search** across worksheets, references, materials and suppliers.
- **Dark mode / light mode**, project cloning, project deletion, autosave to
  the browser (no server round-trip needed), and a full Settings screen for
  currency, tax, markup, waste factor, labour factor, regional rate
  adjustment and measurement units.

## Tech stack

| Layer      | Choice |
|------------|--------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS |
| Routing    | React Router (HashRouter, so it works unmodified on GitHub Pages) |
| Forms      | React Hook Form |
| Excel      | ExcelJS |
| PDF        | jsPDF + jspdf-autotable |
| Charts     | Chart.js via react-chartjs-2 |
| Icons      | lucide-react |
| CSV/XLSX import | PapaParse + ExcelJS |
| Persistence | Browser `localStorage` (see note below) |

### A note on the backend

The brief asked for a Node/Express + SQLite (or JSON) backend. Because the
primary deployment targets are **GitHub Pages** — which only serves static
files — this build persists all projects, materials, conversion factors and
settings in the browser's `localStorage` instead of a server database, so the
whole app works out of the box with zero backend to host or pay for. The data
model in `src/types` and the storage layer in `src/context/AppDataContext.tsx`
are intentionally decoupled from `localStorage`, so swapping in a real
Express + SQLite API (or Postgres, or Supabase) later is a matter of
replacing the `loadInitial` / `useEffect(() => localStorage.setItem(...))`
calls with `fetch` calls — the rest of the app doesn't need to change.

Also out of scope for this build, for the same static-hosting reason: user
authentication, an admin panel and cloud synchronisation (all listed in the
brief as optional). PWA/offline support and keyboard shortcuts were left out
to keep the initial build focused — both are natural follow-ups.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Deploying

### GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys
   automatically on every push to `main`. It sets `VITE_BASE_PATH` to
   `/<your-repo-name>/` automatically — no manual edit needed unless you use
   a custom domain, in which case set `VITE_BASE_PATH=/` in the workflow.

### Vercel / Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Set the environment variable `VITE_BASE_PATH=/` (Vercel/Netlify serve from
  the domain root, unlike a GitHub Pages project site).

## Project structure

```
src/
  components/     Sidebar, Topbar (shared layout + global search)
  context/        AppDataContext — single source of truth, persisted to localStorage
  data/           conversionFactors.ts, materials.ts, elementTemplates.ts, sampleProject.ts
  pages/          Dashboard, ProjectInfoPage, ProjectsPage, WorksheetPage,
                  MaterialLibraryPage, ConversionFactorsPage, RatesLibraryPage,
                  ReportsPage, SettingsPage, ImportBoqPage
  types/          Shared TypeScript interfaces
  utils/          calculations.ts, excelExport.ts, pdfExport.ts, importUtils.ts, id.ts
public/
  sample-data/    sample-boq.csv — try it on the Import BOQ screen
.github/workflows/deploy.yml   GitHub Pages CI/CD
```

## Editing conversion factors, materials and rates

Nothing in this app is hard-coded at the UI layer — `defaultConversionFactors`,
`defaultMaterials` and `elementTemplates` in `src/data/` are only the
**seed data** used the first time the app runs in a browser. From then on,
every add/edit/delete you make on the Conversion Factors, Material Library
and Rates Library screens is saved to `localStorage` and reused for every
new project you create.

## A note on rounding

`Quantity = Input Qty × Conversion Factor` is calculated and displayed to two
decimal places rather than rounded up to the next whole bag/sheet/roll the
way a QS often writes the final "say X" figure by hand on a printed schedule.
This keeps costings precise; when you're ready to place an order, round
countable items (bags, sheets, rolls) up yourself, or simply edit the
`Factor` cell for that row to bake the rounding in.

## License

Provided as a working starting point for your own deployment; adapt freely
for your practice.
