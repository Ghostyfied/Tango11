<script setup>
import site from '../data/site.json'
import events from '../data/events.json'
import { formatDate, nextEvent } from '../utils/events.js'

const next = nextEvent(events)
</script>

<template>
  <section id="top" class="hero">
    <div class="hero-bg" role="img" aria-label="Couples dancing tango at a milonga at night"></div>
    <div class="hero-overlay"></div>

    <div class="container hero-content">
      <p class="hero-eyebrow">{{ site.name }} presents</p>
      <h1 class="hero-title">Alma <em>del</em> Sur</h1>
      <p class="hero-sub">
        Six Sunday nights of tango — milongas with live music, performances,
        art and classes at the {{ site.venue.name }}, Amsterdam.
      </p>

      <div class="hero-actions">
        <a href="#agenda" class="btn btn--gold">See the agenda</a>
        <a href="#alma-del-sur" class="btn btn--ghost">About the project</a>
      </div>

      <p v-if="next" class="hero-next">
        <span class="hero-next-label">Next night</span>
        {{ formatDate(next.date) }} · every third Sunday of the month
      </p>
    </div>

    <a href="#alma-del-sur" class="hero-scroll" aria-label="Scroll to content">
      <span></span>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url('../assets/img/header.jpg') center 30% / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(14, 11, 9, 0.55) 0%, rgba(14, 11, 9, 0.35) 45%, var(--bg) 100%),
    radial-gradient(ellipse at 30% 60%, rgba(142, 36, 52, 0.28), transparent 65%);
}

.hero-content {
  position: relative;
  padding-top: var(--nav-height);
  animation: hero-in 1s ease both;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.hero-eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: clamp(3.4rem, 11vw, 7.5rem);
  font-weight: 500;
  letter-spacing: 0.01em;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.55);
}

.hero-title em {
  font-style: italic;
  color: var(--gold-bright);
  font-size: 0.62em;
  margin: 0 0.08em;
}

.hero-sub {
  max-width: 34rem;
  font-size: 1.12rem;
  color: var(--text);
  opacity: 0.9;
  margin-bottom: 2.25rem;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.6);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.hero-next {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  border-top: 1px solid var(--line);
  padding-top: 1.25rem;
  margin: 0;
}

.hero-next-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red-bright);
}

.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  transform: translateX(-50%);
  width: 26px;
  height: 42px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.hero-scroll span {
  width: 3px;
  height: 8px;
  border-radius: 3px;
  background: var(--gold);
  animation: scroll-hint 1.8s ease-in-out infinite;
}

@keyframes scroll-hint {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }

  55% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content {
    animation: none;
  }

  .hero-scroll span {
    animation: none;
  }
}
</style>
