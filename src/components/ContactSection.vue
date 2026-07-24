<script setup>
import { computed } from 'vue'
import site from '../data/site.json'
import portrait from '../assets/img/marijke.png'

// Assembled at runtime to keep the address out of the static HTML for scrapers
const email = computed(() => `${site.contact.emailUser}@${site.contact.emailDomain}`)
</script>

<template>
  <section id="contact" class="section section--raised">
    <div class="container">
      <div class="contact-grid">
        <figure class="portrait" data-reveal>
          <img :src="portrait" :alt="`Portrait of ${site.contact.name}`" loading="lazy" />
        </figure>

        <div data-reveal>
          <p class="section-eyebrow">Contact</p>
          <h2 class="section-title">{{ site.contact.name }}</h2>
          <p class="section-lead">
            {{ site.contact.role }} of {{ site.name }} and Project
            {{ site.project }}. Questions about the nights, the programme or the
            venue? Get in touch.
          </p>

          <ul class="contact-list">
            <li>
              <span>Phone</span>
              <a :href="`tel:${site.contact.phone}`">{{ site.contact.phoneDisplay }}</a>
            </li>
            <li>
              <span>E-mail</span>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </li>
            <li>
              <span>Also by Marijke</span>
              <a :href="site.links.sonando" target="_blank" rel="noopener">
                Soñando Tango Marathon — spring &amp; fall ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;
}

.portrait {
  margin: 0;
  width: clamp(10rem, 22vw, 15rem);
}

.portrait img {
  width: 100%;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  filter: sepia(0.25) saturate(0.9);
}

.contact-list {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.9rem;
}

.contact-list li {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  align-items: baseline;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.9rem;
}

.contact-list span {
  flex: 0 0 8.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}

@media (max-width: 700px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
