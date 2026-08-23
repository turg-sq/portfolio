import {useEffect,useRef,useState} from 'react'
import {motion,useReducedMotion} from 'framer-motion'
import type {SpiralProject} from '../../experiments/spiral/spiralProjects'
import './ae-live-gift.css'
import BabyLiquidGlassCursor from '../baby-classroom/components/BabyLiquidGlassCursor'

type AELiveGiftPageProps={onBack:()=>void;nextProject:SpiralProject;onOpenProject:(project:SpiralProject)=>void}

const enter={duration:.42,ease:[.22,1,.36,1] as const}

const goals=[
  ['01','短时识别','礼物需要在较短时间内完成主体出现、信息传递和结束收回。','rose'],
  ['02','视觉聚焦','通过层级、发光和装饰元素突出礼物主体，避免画面信息相互干扰。','orange'],
  ['03','界面适配','动效需要适应竖屏直播界面，避免遮挡主播、评论区和主要操作区域。','violet'],
]

const processSteps=[
  ['01','节奏设定','确定礼物出现、主体展开、停留和结束收回的整体时长。'],
  ['02','图层拆分','将主体、装饰、文字和粒子拆分为独立图层。'],
  ['03','动画制作','在 After Effects 中处理位移、缩放、透明度和缓动。'],
  ['04','界面测试','放回竖屏直播界面，检查遮挡、停留时间和视觉重点。'],
]

const visualRules=[
  ['01','发光','强化礼物出现时的视觉反馈。'],
  ['02','粒子','补充氛围和运动方向。'],
  ['03','层级','保证主体、文字和装饰关系清楚。'],
  ['04','缓动','避免礼物出现和消失过于生硬。'],
]

function SectionHeading({index,english,title,inverse=false}:{index:string;english:string;title:string;inverse?:boolean}){
  return <header className={`ae-section-heading ${inverse?'is-inverse':''}`}><span>{index}</span><div><p>{english}</p><h2>{title}</h2></div></header>
}

const motionSteps=[
  {index:'01',file:'gift-effect-02.gif',title:'宝箱礼物动效',label:'宝箱',description:'以宝箱开启为核心视觉，结合发光、弹出和奖励反馈，突出礼物出现时的惊喜感与互动氛围。',tone:'orange'},
  {index:'02',file:'gift-effect-03.gif',title:'戒指礼物动效',label:'戒指',description:'通过戒指主体的展示、光效变化和界面反馈，强化礼物的精致感与仪式感。',tone:'violet'},
  {index:'03',file:'gift-effect-01.gif',title:'城堡礼物动效',label:'城堡',description:'围绕城堡礼物的主体造型展开动态呈现，通过较强的体积感和入场感塑造更完整的视觉焦点。',tone:'rose'},
  {index:'04',file:'gift-effect-04.gif',title:'旋转木马礼物动效',label:'旋转木马',description:'利用旋转木马的结构与运动特征，营造更丰富的层次变化和更强的观赏性。',tone:'gold'},
]

export default function AELiveGiftPage({onBack,nextProject,onOpenProject}:AELiveGiftPageProps){
  const reducedMotion=useReducedMotion()
  const [activeMotionStep,setActiveMotionStep]=useState(0)
  const motionStepRefs=useRef<Array<HTMLElement|null>>([])
  const heroRef=useRef<HTMLElement>(null)

  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>{
      const activeEntry=entries
        .filter((entry)=>entry.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]
      if(activeEntry) setActiveMotionStep(Number((activeEntry.target as HTMLElement).dataset.motionStep))
    },{rootMargin:'-42% 0px -42% 0px',threshold:[0,.1,.5,.9]})

    motionStepRefs.current.forEach((step)=>step&&observer.observe(step))
    return()=>observer.disconnect()
  },[])
  return <main className="ae-live-gift-page">
    <button className="ae-live-gift-page__back" type="button" onClick={onBack}><span aria-hidden="true">←</span> 返回作品</button>

    <section ref={heroRef} className="ae-gift-hero">
      <span className="ae-gift-hero__rule" aria-hidden="true" />
      <span className="ae-gift-hero__side-label" aria-hidden="true">A / E / 礼 / 物 / 直 / 播</span>
      <div className="ae-gift-hero__footer-mark" aria-hidden="true"><span>2026</span><i /></div>
      <motion.div className="ae-gift-hero__copy" initial={reducedMotion?false:{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={enter}>
        <span className="ae-gift-eyebrow">05 / MOTION DESIGN</span>
        <h1>AE直播礼物设计</h1>
        <p className="ae-gift-hero__meta">Motion Design · 2026</p>
        <p className="ae-gift-hero__description">围绕直播礼物的动态反馈展开设计，通过角色、装饰元素和界面反馈的组合，使礼物在短时间内形成清晰、完整且具有氛围感的视觉呈现。</p>
      </motion.div>
      <motion.div className="ae-gift-hero__media" initial={reducedMotion?false:{opacity:0,y:22,rotate:0}} animate={{opacity:1,y:0,rotate:1.5}} transition={{...enter,delay:.08}}>
        <img src="/assets/projects/ae-live-gift/gifs/gift-effect-03.gif" alt="AE直播礼物主视觉动效" decoding="async" />
      </motion.div>
      <BabyLiquidGlassCursor heroRef={heroRef} />
    </section>

    <section className="ae-gift-goals ae-gift-section">
      <SectionHeading index="01" english="DESIGN GOALS" title="设计目标" />
      <div className="ae-gift-goal-grid">{goals.map(([index,title,body,tone],position)=><motion.article key={index} className={`ae-gift-goal-card is-${tone}`} initial={reducedMotion?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.22}} transition={{...enter,delay:position*.06}}><span>{index}</span><h3>{title}</h3><p>{body}</p><i aria-hidden="true" /></motion.article>)}</div>
    </section>

    <section className="ae-gift-process ae-gift-section">
      <SectionHeading index="02" english="PROCESS" title="设计过程" />
      <div className="ae-gift-process-track">{processSteps.map(([index,title,body],position)=><motion.article key={index} initial={reducedMotion?false:{opacity:0,x:22}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{...enter,delay:position*.06}}><span>{index}</span><h3>{title}</h3><p>{body}</p></motion.article>)}</div>
    </section>

    <section className="ae-gift-visual-system ae-gift-section">
      <SectionHeading index="03" english="VISUAL SYSTEM" title="视觉系统" />
      <div className="ae-gift-visual-grid">
        <div className="ae-gift-colors"><p className="ae-gift-panel-label">主色</p><div className="ae-gift-swatches"><span className="is-rose">粉色</span><span className="is-orange">橙色</span><span className="is-violet">紫色</span></div><p className="ae-gift-panel-label">辅助色</p><div className="ae-gift-support-colors"><span>白色</span><span>深灰</span><span>透明黑</span></div></div>
        <div className="ae-gift-visual-rules">{visualRules.map(([index,title,body])=><article key={index}><span>{index}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
      </div>
    </section>

    <section className={`ae-motion-showcase is-tone-${motionSteps[activeMotionStep].tone}`} aria-labelledby="ae-motion-showcase-title">
      <div className="ae-motion-showcase__sticky">
        <div className="ae-motion-showcase__inner">
          <div className="ae-motion-showcase__copy">
            <span className="ae-motion-showcase__eyebrow">04 / LIVE GIFT MOTION EFFECTS</span>
            <h2 id="ae-motion-showcase-title">直播礼物动效展示</h2>
            <div className="ae-motion-showcase__copy-stage" aria-live="polite">
              {motionSteps.map((step,position)=>{
                const isActive=position===activeMotionStep
                return <motion.div key={step.index} className="ae-motion-showcase__copy-item" aria-hidden={!isActive} animate={isActive?{opacity:1,y:0}:{opacity:0,y:position<activeMotionStep?-24:28}} transition={reducedMotion?{duration:0}:enter}>
                  <p className="ae-motion-showcase__counter">{step.index} / 04　{step.label}</p>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.div>
              })}
            </div>
          </div>
          <div className="ae-motion-showcase__stage" aria-label="直播礼物动效预览">
            {motionSteps.map((step,position)=>{
              const isActive=position===activeMotionStep
              return <motion.figure key={step.file} className="ae-motion-showcase__media" aria-hidden={!isActive}>
                <motion.img src={`/assets/projects/ae-live-gift/gifs/${step.file}`} alt={`${step.title} GIF 动效预览`} loading="eager" decoding="async" animate={isActive?{opacity:1,y:0,scale:1}:{opacity:0,y:position<activeMotionStep?-24:28,scale:.985}} transition={reducedMotion?{duration:0}:enter} />
              </motion.figure>
            })}
          </div>
        </div>
      </div>
      <div className="ae-motion-showcase__steps" aria-hidden="true">
        {motionSteps.map((step,position)=><article key={step.index} data-motion-step={position} ref={(node)=>{motionStepRefs.current[position]=node}} />)}
      </div>
      <div className="ae-motion-showcase__mobile-steps">
        {motionSteps.map((step,position)=><article key={step.index}>
          <span>04 / LIVE GIFT MOTION EFFECTS</span>
          <p>{step.index} / 04　{step.label}</p>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          <figure><img src={`/assets/projects/ae-live-gift/gifs/${step.file}`} alt={`${step.title} GIF 动效预览`} loading={position===0?'eager':'lazy'} decoding="async" /></figure>
        </article>)}
      </div>
    </section>

    <section className="ae-gift-summary ae-gift-section">
      <SectionHeading index="05" english="SUMMARY" title="项目总结" />
      <p>本项目通过对直播礼物出现节奏、视觉层级和界面适配的整理，将静态图形转化为更具反馈感的动态内容。设计过程中重点控制主体识别、动效时长和画面遮挡，使不同礼物在保持各自特点的同时形成相对统一的视觉表现。</p>
    </section>

    <button className="ae-gift-next" type="button" onClick={()=>onOpenProject(nextProject)}><span>下一个项目</span><strong>{nextProject.index} · {nextProject.title} →</strong></button>
  </main>
}
