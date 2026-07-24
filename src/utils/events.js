const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(iso) {
  const date = parseDate(iso)
  return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

export function formatShort(iso) {
  const date = parseDate(iso)
  return `${date.getDate()} ${monthNames[date.getMonth()]}`
}

export function monthLabel(iso) {
  const date = parseDate(iso)
  return monthNames[date.getMonth()]
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
