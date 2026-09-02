import {motion} from 'framer-motion'
import {useEffect,useRef,useState} from 'react'

type VideoViewerProps={src:string;onClose:()=>void}

const formatTime=(seconds:number,roundUp=false)=>{
  if(!Number.isFinite(seconds))return '0:00'
  const totalSeconds=roundUp?Math.ceil(seconds):Math.floor(seconds)
  const minutes=Math.floor(totalSeconds/60)
  const remainder=(totalSeconds%60).toString().padStart(2,'0')
  return `${minutes}:${remainder}`
}

export default function VideoViewer({src,onClose}:VideoViewerProps){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [playing,setPlaying]=useState(false)
  const [muted,setMuted]=useState(false)
  const [currentTime,setCurrentTime]=useState(0)
  const [duration,setDuration]=useState(0)

  useEffect(()=>{
    const video=videoRef.current
    if(!video)return
    let canPlayHandled=false
    const onLoadedMetadata=()=>{
      setDuration(video.duration)
    }
    const onCanPlay=()=>{
      if(canPlayHandled)return
      canPlayHandled=true
      void video.play().catch(error=>console.error('Video Viewer playback failed:',error))
    }
    const onPlaying=()=>setPlaying(true)
    const onPause=()=>setPlaying(false)
    const onError=()=>console.error('Video Viewer media error:',video.error)
    video.addEventListener('loadedmetadata',onLoadedMetadata)
    video.addEventListener('canplay',onCanPlay)
    video.addEventListener('playing',onPlaying)
    video.addEventListener('pause',onPause)
    video.addEventListener('error',onError)
    video.src=src
    video.load()
    return()=>{
      video.removeEventListener('loadedmetadata',onLoadedMetadata)
      video.removeEventListener('canplay',onCanPlay)
      video.removeEventListener('playing',onPlaying)
      video.removeEventListener('pause',onPause)
      video.removeEventListener('error',onError)
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  },[src])

  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()}
    addEventListener('keydown',onKeyDown)
    return()=>removeEventListener('keydown',onKeyDown)
  },[onClose])

  const togglePlayback=async()=>{
    const video=videoRef.current
    if(!video)return
    if(video.paused){void video.play().catch(error=>console.error('Video Viewer playback failed:',error))}else video.pause()
  }
  const toggleMuted=()=>{
    const video=videoRef.current
    if(!video)return
    video.muted=!video.muted
    setMuted(video.muted)
  }
  const seek=(value:number)=>{
    const video=videoRef.current
    if(!video||!Number.isFinite(video.duration))return
    video.currentTime=value
    setCurrentTime(value)
  }

  return <motion.section className="video-viewer" role="dialog" aria-modal="true" aria-label="视频作品播放器" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3,ease:[.2,0,0,1]}}>
    <motion.video ref={videoRef} className="video-viewer__media" preload="metadata" playsInline onTimeUpdate={event=>setCurrentTime(event.currentTarget.currentTime)} initial={{opacity:.85,scale:.955}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.97}} transition={{duration:.62,ease:[.16,1,.3,1]}} />
    <div className="video-viewer__controls" aria-label="视频控制">
      <button type="button" onClick={()=>void togglePlayback()} aria-label={playing?'暂停':'播放'}>{playing?'Ⅱ':'▶'}</button>
      <span className="video-viewer__time">{formatTime(currentTime)}</span>
      <input aria-label="视频进度" type="range" min="0" max={duration||0} step="0.01" value={Math.min(currentTime,duration||0)} onChange={event=>seek(Number(event.currentTarget.value))}/>
      <span className="video-viewer__time">{formatTime(duration,true)}</span>
      <button type="button" onClick={toggleMuted} aria-label={muted?'打开声音':'静音'}>{muted?'◌':'◉'}</button>
      <button type="button" className="video-viewer__close" onClick={onClose} aria-label="关闭视频">×</button>
    </div>
  </motion.section>
}
