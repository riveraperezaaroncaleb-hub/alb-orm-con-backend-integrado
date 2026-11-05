import Icon from '../Icon/Icon'
import { getInitials } from '../../utils/format'
import styles from './Topbar.module.css'

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const todayLabel = dateFormatter.format(new Date())

export default function Topbar({
  title,
  subtitle,
  refreshing,
  onRefresh,
  onOpenMenu,
  user,
  onLogout,
}) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
        >
          <Icon name="menu" size={20} />
        </button>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.date}>
          <Icon name="calendar" size={15} />
          {todayLabel}
        </span>
        <button
          type="button"
          className={styles.refresh}
          onClick={onRefresh}
          disabled={refreshing}
        >
          <Icon
            name="refresh"
            size={16}
            className={refreshing ? styles.spinning : undefined}
          />
          <span>{refreshing ? 'Actualizando…' : 'Actualizar'}</span>
        </button>

        <div className={styles.account}>
          <span className={styles.avatar}>{getInitials(user?.nombre)}</span>
          <div className={styles.accountInfo}>
            <span className={styles.accountName}>{user?.nombre ?? 'Usuario'}</span>
            <span className={styles.accountEmail}>{user?.correo ?? ''}</span>
            <span className={styles.accountBranch}>
              {user?.sucursal?.nombre ?? 'Sin sucursal'}
            </span>
          </div>
          <button
            type="button"
            className={styles.logout}
            onClick={onLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <Icon name="logout" size={16} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
