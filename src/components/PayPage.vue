<script setup>
import BokehLights from './BokehLights.vue'
import qr from '../assets/img/tikkie-qr.png'
</script>

<template>
  <main class="pay">
    <BokehLights :seed="7" :count="9" />

    <div class="pay-inner">
      <a href="../" class="pay-back">← Tango <span>11</span> · Alma del Sur</a>

      <section class="pay-card">
        <p class="section-eyebrow">Step 2 · Payment</p>
        <h1 class="pay-title">Pay for your empanadas</h1>

        <p class="pay-text">
          This page is <strong>only</strong> for paying for pre-ordered
          empanadas — please complete the step&nbsp;1 order form on
          <a href="../#food">the agenda page</a> before making a payment.
          Your order is only valid once it has been paid for.
        </p>
        <p class="pay-text">
          Make <strong>one Tikkie payment of €15 per set of three
          empanadas</strong> ordered. All payments must clear by
          <strong>23:59 on Wednesday 12 August</strong>. We apologise that we
          can only accept Tikkie payments at this time.
        </p>

        <figure v-if="qr" class="pay-qr">
          <img :src="qr" alt="Tikkie payment QR code" />
          <figcaption>Scan with your phone's camera or banking app</figcaption>
        </figure>
        <div v-else class="pay-qr pay-qr--placeholder">
          <p>The Tikkie QR code will appear here shortly.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.pay {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.pay-inner {
  position: relative;
  width: min(38rem, 100% - 3rem);
  margin-inline: auto;
}

.pay-back {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.pay-back:hover {
  color: var(--gold-bright);
}

.pay-back span {
  color: var(--gold);
}

.pay-card {
  background: var(--bg-raised);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: clamp(1.75rem, 5vw, 2.75rem);
}

.pay-title {
  font-size: clamp(2rem, 6vw, 2.7rem);
  margin-bottom: 1.25rem;
}

.pay-text {
  color: var(--text-muted);
  font-size: 0.98rem;
}

.pay-text strong {
  color: var(--text);
  font-weight: 600;
}

.pay-qr {
  margin: 2rem 0 0;
  text-align: center;
}

.pay-qr img {
  width: min(310px, 100%);
  margin-inline: auto;
  border-radius: var(--radius);
  background: #fff;
  padding: 1rem;
  /* Keep the QR modules sharp-edged when upscaled */
  image-rendering: pixelated;
}

.pay-qr figcaption {
  margin-top: 0.9rem;
  font-size: 0.85rem;
  color: var(--text-faint);
}

.pay-qr--placeholder {
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius);
  padding: 3.5rem 1.5rem;
  color: var(--text-muted);
  font-style: italic;
}

.pay-qr--placeholder p {
  margin: 0;
}
</style>
