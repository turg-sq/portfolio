let clickSound: HTMLAudioElement | null = null
let backSound: HTMLAudioElement | null = null
let previewSound: HTMLAudioElement | null = null
let previewFade = 0

export function playUIClick() {
  if (typeof Audio === 'undefined') return
  clickSound ??= new Audio('/sounds/ui-click.wav')
  clickSound.preload = 'auto'
  clickSound.volume = .22
  clickSound.currentTime = 0
  void clickSound.play().catch(() => {})
}

export function playUIBack() {
  if (typeof Audio === 'undefined') return
  backSound ??= new Audio('/sounds/ui-back.wav')
  backSound.preload = 'auto'
  backSound.volume = .18
  backSound.currentTime = 0
  void backSound.play().catch(() => {})
}

export function playProjectPreviewSound() {
  if (typeof Audio === 'undefined') return
  if (previewFade) cancelAnimationFrame(previewFade)
  previewSound ??= new Audio('/sounds/project-preview.mp3')
  previewSound.loop = false
  previewSound.volume = .10
  previewSound.currentTime = 0
  void previewSound.play().catch(() => {})
}

export function stopProjectPreviewSound(duration = 220) {
  if (!previewSound) return
  if (previewFade) cancelAnimationFrame(previewFade)
  const sound = previewSound
  const start = performance.now()
  const initial = sound.volume
  const fade = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    sound.volume = initial * (1 - progress)
    if (progress < 1) { previewFade = requestAnimationFrame(fade); return }
    sound.pause(); sound.currentTime = 0; sound.volume = .10; previewFade = 0
  }
  previewFade = requestAnimationFrame(fade)
}
