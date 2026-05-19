import { getEmployeeDashboardData } from "../actions"
import { AdminUsersSection } from "./AdminUsersSection"
import styles from "./dashboard.module.css"
import { DishesConfigSection } from "./DishesConfigSection"
import { EmployeeOrdersSection } from "./EmployeeOrdersSection"
import { EmployeeTabs } from "./EmployeeTabs"
import { MenusConfigSection } from "./MenusConfigSection"

export async function EmployeeDashboard() {
  const { orders, menus, dishes, formOptions, isAdmin, roles, currentUserId } =
    await getEmployeeDashboardData()

  return (
    <main className={`main ${styles.dashboard}`}>
      <h1 className={styles.sectionTitle}>
        Tableau de bord {isAdmin ? "administrateur" : "employé"}
      </h1>
      <EmployeeTabs
        showAdminTab={isAdmin}
        adminContent={
          isAdmin ? (
            <AdminUsersSection roles={roles} currentUserId={currentUserId} />
          ) : null
        }
        ordersContent={<EmployeeOrdersSection orders={orders} />}
        menusContent={
          <MenusConfigSection menus={menus} formOptions={formOptions} />
        }
        dishesContent={
          <DishesConfigSection
            dishes={dishes}
            formOptions={{ allergens: formOptions.allergens }}
          />
        }
      />
    </main>
  )
}
