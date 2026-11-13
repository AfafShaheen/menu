import { useRef, useState } from 'react'
import { uploadImage } from '../../data/image'
import { CATEGORY_ICONS } from '../../data/icons'
import Img from '../../components/Img'
import { Btn, Field } from './ui'
import { useFeedback } from './feedback'

export function ImagePicker({ label, value, onChange, maxSize = 1000 }) {
  const ref = useRef(null)
  const { toast } = useFeedback()
  const [busy, setBusy] = useState(false)

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('اختاري ملف صورة فقط', 'error')
    setBusy(true)
    try {
      onChange(await uploadImage(file, { maxSize }))
    } catch {
      toast('تعذّر قراءة الصورة', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-space-md">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
          <Img src={value} className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-space-sm">
          <input ref={ref} type="file" accept="image/*" onChange={pick} className="hidden" />
          <Btn variant="soft" icon="upload" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? 'جارٍ الرفع...' : 'اختيار صورة'}
          </Btn>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-label-md text-error text-start">
              إزالة الصورة
            </button>
          )}
        </div>
      </div>
    </Field>
  )
}

// شبكة أيقونات جاهزة بدل ما تكتبي اسم الأيقونة يدوياً
export function IconPicker({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-5 gap-space-sm" role="radiogroup" aria-label={label}>
        {CATEGORY_ICONS.map((ic) => {
          const active = value === ic.name
          return (
            <button
              key={ic.name}
              type="button"
              role="radio"
              aria-checked={active}
              title={ic.label}
              onClick={() => onChange(ic.name)}
              className={`h-12 rounded-lg flex items-center justify-center transition ${
                active ? 'bg-primary text-on-primary shadow' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{ic.name}</span>
            </button>
          )
        })}
      </div>
    </Field>
  )
}
