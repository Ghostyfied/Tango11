<script setup>
import site from '../data/site.json'

const pillars = [
  {
    title: 'Live music & performances',
    text: 'Every night is more than a milonga — orchestras, singers and dancers bring the salon to life under the vaults of the church.',
  },
  {
    title: 'Art & lectures',
    text: 'Visual art and talks that look beyond the cliché, exploring the culture and history behind the tango.',
  },
  {
    title: 'Classes for every level',
    text: 'From a first introduction to special classes with international teachers — everyone is welcome on the floor.',
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
          and special events — live music, performances and much more, sponsored
          by Gemeente Amsterdam.
        </p>
      </div>

      <div class="pillars">
        <article v-for="pillar in pillars" :key="pillar.title" class="pillar" data-reveal>
          <h3>{{ pillar.title }}</h3>
          <p>{{ pillar.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.25rem;
  margin-top: 3rem;
}

.pillar {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.9rem 1.7rem;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.pillar:hover {
  background: var(--surface-hover);
  border-color: var(--line-strong);
}

.pillar h3 {
  font-size: 1.45rem;
  margin-bottom: 0.7rem;
  color: var(--gold-bright);
}

.pillar p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.96rem;
}
</style>
