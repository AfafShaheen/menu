import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { countLabel } from '../utils/format'
import Img from './Img'

export default function CategoryTile({ category, count }) {
  const { lang, tr } = useLang()
  const desc = tr(category, 'desc')

  return (
    <Link
      to={`/menu/${category.id}`}
      className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200 bg-surface-container-high block"
    >
      <Img
        src={category.image}
        alt={tr(category, 'name')}
        className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-3">
        <div className="self-start">
          <span className="inline-flex items-center bg-black/40 backdrop-blur-md text-white text-label-md px-2 py-0.5 rounded-full">
            {countLabel(count, lang)}
          </span>
        </div>
        <div>
          <span className="text-headline-md text-white font-bold block leading-tight drop-shadow-sm">
            {tr(category, 'name')}
          </span>
          {desc && <span className="text-label-md text-white/80 block mt-0.5">{desc}</span>}
        </div>
      </div>
    </Link>
  )
}