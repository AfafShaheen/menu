import { describe, expect, it } from 'vitest'
import { moveId, moveItem } from './reorder'

describe('moveItem', () => {
  it('بينقل عنصر لقدام ولورا بدون ما يعدّل المصفوفة الأصلية', () => {
    const a = ['x', 'y', 'z']
    expect(moveItem(a, 0, 2)).toEqual(['y', 'z', 'x'])
    expect(moveItem(a, 2, 0)).toEqual(['z', 'x', 'y'])
    expect(a).toEqual(['x', 'y', 'z'])
  })

  it('بيرجع نفس المصفوفة إذا الحركة غير صالحة', () => {
    const a = ['x', 'y']
    expect(moveItem(a, 0, 0)).toBe(a)
    expect(moveItem(a, 0, 5)).toBe(a)
    expect(moveItem(a, -1, 1)).toBe(a)
  })
})

describe('moveId', () => {
  it('بيحط العنصر مكان العنصر الهدف', () => {
    expect(moveId(['a', 'b', 'c', 'd'], 'a', 'c')).toEqual(['b', 'c', 'a', 'd'])
    expect(moveId(['a', 'b', 'c', 'd'], 'd', 'b')).toEqual(['a', 'd', 'b', 'c'])
  })

  it('id غير موجود ما بغيّر شي', () => {
    const ids = ['a', 'b']
    expect(moveId(ids, 'zzz', 'a')).toBe(ids)
  })
})
