import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'menuDemo:cart'
const MAX_QTY = 99
const Ctx = createContext()

// السلة بتنحفظ على جهاز الزبون فقط: { [itemId]: qty }
function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch {}
  }, [lines])

  const add = (id, q = 1) =>
    setLines((l) => ({ ...l, [id]: Math.min((l[id] || 0) + q, MAX_QTY) }))

  const setQty = (id, q) =>
    setLines((l) => {
      const next = { ...l }
      if (q <= 0) delete next[id]
      else next[id] = Math.min(q, MAX_QTY)
      return next
    })

  const remove = (id) => setQty(id, 0)
  const clear = () => setLines({})
  const count = Object.values(lines).reduce((a, b) => a + b, 0)

  return <Ctx.Provider value={{ lines, count, add, setQty, remove, clear }}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
