# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Using another Supabase project (not yours)

To connect the app to a **different** Supabase project (e.g. a teammate's or another account):

1. Open that project’s **Supabase Dashboard** → **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. In this repo, create or edit `.env` and set:
   - `VITE_SUPABASE_URL` = that project’s URL  
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = that project’s anon key  
4. In **that** project, run the app’s migrations so the `events` table exists (see `supabase/migrations/`). You can run them via the SQL Editor or Supabase CLI linked to that project.

Sign-in and events will then use that Supabase project.

## Verify Supabase Connection

To verify that your application can successfully connect to Supabase:

1. Ensure your `.env` file contains the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. Run the verification script:
   ```sh
   npm run verify-connection
   ```
3. If the connection is successful, you will see a success message. If not, check your credentials in `.env`.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

**Lovable:** Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click Share → Publish.

**Vercel:**

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com). Use **Vite** as the framework preset; build command `npm run build`, output directory `dist`.
2. In Vercel → Project → **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL (e.g. `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon/public key
3. In **Supabase** → Authentication → URL Configuration, add your Vercel URL to **Redirect URLs** (e.g. `https://your-app.vercel.app/`) and set **Site URL** to that URL so auth redirects work.
4. Redeploy after saving env vars. The repo includes a `vercel.json` so client-side routes (e.g. `/invite/:id`, `/event/:id`) work correctly.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
