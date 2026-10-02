const KEY = 'gandini:theme'

let dark = $state(false)

function apply() {
  document.documentElement.classList.toggle('dark', dark)
}

export const theme = {
  get dark() {
    return dark
  },

  init() {
    let saved = null
    try {
      saved = localStorage.getItem(KEY)
    } catch {}

    dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    apply()
  },

  toggle() {
    dark = !dark
    apply()
    try {
      localStorage.setItem(KEY, dark ? 'dark' : 'light')
    } catch {}
  }
}
