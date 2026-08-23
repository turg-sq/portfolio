import { useEffect, useId, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import './liquid-glass-lens.css'

type Props = {
  heroRef: RefObject<HTMLElement | null>
  titleRef: RefObject<HTMLElement | null>
  visualRef: RefObject<HTMLElement | null>
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function createRadialDisplacementMap() {
  const size = 320
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: false })
  if (!context) return ''
  const image = context.createImageData(size, size)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = ((x + .5) / size - .5) * 2
      const ny = ((y + .5) / size - .5) * 2
      const radius = Math.hypot(nx, ny)
      const index = (y * size + x) * 4
      if (radius >= 1) {
        image.data[index] = 128
        image.data[index + 1] = 128
      } else {
        // The map follows a convex spherical normal: stable in the centre and strongest near the rim.
        const sphereZ = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
        const normalLength = Math.hypot(nx, ny, sphereZ) || 1
        const directionX = nx / normalLength
        const directionY = ny / normalLength
        const centerBulge = smoothstep(0, .35, radius) * .045
        const midRefraction = smoothstep(.35, .6, radius) * .13
        const outerRefraction = smoothstep(.6, .82, radius) * .38
        const edgePeak = smoothstep(.82, .94, radius) * .29
        const fadeOut = 1 - smoothstep(.94, 1, radius)
        const magnitude = (centerBulge + midRefraction + outerRefraction + edgePeak) * fadeOut * (1 + (1 - sphereZ) * .12)
        image.data[index] = clamp(Math.round(128 + directionX * magnitude * 127), 0, 255)
        image.data[index + 1] = clamp(Math.round(128 + directionY * magnitude * 127), 0, 255)
      }
      image.data[index + 2] = 128
      image.data[index + 3] = 255
    }
  }
  context.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}

export default function LiquidGlassLens({ heroRef, titleRef, visualRef }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const edgeRef = useRef<HTMLDivElement>(null)
  const cyanRef = useRef<HTMLDivElement>(null)
  const warmRef = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  const radialMap = useMemo(() => createRadialDisplacementMap(), [])

  useEffect(() => {
    const hero = heroRef.current
    const root = rootRef.current
    const lens = lensRef.current
    const base = baseRef.current
    const edge = edgeRef.current
    const cyan = cyanRef.current
    const warm = warmRef.current
    if (!hero || !root || !lens || !base || !edge || !cyan || !warm) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches || window.innerWidth < 1024) return

    const layers = [base, edge, cyan, warm]
    let halfWidth = 195
    let halfHeight = 115
    let frame = 0
    let running = false
    let visible = true
    let mode: 'blank' | 'title' | 'visual' = 'blank'
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let previousX = 0
    let previousY = 0
    let previousTime = performance.now()

    const setMode = (nextMode: typeof mode) => {
      if (mode === nextMode && edge.style.filter) return
      mode = nextMode
      root.dataset.mode = mode
      const filter = mode === 'title' ? id + '-strong' : mode === 'visual' ? id + '-soft' : id + '-calm'
      base.style.filter = `url(#${filter})`
      edge.style.filter = `url(#${filter})`
      cyan.style.filter = `url(#${filter}) saturate(1.12) hue-rotate(158deg)`
      warm.style.filter = `url(#${filter}) sepia(.16) saturate(1.2) hue-rotate(330deg)`
    }

    const cloneScene = () => {
      const source = hero.cloneNode(true) as HTMLElement
      source.querySelectorAll('[data-liquid-glass-lens]').forEach((element) => element.remove())
      source.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
      source.querySelectorAll('a,button,input,select,textarea').forEach((element) => {
        element.setAttribute('tabindex', '-1')
        element.setAttribute('aria-hidden', 'true')
      })
      source.setAttribute('aria-hidden', 'true')
      source.style.width = `${hero.clientWidth}px`
      source.style.height = `${hero.clientHeight}px`
      layers.forEach((layer) => {
        layer.replaceChildren(source.cloneNode(true))
      })
    }

    const stop = () => {
      running = false
      root.dataset.active = 'false'
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const tick = (time: number) => {
      if (!running || !visible) return
      const elapsed = Math.max(1, time - previousTime)
      currentX += (targetX - currentX) * .22
      currentY += (targetY - currentY) * .22
      const velocityX = (currentX - previousX) / elapsed
      const velocityY = (currentY - previousY) / elapsed
      previousX = currentX
      previousY = currentY
      previousTime = time

      const horizontal = clamp(Math.abs(velocityX) * .03, 0, .04)
      const vertical = clamp(Math.abs(velocityY) * .03, 0, .035)
      const scaleX = 1 + horizontal - vertical * .43
      const scaleY = 1 + vertical - horizontal * .5
      const rotation = clamp(velocityX * .63, -1, 1)
      const offsetX = halfWidth - currentX
      const offsetY = halfHeight - currentY

      lens.style.transform = `translate3d(${currentX - halfWidth}px, ${currentY - halfHeight}px, 0) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`
      layers.forEach((layer) => {
        layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      })
      frame = requestAnimationFrame(tick)
    }

    const inBounds = (element: HTMLElement | null, clientX: number, clientY: number) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    }

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !visible) return
      const rect = hero.getBoundingClientRect()
      const lensBounds = lens.getBoundingClientRect()
      halfWidth = lensBounds.width / 2
      halfHeight = lensBounds.height / 2
      targetX = currentX = previousX = event.clientX - rect.left
      targetY = currentY = previousY = event.clientY - rect.top
      previousTime = performance.now()
      cloneScene()
      root.dataset.active = 'true'
      setMode(inBounds(titleRef.current, event.clientX, event.clientY) ? 'title' : inBounds(visualRef.current, event.clientX, event.clientY) ? 'visual' : 'blank')
      running = true
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !running) return
      const rect = hero.getBoundingClientRect()
      targetX = event.clientX - rect.left
      targetY = event.clientY - rect.top
      setMode(inBounds(titleRef.current, event.clientX, event.clientY) ? 'title' : inBounds(visualRef.current, event.clientX, event.clientY) ? 'visual' : 'blank')
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) stop()
    }, { threshold: .08 })
    observer.observe(hero)
    hero.addEventListener('pointerenter', onEnter)
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', stop)

    return () => {
      stop()
      observer.disconnect()
      hero.removeEventListener('pointerenter', onEnter)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', stop)
    }
  }, [heroRef, id, titleRef, visualRef])

  return <div ref={rootRef} className="liquid-glass-lens" data-liquid-glass-lens data-active="false" data-mode="blank" aria-hidden="true"><svg className="liquid-glass-lens__defs" aria-hidden="true"><defs><filter id={`${id}-calm`} x="-14%" y="-14%" width="128%" height="128%"><feImage href={radialMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="radial-map" /><feDisplacementMap in="SourceGraphic" in2="radial-map" scale="20" xChannelSelector="R" yChannelSelector="G" /></filter><filter id={`${id}-soft`} x="-14%" y="-14%" width="128%" height="128%"><feImage href={radialMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="radial-map" /><feDisplacementMap in="SourceGraphic" in2="radial-map" scale="28" xChannelSelector="R" yChannelSelector="G" /></filter><filter id={`${id}-strong`} x="-14%" y="-14%" width="128%" height="128%"><feImage href={radialMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="radial-map" /><feDisplacementMap in="SourceGraphic" in2="radial-map" scale="38" xChannelSelector="R" yChannelSelector="G" /></filter></defs></svg><div ref={lensRef} className="liquid-glass-lens__body"><div ref={baseRef} className="liquid-glass-lens__scene liquid-glass-lens__scene--base" /><div ref={edgeRef} className="liquid-glass-lens__scene liquid-glass-lens__scene--edge" /><div ref={cyanRef} className="liquid-glass-lens__scene liquid-glass-lens__scene--cyan" /><div ref={warmRef} className="liquid-glass-lens__scene liquid-glass-lens__scene--warm" /><i className="liquid-glass-lens__specular liquid-glass-lens__specular--primary" /><i className="liquid-glass-lens__specular liquid-glass-lens__specular--secondary" /><i className="liquid-glass-lens__caustic" /></div></div>
}
