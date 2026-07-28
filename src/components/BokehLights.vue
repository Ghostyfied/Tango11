<script setup>
const props = defineProps({
  seed: { type: Number, default: 1 },
  count: { type: Number, default: 6 },
  // scatter | diagonal | edges | corners | arc
  pattern: { type: String, default: 'scatter' },
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

// Each pattern returns a base {left, top} in % for light i of count
function place(i) {
  const t = props.count > 1 ? i / (props.count - 1) : 0.5
  switch (props.pattern) {
    case 'diagonal':
      // a loose band flowing from top-left to bottom-right
      return {
        left: t * 88 + (rand(i, 1) - 0.5) * 14,
        top: t * 78 + (rand(i, 2) - 0.5) * 18,
      }
    case 'edges': {
      // hugging the left and right margins, middle stays clear
      const side = i % 2
      return {
        left: side === 0 ? rand(i, 1) * 16 : 78 + rand(i, 1) * 16,
        top: t * 86 + (rand(i, 2) - 0.5) * 10,
      }
    }
    case 'corners': {
      // small clusters in the four corners
      const corner = i % 4
      return {
        left: (corner % 2 === 0 ? 6 : 82) + (rand(i, 1) - 0.5) * 18,
        top: (corner < 2 ? 8 : 74) + (rand(i, 2) - 0.5) * 18,
      }
    }
    case 'arc':
      // a gentle arc sweeping down through the middle and back up
      return {
        left: t * 90 + (rand(i, 1) - 0.5) * 8,
        top: 8 + Math.sin(t * Math.PI) * 58 + (rand(i, 2) - 0.5) * 12,
      }
    default:
      // scatter
      return { left: rand(i, 1) * 94, top: rand(i, 2) * 88 }
  }
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const lights = Array.from({ length: props.count }, (_, i) => {
  const pos = place(i)
  return {
    left: `${Math.round(clamp(pos.left, 0, 94))}%`,
    top: `${Math.round(clamp(pos.top, 0, 88))}%`,
    size: `${Math.round(36 + rand(i, 3) * 88)}px`,
    background: colors[(props.seed + i) % colors.length],
    opacity: (0.2 + rand(i, 4) * 0.4).toFixed(2),
    animationDuration: `${10 + Math.round(rand(i, 5) * 8)}s`,
    animationDelay: `-${Math.round(rand(i, 6) * 9)}s`,
  }
})
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
