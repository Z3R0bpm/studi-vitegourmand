"use client"

import { useState } from "react"
import styles from "./dashboard.module.css"
import { DishSearchBar } from "./DishSearchBar"
import {
  DISH_TYPE_LABELS,
  DISH_TYPE_ORDER,
  filterBySearch,
  groupByDishType,
} from "./dishTypes"

type DishOption = {
  id: number
  label: string
  dishType: string
}

export function DishesByTypePicker({
  dishes,
  selectedIds,
  searchId,
}: {
  dishes: DishOption[]
  selectedIds?: number[]
  searchId: string
}) {
  const [search, setSearch] = useState("")
  const filtered = filterBySearch(dishes, search)
  const grouped = groupByDishType(filtered)

  return (
    <div className={styles.dishPicker}>
      <DishSearchBar
        id={searchId}
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un plat à ajouter…"
      />
      {DISH_TYPE_ORDER.map((type) => {
        const typeDishes = grouped[type]
        if (typeDishes.length === 0) return null
        return (
          <div key={type} className={styles.dishTypeGroup}>
            <h4 className={styles.dishTypeHeading}>{DISH_TYPE_LABELS[type]}</h4>
            <div className={styles.checkboxGroup}>
              {typeDishes.map((dish) => (
                <label key={dish.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="dishIds"
                    value={dish.id}
                    defaultChecked={selectedIds?.includes(dish.id)}
                  />
                  {dish.label}
                </label>
              ))}
            </div>
          </div>
        )
      })}
      {filtered.length === 0 && (
        <p className={styles.empty}>Aucun plat ne correspond à la recherche.</p>
      )}
    </div>
  )
}
