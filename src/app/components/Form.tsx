"use client"
import styles from "./styles/form.module.css"

export default function Form({
  children,
  onSubmit,
  formAction,
  className,
  submitText,
}: {
  children: React.ReactNode
  className?: string
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  formAction?: (formData: FormData) => void
  submitText: string
}) {
  return (
    <form
      className={styles.form + " " + (className ?? "")}
      onSubmit={onSubmit}
      action={formAction}>
      {children}
      <button type="submit">{submitText}</button>
    </form>
  )
}
