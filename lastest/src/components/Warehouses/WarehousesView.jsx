import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatNumber } from '../../utils/format'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import WarehouseForm from './WarehouseForm'
import ui from '../../styles/ui.module.css'
import styles from './WarehousesView.module.css'

export default function WarehousesView({
  warehouses,
  branches,
  products,
  isLoading,
  onRefresh,
}) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return warehouses.filter((warehouse) => {
      const matchesSearch =
        !term ||
        [warehouse.nombre, warehouse.codigo, warehouse.descripcion, warehouse.direccion]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      const matchesBranch =
        !branchFilter || String(warehouse.sucursalId) === branchFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? warehouse.activo : !warehouse.activo)

      return matchesSearch && matchesBranch && matchesStatus
    })
  }, [warehouses, search, branchFilter, statusFilter])

  const hasFilters = search.trim() !== '' || branchFilter !== '' || statusFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setBranchFilter('')
    setStatusFilter('all')
  }

  const branchName = (warehouse) =>
    warehouse.sucursal?.nombre ??
    branches.find((branch) => branch.id === warehouse.sucursalId)?.nombre ??
    'Sin sucursal'

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('almacenes', payload)
      notify('Almacén creado correctamente.')
    } else {
      await api.update('almacenes', editing.id, payload)
      notify('Almacén actualizado correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('almacenes', deleting.id)
      notify('Almacén eliminado correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return <Loader label="Cargando almacenes…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Almacenes</h2>
          <p className={ui.pageSubtitle}>
            Depósitos específicos dentro de cada sucursal donde se resguarda el inventario.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nuevo almacén
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
              placeholder="Buscar por nombre, código o dirección…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar almacenes"
            />
          </div>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            aria-label="Filtrar almacenes por sucursal"
          >
            <option value="">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre}
              </option>
            ))}
          </select>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar almacenes por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>

          {hasFilters ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={resetFilters}
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
          {formatNumber(warehouses.length)} almacenes
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="warehouse"
          title={warehouses.length === 0 ? 'Sin almacenes' : 'Sin resultados'}
          message={
            warehouses.length === 0
              ? 'Registra el primer depósito dentro de una sucursal para organizar el inventario.'
              : 'No hay almacenes que coincidan con la búsqueda.'
          }
          actionLabel={warehouses.length === 0 ? 'Crear almacén' : 'Limpiar filtros'}
          onAction={warehouses.length === 0 ? () => setEditing('new') : resetFilters}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((warehouse) => {
            const warehouseProducts = products.filter(
              (product) => product.almacenId === warehouse.id,
            )
            const units = warehouseProducts.reduce(
              (total, product) => total + Number(product.stock || 0),
              0,
            )
            const location = [warehouse.direccion, branchName(warehouse)]
              .filter(Boolean)
              .join(', ')

            return (
              <article key={warehouse.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>
                    <Icon name="warehouse" size={21} />
                  </span>
                  <div className={styles.headInfo}>
                    <span className={styles.code}>{warehouse.codigo}</span>
                    <h3 className={styles.name}>{warehouse.nombre}</h3>
                  </div>
                  <span
                    className={`${ui.badge} ${
                      warehouse.activo ? ui.badgeSuccess : ui.badgeMuted
                    }`}
                  >
                    <span className={ui.badgeDot} />
                    {warehouse.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <ul className={styles.metaList}>
                  <li className={styles.metaRow}>
                    <Icon name="store" size={15} />
                    <span>{branchName(warehouse)}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <Icon name="pin" size={15} />
                    <span>{location || 'Sin ubicación registrada'}</span>
                  </li>
                  <li className={styles.metaRow}>
                    <Icon name="layers" size={15} />
                    <span>
                      {warehouse.descripcion || 'Sin descripción registrada'}
                    </span>
                  </li>
                </ul>

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {formatNumber(warehouseProducts.length)}
                    </span>
                    <span className={styles.statLabel}>Productos</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{formatNumber(units)}</span>
                    <span className={styles.statLabel}>Unidades</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {warehouse.capacidad != null
                        ? formatNumber(warehouse.capacidad)
                        : '—'}
                    </span>
                    <span className={styles.statLabel}>Capacidad</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
                    onClick={() => setEditing(warehouse)}
                  >
                    <Icon name="edit" size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnDanger} ${ui.btnSm}`}
                    onClick={() => setDeleting(warehouse)}
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
        <WarehouseForm
          warehouse={editing === 'new' ? null : editing}
          branches={branches}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar almacén"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre ?? ''}"? Si tiene productos asociados, la operación será rechazada.`}
        confirmLabel="Eliminar almacén"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
