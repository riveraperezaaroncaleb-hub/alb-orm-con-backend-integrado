import Icon from '../Icon/Icon'
import styles from './ErrorState.module.css'

export default function ErrorState({
  message = 'Ocurrió un error inesperado.',
  onRetry,
}) {
  return (
    <div className={styles.wrap} role="alert">
      <span className={styles.icon}>
        <Icon name="alert" size={26} />
      </span>
      <h2 className={styles.title}>No pudimos cargar el inventario</h2>
      <p className={styles.message}>{message}</p>
      {onRetry ? (
        <button type="button" className={styles.retry} onClick={onRetry}>
          <Icon name="refresh" size={16} />
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
