import { useMemo } from 'react'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import StatCard from '../StatCard/StatCard'
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getStockState,
} from '../../utils/format'
import ui from '../../styles/ui.module.css'
import styles from './Dashboard.module.css'

const TONE_CLASS = {
  success: ui.badgeSuccess,
  warn: ui.badgeWarn,
  danger: ui.badgeDanger,
  muted: ui.badgeMuted,
}

export default function Dashboard({
  products,
  categories,
  providers,
  branches,
  warehouses,
  users,
  isLoading,
  onNavigate,
}) {
  const summary = useMemo(() => {
    const activeProducts = products.filter((product) => product.activo)
    const totalUnits = products.reduce((total, product) => total + Number(product.stock || 0), 0)
    const inventoryValue = products.reduce(
      (total, product) => total + Number(product.costo || 0) * Number(product.stock || 0),
      0,
    )
    const retailValue = products.reduce(
      (total, product) => total + Number(product.precio || 0) * Number(product.stock || 0),
      0,
    )
    const lowStock = products
      .filter(
        (product) =>
          product.activo && Number(product.stock || 0) <= Number(product.stockMinimo || 0),
      )
      .sort((a, b) => Number(a.stock) - Number(b.stock))
    const outOfStock = products.filter((product) => Number(product.stock || 0) <= 0).length
    const activeCategories = categories.filter((category) => category.activa).length
    const activeProviders = providers.filter((provider) => provider.activo).length
    const activeBranches = branches.filter((branch) => branch.activo).length
    const activeWarehouses = warehouses.filter((warehouse) => warehouse.activo).length

    return {
      activeProducts,
      totalUnits,
      inventoryValue,
      retailValue,
      lowStock,
      outOfStock,
      activeCategories,
      activeProviders,
      activeBranches,
      activeWarehouses,
    }
  }, [products, categories, providers, branches, warehouses])

  const categorySummary = useMemo(() => {
    const rows = categories.map((category) => {
      const items = products.filter((product) => product.categoriaId === category.id)
      const units = items.reduce((total, product) => total + Number(product.stock || 0), 0)
      return {
        id: category.id,
        name: category.nombre,
        products: items.length,
        units,
      }
    })

    const maxUnits = Math.max(...rows.map((row) => row.units), 1)

    return rows
      .sort((a, b) => b.units - a.units)
      .slice(0, 6)
      .map((row) => ({ ...row, percent: Math.round((row.units / maxUnits) * 100) }))
  }, [categories, products])

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [products],
  )

  if (isLoading) {
    return <Loader label="Preparando el panel de control…" />
  }

  return (
    <div className={ui.page}>
      <div className={styles.welcome}>
        <div className={styles.welcomeCopy}>
          <span className={styles.eyebrow}>
            <Icon name="sparkles" size={15} />
            Resumen del inventario
          </span>
          <h2 className={styles.welcomeTitle}>Todo tu almacén en una sola vista</h2>
          <p className={styles.welcomeText}>
            Controla existencias por sucursal, detecta faltantes y mantén actualizado el
            catálogo de productos, categorías y proveedores.
          </p>
          <div className={styles.welcomeActions}>
            <button
              type="button"
              className={`${ui.btn} ${ui.btnPrimary}`}
              onClick={() => onNavigate('productos')}
            >
              <Icon name="box" size={16} />
              Gestionar productos
            </button>
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost}`}
              onClick={() => onNavigate('proveedores')}
            >
              <Icon name="truck" size={16} />
              Ver proveedores
            </button>
          </div>
        </div>
        <div className={styles.welcomeArt} aria-hidden="true">
          <span className={styles.orbit} />
          <span className={styles.orbitSmall} />
          <span className={styles.artIcon}>
            <Icon name="layers" size={34} />
          </span>
        </div>
      </div>

      <section className={styles.stats} aria-label="Indicadores del inventario">
        <StatCard
          label="Productos"
          value={formatNumber(products.length)}
          helper={`${formatNumber(summary.activeProducts.length)} activos`}
          icon="box"
          tone="mint"
        />
        <StatCard
          label="Unidades en stock"
          value={formatNumber(summary.totalUnits)}
          helper={`${formatNumber(summary.outOfStock)} productos sin stock`}
          icon="layers"
          tone="sky"
        />
        <StatCard
          label="Valor de inventario"
          value={formatCurrency(summary.inventoryValue)}
          helper={`Venta potencial: ${formatCurrency(summary.retailValue)}`}
          icon="money"
          tone="violet"
        />
        <StatCard
          label="Stock bajo"
          value={formatNumber(summary.lowStock.length)}
          helper="Requieren reposición"
          icon="alert"
          tone="amber"
        />
        <StatCard
          label="Categorías"
          value={formatNumber(categories.length)}
          helper={`${formatNumber(summary.activeCategories)} activas`}
          icon="tag"
          tone="mint"
        />
        <StatCard
          label="Proveedores"
          value={formatNumber(providers.length)}
          helper={`${formatNumber(summary.activeProviders)} activos · ${formatNumber(users.length)} usuarios`}
          icon="truck"
          tone="rose"
        />
        <StatCard
          label="Sucursales"
          value={formatNumber(branches.length)}
          helper={`${formatNumber(summary.activeBranches)} activas`}
          icon="store"
          tone="sky"
        />
        <StatCard
          label="Almacenes"
          value={formatNumber(warehouses.length)}
          helper={`${formatNumber(summary.activeWarehouses)} activos`}
          icon="warehouse"
          tone="mint"
        />
      </section>

      <div className={styles.mainGrid}>
        <section className={ui.panel}>
          <div className={ui.panelHead}>
            <div>
              <h3 className={ui.panelTitle}>Alertas de stock</h3>
              <p className={styles.panelNote}>
                Productos en el mínimo o por debajo de él.
              </p>
            </div>
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={() => onNavigate('productos')}
            >
              Ver todos
              <Icon name="arrowUp" size={14} className={styles.rotate} />
            </button>
          </div>

          {summary.lowStock.length === 0 ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}>
                <Icon name="check" size={18} />
              </span>
              <div>
                <p className={styles.successTitle}>Todo en orden</p>
                <p className={styles.successText}>
                  Ningún producto está por debajo de su stock mínimo.
                </p>
              </div>
            </div>
          ) : (
            <div className={ui.tableWrap}>
              <table className={ui.table}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.lowStock.slice(0, 6).map((product) => {
                    const stockState = getStockState(product.stock, product.stockMinimo)

                    return (
                      <tr key={product.id}>
                        <td data-label="Producto" data-primary="true">
                          <div className={ui.cellPrimary}>
                            <span className={ui.cellIcon}>
                              <Icon name="box" size={16} />
                            </span>
                            <span>
                              <span className={ui.cellName}>{product.nombre}</span>
                              <span className={ui.cellSub}>{product.sku}</span>
                            </span>
                          </div>
                        </td>
                        <td data-label="Stock">{formatNumber(product.stock)}</td>
                        <td data-label="Mínimo">{formatNumber(product.stockMinimo)}</td>
                        <td data-label="Estado">
                          <span
                            className={`${ui.badge} ${TONE_CLASS[stockState.tone] ?? ui.badgeMuted}`}
                          >
                            <span className={ui.badgeDot} />
                            {stockState.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={ui.panel}>
          <div className={ui.panelHead}>
            <div>
              <h3 className={ui.panelTitle}>Distribución por categoría</h3>
              <p className={styles.panelNote}>Unidades disponibles por categoría.</p>
            </div>
          </div>

          {categorySummary.length === 0 ? (
            <p className={styles.placeholder}>Todavía no hay categorías registradas.</p>
          ) : (
            <ul className={styles.categoryList}>
              {categorySummary.map((category) => (
                <li key={category.id} className={styles.categoryRow}>
                  <div className={styles.categoryHead}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryMeta}>
                      {formatNumber(category.products)} prod. · {formatNumber(category.units)} u.
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{ width: `${Math.max(category.percent, 4)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={ui.panel}>
        <div className={ui.panelHead}>
          <div>
            <h3 className={ui.panelTitle}>Últimos productos agregados</h3>
            <p className={styles.panelNote}>Los movimientos más recientes del catálogo.</p>
          </div>
        </div>

        {recentProducts.length === 0 ? (
          <p className={styles.placeholder}>Aún no hay productos en el inventario.</p>
        ) : (
          <ul className={styles.recentList}>
            {recentProducts.map((product) => (
              <li key={product.id} className={styles.recentItem}>
                <span className={styles.recentIcon}>
                  <Icon name="box" size={18} />
                </span>
                <div className={styles.recentInfo}>
                  <p className={styles.recentName}>{product.nombre}</p>
                  <p className={styles.recentMeta}>
                    {product.sku} · {product.categoria?.nombre ?? 'Sin categoría'} ·{' '}
                    {product.sucursal?.nombre ?? 'Sin sucursal'} ·{' '}
                    {product.almacen?.nombre ?? 'Sin almacén'}
                  </p>
                </div>
                <div className={styles.recentSide}>
                  <span className={styles.recentPrice}>{formatCurrency(product.precio)}</span>
                  <span className={styles.recentDate}>{formatDate(product.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
