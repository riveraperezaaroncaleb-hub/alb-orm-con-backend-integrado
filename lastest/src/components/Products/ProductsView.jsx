import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import { useToast } from '../../hooks/useToast'
import {
  formatCurrency,
  formatNumber,
  formatUnit,
  getStockState,
} from '../../utils/format'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import ProductForm from './ProductForm'
import ui from '../../styles/ui.module.css'
import styles from './ProductsView.module.css'

const STOCK_TONE = {
  success: ui.badgeSuccess,
  warn: ui.badgeWarn,
  danger: ui.badgeDanger,
  muted: ui.badgeMuted,
}

export default function ProductsView({
  products,
  categories,
  providers,
  isLoading,
  onRefresh,
}) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const debouncedSearch = useDebounce(search.trim(), 250)

  const filtered = useMemo(() => {
    const term = debouncedSearch.toLowerCase()

    return products.filter((product) => {
      const stock = Number(product.stock || 0)
      const minimum = Number(product.stockMinimo || 0)

      const matchesSearch =
        !term ||
        product.nombre.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
      const matchesCategory =
        !categoryFilter || String(product.categoriaId) === categoryFilter
      const matchesProvider =
        !providerFilter || String(product.proveedorId) === providerFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? product.activo : !product.activo)
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && stock > 0 && stock <= minimum) ||
        (stockFilter === 'out' && stock <= 0) ||
        (stockFilter === 'ok' && stock > minimum)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesProvider &&
        matchesStatus &&
        matchesStock
      )
    })
  }, [
    products,
    debouncedSearch,
    categoryFilter,
    providerFilter,
    statusFilter,
    stockFilter,
  ])

  const hasFilters =
    search.trim() !== '' ||
    categoryFilter !== '' ||
    providerFilter !== '' ||
    statusFilter !== 'all' ||
    stockFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setProviderFilter('')
    setStatusFilter('all')
    setStockFilter('all')
  }

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('productos', payload)
      notify('Producto creado correctamente.')
    } else {
      await api.update('productos', editing.id, payload)
      notify('Producto actualizado correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('productos', deleting.id)
      notify('Producto eliminado correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const categoryName = (product) =>
    product.categoria?.nombre ??
    categories.find((category) => category.id === product.categoriaId)?.nombre ??
    '—'

  const providerName = (product) =>
    product.proveedor?.nombre ??
    providers.find((provider) => provider.id === product.proveedorId)?.nombre ??
    '—'

  if (isLoading) {
    return <Loader label="Cargando productos…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Productos</h2>
          <p className={ui.pageSubtitle}>
            Catálogo completo con precios, existencias y estado de reposición.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nuevo producto
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
              placeholder="Buscar por nombre o SKU…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar productos"
            />
          </div>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={providerFilter}
            onChange={(event) => setProviderFilter(event.target.value)}
            aria-label="Filtrar por proveedor"
          >
            <option value="">Todos los proveedores</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.nombre}
              </option>
            ))}
          </select>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>

          <select
            className={`${ui.select} ${ui.selectCompact}`}
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            aria-label="Filtrar por stock"
          >
            <option value="all">Todo el stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
            <option value="ok">Disponible</option>
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
          Mostrando <strong>{formatNumber(filtered.length)}</strong> de{' '}
          {formatNumber(products.length)} productos
        </span>
        <span className={ui.chip}>
          <Icon name="filter" size={13} />
          {hasFilters ? 'Filtros aplicados' : 'Sin filtros'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="box"
          title={products.length === 0 ? 'El inventario está vacío' : 'Sin resultados'}
          message={
            products.length === 0
              ? 'Crea tu primer producto para comenzar a controlar el stock.'
              : 'No encontramos productos con los filtros seleccionados. Prueba con otros criterios.'
          }
          actionLabel={products.length === 0 ? 'Crear producto' : 'Limpiar filtros'}
          onAction={products.length === 0 ? () => setEditing('new') : resetFilters}
        />
      ) : (
        <div className={ui.tableWrap}>
          <table className={`${ui.table} ${styles.wide}`}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Stock</th>
                <th>Estado</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const stockState = getStockState(product.stock, product.stockMinimo)

                return (
                  <tr key={product.id}>
                    <td data-label="Producto" data-primary="true">
                      <div className={ui.cellPrimary}>
                        <span className={ui.cellIcon}>
                          <Icon name="box" size={17} />
                        </span>
                        <span>
                          <span className={ui.cellName}>{product.nombre}</span>
                          <span className={ui.cellSub}>{product.sku}</span>
                        </span>
                      </div>
                    </td>
                    <td data-label="Categoría">{categoryName(product)}</td>
                    <td data-label="Proveedor">{providerName(product)}</td>
                    <td data-label="Precio" className={styles.money}>
                      {formatCurrency(product.precio)}
                    </td>
                    <td data-label="Costo" className={ui.muted}>
                      {formatCurrency(product.costo)}
                    </td>
                    <td data-label="Stock">
                      <div className={styles.stockCell}>
                        <span className={styles.stockValue}>
                          {formatNumber(product.stock)}
                          <span className={styles.stockUnit}>
                            {formatUnit(product.unidadMedida)}
                          </span>
                        </span>
                        <span
                          className={`${ui.badge} ${STOCK_TONE[stockState.tone] ?? ui.badgeMuted}`}
                        >
                          <span className={ui.badgeDot} />
                          {stockState.label}
                        </span>
                      </div>
                    </td>
                    <td data-label="Estado">
                      <span
                        className={`${ui.badge} ${
                          product.activo ? ui.badgeSuccess : ui.badgeMuted
                        }`}
                      >
                        <span className={ui.badgeDot} />
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td data-label="Acciones" data-actions="true">
                      <div className={ui.actions}>
                        <button
                          type="button"
                          className={ui.iconBtn}
                          onClick={() => setEditing(product)}
                          aria-label={`Editar ${product.nombre}`}
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          type="button"
                          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                          onClick={() => setDeleting(product)}
                          aria-label={`Eliminar ${product.nombre}`}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <ProductForm
          product={editing === 'new' ? null : editing}
          categories={categories}
          providers={providers}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar producto"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
