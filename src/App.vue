<script setup>
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import AlmaSection from './components/AlmaSection.vue'
import AgendaSection from './components/AgendaSection.vue'
import InfoSection from './components/InfoSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { onMounted } from 'vue'
import { useReveal } from './composables/useReveal.js'

useReveal()

// Deep links like /#food need a scroll after Vue has rendered the content
onMounted(() => {
  const { hash } = window.location
  if (hash.length > 1) {
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }
})
</script>

<template>
  <SiteNav />
  <main>
    <HeroSection />
    <AlmaSection />
    <AgendaSection />
    <InfoSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
