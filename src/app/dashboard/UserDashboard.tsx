import { getDashboardOrders, getUserData } from "../actions"
import styles from "./dashboard.module.css"
import { OrdersTable } from "./OrdersTable"

export async function UserDashboard() {
  const user = await getUserData()
  if (!user) return null

  const orders = await getDashboardOrders()

  return (
    <main className={`main ${styles.dashboard}`}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Mes informations</h1>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Nom</span>
            <span className={styles.infoValue}>{user.lastname}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Prénom</span>
            <span className={styles.infoValue}>{user.firstname}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Téléphone</span>
            <span className={styles.infoValue}>{user.phone || "—"}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Adresse</span>
            <span className={styles.infoValue}>{user.address || "—"}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Ville</span>
            <span className={styles.infoValue}>
              {[user.city, user.country].filter(Boolean).join(", ") || "—"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mes commandes</h2>
        <OrdersTable orders={orders} />
      </section>
    </main>
  )
}
