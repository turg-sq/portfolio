import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function AutoVideo({ src, title, featured = false, onPreview }: { src: string; title: string; featured?: boolean; onPreview: () => void }) {
  const ref = useRef<HTMLElement>(null); const visible = useInView(ref, { amount: .4 }); const [renderGif, setRenderGif] = useState(featured)
  useEffect(() => { setRenderGif(visible) }, [visible])
  return <article ref={ref} className={`video-card ${featured ? 'video-card-featured' : ''}`}><div className="video-frame">{renderGif && <img src={src} alt={`${title} GIF 动效演示`} loading={featured ? 'eager' : 'lazy'} />}<button className="video-preview-button" type="button" onClick={onPreview}>放大查看</button></div><div className="video-caption"><p>{title}</p></div></article>
}
