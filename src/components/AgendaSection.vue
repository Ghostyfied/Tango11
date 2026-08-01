<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import site from '../data/site.json'
import eventsData from '../data/events.json'
import { dayNumber, formatDate, isPast, monthLabel, nextEvent, sortByDate } from '../utils/events.js'
import BokehLights from './BokehLights.vue'
import FoodOrdering from './FoodOrdering.vue'

const events = sortByDate(eventsData)
const next = nextEvent(events)
const others = events.filter((e) => e !== next)

// Resolve optional programme photos (filenames in src/assets/img) to built URLs
const images = import.meta.glob('../assets/img/*', { eager: true, import: 'default' })
const photoSrc = (name) => images[`../assets/img/${name}`]

// Clicking a portrait opens the full photo in a lightbox
const lightbox = ref(null)

watch(lightbox, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e) {
  if (e.key === 'Escape') lightbox.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

// Notes may be plain strings or { text, photos: [{ file, alt, pos }] }
const asNote = (note) => (typeof note === 'string' ? { text: note, photos: [] } : { photos: [], ...note })

// Escape HTML, then turn **text** into <strong> and [text](url) into links,
// so data entries can bold names and link to pages
function fmt(text) {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s"]+)\)/g, '<a href="$2">$1</a>')
}
</script>

<template>
  <section id="agenda" class="section section--raised">
    <BokehLights :seed="3" :count="12" pattern="edges" />
    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">Agenda</p>
        <h2 class="section-title">Six Sundays</h2>
        <p class="section-lead">
          Every third Sunday of the month. Please check
          <a :href="site.links.tangokalender" target="_blank" rel="noopener">Tangokalender</a>
          for confirmation, changes and exceptions.
        </p>
      </div>

      <article v-if="next" class="featured" data-reveal>
        <div class="featured-head">
          <p class="featured-label">Next event</p>
          <h3 class="featured-date">{{ formatDate(next.date) }}</h3>
          <p class="featured-title">{{ next.title }}</p>
          <p v-if="next.subtitle" class="featured-sub">{{ next.subtitle }}</p>
        </div>

        <ol v-if="next.programme.length" class="programme">
          <li v-for="entry in next.programme" :key="entry.time + entry.item">
            <span class="programme-time">{{ entry.time }}</span>
            <span v-html="fmt(entry.item)"></span>
            <button
              v-if="entry.photo && photoSrc(entry.photo)"
              type="button"
              class="programme-photo-btn"
              :aria-label="`Show full photo of ${entry.photoAlt || 'this artist'}`"
              @click="lightbox = { src: photoSrc(entry.photo), alt: entry.photoAlt || '' }"
            >
              <img
                class="programme-photo"
                :src="photoSrc(entry.photo)"
                :alt="entry.photoAlt || ''"
                :style="entry.photoPos ? { objectPosition: entry.photoPos } : null"
                loading="lazy"
              />
            </button>
          </li>
        </ol>
        <p v-else class="programme-tba">Full programme to be announced.</p>

        <ul v-if="next.notes?.length" class="notes">
          <li v-for="note in next.notes.map(asNote)" :key="note.text">
            <span class="note-text" v-html="fmt(note.text)"></span>
            <span v-if="note.photos.length" class="note-photos">
              <button
                v-for="photo in note.photos"
                :key="photo.file"
                type="button"
                class="note-photo-btn"
                :aria-label="`Show full photo of ${photo.alt}`"
                @click="lightbox = { src: photoSrc(photo.file), alt: photo.alt }"
              >
                <img
                  class="note-photo"
                  :src="photoSrc(photo.file)"
                  :alt="photo.alt"
                  :style="photo.pos ? { objectPosition: photo.pos } : null"
                  loading="lazy"
                />
              </button>
            </span>
          </li>
        </ul>

        <p v-if="next.reservation" class="reservation">
          {{ next.reservation.text }}
          <a v-if="next.reservation.url" :href="next.reservation.url" target="_blank" rel="noopener">
            Reserve here ↗
          </a>
          <em v-else>Reservation link follows soon.</em>
        </p>

        <FoodOrdering v-if="next.foodOrdering" :food="next.foodOrdering" />
      </article>

      <div class="grid">
        <article
          v-for="event in others"
          :key="event.date"
          class="card"
          :class="{ 'card--past': isPast(event.date) }"
          data-reveal
        >
          <div class="card-date">
            <span class="card-day">{{ dayNumber(event.date) }}</span>
            <span class="card-month">{{ monthLabel(event.date) }}</span>
          </div>
          <div>
            <h4>{{ event.title }}</h4>
            <p>
              {{ isPast(event.date) ? 'This event has passed' : formatDate(event.date) }}
            </p>
            <a
              v-if="event.photosUrl"
              :href="event.photosUrl"
              target="_blank"
              rel="noopener"
              class="card-photos"
            >
              Event photos ↗
            </a>
            <a v-if="event.cardLink" :href="event.cardLink.url" class="card-photos">
              {{ event.cardLink.text }}
            </a>
          </div>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightbox" class="lightbox" @click="lightbox = null">
          <figure>
            <img :src="lightbox.src" :alt="lightbox.alt" />
            <figcaption v-if="lightbox.alt">{{ lightbox.alt }}</figcaption>
          </figure>
          <button type="button" class="lightbox-close" aria-label="Close photo">×</button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.featured {
  margin-top: 3rem;
  background: linear-gradient(135deg, var(--surface) 0%, rgba(142, 36, 52, 0.16) 100%);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: clamp(1.75rem, 4vw, 2.75rem);
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2.5rem;
}

.featured-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--red-bright);
  margin-bottom: 0.9rem;
}

.featured-date {
  font-size: clamp(1.9rem, 3.5vw, 2.6rem);
  margin-bottom: 0.5rem;
}

.featured-title {
  color: var(--gold-bright);
  font-size: 1.05rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}

.featured-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.programme {
  list-style: none;
  margin: 0;
  padding: 0;
  align-self: center;
}

.programme li {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.95rem;
  color: var(--text);
}

/* DJ portraits echo the circular "bolletjes" motif */
.programme-photo-btn {
  flex: 0 0 auto;
  margin-left: auto;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  line-height: 0;
}

.programme-photo {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--line-strong);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.programme li:hover .programme-photo {
  transform: scale(1.6);
  border-color: var(--gold);
}

/* Full-photo lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(14, 11, 9, 0.88);
  backdrop-filter: blur(8px);
  cursor: zoom-out;
  padding: 2rem;
}

.lightbox figure {
  margin: 0;
  text-align: center;
}

.lightbox img {
  max-width: min(58rem, 92vw);
  max-height: 82vh;
  border-radius: var(--radius);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.lightbox figcaption {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--gold-bright);
}

.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: none;
  border: 0;
  color: var(--text-muted);
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
}

.lightbox-close:hover {
  color: var(--text);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.programme li:last-child {
  border-bottom: 0;
}

/* Inter is loaded up to weight 600 — avoid faux-bold synthesis */
.programme :deep(strong),
.notes :deep(strong) {
  font-weight: 600;
  color: var(--gold-bright);
}

.programme-time {
  flex: 0 0 3.2rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--gold);
}

.programme-tba {
  align-self: center;
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}

/* Extras below the timetable, spanning the full card */
.notes {
  grid-column: 1 / -1;
  list-style: none;
  margin: 0;
  padding: 1.25rem 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 0.6rem;
}

.notes li {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.92rem;
  color: var(--text-muted);
}

/* The colored dot anchors to the text's first line, not the row */
.note-text {
  flex: 1;
  position: relative;
  padding-left: 1.4rem;
}

.note-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

/* Small clickable portraits at the end of a note row, like the DJ ones */
.note-photos {
  flex: 0 0 auto;
  margin-left: auto;
  display: flex;
}

.note-photo-btn {
  padding: 0;
  background: none;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  line-height: 0;
}

.note-photo-btn + .note-photo-btn {
  margin-left: -0.7rem;
}

.note-photo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--line-strong);
  background: var(--surface);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.note-photo-btn:hover .note-photo {
  transform: scale(1.6);
  border-color: var(--gold);
}

.note-photo-btn:hover {
  position: relative;
  z-index: 2;
}

.notes li:nth-child(3n + 1) .note-text::before {
  background: var(--c-magenta);
}

.notes li:nth-child(3n + 2) .note-text::before {
  background: var(--c-orange);
}

.notes li:nth-child(3n + 3) .note-text::before {
  background: var(--c-blue);
}

.reservation {
  grid-column: 1 / -1;
  margin: 0;
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: rgba(201, 164, 92, 0.08);
  font-size: 0.95rem;
  color: var(--text);
}

.reservation em {
  color: var(--text-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.3rem 1.4rem;
  transition: border-color 0.25s ease;
}

.card:hover {
  border-color: var(--line-strong);
}

.card--past {
  opacity: 0.55;
  transition: opacity 0.25s ease;
}

.card--past:hover {
  opacity: 1;
}

.card-photos {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--gold-bright);
}

.card-photos:hover {
  color: var(--text);
}

.card-date {
  flex: 0 0 3.6rem;
  text-align: center;
  border-right: 1px solid var(--line);
  padding-right: 1.1rem;
}

/* "Save the date" numbers cycle through the poster palette */
.card-day {
  display: block;
  font-family: var(--font-display);
  font-size: 1.9rem;
  line-height: 1;
  color: var(--gold-bright);
}

.card:nth-child(4n + 1) .card-day {
  color: var(--c-magenta);
}

.card:nth-child(4n + 2) .card-day {
  color: var(--c-orange);
}

.card:nth-child(4n + 3) .card-day {
  color: var(--c-blue);
}

.card:nth-child(4n + 4) .card-day {
  color: var(--gold-bright);
}

.card-month {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 0.3rem;
}

.card h4 {
  font-size: 1.15rem;
  margin-bottom: 0.2rem;
}

.card p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 760px) {
  .featured {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
