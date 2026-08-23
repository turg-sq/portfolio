export type ProjectCategory = 'UI/UX' | 'Branding' | 'IP' | 'Motion' | 'Data Visualization'

export type Project = {
  id: string
  slug: string
  index: string
  title: string
  subtitle: string
  year: string
  category: ProjectCategory
  summary: string
  cover: null
  themeColor: string
  featured: boolean
}

const projectRecords: Project[] = [
  { id: 'baby-classroom', slug: 'baby-classroom', index: '01', title: '宝宝小课堂', subtitle: '儿童教育产品 UI/UX', year: '2025', category: 'UI/UX', summary: '面向儿童学习场景的产品界面设计。', cover: null, themeColor: '#D8E7FF', featured: true },
  { id: 'red-sun', slug: 'red-sun-salted-duck-eggs', index: '02', title: '红太阳咸鸭蛋', subtitle: '包装设计', year: '2024', category: 'Branding', summary: '食品包装视觉系统。', cover: null, themeColor: '#F3D126', featured: false },
  { id: 'prolo', slug: 'prolo-red-bag', index: '03', title: '普罗小红袋', subtitle: 'IP Design / Branding', year: '2025', category: 'IP', summary: '围绕“普罗小红袋”建立的 IP 与品牌视觉探索。', cover: null, themeColor: '#F06A4D', featured: true },
  { id: 'ae-gift', slug: 'ae-live-gift', index: '04', title: 'AE 直播礼物', subtitle: '动态视觉设计', year: '2024', category: 'Motion', summary: '直播场景礼物动效设计。', cover: null, themeColor: '#CFC2F0', featured: false },
  { id: 'nail-journey', slug: 'nail-journey', index: '05', title: '《蝶变之旅》', subtitle: '美甲信息可视化', year: '2024', category: 'Data Visualization', summary: '美甲主题的信息可视化作品。', cover: null, themeColor: '#A9D1C7', featured: false },
]

export const projects: Project[] = projectRecords.map(project => ({...project, year: '2026'}))
