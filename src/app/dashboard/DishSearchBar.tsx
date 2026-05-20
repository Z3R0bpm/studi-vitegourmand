import styles from "./dashboard.module.css"

export function DishSearchBar({
  id,
  value,
  onChange,
  placeholder = "Rechercher un plat…",
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className={styles.searchBar}>
      <label htmlFor={id} className={styles.srOnly}>
        {placeholder}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  )
}
