# Fix Google Sign-In

If "Continue with Google" fails, configure these two places.

---

## 1. Supabase Dashboard

1. Open your project: **[Supabase Dashboard](https://supabase.com/dashboard)** → your project.
2. Go to **Authentication** → **Providers** → enable **Google** and paste your **Client ID** and **Client Secret** from Google Cloud (see below).
3. Go to **Authentication** → **URL Configuration**:
   - **Site URL**: set to your app URL, e.g. `http://localhost:5173` (dev) or `https://yourdomain.com` (prod).
   - **Redirect URLs**: add every URL where users land after sign-in. Add:
     - `http://localhost:5173/` (and `http://localhost:5173` if you use both)
     - Your production URL, e.g. `https://yourdomain.com/`

Save. The app now sends users back to your app after Google sign-in.

---

## 2. Google Cloud Console

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** → your project (or create one).
2. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
3. If asked, configure the **OAuth consent screen** (User type: External, add your email, app name, save).
4. Application type: **Web application**.
5. **Authorized JavaScript origins** – add:
   - `http://localhost:5173` (for dev)
   - `https://yourdomain.com` (for prod)
   - Your Supabase project URL: `https://<YOUR-PROJECT-REF>.supabase.co`
6. **Authorized redirect URIs** – add **only** Supabase’s callback (replace with your project ref):
   - `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
   - Find your project ref in Supabase: Project Settings → General → Reference ID.
7. Create the OAuth client and copy **Client ID** and **Client Secret** into Supabase (step 1).

---

## 3. Check .env

Your app must use the same Supabase project:

- `VITE_SUPABASE_URL=https://<YOUR-PROJECT-REF>.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=<your anon key>`

Restart the dev server after changing `.env`.

---

## Quick checklist

- [ ] Google provider enabled in Supabase with Client ID + Secret
- [ ] Site URL and Redirect URLs set in Supabase (include `http://localhost:5173/` for dev)
- [ ] In Google Cloud: Authorized JavaScript origins include your app URL and Supabase URL
- [ ] In Google Cloud: Authorized redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`
- [ ] .env has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

After this, "Continue with Google" should redirect to Google and then back to your app signed in.
