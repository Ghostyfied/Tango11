import { onBeforeUnmount, onMounted } from 'vue'

// Adds .is-revealed to elements marked with [data-reveal] as they scroll into view
export function useReveal(rootRef) {
  let observer

  onMounted(() => {
    const root = rootRef?.value ?? document
    const targets = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'))
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    targets.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
