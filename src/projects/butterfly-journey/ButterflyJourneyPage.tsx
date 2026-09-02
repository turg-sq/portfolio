import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import './butterfly-journey.css'

const ease = [.22, 1, .36, 1] as const
const asset = (image: string) => `/assets/projects/butterfly-journey/gallery/${image}`

const chapters = [
  { id: 'butterfly-tool-evolution', label: '01  TOOL EVOLUTION' },
  { id: 'butterfly-visual-language', label: '02  STYLE & MATERIAL' },
  { id: 'butterfly-design-system', label: '03  NAIL ECONOMY' },
  { id: 'butterfly-final-visual', label: '04  CULTURE & IDENTITY' },
  { id: 'butterfly-application', label: '05  APPLICATION' },
  { id: 'butterfly-archive', label: '06  ARCHIVE' },
]

const artworks = [
  {
    id: 'butterfly-visual-language',
    image: '02-nail-trends.png',
    eyebrow: '02 / VISUAL LANGUAGE',
    title: '视觉语言',
    description: '从当代美甲趋势中提取色彩、图形与东方视觉符号，建立项目的叙事语气。',
    caption: 'FIG. 01  ·  CURRENT NAIL ART TRENDS  ·  2026',
  },
  {
    id: 'butterfly-design-system',
    image: '03-main-visual.png',
    eyebrow: '03 / DESIGN SYSTEM',
    title: '信息组织',
    description: '以图形、数据与层级关系展开信息可视化主视觉，使复杂内容保持清晰的阅读节奏。',
    caption: 'FIG. 02  ·  INFORMATION VISUAL SYSTEM',
  },
  {
    id: 'butterfly-final-visual',
    image: '04-products.png',
    eyebrow: '04 / FINAL DISPLAY',
    title: '最终视觉',
    description: '作品在完整的视觉构图中收束，保留材料、色彩与叙事符号之间的关系。',
    caption: 'FIG. 03  ·  FINAL VISUAL',
  },
  {
    id: 'butterfly-application',
    image: '05-application.png',
    eyebrow: '05 / APPLICATION',
    title: '应用延展',
    description: '将主视觉系统延展至产品与应用场景，维持统一的识别与观看体验。',
    caption: 'FIG. 04  ·  APPLICATION STUDY',
  },
  {
    id: 'butterfly-archive',
    image: '06-exhibition.png',
    eyebrow: '06 / ARCHIVE',
    title: '展陈归档',
    description: '以展览目录的方式整理完整输出，呈现从研究到应用的视觉脉络。',
    caption: 'FIG. 05  ·  EXHIBITION ARCHIVE',
  },
]

const firstWorkContent = {
  eyebrow: '01 / TOOL EVOLUTION',
  title: '工具之变',
  description: '从古代天然染甲到现代专业美甲工具，美甲方式随着材料、制作工序与技术发展不断变化。作品以工具演变为主线，将染甲流程、工具类型与代表人物串联起来，呈现美甲工具从基础使用到专业化发展的过程。',
  caption: 'FIG.01 / TOOL EVOLUTION / 工具、工序与美甲方式的演变',
}

const artworkContent: Record<string, Pick<(typeof artworks)[number], 'eyebrow' | 'title' | 'description' | 'caption'>> = {
  '02-nail-trends.png': {
    eyebrow: '02 / STYLE & MATERIAL',
    title: '形制之变',
    description: '美甲的变化不仅体现在工具，也体现在材质、造型与装饰方式之中。作品从传统护甲套的材质、形状与制作方式展开，并延伸至现代美甲的纹样和流行形式，呈现不同时期美甲视觉形态的变化。',
    caption: 'FIG.02 / STYLE & MATERIAL / 材质、造型与装饰形式的变化',
  },
  '03-main-visual.png': {
    eyebrow: '03 / NAIL ECONOMY',
    title: '消费之变',
    description: '进入现代消费环境后，美甲逐渐从单一的装饰行为扩展为具有审美、社交与情绪属性的消费体验。作品通过市场趋势、消费人群、风格偏好与做美甲原因等信息，呈现当代美甲消费结构及用户需求的变化。',
    caption: 'FIG.03 / NAIL ECONOMY / 从审美行为到现代美甲消费',
  },
  '04-products.png': {
    eyebrow: '04 / CULTURE & IDENTITY',
    title: '观念之变',
    description: '从身份象征、装饰需求到审美表达与个性创造，美甲在不同历史阶段承载着不同的文化意义。作品以时间脉络串联女性形象与社会观念的变化，呈现美甲从身份与礼仪符号逐渐转向个人审美和自我表达的过程。',
    caption: 'FIG.04 / CULTURE & IDENTITY / 美甲文化、女性身份与审美观念的变化',
  },
}

type JourneySectionProps = {
  id: string
  index: string
  english: string
  title: string
  description: string
  image: string
  caption: string
}

type TrailParticle = {
  node: HTMLSpanElement
  bornAt: number
  lifetime: number
  x: number
  y: number
  driftX: number
  driftY: number
}

function ButterflyEffectLayer({ reducedMotion }: { reducedMotion: boolean | null }) {
  const butterflyRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLImageElement>(null)
  const particleLayerRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<TrailParticle[]>([])

  useEffect(() => {
    const butterfly = butterflyRef.current
    const art = artRef.current
    const particleLayer = particleLayerRef.current
    if (!butterfly || !art || !particleLayer) return

    const supportsPointerFollow = !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0, lastX: 0, lastY: 0, initialized: false }
    let pointerInside = false
    let frame = 0
    let nextParticleAt = 0
    let rotation = 0

    const idlePosition = () => ({ x: window.innerWidth * .76, y: window.innerHeight * .24 })
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const setTargetToIdle = () => {
      const idle = idlePosition()
      target.x = idle.x
      target.y = idle.y
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!supportsPointerFollow) return
      target.x = clamp(event.clientX + 34, 54, window.innerWidth - 54)
      target.y = clamp(event.clientY - 34, 54, window.innerHeight - 54)
      pointerInside = true
    }

    const handlePointerLeave = () => {
      pointerInside = false
      setTargetToIdle()
    }

    const setStaticPosition = () => {
      const idle = idlePosition()
      butterfly.style.left = `${idle.x}px`
      butterfly.style.top = `${idle.y}px`
      butterfly.style.transform = 'translate3d(-50%, -50%, 0)'
      art.style.transform = 'rotate(2deg) scale(1)'
    }

    if (reducedMotion) {
      setStaticPosition()
      return
    }

    const emitParticle = (now: number, x: number, y: number, vx: number, vy: number) => {
      if (trailRef.current.length >= 24) {
        trailRef.current.shift()?.node.remove()
      }
      const node = document.createElement('span')
      const size = 2 + Math.random() * 3
      node.style.width = `${size}px`
      node.style.height = `${size}px`
      particleLayer.appendChild(node)
      trailRef.current.push({
        node,
        bornAt: now,
        lifetime: 760 + Math.random() * 620,
        x: x - vx * (7 + Math.random() * 8) + (Math.random() - .5) * 14,
        y: y - vy * (7 + Math.random() * 8) + (Math.random() - .5) * 14,
        driftX: (Math.random() - .5) * .025,
        driftY: -.012 - Math.random() * .02,
      })
    }

    const tick = (now: number) => {
      if (!current.initialized) {
        const idle = idlePosition()
        current.x = idle.x
        current.y = idle.y
        current.lastX = idle.x
        current.lastY = idle.y
        target.x = idle.x
        target.y = idle.y
        current.initialized = true
      }
      if (!pointerInside) setTargetToIdle()

      current.lastX = current.x
      current.lastY = current.y
      const followStrength = supportsPointerFollow && pointerInside ? .04 : .018
      current.x += (target.x - current.x) * followStrength
      current.y += (target.y - current.y) * followStrength

      const velocityX = current.x - current.lastX
      const velocityY = current.y - current.lastY
      const tiltTarget = clamp(velocityX * .92, -8, 8)
      rotation += (tiltTarget - rotation) * .12
      const speed = Math.min(Math.hypot(velocityX, velocityY), 7)
      const time = now * .001
      const floatX = Math.cos(time * 1.1) * 3
      const floatY = Math.sin(time * 1.5) * 5
      const wing = Math.sin(now * .014) * 1.6
      const wingScale = 1 + Math.sin(now * .014) * .012

      butterfly.style.left = `${current.x}px`
      butterfly.style.top = `${current.y}px`
      butterfly.style.transform = `translate3d(-50%, -50%, 0) translate3d(${floatX}px, ${floatY}px, 0) rotate(${rotation}deg)`
      art.style.transform = `rotate(${wing}deg) scale(${1 + speed * .004}, ${wingScale})`

      if (supportsPointerFollow && pointerInside && speed > .08 && now >= nextParticleAt) {
        emitParticle(now, current.x + floatX, current.y + floatY, velocityX, velocityY)
        nextParticleAt = now + (speed > .35 ? 78 : 130)
      }

      trailRef.current = trailRef.current.filter((particle) => {
        const progress = (now - particle.bornAt) / particle.lifetime
        if (progress >= 1) {
          particle.node.remove()
          return false
        }
        const age = now - particle.bornAt
        particle.node.style.opacity = `${(1 - progress) * .72}`
        particle.node.style.transform = `translate3d(${particle.x + particle.driftX * age}px, ${particle.y + particle.driftY * age}px, 0) scale(${1 - progress * .45})`
        return true
      })

      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('mouseleave', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('mouseleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      trailRef.current.forEach(({ node }) => node.remove())
      trailRef.current = []
    }
  }, [reducedMotion])

  return <div className="butterfly-journey-page__hero-butterfly-layer" aria-hidden="true">
    <div className="butterfly-journey-page__hero-butterfly" ref={butterflyRef}>
      <img ref={artRef} src="/assets/projects/butterfly-journey/hero-butterfly.png" alt="" />
    </div>
    <div className="butterfly-journey-page__hero-particles" ref={particleLayerRef} />
  </div>
}

function JourneySection({ id, index, english, title, description, image, caption }: JourneySectionProps) {
  return <section id={id} className="journey-section butterfly-journey-page__chapter-section">
    <div className="journey-section-inner">
      <header className="journey-section-copy">
        <span>{index} / {english}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </header>
      <figure className="journey-section-figure">
        <div className="journey-figure-frame">
          <img className="journey-figure-image" src={asset(image)} alt={`《蝶变之旅》${title}`} loading="lazy" />
        </div>
        <small className="butterfly-journey-page__figure-caption">{caption}</small>
      </figure>
    </div>
  </section>
}

export default function ButterflyJourneyPage({ onBack }: { onBack: () => void }) {
  const reducedMotion = useReducedMotion()
  const pageRef = useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = useState(chapters[0].id)
  const { scrollY } = useScroll({ container: pageRef })
  const copyY = useTransform(scrollY, [0, 640], [0, -24])

  useEffect(() => {
    window.scrollTo(0, 0)
    const container = pageRef.current
    if (!container) return

    const targets = chapters
      .map(({ id }) => container.querySelector<HTMLElement>(`#${id}`))
      .filter((target): target is HTMLElement => Boolean(target))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveChapter(visible.target.id)
      },
      { root: container, rootMargin: '-36% 0px -48% 0px', threshold: [0.08, .24, .5] },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return <main ref={pageRef} className="butterfly-journey-page">
    <ButterflyEffectLayer reducedMotion={reducedMotion} />
    <motion.button className="butterfly-journey-page__back" type="button" onClick={onBack} initial={false}>
      <span aria-hidden="true">←</span> 返回作品
    </motion.button>

    <section id="butterfly-overview" className="butterfly-journey-page__hero butterfly-journey-page__chapter-section" aria-labelledby="butterfly-journey-title">
      <span className="butterfly-journey-page__hero-number" aria-hidden="true">03</span>
      <motion.div className="butterfly-journey-page__hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .76, delay: .1, ease }} style={reducedMotion ? undefined : { y: copyY }}>
        <p className="butterfly-journey-page__index">03 / 06</p>
        <span className="butterfly-journey-page__category">DATA VISUALIZATION · 2026</span>
        <h1 id="butterfly-journey-title">《蝶变之旅》</h1>
        <strong>美甲信息可视化设计</strong>
        <div className="butterfly-journey-page__guide" aria-label="项目视觉关键词"><i /><span>TOOL</span><span>STYLE</span><span>ECONOMY</span><span>CULTURE</span></div>
      </motion.div>

      <nav className="butterfly-journey-page__chapter-index" aria-label="章节索引">
        {chapters.map(({ id, label }) => <a className={activeChapter === id ? 'is-active' : ''} href={`#${id}`} key={id}>{label}<i /></a>)}
      </nav>
    </section>

    <section className="butterfly-journey-page__visual-narrative" aria-labelledby="butterfly-visual-narrative-title">
      <p>VISUAL NARRATIVE</p>
      <h2 id="butterfly-visual-narrative-title">四种变化，一段蝶变之旅</h2>
      <span>《蝶变之旅》围绕美甲的发展变化展开信息可视化设计，并从工具、形制、消费与文化观念四个方向组织内容。四组视觉作品从具体工具与形态逐步进入消费行为和社会文化，使美甲的发展过程形成一条连续的视觉叙事。</span>
    </section>

    <section id="butterfly-tool-evolution" className="butterfly-journey-page__first-work butterfly-journey-page__chapter-section" aria-label="《蝶变之旅》首张核心作品">
      <header className="journey-section-copy butterfly-journey-page__first-work-copy">
        <span>{firstWorkContent.eyebrow}</span>
        <strong>{firstWorkContent.title}</strong>
        <p>{firstWorkContent.description}</p>
      </header>
      <figure className="journey-figure">
        <div className="journey-figure-frame">
          <img className="journey-figure-image" src={asset('01-tool-flow.png')} alt="《蝶变之旅》美甲工具流程信息可视化主视觉" />
        </div>
      </figure>
      <small className="butterfly-journey-page__figure-caption">{firstWorkContent.caption}</small>
    </section>

    <section className="butterfly-journey-page__gallery" aria-label="《蝶变之旅》作品图集">
      {artworks.map((artwork, index) => {
        const content = artworkContent[artwork.image] ?? artwork
        if (index < 3) {
          const [chapterIndex, english] = content.eyebrow.split(' / ')
          return <JourneySection
            key={artwork.id}
            id={artwork.id}
            index={chapterIndex}
            english={english}
            title={content.title}
            description={content.description}
            image={artwork.image}
            caption={content.caption}
          />
        }
        return <figure id={artwork.id} className={`journey-figure butterfly-journey-page__gallery-item is-item-${index + 2} butterfly-journey-page__chapter-section`} key={artwork.id}>
          <figcaption className="journey-section-copy">
            <span>{content.eyebrow}</span>
            <strong>{content.title}</strong>
            <p>{content.description}</p>
          </figcaption>
          <div className="journey-figure-frame butterfly-journey-page__artwork-reveal">
            <img className="journey-figure-image" src={asset(artwork.image)} alt={`《蝶变之旅》${content.title}`} loading="lazy" />
          </div>
          <small className="butterfly-journey-page__figure-caption">{content.caption}</small>
        </figure>
      })}
    </section>
  </main>
}
