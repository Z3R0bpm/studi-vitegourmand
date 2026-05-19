"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { updateUserProfile } from "../actions"
import styles from "./dashboard.module.css"

export type UserInfo = {
  firstname: string
  lastname: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
}

export function UserInfoSection({ user }: { user: UserInfo }) {
  const [editing, setEditing] = useState(false)
  const [state, formAction, pending] = useActionState(updateUserProfile, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      setEditing(false)
      router.refresh()
    }
  }, [state?.success, router])

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Mes informations</h1>
        {!editing && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setEditing(true)}>
            Modifier mes informations
          </button>
        )}
      </div>

      {editing ? (
        <form action={formAction} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                defaultValue={user.firstname}
                required
                minLength={2}
                maxLength={50}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                defaultValue={user.lastname}
                required
                minLength={2}
                maxLength={50}
                autoComplete="family-name"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                required
                maxLength={255}
                autoComplete="email"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="phoneNumber">Téléphone</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={user.phone ?? ""}
                maxLength={50}
                autoComplete="tel"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="address">Adresse</label>
              <input
                id="address"
                name="address"
                defaultValue={user.address ?? ""}
                maxLength={50}
                autoComplete="street-address"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="city">Ville</label>
              <input
                id="city"
                name="city"
                defaultValue={user.city ?? ""}
                maxLength={50}
                autoComplete="address-level2"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="country">Pays</label>
              <input
                id="country"
                name="country"
                defaultValue={user.country ?? ""}
                maxLength={50}
                autoComplete="country-name"
              />
            </div>
          </div>

          {state?.error && <p className={styles.error}>{state.error}</p>}
          {state?.success && (
            <p className={styles.success}>Informations mises à jour.</p>
          )}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={pending}>
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
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
      )}
    </section>
  )
}
