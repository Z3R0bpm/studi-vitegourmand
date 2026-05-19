"use client"

import Image from "next/image"
import { useActionState, useEffect, useState } from "react"
import { deleteDish, saveDish } from "../actions"
import styles from "./dashboard.module.css"

type Dish = {
  id: number
  title: string
  hasPicture: boolean
  allergens: string[]
  allergenIds: number[]
}

type FormOptions = {
  allergens: { id: number; label: string }[]
}

function dishPictureUrl(id: number) {
  return `/api/dishes/${id}/picture`
}

function DishForm({
  dish,
  formOptions,
  onCancel,
}: {
  dish?: Dish
  formOptions: FormOptions
  onCancel: () => void
}) {
  const [state, formAction, pending] = useActionState(saveDish, undefined)
  const [preview, setPreview] = useState<string | null>(
    dish?.hasPicture ? dishPictureUrl(dish.id) : null,
  )
  const [removePicture, setRemovePicture] = useState(false)

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setRemovePicture(false)
    setPreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  const handleRemovePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setRemovePicture(checked)
    if (checked) {
      setPreview((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current)
        return null
      })
    } else if (dish?.hasPicture) {
      setPreview(dishPictureUrl(dish.id))
    }
  }

  return (
    <form action={formAction} className={styles.configCard}>
      {dish && <input type="hidden" name="id" value={dish.id} />}
      <h3>{dish ? `Modifier : ${dish.title}` : "Nouveau plat"}</h3>

      <div className={styles.formField}>
        <label htmlFor="dish-title">Titre</label>
        <input
          id="dish-title"
          name="title"
          defaultValue={dish?.title}
          required
          maxLength={50}
        />
      </div>

      <div className={`${styles.formField} ${styles.dishImageField}`}>
        <label htmlFor="dish-picture">Image</label>
        <p className={styles.dishImageHint}>JPEG, PNG ou WebP — 2 Mo maximum</p>
        {preview && !removePicture && (
          <Image
            src={preview}
            alt={dish ? `Photo de ${dish.title}` : "Aperçu du plat"}
            width={280}
            height={210}
            className={styles.dishImagePreview}
            unoptimized
          />
        )}
        <input
          id="dish-picture"
          name="picture"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
        {dish?.hasPicture && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="removePicture"
              checked={removePicture}
              onChange={handleRemovePicture}
            />
            Supprimer l&apos;image actuelle
          </label>
        )}
      </div>

      <div className={styles.formField}>
        <span className={styles.infoLabel}>Allergènes</span>
        <div className={styles.checkboxGroup}>
          {formOptions.allergens.map((a) => (
            <label key={a.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="allergenIds"
                value={a.id}
                defaultChecked={dish?.allergenIds.includes(a.id)}
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {state?.success && <p className={styles.success}>Plat enregistré.</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary} disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}

function DeleteDishButton({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(deleteDish, undefined)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={styles.btnDanger} disabled={pending}>
        Supprimer
      </button>
      {state?.error && <span className={styles.error}> {state.error}</span>}
    </form>
  )
}

export function DishesConfigSection({
  dishes,
  formOptions,
}: {
  dishes: Dish[]
  formOptions: FormOptions
}) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNew, setShowNew] = useState(false)

  const editingDish = dishes.find((d) => d.id === editingId)

  return (
    <div className={styles.configPanel}>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => {
            setShowNew(true)
            setEditingId(null)
          }}>
          + Ajouter un plat
        </button>
      </div>

      {showNew && (
        <DishForm
          formOptions={formOptions}
          onCancel={() => setShowNew(false)}
        />
      )}

      {editingDish && (
        <DishForm
          dish={editingDish}
          formOptions={formOptions}
          onCancel={() => setEditingId(null)}
        />
      )}

      {dishes.map((dish) => (
        <article key={dish.id} className={styles.configCard}>
          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            {dish.hasPicture && (
              <Image
                src={dishPictureUrl(dish.id)}
                alt={dish.title}
                width={120}
                height={90}
                className={styles.dishImagePreview}
                style={{ maxWidth: 120 }}
                unoptimized
              />
            )}
            <div style={{ flex: 1 }}>
              <h3>{dish.title}</h3>
              <div className={styles.configMeta}>
                {dish.allergens.length > 0 ? (
                  dish.allergens.map((a) => (
                    <span key={a} className={styles.tag}>
                      {a}
                    </span>
                  ))
                ) : (
                  <span className={styles.tag}>Aucun allergène</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setEditingId(dish.id)
                setShowNew(false)
              }}>
              Modifier
            </button>
            <DeleteDishButton id={dish.id} />
          </div>
        </article>
      ))}

      {dishes.length === 0 && !showNew && (
        <p className={styles.empty}>Aucun plat configuré.</p>
      )}
    </div>
  )
}
