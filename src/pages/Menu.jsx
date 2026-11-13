import { useMemo, useState } from 'react'
import { useLang } from '../i18n/useLang'
import { useData } from '../hooks/useData'
import { getCategories, getItems } from '../data/dataService'
import { searchItems } from '../utils/search'
import { formatNumber } from '../utils/format'
import CategoryTile from '../components/CategoryTile'
import ItemRow from '../components/ItemRow'

export default function Menu() {
  const { t } = useLang()
  const { data: cats } = useData(getCategories, [], [])
  const { data: items } = useData(() => getItems(), [], [])
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const m = {}
    items.forEach((it) => { m[it.categoryId] = (m[it.categoryId] || 0) + 1 })
    return m
  }, [items])

  // الأقسام الفاضية ما بتظهر
  const visible = cats.filter((c) => counts[c.id] > 0)

  const query = q.trim()
  const results = useMemo(() => searchItems(items, query, cats), [items, query, cats])

  return (
    <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-28">
      <div className="px-gutter pt-4 pb-2">
        <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">{t('menuTitle')}</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">{t('menuSubtitle')}</p>
      </div>

      <div className="px-gutter my-3">
        <div className="flex items-center gap-2.5 bg-surface-container px-3.5 py-2.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            type="search"
            aria-label={t('searchPlaceholder')}
            enterKeyHint="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="bg-transparent text-on-surface placeholder:text-on-surface-variant/70 text-body-sm w-full focus:outline-none"
          />
          {q && (
            <button type="button" aria-label={t('clear')} onClick={() => setQ('')}>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
            </button>
          )}
        </div>
      </div>

      {query ? (
        <div className="flex flex-col gap-space-md px-space-md pt-space-sm">
          {results.length === 0 ? (
            <p className="text-center text-body-md text-on-surface-variant py-space-xl">{t('noResults')}</p>
          ) : (
            <>
              <p className="text-label-md text-on-surface-variant px-space-xs" aria-live="polite">
                {formatNumber(results.length)} {t('resultsCount')}
              </p>
              {results.map((it) => <ItemRow key={it.id} item={it} />)}
            </>
          )}
        </div>
      ) : (
        <div className="px-gutter mt-4">
          <div className="grid grid-cols-2 gap-3.5">
            {visible.map((c) => (
              <CategoryTile key={c.id} category={c} count={counts[c.id]} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}