import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ProjectFilter, { type Filter } from './ProjectFilter'
import { editorialEase, useMotionSafe } from './MotionSafe'

type Props = { active: Filter; onFilter: (filter: Filter) => void; onClose: () => void; onOpenProject: (project: Project) => void; isOpeningDetail: boolean }
export default function WorksWindow({ active, onFilter, onClose, onOpenProject, isOpeningDetail }: Props) {
  const { reduced } = useMotionSafe(); const shown = active === 'All' ? projects : projects.filter(project => project.category === active)
  return <motion.section className="works-window" aria-label="Works 项目列表" initial={reduced ? { opacity: 0 } : { y: 80, opacity: 0, borderRadius: 30 }} animate={{ y: 0, opacity: 1, borderRadius: 1 }} exit={reduced ? { opacity: 0 } : { y: 80, opacity: 0, borderRadius: 22 }} transition={{ duration: reduced ? .16 : .58, ease: editorialEase }}>
    <header className="works-header"><div><span className="eyebrow">01 / SELECTED WORKS</span><h2>Works</h2></div><button className="back-button" onClick={onClose}>← 返回 Hero</button></header><ProjectFilter active={active} onChange={onFilter} />
    <AnimatePresence mode="popLayout"><motion.div layout className="project-grid">{shown.map((project, index) => <ProjectCard key={project.id} project={project} order={index} isLeaving={isOpeningDetail} onOpen={onOpenProject} />)}</motion.div></AnimatePresence>
  </motion.section>
}
