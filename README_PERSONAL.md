# Personal Guide & Architecture Overview

This document is for your personal use to understand the architecture, configuration, and responsibilities of different parts of the application.

## 1. Configuration (`src/config/appConfig.ts`)
This is the central place to toggle features without digging into the code.
- **`auth.enabled`**: Set to `false` during development if you want to bypass the login screen entirely and jump straight to the dashboards.
- **`auth.provider`**: Currently supports 'supabase' (or 'local' if you mock it).
- **`dashboards`**: Enable or disable specific dashboards (e.g., if you don't need the accountant dashboard, set `accountant.enabled` to `false`). You can also configure which roles can access which dashboard.

## 2. Authentication Flow
- **`src/contexts/AuthContext.tsx`**: Manages the global authentication state. It listens to Supabase for login/logout events and fetches the user's profile (which contains their role).
- **`src/services/auth.service.ts`**: Contains the actual API calls to Supabase for login, logout, and fetching the user profile.
- **`src/App.tsx`**: The main entry point. It uses `appConfig` to decide whether to show the login screen or bypass it. It also checks the user's role against `appConfig.dashboards` to ensure they have permission to view a selected dashboard.

## 3. Backend Integration (Supabase)
- **`src/lib/supabase.ts`**: Initializes the Supabase client using environment variables.
- **Environment Variables**: Stored in `.env` (local) and must be set in Vercel.
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Database Schema (`supabase_schema.sql`)**:
  - Organized into multiple schemas (`crm`, `sales`, `manufacturing`, `logistics`, `finance`, `system`) to keep tables logically separated.
  - **CRITICAL LOGIC**: The state transition logic (e.g., Draft -> Active) is enforced at the database level using a PostgreSQL trigger (`enforce_order_state_transition`). This means even if someone hacks the frontend, the database will reject invalid status changes based on their role.

## 4. Troubleshooting Blank Screens on Vercel
If you see a blank screen on Vercel:
1. **Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your Vercel project settings.
2. **Production Logging**: In `src/main.tsx`, we previously had a block that disabled `console.error` in production. This hides errors. If you need to debug on Vercel, temporarily remove that block.
3. **Database Setup**: If the Supabase tables aren't created yet, the app might fail when trying to fetch the user profile.

## 5. Next Steps for You (Manual Actions Required)
Since I cannot run SQL commands directly on your Supabase instance, you need to do the following:

1. **Run the SQL Schema**:
   - Go to your Supabase Dashboard -> SQL Editor.
   - Copy the contents of `supabase_schema.sql` and run it.
2. **Expose Schemas to API**:
   - Because we organized tables into schemas (`crm`, `sales`, etc.), you need to tell Supabase to expose them to the API.
   - Go to Supabase Dashboard -> Project Settings -> API.
   - Under "Exposed schemas", add `crm`, `sales`, `manufacturing`, `logistics`, `finance`, and `system` alongside `public`.
3. **Create Initial Users**:
   - Go to Supabase Dashboard -> Authentication -> Users.
   - Create a user (e.g., admin@example.com).
   - Go to the Table Editor -> `public` schema -> `user_profiles` table.
   - Insert a row linking the new user's UUID to the `ADMIN` role so you can log in.
