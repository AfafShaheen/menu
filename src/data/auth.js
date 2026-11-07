const DEMO_PASSWORD = 'admin123' // ديمو فقط، مو حماية فعلية
const KEY = 'menuDemo:admin'

export async function login(password) {
  if (password === DEMO_PASSWORD) {
    sessionStorage.setItem(KEY, '1')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export function isLoggedIn() {
  return sessionStorage.getItem(KEY) === '1'
}