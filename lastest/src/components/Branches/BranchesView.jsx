import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatNumber } from '../../utils/format'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import BranchForm from './BranchForm'
import ui from '../../styles/ui.module.css'
import styles from './BranchesView.module.css'

export default function BranchesView({
  branches,
  products,
  categories,
  providers,
  users,
  isLoading,
  onRefresh,
}) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return branches.filter((branch) => {
      const matchesSearch =
        !term ||
        [branch.nombre, branch.codigo, branch.ciudad, branch.direccion, branch.gerente]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? branch.activo : !branch.activo)

      return matchesSearch && matchesStatus
    })
  }, [branches, search, statusFilter])

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('sucursales', payload)
      notify('Sucursal creada correctamente.')
    } else {
      await api.update('sucursales', editing.id, payload)
      notify('Sucursal actualizada correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('sucursales', deleting.id)
      notify('Sucursal eliminada correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return <Loader label="Cargando sucursales…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Sucursales</h2>
          <p className={ui.pageSubtitle}>
            Tiendas y sedes físicas de la empresa con su inventario y equipo asignado.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nueva sucursal
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
              placeholder="Buscar por nombre, código, ciudad o responsable…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar sucursales"
            />
          </div>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar sucursales por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo activas</option>
            <option value="inactive">Solo inactivas</option>
          </select>

          {search || statusFilter !== 'all' ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
            >
              <Icon name="close" size={14} />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className={ui.pageMeta}>
        <span>
          <strong>{formatNumber(filtered.length)}</strong> de{' '}
          {formatNumber(branches.length)} sucursales
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="store"
          title={branches.length === 0 ? 'Sin sucursales' : 'Sin resultados'}
          message={
            branches.length === 0
              ? 'Registra la primera tienda o sede para organizar el inventario y el equipo.'
              : 'No hay sucursales que coincidan con la búsqueda.'
          }
          actionLabel={branches.length === 0 ? 'Crear sucursal' : 'Limpiar búsqueda'}
          onAction={
            branches.length === 0
              ? () => setEditing('new')
              : () => {
                  setSearch('')
                  setStatusFilter('all')
                }
          }
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((branch) => {
            const branchProducts = products.filter(
              (product) => product.sucursalId === branch.id,
            ).length
            const branchCategories = categories.filter(
              (category) => category.sucursalId === branch.id,
            ).length
            const branchProviders = providers.filter(
              (provider) => provider.sucursalId === branch.id,
            ).length
            const branchUsers = users.filter((user) => user.sucursalId === branch.id).length
            const location = [branch.direccion, branch.ciudad].filter(Boolean).join(', ')

            return (
              <article key={branch.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>
                    <Icon name="store" size={21} />
                  </span>
                  <div className={styles.headInfo}>
                    <span className={styles.code}>{branch.codigo}</span>
                    <h3 className={styles.name}>{branch.nombre}</h3>
                  </div>
                  <span
                    className={`${ui.badge} ${
                      branch.activo ? ui.badgeSuccess : ui.badgeMuted
                    }`}
                  >
                    <span className={ui.badgeDot} />
                    {branch.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <ul className={styles.metaList}>
                  <li className={styles.metaRow}>
                    <Icon name="pin" size={15} />
                    <span>{location || 'Sin ubicación registrada'}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <Icon name="phone" size={15} />
                    <span>{branch.telefono || 'Sin teléfono'}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <Icon name="mail" size={15} />
                    <span>{branch.email || 'Sin email'}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <Icon name="user" size={15} />
                    <span>{branch.gerente || 'Sin responsable asignado'}</span>
                  </li>
                </ul>

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {formatNumber(branchProducts)}
                    </span>
                    <span className={styles.statLabel}>Productos</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {formatNumber(branchCategories)}
                    </span>
                    <span className={styles.statLabel}>Categorías</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {formatNumber(branchProviders)}
                    </span>
                    <span className={styles.statLabel}>Proveedores</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{formatNumber(branchUsers)}</span>
                    <span className={styles.statLabel}>Usuarios</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
                    onClick={() => setEditing(branch)}
                  >
                    <Icon name="edit" size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnDanger} ${ui.btnSm}`}
                    onClick={() => setDeleting(branch)}
                  >
                    <Icon name="trash" size={14} />
                    Eliminar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {editing ? (
        <BranchForm
          branch={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar sucursal"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre ?? ''}"? Si tiene productos, categorías, proveedores o usuarios asociados, la operación será rechazada.`}
        confirmLabel="Eliminar sucursal"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
