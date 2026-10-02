/** SQLite CURRENT_TIMESTAMP gives "YYYY-MM-DD HH:MM:SS" in UTC with no zone marker. */
export function parseDate(value) {
  if (!value) return null
  let s = String(value)
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
    s = s.replace(' ', 'T') + 'Z'
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(value, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  const d = parseDate(value)
  return d ? new Intl.DateTimeFormat('id-ID', options).format(d) : ''
}

const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })
const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60]
]

export function timeAgo(value) {
  const d = parseDate(value)
  if (!d) return ''
  const diff = (d.getTime() - Date.now()) / 1000
  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit)
  }
  return 'baru saja'
}

export function excerpt(text = '', max = 150) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : clean.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

export function readingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function paragraphs(text = '') {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function slugify(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export const ROLE_LABELS = {
  STUDENT: 'Siswa',
  TEACHER: 'Guru',
  ADMIN: 'Admin'
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role ?? ''
}

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

/** Stable hue (0-359) from any string. */
export function hueFor(seed) {
  return hash(seed) % 360
}

/** Articles have no images, so every one gets a stable generated cover. */
export function coverGradient(seed) {
  const h = hueFor(seed)
  return `linear-gradient(135deg, oklch(0.64 0.17 ${h}), oklch(0.42 0.19 ${(h + 45) % 360}))`
}
