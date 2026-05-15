# ABC Pharmacy — Angular 19 + .NET 8 Full Stack

## Architecture

```
Browser (Angular 19 SPA)
    ↕ HTTP (proxy → localhost:5000)
.NET 8 Web API
    ↕ Read/Write
JSON Files (medicines.json, sales.json)
```

## Folder Structure

```
PharmacyApp_Angular/
│
├── PharmacyApp.API/               ← .NET 8 Web API (unchanged)
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Data/
│   │   ├── medicines.json
│   │   └── sales.json
│   └── Program.cs
│
└── pharmacy-app/                  ← Angular 19 SPA
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── medicines/     ← Medicine grid, add/edit/sell modals
    │   │   │   ├── sales/         ← New sale form
    │   │   │   ├── records/       ← Sale history table
    │   │   │   ├── staff/         ← Staff profile cards
    │   │   │   └── shared/
    │   │   │       └── navbar/    ← Shift bar + top navigation
    │   │   ├── models/
    │   │   │   └── models.ts      ← TypeScript interfaces
    │   │   ├── services/
    │   │   │   ├── medicine.service.ts
    │   │   │   ├── sale.service.ts
    │   │   │   ├── staff.service.ts
    │   │   │   └── toast.service.ts
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts      ← Angular 19 standalone config
    │   │   └── app.routes.ts      ← Lazy-loaded routes
    │   ├── environments/
    │   ├── styles.scss            ← Global design system
    │   ├── index.html
    │   └── main.ts
    ├── proxy.conf.json            ← Forwards /api → localhost:5000
    ├── angular.json
    └── package.json
```

---

## How to Run

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) and npm

---

### Terminal 1 — Start the .NET API

```bash
cd PharmacyApp.API
dotnet run
```
API runs on → **http://localhost:5000**

---

### Terminal 2 — Start Angular Dev Server

```bash
cd pharmacy-app
npm install
npm start
```
Angular runs on → **http://localhost:4200**

The proxy config automatically forwards all `/api` calls from Angular to the .NET backend at port 5000.

---

### Open in browser

**http://localhost:4200**

---

## Build for Production

```bash
cd pharmacy-app
npm run build:prod
```

Output goes to `dist/pharmacy-app/`. Copy these files into `PharmacyApp.API/wwwroot/` and the .NET app serves everything on one port.

---

## Angular 19 Key Features Used

| Feature | Where |
|---|---|
| Standalone components | All components (no NgModule) |
| `provideRouter` | `app.config.ts` |
| `provideHttpClient` | `app.config.ts` |
| Lazy loading | `app.routes.ts` — each route loads its component on demand |
| Reactive Forms | Medicines add/edit modal |
| Template-driven Forms | Sales form, quick sell modal |
| `AsyncPipe` via BehaviorSubject | Staff service |
| Angular `DatePipe` | Sale records table |
| `HttpClient` | medicine.service.ts, sale.service.ts |
