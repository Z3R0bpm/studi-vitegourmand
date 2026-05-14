import { useSession } from "../hooks/useSession"

export function Header() {
  const { session, loading } = useSession()
  return (
    <header>
      <a href="/">
        <h1>VITE & GOURMAND</h1>
      </a>
      <nav>
        <ul>
          <li>
            <a href="/menus">Menus</a>
          </li>
          {!session && (
            <li>
              <a href="/login">Connexion</a>
            </li>
          )}
          <li>
            <a href="/contact">Contact</a>
          </li>
          {session && (
            <li>
              <a href="/profile">Mon profil</a>
            </li>
          )}
          {session && (
            <li>
              <a href="/logout">Déconnexion</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
