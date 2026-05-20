import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import styles from "./legals.module.css"

export default function Menus() {
  return (
    <div className="page">
      <Header />
      <main className="main">
        <p className={styles.legals}>
          Ce projet est distribué sous licence{" "}
          <a href="https://opensource.org/licenses/MIT">MIT</a>.
          <br />
          Les icônes sont issus de{" "}
          <a href="https://fonts.google.com/icons">
            Google Fonts - Material Symbols and Icons
          </a>{" "}
          sous la licence{" "}
          <a href="https://www.apache.org/licenses/LICENSE-2.0.html">
            Apache License 2.0
          </a>{" "}
          ainsi que de <a href="https://fontawesome.com/">Font Awesome</a> sous
          la licence{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0 license
          </a>
          .
          <br />
          Les animations CSS sont issues de{" "}
          <a href="http://animista.net/">Animista</a> sous la licence{" "}
          <a href="http://animista.net/license">FreeBSD License</a>.
        </p>
      </main>
      <Footer />
    </div>
  )
}
