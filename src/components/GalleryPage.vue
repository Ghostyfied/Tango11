<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import events from '../data/events.json'
import { dayNumber, formatDate, isPast, monthLabel, sortByDate } from '../utils/events.js'
import SiteNav from './SiteNav.vue'
import SiteFooter from './SiteFooter.vue'
import BokehLights from './BokehLights.vue'
import { useReveal } from '../composables/useReveal.js'

useReveal()

// Photos are auto-discovered from src/assets/gallery/<YYYY-MM-DD>/ folders
const photoModules = import.meta.glob('../assets/gallery/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const photosByDate = {}
for (const [path, url] of Object.entries(photoModules)) {
  const match = path.match(/gallery\/([^/]+)\/([^/]+)$/)
  if (!match) continue
  const [, date, filename] = match
  photosByDate[date] ??= []
  photosByDate[date].push({ url, filename })
}
Object.values(photosByDate).forEach((list) => list.sort((a, b) => a.filename.localeCompare(b.filename)))

// One gallery section per past event, newest first; an event without curated
// photos still appears if it has a full-album link
const sections = computed(() => {
  const known = new Set()
  const result = sortByDate(events)
    .filter((e) => isPast(e.date))
    .reverse()
    .map((e) => {
      known.add(e.date)
      return {
        date: e.date,
        title: e.title,
        photos: photosByDate[e.date] ?? [],
        albumUrl: e.photosUrl ?? null,
      }
    })
    .filter((s) => s.photos.length || s.albumUrl)
  // Folders that don't match a known event still show, titled by their date
  for (const [date, photos] of Object.entries(photosByDate)) {
    if (!known.has(date)) result.push({ date, title: formatDate(date), photos, albumUrl: null })
  }
  return result
})

const upcoming = computed(() => sortByDate(events).filter((e) => !isPast(e.date)))

const chipColors = ['magenta', 'orange', 'blue', 'gold']

// Lightbox with previous/next navigation across a section's photos
const lightbox = ref(null)

const current = computed(() => {
  if (!lightbox.value) return null
  const { section, index } = lightbox.value
  return { ...section.photos[index], section, index }
})

function open(section, index) {
  lightbox.value = { section, index }
}

function step(delta) {
  if (!lightbox.value) return
  const { section, index } = lightbox.value
  const count = section.photos.length
  lightbox.value = { section, index: (index + delta + count) % count }
}

watch(lightbox, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

function onKeydown(e) {
  if (!lightbox.value) return
  if (e.key === 'Escape') lightbox.value = null
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <SiteNav base="../" />

  <main id="top" class="section gallery">
    <BokehLights :seed="9" :count="10" pattern="edges" />

    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">Gallery</p>
        <h2 class="section-title">Moments from the salon</h2>
        <p class="section-lead">
          Impressions from the Alma del Sur Sundays at the Willem de
          Zwijgerkerk — and what's still to come.
        </p>
      </div>

      <aside v-if="upcoming.length" class="upcoming" data-reveal>
        <h3 class="upcoming-title">Upcoming Sundays</h3>
        <div class="upcoming-list">
          <a
            v-for="(event, i) in upcoming"
            :key="event.date"
            class="upcoming-chip"
            href="../#agenda"
          >
            <span class="upcoming-day" :class="`upcoming-day--${chipColors[i % chipColors.length]}`">
              {{ dayNumber(event.date) }}
            </span>
            <span class="upcoming-meta">
              <strong>{{ event.title }}</strong>
              {{ monthLabel(event.date) }}
            </span>
          </a>
        </div>
      </aside>

      <section v-for="section in sections" :key="section.date" class="event" data-reveal>
        <header class="event-head">
          <div>
            <h3>{{ section.title }}</h3>
            <p>{{ formatDate(section.date) }}</p>
          </div>
          <a
            v-if="section.albumUrl"
            :href="section.albumUrl"
            target="_blank"
            rel="noopener"
            class="event-album"
          >
            Full album ↗
          </a>
        </header>

        <div v-if="section.photos.length" class="photo-grid">
          <button
            v-for="(photo, i) in section.photos"
            :key="photo.filename"
            type="button"
            class="photo"
            :aria-label="`Show photo ${i + 1} of ${section.title} full-screen`"
            @click="open(section, i)"
          >
            <img :src="photo.url" :alt="`${section.title} — photo ${i + 1}`" loading="lazy" />
          </button>
        </div>
        <p v-else class="event-empty">
          Curated photos follow soon — meanwhile, enjoy the full album.
        </p>
      </section>

      <p v-if="!sections.length" class="event-empty">
        Photos from the first Sundays are coming soon.
      </p>
    </div>
  </main>

  <SiteFooter />

  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="current" class="lightbox" @click.self="lightbox = null">
        <figure>
          <img :src="current.url" :alt="`${current.section.title} — photo ${current.index + 1}`" />
          <figcaption>
            {{ current.section.title }} · {{ current.index + 1 }} / {{ current.section.photos.length }}
          </figcaption>
        </figure>
        <button
          v-if="current.section.photos.length > 1"
          type="button"
          class="lightbox-nav lightbox-nav--prev"
          aria-label="Previous photo"
          @click="step(-1)"
        >
          ‹
        </button>
        <button
          v-if="current.section.photos.length > 1"
          type="button"
          class="lightbox-nav lightbox-nav--next"
          aria-label="Next photo"
          @click="step(1)"
        >
          ›
        </button>
        <button type="button" class="lightbox-close" aria-label="Close photo" @click="lightbox = null">
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gallery {
  padding-top: calc(var(--nav-height) + clamp(2.5rem, 6vw, 4.5rem));
  min-height: 70svh;
}

/* Upcoming events box */
.upcoming {
  margin-top: 2.5rem;
  background: linear-gradient(135deg, var(--surface) 0%, rgba(142, 36, 52, 0.14) 100%);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: 1.5rem 1.6rem;
}

.upcoming-title {
  font-size: 1.4rem;
  color: var(--gold-bright);
  margin-bottom: 1rem;
}

.upcoming-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.75rem;
}

.upcoming-chip {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--text-muted);
}

.upcoming-chip:hover {
  color: var(--text);
}

.upcoming-day {
  font-family: var(--font-display);
  font-size: 1.7rem;
  line-height: 1;
}

.upcoming-day--magenta {
  color: var(--c-magenta);
}

.upcoming-day--orange {
  color: var(--c-orange);
}

.upcoming-day--blue {
  color: var(--c-blue);
}

.upcoming-day--gold {
  color: var(--gold-bright);
}

.upcoming-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.upcoming-meta strong {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--text);
}

/* Per-event gallery sections */
.event {
  margin-top: clamp(3rem, 7vw, 4.5rem);
}

.event-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.9rem;
  margin-bottom: 1.4rem;
}

.event-head h3 {
  font-size: 1.8rem;
}

.event-head p {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.event-album {
  font-size: 0.9rem;
  font-weight: 500;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.9rem;
}

.photo {
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
  cursor: zoom-in;
  aspect-ratio: 1;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease, opacity 0.35s ease;
  opacity: 0.92;
}

.photo:hover img {
  transform: scale(1.06);
  opacity: 1;
}

.event-empty {
  color: var(--text-muted);
  font-style: italic;
}

/* Lightbox (shared look with the agenda one, plus prev/next) */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(14, 11, 9, 0.9);
  backdrop-filter: blur(8px);
  padding: 2rem 4.5rem;
}

.lightbox figure {
  margin: 0;
  text-align: center;
}

.lightbox img {
  max-width: min(64rem, 100%);
  max-height: 82vh;
  border-radius: var(--radius);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.lightbox figcaption {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--gold-bright);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  color: var(--text);
  font-size: 1.9rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.lightbox-nav:hover {
  border-color: var(--gold);
  color: var(--gold-bright);
}

.lightbox-nav--prev {
  left: 1.25rem;
}

.lightbox-nav--next {
  right: 1.25rem;
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

@media (max-width: 600px) {
  .lightbox {
    padding: 1rem;
  }

  .lightbox-nav--prev {
    left: 0.5rem;
  }

  .lightbox-nav--next {
    right: 0.5rem;
  }
}
</style>
