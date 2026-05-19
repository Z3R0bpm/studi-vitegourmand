//database actions
import "server-only"
import { prisma } from "./prisma"

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

async function getUserOrders(userId: number) {
  const orders = await prisma.orders.findMany({
    where: { user_id: userId },
    include: {
      orders_menus: {
        include: { menus: true },
      },
    },
    orderBy: { order_date: "desc" },
  })

  return orders.map((order) => ({
    id: order.id,
    orderDate: formatDate(order.order_date),
    deliveryDate: formatDate(order.delivery_date),
    deliveryTime: order.delivery_time,
    orderPrice: order.order_price,
    groupSize: order.group_size,
    deliveryPrice: order.delivery_price,
    status: order.status,
    equipmentLending: order.equipment_lending,
    equipmentReturn: order.equipment_return,
    menus: order.orders_menus.map((om) => om.menus.title),
  }))
}

async function getAllOrders() {
  const orders = await prisma.orders.findMany({
    include: {
      users: {
        select: { firstname: true, lastname: true, email: true },
      },
      orders_menus: {
        include: { menus: true },
      },
    },
    orderBy: { order_date: "desc" },
  })

  return orders.map((order) => ({
    id: order.id,
    orderDate: formatDate(order.order_date),
    deliveryDate: formatDate(order.delivery_date),
    deliveryTime: order.delivery_time,
    orderPrice: order.order_price,
    groupSize: order.group_size,
    deliveryPrice: order.delivery_price,
    status: order.status,
    equipmentLending: order.equipment_lending,
    equipmentReturn: order.equipment_return,
    menus: order.orders_menus.map((om) => om.menus.title),
    userName: `${order.users.firstname} ${order.users.lastname}`,
    userEmail: order.users.email,
  }))
}

async function getMenusConfig() {
  const menus = await prisma.menus.findMany({
    include: {
      diets: true,
      themes: true,
      menus_dishes: {
        include: { dishes: true },
      },
    },
    orderBy: { title: "asc" },
  })

  return menus.map((menu) => ({
    id: menu.id,
    title: menu.title,
    description: menu.description ?? "",
    minGroupSize: menu.min_group_size,
    pricePerPerson: menu.price_per_person,
    available: menu.available,
    theme: menu.themes.label,
    diet: menu.diets.label,
    themeId: menu.theme_id,
    dietId: menu.diet_id,
    dishes: {
      starters: menu.menus_dishes
        .filter((md) => md.dishes.dish_type === "starter")
        .map((md) => md.dishes.title),
      mains: menu.menus_dishes
        .filter((md) => md.dishes.dish_type === "main")
        .map((md) => md.dishes.title),
      desserts: menu.menus_dishes
        .filter((md) => md.dishes.dish_type === "dessert")
        .map((md) => md.dishes.title),
    },
    dishIds: menu.menus_dishes.map((md) => md.dish_id),
    dishSlides: buildDishSlides(menu.menus_dishes),
  }))
}

async function getDishesConfig() {
  const dishes = await prisma.dishes.findMany({
    include: {
      dishes_allergens: {
        include: { allergens: true },
      },
    },
    orderBy: { title: "asc" },
  })

  return dishes.map((dish) => ({
    id: dish.id,
    title: dish.title,
    dishType: dish.dish_type,
    hasPicture: dish.picture !== null && dish.picture.length > 0,
    allergens: dish.dishes_allergens.map((da) => da.allergens.label),
    allergenIds: dish.dishes_allergens.map((da) => da.allergen_id),
  }))
}

async function getMenuFormOptions() {
  const [themes, diets, dishes, allergens] = await Promise.all([
    prisma.themes.findMany({ orderBy: { label: "asc" } }),
    prisma.diets.findMany({ orderBy: { label: "asc" } }),
    prisma.dishes.findMany({ orderBy: { title: "asc" } }),
    prisma.allergens.findMany({ orderBy: { label: "asc" } }),
  ])

  return {
    themes: themes.map((t) => ({ id: t.id, label: t.label })),
    diets: diets.map((d) => ({ id: d.id, label: d.label })),
    dishes: dishes.map((d) => ({
      id: d.id,
      label: d.title,
      dishType: d.dish_type,
    })),
    allergens: allergens.map((a) => ({ id: a.id, label: a.label })),
  }
}

async function searchUsers(query: string) {
  const q = query.trim()
  if (q.length < 2) return []

  const users = await prisma.users.findMany({
    where: {
      OR: [
        { email: { contains: q } },
        { firstname: { contains: q } },
        { lastname: { contains: q } },
      ],
    },
    include: { roles: true },
    take: 20,
    orderBy: [{ lastname: "asc" }, { firstname: "asc" }],
  })

  return users.map((user) => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    roleId: user.role_id,
    roleLabel: user.roles.label,
  }))
}

async function getRoles() {
  const roles = await prisma.roles.findMany({ orderBy: { id: "asc" } })
  return roles.map((role) => ({ id: role.id, label: role.label }))
}

const DISH_TYPE_SORT = ["starter", "main", "dessert"] as const

function sortDishesForCarousel<T extends { dishType: string }>(dishes: T[]) {
  return [...dishes].sort(
    (a, b) =>
      DISH_TYPE_SORT.indexOf(a.dishType as (typeof DISH_TYPE_SORT)[number]) -
      DISH_TYPE_SORT.indexOf(b.dishType as (typeof DISH_TYPE_SORT)[number]),
  )
}

function buildDishSlides(
  menusDishes: {
    dishes: {
      id: number
      title: string
      dish_type: string
      picture: Uint8Array | Buffer | null
    }
  }[],
) {
  return sortDishesForCarousel(
    menusDishes
      .map((md) => md.dishes)
      .filter((dish) => dish.picture !== null && dish.picture.length > 0)
      .map((dish) => ({
        id: dish.id,
        title: dish.title,
        dishType: dish.dish_type,
      })),
  )
}

async function getPublicMenus() {
  const menus = await prisma.menus.findMany({
    where: {
      OR: [{ available: null }, { available: { not: 0 } }],
    },
    include: {
      diets: true,
      themes: true,
      menus_dishes: {
        include: {
          dishes: {
            select: {
              id: true,
              title: true,
              dish_type: true,
              picture: true,
            },
          },
        },
      },
    },
    orderBy: { title: "asc" },
  })

  return menus.map((menu) => {
    const dishSlides = buildDishSlides(menu.menus_dishes)

    const byType = (type: string) =>
      menu.menus_dishes
        .filter((md) => md.dishes.dish_type === type)
        .map((md) => md.dishes.title)

    return {
      id: menu.id,
      title: menu.title,
      description: menu.description ?? "",
      minGroupSize: menu.min_group_size,
      pricePerPerson: menu.price_per_person,
      theme: menu.themes.label,
      diet: menu.diets.label,
      dishes: {
        starters: byType("starter"),
        mains: byType("main"),
        desserts: byType("dessert"),
      },
      dishSlides,
    }
  })
}

export {
  getAllOrders,
  getDishesConfig,
  getMenuFormOptions,
  getMenusConfig,
  getPublicMenus,
  getRoles,
  getUserOrders,
  searchUsers,
}
