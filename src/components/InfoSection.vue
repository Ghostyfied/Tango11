<script setup>
import site from '../data/site.json'
import kompaszaalPhoto from '../assets/img/kompaszaal-marijke.jpg'
</script>

<template>
  <section id="info" class="section">
    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">Practical</p>
        <h2 class="section-title">Venue &amp; entrance</h2>
      </div>

      <div class="info-grid">
        <div class="info-cards">
          <article class="info-card" data-reveal>
            <h3>The venue</h3>
            <p>
              <strong>{{ site.venue.name }}</strong><br />
              {{ site.venue.street }}<br />
              {{ site.venue.zipCity }}, {{ site.venue.country }}
            </p>
            <p class="info-links">
              <a :href="site.venue.mapsUrl" target="_blank" rel="noopener">Open in Maps ↗</a>
              <a :href="site.venue.infoUrl" target="_blank" rel="noopener">About the church ↗</a>
            </p>
          </article>

          <article class="info-card" data-reveal>
            <h3>Entrance &amp; payment</h3>
            <p>
              Pay at the door — by card (PIN, SumUp terminal) or in cash.
              No reservation needed.
            </p>
          </article>

          <article class="info-card" data-reveal>
            <h3>Stay up to date</h3>
            <p class="info-links info-links--column">
              <a :href="site.links.facebookPage" target="_blank" rel="noopener">Tango 11 Facebook page ↗</a>
              <a :href="site.links.facebookGroup" target="_blank" rel="noopener">Tango 11 Facebook group ↗</a>
              <a :href="site.links.tangokalender" target="_blank" rel="noopener">Tangokalender ↗</a>
            </p>
          </article>
        </div>

        <figure class="info-photo" data-reveal>
          <img :src="kompaszaalPhoto" alt="Marijke de Vries at a Tango 11 salon" loading="lazy" />
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2rem;
  margin-top: 2.5rem;
  align-items: start;
}

.info-cards {
  display: grid;
  gap: 1.25rem;
}

.info-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.7rem 1.6rem;
}

.info-card h3 {
  font-size: 1.4rem;
  color: var(--gold-bright);
  margin-bottom: 0.7rem;
}

.info-card p {
  color: var(--text-muted);
  margin: 0 0 0.75rem;
}

.info-card p:last-child {
  margin-bottom: 0;
}

.info-card strong {
  color: var(--text);
  font-weight: 500;
}

.info-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.5rem;
  font-size: 0.92rem;
}

.info-links--column {
  flex-direction: column;
}

.info-photo {
  margin: 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
}

.info-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9);
}

@media (max-width: 860px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
