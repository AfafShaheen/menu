import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { useData } from '../hooks/useData'
import { getCategories, getItems } from '../data/dataService'
import ItemRow from '../components/ItemRow'

export default function Category() {
  const { id } = useParams()
  const { t, tr } = useLang()
  const { data: cats, loading } = useData(getCategories, [], [])
  const { data: items } = useData(() => getItems({ categoryId: id }), [id], [])

  const cat = cats.find((c) => c.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    document.getElementById(`chip-${id}`)?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [id, cats])

  if (!loading && !cat) return <Navigate to="/menu" replace />
  if (!cat) return null

  const intro = tr(cat, 'intro')
  const tags = tr(cat, 'tags').split(/[،,]/).map((s) => s.trim()).filter(Boolean)
  const bannerTitle = tr(cat, 'bannerTitle')
  const bannerText = tr(cat, 'bannerText')

  return (
    <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-28">
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-40 bg-surface/95 backdrop-blur-md py-space-sm shadow-sm">
        <div className="no-scrollbar flex items-center gap-space-xs overflow-x-auto px-space-md">
          {cats.map((c) => {
            const active = c.id === id
            return (
              <Link
                key={c.id}
                id={`chip-${c.id}`}
                to={`/menu/${c.id}`}
                replace
                className={`shrink-0 flex items-center gap-space-xs px-space-md py-2 rounded-full transition-colors ${
                  active
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${active ? '' : 'text-on-surface-variant'}`}>
                  {c.icon || 'restaurant_menu'}
                </span>
                <span className={`text-label-lg ${active ? 'font-bold' : ''}`}>{tr(c, 'name')}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-space-md pt-space-md pb-space-sm flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          <h2 className="text-headline-lg text-on-surface font-bold">{tr(cat, 'name')}</h2>
        </div>
        {intro && <p className="text-body-md text-on-surface-variant leading-relaxed">{intro}</p>}
        {tags.length > 0 && (
          <div className="flex items-center gap-space-xs flex-wrap pt-space-xs">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface text-label-md"
              >
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-space-md px-space-md pt-space-sm">
        {items.length === 0 ? (
          <p className="text-center text-body-md text-on-surface-variant py-space-xl">{t('emptyCategory')}</p>
        ) : (
          items.map((it) => <ItemRow key={it.id} item={it} />)
        )}
      </div>

      {(bannerTitle || bannerText) && (
        <div className="mx-space-md mt-space-lg p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
            <span className="material-symbols-outlined text-[22px]">skillet</span>
          </div>
          <div className="flex flex-col">
            {bannerTitle && <span className="text-label-lg font-bold text-on-surface">{bannerTitle}</span>}
            {bannerText && <span className="text-body-sm text-on-surface-variant">{bannerText}</span>}
          </div>
        </div>
      )}
    </main>
  )
}