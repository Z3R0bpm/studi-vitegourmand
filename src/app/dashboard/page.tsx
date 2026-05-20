import { redirect } from "next/navigation"
import { getUserData } from "../actions"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { EmployeeDashboard } from "./EmployeeDashboard"
import { UserDashboard } from "./UserDashboard"

export default async function DashboardPage() {
  const user = await getUserData()
  if (!user) redirect("/login")

  const isEmployee = user.role_id >= 1

  return (
    <div className="page">
      <Header />
      {isEmployee ? <EmployeeDashboard /> : <UserDashboard />}
      <Footer />
    </div>
  )
}
