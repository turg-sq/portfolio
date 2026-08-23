import * as THREE from 'three'

const CARD_CORNER_RADIUS=15

export function createRoundedAlphaMask(aspect:number){
  const referenceWidth=256
  const width=1024
  const height=Math.max(384,Math.round(width/aspect))
  const referenceHeight=Math.max(96,Math.round(referenceWidth/aspect))
  const radius=Math.min(CARD_CORNER_RADIUS,referenceHeight*.22)*(width/referenceWidth)
  const canvas=document.createElement('canvas')
  canvas.width=width
  canvas.height=height
  const context=canvas.getContext('2d')!
  context.imageSmoothingEnabled=true
  context.fillStyle='#fff'
  context.beginPath()
  context.roundRect(0,0,width,height,radius)
  context.fill()
  const texture=new THREE.CanvasTexture(canvas)
  texture.colorSpace=THREE.NoColorSpace
  texture.magFilter=THREE.LinearFilter
  texture.minFilter=THREE.LinearMipmapLinearFilter
  texture.generateMipmaps=true
  texture.wrapS=THREE.ClampToEdgeWrapping
  texture.wrapT=THREE.ClampToEdgeWrapping
  texture.needsUpdate=true
  return texture
}
