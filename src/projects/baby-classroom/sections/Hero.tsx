import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import MagneticButton from '../components/MagneticButton'
import BabyLiquidGlassCursor from '../components/BabyLiquidGlassCursor'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const parallaxTargetX = useMotionValue(0)
  const parallaxTargetY = useMotionValue(0)
  const parallaxX = useSpring(parallaxTargetX, { stiffness: 200, damping: 25, mass: .4 })
  const parallaxY = useSpring(parallaxTargetY, { stiffness: 200, damping: 25, mass: .4 })
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -45])
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [0, -1.5])
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.086])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -20])
  const cueOpacity = useTransform(scrollYProgress, [0, .12], [1, 0])
  const cueY = useTransform(scrollYProgress, [0, .12], [0, 12])

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    parallaxTargetX.set(((event.clientX - bounds.left) / bounds.width - .5) * 12)
    parallaxTargetY.set(((event.clientY - bounds.top) / bounds.height - .5) * 12)
  }

  return <section ref={heroRef} className="hero" onPointerMove={handlePointerMove} onPointerLeave={() => { parallaxTargetX.set(0); parallaxTargetY.set(0) }}>
    <div className="hero-background-decor" aria-hidden="true"><i className="hero-blur-orb hero-blur-orb--one" /><i className="hero-blur-orb hero-blur-orb--two" /><i className="hero-blur-orb hero-blur-orb--three" /></div>
    <div className="hero-glow hero-glow-blue" /><div className="hero-glow hero-glow-green" />
    <div className="hero-inner">
      <div ref={visualRef} className="hero-stage" aria-label="宝宝小课堂案例样机展示">
        <motion.div className="hero-phone-scroll" style={reduced ? undefined : { y: phoneY, rotate: phoneRotate, scale: phoneScale }}>
          <motion.div className="hero-main-mockup" style={reduced ? undefined : { x: parallaxX, y: parallaxY }}><img src="/assets/projects/baby-classroom/images/mockup-main.png" alt="宝宝小课堂 App 设计样机" /></motion.div>
        </motion.div>
      </div>
      <motion.div className="hero-copy" style={reduced ? undefined : { y: copyY }}>
        <p className="eyebrow hero-kicker">01 / 06 · UI / UX DESIGN CASE STUDY</p>
        <div className="hero-title-mask"><h1 ref={titleRef}>宝宝小课堂</h1></div>
        <p className="subtitle">儿童启蒙教育 App</p>
        <p className="intro">从视觉设计到交互体验的完整产品案例</p>
        <div className="meta-row"><span><b>TYPE</b>儿童教育</span><span><b>YEAR</b>2026</span><span><b>ROLE</b>UI / UX</span></div>
        <div><MagneticButton href="#demo">查看 Demo <i className="button-arrow" aria-hidden="true" /></MagneticButton></div>
      </motion.div>
    </div>
    <BabyLiquidGlassCursor heroRef={heroRef} />
    <motion.a className="scroll-cue" href="#overview" style={reduced ? undefined : { opacity: cueOpacity, y: cueY }}><span className="scroll-line" /><b>01</b><em>/ 06</em><small>向下浏览</small></motion.a>
  </section>
}
