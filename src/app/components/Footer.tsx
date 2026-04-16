import { OpeningHours } from "./OpeningHours"
import styles from "./styles/footer.module.css"

export function Footer() {
  return (
    <footer>
      <div className={styles.companyInformation}>
        <h2>Horaires d'ouvertures</h2>
        <OpeningHours />
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            title="Notre Instagram"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.google.com/maps/"
            aria-label="address"
            title="Notre adresse"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-solid fa-location-dot"></i>
          </a>
          <a
            href="https://github.com/Z3R0bpm/studi-vitegourmand"
            aria-label="Github"
            title="Dépôt Github du projet"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
      <nav className={styles.mainNav}>
        <ul>
          <li className={styles.h3Link}>
            <a href="/menus">Menus</a>
          </li>
          <li className={styles.h3Link}>
            <a href="/login">Connexion</a>
          </li>
          <li>
            <h3>Support</h3>
            <ul className={styles.supportNav}>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/CGV">Conditions générales de vente</a>
              </li>
              <li>
                <a href="/legals">Mentions légales</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"></link>
    </footer>
  )
}
