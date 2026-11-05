import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatNumber, getInitials } from '../../utils/format'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import ProviderForm from './ProviderForm'
import ui from '../../styles/ui.module.css'
import styles from './ProvidersView.module.css'

export default function ProvidersView({
  providers,
  products,
  branches,
  isLoading,
  onRefresh,
}) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return providers.filter((provider) => {
      const matchesSearch =
        !term ||
        [provider.nombre, provider.contacto, provider.email, provider.ciudad, provider.pais]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      const matchesBranch =
        !branchFilter || String(provider.sucursalId) === branchFilter

      return matchesSearch && matchesBranch
    })
  }, [providers, search, branchFilter])

  const branchName = (provider) =>
    provider.sucursal?.nombre ??
    branches.find((branch) => branch.id === provider.sucursalId)?.nombre ??
    'Sin sucursal'

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('proveedores', payload)
      notify('Proveedor creado correctamente.')
    } else {
      await api.update('proveedores', editing.id, payload)
      notify('Proveedor actualizado correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('proveedores', deleting.id)
      notify('Proveedor eliminado correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return <Loader label="Cargando proveedores…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Proveedores</h2>
          <p className={ui.pageSubtitle}>
            Directorio de contactos y empresas que abastecen el inventario.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nuevo proveedor
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
              placeholder="Buscar por nombre, contacto o ciudad…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar proveedores"
            />
          </div>
          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            aria-label="Filtrar proveedores por sucursal"
          >
            <option value="">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre}
              </option>
            ))}
          </select>

          {search || branchFilter ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={() => {
                setSearch('')
                setBranchFilter('')
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
          {formatNumber(providers.length)} proveedores
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="truck"
          title={providers.length === 0 ? 'Sin proveedores' : 'Sin resultados'}
          message={
            providers.length === 0
              ? 'Registra tu primer proveedor para asociarlo a los productos.'
              : 'No hay proveedores que coincidan con la búsqueda.'
          }
          actionLabel={providers.length === 0 ? 'Crear proveedor' : 'Limpiar búsqueda'}
          onAction={
            providers.length === 0
              ? () => setEditing('new')
              : () => {
                  setSearch('')
                  setBranchFilter('')
                }
          }
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((provider) => {
            const supplied = products.filter(
              (product) => product.proveedorId === provider.id,
            ).length
            const location = [provider.ciudad, provider.pais].filter(Boolean).join(', ')

            return (
              <article key={provider.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.avatar}>{getInitials(provider.nombre)}</span>
                  <div className={styles.headInfo}>
                    <h3 className={styles.name}>{provider.nombre}</h3>
                    <span
                      className={`${ui.badge} ${
                        provider.activo ? ui.badgeSuccess : ui.badgeMuted
                      }`}
                    >
                      <span className={ui.badgeDot} />
                      {provider.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <ul className={styles.contactList}>
                  <li className={styles.contactRow}>
                    <Icon name="user" size={15} />
                    <span>{provider.contacto || 'Sin contacto asignado'}</span>
                  </li>
                  <li className={styles.contactRow}>
                    <Icon name="mail" size={15} />
                    <span>{provider.email || 'Sin email'}</span>
                  </li>
                  <li className={styles.contactRow}>
                    <Icon name="phone" size={15} />
                    <span>{provider.telefono || 'Sin teléfono'}</span>
                  </li>
                  <li className={styles.contactRow}>
                    <Icon name="pin" size={15} />
                    <span>{location || 'Sin ubicación'}</span>
                  </li>
                  <li className={styles.contactRow}>
                    <Icon name="store" size={15} />
                    <span>{branchName(provider)}</span>
                  </li>
                </ul>

                <div className={styles.footer}>
                  <span className={styles.supplied}>
                    <Icon name="box" size={14} />
                    {formatNumber(supplied)} productos
                  </span>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={ui.iconBtn}
                      onClick={() => setEditing(provider)}
                      aria-label={`Editar ${provider.nombre}`}
                    >
                      <Icon name="edit" size={15} />
                    </button>
                    <button
                      type="button"
                      className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                      onClick={() => setDeleting(provider)}
                      aria-label={`Eliminar ${provider.nombre}`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {editing ? (
        <ProviderForm
          provider={editing === 'new' ? null : editing}
          branches={branches}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar proveedor"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre ?? ''}"? Si tiene productos asociados, la operación será rechazada.`}
        confirmLabel="Eliminar proveedor"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
