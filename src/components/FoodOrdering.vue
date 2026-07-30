<script setup>
defineProps({
  food: { type: Object, required: true },
})
</script>

<template>
  <div id="food" class="food">
    <h4 class="food-title">Want to order food?</h4>
    <p class="food-intro">
      We have partnered with <strong>{{ food.partner }}</strong> to offer
      empanadas at this event: {{ food.price }} per set of three, served
      between {{ food.servedWindow }}. Pre-order and pre-pay only (Tikkie) —
      ordering is a <strong>two-step</strong> process.
    </p>
    <p class="food-disclaimer">
      For each order of three empanadas you have to complete the process again.
    </p>

    <div class="food-steps">
      <article class="food-step">
        <span class="food-step-badge food-step-badge--magenta">1</span>
        <h5>Order</h5>
        <p>
          Fill in the order form — then come back here for step two, because
          your order is not complete until it is paid.
        </p>
        <a :href="food.formUrl" target="_blank" rel="noopener" class="btn btn--gold">
          Order here ↗
        </a>
        <p class="food-nb">
          NB: an order is only final once payment has been received. Order and
          pay before {{ food.deadline }}.
        </p>
      </article>

      <article class="food-step">
        <span class="food-step-badge food-step-badge--blue">2</span>
        <h5>Pay</h5>
        <p>
          Completed the order form? Then pay by Tikkie using the QR code on
          our payment page.
        </p>
        <a href="pay/" class="btn btn--ghost">Pay by Tikkie here</a>
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
