"use client"

import { useActionState } from "react"
import { updateOrderStatus } from "../actions"
import { formatDate } from "../utils/formatDate"
import styles from "./dashboard.module.css"
import { ORDER_STATUSES, getStatusClass, getStatusLabel } from "./status"

type Order = {
  id: number
  orderDate: string
  deliveryDate: Date
  deliveryTime: string
  orderPrice: number
  groupSize: number
  deliveryPrice: number
  status: string
  menus: string[]
  userName?: string
  userEmail?: string
}

function OrderStatusForm({ order }: { order: Order }) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    undefined,
  )

  return (
    <form action={formAction} className={styles.orderForm}>
      <input type="hidden" name="orderId" value={order.id} />
      <select name="status" defaultValue={order.status}>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {getStatusLabel(s)}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.btnSecondary} disabled={pending}>
        {pending ? "…" : "OK"}
      </button>
      {state?.error && <span className={styles.error}>{state.error}</span>}
    </form>
  )
}

export function EmployeeOrdersSection({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className={styles.empty}>Aucune commande enregistrée.</p>
  }

  const total = (order: Order) =>
    (order.orderPrice + order.deliveryPrice).toFixed(2)

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Client</th>
            <th>Date commande</th>
            <th>Livraison</th>
            <th>Menus</th>
            <th>Convives</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Modifier</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
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
              <td>
                <OrderStatusForm order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
