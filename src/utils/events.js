import { lang } from '../i18n/index.js'

const monthNames = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  nl: [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ],
}

const dayNames = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  nl: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
}

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(iso) {
  const date = parseDate(iso)
  const day = dayNames[lang.value][date.getDay()]
  const month = monthNames[lang.value][date.getMonth()]
  return `${day} ${date.getDate()} ${month} ${date.getFullYear()}`
}

export function formatShort(iso) {
  const date = parseDate(iso)
  return `${date.getDate()} ${monthNames[lang.value][date.getMonth()]}`
}

export function monthLabel(iso) {
  const date = parseDate(iso)
  return monthNames[lang.value][date.getMonth()]
}

export function dayNumber(iso) {
  return parseDate(iso).getDate()
}

// An event counts as past only after its night is over
export function isPast(iso, now = new Date()) {
  const end = parseDate(iso)
  end.setDate(end.getDate() + 1)
  return now >= end
}

export function nextEvent(events, now = new Date()) {
  return sortByDate(events).find((e) => !isPast(e.date, now)) ?? null
}

export function sortByDate(events) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date))
}
