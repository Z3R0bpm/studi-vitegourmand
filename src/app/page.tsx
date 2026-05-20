"use client"
import Image from "next/image"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import styles from "./styles/mainPage.module.css"

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main className={`main ${styles.homeMain}`}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>
              Qu&apos;est-ce que Vite &amp; Gourmand ?
            </h1>
            <p className={styles.lead}>
              Vite & Gourmand est un site de commande de repas en ligne pour
              toutes les occasions. Découvrez nos <a href="/menus">menus</a> et
              commandez votre repas en ligne dès maintenant.
            </p>
          </div>
          <Image
            className={styles.companyImage}
            src="/kitchen.jpg"
            alt="Cuisine"
            width={600}
            height={600}
            priority
          />
        </section>
        <section className={styles.teamSection}>
          <article className={styles.teamCard}>
            <Image
              className={styles.profileImage}
              src="/julie.jpg"
              alt="Julie"
              width={480}
              height={600}
            />
            <p className={styles.teamCaption}>
              Julie imagine les menus de Vite & Gourmand en mêlant cuisine de
              saison et produits locaux. Elle accompagne chaque client pour
              créer une expérience sur mesure, du dîner intimiste aux grands
              événements.
            </p>
          </article>
          <article className={styles.teamCard}>
            <Image
              className={styles.profileImage}
              src="/jose.jpg"
              alt="José"
              width={480}
              height={600}
            />
            <p className={styles.teamCaption}>
              José veille à l’organisation et à la logistique de chaque
              prestation. De la préparation en cuisine à la livraison sur place,
              il s’assure que chaque plat arrive à l’heure, parfaitement
              présenté et prêt à être dégusté.
            </p>
          </article>
        </section>
        {/* <section> <Reviews /> </section>*/}
      </main>
      <Footer />
    </div>
  )
}
