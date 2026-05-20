"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserData } from "../actions"
import styles from "./order.module.css"

export type CustomerInfo = {
  firstname: string
  lastname: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  deliveryDate: string
  deliveryTime: string
}

function readFormData(form: HTMLFormElement): CustomerInfo {
  const data = new FormData(form)
  return {
    firstname: (data.get("firstName") as string) ?? "",
    lastname: (data.get("lastName") as string) ?? "",
    email: (data.get("email") as string) ?? "",
    phone: (data.get("phoneNumber") as string) ?? "",
    address: (data.get("address") as string) ?? "",
    city: (data.get("city") as string) ?? "",
    country: (data.get("country") as string) ?? "",
    deliveryDate: (data.get("deliveryDate") as string) ?? "",
    deliveryTime: (data.get("deliveryTime") as string) ?? "",
  }
}

export function OrderCustomerForm({
  formId,
  formAction,
  formData,
  setFormData,
  cartJson,
}: {
  formId: string
  formAction: (formData: FormData) => void
  formData: CustomerInfo
  setFormData: (data: CustomerInfo) => void
  cartJson: string
}) {
  const [user, setUser] = useState<CustomerInfo | null | undefined>(undefined)

  useEffect(() => {
    getUserData().then((data) => {
      if (!data) {
        setUser(null)
        return
      }
      setUser({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        country: data.country ?? "",
        deliveryDate: "",
        deliveryTime: "",
      })
    })
  }, [])

  useEffect(() => {
    if (!user) return
    setFormData({
      ...formData,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once when user loads
  }, [user])

  if (user === undefined) {
    return <p className={styles.orderHint}>Chargement de vos informations…</p>
  }

  const minDeliveryDate = new Date().toISOString().slice(0, 10)

  return (
    <div className={styles.customerSection}>
      {!user && (
        <p className={styles.orderHint}>
          <Link href="/login" className={styles.orderLink}>
            Connectez-vous
          </Link>{" "}
          pour passer commande et pré-remplir vos informations.
        </p>
      )}

      <form
        id={formId}
        action={formAction}
        className={styles.customerForm}
        onChange={(e) => setFormData(readFormData(e.currentTarget))}>
        <input type="hidden" name="cart" value={cartJson} readOnly />

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="order-firstName">Prénom *</label>
            <input
              id="order-firstName"
              name="firstName"
              defaultValue={user?.firstname ?? formData.firstname}
              required
              minLength={2}
              maxLength={50}
              autoComplete="given-name"
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="order-lastName">Nom *</label>
            <input
              id="order-lastName"
              name="lastName"
              defaultValue={user?.lastname ?? formData.lastname}
              required
              minLength={2}
              maxLength={50}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="order-email">Email *</label>
          <input
            id="order-email"
            name="email"
            type="email"
            defaultValue={user?.email ?? formData.email}
            required
            maxLength={255}
            autoComplete="email"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="order-phoneNumber">Téléphone *</label>
          <input
            id="order-phoneNumber"
            name="phoneNumber"
            type="tel"
            defaultValue={user?.phone ?? formData.phone}
            placeholder="06XXXXXXXX"
            required
            minLength={10}
            maxLength={50}
            autoComplete="tel"
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="order-address">Adresse *</label>
          <textarea
            id="order-address"
            name="address"
            defaultValue={user?.address ?? formData.address}
            placeholder="1, Avenue Dupont"
            required
            minLength={10}
            maxLength={50}
            autoComplete="street-address"
            rows={2}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="order-city">Ville *</label>
            <input
              id="order-city"
              name="city"
              defaultValue={user?.city ?? formData.city}
              placeholder="Bordeaux"
              required
              minLength={3}
              maxLength={50}
              autoComplete="address-level2"
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="order-country">Pays *</label>
            <input
              id="order-country"
              name="country"
              defaultValue={user?.country ?? formData.country}
              placeholder="France"
              required
              minLength={3}
              maxLength={50}
              autoComplete="country-name"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="order-deliveryDate">Date de livraison *</label>
            <input
              id="order-deliveryDate"
              name="deliveryDate"
              type="date"
              min={minDeliveryDate}
              defaultValue={formData.deliveryDate}
              required
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="order-deliveryTime">Heure de livraison *</label>
            <input
              id="order-deliveryTime"
              name="deliveryTime"
              type="time"
              defaultValue={formData.deliveryTime}
              required
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="order-message">Message (optionnel)</label>
          <textarea
            id="order-message"
            name="message"
            placeholder="Instructions de livraison, allergies…"
            maxLength={500}
            autoComplete="off"
            rows={3}
          />
        </div>
      </form>
    </div>
  )
}
