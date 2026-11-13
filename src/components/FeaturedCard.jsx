import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { formatNumber, currency } from '../utils/format'
import { BADGE } from '../constants'
import Img from './Img'
import AddButton from './AddButton'

export default function FeaturedCard({ item }) {
  const { lang, t, tr } = useLang()
  const badge = tr(item, 'badge')

  return (
    <Link to={`/item/${item.id}`} className="shrink-0 w-64 snap-start bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative">
      <div className="relative h-40 w-full overflow-hidden">
        <Img
          src={item.image}
          alt={tr(item, 'name')}
          className={`w-full h-full ${item.available ? '' : 'opacity-50 grayscale'}`}
        />
        {!item.available ? (
          <span className="absolute top-2.5 start-2.5 bg-inverse-surface text-on-primary text-label-md px-2.5 py-1 rounded-full shadow-sm">
            {t('unavailable')}
          </span>
        ) : badge ? (
          <span className={`absolute top-2.5 start-2.5 ${BADGE[item.badgeColor] || BADGE.primary} text-label-md px-2.5 py-1 rounded-full shadow-sm`}>
            {badge}
          </span>
        ) : null}
      </div>

      <div className="p-space-md flex flex-col flex-grow justify-between gap-space-sm">
        <div>
          <h3 className="text-title-sm font-bold text-on-surface line-clamp-1">{tr(item, 'name')}</h3>
          <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">{tr(item, 'desc')}</p>
        </div>
        <div className="flex items-center justify-between pt-space-xs mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-price-tag font-bold text-primary">{formatNumber(item.price)}</span>
            <span className="text-label-md text-on-surface-variant">{currency(lang)}</span>
          </div>
          <AddButton item={item} />
        </div>
      </div>
    </Link>
  )
}