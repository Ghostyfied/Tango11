<script setup>
import site from '../data/site.json'
import eventsData from '../data/events.json'
import { dayNumber, formatDate, isPast, monthLabel, nextEvent, sortByDate } from '../utils/events.js'
import BokehLights from './BokehLights.vue'

const events = sortByDate(eventsData)
const next = nextEvent(events)
const others = events.filter((e) => e !== next)

// Escape HTML, then turn **text** into <strong> so data entries can bold names
function fmt(text) {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
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
          </li>
        </ol>
        <p v-else class="programme-tba">Full programme to be announced.</p>

        <ul v-if="next.notes?.length" class="notes">
          <li v-for="note in next.notes" :key="note" v-html="fmt(note)"></li>
        </ul>

        <p v-if="next.reservation" class="reservation">
          {{ next.reservation.text }}
          <a v-if="next.reservation.url" :href="next.reservation.url" target="_blank" rel="noopener">
            Reserve here ↗
          </a>
          <em v-else>Reservation link follows soon.</em>
        </p>
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
          </div>
        </article>
      </div>
    </div>
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
  gap: 1.25rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.95rem;
  color: var(--text);
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
  position: relative;
  padding-left: 1.4rem;
  font-size: 0.92rem;
  color: var(--text-muted);
}

.notes li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.notes li:nth-child(3n + 1)::before {
  background: var(--c-magenta);
}

.notes li:nth-child(3n + 2)::before {
  background: var(--c-orange);
}

.notes li:nth-child(3n + 3)::before {
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
  opacity: 0.45;
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
