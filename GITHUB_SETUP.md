# How to put this project on GitHub

Follow these steps to push your code to GitHub so you can deploy (e.g. to Vercel).

---

## 1. Create a GitHub account (if you don’t have one)

- Go to [github.com](https://github.com) and sign up.

---

## 2. Create a new repository on GitHub

1. Log in to GitHub.
2. Click the **+** (top right) → **New repository**.
3. Choose a **Repository name** (e.g. `lamitna` or `sofret-ramadan`).
4. Leave it **Public**.
5. **Do not** check “Add a README” or “Add .gitignore” (you already have them).
6. Click **Create repository**.

You’ll see a page with a URL like:  
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`

---

## 3. Open PowerShell in your project folder

- Open PowerShell (or Terminal).
- Go to your project folder, for example:
  ```powershell
  cd "C:\Users\moham\OneDrive\Desktop\sofret-ramadan-main"
  ```

---

## 4. Turn the folder into a Git repo and push

Run these commands **one by one** (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name from step 2):

```powershell
git init
git add .
git commit -m "Initial commit - Lamitna Ramadan app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Example** for this project’s repo:

```powershell
git init
git add .
git commit -m "Initial commit - Lamitna Ramadan app"
git branch -M main
git remote add origin https://github.com/mooashrafff/Lamitna.git
git push -u origin main
```

---

## 5. If Git asks for your username and password

- **Username:** your GitHub username.
- **Password:** GitHub no longer accepts account passwords here. Use a **Personal Access Token**:
  1. GitHub → **Settings** (your profile) → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
  2. **Generate new token (classic)**.
  3. Give it a name, check **repo**, then generate.
  4. Copy the token and paste it when Git asks for a password.

---

## 6. After it’s on GitHub

- You can **Import** this repo in [Vercel](https://vercel.com) to deploy (see main README for env vars and Supabase redirect URLs).
- To push future changes:
  ```powershell
  git add .
  git commit -m "Describe your change"
  git push
  ```
