import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type Preview = { type: 'image' | 'video'; src: string; title: string } | null

export default function MediaPreview({ preview, onClose }: { preview: Preview; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null); const returnFocus = useRef<HTMLElement | null>(null)
  useEffect(() => { if (!preview) return; returnFocus.current = document.activeElement as HTMLElement; closeRef.current?.focus(); const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; addEventListener('keydown', keydown); return () => { removeEventListener('keydown', keydown); returnFocus.current?.focus() } }, [preview, onClose])
  return <AnimatePresence>{preview && <motion.div className="media-preview" role="dialog" aria-modal="true" aria-label={preview.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} onClick={onClose}><motion.div className="media-preview-panel" initial={{ opacity: 0, scale: .96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .34, ease: [0.2, 0, 0, 1] }} onClick={event => event.stopPropagation()}><button ref={closeRef} className="preview-close" type="button" onClick={onClose} aria-label="关闭预览">关闭</button>{preview.type === 'video' ? <video src={preview.src} controls autoPlay playsInline /> : <img src={preview.src} alt={preview.title} />}</motion.div></motion.div>}</AnimatePresence>
}
