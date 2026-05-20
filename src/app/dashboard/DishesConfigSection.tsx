"use client"

import Image from "next/image"
import { useActionState, useEffect, useMemo, useState } from "react"
import { deleteDish, saveDish } from "../actions"
import styles from "./dashboard.module.css"
import { DishSearchBar } from "./DishSearchBar"
import {
  DISH_TYPE_LABELS,
  DISH_TYPE_ORDER,
  DISH_TYPES,
  filterBySearch,
  getDishTypeLabel,
  groupByDishType,
  type Dish,
  type DishType,
  type FormOptions,
} from "./dishTypes"

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

  const defaultType =
    dish?.dishType && DISH_TYPES.includes(dish.dishType as DishType)
      ? dish.dishType
      : "main"

  return (
    <form action={formAction} className={styles.configCard}>
      {dish && <input type="hidden" name="id" value={dish.id} />}
      <h3>{dish ? `Modifier : ${dish.title}` : "Nouveau plat"}</h3>

      <div className={styles.formGrid}>
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
        <div className={styles.formField}>
          <label htmlFor="dish-type">Type</label>
          <select
            id="dish-type"
            name="dishType"
            defaultValue={defaultType}
            required>
            {DISH_TYPES.map((type) => (
              <option key={type} value={type}>
                {getDishTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
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

function DishCard({ dish, onEdit }: { dish: Dish; onEdit: () => void }) {
  return (
    <article className={styles.configCard}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
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
            <span className={styles.tag}>
              {getDishTypeLabel(dish.dishType)}
            </span>
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
        <button type="button" className={styles.btnSecondary} onClick={onEdit}>
          Modifier
        </button>
        <DeleteDishButton id={dish.id} />
      </div>
    </article>
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
  const [search, setSearch] = useState("")

  const editingDish = dishes.find((d) => d.id === editingId)

  const searchableDishes = useMemo(
    () => dishes.map((d) => ({ ...d, label: d.title })),
    [dishes],
  )

  const filteredDishes = useMemo(
    () => filterBySearch(searchableDishes, search),
    [searchableDishes, search],
  )

  const groupedDishes = useMemo(
    () => groupByDishType(filteredDishes),
    [filteredDishes],
  )

  const hasResults = filteredDishes.length > 0

  return (
    <div className={styles.configPanel}>
      <DishSearchBar
        id="dish-list-search"
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un plat par nom…"
      />

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

      {DISH_TYPE_ORDER.map((type) => {
        const typeDishes = groupedDishes[type]
        if (typeDishes.length === 0) return null
        return (
          <section key={type} className={styles.dishTypeSection}>
            <h2 className={styles.dishTypeHeading}>{DISH_TYPE_LABELS[type]}</h2>
            {typeDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onEdit={() => {
                  setEditingId(dish.id)
                  setShowNew(false)
                }}
              />
            ))}
          </section>
        )
      })}

      {!hasResults && !showNew && (
        <p className={styles.empty}>
          {search.trim()
            ? "Aucun plat ne correspond à la recherche."
            : "Aucun plat configuré."}
        </p>
      )}
    </div>
  )
}
