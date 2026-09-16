import * as THREE from 'three'

export const CARD_WORLD_WIDTH=2.7
export const CARD_WORLD_HEIGHT=1.68
export const CARD_WORLD_GAP=.18
export const BASE_CARD_Y_STEP=.54
export const HELIX_RADIUS=2.7
export const BASE_CARD_ANGLE_STEP=THREE.MathUtils.degToRad(56.9498209883615)
export const TARGET_SCREEN_GAP=20
export const CARD_SPACING_SCALE=.8
export const CARD_Y_STEP=BASE_CARD_Y_STEP*CARD_SPACING_SCALE
export const CARD_ANGLE_STEP=BASE_CARD_ANGLE_STEP*CARD_SPACING_SCALE
export const BASE_CARD_SCALE=1

export const helix={radius:HELIX_RADIUS,pitch:CARD_Y_STEP/CARD_ANGLE_STEP,slotAngle:CARD_ANGLE_STEP,cardWidth:CARD_WORLD_WIDTH,cardHeight:CARD_WORLD_HEIGHT,visibleSlots:24,autoSpeed:.1}
export const totalAngle=helix.visibleSlots*CARD_ANGLE_STEP
export function wrapAngle(value:number){return THREE.MathUtils.euclideanModulo(value+totalAngle/2,totalAngle)-totalAngle/2}
export function getHelixPoint(angle:number){return new THREE.Vector3(Math.sin(angle)*HELIX_RADIUS,angle*helix.pitch,Math.cos(angle)*HELIX_RADIUS)}
export type CardState={assetIndex:number;angle:number;position:THREE.Vector3;rotation:THREE.Euler;scale:number;opacity:number;brightness:number;saturation:number;frontness:number;focusStrength:number;centerCorrection:number}
export function getCardState(slotIndex:number,phase:number):CardState{
  const angle=wrapAngle(slotIndex*CARD_ANGLE_STEP-phase)
  const position=getHelixPoint(angle)
  const frontness=(Math.cos(angle)+1)/2
  const verticalFocus=Math.exp(-Math.pow(Math.abs(angle)/2.5,2))
  const focusStrength=Math.pow(frontness,1.35)*verticalFocus
  const centerCorrection=THREE.MathUtils.smoothstep(focusStrength,.78,1)
  const rotationY=Math.atan2(position.x,position.z)
  const rotationZ=-Math.sin(angle)*.035
  return {assetIndex:THREE.MathUtils.euclideanModulo(slotIndex,7),angle,position,rotation:new THREE.Euler(0,rotationY,rotationZ),scale:BASE_CARD_SCALE,opacity:.45+.55*focusStrength,brightness:.82+.18*focusStrength,saturation:1,frontness,focusStrength,centerCorrection}
}
