import { motion } from 'framer-motion'
import type { ProjectCategory } from '../data/projects'
import { editorialEase, useMotionSafe } from './MotionSafe'

export type Filter = 'All' | ProjectCategory
const filters: Filter[] = ['All', 'UI/UX', 'Branding', 'IP', 'Motion', 'Data Visualization']
export default function ProjectFilter({ active, onChange }: { active: Filter; onChange: (filter: Filter) => void }) {
  const { reduced } = useMotionSafe()
  return <div className="project-filter" aria-label="项目分类">
    {filters.map(filter => <button key={filter} aria-pressed={active === filter} onClick={() => onChange(filter)}>{active === filter && !reduced && <motion.span className="filter-marker" layoutId="active-filter" transition={{ duration: 0.22, ease: editorialEase }} />}<span>{filter}</span></button>)}
  </div>
}
