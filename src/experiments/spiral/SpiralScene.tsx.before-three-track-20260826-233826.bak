import {Line,ScrollControls,useScroll} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {Suspense,useMemo,useRef} from 'react'
import * as THREE from 'three'
import {getCardState,getHelixPoint,helix,totalAngle,wrapAngle} from './helix'
import SpiralCard,{type HelixCardDebug} from './SpiralCard'
import {visualSlots} from './spiralProjects'

export type SpiralDebug={autoPhase:number;scrollInfluence:number;combinedPhase:number;autoSpeed:number;reducedMotion:boolean;frameloop:'always';currentProjectIndex:number;activeSlotIndex:number;candidateSlotIndex:number;currentDistance:number;candidateDistance:number;cards:HelixCardDebug[];foregroundGaps:number[];hoverEligibleSlotIds:number[];hoveredSlotId:number|null;centerSlotId:number}
type Candidate={slotIndex:number;distance:number}
const cameraPosition=new THREE.Vector3(0,0,7.2)
const cardNormal=new THREE.Vector3()

function getCandidate(slotIndex:number,phase:number):Candidate|null{
  const slot=visualSlots[slotIndex]
  if(!slot)return null
  const card=getCardState(slotIndex,phase)
  cardNormal.set(0,0,1).applyEuler(card.rotation).normalize()
  const facingDot=cardNormal.dot(cameraPosition.clone().sub(card.position).normalize())
  if(facingDot<=.25)return null
  const angleDistance=Math.abs(wrapAngle(card.angle))
  const verticalDistance=Math.abs(card.position.y)
  return {slotIndex,distance:Math.hypot(angleDistance/1.1,verticalDistance/.9)}
}

function findCandidate(phase:number){return visualSlots.reduce<Candidate|null>((winner,slot)=>{const candidate=getCandidate(slot.slotIndex,phase);return candidate&&(!winner||candidate.distance<winner.distance)?candidate:winner},null)}
function findHoverEligible(phase:number){return visualSlots.map(slot=>getCandidate(slot.slotIndex,phase)).filter((candidate):candidate is Candidate=>candidate!==null).sort((a,b)=>a.distance-b.distance).slice(0,2).map(candidate=>candidate.slotIndex)}
function closestProject(phase:number){let winner=0;let distance=Infinity;visualSlots.forEach(slot=>{if(slot.projectIndex!==null){const candidate=getCandidate(slot.slotIndex,phase);if(candidate&&candidate.distance<distance){distance=candidate.distance;winner=slot.projectIndex}}});return winner}
function HelixGuide(){const points=useMemo(()=>Array.from({length:160},(_,index)=>getHelixPoint(-totalAngle/2+index*(totalAngle/159)).toArray()),[]);return <group><Line points={points} color="#f3d126" lineWidth={.7} transparent opacity={.65}/><Line points={[[0,-4,0],[0,4,0]]} color="#777" lineWidth={.45} transparent opacity={.5}/></group>}

function HelixContent({onProject,onOpenProject,onDebug,reduced,showGuides}:{onProject:(index:number)=>void;onOpenProject:(index:number)=>void;onDebug?:(debug:SpiralDebug)=>void;reduced:boolean;showGuides:boolean}){
  const scroll=useScroll(),autoPhase=useRef(0),scrollInfluence=useRef(0),combinedPhase=useRef(0),cards=useRef<Record<number,HelixCardDebug>>({}),lastDebug=useRef(0),hoverEligibleSlots=useRef(findHoverEligible(0)),hoveredSlot=useRef<number|null>(null)
  const initialCandidate=findCandidate(0)
  const activeSlot=useRef(initialCandidate?.slotIndex??0)
  const activeDistance=useRef(initialCandidate?.distance??Infinity)
  const lastProject=useRef(-1)
  useFrame((state,delta)=>{
    const speed=reduced?.08:helix.autoSpeed
    autoPhase.current+=delta*speed
    const scrollTarget=scroll.offset*totalAngle
    scrollInfluence.current=THREE.MathUtils.damp(scrollInfluence.current,scrollTarget,5,delta)
    combinedPhase.current=autoPhase.current+scrollInfluence.current
    const candidate=findCandidate(combinedPhase.current)
    hoverEligibleSlots.current=findHoverEligible(combinedPhase.current)
    const current=getCandidate(activeSlot.current,combinedPhase.current)
    const currentDistance=current?.distance??Infinity
    if(candidate&&candidate.slotIndex!==activeSlot.current&&candidate.distance<currentDistance-.02){activeSlot.current=candidate.slotIndex;activeDistance.current=candidate.distance}else{activeDistance.current=currentDistance}
    const activeProject=visualSlots[activeSlot.current]?.projectIndex??closestProject(combinedPhase.current)
    if(activeProject!==lastProject.current){lastProject.current=activeProject;onProject(activeProject)}
    if(onDebug&&state.clock.elapsedTime-lastDebug.current>.14){
      lastDebug.current=state.clock.elapsedTime
      const snapshot=Object.values(cards.current).sort((a,b)=>a.slotIndex-b.slotIndex)
      const foreground=snapshot.filter(card=>card.facingDot>.25).sort((a,b)=>a.centerDistance-b.centerDistance).slice(0,5).sort((a,b)=>a.angle-b.angle)
      const foregroundGaps=foreground.slice(0,-1).map((card,index)=>{
        const next=foreground[index+1]
        const [leftA,topA,rightA,bottomA]=card.screenBounds,[leftB,topB,rightB,bottomB]=next.screenBounds
        const dx=Math.max(leftA-leftB,leftB-rightA,0),dy=Math.max(topA-topB,topB-bottomA,0)
        return Math.hypot(dx,dy)
      })
      onDebug({autoPhase:autoPhase.current,scrollInfluence:scrollInfluence.current,combinedPhase:combinedPhase.current,autoSpeed:speed,reducedMotion:reduced,frameloop:'always',currentProjectIndex:activeProject,activeSlotIndex:activeSlot.current,candidateSlotIndex:candidate?.slotIndex??-1,currentDistance:activeDistance.current,candidateDistance:candidate?.distance??Infinity,cards:snapshot,foregroundGaps,hoverEligibleSlotIds:hoverEligibleSlots.current,hoveredSlotId:hoveredSlot.current,centerSlotId:hoverEligibleSlots.current[0]??-1})
    }
  })
  const record=(card:HelixCardDebug)=>{cards.current[card.slotIndex]=card}
  return <group>{showGuides&&<HelixGuide/>}{visualSlots.map(slot=><SpiralCard key={slot.slotIndex} slot={slot} getPhase={()=>combinedPhase.current} getActiveSlot={()=>activeSlot.current} getHoverEligibleSlots={()=>hoverEligibleSlots.current} getHoveredSlot={()=>hoveredSlot.current} setHoveredSlot={slotIndex=>{hoveredSlot.current=slotIndex}} onOpenProject={onOpenProject} onDebug={showGuides?record:undefined}/>)}</group>
}

export default function SpiralScene({onProject,onOpenProject,onDebug,reduced,showGuides=false}:{onProject:(index:number)=>void;onOpenProject:(index:number)=>void;onDebug?:(debug:SpiralDebug)=>void;reduced:boolean;showGuides?:boolean}){return <ScrollControls pages={2.5} damping={.09} distance={1}><Suspense fallback={null}><HelixContent onProject={onProject} onOpenProject={onOpenProject} onDebug={onDebug} reduced={reduced} showGuides={showGuides}/></Suspense></ScrollControls>}
