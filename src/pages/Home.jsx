import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { useSettings } from '../context/useSettings'
import { useData } from '../hooks/useData'
import { getSlides, getItems } from '../data/dataService'
import { formatPhone } from '../utils/format'
import Slider from '../components/Slider'
import FeaturedCard from '../components/FeaturedCard'
import Img from '../components/Img'

const SOCIALS = [
  { key: 'instagram', icon: 'photo_camera', label: 'Instagram' },
  { key: 'facebook', icon: 'public', label: 'Facebook' },
  { key: 'tiktok', icon: 'music_note', label: 'TikTok' },
]

const YEAR = new Date().getFullYear()

const roundBtn =
  'w-11 h-11 rounded-full bg-surface-container-high hover:bg-surface-variant active:scale-95 text-primary flex items-center justify-center transition-all shadow-sm'

export default function Home() {
  const { lang, t, tr } = useLang()
  const { settings: s } = useSettings()
  const { data: slides } = useData(getSlides, [], [])
  const { data: featured } = useData(() => getItems({ featured: true }), [], [])
  const arrow = lang === 'ar' ? 'arrow_back' : 'arrow_forward'

  const welcome = tr(s, 'welcome')
  const tagline = tr(s, 'tagline')
  const hours = tr(s, 'hours')
  const address = tr(s, 'address')
  const caption = tr(s, 'aboutImageCaption')
  const socials = SOCIALS.filter((x) => s[x.key])

  return (
    <main className="relative w-full pt-[calc(4rem+env(safe-area-inset-top,0px))] bg-surface pb-space-lg">
      <div className="flex flex-col w-full max-w-[480px] mx-auto px-gutter gap-space-xl">

        {(welcome || tagline) && (
          <div className="flex items-center justify-between pt-space-xs">
            <div className="flex flex-col">
              {welcome && (
                <span className="text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container inline-block animate-pulse"></span>
                  {welcome}
                </span>
              )}
              {tagline && <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">{tagline}</h1>}
            </div>
          </div>
        )}

        <Slider slides={slides} />

        {featured.length > 0 && (
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <h2 className="text-headline-md font-bold text-on-surface">{t('featured')}</h2>
                </div>
                <p className="text-body-sm text-on-surface-variant">{t('featuredSub')}</p>
              </div>
              <Link to="/menu" className="text-label-lg text-primary font-semibold flex items-center gap-0.5 hover:underline">
                {t('viewAll')}
                <span className="material-symbols-outlined text-[18px]">{arrow}</span>
              </Link>
            </div>

            <div className="no-scrollbar flex overflow-x-auto gap-space-md pb-space-sm pt-space-xs -mx-gutter px-gutter snap-x snap-mandatory scroll-smooth">
              {featured.map((it) => (
                <FeaturedCard key={it.id} item={it} />
              ))}
            </div>

            <Link
              to="/menu"
              className="w-full min-h-[48px] rounded-full bg-primary hover:bg-tertiary active:scale-[0.98] text-on-primary text-title-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all mt-space-xs"
            >
              <span>{t('browseMenu')}</span>
              <span className="material-symbols-outlined text-[20px]">{arrow}</span>
            </Link>
          </section>
        )}

        <section className="flex flex-col gap-space-md bg-surface-container-low rounded-xl p-space-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[22px]">restaurant</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">{t('aboutUs')}</h2>
              {tr(s, 'aboutSubtitle') && (
                <span className="text-label-md text-on-surface-variant">{tr(s, 'aboutSubtitle')}</span>
              )}
            </div>
          </div>

          <p className="text-body-md text-on-surface leading-relaxed text-justify">{tr(s, 'about')}</p>

          {s.aboutImage && (
            <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-sm">
              <Img src={s.aboutImage} className="w-full h-full" />
              {caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent flex items-end p-space-md">
                  <span className="text-label-md text-on-primary bg-surface/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {caption}
                  </span>
                </div>
              )}
            </div>
          )}

          {(hours || address) && (
            <div className="grid grid-cols-1 gap-space-sm pt-space-xs">
              {hours && (
                <div className="flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-lg font-bold text-on-surface">{t('hours')}</span>
                    <span className="text-body-sm text-on-surface-variant mt-0.5">{hours}</span>
                    {tr(s, 'hoursNote') && (
                      <span className="text-label-md text-tertiary mt-1 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container inline-block"></span>
                        {tr(s, 'hoursNote')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-label-lg font-bold text-on-surface">{t('location')}</span>
                    <span className="text-body-sm text-on-surface-variant mt-0.5">{address}</span>
                    {s.mapUrl && (
                      <a
                        href={s.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label-md text-primary font-bold mt-1.5 inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{t('openMap')}</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {s.mapUrl && (
          <a
            href={s.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-36 rounded-xl shadow-sm relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-fixed to-secondary-fixed"
          >
            {s.mapImage && <img src={s.mapImage} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-inverse-surface/30 backdrop-blur-[1px]"></div>
            {tr(s, 'mapLabel') && (
              <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
                <span className="text-label-md font-bold text-on-surface">{tr(s, 'mapLabel')}</span>
              </div>
            )}
          </a>
        )}

        <footer className="flex flex-col items-center gap-space-lg pt-space-sm pb-space-lg text-center">
          {s.whatsapp && (
            <a
              href={`https://wa.me/${s.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-title-sm font-bold flex items-center justify-center gap-space-sm shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>
                {t('contactWhatsapp')}
                {s.phone && (
                  <>
                    {' ('}
                    <span dir="ltr">{formatPhone(s.phone)}</span>
                    {')'}
                  </>
                )}
              </span>
            </a>
          )}

          {(socials.length > 0 || s.phone) && (
            <div className="flex flex-col items-center gap-space-xs">
              <span className="text-label-md text-on-surface-variant">{t('followUs')}</span>
              <div className="flex items-center gap-space-md mt-1">
                {socials.map((x) => (
                  <a key={x.key} href={s[x.key]} target="_blank" rel="noopener noreferrer" aria-label={x.label} className={roundBtn}>
                    <span className="material-symbols-outlined text-[22px]">{x.icon}</span>
                  </a>
                ))}
                {s.phone && (
                  <a href={`tel:${s.phone}`} aria-label="Call" className={roundBtn}>
                    <span className="material-symbols-outlined text-[22px]">call</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-1 text-on-surface-variant">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-label-md font-semibold text-on-surface">{tr(s, 'fullName')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              © {YEAR} {tr(s, 'fullName')}. {t('rights')}.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}