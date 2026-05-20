"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  type CartItem,
  loadCartFromStorage,
  saveCartToStorage,
} from "../lib/cart"

type CartMenu = {
  id: number
  title: string
  pricePerPerson: number
  minGroupSize: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  isEmpty: boolean
  addToCart: (menu: CartMenu) => void
  incrementQuantity: (menuId: number) => void
  decrementQuantity: (menuId: number) => void
  removeFromCart: (menuId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadCartFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCartToStorage(items)
  }, [items, hydrated])

  const addToCart = useCallback((menu: CartMenu) => {
    setItems((current) => {
      const existing = current.find((item) => item.menuId === menu.id)
      if (existing) {
        return current.map((item) =>
          item.menuId === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [
        ...current,
        {
          menuId: menu.id,
          title: menu.title,
          pricePerPerson: menu.pricePerPerson,
          minGroupSize: menu.minGroupSize,
          quantity: menu.minGroupSize,
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((menuId: number) => {
    setItems((current) => current.filter((item) => item.menuId !== menuId))
  }, [])

  const incrementQuantity = useCallback((menuId: number) => {
    setItems((current) =>
      current.map((item) =>
        item.menuId === menuId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }, [])

  const decrementQuantity = useCallback((menuId: number) => {
    setItems((current) =>
      current.map((item) =>
        item.menuId === menuId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      isEmpty: itemCount === 0,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      addToCart,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
