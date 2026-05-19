//server actions like signup and login (only import libs here and nowhere else)
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isDishType } from "./dashboard/dishTypes"
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
  const MAX_LENGTH = 32
  const escapeCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
    return false
  }
  if (escapeCharacters.test(password)) {
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
  const password = formData.get("password") as string
  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (password.length < 8 || password.length > 32) {
    return { error: "Le mot de passe est invalide" as string }
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
  const password = formData.get("password") as string

  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (!isValidEmail(email)) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (password.length < 10 || password.length > 32) {
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

export async function order() {}

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
    roles,
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

const ORDER_STATUSES = [
  "On hold",
  "Confirmed",
  "In preparation",
  "Delivered",
  "Cancelled",
] as const

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
      ? { picture: pictureResult.picture }
      : {}

  if (id) {
    await prisma.dishes.update({
      where: { id },
      data: { title, dish_type: dishTypeRaw, ...(pictureData as any) },
    })
    await prisma.dishes_allergens.deleteMany({ where: { dish_id: id } })
    if (allergenIds.length > 0) {
      await prisma.dishes_allergens.createMany({
        data: allergenIds.map((allergen_id) => ({ dish_id: id, allergen_id })),
      })
    }
  } else {
    const dish = await prisma.dishes.create({
      data: { title, dish_type: dishTypeRaw, ...(pictureData as any) },
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
