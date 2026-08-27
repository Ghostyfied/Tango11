<script setup>
import site from '../data/site.json'
import sponsorLogo from '../assets/img/logo-amsterdam.png'
import venueLogo from '../assets/img/logo-willem.png'
import muzeLogo from '../assets/img/muze_zuid_logo.jpg'
import BokehLights from './BokehLights.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <BokehLights :seed="6" :count="5" />
    <div class="container footer-grid">
      <div>
        <p class="footer-brand">Tango <span>11</span></p>
        <p class="footer-muted">
          {{ site.venue.name }} · {{ site.venue.street }} ·
          {{ site.venue.zipCity }} · {{ site.venue.country }}
        </p>
      </div>

      <div class="footer-sponsor">
        <p class="footer-muted">Project Alma del Sur is supported by</p>
        <div class="footer-logos">
          <a :href="site.links.sponsor" target="_blank" rel="noopener" class="logo-chip">
            <img :src="sponsorLogo" alt="Gemeente Amsterdam" loading="lazy" />
          </a>
          <a :href="site.venue.infoUrl" target="_blank" rel="noopener" class="logo-chip">
            <img :src="venueLogo" alt="Willem de Zwijgerkerk" loading="lazy" />
          </a>
          <a href="https://www.muzevanzuid.nl" target="_blank" rel="noopener" class="logo-chip">
            <img :src="muzeLogo" alt="Muze van Zuid" loading="lazy" />
          </a>
        </div>
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
  position: relative;
  border-top: 1px solid var(--line);
  padding: 3.5rem 0 2rem;
  background: var(--bg);
}

.footer .container {
  position: relative;
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

.footer-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.7rem;
}

.logo-chip {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  opacity: 0.9;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.logo-chip:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.logo-chip img {
  height: 2.1rem;
  width: auto;
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

  .footer-logos {
    justify-content: flex-start;
  }
}
</style>
