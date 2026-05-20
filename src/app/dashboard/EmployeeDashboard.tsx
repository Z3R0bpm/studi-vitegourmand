import { getEmployeeDashboardData } from "../actions"
import { AdminUsersSection } from "./AdminUsersSection"
import styles from "./dashboard.module.css"
import { DishesConfigSection } from "./DishesConfigSection"
import { DishType } from "./dishTypes"
import { EmployeeOrdersSection } from "./EmployeeOrdersSection"
import { EmployeeTabs } from "./EmployeeTabs"
import { MenusConfigSection } from "./MenusConfigSection"

export async function EmployeeDashboard() {
  const { orders, menus, dishes, formOptions, isAdmin, roles, currentUserId } =
    await getEmployeeDashboardData()

  const dishesTyped = dishes.map((dish) => ({
    id: dish.id,
    title: dish.title,
    dishType: dish.dishType as DishType,
    hasPicture: dish.hasPicture,
    allergens: dish.allergens,
    allergenIds: dish.allergenIds,
  }))

  const formOptionsTyped = {
    themes: formOptions.themes,
    diets: formOptions.diets,
    dishes: formOptions.dishes.map((dish) => ({
      id: dish.id,
      label: dish.label,
      dishType: dish.dishType as DishType,
    })),
  }

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
          <MenusConfigSection menus={menus} formOptions={formOptionsTyped} />
        }
        dishesContent={
          <DishesConfigSection
            dishes={dishesTyped}
            formOptions={{ allergens: formOptions.allergens }}
          />
        }
      />
    </main>
  )
}
