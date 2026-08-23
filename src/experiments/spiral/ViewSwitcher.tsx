export type ViewMode='spiral'|'list'

function RollingTextButton({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){
  return <button type="button" aria-label={label} aria-pressed={active} className={`rolling-text-button ${active?'is-active':''}`} onClick={onClick}>
    <span className="rolling-text-viewport">
      <span className="rolling-text-track">
        <span className="rolling-text-line rolling-text-copy" aria-hidden="true">{label}</span>
        <span className="rolling-text-line rolling-text-current">{label}</span>
      </span>
    </span>
  </button>
}

export default function ViewSwitcher({viewMode,onChange}:{viewMode:ViewMode;onChange:(mode:ViewMode)=>void}){
  return <nav className="spiral-view-switcher" aria-label="作品浏览视图">
    <RollingTextButton label="螺旋" active={viewMode==='spiral'} onClick={()=>onChange('spiral')}/>
    <span className="spiral-view-switcher-dot" aria-hidden="true"/>
    <RollingTextButton label="列表" active={viewMode==='list'} onClick={()=>onChange('list')}/>
  </nav>
}
