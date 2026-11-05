import { useMemo, useState } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatNumber } from '../../utils/format'
import CategoryForm from './CategoryForm'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import ui from '../../styles/ui.module.css'
import styles from './CategoriesView.module.css'

export default function CategoriesView({ categories, products, isLoading, onRefresh }) {
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return categories.filter(
      (category) =>
        !term ||
        category.nombre.toLowerCase().includes(term) ||
        (category.descripcion ?? '').toLowerCase().includes(term),
    )
  }, [categories, search])

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create('categorias', payload)
      notify('Categoría creada correctamente.')
    } else {
      await api.update('categorias', editing.id, payload)
      notify('Categoría actualizada correctamente.')
    }

    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)

    try {
      await api.remove('categorias', deleting.id)
      notify('Categoría eliminada correctamente.')
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return <Loader label="Cargando categorías…" />
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>Categorías</h2>
          <p className={ui.pageSubtitle}>
            Organiza el catálogo y consulta cuántos productos agrupa cada categoría.
          </p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nueva categoría
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
              placeholder="Buscar categoría…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar categorías"
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
          <strong>{formatNumber(filtered.length)}</strong> de{' '}
          {formatNumber(categories.length)} categorías
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="tag"
          title={categories.length === 0 ? 'Sin categorías' : 'Sin resultados'}
          message={
            categories.length === 0
              ? 'Crea una categoría para agrupar los productos del inventario.'
              : 'No hay categorías que coincidan con la búsqueda.'
          }
          actionLabel={categories.length === 0 ? 'Crear categoría' : 'Limpiar búsqueda'}
          onAction={categories.length === 0 ? () => setEditing('new') : () => setSearch('')}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((category) => {
            const items = products.filter((product) => product.categoriaId === category.id)
            const units = items.reduce(
              (total, product) => total + Number(product.stock || 0),
              0,
            )

            return (
              <article key={category.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>
                    <Icon name="tag" size={20} />
                  </span>
                  <span
                    className={`${ui.badge} ${
                      category.activa ? ui.badgeSuccess : ui.badgeMuted
                    }`}
                  >
                    <span className={ui.badgeDot} />
                    {category.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <h3 className={styles.name}>{category.nombre}</h3>
                <p className={styles.description}>
                  {category.descripcion || 'Sin descripción registrada.'}
                </p>

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{formatNumber(items.length)}</span>
                    <span className={styles.statLabel}>Productos</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{formatNumber(units)}</span>
                    <span className={styles.statLabel}>Unidades</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
                    onClick={() => setEditing(category)}
                  >
                    <Icon name="edit" size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`${ui.btn} ${ui.btnDanger} ${ui.btnSm}`}
                    onClick={() => setDeleting(category)}
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
        <CategoryForm
          category={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre ?? ''}"? Si tiene productos asociados, la operación será rechazada.`}
        confirmLabel="Eliminar categoría"
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
