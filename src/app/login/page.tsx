"use client"
import { Footer } from "../components/Footer"
import Form from "../components/Form"
import { Header } from "../components/Header"

export default function LogIn() {
  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log(email, password)
  }
  return (
    <div className="page">
      <Header />
      <main className="main">
        <Form onSubmit={login} submitText="Connexion">
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
            type="password"
            id="password"
            name="password"
            maxLength={32}
            autoComplete="current-password"
            required
          />
          <p>
            Vous avez oublié votre mot de passe ?{" "}
            <a href="/forgot-password">Mot de passe oublié</a>
          </p>
          <p>
            Vous n'avez pas de compte ? <a href="/signup">Inscription</a>
          </p>
        </Form>
      </main>
      <Footer />
    </div>
  )
}
