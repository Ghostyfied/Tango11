# Tango 11 · Alma del Sur

Website for [Tango 11](https://tango11.nl), the Amsterdam tango salon by
Marijke de Vries, and its 2026 project **Alma del Sur** — six Sundays of
tango at the Willem de Zwijgerkerk.

Built with [Vue 3](https://vuejs.org) and [Vite](https://vite.dev) as a fast,
single-page static site. No CMS, no backend — all content lives in two small
JSON files.

## Editing content

### Events / agenda

Edit [`src/data/events.json`](src/data/events.json). Each event looks like:

```json
{
  "date": "2026-08-16",
  "title": "Alma del Sur · Night II",
  "subtitle": "Optional short description",
  "programme": [
    { "time": "19:00", "item": "Tango 11 Milonga" }
  ]
}
```

- `date` is `YYYY-MM-DD`. The site automatically highlights the **next
  upcoming event** (with its full programme) and dims events that have passed.
- Leave `programme` as `[]` to show "Full programme to be announced."
- `subtitle` is optional.
- Optional `"notes": ["..."]` — extra lines shown under the timetable
  (performances, classes, expo details).
- Optional `"reservation": { "text": "...", "url": "https://..." }` — a
  highlighted reservation call-out; leave `url` empty (`""`) to show
  "Reservation link follows soon."

Commit and push — Netlify redeploys automatically.

### Contact details, links, venue

Edit [`src/data/site.json`](src/data/site.json) — organizer contact info,
venue address, and all external links (Facebook, Tangokalender, Soñando,
sponsor) live there.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deployment

### GitHub Pages (current)

Every push to the default branch runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the site and force-pushes `dist/` to the `gh-pages` branch, which GitHub
Pages serves at **https://ghostyfied.github.io/Tango11/**. No configuration
needed — edit, commit, push. (The `gh-pages` branch is a build artifact;
never edit it by hand.)

The build uses a relative base path (`base: './'` in `vite.config.js`), so
the same build works under the Pages subpath and at a domain root.

### Netlify (optional, for the custom domain later)

Connect this repository to Netlify — `netlify.toml` already configures the
build (`npm run build`, publish `dist/`). Alternatively, a custom domain can
be attached directly to GitHub Pages in the repository settings. Either way,
when the final domain is live, update the `og:url` / `og:image` URLs in
`index.html` to match it.

## Credits

- Photography: [Marta Kossakowska](https://hrum.nl)
- Project Alma del Sur is sponsored by Gemeente Amsterdam
