import type { Transition } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export const editorialEase = [0.2, 0, 0, 1] as const

export function useMotionSafe() {
  const reduced = useReducedMotion()
  const transition: Transition = reduced ? { duration: 0.01 } : { duration: 0.45, ease: editorialEase }
  return { reduced: Boolean(reduced), transition }
}
