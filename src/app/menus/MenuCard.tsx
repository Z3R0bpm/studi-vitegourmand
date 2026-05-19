"use client"
import { getDishTypeLabel } from "../dashboard/dishTypes"
import { DishImageCarousel, type CarouselSlide } from "./DishImageCarousel"
import styles from "./menus.module.css"

export type PublicMenu = {
  id: number
  title: string
  description: string
  minGroupSize: number
  pricePerPerson: number
  theme: string
  diet: string
  dishes: {
    starters: string[]
    mains: string[]
    desserts: string[]
  }
  dishSlides: CarouselSlide[]
}

export function MenuCard({ menu }: { menu: PublicMenu }) {
  const dishSections = [
    { label: getDishTypeLabel("starter"), items: menu.dishes.starters },
    { label: getDishTypeLabel("main"), items: menu.dishes.mains },
    { label: getDishTypeLabel("dessert"), items: menu.dishes.desserts },
  ].filter((section) => section.items.length > 0)

  return (
    <article className={styles.menu}>
      <DishImageCarousel slides={menu.dishSlides} />

      <div className={styles.menuBody}>
        <h2>{menu.title}</h2>
        {menu.description && (
          <p className={styles.menuDescription}>{menu.description}</p>
        )}

        <div className={styles.menuMeta}>
          <span className={styles.menuTag}>{menu.theme}</span>
          <span className={styles.menuTag}>{menu.diet}</span>
          <span className={styles.menuTag}>
            {menu.pricePerPerson.toFixed(2)} € / pers.
          </span>
          <span className={styles.menuTag}>Min. {menu.minGroupSize} pers.</span>
        </div>

        {dishSections.length > 0 && (
          <ul className={styles.menuDishes}>
            {dishSections.map((section) => (
              <li key={section.label}>
                <strong>{section.label} :</strong> {section.items.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
