import Icon from '../Icon/Icon'
import styles from './Topbar.module.css'

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const todayLabel = dateFormatter.format(new Date())

export default function Topbar({ title, subtitle, refreshing, onRefresh, onOpenMenu }) {
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
      </div>
    </header>
  )
}
