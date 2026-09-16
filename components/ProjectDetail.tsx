import { motion, useScroll, useTransform } from 'framer-motion'
import type { Project } from '../data/projects'
import { coverLayoutId } from './ProjectCard'
import { editorialEase, useMotionSafe } from './MotionSafe'

export default function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const { reduced } = useMotionSafe(); const { scrollY } = useScroll(); const visualY = useTransform(scrollY, [0, 800], [0, reduced ? 0 : -10]); const enter = (delay: number) => reduced ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: .15 } } : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: .3, ease: editorialEase } }
  return <motion.section className="detail-window" initial={reduced ? { opacity: 0 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? .15 : .22 }} aria-label={`${project.title} 临时项目详情`}>
    <motion.button className="back-button" onClick={onBack} {...enter(.62)}>← 返回 Works</motion.button><motion.div style={{ y: visualY }}><motion.div layoutId={coverLayoutId(project)} style={{ '--project-color': project.themeColor } as React.CSSProperties} className="detail-visual"><span>{project.index}</span><strong>临时主视觉占位</strong><i>PROLO / RED BAG</i></motion.div></motion.div>
    <div className="detail-copy"><motion.p {...enter(.55)} className="eyebrow">{project.index} / {project.year} / {project.category}</motion.p><motion.h2 {...enter(.63)}>{project.title}</motion.h2><motion.h3 {...enter(.71)}>{project.subtitle}</motion.h3><motion.p {...enter(.79)}>{project.summary} 此页面仅用于验证项目卡片与详情页之间的结构和转场；尚未加入项目图像或未确认的案例内容。</motion.p></div>
  </motion.section>
}
