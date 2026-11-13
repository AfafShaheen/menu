import { describe, expect, it } from 'vitest'
import { normalize, searchItems } from './search'

const cats = [
  { id: 'c1', nameAr: 'مشاوي', nameEn: 'Grills' },
  { id: 'c2', nameAr: 'مقبلات', nameEn: 'Appetizers' },
]
const items = [
  { id: 'a', categoryId: 'c1', nameAr: 'شيش طاووق', nameEn: 'Shish Tawook', descAr: 'صدور دجاج مشوية', descEn: 'Grilled chicken', order: 2 },
  { id: 'b', categoryId: 'c2', nameAr: 'حمص بالطحينة', nameEn: 'Hummus', descAr: 'حمص ناعم', descEn: 'Smooth dip', order: 1 },
  { id: 'c', categoryId: 'c1', nameAr: 'ريش ضأن', nameEn: 'Lamb Ribs', descAr: 'مشوية على الفحم مع شيش', descEn: 'Charcoal', order: 3 },
]

describe('normalize', () => {
  it('بيوحّد الهمزات والتاء المربوطة والياء', () => {
    expect(normalize('أَشْهَى مأكولات')).toBe('اشهي ماكولات')
    expect(normalize('مقبّلات')).toBe('مقبلات')
    expect(normalize('بالطحينة')).toBe('بالطحينه')
    expect(normalize('على')).toBe('علي')
  })

  it('بيتجاهل حالة الأحرف اللاتينية والمسافات الزايدة', () => {
    expect(normalize('  Shish   TAWOOK ')).toBe('shish tawook')
    expect(normalize('Café')).toBe('cafe')
  })
})

describe('searchItems', () => {
  it('بيرجع فاضي إذا البحث فاضي', () => {
    expect(searchItems(items, '   ', cats)).toEqual([])
  })

  it('بيلاقي بالاسم العربي والإنجليزي', () => {
    expect(searchItems(items, 'حمص', cats).map((i) => i.id)).toEqual(['b'])
    expect(searchItems(items, 'lamb', cats).map((i) => i.id)).toEqual(['c'])
  })

  it('بيتجاهل اختلاف الهمزة والتاء المربوطة', () => {
    expect(searchItems(items, 'طحينه', cats).map((i) => i.id)).toEqual(['b'])
    expect(searchItems(items, 'ضان', cats).map((i) => i.id)).toEqual(['c'])
  })

  it('لازم كل الكلمات تتطابق', () => {
    expect(searchItems(items, 'شيش دجاج', cats).map((i) => i.id)).toEqual(['a'])
    expect(searchItems(items, 'حمص دجاج', cats)).toEqual([])
  })

  it('بيبحث بالوصف وباسم القسم', () => {
    expect(searchItems(items, 'فحم', cats).map((i) => i.id)).toEqual(['c'])
    expect(searchItems(items, 'مقبلات', cats).map((i) => i.id)).toEqual(['b'])
  })

  it('المطابقة بالاسم قبل المطابقة بالوصف', () => {
    // "شيش" اسم صنف a، ووصف صنف c
    expect(searchItems(items, 'شيش', cats).map((i) => i.id)).toEqual(['a', 'c'])
  })
})
