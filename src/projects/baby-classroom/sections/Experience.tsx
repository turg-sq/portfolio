import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../components/Reveal'

const asset = (name: string) => `/assets/projects/baby-classroom/images/${name}`
const stages = [
  { number: '01', nav: 'ENTRY', eyebrow: '01 / LEARNING ENTRY', title: '学习入口', gif: '6.gif', alt: '宝宝小课堂首页与学习入口', tone: 'entry', copy: <>通过内容推荐、课程分类与每日成长模块，为儿童建立清晰直观的学习入口。<br />大尺寸图形与 IP 角色降低理解门槛，让内容选择更加轻松。</>, tags: ['内容分类', 'IP引导', '低门槛操作'] },
  { number: '02', nav: 'EXPLORE', eyebrow: '02 / EXPLORATORY LEARNING', title: '探索式学习', gif: '2.gif', alt: '宝宝小课堂路径闯关学习体验', tone: 'explore', copy: <>将课程拆解为连续的关卡路径，通过解锁、推进与场景探索，让学习过程具备明确的目标感。<br /><br />IP角色融入学习环境，在推进过程中持续提供陪伴与情绪引导。</>, tags: ['关卡推进', '场景探索', 'IP陪伴'] },
  { number: '03', nav: 'FEEDBACK', eyebrow: '03 / GROWTH FEEDBACK', title: '成长反馈', gif: '5.gif', alt: '宝宝小课堂每日测试与学习进度', tone: 'feedback', copy: <>通过每日测试、学习进度与任务完成状态，将学习成果转化为可感知的成长反馈。<br /><br />清晰的进度信息帮助儿童理解自己的学习状态，并形成持续学习动力。</>, tags: ['学习进度', '任务反馈', '持续成长'] },
] as const

function ExperienceStage({ stage, index, onActive }: { stage: typeof stages[number]; index: number; onActive: (index: number) => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { amount: .42 })
  useEffect(() => { if (inView) onActive(index) }, [inView, index, onActive])
  const transition = { duration: reduced ? 0 : .72, ease: [0.22, 1, 0.36, 1] as const }
  return <motion.article ref={ref} className={`experience-stage experience-stage--${stage.tone}`} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={transition}>
    <div className="experience-stage__copy"><p className="eyebrow">{stage.eyebrow}</p><h3>{stage.title}</h3><p className="experience-stage__body">{stage.copy}</p><ul className="experience-tags">{stage.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    <motion.figure className="experience-stage__media" initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .24 }} transition={{ ...transition, delay: reduced ? 0 : .14 }}>
      <img className="experience-main-gif" src={asset(stage.gif)} alt={stage.alt} />
    </motion.figure>
  </motion.article>
}

export default function Experience() {
  const [active, setActive] = useState(0)
  return <section id="experience" className="experience section"><div className="content experience-inner">
    <div className="experience-intro"><Reveal><p className="eyebrow">03 / APP EXPERIENCE</p></Reveal><div className="experience-title-wrap"><h2 className="experience-title">探索式<span>学习体验</span></h2></div><p className="body-copy">将学习路径拆解为进入、探索与反馈三个阶段，通过真实界面展示核心体验如何落地。</p></div>
    <div className="experience-layout"><nav className="experience-step-nav" aria-label="体验阶段导航">{stages.map((stage, index) => <a key={stage.nav} className={active === index ? 'active' : ''} href={`#experience-${stage.number}`}><b>{stage.number}</b><span>{stage.nav}</span></a>)}</nav><div className="experience-stages">{stages.map((stage, index) => <div id={`experience-${stage.number}`} key={stage.number}><ExperienceStage stage={stage} index={index} onActive={setActive} /></div>)}<section className="learning-loop" aria-label="一次完整学习旅程"><p>ONE LEARNING LOOP</p><h3>一次完整学习旅程</h3><ol>{['发现内容', '进入学习', '探索关卡', '完成任务', '获得反馈', '继续学习'].map((item, index) => <li key={item}><span>0{index + 1}</span><b>{item}</b>{index < 5 && <i>→</i>}</li>)}</ol></section></div></div>
  </div></section>
}
