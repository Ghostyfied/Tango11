<script setup>
import { computed, reactive, ref, watch } from 'vue'
import registrations from '../data/registration.json'
import { isPast } from '../utils/events.js'
import { lang, pick, t } from '../i18n/index.js'
import { closeCourseModal, courseModal } from '../composables/useCourseModal.js'

const images = import.meta.glob('../assets/img/*', { eager: true, import: 'default' })
const imgSrc = (name) => (name ? images[`../assets/img/${name}`] : null)

const course = computed(() => (courseModal.value ? registrations[courseModal.value] : null))

// Only the next upcoming lesson is bookable; the full course only while the
// first lesson still lies ahead
const nextLesson = computed(
  () => course.value?.lessons.find((l) => !isPast(l.date) && !l.closed) ?? null,
)
const fullCourseAvailable = computed(
  () =>
    course.value &&
    !course.value.fullCourse.closed &&
    course.value.lessons.length &&
    !isPast(course.value.lessons[0].date),
)
const registrationOpen = computed(
  () => course.value && !course.value.closed && (nextLesson.value || fullCourseAvailable.value),
)

const form = reactive({ partner1: '', partner2: '', email: '', phone: '', choice: 'lesson', honey: '' })
const state = ref('form') // form | submitting | success | error
const validationError = ref(false)

watch(courseModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    state.value = 'form'
    validationError.value = false
    form.partner1 = ''
    form.partner2 = ''
    form.email = ''
    form.phone = ''
    form.choice = nextLesson.value ? 'lesson' : 'course'
    form.honey = ''
  }
})

const chosenOption = computed(() => {
  if (!course.value) return null
  return form.choice === 'course' && fullCourseAvailable.value
    ? course.value.fullCourse
    : nextLesson.value
})

const organiserEmail = () =>
  `${course.value.organiserEmailUser}@${course.value.organiserEmailDomain}`

function registrationSummary() {
  return [
    `Partner 1: ${form.partner1}`,
    `Partner 2: ${form.partner2}`,
    `E-mail: ${form.email}`,
    `Telefoon: ${form.phone || '-'}`,
    `Keuze: ${pick(chosenOption.value.label)} (${chosenOption.value.price} per paar)`,
    `Cursus: ${pick(course.value.title)}`,
  ].join('\n')
}

const mailtoFallback = computed(() => {
  if (!course.value || !chosenOption.value) return '#'
  const subject = encodeURIComponent(`${t('course.mailSubject')} — ${pick(course.value.shortTitle)}`)
  const body = encodeURIComponent(registrationSummary())
  return `mailto:${organiserEmail()}?subject=${subject}&body=${body}`
})

async function submit() {
  if (form.honey) return // spam bot filled the hidden field
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  if (!form.partner1.trim() || !form.partner2.trim() || !emailOk) {
    validationError.value = true
    return
  }
  validationError.value = false
  state.value = 'submitting'
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${organiserEmail()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Inschrijving ${pick(course.value.shortTitle)} — ${form.partner1} & ${form.partner2}`,
        _template: 'table',
        _captcha: 'false',
        Cursus: pick(course.value.title),
        'Partner 1': form.partner1.trim(),
        'Partner 2': form.partner2.trim(),
        'E-mailadres': form.email.trim(),
        Telefoon: form.phone.trim() || '-',
        Keuze: `${pick(chosenOption.value.label)} — ${chosenOption.value.price} per paar`,
        Taal: lang.value,
      }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    state.value = 'success'
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="course" class="course-backdrop" @click.self="closeCourseModal()">
        <div class="course-modal" role="dialog" aria-modal="true" :aria-label="pick(course.title)">
          <button
            type="button"
            class="course-close"
            :aria-label="t('course.closeModal')"
            @click="closeCourseModal()"
          >
            ×
          </button>

          <div class="course-grid">
            <div class="course-main">
          <div class="course-head">
            <div v-if="imgSrc(course.image)" class="course-photo">
              <img :src="imgSrc(course.image)" :alt="pick(course.title)" />
            </div>
            <div v-else class="course-photo course-photo--placeholder" aria-hidden="true">
              <span>L&amp;M</span>
            </div>
            <div>
              <p class="section-eyebrow">{{ t('course.promoEyebrow') }}</p>
              <h3 class="course-title">{{ pick(course.title) }}</h3>
              <p class="course-price">{{ pick(course.priceLine) }}</p>
            </div>
          </div>

          <p class="course-text">{{ pick(course.intro) }}</p>
          <details v-if="course.details?.length" class="course-more">
            <summary>{{ t('course.moreInfo') }}</summary>
            <div v-for="block in course.details" :key="pick(block.heading)" class="course-more-block">
              <h5>{{ pick(block.heading) }}</h5>
              <p class="course-text">{{ pick(block.text) }}</p>
            </div>
          </details>
          <p class="course-text course-schedule">
            <strong>{{ t('course.scheduleTitle') }}:</strong> {{ pick(course.schedule) }}
          </p>

          <!-- Registration closed -->
          <p v-if="!registrationOpen" class="course-closed">{{ t('course.closed') }}</p>

          <!-- Step 1: the form -->
          <form v-else-if="state === 'form' || state === 'submitting'" class="course-form" @submit.prevent="submit">
            <fieldset class="course-choice">
              <legend>{{ t('course.choiceLabel') }}</legend>
              <label v-if="nextLesson">
                <input v-model="form.choice" type="radio" value="lesson" />
                <span>
                  {{ t('course.nextLessonPrefix') }}: {{ pick(nextLesson.label) }}
                  <strong>· {{ t('course.payAmount', { price: nextLesson.price }) }}</strong>
                </span>
              </label>
              <label v-if="fullCourseAvailable">
                <input v-model="form.choice" type="radio" value="course" />
                <span>
                  {{ pick(course.fullCourse.label) }}
                  <strong>· {{ t('course.payAmount', { price: course.fullCourse.price }) }}</strong>
                </span>
              </label>
            </fieldset>

            <div class="course-fields">
              <label>
                <span>{{ t('course.partner1') }} *</span>
                <input v-model="form.partner1" type="text" name="partner1" autocomplete="name" />
              </label>
              <label>
                <span>{{ t('course.partner2') }} *</span>
                <input v-model="form.partner2" type="text" name="partner2" />
              </label>
              <label>
                <span>{{ t('course.email') }} *</span>
                <input v-model="form.email" type="email" name="email" autocomplete="email" />
              </label>
              <label>
                <span>{{ t('course.phone') }}</span>
                <input v-model="form.phone" type="tel" name="phone" autocomplete="tel" />
              </label>
              <!-- Honeypot: invisible to people, tempting for bots -->
              <label class="course-honey" aria-hidden="true">
                <span>Leave this field empty</span>
                <input v-model="form.honey" type="text" name="_honey" tabindex="-1" autocomplete="off" />
              </label>
            </div>

            <p v-if="validationError" class="course-error-inline">{{ t('course.required') }}</p>
            <p class="course-privacy">{{ t('course.privacy') }}</p>

            <button type="submit" class="btn btn--gold" :disabled="state === 'submitting'">
              {{ state === 'submitting' ? t('course.submitting') : t('course.submit') }}
            </button>
          </form>

          <!-- Step 2: success + payment -->
          <div v-else-if="state === 'success'" class="course-result">
            <h4>{{ t('course.successTitle') }}</h4>
            <p>
              {{
                t('course.successText', {
                  names: `${form.partner1} & ${form.partner2}`,
                  choice: pick(chosenOption.label),
                })
              }}
            </p>

            <div class="course-pay">
              <h5>{{ t('course.payTitle') }}</h5>
              <p class="course-pay-amount">{{ t('course.payAmount', { price: chosenOption.price }) }}</p>
              <template v-if="chosenOption.paymentUrl || imgSrc(chosenOption.qrImage)">
                <img
                  v-if="imgSrc(chosenOption.qrImage)"
                  class="course-qr"
                  :src="imgSrc(chosenOption.qrImage)"
                  alt="Payment QR"
                />
                <a
                  v-if="chosenOption.paymentUrl"
                  :href="chosenOption.paymentUrl"
                  target="_blank"
                  rel="noopener"
                  class="btn btn--gold"
                >
                  {{ t('course.payLink', { price: chosenOption.price }) }}
                </a>
                <p class="course-pay-note">{{ t('course.payNames') }}</p>
              </template>
              <p v-else class="course-pay-note">{{ t('course.payFollows') }}</p>
            </div>
          </div>

          <!-- Error state with mailto fallback -->
          <div v-else class="course-result">
            <h4>{{ t('course.errorTitle') }}</h4>
            <p>{{ t('course.errorText') }}</p>
            <div class="course-error-actions">
              <button type="button" class="btn btn--ghost" @click="state = 'form'">←</button>
              <a :href="mailtoFallback" class="btn btn--gold">{{ t('course.errorMail') }}</a>
            </div>
          </div>
            </div>

            <aside v-if="course.details?.length" class="course-aside">
              <p class="course-aside-eyebrow">{{ t('course.aboutTitle') }}</p>
              <div v-for="block in course.details" :key="pick(block.heading)" class="course-more-block">
                <h5>{{ pick(block.heading) }}</h5>
                <p class="course-text">{{ pick(block.text) }}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.course-backdrop {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(14, 11, 9, 0.85);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
}

.course-modal {
  position: relative;
  width: min(36rem, 100%);
  max-height: 88vh;
  overflow-y: auto;
  background: var(--bg-raised);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: clamp(1.5rem, 4vw, 2.25rem);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.course-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  background: none;
  border: 0;
  color: var(--text-muted);
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
}

.course-close:hover {
  color: var(--text);
}

.course-head {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.course-photo {
  flex: 0 0 auto;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--line-strong);
}

.course-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-photo--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--c-magenta), var(--c-purple));
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: #fff;
}

.course-title {
  font-size: 1.6rem;
  margin: 0.2rem 0 0.4rem;
}

.course-price {
  margin: 0;
  font-size: 0.85rem;
  color: var(--gold-bright);
}

.course-text {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.course-schedule strong {
  color: var(--text);
  font-weight: 600;
}

/* Two columns from 900px: registration flow left, course info right */
.course-aside {
  display: none;
}

@media (min-width: 900px) {
  .course-modal {
    width: min(62rem, calc(100vw - 3rem));
  }

  .course-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
    gap: 2.25rem;
  }

  .course-aside {
    display: block;
    border-left: 1px solid var(--line);
    padding-left: 2.25rem;
  }

  .course-more {
    display: none;
  }
}

.course-aside-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0.3rem 0 0;
}

.course-more {
  margin: 0 0 1rem;
}

.course-more summary {
  cursor: pointer;
  color: var(--gold-bright);
  font-size: 0.9rem;
  font-weight: 500;
}

.course-more summary:hover {
  color: var(--text);
}

.course-more-block {
  margin-top: 1rem;
}

.course-more-block h5 {
  font-size: 1.1rem;
  color: var(--gold-bright);
  margin-bottom: 0.35rem;
}

.course-closed {
  margin-top: 1.25rem;
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: rgba(201, 164, 92, 0.08);
  color: var(--text);
}

.course-form {
  margin-top: 1.25rem;
  border-top: 1px solid var(--line);
  padding-top: 1.25rem;
}

.course-choice {
  border: 0;
  margin: 0 0 1.25rem;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}

.course-choice legend {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 0.6rem;
}

.course-choice label {
  display: flex;
  gap: 0.7rem;
  align-items: baseline;
  cursor: pointer;
  color: var(--text-muted);
}

.course-choice input {
  accent-color: var(--c-magenta);
}

.course-choice strong {
  color: var(--gold-bright);
}

.course-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.course-fields label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.course-fields span {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.course-fields input {
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  color: var(--text);
  font: inherit;
  padding: 0.6rem 0.75rem;
}

.course-fields input:focus {
  outline: 2px solid var(--gold);
  outline-offset: 1px;
}

.course-honey {
  position: absolute !important;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.course-privacy {
  margin: 1rem 0;
  font-size: 0.78rem;
  color: var(--text-faint);
}

.course-error-inline {
  margin: 1rem 0 0;
  color: var(--red-bright);
  font-size: 0.9rem;
}

.course-result {
  margin-top: 1.25rem;
  border-top: 1px solid var(--line);
  padding-top: 1.25rem;
}

.course-result h4 {
  font-size: 1.5rem;
  color: var(--gold-bright);
  margin-bottom: 0.6rem;
}

.course-result p {
  color: var(--text-muted);
}

.course-pay {
  margin-top: 1.25rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: rgba(201, 164, 92, 0.08);
  padding: 1.25rem 1.4rem;
}

.course-pay h5 {
  font-size: 1.15rem;
  margin-bottom: 0.4rem;
}

.course-pay-amount {
  color: var(--gold-bright) !important;
  font-weight: 600;
  margin-bottom: 1rem;
}

.course-qr {
  display: block;
  width: min(240px, 100%);
  background: #fff;
  border-radius: var(--radius);
  padding: 0.8rem;
  margin: 0 0 1rem;
  image-rendering: pixelated;
}

.course-pay-note {
  margin: 1rem 0 0;
  font-size: 0.85rem;
}

.course-error-actions {
  display: flex;
  gap: 0.9rem;
  margin-top: 1.25rem;
}

@media (max-width: 540px) {
  .course-fields {
    grid-template-columns: 1fr;
  }

  .course-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
