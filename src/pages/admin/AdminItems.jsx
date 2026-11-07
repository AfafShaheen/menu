import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../../hooks/useData'
import { bulkAdjustPrices, deleteItem, getCategories, getItems, saveItem, updateItem } from '../../data/dataService'
import { formatPrice } from '../../utils/format'
import Img from '../../components/Img'
import {
  BADGE_COLORS, Btn, IconBtn, inputCls, Modal, PageTitle, SelectField, TextField, Toggle, ImagePicker,
} from './ui'

const EMPTY = {
  nameAr: '', nameEn: '', descAr: '', descEn: '', price: '', categoryId: '',
  image: null, available: true, featured: false,
  badgeAr: '', badgeEn: '', badgeColor: 'primary', noteAr: '', noteEn: '',
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

  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pct, setPct] = useState('')
  const [pctCat, setPctCat] = useState('')

  useEffect(() => {
    if (params.get('new') && cats.length) {
      setDraft({ ...EMPTY, categoryId: cats[0].id })
      setParams({}, { replace: true })
    }
  }, [params, cats])

  const catName = (id) => cats.find((c) => c.id === id)?.nameAr || ''
  const list = items.filter(
    (it) =>
      (!catFilter || it.categoryId === catFilter) &&
      (!q || `${it.nameAr} ${it.nameEn}`.toLowerCase().includes(q.toLowerCase()))
  )

  const toggle = async (it, field) => {
    await updateItem(it.id, { [field]: !it[field] })
    reload()
  }

  const remove = async (it) => {
    if (!window.confirm(`حذف "${it.nameAr || it.nameEn}"؟ لا يمكن التراجع.`)) return
    await deleteItem(it.id)
    reload()
  }

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) return alert('أدخلي اسم الصنف')
    if (draft.price === '' || Number(draft.price) < 0) return alert('أدخلي سعراً صحيحاً')
    setSaving(true)
    await saveItem(draft)
    setSaving(false)
    setDraft(null)
    reload()
  }

  const applyPct = async () => {
    const p = Number(pct)
    if (!p) return alert('أدخلي نسبة مئوية، مثل 10 أو -5')
    const scope = pctCat ? `قسم "${catName(pctCat)}"` : 'كل الأصناف'
    if (!window.confirm(`تغيير الأسعار بنسبة ${p}% على ${scope}؟`)) return
    await bulkAdjustPrices(p, pctCat || null)
    setPct('')
    reload()
  }

  return (
    <>
      <PageTitle
        title="الأصناف"
        sub={`${items.length} صنف`}
        action={
          <Btn icon="add" onClick={() => setDraft({ ...EMPTY, categoryId: catFilter || cats[0]?.id || '' })}>
            جديد
          </Btn>
        }
      />

      <div className="flex gap-space-sm pb-space-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي عن صنف..."
          aria-label="بحث"
          className={inputCls}
        />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={`${inputCls} max-w-[40%]`} aria-label="القسم">
          <option value="">كل الأقسام</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr || c.nameEn}
            </option>
          ))}
        </select>
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
                <IconBtn icon="edit" label="تعديل" onClick={() => setDraft({ ...it })} />
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
