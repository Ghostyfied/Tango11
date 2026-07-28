<script setup>
import site from '../data/site.json'
import banner from '../assets/img/alma-banner.jpeg'
import BokehLights from './BokehLights.vue'
</script>

<template>
  <section id="alma-del-sur" class="section">
    <BokehLights :seed="2" :count="10" />
    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">The project</p>
        <h2 class="section-title">Alma del Sur</h2>
        <p class="section-lead">
          Six Sundays in 2026, every third Sunday of the month, the
          {{ site.venue.name }} in Amsterdam turns into a tango salon. Milongas
          and special events — live music and performances, workshops for
          different levels, tango lectures, and an art expo on the theme of
          the embrace, by artists who dance.
        </p>
      </div>

      <figure class="banner" data-reveal>
        <img
          :src="banner"
          alt="Alma del Sur — Tango 11 poster: milongas and special events, workshops for different levels, tango lectures, art expo, live music, performances and much more. Save the dates: 19 July, 16 August, 20 September, 18 October, 15 November, 20 December."
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.banner {
  margin: 3rem auto 0;
  max-width: 40rem;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.45);
}

.banner img {
  width: 100%;
  display: block;
}
</style>
