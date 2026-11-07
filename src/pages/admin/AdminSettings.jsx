import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { saveSettings } from '../../data/dataService'
import { Btn, ImagePicker, PageTitle, TextField } from './ui'

function Group({ title, icon, children }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
      <h2 className="text-title-sm font-bold flex items-center gap-1.5 text-primary">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function AdminSettings() {
  const { settings, refresh } = useSettings()
  const [s, setS] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const set = (k) => (v) => {
    setSaved(false)
    setS((x) => ({ ...x, [k]: v }))
  }

  const save = async () => {
    setSaving(true)
    await saveSettings(s)
    await refresh()
    setSaving(false)
    setSaved(true)
  }

  return (
    <>
      <PageTitle title="الإعدادات" sub="معلومات المطعم اللي تظهر بالموقع" />

      <div className="flex flex-col gap-space-lg">
        <Group title="الهوية" icon="storefront">
          <ImagePicker label="الشعار" value={s.logo} onChange={set('logo')} maxSize={400} />
          <TextField label="اسم المطعم (عربي)" value={s.nameAr} onChange={set('nameAr')} />
          <TextField label="Restaurant name (English)" dir="ltr" value={s.nameEn} onChange={set('nameEn')} />
          <TextField label="الاسم الكامل (عربي)" value={s.fullNameAr} onChange={set('fullNameAr')} />
          <TextField label="Full name (English)" dir="ltr" value={s.fullNameEn} onChange={set('fullNameEn')} />
          <TextField label="جملة ترحيب (عربي)" value={s.welcomeAr} onChange={set('welcomeAr')} />
          <TextField label="Welcome (English)" dir="ltr" value={s.welcomeEn} onChange={set('welcomeEn')} />
          <TextField label="شعار نصي (عربي)" value={s.taglineAr} onChange={set('taglineAr')} />
          <TextField label="Tagline (English)" dir="ltr" value={s.taglineEn} onChange={set('taglineEn')} />
        </Group>

        <Group title="من نحن" icon="info">
          <ImagePicker label="صورة" value={s.aboutImage} onChange={set('aboutImage')} />
          <TextField label="عنوان فرعي (عربي)" value={s.aboutSubtitleAr} onChange={set('aboutSubtitleAr')} />
          <TextField label="Subtitle (English)" dir="ltr" value={s.aboutSubtitleEn} onChange={set('aboutSubtitleEn')} />
          <TextField label="النبذة (عربي)" textarea rows={5} value={s.aboutAr} onChange={set('aboutAr')} />
          <TextField label="About (English)" textarea rows={5} dir="ltr" value={s.aboutEn} onChange={set('aboutEn')} />
          <TextField label="تعليق الصورة (عربي)" value={s.aboutImageCaptionAr} onChange={set('aboutImageCaptionAr')} />
          <TextField label="Image caption (English)" dir="ltr" value={s.aboutImageCaptionEn} onChange={set('aboutImageCaptionEn')} />
        </Group>

        <Group title="ساعات العمل والعنوان" icon="schedule">
          <TextField label="ساعات العمل (عربي)" value={s.hoursAr} onChange={set('hoursAr')} />
          <TextField label="Hours (English)" dir="ltr" value={s.hoursEn} onChange={set('hoursEn')} />
          <TextField label="ملاحظة (عربي)" value={s.hoursNoteAr} onChange={set('hoursNoteAr')} />
          <TextField label="Note (English)" dir="ltr" value={s.hoursNoteEn} onChange={set('hoursNoteEn')} />
          <TextField label="العنوان (عربي)" value={s.addressAr} onChange={set('addressAr')} />
          <TextField label="Address (English)" dir="ltr" value={s.addressEn} onChange={set('addressEn')} />
          <TextField label="رابط الخريطة" dir="ltr" type="url" value={s.mapUrl} onChange={set('mapUrl')} />
          <TextField label="اسم الموقع على الخريطة (عربي)" value={s.mapLabelAr} onChange={set('mapLabelAr')} />
          <TextField label="Map label (English)" dir="ltr" value={s.mapLabelEn} onChange={set('mapLabelEn')} />
          <ImagePicker label="صورة الخريطة" value={s.mapImage} onChange={set('mapImage')} />
        </Group>

        <Group title="التواصل" icon="call">
          <TextField
            label="رقم واتساب"
            dir="ltr"
            inputMode="tel"
            hint="مع رمز الدولة وبدون +، مثل 963988123456"
            value={s.whatsapp}
            onChange={set('whatsapp')}
          />
          <TextField label="رقم الهاتف" dir="ltr" inputMode="tel" value={s.phone} onChange={set('phone')} />
          <TextField label="انستغرام" dir="ltr" type="url" value={s.instagram} onChange={set('instagram')} />
          <TextField label="فيسبوك" dir="ltr" type="url" value={s.facebook} onChange={set('facebook')} />
          <TextField label="تيك توك" dir="ltr" type="url" value={s.tiktok} onChange={set('tiktok')} />
        </Group>
      </div>

      <div className="sticky bottom-20 mt-space-lg flex items-center gap-space-md">
        <Btn className="flex-1 shadow-lg" icon="save" onClick={save} disabled={saving}>
          {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
        </Btn>
        {saved && (
          <span className="text-label-lg text-green-700 flex items-center gap-1 bg-surface px-space-md py-2 rounded-full shadow">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            تم الحفظ
          </span>
        )}
      </div>
    </>
  )
}
