import * as THREE from 'three'

export function createCurvedPlaneGeometry(width:number,height:number,segmentsX=28,segmentsY=10,bend=.16,surfaceRadius?:number){
  const geometry=new THREE.PlaneGeometry(width,height,segmentsX,segmentsY)
  const position=geometry.getAttribute('position') as THREE.BufferAttribute
  geometry.userData.baseX=Float32Array.from({length:position.count},(_,index)=>position.getX(index))
  geometry.userData.cardWidth=width
  setCurvedPlaneBend(geometry,width,bend,surfaceRadius)
  geometry.computeVertexNormals()
  return geometry
}

export function setCurvedPlaneBend(geometry:THREE.PlaneGeometry,width:number,bend:number,surfaceRadius=width/Math.max(Math.abs(bend),.0001)){
  const position=geometry.getAttribute('position') as THREE.BufferAttribute
  const baseX=geometry.userData.baseX as Float32Array
  const bendMagnitude=Math.abs(bend)
  const localCurveRadius=width/Math.max(bendMagnitude,.0001)
  const localSagitta=localCurveRadius*(1-Math.cos(bendMagnitude*.5))
  const cylinderSagitta=surfaceRadius*(1-Math.cos(width/(2*surfaceRadius)))
  const signedSide=THREE.MathUtils.clamp(bend/THREE.MathUtils.degToRad(20),-1,1)
  const convexWeight=Math.max(signedSide,0)
  const concaveWeight=Math.max(-signedSide,0)
  for(let i=0;i<position.count;i++){
    const theta=baseX[i]/surfaceRadius
    const centerWeight=1-THREE.MathUtils.clamp(Math.abs(baseX[i])/(width*.5),0,1)**2
    const cylinderX=Math.sin(theta)*surfaceRadius
    const cylinderZ=(Math.cos(theta)-1)*surfaceRadius
    const localOffset=convexWeight*localSagitta*centerWeight-concaveWeight*(cylinderSagitta*1.12+localSagitta)*centerWeight
    position.setX(i,cylinderX)
    position.setZ(i,cylinderZ+localOffset)
  }
  position.needsUpdate=true
  geometry.userData.bendRadians=bend
  geometry.userData.bendUpdates=(geometry.userData.bendUpdates??0)+1
}

export function createMosaicTexture(image:CanvasImageSource,aspect:number,width=128){
  const height=Math.max(20,Math.round(width/aspect)); const canvas=document.createElement('canvas')
  canvas.width=width; canvas.height=height
  const context=canvas.getContext('2d')!; context.imageSmoothingEnabled=false; context.filter='saturate(.82) contrast(.9)'; context.drawImage(image,0,0,width,height); context.filter='none'
  const texture=new THREE.CanvasTexture(canvas); texture.magFilter=THREE.NearestFilter; texture.minFilter=THREE.NearestFilter; texture.colorSpace=THREE.SRGBColorSpace
  return texture
}

export function createGlassStripeTexture(){
  const canvas=document.createElement('canvas')
  canvas.width=256; canvas.height=256
  const context=canvas.getContext('2d')!
  const highlight=context.createLinearGradient(0,0,0,canvas.height)
  highlight.addColorStop(0,'rgba(255,255,255,.34)')
  highlight.addColorStop(.16,'rgba(255,255,255,.08)')
  highlight.addColorStop(.42,'rgba(255,255,255,0)')
  context.fillStyle=highlight
  context.fillRect(0,0,canvas.width,canvas.height)
  context.fillStyle='rgba(255,255,255,.52)'
  for(let x=4;x<canvas.width;x+=9)context.fillRect(x,0,1,canvas.height)
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
