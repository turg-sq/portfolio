import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import MediaPreview from '../components/MediaPreview'
import { Reveal } from '../components/Reveal'
const steps = [
  { title: '学习入口', text: '从首页进入清晰的学习旅程。', src: 'motion-home.gif', alt: '宝宝小课堂学习首页' },
  { title: '学习过程', text: '用路径串联内容与连续探索。', src: 'motion-map.gif', alt: '宝宝小课堂学习地图' },
  { title: '成长反馈', text: '以可理解的视觉线索提示进度。', src: 'profile.png', alt: '宝宝小课堂成长记录' },
]

const learningEntryCards = [
  { id: 'entry-launch', title: '宝宝小课堂启动页', src: 'learning-entry-launch.png', alt: '宝宝小课堂启动页' },
  { id: 'entry-home', title: '宝宝小课堂首页', src: 'learning-entry-home.png', alt: '宝宝小课堂首页' },
  { id: 'entry-goals', title: '目标选择页', src: 'learning-entry-goals.png', alt: '宝宝小课堂目标选择页' },
  { id: 'entry-test', title: '英语测试入口页', src: 'learning-entry-test.png', alt: '宝宝小课堂英语测试页面' },
]
const CARD_STEP = 456

function LearningEntryCard({ card, index, continuousIndex, reduced }: { card: typeof learningEntryCards[number]; index: number; continuousIndex: MotionValue<number>; reduced: boolean | null }) {
  const relative = useTransform(continuousIndex, value => reduced ? index : index - value)
  const y = useTransform(relative, value => value * CARD_STEP)
  const scale = useTransform(relative, value => {
    const distance = Math.abs(value)
    return distance >= 1 ? .8 : 1 - (.2 * distance)
  })
  const opacity = useTransform(relative, value => {
    const distance = Math.abs(value)
    if (distance >= 1.5) return 0
    if (distance >= 1) return .34 * (1 - ((distance - 1) / .5))
    return 1 - (.66 * distance)
  })
  const filter = useTransform(relative, value => `blur(${Math.min(Math.abs(value) * 1.2, 2.4)}px)`)
  const zIndex = useTransform(relative, value => Math.max(0, 100 - Math.round(Math.abs(value) * 20)))

  return <motion.figure className="learning-entry-card" style={{ y, scale, opacity, filter, zIndex }}>
    <img src={`/assets/projects/baby-classroom/images/${card.src}`} alt={card.alt} />
  </motion.figure>
}

function LearningEntryStack({ continuousIndex, reduced }: { continuousIndex: MotionValue<number>; reduced: boolean | null }) {
  return <div className="learning-entry-stack" aria-label="学习入口界面展示">
    {learningEntryCards.map((card, index) => <LearningEntryCard key={card.id} card={card} index={index} continuousIndex={continuousIndex} reduced={reduced} />)}
  </div>
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState<{ type: 'image'; src: string; title: string } | null>(null)
  const reduced = useReducedMotion()
  const setSectionRef = useCallback((node: HTMLElement | null) => {
    sectionRef.current = node
    scrollContainerRef.current = node?.closest<HTMLElement>('.baby-classroom-page') ?? null
  }, [])
  const { scrollYProgress } = useScroll({ container: scrollContainerRef, target: storyRef, offset: ['start start', 'end end'] })
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const learningEntryProgress = useTransform(scrollYProgress, [0, .62], [0, learningEntryCards.length - 1])
  const learningEntryIndex = useSpring(learningEntryProgress, { stiffness: 190, damping: 31, mass: .32 })
  const asset = (name: string) => `/assets/projects/baby-classroom/images/${name}`
  const current = steps[active]
  useMotionValueEvent(scrollYProgress, 'change', value => setActive(value < .64 ? 0 : value < .82 ? 1 : 2))

  return <section ref={setSectionRef} id="experience" className="experience section">
    <div className="content experience-inner">
      <div className="experience-intro"><Reveal><p className="eyebrow">03 / APP EXPERIENCE</p></Reveal><div className="experience-title-wrap"><h2 className="experience-title">探索式<span>学习体验</span></h2></div><p className="body-copy">从进入应用到完成一次学习，每个页面都保持轻松、清晰与积极的节奏。</p></div>
      <div ref={storyRef} className="experience-story">
        <div className="experience-sticky">
          <div className="map-steps"><div className="map-progress" aria-hidden="true"><i /><motion.i className="map-progress__active" style={reduced ? undefined : { scaleY: progress }} /></div>{steps.map((step, index) => <motion.article key={step.title} className={active === index ? 'active' : ''} aria-current={active === index ? 'step' : undefined} initial={false} animate={{ opacity: active === index ? 1 : .28, x: active === index ? 6 : 0 }} transition={{ duration: .36, ease: [0.22, 1, .36, 1] }}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p>{index === 1 && <button className="map-preview-button" type="button" onClick={() => setPreview({ type: 'image', src: asset('map.png'), title: '宝宝小课堂完整学习地图' })}>查看完整学习地图 <b>→</b></button>}<div className="experience-mobile-media"><img src={asset(step.src)} alt={step.alt} /></div></motion.article>)}</div>
          <aside className="map-stage" aria-live="polite">
            {active === 0
              ? <LearningEntryStack continuousIndex={learningEntryIndex} reduced={reduced} />
              : <AnimatePresence mode="sync" initial={false}><motion.img key={current.src} src={asset(current.src)} alt={current.alt} initial={reduced ? false : { opacity: 0, scale: 1.012 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0, scale: .985 }} transition={{ duration: .46, ease: [0.22, 1, .36, 1] }} /></AnimatePresence>}
          </aside>
        </div>
      </div>
    </div>
    <MediaPreview preview={preview} onClose={() => setPreview(null)} />
  </section>
}
