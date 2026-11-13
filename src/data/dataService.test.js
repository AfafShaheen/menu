import { beforeEach, describe, expect, it } from 'vitest'
import * as db from './dataService'

beforeEach(async () => {
  localStorage.clear()
  await db.init()
})

describe('seed', () => {
  it('بيعبّي البيانات الأولية مرة وحدة بس', async () => {
    const before = (await db.getItems()).length
    expect(before).toBeGreaterThan(10)
    await db.deleteItem('item_tea')
    await db.init() // ما لازم يرجّع المحذوف
    expect((await db.getItems()).length).toBe(before - 1)
  })

  it('resetDemo بيرجّع البيانات الأصلية', async () => {
    const before = (await db.getItems()).length
    await db.deleteItem('item_tea')
    await db.resetDemo()
    expect((await db.getItems()).length).toBe(before)
  })
})

describe('migration', () => {
  const base = import.meta.env.BASE_URL

  it('بيحوّل صور الديمو القديمة JPG إلى WebP وبيحافظ على تعديلات الأدمن', async () => {
    localStorage.setItem('menuDemo:dataVersion', '1')
    const items = JSON.parse(localStorage.getItem('menuDemo:items'))
    const tea = items.find((i) => i.id === 'item_tea')
    const kibbeh = items.find((i) => i.id === 'item_kibbeh')
    tea.image = null // صنف كان بدون صورة
    tea.price = 77 // تعديل من الأدمن
    kibbeh.image = `${base}demo/kibbeh.jpg` // مسار قديم
    const mine = items.find((i) => i.id === 'item_hummus')
    mine.image = 'data:image/webp;base64,AAAA' // صورة رفعها الأدمن
    localStorage.setItem('menuDemo:items', JSON.stringify(items))

    await db.init()

    const after = Object.fromEntries((await db.getItems()).map((i) => [i.id, i]))
    expect(after.item_kibbeh.image).toBe(`${base}demo/kibbeh.webp`)
    expect(after.item_tea.image).toBe(`${base}demo/tea.webp`)
    expect(after.item_tea.price).toBe(77)
    expect(after.item_hummus.image).toBe('data:image/webp;base64,AAAA')
    expect(JSON.parse(localStorage.getItem('menuDemo:dataVersion'))).toBe(db.DATA_VERSION)
  })

  it('ما بيعيد الترحيل إذا النسخة محدّثة', async () => {
    const items = JSON.parse(localStorage.getItem('menuDemo:items'))
    items.find((i) => i.id === 'item_tea').image = null
    localStorage.setItem('menuDemo:items', JSON.stringify(items))
    await db.init()
    expect((await db.getItem('item_tea')).image).toBeNull()
  })

  it('fixDemoImage بيلمس صور الديمو بس', () => {
    expect(db.fixDemoImage('/menu/demo/a-b.jpg')).toBe('/menu/demo/a-b.webp')
    expect(db.fixDemoImage('https://x.com/photo.jpg')).toBe('https://x.com/photo.jpg')
    expect(db.fixDemoImage(null)).toBeNull()
  })
})

describe('items', () => {
  it('saveItem بيعطي id وبيحوّل السعر لرقم', async () => {
    const saved = await db.saveItem({ categoryId: 'cat_drinks', nameAr: 'عصير', price: '15' })
    expect(saved.id).toMatch(/^item_/)
    expect(saved.price).toBe(15)
    expect(saved.available).toBe(true)
    expect((await db.getItem(saved.id)).nameAr).toBe('عصير')
  })

  it('updateItem بيعدّل حقل وبيضل الباقي', async () => {
    await db.updateItem('item_tea', { available: false })
    const it = await db.getItem('item_tea')
    expect(it.available).toBe(false)
    expect(it.nameAr).toBe('شاي')
  })

  it('updateItem على صنف غير موجود بيرمي خطأ', async () => {
    await expect(db.updateItem('nope', { price: 1 })).rejects.toThrow('ITEM_NOT_FOUND')
  })

  it('getItems بيفلتر بالقسم وبالمميز', async () => {
    const drinks = await db.getItems({ categoryId: 'cat_drinks' })
    expect(drinks.length).toBeGreaterThan(0)
    expect(drinks.every((i) => i.categoryId === 'cat_drinks')).toBe(true)
    const featured = await db.getItems({ featured: true })
    expect(featured.every((i) => i.featured)).toBe(true)
  })

  it('duplicateItem بينسخ الصنف باسم جديد وid جديد', async () => {
    const copy = await db.duplicateItem('item_hummus')
    expect(copy.id).not.toBe('item_hummus')
    expect(copy.nameAr).toBe('حمص بالطحينة (نسخة)')
    expect(copy.nameEn).toBe('Hummus (copy)')
    expect(copy.price).toBe(25)
  })

  it('bulkAdjustPrices بيطبق النسبة على قسم أو على الكل', async () => {
    const teaBefore = (await db.getItem('item_tea')).price
    const hummusBefore = (await db.getItem('item_hummus')).price
    await db.bulkAdjustPrices(10, 'cat_drinks')
    expect((await db.getItem('item_tea')).price).toBe(Math.round(teaBefore * 1.1))
    expect((await db.getItem('item_hummus')).price).toBe(hummusBefore)
    await db.bulkAdjustPrices(-50)
    expect((await db.getItem('item_hummus')).price).toBe(Math.round(hummusBefore * 0.5))
  })
})

describe('categories', () => {
  it('حذف قسم بيحذف أصنافه', async () => {
    expect((await db.getItems({ categoryId: 'cat_drinks' })).length).toBeGreaterThan(0)
    await db.deleteCategory('cat_drinks')
    expect(await db.getItems({ categoryId: 'cat_drinks' })).toEqual([])
    expect((await db.getCategories()).some((c) => c.id === 'cat_drinks')).toBe(false)
  })

  it('reorderCategories بيغيّر الترتيب', async () => {
    const ids = (await db.getCategories()).map((c) => c.id)
    const reversed = [...ids].reverse()
    await db.reorderCategories(reversed)
    expect((await db.getCategories()).map((c) => c.id)).toEqual(reversed)
  })
})

describe('slides', () => {
  it('الحد الأقصى 10 شرائح', async () => {
    const many = Array.from({ length: 11 }, (_, i) => ({ image: null, titleAr: `s${i}` }))
    await expect(db.saveSlides(many)).rejects.toThrow('MAX_SLIDES')
  })

  it('بيرقّم الشرائح بحسب ترتيب المصفوفة', async () => {
    const slides = await db.getSlides()
    await db.saveSlides([...slides].reverse())
    const after = await db.getSlides()
    expect(after.map((s) => s.id)).toEqual([...slides].reverse().map((s) => s.id))
    expect(after.map((s) => s.order)).toEqual(after.map((_, i) => i + 1))
  })
})

describe('settings', () => {
  it('saveSettings بيدمج مع الموجود', async () => {
    await db.saveSettings({ whatsapp: '963999000111' })
    const s = await db.getSettings()
    expect(s.whatsapp).toBe('963999000111')
    expect(s.nameAr).toBe('سفرة')
  })
})

describe('backup', () => {
  it('تصدير ثم استرجاع بيرجّع نفس البيانات', async () => {
    await db.updateItem('item_tea', { price: 99 })
    const backup = await db.exportData()
    expect(db.validateBackup(backup)).toBe(true)

    await db.resetDemo()
    expect((await db.getItem('item_tea')).price).not.toBe(99)

    await db.importData(JSON.parse(JSON.stringify(backup)))
    expect((await db.getItem('item_tea')).price).toBe(99)
  })

  it('ملف غلط ما بخرّب البيانات الحالية', async () => {
    const before = (await db.getItems()).length
    const bad = { app: 'menu', categories: [], items: 'x', slides: [] }
    expect(db.validateBackup(bad)).toBe(false)
    expect(db.validateBackup(null)).toBe(false)
    expect(db.validateBackup({ app: 'other', categories: [], items: [], slides: [] })).toBe(false)
    expect(db.validateBackup({ app: 'menu', categories: [{ name: 'بدون id' }], items: [], slides: [] })).toBe(false)
    await expect(db.importData(bad)).rejects.toThrow('INVALID_BACKUP')
    expect((await db.getItems()).length).toBe(before)
  })
})
