import styles from './Loader.module.css'

export default function Loader({ label = 'Cargando información…' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <p className={styles.label}>{label}</p>
    </div>
  )
}
