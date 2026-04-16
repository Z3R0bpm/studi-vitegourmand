"use client"
import { Footer } from "../components/Footer"
import Form from "../components/Form"
import { Header } from "../components/Header"
import styles from "./contact.module.css"

export default function Menus() {
  const sendContactForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const formData = new FormData(event.target as HTMLFormElement)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const message = formData.get("message") as string
    const email = formData.get("email") as string
    console.log(email, firstName, lastName, message)
  }
  return (
    <div className="page">
      <Header />
      <main className="main">
        <Form
          onSubmit={sendContactForm}
          submitText="Envoyer"
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
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            maxLength={100}
            autoComplete="email"
            required
          />
          <label htmlFor="message">Votre message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Entrez votre message ici..."
            minLength={5}
            maxLength={500}
            required
          />
        </Form>
      </main>
      <Footer />
    </div>
  )
}
