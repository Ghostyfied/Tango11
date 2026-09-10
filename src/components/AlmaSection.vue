<script setup>
import banner from '../assets/img/alma-banner.jpeg'
import BokehLights from './BokehLights.vue'
import { t } from '../i18n/index.js'
</script>

<template>
  <section id="alma-del-sur" class="section">
    <BokehLights :seed="2" :count="10" pattern="diagonal" />
    <div class="container">
      <div data-reveal>
        <p class="section-eyebrow">{{ t('project.eyebrow') }}</p>
        <h2 class="section-title">Alma del Sur</h2>
        <p class="section-lead">{{ t('project.lead') }}</p>
      </div>

      <figure class="banner" data-reveal>
        <img :src="banner" :alt="t('project.bannerAlt')" />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.banner {
  margin: 3rem auto 0;
  max-width: 56rem;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.45);
}

.banner img {
  width: 100%;
  display: block;
}
</style>
