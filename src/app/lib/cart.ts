export type CartItem = {
  menuId: number
  title: string
  pricePerPerson: number
  minGroupSize: number
  quantity: number
}

export const CART_STORAGE_KEY = "vitegourmand-cart"

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item.menuId === "number" &&
        typeof item.title === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    )
  } catch {
    return []
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}
