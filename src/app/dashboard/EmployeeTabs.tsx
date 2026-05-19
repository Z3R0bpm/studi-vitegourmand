"use client"

import { useState } from "react"
import styles from "./dashboard.module.css"

const BASE_TABS = [
  { id: "orders", label: "Commandes" },
  { id: "menus", label: "Menus" },
  { id: "dishes", label: "Plats" },
] as const

const ADMIN_TAB = { id: "admin", label: "Administration" } as const

type BaseTabId = (typeof BASE_TABS)[number]["id"]
type AdminTabId = typeof ADMIN_TAB.id
type TabId = BaseTabId | AdminTabId

export function EmployeeTabs({
  ordersContent,
  menusContent,
  dishesContent,
  showAdminTab = false,
  adminContent,
}: {
  ordersContent: React.ReactNode
  menusContent: React.ReactNode
  dishesContent: React.ReactNode
  showAdminTab?: boolean
  adminContent?: React.ReactNode
}) {
  const tabs = showAdminTab ? [...BASE_TABS, ADMIN_TAB] : [...BASE_TABS]
  const [activeTab, setActiveTab] = useState<TabId>("orders")

  const content: Record<TabId, React.ReactNode> = {
    orders: ordersContent,
    menus: menusContent,
    dishes: dishesContent,
    admin: adminContent,
  }

  return (
    <>
      <nav className={styles.tabs} aria-label="Sections du tableau de bord">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>
      <section className={styles.section}>{content[activeTab]}</section>
    </>
  )
}
