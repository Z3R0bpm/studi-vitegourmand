"use client"

import { useActionState, useCallback, useEffect, useMemo, useState } from "react"
import { searchUsersAction, updateUserRole } from "../actions"
import debounce from "../utils/debounce"
import styles from "./dashboard.module.css"

type Role = { id: number; label: string }

type UserResult = {
  id: number
  firstname: string
  lastname: string
  email: string
  roleId: number
  roleLabel: string
}

const ROLE_LABELS: Record<string, string> = {
  user: "Client",
  employee: "Employé",
  admin: "Administrateur",
}

function roleDisplayLabel(label: string) {
  return ROLE_LABELS[label.toLowerCase()] ?? label
}

function UserRoleForm({
  user,
  roles,
  currentUserId,
  onUpdated,
}: {
  user: UserResult
  roles: Role[]
  currentUserId: number
  onUpdated: (userId: number, roleId: number, roleLabel: string) => void
}) {
  const [state, formAction, pending] = useActionState(updateUserRole, undefined)
  const [selectedRoleId, setSelectedRoleId] = useState(user.roleId)

  useEffect(() => {
    setSelectedRoleId(user.roleId)
  }, [user.roleId])

  useEffect(() => {
    if (state?.success) {
      const role = roles.find((r) => r.id === selectedRoleId)
      onUpdated(user.id, selectedRoleId, role?.label ?? user.roleLabel)
    }
  }, [
    state?.success,
    user.id,
    user.roleLabel,
    selectedRoleId,
    roles,
    onUpdated,
  ])

  return (
    <form action={formAction} className={styles.userRoleForm}>
      <input type="hidden" name="userId" value={user.id} />
      <select
        name="roleId"
        value={selectedRoleId}
        onChange={(e) => setSelectedRoleId(Number(e.target.value))}
        disabled={pending}
        aria-label={`Rôle de ${user.firstname} ${user.lastname}`}>
        {roles.map((role) => (
          <option
            key={role.id}
            value={role.id}
            disabled={user.id === currentUserId && role.id < 2}>
            {roleDisplayLabel(role.label)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className={styles.btnSecondary}
        disabled={pending}>
        {pending ? "…" : "Appliquer"}
      </button>
      {state?.error && <span className={styles.error}>{state.error}</span>}
      {state?.success && (
        <span className={styles.success}>Rôle mis à jour</span>
      )}
      {user.id === currentUserId && (
        <span className={styles.dishImageHint}>
          (votre compte — le rôle admin ne peut pas être retiré)
        </span>
      )}
    </form>
  )
}

export function AdminUsersSection({
  roles,
  currentUserId,
}: {
  roles: Role[]
  currentUserId: number
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.trim().length < 2) {
          setResults([])
          setSearched(false)
          setLoading(false)
          return
        }
        setLoading(true)
        try {
          const users = await searchUsersAction(value)
          setResults(users)
          setSearched(true)
        } finally {
          setLoading(false)
        }
      }, 350),
    [],
  )

  useEffect(() => {
    runSearch(query)
  }, [query, runSearch])

  const handleRoleUpdated = useCallback(
    (userId: number, roleId: number, roleLabel: string) => {
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, roleId, roleLabel } : u,
        ),
      )
    },
    [],
  )

  return (
    <div className={styles.configPanel}>
      <p className={styles.dishImageHint}>
        Recherchez un utilisateur par nom ou adresse email (minimum 2
        caractères).
      </p>

      <div className={styles.formField}>
        <label htmlFor="user-search">Rechercher</label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, prénom ou email…"
          autoComplete="off"
        />
      </div>

      {loading && <p className={styles.dishImageHint}>Recherche en cours…</p>}

      {!loading && searched && results.length === 0 && (
        <p className={styles.empty}>Aucun utilisateur trouvé.</p>
      )}

      {results.map((user) => (
        <article key={user.id} className={styles.configCard}>
          <h3>
            {user.firstname} {user.lastname}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {user.email}
          </p>
          <div className={styles.configMeta}>
            <span className={styles.tag}>
              Rôle actuel : {roleDisplayLabel(user.roleLabel)}
            </span>
          </div>
          <UserRoleForm
            user={user}
            roles={roles}
            currentUserId={currentUserId}
            onUpdated={handleRoleUpdated}
          />
        </article>
      ))}
    </div>
  )
}
