//server actions like signup and login (only import libs here and nowhere else)
"use server"

import { redirect } from "next/navigation"
import { login as loginDB, signup as signupDB } from "./lib/auth"
import checkPasswordStrength from "./lib/passwordTester"
import { createSession as createSessionDB } from "./lib/session"

const sanitizeEmail = (email: string) =>
  email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+-]/g, "")
const sanitizePassword = (password: string) =>
  password.trim().replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=;':",.<>?]/g, "")
const sanitizeString = (string: string) =>
  string.trim().replace(/[^a-zA-Z0-9éèêëàâäîïôöùûüç\s]/g, "")
const sanitizePhoneNumber = (phoneNumber: string) =>
  phoneNumber.trim().replace(/[^0-9]/g, "")

export async function login(prevState: any, formData: FormData) {
  const email = sanitizeEmail(formData.get("email") as string)
  const password = sanitizePassword(formData.get("password") as string)
  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (password.length < 8 || password.length > 32) {
    return { error: "Le mot de passe est invalide" as string }
  }
  const user = await loginDB(email, password)
  if (!user) {
    return { error: "Adresse email ou mot de passe incorrect" }
  }
  await createSessionDB(user.id)
  if (user.role_id >= 1) {
    // 2 is admin, 1 is employee, 0 is user
    redirect("/dashboard")
  } else {
    redirect("/menus")
  }
}

export async function signup(prevState: any, formData: FormData) {
  const firstName = sanitizeString(formData.get("firstName") as string)
  const lastName = sanitizeString(formData.get("lastName") as string)
  const email = sanitizeEmail(formData.get("email") as string)
  const phoneNumber = sanitizePhoneNumber(formData.get("phoneNumber") as string)
  const address = sanitizeString(formData.get("address") as string)
  const city = sanitizeString(formData.get("city") as string)
  const country = sanitizeString(formData.get("country") as string)
  const password = sanitizePassword(formData.get("password") as string)

  if (!email.includes("@") || email.length > 255 || email.length < 3) {
    return { error: "L'adresse email est invalide" as string }
  }
  if (password.length < 8 || password.length > 32) {
    return { error: "Le mot de passe est invalide" as string }
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

  const user = await signupDB(
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
  await createSessionDB(user.id)
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
