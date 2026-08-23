type Props = { onWorks: () => void }

export default function Navigation({ onWorks }: Props) {
  return <nav className="site-nav" aria-label="主导航">
    <button onClick={onWorks}>Works</button>
    <button disabled aria-label="Archive，暂未开放">Archive <span>soon</span></button>
    <button disabled aria-label="About，暂未开放">About <span>soon</span></button>
  </nav>
}
