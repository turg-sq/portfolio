import {playUIBack} from '../lib/uiSound'
import './contact-page.css'

export default function ContactPage({onBack}:{onBack:()=>void}){
  return <main className="contact-page">
    <button className="contact-page__back" type="button" onClick={()=>{playUIBack();onBack()}}>← 返回首页</button>
    <section className="contact-page__stage" aria-label="自我介绍"><img src="/assets/contact/self-intro.png" alt="自我介绍" /></section>
  </main>
}
