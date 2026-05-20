"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "../context/CartContext"
import { useSession } from "../hooks/useSession"
import styles from "./styles/header.module.css"

export function Header() {
  const { session, roleId } = useSession()
  const { isEmpty, itemCount } = useCart()
  const pathname = usePathname()
  const dashboardLabel =
    roleId !== null && roleId >= 1 ? "Tableau de bord" : "Profil"

  return (
    <header>
      <a href="/">
        <h1>VITE & GOURMAND</h1>
      </a>
      <nav>
        <ul>
          {!isEmpty && (
            <li
              className={
                styles.cartLinkContainer +
                (pathname === "/order"
                  ? ""
                  : " " + styles.cartLinkContainerAnimation)
              }>
              <Link href="/order" className={styles.cartLink}>
                <Image
                  src="/shoppingCart.svg"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.cartIcon}
                  aria-hidden
                />
                <span className={styles.cartCount}>{itemCount}</span>
                <span className="sr-only">Panier</span>
              </Link>
            </li>
          )}
          <li>
            <a href="/menus">Menus</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          {!session && (
            <li>
              <a href="/login">Connexion</a>
            </li>
          )}
          {session && (
            <li>
              <a href="/dashboard">{dashboardLabel}</a>
            </li>
          )}
          {session && (
            <li>
              <a href="/logout">Déconnexion</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
