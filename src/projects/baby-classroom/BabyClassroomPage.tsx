import {useEffect} from 'react'
import SideNav from './components/SideNav'
import DesignGoal from './sections/DesignGoal'
import DesignSystem from './sections/DesignSystem'
import Experience from './sections/Experience'
import FinalDemo from './sections/FinalDemo'
import Hero from './sections/Hero'
import Motion from './sections/Motion'
import Overview from './sections/Overview'
import './baby-classroom.css'

export default function BabyClassroomPage({onBack}:{onBack:()=>void}){
  useEffect(()=>{
    window.scrollTo({top:0,behavior:'instant'})
  },[])
  return <main className="baby-classroom-page">
    <style>{`
      @media (min-width: 900px) {
        .baby-classroom-page .hero h1 { white-space: nowrap; font-size: clamp(72px, 7vw, 112px); line-height: .9; letter-spacing: -.04em; text-wrap: nowrap; }
      }
      @media (min-width: 1001px) {
        .baby-classroom-page .hero { overflow: visible; }
        .baby-classroom-page .hero-inner { width: min(1480px, calc(100vw - 120px)); min-height: 100svh; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: center; }
        .baby-classroom-page .hero-stage { grid-column: 1 / span 6; width: 100%; height: min(78svh, 760px); min-height: 0; align-self: center; justify-self: center; overflow: visible; transform: translate(52px, -16px); transform-origin: center; }
        .baby-classroom-page .hero-phone-scroll { width: 100%; height: 100%; display: grid; place-items: center; transform-origin: center; }
        .baby-classroom-page .hero-main-mockup { position: relative; left: 0; width: 100%; height: 100%; max-width: none; overflow: visible; display: flex; align-items: center; justify-content: center; }
        .baby-classroom-page .hero-main-mockup img { display: block; width: auto; height: auto; max-width: 100%; max-height: 78svh; object-fit: contain; object-position: center; }
        .baby-classroom-page .hero-copy { grid-column: 8 / span 5; position: relative; left: 0; width: 100%; align-self: center; min-width: 0; overflow: visible; transform: translateY(-24px); }
        .baby-classroom-page .hero h1 { white-space: nowrap; font-size: clamp(72px, 6vw, 112px); line-height: .92; letter-spacing: -.035em; }
        .baby-classroom-page .meta-row { display: grid; grid-template-columns: repeat(3, max-content); gap: 48px; padding-top: 18px; border-top: 1px solid rgba(30, 61, 88, .14); }
        .baby-classroom-page .side-nav a:not(.active) { opacity: .3; }
        .baby-classroom-page .overview-grid { width: min(1440px, calc(100vw - 120px)); margin-inline: auto; position: relative; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 32px; gap: 0; align-items: center; }
        .baby-classroom-page .overview-number { position: absolute; left: 0; top: 50%; margin: 0; font-size: clamp(120px, 11vw, 180px); transform: translate(-50px, -50%); opacity: .1; pointer-events: none; }
        .baby-classroom-page .overview-visual { grid-column: 1 / span 6; width: 100%; max-width: 620px; height: 540px; justify-self: center; transform: none; }
        .baby-classroom-page .overview-visual img { display: block; width: 100%; height: auto; max-width: 620px; max-height: 100%; object-fit: contain; margin-inline: auto; }
        .baby-classroom-page .overview-copy { grid-column: 8 / span 5; width: 100%; max-width: 680px; min-width: 0; justify-self: start; transform: none; }
        .baby-classroom-page .overview-title { width: 100%; max-width: 680px; margin: 0; font-size: clamp(58px, 4.14vw, 76px); line-height: .98; letter-spacing: -.035em; color: var(--ink-strong); }
        .baby-classroom-page .overview-title-line { display: block; white-space: nowrap; }
        .baby-classroom-page .overview-title-line + .overview-title-line { margin-top: 20px; }
        .baby-classroom-page .overview-title .accent { color: var(--blue); }
        .baby-classroom-page .overview-copy .body-copy { margin: 18px 0 27px; }
        .baby-classroom-page .overview-copy dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 27px; }
        .baby-classroom-page .overview-copy dl > div { display: grid; gap: 8px; padding: 15px 0 0; }
      }
    `}</style>
    <button className="baby-classroom-page__back" type="button" onClick={onBack}><span aria-hidden="true">←</span> 返回作品</button>
    <SideNav /><Hero /><Overview /><DesignGoal /><Experience /><Motion /><DesignSystem /><FinalDemo />
  </main>
}
