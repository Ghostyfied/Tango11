import { ref, watchEffect } from 'vue'
import en from './en.js'
import nl from './nl.js'

const dictionaries = { en, nl }
const LANGS = ['en', 'nl']
const STORAGE_KEY = 'tango11-lang'

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (LANGS.includes(fromUrl)) return fromUrl
    const stored = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(stored)) return stored
    if ((navigator.language || '').toLowerCase().startsWith('nl')) return 'nl'
  } catch {
    /* private mode etc. — fall through to the default */
  }
  return 'en'
}

export const lang = ref(initialLang())

export function setLang(value) {
  if (!LANGS.includes(value)) return
  lang.value = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
}

// Look up a dot-separated key in the active dictionary (English fallback),
// interpolating {param} placeholders
export function t(key, params) {
  const lookup = (dict) => key.split('.').reduce((node, part) => node?.[part], dict)
  let text = lookup(dictionaries[lang.value]) ?? lookup(dictionaries.en) ?? key
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, value)
    }
  }
  return text
}

// Data fields may be a plain string or { en, nl }
export function pick(value) {
  if (value && typeof value === 'object') return value[lang.value] ?? value.en ?? ''
  return value ?? ''
}

// Keep <html lang>, title and meta description in sync with the language
export function usePageMeta(pageKey) {
  watchEffect(() => {
    document.documentElement.lang = lang.value
    document.title = t(`meta.${pageKey}.title`)
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(`meta.${pageKey}.desc`))
  })
}
