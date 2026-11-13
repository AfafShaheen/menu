import { describe, expect, it } from 'vitest'
import { buildOrderMessage, buildRows, cartTotal, whatsappUrl } from './cart'

const items = [
  { id: 'a', nameAr: 'شيش طاووق', nameEn: 'Shish Tawook', price: 85, available: true },
  { id: 'b', nameAr: 'حمص', nameEn: 'Hummus', price: 25, available: true },
  { id: 'c', nameAr: 'كباب كرز', nameEn: 'Cherry Kebab', price: 110, available: false },
]

const dict = { waOrderTitle: 'طلب جديد', waName: 'الاسم', waNote: 'ملاحظات', total: 'الإجمالي' }
const t = (k) => dict[k] ?? k
const tr = (o, f) => o[`${f}Ar`]

describe('buildRows', () => {
  it('بيتجاهل غير المتوفر والمحذوف والكميات الصفرية', () => {
    const rows = buildRows(items, { a: 2, b: 0, c: 1, ghost: 3 })
    expect(rows.map((r) => [r.item.id, r.qty])).toEqual([['a', 2]])
  })
})

describe('cartTotal', () => {
  it('بيجمع السعر × الكمية', () => {
    const rows = buildRows(items, { a: 2, b: 3 })
    expect(cartTotal(rows)).toBe(2 * 85 + 3 * 25)
  })

  it('السلة الفاضية إجماليها صفر', () => {
    expect(cartTotal([])).toBe(0)
  })
})

describe('buildOrderMessage', () => {
  const rows = buildRows(items, { a: 2, b: 1 })

  it('بيكتب الأصناف والإجمالي', () => {
    const msg = buildOrderMessage({ rows, lang: 'ar', t, tr })
    expect(msg).toContain('طلب جديد')
    expect(msg).toContain('• 2 × شيش طاووق = 170 ل.س')
    expect(msg).toContain('• 1 × حمص = 25 ل.س')
    expect(msg).toContain('الإجمالي: 195 ل.س')
    expect(msg).not.toContain('ملاحظات')
  })

  it('بيضيف الاسم والملاحظات إذا انكتبت', () => {
    const msg = buildOrderMessage({ rows, name: ' سارة ', note: 'بدون ثوم', lang: 'ar', t, tr })
    expect(msg).toContain('الاسم: سارة')
    expect(msg).toContain('ملاحظات: بدون ثوم')
  })
})

describe('whatsappUrl', () => {
  it('بينظّف الرقم وبيرمّز النص', () => {
    const url = whatsappUrl('+963 988-123456', 'مرحبا\nسطر 2')
    expect(url.startsWith('https://wa.me/963988123456?text=')).toBe(true)
    expect(decodeURIComponent(url.split('text=')[1])).toBe('مرحبا\nسطر 2')
  })
})
