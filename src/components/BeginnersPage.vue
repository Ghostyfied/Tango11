<script setup>
import BokehLights from './BokehLights.vue'
import poster from '../assets/img/beginnersles_background.jpeg'
</script>

<template>
  <main class="beginners">
    <BokehLights :seed="8" :count="8" />

    <div class="beginners-inner">
      <a href="../" class="beginners-back">← Tango <span>11</span> · Alma del Sur</a>

      <img
        class="beginners-poster"
        :src="poster"
        alt="Beginnerslessen Argentijnse tango — free beginners classes at Alma del Sur. No experience or partner needed. Sunday 16 August 14:00 and Sunday 20 September 18:00, Willem de Zwijgerkerk, Olympiaweg 14, Amsterdam-Zuid. Teachers: Sebastian Coli Bazzini & Julia Ozols."
      />
    </div>
  </main>
</template>

<style scoped>
.beginners {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: 2rem 0 3rem;
}

.beginners-inner {
  position: relative;
  width: min(34rem, 100% - 3rem);
  margin-inline: auto;
}

.beginners-back {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.beginners-back:hover {
  color: var(--gold-bright);
}

.beginners-back span {
  color: var(--gold);
}

.beginners-poster {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--line-strong);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}
</style>
