const STATUS_LABELS: Record<string, string> = {
  "On hold": "En attente",
  Confirmed: "Confirmée",
  "In preparation": "En préparation",
  Delivered: "Livrée",
  Cancelled: "Annulée",
}

const STATUS_CLASSES: Record<string, string> = {
  "On hold": "statusOnHold",
  Confirmed: "statusConfirmed",
  "In preparation": "statusInPrep",
  Delivered: "statusDelivered",
  Cancelled: "statusCancelled",
}

export const ORDER_STATUSES = [
  "On hold",
  "Confirmed",
  "In preparation",
  "Delivered",
  "Cancelled",
] as const

export function getStatusLabel(status: string) {
  return STATUS_LABELS[status] ?? status
}

export function getStatusClass(status: string) {
  return STATUS_CLASSES[status] ?? "statusOnHold"
}
