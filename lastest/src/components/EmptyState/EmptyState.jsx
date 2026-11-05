import Icon from '../Icon/Icon'
import styles from './EmptyState.module.css'

export default function EmptyState({
  icon = 'box',
  title = 'No hay información',
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>
        <Icon name={icon} size={24} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {message ? <p className={styles.message}>{message}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className={styles.action} onClick={onAction}>
          <Icon name="plus" size={16} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
