import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import AutoVideo from '../components/AutoVideo'
import MediaPreview from '../components/MediaPreview'
const videos = [
  { index: '01 / HOME EXPERIENCE', title: '首页反馈动效', description: '通过轻量页面反馈强化进入学习后的状态感知。', src: 'motion-home.gif' },
  { index: '02 / QUIZ FEEDBACK', title: '答题反馈动效', description: '以明确的结果反馈帮助儿童理解当前任务状态。', src: 'motion-map.gif' },
]
const ease = [0.2, 0, 0, 1] as const

export default function Motion() { const [preview, setPreview] = useState<{ type: 'image'; src: string; title: string } | null>(null); const reduced = useReducedMotion(); const asset=(name:string)=>`/assets/projects/baby-classroom/images/${name}`
  const enter = (delay = 0) => ({ initial: reduced ? { opacity: 0 } : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .25 }, transition: { duration: .5, delay, ease } })
  return <section id="motion" className="motion-section section"><div className="content"><motion.p className="eyebrow" {...enter()}>04 / MOTION DESIGN</motion.p><motion.h2 className="motion-title" {...enter(.1)}>让反馈，<span>更有温度</span></motion.h2><motion.p className="body-copy" {...enter(.2)}>简洁、有节制的动态提示，帮助儿童理解状态变化，也为每次完成注入小小的成就感。</motion.p><div className="motion-showcase motion-pair">{videos.map((video, index) => <motion.div className="motion-item" key={video.src} {...enter(.32 + index * .1)}><AutoVideo featured title={video.title} src={asset(video.src)} onPreview={() => setPreview({ type: 'image', title: video.title, src: asset(video.src) })} /><div className="motion-item-copy"><span>{video.index}</span><h3>{video.title}</h3><p>{video.description}</p></div></motion.div>)}</div></div><MediaPreview preview={preview} onClose={() => setPreview(null)} /></section> }
