//server actions like signup and login (only import libs here and nowhere else)
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isDishType } from "./dashboard/dishTypes"
import { ORDER_STATUSES } from "./dashboard/status"
import {
  getUserById,
  login as loginAuth,
  requireAdmin,
  requireEmployee,
  signup as signupAuth,
} from "./lib/auth"
import {
  getAllOrders,
  getDishesConfig,
  getMenuFormOptions,
  getMenusConfig,
  getRoles,
  getUserOrders,
  searchUsers,
} from "./lib/db"
import { parseDishPictureFromForm } from "./lib/dishPicture"
import { cartSubtotal, deliveryPriceForCity } from "./lib/orderPricing"
import checkPasswordStrength from "./lib/passwordTester"
import { prisma } from "./lib/prisma"
import { createSession, getSession } from "./lib/session"

const sanitizeEmail = (email: string) => email.toLowerCase().trim()
const sanitizeString = (string: string) =>
  string.trim().replace(/[^a-zA-Z0-9éèêëàâäîïôöùûüç\s]/g, "")
const sanitizePhoneNumber = (phoneNumber: string) =>
  phoneNumber.trim().replace(/[^0-9+]/g, "")

const isValidPassword = (password: string) => {
  const MIN_LENGTH = 10
  const MAX_LENGTH = 60
  if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
    return false
  }
  if (/[\p{C}]/u.test(password)) {
    return false
  }
  return true
}
const isValidEmail = (email: string) => {
  const escapeCharacters = /[()\[\];:"\,<>]/
  if (escapeCharacters.test(email)) {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return false
  }
  return true
}

export async function login(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = sanitizeEmail(formData.get("email") as string)
  const password = (formData.get("password") as string).normalize("NFC")
  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" }
  }
  if (!isValidEmail(email)) {
    return { error: "L'adresse email est invalide" }
  }
  if (!isValidPassword(password)) {
    return { error: "Le mot de passe est invalide" }
  }
  const user = await loginAuth(email, password)
  if (!user) {
    return { error: "Adresse email ou mot de passe incorrect" }
  }
  await createSession(user.id)
  if (user.role_id >= 1) {
    // 2 is admin, 1 is employee, 0 is user
    redirect("/dashboard")
  } else {
    redirect("/menus")
  }
}

export async function signup(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const firstName = sanitizeString(formData.get("firstName") as string)
  const lastName = sanitizeString(formData.get("lastName") as string)
  const email = sanitizeEmail(formData.get("email") as string)
  const phoneNumber = sanitizePhoneNumber(formData.get("phoneNumber") as string)
  const address = sanitizeString(formData.get("address") as string)
  const city = sanitizeString(formData.get("city") as string)
  const country = sanitizeString(formData.get("country") as string)
  const password = (formData.get("password") as string).normalize("NFC")

  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (!isValidEmail(email)) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (!isValidPassword(password)) {
    return { error: "Le mot de passe est invalide" as string }
  }
  if ((await checkPasswordStrength(password)) < 1) {
    return { error: "Le mot de passe est trop faible" as string }
  }
  if (firstName.length < 2 || firstName.length > 50) {
    return { error: "Le prénom est invalide" as string }
  }
  if (lastName.length < 2 || lastName.length > 50) {
    return { error: "Le nom est invalide" as string }
  }
  if (phoneNumber && (phoneNumber.length > 50 || phoneNumber.length < 10)) {
    return {
      error:
        "Le numéro de téléphone doit contenir au moins 10 caractères" as string,
    }
  }
  if (address && (address.length > 50 || address.length < 10)) {
    return { error: "L'adresse doit contenir au moins 10 caractères" as string }
  }
  if (city && (city.length > 50 || city.length < 3)) {
    return { error: "La ville doit contenir au moins 3 caractères" as string }
  }
  if (country && (country.length > 50 || country.length < 3)) {
    return { error: "Le pays doit contenir au moins 3 caractères" as string }
  }

  const user = await signupAuth(
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    address,
    city,
    country,
  )
  if (!user) {
    return { error: "Une erreur est survenue lors de l'inscription" }
  }
  if (user && "error" in user) {
    return { error: user.error }
  }
  await createSession(user.id)
  if (user.role_id >= 1) {
    // 2 is admin, 1 is employee, 0 is user
    redirect("/dashboard")
  } else {
    redirect("/menus")
  }
}

export const testPassword = async (password: string) => {
  return checkPasswordStrength(password)
}

type OrderCartPayload = { menuId: number; quantity: number }[]

function parseOrderCart(raw: string | null): OrderCartPayload | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const items: OrderCartPayload = []
    for (const entry of parsed) {
      if (
        !entry ||
        typeof entry !== "object" ||
        typeof (entry as OrderCartPayload[number]).menuId !== "number" ||
        typeof (entry as OrderCartPayload[number]).quantity !== "number"
      ) {
        return null
      }
      const { menuId, quantity } = entry as OrderCartPayload[number]
      if (!Number.isInteger(menuId) || menuId < 1) return null
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 60) {
        return null
      }
      items.push({ menuId, quantity })
    }
    return items
  } catch {
    return null
  }
}

export async function submitOrder(
  _prev: { error?: string; success?: boolean; orderId?: number } | undefined,
  formData: FormData,
) {
  const session = await getSession()
  if (!session?.userId) {
    return { error: "Vous devez être connecté pour passer commande" }
  }

  const firstName = sanitizeString(formData.get("firstName") as string)
  const lastName = sanitizeString(formData.get("lastName") as string)
  const email = sanitizeEmail(formData.get("email") as string)
  const phoneNumber = sanitizePhoneNumber(formData.get("phoneNumber") as string)
  const address = sanitizeString(formData.get("address") as string)
  const city = sanitizeString(formData.get("city") as string)
  const country = sanitizeString(formData.get("country") as string)
  const deliveryDateRaw = (formData.get("deliveryDate") as string)?.trim()
  const deliveryTime = (formData.get("deliveryTime") as string)?.trim()

  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" }
  }
  if (!isValidEmail(email)) {
    return { error: "L'adresse email est invalide" }
  }
  if (firstName.length < 2 || firstName.length > 50) {
    return { error: "Le prénom est invalide" }
  }
  if (lastName.length < 2 || lastName.length > 50) {
    return { error: "Le nom est invalide" }
  }
  if (!phoneNumber || phoneNumber.length > 50 || phoneNumber.length < 10) {
    return {
      error: "Le numéro de téléphone doit contenir au moins 10 caractères",
    }
  }
  if (!address || address.length > 50 || address.length < 10) {
    return { error: "L'adresse doit contenir au moins 10 caractères" }
  }
  if (!city || city.length > 50 || city.length < 3) {
    return { error: "La ville doit contenir au moins 3 caractères" }
  }
  if (!country || country.length > 50 || country.length < 3) {
    return { error: "Le pays doit contenir au moins 3 caractères" }
  }
  if (!deliveryDateRaw || !deliveryTime) {
    return { error: "La date et l'heure de livraison sont requises" }
  }

  const deliveryDate = new Date(deliveryDateRaw)
  if (Number.isNaN(deliveryDate.getTime())) {
    return { error: "La date de livraison est invalide" }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deliveryDate.setHours(0, 0, 0, 0)
  if (deliveryDate < today) {
    return { error: "La date de livraison doit être aujourd'hui ou ultérieure" }
  }
  if (deliveryTime.length > 50) {
    return { error: "L'heure de livraison est invalide" }
  }

  const cartPayload = parseOrderCart(formData.get("cart") as string)
  if (!cartPayload) {
    return { error: "Votre panier est vide ou invalide" }
  }

  const menuIds = [...new Set(cartPayload.map((item) => item.menuId))]
  const menus = await prisma.menus.findMany({
    where: {
      id: { in: menuIds },
      OR: [{ available: null }, { available: { not: 0 } }],
    },
  })
  if (menus.length !== menuIds.length) {
    return { error: "Un ou plusieurs menus ne sont plus disponibles" }
  }

  const menuById = new Map(menus.map((menu) => [menu.id, menu]))
  const lineItems = cartPayload.map(({ menuId, quantity }) => {
    const menu = menuById.get(menuId)!
    if (quantity < menu.min_group_size) {
      return null
    }
    return {
      menuId,
      quantity,
      pricePerPerson: menu.price_per_person,
      minGroupSize: menu.min_group_size,
    }
  })
  if (lineItems.some((item) => item === null)) {
    return { error: "La quantité minimale n'est pas respectée pour un menu" }
  }

  const validItems = lineItems.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  )

  const orderPrice = cartSubtotal(validItems)
  const deliveryPrice = deliveryPriceForCity(city)
  const groupSize = validItems.reduce((sum, item) => sum + item.quantity, 0)

  const user = await getUserById(session.userId)
  if (!user) {
    return { error: "Utilisateur introuvable" }
  }

  if (email !== user.email) {
    const existing = await prisma.users.findUnique({ where: { email } })
    if (existing) {
      return { error: "Cette adresse email est déjà utilisée" }
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    await tx.users.update({
      where: { id: session.userId },
      data: {
        firstname: firstName,
        lastname: lastName,
        email,
        phone: phoneNumber,
        address,
        city,
        country,
      },
    })

    const created = await tx.orders.create({
      data: {
        user_id: session.userId,
        order_date: new Date(),
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        order_price: orderPrice,
        group_size: groupSize,
        delivery_price: deliveryPrice,
        status: "On hold",
      },
    })

    await tx.orders_menus.createMany({
      data: validItems.map((item) => ({
        order_id: created.id,
        menu_id: item.menuId,
      })),
    })

    return created
  })

  revalidatePath("/dashboard")
  revalidatePath("/order")
  return { success: true, orderId: order.id }
}

export const sendContactMessage = async (formData: FormData) => {}

export async function getUserData() {
  const session = await getSession()
  if (!session) {
    return null
  }
  const user = await getUserById(session.userId)
  if (!user) {
    return null
  }
  const userData = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    country: user.country,
    role_id: user.role_id,
  }
  return userData
}

export async function updateUserProfile(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const session = await getSession()
  if (!session?.userId) {
    return { error: "Vous devez être connecté" }
  }

  const firstName = sanitizeString(formData.get("firstName") as string)
  const lastName = sanitizeString(formData.get("lastName") as string)
  const email = sanitizeEmail(formData.get("email") as string)
  const phoneNumber = sanitizePhoneNumber(formData.get("phoneNumber") as string)
  const address = sanitizeString(formData.get("address") as string)
  const city = sanitizeString(formData.get("city") as string)
  const country = sanitizeString(formData.get("country") as string)

  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" }
  }
  if (!isValidEmail(email)) {
    return { error: "L'adresse email est invalide" }
  }
  if (firstName.length < 2 || firstName.length > 50) {
    return { error: "Le prénom est invalide" }
  }
  if (lastName.length < 2 || lastName.length > 50) {
    return { error: "Le nom est invalide" }
  }
  if (phoneNumber && (phoneNumber.length > 50 || phoneNumber.length < 10)) {
    return {
      error: "Le numéro de téléphone doit contenir au moins 10 caractères",
    }
  }
  if (address && (address.length > 50 || address.length < 10)) {
    return { error: "L'adresse doit contenir au moins 10 caractères" }
  }
  if (city && (city.length > 50 || city.length < 3)) {
    return { error: "La ville doit contenir au moins 3 caractères" }
  }
  if (country && (country.length > 50 || country.length < 3)) {
    return { error: "Le pays doit contenir au moins 3 caractères" }
  }

  const currentUser = await getUserById(session.userId)
  if (!currentUser) {
    return { error: "Utilisateur introuvable" }
  }

  if (email !== currentUser.email) {
    const existing = await prisma.users.findUnique({ where: { email } })
    if (existing) {
      return { error: "Cette adresse email est déjà utilisée" }
    }
  }

  await prisma.users.update({
    where: { id: session.userId },
    data: {
      firstname: firstName,
      lastname: lastName,
      email,
      phone: phoneNumber || null,
      address: address || null,
      city: city || null,
      country: country || null,
    },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getDashboardOrders() {
  const session = await getSession()
  if (!session) return []
  const user = await getUserById(session.userId)
  if (!user) return []
  if (user.role_id >= 1) return getAllOrders()
  return getUserOrders(user.id)
}

export async function getEmployeeDashboardData() {
  const user = await requireEmployee()
  const isAdmin = user.role_id >= 2
  const [orders, menus, dishes, formOptions, roles] = await Promise.all([
    getAllOrders(),
    getMenusConfig(),
    getDishesConfig(),
    getMenuFormOptions(),
    isAdmin ? getRoles() : Promise.resolve([]),
  ])
  return {
    orders,
    menus,
    dishes,
    formOptions,
    isAdmin,
    roles: roles
      .map((role) =>
        role.id !== 2 ? { id: role.id, label: role.label } : null,
      )
      .filter((role) => role !== null),
    currentUserId: user.id,
  }
}

export async function searchUsersAction(query: string) {
  await requireAdmin()
  return searchUsers(query)
}

export async function updateUserRole(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const admin = await requireAdmin()
  const userId = Number(formData.get("userId"))
  const roleId = Number(formData.get("roleId"))

  if (!userId || Number.isNaN(roleId)) {
    return { error: "Données invalides" }
  }

  if (userId === admin.id && roleId < 2) {
    return {
      error: "Vous ne pouvez pas retirer votre propre accès administrateur",
    }
  }

  const role = await prisma.roles.findUnique({ where: { id: roleId } })
  if (!role) {
    return { error: "Rôle invalide" }
  }

  const target = await prisma.users.findUnique({ where: { id: userId } })
  if (!target) {
    return { error: "Utilisateur introuvable" }
  }

  await prisma.users.update({
    where: { id: userId },
    data: { role_id: roleId },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateOrderStatus(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  await requireEmployee()
  const orderId = Number(formData.get("orderId"))
  const status = formData.get("status") as string
  if (
    !orderId ||
    !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])
  ) {
    return { error: "Données invalides" }
  }
  await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function saveMenu(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  await requireEmployee()
  const id = formData.get("id") ? Number(formData.get("id")) : null
  const title = sanitizeString(formData.get("title") as string)
  const description = sanitizeString(formData.get("description") as string)
  const minGroupSize = Number(formData.get("minGroupSize"))
  const pricePerPerson = Number(formData.get("pricePerPerson"))
  const available = formData.get("available") === "on" ? 1 : 0
  const themeId = Number(formData.get("themeId"))
  const dietId = Number(formData.get("dietId"))
  const dishIds = formData
    .getAll("dishIds")
    .map((v) => Number(v))
    .filter((n) => !Number.isNaN(n))

  if (!title || title.length < 2 || minGroupSize < 1 || pricePerPerson <= 0) {
    return { error: "Veuillez remplir tous les champs obligatoires" }
  }

  if (id) {
    await prisma.menus.update({
      where: { id },
      data: {
        title,
        description: description || null,
        min_group_size: minGroupSize,
        price_per_person: pricePerPerson,
        available,
        theme_id: themeId,
        diet_id: dietId,
      },
    })
    await prisma.menus_dishes.deleteMany({ where: { menu_id: id } })
    if (dishIds.length > 0) {
      await prisma.menus_dishes.createMany({
        data: dishIds.map((dish_id) => ({ menu_id: id, dish_id })),
      })
    }
  } else {
    const menu = await prisma.menus.create({
      data: {
        title,
        description: description || null,
        min_group_size: minGroupSize,
        price_per_person: pricePerPerson,
        available,
        theme_id: themeId,
        diet_id: dietId,
      },
    })
    if (dishIds.length > 0) {
      await prisma.menus_dishes.createMany({
        data: dishIds.map((dish_id) => ({ menu_id: menu.id, dish_id })),
      })
    }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteMenu(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  await requireEmployee()
  const id = Number(formData.get("id"))
  if (!id) return { error: "Menu introuvable" }
  await prisma.menus.delete({ where: { id } })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function saveDish(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  await requireEmployee()
  const id = formData.get("id") ? Number(formData.get("id")) : null
  const title = sanitizeString(formData.get("title") as string)
  const dishTypeRaw = formData.get("dishType") as string
  const allergenIds = formData
    .getAll("allergenIds")
    .map((v) => Number(v))
    .filter((n) => !Number.isNaN(n))

  if (!title || title.length < 2) {
    return { error: "Le titre du plat est requis" }
  }

  if (!isDishType(dishTypeRaw)) {
    return { error: "Type de plat invalide" }
  }

  const pictureResult = await parseDishPictureFromForm(formData)
  if (!pictureResult.ok) {
    return { error: pictureResult.error }
  }

  const pictureData =
    pictureResult.picture !== undefined
      ? { picture: pictureResult.picture as Uint8Array<ArrayBuffer> }
      : {}

  if (id) {
    await prisma.dishes.update({
      where: { id },
      data: { title, dish_type: dishTypeRaw, ...pictureData },
    })
    await prisma.dishes_allergens.deleteMany({ where: { dish_id: id } })
    if (allergenIds.length > 0) {
      await prisma.dishes_allergens.createMany({
        data: allergenIds.map((allergen_id) => ({ dish_id: id, allergen_id })),
      })
    }
  } else {
    const dish = await prisma.dishes.create({
      data: { title, dish_type: dishTypeRaw, ...pictureData },
    })
    if (allergenIds.length > 0) {
      await prisma.dishes_allergens.createMany({
        data: allergenIds.map((allergen_id) => ({
          dish_id: dish.id,
          allergen_id,
        })),
      })
    }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteDish(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  await requireEmployee()
  const id = Number(formData.get("id"))
  if (!id) return { error: "Plat introuvable" }
  await prisma.dishes.delete({ where: { id } })
  revalidatePath("/dashboard")
  return { success: true }
}
