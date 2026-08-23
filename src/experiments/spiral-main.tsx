import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpiralWorksPrototype from './SpiralWorksPrototype'
import './spiral/spiral-prototype.css'
createRoot(document.getElementById('spiral-root')!).render(<StrictMode><SpiralWorksPrototype /></StrictMode>)
