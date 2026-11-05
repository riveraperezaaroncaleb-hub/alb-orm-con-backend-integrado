import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatDate, formatNumber, getInitials } from '../../utils/format'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import UserForm from './UserForm'
import ui from '../../styles/ui.module.css'
import styles from './UsersView.module.css'

export default function UsersView({ users, isLoading, onRefresh }) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter(
      (user) => !term || user.nombre.toLowerCase().includes(term),
    )
  }, [users, search])

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('usuarios', payload)
      notify('Usuario creado correctamente.')
    } else {
      await api.update('usuarios', editing.id, payload)
      notify('Usuario actualizado correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('usuarios', deleting.id)
      notify('Usuario eliminado correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return <Loader label="Cargando usuarios…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Usuarios</h2>
          <p className={ui.pageSubtitle}>
            Personas registradas en el sistema y datos básicos de contacto.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nuevo usuario
          </button>
        </div>
      </div>

      <div className={ui.toolbar}>
        <div className={ui.filters}>
          <div className={ui.searchField}>
            <Icon name="search" size={17} className={ui.searchIcon} />
            <input
              type="search"
              className={`${ui.input} ${ui.searchInput}`}
              placeholder="Buscar usuario por nombre…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar usuarios"
            />
          </div>
          {search ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={() => setSearch('')}
            >
              <Icon name="close" size={14} />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className={ui.pageMeta}>
        <span>
          <strong>{formatNumber(filtered.length)}</strong> de {formatNumber(users.length)}{' '}
          usuarios
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="users"
          title={users.length === 0 ? 'Sin usuarios' : 'Sin resultados'}
          message={
            users.length === 0
              ? 'Registra el primer usuario del sistema.'
              : 'No hay usuarios que coincidan con la búsqueda.'
          }
          actionLabel={users.length === 0 ? 'Crear usuario' : 'Limpiar búsqueda'}
          onAction={users.length === 0 ? () => setEditing('new') : () => setSearch('')}
        />
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Edad</th>
                <th>Alta</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td data-label="Usuario" data-primary="true">
                    <div className={styles.userCell}>
                      <span className={styles.avatar}>{getInitials(user.nombre)}</span>
                      <div>
                        <span className={ui.cellName}>{user.nombre}</span>
                        <span className={ui.cellSub}>ID #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Edad">
                    {user.edad !== null && user.edad !== undefined
                      ? `${formatNumber(user.edad)} años`
                      : '—'}
                  </td>
                  <td data-label="Alta">{formatDate(user.createdAt)}</td>
                  <td data-label="Acciones" data-actions="true">
                    <div className={ui.actions}>
                      <button
                        type="button"
                        className={ui.iconBtn}
                        onClick={() => setEditing(user)}
                        aria-label={`Editar ${user.nombre}`}
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                        onClick={() => setDeleting(user)}
                        aria-label={`Eliminar ${user.nombre}`}
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <UserForm
          user={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar usuario"
        message={`¿Seguro que deseas eliminar a "${deleting?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar usuario"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
