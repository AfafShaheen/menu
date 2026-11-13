import { useState } from 'react'
import { useData } from '../../hooks/useData'
import { deleteCategory, getCategories, getItems, reorderCategories, saveCategory } from '../../data/dataService'
import { DEFAULT_ICON } from '../../data/icons'
import { countLabel } from '../../utils/format'
import { moveItem } from '../../utils/reorder'
import Img from '../../components/Img'
import { Btn, IconBtn, Modal, PageTitle, TextField } from './ui'
import { IconPicker, ImagePicker } from './pickers'
import { useFeedback } from './feedback'
import { useDragReorder } from './useDragReorder'
import { describeError } from './errors'

const EMPTY = {
  nameAr: '', nameEn: '', icon: DEFAULT_ICON, image: null,
  descAr: '', descEn: '', introAr: '', introEn: '', tagsAr: '', tagsEn: '',
  bannerTitleAr: '', bannerTitleEn: '', bannerTextAr: '', bannerTextEn: '',
}

export default function AdminCategories() {
  const [version, setVersion] = useState(0)
  const reload = () => setVersion((v) => v + 1)
  const { data: cats } = useData(getCategories, [version], [])
  const { data: items } = useData(() => getItems(), [version], [])
  const { toast, confirm } = useFeedback()
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }))

  const count = (id) => items.filter((i) => i.categoryId === id).length
  const ids = cats.map((c) => c.id)

  const applyOrder = async (nextIds) => {
    try {
      await reorderCategories(nextIds)
      reload()
    } catch (e) {
      toast(describeError(e), 'error')
    }
  }
  const drag = useDragReorder(ids, applyOrder)
  const move = (i, dir) => applyOrder(moveItem(ids, i, i + dir))

  const remove = async (c) => {
    const n = count(c.id)
    const ok = await confirm({
      title: `حذف قسم "${c.nameAr || c.nameEn}"؟`,
      message: n ? `رح يتحذف معه ${countLabel(n, 'ar')}، ولا يمكن التراجع.` : 'لا يمكن التراجع.',
      confirmLabel: 'حذف',
      danger: true,
    })
    if (!ok) return
    await deleteCategory(c.id)
    toast('تم حذف القسم')
    reload()
  }

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) return toast('أدخلي اسم القسم', 'error')
    setSaving(true)
    try {
      await saveCategory(draft)
      toast('تم الحفظ')
      setDraft(null)
      reload()
    } catch (e) {
      toast(describeError(e), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageTitle
        title="الأقسام"
        sub="رتّبي الأقسام بالسحب أو بالأسهم، وهذا الترتيب هو اللي يظهر للزبون"
        action={
          <Btn icon="add" onClick={() => setDraft({ ...EMPTY })}>
            جديد
          </Btn>
        }
      />

      <ul className="flex flex-col gap-space-sm">
        {cats.map((c, i) => (
          <li
            key={c.id}
            {...drag.rowProps(c.id)}
            className={`bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex gap-space-sm items-center transition ${
              drag.dragId === c.id ? 'opacity-40' : ''
            } ${drag.overId === c.id && drag.dragId !== c.id ? 'ring-2 ring-primary' : ''}`}
          >
            <span
              {...drag.handleProps(c.id)}
              title="اسحبي لإعادة الترتيب"
              className="hidden [@media(hover:hover)]:flex w-6 shrink-0 justify-center cursor-grab active:cursor-grabbing text-outline"
            >
              <span className="material-symbols-outlined text-[22px]">drag_indicator</span>
            </span>
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <Img src={c.image} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-title-sm font-bold flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">{c.icon || DEFAULT_ICON}</span>
                {c.nameAr || c.nameEn}
              </div>
              <div className="text-label-md text-on-surface-variant">{countLabel(count(c.id), 'ar')}</div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col">
                <IconBtn icon="keyboard_arrow_up" label="أعلى" disabled={i === 0} onClick={() => move(i, -1)} />
                <IconBtn icon="keyboard_arrow_down" label="أسفل" disabled={i === cats.length - 1} onClick={() => move(i, 1)} />
              </div>
              <IconBtn icon="edit" label="تعديل" onClick={() => setDraft({ ...EMPTY, ...c })} />
              <IconBtn icon="delete" label="حذف" tone="text-error" onClick={() => remove(c)} />
            </div>
          </li>
        ))}
      </ul>

      {draft && (
        <Modal title={draft.id ? 'تعديل قسم' : 'قسم جديد'} onClose={() => setDraft(null)} onSave={save} saving={saving}>
          <ImagePicker label="صورة القسم" value={draft.image} onChange={set('image')} />
          <TextField label="الاسم (عربي)" value={draft.nameAr} onChange={set('nameAr')} />
          <TextField label="الاسم (English)" dir="ltr" value={draft.nameEn} onChange={set('nameEn')} />
          <IconPicker label="الأيقونة" value={draft.icon} onChange={set('icon')} />
          <TextField label="وصف قصير (عربي)" value={draft.descAr} onChange={set('descAr')} />
          <TextField label="Short description (English)" dir="ltr" value={draft.descEn} onChange={set('descEn')} />
          <TextField label="مقدمة القسم (عربي)" textarea value={draft.introAr} onChange={set('introAr')} />
          <TextField label="Intro (English)" textarea dir="ltr" value={draft.introEn} onChange={set('introEn')} />
          <TextField label="وسوم (عربي)" hint="افصلي بينها بفاصلة" value={draft.tagsAr} onChange={set('tagsAr')} />
          <TextField label="Tags (English)" dir="ltr" hint="Separate with commas" value={draft.tagsEn} onChange={set('tagsEn')} />
          <TextField label="عنوان الشريط السفلي (عربي)" value={draft.bannerTitleAr} onChange={set('bannerTitleAr')} />
          <TextField label="Banner title (English)" dir="ltr" value={draft.bannerTitleEn} onChange={set('bannerTitleEn')} />
          <TextField label="نص الشريط السفلي (عربي)" textarea rows={2} value={draft.bannerTextAr} onChange={set('bannerTextAr')} />
          <TextField label="Banner text (English)" textarea rows={2} dir="ltr" value={draft.bannerTextEn} onChange={set('bannerTextEn')} />
        </Modal>
      )}
    </>
  )
}
