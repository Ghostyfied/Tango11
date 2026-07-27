<script setup>
import site from '../data/site.json'

const pillars = [
  {
    color: 'magenta',
    title: 'Milongas & special events',
    text: 'Long milongas, mini marathons and festive special editions — every third Sunday of the month.',
  },
  {
    color: 'blue',
    title: 'Live music & performances',
    text: 'Orchestras, singers and dancers bring the salon to life under the vaults of the church.',
  },
  {
    color: 'purple',
    title: 'Workshops, lectures & art expo',
    text: 'Classes for different levels, tango lectures, and an art expo on the theme of the embrace — by artists who dance.',
  },
]
</script>

<template>
  <section id="alma-del-sur" class="section">
    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">The project</p>
        <h2 class="section-title">Alma del Sur</h2>
        <p class="section-lead">
          Six Sunday nights in 2026, every third Sunday of the month, the
          {{ site.venue.name }} in Amsterdam turns into a tango salon. Milongas
          and special events — live music, performances, art and much more.
        </p>
      </div>

      <div class="pillars">
        <article
          v-for="pillar in pillars"
          :key="pillar.title"
          class="pillar"
          :class="`pillar--${pillar.color}`"
          data-reveal
        >
          <h3>{{ pillar.title }}</h3>
          <p>{{ pillar.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The designer's "bolletjes": bold colored circles, as on the posters */
.pillars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3.5rem;
}

.pillar {
  width: min(100%, 19rem);
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.8rem;
  box-shadow: inset 0 -18px 40px rgba(0, 0, 0, 0.18), 0 12px 40px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease;
}

.pillar:hover {
  transform: scale(1.04);
}

.pillar--magenta {
  background: var(--c-magenta);
}

.pillar--blue {
  background: var(--c-blue);
}

.pillar--purple {
  background: var(--c-purple);
}

.pillar h3 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.25;
  color: #fff;
  margin-bottom: 0.7rem;
}

.pillar p {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.92rem;
  line-height: 1.5;
}
</style>
