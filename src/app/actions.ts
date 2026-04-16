//server actions like signup and login (only import libs here and nowhere else)
"use server"

import checkPasswordStrength from "./lib/passwordTester"

export const login = async (email: string, password: string) => {}

export const signup = async (formData: FormData) => {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phoneNumber = formData.get("phoneNumber") as string
  const address = formData.get("address") as string
  const password = formData.get("password") as string
  const CGV = formData.get("CGV")
  const legals = formData.get("legals") as string
  console.log(
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    password,
    CGV,
    legals,
  )
  return { success: true }
}

export const testPassword = async (password: string) => {
  return checkPasswordStrength(password)
}

export const order = async () => {}

export const sendContactMessage = async (formData: FormData) => {}
