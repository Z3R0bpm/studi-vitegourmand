import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { getPublicMenus } from "../lib/db"
import { MenusList } from "./MenusList"
import styles from "./menus.module.css"

export default async function MenusPage() {
  const menus = await getPublicMenus()

  return (
    <div className="page">
      <Header />
      <main className={`main ${styles.menusMain}`}>
        <h1 className={styles.menusHeading}>Nos menus</h1>

        {menus.length === 0 ? (
          <p className={styles.menusEmpty}>Aucun menu disponible pour le moment.</p>
        ) : (
          <MenusList menus={menus} />
        )}
      </main>
      <Footer />
    </div>
  )
}
