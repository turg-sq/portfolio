import {AnimatePresence,motion} from 'framer-motion'
import {useCallback,useEffect,useRef,useState} from 'react'
import {spiralProjects,type SpiralProject} from './spiralProjects'
import {playProjectPreviewSound,stopProjectPreviewSound} from '../../lib/uiSound'

type Point={x:number;y:number}

export default function ProjectListView({active,onOpenProject}:{active:boolean;onOpenProject:(project:SpiralProject)=>void}){
  const [hoveredProject,setHoveredProject]=useState<SpiralProject|null>(null)
  const [previewVisible,setPreviewVisible]=useState(false)
  const [previewCover,setPreviewCover]=useState<string|null>(null)
  const [touchMode,setTouchMode]=useState(false)
  const previewRef=useRef<HTMLDivElement>(null)
  const target=useRef<Point>({x:0,y:0})
  const current=useRef<Point>({x:0,y:0})
  const frame=useRef(0)
  const hideTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const imageRequest=useRef(0)

  const cancelHide=()=>{
    if(hideTimer.current){clearTimeout(hideTimer.current);hideTimer.current=null}
  }

  const clearHoveredSoon=()=>{
    cancelHide()
    imageRequest.current++
    hideTimer.current=setTimeout(()=>{
      setHoveredProject(null)
      setPreviewVisible(false)
      stopProjectPreviewSound()
      hideTimer.current=null
    },70)
  }

  useEffect(()=>{
    const update=()=>setTouchMode(innerWidth<768)
    update()
    addEventListener('resize',update)
    return()=>removeEventListener('resize',update)
  },[])

  useEffect(()=>{
    if(!active){cancelHide();imageRequest.current++;setHoveredProject(null);setPreviewVisible(false)}
  },[active])

  useEffect(()=>()=>{cancelHide();cancelAnimationFrame(frame.current)},[])

  useEffect(()=>{
    const follow=()=>{
      const preview=previewRef.current
      if(preview&&!touchMode){
        current.current.x+=(target.current.x-current.current.x)*.12
        current.current.y+=(target.current.y-current.current.y)*.12
        preview.style.transform=`translate3d(${current.current.x}px,${current.current.y}px,0)`
      }
      frame.current=requestAnimationFrame(follow)
    }
    frame.current=requestAnimationFrame(follow)
    return()=>cancelAnimationFrame(frame.current)
  },[touchMode])

  const placePreview=useCallback((clientX:number,clientY:number)=>{
    if(touchMode){return}
    const preview=previewRef.current
    const width=preview?.offsetWidth||Math.min(Math.max(innerWidth*.24,220),400)
    const height=preview?.offsetHeight||Math.round(width*9/16)
    const margin=24
    let x=clientX-width*.45
    let y=clientY-height*.35
    target.current.x=Math.max(margin,Math.min(x,innerWidth-width-margin))
    target.current.y=Math.max(90,Math.min(y,innerHeight-height-margin))
    if(current.current.x===0&&current.current.y===0){current.current={...target.current}}
  },[touchMode])

  const activateProject=(project:SpiralProject,point?:Point)=>{
    cancelHide()
    setHoveredProject(project)
    if(point){placePreview(point.x,point.y)}
    if(previewCover===project.cover){
      setPreviewVisible(true)
      playProjectPreviewSound()
      return
    }
    const request=++imageRequest.current
    const image=new Image()
    image.onload=()=>{
      if(request!==imageRequest.current){return}
      setPreviewCover(project.cover)
      setPreviewVisible(true)
      playProjectPreviewSound()
    }
    image.src=project.cover
  }

  const handleClick=(project:SpiralProject)=>{
    if(touchMode&&hoveredProject?.id!==project.id){activateProject(project);return}
    onOpenProject(project)
  }

  const hasHoveredProject=hoveredProject!==null
  return <section className={`spiral-project-list ${active?'is-active':''}`} aria-label="Project directory" aria-hidden={!active} onPointerEnter={cancelHide} onPointerMove={event=>placePreview(event.clientX,event.clientY)} onPointerLeave={()=>{if(!touchMode){clearHoveredSoon()}}}>
    <div className="spiral-project-list-inner">
      {spiralProjects.map(project=>{
        const isHovered=hoveredProject?.id===project.id
        const className=['spiral-project-list-title',isHovered?'is-hovered':'',hasHoveredProject&&!isHovered?'is-dimmed':''].filter(Boolean).join(' ')
        return <button key={project.id} type="button" className={className} onPointerEnter={event=>{if(!touchMode){activateProject(project,{x:event.clientX,y:event.clientY})}}} onPointerMove={event=>{if(!touchMode){placePreview(event.clientX,event.clientY)}}} onPointerLeave={()=>{if(!touchMode){clearHoveredSoon()}}} onFocus={()=>activateProject(project,{x:innerWidth*.5,y:innerHeight*.58})} onClick={()=>handleClick(project)}>{project.title}</button>
      })}
    </div>
    <div ref={previewRef} className={`spiral-project-preview ${previewVisible?'is-visible':''}`} aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        {previewCover&&<motion.img key={previewCover} src={previewCover} alt="" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.16,ease:[.2,0,0,1]}}/>}
      </AnimatePresence>
    </div>
  </section>
}
