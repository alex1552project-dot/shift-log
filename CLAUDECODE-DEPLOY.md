# Claude Code Task — Deploy "Shift Log" to GitHub + Netlify

Paste this whole file to Claude Code as the task. It assumes the prepared project
folder (`shift-log/`) has already been unzipped to your machine.

---

## YOUR CURRENT TASK
Take the existing static site in `./shift-log` and (1) put it in a new GitHub repo,
(2) deploy it live on Netlify with continuous deploy from that repo. Do **not** modify
the app's code, design, or icons — only add git/deploy plumbing. When the live URL works
and shows the app, you are done.

## GROUND RULES
- This is a **static site**: `index.html` + `manifest.webmanifest` + `netlify.toml` + `icons/`. No build step, no npm install, no framework. Do not add one.
- Do **not** touch any other repo, directory, or project on this machine.
- There are no secrets or `.env` files in this project — nothing to protect, nothing to commit by accident.
- **Two-attempt limit:** if any single step fails twice, STOP, print the exact error, and ask me before continuing. Do not improvise around a blocker.
- Confirm the actual folder contents before running anything; do not assume.

## PREREQUISITES — verify first, install only if missing
Run these checks and report what's present:
```bash
git --version
gh --version && gh auth status          # GitHub CLI, must be logged in
netlify --version || npm i -g netlify-cli   # Netlify CLI
netlify status                           # confirms Netlify login; if not logged in: netlify login
node --version                           # only needed for the optional local preview
```
If `gh auth status` shows not-logged-in, stop and tell me to run `gh auth login`.
If `netlify status` shows not-logged-in, stop and tell me to run `netlify login`.

---

## STEP 1 — Inspect & sanity-check the project
```bash
cd shift-log
ls -la && ls -la icons
```
Confirm you see: `index.html`, `manifest.webmanifest`, `netlify.toml`, `README.md`,
`.gitignore`, and `icons/` containing `apple-touch-icon.png`, `icon-192.png`,
`icon-512.png`, `icon-1024.png`, `favicon-32.png`.
Quick sanity check that the PWA wiring is intact:
```bash
grep -n "manifest.webmanifest\|apple-touch-icon\|theme-color" index.html
```
All three should appear. If any file is missing, STOP and report — do not recreate it.

## STEP 2 — Initialize git
```bash
git init -b main
git add -A
git commit -m "Initial commit: Shift Log PWA"
```

## STEP 3 — Create the GitHub repo and push
Use the GitHub CLI so it creates the remote and pushes in one move:
```bash
gh repo create shift-log --public --source=. --remote=origin --push
```
Then confirm:
```bash
gh repo view --web    # (optional) opens it in the browser
git remote -v          # should show origin -> the new GitHub repo
```
If you prefer it private, use `--private` instead of `--public`. Report the repo URL.

## STEP 4 — Create the Netlify site and link it for continuous deploy
```bash
netlify init
```
When prompted:
- Choose **"Create & configure a new site"**
- Pick the team/account when asked
- Site name: `shift-log` (or accept the suggested name if taken — report what it picks)
- Build command: **leave blank** (press enter)
- Directory to deploy: **`.`** (the repo root — this is set in `netlify.toml`)
- Let it connect to the GitHub repo so pushes to `main` auto-deploy.

`netlify init` will trigger the first deploy. When it finishes, print the live URL.

**Fallback (only if `netlify init` fails its GitHub linking twice):** do a direct deploy so we at least have a live URL, then tell me so I can connect the repo in the Netlify dashboard manually:
```bash
netlify deploy --prod --dir=. --message "Shift Log first deploy"
```

## STEP 5 — Verify it's actually live
```bash
netlify open:site     # opens the live URL
netlify status        # prints the production URL
```
Fetch the deployed pages to confirm they return 200 and the right content:
```bash
URL=$(netlify status --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Live at: $URL"
curl -s -o /dev/null -w "index:  %{http_code}\n" "$URL/"
curl -s -o /dev/null -w "manifest: %{http_code}\n" "$URL/manifest.webmanifest"
curl -s -o /dev/null -w "icon:   %{http_code}\n" "$URL/icons/apple-touch-icon.png"
```
All three should return `200`.

## STEP 6 — Confirm continuous deploy (the GitHub <-> Netlify link)
Make a trivial change and push, then confirm Netlify auto-builds:
```bash
git commit --allow-empty -m "Test: trigger Netlify auto-deploy"
git push
netlify watch        # should show a new deploy starting from the push
```
If a new deploy kicks off from the push, the GitHub + Netlify connection is working.

---

## DONE — report back with:
1. The **GitHub repo URL**
2. The **live Netlify URL**
3. Confirmation that index, manifest, and icon all returned `200`
4. Confirmation that the push in Step 6 triggered an auto-deploy

## Then tell me how to install it on the iPhone
In Safari on the phone, open the live URL → tap **Share** → **Add to Home Screen**.
It should appear with the Shift Log icon and launch full-screen (no browser bars).
