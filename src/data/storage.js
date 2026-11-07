const PREFIX = 'menuDemo:'

export function read(key, fallback = null) {
  try {
    const v = localStorage.getItem(PREFIX + key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    throw new Error('STORAGE_FULL')
  }
}