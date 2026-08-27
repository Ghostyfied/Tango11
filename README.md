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
  (performances, classes, expo details). A note can also be an object
  `{ "text": "...", "photos": [{ "file", "alt", "pos" }] }` to show small
  clickable portraits at the end of the line (same lightbox as the
  programme photos).
- In `programme` items and `notes`, wrap text in `**double asterisks**`
  to highlight it in bold (e.g. DJ names), and use `[text](url)` to make
  it a link (e.g. `[beginners class](beginners/)` for the poster page at
  `/beginners/`).
- A programme entry can carry round portraits: either a single `"photo"`
  (filename of an image in `src/assets/img/`) with `"photoAlt"` and
  optionally `"photoPos"` (CSS object-position, to aim the crop at the
  face), or a `"photos": [{ "file", "alt", "pos" }]` array for multiple.
- Optional `"photosUrl": "https://..."` on an event — shows an
  "Event photos ↗" link on its agenda card (e.g. a OneDrive album of a
  past event).
- Optional `"cardLink": { "text", "url" }` on an event — an extra small
  link on its compact agenda card (e.g. to the beginners-class page).
- Optional `"reservation": { "text": "...", "url": "https://..." }` — a
  highlighted reservation call-out; leave `url` empty (`""`) to show
  "Reservation link follows soon."
- Optional `"foodOrdering": { "partner", "formUrl", "price",
  "servedWindow", "deadline" }` — renders the two-step food ordering block
  (order form + Tikkie payment page at `/pay/`). The block has anchor
  `#food`, so `https://tango11.nl/#food` links straight to it. The Tikkie
  QR image lives in `src/components/PayPage.vue` (see the comment there).

Commit and push — Netlify redeploys automatically.

### Gallery

The gallery page at `/gallery/` groups photos per event automatically.
To add photos for an event, create a folder named after the event date and
drop the images in:

```
src/assets/gallery/2026-08-16/01.jpg
src/assets/gallery/2026-08-16/02.jpg
```

- Photos are sorted by filename — prefix with numbers to control the order.
- Please resize photos to roughly 1600px wide before committing (a few
  hundred KB each) so the page stays fast; 10–20 curated photos per event
  works best.
- The event's title comes from `events.json` (matched by date), and its
  `photosUrl` doubles as the "Full album ↗" link on the gallery page.
- Videos: upload to YouTube and add to the event in `events.json`:
  `"videos": [{ "youtubeId": "abc123", "title": "...", "portrait": true }]`
  (set `portrait` for Shorts/vertical video). They appear as play tiles in
  the event's grid and play in the lightbox.
- The page also shows the upcoming events in an "Upcoming Sundays" box.

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
