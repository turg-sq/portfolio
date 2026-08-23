import { motion } from 'framer-motion'
import { Reveal, TitleReveal } from '../components/Reveal'

const enter = (delay: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .16 }, transition: { delay, duration: .42, ease: [0.22, 1, 0.36, 1] as const } })

export default function DesignGoal() {
  return (
    <section id="goals" className="goals section">
      <div className="content goals-content">
        <header className="goals-header">
          <div>
            <Reveal><p className="eyebrow">02 / DESIGN GOALS</p></Reveal>
            <TitleReveal><h2>设计目标</h2></TitleReveal>
          </div>
          <Reveal delay={.1}><p>围绕儿童真实使用感受，建立四项核心体验原则。</p></Reveal>
        </header>
        <div className="goal-grid">
          <motion.article className="goal-card goal-card--learning" {...enter(0)}><div className="goal-copy"><span className="goal-number">01</span><h3>趣味学习</h3><p>用可探索的内容，让学习自然发生。</p></div><div className="goal-proof"><img src="/assets/projects/baby-classroom/images/Frame 33897.png" alt="趣味学习入口界面" /></div></motion.article>
          <motion.article className="goal-card goal-card--companion" {...enter(.08)}><div className="goal-copy"><span className="goal-number">02</span><h3>IP陪伴</h3><p>温暖的熊猫伙伴，陪孩子每一步成长。</p></div><div className="goal-proof"><img src="/assets/projects/baby-classroom/images/熊猫旁png 2.png" alt="熊猫陪伴角色" /></div></motion.article>
          <motion.article className="goal-card goal-card--feedback" {...enter(.16)}><div className="goal-copy"><span className="goal-number">03</span><h3>游戏反馈</h3><p>即时的鼓励，建立持续学习动力。</p></div><div className="goal-proof"><img className="goal-proof__primary" src="/assets/projects/baby-classroom/images/弹窗.png" alt="完成任务后的奖励兑换反馈界面" /></div></motion.article>
          <motion.article className="goal-card goal-card--friendly" {...enter(.24)}><div className="goal-copy"><span className="goal-number">04</span><h3>儿童友好</h3><p>更大、更清晰、更容易理解的界面。</p></div><div className="goal-proof"><img className="goal-proof__primary" src="/assets/projects/baby-classroom/images/Frame 33898.png" alt="儿童友好图形化功能入口" /></div></motion.article>
        </div>
      </div>
    </section>
  )
}
