export type OrderLineItem = {
  pricePerPerson: number
  minGroupSize: number
  quantity: number
}

export function lineItemSubtotal(item: OrderLineItem): number {
  const base = item.pricePerPerson * item.quantity
  const discount =
    item.quantity >= item.minGroupSize + 5 ? base * 0.1 : 0
  return base - discount
}

export function cartSubtotal(items: OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemSubtotal(item), 0)
}

export function deliveryPriceForCity(city: string | null): number {
  return city?.trim().toLowerCase() === "bordeaux" ? 5 : 9.47
}

export function orderTotals(items: OrderLineItem[], city: string | null) {
  const subtotal = cartSubtotal(items)
  const delivery = deliveryPriceForCity(city)
  const tva = subtotal * 0.2
  const total = subtotal + delivery + tva
  return { subtotal, delivery, tva, total }
}
