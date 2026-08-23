import {useEffect,useRef} from 'react'
import {motion,useReducedMotion} from 'framer-motion'
import type {SpiralProject} from '../../experiments/spiral/spiralProjects'
import './red-sun-duck-egg.css'
import BabyLiquidGlassCursor from '../baby-classroom/components/BabyLiquidGlassCursor'

type RedSunDuckEggPageProps={project:SpiralProject;nextProject:SpiralProject;onBack:()=>void;onOpenProject:(project:SpiralProject)=>void}

const ease=[.22,1,.36,1] as const
const asset=(name:string)=>`/assets/projects/red-sun-duck-egg/${name}`

function SectionHeading({index,english,title,inverse=false}:{index:string;english:string;title:string;inverse?:boolean}){
  return <header className={`red-sun-heading ${inverse?'is-inverse':''}`}>
    <span>{index}</span><div><p>{english}</p><h2>{title}</h2></div>
  </header>
}

function RevealImage({src,alt,className='',delay=0,half=false}:{src:string;alt:string;className?:string;delay?:number;half?:boolean}){
  const reducedMotion=useReducedMotion()
  return <motion.figure className={`red-sun-image ${className}`} initial={reducedMotion?false:{opacity:0,y:half?28:36,scale:half?1:.99}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,amount:.16}} transition={{duration:.62,delay,ease}}>
    <img src={asset(src)} alt={alt} loading="lazy" decoding="async" />
  </motion.figure>
}

export default function RedSunDuckEggPage({project,nextProject,onBack,onOpenProject}:RedSunDuckEggPageProps){
  const reducedMotion=useReducedMotion()
  const heroRef=useRef<HTMLElement>(null)
  const scrollToSection=(selector:string)=>{
    document.querySelector(selector)?.scrollIntoView({behavior:'smooth',block:'start'})
  }
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  return <main className="red-sun-page">
    <button className="red-sun-page__back" type="button" onClick={onBack}><span aria-hidden="true">←</span> 返回作品</button>

    <section ref={heroRef} className="red-sun-hero" aria-labelledby="red-sun-title">
      <img className="red-sun-hero__backdrop" src={asset('product-scene.png')} alt="" aria-hidden="true" />
      <div className="red-sun-hero__overlay" aria-hidden="true" />
      <nav className="red-sun-hero__nav" aria-label="项目内导航">
        <button className="is-active" type="button" onClick={()=>scrollToSection('.red-sun-brand-story')}>品牌故事</button>
        <button type="button" onClick={()=>scrollToSection('.red-sun-overview')}>设计理念</button>
        <button type="button" onClick={()=>scrollToSection('.red-sun-packaging')}>包装系统</button>
        <button type="button" onClick={()=>scrollToSection('.red-sun-identity')}>视觉延展</button>
        <button type="button" onClick={()=>scrollToSection('.red-sun-application')}>应用展示</button>
      </nav>
      <motion.div className="red-sun-hero__copy" initial={reducedMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.62,ease}}>
        <p className="red-sun-hero__eyebrow">RED SUN DUCK EGG · PACKAGING SYSTEM · {project.year}</p>
        <h1 id="red-sun-title" className="red-sun-hero-title"><span>以包装为媒介</span><span>传递品牌温度</span></h1>
        <p className="red-sun-hero__description">以高邮地域文化为起点，重构品牌识别与包装系统，让传统风味以更完整的视觉语言进入现代礼赠场景。</p>
        <button className="red-sun-hero__cta" type="button" onClick={()=>scrollToSection('.red-sun-packaging')}>查看包装系统 <span aria-hidden="true">→</span></button>
      </motion.div>
      <div className="red-sun-hero__footer">
        <dl className="red-sun-hero__facts">
          <div><dt>TYPE</dt><dd>品牌包装设计</dd></div><div><dt>YEAR</dt><dd>{project.year}</dd></div><div><dt>ROLE</dt><dd>品牌视觉 / 包装设计</dd></div>
        </dl>
        <button className="red-sun-hero__scroll" type="button" onClick={()=>scrollToSection('.red-sun-overview')}><span>向下浏览</span><i aria-hidden="true" /></button>
      </div>
      <BabyLiquidGlassCursor heroRef={heroRef} />
    </section>

    <section className="red-sun-overview red-sun-section">
      <div className="red-sun-overview__grid red-sun-grid">
        <div className="red-sun-overview__copy">
          <SectionHeading index="01" english="PROJECT OVERVIEW" title="项目概览" />
          <p>红太阳咸鸭蛋包装以高邮地域产品为设计对象，通过鸭、芦苇、水域和蛋黄等视觉元素建立品牌识别，并将米白、砖红与暖金应用于礼盒和手提袋系统，使传统食品包装保持地域特点的同时具备较完整的礼赠属性。</p>
          <dl className="red-sun-overview__meta" aria-label="项目资料">
            <div><dt>TYPE</dt><dd>品牌包装设计</dd></div>
            <div><dt>YEAR</dt><dd>{project.year}</dd></div>
            <div><dt>ROLE</dt><dd>品牌视觉 / 包装设计</dd></div>
          </dl>
        </div>
        <RevealImage src="hero-scene.png" alt="红太阳咸鸭蛋品牌与包装场景" className="red-sun-overview__visual" />
      </div>
    </section>

    <section className="red-sun-role red-sun-section">
      <SectionHeading index="01.5 / ROLE & TOOLS" english="" title="项目职责与工具" />
      <div className="red-sun-role__grid">
        <article><span>项目职责</span><p>负责品牌视觉、标志与包装系统设计，并完成礼盒、手提袋及应用场景的视觉延展，统一项目整体视觉语言。</p></article>
        <article><span>Adobe Illustrator</span><p>用于标志、包装版式及鸭、芦苇、水纹等矢量元素的绘制与整理，并完成包装相关图形规范。</p></article>
        <article><span>Adobe Photoshop</span><p>用于包装效果图与应用场景合成、图片精修及色彩统一，完成最终展示视觉的细节处理。</p></article>
      </div>
    </section>

    <section className="red-sun-packaging red-sun-section">
      <SectionHeading index="02" english="PACKAGING SYSTEM" title="包装系统" inverse />
      <div className="red-sun-packaging__intro"><p>围绕礼盒的外观、结构与视觉延展进行统一设计，通过米白与砖红形成主要色彩关系，并将鸭、芦苇和水域元素延续到包装正面、侧面及展开结构中。</p></div>
      <RevealImage src="5.1 完整1.png" alt="红太阳咸鸭蛋礼盒与手提袋完整包装系统" className="red-sun-packaging__main" />
      <div className="red-sun-packaging__details red-sun-grid">
        <RevealImage src="box-render.png" alt="红太阳咸鸭蛋礼盒成品展示" half />
        <RevealImage src="刀版 [已恢复] 1 2.png" alt="红太阳咸鸭蛋包装展开刀版" className="red-sun-packaging__dieline" delay={.08} />
      </div>
      <div className="red-sun-packaging__keywords">
        <article><span>01</span><h3>礼盒结构</h3><p>通过包装开合与层次关系形成完整的礼赠展示。</p></article>
        <article><span>02</span><h3>视觉延展</h3><p>鸭、芦苇、水纹与品牌标志在不同包装面保持一致。</p></article>
        <article><span>03</span><h3>色彩关系</h3><p>米白与砖红构成主要识别关系，暖金承担细节强调。</p></article>
      </div>
    </section>

    <section className="red-sun-product-display red-sun-section">
      <SectionHeading index="03" english="PRODUCT DISPLAY" title="产品场景展示" />
      <RevealImage src="product-scene.png" alt="红太阳咸鸭蛋产品场景展示" className="red-sun-product-display__image" />
    </section>

    <section className="red-sun-festival red-sun-section">
      <SectionHeading index="04" english="FESTIVAL CAMPAIGN" title="节庆视觉延展" />
      <div className="red-sun-festival__intro"><h3>端午节主题延展</h3><p>通过不同场景色调展示包装在节庆传播中的应用，使产品主体在绿色竹影和暖橙松木场景中保持统一识别。</p></div>
      <div className="red-sun-festival__gallery red-sun-grid"><RevealImage src="festival-green.png" alt="红太阳咸鸭蛋节庆绿色场景" className="is-green" half /><RevealImage src="festival-orange.png" alt="红太阳咸鸭蛋节庆暖橙场景" className="is-orange" delay={.08} half /></div>
    </section>

    <section className="red-sun-brand-story red-sun-section">
      <div className="red-sun-brand-story__layout red-sun-grid"><aside><SectionHeading index="05" english="BRAND STORY" title="品牌故事" /><ul><li>品牌传承</li><li>生态优养</li><li>古法腌制</li><li>真材实料</li></ul></aside><RevealImage src="brand-long-page.png" alt="红太阳咸鸭蛋品牌故事长页" /></div>
    </section>

    <section className="red-sun-identity red-sun-section">
      <SectionHeading index="06" english="BRAND IDENTITY" title="品牌识别" />
      <div className="brand-identity-content red-sun-identity__grid red-sun-grid"><RevealImage src="brand-logo.png" alt="红太阳咸鸭蛋品牌标志展示" className="brand-identity-visual" /><motion.div className="brand-identity-copy" initial={reducedMotion?false:{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.54,ease}}><p className="brand-identity-copy__eyebrow">01 / LOGO SYSTEM</p><h3>标志设计</h3><p>标志以太阳、水域和蛋黄形态建立关联，通过红色与橙色形成品牌识别，并与包装中的鸭、芦苇和水纹元素保持一致。</p></motion.div><div className="red-sun-identity__index" aria-label="品牌系统索引"><span>SYMBOL</span><span>COLOR</span><span>PATTERN</span><span>TYPE</span></div><div className="red-sun-identity__brand-system"><div className="red-sun-identity__brand-copy"><p>02 / BRAND SYSTEM</p><h3>视觉延展</h3><p>围绕红太阳品牌标志、米白与砖红色彩及水域纹样建立统一视觉语言，使标志、包装与应用场景保持一致的品牌识别。</p></div><RevealImage src="brand-story.png" alt="红太阳咸鸭蛋品牌视觉故事" className="brand-identity-story-image" /></div></div>
    </section>

    <section className="red-sun-application red-sun-section">
      <SectionHeading index="07" english="APPLICATION" title="应用展示" />
      <div className="red-sun-application__gallery red-sun-grid"><RevealImage src="card-application.png" alt="红太阳咸鸭蛋应用物料" className="is-primary" /><RevealImage src="目录页.png" alt="红太阳咸鸭蛋礼赠应用展示" className="is-secondary" /></div>
    </section>

    <section className="red-sun-summary red-sun-section"><SectionHeading index="08" english="SUMMARY" title="项目总结" /><p>本项目围绕高邮咸鸭蛋的产品属性与地域视觉元素，对品牌标志、包装结构、节庆画面和应用物料进行了统一整理，使礼盒、手提袋与传播画面形成相对完整的视觉关系。</p></section>
    <button className="red-sun-next" type="button" onClick={()=>onOpenProject(nextProject)}><span>下一个项目</span><strong>{nextProject.index} · {nextProject.title} →</strong></button>
  </main>
}
