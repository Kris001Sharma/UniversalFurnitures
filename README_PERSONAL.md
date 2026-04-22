# ERP Internal Refactoring Guide

## Codebase Architecture (v2.0)

The application has been successfully restructured to eliminate the monolithic `App.tsx` file (which formerly housed ~6000 lines of code). The structure 
now maps directly to the user roles and functionality required by the application.

### File Structure

```
src/
├── App.tsx                     # Core router and state initializer
├── types/
│   └── index.ts                # Shared TypeScript interfaces & types
├── contexts/
│   ├── AuthContext.tsx         # User authentication & Supabase session
│   └── AppStateContext.tsx     # Global application state provider
├── components/
│   ├── dashboards/             # Isolated Dashboards 
│   │   ├── AdminDashboard.tsx
│   │   ├── SalesDashboard.tsx
│   │   ├── DeliveryDashboard.tsx
│   │   ├── SupervisorDashboard.tsx
│   │   └── AccountantDashboard.tsx
│   ├── admin/
│   │   └── DataSync.tsx        # Synchronization component
│   ├── OrderTracker.tsx        # Shared UI components
│   ├── StatusBadge.tsx
│   └── ProfileModal.tsx
└── services/
    └── data.service.ts         # Supabase data layer
```

## How It Works

**The Problem**: Previously, all 40+ `useState` hooks determining active tabs, cart logic, orders, search queries, etc., were locked inside `App.tsx` preventing extraction.

**The Solution (`AppStateContext`)**: 
1. `App.tsx` initializes all React states.
2. It aggregates them into a massive `appState` dictionary.
3. It passes `appState` into `<AppStateProvider>`.
4. The individual dashboards (e.g. `SalesDashboard`) consume this context using `useAppState()`.
This allowed zero-prop-drilling refactoring without breaking any established logical flows. 

### How to Modify a Dashboard

If you want to modify the functionality of the **Sales Agent Dashboard**, simply go to `src/components/dashboards/SalesDashboard.tsx`. Check the top of the file:

```tsx
const { activeTab, setActiveTab, orders, clients, handleSignOut, ... } = useAppState();
```

If you need a new global state (e.g., `newFeature`), add it to `App.tsx` and pass it down into the `appState` dictionary, then pull it out of `useAppState()` in the target dashboard.

### How to Add a New User Role

1. Open `src/types/index.ts` and add the role to `UserRole`.
   ```ts
   export type UserRole = 'sales' | 'admin' | 'supervisor' | 'accountant' | 'delivery' | 'new_role';
   ```
2. Create `src/components/dashboards/NewRoleDashboard.tsx`.
3. In `App.tsx`, import your new dashboard at the top.
4. Add the appropriate button logic for `appView === 'selection'`.
5. Add the display condition in the router section of `App.tsx`:
   ```tsx
   {selectedDashboard === 'new_role' && <NewRoleDashboard />}
   ```

### Troubleshooting Dashboard UI Components

Because `App.tsx` was heavily factored, you may find lingering broken references (e.g., `<StatusBadge />` missing imports). 
To resolve them:
1. Ensure `import { StatusBadge } from '../StatusBadge'` is at the top of the specific Dashboard file.
2. Ensure you import shared components properly from `../../components/`.

## Best Practices

- **Never create a new top-level `useState` in `App.tsx` unless it needs to be shared across multiple dashboards.** If a state is strictly for the Sales Dashboard (e.g. `salesTab`), you can safely initialize it inside `SalesDashboard.tsx`.
- Keep the `types/index.ts` tightly defined. Do not place React Components (like `<StatusBadge />`) inside the `types` directory.

## Maintenance Scripts & Codebase Files

The codebase includes several `.cjs` scripts in the `scripts/` directory that were historically used for large-scale, automated refactoring of the original monolithic application. Along with the `src/` structure, they help manage the code effectively.

### Refactoring Scripts (`scripts/*.cjs`)

These files were written to automatically manipulate code, resolve typescript errors, extract components, or fix bugs programmatically during the migration process. Although they were run once, they are kept for historical context or if similar automated refactors are needed globally:

- **`add_user_roles.cjs`**: Automated injecting or modifying user role references within strings or definitions across files.
- **`extract_all.cjs`**: Orchestration script used to extract major dashboard blocks out of `App.tsx` simultaneously.
- **`extract_types.cjs`**: Ran regular expressions across `App.tsx` to automatically harvest all Typescript `interface` and `type` definitions and deposit them into `src/types/index.ts`.
- **`extract_delivery.cjs`, `fix_delivery.cjs`**: Extracted and patched issues specifically related to the `DeliveryDashboard` isolation.
- **`fix_accountant.cjs`, `fix_sales.cjs`, `fix_sales_bottom.cjs`**: Automated patching of dashboard files to fix missing dependency imports, missing prop destructuring, or broken `<StatusBadge>` tracking maps post-extraction.
- **`fix_app.cjs`, `fix_app_top.cjs`, `wrap_app.cjs`**: Modifies the core `App.tsx` file (e.g. replacing local state declarations with a giant context-wrapped application map).
- **`fix_app_state.cjs`, `get_states.cjs`**: Scanned hooks inside `App.tsx` and dynamically built the huge `appState` dictionary provided recursively via `<AppStateProvider>`.
- **`fix_types.cjs`**: Corrected minor type overlaps.
- **`fix_missing.cjs`, `fix_missing_components.cjs`**: Automatically imported missing components (like `Recharts`) that were forgotten when ripping out Dashboards originally.
- **`move.cjs`**: Utility meant to organize and herd all of these `.cjs` scripts into their own standalone `/scripts` folder safely.

### Source Files (`src/`) Summary

- **`src/App.tsx`**: The core router and global state initiator. It spins up Context variables, determines which dashboard layout should render based on `appView` or `selectedDashboard`, and provides them via `<AppStateProvider>`.
- **`src/types/index.ts`**: Centralized source of truth for TypeScript typings (`Order`, `Transaction`, `UserRole`, etc.). Ensures structural consistency.
- **`src/contexts/`**: Includes React setup (e.g., `AppStateContext.tsx` handles distributing state; `AuthContext.tsx` manages session authentication logic via Supabase).
- **`src/components/dashboards/`**:
  - Contains strictly isolated dashboards: `AdminDashboard.tsx`, `SalesDashboard.tsx`, `AccountantDashboard.tsx`, `DeliveryDashboard.tsx`, `SupervisorDashboard.tsx`. Each serves a completely separate user audience, consuming state from Context freely.
- **`src/components/admin/DataSync.tsx`**: Synchronization and offline/online management logic isolated for the admin interface.
- **`src/components/OrderTracker.tsx`, `StatusBadge.tsx`, `ProfileModal.tsx`**: Isolated stateless (or purely utility-driven) UI components shared uniformly across varying dashboards to prevent duplicating interface elements.
- **`src/services/data.service.ts`**: Interacts tightly with the Supabase JS SDK, facilitating fetching matching tables, authenticating requests, pushing data, and parsing queries backend-side.
- **`src/middleware.ts`**: The edge router intercepts HTTP payloads to guarantee unauthenticated individuals or incorrect role profiles are strictly rejected from routing toward unauthorized sub-URLs.
- **`src/lib/auth.ts`**: Common authorization enforcement utilities parsed locally or checked directly inside Next API/SSR boundaries.
