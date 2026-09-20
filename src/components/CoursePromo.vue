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
        <button type="button" class="promo-open" @click="openCourseModal(course.id)">
          <span v-if="imgSrc(course.image)" class="promo-photo">
            <img :src="imgSrc(course.image)" :alt="pick(course.title)" />
          </span>
          <span v-else class="promo-photo promo-photo--placeholder" aria-hidden="true">
            <span>L&amp;M</span>
          </span>
          <span class="promo-body">
            <span class="promo-eyebrow">{{ t('course.promoEyebrow') }}</span>
            <span class="promo-title">{{ pick(course.title) }}</span>
            <span class="promo-price">{{ pick(course.priceLine) }}</span>
          </span>
        </button>
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

/* The photo + text area is one big click target for the modal */
.promo-open {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0;
  background: none;
  border: 0;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.promo-open:hover .promo-title {
  color: var(--gold-bright);
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
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.promo-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-magenta);
}

.promo-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.35rem;
  line-height: 1.2;
  color: var(--text);
  transition: color 0.2s ease;
}

.promo-price {
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
