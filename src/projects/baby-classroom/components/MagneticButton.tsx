import { motion, useReducedMotion } from 'framer-motion'
import { useState, type ReactNode } from 'react'

export default function MagneticButton({ href, children, className = 'primary-btn', target }: { href: string; children: ReactNode; className?: string; target?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  return <motion.a href={href} target={target} className={className} animate={reduced ? { x: 0, y: 0 } : offset} transition={{ type: 'spring', stiffness: 280, damping: 20, mass: .25 }} whileTap={{ scale: .98 }} onPointerMove={event => { if (reduced || event.pointerType !== 'mouse') return; const box = event.currentTarget.getBoundingClientRect(); setOffset({ x: (event.clientX - box.left - box.width / 2) * .07, y: (event.clientY - box.top - box.height / 2) * .07 }) }} onPointerLeave={() => setOffset({ x: 0, y: 0 })}>{children}</motion.a>
}
