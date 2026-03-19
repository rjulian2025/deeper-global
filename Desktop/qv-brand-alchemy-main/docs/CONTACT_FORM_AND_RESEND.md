# Contact form & Resend integration

The Astro migration **does not change** how email is sent. Resend runs **only** inside your Supabase Edge Function.

## Request flow

1. **Browser** — `src/views/pages/Contact.tsx` submits via `react-hook-form`.
2. **Client** — `src/lib/supabase.ts` → `submitContactForm()` → `supabase.functions.invoke('contact-form', { body })`.
3. **Edge Function** — `supabase/functions/contact-form/index.ts`:
   - CORS + rate limiting (`contact_submissions` table)
   - Honeypot, validation, spam keyword checks
   - Inserts row in `contact_submissions`
   - **`new Resend(Deno.env.get("RESEND_API_KEY"))`** → two sends:
     - Notification to `contact@qvbrands.com` (update `to` in the function if needed)
     - Confirmation to the submitter’s email
   - Updates submission status with send results

## Astro-specific wiring

| File | Role |
|------|------|
| `src/pages/contact.astro` | Route + `BaseLayout` + `Navigation.astro` |
| `src/components/islands/ContactIsland.tsx` | `client:only="react"` wrapper (Toaster + `Contact`) |
| `src/views/pages/Contact.tsx` | Same form + `submitContactForm` as before |

`client:only` is required because `@/integrations/supabase/client` initializes with `localStorage`, which is not available during SSR.

## Supabase dashboard checklist

1. Deploy function: `supabase functions deploy contact-form`
2. Set secrets (Project Settings → Edge Functions):
   - `RESEND_API_KEY`
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (often injected automatically; confirm if logs show errors)
3. Ensure table `contact_submissions` exists (migration in `supabase/migrations` if you use them)
4. In **Authentication → URL configuration**, allow your production domain (e.g. Vercel) if invoke fails with auth errors

## Do not

- Call the Resend API directly from the browser (would require exposing `RESEND_API_KEY`).
- Rename the function slug `'contact-form'` without updating `src/lib/supabase.ts` and redeploying the function under the new name.

## Optional: public env for Supabase client

You can set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in Vercel (and `.env`) so the anon key is not hardcoded. The client still calls the same `contact-form` function; Resend stays server-side.
