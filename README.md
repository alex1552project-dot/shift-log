# Shift Log

A tiny, fast capture tool for spotting workflow problems worth turning into an app.
Open it on your phone, dump the friction the moment it annoys you, tag it, export the list.

- **Single file** — `index.html`, no build step, no dependencies.
- **Stores locally** — entries live in the browser on that device (localStorage). Use **Download CSV** to get them out.
- **Installable** — on iPhone, Share → *Add to Home Screen* for an app icon and full-screen launch.

## Run locally
Just open `index.html` in a browser, or serve the folder:
```
npx serve .
```

## Deploy
Static site. Connected to Netlify; every push to `main` auto-deploys.
