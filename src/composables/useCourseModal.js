import { ref } from 'vue'

// Shared state so the agenda cards and the homepage promo can open the same
// registration modal (mounted once in App.vue)
export const courseModal = ref(null)

export function openCourseModal(courseId) {
  courseModal.value = courseId
}

export function closeCourseModal() {
  courseModal.value = null
}
