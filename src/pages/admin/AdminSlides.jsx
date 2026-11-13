import { useState } from 'react'
import { useData } from '../../hooks/useData'
import { getSlides, saveSlides } from '../../data/dataService'
import { BADGE_COLORS } from '../../constants'
import { moveItem } from '../../utils/reorder'
import Img from '../../components/Img'
import { Btn, IconBtn, Modal, PageTitle, SelectField, TextField } from './ui'
import { ImagePicker } from './pickers'
import { useFeedback } from './feedback'
import { useDragReorder } from './useDragReorder'
import { describeError } from './errors'

const MAX = 10
const EMPTY = {
  image: null, badgeAr: '', badgeEn: '', badgeColor: 'primary',
  titleAr: '', titleEn: '', subtitleAr: '', subtitleEn: '',
}

export default function AdminSlides() {
  const [version, setVersion] = useState(0)
  const { data: slides } = useData(getSlides, [version], [])
  const { toast, confirm } = useFeedback()
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }))

  const persist = async (next) => {
    try {
      await saveSlides(next)
      setVersion((v) => v + 1)
      return true
    } catch (e) {
      toast(describeError(e), 'error')
      return false
    }
  }

  const ids = slides.map((s) => s.id)
  const reorder = (nextIds) => persist(nextIds.map((id) => slides.find((s) => s.id === id)))
  const drag = useDragReorder(ids, reorder)
  const move = (i, dir) => reorder(moveItem(ids, i, i + dir))

  const remove = async (s) => {
    const ok = await confirm({ title: 'حذف هذه الشريحة؟', message: 'لا يمكن التراجع.', confirmLabel: 'حذف', danger: true })
    if (ok && (await persist(slides.filter((x) => x.id !== s.id)))) toast('تم حذف الشريحة')
  }

  const save = async () => {
    if (!draft.image) return toast('اختاري صورة للشريحة', 'error')
    setSaving(true)
    const next = draft.id ? slides.map((s) => (s.id === draft.id ? draft : s)) : [...slides, draft]
    const ok = await persist(next)
    setSaving(false)
    if (ok) {
      toast('تم الحفظ')
      setDraft(null)
    }
  }

  return (
    <>
      <PageTitle
        title="السلايدر"
        sub={`${slides.length} من ${MAX} شرائح`}
        action={
          <Btn icon="add" disabled={slides.length >= MAX} onClick={() => setDraft({ ...EMPTY })}>
            جديدة
          </Btn>
        }
      />

      <ul className="flex flex-col gap-space-md">
        {slides.map((s, i) => (
          <li
            key={s.id}
            {...drag.rowProps(s.id)}
            className={`bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition ${
              drag.dragId === s.id ? 'opacity-40' : ''
            } ${drag.overId === s.id && drag.dragId !== s.id ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="relative h-36">
              <Img src={s.image} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <div className="text-title-sm font-bold line-clamp-1">{s.titleAr || s.titleEn}</div>
                <div className="text-body-sm line-clamp-1 opacity-90">{s.subtitleAr || s.subtitleEn}</div>
              </div>
              <span className="absolute top-2 start-2 w-7 h-7 rounded-full bg-inverse-surface/70 text-on-primary text-label-md flex items-center justify-center">
                {i + 1}
              </span>
              <span
                {...drag.handleProps(s.id)}
                title="اسحبي لإعادة الترتيب"
                className="hidden [@media(hover:hover)]:flex absolute top-2 end-2 w-8 h-8 rounded-full bg-inverse-surface/70 text-on-primary items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
              </span>
            </div>
            <div className="flex items-center justify-between px-space-sm py-1">
              <div className="flex">
                <IconBtn icon="keyboard_arrow_up" label="أعلى" disabled={i === 0} onClick={() => move(i, -1)} />
                <IconBtn icon="keyboard_arrow_down" label="أسفل" disabled={i === slides.length - 1} onClick={() => move(i, 1)} />
              </div>
              <div className="flex">
                <IconBtn icon="edit" label="تعديل" onClick={() => setDraft({ ...EMPTY, ...s })} />
                <IconBtn icon="delete" label="حذف" tone="text-error" onClick={() => remove(s)} />
              </div>
            </div>
          </li>
        ))}
        {slides.length === 0 && (
          <li className="text-center text-body-md text-on-surface-variant py-space-xl">ما في شرائح بعد</li>
        )}
      </ul>

      {draft && (
        <Modal title={draft.id ? 'تعديل شريحة' : 'شريحة جديدة'} onClose={() => setDraft(null)} onSave={save} saving={saving}>
          <ImagePicker label="الصورة" value={draft.image} onChange={set('image')} maxSize={1400} />
          <TextField label="العنوان (عربي)" value={draft.titleAr} onChange={set('titleAr')} />
          <TextField label="Title (English)" dir="ltr" value={draft.titleEn} onChange={set('titleEn')} />
          <TextField label="النص الفرعي (عربي)" textarea rows={2} value={draft.subtitleAr} onChange={set('subtitleAr')} />
          <TextField label="Subtitle (English)" textarea rows={2} dir="ltr" value={draft.subtitleEn} onChange={set('subtitleEn')} />
          <TextField label="شارة (عربي)" hint="اختياري" value={draft.badgeAr} onChange={set('badgeAr')} />
          <TextField label="Badge (English)" dir="ltr" value={draft.badgeEn} onChange={set('badgeEn')} />
          <SelectField label="لون الشارة" value={draft.badgeColor} onChange={set('badgeColor')} options={BADGE_COLORS} />
        </Modal>
      )}
    </>
  )
}
