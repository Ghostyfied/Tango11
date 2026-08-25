<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import site from '../data/site.json'

// base is '' on the main page and '../' on subpages like /gallery/
const props = defineProps({
  base: { type: String, default: '' },
})

const links = computed(() => [
  { href: `${props.base}#alma-del-sur`, label: 'Alma del Sur' },
  { href: `${props.base}#agenda`, label: 'Agenda' },
  { href: `${props.base}gallery/`, label: 'Gallery' },
  { href: `${props.base}#info`, label: 'Info' },
  { href: `${props.base}#contact`, label: 'Contact' },
])

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="nav" :class="{ 'nav--solid': scrolled || menuOpen }">
    <div class="container nav-inner">
      <a :href="`${props.base}#top`" class="brand" @click="menuOpen = false">
        Tango <span>11</span>
      </a>

      <nav class="nav-links" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <a v-for="link in links" :key="link.href" :href="link.href" @click="menuOpen = false">
          {{ link.label }}
        </a>
        <a :href="site.links.sonando" target="_blank" rel="noopener" class="nav-external">
          Soñando&thinsp;↗
        </a>
      </nav>

      <button
        class="nav-toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span :class="{ 'is-open': menuOpen }"></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--nav-height);
  transition: background 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;
}

.nav--solid {
  background: rgba(14, 11, 9, 0.92);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--line);
}

.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.brand {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text);
}

.brand span {
  color: var(--gold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.nav-links a:hover {
  color: var(--gold-bright);
}

.nav-external {
  color: var(--gold) !important;
}

.nav-toggle {
  display: none;
  background: none;
  border: 0;
  padding: 0.75rem 0;
  cursor: pointer;
}

.nav-toggle span,
.nav-toggle span::before,
.nav-toggle span::after {
  content: '';
  display: block;
  width: 26px;
  height: 2px;
  background: var(--gold);
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.nav-toggle span {
  position: relative;
}

.nav-toggle span::before {
  position: absolute;
  top: -8px;
}

.nav-toggle span::after {
  position: absolute;
  top: 8px;
}

.nav-toggle span.is-open {
  transform: rotate(45deg);
}

.nav-toggle span.is-open::before {
  transform: rotate(-90deg) translateX(-8px);
}

.nav-toggle span.is-open::after {
  opacity: 0;
}

@media (max-width: 760px) {
  .nav-toggle {
    display: block;
  }

  .nav-links {
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: rgba(14, 11, 9, 0.97);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-links.is-open {
    max-height: 22rem;
  }

  .nav-links a {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--line);
  }
}
</style>
