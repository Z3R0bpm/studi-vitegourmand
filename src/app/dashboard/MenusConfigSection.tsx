"use client"

import { useActionState, useState } from "react"
import { deleteMenu, saveMenu } from "../actions"
import styles from "./dashboard.module.css"

type Menu = {
  id: number
  title: string
  description: string
  minGroupSize: number
  pricePerPerson: number
  available: number | null
  theme: string
  diet: string
  themeId: number
  dietId: number
  dishes: string[]
  dishIds: number[]
}

type FormOptions = {
  themes: { id: number; label: string }[]
  diets: { id: number; label: string }[]
  dishes: { id: number; label: string }[]
}

function MenuForm({
  menu,
  formOptions,
  onCancel,
}: {
  menu?: Menu
  formOptions: FormOptions
  onCancel: () => void
}) {
  const [state, formAction, pending] = useActionState(saveMenu, undefined)

  return (
    <form action={formAction} className={styles.configCard}>
      {menu && <input type="hidden" name="id" value={menu.id} />}
      <h3>{menu ? `Modifier : ${menu.title}` : "Nouveau menu"}</h3>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            name="title"
            defaultValue={menu?.title}
            required
            maxLength={50}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="pricePerPerson">Prix / personne (€)</label>
          <input
            id="pricePerPerson"
            name="pricePerPerson"
            type="number"
            step="0.01"
            min="0"
            defaultValue={menu?.pricePerPerson ?? ""}
            required
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="minGroupSize">Taille min. groupe</label>
          <input
            id="minGroupSize"
            name="minGroupSize"
            type="number"
            min="1"
            defaultValue={menu?.minGroupSize ?? 1}
            required
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="themeId">Thème</label>
          <select
            id="themeId"
            name="themeId"
            defaultValue={menu?.themeId}
            required>
            {formOptions.themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formField}>
          <label htmlFor="dietId">Régime</label>
          <select
            id="dietId"
            name="dietId"
            defaultValue={menu?.dietId}
            required>
            {formOptions.diets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formField}>
          <label>
            <input
              type="checkbox"
              name="available"
              defaultChecked={menu?.available !== 0}
            />{" "}
            Disponible
          </label>
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={menu?.description}
          maxLength={255}
        />
      </div>

      <div className={styles.formField}>
        <span className={styles.infoLabel}>Plats inclus</span>
        <div className={styles.checkboxGroup}>
          {formOptions.dishes.map((d) => (
            <label key={d.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="dishIds"
                value={d.id}
                defaultChecked={menu?.dishIds.includes(d.id)}
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {state?.success && <p className={styles.success}>Menu enregistré.</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary} disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}

function DeleteMenuButton({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(deleteMenu, undefined)

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

export function MenusConfigSection({
  menus,
  formOptions,
}: {
  menus: Menu[]
  formOptions: FormOptions
}) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNew, setShowNew] = useState(false)

  const editingMenu = menus.find((m) => m.id === editingId)

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
          + Ajouter un menu
        </button>
      </div>

      {showNew && (
        <MenuForm
          formOptions={formOptions}
          onCancel={() => setShowNew(false)}
        />
      )}

      {editingMenu && (
        <MenuForm
          menu={editingMenu}
          formOptions={formOptions}
          onCancel={() => setEditingId(null)}
        />
      )}

      {menus.map((menu) => (
        <article key={menu.id} className={styles.configCard}>
          <h3>{menu.title}</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            {menu.description || "Pas de description"}
          </p>
          <div className={styles.configMeta}>
            <span className={styles.tag}>{menu.theme}</span>
            <span className={styles.tag}>{menu.diet}</span>
            <span className={styles.tag}>
              {menu.pricePerPerson.toFixed(2)} € / pers.
            </span>
            <span className={styles.tag}>Min. {menu.minGroupSize} pers.</span>
            <span className={styles.tag}>
              {menu.available !== 0 ? "Disponible" : "Indisponible"}
            </span>
          </div>
          {menu.dishes.length > 0 && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Plats : {menu.dishes.join(", ")}
            </p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setEditingId(menu.id)
                setShowNew(false)
              }}>
              Modifier
            </button>
            <DeleteMenuButton id={menu.id} />
          </div>
        </article>
      ))}

      {menus.length === 0 && !showNew && (
        <p className={styles.empty}>Aucun menu configuré.</p>
      )}
    </div>
  )
}
