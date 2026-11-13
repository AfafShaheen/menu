import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { formatPrice } from '../utils/format'
import { BADGE } from '../constants'
import Img from './Img'
import AddButton from './AddButton'

export default function ItemRow({ item }) {
  const { lang, t, tr } = useLang()
  const off = !item.available
  const badge = tr(item, 'badge')
  const note = tr(item, 'note')

  return (
    <Link
      to={`/item/${item.id}`}
      className={`block ${off ? 'bg-surface-container-low opacity-75' : 'bg-surface-container-lowest'} rounded-xl p-space-md shadow-sm hover:shadow-md active:scale-[0.99] transition-all`}
    >
      <div className="flex gap-space-md">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container">
          <Img
            src={item.image}
            alt={tr(item, 'name')}
            className={`w-full h-full ${off ? 'grayscale contrast-75' : ''}`}
          />
          {off ? (
            <div className="absolute inset-0 bg-surface-dim/70 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
              <span className="text-label-md text-on-surface font-bold bg-surface-container-highest px-2 py-0.5 rounded shadow-sm">
                {t('unavailable')}
              </span>
            </div>
          ) : (
            badge && (
              <span className={`absolute top-1 start-1 px-2 py-0.5 rounded-full ${BADGE[item.badgeColor] || BADGE.primary} text-label-md shadow-sm`}>
                {badge}
              </span>
            )
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            <h3 className={`text-title-sm font-bold truncate ${off ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
              {tr(item, 'name')}
            </h3>
            <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">{tr(item, 'desc')}</p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-space-xs">
            <span className={`text-price-tag font-bold ${off ? 'text-on-surface-variant' : 'text-primary'}`}>
              {formatPrice(item.price, lang)}
            </span>
            <div className="flex items-center gap-2">
              {note && (
                <span className="text-label-md text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
                  {note}
                </span>
              )}
              <AddButton item={item} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}