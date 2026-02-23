# AI Chef – Generate Menu Edge Function

This function uses **OpenAI** to generate personalized Ramadan menus and grocery lists based on:

- Number of guests
- Cuisine (e.g. Egyptian, Lebanese, Iranian, Mixed)
- Vibe (cozy, big family, fancy, chill)
- Cooking effort (simple, happy to cook, going all out)
- Dietary (vegetarian, nut-free, dairy-free, no restrictions)
- Meal type (iftar / suhoor / both)

## Setup

1. **Get an API key** (use one):
   - **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey) → create key
   - **OpenAI:** [platform.openai.com](https://platform.openai.com/api-keys) → create key

2. **Add the secret in Supabase**
   - Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
   - Go to **Project Settings** → **Edge Functions** → **Secrets**
   - Add: `GEMINI_API_KEY` = your Gemini key, **or** `OPENAI_API_KEY` = your OpenAI key  
   - (If both exist, Gemini is used.)

3. **Deploy the function**
   ```bash
   npx supabase functions deploy generate-menu
   ```
   (Requires [Supabase CLI](https://supabase.com/docs/guides/cli) and login.)

After deployment, the app will call this function when users reach the “Cooking up your menu...” step. If the function is not deployed or the key is missing, the app falls back to randomized suggested menus.
