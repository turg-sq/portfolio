import {useEffect,useMemo,useState} from 'react'
import WebGLCapabilityGate from './spiral/WebGLCapabilityGate'
import CornerMenu from './spiral/CornerMenu'
import AELiveGiftPage from '../projects/ae-live-gift/AELiveGiftPage'
import BabyClassroomPage from '../projects/baby-classroom/BabyClassroomPage'
import ButterflyJourneyPage from '../projects/butterfly-journey/ButterflyJourneyPage'
import RedSunDuckEggPage from '../projects/red-sun-duck-egg/RedSunDuckEggPage'
import SpringIpDesignPage from '../projects/spring-ip-design/SpringIpDesignPage'
import ProjectDetail from './spiral/ProjectDetail'
import ProjectListView from './spiral/ProjectListView'
import SpiralOverlay from './spiral/SpiralOverlay'
import {spiralProjects,type SpiralProject} from './spiral/spiralProjects'
import type {SpiralDebug} from './spiral/SpiralScene'
import ViewSwitcher,{type ViewMode} from './spiral/ViewSwitcher'
import ContactPage from './ContactPage'
import {playUIBack,playUIClick} from '../lib/uiSound'

const debugEnabled=import.meta.env.DEV&&new URLSearchParams(window.location.search).get('debug')==='1'
const routeSlug=()=>{
  const match=window.location.pathname.match(/^\/projects\/([^/]+)$/)
  return match?.[1]??null
}
const isContactRoute=()=>window.location.pathname==='/contact'

export default function SpiralWorksPrototype(){
  const [projectIndex,setProjectIndex]=useState(0)
  const [debug,setDebug]=useState<SpiralDebug|null>(null)
  const [viewMode,setViewMode]=useState<ViewMode>('spiral')
  const [detailSlug,setDetailSlug]=useState<string|null>(()=>routeSlug())
  const [returnMode,setReturnMode]=useState<ViewMode>('spiral')
  const [contact,setContact]=useState<boolean>(()=>isContactRoute())
  const detailProject=useMemo(()=>spiralProjects.find(project=>project.slug===detailSlug)??null,[detailSlug])
  const centerCard=debug?.cards.find(card=>card.slotIndex===debug.activeSlotIndex)??null
  const opacityBands=debug?.cards.length?[1,.5,0].map(target=>debug.cards.reduce((nearest,card)=>Math.abs(card.frontness-target)<Math.abs(nearest.frontness-target)?card:nearest,debug.cards[0])):null
  const isSpiral=viewMode==='spiral'
  const isDetail=detailSlug!==null

  useEffect(()=>{
    const syncRoute=()=>{
      const slug=routeSlug()
      setDetailSlug(slug)
      setContact(isContactRoute())
      const state=history.state as {returnMode?:ViewMode}|null
      if(state?.returnMode)setReturnMode(state.returnMode)
    }
    addEventListener('popstate',syncRoute)
    return()=>removeEventListener('popstate',syncRoute)
  },[])

  const openProject=(project:SpiralProject)=>{
    playUIClick()
    if(project.destinationType==='external'){
      window.open(project.externalUrl,'_blank','noopener,noreferrer')
      return
    }
    setReturnMode(viewMode)
    setDetailSlug(project.slug)
    history.pushState({portfolioDetail:true,returnMode:viewMode},'',project.route)
    window.scrollTo({top:0,behavior:'instant'})
  }
  const openProjectByIndex=(index:number)=>{
    const project=spiralProjects[index]
    if(project)openProject(project)
  }
  const backToWorks=()=>{
    playUIBack()
    if(history.state?.portfolioDetail&&history.length>1){history.back();return}
    setDetailSlug(null)
    setViewMode(returnMode)
    history.pushState({returnMode},'','/spiral-prototype.html')
  }
  const showWorks=()=>{
    playUIClick()
    setDetailSlug(null)
    setViewMode('list')
    history.pushState({returnMode:'list'},'',window.location.pathname.startsWith('/projects/')?'/spiral-prototype.html':window.location.pathname)
  }
  const openContact=()=>{playUIClick();setContact(true);setDetailSlug(null);history.pushState({portfolioContact:true},'','/contact');window.scrollTo({top:0,behavior:'instant'})}
  const closeContact=()=>{setContact(false);history.pushState({returnMode:viewMode},'','/spiral-prototype.html')}
  const nextProject=detailProject?spiralProjects[(spiralProjects.indexOf(detailProject)+1)%spiralProjects.length]:spiralProjects[0]

  if(contact)return <ContactPage onBack={closeContact}/>
  return <main className="spiral-prototype-root">
    {!isDetail&&<ViewSwitcher viewMode={viewMode} onChange={mode=>{if(mode!==viewMode)playUIClick();setViewMode(mode)}}/>} 
    {!isDetail&&<CornerMenu onWorks={showWorks} onContact={openContact}/>} 
    <div className={`spiral-prototype-spiral-view ${isSpiral&&!isDetail?'is-active':''}`} aria-hidden={!isSpiral||isDetail}>
      <WebGLCapabilityGate onProject={setProjectIndex} onOpenProject={openProjectByIndex} onDebug={debugEnabled?setDebug:undefined} showGuides={debugEnabled}/>
      <SpiralOverlay index={projectIndex}/>
      {debugEnabled&&debug&&<aside className="spiral-prototype-debug">
        <span>hover eligible slots: {debug.hoverEligibleSlotIds.join(', ')||'none'} · hovered slot: {debug.hoveredSlotId??'none'}</span>
        <strong>auto {debug.autoPhase.toFixed(2)} · scroll {debug.scrollInfluence.toFixed(2)} · phase {debug.combinedPhase.toFixed(2)}</strong>
        <span>speed {debug.autoSpeed} · frame {debug.frameloop} · active #{debug.activeSlotIndex} · candidate #{debug.candidateSlotIndex}</span>
        {centerCard&&<span><b>ACTIVE #{centerCard.slotIndex}</b> {centerCard.projectId} · brightness {centerCard.currentBrightness.toFixed(2)}</span>}
        {opacityBands&&<span>opacity bands — front: {opacityBands[0].currentOpacity.toFixed(2)} · side: {opacityBands[1].currentOpacity.toFixed(2)} · rear: {opacityBands[2].currentOpacity.toFixed(2)}</span>}
      </aside>}
    </div>
    <ProjectListView active={!isSpiral&&!isDetail} onOpenProject={openProject}/>
    {detailProject?.id==='baby-classroom'?<BabyClassroomPage onBack={backToWorks}/>:detailProject?.id==='su-ip-design'?<SpringIpDesignPage project={detailProject} onBack={backToWorks} nextProject={nextProject} onOpenProject={openProject}/>:detailProject?.id==='butterfly-journey'?<ButterflyJourneyPage onBack={backToWorks}/>:detailProject?.id==='red-sun-duck-egg'?<RedSunDuckEggPage project={detailProject} onBack={backToWorks} nextProject={nextProject} onOpenProject={openProject}/>:detailProject?.id==='ae-live-gift'?<AELiveGiftPage onBack={backToWorks} nextProject={nextProject} onOpenProject={openProject}/>:detailProject&&<ProjectDetail project={detailProject} nextProject={nextProject} onBack={backToWorks} onOpenProject={openProject}/>}
  </main>
}
