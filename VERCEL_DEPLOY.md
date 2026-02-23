# Lamitna on Vercel – checklist

If **https://lamitna.vercel.app** is blank, broken, or sign-in fails, use this checklist.

---

## 1. Environment variables (required)

In **Vercel** → your project **Lamitna** → **Settings** → **Environment Variables**, add:

| Name | Value | Where to get it |
|------|--------|------------------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | [Supabase](https://supabase.com/dashboard) → your project → **Settings** → **API** → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | long string (anon public key) | Same page → **Project API keys** → **anon** **public** |

Save, then go to **Deployments** → **…** on the latest deployment → **Redeploy** (so the new vars are used).

---

## 2. Supabase redirect URLs (for sign-in)

In **Supabase** → your project → **Authentication** → **URL Configuration**:

- **Site URL:** `https://lamitna.vercel.app`
- **Redirect URLs:** add `https://lamitna.vercel.app/**`

Save. Without this, Google (or other) sign-in will fail or redirect incorrectly.

---

## 3. Build settings (usually auto)

- **Framework Preset:** Vite  
- **Build Command:** `npm run build`  
- **Output Directory:** `dist`  
- **Root Directory:** `./` (leave empty or `./`)

---

## 4. If the site is still blank

- Open **Vercel** → **Deployments** → click the latest deployment and check the **Build** log for errors.
- In the browser, open **Developer tools** (F12) → **Console** and note any red errors. If you see `[Lamitna] Missing VITE_SUPABASE_URL...`, add the env vars and redeploy as in step 1.
