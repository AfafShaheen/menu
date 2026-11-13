import { useEffect, useState } from 'react'

// بتجيب بيانات async وبتعيد الجلب لما تتغير deps. loading صحيحة بس عند أول تحميل.
export function useData(fn, deps = [], initial = null) {
  const [state, setState] = useState({ data: initial, loading: true })
  useEffect(() => {
    let alive = true
    fn().then((data) => {
      if (alive) setState({ data, loading: false })
    })
    return () => {
      alive = false
    }
    // fn بتتغير كل render، فالاعتماد الفعلي هو deps اللي بيمرّرها المستدعي
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
