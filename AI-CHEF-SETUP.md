# AI Chef setup (Lamitna’s menu generator)

The app has an **AI chef** that generates personalized Ramadan menus and grocery lists. It runs as a **Supabase Edge Function** and supports **Google Gemini** or **OpenAI**. You only need one.

---

## 1. Get an API key (choose one)

**Option A – Google Gemini (recommended)**  
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).  
2. Create an API key and copy it.

**Option B – OpenAI**  
1. Go to [platform.openai.com](https://platform.openai.com/api-keys).  
2. Create an API key and copy it.

---

## 2. Add the secret in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Project Settings** (gear icon) → **Edge Functions** → **Secrets**.
3. Click **Add new secret**:
   - **For Gemini:** Name = `GEMINI_API_KEY`, Value = your Gemini API key.
   - **For OpenAI:** Name = `OPENAI_API_KEY`, Value = your OpenAI API key.
4. Save. (If both are set, the function uses **OpenAI** first.)

---

## 3. Deploy the Edge Function

**Option A – Supabase CLI (recommended)**

1. Install the Supabase CLI (do **not** use `npm install -g supabase` — global install is not supported):
   - **From this project:** run `npm install` in the project root (the CLI is a dev dependency). Then use `npx supabase` or the script below.
   - **Windows (Scoop):** `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git` then `scoop install supabase`.
   - **macOS:** `brew install supabase/tap/supabase`.
2. Log in and link your project (from the project root):
   ```bash
   npx supabase login
   npx supabase link --project-ref rrxsevbgtprbtfakidqe
   ```
   (Use your project ref from Dashboard → Project Settings → General.)
3. Deploy the AI chef function:
   ```bash
   npm run supabase:deploy-menu
   ```
   Or: `npx supabase functions deploy generate-menu`

**Option B – Deploy from Supabase Dashboard**

1. In the Dashboard, go to **Edge Functions**.
2. Create a new function named **generate-menu**.
3. Paste in the code from `supabase/functions/generate-menu/index.ts`.
4. Add the `OPENAI_API_KEY` secret as in step 2.
5. Deploy the function.

---

## 4. Test it

1. Run your app and sign in.
2. Create an event (or use an existing one) and open **Plan Event**.
3. Go through the steps: guest count → vibe → cooking effort → dietary → **cuisine**.
4. After you pick a cuisine, you should see “Cooking up your menu...” and then an AI-generated menu and grocery list.
5. If you see “Lamitna crafted your menu!” the AI chef is working. If you see “Using suggested menu…”, the function isn’t deployed or the secret is missing; check the steps above.

---

## Troubleshooting – GPT / OpenAI not working

- **Secret name must be exactly** `OPENAI_API_KEY` (case-sensitive). In Supabase: Project Settings → Edge Functions → **Secrets** → Add `OPENAI_API_KEY` with your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
- **Redeploy after adding the secret:** run `supabase functions deploy generate-menu` (or deploy from the Dashboard). Edge Functions read secrets at deploy/cold start.
- **Key valid and has credits:** In the OpenAI dashboard, confirm the key is active and your account has usage/credits. If you see "AI chef: OpenAI API error: 401" in the app, the key is invalid or revoked.
- **To use Gemini instead of GPT:** Remove the `OPENAI_API_KEY` secret (or leave only `GEMINI_API_KEY`). The function uses OpenAI first when both are set.

---

## What the AI chef does

- **Inputs:** Guest count, cuisine (e.g. Egyptian, Lebanese, Mixed), vibe, cooking effort, dietary, meal type (iftar/suhoor/both).
- **Output:** A menu (appetizers, mains, sides, drinks, desserts) and a grocery list scaled for your guests.
- **Fallback:** If the Edge Function is not deployed or fails, the app uses built-in suggested menus so the flow still works.

For more detail, see `supabase/functions/generate-menu/README.md`.
