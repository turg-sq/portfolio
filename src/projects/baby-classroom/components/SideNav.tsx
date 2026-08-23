import { useEffect, useState } from 'react'
const links = [['overview', 'OVERVIEW'], ['goals', 'GOALS'], ['experience', 'EXPERIENCE'], ['motion', 'MOTION'], ['system', 'SYSTEM'], ['demo', 'DEMO']]

export default function SideNav() {
  const [active, setActive] = useState('overview'); const [progress, setProgress] = useState(0)
  useEffect(() => { const sections = links.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]; const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) }), { rootMargin: '-42% 0px -48% 0px' }); sections.forEach(s => observer.observe(s)); const scroll = () => setProgress(window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)); scroll(); addEventListener('scroll', scroll, { passive: true }); return () => { observer.disconnect(); removeEventListener('scroll', scroll) } }, [])
  return <><div className="progress-track" aria-hidden="true"><i style={{ transform: `scaleY(${progress})` }} /></div><nav className="side-nav" aria-label="案例章节导航">{links.map(([id, label], index) => <a className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} href={`#${id}`} key={id}><b>0{index + 1}</b><span>{label}</span></a>)}</nav></>
}
