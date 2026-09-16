import { motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { editorialEase, useMotionSafe } from './MotionSafe'

export const coverLayoutId = (project: Project) => project.slug === 'prolo-red-bag' ? 'project-cover-provence-small-red-bag' : `project-cover-${project.slug}`
export default function ProjectCard({ project, onOpen, isLeaving, order }: { project: Project; onOpen: (project: Project) => void; isLeaving: boolean; order: number }) {
  const { reduced } = useMotionSafe(); const openable = project.slug === 'prolo-red-bag'
  return <motion.article layout="position" className={`project-card ${project.featured ? 'is-featured' : ''}`} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: isLeaving && !openable ? .32 : 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }} transition={{ duration: reduced ? .14 : .22, delay: reduced ? 0 : order * .06, ease: editorialEase }}>
    <button className="project-card-button" onClick={() => openable && onOpen(project)} disabled={!openable} aria-label={openable ? `查看 ${project.title} 临时详情` : `${project.title}，详情暂未开放`}>
      <motion.div layoutId={coverLayoutId(project)} className="project-cover" style={{ '--project-color': project.themeColor } as React.CSSProperties} whileHover={reduced ? undefined : { scale: 1.02 }} whileTap={reduced ? undefined : { scale: .985 }} transition={{ duration: .18, ease: editorialEase }}><span className="cover-index">{project.index}</span><span className="cover-caption">TEMPORARY<br />LAYOUT COVER</span><span className="cover-shape" aria-hidden="true" /></motion.div>
      <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div><h3>{project.title}<i aria-hidden="true">→</i></h3><p>{project.subtitle}</p><span className="card-interaction">{openable ? 'View Project →' : '项目详情 · 后续开放'}</span>
    </button>
  </motion.article>
}
