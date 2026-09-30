# Personal Website — Jun Seo Lee

Plain HTML/CSS/JS. No build step. Open `index.html` in a browser to preview.

## Files
- `index.html` — all content (about, work, involvement, awards, contact)
- `style.css` — colors, fonts, layout (colors are variables at the top)
- `script.js` — tab switching + dark mode toggle

## To do before publishing
1. Review the wording in each section.
2. (Optional) Add a `resume.pdf` to `public/` and link it in the header socials.

## Adding things
Copy any `<div class="entry">…</div>` block and edit it. Awards are `<li>` items in the awards list.

## Hosting (GitHub Pages + custom domain)
Repo: `junseo25/junseo25.github.io`. Pages serves the `main` branch root, so every push updates the site.

To connect your own domain:
1. Add a file named `CNAME` to this folder containing just the domain (e.g. `junseolee.com`), commit, and push.
2. At your domain registrar, add DNS records:
   - Apex domain (`junseolee.com`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` subdomain: a `CNAME` record → `junseo25.github.io`
3. Repo → Settings → Pages: confirm the custom domain, wait for the DNS check, then tick **Enforce HTTPS**.

DNS changes can take up to a few hours to propagate.
