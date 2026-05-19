"use client"

import { useMemo, useState } from "react"
import { MenuCard, type PublicMenu } from "./MenuCard"
import styles from "./menus.module.css"

type SortOption = "title" | "price-asc" | "price-desc" | "group-asc"

function menuMatchesSearch(menu: PublicMenu, query: string) {
  const haystack = [
    menu.title,
    menu.description,
    menu.theme,
    menu.diet,
    ...menu.dishes.starters,
    ...menu.dishes.mains,
    ...menu.dishes.desserts,
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

function sortMenus(menus: PublicMenu[], sort: SortOption) {
  return [...menus].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.pricePerPerson - b.pricePerPerson
      case "price-desc":
        return b.pricePerPerson - a.pricePerPerson
      case "group-asc":
        return a.minGroupSize - b.minGroupSize
      default:
        return a.title.localeCompare(b.title, "fr")
    }
  })
}

export function MenusList({ menus }: { menus: PublicMenu[] }) {
  const [search, setSearch] = useState("")
  const [theme, setTheme] = useState("all")
  const [diet, setDiet] = useState("all")
  const [sort, setSort] = useState<SortOption>("title")

  const themes = useMemo(
    () => [...new Set(menus.map((m) => m.theme))].sort((a, b) => a.localeCompare(b, "fr")),
    [menus],
  )

  const diets = useMemo(
    () => [...new Set(menus.map((m) => m.diet))].sort((a, b) => a.localeCompare(b, "fr")),
    [menus],
  )

  const filteredMenus = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = menus.filter((menu) => {
      if (query && !menuMatchesSearch(menu, query)) return false
      if (theme !== "all" && menu.theme !== theme) return false
      if (diet !== "all" && menu.diet !== diet) return false
      return true
    })

    return sortMenus(filtered, sort)
  }, [menus, search, theme, diet, sort])

  const hasActiveFilters =
    search.trim() !== "" || theme !== "all" || diet !== "all" || sort !== "title"

  const resetFilters = () => {
    setSearch("")
    setTheme("all")
    setDiet("all")
    setSort("title")
  }

  return (
    <>
      <div className={styles.menusToolbar} aria-label="Recherche et filtres">
        <div className={styles.searchBar}>
          <label htmlFor="menu-search" className={styles.srOnly}>
            Rechercher un menu
          </label>
          <input
            id="menu-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, plat, thème…"
            autoComplete="off"
          />
        </div>

        <div className={styles.menusFilters}>
          <div className={styles.filterField}>
            <label htmlFor="filter-theme">Thème</label>
            <select
              id="filter-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}>
              <option value="all">Tous les thèmes</option>
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterField}>
            <label htmlFor="filter-diet">Régime</label>
            <select
              id="filter-diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}>
              <option value="all">Tous les régimes</option>
              {diets.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterField}>
            <label htmlFor="filter-sort">Trier par</label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}>
              <option value="title">Nom (A → Z)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="group-asc">Taille de groupe</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.filterReset}
              onClick={resetFilters}>
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <p className={styles.menusResultCount} aria-live="polite">
        {filteredMenus.length} menu{filteredMenus.length !== 1 ? "s" : ""}{" "}
        trouvé{filteredMenus.length !== 1 ? "s" : ""}
      </p>

      {filteredMenus.length === 0 ? (
        <p className={styles.menusEmpty}>
          Aucun menu ne correspond à votre recherche.
        </p>
      ) : (
        <div className={styles.menusList}>
          {filteredMenus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </>
  )
}
