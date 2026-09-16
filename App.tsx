import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Project } from './data/projects'
import { projects } from './data/projects'
import type { Filter } from './components/ProjectFilter'
import ProjectDetail from './components/ProjectDetail'
import WorksWindow from './components/WorksWindow'
import PortfolioHero from './sections/PortfolioHero'

type View = 'hero' | 'works' | 'detail'
const stateFor = (view: View, filter: Filter, slug?: string | null) => ({ view, filter, slug: slug ?? null })
export default function App() {
  const [view, setView] = useState<View>('hero'); const [filter, setFilter] = useState<Filter>('All'); const [project, setProject] = useState<Project | null>(null); const worksScroll = useRef(0)
  useEffect(() => { history.replaceState(stateFor('hero', 'All'), '') }, [])
  useEffect(() => { const pop = (event: PopStateEvent) => { const next = event.state as ReturnType<typeof stateFor> | null; if (!next) return; setFilter(next.filter); if (next.view === 'detail' && next.slug) { const found = projects.find(item => item.slug === next.slug) ?? null; setProject(found); setView(found ? 'detail' : 'works') } else { setView(next.view); if (next.view === 'works') requestAnimationFrame(() => window.scrollTo(0, worksScroll.current)) } }; addEventListener('popstate', pop); return () => removeEventListener('popstate', pop) }, [])
  const openWorks = () => { setView('works'); history.pushState(stateFor('works', filter), '') }
  const closeWorks = () => { worksScroll.current = scrollY; setView('hero'); history.pushState(stateFor('hero', filter), '') }
  const openProject = (next: Project) => { worksScroll.current = scrollY; setProject(next); setView('detail'); history.pushState(stateFor('detail', filter, next.slug), '') }
  const backToWorks = () => { setView('works'); history.pushState(stateFor('works', filter), ''); requestAnimationFrame(() => scrollTo({ top: worksScroll.current, behavior: 'auto' })) }
  return <main><PortfolioHero leaving={view !== 'hero'} onWorks={openWorks} /><aside className="state-rail" aria-label="当前章节"><span className={view === 'hero' ? 'active' : ''}>Hero</span><span className={view === 'works' ? 'active' : ''}>Works</span><span className={view === 'detail' ? 'active' : ''}>Detail</span></aside><AnimatePresence mode="sync">{view !== 'hero' && <WorksWindow key="works" active={filter} onFilter={setFilter} onClose={closeWorks} onOpenProject={openProject} isOpeningDetail={view === 'detail'} />}{view === 'detail' && project && <ProjectDetail key="detail" project={project} onBack={backToWorks} />}</AnimatePresence></main>
}
