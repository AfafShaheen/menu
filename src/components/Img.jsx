import { useState } from 'react'

export default function Img({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`bg-gradient-to-br from-primary-fixed to-secondary-fixed flex items-center justify-center text-primary/40 ${className}`}>
        <span className="material-symbols-outlined text-[40px]">restaurant</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}