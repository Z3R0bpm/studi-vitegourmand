import "server-only"
enum PasswordStrengths {
  WrongSize = 0,
  Common = 1,
  Weak = 2,
  Medium = 3,
  Strong = 4,
}

const isCommonPassword = (password: string) => {
  const commonPatterns = /passw.*|12345.*|qwert.*|asdfg.*|zxcvb.*|admin.*/i
  return commonPatterns.test(password)
}

export default async function checkPasswordStrength(password: string) {
  const MIN_LENGTH = 10
  const MAX_LENGTH = 32

  if (!password || password.length < MIN_LENGTH || password.length > MAX_LENGTH)
    return PasswordStrengths.WrongSize
  if (isCommonPassword(password)) return PasswordStrengths.Common

  let strength = 0
  strength += /[a-z]/.test(password) ? 1 : 0
  strength += /[A-Z]/.test(password) ? 1 : 0
  strength += /[0-9]/.test(password) ? 1 : 0
  strength += /[!@#$%^&*+_=]/.test(password) ? 1 : 0
  if (strength <= 2) return PasswordStrengths.Weak
  if (strength === 3) return PasswordStrengths.Medium
  console.log("strong")
  return PasswordStrengths.Strong
}
