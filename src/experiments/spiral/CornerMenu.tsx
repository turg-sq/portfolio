import {AnimatePresence,motion,useReducedMotion} from 'framer-motion'
import {useEffect,useRef,useState} from 'react'
import {playUIClick} from '../../lib/uiSound'

type MenuBounds={width:number;height:number;top:number;right:number}

function getMenuBounds():MenuBounds{
  const mobile=window.innerWidth<768
  return mobile
    ? {width:window.innerWidth-24,height:window.innerHeight-24,top:12,right:12}
    : {width:Math.min(Math.max(460,window.innerWidth*.32),620),height:window.innerHeight-28,top:14,right:14}
}

export default function CornerMenu({onWorks,onContact}:{onWorks:()=>void;onContact:()=>void}){
  const reduced=useReducedMotion()
  const triggerRef=useRef<HTMLButtonElement>(null)
  const surfaceRef=useRef<HTMLDivElement>(null)
  const [surfaceOpen,setSurfaceOpen]=useState(false)
  const [contentVisible,setContentVisible]=useState(false)
  const [showTrigger,setShowTrigger]=useState(true)
  const [bounds,setBounds]=useState<MenuBounds>(()=>getMenuBounds())

  useEffect(()=>{
    const update=()=>setBounds(getMenuBounds())
    addEventListener('resize',update)
    return ()=>removeEventListener('resize',update)
  },[])
  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'&&surfaceOpen)closeMenu()}
    addEventListener('keydown',onKeyDown)
    return ()=>removeEventListener('keydown',onKeyDown)
  })
  useEffect(()=>{
    if(!surfaceOpen)return
    const getFocusable=()=>Array.from(surfaceRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')??[])
    const focusFirst=()=>getFocusable()[0]?.focus()
    requestAnimationFrame(focusFirst)
    const trapFocus=(event:KeyboardEvent)=>{
      if(event.key!=='Tab')return
      const items=getFocusable()
      if(!items.length)return
      const first=items[0],last=items[items.length-1]
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
    addEventListener('keydown',trapFocus)
    return ()=>removeEventListener('keydown',trapFocus)
  },[surfaceOpen])

  const openMenu=()=>{
    playUIClick()
    setShowTrigger(false)
    setSurfaceOpen(true)
    setContentVisible(true)
  }
  const closeMenu=()=>{
    if(!surfaceOpen)return
    setContentVisible(false)
    setSurfaceOpen(false)
  }
  const openWorks=()=>{onWorks();closeMenu()}
  const collapsed={width:132,height:58,borderRadius:999,top:24,right:24}
  const expanded={width:bounds.width,height:bounds.height,borderRadius:15,top:bounds.top,right:bounds.right}
  const openTransition=reduced?{duration:.01}:{duration:.52,ease:[.22,1,.36,1] as const}
  const closeTransition=reduced?{duration:.01}:{duration:.46,ease:[.76,0,.24,1] as const}
  const surfaceAnimation=surfaceOpen
    ? {...expanded,borderRadius:[999,15,15]}
    : {...collapsed,borderRadius:[15,15,999]}
  const surfaceTransition=surfaceOpen
    ? {width:openTransition,height:openTransition,top:openTransition,right:openTransition,borderRadius:{...openTransition,times:[0,.12,1]}}
    : {width:closeTransition,height:closeTransition,top:closeTransition,right:closeTransition,borderRadius:{...closeTransition,times:[0,.84,1]}}

  return <>
    <AnimatePresence>{!showTrigger&&<motion.button className="corner-menu-backdrop" type="button" aria-label="关闭菜单" onClick={closeMenu} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?.01:.18}}/>}</AnimatePresence>
    <motion.div
      ref={surfaceRef}
      className={`corner-menu-surface ${surfaceOpen?'is-open':'is-closed'}`}
      initial={collapsed}
      animate={surfaceAnimation}
      transition={surfaceTransition}
      onAnimationComplete={()=>{if(!surfaceOpen&&!showTrigger){setShowTrigger(true);requestAnimationFrame(()=>triggerRef.current?.focus())}}}
      style={{transformOrigin:'top right'}}
      role={surfaceOpen?'dialog':undefined}
      aria-modal={surfaceOpen||undefined}
      aria-label={surfaceOpen?'网站菜单':undefined}
    >
      {showTrigger&&<button ref={triggerRef} className="menu-trigger" type="button" onClick={openMenu} aria-label="打开菜单" aria-expanded={false}><span>menu</span><span className="menu-trigger__dot"/></button>}
      <AnimatePresence>{contentVisible&&<motion.div className="corner-menu-content" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} transition={{duration:reduced?.01:.22,delay:reduced?0:.16,ease:[.22,1,.36,1]}}>
        <div className="corner-menu-heading"><button type="button" className="corner-menu-close-text" onClick={closeMenu}>关闭</button><button type="button" className="menu-close-button" onClick={closeMenu} aria-label="关闭菜单">×</button></div>
        <nav className="menu-panel__nav" aria-label="菜单导航">
          <button type="button" onClick={openWorks}>作品</button>
          <button type="button" disabled aria-disabled="true">关于</button>
          <button type="button" onClick={()=>{onContact();closeMenu()}}>联系方式</button>
        </nav>
        <div className="corner-menu-footer"><span>你的邮箱地址</span></div>
      </motion.div>}</AnimatePresence>
    </motion.div>
  </>
}
