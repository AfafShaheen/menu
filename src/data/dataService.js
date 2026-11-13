import { read, write } from './storage'
import { getSeed } from './seed'

const MAX_SLIDES = 10
const newId = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

// نسخة شكل البيانات المحفوظة. كل ما زادت، init() بيرحّل البيانات القديمة بدون ما يمسح تعديلات الأدمن.
// 2: صور الديمو صارت WebP (كانت JPG) وانضافت صور لأصناف كانت بدون صورة
export const DATA_VERSION = 2

function writeSeed() {
  const s = getSeed()
  write('categories', s.categories)
  write('items', s.items)
  write('slides', s.slides)
  write('settings', s.settings)
  write('seeded', true)
  write('dataVersion', DATA_VERSION)
}

const DEMO_JPG = /(demo\/[\w-]+)\.jpe?g$/i
export const fixDemoImage = (v) => (typeof v === 'string' ? v.replace(DEMO_JPG, '$1.webp') : v)

// بتصلّح مسارات صور الديمو القديمة، وبتعبّي صورة الصنف الفاضية من الديمو الأصلي (مرة وحدة)
export function migrate(data, seed) {
  const fixImages = (list) => list.map((x) => ({ ...x, image: fixDemoImage(x.image) }))
  const seedImage = Object.fromEntries(seed.items.map((it) => [it.id, it.image]))
  return {
    categories: fixImages(data.categories),
    slides: fixImages(data.slides),
    items: fixImages(data.items).map((it) => (!it.image && seedImage[it.id] ? { ...it, image: seedImage[it.id] } : it)),
    settings: {
      ...data.settings,
      aboutImage: fixDemoImage(data.settings.aboutImage),
      mapImage: fixDemoImage(data.settings.mapImage),
      logo: fixDemoImage(data.settings.logo),
    },
  }
}

export async function init() {
  if (!read('seeded', false)) return writeSeed()
  if (read('dataVersion', 1) < DATA_VERSION) {
    const next = migrate(
      {
        categories: read('categories', []),
        items: read('items', []),
        slides: read('slides', []),
        settings: read('settings', {}),
      },
      getSeed()
    )
    write('categories', next.categories)
    write('items', next.items)
    write('slides', next.slides)
    write('settings', next.settings)
    write('dataVersion', DATA_VERSION)
  }
}

export async function resetDemo() {
  writeSeed()
}

// ---------- الأقسام ----------
export async function getCategories() {
  return read('categories', []).sort(byOrder)
}

export async function saveCategory(cat) {
  const list = read('categories', [])
  const saved = { ...cat, id: cat.id || newId('cat'), order: cat.order ?? list.length + 1 }
  const i = list.findIndex((c) => c.id === saved.id)
  if (i >= 0) list[i] = saved
  else list.push(saved)
  write('categories', list)
  return saved
}

export async function reorderCategories(idsInOrder) {
  const list = read('categories', [])
  idsInOrder.forEach((id, i) => {
    const c = list.find((x) => x.id === id)
    if (c) c.order = i + 1
  })
  write('categories', list)
}

export async function deleteCategory(id) {
  write('categories', read('categories', []).filter((c) => c.id !== id))
  write('items', read('items', []).filter((it) => it.categoryId !== id))
}

// ---------- الأصناف ----------
export async function getItems({ categoryId, featured } = {}) {
  let list = read('items', [])
  if (categoryId) list = list.filter((it) => it.categoryId === categoryId)
  if (featured) list = list.filter((it) => it.featured)
  return list.sort(byOrder)
}

export async function getItem(id) {
  return read('items', []).find((it) => it.id === id) || null
}

export async function saveItem(item) {
  const list = read('items', [])
  const saved = {
    available: true,
    featured: false,
    image: null,
    ...item,
    id: item.id || newId('item'),
    price: Number(item.price) || 0,
    order: item.order ?? list.length + 1,
  }
  const i = list.findIndex((it) => it.id === saved.id)
  if (i >= 0) list[i] = saved
  else list.push(saved)
  write('items', list)
  return saved
}

export async function updateItem(id, patch) {
  const item = await getItem(id)
  if (!item) throw new Error('ITEM_NOT_FOUND')
  return saveItem({ ...item, ...patch })
}

export async function deleteItem(id) {
  write('items', read('items', []).filter((it) => it.id !== id))
}

// زيادة أو نقصان الأسعار بنسبة مئوية، لكل الأصناف أو لقسم محدد
export async function bulkAdjustPrices(percent, categoryId = null) {
  const list = read('items', []).map((it) =>
    !categoryId || it.categoryId === categoryId
      ? { ...it, price: Math.round(it.price * (1 + percent / 100)) }
      : it
  )
  write('items', list)
}

// ---------- السلايدر ----------
export async function getSlides() {
  return read('slides', []).sort(byOrder)
}

export async function saveSlides(slides) {
  if (slides.length > MAX_SLIDES) throw new Error('MAX_SLIDES')
  write('slides', slides.map((s, i) => ({ ...s, id: s.id || newId('slide'), order: i + 1 })))
}

// ---------- الإعدادات ----------
export async function getSettings() {
  return { ...getSeed().settings, ...read('settings', {}) }
}

export async function saveSettings(patch) {
  const next = { ...(await getSettings()), ...patch }
  write('settings', next)
  return next
}
// ---------- نسخ الصنف ----------
export async function duplicateItem(id) {
  const item = await getItem(id)
  if (!item) throw new Error('ITEM_NOT_FOUND')
  const rest = { ...item }
  delete rest.id
  return saveItem({
    ...rest,
    nameAr: rest.nameAr ? `${rest.nameAr} (نسخة)` : '',
    nameEn: rest.nameEn ? `${rest.nameEn} (copy)` : '',
    order: undefined,
  })
}

// ---------- نسخة احتياطية ----------
export const BACKUP_VERSION = 1

export async function exportData() {
  return {
    app: 'menu',
    version: BACKUP_VERSION,
    dataVersion: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    categories: read('categories', []),
    items: read('items', []),
    slides: read('slides', []),
    settings: read('settings', {}),
  }
}

// بتتحقق من شكل الملف قبل ما تكتب أي شي، عشان ملف غلط ما يخرب البيانات الحالية
export function validateBackup(data) {
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
  if (!isObj(data) || data.app !== 'menu') return false
  if (![data.categories, data.items, data.slides].every(Array.isArray)) return false
  if (data.settings !== undefined && !isObj(data.settings)) return false
  const hasId = (list) => list.every((x) => isObj(x) && typeof x.id === 'string')
  return hasId(data.categories) && hasId(data.items) && hasId(data.slides)
}

export async function importData(data) {
  if (!validateBackup(data)) throw new Error('INVALID_BACKUP')
  write('categories', data.categories)
  write('items', data.items)
  write('slides', data.slides)
  write('settings', data.settings || {})
  write('seeded', true)
  // نسخة قديمة بتنرحّل تلقائياً عند أول تحميل (init)
  write('dataVersion', Number(data.dataVersion) || 1)
}
