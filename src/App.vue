<script setup>
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import AlmaSection from './components/AlmaSection.vue'
import AgendaSection from './components/AgendaSection.vue'
import InfoSection from './components/InfoSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useReveal } from './composables/useReveal.js'

useReveal()
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
