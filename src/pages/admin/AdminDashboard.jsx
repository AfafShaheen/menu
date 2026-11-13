import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../../hooks/useData'
import { getCategories, getItems, getSlides, resetDemo } from '../../data/dataService'
import { Btn, PageTitle } from './ui'
import { useFeedback } from './feedback'

function Stat({ to, icon, value, label }) {
  return (
    <Link to={to} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex items-center gap-space-md active:scale-[0.98] transition">
      <span className="w-11 h-11 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <div>
        <div className="text-headline-lg text-on-surface leading-none">{value}</div>
        <div className="text-label-md text-on-surface-variant mt-1">{label}</div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const { data: items } = useData(() => getItems(), [], [])
  const { data: cats } = useData(getCategories, [], [])
  const { data: slides } = useData(getSlides, [], [])

  const off = items.filter((i) => !i.available)
  const featured = items.filter((i) => i.featured)

  const reset = async () => {
    const ok = await confirm({
      title: 'إعادة بيانات الديمو؟',
      message: 'رح تنحذف كل تعديلاتك ويرجع المحتوى الأصلي. بتقدري تاخدي نسخة احتياطية من الإعدادات أولاً.',
      confirmLabel: 'إعادة',
      danger: true,
    })
    if (!ok) return
    await resetDemo()
    window.location.reload()
  }

  return (
    <>
      <PageTitle title="أهلاً بك" sub="ملخص سريع عن القائمة" />

      <div className="grid grid-cols-2 gap-space-md">
        <Stat to="/admin/items" icon="lunch_dining" value={items.length} label="صنف" />
        <Stat to="/admin/categories" icon="category" value={cats.length} label="قسم" />
        <Stat to="/admin/items" icon="star" value={featured.length} label="صنف مميز" />
        <Stat to="/admin/slides" icon="view_carousel" value={slides.length} label="شريحة سلايدر" />
      </div>

      <section className="mt-space-xl">
        <h2 className="text-headline-md pb-space-sm">أصناف غير متوفرة</h2>
        {off.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant bg-surface-container-low rounded-xl p-space-lg">
            كل الأصناف متوفرة حالياً.
          </p>
        ) : (
          <ul className="bg-surface-container-lowest rounded-xl shadow-sm divide-y divide-outline-variant/50">
            {off.map((it) => (
              <li key={it.id} className="px-space-lg py-space-md flex items-center justify-between">
                <span className="text-body-md">{it.nameAr || it.nameEn}</span>
                <Link to="/admin/items" className="text-label-lg text-primary">
                  تعديل
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-space-xl flex flex-wrap gap-space-sm">
        <Btn icon="add" onClick={() => navigate('/admin/items?new=1')}>
          إضافة صنف
        </Btn>
        <Btn variant="danger" icon="restart_alt" onClick={reset}>
          إعادة بيانات الديمو
        </Btn>
      </section>
    </>
  )
}
