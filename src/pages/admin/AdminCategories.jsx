import { useState } from 'react'
import { useData } from '../../hooks/useData'
import { deleteCategory, getCategories, getItems, reorderCategories, saveCategory } from '../../data/dataService'
import { countLabel } from '../../utils/format'
import Img from '../../components/Img'
import { Btn, IconBtn, ImagePicker, Modal, PageTitle, TextField } from './ui'

const EMPTY = {
  nameAr: '', nameEn: '', icon: 'restaurant_menu', image: null,
  descAr: '', descEn: '', introAr: '', introEn: '', tagsAr: '', tagsEn: '',
  bannerTitleAr: '', bannerTitleEn: '', bannerTextAr: '', bannerTextEn: '',
}

export default function AdminCategories() {
  const [version, setVersion] = useState(0)
  const reload = () => setVersion((v) => v + 1)
  const { data: cats } = useData(getCategories, [version], [])
  const { data: items } = useData(() => getItems(), [version], [])
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }))

  const count = (id) => items.filter((i) => i.categoryId === id).length

  const move = async (index, dir) => {
    const ids = cats.map((c) => c.id)
    const j = index + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    await reorderCategories(ids)
    reload()
  }

  const remove = async (c) => {
    const n = count(c.id)
    const msg = n
      ? `حذف قسم "${c.nameAr}" سيحذف معه ${countLabel(n, 'ar')}. متأكدة؟ لا يمكن التراجع.`
      : `حذف قسم "${c.nameAr}"؟`
    if (!window.confirm(msg)) return
    await deleteCategory(c.id)
    reload()
  }

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) return alert('أدخلي اسم القسم')
    setSaving(true)
    await saveCategory(draft)
    setSaving(false)
    setDraft(null)
    reload()
  }

  return (
    <>
      <PageTitle
        title="الأقسام"
        sub="رتّبي الأقسام بالأسهم، وهذا الترتيب هو اللي يظهر للزبون"
        action={
          <Btn icon="add" onClick={() => setDraft({ ...EMPTY })}>
            جديد
          </Btn>
        }
      />

      <ul className="flex flex-col gap-space-sm">
        {cats.map((c, i) => (
          <li key={c.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex gap-space-md items-center">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <Img src={c.image} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-title-sm font-bold flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">{c.icon || 'restaurant_menu'}</span>
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
          <TextField
            label="أيقونة"
            dir="ltr"
            hint="اسم أيقونة من Material Symbols، مثل: tapas أو local_bar"
            value={draft.icon}
            onChange={set('icon')}
          />
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
