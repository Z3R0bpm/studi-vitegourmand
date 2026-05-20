import { formatDate } from "../utils/formatDate"
import styles from "./dashboard.module.css"
import { getStatusClass, getStatusLabel } from "./status"

type Order = {
  id: number
  orderDate: string
  deliveryDate: Date
  deliveryTime: string
  orderPrice: number
  groupSize: number
  deliveryPrice: number
  status: string
  equipmentLending: boolean
  equipmentReturn: boolean
  menus: string[]
  userName?: string
  userEmail?: string
}

export function OrdersTable({
  orders,
  showClient = false,
}: {
  orders: Order[]
  showClient?: boolean
}) {
  if (orders.length === 0) {
    return <p className={styles.empty}>Aucune commande pour le moment.</p>
  }

  const showActions =
    orders.find((order) => order.status === "On hold") !== undefined
      ? true
      : false

  const total = (order: Order) =>
    (order.orderPrice + order.deliveryPrice).toFixed(2)

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            {showClient && <th>Client</th>}
            <th>Date commande</th>
            <th>Livraison</th>
            <th>Menus</th>
            <th>Convives</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Matériel</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              {showClient && (
                <td>
                  <div>{order.userName}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}>
                    {order.userEmail}
                  </div>
                </td>
              )}
              <td>{order.orderDate}</td>
              <td>
                {formatDate(order.deliveryDate)}
                <br />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                  }}>
                  {order.deliveryTime}
                </span>
              </td>
              <td>{order.menus.join(", ") || "—"}</td>
              <td>{order.groupSize}</td>
              <td>{total(order)}€</td>
              <td>
                <span
                  className={`${styles.status} ${styles[getStatusClass(order.status)]}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td style={{ fontSize: "0.8rem" }}>
                {order.equipmentLending ? "Prêté" : "—"}
                {order.equipmentReturn && " / Retourné"}
              </td>
              {showActions && (
                <td>
                  <button className={styles.btnSecondary}>Annuler</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
