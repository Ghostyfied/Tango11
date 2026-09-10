<script setup>
import { pick, t } from '../i18n/index.js'

const props = defineProps({
  food: { type: Object, required: true },
})

const introHtml = () =>
  t('food.intro', {
    partner: pick(props.food.partner),
    price: pick(props.food.price),
    served: pick(props.food.servedWindow),
  })
</script>

<template>
  <div id="food" class="food">
    <h4 class="food-title">{{ t('food.title') }}</h4>
    <p class="food-intro" v-html="introHtml()"></p>
    <p class="food-disclaimer">{{ t('food.disclaimer') }}</p>

    <div class="food-steps">
      <article class="food-step">
        <span class="food-step-badge food-step-badge--magenta">1</span>
        <h5>{{ t('food.step1Title') }}</h5>
        <p>{{ t('food.step1Text') }}</p>
        <a :href="food.formUrl" target="_blank" rel="noopener" class="btn btn--gold">
          {{ t('food.orderBtn') }}
        </a>
        <p class="food-nb">{{ t('food.nb', { deadline: pick(food.deadline) }) }}</p>
      </article>

      <article class="food-step">
        <span class="food-step-badge food-step-badge--blue">2</span>
        <h5>{{ t('food.step2Title') }}</h5>
        <p>{{ t('food.step2Text') }}</p>
        <a href="pay/" class="btn btn--ghost">{{ t('food.payBtn') }}</a>
      </article>
    </div>
  </div>
</template>

<style scoped>
.food {
  grid-column: 1 / -1;
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
  scroll-margin-top: calc(var(--nav-height) + 1rem);
}

.food-title {
  font-size: 1.5rem;
  color: var(--gold-bright);
  margin-bottom: 0.6rem;
}

.food-intro {
  color: var(--text-muted);
  max-width: 44rem;
  margin-bottom: 1.5rem;
}

.food-intro strong {
  color: var(--text);
  font-weight: 600;
}

.food-disclaimer {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.9rem;
  margin: -0.75rem 0 1.5rem;
}

.food-steps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.food-step {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.6rem 1.5rem;
}

.food-step-badge {
  position: absolute;
  top: -0.9rem;
  left: 1.25rem;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
}

.food-step-badge--magenta {
  background: var(--c-magenta);
}

.food-step-badge--blue {
  background: var(--c-blue);
}

.food-step h5 {
  font-size: 1.2rem;
  margin: 0.2rem 0 0.5rem;
}

.food-step p {
  color: var(--text-muted);
  font-size: 0.92rem;
  margin-bottom: 1.1rem;
}

.food-nb {
  margin: 1.1rem 0 0 !important;
  font-size: 0.85rem !important;
  color: var(--red-bright) !important;
}

@media (max-width: 700px) {
  .food-steps {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
}
</style>
