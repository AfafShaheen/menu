import { useEffect, useState } from 'react'

export function useData(fn, deps = [], initial = null) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    setLoading(true)
    fn().then((d) => {
      if (alive) { setData(d); setLoading(false) }
    })
    return () => { alive = false }
  }, deps)
  return { data, loading }
}