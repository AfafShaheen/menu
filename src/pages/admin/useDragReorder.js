import { useState } from 'react'
import { moveId } from '../../utils/reorder'

// سحب وإفلات بالماوس (للكمبيوتر). على الموبايل بتضل أسهم أعلى/أسفل.
export function useDragReorder(ids, onReorder) {
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const reset = () => { setDragId(null); setOverId(null) }

  const handleProps = (id) => ({
    draggable: true,
    onDragStart: (e) => {
      setDragId(id)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
      const row = e.currentTarget.closest('li')
      if (row) e.dataTransfer.setDragImage(row, 24, 24)
    },
    onDragEnd: reset,
  })

  const rowProps = (id) => ({
    onDragOver: (e) => {
      if (!dragId) return
      e.preventDefault()
      if (overId !== id) setOverId(id)
    },
    onDrop: (e) => {
      e.preventDefault()
      if (dragId && dragId !== id) {
        const next = moveId(ids, dragId, id)
        if (next !== ids) onReorder(next)
      }
      reset()
    },
  })

  return { handleProps, rowProps, dragId, overId }
}
