"use client"
import Image from "next/image"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import styles from "./styles/mainPage.module.css"

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main className="main">
        <section className={styles.section}>
          <div>
            <h1>Qu'est ce que Vite & Gourmand ?</h1>
            <p>
              Looking for a starting point or more instructions? Head over to{" "}
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer">
                Templates
              </a>{" "}
              or the{" "}
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer">
                Learning
              </a>{" "}
              center.
            </p>
          </div>
          <Image
            className={styles.companyImage}
            src="/next.svg"
            alt="Next.js logo"
            width={300}
            height={100}
            priority
          />
        </section>
        <section className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer">
            <Image
              className={styles.companyImage}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer">
            Documentation
          </a>
        </section>
        <section className={styles.section}>
          <div>
            <Image
              className={styles.companyImage}
              src="/next.svg"
              alt="Julie"
              width={100}
              height={100}
            />
            <p>Hi ! I'm Julie</p>
          </div>
          <div>
            <Image
              className={styles.companyImage}
              src="/next.svg"
              alt="Jose"
              width={100}
              height={100}
            />
            <p>Hi ! I'm Jose</p>
          </div>
        </section>
        <section>{/* <Reviews /> */}</section>
      </main>
      <Footer />
    </div>
  )
}
