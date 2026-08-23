import {motion} from 'framer-motion'
import ProjectImage from './ProjectImage'
import type {SpiralProject} from './spiralProjects'

type ProjectDetailProps={project:SpiralProject;nextProject:SpiralProject;onBack:()=>void;onOpenProject:(project:SpiralProject)=>void}

const sections=['项目背景','设计目标','设计过程','视觉系统','设计成果','项目反思','更多探索']

const aeLiveGiftCopy=[
  {title:'项目背景',body:'直播礼物不仅承担互动反馈功能，也会直接影响直播间的氛围和用户送礼时的情绪体验。本项目围绕直播礼物的动态表现展开设计，通过角色、装饰元素和界面反馈的组合，让礼物从普通图标转化为更具识别度和观看感的动态内容。'},
  {title:'设计目标',body:'设计重点是让礼物动效在短时间内完成信息传达，同时保持画面完整和主体突出。动效需要适应竖屏直播界面，避免遮挡主播和评论区，并通过节奏、层级和视觉重点强化礼物出现时的反馈感。'},
  {title:'设计过程',body:'制作过程中先确定礼物出现、主体展开和结束收回的基本节奏，再将画面拆分为主体、装饰、文字和粒子等图层，在 After Effects 中分别处理位移、缩放、透明度和缓动。通过多次预览调整停留时间和运动幅度，使动效在保持流畅的同时不会显得拖沓。'},
  {title:'视觉系统',body:'视觉风格延续直播界面中偏明亮、活跃的氛围，以粉色、橙色和紫色作为主要点缀色，并通过高光、粒子和装饰图形增强礼物的层次。不同礼物在造型上保持各自特点，但在运动节奏、发光方式和结束状态上使用相近规则，使整组作品具有统一感。'},
]

const aeGiftEffects=[
  'gift-effect-01.gif',
  'gift-effect-02.gif',
  'gift-effect-03.gif',
  'gift-effect-04.gif',
]

export default function ProjectDetail({project,nextProject,onBack,onOpenProject}:ProjectDetailProps){
  const detailSections=project.id==='ae-live-gift'?aeLiveGiftCopy:sections.map(title=>({title,body:'项目内容待补充'}))
  return <motion.main className="project-detail" role="main" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.46,ease:[.22,1,.36,1]}}>
    <article className="project-detail__surface">
      <header className="project-detail__topbar">
        <button className="project-detail__back" type="button" onClick={onBack} aria-label="返回作品列表">← 返回作品</button>
        <span>{project.index} / 0{5}</span>
      </header>
      <section className="project-detail__hero" aria-labelledby="project-detail-title">
        <motion.div className="project-detail__intro" initial={{opacity:0,x:-22}} animate={{opacity:1,x:0}} transition={{delay:.08,duration:.42,ease:[.22,1,.36,1]}}>
          <p>{project.category} · {project.year}</p>
          <h1 id="project-detail-title">{project.title}</h1>
          <span>{project.subtitle}</span>
        </motion.div>
        <motion.figure className="project-detail__cover" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay:.12,duration:.52,ease:[.22,1,.36,1]}}>
          <ProjectImage src={project.cover} alt={`${project.title}项目封面`} priority/>
        </motion.figure>
      </section>
      <span className="project-detail__scroll-cue" aria-hidden="true">向下滚动 ↓</span>
      <section className={`project-detail__content ${project.id==='ae-live-gift'?'project-detail__content--ae':''}`} aria-label="项目内容">
        {detailSections.map((section,index)=><article key={section.title} className="project-detail__section">
          <span>0{index+1}</span>
          <div><h2>{section.title}</h2>{section.body&&<p>{section.body}</p>}</div>
        </article>)}
      </section>
      {project.id==='ae-live-gift'&&<section className="ae-gift-motion-section" aria-labelledby="ae-gift-motion-title">
        <header className="ae-gift-motion-section__header">
          <span>05</span>
          <div><p>LIVE GIFT MOTION EFFECTS</p><h2 id="ae-gift-motion-title">直播礼物动效展示</h2></div>
        </header>
        <div className="ae-gift-motion-grid">
          {aeGiftEffects.map((effect,index)=><motion.figure key={effect} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.14}} transition={{duration:.42,delay:index*.06,ease:[.22,1,.36,1]}}>
            <img src={`/assets/projects/ae-live-gift/gifs/${effect}`} alt={`直播礼物动效展示 ${index+1}`} loading="lazy" decoding="async" />
          </motion.figure>)}
        </div>
      </section>}
      <button className="project-detail__next" type="button" onClick={()=>onOpenProject(nextProject)}>
        <span>下一个项目</span><strong>{nextProject.index} · {nextProject.title} →</strong>
      </button>
    </article>
  </motion.main>
}
