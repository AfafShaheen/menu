// نقل عنصر من مكان لمكان بمصفوفة (بيرجع مصفوفة جديدة)
export function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list
  const next = [...list]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}

// نقل بالـ id: بيحط العنصر مكان العنصر الهدف
export function moveId(ids, dragId, overId) {
  return moveItem(ids, ids.indexOf(dragId), ids.indexOf(overId))
}
