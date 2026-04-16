"use client"
import { useState } from "react"
import { testPassword } from "../actions"
import { Footer } from "../components/Footer"
import Form from "../components/Form"
import { Header } from "../components/Header"
import debounce from "../utils/debounce"
import styles from "./signup.module.css"

export default function SignUp() {
  const [passwordStrength, setPasswordStrength] = useState<number>(0)

  const signUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.target as HTMLFormElement)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const address = formData.get("address") as string
    const password = formData.get("password") as string
    const CGV = formData.get("CGV")
    const legals = formData.get("legals") as string
    console.log(
      "firsName : " + firstName,
      "lastName : " + lastName,
      "email : " + email,
      "phoneNumber : " + phoneNumber,
      "address : " + address,
      "password : " + password,
      "CGV accepted : " + CGV === "on",
      "legals accepted : " + legals === "on",
    )
  }

  const debouncedTestPassword = debounce(testPassword, 500)

  const isPasswordValid = async (password: string) => {
    const passwordStrength = debouncedTestPassword(password)
    setPasswordStrength(await passwordStrength)
    console.log(passwordStrength)
  }

  return (
    <div className="page">
      <Header />
      <main className="main">
        <Form onSubmit={signUp} submitText="S'inscrire" className={styles.form}>
          <section>
            <div>
              <label htmlFor="firstName">Prénom *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                minLength={2}
                maxLength={30}
                autoComplete="given-name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName">Nom *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                maxLength={30}
                required
              />
            </div>
          </section>
          <label htmlFor="email">Email *</label>
          <input
            type="text"
            id="email"
            name="email"
            maxLength={100}
            autoComplete="email"
            required
          />
          <label htmlFor="phoneNumber">Numéro de téléphone *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="06XXXXXXXX"
            maxLength={20}
            autoComplete="tel"
            required
          />
          <label htmlFor="address">Adresse</label>
          <textarea
            id="address"
            name="address"
            placeholder="1, Avenue Dupont, 33000, Bordeaux"
            maxLength={150}
            autoComplete="shipping street-address"
          />
          <label htmlFor="password">Mot de passe *</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => isPasswordValid(e.target.value)}
            maxLength={32}
            autoComplete="new-password"
            required
          />
          {(passwordStrength === 0 && (
            <p className={styles.passwordStrength} style={{ color: "red" }}>
              Votre mot de passe doit contenir entre 8 et 32 caractères.
            </p>
          )) ||
            (passwordStrength < 4 && (
              <p
                className={styles.passwordStrength}
                style={{ color: "yellow" }}>
                Votre mot de passe est trop faible. Il doit contenir au moins
                une lettre majuscule, une lettre minuscule, un chiffre et un
                caractère spécial.
              </p>
            ))}
          {passwordStrength === 4 && (
            <p className={styles.passwordStrength} style={{ color: "green" }}>
              Votre mot de passe est fort.
            </p>
          )}
          <p>
            <input type="checkbox" id="CGV" name="CGV" required></input> J'ai lu
            et j'approuve les <a href="/CGV">condition générales de ventes</a>
          </p>
          <p>
            <input type="checkbox" id="legals" name="legals"></input> J'ai lu et
            j'approuve les <a href="/legals">mentions légales</a>
          </p>
        </Form>
      </main>
      <Footer />
    </div>
  )
}
