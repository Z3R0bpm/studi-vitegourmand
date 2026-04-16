"use client"
import { useState } from "react"
import styles from "./styles/footer.module.css"

export function OpeningHours() {
  const [openingHours, setOpeningHours] = useState([
    { dayOfTheWeek: "Lundi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Mardi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Mercredi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Jeudi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Vendredi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Samedi", hours: ["11:30", "14:00", "17:00", "21:00"] },
    { dayOfTheWeek: "Dimanche", hours: ["11:30", "14:00", "17:00", "21:00"] },
  ])

  return (
    <ul className={styles.openingDays}>
      {openingHours.map((day) => (
        <li key={day.dayOfTheWeek} className={styles.openingHours}>
          <p>{day.dayOfTheWeek}</p>
          <div>
            <p>{day.hours[0] + "-" + day.hours[1]}</p>
            <p>{day.hours[2] + "-" + day.hours[3]}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
