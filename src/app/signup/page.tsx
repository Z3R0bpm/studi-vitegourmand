"use client"
import { redirect } from "next/navigation"
import { useActionState, useState } from "react"
import { signup as signupAction, testPassword } from "../actions"
import { Footer } from "../components/Footer"
import Form from "../components/Form"
import { Header } from "../components/Header"
import { useSession } from "../hooks/useSession"
import debounce from "../utils/debounce"
import styles from "./signup.module.css"

export default function SignUp() {
  const [passwordStrength, setPasswordStrength] = useState<number>(0)

  const [state, formAction] = useActionState(signupAction, undefined)

  const debouncedTestPassword = debounce(testPassword, 500) //https://github.com/Z3R0bpm/studi-vitegourmand/pull/2#discussion_r3243374483

  const isPasswordValid = async (password: string) => {
    const passwordStrength = debouncedTestPassword(password)
    setPasswordStrength(await passwordStrength)
  }

  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowPassword(event.target.checked)
  }

  const { session, loading } = useSession()
  if (loading)
    return (
      <div className="page">
        <div style={{ textAlign: "center", fontSize: "5em" }}>Loading...</div>
      </div>
    )
  if (session) redirect("/")
  return (
    <div className="page">
      <Header />
      <main className="main">
        <Form
          formAction={formAction}
          submitText="S'inscrire"
          className={styles.form}>
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
          <label htmlFor="phoneNumber">Numéro de téléphone</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="06XXXXXXXX"
            maxLength={20}
            autoComplete="tel"
          />
          <label htmlFor="address">Adresse</label>
          <textarea
            id="address"
            name="address"
            placeholder="1, Avenue Dupont, 33000, Bordeaux"
            maxLength={150}
            autoComplete="shipping street-address"
          />
          <label htmlFor="city">Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="33000, Bordeaux"
            maxLength={50}
            autoComplete="shipping locality"
          />
          <label htmlFor="country">Pays</label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="France"
            maxLength={50}
            autoComplete="shipping country"
          />
          <label htmlFor="password">Mot de passe *</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={(e) => isPasswordValid(e.target.value)}
            maxLength={32}
            autoComplete="new-password"
            required
          />
          <p>
            <input type="checkbox" onChange={togglePasswordVisibility}></input>{" "}
            Afficher le mot de passe
          </p>
          {(passwordStrength === 0 && (
            <p className={styles.passwordStrength} style={{ color: "red" }}>
              Votre mot de passe doit contenir entre 10 et 32 caractères.
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
            <input type="checkbox" id="legals" name="legals" required></input>{" "}
            J'ai lu et j'approuve les <a href="/legals">mentions légales</a>
          </p>
          {state && <p className={styles.error}>{state.error}</p>}
        </Form>
      </main>
      <Footer />
    </div>
  )
}
