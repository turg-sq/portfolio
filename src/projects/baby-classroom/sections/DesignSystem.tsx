import { motion } from 'framer-motion'
import { Reveal, TitleReveal } from '../components/Reveal'

const designSpecReference = '/assets/projects/baby-classroom/visual-system/design-spec.svg'

export default function DesignSystem() {
  return <section id="system" className="visual-system section">
    <div className="content visual-system__inner">
      <Reveal><p className="eyebrow">03 / VISUAL SYSTEM</p></Reveal>
      <TitleReveal><h2>轻快、一致的视觉<span>语言</span></h2></TitleReveal>
      <p className="visual-system__intro">从字体层级、导航图标到功能入口和色彩，建立清晰、亲和的儿童教育产品视觉基础。</p>
      <div className="visual-system__grid">
        <motion.article className="visual-system__full-reference" whileHover={{ y: -6 }}>
          <img src={designSpecReference} alt="宝宝小课堂完整视觉规范" />
        </motion.article>
        <motion.article className="visual-system__colors" whileHover={{ y: -6 }}>
          <b>COLOR / 03</b>
          <h3>色彩系统</h3>
          <p className="visual-system__color-intro">以蓝色建立清晰、理性的学习基础，以橙黄作为奖励与重点提示，配合浅蓝和中性色形成轻快、亲和的儿童教育视觉体验。</p>
          <img className="visual-system__color-reference" src="/assets/projects/baby-classroom/visual-system/color-spec.svg" alt="原始颜色规范" />
        </motion.article>
      </div>
    </div>
  </section>
}
