import {useTexture} from '@react-three/drei'
import {useFrame,useThree} from '@react-three/fiber'
import {useEffect,useLayoutEffect,useMemo,useRef} from 'react'
import * as THREE from 'three'
import {createCurvedPlaneGeometry,createGlassStripeTexture,createMosaicTexture,setCurvedPlaneBend} from './curvedCard'
import {getCardState,helix} from './helix'
import {createRoundedAlphaMask} from './roundedMask'
import type {VisualSlot} from './spiralProjects'

export const CARD_VISUAL_SCALE=.76
const HOVER_CONTAINER_SCALE=.94
const HOVER_IMAGE_ZOOM=1.10
export type HelixCardDebug={slotIndex:number;projectIndex:number|null;projectId:string;textureUrl:string;activeSlotIndex:number;angle:number;centerDistance:number;centerProximity:number;proximityScale:number;activeBlend:number;cardMountId:string;stableKey:number;targetPosition:[number,number,number];actualWorldPosition:[number,number,number];scale:number;currentScale:number;opacity:number;currentOpacity:number;brightness:number;baseBrightness:number;proximityBrightness:number;targetBrightness:number;currentBrightness:number;facingBrightness:number;depthBrightness:number;materialBrightness:number;nearCenterDimApplied:false;uniformsShared:false;textureColorSpace:string;saturation:number;targetSaturation:number;currentSaturation:number;targetGrayscale:number;currentGrayscale:number;focusStrength:number;frontness:number;facingDot:number;frontVisible:boolean;backVisible:boolean;finalRotationY:number;cardGroupRotationY:number;frontMeshRotationY:number;backMeshRotationY:number;scaleX:number;scaleZ:number;faceState:'front'|'back';uvFlipCount:number;bendRadians:number;geometryUpdates:number;frontMaterialType:string;backMaterialType:string;mosaicWidth:number;isActive:boolean;targetScale:number;targetOpacity:number;meshWorldWidth:number;meshWorldHeight:number;angleDifferenceDegrees:number;yDifference:number;radius:number;visualScale:number;screenWidth:number;previousScreenWidth:number;screenBounds:[number,number,number,number];cardGroupVisible:boolean;frustumCulled:false;projectedScreenY:number;spatialZone:'front'|'side'|'rear';isPointerOver:boolean;isCenterCard:boolean;isHoverEligible:boolean;isHoverActive:boolean;projectedScreenX:number;screenDistance:number}

export default function SpiralCard({slot,getPhase,getActiveSlot,getHoverEligibleSlots,getHoveredSlot,setHoveredSlot,onOpenProject,onDebug}:{slot:VisualSlot;getPhase:()=>number;getActiveSlot:()=>number;getHoverEligibleSlots:()=>number[];getHoveredSlot:()=>number|null;setHoveredSlot:(slotIndex:number|null)=>void;onOpenProject:(projectIndex:number)=>void;onDebug?:(value:HelixCardDebug)=>void}){
  const texture=useTexture(slot.cover) as THREE.Texture
  const frontTexture=useMemo(()=>texture.clone(),[texture])
  const {gl}=useThree()
  const group=useRef<THREE.Group>(null)
  const visualContainer=useRef<THREE.Group>(null)
  const frontMesh=useRef<THREE.Mesh>(null)
  const backMesh=useRef<THREE.Mesh>(null)
  const front=useRef<THREE.MeshBasicMaterial>(null)
  const back=useRef<THREE.MeshBasicMaterial>(null)
  const initialized=useRef(false)
  const baseArc=.12
  const localCylinderRadius=helix.radius/CARD_VISUAL_SCALE
  const geometry=useMemo(()=>createCurvedPlaneGeometry(helix.cardWidth,helix.cardHeight,64,8,baseArc,localCylinderRadius),[localCylinderRadius])
  const mask=useMemo(()=>createRoundedAlphaMask(helix.cardWidth/helix.cardHeight),[])
  const mosaicWidth=128
  const mosaic=useMemo(()=>createMosaicTexture(texture.image as CanvasImageSource,slot.aspectRatio,mosaicWidth),[texture,slot.aspectRatio])
  const glassStripes=useMemo(()=>createGlassStripeTexture(),[])
  const initial=useMemo(()=>getCardState(slot.slotIndex,0),[slot.slotIndex])
  const worldPosition=useMemo(()=>new THREE.Vector3(),[])
  const frontNormal=useMemo(()=>new THREE.Vector3(),[])
  const toCamera=useMemo(()=>new THREE.Vector3(),[])
  const worldQuaternion=useMemo(()=>new THREE.Quaternion(),[])
  const lastArc=useRef(baseArc)
  const currentBrightness=useRef(1)
  const activeBlend=useRef(0)
  const currentContainerScale=useRef(1)
  const currentImageZoom=useRef(1)
  const cardMountId=useRef(`spiral-card-${slot.slotIndex}`)
  const pointerStart=useRef<{x:number;y:number}|null>(null)

  useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.wrapS=THREE.ClampToEdgeWrapping;texture.wrapT=THREE.ClampToEdgeWrapping;texture.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());texture.needsUpdate=true},[gl,texture])
  useEffect(()=>{frontTexture.colorSpace=THREE.SRGBColorSpace;frontTexture.magFilter=THREE.LinearFilter;frontTexture.minFilter=THREE.LinearMipmapLinearFilter;frontTexture.generateMipmaps=true;frontTexture.wrapS=THREE.ClampToEdgeWrapping;frontTexture.wrapT=THREE.ClampToEdgeWrapping;frontTexture.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());frontTexture.needsUpdate=true},[frontTexture,gl])
  useEffect(()=>{mosaic.wrapS=THREE.RepeatWrapping;mosaic.repeat.x=-1;mosaic.offset.x=1;mosaic.needsUpdate=true},[mosaic])
  useEffect(()=>()=>{geometry.dispose();mask.dispose();mosaic.dispose();glassStripes.dispose();frontTexture.dispose()},[geometry,mask,mosaic,glassStripes,frontTexture])
  const apply=(card:ReturnType<typeof getCardState>,scale=card.scale)=>{if(group.current){group.current.position.copy(card.position);group.current.rotation.copy(card.rotation);group.current.scale.setScalar(scale)}if(front.current)front.current.opacity=1;if(back.current)back.current.opacity=1}
  useLayoutEffect(()=>{apply(initial,initial.scale)},[initial])

  useFrame((state,delta)=>{
    const target=getCardState(slot.slotIndex,getPhase())
    const isActive=slot.slotIndex===getActiveSlot()
    const isHoverEligible=getHoverEligibleSlots().includes(slot.slotIndex)
    const isPointerOver=getHoveredSlot()===slot.slotIndex
    if(!isHoverEligible&&isPointerOver)document.body.style.cursor=''
    const angleDistance=Math.abs(target.angle)
    const verticalDistance=Math.abs(target.position.y)
    const verticalRange=helix.pitch*helix.visibleSlots*helix.slotAngle*.5
    const verticalFactor=THREE.MathUtils.clamp(verticalDistance/verticalRange,0,1)
    const tiltWeight=THREE.MathUtils.smoothstep(verticalFactor,.08,1)
    const tiltDirection=Math.sign(target.position.y)||1
    const perspectiveTiltX=-tiltDirection*THREE.MathUtils.degToRad(3)*tiltWeight
    const centerDistance=Math.hypot(angleDistance/1.1,verticalDistance/.9)
    const centerProximity=1-THREE.MathUtils.smoothstep(centerDistance,.18,1.35)
    const proximityScale=target.scale
    activeBlend.current=THREE.MathUtils.damp(activeBlend.current,isActive?1:0,10,delta)
    const targetScale=target.scale
    const hoverDamping=1-Math.exp(-10*delta)
    const isHoverActive=isHoverEligible&&isPointerOver
    currentContainerScale.current=THREE.MathUtils.lerp(currentContainerScale.current,isHoverActive?HOVER_CONTAINER_SCALE:1,hoverDamping)
    currentImageZoom.current=THREE.MathUtils.lerp(currentImageZoom.current,isHoverActive?HOVER_IMAGE_ZOOM:1,hoverDamping)
    if(visualContainer.current)visualContainer.current.scale.setScalar(CARD_VISUAL_SCALE*currentContainerScale.current)
    const imageRepeat=1/currentImageZoom.current
    frontTexture.repeat.set(imageRepeat,imageRepeat)
    frontTexture.offset.set((1-imageRepeat)*.5,(1-imageRepeat)*.5)
    frontTexture.updateMatrix()
    mosaic.repeat.set(-imageRepeat,imageRepeat)
    mosaic.offset.set(.5+imageRepeat*.5,(1-imageRepeat)*.5)
    mosaic.updateMatrix()
    const targetOpacity=1
    const baseBrightness=.72
    const proximityBrightness=THREE.MathUtils.lerp(baseBrightness,.96,centerProximity)
    const targetBrightness=Math.max(baseBrightness,THREE.MathUtils.lerp(proximityBrightness,1,activeBlend.current))
    const targetSaturation=1
    const targetGrayscale=0
    if(!initialized.current){apply(target,targetScale);initialized.current=true;return}
    if(!group.current)return
    group.current.position.copy(target.position)
    group.current.rotation.x=target.rotation.x+perspectiveTiltX
    group.current.rotation.y=Math.atan2(target.position.x,target.position.z)
    group.current.rotation.z=target.rotation.z
    group.current.scale.setScalar(targetScale)
    group.current.updateWorldMatrix(true,false)
    group.current.getWorldPosition(worldPosition)
    frontNormal.set(0,0,1).applyQuaternion(group.current.getWorldQuaternion(worldQuaternion)).normalize()
    toCamera.copy(state.camera.position).sub(worldPosition).normalize()
    const facingDot=frontNormal.dot(toCamera)
    const sideFactor=1-Math.abs(facingDot)
    const arcMagnitude=THREE.MathUtils.lerp(baseArc,THREE.MathUtils.degToRad(20),THREE.MathUtils.smoothstep(sideFactor,.28,.88))
    const horizontalSide=THREE.MathUtils.clamp(target.position.x/helix.radius,-1,1)
    const finalArcSigned=arcMagnitude*-horizontalSide
    if(Math.abs(finalArcSigned-lastArc.current)>.0005){setCurvedPlaneBend(geometry,helix.cardWidth,finalArcSigned,localCylinderRadius);lastArc.current=finalArcSigned}
    if(front.current)front.current.opacity=1
    if(back.current){back.current.opacity=1;back.current.color.setScalar(.86)}
    currentBrightness.current=THREE.MathUtils.damp(currentBrightness.current,targetBrightness,8,delta)
    if(front.current)front.current.color.setScalar(currentBrightness.current)
    const perspectiveCamera=state.camera as THREE.PerspectiveCamera
    const screenWidth=helix.cardWidth*group.current.scale.x*CARD_VISUAL_SCALE*state.size.height/(2*Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov)/2)*state.camera.position.distanceTo(worldPosition))
    const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>new THREE.Vector3(x*helix.cardWidth*.5*CARD_VISUAL_SCALE,y*helix.cardHeight*.5*CARD_VISUAL_SCALE,0).applyMatrix4(group.current!.matrixWorld).project(state.camera))
    const projected=corners.map(point=>[(point.x+1)*state.size.width*.5,(1-point.y)*state.size.height*.5] as const)
    const screenBounds:[number,number,number,number]=[Math.min(...projected.map(point=>point[0])),Math.min(...projected.map(point=>point[1])),Math.max(...projected.map(point=>point[0])),Math.max(...projected.map(point=>point[1]))]
    const projectedCenter=worldPosition.clone().project(state.camera)
    if(onDebug)onDebug({slotIndex:slot.slotIndex,projectIndex:slot.projectIndex,projectId:slot.id,textureUrl:slot.cover,activeSlotIndex:getActiveSlot(),angle:target.angle,centerDistance,centerProximity,proximityScale,activeBlend:activeBlend.current,cardMountId:cardMountId.current,stableKey:slot.slotIndex,targetPosition:target.position.toArray(),actualWorldPosition:worldPosition.toArray(),scale:group.current.scale.x,currentScale:group.current.scale.x,opacity:front.current?.opacity??targetOpacity,currentOpacity:front.current?.opacity??targetOpacity,brightness:targetBrightness,baseBrightness,proximityBrightness,targetBrightness,currentBrightness:currentBrightness.current,facingBrightness:1,depthBrightness:1,materialBrightness:front.current?.color.r??currentBrightness.current,nearCenterDimApplied:false,uniformsShared:false,textureColorSpace:texture.colorSpace===THREE.SRGBColorSpace?'SRGBColorSpace':'other',saturation:targetSaturation,targetSaturation,currentSaturation:targetSaturation,targetGrayscale,currentGrayscale:targetGrayscale,focusStrength:target.focusStrength,frontness:target.frontness,facingDot,frontVisible:facingDot>=0,backVisible:facingDot<0,finalRotationY:target.rotation.y,cardGroupRotationY:group.current.rotation.y,frontMeshRotationY:frontMesh.current?.rotation.y??0,backMeshRotationY:backMesh.current?.rotation.y??0,scaleX:group.current.scale.x,scaleZ:group.current.scale.z,faceState:facingDot>=0?'front':'back',uvFlipCount:1,bendRadians:lastArc.current,geometryUpdates:geometry.userData.bendUpdates??0,frontMaterialType:'MeshBasicMaterial',backMaterialType:'MeshBasicMaterial',mosaicWidth,isActive,targetScale,targetOpacity,meshWorldWidth:helix.cardWidth*group.current.scale.x*CARD_VISUAL_SCALE,meshWorldHeight:helix.cardHeight*group.current.scale.x*CARD_VISUAL_SCALE,angleDifferenceDegrees:THREE.MathUtils.radToDeg(helix.slotAngle),yDifference:helix.pitch*helix.slotAngle,radius:Math.hypot(target.position.x,target.position.z),visualScale:CARD_VISUAL_SCALE,screenWidth,previousScreenWidth:screenWidth/CARD_VISUAL_SCALE,screenBounds,cardGroupVisible:group.current.visible,frustumCulled:false,projectedScreenY:(1-projectedCenter.y)*state.size.height*.5,spatialZone:facingDot>.25?'front':facingDot<-.25?'rear':'side',isPointerOver,isCenterCard:isHoverEligible,isHoverEligible,isHoverActive,projectedScreenX:projectedCenter.x,screenDistance:Math.hypot(projectedCenter.x,projectedCenter.y)})
  })
  return <group ref={group} position={initial.position} rotation={initial.rotation} scale={initial.scale} onPointerEnter={event=>{event.stopPropagation();setHoveredSlot(slot.slotIndex);if(getHoverEligibleSlots().includes(slot.slotIndex))document.body.style.cursor='pointer'}} onPointerLeave={()=>{if(getHoveredSlot()===slot.slotIndex)setHoveredSlot(null);pointerStart.current=null;document.body.style.cursor=''}} onPointerDown={event=>{event.stopPropagation();pointerStart.current={x:event.clientX,y:event.clientY}}} onPointerUp={event=>{event.stopPropagation();const start=pointerStart.current;pointerStart.current=null;if(slot.projectIndex===null||!start)return;if(Math.hypot(event.clientX-start.x,event.clientY-start.y)<=6)onOpenProject(slot.projectIndex)}}>
    <group ref={visualContainer} scale={CARD_VISUAL_SCALE}>
      <mesh ref={frontMesh} geometry={geometry} frustumCulled={false}><meshBasicMaterial ref={front} map={frontTexture} alphaMap={mask} transparent opacity={1} depthWrite depthTest toneMapped={false} side={THREE.FrontSide}/></mesh>
      <mesh ref={backMesh} geometry={geometry} frustumCulled={false}><meshBasicMaterial ref={back} map={mosaic} alphaMap={mask} transparent opacity={1} depthWrite depthTest toneMapped={false} side={THREE.BackSide}/></mesh>
      <mesh geometry={geometry} renderOrder={2}><meshBasicMaterial map={glassStripes} alphaMap={mask} transparent opacity={.08} depthWrite={false} toneMapped={false} side={THREE.BackSide}/></mesh>
    </group>
  </group>
}
