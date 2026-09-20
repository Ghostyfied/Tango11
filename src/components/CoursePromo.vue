<script setup>
import registrations from '../data/registration.json'
import { isPast } from '../utils/events.js'
import { pick, t } from '../i18n/index.js'
import { openCourseModal } from '../composables/useCourseModal.js'

const images = import.meta.glob('../assets/img/*', { eager: true, import: 'default' })
const imgSrc = (name) => (name ? images[`../assets/img/${name}`] : null)

// Promoted courses that still have an upcoming lesson; remove by setting
// promo: false in registration.json
const promoted = Object.entries(registrations)
  .filter(([, c]) => c.promo && !c.closed && c.lessons.some((l) => !isPast(l.date)))
  .map(([id, c]) => ({ id, ...c }))
</script>

<template>
  <section v-if="promoted.length" class="promo-strip">
    <div class="container">
      <div v-for="course in promoted" :key="course.id" class="promo" data-reveal>
        <div v-if="imgSrc(course.image)" class="promo-photo">
          <img :src="imgSrc(course.image)" :alt="pick(course.title)" />
        </div>
        <div v-else class="promo-photo promo-photo--placeholder" aria-hidden="true">
          <span>L&amp;M</span>
        </div>
        <div class="promo-body">
          <p class="promo-eyebrow">{{ t('course.promoEyebrow') }}</p>
          <h3>{{ pick(course.title) }}</h3>
          <p class="promo-price">{{ pick(course.priceLine) }}</p>
        </div>
        <button type="button" class="btn btn--gold promo-btn" @click="openCourseModal(course.id)">
          {{ t('course.register') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.promo-strip {
  position: relative;
  padding: 1.75rem 0;
  background: linear-gradient(90deg, rgba(224, 21, 127, 0.16), rgba(143, 63, 151, 0.16));
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.promo {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.promo-photo {
  flex: 0 0 auto;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--line-strong);
}

.promo-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-photo--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--c-magenta), var(--c-purple));
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: #fff;
}

.promo-body {
  flex: 1;
  min-width: 0;
}

.promo-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-magenta);
  margin: 0 0 0.25rem;
}

.promo h3 {
  font-size: 1.35rem;
  margin: 0 0 0.25rem;
}

.promo-price {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.promo-btn {
  flex: 0 0 auto;
}

@media (max-width: 640px) {
  .promo {
    flex-wrap: wrap;
  }

  .promo-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
