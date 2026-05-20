import { getDashboardOrders, getUserData } from "../actions"
import styles from "./dashboard.module.css"
import { OrdersTable } from "./OrdersTable"
import { OrderTracking } from "./orderTracking"
import { UserInfoSection } from "./UserInfoSection"

export async function UserDashboard() {
  const user = await getUserData()
  if (!user) return null

  const orders = await getDashboardOrders()

  return (
    <main className={`main ${styles.dashboard}`}>
      <UserInfoSection user={user} />

      <section className={styles.section}>
        <OrderTracking orders={orders} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mes commandes</h2>
        <OrdersTable orders={orders} />
      </section>
    </main>
  )
}
