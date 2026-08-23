import { useEffect, useRef } from 'react'
import { createLiquidGlass } from '../../../lib/liquid-glass/liquidGlass.js'
import '../../../lib/liquid-glass/liquidGlass.css'
import './baby-liquid-glass-cursor.css'

type Props={heroRef:React.RefObject<HTMLElement|null>}
const parameters={mode:'physics',surface:'convexSquircle',specular:'css',bezel:44,thickness:118,scale:68,specularIntensity:1.05,blur:.7,saturate:1.3,dispersion:.6,lightAngle:225,bend:.52,flip:false} as const

export default function BabyLiquidGlassCursor({heroRef}:Props){
  const glassRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const hero=heroRef.current,host=glassRef.current
    if(!hero||!host||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches||innerWidth<1024)return
    const glass=createLiquidGlass(host,parameters),supports=CSS.supports('backdrop-filter','url(#x)')||CSS.supports('-webkit-backdrop-filter','url(#x)')
    const debug=new URLSearchParams(location.search).get('lensDebug')==='1'
    let active=false,inside=true,frame=0,targetX=0,targetY=0,currentX=0,currentY=0,velocityX=0,velocityY=0,shapeX=0,shapeY=0,shapeVX=0,shapeVY=0,lastTime=performance.now()
    const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;active=false;host.dataset.active='false'}
    const tick=(time:number)=>{if(!active||!inside)return;const dt=Math.min((time-lastTime)/16.7,2);lastTime=time;velocityX+=(targetX-currentX)*.17*dt;velocityY+=(targetY-currentY)*.17*dt;velocityX*=.78;velocityY*=.78;currentX+=velocityX;currentY+=velocityY;const speed=Math.hypot(velocityX,velocityY),angle=Math.atan2(velocityY,velocityX),targetShape=Math.min(speed*.006, .045);shapeVX+=(targetShape*Math.cos(angle)-shapeX)*.12*dt;shapeVY+=(targetShape*Math.sin(angle)-shapeY)*.12*dt;shapeVX*=.72;shapeVY*=.72;shapeX+=shapeVX;shapeY+=shapeVY;const trailing=Math.min(speed*.55,6),tx=currentX-145-Math.cos(angle)*trailing,ty=currentY-89-Math.sin(angle)*trailing,along=Math.hypot(shapeX,shapeY),rotation=Math.max(-.8,Math.min(.8,angle*180/Math.PI*.012));host.style.borderRadius=`${32+shapeX*60}% ${32-shapeX*60}% ${34+shapeY*60}% ${34-shapeY*60}% / ${38+shapeY*55}% ${38-shapeY*55}% ${38-shapeX*55}% ${38+shapeX*55}%`;host.style.transform=`translate3d(${tx}px,${ty}px,0) rotate(${rotation}deg) rotate(${angle}rad) scale(${1+along},${1-along*.62}) rotate(${-angle}rad)`;frame=requestAnimationFrame(tick)}
    const enter=(event:PointerEvent)=>{if(event.pointerType!=='mouse'||!inside)return;targetX=currentX=event.clientX;targetY=currentY=event.clientY;velocityX=velocityY=0;lastTime=performance.now();host.dataset.active='true';active=true;if(!frame)frame=requestAnimationFrame(tick)}
    const move=(event:PointerEvent)=>{if(event.pointerType==='mouse'&&active){targetX=event.clientX;targetY=event.clientY}}
    const leave=()=>stop()
    const observer=new IntersectionObserver(([entry])=>{inside=entry.isIntersecting;if(!inside)stop()},{threshold:.08});observer.observe(hero)
    hero.addEventListener('pointerenter',enter);hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave)
    if(debug){host.dataset.debug=`url-filter:${supports}; mode:${parameters.mode}; surface:${parameters.surface}; bezel:${parameters.bezel}; thickness:${parameters.thickness}; scale:${parameters.scale}; dispersion:${parameters.dispersion}; specular:${parameters.specular}; 290×178`}
    return()=>{stop();observer.disconnect();hero.removeEventListener('pointerenter',enter);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);glass.destroy()}
  },[heroRef])
  return <div ref={glassRef} className="baby-liquid-glass-cursor" aria-hidden="true" />
}
