"use client"
import styles from "./styles/form.module.css"

export default function Form({
  children,
  onSubmit,
  className,
  submitText,
}: {
  children: React.ReactNode
  className?: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
  submitText: string
}) {
  return (
    <form className={styles.form + " " + (className ?? "")} onSubmit={onSubmit}>
      {children}
      <button type="submit">{submitText}</button>
    </form>
  )
}
