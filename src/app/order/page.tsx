"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { submitOrder } from "../actions"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useCart } from "../context/CartContext"
import { useSession } from "../hooks/useSession"
import { lineItemSubtotal, orderTotals } from "../lib/orderPricing"
import { CustomerInfo, OrderCustomerForm } from "./OrderCustomerForm"
import styles from "./order.module.css"

const ORDER_FORM_ID = "order-checkout-form"

export default function OrderPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const {
    items,
    isEmpty,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart()

  const [formData, setFormData] = useState<CustomerInfo>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    deliveryDate: "",
    deliveryTime: "",
  })

  const [state, formAction, isPending] = useActionState(submitOrder, undefined)
  const clearedRef = useRef(false)

  const cartPayload = useMemo(
    () => items.map(({ menuId, quantity }) => ({ menuId, quantity })),
    [items],
  )
  const cartJson = JSON.stringify(cartPayload)

  const { subtotal, delivery, tva, total } = orderTotals(items, formData.city)

  useEffect(() => {
    if (!state?.success || clearedRef.current) return
    clearedRef.current = true
    clearCart()
    router.push("/dashboard")
  }, [state?.success, clearCart, router])

  const canConfirm =
    !isPending && !sessionLoading && !!session && !isEmpty && !state?.success

  return (
    <div className="page">
      <Header />
      <main className={`main ${styles.orderMain}`}>
        <section className={styles.orderSection}>
          <h2 className={styles.orderHeading}>Vos informations de commande</h2>
          <OrderCustomerForm
            formId={ORDER_FORM_ID}
            formAction={formAction}
            formData={formData}
            setFormData={setFormData}
            cartJson={cartJson}
          />
        </section>

        <section className={styles.orderSection}>
          <h2 className={styles.orderHeading}>Votre commande</h2>

          {isEmpty ? (
            <div className={styles.orderEmpty}>
              <p>Votre panier est vide.</p>
              <Link href="/menus" className={styles.orderLink}>
                Parcourir les menus
              </Link>
            </div>
          ) : (
            <ul className={styles.orderList}>
              {items.map((item) => (
                <li key={item.menuId} className={styles.orderItem}>
                  <div className={styles.orderItemInfo}>
                    <h2>{item.title}</h2>
                    <p>
                      {item.pricePerPerson.toFixed(2)} € / pers. · Min.{" "}
                      {item.minGroupSize} pers.
                    </p>
                    <div className={styles.orderItemQuantity}>
                      <p className={styles.orderQuantity}>
                        Quantité :{" "}
                        {item.quantity > item.minGroupSize && (
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => decrementQuantity(item.menuId)}>
                            -
                          </button>
                        )}{" "}
                        {item.quantity}{" "}
                        {item.quantity < 60 && (
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => incrementQuantity(item.menuId)}>
                            +
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.orderRemove}
                    onClick={() => removeFromCart(item.menuId)}>
                    <Image
                      className={styles.orderRemoveIcon}
                      src="/delete.svg"
                      alt="Retirer"
                      width={24}
                      height={24}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {!isEmpty && (
          <>
            <section className={styles.orderSection}>
              <h2 className={styles.orderHeading}>Détails de votre commande</h2>
              <table className={styles.orderDetails}>
                <thead className={styles.orderDetailHeader}>
                  <tr>
                    <th>Plat</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody className={styles.orderDetailBody}>
                  {items.map((item) => (
                    <tr key={item.menuId}>
                      <td className={styles.orderDetailTitle}>
                        {item.title}
                        <br />
                        {item.pricePerPerson.toFixed(2)}€/pers.
                      </td>
                      <td>{item.quantity} pers.</td>
                      <td>
                        {lineItemSubtotal(item).toFixed(2)} €{" "}
                        {item.quantity >= item.minGroupSize + 5
                          ? "( -10%)"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={styles.orderDetailFooter}>
                  <tr>
                    <td colSpan={2}>Sous-total</td>
                    <td>{subtotal.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      Frais de livraison
                      <span className={styles.orderDetailNote}>
                        {formData.city.trim().toLowerCase() === "bordeaux"
                          ? "5 €"
                          : "5 € (+0,59 €/km hors de Bordeaux)"}
                      </span>
                    </td>
                    <td>{delivery.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>TVA (20 %)</td>
                    <td>{tva.toFixed(2)} €</td>
                  </tr>
                  <tr className={styles.orderDetailTotal}>
                    <td colSpan={2}>Total</td>
                    <td>{total.toFixed(2)} €</td>
                  </tr>
                </tfoot>
              </table>
            </section>

            <section className={styles.orderConfirmSection}>
              {state?.error && (
                <p className={styles.orderError} role="alert">
                  {state.error}
                </p>
              )}
              {state?.success && (
                <p className={styles.orderSuccess} role="status">
                  Commande #{state.orderId} enregistrée. Redirection…
                </p>
              )}
              {!sessionLoading && !session && (
                <p className={styles.orderHint}>
                  <Link href="/login" className={styles.orderLink}>
                    Connectez-vous
                  </Link>{" "}
                  pour confirmer votre commande.
                </p>
              )}
              <button
                type="submit"
                form={ORDER_FORM_ID}
                className={styles.confirmButton}
                disabled={!canConfirm}>
                {isPending ? "Envoi en cours…" : "Confirmer la commande"}
              </button>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
