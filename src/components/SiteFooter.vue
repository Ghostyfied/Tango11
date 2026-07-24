<script setup>
import site from '../data/site.json'
import sponsorLogo from '../assets/img/logo-amsterdam.png'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <p class="footer-brand">Tango <span>11</span></p>
        <p class="footer-muted">
          {{ site.venue.name }} · {{ site.venue.street }} ·
          {{ site.venue.zipCity }} · {{ site.venue.country }}
        </p>
      </div>

      <div class="footer-sponsor">
        <p class="footer-muted">Project Alma del Sur is sponsored by</p>
        <a :href="site.links.sponsor" target="_blank" rel="noopener">
          <img :src="sponsorLogo" alt="Gemeente Amsterdam" loading="lazy" />
        </a>
      </div>
    </div>

    <div class="container footer-bottom">
      <p class="footer-muted">
        © {{ year }} {{ site.name }} · Photography by
        <a href="https://hrum.nl" target="_blank" rel="noopener">Marta Kossakowska</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  padding: 3.5rem 0 2rem;
  background: var(--bg);
}

.footer-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.footer-brand {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.footer-brand span {
  color: var(--gold);
}

.footer-muted {
  color: var(--text-faint);
  font-size: 0.85rem;
  margin: 0;
}

.footer-sponsor {
  text-align: right;
}

.footer-sponsor img {
  width: 11rem;
  margin-top: 0.6rem;
  margin-left: auto;
  opacity: 0.75;
  transition: opacity 0.25s ease;
}

.footer-sponsor a:hover img {
  opacity: 1;
}

.footer-bottom {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.footer-bottom a {
  color: var(--text-muted);
}

.footer-bottom a:hover {
  color: var(--gold-bright);
}

@media (max-width: 600px) {
  .footer-sponsor {
    text-align: left;
  }

  .footer-sponsor img {
    margin-left: 0;
  }
}
</style>
