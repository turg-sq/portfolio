import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import { editorialEase, useMotionSafe } from '../components/MotionSafe'

type Props = { leaving: boolean; onWorks: () => void }
const piece = (delay: number, from: { x: number; y: number; rotate: number }) => ({ hidden: { opacity: 0, ...from }, visible: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { delay, duration: 0.42, ease: editorialEase } } })

export default function PortfolioHero({ leaving, onWorks }: Props) {
  const { reduced } = useMotionSafe()
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const paperX = useSpring(parallax.x * 0.45, { stiffness: 100, damping: 20 }); const paperY = useSpring(parallax.y * 0.45, { stiffness: 100, damping: 20 })
  const yellowX = useSpring(parallax.x, { stiffness: 100, damping: 20 }); const yellowY = useSpring(parallax.y, { stiffness: 100, damping: 20 })
  useEffect(() => { paperX.set(parallax.x * 0.45); paperY.set(parallax.y * 0.45); yellowX.set(parallax.x); yellowY.set(parallax.y) }, [parallax, paperX, paperY, yellowX, yellowY])
  const canParallax = !reduced && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 1024px)').matches
  const enter = (delay: number) => reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.28, ease: editorialEase } }
  return <motion.section className="hero" animate={leaving && !reduced ? { scale: 0.98, filter: 'contrast(.72)' } : { scale: 1, filter: 'contrast(1)' }} transition={{ duration: reduced ? 0.14 : 0.32, ease: editorialEase }} onPointerMove={event => { if (canParallax) { const rect = event.currentTarget.getBoundingClientRect(); setParallax({ x: ((event.clientX - rect.left) / rect.width - .5) * 20, y: ((event.clientY - rect.top) / rect.height - .5) * 20 }) } }} onPointerLeave={() => setParallax({ x: 0, y: 0 })}>
    <div className="hero-noise" aria-hidden="true" /><div className="hero-topline"><span>SYQ / 2026</span><span>SELECTED WORKS</span></div>
    <div className="collage" aria-label="苏瑛琪个人作品集拼贴标志">
      <motion.span className="collage-yellow triangle" variants={piece(.08, { x: -30, y: 22, rotate: -5 })} initial="hidden" animate="visible" style={{ x: yellowX, y: yellowY }} />
      <motion.span className="collage-yellow circle" variants={piece(.17, { x: 28, y: -20, rotate: 4 })} initial="hidden" animate="visible" style={{ x: yellowX, y: yellowY }} />
      <motion.span className="collage-paper paper-a" variants={piece(.27, { x: -22, y: 24, rotate: -4 })} initial="hidden" animate="visible" style={{ x: paperX, y: paperY }}>SU<br />YINGQI</motion.span>
      <motion.span className="collage-paper paper-b" variants={piece(.37, { x: 24, y: 20, rotate: 4 })} initial="hidden" animate="visible" style={{ x: paperX, y: paperY }}>PORT<br />FOLIO</motion.span>
      <motion.span className="collage-line line-a" variants={piece(.47, { x: -16, y: 8, rotate: -2 })} initial="hidden" animate="visible" />
      <motion.span className="collage-index" variants={piece(.54, { x: 0, y: 12, rotate: 0 })} initial="hidden" animate="visible">01—05</motion.span>
    </div>
    <div className="hero-copy"><motion.p {...enter(.62)}>苏瑛琪</motion.p><motion.h1 {...enter(.69)}>Personal Portfolio</motion.h1><motion.div {...enter(.76)} className="hero-disciplines">UI/UX · IP · 品牌视觉 · 动态设计 · 信息可视化</motion.div><motion.button {...enter(.83)} whileTap={reduced ? undefined : { scale: .98 }} className="works-entry" onClick={onWorks}>进入 Works <span aria-hidden="true">→</span></motion.button></div>
    <motion.div {...enter(.9)}><Navigation onWorks={onWorks} /></motion.div>
  </motion.section>
}
