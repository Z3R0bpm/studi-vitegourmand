"use client"
import Image from "next/image"
import { useState } from "react"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import styles from "./menus.module.css"

declare type MenuType = {
  id: number
  title: string
  description?: string
  images?: string[] //vercel blob
  theme?: string
  dishes: string[] //probably gonna need a type of its own
  minimalCommand?: number
  allergens?: string[]
  diet?: string[]
  specialsConditions?: string
  stockAvailable: number
}

const showMenuCard = () => {}

function FoodIcons(props: { foods: string[] }) {
  return (
    <div className={styles.inlineFlex}>
      {props.foods.map((food) => (
        <svg>{food === "beaf"}</svg> //next/image instead
      ))}
    </div>
  )
}

function MenusList() {
  const [menus, setMenus] = useState<MenuType[]>()

  function List() {
    console.log("menus: ", menus)
    if (!menus || menus.length < 0) return <p>No menus available</p>
    else console.log("WE HAVE SOME MENUS !")
    return menus.map((menu) => (
      <div onClick={() => showMenuCard()} className={styles.menu}>
        <Image
          className={styles.menuImage}
          src={(menu.images && menu.images[0]) || "/next.svg"}
          alt={"Image du menu : " + menu.title}
          width={300}
          height={100}
          priority
        />
        <h2>{menu.title}</h2>
        <p>{menu.description}</p>
        {/* <FoodIcons props={menu.foods}/> */}
      </div>
    ))
  }

  return (
    <div className={styles.menusList}>
      <List /> {/* not sure about this */}
    </div>
  )
}

export default function Menus() {
  return (
    <div className="page">
      <Header />
      <main className="main">
        <MenusList />
      </main>
      <Footer />
    </div>
  )
}
