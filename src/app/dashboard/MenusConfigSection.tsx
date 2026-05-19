"use client"

import { useActionState, useMemo, useState } from "react"
import { deleteMenu, saveMenu } from "../actions"
import {
  DishImageCarousel,
  type CarouselSlide,
} from "../menus/DishImageCarousel"
import carouselStyles from "../menus/menus.module.css"
import styles from "./dashboard.module.css"
import { DishesByTypePicker } from "./DishesByTypePicker"
import { DishSearchBar } from "./DishSearchBar"

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
  dishes: {
    starters: string[]
    mains: string[]
    desserts: string[]
  }
  dishIds: number[]
  dishSlides: CarouselSlide[]
}

type FormOptions = {
  themes: { id: number; label: string }[]
  diets: { id: number; label: string }[]
  dishes: { id: number; label: string; dishType: string }[]
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
        <DishesByTypePicker
          dishes={formOptions.dishes}
          selectedIds={menu?.dishIds}
          searchId={menu ? `menu-dishes-${menu.id}` : "menu-dishes-new"}
        />
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {state?.success && <p className={styles.success}>Menu enregistré.</p>}

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

function filterMenus(menus: Menu[], query: string): Menu[] {
  const q = query.trim().toLowerCase()
  if (!q) return menus
  return menus.filter(
    (menu) =>
      menu.title.toLowerCase().includes(q) ||
      menu.description.toLowerCase().includes(q) ||
      menu.dishes.starters.some((d) => d.toLowerCase().includes(q)) ||
      menu.dishes.mains.some((d) => d.toLowerCase().includes(q)) ||
      menu.dishes.desserts.some((d) => d.toLowerCase().includes(q)),
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
  const [menuSearch, setMenuSearch] = useState("")
  const [dishSearch, setDishSearch] = useState("")

  const editingMenu = menus.find((m) => m.id === editingId)

  const filteredMenus = useMemo(
    () => filterMenus(menus, menuSearch),
    [menus, menuSearch],
  )

  const filteredMenuDishes = useMemo(() => {
    const q = dishSearch.trim().toLowerCase()
    if (!q) return null
    return (dishes: {
      starters: string[]
      mains: string[]
      desserts: string[]
    }) => {
      return {
        starters: dishes.starters.filter((d) => d.toLowerCase().includes(q)),
        mains: dishes.mains.filter((d) => d.toLowerCase().includes(q)),
        desserts: dishes.desserts.filter((d) => d.toLowerCase().includes(q)),
      }
    }
  }, [dishSearch])

  return (
    <div className={styles.configPanel}>
      <DishSearchBar
        id="menu-list-search"
        value={menuSearch}
        onChange={setMenuSearch}
        placeholder="Rechercher un menu par titre, description…"
      />

      <DishSearchBar
        id="menu-dish-list-search"
        value={dishSearch}
        onChange={setDishSearch}
        placeholder="Rechercher un plat dans les menus…"
      />

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

      {filteredMenus.map((menu) => {
        const visibleDishes = filteredMenuDishes
          ? filteredMenuDishes({
              starters: menu.dishes.starters,
              mains: menu.dishes.mains,
              desserts: menu.dishes.desserts,
            })
          : menu.dishes
        const totalDishes =
          menu.dishes.starters.length +
          menu.dishes.mains.length +
          menu.dishes.desserts.length
        const totalVisible =
          visibleDishes.starters.length +
          visibleDishes.mains.length +
          visibleDishes.desserts.length

        if (dishSearch.trim() && totalDishes > 0 && totalVisible === 0) {
          return null
        }

        return (
          <article key={menu.id} className={styles.configCard}>
            <div className={styles.menuCardTop}>
              <div className={styles.menuCardHeader}>
                <h3>{menu.title}</h3>
                <p className={styles.menuCardDescription}>
                  {menu.description || "Pas de description"}
                </p>
              </div>
              <DishImageCarousel
                slides={menu.dishSlides}
                className={`${carouselStyles.carouselCompact} ${styles.menuCarousel}`}
              />
            </div>
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
            {visibleDishes.starters.length > 0 && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                Entrées : {visibleDishes.starters.join(", ")}
              </p>
            )}
            {visibleDishes.mains.length > 0 && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                Plat principal : {visibleDishes.mains.join(", ")}
              </p>
            )}
            {visibleDishes.desserts.length > 0 && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                Dessert : {visibleDishes.desserts.join(", ")}
              </p>
            )}
            {totalDishes > 0 && totalVisible === 0 && dishSearch.trim() && (
              <p className={styles.dishImageHint}>
                Aucun plat de ce menu ne correspond à la recherche.
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
        )
      })}

      {filteredMenus.length === 0 && !showNew && (
        <p className={styles.empty}>
          {menuSearch.trim() || dishSearch.trim()
            ? "Aucun menu ne correspond à la recherche."
            : "Aucun menu configuré."}
        </p>
      )}
    </div>
  )
}
