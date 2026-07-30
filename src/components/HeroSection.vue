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
    <div class="bokeh" aria-hidden="true">
      <span v-for="n in 8" :key="n"></span>
    </div>

    <div class="container hero-content">
      <p class="hero-eyebrow">{{ site.name }} presents</p>
      <h1 class="hero-title">Alma <em>del</em> Sur</h1>
      <p class="hero-sub">
        Six Sundays of tango — milongas with live music, performances,
        visual art and classes at the {{ site.venue.name }}, Amsterdam.
      </p>

      <div class="hero-actions">
        <a href="#agenda" class="btn btn--gold">See the agenda</a>
        <a href="#alma-del-sur" class="btn btn--ghost">About the project</a>
      </div>

      <p v-if="next" class="hero-next">
        <span class="hero-next-label">Next event</span>
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

/* Festive light spots in the night, in the poster palette */
.bokeh {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bokeh span {
  position: absolute;
  border-radius: 50%;
  filter: blur(14px);
  animation: bokeh-drift 11s ease-in-out infinite alternate;
}

.bokeh span:nth-child(1) { width: 130px; height: 130px; top: 12%; left: 68%; background: var(--gold); opacity: 0.32; animation-duration: 13s; }
.bokeh span:nth-child(2) { width: 70px; height: 70px; top: 24%; left: 84%; background: var(--c-magenta); opacity: 0.3; animation-delay: -3s; }
.bokeh span:nth-child(3) { width: 95px; height: 95px; top: 58%; left: 76%; background: var(--c-orange); opacity: 0.26; animation-duration: 15s; animation-delay: -6s; }
.bokeh span:nth-child(4) { width: 55px; height: 55px; top: 8%; left: 38%; background: var(--c-blue); opacity: 0.22; animation-duration: 12s; animation-delay: -2s; }
.bokeh span:nth-child(5) { width: 42px; height: 42px; top: 40%; left: 92%; background: var(--gold-bright); opacity: 0.35; animation-duration: 10s; animation-delay: -8s; }
.bokeh span:nth-child(6) { width: 85px; height: 85px; top: 74%; left: 12%; background: var(--c-magenta); opacity: 0.18; animation-duration: 16s; animation-delay: -5s; }
.bokeh span:nth-child(7) { width: 48px; height: 48px; top: 16%; left: 12%; background: var(--c-orange); opacity: 0.22; animation-duration: 14s; animation-delay: -9s; }
.bokeh span:nth-child(8) { width: 60px; height: 60px; top: 66%; left: 56%; background: var(--c-blue); opacity: 0.16; animation-duration: 12s; animation-delay: -4s; }

@keyframes bokeh-drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-22px, 26px) scale(1.15);
  }
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

  .hero-scroll span,
  .bokeh span {
    animation: none;
  }
}
</style>
