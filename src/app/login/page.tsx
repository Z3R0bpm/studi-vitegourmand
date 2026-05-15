"use client"
import { redirect } from "next/navigation"
import { useActionState, useState } from "react"
import { login as loginAction } from "../actions"
import { Footer } from "../components/Footer"
import Form from "../components/Form"
import { Header } from "../components/Header"
import { useSession } from "../hooks/useSession"
import styles from "./login.module.css"

export default function LogIn() {
  const [state, formAction] = useActionState(loginAction, undefined)

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
        <Form formAction={formAction} submitText="Connexion">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={100}
            autoComplete="email"
            required
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            maxLength={32}
            autoComplete="current-password"
            required
          />
          <p>
            <input type="checkbox" onChange={togglePasswordVisibility}></input>{" "}
            Afficher le mot de passe
          </p>
          <p>
            Vous avez oublié votre mot de passe ?{" "}
            <a href="/forgot-password">Mot de passe oublié</a>
          </p>
          <p>
            Vous n'avez pas de compte ? <a href="/signup">Inscription</a>
          </p>
          {state && <p className={styles.error}>{state.error}</p>}
        </Form>
      </main>
      <Footer />
    </div>
  )
}
