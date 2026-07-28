<script setup>
const props = defineProps({
  seed: { type: Number, default: 1 },
  count: { type: Number, default: 6 },
})

const colors = [
  'var(--gold)',
  'var(--c-magenta)',
  'var(--c-orange)',
  'var(--c-blue)',
  'var(--gold-bright)',
  'var(--c-purple)',
]

// Deterministic pseudo-random values so every render (and build) is identical
const rand = (i, n) => (((props.seed * 41 + i * 67 + n * 29) * 13) % 100) / 100

const lights = Array.from({ length: props.count }, (_, i) => ({
  left: `${Math.round(rand(i, 1) * 94)}%`,
  top: `${Math.round(rand(i, 2) * 88)}%`,
  size: `${Math.round(36 + rand(i, 3) * 88)}px`,
  background: colors[(props.seed + i) % colors.length],
  opacity: (0.1 + rand(i, 4) * 0.3).toFixed(2),
  animationDuration: `${10 + Math.round(rand(i, 5) * 8)}s`,
  animationDelay: `-${Math.round(rand(i, 6) * 9)}s`,
}))
</script>

<template>
  <div class="bokeh-layer" aria-hidden="true">
    <span
      v-for="(light, i) in lights"
      :key="i"
      :style="{
        left: light.left,
        top: light.top,
        width: light.size,
        height: light.size,
        background: light.background,
        opacity: light.opacity,
        animationDuration: light.animationDuration,
        animationDelay: light.animationDelay,
      }"
    ></span>
  </div>
</template>

<style scoped>
.bokeh-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bokeh-layer span {
  position: absolute;
  border-radius: 50%;
  filter: blur(14px);
  animation: bokeh-drift 12s ease-in-out infinite alternate;
}

@keyframes bokeh-drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-20px, 24px) scale(1.12);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bokeh-layer span {
    animation: none;
  }
}
</style>
