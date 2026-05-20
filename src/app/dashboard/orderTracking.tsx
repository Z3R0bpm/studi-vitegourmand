import { formatDate } from "../utils/formatDate"
import styles from "./dashboard.module.css"
import { getStatusClass, getStatusLabel } from "./status"

const TRACKING_STEPS = [
  { status: "Confirmed", label: "Confirmée" },
  { status: "In preparation", label: "En préparation" },
  { status: "Delivered", label: "Livrée" },
] as const

const STATUS_ORDER = TRACKING_STEPS.map((s) => s.status)

const STEP_STATE_CLASS = {
  done: styles.orderTrackingStepDone,
  active: styles.orderTrackingStepActive,
  pending: styles.orderTrackingStepPending,
} as const

function getStepState(
  stepStatus: (typeof STATUS_ORDER)[number],
  currentStatus: string,
): "done" | "active" | "pending" {
  const currentIdx = STATUS_ORDER.indexOf(
    currentStatus as (typeof STATUS_ORDER)[number],
  )
  const stepIdx = STATUS_ORDER.indexOf(stepStatus)
  if (currentIdx < 0 || stepIdx < 0) return "pending"
  if (stepIdx < currentIdx) return "done"
  if (stepIdx === currentIdx) return "active"
  return "pending"
}

type Order = {
  id: number
  orderDate: string
  deliveryDate: Date
  deliveryTime: string
  orderPrice: number
  groupSize: number
  deliveryPrice: number
  status: string
}

const showOrderTracking = (order: Order) => {
  console.log(order.deliveryDate < new Date(Date.now() + 1000 * 60 * 60 * 24))
  const recentlyDelivered =
    order.deliveryDate < new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours before delivery date
  return (
    order.status === "Confirmed" ||
    order.status === "In preparation" ||
    (order.status === "Delivered" && recentlyDelivered)
  )
}

export function OrderTracking({ orders }: { orders: Order[] }) {
  const hasActiveOrder = orders.some((order) => showOrderTracking(order))

  if (!hasActiveOrder) {
    return null
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Suivi de commande</h2>
      <div className={styles.orderTracking}>
        {orders.map((order) => {
          const total = (order.orderPrice + order.deliveryPrice).toFixed(2)

          if (!showOrderTracking(order)) {
            return null
          }

          return (
            <div key={order.id} className={styles.orderTrackingItem}>
              <div className={styles.orderTrackingHeader}>
                <div>
                  <p className={styles.orderTrackingId}>Commande #{order.id}</p>
                  <p className={styles.orderTrackingDelivery}>
                    Livraison le {formatDate(order.deliveryDate)} à{" "}
                    {order.deliveryTime}
                  </p>
                </div>
                <span
                  className={`${styles.status} ${styles[getStatusClass(order.status)]}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <ol
                className={styles.orderTrackingSteps}
                aria-label="Étapes de la commande">
                {TRACKING_STEPS.map((step, index) => {
                  const state = getStepState(step.status, order.status)

                  return (
                    <li
                      key={step.status}
                      className={`${styles.orderTrackingStep} ${STEP_STATE_CLASS[state]}`}
                      aria-current={state === "active" ? "step" : undefined}>
                      <span className={styles.orderTrackingStepMarker}>
                        {state === "done" ? "✓" : index + 1}
                      </span>
                      <span className={styles.orderTrackingStepLabel}>
                        {step.label}
                      </span>
                    </li>
                  )
                })}
              </ol>

              <p className={styles.orderTrackingMeta}>
                {order.groupSize} convive{order.groupSize > 1 ? "s" : ""} ·{" "}
                {total}€
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
