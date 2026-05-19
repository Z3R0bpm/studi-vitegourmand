export const DISH_TYPES = ["starter", "main", "dessert"] as const
export type DishType = (typeof DISH_TYPES)[number]

export const DISH_TYPE_LABELS: Record<DishType, string> = {
  starter: "Entrées",
  main: "Plats",
  dessert: "Desserts",
}

export const DISH_TYPE_SINGULAR: Record<DishType, string> = {
  starter: "Entrée",
  main: "Plat",
  dessert: "Dessert",
}

export const DISH_TYPE_ORDER: DishType[] = [...DISH_TYPES]

export function isDishType(value: string): value is DishType {
  return (DISH_TYPES as readonly string[]).includes(value)
}

export function getDishTypeLabel(type: string) {
  return DISH_TYPE_SINGULAR[type as DishType] ?? type
}

export function filterBySearch<T extends { label: string }>(
  items: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => item.label.toLowerCase().includes(q))
}

export function groupByDishType<T extends { dishType: string }>(
  items: T[],
): Record<DishType, T[]> {
  return DISH_TYPE_ORDER.reduce(
    (groups, type) => {
      groups[type] = items.filter((item) => item.dishType === type)
      return groups
    },
    {} as Record<DishType, T[]>,
  )
}
