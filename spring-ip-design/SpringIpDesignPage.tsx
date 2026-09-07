import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { SpiralProject } from '../../experiments/spiral/spiralProjects'
import './spring-ip-design.css'
import BabyLiquidGlassCursor from '../baby-classroom/components/BabyLiquidGlassCursor'

type Props = { project: SpiralProject; nextProject: SpiralProject; onBack: () => void; onOpenProject: (project: SpiralProject) => void }

const ease = [.22, 1, .36, 1] as const
const asset = (name: string) => `/assets/projects/su-ip-design/${name}`

const slides = [
  { kind: 'image', image: 'campaign-keyvisual.png', eyebrow: 'IP DESIGN', year: '2026', centerMark: '普小罗', variant: 'keyvisual' },
  { kind: 'image', image: 'hero-garden.png', eyebrow: 'CHARACTER WORLD', title: '普罗小番茄', copy: '把春天、探索与快乐装进一个角色。' },
  { kind: 'image', image: 'jimeng-2026-03-09-9605-参考图片风格，生成盲盒美学风格的番茄头卡通人物在童话森林场景中的图片，具有移轴摄... 1.png', eyebrow: 'SPRING CAMPAIGN', title: '踏春去！\n趣野不设限', copy: 'H5 INTERACTIVE EXPERIENCE · 2026', variant: 'scene' },
]

function Heading({ index, english, title, inverse = false }: { index: string; english: string; title: string; inverse?: boolean }) {
  return <header className={`spring-ip-heading ${inverse ? 'is-inverse' : ''}`}><span>{index}</span><div><p>{english}</p><h2>{title}</h2></div></header>
}

function ImageReveal({ src, alt, className = '', delay = 0 }: { src: string; alt: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.figure className={`spring-ip-image ${className}`} initial={reduced ? false : { opacity: 0, y: 36, scale: .99 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .14 }} transition={{ duration: .62, delay, ease }}><img src={asset(src)} alt={alt} loading="lazy" decoding="async" /></motion.figure>
}

function HeroBackground({ image, alt, active, reduced }: { image: string; alt: string; active: boolean; reduced: boolean | null }) {
  const [videoReady, setVideoReady] = useState(false)
  const isGardenVideo = image === 'hero-garden.png'
  const poster = asset(image)

  return <motion.div className="spring-ip-hero__background spring-ip-hero__background-media" initial={false} animate={{ scale: active ? 1 : 1.025 }} transition={reduced ? { duration: 0 } : { duration: .7, ease }}>
    <img src={poster} alt={alt} />
    {isGardenVideo && <video className={videoReady ? 'is-ready' : ''} autoPlay muted loop playsInline preload="metadata" poster={poster} onLoadedData={() => setVideoReady(true)} onCanPlay={() => setVideoReady(true)} onError={() => setVideoReady(false)} aria-hidden="true"><source src={asset('hero-garden.mp4')} type="video/mp4" /></video>}
  </motion.div>
}

function SummaryArtwork() {
  const reduced = useReducedMotion()
  return <motion.div className="spring-ip-summary__artwork" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .6, ease }}><p className="spring-ip-summary__caption">CHARACTER → CAMPAIGN → DIGITAL EXPERIENCE</p><figure className="spring-ip-image spring-ip-summary__visual"><img src={asset('spring-campaign-board.png')} alt="踏春去趣野不设限春游活动视觉板" loading="lazy" decoding="async" /></figure></motion.div>
}

function SummaryMetadata() {
  const reduced = useReducedMotion()
  const itemTransition = (delay: number) => ({ duration: .46, delay, ease })
  return <aside className="spring-ip-summary__metadata"><dl className="spring-ip-summary__metadata-list"><motion.div initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={itemTransition(0)}><dt>TYPE</dt><dd>IP DESIGN</dd></motion.div><motion.div initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={itemTransition(.075)}><dt>YEAR</dt><dd>2026</dd></motion.div><motion.div initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={itemTransition(.15)}><dt>ROLE</dt><dd>IP视觉 / 活动视觉 / H5设计</dd></motion.div><motion.div initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={itemTransition(.225)}><dt>TOOLS</dt><dd>Illustrator / Photoshop / After Effects</dd></motion.div></dl><motion.figure className="spring-ip-summary__flash-installation" initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .56, delay: .24, ease }}><img src={asset('flash-installation.png')} alt="踏春去趣野不设限快闪平面图" loading="lazy" decoding="async" /></motion.figure></aside>
}

function ScrollNarrative() {
  const reduced = useReducedMotion()
  return <section className={`spring-ip-scroll-story${reduced ? ' is-reduced' : ''}`} aria-label="角色与春日场景滚动叙事">
    <div className="spring-ip-scroll-story__stage">
      <div className="spring-ip-scroll-story__shape is-tomato" />
      <div className="spring-ip-scroll-story__shape is-cream" />
      <div className="spring-ip-scroll-story__grid"><motion.div className="spring-ip-scroll-story__copy" initial={reduced ? false : { opacity: .35, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .54, ease }}><p>CHARACTER WORLD</p><h2>普罗小番茄</h2><span>把好奇、探索与快乐<br />装进一个角色。</span></motion.div></div>
      <motion.img className="spring-ip-scroll-story__character" src={asset('character-hat.png')} alt="戴黄色帽子的普罗小番茄角色" initial={reduced ? false : { opacity: .55, y: 80, scale: .94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .7, delay: .08, ease }} />
      <motion.div className="spring-ip-scroll-story__campaign" initial={reduced ? false : { opacity: .25, y: 58, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, delay: .16, ease }}><img src={asset('campaign-keyvisual2.png')} alt="春日活动场景主视觉" /></motion.div>
      <motion.div className="spring-ip-scroll-story__campaign-copy" initial={reduced ? false : { opacity: .35, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .54, delay: .22, ease }}><p>04 / CAMPAIGN WORLD</p><span>SPRING SCENES</span><h2>春日场景延展</h2></motion.div>
    </div>
  </section>
}

function H5VisualGroup() {
  const reduced = useReducedMotion()
  return <motion.figure className="spring-ip-h5__visual" initial={reduced ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .24 }} transition={{ duration: .65, ease }}>
    <img src={asset('h5-phones.png')} alt="踏春去与儿童节活动 H5 双手机合成主视觉" loading="lazy" decoding="async" />
  </motion.figure>
}

export default function SpringIpDesignPage({ nextProject, onBack, onOpenProject }: Props) {
  const reduced = useReducedMotion()
  const [slide, setSlide] = useState(1)
  const [heroHovered, setHeroHovered] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    if (reduced || heroHovered) return
    const id = window.setInterval(() => setSlide(value => (value + 1) % slides.length), 6000)
    return () => window.clearInterval(id)
  }, [heroHovered, reduced])

  const moveSlide = (direction: number) => setSlide(value => (value + direction + slides.length) % slides.length)
  return <main className="spring-ip-page">
    <button className="spring-ip-page__back" type="button" onClick={onBack}><span aria-hidden="true">←</span> 返回作品</button>
    <section ref={heroRef} className="spring-ip-hero" aria-label="踏青春游 IP 视觉轮播" onPointerEnter={() => setHeroHovered(true)} onPointerLeave={() => setHeroHovered(false)}>
      {slides.map((item, index) => <motion.article key={item.eyebrow} className={`spring-ip-hero__slide is-${item.kind}${item.variant ? ` is-${item.variant}` : ''}`} initial={false} animate={{ opacity: index === slide ? 1 : 0 }} transition={reduced ? { duration: 0 } : { duration: .7, ease }} aria-hidden={index !== slide}>
        <HeroBackground image={item.image} alt={index === 0 ? '踏春去趣野不设限春游主视觉' : index === 1 ? '普罗小番茄花园场景' : '普罗小番茄春日场景'} active={index === slide} reduced={reduced} />
        <div className="spring-ip-hero__shade" />
        {item.centerMark && <strong className="spring-ip-hero__center-mark">{item.centerMark}</strong>}
        <div className="spring-ip-hero__copy"><p>{item.eyebrow}<br />{item.year}</p>{item.title && <h1>{item.title.split('\n').map(line => <span key={line}>{line}</span>)}</h1>}{item.copy && <strong>{item.copy}</strong>}</div>
      </motion.article>)}
      <button className="spring-ip-hero__arrow is-prev" type="button" aria-label="上一张视觉" onClick={() => moveSlide(-1)}>←</button>
      <button className="spring-ip-hero__arrow is-next" type="button" aria-label="下一张视觉" onClick={() => moveSlide(1)}>→</button>
      <div className="spring-ip-hero__progress"><span>{String(slide + 1).padStart(2, '0')} — 03</span><i><b style={{ transform: `scaleX(${(slide + 1) / 3})` }} /></i></div>
      <BabyLiquidGlassCursor heroRef={heroRef} />
    </section>

    <section className="spring-ip-campaign spring-ip-section"><div className="spring-ip-container"><Heading index="02 / CAMPAIGN" english="SPRING OUTING" title="踏春去！趣野不设限" /><div className="spring-ip-campaign__display"><b>SPRING<br />OUTING</b><ImageReveal src="campaign-keyvisual.png" alt="踏春去趣野不设限春游主视觉 KV" /></div></div></section>

    <section className="spring-ip-world spring-ip-section"><div className="spring-ip-container"><Heading index="03 / CAMPAIGN WORLD" english="SPRING SCENES" title="春日场景延展" /><p className="spring-ip-world__copy">通过花园、户外、自然元素和角色互动，将IP从单一形象扩展到完整的春游活动氛围。</p><div className="spring-ip-world__scene-pair"><ImageReveal src="campaign-keyvisual2.png" alt="六一儿童节春日活动场景主视觉" className="spring-ip-world__main spring-ip-world__scene-main" /><ImageReveal src="hero-garden.png" alt="花园中的番茄IP角色场景" className="spring-ip-world__scene-support" delay={.08} /></div></div></section>

    <ScrollNarrative />

    <section className="spring-ip-h5 spring-ip-section"><div className="spring-ip-container spring-ip-grid"><div className="spring-ip-h5__copy"><Heading index="04 / DIGITAL EXPERIENCE" english="H5" title="互动体验" /><p>围绕春游主题将IP角色延展到移动端活动页面，通过竖屏视觉、主题场景和角色内容形成连续的活动体验。</p><div className="spring-ip-h5__tags"><span>活动引导</span><span>主题互动</span><span>IP视觉统一</span></div></div><H5VisualGroup /></div></section>

    <section className="spring-ip-ip-system spring-ip-section"><div className="spring-ip-container"><div className="spring-ip-ip-system__heading"><Heading index="05 / IP VISUAL ARCHIVE" english="CHARACTER ARCHIVE" title="IP视觉陈列" /><p>Character System<br />Expression<br />Action<br />Visual Identity</p></div><div className="spring-ip-ip-system__grid spring-ip-grid"><ImageReveal src="character.png" alt="挥手的番茄IP主角色" className="is-primary" /><ImageReveal src="character2.png" alt="手持地图的番茄IP角色" className="is-map" delay={.06} /><ImageReveal src="character3.png" alt="惊讶表情的番茄IP角色" className="is-expression" delay={.12} /><aside className="spring-ip-ip-system__notes"><p>CHARACTER NOTES</p><ol><li><span>01</span>圆润比例</li><li><span>02</span>红蓝识别</li><li><span>03</span>表情变化</li><li><span>04</span>户外动作</li></ol></aside></div></div></section>

    <section className="spring-ip-poster spring-ip-section"><div className="spring-ip-container spring-ip-grid"><div className="spring-ip-poster__copy"><Heading index="06 / POSTER DESIGN" english="SPRING CAMPAIGN POSTER" title="海报设计" /><p>围绕春游主题与番茄IP形象，延展出具有活动传播属性的宣传海报，强化项目整体的视觉识别与场景表达。</p></div><ImageReveal src="海报1@2x.webp" alt="踏春去趣野不设限主题海报" className="spring-ip-poster__main" /><ImageReveal src="poster-provence-red-bag.png" alt="普罗旺斯番茄小红袋海报" className="spring-ip-poster__support" delay={.08} /></div></section>

    <section className="spring-ip-motion spring-ip-section"><div className="spring-ip-container"><Heading index="07 / MOTION" english="CHARACTER IN MOTION" title="角色动态实验" inverse /><div className="spring-ip-motion__grid"><ImageReveal src="motion-01.gif" alt="角色互动动态 GIF" /><ImageReveal src="motion-02.gif" alt="场景反馈动态 GIF" delay={.08} /></div><div className="spring-ip-motion__captions"><span>01　角色互动</span><span>02　场景反馈</span></div></div></section>

    <section className="spring-ip-summary spring-ip-section"><div className="spring-ip-container spring-ip-grid"><div className="spring-ip-summary__copy"><Heading index="08 / SUMMARY" english="FROM CHARACTER TO CAMPAIGN" title="从角色到活动场景" /><p>项目围绕番茄IP形象展开，通过角色视觉、春游主题主KV、移动端H5和动态内容等形式进行延展，使角色从单一形象逐步进入更完整的活动场景与数字体验中。</p></div><SummaryArtwork /><SummaryMetadata /></div></section>
    <button className="spring-ip-next" type="button" onClick={() => onOpenProject(nextProject)}><span>NEXT PROJECT</span><strong>{nextProject.title}</strong><em>{nextProject.category} · {nextProject.year}　→</em></button>
  </main>
}
