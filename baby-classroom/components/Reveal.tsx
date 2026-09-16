import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: .35, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .56, delay, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>
}

export function TitleReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={`title-reveal ${className}`} initial={reduced ? false : { clipPath: 'inset(0 12% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .62, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>
}
