import Icon from '../Icon/Icon'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { id: 'panel', label: 'Panel', icon: 'panel' },
  { id: 'productos', label: 'Productos', icon: 'box', countKey: 'productos' },
  { id: 'categorias', label: 'Categorías', icon: 'tag', countKey: 'categorias' },
  { id: 'proveedores', label: 'Proveedores', icon: 'truck', countKey: 'proveedores' },
  { id: 'usuarios', label: 'Usuarios', icon: 'users', countKey: 'usuarios' },
]

export default function Sidebar({
  activeView,
  onNavigate,
  counts,
  mobileOpen,
  onClose,
}) {
  return (
    <>
      <button
        type="button"
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-label="Cerrar menú de navegación"
        tabIndex={mobileOpen ? 0 : -1}
      />
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Icon name="box" size={22} />
          </span>
          <div className={styles.brandText}>
            <strong>Inventario</strong>
            <span>ORM</span>
          </div>
          <button
            type="button"
            className={styles.closeMobile}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <p className={styles.sectionLabel}>General</p>

        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const count = item.countKey ? counts[item.countKey] : null
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} size={19} />
                <span className={styles.navLabel}>{item.label}</span>
                {typeof count === 'number' ? (
                  <span className={styles.count}>{count}</span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <div className={styles.spacer} />

        <div className={styles.status}>
          <span className={styles.statusIcon}>
            <Icon name="sparkles" size={16} />
          </span>
          <div>
            <p className={styles.statusTitle}>API conectada</p>
            <p className={styles.statusText}>Express · MySQL · /api</p>
          </div>
        </div>
      </aside>
    </>
  )
}
