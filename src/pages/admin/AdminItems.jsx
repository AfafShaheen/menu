import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../hooks/useData'
import {
  bulkAdjustPrices, deleteItem, duplicateItem, getCategories, getItems, saveItem, updateItem,
} from '../../data/dataService'
import { BADGE_COLORS } from '../../constants'
import { formatPrice } from '../../utils/format'
import { normalize } from '../../utils/search'
import Img from '../../components/Img'
import { Btn, IconBtn, inputCls, Modal, PageTitle, SelectField, TextField, Toggle } from './ui'
import { ImagePicker } from './pickers'
import { useFeedback } from './feedback'
import { describeError } from './errors'

const EMPTY = {
  nameAr: '', nameEn: '', descAr: '', descEn: '', price: '', categoryId: '',
  image: null, available: true, featured: false,
  badgeAr: '', badgeEn: '', badgeColor: 'primary', noteAr: '', noteEn: '',
}

const SORTS = [
  { value: 'order', label: 'الترتيب الافتراضي' },
  { value: 'name', label: 'الاسم' },
  { value: 'priceUp', label: 'السعر: الأقل أولاً' },
  { value: 'priceDown', label: 'السعر: الأعلى أولاً' },
  { value: 'unavailable', label: 'غير المتوفر أولاً' },
]

function sortItems(list, mode) {
  const l = [...list]
  if (mode === 'name') return l.sort((a, b) => (a.nameAr || a.nameEn).localeCompare(b.nameAr || b.nameEn, 'ar'))
  if (mode === 'priceUp') return l.sort((a, b) => a.price - b.price)
  if (mode === 'priceDown') return l.sort((a, b) => b.price - a.price)
  if (mode === 'unavailable') return l.sort((a, b) => Number(a.available) - Number(b.available))
  return l
}

function ItemForm({ draft, setDraft, cats }) {
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }))
  return (
    <>
      <ImagePicker label="صورة الصنف" value={draft.image} onChange={set('image')} />
      <TextField label="الاسم (عربي)" value={draft.nameAr} onChange={set('nameAr')} />
      <TextField label="الاسم (English)" dir="ltr" value={draft.nameEn} onChange={set('nameEn')} />
      <TextField label="الوصف (عربي)" textarea value={draft.descAr} onChange={set('descAr')} />
      <TextField label="الوصف (English)" textarea dir="ltr" value={draft.descEn} onChange={set('descEn')} />
      <div className="grid grid-cols-2 gap-space-md">
        <TextField label="السعر (ل.س)" type="number" inputMode="numeric" min="0" value={draft.price} onChange={set('price')} />
        <SelectField
          label="القسم"
          value={draft.categoryId}
          onChange={set('categoryId')}
          options={cats.map((c) => ({ value: c.id, label: c.nameAr || c.nameEn }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-space-md">
        <TextField label="ملاحظة (عربي)" hint="مثل: يكفي شخصين" value={draft.noteAr} onChange={set('noteAr')} />
        <TextField label="Note (English)" dir="ltr" value={draft.noteEn} onChange={set('noteEn')} />
      </div>
      <div className="grid grid-cols-2 gap-space-md">
        <TextField label="شارة (عربي)" hint="مثل: الأكثر طلباً" value={draft.badgeAr} onChange={set('badgeAr')} />
        <TextField label="Badge (English)" dir="ltr" value={draft.badgeEn} onChange={set('badgeEn')} />
      </div>
      <SelectField label="لون الشارة" value={draft.badgeColor} onChange={set('badgeColor')} options={BADGE_COLORS} />
      <div className="flex items-center justify-between">
        <span className="text-label-lg">متوفر</span>
        <Toggle checked={draft.available} onChange={set('available')} label="متوفر" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-label-lg">صنف مميز (يظهر بالرئيسية)</span>
        <Toggle checked={draft.featured} onChange={set('featured')} label="مميز" />
      </div>
    </>
  )
}

export default function AdminItems() {
  const [version, setVersion] = useState(0)
  const reload = () => setVersion((v) => v + 1)
  const { data: items } = useData(() => getItems(), [version], [])
  const { data: cats } = useData(getCategories, [version], [])
  const { toast, confirm } = useFeedback()

  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [sort, setSort] = useState('order')
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pct, setPct] = useState('')
  const [pctCat, setPctCat] = useState('')

  // رابط /admin/items?new=1 بيفتح نموذج صنف جديد مباشرة
  const wantsNew = params.get('new')
  const firstCat = cats[0]?.id
  useEffect(() => {
    if (wantsNew && firstCat) {
      setDraft({ ...EMPTY, categoryId: firstCat })
      setParams({}, { replace: true })
    }
  }, [wantsNew, firstCat, setParams])

  const catName = (id) => cats.find((c) => c.id === id)?.nameAr || ''
  const list = useMemo(() => {
    const nq = normalize(q)
    const filtered = items.filter(
      (it) =>
        (!catFilter || it.categoryId === catFilter) &&
        (!nq || normalize(`${it.nameAr} ${it.nameEn}`).includes(nq))
    )
    return sortItems(filtered, sort)
  }, [items, q, catFilter, sort])

  const run = async (fn, okMessage) => {
    try {
      await fn()
      if (okMessage) toast(okMessage)
      reload()
    } catch (e) {
      toast(describeError(e), 'error')
    }
  }

  const toggle = (it, field) => run(() => updateItem(it.id, { [field]: !it[field] }))
  const duplicate = (it) => run(() => duplicateItem(it.id), 'تم نسخ الصنف')

  const remove = async (it) => {
    const ok = await confirm({
      title: `حذف "${it.nameAr || it.nameEn}"؟`,
      message: 'لا يمكن التراجع.',
      confirmLabel: 'حذف',
      danger: true,
    })
    if (ok) run(() => deleteItem(it.id), 'تم حذف الصنف')
  }

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) return toast('أدخلي اسم الصنف', 'error')
    if (draft.price === '' || Number(draft.price) < 0) return toast('أدخلي سعراً صحيحاً', 'error')
    setSaving(true)
    try {
      await saveItem(draft)
      toast('تم الحفظ')
      setDraft(null)
      reload()
    } catch (e) {
      toast(describeError(e), 'error')
    } finally {
      setSaving(false)
    }
  }

  const applyPct = async () => {
    const p = Number(pct)
    if (!p) return toast('أدخلي نسبة مئوية، مثل 10 أو -5', 'error')
    const scope = pctCat ? `قسم "${catName(pctCat)}"` : 'كل الأصناف'
    const ok = await confirm({
      title: `تغيير الأسعار بنسبة ${p}%؟`,
      message: `رح يتطبق على ${scope}.`,
      confirmLabel: 'تطبيق',
    })
    if (!ok) return
    await run(() => bulkAdjustPrices(p, pctCat || null), 'تم تعديل الأسعار')
    setPct('')
  }

  return (
    <>
      <PageTitle
        title="الأصناف"
        sub={`${list.length} من ${items.length} صنف`}
        action={
          <Btn icon="add" onClick={() => setDraft({ ...EMPTY, categoryId: catFilter || cats[0]?.id || '' })}>
            جديد
          </Btn>
        }
      />

      <div className="flex flex-col gap-space-sm pb-space-md">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي عن صنف..."
          aria-label="بحث"
          className={inputCls}
        />
        <div className="grid grid-cols-2 gap-space-sm">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={inputCls} aria-label="القسم">
            <option value="">كل الأقسام</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr || c.nameEn}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls} aria-label="الترتيب">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="flex flex-col gap-space-sm">
        {list.map((it) => (
          <li key={it.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex gap-space-md items-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <Img src={it.image} className={`w-full h-full ${it.available ? '' : 'grayscale opacity-60'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-title-sm font-bold truncate">{it.nameAr || it.nameEn}</div>
              <div className="text-label-md text-on-surface-variant truncate">
                {catName(it.categoryId)} · <span className="text-primary">{formatPrice(it.price, 'ar')}</span>
              </div>
              <div className="flex items-center gap-space-xs mt-1">
                <Toggle checked={it.available} onChange={() => toggle(it, 'available')} label="متوفر" />
                <span className="text-label-md text-on-surface-variant">{it.available ? 'متوفر' : 'غير متوفر'}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <IconBtn
                icon={it.featured ? 'star' : 'star_outline'}
                label="تمييز"
                tone={it.featured ? 'text-primary' : ''}
                onClick={() => toggle(it, 'featured')}
              />
              <div className="flex">
                <IconBtn icon="edit" label="تعديل" onClick={() => setDraft({ ...EMPTY, ...it })} />
                <IconBtn icon="content_copy" label="نسخ" onClick={() => duplicate(it)} />
                <IconBtn icon="delete" label="حذف" tone="text-error" onClick={() => remove(it)} />
              </div>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="text-center text-body-md text-on-surface-variant py-space-xl">ما في أصناف مطابقة</li>
        )}
      </ul>

      <section className="mt-space-xl bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md">
        <h2 className="text-title-sm font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[20px]">percent</span>
          تعديل الأسعار بنسبة
        </h2>
        <p className="text-body-sm text-on-surface-variant">اكتبي 10 للزيادة، أو -10 للتخفيض.</p>
        <div className="flex gap-space-sm">
          <input
            type="number"
            dir="ltr"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            placeholder="%"
            aria-label="النسبة"
            className={`${inputCls} max-w-[110px]`}
          />
          <select value={pctCat} onChange={(e) => setPctCat(e.target.value)} className={inputCls} aria-label="النطاق">
            <option value="">كل الأصناف</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr || c.nameEn}
              </option>
            ))}
          </select>
        </div>
        <Btn variant="soft" icon="check" onClick={applyPct}>
          تطبيق
        </Btn>
      </section>

      {draft && (
        <Modal title={draft.id ? 'تعديل صنف' : 'صنف جديد'} onClose={() => setDraft(null)} onSave={save} saving={saving}>
          <ItemForm draft={draft} setDraft={setDraft} cats={cats} />
        </Modal>
      )}
    </>
  )
}
