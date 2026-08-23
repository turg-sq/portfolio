export type ProjectDestination=
  | {destinationType:'internal';route:string}
  | {destinationType:'external';externalUrl:string}

export type SpiralProject={
  id:string
  slug:string
  index:string
  title:string
  subtitle:string
  year:string
  category:string
  cover:string
  aspectRatio:number
  themeColor:string
}&ProjectDestination

export const spiralProjects:SpiralProject[]=[
  {id:'baby-classroom',slug:'baby-classroom',index:'01',title:'宝宝小课堂',subtitle:'陪伴式儿童教育平台',year:'2026',category:'UI/UX Design',cover:'/assets/projects/baby-classroom/cover.png',aspectRatio:3/2,themeColor:'#55b9e8',destinationType:'internal',route:'/projects/baby-classroom'},
  {id:'su-ip-design',slug:'su-ip-design',index:'02',title:'IP设计',subtitle:'IP Designers 苏璇 :)',year:'2026',category:'IP Design',cover:'/assets/projects/su-ip-design/cover.png',aspectRatio:3/2,themeColor:'#e95029',destinationType:'internal',route:'/projects/su-ip-design'},
  {id:'butterfly-journey',slug:'butterfly-journey',index:'03',title:'《蝶变之旅》',subtitle:'美甲信息可视化设计',year:'2026',category:'Data Visualization',cover:'/assets/projects/butterfly-journey/cover.png',aspectRatio:3/2,themeColor:'#8b221b',destinationType:'internal',route:'/projects/butterfly-journey'},
  {id:'red-sun-duck-egg',slug:'red-sun-duck-egg',index:'04',title:'红太阳咸鸭蛋包装设计',subtitle:'红太阳品牌包装系统',year:'2026',category:'Branding / Packaging',cover:'/assets/projects/red-sun-duck-egg/cover.png',aspectRatio:3/2,themeColor:'#bc5948',destinationType:'internal',route:'/projects/red-sun-duck-egg'},
  {id:'ae-live-gift',slug:'ae-live-gift',index:'05',title:'AE直播礼物设计',subtitle:'直播礼物动态视觉设计',year:'2026',category:'Motion Design',cover:'/assets/projects/ae-live-gift/cover.png',aspectRatio:16/9,themeColor:'#8f75cf',destinationType:'internal',route:'/projects/ae-live-gift'},
]

export type VisualSlot={slotIndex:number;id:string;cover:string;aspectRatio:number;themeColor:string;projectIndex:number|null}

const assetPool=spiralProjects.map((project,projectIndex)=>({...project,projectIndex}))

export const visualSlots:VisualSlot[]=Array.from({length:24},(_,slotIndex)=>{
  const asset=assetPool[slotIndex%assetPool.length]
  return {slotIndex,id:`${asset.id}-${slotIndex}`,cover:asset.cover,aspectRatio:asset.aspectRatio,themeColor:asset.themeColor,projectIndex:asset.projectIndex}
})
