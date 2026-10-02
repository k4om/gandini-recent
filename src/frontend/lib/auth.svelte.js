// Session state (persisted in localStorage). Uses Svelte 5 runes, hence .svelte.js

const TOKEN_KEY = 'gandini:token'
const USER_KEY = 'gandini:user'

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode etc.) */
  }
}

let token = $state(read(TOKEN_KEY))
let user = $state(read(USER_KEY))

export const auth = {
  get token() {
    return token
  },
  get user() {
    return user
  },
  get isLoggedIn() {
    return Boolean(token && user)
  },
  get canWrite() {
    return Boolean(user?.canWrite)
  },
  get isAdmin() {
    return user?.role === 'ADMIN'
  },

  login(newToken, newUser) {
    token = newToken
    user = newUser
    write(TOKEN_KEY, newToken)
    write(USER_KEY, newUser)
  },

  logout() {
    token = null
    user = null
    write(TOKEN_KEY, null)
    write(USER_KEY, null)
  }
}
